using EventManagementService.Data;
using EventManagementService.Models;
using EventManagementService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventManagementService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly EventDbContext _context;
    private readonly LoggingClient _loggingClient;

    public BookingsController(EventDbContext context, LoggingClient loggingClient)
    {
        _context = context;
        _loggingClient = loggingClient;
    }

    [HttpPost]
    [Authorize(Policy = "OwnerOrAdmin")]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
    {
        if (!ModelState.IsValid)
        {
            // OWASP A03/A05 FIXED: centralized DTO validation blocks malformed booking input.
            return ValidationProblem(ModelState);
        }

        var currentEmail = User.FindFirstValue(ClaimTypes.Email)?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(currentEmail))
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        // A05 FIXED: Validate booking payload server-side.
        if (request.EventId <= 0 ||
            string.IsNullOrWhiteSpace(request.EventTitle) ||
            string.IsNullOrWhiteSpace(request.BuyerEmail) ||
            request.Quantity <= 0 ||
            request.TotalAmount < 0 ||
            request.TransactionId <= 0)
        {
            return BadRequest(new { message = "Invalid booking data." });
        }

        if (!string.Equals(request.BuyerEmail.Trim(), currentEmail, StringComparison.OrdinalIgnoreCase))
        {
            // OWASP A01 FIXED: Prevent creating bookings on behalf of another account.
            return Forbid();
        }

        var eventItem = await _context.Events.FirstOrDefaultAsync(x => x.Id == request.EventId && !x.IsDeleted);
        if (eventItem == null)
        {
            return NotFound(new { message = "Event not found." });
        }

        if (!string.Equals(eventItem.Status, "active", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "This event is not available for booking." });
        }

        var soldCount = await _context.BookingRecords
            .Where(x => !x.IsDeleted && x.EventId == request.EventId && x.Status == "Confirmed")
            .SumAsync(x => (int?)x.Quantity) ?? 0;

        if (soldCount + request.Quantity > eventItem.Capacity)
        {
            return BadRequest(new { message = "Ticket quantity exceeds remaining capacity." });
        }

        var booking = new BookingRecord
        {
            EventId = request.EventId,
            EventTitle = request.EventTitle.Trim(),
            Quantity = request.Quantity,
            TotalAmount = request.TotalAmount,
            BuyerEmail = request.BuyerEmail.Trim().ToLowerInvariant(),
            TransactionId = request.TransactionId,
            Status = "Confirmed",
            IsDeleted = false,
            DeletedAt = null,
            BookedAt = DateTime.UtcNow
        };

        // A03 FIXED: EF Core tracked insert, no string SQL.
        _context.BookingRecords.Add(booking);
        await _context.SaveChangesAsync();

        await _loggingClient.LogAsync("booking-created", $"Booking {booking.Id} created for {booking.BuyerEmail}");

        return Ok(new
        {
            message = "Booking created",
            bookingId = booking.Id,
            status = booking.Status
        });
    }

    [HttpGet]
    [Authorize(Policy = "OwnerOrAdmin")]
    public async Task<IActionResult> List([FromQuery] string? email = null, [FromQuery] string? eventTitle = null, [FromQuery] int? eventId = null)
    {
        var currentEmail = User.FindFirstValue(ClaimTypes.Email)?.Trim().ToLowerInvariant();
        var currentUserIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _ = int.TryParse(currentUserIdRaw, out var currentUserId);

        if (string.IsNullOrWhiteSpace(currentEmail))
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        IQueryable<BookingRecord> query = _context.BookingRecords.Where(x => !x.IsDeleted);

        var isAdmin = string.Equals(User.FindFirstValue(ClaimTypes.Role), "Admin", StringComparison.OrdinalIgnoreCase);

        if (!string.IsNullOrWhiteSpace(email) && (isAdmin || string.Equals(email.Trim(), currentEmail, StringComparison.OrdinalIgnoreCase)))
        {
            var cleanEmail = email.Trim().ToLowerInvariant();
            query = query.Where(x => x.BuyerEmail == cleanEmail);
        }
        else if (!eventId.HasValue && !isAdmin)
        {
            // OWASP A01 FIXED: Default to current user bookings only.
            query = query.Where(x => x.BuyerEmail == currentEmail);
        }

        if (!string.IsNullOrWhiteSpace(eventTitle))
        {
            var cleanTitle = eventTitle.Trim();
            query = query.Where(x => x.EventTitle == cleanTitle);
        }

        if (eventId.HasValue && eventId.Value > 0)
        {
            var eventItem = await _context.Events.FindAsync(eventId.Value);
            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found" });
            }

            if (eventItem.CreatedByUserId != currentUserId && !isAdmin)
            {
                // OWASP A01 FIXED: Only event owner can read all event guests.
                return Forbid();
            }

            query = query.Where(x => x.EventId == eventId.Value);
        }

        var bookings = await query.OrderByDescending(x => x.BookedAt).ToListAsync();
        return Ok(bookings);
    }

    [HttpPost("{id:int}/cancel")]
    [Authorize(Policy = "OwnerOrAdmin")]
    public async Task<IActionResult> Cancel(int id)
    {
        var currentEmail = User.FindFirstValue(ClaimTypes.Email)?.Trim().ToLowerInvariant();
        var currentUserIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _ = int.TryParse(currentUserIdRaw, out var currentUserId);

        if (string.IsNullOrWhiteSpace(currentEmail))
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var isAdmin = string.Equals(User.FindFirstValue(ClaimTypes.Role), "Admin", StringComparison.OrdinalIgnoreCase);

        var booking = await _context.BookingRecords.FindAsync(id);
        if (booking == null || booking.IsDeleted)
        {
            return NotFound();
        }

        var eventItem = await _context.Events.FindAsync(booking.EventId);
        var isOwner = eventItem?.CreatedByUserId == currentUserId;
        var isBuyer = string.Equals(booking.BuyerEmail, currentEmail, StringComparison.OrdinalIgnoreCase);

        if (!isOwner && !isBuyer && !isAdmin)
        {
            // OWASP A01 FIXED: Only ticket buyer or event owner can cancel ticket.
            return Forbid();
        }

        booking.Status = "Cancelled";
        await _context.SaveChangesAsync();
        await _loggingClient.LogAsync("booking-cancelled", $"Booking {id} cancelled");

        return Ok(new { message = "Booking cancelled" });
    }

    [HttpGet("admin/all")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> AdminAllBookings()
    {
        var bookings = await _context.BookingRecords
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.BookedAt)
            .ToListAsync();

        return Ok(bookings);
    }
}

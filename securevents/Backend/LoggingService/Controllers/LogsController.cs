using LoggingService.Data;
using LoggingService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace LoggingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly LoggingDbContext _context;

    public LogsController(LoggingDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Write([FromBody] LogRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var previousHash = await _context.AuditLogs
            .OrderByDescending(x => x.Id)
            .Select(x => x.EntryHash)
            .FirstOrDefaultAsync() ?? string.Empty;

        var createdAt = request.CreatedAt ?? DateTime.UtcNow;

        // A09 FIXED: Centralized, persistent audit logging.
        // OWASP A09 FIXED: Hash-chain integrity allows tamper evidence across log entries.
        var item = new AuditLog
        {
            Service = request.Service,
            Action = request.Action,
            Details = request.Details,
            PreviousHash = previousHash,
            EntryHash = BuildHash(previousHash, request.Service, request.Action, request.Details, createdAt),
            IsDeleted = false,
            DeletedAt = null,
            CreatedAt = createdAt
        };

        _context.AuditLogs.Add(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Logged" });
    }

    private static string BuildHash(string previousHash, string service, string action, string details, DateTime createdAt)
    {
        var payload = $"{previousHash}|{service}|{action}|{details}|{createdAt:O}";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(bytes);
    }

    [HttpGet]
    public async Task<IActionResult> Read([FromQuery] int take = 100)
    {
        var logs = await _context.AuditLogs
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .Take(Math.Clamp(take, 1, 500))
            .ToListAsync();

        return Ok(logs);
    }
}

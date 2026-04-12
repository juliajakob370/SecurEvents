using System.ComponentModel.DataAnnotations;

namespace EventManagementService.Models;

public record CreateBookingRequest(
    [Range(1, int.MaxValue)] int EventId,
    [Required, MaxLength(100)] string EventTitle,
    [Range(1, 10000)] int Quantity,
    [Range(typeof(decimal), "0", "1000000")] decimal TotalAmount,
    [Required, EmailAddress, MaxLength(100)] string BuyerEmail,
    [Range(1, int.MaxValue)] int TransactionId);

public record VerifyEventCancelCodeRequest([Required, RegularExpression("^\\d{6}$")] string Code);

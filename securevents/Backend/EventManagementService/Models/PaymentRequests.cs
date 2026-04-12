using System.ComponentModel.DataAnnotations;

namespace EventManagementService.Models;

public record CheckoutRequest(
    [Range(1, int.MaxValue)] int EventId,
    [Required, MaxLength(100)] string EventTitle,
    [Range(1, 10000)] int Quantity,
    [Range(typeof(decimal), "0", "1000000")] decimal TotalAmount,
    [Required, EmailAddress, MaxLength(100)] string BuyerEmail,
    [Required, RegularExpression("^\\d{4}$")] string CardLast4);

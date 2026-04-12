namespace EventManagementService.Models;

public class BookingRecord
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }
    public string BuyerEmail { get; set; } = string.Empty;
    public int TransactionId { get; set; }
    public string Status { get; set; } = "Confirmed";
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime BookedAt { get; set; } = DateTime.UtcNow;
}

namespace EventManagementService.Models;

public class PaymentTransaction
{
    public int Id { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }
    public string BuyerEmail { get; set; } = string.Empty;
    public string CardLast4 { get; set; } = string.Empty;
    public string Status { get; set; } = "Paid";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

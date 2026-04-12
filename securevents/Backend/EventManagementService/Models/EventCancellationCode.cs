namespace EventManagementService.Models;

public class EventCancellationCode
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string OwnerEmail { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
}

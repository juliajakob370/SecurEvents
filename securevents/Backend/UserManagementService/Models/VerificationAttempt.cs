namespace UserManagementService.Models;

public class VerificationAttempt
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int FailedAttempts { get; set; }
    public DateTime? LockedUntil { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

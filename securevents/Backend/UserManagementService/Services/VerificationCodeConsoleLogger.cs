namespace UserManagementService.Services;

public class VerificationCodeConsoleLogger
{
    public void Log(string flow, string email, string code)
    {
        Console.WriteLine($"[VerificationCode][{DateTime.UtcNow:O}] Flow={flow}, Email={email}, Code={code}");
    }
}

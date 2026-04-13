namespace UserManagementService.Services;

public class VerificationCodeConsoleLogger
{
    public void Log(string flow, string email, string code)
    {
        var previousColor = Console.ForegroundColor;
        var previousBg = Console.BackgroundColor;

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine();
        Console.WriteLine("╔══════════════════════════════════════════════════════╗");
        Console.WriteLine("║              📧  VERIFICATION CODE  📧              ║");
        Console.WriteLine("╠══════════════════════════════════════════════════════╣");
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine($"║  Flow:  {flow,-44} ║");
        Console.WriteLine($"║  Email: {email,-44} ║");
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"║  Code:  {code,-44} ║");
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("╚══════════════════════════════════════════════════════╝");
        Console.WriteLine();

        Console.ForegroundColor = previousColor;
        Console.BackgroundColor = previousBg;
    }
}

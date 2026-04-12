using System.Diagnostics;
using System.Security.Claims;

namespace UserManagementService.Middleware;

public class SecurityRequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<SecurityRequestLoggingMiddleware> _logger;

    public SecurityRequestLoggingMiddleware(RequestDelegate next, ILogger<SecurityRequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // OWASP A09 (Security Logging and Monitoring Failures) mitigation:
        // Every request is logged with actor, endpoint, status, correlation id, and duration.
        // This makes incident investigation, abuse tracing, and anomaly detection possible.
        var stopwatch = Stopwatch.StartNew();

        await _next(context);

        stopwatch.Stop();

        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous";

        // A09 FIXED: Structured request logging for audit trail and monitoring.
        _logger.LogInformation(
            "SECURITY_AUDIT service=user-management method={Method} path={Path} status={StatusCode} userId={UserId} ip={Ip} userAgent={UserAgent} traceId={TraceId} durationMs={Duration}",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            userId,
            context.Connection.RemoteIpAddress?.ToString(),
            context.Request.Headers.UserAgent.ToString(),
            context.TraceIdentifier,
            stopwatch.ElapsedMilliseconds);
    }
}

using System.Diagnostics;

namespace LoggingService.Middleware;

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
        // Logging service requests are also audited so ingestion failures and abuse attempts are traceable.
        var stopwatch = Stopwatch.StartNew();

        await _next(context);

        stopwatch.Stop();

        // A09 FIXED: Structured request logging for audit trail and monitoring.
        _logger.LogInformation(
            "SECURITY_AUDIT service=logging method={Method} path={Path} status={StatusCode} ip={Ip} userAgent={UserAgent} traceId={TraceId} durationMs={Duration}",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            context.Connection.RemoteIpAddress?.ToString(),
            context.Request.Headers.UserAgent.ToString(),
            context.TraceIdentifier,
            stopwatch.ElapsedMilliseconds);
    }
}

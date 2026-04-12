using System.Text.Json;

namespace UserManagementService.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHostEnvironment _environment;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, IHostEnvironment environment, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _environment = environment;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // OWASP A09 mitigation:
            // Unhandled exceptions are logged with trace data and request context,
            // while API consumers receive a sanitized message to reduce information leakage (A05).
            // A09 FIXED: Exception details are logged with request trace context.
            _logger.LogError(ex, "UNHANDLED_EXCEPTION service=user-management path={Path} method={Method} traceId={TraceId}",
                context.Request.Path,
                context.Request.Method,
                context.TraceIdentifier);

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var payload = new
            {
                message = "An unexpected error occurred.",
                detail = _environment.IsDevelopment() ? ex.Message : null
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
        }
    }
}

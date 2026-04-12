using System.Net.Http.Json;
using System.Net;
using System.Net.Sockets;

namespace EventManagementService.Services;

public class LoggingClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _environment;

    public LoggingClient(HttpClient httpClient, IConfiguration configuration, IHostEnvironment environment)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _environment = environment;
    }

    public async Task LogAsync(string action, string details)
    {
        var loggingUrl = _configuration["Services:LoggingServiceUrl"];
        if (!TryBuildSafeLoggingUri(loggingUrl, out var safeUri))
        {
            return;
        }

        try
        {
            await _httpClient.PostAsJsonAsync(new Uri(safeUri, "/api/logs"), new
            {
                service = "event-management",
                action,
                details,
                createdAt = DateTime.UtcNow
            });
        }
        catch
        {
            // A09 FIXED: Logging transport issues do not break event operations.
        }
    }

    private bool TryBuildSafeLoggingUri(string? loggingUrl, out Uri safeUri)
    {
        safeUri = null!;

        // OWASP A10 FIXED: Enforce outbound URL validation + host allowlist to reduce SSRF risk.
        if (string.IsNullOrWhiteSpace(loggingUrl) || !Uri.TryCreate(loggingUrl, UriKind.Absolute, out var parsed))
        {
            return false;
        }

        var allowHttp = _environment.IsDevelopment();
        if ((parsed.Scheme != Uri.UriSchemeHttps && !(allowHttp && parsed.Scheme == Uri.UriSchemeHttp)) ||
            !string.IsNullOrEmpty(parsed.UserInfo))
        {
            return false;
        }

        var allowedHosts = _configuration.GetSection("Security:AllowedOutboundHosts").Get<string[]>() ?? Array.Empty<string>();
        var isAllowlisted = allowedHosts.Any(h => string.Equals(h.Trim(), parsed.Host, StringComparison.OrdinalIgnoreCase));
        if (!isAllowlisted)
        {
            return false;
        }

        if (IPAddress.TryParse(parsed.Host, out var ip) && IsPrivateOrUnsafeAddress(ip) && !isAllowlisted)
        {
            return false;
        }

        safeUri = parsed;
        return true;
    }

    private static bool IsPrivateOrUnsafeAddress(IPAddress ip)
    {
        if (IPAddress.IsLoopback(ip))
        {
            return true;
        }

        if (ip.AddressFamily == AddressFamily.InterNetwork)
        {
            var b = ip.GetAddressBytes();
            return b[0] == 10 ||
                   (b[0] == 172 && b[1] >= 16 && b[1] <= 31) ||
                   (b[0] == 192 && b[1] == 168) ||
                   (b[0] == 169 && b[1] == 254);
        }

        if (ip.AddressFamily == AddressFamily.InterNetworkV6)
        {
            return ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6Multicast;
        }

        return true;
    }
}

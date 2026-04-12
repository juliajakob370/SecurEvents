using System.ComponentModel.DataAnnotations;

namespace LoggingService.Models;

public record LogRequest(
    [Required, MaxLength(60)] string Service,
    [Required, MaxLength(80)] string Action,
    [Required, MaxLength(4000)] string Details,
    DateTime? CreatedAt);

using LoggingService.Data;
using LoggingService.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<LoggingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SecureEventConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        // OWASP A05 FIXED: restrict service CORS to trusted gateway/frontend origins.
        policy.WithOrigins("http://localhost:3000", "http://localhost:5000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// A09 FIXED: Centralized exception handling for consistent error responses.
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<SecurityRequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LoggingDbContext>();
    DbInitializer.Initialize(db, "LoggingService");
}

app.UseCors("Frontend");
app.UseMiddleware<GatewayOnlyMiddleware>();
app.UseAuthorization();
app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "logging" }));
app.MapControllers();
app.Run();

using EventManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace EventManagementService.Data;

public class EventDbContext : DbContext
{
    public EventDbContext(DbContextOptions<EventDbContext> options) : base(options)
    {
    }

    public DbSet<EventItem> Events => Set<EventItem>();
    public DbSet<PaymentTransaction> PaymentTransactions => Set<PaymentTransaction>();
    public DbSet<BookingRecord> BookingRecords => Set<BookingRecord>();
    public DbSet<EventCancellationCode> EventCancellationCodes => Set<EventCancellationCode>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PaymentTransaction>()
            .Property(x => x.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<BookingRecord>()
            .Property(x => x.TotalAmount)
            .HasPrecision(18, 2);

        base.OnModelCreating(modelBuilder);
    }
}

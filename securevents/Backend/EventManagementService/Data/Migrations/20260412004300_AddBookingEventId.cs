using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventManagementService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingEventId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "BookingRecords",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventId",
                table: "BookingRecords");
        }
    }
}

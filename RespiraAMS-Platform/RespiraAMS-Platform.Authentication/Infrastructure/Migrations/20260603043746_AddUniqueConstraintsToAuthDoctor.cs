using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraintsToAuthDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AuthDoctors_Email",
                table: "AuthDoctors",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuthDoctors_PhoneNumber",
                table: "AuthDoctors",
                column: "PhoneNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AuthDoctors_Email",
                table: "AuthDoctors");

            migrationBuilder.DropIndex(
                name: "IX_AuthDoctors_PhoneNumber",
                table: "AuthDoctors");
        }
    }
}

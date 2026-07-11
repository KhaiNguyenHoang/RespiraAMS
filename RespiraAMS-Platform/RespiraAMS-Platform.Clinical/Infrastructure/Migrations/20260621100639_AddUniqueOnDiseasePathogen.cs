using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueOnDiseasePathogen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_disease_pathogens_DiseaseId",
                table: "disease_pathogens");

            migrationBuilder.CreateIndex(
                name: "IX_disease_pathogens_DiseaseId_PathogenId",
                table: "disease_pathogens",
                columns: new[] { "DiseaseId", "PathogenId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_disease_pathogens_DiseaseId_PathogenId",
                table: "disease_pathogens");

            migrationBuilder.CreateIndex(
                name: "IX_disease_pathogens_DiseaseId",
                table: "disease_pathogens",
                column: "DiseaseId");
        }
    }
}

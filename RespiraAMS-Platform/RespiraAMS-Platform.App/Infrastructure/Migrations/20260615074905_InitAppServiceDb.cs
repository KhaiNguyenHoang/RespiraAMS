using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitAppServiceDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "antibiotic_spectra",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_antibiotic_spectra", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "criteria",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false),
                    Min = table.Column<double>(type: "double precision", nullable: true),
                    Max = table.Column<double>(type: "double precision", nullable: true),
                    Unit = table.Column<string>(type: "text", nullable: true),
                    IsExclusive = table.Column<bool>(type: "boolean", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_criteria", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "diseases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    RequiredIcuMainCriteria = table.Column<int>(type: "integer", nullable: false),
                    RequiredIcuSecondaryCriteria = table.Column<int>(type: "integer", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diseases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "pathogens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pathogens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "antibiotics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    AntibioticSpectrumId = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Dosages = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_antibiotics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_antibiotics_antibiotic_spectra_AntibioticSpectrumId",
                        column: x => x.AntibioticSpectrumId,
                        principalTable: "antibiotic_spectra",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "icu_hospitalize_criteria",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DiseaseId = table.Column<Guid>(type: "uuid", nullable: false),
                    CriterionId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsMainCriteria = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_icu_hospitalize_criteria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_icu_hospitalize_criteria_criteria_CriterionId",
                        column: x => x.CriterionId,
                        principalTable: "criteria",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_icu_hospitalize_criteria_diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "diseases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "disease_pathogens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DiseaseId = table.Column<Guid>(type: "uuid", nullable: false),
                    PathogenId = table.Column<Guid>(type: "uuid", nullable: false),
                    Severity = table.Column<string>(type: "text", nullable: false),
                    TreatmentSite = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_disease_pathogens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_disease_pathogens_diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "diseases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_disease_pathogens_pathogens_PathogenId",
                        column: x => x.PathogenId,
                        principalTable: "pathogens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "resistance_risk_factors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DiseaseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CriterionId = table.Column<Guid>(type: "uuid", nullable: false),
                    PathogenId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resistance_risk_factors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_resistance_risk_factors_criteria_CriterionId",
                        column: x => x.CriterionId,
                        principalTable: "criteria",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resistance_risk_factors_diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "diseases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_resistance_risk_factors_pathogens_PathogenId",
                        column: x => x.PathogenId,
                        principalTable: "pathogens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "treatment_protocols",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Issuer = table.Column<string>(type: "text", nullable: false),
                    IssueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    DiseaseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Severity = table.Column<string>(type: "text", nullable: false),
                    TreatmentSite = table.Column<string>(type: "text", nullable: false),
                    SpecialInfectionId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_treatment_protocols", x => x.Id);
                    table.ForeignKey(
                        name: "FK_treatment_protocols_diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "diseases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_treatment_protocols_pathogens_SpecialInfectionId",
                        column: x => x.SpecialInfectionId,
                        principalTable: "pathogens",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AntibioticTreatmentProtocol",
                columns: table => new
                {
                    MedicinesId = table.Column<Guid>(type: "uuid", nullable: false),
                    TreatmentProtocolId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AntibioticTreatmentProtocol", x => new { x.MedicinesId, x.TreatmentProtocolId });
                    table.ForeignKey(
                        name: "FK_AntibioticTreatmentProtocol_antibiotics_MedicinesId",
                        column: x => x.MedicinesId,
                        principalTable: "antibiotics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AntibioticTreatmentProtocol_treatment_protocols_TreatmentPr~",
                        column: x => x.TreatmentProtocolId,
                        principalTable: "treatment_protocols",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CriterionTreatmentProtocol",
                columns: table => new
                {
                    OtherCriteriaId = table.Column<Guid>(type: "uuid", nullable: false),
                    TreatmentProtocolId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CriterionTreatmentProtocol", x => new { x.OtherCriteriaId, x.TreatmentProtocolId });
                    table.ForeignKey(
                        name: "FK_CriterionTreatmentProtocol_criteria_OtherCriteriaId",
                        column: x => x.OtherCriteriaId,
                        principalTable: "criteria",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CriterionTreatmentProtocol_treatment_protocols_TreatmentPro~",
                        column: x => x.TreatmentProtocolId,
                        principalTable: "treatment_protocols",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_antibiotics_AntibioticSpectrumId",
                table: "antibiotics",
                column: "AntibioticSpectrumId");

            migrationBuilder.CreateIndex(
                name: "IX_AntibioticTreatmentProtocol_TreatmentProtocolId",
                table: "AntibioticTreatmentProtocol",
                column: "TreatmentProtocolId");

            migrationBuilder.CreateIndex(
                name: "IX_CriterionTreatmentProtocol_TreatmentProtocolId",
                table: "CriterionTreatmentProtocol",
                column: "TreatmentProtocolId");

            migrationBuilder.CreateIndex(
                name: "IX_disease_pathogens_DiseaseId",
                table: "disease_pathogens",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_disease_pathogens_PathogenId",
                table: "disease_pathogens",
                column: "PathogenId");

            migrationBuilder.CreateIndex(
                name: "IX_icu_hospitalize_criteria_CriterionId",
                table: "icu_hospitalize_criteria",
                column: "CriterionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_icu_hospitalize_criteria_DiseaseId",
                table: "icu_hospitalize_criteria",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_resistance_risk_factors_CriterionId",
                table: "resistance_risk_factors",
                column: "CriterionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_resistance_risk_factors_DiseaseId",
                table: "resistance_risk_factors",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_resistance_risk_factors_PathogenId",
                table: "resistance_risk_factors",
                column: "PathogenId");

            migrationBuilder.CreateIndex(
                name: "IX_treatment_protocols_DiseaseId",
                table: "treatment_protocols",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_treatment_protocols_SpecialInfectionId",
                table: "treatment_protocols",
                column: "SpecialInfectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AntibioticTreatmentProtocol");

            migrationBuilder.DropTable(
                name: "CriterionTreatmentProtocol");

            migrationBuilder.DropTable(
                name: "disease_pathogens");

            migrationBuilder.DropTable(
                name: "icu_hospitalize_criteria");

            migrationBuilder.DropTable(
                name: "resistance_risk_factors");

            migrationBuilder.DropTable(
                name: "antibiotics");

            migrationBuilder.DropTable(
                name: "treatment_protocols");

            migrationBuilder.DropTable(
                name: "criteria");

            migrationBuilder.DropTable(
                name: "antibiotic_spectra");

            migrationBuilder.DropTable(
                name: "diseases");

            migrationBuilder.DropTable(
                name: "pathogens");
        }
    }
}

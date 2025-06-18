using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaPadronElectoral.Migrations
{
    /// <inheritdoc />
    public partial class wwaaaaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PersonaVotante",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ci = table.Column<int>(type: "int", nullable: false),
                    NombreCompleto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FotoCarnetAnversoPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FotoCarnetReversoPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FotoVotantePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonaVotante", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonaVotante");
        }
    }
}

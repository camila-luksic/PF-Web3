using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaPadronElectoral.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldLastName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NombreCompleto",
                table: "PersonaVotante",
                newName: "Nombres");

            migrationBuilder.AddColumn<string>(
                name: "Apellidos",
                table: "PersonaVotante",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Apellidos",
                table: "PersonaVotante");

            migrationBuilder.RenameColumn(
                name: "Nombres",
                table: "PersonaVotante",
                newName: "NombreCompleto");
        }
    }
}

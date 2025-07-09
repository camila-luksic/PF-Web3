using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaPadronElectoral.Migrations
{
    /// <inheritdoc />
    public partial class IntegracionAdminElectoral : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "idRecinto",
                table: "PersonaVotante",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "idRecinto",
                table: "PersonaVotante");
        }
    }
}

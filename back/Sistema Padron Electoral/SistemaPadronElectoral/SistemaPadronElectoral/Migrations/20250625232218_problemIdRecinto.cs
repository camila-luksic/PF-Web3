using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaPadronElectoral.Migrations
{
    /// <inheritdoc />
    public partial class problemIdRecinto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "idRecinto",
                table: "PersonaVotante",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "idRecinto",
                table: "PersonaVotante",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}

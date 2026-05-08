using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarViaturasEVinculacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataVinculacaoViatura",
                table: "Casos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioVinculacaoViaturaId",
                table: "Casos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ViaturaId",
                table: "Casos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Viaturas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Placa = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Identificacao = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tipo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Observacoes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataCadastro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Viaturas", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Casos_UsuarioVinculacaoViaturaId",
                table: "Casos",
                column: "UsuarioVinculacaoViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Casos_ViaturaId",
                table: "Casos",
                column: "ViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Viaturas_Identificacao",
                table: "Viaturas",
                column: "Identificacao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Viaturas_Placa",
                table: "Viaturas",
                column: "Placa",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Casos_Usuarios_UsuarioVinculacaoViaturaId",
                table: "Casos",
                column: "UsuarioVinculacaoViaturaId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Casos_Viaturas_ViaturaId",
                table: "Casos",
                column: "ViaturaId",
                principalTable: "Viaturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casos_Usuarios_UsuarioVinculacaoViaturaId",
                table: "Casos");

            migrationBuilder.DropForeignKey(
                name: "FK_Casos_Viaturas_ViaturaId",
                table: "Casos");

            migrationBuilder.DropTable(
                name: "Viaturas");

            migrationBuilder.DropIndex(
                name: "IX_Casos_UsuarioVinculacaoViaturaId",
                table: "Casos");

            migrationBuilder.DropIndex(
                name: "IX_Casos_ViaturaId",
                table: "Casos");

            migrationBuilder.DropColumn(
                name: "DataVinculacaoViatura",
                table: "Casos");

            migrationBuilder.DropColumn(
                name: "UsuarioVinculacaoViaturaId",
                table: "Casos");

            migrationBuilder.DropColumn(
                name: "ViaturaId",
                table: "Casos");
        }
    }
}

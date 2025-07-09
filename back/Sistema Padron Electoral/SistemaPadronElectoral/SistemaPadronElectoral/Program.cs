using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using SistemaPadronElectoral.Data;
using System.IO;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

var secretKey = "clave-secreta-compartida-entre-django-y-dotnet";


var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddDbContext<SistemaPadronElectoralContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SistemaPadronElectoralContext") ?? throw new InvalidOperationException("Connection string 'SistemaPadronElectoralContext' not found.")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false, // Django no emite un issuer por defecto
            ValidateAudience = false, // Igual con el audience
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            //RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/roles"
            //RoleClaimType = "roles"

        };
      

    });
builder.Services.AddAuthorization();


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:5173") 
                                 .AllowAnyHeader()      
                                 .AllowAnyMethod() 
                                 .AllowCredentials();
                      });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.MapControllers();

app.Run();

app.MapGet("/PersonaVotantes", [Authorize] (HttpContext context) =>
{
    var user = context.User;
    var email = user?.Identity?.Name ?? "Usuario anónimo";
    return Results.Ok($"Acceso autorizado. Bienvenido {email}");
});



using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SistemaPadronElectoral.Dto
{
    public class DtoPersonaVotante 
    {
        [Required]
        public int ci { get; set; }

        [Required]
        public string NombreCompleto { get; set; }

        [Required]
        public string Direccion { get; set; }

        [Required]
        public IFormFile FotoCarnetAnverso { get; set; } 

        [Required]
        public IFormFile FotoCarnetReverso { get; set; }
        [Required]
        public IFormFile FotoVotante { get; set; }

    }
}

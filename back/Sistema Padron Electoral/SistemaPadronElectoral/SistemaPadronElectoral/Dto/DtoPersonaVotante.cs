using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SistemaPadronElectoral.Dto
{
    public class DtoPersonaVotante 
    {
        [Required]
        public int ci { get; set; }

        [Required]
        public string Nombres { get; set; }

        [Required]
        public string Apellidos { get; set; }

        [Required]
        public string Direccion { get; set; }

        [Required]
        [FromForm(Name = "idRecinto")]
        public string idRecinto { get; set; }


        [Required]
        public IFormFile FotoCarnetAnverso { get; set; } 

        [Required]
        public IFormFile FotoCarnetReverso { get; set; }
        [Required]
        public IFormFile FotoVotante { get; set; }

    }
}

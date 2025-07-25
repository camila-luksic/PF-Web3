﻿using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SistemaPadronElectoral.models
{
    public class PersonaVotante 
    {

        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public int ci { get; set; }

        [Required]
        public string idRecinto { get; set; }
       
        [Required]
        public string Nombres { get; set; }

        [Required]
        public string Apellidos { get; set; }

        [Required]
        public string Direccion { get; set; }

        public string FotoCarnetAnversoPath { get; set; } 

      
        public string FotoCarnetReversoPath { get; set; }

      
        public string FotoVotantePath { get; set; }

    }
}

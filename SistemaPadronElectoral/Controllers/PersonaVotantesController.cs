using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPadronElectoral.Data;
using SistemaPadronElectoral.Dto;
using SistemaPadronElectoral.models; 

namespace SistemaPadronElectoral.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class PersonaVotantesController : ControllerBase
    {
        private readonly SistemaPadronElectoralContext _context;
        private readonly IWebHostEnvironment _env;


        public PersonaVotantesController(SistemaPadronElectoralContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/PersonaVotantes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonaVotante>>> GetPersonaVotantes()
        {
            return await _context.PersonaVotante.ToListAsync();
        }
      
        // GET: api/PersonaVotantes/by-guid/{id}
        [HttpGet("by-guid/{id}")]
        public async Task<ActionResult<PersonaVotante>> GetPersonaVotanteById(Guid id)
        {
            var personaVotante = await _context.PersonaVotante.FindAsync(id);

            if (personaVotante == null)
            {
                return NotFound();
            }

            return personaVotante;
        }

       
        // GET: api/PersonaVotantes/by-ci/{ci}
        [HttpGet("by-ci/{ci}")]
        public async Task<ActionResult<PersonaVotante>> GetPersonaVotanteByCi(int ci)
        {
            var personaVotante = await _context.PersonaVotante.FirstOrDefaultAsync(p => p.ci == ci);

            if (personaVotante == null)
            {
                return NotFound();
            }

            return personaVotante;
        }

        //CON FOTO
        [HttpPost]
        public async Task<ActionResult<PersonaVotante>> PostPersonaVotante([FromForm] DtoPersonaVotante personaVotanteDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            async Task<string?> SaveFileAndGetPath(IFormFile file, string ciFolder, string fileType)
            {
                if (file == null || file.Length == 0) return null;

                var specificCiFolder = Path.Combine(uploadsFolder, ciFolder);
                if (!Directory.Exists(specificCiFolder))
                {
                    Directory.CreateDirectory(specificCiFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{fileType}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(specificCiFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return $"/uploads/{ciFolder}/{uniqueFileName}";
            }

            string ciFolderName = personaVotanteDto.ci.ToString();

            var fotoCarnetAnversoPath = await SaveFileAndGetPath(personaVotanteDto.FotoCarnetAnverso, ciFolderName, "carnet_anverso");
            var fotoCarnetReversoPath = await SaveFileAndGetPath(personaVotanteDto.FotoCarnetReverso, ciFolderName, "carnet_reverso");
            var fotoVotantePath = await SaveFileAndGetPath(personaVotanteDto.FotoVotante, ciFolderName, "votante_foto");

            var personaVotante = new PersonaVotante
            {
                ci = personaVotanteDto.ci,
                NombreCompleto = personaVotanteDto.NombreCompleto,
                Direccion = personaVotanteDto.Direccion,
                FotoCarnetAnversoPath = fotoCarnetAnversoPath,
                FotoCarnetReversoPath = fotoCarnetReversoPath,
                FotoVotantePath = fotoVotantePath
                
            };

            _context.PersonaVotante.Add(personaVotante);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                if (PersonaVotanteExists(personaVotante.ci))
                {
                    return Conflict($"A voter with CI {personaVotante.ci} already exists.");
                }
                Console.WriteLine($"Error saving PersonaVotante: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, "An error occurred while saving the voter information.");
            }

            return CreatedAtAction(nameof(GetPersonaVotanteByCi), new { ci = personaVotante.ci }, personaVotante);
        }


        // PUT: api/PersonaVotantes/{ci}
        [HttpPut("{ci}")]
        public async Task<IActionResult> PutPersonaVotante(int ci, [FromForm] DtoPersonaVotante personaVotanteDto)
        {
            if (ci != personaVotanteDto.ci)
            {
                return BadRequest("The CI in the route does not match the CI in the form data.");
            }

            var personaVotante = await _context.PersonaVotante.FirstOrDefaultAsync(p => p.ci == ci);
            if (personaVotante == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            personaVotante.NombreCompleto = personaVotanteDto.NombreCompleto;
            personaVotante.Direccion = personaVotanteDto.Direccion;

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            async Task<string?> SaveFileAndGetPath(Microsoft.AspNetCore.Http.IFormFile? file, string ciFolder, string fileType)
            {
                if (file == null || file.Length == 0) return null; 

                var specificCiFolder = Path.Combine(uploadsFolder, ciFolder);
                if (!Directory.Exists(specificCiFolder))
                {
                    Directory.CreateDirectory(specificCiFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{fileType}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(specificCiFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return $"/uploads/{ciFolder}/{uniqueFileName}";
            }

            string ciFolderName = personaVotanteDto.ci.ToString();

            if (personaVotanteDto.FotoCarnetAnverso != null)
            {
                
                // DeleteExistingFile(personaVotante.FotoCarnetAnversoPath, uploadsFolder);
                personaVotante.FotoCarnetAnversoPath = await SaveFileAndGetPath(personaVotanteDto.FotoCarnetAnverso, ciFolderName, "carnet_anverso");
            }

            if (personaVotanteDto.FotoCarnetReverso != null)
            {
                DeleteExistingFile(personaVotante.FotoCarnetReversoPath, uploadsFolder);
                personaVotante.FotoCarnetReversoPath = await SaveFileAndGetPath(personaVotanteDto.FotoCarnetReverso, ciFolderName, "carnet_reverso");
            }

            if (personaVotanteDto.FotoVotante != null)
            {
                DeleteExistingFile(personaVotante.FotoVotantePath, uploadsFolder);
                personaVotante.FotoVotantePath = await SaveFileAndGetPath(personaVotanteDto.FotoVotante, ciFolderName, "votante_foto");
            }

            _context.Entry(personaVotante).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonaVotanteExists(ci))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating PersonaVotante: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, "An error occurred while updating the voter information.");
            }

            return NoContent();
        }



        // DELETE: api/PersonaVotantes/5
        [HttpDelete("{ci}")]
        public async Task<IActionResult> DeletePersonaVotante(int ci)
        {
            var personaVotante = await _context.PersonaVotante.FirstOrDefaultAsync(p => p.ci == ci);
            if (personaVotante == null)
            {
                return NotFound();
            }
          
             DeleteExistingFile(personaVotante.FotoCarnetAnversoPath, Path.Combine(_env.WebRootPath, "uploads"));
             DeleteExistingFile(personaVotante.FotoCarnetReversoPath, Path.Combine(_env.WebRootPath, "uploads"));
             DeleteExistingFile(personaVotante.FotoVotantePath, Path.Combine(_env.WebRootPath, "uploads"));

            _context.PersonaVotante.Remove(personaVotante);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

       
         

        private bool PersonaVotanteExists(int ci)
        {
            return _context.PersonaVotante.Any(e => e.ci == ci);
        }
        private void DeleteExistingFile(string? filePath, string uploadsFolder)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                
                var fileName = Path.GetFileName(filePath);
               
                
                var relativePath = filePath.Replace("/uploads/", "").Replace("/", Path.DirectorySeparatorChar.ToString());
                var fullPath = Path.Combine(_env.WebRootPath, "uploads", relativePath);

                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
        }
    }
}
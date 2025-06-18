using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SistemaPadronElectoral.models;

namespace SistemaPadronElectoral.Data
{
    public class SistemaPadronElectoralContext : DbContext
    {
        public SistemaPadronElectoralContext (DbContextOptions<SistemaPadronElectoralContext> options)
            : base(options)
        {
        }

        public DbSet<SistemaPadronElectoral.models.PersonaVotante> PersonaVotante { get; set; } = default!;
    }
}

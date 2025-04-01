using Microsoft.EntityFrameworkCore;
using Repository.Domain.Entities;

namespace Repository.Infrastructure
{
    public class RepositoryContext : DbContext
    {
        public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options) { }

        public DbSet<RepositorySelection> RepositorySelections { get; set; }
        public DbSet<User> Users { get; set; }
    }
}

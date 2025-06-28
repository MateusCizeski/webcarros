using CarPlataform.Models;
using Microsoft.EntityFrameworkCore;

namespace CarPlataform.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Car> Cars => Set<Car>();
        public DbSet<CarImage> CarImages => Set<CarImage>();
    }
}

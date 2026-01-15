using Microsoft.EntityFrameworkCore;
using Efqan.Models;
using System.IO;

namespace Efqan.Data {
    public class AppDbContext : DbContext {
        public DbSet<CourseGuide> CourseGuides { get; set; }
        public DbSet<Tagim> Tagims { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options) {
            var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "efqan.db");
            options.UseSqlite($"Data Source={dbPath}");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            // ...existing code...
        }
    }
}
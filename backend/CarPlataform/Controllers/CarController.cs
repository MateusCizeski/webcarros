using CarPlataform.Data;
using CarPlataform.DTOs;
using CarPlataform.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CarPlataform.Controllers
{
    [ApiController]
    [Route("cars")]
    public class CarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CarCreateDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var car = new Car
            {
                Name = dto.Name,
                Model = dto.Model,
                City = dto.City,
                Year = dto.Year,
                Km = dto.Km,
                Description = dto.Description,
                Created = dto.Created,
                Price = dto.Price,
                Owner = dto.Owner,
                Uid = dto.Uid,
                Whatsapp = dto.Whatsapp,
                UserId = userId,
                Images = dto.Images.Select(img => new CarImage { Name = img.Name, Url = img.Url, Uid = img.Uid }).ToList()
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return Ok(car);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cars = await _context.Cars.Include(c => c.Images).ToListAsync();
            return Ok(cars);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var car = await _context.Cars.FindAsync(id);

            if (car == null || car.UserId != userId)
                return Forbid();

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

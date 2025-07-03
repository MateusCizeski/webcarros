namespace CarPlataform.Models
{
    public class CarImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Uid { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Url { get; set; } = null!;
        public Guid CarId { get; set; }
        public Car Car { get; set; } = null!;
    }
}

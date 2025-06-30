namespace CarPlataform.DTOs
{
    public class CarCreateDto
    {
        public string Name { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Year { get; set; } = null!;
        public string Km { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Created { get; set; } = null!;
        public decimal Price { get; set; }
        public string Owner { get; set; } = null!;
        public string Uid { get; set; } = null!;
        public string Whatsapp { get; set; } = null!;
        public List<CarImageDto> Images { get; set; } = new();
    }

    public class CarImageDto
    {
        public string Name { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string Uid { get; set; } = null!;
    }
}

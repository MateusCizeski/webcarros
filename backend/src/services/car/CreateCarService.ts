import prismaClient from "../../prisma";

interface CarRequest {
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: number;
  owner: string;
  whatsapp: string;
  user_id: string;
}

class CreateCarService {
  async execute({
    name,
    model,
    city,
    year,
    km,
    description,
    created,
    price,
    owner,
    whatsapp,
    user_id,
  }: CarRequest) {
    const car = await prismaClient.car.create({
      data: {
        name,
        model,
        city,
        year,
        km,
        description,
        created,
        price,
        owner,
        whatsapp,
        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });

    return car;
  }
}

export { CreateCarService };

import { Request, Response } from "express";
import { CreateCarService } from "../../services/car/CreateCarService";

class CreateCarController {
  async handle(request: Request, response: Response) {
    const {
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
    } = request.body;

    const user_id = request.user_id;

    const service = new CreateCarService();

    const car = await service.execute({
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
    });

    return response.json(car);
  }
}

export { CreateCarController };

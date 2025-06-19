import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const service = new CreateUserService();
    const user = await service.execute({ name, email, password });

    return response.json(user);
  }
}

export { CreateUserController };

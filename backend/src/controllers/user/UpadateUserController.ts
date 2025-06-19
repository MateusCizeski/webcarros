import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { name } = request.body;
    const user_id = request.user_id;

    const service = new UpdateUserService();

    const user = await service.execute({ user_id, name });

    return response.json(user);
  }
}

export { UpdateUserController };

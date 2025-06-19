import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;
    const service = new AuthUserService();

    const session = await service.execute({ email, password });

    return response.json(session);
  }
}

export { AuthUserController };

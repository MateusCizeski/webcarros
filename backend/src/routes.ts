import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { UpdateUserController } from "./controllers/user/UpadateUserController";

const router = Router();

// --- ROTAS USER ---
router.post("/users", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);
router.get("/me", new DetailUserController().handle);
router.put("/users", new UpdateUserController().handle);

export { router };

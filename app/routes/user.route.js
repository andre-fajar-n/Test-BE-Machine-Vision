import { Router } from "express";
import user from "../controllers/user.controller.js";
import { authenticateToken } from "../utils/jwt.util.js";

var userRouter = Router();

userRouter.get("/", authenticateToken, user.getDetail);

export default userRouter;
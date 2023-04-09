import { Router } from "express";
import user from "../controllers/user.controller.js";
import { authenticateToken } from "../utils/jwt.util.js";
import { body } from "express-validator";

var userRouter = Router();

userRouter.get("/", authenticateToken, user.getDetail);

userRouter.put("/", authenticateToken,
    body("name").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("username").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("email").exists().isLength({min:1}).trim().withMessage("cannot be empty").isEmail().withMessage("format not valid"),
    body("photo").exists().isLength({min:1}).withMessage("cannot be empty").isURL().trim().withMessage("must be an URL"),
    user.update,
);

export default userRouter;
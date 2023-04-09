import { Router } from "express";
import auth from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { authenticateToken } from "../utils/jwt.util.js";

var authRouter = Router();

authRouter.post("/register",
    body("name").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("username").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("email").exists().isLength({min:1}).trim().withMessage("cannot be empty").isEmail().withMessage("format not valid"),
    body("password").exists().withMessage("cannot be empty").isLength({min:5}).trim().withMessage("must have minimum character 5"),
    body("photo").exists().isLength({min:1}).withMessage("cannot be empty").isURL().trim().withMessage("must be an URL"),
    auth.register,
);

authRouter.post("/login",
    body("username").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("password").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    auth.login,
);

authRouter.post("/logout", authenticateToken, auth.logout);

export default authRouter;
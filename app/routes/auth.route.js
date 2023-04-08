import { Router } from "express";
import auth from "../controllers/auth.controller.js";
import { body } from "express-validator";

var autRouter = Router();

autRouter.post("/register",
    body("name").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("username").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("email").exists().isLength({min:1}).trim().withMessage("cannot be empty").isEmail().withMessage("format not valid"),
    body("password").exists().withMessage("cannot be empty").isLength({min:5}).trim().withMessage("must have minimum character 5"),
    body("photo").exists().isLength({min:1}).withMessage("cannot be empty").isURL().trim().withMessage("must be an URL"),
    auth.register,
);

export default autRouter;
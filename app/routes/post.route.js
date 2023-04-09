import { Router } from "express";
import { authenticateToken } from "../utils/jwt.util.js";
import { body } from "express-validator";
import postController from "../controllers/post.controller.js";
import { validHashtag } from "../utils/string.util.js";

var postRouter = Router();

postRouter.post("/", authenticateToken,
    body("image").exists().isLength({min:1}).trim().withMessage("cannot be empty").isURL().trim().withMessage("must be an URL"),
    body("caption").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("tags").exists().isLength({min:1}).trim().withMessage("cannot be empty").custom(value => {
        if (!validHashtag(value)) {
            throw new Error("invalid format")
        }

        return true
    }),
    postController.create,
);

export default postRouter;
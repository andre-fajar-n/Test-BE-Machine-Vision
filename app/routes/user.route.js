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

userRouter.put("/change-password", authenticateToken,
    body("oldPassword").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("newPassword").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("confirmNewPassword").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    user.changePassword,
);

export default userRouter;
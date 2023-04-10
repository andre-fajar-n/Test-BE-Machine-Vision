import { Router } from "express";
import { authenticateToken } from "../utils/jwt.util.js";
import { body, param, query } from "express-validator";
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

postRouter.put("/:postId", authenticateToken,
    param("postId").isInt().exists().withMessage("cannot be empty and must be positive integer"),
    body("image").exists().isLength({min:1}).trim().withMessage("cannot be empty").isURL().trim().withMessage("must be an URL"),
    body("caption").exists().isLength({min:1}).trim().withMessage("cannot be empty"),
    body("tags").exists().isLength({min:1}).trim().withMessage("cannot be empty").custom(value => {
        if (!validHashtag(value)) {
            throw new Error("invalid format")
        }

        return true
    }),
    postController.update,
);

postRouter.delete("/:postId", authenticateToken,
    param("postId").isInt().exists().withMessage("cannot be empty and must be positive integer"),
    postController.softDelete,
);

postRouter.put("/like/:postId", authenticateToken,
    param("postId").isInt().exists().withMessage("cannot be empty and must be positive integer"),
    postController.like,
);

postRouter.put("/unlike/:postId", authenticateToken,
    param("postId").isInt().exists().withMessage("cannot be empty and must be positive integer"),
    postController.unlike,
);

postRouter.get("/", authenticateToken,
    query("page").default(1).isInt().withMessage("must be a positive integer"),
    query("limit").default(10).isInt().withMessage("must be a positive integer"),
    query("searchBy").custom(value => {
        if (value && (value !== "caption" && value !== "tags")) {
            throw new Error(`search must be "caption" or "tags"`)
        }
        return true
    }),
    query("search").custom((value, {req}) => {
        if (req.query.searchBy && !value) {
            throw new Error("cannot be empty when searchBy not empty")
        }
        if (value && !validHashtag(value)) {
            throw new Error("invalid format")
        }
        return true
    }),
    postController.getList,
);

postRouter.get("/:postId", authenticateToken,
    param("postId").isInt().exists().withMessage("cannot be empty and must be positive integer"),
    postController.getDetail,
);

postRouter.get("/user/:userId", authenticateToken,
    param("userId").custom(value => {
        const temp = parseInt(value)
        if (value && (temp < 1 || isNaN(temp))) {
            throw new Error("must be a positive integer")
        }
        return true
    }),
    query("page").default(1).isInt().withMessage("must be a positive integer"),
    query("limit").default(10).isInt().withMessage("must be a positive integer"),
    query("searchBy").custom(value => {
        if (value && (value !== "caption" && value !== "tags")) {
            throw new Error(`search must be "caption" or "tags"`)
        }
        return true
    }),
    query("search").custom((value, {req}) => {
        if (req.query.searchBy && !value) {
            throw new Error("cannot be empty when searchBy not empty")
        }
        if (value && !validHashtag(value)) {
            throw new Error("invalid format")
        }
        return true
    }),
    postController.getList,
);

export default postRouter;
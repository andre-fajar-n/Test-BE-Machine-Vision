import { validationResult } from "express-validator";
import db from "../models/index.js";
import { errorFormatter, errorResponse, successResponse } from "../utils/response.util.js"
import { validHashtag } from "../utils/string.util.js";

const User = db.user;
const Post = db.post;

const create = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    // find user by id
    var user = await User.findOne({
        where: {
            id: req.user.userId,
        }
    })
    .catch(err => {
        return res.status(500).send({message: err.message || "Internal server error"})
    })
    if (!user) {
        return res.status(404).send(errorResponse({message: "User not found"}))
    }

    const postReq = {
        image: req.body.image,
        caption: req.body.caption,
        tags: req.body.tags,
        userId: user.id,
    }

    Post.create(postReq)
    .then(data => {
        return res.send(successResponse({
            message: "Successfully Create Post",
            data: {
                image: data.image,
                caption: data.caption,
                tags: data.tags,
                likes: data.likes,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                user: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    photo: user.photo,
                }
            }
        }));
    })
    .catch(err => {
        return res.status(500).send({message: err.message || "Internal server error"})
    })
}

export default {
    create,
};
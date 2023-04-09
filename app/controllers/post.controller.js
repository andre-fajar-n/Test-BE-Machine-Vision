import { validationResult } from "express-validator";
import db, { sequelize } from "../models/index.js";
import { errorFormatter, errorResponse, successResponse } from "../utils/response.util.js"

const User = db.user;
const Post = db.post;
const UserLiked = db.userLiked;

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

const update = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    try {
        // find user by id
        var user = await User.findOne({
            where: {
                id: req.user.userId,
            }
        })
        if (!user) {
            return res.status(404).send(errorResponse({message: "User not found"}))
        }

        // find post by id
        var currentPost = await Post.findOne({
            where: {
                id: req.params.postId,
            }
        })
        if (!currentPost) {
            return res.status(404).send(errorResponse({message: "Post not found"}))
        }
        if (currentPost.userId !== user.id) {
            return res.status(403).send(errorResponse({message: "Post is not yours"}))
        }

        const postReq = {
            image: req.body.image,
            caption: req.body.caption,
            tags: req.body.tags,
        }

        const updatePost = await Post.update(postReq,
            {
                where:{ id:req.params.postId },
            }
        )
        if (!updatePost) throw ("Error while updating")

        const returnUpdatePost = await Post.findOne({ where: { id: req.params.postId }})
        if (!returnUpdatePost) throw ("Error while fetch updated data")

        return res.send(successResponse({
            message: "Successfully Update Post",
            data: {
                image: returnUpdatePost.image,
                caption: returnUpdatePost.caption,
                tags: returnUpdatePost.tags,
                likes: returnUpdatePost.likes,
                createdAt: returnUpdatePost.createdAt,
                updatedAt: returnUpdatePost.updatedAt,
                user: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    photo: user.photo,
                }
            }
        }));
    } catch (error) {
        return res.status(500).send(errorResponse({message: error.message || "Internal server error"}))
    }
}

const softDelete = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    try {
        // find user by id
        var user = await User.findOne({
            where: {
                id: req.user.userId,
            }
        })
        if (!user) {
            return res.status(404).send(errorResponse({message: "User not found"}))
        }

        // find post by id
        var currentPost = await Post.findOne({
            where: {
                id: req.params.postId,
            }
        })
        if (!currentPost) {
            return res.status(404).send(errorResponse({message: "Post not found"}))
        }
        if (currentPost.userId !== user.id) {
            return res.status(403).send(errorResponse({message: "Post is not yours"}))
        }

        await Post.destroy(
            {
                where:{ id:req.params.postId },
            }
        )

        return res.send(successResponse({
            message: "Successfully Delete Post",
            data: null
        }));
    } catch (error) {
        return res.status(500).send(errorResponse({message: error.message || "Internal server error"}))
    }
}

const like = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    
    likeUnlike(req, res, "like")
}

const unlike = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    
    likeUnlike(req, res, "unlike")
}

const likeUnlike = async (req, res, type) => {
    
    try {        
        // find user by id
        var user = await User.findOne({
            where: {
                id: req.user.userId,
            }
        })
        if (!user) {
            return res.status(404).send(errorResponse({message: "User not found"}))
        }

        // find post by id
        var currentPost = await Post.findOne({
            where: {
                id: req.params.postId,
            }
        })
        if (!currentPost) {
            return res.status(404).send(errorResponse({message: "Post not found"}))
        }

        var message = ""
        await sequelize.transaction(async (transaction) => {
            var rowsAffected = 0
            var error = {
                statusCode: null,
                message: null,
            }
            switch (type) {
                case "like":
                    await UserLiked.create({
                        userId: user.id,
                        postId: currentPost.id,
                    }, { transaction })
                    .catch(err => {
                        if (err.name === "SequelizeUniqueConstraintError") {
                            error.message = "You already like this post"
                            error.statusCode = 400
                            throw error
                        }

                        return err
                    })

                    await Post.increment(
                        { likes: 1 },
                        {
                            where: {
                                id: req.params.postId,
                                version: currentPost.version,
                            },
                            transaction,
                        }
                    )
                    .then(data => { rowsAffected = data[0][1] })
                        
                    message = "Successfully Liked Post"
                    break;
                case "unlike":
                    await UserLiked.destroy({
                        where: {
                            userId: user.id,
                            postId: currentPost.id,
                        },
                    }, { transaction })
                    .then(data => {
                        if (data === 0) {
                            error.message = "You already unlike this post"
                            error.statusCode = 400
                            throw error
                        }
                    })

                    await Post.decrement(
                        { likes: 1 },
                        {
                            where: {
                                id: req.params.postId,
                                version: currentPost.version,
                            },
                            transaction,
                        }
                    )
                    .then(data => { rowsAffected = data[0][1] })

                    message = "Successfully Unlike Post"
                    break;
            }

            if (rowsAffected === 0) {
                error.message = "System is busy, please try again"
                error.statusCode = 400
                throw error
            }
        })

        
        return res.send(successResponse({
            message: message,
            data: null
        }));
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).send(errorResponse({ message: error.message }))
        }
        return res.status(500).send(errorResponse({message: error.message || "Internal server error"}))
    }
}

export default {
    create,
    update,
    softDelete,
    like,
    unlike,
};
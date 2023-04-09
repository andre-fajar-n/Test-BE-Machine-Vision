import { validationResult } from "express-validator";
import db from "../models/index.js";
import { errorFormatter, errorResponse, successResponse } from "../utils/response.util.js"
import { Op } from "sequelize";

const User = db.user;

const getDetail = async (req, res) => {
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
        return res.status(404).send(errorResponse({message: "Data not found"}))
    }

    return res.send(successResponse({
        message: "Successfully Get User",
        data: {
            name: user.name,
            username: user.username,
            email: user.email,
            photo: user.photo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }))
}

const update = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    // get current data
    var currentUser = await User.findOne({
        where: {
            id: req.user.userId,
        }
    })
    .catch(err => {
        return res.status(500).send(errorResponse({message: err.message || "Internal server error"}))
    })
    if (!currentUser) {
        return res.status(404).send(errorResponse({message: "User not found"}))
    }

    // validate duplicate email and not own yourself
    var userValidateEmail = await User.findOne({
        where: {
            email: req.body.email,
            id: {
                [Op.not]: req.user.userId,
            }
        }
    })
    .catch(err => {
        return res.status(500).send(errorResponse({message: err.message || "Internal server error"}))
    })

    if (userValidateEmail) {
        return res.status(422).send(errorResponse({message: "email already in use"}))
    }

    // validate duplicate username and not own yourself
    var userValidateUsername = await User.findOne({
        where: {
            username: req.body.username,
            id: {
                [Op.not]: req.user.userId,
            }
        }
    })
    .catch(err => {
        return res.status(500).send(errorResponse({message: err.message || "Internal server error"}))
    })

    if (userValidateUsername) {
        return res.status(422).send(errorResponse({message: "username already in use"}))
    }
    
    // prepare data that will updated
    const userReq = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        photo: req.body.photo,
    }

    // update data
    await User.update(
        userReq,
        {
            where: {
                id: req.user.userId,
            }
        }
    )
    .catch(err => {
        return res.status(500).send(errorResponse({message: err.message || "Internal server error"}))
    })

    // get data after update
    await User.findOne({
        where: {
            id: req.user.userId,
        }
    })
    .then(data => {
        return res.send(successResponse({
            message: "Successfully Update User",
            data: {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                photo: req.body.photo,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            }
        }));
    })
    .catch(err => {
        return res.status(500).send(errorResponse({message: err.message || "Internal server error"}))
    })
}

export default {
    getDetail,
    update,
};
import { validationResult } from "express-validator";
import db from "../models/index.js";
import { errorFormatter, errorResponse, successResponse } from "../utils/response.util.js"
import { hashPassword } from "../utils/string.util.js";

const User = db.user;

const register = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    // validate duplicate email
    var user = await User.findOne({
        where: {
            email: req.body.email,
        }
    })
    .catch(err => {
        return res.status(500).send({message: err.message || "Internal server error"})
    })

    if (user) {
        return res.status(422).send(errorResponse({message: "email already in use"}))
    }

    // validate duplicate username
    var user = await User.findOne({
        where: {
            username: req.body.username,
        }
    })
    .catch(err => {
        return res.status(500).send({message: err.message || "Internal server error"})
    })

    if (user) {
        return res.status(422).send(errorResponse({message: "username already in use"}))
    }
    
    const userReq = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashPassword(req.body.password),
        photo: req.body.photo,
    }

    User.create(userReq)
        .then(data => {
            return res.send(successResponse({
                message: "Your account has been successfully created",
                data: {
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    photo: data.photo,
                }
            }));
        })
        .catch(err => {
            return res.status(500)
                .send({
                    message: err.message || "Internal server error"
                })
        })
}

export default {
    register,
};
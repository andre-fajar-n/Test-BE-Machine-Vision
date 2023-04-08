import { validationResult } from "express-validator";
import db from "../models/index.js";
import { errorFormatter, errorResponse, successResponse } from "../utils/response.util.js"
import { hashPassword, isValidPassword } from "../utils/string.util.js";
import { generateAccessToken } from "../utils/jwt.util.js";
import jwt from "jsonwebtoken";

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

const login = async (req, res) => {
    const errValidation = validationResult(req).formatWith(errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(errorResponse({message:errValidation.array()[0]}))
    }

    // find user by username
    var user = await User.findOne({
        where: {
            username: req.body.username,
        }
    })
    .catch(err => {
        return res.status(500).send({message: err.message || "Internal server error"})
    })

    if (!user) {
        return res.status(404).send(errorResponse({message: "username not found"}))
    }
    
    if (!isValidPassword(req.body.password, user.password)) {
        return res.status(400).send(errorResponse({message: "password invalid"}))
    }

    return res.send(successResponse({
        message: "Successfully logged in",
        data: {
            token: generateAccessToken(
                {
                    userId: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                },
                process.env.JWT_EXPIRES_IN,
            )
        }
    }))
}

const logout = async (req, res) => {
    jwt.sign(req.token, "", {expiresIn: 1}, (reqLogout, err) => {
        if (reqLogout) {
            return res.send(successResponse({
                message: "Successfully logout",
                data: null,
            }))
        } else {
            res.status(500).send(errorResponse({message: err}))
        }
    })

}

export default {
    register,
    login,
    logout,
};
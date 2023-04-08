import { validationResult } from "express-validator";
import db from "../models/index.js";
import responseUtils from "../utils/response.js"
import stringUtils from "../utils/string.js";

const User = db.user;

const register = (req, res) => {
    const errValidation = validationResult(req).formatWith(responseUtils.errorFormatter);
    if (!errValidation.isEmpty()) {
        return res.status(422).json(responseUtils.errorResponse({message:errValidation.array()[0]}))
    }
    
    const userReq = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: stringUtils.hashPassword(req.body.password),
        photo: req.body.photo,
    }

    User.create(userReq)
        .then(data => {
            res.send(responseUtils.successResponse({
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
            res.status(500)
            .send({
                message: err.message || "Internal server error"
            })
        })
}

export default {
    register,
};
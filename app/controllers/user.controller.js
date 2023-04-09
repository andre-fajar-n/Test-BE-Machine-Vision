import db from "../models/index.js";
import { errorResponse, successResponse } from "../utils/response.util.js"
import { hashPassword } from "../utils/string.util.js";

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

export default {
    getDetail,
};
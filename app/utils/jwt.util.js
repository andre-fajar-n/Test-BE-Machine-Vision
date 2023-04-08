import jwt from "jsonwebtoken";
import { errorResponse } from "./response.util.js";

export const generateAccessToken = (data, expiresIn) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn: expiresIn})
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const splitHeader = authHeader.split(" ")

    var token = ""
    if (splitHeader.length === 2) {
        token = splitHeader[1]
    } else {
        token = authHeader
    }

    if (token == null) return res.status(401).send(errorResponse({message: "No auth token"}));

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            switch (err.name) {
                case jwt.TokenExpiredError.name:
                    return res.status(403).send(errorResponse({message: "Token expired"}));        
                default:
                    return res.status(403).send(errorResponse({message: "Invalid token"}));
            }
        }

        req.user = user
        req.token = token

        next()
    })
}

const jwtUtil = {}

export default jwtUtil;
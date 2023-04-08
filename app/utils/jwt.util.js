import jwt from "jsonwebtoken";
import { errorResponse } from "./response.util.js";

export const generateAccessToken = (data, expiresIn) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn: expiresIn})
}

export const verifyToken = (req, res) => {
    const authHeader = req.headers["Authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send(errorResponse({message: "No auth token"}));

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send(errorResponse({message: "Invalid token"}));

        req.user = user
    })
}

const jwtUtil = {}

export default jwtUtil;
import { successResponse } from "../utils/response.util.js"

const uploadFile = async (req, res) => {    
    return res.send(successResponse({
        message: "Successfully Upload Image",
        data: {
            url: process.env.HOST_FILE+ "/" + req.file.filename,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
        },
    }))
}

export default {
    uploadFile,
};
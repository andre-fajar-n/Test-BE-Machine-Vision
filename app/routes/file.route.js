import { Router } from "express";
import { authenticateToken } from "../utils/jwt.util.js";
import multer from "multer";
import fileController from "../controllers/file.controller.js";

export const directoryUpload = "uploads/";

const upload = multer({ dest: directoryUpload })

var fileRouter = Router();

fileRouter.post("/", authenticateToken, upload.single("file"), fileController.uploadFile);

export default fileRouter;
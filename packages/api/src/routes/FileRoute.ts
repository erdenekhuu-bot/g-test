import express, { Request, Response } from "express";
import { saveFile, saveImage } from "../controller/FileController";
import { RequestHandler } from "express";
import { uploadFile, uploadImage } from "../middleware/File";
const fileRouter = express.Router();

const imagesMiddleware = uploadImage.array("images", 20) as unknown as RequestHandler;
fileRouter.post("/api/imageupload/:id", imagesMiddleware, saveImage);
fileRouter.post("/api/fileupload/:id", uploadFile.single("file"), saveFile);

export default fileRouter;

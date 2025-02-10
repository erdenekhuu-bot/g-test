import express, { Request } from "express";
import * as controller from "../controller/FileController"
import path from "path";
import multer from "multer";

const fileRouter = express.Router();

type MulterStorageCallback = (error: Error | null, destination: string) => void;

const dynamicDestination = function (req: Request, file: Express.Multer.File, cb: MulterStorageCallback) {
    let destinationPath = "";
    destinationPath = path.join("public", "uploads", "temp");
    cb(null, destinationPath);
  };

  const storage = multer.diskStorage({
    destination: dynamicDestination,
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });

const uploader = multer({ storage: storage });

fileRouter.post("/upload", uploader.single("file"), controller.upload);
fileRouter.post(
  "/service/:serviceName/:id/upload",
  uploader.single("file"),
  controller.uploadService
);

export default fileRouter;
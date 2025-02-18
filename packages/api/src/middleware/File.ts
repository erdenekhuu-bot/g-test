
import path from "path";
import fs from "fs";
import multer from "multer";
const uploadImagesDir = path.join(__dirname, "..", "public", "images");
const uploadFilesDir = path.join(__dirname, "..", "public", "files");
const filePath = path.join(__dirname, 'files', 'example.pdf');

if (!fs.existsSync(uploadImagesDir)) {
     fs.mkdirSync(uploadImagesDir, { recursive: true });
}
if (!fs.existsSync(uploadFilesDir)) {
     fs.mkdirSync(uploadFilesDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, uploadImagesDir);
     },
     filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + "-" + file.originalname);
     }
});

const fileStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, uploadFilesDir);
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     }
});

const uploadImage = multer({ storage: imageStorage });
const uploadFile = multer({ storage: fileStorage });

export { uploadFile, uploadImage };

import path from "path";
import fs from "fs";
import multer from "multer";

const tempDir = path.join(__dirname, "..", "..", "temp_uploads");
const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");
const uploadImages = path.join(__dirname, "..", "..", "public", "images");

if (!fs.existsSync(tempDir)) {
     fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
     fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(uploadImages)) {
     fs.mkdirSync(uploadImages, { recursive: true });
}

const fileStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, tempDir);
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     }
});

const imagetorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, tempDir);
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     }
});

const upload = multer({ storage: fileStorage });
const uploadImage = multer({ storage: imagetorage });
export { uploadImage, uploadDir, upload, uploadImages };
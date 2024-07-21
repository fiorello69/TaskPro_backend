import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";
// Configurează Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Configurează stocarea Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  folder: "avatars",
  allowedFormats: ["jpg", "png"],
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Configurează multer pentru utilizarea Cloudinary
const uploadCloud = multer({ storage });

// Exportă uploadCloud
export default uploadCloud;

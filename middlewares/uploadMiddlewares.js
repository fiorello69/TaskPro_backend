import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "avatars",
  allowedFormats: ["jpg", "png"],
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;

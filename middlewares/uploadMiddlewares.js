import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const allowedFormats = ["jpg", "jpeg", "png", "gif"];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    format: async (req, file) => {
      const fileExtension = file.mimetype.split("/")[1];
      if (allowedFormats.includes(fileExtension)) {
        return fileExtension;
      } else {
        throw new Error("Invalid file format");
      }
    },
    public_id: (_req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return file.originalname.split(".")[0] + "-" + uniqueSuffix;
    },
  },
});

const uploadCloud = multer({ storage: storage });

export default uploadCloud;

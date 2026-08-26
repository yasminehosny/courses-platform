import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "learn-hub",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov"],
    resource_type: "auto", // بيحدد صورة أو فيديو تلقائيًا
  },
});

const fileFilter = (req, file, cb) => {
  const isVideo = file.mimetype.startsWith("video/");
  const isImage = file.mimetype.startsWith("image/");

  if (isVideo || isImage) {
    cb(null, true);
  } else {
    cb(new Error("Only images or videos are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

export default upload;
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// أي بيئة serverless (Vercel أو غيرها) بيبقى فيها AWS_LAMBDA_FUNCTION_NAME متسجل تلقائيًا
const isServerless = !!(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NOW_REGION
);

let uploadDir = process.env.UPLOAD_DIR || (isServerless ? "/tmp/uploads" : "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  // fallback نهائي لو أي مسار فشل لأي سبب (صلاحيات، filesystem read-only...)
  console.error("Failed to create uploadDir at", uploadDir, "- falling back to os.tmpdir()", err.message);
  uploadDir = path.join(os.tmpdir(), "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
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
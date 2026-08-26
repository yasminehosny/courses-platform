import { Router } from "express";
import { getUploadSignature } from "../controllers/uploadController.js";
import { authMiddleware, allowedTo } from "../middelwares/authMW.js";

const router = Router();

router.get("/signature", authMiddleware, allowedTo("instructor"), getUploadSignature);

export default router;
import { Router } from "express";
import { addCategory, getCategories } from "../controllers/categoryController.js";
import { categoryValidation } from "../validation/categoryValidation.js";
import { validationMiddleware } from "../middelwares/validationMiddleware.js";
import { authMiddleware, allowedTo } from "../middelwares/authMW.js";

const router = Router();

router.post("/add", authMiddleware, allowedTo("instructor"), categoryValidation, validationMiddleware, addCategory);
router.get("/", getCategories);

export default router;
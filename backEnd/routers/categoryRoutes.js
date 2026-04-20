import { Router } from "express";
import { addCategory ,getCategories} from "../controllers/categoryController.js";
import { categoryValidation } from "../validation/categoryValidation.js";
import {validationMiddleware} from "../middelwares/validationMiddleware.js"
const router =Router()  
router.post("/add",categoryValidation,validationMiddleware, addCategory);
router.get("/",getCategories)
export default router
import { Router } from "express";
import { UserValidation } from "../validation/userValdation.js";
import {validationMiddleware} from "../middelwares/validationMiddleware.js"
import { register ,login} from "../controllers/authController.js";

const router = Router();
router.post("/register", UserValidation,validationMiddleware, register);
router.post("/login", login);
export default router;
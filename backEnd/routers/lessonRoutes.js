
import upload from "../utlis/multer.js";
import { Router } from "express";
import {
  addLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController.js";




import { lessonValidation } from "../validation/lessonValidation.js";
import { validationMiddleware } from "../middelwares/validationMiddleware.js";
import { authMiddleware, allowedTo } from "../middelwares/authMW.js";

const router = Router({ mergeParams: true }); 

router.get("/", getLessonsByCourse);
router.get("/:id", getLessonById);

router.post(
  "/",
  authMiddleware,
  allowedTo("instructor"),
  upload.single("video"), 
  lessonValidation,
  validationMiddleware,
  addLesson
);

router.put("/:id", authMiddleware, allowedTo("instructor"), lessonValidation, validationMiddleware, updateLesson);
router.delete("/:id", authMiddleware, allowedTo("instructor"), deleteLesson);

export default router;
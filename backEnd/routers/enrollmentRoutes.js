
import { Router } from "express";
import {
  enrollCourse,
  
  unenrollCourse,
  getCourseEnrollments
} from "../controllers/enrollmentController.js";
import { authMiddleware, allowedTo } from "../middelwares/authMW.js";
import { completeLesson, getCourseProgress } from "../controllers/enrollmentController.js";
import Lesson from "../models/lesson.js"; 
const router = Router({ mergeParams: true });


router.post("/:lessonId/complete", authMiddleware, allowedTo("student"), completeLesson);
router.get("/progress", authMiddleware, allowedTo("student"), getCourseProgress);

router.post("/", authMiddleware, allowedTo("student"), enrollCourse);
router.delete("/", authMiddleware, allowedTo("student"), unenrollCourse);
router.get("/", authMiddleware, allowedTo("instructor"), getCourseEnrollments);

export default router;
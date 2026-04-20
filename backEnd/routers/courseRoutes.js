
import { Router } from "express";
import upload from "../utlis/multer.js";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMyCourses,
} from "../controllers/courseController.js";
import { courseValidation } from "../validation/courseValidation.js";
import { validationMiddleware } from "../middelwares/validationMiddleware.js";
import { authMiddleware, allowedTo } from "../middelwares/authMW.js";
import { rateCourse, getCourseRatings } from "../controllers/courseController.js";
import Enrollment from "../models/enrollment.js"; 
const router = Router();


router.post("/:id/rate", authMiddleware, allowedTo("student"), rateCourse);
router.get("/:id/ratings", getCourseRatings);

router.get("/", getAllCourses);
router.get("/:id", getCourseById);


router.get("/my/courses", authMiddleware, allowedTo("instructor"), getMyCourses);
router.post(
  "/",
  authMiddleware,
  allowedTo("instructor"),
  upload.single("image"), 
  courseValidation,
  validationMiddleware,
  addCourse
);
router.put(
  "/:id",
  authMiddleware,
  allowedTo("instructor"),
  upload.single("image"),
  courseValidation,
  validationMiddleware,
  updateCourse
);
router.delete("/:id", authMiddleware, allowedTo("instructor"), deleteCourse);

export default router;
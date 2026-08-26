
import { Router } from "express";
import {
  addComment,
  getLessonComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { commentValidation } from "../validation/commentValidation.js";
import { validationMiddleware } from "../middelwares/validationMiddleware.js";
import { authMiddleware, allowedTo } from "../middelwares/authMW.js";

const router = Router({ mergeParams: true });


router.get("/", getLessonComments);


router.post("/", authMiddleware, allowedTo("student"), commentValidation, validationMiddleware, addComment);
router.put("/:id", authMiddleware, allowedTo("student"), commentValidation, validationMiddleware, updateComment);
router.delete("/:id", authMiddleware, allowedTo("student"), deleteComment);

export default router;
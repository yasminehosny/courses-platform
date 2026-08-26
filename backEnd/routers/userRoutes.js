
import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../controllers/userController.js";
import { authMiddleware } from "../middelwares/authMW.js";

const router = Router();


router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.delete("/me", authMiddleware, deleteMyAccount);


router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
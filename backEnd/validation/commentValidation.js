import { body } from "express-validator";

export const commentValidation = [

  body("content")
    .trim()
    .notEmpty().withMessage("content is required")
    .isLength({ min: 3, max: 500 }).withMessage("content must be between 3 and 500 characters"),

];
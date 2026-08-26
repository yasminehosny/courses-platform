import { body } from "express-validator";

export const categoryValidation = [

  body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({ min: 3, max: 100 }).withMessage("name must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("description is required")
    .isLength({ min: 10, max: 500 }).withMessage("description must be between 10 and 500 characters"),

];
import { body } from "express-validator";

export const courseValidation = [

  body("title")
    .trim()
    .notEmpty().withMessage("title is required")
    .isLength({ min: 3, max: 200 }).withMessage("title must be between 3 and 200 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("description is required")
    .isLength({ min: 10, max: 2000 }).withMessage("description must be between 10 and 2000 characters"),

  body("price")
    .notEmpty().withMessage("price is required")
    .isNumeric().withMessage("price must be a number")
    .custom((value) => value >= 0).withMessage("price must be 0 or greater"),

  body("categoryID")
    .notEmpty().withMessage("category is required")
    .isMongoId().withMessage("invalid category id"),

];
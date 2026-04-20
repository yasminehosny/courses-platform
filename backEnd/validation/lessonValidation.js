import { body } from "express-validator";

export const lessonValidation = [

  body("title")
    .trim()
    .notEmpty().withMessage("title is required")
    .isLength({ min: 3, max: 200 }).withMessage("title must be between 3 and 200 characters"),

  body("content")
    .trim()
    .notEmpty().withMessage("content is required")
    .isLength({ min: 10 }).withMessage("content must be at least 10 characters"),

   

  body("duration")
    .notEmpty().withMessage("duration is required")
    .isNumeric().withMessage("duration must be a number")
    .custom((value) => value > 0).withMessage("duration must be greater than 0"),

];
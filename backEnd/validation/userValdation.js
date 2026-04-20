import { body } from "express-validator";
export const UserValidation = [
 
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3, max: 20 }).withMessage("Name must be between 3 and 20 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is invalid"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6, max: 8 }).withMessage("Password must be between 6 and 8 characters")
   
];

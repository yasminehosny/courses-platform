import jwt from "jsonwebtoken";
import HttpError from "../utlis/httpError.js";


export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
     return next(new HttpError(401, "No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded; 
    next();

  } catch (err) {
    return next(new HttpError(401,"Invalid token"));
  }
};


export const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403,"You are not authorized to do this"));
    }
    next();
  };
};
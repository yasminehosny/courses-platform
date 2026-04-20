import User from "../models/user.js"
import HTTPError from "../utlis/httpError.js";
import jwt from "jsonwebtoken";



export const register = async (req, res,next) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
     
      return next(new HTTPError(404,"Email already in use"));
    }
    const user = new User({ name, email, password, role });
    await user.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};
export const login=async(req,res,next)=>{
  try{
     const {email, password} = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new HTTPError(404,"Email or password not valid"));
      
     const isMatched = await existingUser.comparePassword(password);
    if (!isMatched) return next(new HTTPError(404,"Email or password not valid"));
    
   const accessToken= jwt.sign({userID:existingUser._id, role:existingUser.role},process.env.JWT_ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
      })
     res.status(200).json({ message: "User login successfully" ,accessToken});
  }catch (err) {
    next(err);
  }
}
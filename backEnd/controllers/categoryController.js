import Category from "../models/category.js";
import HttpError from "../utlis/httpError.js";

export const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new HttpError(400,"Category already exists"));
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: "Category added successfully", category });

  } catch (err) {
    next(err);
  }
};
export const getCategories = async (req, res, next) => {    
    try {   
        const categories = await Category.find();
        res.status(200).json({ categories });
    }  catch(err){
        next(err)
    }

}


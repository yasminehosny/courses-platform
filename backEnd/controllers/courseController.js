
import Course from "../models/course.js";
import Category from "../models/category.js";
import Enrollment from "../models/enrollment.js";
import HttpError from "../utlis/httpError.js";


export const addCourse = async (req, res, next) => {
  try {
    const { title, description, categoryID, price } = req.body;

    const instructorID = req.user.userID;

    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return next(new HttpError(400, "Course already exists"));
    }

    const existingCategory = await Category.findById(categoryID);
    if (!existingCategory) {
      return next(new HttpError(404, "Category not found"));
    }

    const imageUrl = req.file
      ? `http://localhost:4000/uploads/${req.file.filename}`
      : null;

    const course = new Course({
      title,
      description,
      instructorID,
      categoryID,
      price,
      imageUrl,
    });

    await course.save();

    res.status(201).json({
      message: "Course added successfully",
      course,
    });

  } catch (err) {
    next(err);
  }
};


export const getAllCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.categoryID) filter.categoryID = req.query.categoryID;

    if (req.query.search) {
     
      const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: escaped, $options: 'i' };
    }

    if (req.query.minPrice) filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };

    const courses = await Course.find(filter)
      .populate('instructorID', 'name email')
      .populate('categoryID', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      courses,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });

  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructorID", "name email")
      .populate("categoryID", "name");

    if (!course) {
      return next(new HttpError(404,"Course not found"));
    }

    res.status(200).json({ course });
  } catch (err) {
    next(err);
  }
};


export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, categoryID, price } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return next(new HttpError(404,"Course not found"));
    }

    
    if (course.instructorID.toString() !== req.user.userID) {
      return next(new HttpError(403,"You are not authorized"));
    }

    if (categoryID) {
      const existingCategory = await Category.findById(categoryID);
      if (!existingCategory) {
        return next(new HttpError(404,"Category not found"));
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, description, categoryID, price },
      { new: true }
    );

    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });

  } catch (err) {
    next(err);
  }
};


export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new HttpError(404,"Course not found"));
    }

    
    if (course.instructorID.toString() !== req.user.userID) {
      return next(new HttpError(403,"You are not authorized"));
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully" });

  } catch (err) {
    next(err);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructorID: req.user.userID })
      .populate("categoryID", "name");

    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
};
export const rateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const studentID = req.user.userID;

    const course = await Course.findById(id);
    if (!course) return next(new HttpError( 404,"Course not found"));

    
    const enrollment = await Enrollment.findOne({ studentID, courseID: id });
    if (!enrollment) return next(new HttpError("You must be enrolled to rate this course", 403));

    
    const existingIndex = course.ratings.findIndex(
      r => r.studentID.toString() === studentID
    );

    if (existingIndex > -1) {
      course.ratings[existingIndex].rating = rating;
      course.ratings[existingIndex].review = review;
    } else {
      course.ratings.push({ studentID, rating, review });
    }

    
    const total = course.ratings.length;
    const sum = course.ratings.reduce((acc, r) => acc + r.rating, 0);
    course.avgRating = Math.round((sum / total) * 10) / 10;
    course.totalRatings = total;

    await course.save();
    res.status(200).json({ message: "Rating submitted", avgRating: course.avgRating, totalRatings: course.totalRatings });

  } catch (err) {
    next(err);
  }
};


export const getCourseRatings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .select("ratings avgRating totalRatings")
      .populate("ratings.studentID", "name");

    res.status(200).json({
      ratings: course.ratings,
      avgRating: course.avgRating,
      totalRatings: course.totalRatings
    });
  } catch (err) {
    next(err);
  }
};
import Lesson from "../models/lesson.js";
import Course from "../models/course.js";
import HttpError from "../utlis/httpError.js";

export const addLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, content, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return next(new HttpError(404, "Course not found"));

    if (course.instructorID.toString() !== req.user.userID) {
      return next(new HttpError(403, "You are not authorized"));
    }
    const existingLesson = await Lesson.findOne({
      courseID: courseId,
      title: title.trim(),
    });

    if (existingLesson) {
      return next(new HttpError(409, "Lesson already exists in this course"));
    }
    const lessonsCount = await Lesson.countDocuments({ courseID: courseId });
    const order = lessonsCount + 1;

    const videoUrl = req.file
      ? req.file.path
      : req.body.videoUrl;

    const lesson = new Lesson({
      title,
      content,
      videoUrl,
      duration,
      courseID: courseId,
      order,
    });

    await lesson.save();
    res.status(201).json({ message: "Lesson added successfully", lesson });
  } catch (err) {
    next(err);
  }
};

export const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError(404, "Course not found"));
    }

    const lessons = await Lesson.find({ courseID: courseId }).sort({
      order: 1,
    });
    res.status(200).json({ lessons });
  } catch (err) {
    next(err);
  }
};

export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id).populate("courseID", "title");
    if (!lesson) {
      return next(new HttpError(404, "Lesson not found"));
    }

    res.status(200).json({ lesson });
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, duration } = req.body;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return next(new HttpError(404, "Lesson not found"));
    }

    const course = await Course.findById(lesson.courseID);
    if (course.instructorID.toString() !== req.user.userID) {
      return next(new HttpError(403, "You are not authorized"));
    }

    let videoUrl = lesson.videoUrl;

    if (req.file) {
      videoUrl = req.file.path; // رابط Cloudinary الكامل
    } else if (req.body.videoUrl) {
      videoUrl = req.body.videoUrl;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { title, content, videoUrl, duration },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Lesson updated successfully", lesson: updatedLesson });
  } catch (err) {
    next(err);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return next(new HttpError(404, "Lesson not found"));
    }

  
    const course = await Course.findById(lesson.courseID);
    if (course.instructorID.toString() !== req.user.userID) {
      return next(new HttpError(403, "You are not authorized"));
    }

    await Lesson.findByIdAndDelete(id);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    next(err);
  }
};
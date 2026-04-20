
import Enrollment from "../models/enrollment.js";
import Course from "../models/course.js";
import HttpError from "../utlis/httpError.js";
import Lesson from "../models/lesson.js";
import mongoose from "mongoose";


export const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentID = req.user.userID;

    
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError(404,"Course not found"));
    }


    const existingEnrollment = await Enrollment.findOne({ studentID, courseID: courseId });
    if (existingEnrollment) {
      return next(new HttpError(400,"Already enrolled in this course"));
    }

    const enrollment = new Enrollment({
      studentID,
      courseID: courseId,
    });

    await enrollment.save();
    res.status(201).json({ message: "Enrolled successfully", enrollment });

  } catch (err) {
    next(err);
  }
};


export const getMyEnrollments = async (req, res, next) => {
  try {
    const studentID = req.user.userID;

    const enrollments = await Enrollment.find({ studentID })
      .populate("courseID", "title description price");

    res.status(200).json({ enrollments });

  } catch (err) {
    next(err);
  }
};


export const unenrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentID = req.user.userID;

    const enrollment = await Enrollment.findOne({ studentID, courseID: courseId });
    if (!enrollment) {
      return next(new HttpError(404,"Enrollment not found"));
    }

    await Enrollment.findByIdAndDelete(enrollment._id);
    res.status(200).json({ message: "Unenrolled successfully" });

  } catch (err) {
    next(err);
  }
};
export const getCourseEnrollments = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError(404,"Course not found"));
    }

    
    if (course.instructorID.toString() !== req.user.userID) {
      return next(new HttpError(403,"You are not authorized"));
    }

    const enrollments = await Enrollment.find({ courseID: courseId })
      .populate("studentID", "name email");

    res.status(200).json({ 
      total: enrollments.length,
      enrollments 
    });

  } catch (err) {
    next(err);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const studentID = req.user.userID;

    const enrollment = await Enrollment.findOne({ studentID, courseID: courseId });
    if (!enrollment) return next(new HttpError("Enrollment not found", 404));

    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);

   
    if (!enrollment.completedLessons.some(id => id.equals(lessonObjectId))) {
      enrollment.completedLessons.push(lessonObjectId);
    }

    
    const totalLessons = await Lesson.countDocuments({ courseID: courseId });
    if (enrollment.completedLessons.length >= totalLessons) {
      enrollment.isCompleted = true;
    }

    await enrollment.save();
    res.status(200).json({
      message: "Lesson marked as complete",
      completedLessons: enrollment.completedLessons.length,
      totalLessons,
      isCompleted: enrollment.isCompleted
    });

  } catch (err) {
    next(err);
  }
};


export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentID = req.user.userID;

    const enrollment = await Enrollment.findOne({ studentID, courseID: courseId });
    if (!enrollment) return next(new HttpError("Not enrolled", 404));

    const totalLessons = await Lesson.countDocuments({ courseID: courseId });
    const percentage = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    res.status(200).json({
      completedLessons: enrollment.completedLessons.map(id => id.toString()),
      totalLessons,
      percentage,
      isCompleted: enrollment.isCompleted
    });
  } catch (err) {
    next(err);
  }
};
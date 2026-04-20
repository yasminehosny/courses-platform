
import Comment from "../models/comment.js";
import Lesson from "../models/lesson.js";
import Enrollment from "../models/enrollment.js";
import HttpError from "../utlis/httpError.js";


export const addComment = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const studentID = req.user.userID;
    const { content } = req.body;

   
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return next(new HttpError( 404,"Lesson not found"));
    }

    
    const enrollment = await Enrollment.findOne({
      studentID,
      courseID: lesson.courseID,
    });
    if (!enrollment) {
      return next(new HttpError(403,"You are not enrolled in this course"));
    }

    const comment = new Comment({
      content,
      studentID,
      lessonID: lessonId,
    });

    await comment.save();
    
    // Populate student data
    await comment.populate("studentID", "name email");
    
    res.status(201).json({ message: "Comment added successfully", comment });

  } catch (err) {
    next(err);
  }
};


export const getLessonComments = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return next(new HttpError(404,"Lesson not found"));
    }

    const comments = await Comment.find({ lessonID: lessonId })
      .populate("studentID", "name email");

    res.status(200).json({ 
      total: comments.length,
      comments 
    });

  } catch (err) {
    next(err);
  }
};


export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return next(new HttpError(404,"Comment not found"));
    }


    if (comment.studentID.toString() !== req.user.userID) {
      return next(new HttpError(403,"You are not authorized"));
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).populate("studentID", "name email");

    res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });

  } catch (err) {
    next(err);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return next(new HttpError(404,"Comment not found"));
    }

    
    if (comment.studentID.toString() !== req.user.userID) {
      return next(new HttpError(403,"You are not authorized"));
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });

  } catch (err) {
    next(err);
  }
};
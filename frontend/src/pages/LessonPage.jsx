import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLessonById,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getVideoUrl,
  completeLesson,
  getCourseProgress,
  rateCourse,
  getCourseRatings,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaCheck } from "react-icons/fa";
export default function LessonPage() {
  const { courseId, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [err, setErr] = useState("");

  // ── Progress State ──
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(null);
  const [completeLoading, setCompleteLoading] = useState(false);

  // ── Rating State ──
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [ratingMsg, setRatingMsg] = useState("");
  const [ratingErr, setRatingErr] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  const getCommentAuthorName = (comment) => {
    if (comment?.studentID?.name) return comment.studentID.name;
    if (comment?.studentName) return comment.studentName;
    return "Student";
  };

  useEffect(() => {
    loadData();
  }, [courseId, id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ld, cd] = await Promise.all([
        getLessonById(courseId, id),
        getComments(id),
      ]);
      setLesson(ld.lesson);
      setComments(cd.comments || []);

      //  جيب الـ Progress للطالب بس
      if (user?.role === "student") {
        try {
          const pd = await getCourseProgress(courseId);
          setProgress(pd);
          setCompleted((pd.completedLessons || []).includes(id));

          //  جيب الـ Ratings للكورس
          try {
            const rd = await getCourseRatings(courseId);
            const mine = (rd.ratings || []).find(
              (r) => r.studentID?._id === user._id || r.studentID === user._id,
            );
            if (mine) {
              setMyRating(mine.rating);
              setMyReview(mine.review || "");
            }
          } catch {}
        } catch {}
      }
    } catch {}
    setLoading(false);
  };

  const handleComplete = async () => {
    setCompleteLoading(true);
    try {
      const d = await completeLesson(courseId, id);
      setCompleted(true);
      setProgress(d);
    } catch (e) {
      alert(e.message || "Failed to mark as complete");
    }
    setCompleteLoading(false);
  };

  const handleRate = async () => {
    if (!myRating) {
      setRatingMsg("Please select a star rating first");
      setRatingErr(true);
      return;
    }
    setRatingLoading(true);
    setRatingErr(false);
    setRatingMsg("");
    try {
      await rateCourse(courseId, { rating: myRating, review: myReview });
      setRatingMsg("Rating submitted successfully!");
      setRatingErr(false);

      setTimeout(() => navigate(`/courses/${courseId}`), 1500);
    } catch (e) {
      setRatingMsg(e.message || "Failed to submit rating");
      setRatingErr(true);
    }
    setRatingLoading(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPostLoading(true);
    setErr("");
    try {
      const d = await addComment(id, { content: newComment });
      const commentWithAuthor = {
        ...d.comment,
        studentID: d.comment?.studentID?.name
          ? d.comment.studentID
          : { _id: user?._id, name: user?.name || "Student" },
      };
      setComments((p) => [commentWithAuthor, ...p]);
      setNewComment("");
    } catch (e) {
      setErr(e.message || "Failed to post comment");
    }
    setPostLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(id, commentId);
      setComments((p) => p.filter((c) => c._id !== commentId));
    } catch {}
  };

  const isCommentOwner = (comment) => {
    const ownerId = comment?.studentID?._id || comment?.studentID;
    return Boolean(
      user?._id && ownerId && ownerId.toString() === user._id.toString(),
    );
  };

  const startEditComment = (comment) => {
    setEditId(comment._id);
    setEditContent(comment.content || "");
  };

  const cancelEditComment = () => {
    setEditId("");
    setEditContent("");
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;
    setEditLoading(true);
    try {
      const d = await updateComment(id, commentId, {
        content: editContent.trim(),
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, ...d.comment } : c)),
      );
      cancelEditComment();
    } catch (e) {
      alert(e.message || "Failed to update comment");
    }
    setEditLoading(false);
  };

  if (loading) return <div className="loader-wrap">Loading lesson...</div>;
  if (!lesson)
    return (
      <div className="page">
        <button
          className="back-btn"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <FaArrowLeft /> Back
        </button>
        <div className="empty-state">
          <div className="empty-title">Lesson not found</div>
          <p>Make sure you are enrolled in this course</p>
        </div>
      </div>
    );

  const videoUrl = getVideoUrl(lesson.videoUrl);

  return (
    <div className="page">
      <button
        className="back-btn"
        onClick={() => navigate(`/courses/${courseId}`)}
      >
        <FaArrowLeft /> Back to course
      </button>
      <div className="detail-grid">
        {/* ── Left ── */}
        <div>
          <h1
            className="syne"
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            {lesson.title}
          </h1>

          {/*  Video Player */}
          {videoUrl && (
            <div className="video-player">
              <video controls controlsList="nodownload" key={videoUrl}>
                <source src={videoUrl} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/*  Progress Card — للطالب بس */}
          {user?.role === "student" && (
            <div className="card" style={{ marginBottom: 24 }}>
              {/* Progress Bar */}
              {progress && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text2)",
                        fontWeight: 500,
                      }}
                    >
                      Course Progress
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--accent)",
                        fontWeight: 700,
                      }}
                    >
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress.percentage}%`,
                        transition: "width .5s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginTop: 6,
                    }}
                  >
                    {progress.completedLessons?.length || 0} of{" "}
                    {progress.totalLessons} lessons completed
                  </div>
                </div>
              )}

              {/* Mark Complete Button */}
              {completed ? (
                <div
                  className="badge badge-green"
                  style={{
                    padding: "8px 16px",
                    fontSize: 14,
                    display: "inline-flex",
                  }}
                >
                  <FaCheck style={{ marginRight: 6 }} /> Lesson Completed
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleComplete}
                  disabled={completeLoading}
                >
                  {completeLoading ? "Saving..." : <><FaCheck style={{ marginRight: 6 }} /> Mark as Complete</>}
                </button>
              )}

              {/* 🎉 Course Finished */}
              {progress?.isCompleted && (
                <div
                  className="alert alert-ok"
                  style={{ marginTop: 14, marginBottom: 0 }}
                >
                  🎉 Congratulations! You completed the entire course! Go rate
                  it now.
                </div>
              )}
            </div>
          )}

          {/*  Rate Course — للطالب المسجل و اللي خلص الكورس بس */}
          {user?.role === "student" && progress?.isCompleted && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3
                className="syne"
                style={{ fontSize: 18, marginBottom: 6, color: "var(--text)" }}
              >
                Congratulations! You've completed this course.
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text3)",
                  marginBottom: 16,
                }}
              >
                Share your feedback to help others and improve the course.
              </p>

              <StarRating value={myRating} onChange={setMyRating} size={36} />

              <textarea
                className="form-control"
                value={myReview}
                onChange={(e) => setMyReview(e.target.value)}
                placeholder="Write a review (optional)..."
                rows={3}
                style={{ marginTop: 14 }}
              />

              {ratingMsg && (
                <div
                  className={`alert ${ratingErr ? "alert-err" : "alert-ok"}`}
                  style={{ marginTop: 12 }}
                >
                  {ratingErr ? <FaExclamationTriangle /> : <FaCheckCircle />}{" "}
                  {ratingMsg}
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                onClick={handleRate}
                disabled={ratingLoading}
              >
                {ratingLoading
                  ? "Submitting..."
                  : myRating
                    ? "Update Rating"
                    : "Submit Rating"}
              </button>
            </div>
          )}

          {/* Content */}
          <div className="card" style={{ marginBottom: 28 }}>
            <h3
              className="syne"
              style={{ fontSize: 17, marginBottom: 12, color: "var(--text)" }}
            >
              Lesson Content
            </h3>
            <p
              style={{
                color: "var(--text2)",
                lineHeight: 1.9,
                fontSize: 15,
                whiteSpace: "pre-line",
              }}
            >
              {lesson.content}
            </p>
          </div>

          {/* Comments */}
          <h2 className="section-title">Comments ({comments.length})</h2>

          {user?.role === "student" && (
            <form onSubmit={handleComment} style={{ marginBottom: 20 }}>
              {err && <div className="alert alert-err">{err}</div>}
              <div className="form-group">
                <textarea
                  className="form-control"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this lesson..."
                  rows={3}
                />
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={postLoading}
              >
                {postLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          )}

          {comments.length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: 14 }}>
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="comment-box">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="comment-author">
                    {getCommentAuthorName(c)}
                  </div>
                  {isCommentOwner(c) && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "2px 6px", fontSize: 12 }}
                        onClick={() => startEditComment(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{
                          color: "var(--danger)",
                          padding: "2px 6px",
                          fontSize: 12,
                        }}
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editId === c._id ? (
                  <div style={{ marginTop: 8 }}>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditComment(c._id)}
                        disabled={editLoading}
                      >
                        {editLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={cancelEditComment}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="comment-text">{c.content}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── Right ── */}
        <div>
          <div className="card">
            <h3
              className="syne"
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14,
                color: "var(--text)",
              }}
            >
              Lesson Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text3)", fontSize: 14 }}>
                  Duration
                </span>
                <span
                  style={{
                    color: "var(--accent)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {lesson.duration} min
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text3)", fontSize: 14 }}>
                  Lesson No.
                </span>
                <span style={{ color: "var(--text)", fontSize: 14 }}>
                  #{lesson.order}
                </span>
              </div>
              {lesson.courseID && (
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: "var(--text3)", fontSize: 14 }}>
                    Course
                  </span>
                  <div
                    style={{
                      color: "var(--text)",
                      fontSize: 14,
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    {lesson.courseID.title}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Actions */}
          {user?.role === "instructor" && (
            <div className="card" style={{ marginTop: 14 }}>
              <h3
                className="syne"
                style={{ fontSize: 15, marginBottom: 12, color: "var(--text)" }}
              >
                Instructor Actions
              </h3>
              <button
                className="btn btn-outline btn-full btn-sm"
                onClick={() =>
                  navigate(
                    `/dashboard/courses/${courseId}/edit-lesson/${lesson._id}`,
                  )
                }
              >
                Edit Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

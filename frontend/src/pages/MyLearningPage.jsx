import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments, getImageUrl } from "../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const getBg = (id) =>
  ["#1a1528", "#0d1a28", "#1a1208", "#1a0d0d", "#081a1a"][
    (id || "").charCodeAt(0) % 5
  ];

const PAGE_SIZE = 6;

export default function MyLearningPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyEnrollments()
      .then((d) => {
        setEnrollments(d.enrollments || []);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="loader-wrap">Loading your courses...</div>;

  const validEnrollments = enrollments.filter(
    (e) => e?.courseID && typeof e.courseID !== "string"
  );

  const totalPages = Math.max(
    1,
    Math.ceil(validEnrollments.length / PAGE_SIZE)
  );

  const paginatedEnrollments = validEnrollments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="page">
      <h1 className="page-title">My Learning</h1>

      {validEnrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">No courses yet</div>
          <p style={{ marginBottom: 20 }}>
            Browse and enroll in courses to start learning
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="course-grid">
            {paginatedEnrollments.map((e) => {
              const c = e.courseID;
              const cid = c._id || c;

            
              const completed = e.completedLessons?.length || 0;
              const total = c.lessons?.length || 1;
              const progress = (completed / total) * 100;

              return (
                <div
                  key={e._id}
                  className="course-card"
                  onClick={() => navigate(`/courses/${cid}`)}
                >
                  <div
                    className="course-img"
                    style={{ background: getBg(cid) }}
                  >
                    {c.imageUrl ? (
                      <img src={getImageUrl(c.imageUrl)} alt={c.title} />
                    ) : (
                      <span className="course-img-placeholder">💻</span>
                    )}
                  </div>

                  <div className="course-body">
                    <div className="course-title">{c.title}</div>
                    <div className="course-desc">{c.description}</div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text3)",
                        marginTop: 6,
                        marginBottom: 12,
                      }}
                    >
                      {completed} lessons completed
                    </div>

                    <button className="btn btn-primary btn-full btn-sm">
                      Continue Learning{" "}
                      <FaChevronRight style={{ marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    className={`page-btn${page === p ? " active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className="page-btn"
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
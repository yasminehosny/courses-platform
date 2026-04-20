import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEdit, FaArrowLeft, FaCheck } from 'react-icons/fa';
import {
  getCourseById, getLessons, enrollCourse, unenrollCourse,
  getMyEnrollments, getImageUrl, deleteLesson,
  getCourseRatings, getCourseProgress
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MdOutlinePlayLesson } from 'react-icons/md';
import StarRating from '../components/StarRating';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  // ── Ratings State ──
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  // ── Completion State ──
  const [completed, setCompleted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => { loadData(); }, [id, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cd, ld] = await Promise.all([getCourseById(id), getLessons(id)]);
      setCourse(cd.course);
      setLessons(ld.lessons || []);

      // ✅ تحقق من الـ Enrollment للطالب فقط
      if (user?.role === 'student') {
        try {
          const ed = await getMyEnrollments();
          const isEnrolled = (ed.enrollments || []).some(e => {
            const cid = e.courseID?._id || e.courseID;
            return cid === id || cid?.toString() === id;
          });
          setEnrolled(isEnrolled);

          // ✅ جيب الـ Progress إذا مسجل
          if (isEnrolled) {
            try {
              const pd = await getCourseProgress(id);
              setCompleted(pd.isCompleted);
              setCompletedLessons(pd.completedLessons || []);
            } catch (e) {
              console.error('Failed to fetch progress:', e);
            }
          }
        } catch { }
      }

      // ✅ جيب الـ Ratings
      try {
        const rd = await getCourseRatings(id);
        setAvgRating(rd.avgRating || 0);
        setTotalRatings(rd.totalRatings || 0);
      } catch { }

    } catch { }
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrollLoading(true); setMsg('');
    try {
      await enrollCourse(id);
      setEnrolled(true);
      setMsg('Enrolled successfully! You can now access all lessons.');
      setMsgType('ok');
    } catch (e) {
      setMsg(e.message || 'Failed to enroll');
      setMsgType('err');
    }
    setEnrollLoading(false);
  };

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to unenroll?')) return;
    setEnrollLoading(true);
    try {
      await unenrollCourse(id);
      setEnrolled(false);
      setMsg('Unenrolled successfully');
      setMsgType('ok');
    } catch (e) {
      setMsg(e.message || 'Failed to unenroll');
      setMsgType('err');
    }
    setEnrollLoading(false);
  };

  // ✅ Instructor يشوف الدروس بدون enrollment
  const canView = enrolled || user?.role === 'instructor';

  const handleLessonClick = (lesson) => {
    if (canView) {
      navigate(`/courses/${id}/lessons/${lesson._id}`);
    } else {
      setMsg('Please enroll in this course to access lessons.');
      setMsgType('info');
    }
  };

  const handleDeleteLesson = async (lessonId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(id, lessonId);
      setLessons(p => p.filter(l => l._id !== lessonId));
    } catch (err) {
      alert(err.message || 'Failed to delete lesson');
    }
  };

  if (loading) return <div className="loader-wrap">Loading...</div>;
  if (!course) return <div className="page"><p>Course not found</p></div>;

  const isOwner = user?.role === 'instructor' &&
    (course.instructorID?._id === user._id || course.instructorID?.email === user.email);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
      <div className="detail-grid">

        {/* ── Left ── */}
        <div>
          {/* Course Image */}
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 24, height: 240, background: '#1a1528', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {course.imageUrl
              ? <img src={getImageUrl(course.imageUrl)} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <MdOutlinePlayLesson size={80} color="#f59e0b" />
            }
          </div>

          {course.categoryID && <span className="course-cat" style={{ marginBottom: 12, display: 'inline-block' }}>{course.categoryID.name}</span>}

          <h1 className="syne" style={{ fontSize: 30, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{course.title}</h1>

          <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>{course.description}</p>

          {course.instructorID && (
            <p style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 16 }}>
              Instructor: <span style={{ color: 'var(--accent)' }}>{course.instructorID.name}</span>
            </p>
          )}

          {/* ✅ Average Rating عرض */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <StarRating value={Math.round(avgRating)} readonly size={20} />
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>{avgRating || 0}</span>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>({totalRatings} rating{totalRatings !== 1 ? 's' : ''})</span>
          </div>

          {/* Instructor Actions */}
          {isOwner && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button className="btn btn-outline btn-sm" onClick={() => navigate(`/dashboard/edit-course/${id}`)}><FaEdit /> Edit Course</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/dashboard/add-lesson/${id}`)}>+ Add Lesson</button>
            </div>
          )}

          <div className="divider" />

          {/* Lessons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Course Content ({lessons.length} lessons)</h2>
          </div>

          {/* ✅ Progress Bar للطالب المسجل */}
          {enrolled && lessons.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Your Progress</span>
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>
                  {Math.round((completedLessons.length / lessons.length) * 100)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${(completedLessons.length / lessons.length) * 100}%`, transition: 'width .5s ease' }}
                />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
                {completedLessons.length} of {lessons.length} lessons completed
              </div>
            </div>
          )}

          {lessons.length === 0 ? (
            <div className="card-sm" style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>
              {isOwner ? (
                <>
                  <p style={{ marginBottom: 12 }}>No lessons yet</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/dashboard/add-lesson/${id}`)}>+ Add First Lesson</button>
                </>
              ) : 'No lessons added yet'}
            </div>
          ) : (
            <div className="lesson-list">
              {lessons.map(l => (
                <div key={l._id} className="lesson-row" onClick={() => handleLessonClick(l)}>
                  <div className="lesson-num">{l.order}</div>
                  <div className="lesson-info">
                    <div className="lesson-title">{l.title}</div>
                    <div className="lesson-dur">{l.duration} min</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {completedLessons.includes(l._id) && <span style={{ color: 'var(--accent)', fontSize: 14 }}><FaCheck /></span>}
                    {canView
                      ? <span style={{ fontSize: 13, color: 'var(--accent)' }}>▶ Watch</span>
                      : <FaLock size={16} style={{ marginRight: 4 }} />
                    }
                    {isOwner && (
                      <>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12 }}
                          onClick={e => { e.stopPropagation(); navigate(`/dashboard/courses/${id}/edit-lesson/${l._id}`); }}>Edit</button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px', fontSize: 12 }}
                          onClick={e => handleDeleteLesson(l._id, e)}>Del</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* ── Right — Enroll Box ── */}
        <div>
          <div className="enroll-box">
            <div className="enroll-price">${course.price}</div>

            {/* ✅ Average Rating في الـ Enroll Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              <StarRating value={Math.round(avgRating)} readonly size={16} />
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>{avgRating || 0}</span>
              <span style={{ color: 'var(--text3)', fontSize: 12 }}>({totalRatings})</span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>{lessons.length} lessons included</p>

            {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}

            {!user ? (
              <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/login')}>
                Login to Enroll
              </button>
            ) : user.role === 'instructor' ? (
              <div>
                <div className="badge badge-amber" style={{ padding: '8px 16px', fontSize: 14, marginBottom: 12 }}>
                  Instructor View
                </div>
                {isOwner && (
                  <button className="btn btn-outline btn-full btn-sm" style={{ marginTop: 8 }}
                    onClick={() => navigate(`/dashboard/add-lesson/${id}`)}>
                    + Add Lesson
                  </button>
                )}
              </div>
            ) : enrolled ? (
              <div>
                {completed && (
                  <div className="badge badge-green" style={{ padding: '8px 20px', fontSize: 14, marginBottom: 14, display: 'inline-block' }}>
                    🎉 Course Completed
                  </div>
                )}
                <div className="badge badge-green" style={{ padding: '8px 20px', fontSize: 14, marginBottom: 14, display: 'inline-block' }}>
                  <FaCheck style={{ marginRight: 6 }} /> Enrolled
                </div>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
                  You have full access to all lessons
                </p>
                <button className="btn btn-danger btn-full btn-sm" onClick={handleUnenroll} disabled={enrollLoading}>
                  {enrollLoading ? 'Processing...' : 'Unenroll'}
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-full btn-lg" onClick={handleEnroll} disabled={enrollLoading}>
                {enrollLoading ? 'Enrolling...' : course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse, getCategories, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MdOutlinePlayLesson } from 'react-icons/md';
import { FaGraduationCap, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
const getBg = (id) => ['#1a1528','#0d1a28','#1a1208','#1a0d0d','#081a1a'][(id||'').charCodeAt(0)%5];

export default function DashboardPage() {
  const PAGE_SIZE = 5;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [cats, setCats] = useState([]);
  const [tab, setTab] = useState('courses');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cd, catd] = await Promise.all([
        getCourses(),
        getCategories()
      ]);
      // ✅ فلتر كورسات الـ Instructor بس
      const mine = (cd.courses || []).filter(c =>
        (c.instructorID?._id || c.instructorID) === user?._id ||
        c.instructorID?.email === user?.email
      );
      setCourses(mine);
      setPage(1);
      setCats(catd.categories || []);
    } catch { }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await deleteCourse(id);
      setCourses(p => p.filter(c => c._id !== id));
    } catch (e) {
      alert(e.message || 'Failed to delete');
    }
  };

  const totalPages = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));
  const pagedCourses = courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Instructor Dashboard</h1>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/create-course')}>+ New Course</button>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat-box"><div className="stat-val">{courses.length}</div><div className="stat-label">Total Courses</div></div>
        <div className="stat-box"><div className="stat-val">{cats.length}</div><div className="stat-label">Categories</div></div>
        <div className="stat-box"><div className="stat-val">${courses.reduce((a, c) => a + (c.price || 0), 0)}</div><div className="stat-label">Total Value</div></div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`chip${tab === 'courses' ? ' active' : ''}`} onClick={() => setTab('courses')}>My Courses</button>
        <button className={`chip${tab === 'cats' ? ' active' : ''}`} onClick={() => setTab('cats')}>Categories</button>
      </div>

      {/* Courses Tab */}
      {tab === 'courses' && (
        loading ? <div className="loader-wrap">Loading...</div> :
        courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FaGraduationCap size={48} /></div>
            <div className="empty-title">No courses yet</div>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/create-course')}>Create First Course</button>
          </div>
        ) : (
          pagedCourses.map(c => (
            <div key={c._id} className="dash-row">
              <div className="dash-row-thumb" style={{ background: getBg(c._id) }}>
                {c.imageUrl ? <img src={getImageUrl(c.imageUrl)} alt={c.title} /> : <span><MdOutlinePlayLesson size={48} color="#f59e0b" /></span>}
              </div>
              <div style={{ flex: 1 }}>
                <div className="syne" style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6 }}>{c.description?.slice(0, 80)}...</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-amber">${c.price}</span>
                  {c.categoryID && <span style={{ fontSize: 12, background: 'var(--border)', padding: '2px 8px', borderRadius: 10, color: 'var(--text2)' }}>{c.categoryID.name}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/courses/${c._id}`)}>View</button>
                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/dashboard/add-lesson/${c._id}`)}>+ Lesson</button>
                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/dashboard/edit-course/${c._id}`)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            </div>
          ))
        )
      )}
      {tab === 'courses' && totalPages > 1 && !loading && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><FaChevronLeft /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><FaChevronRight /></button>
        </div>
      )}

      {/* Categories Tab */}
      {tab === 'cats' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 className="syne" style={{ color: '#f1f5f9' }}>All Categories</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard/add-category')}>+ Add Category</button>
          </div>
          {cats.map(c => (
            <div key={c._id} className="card-sm" style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 500, color: '#f1f5f9' }}>{c.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>{c.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessonById, updateLesson } from '../services/api';
import { FaExclamationTriangle, FaArrowLeft, FaCheck } from 'react-icons/fa';
export default function EditLessonPage() {
  const { courseId, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', duration: '', videoUrl: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getLessonById(courseId, id)
      .then(d => {
        const l = d.lesson;
        setForm({
          title: l.title || '',
          content: l.content || '',
          duration: l.duration || '',
          videoUrl: l.videoUrl || ''
        });
      })
      .catch(() => setErr('Failed to load lesson'))
      .finally(() => setFetching(false));
  }, [courseId, id]);

  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.duration) { setErr('Please fill all required fields'); return; }
    setLoading(true); setErr('');
    try {
      await updateLesson(courseId, id, { ...form, duration: Number(form.duration) });
      setOk('Lesson updated successfully!');
      setTimeout(() => navigate(-1), 1200);
    } catch (e) {
      setErr(e.message || 'Failed to update lesson');
    }
    setLoading(false);
  };

  if (fetching) return <div className="loader-wrap">Loading...</div>;

  return (
    <div className="page-sm">
      <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
      <h1 className="page-title">Edit Lesson</h1>
      {err && <div className="alert alert-err"><FaExclamationTriangle style={{ marginRight: 8 }} /> {err}</div>}
      {ok && <div className="alert alert-ok"><FaCheck style={{ marginRight: 8 }} /> {ok}</div>}
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Lesson Title <span>*</span></label>
          <input className="form-control" value={form.title} onChange={update('title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Content <span>*</span></label>
          <textarea className="form-control" value={form.content} onChange={update('content')} rows={6} />
        </div>
        <div className="form-group">
          <label className="form-label">Video URL (optional)</label>
          <input className="form-control" value={form.videoUrl} onChange={update('videoUrl')} placeholder="Leave empty to keep current video" />
        </div>
        <div className="form-group">
          <label className="form-label">Duration (minutes) <span>*</span></label>
          <input className="form-control" type="number" min="1" value={form.duration} onChange={update('duration')} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: 13 }} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="btn btn-outline" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

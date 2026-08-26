import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addLesson } from '../services/api';
import { FaExclamationTriangle, FaArrowLeft, FaFilm } from 'react-icons/fa';

export default function AddLessonPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', duration: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();
    const duration = Number(form.duration);

    if (!title || !content || !form.duration) { setErr('Please fill all required fields'); return; }
    if (title.length < 3) { setErr('Lesson title must be at least 3 characters'); return; }
    if (content.length < 20) { setErr('Lesson content must be at least 20 characters'); return; }
    if (Number.isNaN(duration) || duration < 1) { setErr('Duration must be at least 1 minute'); return; }
    setLoading(true); setErr('');
    try {
      // ✅ FormData عشان نبعت الفيديو
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      fd.append('duration', duration);
      if (videoFile) fd.append('video', videoFile);
      await addLesson(courseId, fd);
      navigate('/dashboard');
    } catch (e) {
      setErr(e.message || 'Failed to add lesson');
    }
    setLoading(false);
  };

  return (
    <div className="page-sm">
      <button className="back-btn" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to Dashboard</button>
      <h1 className="page-title">Add New Lesson</h1>
      {err && <div className="alert alert-err"><FaExclamationTriangle style={{ marginRight: 8 }} /> {err}</div>}
      <form onSubmit={handleSubmit} className="card">

        <div className="form-group">
          <label className="form-label">Lesson Title <span>*</span></label>
          <input className="form-control" value={form.title} onChange={update('title')} placeholder="e.g. Introduction to Express" />
        </div>

        <div className="form-group">
          <label className="form-label">Content <span>*</span></label>
          <textarea className="form-control" value={form.content} onChange={update('content')} placeholder="Write the lesson content here..." rows={5} />
        </div>

        {/* ✅ Video Upload من اللوكال */}
        <div className="form-group">
          <label className="form-label">Video File</label>
          <div className="file-upload">
            <input type="file" accept="video/*" onChange={handleVideo} />
            {videoPreview ? (
              <div className="file-preview">
                <video controls src={videoPreview} style={{ width: '100%', maxHeight: 180 }} />
              </div>
            ) : (
              <>
                <div className="file-upload-icon"><FaFilm size={32} /></div>
                <div className="file-upload-text">Click to upload video</div>
                <div className="file-upload-hint">MP4, WEBM, MOV up to 500MB</div>
              </>
            )}
          </div>
          {videoFile && <div className="file-name"><FaFilm size={14} style={{ marginRight: 4 }} /> {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Duration (minutes) <span>*</span></label>
          <input className="form-control" type="number" min="1" value={form.duration} onChange={update('duration')} placeholder="e.g. 30" />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: 13 }} type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Add Lesson'}
          </button>
          <button className="btn btn-outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

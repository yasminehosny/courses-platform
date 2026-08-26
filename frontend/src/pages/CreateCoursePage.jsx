import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, getCategories } from '../services/api';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', categoryID: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(d => setCats(d.categories || [])).catch(() => { });
  }, []);

  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!title || !description || form.price === '') { setErr('Please fill all required fields'); return; }
    if (title.length < 3) { setErr('Title must be at least 3 characters'); return; }
    if (description.length < 20) { setErr('Description must be at least 20 characters'); return; }
    if (Number.isNaN(price) || price < 0) { setErr('Price must be a valid number >= 0'); return; }
    setLoading(true); setErr('');
    try {
      // ✅ FormData عشان نبعت الصورة مع البيانات
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('price', price);
      if (form.categoryID) fd.append('categoryID', form.categoryID);
      if (imageFile) fd.append('image', imageFile);
      await createCourse(fd);
      navigate('/dashboard');
    } catch (e) {
      setErr(e.message || 'Failed to create course');
    }
    setLoading(false);
  };

  return (
    <div className="page-sm">
      <button className="back-btn" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to Dashboard</button>
      <h1 className="page-title">Create New Course</h1>
      {err && <div className="alert alert-err"><FaExclamationTriangle style={{ marginRight: 8 }} /> {err}</div>}
      <form onSubmit={handleSubmit} className="card">
        {/* Course Image Upload */}
        <div className="form-group">
          <label className="form-label">Course Image</label>
          <div className="file-upload">
            <input type="file" accept="image/*" onChange={handleImage} />
            {imagePreview ? (
              <div className="file-preview"><img src={imagePreview} alt="preview" /></div>
            ) : (
              <>
                <div className="file-upload-icon">🖼️</div>
                <div className="file-upload-text">Click to upload course image</div>
                <div className="file-upload-hint">PNG, JPG, WEBP up to 10MB</div>
              </>
            )}
          </div>
          {imageFile && <div className="file-name">📷 {imageFile.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Course Title <span>*</span></label>
          <input className="form-control" value={form.title} onChange={update('title')} placeholder="e.g. Complete Node.js Course" />
        </div>

        <div className="form-group">
          <label className="form-label">Description <span>*</span></label>
          <textarea className="form-control" value={form.description} onChange={update('description')} placeholder="What will students learn in this course?" rows={4} />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-control" value={form.categoryID} onChange={update('categoryID')}>
            <option value="">Select a category</option>
            {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Price ($) <span>*</span></label>
          <input className="form-control" type="number" min="0" value={form.price} onChange={update('price')} placeholder="0 for free" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: 13 }} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button className="btn btn-outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

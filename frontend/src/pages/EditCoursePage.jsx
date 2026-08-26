import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseById, updateCourse, getCategories, getImageUrl } from '../services/api';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', categoryID: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getCourseById(id), getCategories()]).then(([cd, catd]) => {
      const c = cd.course;
      setForm({
        title: c.title || '',
        description: c.description || '',
        categoryID: c.categoryID?._id || c.categoryID || '',
        price: c.price || ''
      });
      if (c.imageUrl) setImagePreview(getImageUrl(c.imageUrl));
      setCats(catd.categories || []);
    }).catch(() => { });
  }, [id]);

  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('price', Number(form.price));
      if (form.categoryID) fd.append('categoryID', form.categoryID);
      if (imageFile) fd.append('image', imageFile);
      await updateCourse(id, fd);
      navigate('/dashboard');
    } catch (e) {
      setErr(e.message || 'Failed to update');
    }
    setLoading(false);
  };

  return (
    <div className="page-sm">
      <button className="back-btn" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back</button>
      <h1 className="page-title">Edit Course</h1>
      {err && <div className="alert alert-err"><FaExclamationTriangle style={{ marginRight: 8 }} /> {err}</div>}
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Course Image</label>
          <div className="file-upload">
            <input type="file" accept="image/*" onChange={handleImage} />
            {imagePreview
              ? <div className="file-preview"><img src={imagePreview} alt="preview" /></div>
              : <><div className="file-upload-icon">🖼️</div><div className="file-upload-text">Click to change image</div></>
            }
          </div>
          {imageFile && <div className="file-name">📷 {imageFile.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-control" value={form.title} onChange={update('title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={form.description} onChange={update('description')} rows={4} />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-control" value={form.categoryID} onChange={update('categoryID')}>
            <option value="">Select category</option>
            {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Price ($)</label>
          <input className="form-control" type="number" min="0" value={form.price} onChange={update('price')} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: 13 }} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="btn btn-outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCategory, getApiErrorMessage } from '../services/api';
import { FaExclamationTriangle, FaCheck, FaArrowLeft } from 'react-icons/fa';

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);
  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) { setErr('Please fill all fields'); return; }
    if (form.name.length < 3) { setErr('Name must be at least 3 characters'); return; }
    if (form.description.length < 10) { setErr('Description must be at least 10 characters'); return; }
    setLoading(true); setErr('');
    try {
      await addCategory(form);
      setOk('Category added successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (e) {
      setErr(getApiErrorMessage(e, 'Failed to add category'));
    }
    setLoading(false);
  };

  return (
    <div className="page-sm">
      <button className="back-btn" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back</button>
      <h1 className="page-title">Add Category</h1>
      {err && <div className="alert alert-err"><FaExclamationTriangle style={{ marginRight: 8 }} /> {err}</div>}
      {ok && <div className="alert alert-ok"><FaCheck style={{ marginRight: 8 }} /> {ok}</div>}
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Category Name <span>*</span></label>
          <input className="form-control" value={form.name} onChange={update('name')} placeholder="e.g. Programming (min 3 chars)" />
        </div>
        <div className="form-group">
          <label className="form-label">Description <span>*</span></label>
          <textarea className="form-control" value={form.description} onChange={update('description')} placeholder="Brief description of this category (min 10 chars)" rows={3} />
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{form.description.length}/10 minimum characters</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: 13 }} type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
          <button className="btn btn-outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

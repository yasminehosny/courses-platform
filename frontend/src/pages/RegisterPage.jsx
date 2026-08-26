import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import {
  FaExclamationTriangle,
  FaCheck,
  FaUserGraduate,
  FaChalkboardTeacher
} from 'react-icons/fa';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);
  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setErr('Please fill all fields'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setLoading(true); setErr('');
    try {
      await register(form);
      setOk('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (e) {
      setErr(e.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <span className="auth-logo syne">LearnHub</span>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start your learning journey today</p>
         
        {err && (
          <div className="alert alert-err" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaExclamationTriangle /> {err}
          </div>
        )}

       
        {ok && (
          <div className="alert alert-ok" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaCheck /> {ok}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name </label>
            <input className="form-control" value={form.name} onChange={update('name')} placeholder="Ahmed Ali" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password </label>
            <input className="form-control" type="password" value={form.password} onChange={update('password')} placeholder="At least 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-grid">
              <button
                type="button"
                className={`role-option${form.role === 'student' ? ' selected' : ''}`}
                onClick={() => setForm(p => ({ ...p, role: 'student' }))}
              >
                <span className="role-icon">
                  <FaUserGraduate />
                </span>
                Student
              </button>

              <button
                type="button"
                className={`role-option${form.role === 'instructor' ? ' selected' : ''}`}
                onClick={() => setForm(p => ({ ...p, role: 'instructor' }))}
              >
                <span className="role-icon">
                  <FaChalkboardTeacher />
                </span>
                Instructor
              </button>

            </div>
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-switch">
          Have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const update = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setErr('Please fill all fields'); return; }
    setLoading(true); setErr('');
    try {
      const d = await login(form);
  
      //  احفظ التوكن الأول عشان getMe يلاقيه
      localStorage.setItem('token', d.accessToken);
  
      const me = await getMe();
      loginUser(d.accessToken, me.user);
  
      navigate(me.user.role === 'instructor' ? '/dashboard' :
               me.user.role === 'admin' ? '/admin' : '/');
    } catch (e) {
      localStorage.removeItem('token'); 
      setErr(e.message || 'Login failed');
    }
    setLoading(false);
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <span className="auth-logo syne">LearnHub</span>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue learning</p>
        {err && <div className="alert alert-err"> {err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email </label>
            <input className="form-control" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password </label>
            <input className="form-control" type="password" value={form.password} onChange={update('password')} placeholder="••••••" />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-switch">
          No account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react'
import { Mail, LockKeyhole, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import api from '../api'

export default function Login({ go }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('employeeUser', JSON.stringify(res.data))
      if (remember) localStorage.setItem('rememberLogin', 'true')
      go('dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-art login-art">
        <div className="art-shape shape-1"></div>
        <div className="art-shape shape-2"></div>
        <div className="brand-mark">E</div>

        <div className="art-content">
          <div className="floating-card card-a">
            <div className="mini-avatar">👩🏻</div>
            <div>
              <strong>Employee Hub</strong>
              <span>Manage your team</span>
            </div>
          </div>
          <div className="floating-card card-b">
            <span className="dot green"></span>
            <div>
              <strong>New Employees</strong>
              <span>Easy & organized</span>
            </div>
          </div>
          <div className="art-title">
            <h2>Smart Employee<br />Management</h2>
            <p>Manage employees, details and updates from one simple dashboard.</p>
          </div>
        </div>
      </section>

      <section className="auth-form-area">
        <div className="auth-box">
          <div className="top-logo">E</div>
          <h1>Hello Again!</h1>
          <p className="auth-subtitle">Sign in to manage your employee records</p>

          <form onSubmit={submit}>
            <label>Email</label>
            <div className="input-wrap">
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Mail size={18} />
            </div>

            <label>Password</label>
            <div className="input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="login-options">
              <label className="check-label">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember Me
              </label>
              <button type="button" className="link-button">Recovery Password</button>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="primary-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="google-btn">
              <span className="google-g">G</span> Sign in with Google
            </button>
          </form>

          <p className="bottom-text">
            Don't have an account?
            <button className="link-button signup-link" onClick={() => go('signup')}>Sign Up</button>
          </p>
        </div>
      </section>
    </div>
  )
}

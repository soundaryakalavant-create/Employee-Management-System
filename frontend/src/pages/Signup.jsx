import { useState } from 'react'
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, Check } from 'lucide-react'
import api from '../api'

export default function Signup({ go }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!agree) {
      setError('Please accept the terms and agreement')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/signup', form)
      setMessage(res.data.message)
      setTimeout(() => go('login'), 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <section className="signup-form-side">
        <div className="pro-ribbon">PRO</div>
        <div className="signup-inner">
          <div className="small-brand">E</div>
          <h1>Create Account</h1>
          <p className="signup-caption">Create your employee management account</p>

          <form onSubmit={submit}>
            <div className="signup-input">
              <UserRound size={18} />
              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>

            <div className="signup-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="signup-input">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="terms">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span><Check size={13} /></span>
              I accept the terms of the agreement
            </label>

            {error && <div className="error-box">{error}</div>}
            {message && <div className="success-box">{message}</div>}

            <button className="signup-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>
        </div>
      </section>

      <section className="signup-promo">
        <div className="circle circle-one"></div>
        <div className="circle circle-two"></div>
        <div className="promo-content">
          <div className="promo-icon">✓</div>
          <h2>Get Started</h2>
          <p>Already have an account?</p>
          <button onClick={() => go('login')}>Log in</button>
        </div>
      </section>
    </div>
  )
}

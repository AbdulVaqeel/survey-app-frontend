import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        :root { --font-display: 'Sora', sans-serif; }

        .sp-login-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          display: flex;
          min-height: 100vh;
        }

        .sp-submit-btn {
          padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 600;
          border: none; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s, transform 0.15s; margin-top: 4px;
          width: 100%; cursor: pointer;
        }
        .sp-submit-btn:not(:disabled):hover { transform: translateY(-1px); }

        .login-left-panel {
          flex: 1.2;
          display: none;
          position: relative;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 80px 60px;
          background-image: linear-gradient(to top, rgba(13,17,23,0.95) 0%, rgba(13,61,56,0.4) 100%),
            url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80');
          background-size: cover;
          background-position: center;
        }

        .login-right-panel {
          flex: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #f8fafc;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.12);
        }

        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; }
          .login-right-panel { background: transparent; }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 36px 24px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          }
          .login-right-panel {
            padding: 24px 16px;
            align-items: flex-start;
            padding-top: 40px;
          }
        }
      `}</style>

      <div className="sp-login-root">
        {/* Left panel — hidden on mobile */}
        <div className="login-left-panel">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 480 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', color: '#fff',
              fontSize: 32, fontWeight: 700, lineHeight: 1.25,
              marginBottom: 16, letterSpacing: '-0.5px',
            }}>
              Understand every step of your customer's journey.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, fontWeight: 400 }}>
              Analyze feedback metrics, map interactions, and build high-impact experience funnels with SurveyPulse.
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-right-panel">
          <div className="login-card">
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, textDecoration: 'none' }}>
              <span style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, #0d9488, #f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)',
              }}>S</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                color: '#0f172a', letterSpacing: '-0.3px',
              }}>SurveyPulse</span>
            </Link>

            <div style={{ marginBottom: 8 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
                color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6,
              }}>Welcome back</h1>
              <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>Sign in to your account to continue</p>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '10px 14px', margin: '16px 0',
                fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8,
                lineHeight: 1.4, fontWeight: 500,
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
              {/* Username */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Username / Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="vaqeel@vs.sa"
                  autoComplete="username"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 9,
                    border: '1.5px solid #e2e8f0', fontSize: 14,
                    color: '#0f172a', background: '#f8fafc',
                    outline: 'none', transition: 'border-color 0.2s',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#0d9488')}
                  onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Password</label>
                  <span style={{ fontSize: 12, color: '#0d9488', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{
                      width: '100%', padding: '11px 40px 11px 14px', borderRadius: 9,
                      border: '1.5px solid #e2e8f0', fontSize: 14,
                      color: '#0f172a', background: '#f8fafc',
                      outline: 'none', transition: 'border-color 0.2s',
                      boxSizing: 'border-box', fontFamily: 'inherit',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')}
                    onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', padding: 0,
                    color: '#64748b', fontSize: 16, cursor: 'pointer',
                  }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="sp-submit-btn"
                style={{
                  background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #0d9488, #0f766e)',
                  color: loading ? '#64748b' : '#fff',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Signing in…' : 'Log in →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
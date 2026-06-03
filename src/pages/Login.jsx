import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSSOClick = (provider) => {
    alert(`${provider} SSO integration — configure OAuth redirect URI in your ${provider} app settings.`)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(160deg, #0d1117 0%, #0d3d38 100%)',
    }}>
      {/* Integrated Font & Action Button Mechanics */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        
        :root {
          --font-display: 'Sora', sans-serif;
        }

        .sp-login-root { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          display: flex;
          min-height: 100vh;
        }

        .sp-submit-btn {
          padding: 14px; 
          border-radius: 10px; 
          font-size: 15px; 
          font-weight: 600; 
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s, transform 0.15s;
          margin-top: 4px;
        }

        .sp-submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
        }

        @media (min-width: 900px) {
          .left-panel { display: flex !important; }
        }
      `}</style>

      <div className="sp-login-root">
        {/* Left panel */}
        <div style={{
          flex: 1, display: 'none',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px',
        }}
          className="left-panel"
        >
          {/* decorative content on desktop */}
        </div>

        {/* Right panel — form */}
        <div style={{
          flex: 1, minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 24px',
        }}>
          <div style={{
            width: '100%', maxWidth: 440,
            background: 'var(--white)', borderRadius: 24,
            padding: '48px 44px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
          }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, textDecoration: 'none' }}>
              <span style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, #0d9488, #f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800, color: '#fff',
                fontFamily: 'var(--font-display)',
              }}>S</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                color: 'var(--ink)', letterSpacing: '-0.3px',
              }}>SurveyPulse</span>
            </Link>

            {/* <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
              color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: 6,
            }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.5, fontWeight: 400 }}>
              Sign in to your account to continue
            </p> */}

            {/* SSO Buttons */}
            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              <button
                onClick={() => handleSSOClick('Microsoft')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                  background: 'var(--white)', color: 'var(--ink)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
              >
                <MicrosoftIcon />
                Continue with Microsoft
              </button>
              <button
                onClick={() => handleSSOClick('Google')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                  background: 'var(--white)', color: 'var(--ink)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div> */}

            {/* Divider */}
            {/* <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.02em' }}>or sign in with email</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div> */}

            {/* Error banner */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '10px 14px', marginBottom: 20,
                fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8,
                lineHeight: 1.4, fontWeight: 500
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Username */}
              <div>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600,
                  color: 'var(--ink-soft)', marginBottom: 6,
                }}>Username / Email</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="vaqeel@vs.sa"
                  autoComplete="username"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 9,
                    border: '1.5px solid var(--border)', fontSize: 14,
                    color: 'var(--ink)', background: 'var(--surface)',
                    outline: 'none', transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>
                    Password
                  </label>
                  <span style={{ fontSize: 12, color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot password?
                  </span>
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
                      border: '1.5px solid var(--border)', fontSize: 14,
                      color: 'var(--ink)', background: 'var(--surface)',
                      outline: 'none', transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', padding: 0,
                      color: 'var(--muted)', fontSize: 16, cursor: 'pointer',
                    }}
                  >
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
                  background: loading
                    ? 'var(--border)'
                    : 'linear-gradient(135deg, #0d9488, #0f766e)',
                  color: loading ? 'var(--muted)' : '#fff',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Signing in…' : 'Log in →'}
              </button>
            </form>

            {/* <p style={{
              textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--muted)',
              fontWeight: 400
            }}>
              Don't have an account?{' '}
              <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>
                Sign up free
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
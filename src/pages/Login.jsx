import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'
import api from '../utils/api'

// ── Shared input style ────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 9,
  border: '1.5px solid #e2e8f0', fontSize: 14,
  color: '#0f172a', background: '#f8fafc',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box', fontFamily: 'inherit',
}

export default function Login() {
  const navigate    = useNavigate()
  const { login }   = useAuth()

  // ── Tab: 'login' | 'register' ─────────────────────────────────────────────
  const [tab, setTab] = useState('login')

  // Login fields
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showRegConfirm, setShowRegConfirm] = useState(false)
  const [showLoginPass, setShowLoginPass] = useState(false)

  // Register fields
  const [regFullName, setRegFullName] = useState('')
  const [regUsername,  setRegUsername]  = useState('')
  const [regEmail,     setRegEmail]     = useState('')
  const [regPassword,  setRegPassword]  = useState('')
  const [regConfirm,   setRegConfirm]   = useState('')
  const [showRegPass,  setShowRegPass]  = useState(false)

  // Shared state
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    try {
      await login(loginUsername.trim(), loginPassword)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Register handler ──────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        full_name: regFullName.trim(),
        username:  regUsername.trim(),
        email:     regEmail.trim(),
        password:  regPassword,
      })
      // Store token + user exactly like login does
      const { access_token, user } = res.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setSuccess('Account created! Check your email for your credentials. Redirecting…')
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        :root { --font-display: 'Sora', sans-serif; }

        .sp-login-root { font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; display: flex; min-height: 100vh; }

        .login-left-panel {
          flex: 1.2; display: none; position: relative;
          flex-direction: column; align-items: flex-start; justify-content: flex-end;
          padding: 80px 60px;
          background-image: linear-gradient(to top, rgba(13,17,23,0.95) 0%, rgba(13,61,56,0.4) 100%),
            url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80');
          background-size: cover; background-position: center;
        }

        .login-right-panel {
          flex: 1; min-height: 100vh; display: flex;
          align-items: center; justify-content: center;
          padding: 40px 20px; background: #f8fafc;
        }

        .login-card {
          width: 100%; max-width: 460px; background: #ffffff;
          border-radius: 24px; padding: 44px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.12);
        }

        .sp-tab-btn {
          flex: 1; padding: 9px; border: none; background: transparent;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          border-radius: 8px; transition: all 0.2s;
        }
        .sp-tab-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .sp-tab-btn:not(.active) { color: #64748b; }

        .sp-submit-btn {
          width: 100%; padding: 13px; border-radius: 10px; font-size: 15px;
          font-weight: 600; border: none; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: transform 0.15s; margin-top: 4px; cursor: pointer;
        }
        .sp-submit-btn:not(:disabled):hover { transform: translateY(-1px); }

        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; }
          .login-right-panel { background: transparent; }
        }
        @media (max-width: 480px) {
          .login-card { padding: 32px 20px; border-radius: 18px; }
          .login-right-panel { padding: 20px 14px; align-items: flex-start; padding-top: 32px; }
        }
      `}</style>

      <div className="sp-login-root">

        {/* Left panel */}
        <div className="login-left-panel">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 16, letterSpacing: '-0.5px' }}>
              Understand every step of your customer's journey.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, fontWeight: 400 }}>
              Analyze feedback metrics, map interactions, and build high-impact experience funnels with SurveyMatrix.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right-panel">
          <div className="login-card">

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, textDecoration: 'none' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #0d9488, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>S</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#0f172a', letterSpacing: '-0.3px' }}>SurveyMatrix</span>
            </Link>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 28 }}>
              <button className={`sp-tab-btn${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); setSuccess('') }}>Log in</button>
              <button className={`sp-tab-btn${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setError(''); setSuccess('') }}>Create account</button>
            </div>

            {/* Error / success banners */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                ✅ {success}
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Username</label>
                  <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
                    placeholder="username" autoComplete="username" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Password</label>
                    <span style={{ fontSize: 12, color: '#0d9488', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type={showLoginPass ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••" autoComplete="current-password"
                      style={{ ...inputStyle, paddingRight: 40 }}
                      onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    <button type="button" onClick={() => setShowLoginPass(o => !o)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: '#64748b', fontSize: 16, cursor: 'pointer' }}>
                      {showLoginPass ? '👁️' : '👁'}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="sp-submit-btn"
                  style={{ background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #0d9488, #0f766e)', color: loading ? '#64748b' : '#fff', boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Signing in…' : 'Log in →'}
                </button>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Full Name</label>
                  <input type="text" value={regFullName} onChange={e => setRegFullName(e.target.value)}
                    placeholder="full name" autoComplete="name" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Username</label>
                  <input type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)}
                    placeholder="user name" autoComplete="username" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Letters, numbers, underscores. 3–50 characters.</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    placeholder="email" autoComplete="email" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Your welcome email with credentials will be sent here.</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showRegPass ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••" autoComplete="new-password"
                      style={{ ...inputStyle, paddingRight: 40 }}
                      onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    <button type="button" onClick={() => setShowRegPass(o => !o)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: '#64748b', fontSize: 16, cursor: 'pointer' }}>
                      {showRegPass ? '👁️' : '👁'}
                    </button>
                  </div>
                </div>

               <div>
  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Confirm Password</label>
  <div style={{ position: 'relative' }}>
    <input type={showRegConfirm ? 'text' : 'password'} value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
      placeholder="••••••••" autoComplete="new-password"
      style={{ ...inputStyle, paddingRight: 40 }}
      onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
    <button type="button" onClick={() => setShowRegConfirm(o => !o)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: '#64748b', fontSize: 16, cursor: 'pointer' }}>
      {showRegConfirm ? '👁️' : '👁'}
    </button>
  </div>
</div>

                <button type="submit" disabled={loading} className="sp-submit-btn"
                  style={{ background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #0d9488, #0f766e)', color: loading ? '#64748b' : '#fff', boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                  {loading ? 'Creating account…' : 'Create account →'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
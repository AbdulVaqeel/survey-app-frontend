import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'

const MOCK_SURVEYS  = [
  { id: 1, title: 'Customer Satisfaction Q2',  status: 'active',  responses: 142, completion: 78 },
  { id: 2, title: 'NPS – Enterprise Clients',   status: 'active',  responses: 89,  completion: 62 },
  { id: 3, title: 'Onboarding Experience 2025', status: 'closed',  responses: 310, completion: 95 },
  { id: 4, title: 'Product Feedback – v3.0',    status: 'draft',   responses: 0,   completion: 0  },
  { id: 5, title: 'Employee Engagement H1',     status: 'active',  responses: 54,  completion: 41 },
  { id: 6, title: 'Website UX Audit',           status: 'draft',   responses: 0,   completion: 0  },
]
const MOCK_ACTIVITY = [
  { id: 1, icon: '📬', text: 'New response on Customer Satisfaction Q2', time: '2 min ago' },
  { id: 2, icon: '🆕', text: 'Survey "NPS – Enterprise Clients" created',  time: '1 hr ago'  },
  { id: 3, icon: '✅', text: '"Onboarding Experience 2025" closed successfully', time: '3 hrs ago' },
  { id: 4, icon: '📤', text: 'Export for Product Feedback downloaded',    time: 'Yesterday'  },
]

const STATUS_COLORS = {
  active: { bg: '#dcfce7', text: '#16a34a' },
  draft:  { bg: '#fef9c3', text: '#a16207' },
  closed: { bg: '#f1f5f9', text: '#64748b' },
}
const TABS      = ['All', 'Active', 'Draft', 'Closed']
const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard'   },
  { icon: '📋', label: 'My Surveys'  },
  { icon: '📊', label: 'Analytics'   },
  { icon: '👥', label: 'Respondents' },
  { icon: '⚙️', label: 'Settings'    },
]

function StatCard({ icon, label, value, trend, color = '#0d9488' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '20px 18px',
      border: '1px solid #e2e8f0', flex: '1 1 160px', minWidth: 0,
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{label}</div>
      {trend && <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: trend.startsWith('+') ? '#16a34a' : '#dc2626' }}>{trend} this week</div>}
    </div>
  )
}

function MiniBar({ pct, color = '#0d9488' }) {
  return (
    <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.8s ease' }} />
    </div>
  )
}

function SurveyModal({ mode, survey, onClose, onSave }) {
  const [title,  setTitle]  = useState(survey?.title  || '')
  const [status, setStatus] = useState(survey?.status || 'draft')
  const [error,  setError]  = useState('')
  const handleSubmit = () => {
    if (!title.trim()) { setError('Survey title is required.'); return }
    onSave({ title: title.trim(), status })
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)', padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,5vw,32px)', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>{mode === 'new' ? '+ Create New Survey' : '✏️ Edit Survey'}</h2>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Survey Title</label>
        <input autoFocus value={title} onChange={e => { setTitle(e.target.value); setError('') }} placeholder="e.g. Customer Satisfaction Q3" onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14, border: error ? '1.5px solid #dc2626' : '1.5px solid #e2e8f0', outline: 'none', boxSizing: 'border-box', marginBottom: 4, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = error ? '#dc2626' : '#e2e8f0')} />
        {error && <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>{error}</div>}
        <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6, marginTop: 16 }}>Status</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['draft', 'active', 'closed'].map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, border: status === s ? '2px solid #0d9488' : '1.5px solid #e2e8f0', background: status === s ? '#f0fdfa' : '#fff', color: status === s ? '#0d9488' : '#64748b', cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: '#fff', cursor: 'pointer' }}>{mode === 'new' ? 'Create Survey' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ survey, onClose, onConfirm }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,5vw,32px)', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🗑️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>Delete Survey?</h2>
        <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>"<strong>{survey.title}</strong>" will be permanently deleted.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function SurveyDetailModal({ survey, onClose, onEdit, onDelete }) {
  const sc = STATUS_COLORS[survey.status] || STATUS_COLORS.draft
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,5vw,32px)', width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{survey.title}</h2>
            <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{survey.status}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[{ label: 'Responses', value: survey.responses.toLocaleString(), icon: '📬' }, { label: 'Completion', value: `${survey.completion}%`, icon: '📈' }].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>Completion Progress</div>
          <MiniBar pct={survey.completion} color={survey.status === 'active' ? '#0d9488' : survey.status === 'closed' ? '#64748b' : '#f59e0b'} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onDelete} style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer' }}>🗑 Delete</button>
          <button onClick={onEdit} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: '#fff', cursor: 'pointer' }}>✏️ Edit Survey</button>
        </div>
      </div>
    </div>
  )
}

function SettingsModal({ user, onClose, onSave }) {
  const [fullName, setFullName] = useState(user.full_name || '')
  const [username, setUsername] = useState(user.username  || '')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,5vw,32px)', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>⚙️ Settings</h2>
        {[{ label: 'Full Name', value: fullName, setter: setFullName }, { label: 'Username', value: username, setter: setUsername }].map(({ label, value, setter }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{label}</label>
            <input value={value} onChange={e => setter(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e2e8f0', outline: 'none', boxSizing: 'border-box', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave({ full_name: fullName, username })} style={{ flex: 2, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: '#fff', cursor: 'pointer' }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 16, left: 16, maxWidth: 380, margin: '0 auto', zIndex: 200, background: type === 'success' ? '#0d9488' : '#dc2626', color: '#fff', borderRadius: 12, padding: '12px 18px', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', animation: 'toastIn 0.25s ease', display: 'flex', alignItems: 'center', gap: 8 }}>
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  // ── Pull real logged-in user from useAuth ──────────────────────────────────
  const { logout, user: authUser } = useAuth()

  // Initialise display user from authUser — falls back gracefully if null
  const [user,            setUser]           = useState(authUser || { full_name: 'User', username: '' })
  const [surveys,         setSurveys]        = useState(MOCK_SURVEYS)
  const [activity,        setActivity]       = useState(MOCK_ACTIVITY)
  const [activeTab,       setActiveTab]      = useState('All')
  const [sidebarOpen,     setSidebarOpen]    = useState(false)
  const [activeNav,       setActiveNav]      = useState('Dashboard')
  const [searchQuery,     setSearchQuery]    = useState('')
  const [showProfileMenu, setShowProfileMenu]= useState(false)
  const [showNewModal,    setShowNewModal]   = useState(false)
  const [editSurvey,      setEditSurvey]     = useState(null)
  const [viewSurvey,      setViewSurvey]     = useState(null)
  const [deleteSurvey,    setDeleteSurvey]   = useState(null)
  const [showSettings,    setShowSettings]   = useState(false)
  const [toast,           setToast]          = useState(null)
  const [isMobile,        setIsMobile]       = useState(window.innerWidth < 768)

  // ── Sync display user whenever authUser changes (e.g. after login) ──────────
  useEffect(() => {
    if (authUser) setUser(authUser)
  }, [authUser])

  // ── Responsive sidebar ───────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Click-outside handlers ───────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = e => {
      if (!e.target.closest('.sp-profile-menu')) setShowProfileMenu(false)
      if (isMobile && !e.target.closest('.sp-sidebar') && !e.target.closest('.sp-menu-btn')) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile])

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalSurveys   = surveys.length
  const activeSurveys  = surveys.filter(s => s.status === 'active').length
  const responsesToday = surveys.reduce((sum, s) => sum + (s.status === 'active' ? Math.floor(s.responses * 0.08) : 0), 0)
  const completionRate = surveys.length ? Math.round(surveys.reduce((sum, s) => sum + s.completion, 0) / surveys.length) : 0

  const filtered = surveys
    .filter(s => activeTab === 'All' || s.status.toLowerCase() === activeTab.toLowerCase())
    .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const showToast   = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const addActivity = useCallback((icon, text) => setActivity(prev => [{ id: Date.now(), icon, text, time: 'Just now' }, ...prev.slice(0, 6)]), [])

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCreateSurvey = data => {
    setSurveys(prev => [{ ...data, id: Date.now(), responses: 0, completion: 0 }, ...prev])
    addActivity('🆕', `Survey "${data.title}" created`)
    setShowNewModal(false)
    showToast(`"${data.title}" created successfully!`)
  }
  const handleEditSurvey = data => {
    if (!editSurvey) return
    setSurveys(prev => prev.map(s => s.id === editSurvey.id ? { ...s, ...data } : s))
    addActivity('✏️', `Survey "${data.title}" updated`)
    setEditSurvey(null); setViewSurvey(null)
    showToast(`"${data.title}" updated successfully!`)
  }
  const handleDeleteSurvey = () => {
    if (!deleteSurvey) return
    setSurveys(prev => prev.filter(s => s.id !== deleteSurvey.id))
    addActivity('🗑️', `Survey "${deleteSurvey.title}" deleted`)
    setDeleteSurvey(null); setViewSurvey(null)
    showToast(`"${deleteSurvey.title}" deleted.`, 'error')
  }
  const handleSaveSettings = data => { setUser(data); setShowSettings(false); showToast('Settings saved!') }
  const handleNavClick = label => {
    setActiveNav(label)
    if (label === 'Settings') setShowSettings(true)
    if (isMobile) setSidebarOpen(false)
  }
  const handleLogout = () => { setShowProfileMenu(false); logout(); navigate('/login') }

  // ── Safe display values ───────────────────────────────────────────────────────
  const displayName   = user?.full_name || user?.username || 'User'
  const displayInitial = displayName[0].toUpperCase()
  const displayUsername = user?.username || ''

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8fafc', position: 'relative' }} className="sp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        :root { --font-display: 'Sora', sans-serif; }
        .sp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-btn-primary { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: none; font-family: 'Plus Jakarta Sans', sans-serif; background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 4px 12px rgba(13,148,136,0.3); cursor: pointer; transition: transform 0.15s; white-space: nowrap; }
        .sp-btn-primary:hover { transform: translateY(-1px); }
        @keyframes modalIn  { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes toastIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(6px); }  to { opacity:1; transform:translateY(0); } }
        .sp-row { animation: fadeUp 0.22s ease both; }
        .sp-sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 39; }
        @media (max-width: 767px) {
          .sp-sidebar { position: fixed !important; top: 0; left: 0; height: 100vh; z-index: 40; }
          .sp-sidebar-overlay.active { display: block; }
          .sp-stat-cards { flex-wrap: wrap; }
          .sp-table-wrap { font-size: 12px; }
          .sp-table-wrap th, .sp-table-wrap td { padding: 10px 12px !important; }
        }
      `}</style>

      {isMobile && sidebarOpen && (
        <div className="sp-sidebar-overlay active" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className="sp-sidebar" style={{ width: sidebarOpen ? 240 : (isMobile ? 0 : 64), background: '#0f172a', display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ padding: sidebarOpen ? '24px 20px' : '24px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'linear-gradient(135deg, #0d9488, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 16 }}>S</div>
          {sidebarOpen && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>SurveyPulse</span>}
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(({ icon, label }) => {
            const isActive = activeNav === label
            return (
              <div key={label} onClick={() => handleNavClick(label)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: sidebarOpen ? '10px 20px' : '10px 16px', cursor: 'pointer', background: isActive ? 'rgba(13,148,136,0.2)' : 'transparent', borderLeft: isActive ? '3px solid #0d9488' : '3px solid transparent', transition: 'background 0.15s', margin: '2px 0' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                {sidebarOpen && <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>{label}</span>}
              </div>
            )
          })}
        </nav>

        {/* Sidebar user strip — shows real logged-in user */}
        <div style={{ padding: sidebarOpen ? '16px 20px' : '16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #0d9488, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{displayInitial}</div>
          {sidebarOpen && (
            <>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                {displayUsername && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>@{displayUsername}</div>}
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 16, padding: 4, cursor: 'pointer', flexShrink: 0 }} title="Sign out">↩</button>
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ padding: '0 16px', height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <button className="sp-menu-btn" onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b', padding: 4, flexShrink: 0 }}>☰</button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px,3vw,20px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8' }}>🔍</span>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search surveys..."
                  style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', width: 180, background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
              </div>
            )}
            <button className="sp-btn-primary" onClick={() => setShowNewModal(true)}>+ {isMobile ? '' : 'New '}Survey</button>

            {/* Profile dropdown — shows real logged-in user */}
            <div style={{ position: 'relative' }} className="sp-profile-menu">
              <div onClick={() => setShowProfileMenu(o => !o)} style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>
                {displayInitial}
              </div>
              {showProfileMenu && (
                <div style={{ position: 'absolute', top: 42, right: 0, zIndex: 50, background: '#fff', borderRadius: 12, width: 190, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{displayName}</div>
                    {displayUsername && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>@{displayUsername}</div>}
                  </div>
                  <div onClick={() => { setShowProfileMenu(false); setShowSettings(true) }} style={{ padding: '10px 16px', fontSize: 13, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>⚙️ Settings</div>
                  <div onClick={handleLogout} style={{ padding: '10px 16px', fontSize: 13, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>↩ Logout</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: isMobile ? '20px 16px' : '32px', flex: 1 }}>

          {/* Mobile search */}
          {isMobile && (
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8' }}>🔍</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search surveys..."
                style={{ width: '100%', paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#fff' }}
                onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
            </div>
          )}

          {/* Welcome — uses real logged-in user name */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,4vw,22px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Welcome {displayName} 👋
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Here's what's happening with your surveys today.</p>
          </div>

          {/* Stat cards */}
          <div className="sp-stat-cards" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard icon="📋" label="Total surveys"   value={totalSurveys}        trend="+2"    />
            <StatCard icon="✅" label="Active surveys"  value={activeSurveys}        color="#16a34a" />
            <StatCard icon="📬" label="Responses today" value={responsesToday}        trend="+12"  color="#7c3aed" />
            <StatCard icon="📈" label="Completion rate" value={`${completionRate}%`} trend="+3.1%" color="#f59e0b" />
          </div>

          {/* Survey table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Your Surveys</h3>
                <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 99, fontSize: 11, fontWeight: 600, color: '#64748b', padding: '2px 7px' }}>{filtered.length}</span>
              </div>
              <div style={{ display: 'flex', gap: 2, background: '#f8fafc', padding: 3, borderRadius: 8 }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#0f172a' : '#64748b', border: 'none', boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>{tab}</button>
                ))}
              </div>
            </div>

            <div className="sp-table-wrap" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 480 : 'auto' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Survey Title', 'Status', 'Responses', 'Completion', 'Actions'].map(col => (
                      <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                      {searchQuery ? `No surveys match "${searchQuery}".` : <span>No surveys yet. <span onClick={() => setShowNewModal(true)} style={{ color: '#0d9488', cursor: 'pointer', fontWeight: 600 }}>Create one →</span></span>}
                    </td></tr>
                  ) : filtered.map((s, i) => {
                    const sc = STATUS_COLORS[s.status] || STATUS_COLORS.draft
                    return (
                      <tr key={s.id} className="sp-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #e2e8f0' : 'none', transition: 'background 0.15s', animationDelay: `${i * 35}ms` }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 14px' }}>
                          <span onClick={() => setViewSurvey(s)} style={{ fontWeight: 500, fontSize: 13, color: '#0f172a', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#0d9488')} onMouseLeave={e => (e.currentTarget.style.color = '#0f172a')}>{s.title}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{s.status}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{s.responses.toLocaleString()}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MiniBar pct={s.completion} color={s.status === 'active' ? '#0d9488' : s.status === 'closed' ? '#64748b' : '#f59e0b'} />
                            <span style={{ fontSize: 12, color: '#64748b', minWidth: 30 }}>{s.completion}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {[
                              { label: 'View', action: () => setViewSurvey(s),   danger: false },
                              { label: 'Edit', action: () => setEditSurvey(s),   danger: false },
                              { label: 'Del',  action: () => setDeleteSurvey(s), danger: true  },
                            ].map(({ label, action, danger }) => (
                              <button key={label} onClick={action} style={{ padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: '#f8fafc', color: danger ? '#dc2626' : '#475569', border: danger ? '1px solid #fecaca' : '1px solid #e2e8f0', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? '#dc2626' : '#0d9488'; e.currentTarget.style.background = danger ? '#fef2f2' : '#f0fdfa' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = danger ? '#fecaca' : '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
                              >{label}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 16px', marginTop: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Audit Logs</h3>
            {activity.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 12, marginBottom: i < activity.length - 1 ? 12 : 0, borderBottom: i < activity.length - 1 ? '1px solid #e2e8f0' : 'none', animation: 'fadeUp 0.25s ease both', animationDelay: `${i * 40}ms` }}>
                <span style={{ fontSize: 16, width: 32, height: 32, borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showNewModal && <SurveyModal mode="new" onClose={() => setShowNewModal(false)} onSave={handleCreateSurvey} />}
      {editSurvey   && <SurveyModal mode="edit" survey={editSurvey} onClose={() => setEditSurvey(null)} onSave={handleEditSurvey} />}
      {viewSurvey   && <SurveyDetailModal survey={viewSurvey} onClose={() => setViewSurvey(null)} onEdit={() => { setEditSurvey(viewSurvey); setViewSurvey(null) }} onDelete={() => { setDeleteSurvey(viewSurvey); setViewSurvey(null) }} />}
      {deleteSurvey && <DeleteModal survey={deleteSurvey} onClose={() => setDeleteSurvey(null)} onConfirm={handleDeleteSurvey} />}
      {showSettings && <SettingsModal user={user} onClose={() => setShowSettings(false)} onSave={handleSaveSettings} />}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
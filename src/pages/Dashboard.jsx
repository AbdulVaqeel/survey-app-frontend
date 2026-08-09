import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'

const MOCK_SURVEYS = [
  { id: 1, title: 'Customer Satisfaction Q2', status: 'active', responses: 142, completion: 78 },
  { id: 2, title: 'NPS – Enterprise Clients', status: 'active', responses: 89, completion: 62 },
  { id: 3, title: 'Onboarding Experience 2025', status: 'closed', responses: 310, completion: 95 },
  { id: 4, title: 'Product Feedback – v3.0', status: 'draft', responses: 0, completion: 0 },
  { id: 5, title: 'Employee Engagement H1', status: 'active', responses: 54, completion: 41 },
  { id: 6, title: 'Website UX Audit', status: 'draft', responses: 0, completion: 0 },
]

const MOCK_ACTIVITY = [
  { id: 1, icon: '📬', text: 'New response on Customer Satisfaction Q2', time: '2 min ago' },
  { id: 2, icon: '🆕', text: 'Survey "NPS – Enterprise Clients" created', time: '1 hr ago' },
  { id: 3, icon: '✅', text: '"Onboarding Experience 2025" closed successfully', time: '3 hrs ago' },
  { id: 4, icon: '📤', text: 'Export for Product Feedback downloaded', time: 'Yesterday' },
]

const MOCK_RESPONDENTS = [
  { id: 1, name: 'Sarah Jenkins', email: 's.jenkins@acme.corp', survey: 'Customer Satisfaction Q2', status: 'Completed', date: '10 min ago' },
  { id: 2, name: 'Michael Chen', email: 'mchen@techcorp.io', survey: 'NPS – Enterprise Clients', status: 'Completed', date: '45 min ago' },
  { id: 3, name: 'Elena Rostova', email: 'elena@designstudio.co', survey: 'Customer Satisfaction Q2', status: 'In Progress', date: '2 hrs ago' },
  { id: 4, name: 'David Kim', email: 'dkim@globalbank.com', survey: 'Onboarding Experience 2025', status: 'Completed', date: '5 hrs ago' },
]

const STATUS_COLORS = {
  active: { bg: '#dcfce7', text: '#16a34a' },
  draft: { bg: '#fef9c3', text: '#a16207' },
  closed: { bg: '#f1f5f9', text: '#64748b' },
}

const TABS = ['All', 'Active', 'Draft', 'Closed']
const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '📋', label: 'My Surveys' },
  { icon: '📊', label: 'Analytics' },
  { icon: '👥', label: 'Respondents' },
  { icon: '⚙️', label: 'Settings' },
]

function StatCard({ icon, label, value, trend, color = '#0d9488' }) {
  return (
    <div
      style={{ background: '#fff', borderRadius: 16, padding: '20px 18px', border: '1px solid #e2e8f0', flex: '1 1 160px', minWidth: 0, transition: 'box-shadow 0.2s' }}
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
  const [title, setTitle] = useState(survey?.title || '')
  const [status, setStatus] = useState(survey?.status || 'draft')
  const [error, setError] = useState('')
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
  const { logout, user: authUser } = useAuth()

  const [user, setUser] = useState(authUser || { full_name: 'User', username: '' })
  const [surveys, setSurveys] = useState(MOCK_SURVEYS)
  const [activity, setActivity] = useState(MOCK_ACTIVITY)
  const [activeTab, setActiveTab] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [editSurvey, setEditSurvey] = useState(null)
  const [viewSurvey, setViewSurvey] = useState(null)
  const [deleteSurvey, setDeleteSurvey] = useState(null)
  const [toast, setToast] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [settingsForm, setSettingsForm] = useState({ fullName: user.full_name || '', username: user.username || '' })

  useEffect(() => {
    if (authUser) {
      setUser(authUser)
      setSettingsForm({ fullName: authUser.full_name || '', username: authUser.username || '' })
    }
  }, [authUser])

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

  useEffect(() => {
    const handleClickOutside = e => {
      if (!e.target.closest('.sp-profile-menu')) setShowProfileMenu(false)
      if (isMobile && !e.target.closest('.sp-sidebar') && !e.target.closest('.sp-menu-btn')) setSidebarOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile])

  const totalSurveys = surveys.length
  const activeSurveys = surveys.filter(s => s.status === 'active').length
  const responsesToday = surveys.reduce((sum, s) => sum + (s.status === 'active' ? Math.floor(s.responses * 0.08) : 0), 0)
  const completionRate = surveys.length ? Math.round(surveys.reduce((sum, s) => sum + s.completion, 0) / surveys.length) : 0

  const filteredSurveys = surveys
    .filter(s => activeTab === 'All' || s.status.toLowerCase() === activeTab.toLowerCase())
    .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const addActivity = useCallback((icon, text) => setActivity(prev => [{ id: Date.now(), icon, text, time: 'Just now' }, ...prev.slice(0, 6)]), [])

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

  const handleSaveSettings = e => {
    e.preventDefault()
    setUser(prev => ({ ...prev, full_name: settingsForm.fullName, username: settingsForm.username }))
    showToast('Settings updated successfully!')
  }

  const handleNavClick = label => {
    setActiveNav(label)
    if (isMobile) setSidebarOpen(false)
  }

  const handleLogout = () => { setShowProfileMenu(false); logout(); navigate('/login') }

  const displayName = user?.full_name || user?.username || 'User'
  const displayInitial = displayName[0]?.toUpperCase() || 'U'
  const displayUsername = user?.username || ''

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8fafc', position: 'relative' }} className="sp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        :root { --font-display: 'Sora', sans-serif; }
        .sp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-btn-primary { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: none; font-family: 'Plus Jakarta Sans', sans-serif; background: linear-gradient(135deg, #0d9488, #0f766e); color: #fff; box-shadow: 0 4px 12px rgba(13,148,136,0.3); cursor: pointer; transition: transform 0.15s; white-space: nowrap; }
        .sp-btn-primary:hover { transform: translateY(-1px); }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .sp-row { animation: fadeUp 0.22s ease both; }
        .sp-sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 39; }
        @media (max-width: 767px) {
          .sp-sidebar { position: fixed !important; top: 0; left: 0; height: 100vh; z-index: 40; }
          .sp-sidebar-overlay.active { display: block; }
          .sp-stat-cards { flex-wrap: wrap; }
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
          {sidebarOpen && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>SurveyMatrix</span>}
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px,3vw,20px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeNav}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!isMobile && activeNav === 'Dashboard' && (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8' }}>🔍</span>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search surveys..."
                  style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', width: 180, background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
              </div>
            )}
            <button className="sp-btn-primary" onClick={() => setShowNewModal(true)}>+ {isMobile ? '' : 'New '}Survey</button>
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
                  <div onClick={() => { setShowProfileMenu(false); setActiveNav('Settings') }} style={{ padding: '10px 16px', fontSize: 13, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>⚙️ Settings</div>
                  <div onClick={handleLogout} style={{ padding: '10px 16px', fontSize: 13, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>↩ Logout</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: isMobile ? '20px 16px' : '32px', flex: 1, overflow: 'auto' }}>

          {/* DASHBOARD */}
          {activeNav === 'Dashboard' && (
            <div>
              {isMobile && (
                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8' }}>🔍</span>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search surveys..."
                    style={{ width: '100%', paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#fff' }}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,4vw,22px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Welcome {displayName} 👋</h2>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Here's what's happening with your surveys today.</p>
              </div>
              <div className="sp-stat-cards" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <StatCard icon="📋" label="Total surveys" value={totalSurveys} trend="+2" />
                <StatCard icon="✅" label="Active surveys" value={activeSurveys} color="#16a34a" />
                <StatCard icon="📬" label="Responses today" value={responsesToday} trend="+12" color="#7c3aed" />
                <StatCard icon="📈" label="Completion rate" value={`${completionRate}%`} trend="+3.1%" color="#f59e0b" />
              </div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Recent Surveys</h3>
                    <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 99, fontSize: 11, fontWeight: 600, color: '#64748b', padding: '2px 7px' }}>{filteredSurveys.length}</span>
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
                      {filteredSurveys.length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>No surveys found.</td></tr>
                      ) : filteredSurveys.map((s, i) => {
                        const sc = STATUS_COLORS[s.status] || STATUS_COLORS.draft
                        return (
                          <tr key={s.id} className="sp-row" style={{ borderBottom: i < filteredSurveys.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                            <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }} onClick={() => setViewSurvey(s)}>{s.title}</td>
                            <td style={{ padding: '12px 14px' }}><span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{s.status}</span></td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>{s.responses.toLocaleString()}</td>
                            <td style={{ padding: '12px 14px', width: 140 }}><MiniBar pct={s.completion} color={s.status === 'active' ? '#0d9488' : s.status === 'closed' ? '#64748b' : '#f59e0b'} /></td>
                            <td style={{ padding: '12px 14px' }}>
                              <button onClick={() => setEditSurvey(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, marginRight: 8 }}>✏️</button>
                              <button onClick={() => setDeleteSurvey(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>🗑️</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MY SURVEYS */}
          {activeNav === 'My Surveys' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>All Surveys</h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #e2e8f0', background: activeTab === tab ? '#0d9488' : '#fff', color: activeTab === tab ? '#fff' : '#64748b', cursor: 'pointer' }}>{tab}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {filteredSurveys.map(s => {
                  const sc = STATUS_COLORS[s.status] || STATUS_COLORS.draft
                  return (
                    <div key={s.id} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{s.status}</span>
                          <div>
                            <button onClick={() => setEditSurvey(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, marginRight: 4 }}>✏️</button>
                            <button onClick={() => setDeleteSurvey(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>🗑️</button>
                          </div>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{s.title}</h3>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                          <span>Responses: <strong>{s.responses}</strong></span>
                          <span><strong>{s.completion}%</strong> Rate</span>
                        </div>
                        <MiniBar pct={s.completion} color={s.status === 'active' ? '#0d9488' : '#64748b'} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeNav === 'Analytics' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Survey Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Response Overview</h3>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-display)' }}>695</div>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Total aggregated responses across active surveys.</p>
                </div>
                <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Average Completion</h3>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-display)' }}>{completionRate}%</div>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Across all ongoing campaign streams.</p>
                </div>
              </div>
            </div>
          )}

          {/* RESPONDENTS — fixed mobile responsiveness */}
          {activeNav === 'Respondents' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Recent Respondents</h2>

              {/* Mobile: card layout */}
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {MOCK_RESPONDENTS.map(r => (
                    <div key={r.id} style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #e2e8f0' }}>
                      {/* Name + status row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{r.name}</div>
                        <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: r.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: r.status === 'Completed' ? '#16a34a' : '#a16207', whiteSpace: 'nowrap' }}>
                          {r.status}
                        </span>
                      </div>
                      {/* Email */}
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>📧 {r.email}</div>
                      {/* Survey */}
                      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>📋 {r.survey}</div>
                      {/* Time */}
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>🕐 {r.date}</div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop: scrollable table */
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Name', 'Email', 'Survey Title', 'Status', 'Submitted'].map(col => (
                            <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_RESPONDENTS.map((r, i) => (
                          <tr key={r.id} style={{ borderBottom: i < MOCK_RESPONDENTS.length - 1 ? '1px solid #e2e8f0' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a', fontSize: 13, whiteSpace: 'nowrap' }}>{r.name}</td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 13 }}>{r.email}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{r.survey}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: r.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: r.status === 'Completed' ? '#16a34a' : '#a16207' }}>
                                {r.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' }}>{r.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeNav === 'Settings' && (
            <div style={{ maxWidth: 540 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Account Settings</h2>
              <form onSubmit={handleSaveSettings} style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input value={settingsForm.fullName} onChange={e => setSettingsForm({ ...settingsForm, fullName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Username</label>
                  <input value={settingsForm.username} onChange={e => setSettingsForm({ ...settingsForm, username: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14, border: '1.5px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                </div>
                <button type="submit" className="sp-btn-primary" style={{ width: '100%', padding: 12 }}>Save Profile</button>
              </form>
            </div>
          )}

        </div>
      </main>

      {showNewModal && <SurveyModal mode="new" onClose={() => setShowNewModal(false)} onSave={handleCreateSurvey} />}
      {editSurvey && <SurveyModal mode="edit" survey={editSurvey} onClose={() => setEditSurvey(null)} onSave={handleEditSurvey} />}
      {deleteSurvey && <DeleteModal survey={deleteSurvey} onClose={() => setDeleteSurvey(null)} onConfirm={handleDeleteSurvey} />}
      {viewSurvey && <SurveyDetailModal survey={viewSurvey} onClose={() => setViewSurvey(null)} onEdit={() => { setEditSurvey(viewSurvey); setViewSurvey(null) }} onDelete={() => { setDeleteSurvey(viewSurvey); setViewSurvey(null) }} />}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
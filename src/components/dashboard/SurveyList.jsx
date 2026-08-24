import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'

const STATUS_COLORS = {
  active: { bg: '#dcfce7', text: '#16a34a' },
  draft:  { bg: '#fef9c3', text: '#a16207' },
  closed: { bg: '#f1f5f9', text: '#64748b' },
}

function QRModal({ survey, onClose }) {
  const link = `${window.location.origin}/survey/respond/${survey.id}`
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0f172a' }}>Share Survey</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>

        {survey.qr_code && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <img src={`data:image/png;base64,${survey.qr_code}`} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 12, border: '1px solid #e2e8f0' }} />
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Scan to open survey</p>
            <a href={`data:image/png;base64,${survey.qr_code}`} download={`${survey.title}-qr.png`}
              style={{ fontSize: 12, color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>⬇ Download QR</a>
          </div>
        )}

        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: '#475569', flex: 1, wordBreak: 'break-all' }}>{link}</span>
          <button onClick={copyLink} style={{ background: copied ? '#0d9488' : '#f1f5f9', color: copied ? '#fff' : '#475569', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
          Survey must be <strong>Active</strong> for respondents to access it.
        </p>
      </div>
    </div>
  )
}

function DeleteConfirm({ survey, onClose, onConfirm }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>Delete Survey?</h3>
        <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>
          "<strong>{survey.title}</strong>" and all its responses will be permanently deleted.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function SurveyList({ isMobile }) {
  const navigate = useNavigate()
  const [surveys,  setSurveys]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [qrSurvey, setQrSurvey] = useState(null)
  const [delSurvey,setDelSurvey]= useState(null)
  const [filter,   setFilter]   = useState('All')
  const [search,   setSearch]   = useState('')

  const fetchSurveys = useCallback(async () => {
    try {
      const res = await api.get('/surveys')
      setSurveys(res.data)
    } catch {
      setError('Failed to load surveys.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSurveys() }, [fetchSurveys])

  // Poll for real-time response count updates every 15s
  useEffect(() => {
    const id = setInterval(fetchSurveys, 15000)
    return () => clearInterval(id)
  }, [fetchSurveys])

  const handleDelete = async () => {
    try {
      await api.delete(`/surveys/${delSurvey.id}`)
      setSurveys(prev => prev.filter(s => s.id !== delSurvey.id))
      setDelSurvey(null)
    } catch {
      setError('Failed to delete survey.')
    }
  }

  const filtered = surveys
    .filter(s => filter === 'All' || s.status === filter.toLowerCase())
    .filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ fontSize: 14, color: '#64748b' }}>Loading surveys…</div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>My Surveys</h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>{surveys.length} surveys · {surveys.filter(s => s.status === 'active').length} active</p>
        </div>
        <button onClick={() => navigate('/surveys/new')}
          style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', background: 'linear-gradient(135deg,#0d9488,#0f766e)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(13,148,136,0.35)', whiteSpace: 'nowrap' }}>
          + Create Survey
        </button>
      </div>

      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search surveys..."
            style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f8fafc', padding: 3, borderRadius: 8 }}>
          {['All', 'Active', 'Draft', 'Closed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', background: filter === f ? '#fff' : 'transparent', color: filter === f ? '#0f172a' : '#64748b', boxShadow: filter === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', cursor: 'pointer' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No surveys yet</h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Create your first survey and start collecting responses.</p>
          <button onClick={() => navigate('/surveys/new')}
            style={{ padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', background: 'linear-gradient(135deg,#0d9488,#0f766e)', color: '#fff', cursor: 'pointer' }}>
            + Create Your First Survey
          </button>
        </div>
      )}

      {/* Survey cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(survey => {
          const sc = STATUS_COLORS[survey.status] || STATUS_COLORS.draft
          return (
            <div key={survey.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>

              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{survey.status}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button title="Share / QR Code" onClick={() => setQrSurvey(survey)}
                    style={{ background: '#f0fdfa', border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 14, cursor: 'pointer' }}>📲</button>
                  <button title="Unique respondent links (CSV upload)" onClick={() => navigate(`/surveys/${survey.id}/invites`)}
                    style={{ background: '#f8fafc', border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 14, cursor: 'pointer' }}>👥</button>
                  <button title="Edit" onClick={() => navigate(`/surveys/${survey.id}/edit`)}
                    style={{ background: '#f8fafc', border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 14, cursor: 'pointer' }}>✏️</button>
                  <button title="Results" onClick={() => navigate(`/surveys/${survey.id}/results`)}
                    style={{ background: '#f8fafc', border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 14, cursor: 'pointer' }}>📊</button>
                  <button title="Delete" onClick={() => setDelSurvey(survey)}
                    style={{ background: '#fef2f2', border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 14, cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, cursor: 'pointer' }}
                onClick={() => navigate(`/surveys/${survey.id}/results`)}>{survey.title}</h3>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0d9488' }}>{survey.response_count}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Responses</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>{survey.completion_rate}%</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Completion</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 5, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${survey.completion_rate}%`, background: survey.status === 'active' ? '#0d9488' : '#94a3b8', borderRadius: 99, transition: 'width 0.8s ease' }} />
              </div>

              {/* Created date */}
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Created {new Date(survey.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          )
        })}
      </div>

      {qrSurvey  && <QRModal      survey={qrSurvey}  onClose={() => setQrSurvey(null)} />}
      {delSurvey && <DeleteConfirm survey={delSurvey} onClose={() => setDelSurvey(null)} onConfirm={handleDelete} />}
    </div>
  )
}
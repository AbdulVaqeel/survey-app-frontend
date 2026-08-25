import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'

const EXPORT_FORMATS = [
  { key: 'excel', ext: 'xlsx', icon: '📊', label: 'Excel (.xlsx)', color: '#16a34a' },
  { key: 'pptx',  ext: 'pptx', icon: '📑', label: 'PowerPoint (.pptx)', color: '#ea580c' },
  { key: 'pdf',   ext: 'pdf',  icon: '📄', label: 'PDF (.pdf)', color: '#dc2626' },
]

/** Single "Download" button that opens a small menu — replaces three separate
 *  export buttons so the topbar never overflows on narrow screens. */
function DownloadMenu({ exporting, onExport }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={!!exporting}
        className="exp-btn"
        style={{ background: '#f0fdfa', color: '#0d9488' }}
      >
        {exporting ? '…' : '⬇'} Download <span style={{ fontSize: 10, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 190,
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          boxShadow: '0 18px 40px rgba(15,23,42,0.16)', padding: 6, zIndex: 30,
        }}>
          {EXPORT_FORMATS.map(f => (
            <button
              key={f.key}
              onClick={() => { onExport(f.key); setOpen(false) }}
              disabled={!!exporting}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13.5,
                fontWeight: 600, border: 'none', cursor: exporting ? 'not-allowed' : 'pointer',
                background: 'transparent', color: f.color, fontFamily: 'inherit',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{exporting === f.key ? '…' : f.icon}</span>{f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatBox({ icon, label, value, color = '#0d9488' }) {
  return (
    <div style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #e2e8f0', flex:'1 1 140px', minWidth:0 }}>
      <div style={{ fontSize:22, marginBottom:8 }}>{icon}</div>
      <div style={{ fontFamily:'Sora,sans-serif', fontSize:26, fontWeight:800, color, letterSpacing:'-1px' }}>{value}</div>
      <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{label}</div>
    </div>
  )
}

function BarChart({ data, total }) {
  if (!data || Object.keys(data).length === 0)
    return <div style={{ fontSize:13, color:'#94a3b8', padding:'12px 0' }}>No responses yet.</div>
  const max = Math.max(...Object.values(data))
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {Object.entries(data).sort((a,b) => b[1]-a[1]).map(([label, count]) => (
        <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:100, fontSize:12, color:'#475569', flexShrink:0, textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={label}>{label}</div>
          <div style={{ flex:1, height:22, background:'#f1f5f9', borderRadius:6, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(count/max)*100}%`, background:'linear-gradient(90deg,#0d9488,#2dd4bf)', borderRadius:6, transition:'width 0.8s ease', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6 }}>
              <span style={{ fontSize:10, color:'#fff', fontWeight:700 }}>{count}</span>
            </div>
          </div>
          <div style={{ fontSize:11, color:'#64748b', width:36, flexShrink:0 }}>{total ? `${Math.round(count/total*100)}%` : ''}</div>
        </div>
      ))}
    </div>
  )
}

function RatingBar({ data, min, max }) {
  if (!data || Object.keys(data).length === 0)
    return <div style={{ fontSize:13, color:'#94a3b8' }}>No responses yet.</div>
  const total = Object.values(data).reduce((a,b)=>a+b,0)
  const avg   = Object.entries(data).reduce((a,[k,v])=>a+Number(k)*v,0)/Math.max(total,1)
  return (
    <div>
      <div style={{ fontFamily:'Sora,sans-serif', fontSize:28, fontWeight:800, color:'#f59e0b', marginBottom:12 }}>
        {avg.toFixed(1)} <span style={{ fontSize:14, color:'#94a3b8', fontWeight:400 }}>/ {max}</span>
      </div>
      <BarChart data={data} total={total} />
    </div>
  )
}

export default function SurveyResults() {
  const navigate     = useNavigate()
  const { id }       = useParams()
  const [survey,     setSurvey]     = useState(null)
  const [stats,      setStats]      = useState(null)
  const [responses,  setResponses]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeTab,  setActiveTab]  = useState('overview')
  const [exporting,  setExporting]  = useState('')
  const [error,      setError]      = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const [sRes, stRes, rRes] = await Promise.all([
        api.get(`/surveys/${id}`),
        api.get(`/surveys/${id}/stats`),
        api.get(`/surveys/${id}/responses`),
      ])
      setSurvey(sRes.data)
      setStats(stRes.data)
      setResponses(rRes.data)
    } catch {
      setError('Failed to load results.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchAll() }, [fetchAll])
  // Live polling every 10s
  useEffect(() => {
    const t = setInterval(fetchAll, 10000)
    return () => clearInterval(t)
  }, [fetchAll])

  const exportFile = async (format) => {
    setExporting(format)
    try {
      const res = await api.get(`/surveys/${id}/export/${format}`, { responseType: 'blob' })
      const ext = { excel: 'xlsx', pptx: 'pptx', pdf: 'pdf' }[format]
      const url = URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href = url; a.download = `${survey.title}_results.${ext}`; a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(`Export to ${format.toUpperCase()} failed.`)
    } finally {
      setExporting('')
    }
  }

  if (loading) return <div style={{ padding:60, textAlign:'center', color:'#64748b' }}>Loading results…</div>
  if (!survey) return <div style={{ padding:60, textAlign:'center', color:'#dc2626' }}>{error || 'Survey not found.'}</div>

  const shareUrl = `${window.location.origin}/survey/respond/${id}`

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        .res-tab { padding:8px 18px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .res-tab.active { background:#0d9488; color:#fff; box-shadow:0 3px 10px rgba(13,148,136,0.3); }
        .res-tab:not(.active) { background:#fff; color:#64748b; border:1.5px solid #e2e8f0; }
        .res-tab:not(.active):hover { border-color:#0d9488; color:#0d9488; }
        .exp-btn { padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:6px; transition:all 0.15s; }
        .res-topbar { padding:14px 24px; }
        .res-topbar-left { display:flex; align-items:center; gap:12px; min-width:0; }
        .res-topbar-title { font-family:'Sora',sans-serif; font-size:16px; font-weight:800; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .res-topbar-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        @media (max-width:640px) {
          .res-topbar { flex-direction:column; align-items:stretch; gap:12px; }
          .res-topbar-left { width:100%; }
          .res-topbar-title { max-width:60vw; }
          .res-topbar-actions { width:100%; justify-content:flex-start; }
        }
      `}</style>

      {/* Topbar */}
      <div className="res-topbar" style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10, flexWrap:'wrap', gap:12 }}>
        <div className="res-topbar-left">
          <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', fontSize:13, fontWeight:600, color:'#64748b', cursor:'pointer', padding:'6px 0', flexShrink:0 }}>← Dashboard</button>
          <div style={{ width:1, height:20, background:'#e2e8f0', flexShrink:0 }} />
          <div style={{ minWidth:0 }}>
            <div className="res-topbar-title">{survey.title}</div>
            <div style={{ fontSize:11, color:'#64748b' }}>Real-time results</div>
          </div>
        </div>
        <div className="res-topbar-actions">
          <button onClick={() => navigate(`/surveys/${id}/invites`)} style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'7px 14px', fontSize:13, fontWeight:600, cursor:'pointer', color:'#475569' }}>👥 Invites</button>
          <button onClick={() => navigate(`/surveys/${id}/edit`)} style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'7px 14px', fontSize:13, fontWeight:600, cursor:'pointer', color:'#475569' }}>✏️ Edit</button>
          <DownloadMenu exporting={exporting} onExport={exportFile} />
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:24 }}>
        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', color:'#dc2626', fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}

        {/* Share link row */}
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e2e8f0', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>Survey Link:</span>
          <span style={{ fontSize:12, color:'#0d9488', flex:1, wordBreak:'break-all' }}>{shareUrl}</span>
          <button onClick={() => navigator.clipboard.writeText(shareUrl)} style={{ background:'#f0fdfa', border:'none', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:600, color:'#0d9488', cursor:'pointer' }}>Copy</button>
        </div>

        {/* Stat cards */}
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          <StatBox icon="📬" label="Total Responses" value={stats?.total_responses ?? 0} />
          <StatBox icon="📈" label="Completion Rate"  value={`${stats?.completion_rate ?? 0}%`} color="#f59e0b" />
          <StatBox icon="📅" label="Today"            value={stats?.responses_today ?? 0}   color="#7c3aed" />
          <StatBox icon="❓" label="Questions"         value={survey.questions?.length ?? 0}  color="#0ea5e9" />
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {['overview','responses'].map(t => (
            <button key={t} className={`res-tab${activeTab===t?' active':''}`} onClick={() => setActiveTab(t)}>
              {t === 'overview' ? '📊 Overview' : `📋 Responses (${responses.length})`}
            </button>
          ))}
        </div>

        {/* Overview — per-question breakdown */}
        {activeTab === 'overview' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {(stats?.question_stats || []).map((qs, i) => (
              <div key={qs.question_id} style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:8 }}>
                  <div>
                    <div style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Q{i+1} · {qs.type}</div>
                    <div style={{ fontFamily:'Sora,sans-serif', fontSize:15, fontWeight:700, color:'#0f172a' }}>{qs.question_text}</div>
                  </div>
                  <div style={{ fontSize:12, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'4px 10px' }}>
                    {qs.total_answers} answers
                  </div>
                </div>
                {qs.type === 'rating'
                  ? <RatingBar data={qs.value_counts} min={1} max={10} />
                  : ['text','textarea','date','file'].includes(qs.type)
                    ? <div style={{ fontSize:13, color:'#64748b', fontStyle:'italic' }}>Open-ended — see Responses tab for individual answers.</div>
                    : <BarChart data={qs.value_counts} total={qs.total_answers} />
                }
              </div>
            ))}
            {(!stats?.question_stats || stats.question_stats.length === 0) && (
              <div style={{ textAlign:'center', padding:'48px 20px', background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', color:'#64748b' }}>
                No responses yet. Share the survey link to start collecting data.
              </div>
            )}
          </div>
        )}

        {/* Individual responses table */}
        {activeTab === 'responses' && (
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden' }}>
            {responses.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px 20px', color:'#64748b' }}>No responses yet.</div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                  <thead>
                    <tr style={{ background:'#f8fafc' }}>
                      {['#','Name','Email','Submitted','Completion'].map(col => (
                        <th key={col} style={{ padding:'11px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r, i) => (
                      <tr key={r.id} style={{ borderBottom: i < responses.length-1 ? '1px solid #e2e8f0' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'12px 14px', fontSize:13, color:'#94a3b8' }}>{i+1}</td>
                        <td style={{ padding:'12px 14px', fontSize:13, fontWeight:600, color:'#0f172a' }}>{r.respondent_name || 'Anonymous'}</td>
                        <td style={{ padding:'12px 14px', fontSize:13, color:'#64748b' }}>{r.respondent_email || '—'}</td>
                        <td style={{ padding:'12px 14px', fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>{new Date(r.submitted_at).toLocaleString()}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ padding:'3px 8px', borderRadius:99, fontSize:11, fontWeight:700, background: r.completion_pct>=90?'#dcfce7':r.completion_pct>=50?'#fef9c3':'#fef2f2', color: r.completion_pct>=90?'#16a34a':r.completion_pct>=50?'#a16207':'#dc2626' }}>
                            {r.completion_pct.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
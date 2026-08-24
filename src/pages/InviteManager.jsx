import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'

const STATUS_STYLE = {
  pending:   { bg: '#f1f5f9', text: '#64748b', label: 'Pending' },
  opened:    { bg: '#fef9c3', text: '#a16207', label: 'Opened' },
  completed: { bg: '#dcfce7', text: '#16a34a', label: 'Completed' },
}

function QRModal({ invite, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 360, textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{invite.name || invite.email || 'Invite'}</h3>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Personal QR code for this respondent</p>
        {invite.qr ? (
          <>
            <img src={`data:image/png;base64,${invite.qr}`} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 12, border: '1px solid #e2e8f0' }} />
            <a href={`data:image/png;base64,${invite.qr}`} download={`invite-${invite.id}-qr.png`}
              style={{ display: 'block', marginTop: 10, fontSize: 12, color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>⬇ Download QR</a>
          </>
        ) : <div style={{ padding: 40, color: '#94a3b8', fontSize: 13 }}>Loading QR…</div>}
      </div>
    </div>
  )
}

export default function InviteManager() {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileRef = useRef(null)

  const [survey, setSurvey]     = useState(null)
  const [invites, setInvites]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const [notice, setNotice]     = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [qrInvite, setQrInvite] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const [sRes, iRes] = await Promise.all([
        api.get(`/surveys/${id}`),
        api.get(`/surveys/${id}/invites`),
      ])
      setSurvey(sRes.data)
      setInvites(iRes.data)
    } catch {
      setError('Failed to load invites.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchAll() }, [fetchAll])
  // Real-time: refresh open/completed status every 10s
  useEffect(() => {
    const t = setInterval(fetchAll, 10000)
    return () => clearInterval(t)
  }, [fetchAll])

  const handleUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(''); setNotice('')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await api.post(`/surveys/${id}/invites/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setNotice(`✅ Created ${res.data.created} unique link${res.data.created === 1 ? '' : 's'}${res.data.skipped ? ` · skipped ${res.data.skipped} blank row(s)` : ''}.`)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process CSV.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const copyLink = (invite) => {
    navigator.clipboard.writeText(invite.link)
    setCopiedId(invite.id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const openQr = async (invite) => {
    setQrInvite({ ...invite, qr: null })
    try {
      const res = await api.get(`/surveys/${id}/invites/${invite.id}/qr`)
      setQrInvite({ ...invite, qr: res.data.qr_code })
    } catch {
      setQrInvite(null)
      setError('Failed to generate QR code.')
    }
  }

  const exportCsv = async () => {
    try {
      const res = await api.get(`/surveys/${id}/invites/export`, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = `${survey?.title || 'survey'}_invite_links.csv`; a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to export links.')
    }
  }

  const clearInvites = async () => {
    try {
      await api.delete(`/surveys/${id}/invites`)
      setInvites([])
      setConfirmClear(false)
      setNotice('All unique links removed. This survey now accepts anyone with the general link.')
    } catch {
      setError('Failed to clear invites.')
    }
  }

  const counts = {
    total: invites.length,
    completed: invites.filter(i => i.status === 'completed').length,
    opened: invites.filter(i => i.status === 'opened').length,
    pending: invites.filter(i => i.status === 'pending').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>← Dashboard</button>
          <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{survey?.title || 'Loading…'}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Unique respondent links</div>
          </div>
        </div>
        {survey && (
          <button onClick={() => navigate(`/surveys/${id}/results`)} style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0d9488' }}>📊 View Results</button>
        )}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        {error &&  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
        {notice && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', color: '#16a34a', fontSize: 13, marginBottom: 16 }}>{notice}</div>}

        {/* Upload card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Bulk-invite respondents by CSV</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
            Upload a CSV with a <code>name</code> and/or <code>email</code> column. A unique one-time link (and QR code)
            is generated for every row, and the survey switches to invite-only mode — the general share link stops
            accepting new respondents.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: uploading ? '#e2e8f0' : 'linear-gradient(135deg,#0d9488,#0f766e)', color: uploading ? '#64748b' : '#fff', cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: uploading ? 'none' : '0 4px 14px rgba(13,148,136,0.35)' }}>
              {uploading ? 'Processing…' : '⬆ Upload CSV'}
              <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>
            {invites.length > 0 && (
              <>
                <button onClick={exportCsv} style={{ padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer' }}>⬇ Export Links (CSV)</button>
                <button onClick={() => setConfirmClear(true)} style={{ padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer' }}>Clear All Links</button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading invites…</div>
        ) : invites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', color: '#64748b' }}>
            No unique links yet — upload a CSV above to generate personal invite links for your respondents.
          </div>
        ) : (
          <>
            {/* Stat row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Total Invites', value: counts.total, color: '#0f172a' },
                { label: 'Pending',       value: counts.pending,   color: '#64748b' },
                { label: 'Opened',        value: counts.opened,    color: '#a16207' },
                { label: 'Completed',     value: counts.completed, color: '#16a34a' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: '14px 18px', flex: '1 1 140px' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Invite table */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Name', 'Email', 'Status', 'Link', ''].map(col => (
                        <th key={col} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((inv, i) => {
                      const st = STATUS_STYLE[inv.status] || STATUS_STYLE.pending
                      return (
                        <tr key={inv.id} style={{ borderBottom: i < invites.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{inv.name || '—'}</td>
                          <td style={{ padding: '12px 14px', fontSize: 13, color: '#64748b' }}>{inv.email || '—'}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: st.bg, color: st.text }}>{st.label}</span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: '#0d9488', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.link}</td>
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <button onClick={() => copyLink(inv)} title="Copy link" style={{ background: '#f0fdfa', border: 'none', borderRadius: 6, padding: '5px 9px', fontSize: 12, fontWeight: 600, color: '#0d9488', cursor: 'pointer', marginRight: 6 }}>
                              {copiedId === inv.id ? '✓' : 'Copy'}
                            </button>
                            <button onClick={() => openQr(inv)} title="QR code" style={{ background: '#f8fafc', border: 'none', borderRadius: 6, padding: '5px 9px', fontSize: 13, cursor: 'pointer' }}>▦</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {qrInvite && <QRModal invite={qrInvite} onClose={() => setQrInvite(null)} />}

      {confirmClear && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)', padding: 16 }} onClick={() => setConfirmClear(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>Clear all unique links?</h3>
            <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>The survey will go back to accepting anyone via its general share link.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmClear(false)} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              <button onClick={clearInvites} style={{ flex: 1, padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

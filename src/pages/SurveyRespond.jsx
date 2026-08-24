import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../utils/api'

const inputSt = {
  width: '100%', padding: '11px 14px', borderRadius: 9,
  border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
  background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
}

function Question({ q, index, value, onChange }) {
  const set = v => onChange(q.id, v)

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '22px 24px', marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, fontWeight: 600, letterSpacing: '0.03em' }}>QUESTION {index + 1}{q.required ? ' · REQUIRED' : ''}</div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14, lineHeight: 1.4 }}>{q.text}</div>

      {q.type === 'text' && (
        <input style={inputSt} placeholder="Your answer" value={value?.value || ''} onChange={e => set({ value: e.target.value })}
          onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
      )}

      {q.type === 'textarea' && (
        <textarea style={{ ...inputSt, minHeight: 100, resize: 'vertical' }} placeholder="Your answer" value={value?.value || ''} onChange={e => set({ value: e.target.value })}
          onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
      )}

      {q.type === 'date' && (
        <input type="date" style={inputSt} value={value?.value || ''} onChange={e => set({ value: e.target.value })}
          onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
      )}

      {q.type === 'file' && (
        <input type="file" style={{ fontSize: 13 }} onChange={e => set({ value: e.target.files?.[0]?.name || '' })} />
      )}

      {q.type === 'dropdown' && (
        <select style={inputSt} value={value?.value || ''} onChange={e => set({ value: e.target.value })}>
          <option value="">Select an option…</option>
          {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      {q.type === 'multiple_choice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(q.options || []).map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: value?.value === opt ? '1.5px solid #0d9488' : '1.5px solid #e2e8f0', background: value?.value === opt ? '#f0fdfa' : '#fff', cursor: 'pointer', fontSize: 14, color: '#0f172a' }}>
              <input type="radio" name={`q-${q.id}`} checked={value?.value === opt} onChange={() => set({ value: opt })} />
              {opt}
            </label>
          ))}
        </div>
      )}

      {q.type === 'checkbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(q.options || []).map(opt => {
            const selected = (value?.values || []).includes(opt)
            return (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: selected ? '1.5px solid #0d9488' : '1.5px solid #e2e8f0', background: selected ? '#f0fdfa' : '#fff', cursor: 'pointer', fontSize: 14, color: '#0f172a' }}>
                <input type="checkbox" checked={selected} onChange={() => {
                  const cur = value?.values || []
                  set({ values: selected ? cur.filter(v => v !== opt) : [...cur, opt] })
                }} />
                {opt}
              </label>
            )
          })}
        </div>
      )}

      {q.type === 'rating' && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Array.from({ length: (q.max_rating || 10) - (q.min_rating || 1) + 1 }, (_, i) => (q.min_rating || 1) + i).map(n => (
            <button key={n} type="button" onClick={() => set({ value: String(n) })}
              style={{ width: 40, height: 40, borderRadius: 10, border: value?.value === String(n) ? 'none' : '1.5px solid #e2e8f0', background: value?.value === String(n) ? 'linear-gradient(135deg,#0d9488,#0f766e)' : '#fff', color: value?.value === String(n) ? '#fff' : '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SurveyRespond() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const token = params.get('token') || undefined

  const [survey, setSurvey]   = useState(null)
  const [answers, setAnswers] = useState({})
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]       = useState(false)

  useEffect(() => {
    api.get(`/public/survey/${id}`, { params: token ? { token } : {} })
      .then(res => setSurvey(res.data))
      .catch(err => setError(err.response?.data?.detail || 'This survey is not available right now.'))
      .finally(() => setLoading(false))
  }, [id, token])

  const questions = useMemo(
    () => (survey?.questions || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [survey]
  )

  const setAnswer = (qid, val) => setAnswers(prev => ({ ...prev, [qid]: val }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    const missing = questions.find(q => q.required && !answers[q.id]?.value && !(answers[q.id]?.values?.length))
    if (missing) { setError(`Please answer: "${missing.text}"`); return }

    setSubmitting(true)
    try {
      await api.post(`/public/survey/${id}/respond`, {
        respondent_name: name.trim() || undefined,
        respondent_email: email.trim() || undefined,
        token,
        answers: questions.map(q => ({
          question_id: q.id,
          value: answers[q.id]?.value ?? null,
          values: answers[q.id]?.values ?? null,
        })),
      })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit your response. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const shell = children => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', alignItems: loading || error || done ? 'center' : 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');`}</style>
      {children}
    </div>
  )

  if (loading) return shell(<div style={{ color: '#64748b', fontSize: 14 }}>Loading survey…</div>)

  if (error && !survey) return shell(
    <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 440, textAlign: 'center', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Survey Unavailable</h2>
      <p style={{ fontSize: 14, color: '#64748b' }}>{error}</p>
    </div>
  )

  if (done) return shell(
    <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 440, textAlign: 'center', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Thank you!</h2>
      <p style={{ fontSize: 14, color: '#64748b' }}>Your response has been recorded.</p>
    </div>
  )

  return shell(
    <div style={{ width: '100%', maxWidth: 640 }}>
      <div style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', borderRadius: '20px 20px 0 0', padding: '28px 28px 24px' }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{survey.title}</div>
        {survey.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{survey.description}</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', borderRadius: '0 0 20px 20px', padding: '24px 0 0' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Your Name (optional)</label>
              <input style={inputSt} value={name} onChange={e => setName(e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Email (optional)</label>
              <input type="email" style={inputSt} value={email} onChange={e => setEmail(e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
            </div>
          </div>
        </div>

        {questions.map((q, i) => (
          <Question key={q.id} q={q} index={i} value={answers[q.id]} onChange={setAnswer} />
        ))}

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

        <button type="submit" disabled={submitting}
          style={{ width: '100%', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, border: 'none', background: submitting ? '#e2e8f0' : 'linear-gradient(135deg,#0d9488,#0f766e)', color: submitting ? '#64748b' : '#fff', cursor: submitting ? 'not-allowed' : 'pointer', marginBottom: 32, boxShadow: submitting ? 'none' : '0 4px 16px rgba(13,148,136,0.35)' }}>
          {submitting ? 'Submitting…' : 'Submit Response →'}
        </button>
      </form>
    </div>
  )
}

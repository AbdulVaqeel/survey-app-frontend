// import { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import api from '../../utils/api'

// const QUESTION_TYPES = [
//   { value: 'text',            label: '✏️ Short Text'       },
//   { value: 'textarea',        label: '📝 Long Text'         },
//   { value: 'multiple_choice', label: '🔘 Multiple Choice'   },
//   { value: 'checkbox',        label: '☑️ Checkboxes'        },
//   { value: 'dropdown',        label: '📋 Dropdown'          },
//   { value: 'rating',          label: '⭐ Rating Scale'      },
//   { value: 'date',            label: '📅 Date'              },
//   { value: 'file',            label: '📎 File Upload'       },
// ]

// const blankQuestion = () => ({
//   _id: Date.now() + Math.random(),
//   type: 'text', text: '', required: false,
//   options: [], min_rating: 1, max_rating: 5,
//   logic: null, order: 0,
// })

// const inputStyle = {
//   width: '100%', padding: '9px 12px', borderRadius: 8,
//   border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none',
//   boxSizing: 'border-box', fontFamily: 'Plus Jakarta Sans, sans-serif',
//   transition: 'border-color 0.15s',
// }

// export default function SurveyBuilder() {
//   const navigate  = useNavigate()
//   const { id }    = useParams()
//   const isEditing = Boolean(id)

//   const [title,       setTitle]       = useState('')
//   const [description, setDescription] = useState('')
//   const [status,      setStatus]      = useState('draft')
//   const [questions,   setQuestions]   = useState([blankQuestion()])
//   const [loading,     setLoading]     = useState(false)
//   const [error,       setError]       = useState('')
//   const [success,     setSuccess]     = useState('')
//   const [activeQ,     setActiveQ]     = useState(0)

//   useEffect(() => {
//     if (isEditing) {
//       api.get(`/surveys/${id}`).then(res => {
//         const s = res.data
//         setTitle(s.title)
//         setDescription(s.description || '')
//         setStatus(s.status)
//         setQuestions(s.questions.length > 0 ? s.questions.map(q => ({ ...q, _id: q.id })) : [blankQuestion()])
//       }).catch(() => setError('Failed to load survey.'))
//     }
//   }, [id, isEditing])

//   const addQuestion = () => {
//     const q = blankQuestion()
//     q.order = questions.length
//     setQuestions(prev => [...prev, q])
//     setActiveQ(questions.length)
//   }

//   const removeQuestion = idx => {
//     setQuestions(prev => prev.filter((_, i) => i !== idx))
//     setActiveQ(Math.max(0, activeQ - 1))
//   }

//   const updateQuestion = (idx, field, value) => {
//     setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q))
//   }

//   const addOption = idx => {
//     const q = questions[idx]
//     updateQuestion(idx, 'options', [...(q.options || []), ''])
//   }

//   const updateOption = (qIdx, oIdx, value) => {
//     const opts = [...(questions[qIdx].options || [])]
//     opts[oIdx] = value
//     updateQuestion(qIdx, 'options', opts)
//   }

//   const removeOption = (qIdx, oIdx) => {
//     const opts = (questions[qIdx].options || []).filter((_, i) => i !== oIdx)
//     updateQuestion(qIdx, 'options', opts)
//   }

//   const moveQuestion = (idx, dir) => {
//     const arr = [...questions]
//     const target = idx + dir
//     if (target < 0 || target >= arr.length) return
//     ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
//     setQuestions(arr.map((q, i) => ({ ...q, order: i })))
//     setActiveQ(target)
//   }

//   const handleSave = async (saveStatus = status) => {
//     setError(''); setSuccess('')
//     if (!title.trim()) { setError('Survey title is required.'); return }
//     if (questions.some(q => !q.text.trim())) { setError('All questions must have text.'); return }
//     setLoading(true)
//     const payload = {
//       title: title.trim(), description, status: saveStatus,
//       questions: questions.map((q, i) => ({
//         order: i, type: q.type, text: q.text, required: q.required,
//         options: q.options?.filter(o => o.trim()) || null,
//         logic: q.logic || null,
//         min_rating: q.min_rating || null, max_rating: q.max_rating || null,
//       }))
//     }
//     try {
//       if (isEditing) {
//         await api.put(`/surveys/${id}`, payload)
//         setSuccess('Survey updated!')
//       } else {
//         const res = await api.post('/surveys', payload)
//         setSuccess('Survey created!')
//         setTimeout(() => navigate(`/surveys/${res.data.id}`), 1000)
//       }
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to save survey.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const q = questions[activeQ] || {}
//   const needsOptions = ['multiple_choice', 'checkbox', 'dropdown'].includes(q.type)

//   return (
//     <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
//         :root { --font-display: 'Sora', sans-serif; }
//         .qcard { border: 2px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px; cursor: pointer; background: #fff; transition: all 0.15s; }
//         .qcard.active { border-color: #0d9488; background: #f0fdfa; }
//         .qcard:hover:not(.active) { border-color: #94a3b8; }
//         .sb-btn { padding: 9px 20px; border-radius: 9px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; }
//         .sb-btn-primary { background: linear-gradient(135deg,#0d9488,#0f766e); color: #fff; box-shadow: 0 4px 12px rgba(13,148,136,0.3); }
//         .sb-btn-primary:hover { transform: translateY(-1px); }
//         .sb-btn-ghost { background: #fff; color: #475569; border: 1.5px solid #e2e8f0; }
//         .sb-btn-ghost:hover { border-color: #0d9488; color: #0d9488; }
//         .sb-btn-danger { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
//       `}</style>

//       {/* Topbar */}
//       <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <button className="sb-btn sb-btn-ghost" onClick={() => navigate('/dashboard')} style={{ padding: '6px 14px' }}>← Back</button>
//           <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
//             {isEditing ? 'Edit Survey' : 'New Survey'}
//           </h1>
//         </div>
//         <div style={{ display: 'flex', gap: 8 }}>
//           <button className="sb-btn sb-btn-ghost" onClick={() => handleSave('draft')} disabled={loading}>Save Draft</button>
//           <button className="sb-btn sb-btn-primary" onClick={() => handleSave('active')} disabled={loading}>
//             {loading ? 'Saving…' : '🚀 Publish'}
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       {error   && <div style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '10px 24px', color: '#dc2626', fontSize: 13, fontWeight: 500 }}>⚠️ {error}</div>}
//       {success && <div style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', padding: '10px 24px', color: '#16a34a', fontSize: 13, fontWeight: 500 }}>✅ {success}</div>}

//       <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: 24, gap: 24 }}>

//         {/* Left: Question list */}
//         <div style={{ width: 260, flexShrink: 0 }}>
//           <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16 }}>
//             <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Questions ({questions.length})</div>
//             {questions.map((q, i) => (
//               <div key={q._id} className={`qcard${activeQ === i ? ' active' : ''}`} onClick={() => setActiveQ(i)}>
//                 <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Q{i + 1} · {QUESTION_TYPES.find(t => t.value === q.type)?.label || q.type}</div>
//                 <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                   {q.text || <span style={{ color: '#cbd5e1' }}>Untitled question</span>}
//                 </div>
//               </div>
//             ))}
//             <button className="sb-btn sb-btn-ghost" onClick={addQuestion} style={{ width: '100%', marginTop: 8 }}>+ Add Question</button>
//           </div>
//         </div>

//         {/* Center: Editor */}
//         <div style={{ flex: 1, minWidth: 0 }}>

//           {/* Survey meta */}
//           <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
//             <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Survey Details</div>
//             <div style={{ marginBottom: 14 }}>
//               <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Title *</label>
//               <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Customer Satisfaction Survey" style={inputStyle}
//                 onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//             </div>
//             <div style={{ marginBottom: 14 }}>
//               <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Description</label>
//               <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description..." rows={2}
//                 style={{ ...inputStyle, resize: 'vertical' }}
//                 onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//             </div>
//             <div>
//               <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Status</label>
//               <div style={{ display: 'flex', gap: 8 }}>
//                 {['draft', 'active', 'closed'].map(s => (
//                   <button key={s} onClick={() => setStatus(s)} style={{ flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, border: status === s ? '2px solid #0d9488' : '1.5px solid #e2e8f0', background: status === s ? '#f0fdfa' : '#fff', color: status === s ? '#0d9488' : '#64748b', cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Active question editor */}
//           {questions.length > 0 && (
//             <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #0d9488', padding: 24 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                 <div style={{ fontSize: 14, fontWeight: 700, color: '#0d9488' }}>Q{activeQ + 1}</div>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   <button className="sb-btn sb-btn-ghost" onClick={() => moveQuestion(activeQ, -1)} style={{ padding: '5px 10px' }}>↑</button>
//                   <button className="sb-btn sb-btn-ghost" onClick={() => moveQuestion(activeQ, 1)} style={{ padding: '5px 10px' }}>↓</button>
//                   <button className="sb-btn sb-btn-danger" onClick={() => removeQuestion(activeQ)} style={{ padding: '5px 10px' }}>🗑</button>
//                 </div>
//               </div>

//               {/* Question type */}
//               <div style={{ marginBottom: 14 }}>
//                 <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Question Type</label>
//                 <select value={q.type} onChange={e => updateQuestion(activeQ, 'type', e.target.value)}
//                   style={{ ...inputStyle, background: '#f8fafc' }}>
//                   {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//                 </select>
//               </div>

//               {/* Question text */}
//               <div style={{ marginBottom: 14 }}>
//                 <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Question Text *</label>
//                 <input value={q.text} onChange={e => updateQuestion(activeQ, 'text', e.target.value)} placeholder="Enter your question here..."
//                   style={inputStyle} onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//               </div>

//               {/* Options */}
//               {needsOptions && (
//                 <div style={{ marginBottom: 14 }}>
//                   <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Options</label>
//                   {(q.options || []).map((opt, oIdx) => (
//                     <div key={oIdx} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
//                       <input value={opt} onChange={e => updateOption(activeQ, oIdx, e.target.value)} placeholder={`Option ${oIdx + 1}`}
//                         style={{ ...inputStyle, flex: 1 }} onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//                       <button className="sb-btn sb-btn-danger" onClick={() => removeOption(activeQ, oIdx)} style={{ padding: '6px 10px', flexShrink: 0 }}>✕</button>
//                     </div>
//                   ))}
//                   <button className="sb-btn sb-btn-ghost" onClick={() => addOption(activeQ)} style={{ marginTop: 4 }}>+ Add Option</button>
//                 </div>
//               )}

//               {/* Rating range */}
//               {q.type === 'rating' && (
//                 <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
//                   <div style={{ flex: 1 }}>
//                     <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Min</label>
//                     <input type="number" value={q.min_rating ?? 1} onChange={e => updateQuestion(activeQ, 'min_rating', Number(e.target.value))} style={inputStyle}
//                       onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>Max</label>
//                     <input type="number" value={q.max_rating ?? 10} onChange={e => updateQuestion(activeQ, 'max_rating', Number(e.target.value))} style={inputStyle}
//                       onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//                   </div>
//                 </div>
//               )}

//               {/* Logic branching */}
//               <div style={{ marginBottom: 14 }}>
//                 <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
//                   Logic Branching <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
//                 </label>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <input placeholder="If answer equals..." value={q.logic?.if_answer || ''}
//                     onChange={e => updateQuestion(activeQ, 'logic', { ...q.logic, if_answer: e.target.value })}
//                     style={{ ...inputStyle, flex: 1 }} onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//                   <input placeholder="Go to Q#" type="number" value={q.logic?.goto_question || ''}
//                     onChange={e => updateQuestion(activeQ, 'logic', { ...q.logic, goto_question: Number(e.target.value) })}
//                     style={{ ...inputStyle, width: 90 }} onFocus={e => (e.target.style.borderColor = '#0d9488')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
//                 </div>
//               </div>

//               {/* Required toggle */}
//               <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#475569' }}>
//                 <input type="checkbox" checked={q.required} onChange={e => updateQuestion(activeQ, 'required', e.target.checked)} />
//                 Required question
//               </label>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'

const QUESTION_TYPES = [
  { value: 'text',            label: '✏️ Short Text'       },
  { value: 'textarea',        label: '📝 Long Text'         },
  { value: 'multiple_choice', label: '🔘 Multiple Choice'   },
  { value: 'checkbox',        label: '☑️ Checkboxes'        },
  { value: 'dropdown',        label: '📋 Dropdown'          },
  { value: 'rating',          label: '⭐ Rating Scale'      },
  { value: 'date',            label: '📅 Date'              },
  { value: 'file',            label: '📎 File Upload'       },
]

const inputSt = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s', background: '#fff',
}

const newQ = () => ({
  _id: Date.now() + Math.random(), type: 'text', text: '',
  required: false, options: [], min_rating: 1, max_rating: 10, logic: null, order: 0,
})

function QuestionPreview({ q, idx }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Q{idx + 1} · {QUESTION_TYPES.find(t => t.value === q.type)?.label}</div>
      <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{q.text || '(no text)'}</div>
      {q.required && <span style={{ fontSize: 10, color: '#dc2626', fontWeight: 600 }}>REQUIRED</span>}
    </div>
  )
}

export default function SurveyBuilder() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const isEditing = Boolean(id)

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [status,      setStatus]      = useState('draft')
  const [questions,   setQuestions]   = useState([newQ()])
  const [activeQ,     setActiveQ]     = useState(0)
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(isEditing)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')
  const [preview,     setPreview]     = useState(false)

  useEffect(() => {
    if (!isEditing) return
    api.get(`/surveys/${id}`)
      .then(res => {
        const s = res.data
        setTitle(s.title); setDescription(s.description || ''); setStatus(s.status)
        setQuestions(s.questions.length ? s.questions.map(q => ({ ...q, _id: q.id })) : [newQ()])
      })
      .catch(() => setError('Failed to load survey.'))
      .finally(() => setFetching(false))
  }, [id, isEditing])

  const addQ    = () => { const q = newQ(); q.order = questions.length; setQuestions(p => [...p, q]); setActiveQ(questions.length) }
  const removeQ = idx => { setQuestions(p => p.filter((_,i) => i !== idx)); setActiveQ(Math.max(0, activeQ - 1)) }
  const updateQ = (idx, field, val) => setQuestions(p => p.map((q, i) => i === idx ? { ...q, [field]: val } : q))
  const addOpt  = idx => updateQ(idx, 'options', [...(questions[idx].options || []), ''])
  const updateOpt = (qi, oi, val) => { const o = [...(questions[qi].options||[])]; o[oi]=val; updateQ(qi,'options',o) }
  const removeOpt = (qi, oi) => updateQ(qi, 'options', (questions[qi].options||[]).filter((_,i)=>i!==oi))
  const moveQ   = (idx, dir) => {
    const a=[...questions]; const t=idx+dir
    if(t<0||t>=a.length)return
    ;[a[idx],a[t]]=[a[t],a[idx]]
    setQuestions(a.map((q,i)=>({...q,order:i}))); setActiveQ(t)
  }

  const save = async (saveStatus) => {
    setError(''); setSuccess('')
    if (!title.trim()) return setError('Survey title is required.')
    const emptyQ = questions.findIndex(q => !q.text.trim())
    if (emptyQ !== -1) return setError(`Question ${emptyQ+1} has no text.`)
    setLoading(true)
    const payload = {
      title: title.trim(), description, status: saveStatus || status,
      questions: questions.map((q,i) => ({
        order: i, type: q.type, text: q.text, required: q.required,
        options: (q.options||[]).filter(o=>o.trim()) || null,
        logic: (q.logic?.if_answer && q.logic?.goto_question) ? q.logic : null,
        min_rating: q.min_rating||null, max_rating: q.max_rating||null,
      }))
    }
    try {
      if (isEditing) {
        await api.put(`/surveys/${id}`, payload)
        setSuccess('Survey updated successfully!')
      } else {
        const res = await api.post('/surveys', payload)
        setSuccess('Survey created! Redirecting…')
        setTimeout(() => navigate(`/surveys/${res.data.id}/results`), 1500)
      }
    } catch(err) {
      setError(err.response?.data?.detail || 'Failed to save survey.')
    } finally { setLoading(false) }
  }

  if (fetching) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading survey…</div>

  const q = questions[activeQ] || {}
  const needsOptions = ['multiple_choice','checkbox','dropdown'].includes(q.type)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        .sb-input:focus { border-color: #0d9488 !important; }
        .sb-btn { padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .sb-primary { background: linear-gradient(135deg,#0d9488,#0f766e); color:#fff; box-shadow:0 4px 12px rgba(13,148,136,0.3); }
        .sb-primary:hover { transform:translateY(-1px); }
        .sb-ghost { background:#fff; color:#475569; border:1.5px solid #e2e8f0; }
        .sb-ghost:hover { border-color:#0d9488; color:#0d9488; }
        .sb-danger { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
        .qcard { border:2px solid #e2e8f0; border-radius:12px; padding:12px 14px; margin-bottom:6px; cursor:pointer; background:#fff; transition:all 0.15s; }
        .qcard.active { border-color:#0d9488; background:#f0fdfa; }
        .qcard:hover:not(.active) { border-color:#94a3b8; }

        .sb-topbar { padding:14px 24px; flex-wrap:wrap; gap:12px; }
        .sb-topbar-title { font-family:'Sora',sans-serif; font-size:18px; font-weight:800; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .sb-topbar-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .sb-layout { display:flex; }
        .sb-sidebar { width:250px; flex-shrink:0; }
        .sb-sidebar-inner { position:sticky; top:80px; }

        @media (max-width:820px) {
          .sb-topbar { flex-direction:column; align-items:stretch; }
          .sb-topbar-left { width:100%; justify-content:space-between; }
          .sb-topbar-title { max-width:55vw; }
          .sb-topbar-actions { width:100%; }
          .sb-topbar-actions .sb-btn { flex:1; }
          .sb-layout { flex-direction:column !important; padding:16px !important; gap:16px !important; }
          .sb-sidebar { width:100% !important; }
          .sb-sidebar-inner { position:static !important; top:auto !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="sb-topbar" style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:20 }}>
        <div className="sb-topbar-left" style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
          <button className="sb-btn sb-ghost" onClick={() => navigate('/dashboard')} style={{ padding:'6px 14px', flexShrink:0 }}>← Back</button>
          <h1 className="sb-topbar-title">{isEditing ? 'Edit Survey' : 'Create Survey'}</h1>
        </div>
        <div className="sb-topbar-actions">
          <button className="sb-btn sb-ghost" onClick={() => setPreview(p=>!p)}>{preview ? '✏️ Edit' : '👁 Preview'}</button>
          <button className="sb-btn sb-ghost" onClick={() => save('draft')} disabled={loading}>Save Draft</button>
          <button className="sb-btn sb-primary" onClick={() => save('active')} disabled={loading}>{loading ? 'Saving…' : '🚀 Publish'}</button>
        </div>
      </div>

      {error   && <div style={{ background:'#fef2f2', borderBottom:'1px solid #fecaca', padding:'10px 24px', color:'#dc2626', fontSize:13 }}>⚠️ {error}</div>}
      {success && <div style={{ background:'#f0fdf4', borderBottom:'1px solid #bbf7d0', padding:'10px 24px', color:'#16a34a', fontSize:13 }}>✅ {success}</div>}

      {preview ? (
        /* Preview mode */
        <div style={{ maxWidth:700, margin:'32px auto', padding:'0 16px' }}>
          <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:32, marginBottom:16 }}>
            <h2 style={{ fontFamily:'Sora,sans-serif', fontSize:22, fontWeight:800, color:'#0f172a' }}>{title || 'Untitled Survey'}</h2>
            {description && <p style={{ color:'#64748b', marginTop:8 }}>{description}</p>}
          </div>
          {questions.map((q,i) => <QuestionPreview key={q._id} q={q} idx={i} />)}
        </div>
      ) : (
        /* Edit mode */
        <div className="sb-layout" style={{ maxWidth:1120, margin:'0 auto', padding:24, gap:24 }}>

          {/* Left: question list */}
          <div className="sb-sidebar">
            <div className="sb-sidebar-inner" style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                Questions ({questions.length})
              </div>
              <div style={{ maxHeight:'60vh', overflowY:'auto' }}>
                {questions.map((q,i) => (
                  <div key={q._id} className={`qcard${activeQ===i?' active':''}`} onClick={() => setActiveQ(i)}>
                    <div style={{ fontSize:10, color:'#94a3b8', marginBottom:2 }}>Q{i+1} · {QUESTION_TYPES.find(t=>t.value===q.type)?.label.replace(/.*? /,'')}</div>
                    <div style={{ fontSize:12, color:'#0f172a', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {q.text || <span style={{ color:'#cbd5e1' }}>Untitled</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="sb-btn sb-ghost" onClick={addQ} style={{ width:'100%', marginTop:10 }}>+ Add Question</button>
            </div>
          </div>

          {/* Right: editor */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* Survey meta */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:24, marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#0d9488', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Survey Details</div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Title *</label>
                <input className="sb-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Customer Satisfaction Survey" style={inputSt} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Description</label>
                <textarea className="sb-input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional — tell respondents what this survey is about." rows={2} style={{ ...inputSt, resize:'vertical' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Status</label>
                <div style={{ display:'flex', gap:8 }}>
                  {['draft','active','closed'].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={{ flex:1, padding:'7px 0', borderRadius:8, fontSize:13, fontWeight:600, border:status===s?'2px solid #0d9488':'1.5px solid #e2e8f0', background:status===s?'#f0fdfa':'#fff', color:status===s?'#0d9488':'#64748b', cursor:'pointer', textTransform:'capitalize' }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active question editor */}
            {questions.length > 0 && (
              <div style={{ background:'#fff', borderRadius:14, border:'2px solid #0d9488', padding:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0d9488' }}>Editing Q{activeQ+1}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="sb-btn sb-ghost" onClick={() => moveQ(activeQ,-1)} style={{ padding:'5px 10px' }} title="Move up">↑</button>
                    <button className="sb-btn sb-ghost" onClick={() => moveQ(activeQ,1)}  style={{ padding:'5px 10px' }} title="Move down">↓</button>
                    <button className="sb-btn sb-danger" onClick={() => removeQ(activeQ)} style={{ padding:'5px 10px' }} disabled={questions.length===1}>🗑</button>
                  </div>
                </div>

                {/* Type selector */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Question Type</label>
                  <select value={q.type} onChange={e => updateQ(activeQ,'type',e.target.value)} style={{ ...inputSt, background:'#f8fafc' }}>
                    {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Question text */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Question Text *</label>
                  <input className="sb-input" value={q.text} onChange={e => updateQ(activeQ,'text',e.target.value)} placeholder="Type your question here…" style={inputSt} />
                </div>

                {/* Options for MCQ/checkbox/dropdown */}
                {needsOptions && (
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:8 }}>Answer Options</label>
                    {(q.options||[]).map((opt,oi) => (
                      <div key={oi} style={{ display:'flex', gap:6, marginBottom:6 }}>
                        <input className="sb-input" value={opt} onChange={e => updateOpt(activeQ,oi,e.target.value)} placeholder={`Option ${oi+1}`} style={{ ...inputSt, flex:1 }} />
                        <button className="sb-btn sb-danger" onClick={() => removeOpt(activeQ,oi)} style={{ padding:'6px 10px', flexShrink:0 }}>✕</button>
                      </div>
                    ))}
                    <button className="sb-btn sb-ghost" onClick={() => addOpt(activeQ)} style={{ marginTop:4 }}>+ Add Option</button>
                  </div>
                )}

                {/* Rating range */}
                {q.type === 'rating' && (
                  <div style={{ display:'flex', gap:12, marginBottom:14 }}>
                    <div style={{ flex:1 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Min Rating</label>
                      <input type="number" value={q.min_rating??1} onChange={e => updateQ(activeQ,'min_rating',Number(e.target.value))} style={inputSt} />
                    </div>
                    <div style={{ flex:1 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:5 }}>Max Rating</label>
                      <input type="number" value={q.max_rating??10} onChange={e => updateQ(activeQ,'max_rating',Number(e.target.value))} style={inputSt} />
                    </div>
                  </div>
                )}

                {/* Logic branching */}
                <div style={{ marginBottom:14, background:'#f8fafc', borderRadius:10, padding:'14px 16px' }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Logic Branching (optional)</label>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, color:'#64748b' }}>If answer =</span>
                    <input className="sb-input" placeholder="value" value={q.logic?.if_answer||''} onChange={e => updateQ(activeQ,'logic',{...q.logic,if_answer:e.target.value})} style={{ ...inputSt, width:120 }} />
                    <span style={{ fontSize:12, color:'#64748b' }}>→ skip to Q</span>
                    <input type="number" className="sb-input" placeholder="#" value={q.logic?.goto_question||''} onChange={e => updateQ(activeQ,'logic',{...q.logic,goto_question:Number(e.target.value)})} style={{ ...inputSt, width:70 }} />
                  </div>
                </div>

                {/* Required */}
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, fontWeight:500, color:'#475569' }}>
                  <input type="checkbox" checked={q.required} onChange={e => updateQ(activeQ,'required',e.target.checked)} style={{ width:15, height:15 }} />
                  Mark as required
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
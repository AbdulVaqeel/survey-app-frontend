import { useState } from 'react'
import { PageShell, Section, Bullets } from '../../components/PageShell'
import api from '../../utils/api'

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return

    setStatus('sending')
    setErrorMsg('')
    try {
      await api.post('/contact', form)
      setStatus('sent')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err?.response?.data?.detail ||
        'Something went wrong sending your message. Please try again in a moment.'
      )
    }
  }

  return (
    <PageShell
      title="Let's talk about your survey program"
      subtitle="No generic contact form that vanishes into a queue — tell us what you're trying to measure and we'll set up time."
    >
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 48px;
          max-width: 1000px;
          margin: 8px auto 0;
          padding: 0 24px 64px;
          align-items: start;
        }
        .contact-input, .contact-textarea {
          width: 100%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14.5px;
          color: var(--ink);
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .contact-input:focus, .contact-textarea:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
        }
        .contact-textarea { resize: vertical; min-height: 130px; font-family: inherit; }
        .contact-label {
          display: block; font-size: 12.5px; font-weight: 700; color: var(--ink);
          margin-bottom: 6px;
        }
        .contact-submit-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 24px; border-radius: 10px; font-size: 15px; font-weight: 700;
          background: #0d9488; color: #fff; border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .contact-submit-btn:hover:not(:disabled) { background: #0f766e; transform: translateY(-1px); }
        .contact-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 760px) {
          .contact-grid { grid-template-columns: 1fr; gap: 36px; padding: 0 20px 48px; }
        }
      `}</style>

      <div className="contact-grid">
        {/* Left: direct contact info */}
        <div>
          <Section heading="Reach us directly">
            <Bullets items={[
              'General & sales enquiries — hello@surveymatrix.tech',
              'Support for existing accounts — support@surveymatrix.tech',
              'Riyadh office — King Fahd Road, Al Olaya District',
            ]} />
          </Section>
          <Section heading="What to include">
            <Bullets items={[
              'Roughly how many respondents you expect per month.',
              'Which channels matter to you — WhatsApp, SMS, QR at a physical location, or a plain link.',
              'Whether you have a PDPL or compliance review that needs to happen before rollout.',
            ]} />
          </Section>
        </div>

        {/* Right: the actual working form */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '36px 32px', marginTop: 64,
        }}>
          <h3 style={{
            fontFamily: "'Cairo', sans-serif", fontSize: 19, fontWeight: 800,
            color: 'var(--ink)', marginBottom: 6,
          }}>Send us a message</h3>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 24 }}>
            We reply within one business day.
          </p>

          {status === 'sent' ? (
            <div style={{
              background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.25)',
              borderRadius: 12, padding: '20px 18px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>✓</div>
              <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                Message sent
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 14 }}>
                Thanks — we'll get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                style={{
                  background: 'transparent', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer',
                }}
              >Send another message</button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label className="contact-label" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name" name="name" type="text" required
                  className="contact-input" placeholder="full name"
                  value={form.name} onChange={onChange}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="contact-label" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email" name="email" type="email" required
                  className="contact-input" placeholder="email"
                  value={form.email} onChange={onChange}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="contact-label" htmlFor="contact-subject">Subject (optional)</label>
                <input
                  id="contact-subject" name="subject" type="text"
                  className="contact-input" placeholder="subject"
                  value={form.subject} onChange={onChange}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="contact-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message" name="message" required
                  className="contact-textarea" placeholder="Tell us about your survey program..."
                  value={form.message} onChange={onChange}
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#b91c1c', marginBottom: 16,
                }}>{errorMsg}</div>
              )}

              <button type="submit" className="contact-submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  )
}

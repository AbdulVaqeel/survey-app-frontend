import { Link } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'

const ROLES = [
  { eyebrow: 'Engineering', title: 'Backend Engineer', desc: 'FastAPI, PostgreSQL, and the migration discipline that comes with never breaking production login. You’ll own the API that every survey, invite, and export runs through.', meta: 'Riyadh · Hybrid', accent: '#0d9488' },
  { eyebrow: 'Engineering', title: 'Frontend Engineer', desc: 'React, careful animation work, and an eye for interfaces that read naturally in Arabic and English. You’ll shape the builder and dashboard our customers live in daily.', meta: 'Riyadh · Hybrid', accent: '#f59e0b' },
  { eyebrow: 'Research', title: 'Arabic NLP Researcher', desc: 'Dialect-aware sentiment and topic modeling on open-text survey responses, across Gulf, Levantine, and Modern Standard Arabic.', meta: 'Remote · KSA', accent: '#f59e0b' },
  { eyebrow: 'Customer Success', title: 'CX Success Manager', desc: 'Onboard new accounts and help operations teams get their first survey out the door in a week, not a quarter.', meta: 'Jeddah · On-site', accent: '#0d9488' },
]

export default function Careers() {
  return (
    <PageShell
      title="Help us build the survey tool the region actually needed"
      subtitle="We're a small team based in Riyadh, hiring for a few specific roles right now."
    >
      <style>{`
        .careers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          max-width: 1000px;
          margin: 56px auto 0;
          padding: 0 24px;
        }
        .careers-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 40px 36px;
          text-align: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s;
        }
        .careers-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 26px 56px rgba(13,148,136,0.14);
          border-color: transparent;
        }
        @media (max-width: 760px) {
          .careers-grid { grid-template-columns: 1fr; gap: 20px; padding: 0 20px; }
          .careers-card { padding: 30px 26px; }
        }
      `}</style>

      <div className="careers-grid">
        {ROLES.map((r) => (
          <div key={r.title} className="careers-card">
            <div style={{
              display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: r.accent, background: r.accent + '14',
              padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}>{r.eyebrow}</div>

            <h3 style={{
              fontFamily: "'Cairo', sans-serif", fontSize: 22, fontWeight: 800,
              color: 'var(--ink)', letterSpacing: '-0.4px', marginBottom: 12,
            }}>{r.title}</h3>

            <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>
              {r.desc}
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 20, borderTop: '1px dashed var(--border)',
            }}>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{r.meta}</span>
              <Link to="/company/contact" style={{
                fontSize: 13.5, fontWeight: 700, color: r.accent, textDecoration: 'none',
              }}>Apply now →</Link>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

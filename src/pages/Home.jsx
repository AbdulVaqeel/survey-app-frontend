import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const FEATURES = [
  {
    icon: '📊',
    title: 'Real-time Analytics',
    desc: 'Watch responses pour in live. Instantly visualize trends, track completion rates, and surface insights the moment data arrives.',
  },
  {
    icon: '🎨',
    title: 'Beautiful Survey Builder',
    desc: 'Create professional surveys in minutes with our drag-and-drop builder. Choose from 20+ question types, custom themes, and branching logic.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'Your data never leaves our encrypted vault. SOC-2 certified infrastructure with SSO, audit logs, and granular access controls.',
  },
  {
    icon: '🌐',
    title: 'Multi-channel Distribution',
    desc: 'Reach respondents anywhere — email, SMS, embedded forms, QR codes, or direct links. Meet your audience where they already are.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    desc: 'Our AI engine auto-summarizes open-text responses, detects sentiment shifts, and surfaces anomalies you would have missed.',
  },
  {
    icon: '📤',
    title: 'Flexible Exports',
    desc: 'Export to Excel, CSV, SPSS, or push data directly to Salesforce, HubSpot, Slack, or your own API via webhooks.',
  },
]

const STATS = [
  { value: '2.4M+', label: 'Surveys created' },
  { value: '180M+', label: 'Responses collected' },
  { value: '99.98%', label: 'Platform uptime' },
  { value: '140+', label: 'Countries reached' },
]

const TESTIMONIALS = [
  {
    quote: 'SurveyPulse cut our NPS collection time by 60%. The real-time dashboard alone is worth every riyal.',
    name: 'Layla Al-Rashidi',
    role: 'Head of CX, Noon Commerce',
    avatar: 'L',
  },
  {
    quote: 'Finally a survey tool that doesn\'t look like it was designed in 2008. Our response rates jumped 34% after switching.',
    name: 'Omar Hafiz',
    role: 'Research Lead, STC',
    avatar: 'O',
  },
  {
    quote: 'The AI summarization for open-ended feedback is an absolute game-changer for our quarterly reviews.',
    name: 'Sara Al-Ghamdi',
    role: 'People Analytics, NEOM',
    avatar: 'S',
  },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar dark />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1117 0%, #1a2a3a 55%, #0d3d38 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%', top: '10%', left: '-10%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', bottom: '5%', right: '5%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 999,
          background: 'rgba(13,148,136,0.15)',
          border: '1px solid rgba(13,148,136,0.3)',
          marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-light)', display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: 'var(--teal-light)', fontWeight: 500 }}>
            Now available in Saudi Arabia & GCC
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(42px, 7vw, 80px)',
          fontWeight: 800, lineHeight: 1.1,
          color: '#fff',
          maxWidth: 780,
          letterSpacing: '-1.5px',
          marginBottom: 24,
        }}>
          Surveys that
          <span style={{
            display: 'block',
            background: 'linear-gradient(90deg, var(--teal-light), var(--amber))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            actually get answered.
          </span>
        </h1>

        <p style={{
          fontSize: 18, color: 'rgba(255,255,255,0.6)',
          maxWidth: 560, marginBottom: 44, lineHeight: 1.7,
          fontWeight: 300,
        }}>
          Build, distribute, and analyze surveys with confidence. Real-time dashboards,
          AI-powered insights, and enterprise-grade security — all in one platform.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/login" style={{
            padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600,
            background: 'linear-gradient(135deg, var(--teal), #0f766e)',
            color: '#fff', border: 'none',
            boxShadow: '0 4px 20px rgba(13,148,136,0.45)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Start for free →
          </Link>
          <Link to="/about" style={{
            padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500,
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            transition: 'background 0.2s',
          }}>
            See how it works
          </Link>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex', gap: 48, marginTop: 80, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
                color: '#fff', letterSpacing: '-1px',
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VISUAL CARDS SECTION ── */}
      <section style={{ padding: '100px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 2,
              color: 'var(--teal)', textTransform: 'uppercase', display: 'block', marginBottom: 12,
            }}>The Platform</span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)',
              lineHeight: 1.2,
            }}>Everything you need to understand your audience</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: 'var(--white)', borderRadius: 16, padding: '32px 28px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <div style={{
                  fontSize: 32, marginBottom: 16,
                  width: 56, height: 56, borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(245,158,11,0.08))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
                  color: 'var(--ink)', marginBottom: 10, letterSpacing: '-0.3px',
                }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 24px', background: 'var(--white)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 2,
              color: 'var(--teal)', textTransform: 'uppercase', display: 'block', marginBottom: 12,
            }}>Testimonials</span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)',
            }}>Trusted by research teams across the region</h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24,
          }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                background: 'var(--surface)', borderRadius: 16, padding: '32px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 28, color: 'var(--teal)', marginBottom: 16, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 24 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--teal), var(--amber))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 16,
                    fontFamily: 'var(--font-display)',
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #0d1117, #0d3d38)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16,
        }}>Ready to start listening?</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, marginBottom: 36 }}>
          Join thousands of teams making better decisions with SurveyPulse.
        </p>
        <Link to="/login" style={{
          padding: '14px 36px', borderRadius: 10, fontSize: 16, fontWeight: 600,
          background: 'linear-gradient(135deg, var(--amber), #d97706)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
          display: 'inline-block',
        }}>
          Get started — it's free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 40px', background: '#0d1117',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
          SurveyPulse
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          © 2025 SurveyPulse. All rights reserved.
        </span>
      </footer>
    </div>
  )
}
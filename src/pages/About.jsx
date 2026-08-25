import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import Footer from './Footer'

const TEAM = [
  { name: 'Fatimah Al-Otaibi',       role: 'Chief Scientific Officer (CSO)', gender: 'girl', accent: '#0d9488' },
  { name: 'Raed Al-dosari',      role: 'Chief Research Officer (CRO)',   gender: 'boy',  accent: '#f59e0b' },
  { name: 'Fatimah Al-Harbi',      role: 'Head of Product',                gender: 'girl', accent: '#f59e0b' },
  { name: 'Badr Al-mushairi',      role: 'Head of Design',                 gender: 'boy',  accent: '#0d9488' },
]

/* Original hand-illustrated avatar busts — no stock photography, no AI-generated
 * imagery. A hijab-and-abaya silhouette for the "girl" cards, a ghutra-and-thobe
 * silhouette for the "boy" cards, each tinted with the card's own accent color. */
function TeamAvatar({ gender, accent }) {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" role="img" aria-label={gender === 'girl' ? 'Illustrated portrait of a Saudi woman' : 'Illustrated portrait of a Saudi man'}>
      <defs>
        <linearGradient id={`teamGrad-${gender}-${accent.replace('#', '')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#teamGrad-${gender}-${accent.replace('#', '')})`} />

      {gender === 'girl' ? (
        <>
          {/* shoulders / abaya */}
          <path d="M38 200 Q38 148 100 142 Q162 148 162 200 Z" fill={accent} opacity="0.85" />
          {/* hijab drape */}
          <path d="M58 96 Q54 160 46 200 L70 200 Q66 150 70 108 Z" fill={accent} opacity="0.65" />
          <path d="M142 96 Q146 160 154 200 L130 200 Q134 150 130 108 Z" fill={accent} opacity="0.65" />
          {/* head */}
          <circle cx="100" cy="88" r="40" fill={accent} opacity="0.85" />
          {/* hijab cap over head, leaving a soft face oval */}
          <path d="M60 86 Q60 40 100 38 Q140 40 140 86 Q140 60 100 58 Q60 60 60 86 Z" fill={accent} />
          <ellipse cx="100" cy="94" rx="26" ry="30" fill="#FDFCF9" opacity="0.9" />
        </>
      ) : (
        <>
          {/* shoulders / thobe */}
          <path d="M40 200 Q40 150 100 144 Q160 150 160 200 Z" fill={accent} opacity="0.85" />
          {/* collar */}
          <path d="M84 148 L100 168 L116 148" fill="none" stroke="#FDFCF9" strokeWidth="4" strokeOpacity="0.6" />
          {/* head */}
          <circle cx="100" cy="86" r="38" fill={accent} opacity="0.85" />
          <ellipse cx="100" cy="92" rx="25" ry="29" fill="#FDFCF9" opacity="0.9" />
          {/* ghutra (headscarf) */}
          <path d="M56 78 Q52 40 100 34 Q148 40 144 78 Q140 54 100 50 Q60 54 56 78 Z" fill={accent} />
          <path d="M58 62 L40 118" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          <path d="M142 62 L160 118" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          {/* agal (black cord) */}
          <ellipse cx="100" cy="52" rx="42" ry="7" fill="none" stroke="#1f2937" strokeWidth="4" opacity="0.8" />
        </>
      )}
    </svg>
  )
}

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        :root { --font-display: 'Sora', sans-serif; }
        .sp-about-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-about-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;
          background: #0d9488; color: #fff; border: none; cursor: pointer;
          letter-spacing: 0.01em; transition: background 0.2s, transform 0.15s;
          text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(13,148,136,0.25);
        }
        .sp-about-btn:hover { background: #0f766e; transform: translateY(-1px); }

        .about-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .about-team-card { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s; }
        .about-team-card:hover { transform: translateY(-6px); box-shadow: 0 22px 48px rgba(13,148,136,0.14); }
        .about-team-card:hover .about-team-avatar { transform: scale(1.05); }
        .about-team-avatar { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }

        @media (max-width: 700px) {
          .about-mission-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .about-team-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .about-hero-section {
            padding: 100px 20px 60px !important;
          }
          .about-mission-section {
            padding: 60px 20px !important;
          }
          .about-team-section {
            padding: 60px 20px !important;
          }
          .about-cta-section {
            padding: 60px 20px !important;
          }
          .about-h1 {
            font-size: clamp(26px, 7vw, 48px) !important;
          }
        }

        @media (max-width: 420px) {
          .about-team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="sp-about-root">
        <Navbar />

        {/* Hero */}
        <section className="about-hero-section" style={{
          paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24,
          background: 'linear-gradient(160deg, var(--surface) 0%, #e6f7f5 100%)',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 2,
            color: 'var(--teal)', textTransform: 'uppercase', display: 'block', marginBottom: 16,
          }}>Our Story</span>
          <h1 className="about-h1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--ink)',
            maxWidth: 680, margin: '0 auto 20px', lineHeight: 1.2,
          }}>
            We believe every voice deserves to be heard.
          </h1>
          <p style={{
            fontSize: 16, color: 'var(--muted)', maxWidth: 560, margin: '0 auto',
            lineHeight: 1.75, fontWeight: 300,
          }}>
            SurveyMatrix was founded in Riyadh in 2021 by a team of researchers and engineers
            frustrated by clunky survey tools that failed to match the pace of modern business.
            We set out to build something better.
          </p>
        </section>

        {/* Mission */}
        <section className="about-mission-section" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
          <div className="about-mission-grid">
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800,
                letterSpacing: '-0.8px', color: 'var(--ink)', marginBottom: 16,
              }}>Our Mission</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16, fontWeight: 400 }}>
                We are on a mission to democratize data collection and insight generation across
                the MENA region. We believe organizations of all sizes deserve world-class survey infrastructure.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontWeight: 400 }}>
                Every survey sent through our platform is an opportunity to listen more deeply,
                decide more wisely, and build more human relationships between organizations
                and the people they serve.
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #0d3d38, #0d9488)',
              borderRadius: 20, padding: '32px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              {[
                { n: '2021', l: 'Founded in Riyadh' },
                { n: '50+',  l: 'Team members globally' },
                { n: 'Series A', l: 'Funded in 2023' },
                { n: '4.9★', l: 'Average customer rating' },
              ].map(({ n, l }) => (
                <div key={l} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 14 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: '#fff' }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: 400 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-team-section" style={{ padding: '80px 24px', background: 'var(--surface)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800,
              letterSpacing: '-0.8px', marginBottom: 40, color: 'var(--ink)',
            }}>The team behind the pulse</h2>
            <div className="about-team-grid">
              {TEAM.map((m) => (
                <div key={m.name} className="about-team-card" style={{
                  background: 'var(--white)', borderRadius: 18, overflow: 'hidden',
                  border: '1px solid var(--border)', textAlign: 'center',
                }}>
                  <div className="about-team-avatar" style={{ width: '100%', aspectRatio: '1 / 1' }}>
                    <TeamAvatar gender={m.gender} accent={m.accent} />
                  </div>
                  <div style={{ padding: '18px 14px 22px' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta-section" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800,
            letterSpacing: '-0.8px', marginBottom: 16, color: 'var(--ink)',
          }}>Join the SurveyMatrix community</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 400 }}>
            Start collecting insights that actually move the needle.
          </p>
          <Link to="/login" className="sp-about-btn">Explore Now! →</Link>
        </section>
      </div>
      <Footer />
    </div>
  )
}
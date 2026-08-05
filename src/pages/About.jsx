import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import Footer from './Footer'

const TEAM = [
  { name: 'Athiq',  role: 'Chief Scientific Officer (CSO)', avatar: 'A' },
  { name: 'Nawaz',  role: 'Chief Research Officer (CRO)',   avatar: 'N' },
  { name: 'Rafiya', role: 'Head of Product',                avatar: 'R' },
  { name: 'Johny',  role: 'Head of Design',                 avatar: 'J' },
]

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
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
        }

        @media (max-width: 700px) {
          .about-mission-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .about-team-grid {
            grid-template-columns: 1fr 1fr;
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
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800,
              letterSpacing: '-0.8px', marginBottom: 40, color: 'var(--ink)',
            }}>The team behind the pulse</h2>
            <div className="about-team-grid">
              {TEAM.map((m) => (
                <div key={m.name} style={{
                  background: 'var(--white)', borderRadius: 16, padding: '24px 16px',
                  border: '1px solid var(--border)', textAlign: 'center',
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%', margin: '0 auto 14px',
                    background: 'linear-gradient(135deg, var(--teal), var(--amber))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 22,
                    fontFamily: 'var(--font-display)',
                  }}>{m.avatar}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>{m.role}</div>
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
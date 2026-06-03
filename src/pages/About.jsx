import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const TEAM = [
  { name: 'Syed Abrar', role: 'Chief Scientific Officer (CSO)', avatar: 'S' },
  { name: 'Aleem', role: 'Chief Research Officer (CRO)', avatar: 'A' },
  { name: 'Swamy', role: 'Head of Product', avatar: 'K' },
  { name: 'Failur', role: 'Head of Design', avatar: 'N' },
]

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Dynamic Typography and Button Sync matching Home page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        
        :root {
          --font-display: 'Sora', sans-serif;
        }

        .sp-about-root { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
        }

        .sp-about-btn {
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          padding: 15px 32px; 
          border-radius: 10px; 
          font-size: 15px; 
          font-weight: 600; 
          background: #0d9488; 
          color: #fff; 
          border: none; 
          cursor: pointer; 
          letter-spacing: 0.01em; 
          transition: background 0.2s, transform 0.15s; 
          text-decoration: none; 
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(13,148,136,0.25);
        }

        .sp-about-btn:hover { 
          background: #0f766e; 
          transform: translateY(-1px); 
        }
      `}</style>

      <div className="sp-about-root">
        <Navbar />

        {/* Hero */}
        <section style={{
          paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24,
          background: 'linear-gradient(160deg, var(--surface) 0%, #e6f7f5 100%)',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 2,
            color: 'var(--teal)', textTransform: 'uppercase', display: 'block', marginBottom: 16,
          }}>Our Story</span>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--ink)',
            maxWidth: 680, margin: '0 auto 20px', lineHeight: 1.2,
          }}>
            We believe every voice deserves to be heard.
          </h1>
          <p style={{
            fontSize: 17, color: 'var(--muted)', maxWidth: 560, margin: '0 auto',
            lineheight: 1.75, fontWeight: 300,
          }}>
            SurveyPulse was founded in Riyadh in 2021 by a team of researchers and engineers
            frustrated by clunky survey tools that failed to match the pace of modern business.
            We set out to build something better.
          </p>
        </section>

        {/* Mission */}
        <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
                letterSpacing: '-0.8px', color: 'var(--ink)', marginBottom: 16,
              }}>Our Mission</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16, fontWeight: 400 }}>
                We are on a mission to democratize data collection and insight generation across
                the MENA region. We believe organizations of all sizes — from ambitious startups
                to global enterprises — deserve world-class survey infrastructure.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontWeight: 400 }}>
                Every survey sent through our platform is an opportunity to listen more deeply,
                decide more wisely, and build more human relationships between organizations
                and the people they serve.
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #0d3d38, #0d9488)',
              borderRadius: 20, padding: '40px',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              {[
                { n: '2021', l: 'Founded in Riyadh' },
                { n: '50+', l: 'Team members globally' },
                { n: 'Series A', l: 'Funded in 2023' },
                { n: '4.9★', l: 'Average customer rating' },
              ].map(({ n, l }) => (
                <div key={l} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff',
                  }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: 400 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ padding: '80px 24px', background: 'var(--surface)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
              letterSpacing: '-0.8px', marginBottom: 48, color: 'var(--ink)',
            }}>The team behind the pulse</h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24,
            }}>
              {TEAM.map((m) => (
                <div key={m.name} style={{
                  background: 'var(--white)', borderRadius: 16, padding: '28px 20px',
                  border: '1px solid var(--border)', textAlign: 'center',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                    background: 'linear-gradient(135deg, var(--teal), var(--amber))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 24,
                    fontFamily: 'var(--font-display)',
                  }}>{m.avatar}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
            letterSpacing: '-0.8px', marginBottom: 16, color: 'var(--ink)',
          }}>Join the SurveyPulse community</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 400 }}>
            Start collecting insights that actually move the needle.
          </p>
          <Link to="/login" className="sp-about-btn">Explore Now! →</Link>
        </section>
      </div>
    </div>
  )
}
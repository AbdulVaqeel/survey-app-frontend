import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../pages/Footer'

/* ────────────────────────────────────────────────────────────────────────
 * Shared building blocks for every Product / Company / Legal page.
 * Each page (frontend/src/pages/product/*.jsx, /company/*.jsx, /legal/*.jsx)
 * owns its own content and imports whichever of these pieces it needs —
 * so adding or editing one page never touches any other page's file.
 * ──────────────────────────────────────────────────────────────────────── */

export function PageShell({ tag, title, subtitle, children, cta = true }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .sp-static-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-static-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;
          background: #0d9488; color: #fff; border: none; cursor: pointer;
          letter-spacing: 0.01em; transition: background 0.2s, transform 0.15s;
          text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(13,148,136,0.25);
        }
        .sp-static-btn:hover { background: #0f766e; transform: translateY(-1px); }
        .sp-static-section { padding: 64px 24px; max-width: 900px; margin: 0 auto; }
        .sp-static-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        @media (max-width: 700px) {
          .sp-static-hero { padding: 100px 20px 56px !important; }
          .sp-static-section { padding: 48px 20px; }
        }
      `}</style>

      <div className="sp-static-root">
        <Navbar />

        <section className="sp-static-hero" style={{
          paddingTop: 120, paddingBottom: 64, paddingLeft: 24, paddingRight: 24,
          background: 'linear-gradient(160deg, var(--surface) 0%, #e6f7f5 100%)',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 2,
            color: 'var(--teal)', textTransform: 'uppercase', display: 'block', marginBottom: 16,
          }}>{tag}</span>
          <h1 style={{
            fontFamily: "'Cairo', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800, letterSpacing: '-1.2px', color: 'var(--ink)',
            maxWidth: 700, margin: '0 auto 18px', lineHeight: 1.2,
          }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75, fontWeight: 300 }}>
              {subtitle}
            </p>
          )}
        </section>

        {children}

        {cta && (
          <section style={{ padding: '72px 24px', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: "'Cairo', sans-serif", fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
              letterSpacing: '-0.7px', marginBottom: 14, color: 'var(--ink)',
            }}>Want to see it running on your own data?</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 28, fontWeight: 400 }}>
              No generic demo account — we'll set it up with your actual branch names and product lines.
            </p>
            <Link to="/login" className="sp-static-btn">Open the dashboard →</Link>
          </section>
        )}
      </div>
      <Footer />
    </div>
  )
}

export function Section({ heading, children }) {
  return (
    <section className="sp-static-section">
      {heading && (
        <h2 style={{
          fontFamily: "'Cairo', sans-serif", fontSize: 'clamp(20px, 3.4vw, 26px)', fontWeight: 800,
          letterSpacing: '-0.6px', color: 'var(--ink)', marginBottom: 20,
        }}>{heading}</h2>
      )}
      {children}
    </section>
  )
}

export function Paragraphs({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((p, i) => (
        <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.85, fontWeight: 400, fontSize: 15 }}>{p}</p>
      ))}
    </div>
  )
}

export function Bullets({ items }) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
      {items.map((b, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'var(--muted)', lineHeight: 1.7, fontSize: 15 }}>
          <span style={{
            flexShrink: 0, width: 20, height: 20, borderRadius: '50%', marginTop: 2,
            background: 'rgba(13,148,136,0.12)', color: 'var(--teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800,
          }}>✓</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

export function Cards({ items }) {
  return (
    <div className="sp-static-cards">
      {items.map((c, i) => (
        <div key={i} style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
          padding: '24px 22px',
        }}>
          {c.eyebrow && (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--teal)', textTransform: 'uppercase' }}>{c.eyebrow}</span>
          )}
          <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: '6px 0 8px' }}>{c.title}</div>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, fontWeight: 400 }}>{c.desc}</p>
          {c.meta && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, fontWeight: 600 }}>{c.meta}</div>}
        </div>
      ))}
    </div>
  )
}

/* ── Pricing gets its own tier layout ── */
export function PricingTiers({ tiers }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
      {tiers.map((t) => (
        <div key={t.name} style={{
          background: t.highlight ? 'linear-gradient(135deg, #0d3d38, #0d9488)' : 'var(--white)',
          border: t.highlight ? 'none' : '1px solid var(--border)',
          borderRadius: 18, padding: '28px 24px',
          boxShadow: t.highlight ? '0 20px 50px rgba(13,148,136,0.25)' : 'none',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.highlight ? 'rgba(255,255,255,0.7)' : 'var(--teal)' }}>{t.name}</div>
          <div style={{
            fontFamily: "'Cairo', sans-serif", fontSize: 30, fontWeight: 800, margin: '10px 0 4px',
            color: t.highlight ? '#fff' : 'var(--ink)', letterSpacing: '-1px',
          }}>{t.price}</div>
          <div style={{ fontSize: 12.5, marginBottom: 18, color: t.highlight ? 'rgba(255,255,255,0.65)' : 'var(--muted)' }}>{t.priceNote}</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            {t.features.map((f, i) => (
              <li key={i} style={{
                fontSize: 13.5, display: 'flex', gap: 8, alignItems: 'flex-start',
                color: t.highlight ? 'rgba(255,255,255,0.85)' : 'var(--muted)',
              }}>
                <span style={{ color: t.highlight ? '#fff' : 'var(--teal)' }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <Link to="/login" style={{
            display: 'block', textAlign: 'center', padding: '11px', borderRadius: 9, fontSize: 14, fontWeight: 700,
            textDecoration: 'none',
            background: t.highlight ? '#fff' : 'transparent',
            color: t.highlight ? 'var(--teal)' : 'var(--ink)',
            border: t.highlight ? 'none' : '1px solid var(--border)',
          }}>{t.cta}</Link>
        </div>
      ))}
    </div>
  )
}

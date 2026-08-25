import { Link } from 'react-router-dom'
import { PRODUCT_LINKS, COMPANY_LINKS, LEGAL_LINKS } from '../siteNav'

const LINKS = {
  Product: PRODUCT_LINKS,
  Company: COMPANY_LINKS,
  Legal: LEGAL_LINKS,
}

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/cruxtechnologysolutions/posts/?feedView=all',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--surface)',
      color: 'var(--muted)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      borderTop: '1px solid var(--border)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .sp-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 32px;
        }
        @media (max-width: 700px) {
          .sp-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px 24px; }
          .sp-footer-brand { grid-column: 1 / -1; }
        }
      `}</style>

      {/* ── Top section ── */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: 'clamp(40px,8vw,72px) 24px clamp(32px,6vw,56px)',
      }}>

        <div className="sp-footer-grid">

          {/* Brand column */}
          <div className="sp-footer-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
              <span style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, var(--teal), var(--amber))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800, color: '#fff',
              }}>S</span>
              <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
                SurveyPulse
              </span>
            </Link>

            <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 260, marginBottom: 20 }}>
              The modern survey platform built for teams that move fast and listen deeply.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--muted)',
                    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(13,148,136,0.08)'
                    e.currentTarget.style.borderColor = 'var(--teal)'
                    e.currentTarget.style.color = 'var(--teal)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--white)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--muted)'
                  }}
                >{icon}</a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <div style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.45,
                marginBottom: 16,
              }}>{group}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span style={{ fontSize: 12 }}>
          © {year} SurveyPulse. All rights reserved.
        </span>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {LEGAL_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

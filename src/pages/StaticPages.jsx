import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from './Footer'

/* ────────────────────────────────────────────────────────────────────────
 * Shared shell for every Product / Company / Legal page reached from the
 * navbar dropdowns or the footer. One layout, one place to tweak the look.
 * ──────────────────────────────────────────────────────────────────────── */
function PageShell({ tag, title, subtitle, children, cta = true }) {
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

function Section({ heading, children }) {
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

function Paragraphs({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((p, i) => (
        <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.85, fontWeight: 400, fontSize: 15 }}>{p}</p>
      ))}
    </div>
  )
}

function Bullets({ items }) {
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

function Cards({ items }) {
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
function PricingTiers({ tiers }) {
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

/* ────────────────────────────────────────────────────────────────────────
 * Content — one entry per route slug
 * ──────────────────────────────────────────────────────────────────────── */
const PRODUCT_CONTENT = {
  features: {
    title: 'Everything you need to run real customer surveys',
    subtitle: 'From a CSV of respondents to a finished analytics deck — built Arabic-first for teams operating in the Kingdom.',
    body: [
      { heading: 'Build once, send anywhere',
        bullets: [
          'A right-to-left survey builder from the first version — not an English template with the text flipped.',
          'Unique per-respondent links generated in bulk from a CSV upload, each one trackable end to end.',
          'A QR code for every link, ready to print at the till, on a receipt, or on a table tent.',
          'Send by WhatsApp, SMS, a plain link, or a QR code — whatever channel your customers actually use.',
        ] },
      { heading: 'See it live, not next Monday',
        bullets: [
          'Response dashboard updates as answers come in, with CSAT and NPS tracked automatically.',
          'Open-text answers in Arabic and English get summarized so nothing gets missed in a spreadsheet.',
          'Export to Excel, PDF, or PowerPoint whenever you need it in a deck.',
        ] },
    ],
  },
  analytics: {
    title: 'Analytics that update while the answers are still coming in',
    subtitle: 'Every response lands on the dashboard in real time — no nightly batch job, no waiting for a report someone builds on Monday.',
    body: [
      { heading: 'What you get out of the box',
        bullets: [
          'Live CSAT and NPS trends, broken down by branch, region, or survey.',
          'Automatic flagging of open-text responses that read like a real complaint.',
          'Invite-level tracking — sent, opened, completed — so you know exactly how a batch performed.',
          'One-click export to Excel, PowerPoint, or PDF for the board deck.',
        ] },
      { heading: 'Built for people who read Arabic responses daily',
        bullets: [
          'Text analysis handles Gulf and Levantine Arabic dialects, not just Modern Standard Arabic.',
          'Sentiment and topic summaries are generated per survey, not bolted on afterward.',
        ] },
    ],
  },
  security: {
    title: "Your data doesn't leave the Kingdom",
    subtitle: "Hosted on infrastructure inside Saudi Arabia and built around SDAIA's PDPL requirements — ask us where the servers sit, we'll actually tell you.",
    body: [
      { heading: 'How we handle your data',
        bullets: [
          'Survey responses and respondent data are stored on infrastructure located inside Saudi Arabia.',
          'Access controls are scoped per account — one organization can never see another\'s survey data.',
          'Passwords are hashed, never stored in plain text; every session is authenticated with a signed token.',
          'Invite links are single-use tokens, not guessable sequential IDs.',
        ] },
      { heading: 'Compliance',
        bullets: [
          'Built around the Kingdom\'s Personal Data Protection Law (PDPL) requirements from SDAIA.',
          'We can walk your IT or compliance team through the architecture before you sign anything.',
        ] },
    ],
  },
  pricing: {
    title: 'Simple pricing, no surprise invoices',
    subtitle: 'Every plan includes the Arabic-first builder, QR/WhatsApp distribution, and real-time analytics. Pick the plan that matches how many people you survey.',
    pricing: true,
    tiers: [
      {
        name: 'Starter', price: '﷼ 499', priceNote: 'per month, up to 500 responses',
        features: ['1 active survey at a time', 'CSV upload for unique links + QR codes', 'Real-time dashboard', 'Excel export'],
        cta: 'Start with Starter',
      },
      {
        name: 'Growth', price: '﷼ 1,499', priceNote: 'per month, up to 5,000 responses', highlight: true,
        features: ['Unlimited active surveys', 'WhatsApp + SMS distribution', 'Arabic sentiment analysis', 'PDF & PowerPoint export', 'Priority local support'],
        cta: 'Start with Growth',
      },
      {
        name: 'Enterprise', price: 'Custom', priceNote: 'volume pricing, dedicated hosting',
        features: ['Everything in Growth', 'Dedicated KSA-hosted instance', 'SSO and role-based access', 'A named account manager'],
        cta: 'Talk to us',
      },
    ],
  },
}

const COMPANY_CONTENT = {
  careers: {
    tag: 'Company',
    title: 'Help us build the survey tool the region actually needed',
    subtitle: "We're a small team based in Riyadh, hiring for a few specific roles right now.",
    body: [],
    cards: [
      { eyebrow: 'Engineering', title: 'Backend Engineer', desc: 'FastAPI, PostgreSQL, and the migration discipline that comes with never breaking production login.', meta: 'Riyadh · Hybrid' },
      { eyebrow: 'Engineering', title: 'Frontend Engineer', desc: 'React, careful animation work, and an eye for interfaces that read naturally in Arabic and English.', meta: 'Riyadh · Hybrid' },
      { eyebrow: 'Research', title: 'Arabic NLP Researcher', desc: 'Dialect-aware sentiment and topic modeling on open-text survey responses.', meta: 'Remote · KSA' },
      { eyebrow: 'Customer Success', title: 'CX Success Manager', desc: 'Onboard new accounts and help operations teams get their first survey out the door in a week.', meta: 'Jeddah · On-site' },
    ],
  },
  blog: {
    tag: 'Company',
    title: 'Notes on running CX surveys in the Kingdom',
    subtitle: 'Short, practical posts — not a content-marketing firehose.',
    body: [],
    cards: [
      { eyebrow: 'Guide', title: 'Why Arabic-first survey design changes your completion rate', desc: 'What actually breaks when an English survey builder gets a translation layer bolted on, and what to check instead.' },
      { eyebrow: 'Guide', title: 'QR codes at the till vs. WhatsApp: picking the right channel', desc: 'A practical breakdown of response rates by channel across retail, F&B, and healthcare deployments.' },
      { title: 'What "hosted in the Kingdom" actually means for your PDPL review', desc: 'A plain explanation of the infrastructure and access-control questions compliance teams tend to ask.' },
      { eyebrow: 'Guide', title: 'Three questions beat twelve: keeping surveys short enough to finish', desc: 'How we think about survey length before a single question gets written.' },
    ],
  },
  contact: {
    tag: 'Company',
    title: "Let's talk about your survey program",
    subtitle: "No generic contact form that vanishes into a queue — tell us what you're trying to measure and we'll set up time.",
    body: [
      { heading: 'Reach us directly',
        bullets: [
          'General & sales enquiries — hello@surveymatrix.tech',
          'Support for existing accounts — support@surveymatrix.tech',
          'Riyadh office — King Fahd Road, Al Olaya District',
        ] },
      { heading: 'What to include',
        bullets: [
          'Roughly how many respondents you expect per month.',
          'Which channels matter to you — WhatsApp, SMS, QR at a physical location, or a plain link.',
          'Whether you have a PDPL or compliance review that needs to happen before rollout.',
        ] },
    ],
  },
}

const LEGAL_CONTENT = {
  privacy: {
    tag: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'How SurveyMatrix collects, stores, and protects data for account holders and survey respondents.',
    cta: false,
    body: [
      { heading: 'What we collect',
        paragraphs: [
          "For account holders, we collect the information needed to run the account: username, email, and the surveys and responses you create.",
          "For survey respondents, we collect only what a given survey actually asks — plus, where an invite link is used, the name and email supplied at upload time so a response can be matched to the right person.",
        ] },
      { heading: 'Where data lives',
        paragraphs: [
          "Survey data is hosted on infrastructure located inside Saudi Arabia, in line with SDAIA's PDPL framework. We do not sell respondent data to third parties.",
        ] },
      { heading: 'Your choices',
        paragraphs: [
          "Account holders can export or delete their survey data at any time from the dashboard. Respondents can request removal of their individual response by contacting support@surveymatrix.tech.",
        ] },
    ],
  },
  terms: {
    tag: 'Legal',
    title: 'Terms of Service',
    subtitle: 'The basics of using the SurveyMatrix platform as an account holder.',
    cta: false,
    body: [
      { heading: 'Using the platform',
        paragraphs: [
          "You're responsible for the content of the surveys you create and for having a lawful basis to contact the respondents you upload.",
          "Accounts are for a single organization's use; sharing login credentials across unrelated organizations isn't permitted.",
        ] },
      { heading: 'Service availability',
        paragraphs: [
          "We aim for the uptime figures shown on our homepage, but scheduled maintenance will occasionally be communicated in advance.",
        ] },
      { heading: 'Changes to these terms',
        paragraphs: [
          "We'll notify account holders by email before any material change takes effect.",
        ] },
    ],
  },
  cookies: {
    tag: 'Legal',
    title: 'Cookie Policy',
    subtitle: 'What we use cookies for, and what we deliberately don\'t use them for.',
    cta: false,
    body: [
      { heading: 'Essential cookies',
        paragraphs: [
          "We use a small number of cookies required to keep you logged in securely and to remember basic preferences like language.",
        ] },
      { heading: 'What we don\'t do',
        paragraphs: [
          "We don't run third-party advertising trackers on this site.",
        ] },
    ],
  },
}

function renderBody(section, idx) {
  const { heading, paragraphs, bullets } = section
  return (
    <Section key={idx} heading={heading}>
      {paragraphs && <Paragraphs items={paragraphs} />}
      {bullets && <Bullets items={bullets} />}
    </Section>
  )
}

export function ProductPage() {
  const { slug } = useParams()
  const page = PRODUCT_CONTENT[slug]
  if (!page) return <Navigate to="/" replace />
  return (
    <PageShell tag={page.tag} title={page.title} subtitle={page.subtitle}>
      {page.pricing ? (
        <Section><PricingTiers tiers={page.tiers} /></Section>
      ) : (
        page.body.map(renderBody)
      )}
    </PageShell>
  )
}

export function CompanyPage() {
  const { slug } = useParams()
  const page = COMPANY_CONTENT[slug]
  if (!page) return <Navigate to="/" replace />
  return (
    <PageShell tag={page.tag} title={page.title} subtitle={page.subtitle}>
      {page.body.map(renderBody)}
      {page.cards && <Section><Cards items={page.cards} /></Section>}
    </PageShell>
  )
}

export function LegalPage() {
  const { slug } = useParams()
  const page = LEGAL_CONTENT[slug]
  if (!page) return <Navigate to="/" replace />
  return (
    <PageShell tag={page.tag} title={page.title} subtitle={page.subtitle} cta={page.cta !== false}>
      {page.body.map(renderBody)}
    </PageShell>
  )
}

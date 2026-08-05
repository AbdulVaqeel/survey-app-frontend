import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from './Footer'

const FEATURES = [
  { icon: '📊', title: 'Real-time Analytics', desc: 'Watch responses pour in live. Instantly visualize trends, track completion rates, and surface insights the moment data arrives.' },
  { icon: '🎨', title: 'Beautiful Survey Builder', desc: 'Create professional surveys in minutes with drag-and-drop. Choose from 20+ question types, custom themes, and branching logic.' },
  { icon: '🔒', title: 'Enterprise Security', desc: 'Your data never leaves our encrypted vault. SOC-2 certified infrastructure with SSO, audit logs, and granular access controls.' },
  { icon: '🌐', title: 'Multi-channel Distribution', desc: 'Reach respondents anywhere — email, SMS, embedded forms, QR codes, or direct links. Meet your audience where they are.' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Our AI engine auto-summarizes open-text responses, detects sentiment shifts, and surfaces anomalies you would have missed.' },
  { icon: '📤', title: 'Flexible Exports', desc: 'Export to Excel, CSV, SPSS, or push data directly to Salesforce, HubSpot, Slack, or your own API via webhooks.' },
]

const STATS = [
  { value: '2.4M+', label: 'Surveys created' },
  { value: '180M+', label: 'Responses collected' },
  { value: '99.98%', label: 'Platform uptime' },
  { value: '140+', label: 'Countries reached' },
]

const TEAM = [
  { name: 'Abdul', role: 'Founder & Head of SurveyMatrix', image: '/IT_1.jpg', accent: '#0d9488' },
  { name: 'Sara',  role: 'Senior Director of SurveyMatrix', image: '/IT_2.jpg', accent: '#7c3aed' },
  { name: 'Rafiq', role: 'Research Lead of SurveyMatrix',   image: '/IT_3.jpg', accent: '#d97706' },
]

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');

        .sp-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAFAF8; color: #1a1a1a; }

        .sp-hero { min-height: 100vh; background: #0E1117; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 130px 24px 90px; position: relative; overflow: hidden; }
        .sp-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13,148,136,0.18) 0%, transparent 70%); pointer-events: none; }

        .sp-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(13,148,136,0.12); border: 1px solid rgba(13,148,136,0.25); margin-bottom: 36px; }
        .sp-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #2dd4bf; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        .sp-badge-text { font-size: 13px; color: #2dd4bf; font-weight: 500; letter-spacing: 0.02em; }

        .sp-h1 { font-family: 'Sora', sans-serif; font-size: clamp(32px, 7vw, 78px); font-weight: 700; line-height: 1.07; color: #FAFAF8; letter-spacing: -2.5px; margin-bottom: 28px; max-width: 800px; }
        .sp-h1-accent { display: block; font-family: 'Italiana', serif; font-style: normal; font-weight: 400; background: linear-gradient(90deg, #2dd4bf 0%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .sp-hero-sub { font-size: clamp(15px, 2vw, 18px); color: rgba(250,250,248,0.55); max-width: 520px; margin: 0 auto 48px; line-height: 1.8; font-weight: 300; letter-spacing: 0.01em; }

        .sp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; background: #0d9488; color: #fff; border: none; cursor: pointer; letter-spacing: 0.01em; transition: background 0.2s, transform 0.15s; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-btn-primary:hover { background: #0f766e; transform: translateY(-1px); }
        .sp-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; background: rgba(250,250,248,0.07); color: rgba(250,250,248,0.75); border: 1px solid rgba(250,250,248,0.14); cursor: pointer; transition: background 0.2s; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-btn-ghost:hover { background: rgba(250,250,248,0.12); }

        .sp-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

        .sp-stats { display: flex; gap: 40px; margin-top: 80px; flex-wrap: wrap; justify-content: center; }
        .sp-stat-val { font-family: 'Sora', sans-serif; font-size: clamp(26px, 5vw, 36px); font-weight: 700; color: #FAFAF8; letter-spacing: -1.5px; line-height: 1; }
        .sp-stat-label { font-size: 13px; color: rgba(250,250,248,0.4); margin-top: 5px; font-weight: 400; letter-spacing: 0.02em; }

        .sp-section { padding: 80px 24px; }
        .sp-section-light { background: #FAFAF8; }
        .sp-section-tinted { background: #F4F3EF; }
        .sp-section-dark { background: #0E1117; }

        .sp-section-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: #0d9488; text-transform: uppercase; display: block; margin-bottom: 14px; }
        .sp-h2 { font-family: 'Sora', sans-serif; font-size: clamp(24px, 4vw, 44px); font-weight: 700; letter-spacing: -1.2px; color: #1a1a1a; line-height: 1.2; max-width: 640px; margin: 0 auto; }
        .sp-h2-light { color: #FAFAF8; }
        .sp-section-desc { font-size: 16px; color: #6b7280; margin-top: 16px; line-height: 1.75; font-weight: 300; max-width: 500px; margin-left: auto; margin-right: auto; }

        .sp-grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1080px; margin: 56px auto 0; }
        .sp-card { background: #fff; border-radius: 16px; padding: 28px 24px; border: 1px solid #E8E7E2; transition: transform 0.2s, box-shadow 0.2s; }
        .sp-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
        .sp-card-icon { width: 52px; height: 52px; border-radius: 13px; background: #F0FAF8; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
        .sp-card-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 600; color: #1a1a1a; margin-bottom: 10px; letter-spacing: -0.3px; }
        .sp-card-desc { font-size: 14px; color: #6b7280; line-height: 1.7; font-weight: 400; }

        .sp-stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1px; background: rgba(250,250,248,0.08); border: 1px solid rgba(250,250,248,0.08); border-radius: 16px; overflow: hidden; max-width: 880px; margin: 56px auto 0; }
        .sp-stat-cell { padding: 28px 20px; background: rgba(250,250,248,0.03); text-align: center; }
        .sp-stat-cell-val { font-family: 'Sora', sans-serif; font-size: clamp(26px, 5vw, 38px); font-weight: 700; color: #FAFAF8; letter-spacing: -2px; line-height: 1; }
        .sp-stat-cell-label { font-size: 13px; color: rgba(250,250,248,0.4); margin-top: 6px; font-weight: 400; }

        .sp-team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; max-width: 1080px; margin: 56px auto 0; }
        .sp-team-card { background: #fff; border-radius: 20px; overflow: hidden; border: 1px solid #E8E7E2; transition: transform 0.25s, box-shadow 0.25s; }
        .sp-team-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(0,0,0,0.10); }
        .sp-team-img-wrap { position: relative; width: 100%; height: 280px; overflow: hidden; }
        .sp-team-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top 5%; display: block; transition: transform 0.4s ease; }
        .sp-team-card:hover .sp-team-img-wrap img { transform: scale(1.04); }
        .sp-team-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,17,23,0.55) 0%, transparent 55%); }
        .sp-team-body { padding: 20px 22px 22px; }
        .sp-team-accent-bar { width: 36px; height: 3px; border-radius: 99px; margin-bottom: 14px; }
        .sp-team-name { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.3px; margin-bottom: 4px; }
        .sp-team-role { font-size: 13px; color: #6b7280; font-weight: 400; line-height: 1.5; }
        .sp-team-company { display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }

        .sp-cta { padding: 80px 24px; background: linear-gradient(160deg, #0E1117 0%, #0a2e2a 100%); text-align: center; }
        .sp-cta-sub { font-size: 16px; color: rgba(250,250,248,0.45); margin: 14px 0 40px; font-weight: 300; line-height: 1.7; }
        .sp-btn-amber { display: inline-flex; align-items: center; gap: 8px; padding: 15px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; background: #d97706; color: #fff; border: none; cursor: pointer; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.2s, transform 0.15s; }
        .sp-btn-amber:hover { background: #b45309; transform: translateY(-1px); }

        .sp-footer { padding: 24px 24px; background: #0a0d11; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .sp-footer-logo { font-family: 'Italiana', serif; font-weight: 400; color: rgba(250,250,248,0.6); font-size: 20px; letter-spacing: 0.5px; }
        .sp-footer-copy { font-size: 12px; color: rgba(250,250,248,0.25); }
        .sp-divider { width: 48px; height: 3px; background: #0d9488; border-radius: 99px; margin: 20px auto 0; }

        @media (min-width: 900px) {
          .left-panel { display: flex !important; }
        }

        /* ── Mobile overrides ── */
        @media (max-width: 600px) {
          .sp-hero { padding: 100px 20px 60px; }
          .sp-h1 { letter-spacing: -1px; }
          .sp-stats { gap: 28px; margin-top: 52px; }
          .sp-hero-btns .sp-btn-primary,
          .sp-hero-btns .sp-btn-ghost { width: 100%; justify-content: center; padding: 14px 24px; }
          .sp-section { padding: 60px 20px; }
          .sp-grid-3 { grid-template-columns: 1fr; }
          .sp-team-grid { grid-template-columns: 1fr; }
          .sp-stats-row { grid-template-columns: 1fr 1fr; }
          .sp-footer { flex-direction: column; text-align: center; gap: 8px; }
        }
      `}</style>

      <div className="sp-root">
        <Navbar dark />

        {/* HERO */}
        <section className="sp-hero">
          <h1 className="sp-h1">
            Surveys that
            <span className="sp-h1-accent">actually get answered.</span>
          </h1>
          <p className="sp-hero-sub">
            Build, distribute, and analyze surveys with confidence. Real-time dashboards,
            AI-powered insights, and enterprise-grade security — all in one platform.
          </p>
          <div className="sp-hero-btns">
            <Link to="/login" className="sp-btn-primary">Access Now →</Link>
            <Link to="/about" className="sp-btn-ghost">See how it works</Link>
          </div>
          <div className="sp-stats">
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="sp-stat-val">{s.value}</div>
                <div className="sp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="sp-section sp-section-tinted">
          <div style={{ textAlign: 'center' }}>
            <span className="sp-section-tag">The Platform</span>
            <h2 className="sp-h2">Everything you need to understand your audience</h2>
            <div className="sp-divider" />
            <p className="sp-section-desc">One platform to build surveys, collect responses, and turn raw data into decisions.</p>
          </div>
          <div className="sp-grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="sp-card">
                <div className="sp-card-icon">{f.icon}</div>
                <div className="sp-card-title">{f.title}</div>
                <p className="sp-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NUMBERS */}
        <section className="sp-section sp-section-dark" style={{ padding: '80px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="sp-section-tag">By the numbers</span>
            <h2 className="sp-h2 sp-h2-light" style={{ color: '#FAFAF8', maxWidth: 500 }}>Trusted at scale across the region</h2>
          </div>
          <div className="sp-stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="sp-stat-cell">
                <div className="sp-stat-cell-val">{s.value}</div>
                <div className="sp-stat-cell-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="sp-section sp-section-light">
          <div style={{ textAlign: 'center' }}>
            <span className="sp-section-tag">Our People</span>
            <h2 className="sp-h2">Loved by research teams across the region</h2>
            <div className="sp-divider" />
            <p className="sp-section-desc">Meet the people driving SurveyMatrix forward across the GCC.</p>
          </div>
          <div className="sp-team-grid">
            {TEAM.map((m) => (
              <div key={m.name} className="sp-team-card">
                <div className="sp-team-img-wrap">
                  <img src={m.image} alt={m.name} />
                  <div className="sp-team-img-overlay" />
                </div>
                <div className="sp-team-body">
                  <div className="sp-team-accent-bar" style={{ background: m.accent }} />
                  <div className="sp-team-name">{m.name}</div>
                  <div className="sp-team-role">{m.role}</div>
                  <span className="sp-team-company" style={{ background: m.accent + '18', color: m.accent }}>{m.company}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="sp-cta">
          <span className="sp-section-tag">Get started</span>
          <h2 className="sp-h2 sp-h2-light" style={{ color: '#FAFAF8' }}>Ready to start listening?</h2>
          <p className="sp-cta-sub">Join thousands of teams making better decisions with SurveyMatrix.</p>
          <Link to="/login" className="sp-btn-amber">Get started — Explore Now!</Link>
        </section>

        <Footer />
      </div>
    </>
  )
}
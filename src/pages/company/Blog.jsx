import { PageShell } from '../../components/PageShell'

const POSTS = [
  { eyebrow: 'Guide', title: 'Why Arabic-first survey design changes your completion rate', desc: 'What actually breaks when an English survey builder gets a translation layer bolted on, and what to check instead before you send your next batch of invites.', accent: '#0d9488' },
  { eyebrow: 'Guide', title: 'QR codes at the till vs. WhatsApp: picking the right channel', desc: 'A practical breakdown of response rates by channel across retail, F&B, and healthcare deployments — and when to use both at once.', accent: '#f59e0b' },
  { eyebrow: 'Product', title: 'What "hosted in the Kingdom" actually means for your PDPL review', desc: 'A plain explanation of the infrastructure and access-control questions compliance teams tend to ask, so your review doesn’t stall for weeks.', accent: '#f59e0b' },
  { eyebrow: 'Guide', title: 'Three questions beat twelve: keeping surveys short enough to finish', desc: 'How we think about survey length before a single question gets written, and what we cut when a draft runs long.', accent: '#0d9488' },
]

export default function Blog() {
  return (
    <PageShell
      title="Notes on running CX surveys in the Kingdom"
      subtitle="Short, practical posts — not a content-marketing firehose."
    >
      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          max-width: 1000px;
          margin: 56px auto 0;
          padding: 0 24px;
        }
        .blog-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 40px 36px;
          text-align: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
        }
        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 26px 56px rgba(13,148,136,0.14);
        }
        .blog-card:hover .blog-read-more { gap: 8px; }
        @media (max-width: 760px) {
          .blog-grid { grid-template-columns: 1fr; gap: 20px; padding: 0 20px; }
          .blog-card { padding: 30px 26px; }
        }
      `}</style>

      <div className="blog-grid">
        {POSTS.map((p) => (
          <div key={p.title} className="blog-card">
            <div style={{
              display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: p.accent, background: p.accent + '14',
              padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}>{p.eyebrow}</div>

            <h3 style={{
              fontFamily: "'Cairo', sans-serif", fontSize: 21, fontWeight: 800,
              color: 'var(--ink)', letterSpacing: '-0.4px', marginBottom: 12, lineHeight: 1.35,
            }}>{p.title}</h3>

            <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 22 }}>
              {p.desc}
            </p>

            <span className="blog-read-more" style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 13.5, fontWeight: 700, color: p.accent, transition: 'gap 0.2s',
            }}>Read article <span>→</span></span>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

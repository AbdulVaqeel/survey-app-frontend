import { PageShell, Section, Cards } from '../../components/PageShell'

const POSTS = [
  { eyebrow: 'Guide', title: 'Why Arabic-first survey design changes your completion rate', desc: 'What actually breaks when an English survey builder gets a translation layer bolted on, and what to check instead.' },
  { eyebrow: 'Guide', title: 'QR codes at the till vs. WhatsApp: picking the right channel', desc: 'A practical breakdown of response rates by channel across retail, F&B, and healthcare deployments.' },
  { eyebrow: 'Product', title: 'What "hosted in the Kingdom" actually means for your PDPL review', desc: 'A plain explanation of the infrastructure and access-control questions compliance teams tend to ask.' },
  { eyebrow: 'Guide', title: 'Three questions beat twelve: keeping surveys short enough to finish', desc: 'How we think about survey length before a single question gets written.' },
]

export default function Blog() {
  return (
    <PageShell
      title="Notes on running CX surveys in the Kingdom"
      subtitle="Short, practical posts — not a content-marketing firehose."
    >
      <Section>
        <Cards items={POSTS} />
      </Section>
    </PageShell>
  )
}

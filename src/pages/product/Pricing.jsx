import { PageShell, Section, PricingTiers } from '../../components/PageShell'

const TIERS = [
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
]

export default function Pricing() {
  return (
    <PageShell
      title="Simple pricing, no surprise invoices"
      subtitle="Every plan includes the Arabic-first builder, QR/WhatsApp distribution, and real-time analytics. Pick the plan that matches how many people you survey."
    >
      <Section>
        <PricingTiers tiers={TIERS} />
      </Section>
    </PageShell>
  )
}

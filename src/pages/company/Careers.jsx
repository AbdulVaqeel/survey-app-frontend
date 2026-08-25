import { PageShell, Section, Cards } from '../../components/PageShell'

const ROLES = [
  { eyebrow: 'Engineering', title: 'Backend Engineer', desc: 'FastAPI, PostgreSQL, and the migration discipline that comes with never breaking production login.', meta: 'Riyadh · Hybrid' },
  { eyebrow: 'Engineering', title: 'Frontend Engineer', desc: 'React, careful animation work, and an eye for interfaces that read naturally in Arabic and English.', meta: 'Riyadh · Hybrid' },
  { eyebrow: 'Research', title: 'Arabic NLP Researcher', desc: 'Dialect-aware sentiment and topic modeling on open-text survey responses.', meta: 'Remote · KSA' },
  { eyebrow: 'Customer Success', title: 'CX Success Manager', desc: 'Onboard new accounts and help operations teams get their first survey out the door in a week.', meta: 'Jeddah · On-site' },
]

export default function Careers() {
  return (
    <PageShell
      title="Help us build the survey tool the region actually needed"
      subtitle="We're a small team based in Riyadh, hiring for a few specific roles right now."
    >
      <Section>
        <Cards items={ROLES} />
      </Section>
    </PageShell>
  )
}

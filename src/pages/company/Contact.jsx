import { PageShell, Section, Bullets } from '../../components/PageShell'

export default function Contact() {
  return (
    <PageShell
      title="Let's talk about your survey program"
      subtitle="No generic contact form that vanishes into a queue — tell us what you're trying to measure and we'll set up time."
    >
      <Section heading="Reach us directly">
        <Bullets items={[
          'General & sales enquiries — hello@surveymatrix.tech',
          'Support for existing accounts — support@surveymatrix.tech',
          'Riyadh office — King Fahd Road, Al Olaya District',
        ]} />
      </Section>

      <Section heading="What to include">
        <Bullets items={[
          'Roughly how many respondents you expect per month.',
          'Which channels matter to you — WhatsApp, SMS, QR at a physical location, or a plain link.',
          'Whether you have a PDPL or compliance review that needs to happen before rollout.',
        ]} />
      </Section>
    </PageShell>
  )
}

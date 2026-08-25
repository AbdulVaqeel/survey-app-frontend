import { PageShell, Section, Paragraphs } from '../../components/PageShell'

export default function Terms() {
  return (
    <PageShell
      tag="Legal"
      title="Terms of Service"
      subtitle="The basics of using the SurveyMatrix platform as an account holder."
      cta={false}
    >
      <Section heading="Using the platform">
        <Paragraphs items={[
          "You're responsible for the content of the surveys you create and for having a lawful basis to contact the respondents you upload.",
          "Accounts are for a single organization's use; sharing login credentials across unrelated organizations isn't permitted.",
        ]} />
      </Section>

      <Section heading="Service availability">
        <Paragraphs items={[
          'We aim for the uptime figures shown on our homepage, but scheduled maintenance will occasionally be communicated in advance.',
        ]} />
      </Section>

      <Section heading="Changes to these terms">
        <Paragraphs items={[
          "We'll notify account holders by email before any material change takes effect.",
        ]} />
      </Section>
    </PageShell>
  )
}

import { PageShell, Section, Paragraphs } from '../../components/PageShell'

export default function Privacy() {
  return (
    <PageShell
      tag="Legal"
      title="Privacy Policy"
      subtitle="How SurveyMatrix collects, stores, and protects data for account holders and survey respondents."
      cta={false}
    >
      <Section heading="What we collect">
        <Paragraphs items={[
          'For account holders, we collect the information needed to run the account: username, email, and the surveys and responses you create.',
          'For survey respondents, we collect only what a given survey actually asks — plus, where an invite link is used, the name and email supplied at upload time so a response can be matched to the right person.',
        ]} />
      </Section>

      <Section heading="Where data lives">
        <Paragraphs items={[
          "Survey data is hosted on infrastructure located inside Saudi Arabia, in line with SDAIA's PDPL framework. We do not sell respondent data to third parties.",
        ]} />
      </Section>

      <Section heading="Your choices">
        <Paragraphs items={[
          'Account holders can export or delete their survey data at any time from the dashboard. Respondents can request removal of their individual response by contacting support@surveymatrix.tech.',
        ]} />
      </Section>
    </PageShell>
  )
}

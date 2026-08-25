import { PageShell, Section, Bullets } from '../../components/PageShell'

export default function Security() {
  return (
    <PageShell
      title="Your data doesn't leave the Kingdom"
      subtitle="Hosted on infrastructure inside Saudi Arabia and built around SDAIA's PDPL requirements — ask us where the servers sit, we'll actually tell you."
    >
      <Section heading="How we handle your data">
        <Bullets items={[
          'Survey responses and respondent data are stored on infrastructure located inside Saudi Arabia.',
          "Access controls are scoped per account — one organization can never see another's survey data.",
          'Passwords are hashed, never stored in plain text; every session is authenticated with a signed token.',
          'Invite links are single-use tokens, not guessable sequential IDs.',
        ]} />
      </Section>

      <Section heading="Compliance">
        <Bullets items={[
          "Built around the Kingdom's Personal Data Protection Law (PDPL) requirements from SDAIA.",
          'We can walk your IT or compliance team through the architecture before you sign anything.',
        ]} />
      </Section>
    </PageShell>
  )
}

import { PageShell, Section, Bullets } from '../../components/PageShell'

export default function Analytics() {
  return (
    <PageShell
      title="Analytics that update while the answers are still coming in"
      subtitle="Every response lands on the dashboard in real time — no nightly batch job, no waiting for a report someone builds on Monday."
    >
      <Section heading="What you get out of the box">
        <Bullets items={[
          'Live CSAT and NPS trends, broken down by branch, region, or survey.',
          'Automatic flagging of open-text responses that read like a real complaint.',
          'Invite-level tracking — sent, opened, completed — so you know exactly how a batch performed.',
          'One-click export to Excel, PowerPoint, or PDF for the board deck.',
        ]} />
      </Section>

      <Section heading="Built for people who read Arabic responses daily">
        <Bullets items={[
          'Text analysis handles Gulf and Levantine Arabic dialects, not just Modern Standard Arabic.',
          'Sentiment and topic summaries are generated per survey, not bolted on afterward.',
        ]} />
      </Section>
    </PageShell>
  )
}

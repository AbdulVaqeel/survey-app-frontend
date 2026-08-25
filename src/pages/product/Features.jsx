import { PageShell, Section, Bullets } from '../../components/PageShell'

export default function Features() {
  return (
    <PageShell
      title="Everything you need to run real customer surveys"
      subtitle="From a CSV of respondents to a finished analytics deck — built Arabic-first for teams operating in the Kingdom."
    >
      <Section heading="Build once, send anywhere">
        <Bullets items={[
          'A right-to-left survey builder from the first version — not an English template with the text flipped.',
          'Unique per-respondent links generated in bulk from a CSV upload, each one trackable end to end.',
          'A QR code for every link, ready to print at the till, on a receipt, or on a table tent.',
          'Send by WhatsApp, SMS, a plain link, or a QR code — whatever channel your customers actually use.',
        ]} />
      </Section>

      <Section heading="See it live, not next Monday">
        <Bullets items={[
          'Response dashboard updates as answers come in, with CSAT and NPS tracked automatically.',
          'Open-text answers in Arabic and English get summarized so nothing gets missed in a spreadsheet.',
          'Export to Excel, PDF, or PowerPoint whenever you need it in a deck.',
        ]} />
      </Section>
    </PageShell>
  )
}

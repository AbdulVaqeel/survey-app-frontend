import { PageShell, Section, Paragraphs } from '../../components/PageShell'

export default function Cookies() {
  return (
    <PageShell
      tag="Legal"
      title="Cookie Policy"
      subtitle="What we use cookies for, and what we deliberately don't use them for."
      cta={false}
    >
      <Section heading="Essential cookies">
        <Paragraphs items={[
          'We use a small number of cookies required to keep you logged in securely and to remember basic preferences like language.',
        ]} />
      </Section>

      <Section heading="What we don't do">
        <Paragraphs items={[
          "We don't run third-party advertising trackers on this site.",
        ]} />
      </Section>
    </PageShell>
  )
}

import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"

export const metadata = {
  title: "Terms of Service — Calendar Agent",
  description: "Terms governing your use of Calendar Agent.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 md:px-6 md:py-20">
        <header className="mb-10 border-b border-border/80 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
          <h1 className="mt-3 text-balance text-[2rem] leading-[1.1] tracking-tight md:text-[2.4rem]">
            Terms of <span className="font-serif italic font-normal">Service.</span>
          </h1>
          <p className="mt-3 text-sm tabular-nums text-muted-foreground">Last updated May 3, 2026</p>
        </header>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <p className="text-pretty">
              By accessing or using Calendar Agent (&quot;the Service&quot;), you agree to these Terms of Service. If you
              do not agree, do not use the Service.
            </p>
          </section>

          <Section title="Use of the Service">
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>You must have a valid Google account to use the Service.</li>
              <li>You agree to use the Service only for lawful purposes and in compliance with Google&apos;s terms.</li>
              <li>
                You are responsible for the actions taken on your calendar through the chat interface, including events
                created, modified, or deleted.
              </li>
            </ul>
          </Section>

          <Section title="AI-generated content">
            <p>
              The chat assistant is powered by an AI model and may occasionally produce inaccurate or unexpected
              results. Please verify important scheduling actions before relying on them.
            </p>
          </Section>

          <Section title="No warranty">
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do
              not guarantee that the Service will be uninterrupted, error-free, or that scheduling actions will always
              succeed.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, the Service and its operators shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the Service, including missed
              meetings or scheduling errors.
            </p>
          </Section>

          <Section title="Termination">
            <p>
              You can stop using the Service at any time by disconnecting your Google account in the app or revoking
              access at{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                myaccount.google.com/permissions
              </a>
              .
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms from time to time. The &quot;Last updated&quot; date above will reflect changes.
            </p>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-base font-medium tracking-tight">
        <span className="font-serif italic font-normal text-muted-foreground">§ </span>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}

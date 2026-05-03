import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"

export const metadata = {
  title: "Privacy Policy — Calendar Agent",
  description: "How Calendar Agent collects, uses, and shares your data.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 md:px-6 md:py-20">
        <header className="mb-10 border-b border-border/80 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
          <h1 className="mt-3 text-balance text-[2rem] leading-[1.1] tracking-tight md:text-[2.4rem]">
            Privacy <span className="font-serif italic font-normal">Policy.</span>
          </h1>
          <p className="mt-3 text-sm tabular-nums text-muted-foreground">Last updated May 3, 2026</p>
        </header>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <p className="text-pretty">
              Calendar Agent (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;) is a personal calendar assistant
              that connects to your Google Calendar to help you view and manage events through a chat interface. This
              policy explains what information we access, how we use it, and the choices you have.
            </p>
          </section>

          <Section title="Information we access">
            <p className="mb-3">When you connect your Google account, we request the following scopes:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>
                <span className="font-medium">Google Calendar (read &amp; write):</span> we read events from your primary
                calendar to display them, and we create, update, or delete events when you ask the assistant to do so.
              </li>
              <li>
                <span className="font-medium">Basic profile (name, email, picture):</span> shown in the app header so
                you can confirm which account is connected.
              </li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>To render your calendar in the app interface.</li>
              <li>To carry out scheduling actions you request through chat (create, edit, delete events).</li>
              <li>To send the minimum context required to the AI model so it can answer your prompts.</li>
            </ul>
            <p className="mt-3">
              We do not use your calendar data to train AI models, and we do not sell or share it with advertisers.
            </p>
          </Section>

          <Section title="How we store your data">
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>
                Google OAuth tokens are stored only as encrypted, HTTP-only cookies in your browser. They are never
                persisted in a database.
              </li>
              <li>
                Calendar events are fetched on demand from the Google Calendar API and held in memory only for the
                duration of a single request — they are not cached or written to disk on our servers.
              </li>
              <li>
                Chat conversations live only in your browser session and are cleared when you reset the chat or close
                the tab.
              </li>
            </ul>
          </Section>

          <Section title="Third-party services">
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>
                <span className="font-medium">Google:</span> we use Google&apos;s OAuth and Calendar APIs. Use of
                information received from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </li>
              <li>
                <span className="font-medium">Google Generative AI (Gemini):</span> chat messages and the calendar
                context required to fulfill your request are sent to Google&apos;s Generative Language API to produce
                responses.
              </li>
              <li>
                <span className="font-medium">Vercel:</span> the Service is hosted on Vercel, which processes standard
                request metadata.
              </li>
            </ul>
          </Section>

          <Section title="Your choices">
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>You can disconnect at any time by clicking &quot;Disconnect&quot; in the app header.</li>
              <li>
                You can fully revoke the Service&apos;s access from your Google account at{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  myaccount.google.com/permissions
                </a>
                .
              </li>
            </ul>
          </Section>

          <Section title="Data retention">
            <p>
              Because we do not store your calendar data on our servers, there is nothing to delete on our side beyond
              invalidating your session cookie, which happens automatically when you disconnect.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be reflected by updating the &quot;Last
              updated&quot; date above.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For questions about this policy or to request that any associated session data be invalidated, please open
              an issue on the project repository.
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

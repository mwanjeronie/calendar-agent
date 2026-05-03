import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service — Calendar Agent",
  description: "Terms governing your use of Calendar Agent.",
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 md:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back
      </Link>

      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 3, 2026</p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <p className="text-pretty">
            By accessing or using Calendar Agent (&quot;the Service&quot;), you agree to these Terms of Service. If you
            do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Use of the Service</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>You must have a valid Google account to use the Service.</li>
            <li>You agree to use the Service only for lawful purposes and in compliance with Google&apos;s terms.</li>
            <li>
              You are responsible for the actions taken on your calendar through the chat interface, including events
              created, modified, or deleted.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">AI-generated content</h2>
          <p>
            The chat assistant is powered by an AI model and may occasionally produce inaccurate or unexpected results.
            Please verify important scheduling actions before relying on them.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">No warranty</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do
            not guarantee that the Service will be uninterrupted, error-free, or that scheduling actions will always
            succeed.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, the Service and its operators shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of the Service, including missed meetings or
            scheduling errors.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Termination</h2>
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
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Changes</h2>
          <p>We may update these terms from time to time. The &quot;Last updated&quot; date above will reflect changes.</p>
        </section>
      </div>

      <footer className="mt-12 flex items-center gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
      </footer>
    </main>
  )
}

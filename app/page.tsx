import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { AppPreview } from "@/components/marketing/app-preview"

export const metadata: Metadata = {
  title: "Calendar Agent — Manage your calendar by having a conversation",
  description:
    "Calendar Agent connects to your Google Calendar and lets you view your week, schedule events, and reschedule meetings through natural language.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Calendar Agent — Manage your calendar by having a conversation",
    description:
      "Calendar Agent connects to your Google Calendar and lets you view your week, schedule events, and reschedule meetings through natural language.",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <DataAccessSection />
        <FAQSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="border-b border-border/80">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              An AI assistant for Google Calendar
            </p>

            <h1 className="mt-6 text-balance text-[2.6rem] leading-[1.05] tracking-tight md:text-[3.75rem] md:leading-[1.02]">
              Manage your calendar by{" "}
              <span className="font-serif italic font-normal text-foreground">having a conversation.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-[17px]">
              Connect Google Calendar and ask in plain English. The agent reads your week, books new events, moves
              meetings, and answers questions about what&apos;s next — without ever leaving the chat.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-11 rounded-md px-5">
                <Link href="/app">
                  Open the app
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-[6px] decoration-border hover:decoration-foreground"
              >
                See how it works
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/80 pt-6 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Free</dt>
                <dd className="mt-1 font-medium text-foreground">No card required</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Setup</dt>
                <dd className="mt-1 font-medium text-foreground">Under a minute</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Privacy</dt>
                <dd className="mt-1 font-medium text-foreground">Limited Use</dd>
              </div>
            </dl>
          </div>

          <div className="lg:pl-4">
            <AppPreview />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

const STEPS: { user: string; agent: string }[] = [
  {
    user: "What's on my calendar this Thursday?",
    agent:
      "You have three events on Thursday: Design review with Maya at 10:00, lunch with Tomás at 12:30, and a 1:1 with Priya at 4:00.",
  },
  {
    user: "Schedule a 30-min coffee with Sam tomorrow at 9am.",
    agent: "Booked. Coffee with Sam, tomorrow 9:00–9:30 AM. Added to your primary calendar.",
  },
  {
    user: "Move my 4pm 1:1 with Priya to Friday at the same time.",
    agent:
      "Done. Your 1:1 with Priya is now on Friday at 4:00 PM. The original Thursday slot is free.",
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/80 bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">How it works</p>
            <h2 className="mt-4 text-balance text-3xl leading-[1.1] tracking-tight md:text-[2.4rem]">
              Three things you&apos;ll do <span className="font-serif italic font-normal">every day.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-muted-foreground leading-relaxed">
              Calendar Agent is a single chat field over your real Google Calendar. Ask, schedule, reschedule. That&apos;s
              it.
            </p>
          </div>

          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={i} className="rounded-lg border border-border/80 bg-card p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")} —{" "}
                    {i === 0 ? "Ask" : i === 1 ? "Schedule" : "Reschedule"}
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  <ChatBubble role="user">{step.user}</ChatBubble>
                  <ChatBubble role="agent">{step.agent}</ChatBubble>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function ChatBubble({ role, children }: { role: "user" | "agent"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-br-sm bg-foreground px-3.5 py-2 text-sm leading-relaxed text-background">
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-lg rounded-bl-sm border border-border/80 bg-background px-3.5 py-2 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Data & privacy                                                             */
/* -------------------------------------------------------------------------- */

function DataAccessSection() {
  const principles: { title: string; body: string }[] = [
    {
      title: "Calendar only",
      body: "We request scoped access to read and write events on your Google Calendar. Nothing else — no Gmail, no Drive, no contacts.",
    },
    {
      title: "Fetched on demand",
      body: "Your calendar contents are fetched at the moment you ask a question and used to fulfill that single request. We do not persist them in our database.",
    },
    {
      title: "Never sold or shared",
      body: "We do not sell your data, share it with third parties for advertising, or use your calendar contents to train AI models.",
    },
    {
      title: "Yours to revoke",
      body: "Sign out from inside the app, or revoke access from your Google Account permissions page. Once disconnected, our access tokens are gone.",
    },
  ]

  return (
    <section id="privacy" className="border-b border-border/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Data &amp; privacy</p>
            <h2 className="mt-4 text-balance text-3xl leading-[1.1] tracking-tight md:text-[2.4rem]">
              Built on Google&apos;s{" "}
              <span className="font-serif italic font-normal">Limited Use</span> policy.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-muted-foreground leading-relaxed">
              Our use of information from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="rounded-md">
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-md">
                <Link href="/terms">Terms of Service</Link>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            {principles.map((p, i) => (
              <div key={p.title} className="border-t border-border/80 pt-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <dt className="mt-2 font-medium tracking-tight">{p.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

function FAQSection() {
  const faqs: { q: string; a: string }[] = [
    {
      q: "Is Calendar Agent free?",
      a: "Yes. You only need a Google account and a connection to your Google Calendar.",
    },
    {
      q: "Which calendar does it use?",
      a: "It connects to your primary Google Calendar. Events are read from and written to that calendar based on your requests.",
    },
    {
      q: "Where is my data stored?",
      a: "Calendar contents are not persisted on our servers. The only thing stored is a secure, HTTP-only cookie containing the OAuth tokens used to make calendar requests on your behalf, which is removed when you sign out.",
    },
    {
      q: "How do I revoke access?",
      a: "Click your profile in the app and choose Sign out, or visit myaccount.google.com/permissions and remove Calendar Agent.",
    },
  ]

  return (
    <section className="border-b border-border/80 bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Questions</p>
            <h2 className="mt-4 text-balance text-3xl leading-[1.1] tracking-tight md:text-[2.4rem]">
              Frequently <span className="font-serif italic font-normal">asked.</span>
            </h2>
          </div>

          <dl className="divide-y divide-border/80 border-y border-border/80">
            {faqs.map((f) => (
              <div key={f.q} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[1fr_2fr] sm:gap-8">
                <dt className="font-medium tracking-tight">{f.q}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* CTA                                                                        */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="text-balance text-3xl leading-[1.1] tracking-tight md:text-[2.4rem]">
          Ready to{" "}
          <span className="font-serif italic font-normal">talk to your calendar?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground leading-relaxed">
          Connect your Google account and start managing your week through chat. No subscription, no card on file.
        </p>
        <div className="mt-9">
          <Button asChild size="lg" className="h-11 rounded-md px-5">
            <Link href="/app">
              Open the app
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

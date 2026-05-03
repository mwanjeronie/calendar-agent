import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  CalendarCheck,
  Eye,
  Lock,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { AppPreview } from "@/components/marketing/app-preview"

export const metadata: Metadata = {
  title: "Calendar Agent — AI assistant for Google Calendar",
  description:
    "Calendar Agent is an AI-powered assistant that lets you view, create, and reschedule Google Calendar events through natural conversation. Privacy-first and free to use.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Calendar Agent — AI assistant for Google Calendar",
    description:
      "View, create, and reschedule Google Calendar events through natural conversation. Privacy-first and free to use.",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <PreviewSection />
        <FeaturesSection />
        <DataAccessSection />
        <FAQSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            <span>AI assistant for Google Calendar</span>
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Manage your calendar by{" "}
            <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              having a conversation
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Calendar Agent connects to your Google Calendar and lets you view your week, schedule events, and
            reschedule meetings through natural language &mdash; without ever leaving the chat.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/app">
                Open the app
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free to use. Connect with your Google account &mdash; disconnect anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

function PreviewSection() {
  return (
    <section id="how-it-works" className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <AppPreview />
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: MessageSquareText,
      title: "Chat to schedule",
      body: "Say things like \u201Cbook lunch with Alex Friday at 1pm\u201D and the agent creates the event with the right time, attendees, and location.",
    },
    {
      icon: CalendarCheck,
      title: "View your week at a glance",
      body: "A clean week view with overlap-aware columns, all-day events, and a live indicator for the current time so you always know what\u2019s next.",
    },
    {
      icon: RefreshCw,
      title: "Reschedule in one sentence",
      body: "Move, shorten, or extend events without opening Google Calendar \u2014 the agent confirms changes back to you in plain English.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy-first by design",
      body: "Calendar data is fetched on demand to answer your request and is never sold, shared, or used to train AI models.",
    },
  ]

  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A focused, calm interface that does exactly two things well: shows you your schedule and helps you change
            it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 font-medium leading-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DataAccessSection() {
  const items = [
    {
      icon: Eye,
      title: "What we access",
      body: "When you connect your Google account, we request scoped access to read and write events on your Google Calendar. We do not access Gmail, Drive, contacts, or any other Google service.",
    },
    {
      icon: Sparkles,
      title: "How we use it",
      body: "Your calendar data is sent to the AI model only when needed to answer your question or fulfill a scheduling action you requested. Data is processed in memory and not stored on our servers.",
    },
    {
      icon: Lock,
      title: "What we never do",
      body: "We never sell your data, share it with third parties for advertising, or use your calendar contents to train AI models. Your information is yours.",
    },
    {
      icon: Trash2,
      title: "Disconnect anytime",
      body: "Sign out from inside the app or revoke access from your Google Account settings at any time. Once disconnected, we hold no further access tokens for your account.",
    },
  ]

  return (
    <section id="privacy" className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Data &amp; privacy</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Built on Google&apos;s Limited Use policy
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Calendar Agent&apos;s use of information from Google APIs adheres to the{" "}
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
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="font-medium leading-tight">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/privacy">Read the Privacy Policy</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/terms">Read the Terms of Service</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: "Is Calendar Agent free?",
      a: "Yes. Calendar Agent is free to use. You only need a Google account and a connection to your Google Calendar.",
    },
    {
      q: "Which Google Calendar does it use?",
      a: "It connects to your primary Google Calendar. Events are read from and written to that calendar based on your requests.",
    },
    {
      q: "Where is my data stored?",
      a: "Calendar contents are not persisted on our servers. The only thing stored is a secure, HTTP-only cookie containing the OAuth tokens needed to make calendar API calls on your behalf, which is removed when you sign out.",
    },
    {
      q: "How do I revoke access?",
      a: "Click your profile in the app and choose Sign out, or visit your Google Account permissions page at myaccount.google.com/permissions and remove Calendar Agent.",
    },
  ]

  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <dl className="mt-10 divide-y divide-border rounded-xl border border-border bg-card">
          {faqs.map((f) => (
            <div key={f.q} className="px-5 py-5 md:px-6">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center md:px-6 md:py-24">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to talk to your calendar?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Connect your Google account and start managing your week through chat. It only takes a minute.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
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

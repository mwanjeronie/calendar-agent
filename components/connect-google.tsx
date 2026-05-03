"use client"

import { Button } from "@/components/ui/button"
import { CalendarDays, ShieldAlert } from "lucide-react"

export function ConnectGoogle({ configured }: { configured: boolean }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-balance">Calendar Agent</h1>
            <p className="text-sm text-muted-foreground">Your AI-powered Google Calendar assistant</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Connect your Google Calendar to chat with an AI that can view your schedule, create events, reschedule,
            and answer questions about your week.
          </p>
        </div>

        {!configured ? (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
            <div className="space-y-2 text-foreground">
              <p className="font-medium">Google OAuth is not configured.</p>
              <p className="text-muted-foreground">
                Set the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GOOGLE_CLIENT_ID</code> and{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GOOGLE_CLIENT_SECRET</code>{" "}
                environment variables in your project settings, then add{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/api/auth/google/callback</code> as
                an authorized redirect URI in the Google Cloud console.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <Button asChild size="lg" className="w-full" disabled={!configured}>
            <a href="/api/auth/google" aria-disabled={!configured}>
              <GoogleIcon className="h-4 w-4" />
              Connect Google Calendar
            </a>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          We request read & write access to your primary calendar. You can disconnect at any time.
        </p>

        <div className="mt-6 flex items-center justify-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </a>
          <span aria-hidden>·</span>
          <a href="/terms" className="hover:text-foreground">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.96h5.36a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.31 2.98-7.32 0-.7-.06-1.37-.18-2.16Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.6-2.42l-3.23-2.5c-.9.6-2.05.96-3.37.96-2.6 0-4.8-1.75-5.58-4.1H3.07v2.58A9.99 9.99 0 0 0 12 22Z"
        opacity=".75"
      />
      <path
        fill="currentColor"
        d="M6.42 13.94a6 6 0 0 1 0-3.88V7.48H3.07a10 10 0 0 0 0 9.04l3.35-2.58Z"
        opacity=".5"
      />
      <path
        fill="currentColor"
        d="M12 5.96c1.47 0 2.78.5 3.82 1.5l2.86-2.86A9.94 9.94 0 0 0 12 2 9.99 9.99 0 0 0 3.07 7.48l3.35 2.58C7.2 7.7 9.4 5.96 12 5.96Z"
        opacity=".25"
      />
    </svg>
  )
}

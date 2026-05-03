"use client"

import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export function ConnectGoogle({ configured }: { configured: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground font-serif text-[15px] leading-none text-background"
            >
              <span className="-mt-px italic">C</span>
            </span>
            <span className="font-medium tracking-tight">Calendar Agent</span>
          </a>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16 md:px-6">
        <div className="w-full max-w-md">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            Connect your account
          </p>

          <h1 className="mt-5 text-balance text-[2rem] leading-[1.1] tracking-tight md:text-[2.4rem]">
            Sign in to start{" "}
            <span className="font-serif italic font-normal">talking to your calendar.</span>
          </h1>

          <p className="mt-5 text-pretty text-muted-foreground leading-relaxed">
            Calendar Agent connects to your primary Google Calendar so the AI can answer questions about your week, create
            events, and reschedule on your behalf.
          </p>

          {!configured ? (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm"
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
              <div className="space-y-2">
                <p className="font-medium">Google OAuth is not configured.</p>
                <p className="text-muted-foreground">
                  Set the{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[12px]">GOOGLE_CLIENT_ID</code> and{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[12px]">GOOGLE_CLIENT_SECRET</code> environment
                  variables, then add{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[12px]">/api/auth/google/callback</code> as an
                  authorized redirect URI in Google Cloud Console.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <Button asChild size="lg" className="h-11 w-full rounded-md" disabled={!configured}>
              <a href="/api/auth/google" aria-disabled={!configured}>
                <GoogleIcon className="h-4 w-4" />
                Continue with Google
              </a>
            </Button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
            <Bullet>Read &amp; write access to your primary calendar only.</Bullet>
            <Bullet>Calendar contents are fetched on demand, not stored.</Bullet>
            <Bullet>Disconnect any time from inside the app.</Bullet>
          </ul>
        </div>
      </main>

      <footer className="border-t border-border/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground md:px-6">
          <p>&copy; {new Date().getFullYear()} Calendar Agent</p>
          <nav className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
      <span className="leading-relaxed">{children}</span>
    </li>
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

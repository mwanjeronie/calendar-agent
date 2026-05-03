import Link from "next/link"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border/80 bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground font-serif text-[15px] leading-none text-background"
              >
                <span className="-mt-px italic">C</span>
              </span>
              <span className="font-medium tracking-tight">Calendar Agent</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              An AI assistant that manages your Google Calendar through natural conversation. Built for people who would
              rather talk than click.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/app" className="text-foreground hover:underline underline-offset-4">
                  Open app
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="text-muted-foreground hover:text-foreground">
                  Data &amp; privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/80 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>&copy; {year} Calendar Agent. All rights reserved.</p>
          <p className="tabular-nums">
            Calendar Agent&apos;s use of information from Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Google API Services User Data Policy
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}

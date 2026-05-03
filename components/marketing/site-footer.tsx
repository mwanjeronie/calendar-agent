import Link from "next/link"
import { CalendarDays } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden />
          </span>
          <span>Calendar Agent</span>
          <span aria-hidden className="text-border">
            ·
          </span>
          <span className="text-xs">© {new Date().getFullYear()}</span>
        </div>

        <nav className="flex items-center gap-5 text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/app" className="hover:text-foreground">
            Open app
          </Link>
        </nav>
      </div>
    </footer>
  )
}

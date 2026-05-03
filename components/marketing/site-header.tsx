import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <span>Calendar Agent</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/privacy"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Terms
          </Link>
          <Button asChild size="sm" className="ml-2">
            <Link href="/app">Open app</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

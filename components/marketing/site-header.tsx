import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground font-serif text-[15px] leading-none text-background"
          >
            <span className="-mt-px italic">C</span>
          </span>
          <span className="font-medium tracking-tight">
            Calendar Agent
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="#how-it-works"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground md:inline-block"
          >
            How it works
          </Link>
          <Link
            href="#privacy"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground md:inline-block"
          >
            Privacy
          </Link>
          <Link
            href="/privacy"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block md:hidden"
          >
            Privacy
          </Link>
          <Button asChild size="sm" className="ml-2 rounded-md">
            <Link href="/app">Open app</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

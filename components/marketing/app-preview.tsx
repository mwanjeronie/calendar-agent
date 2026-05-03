import { ArrowUp } from "lucide-react"

/**
 * AppPreview renders a faithful, lightweight visual approximation of the
 * Calendar Agent app — a calendar grid on top with a chat exchange below.
 * Uses real-feeling event names and times so the screenshot reads as a
 * real product, not a generic placeholder.
 */
export function AppPreview() {
  return (
    <div className="relative w-full">
      {/* Subtle warm glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -bottom-6 -top-2 rounded-[28px] bg-accent/[0.06] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_24px_60px_-24px_rgba(20,16,8,0.18)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border/80 bg-muted/50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="ml-3 flex-1 truncate rounded-md border border-border/60 bg-background/80 px-3 py-1 text-center text-[11px] tabular-nums text-muted-foreground">
            calendar-agent.app/app
          </div>
          <div className="hidden items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground sm:flex">
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            Live
          </div>
        </div>

        {/* Calendar header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              This week
            </p>
            <p className="mt-0.5 text-[15px] font-medium tracking-tight tabular-nums">
              May 4 <span className="text-muted-foreground">—</span> May 10
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] tabular-nums">
            <span className="rounded-md border border-border bg-background px-2 py-1 text-muted-foreground">
              Today
            </span>
            <span className="text-muted-foreground">May 2026</span>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-border/80 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {[
            { d: "Mon", n: 4 },
            { d: "Tue", n: 5 },
            { d: "Wed", n: 6, today: true },
            { d: "Thu", n: 7 },
            { d: "Fri", n: 8 },
            { d: "Sat", n: 9 },
            { d: "Sun", n: 10 },
          ].map((d, i) => (
            <div
              key={d.d}
              className={`flex flex-col items-center gap-1 border-r border-border/80 py-2.5 last:border-r-0 ${
                d.today ? "bg-accent/15" : ""
              }`}
            >
              <span>{d.d}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] tabular-nums ${
                  d.today ? "bg-foreground text-background font-semibold" : "text-foreground"
                }`}
              >
                {d.n}
              </span>
              {i < 6 ? null : null}
            </div>
          ))}
        </div>

        {/* Calendar grid (mock) */}
        <div className="relative grid grid-cols-7 gap-px bg-border/80">
          {Array.from({ length: 7 }).map((_, day) => (
            <div key={day} className="relative h-44 bg-card md:h-52">
              {day === 0 ? <MockEvent top={8} height={14} variant="ink" label="Standup" sub="9:00 AM" /> : null}
              {day === 1 ? (
                <MockEvent top={20} height={22} variant="ochre" label="Design review" sub="10:00 — 11:00" />
              ) : null}
              {day === 2 ? (
                <MockEvent top={14} height={26} variant="ink" label="Customer call" sub="9:30 — 11:00" />
              ) : null}
              {day === 2 ? <MockEvent top={62} height={14} variant="ink" label="Coffee w/ Sam" /> : null}
              {day === 3 ? <MockEvent top={26} height={16} variant="ochre" label="Lunch w/ Tomás" /> : null}
              {day === 3 ? (
                <MockEvent top={68} height={18} variant="ink" label="1:1 Priya" sub="4:00 PM" />
              ) : null}
              {day === 4 ? (
                <MockEvent top={36} height={28} variant="ink" label="Q2 roadmap" sub="2:00 — 4:00" />
              ) : null}
            </div>
          ))}
          {/* Subtle now-line on the highlighted day */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[28.57%] right-[57.14%]"
            style={{ top: "44%" }}
          >
            <div className="relative">
              <span className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-accent" />
              <div className="h-[1.5px] bg-accent" />
            </div>
          </div>
        </div>

        {/* Chat exchange */}
        <div className="border-t border-border/80 px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Calendar Assistant
            </p>
            <p className="text-[10px] text-muted-foreground">Gemini 2.5 Flash</p>
          </div>

          <div className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-lg rounded-br-sm bg-foreground px-3 py-2 text-background">
                Book lunch with Sarah Friday at 1pm.
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Checking calendar
            </div>

            <div className="flex justify-start">
              <div className="max-w-[92%] rounded-lg rounded-bl-sm border border-border bg-background px-3 py-2 text-foreground">
                Friday at 1:00 PM is open. I&apos;ll create a 60-minute event titled &ldquo;Lunch with Sarah.&rdquo;
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              Created &ldquo;Lunch with Sarah&rdquo;
            </div>
          </div>

          {/* Composer */}
          <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground">
            <span className="flex-1 truncate">Move my 3pm to tomorrow…</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
              <ArrowUp className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockEvent({
  top,
  height,
  variant,
  label,
  sub,
}: {
  top: number
  height: number
  variant: "ink" | "ochre"
  label: string
  sub?: string
}) {
  const styles =
    variant === "ink"
      ? "bg-foreground/[0.06] border-l-foreground/70 text-foreground"
      : "bg-accent/15 border-l-accent text-foreground"
  return (
    <div
      className={`absolute inset-x-1 overflow-hidden rounded-sm border-l-2 px-1.5 py-0.5 text-[9px] leading-tight ${styles}`}
      style={{ top: `${top}%`, height: `${height}%` }}
    >
      <div className="truncate font-medium">{label}</div>
      {sub && height > 16 ? <div className="truncate tabular-nums text-muted-foreground">{sub}</div> : null}
    </div>
  )
}

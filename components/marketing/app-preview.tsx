import { ArrowUp, CalendarPlus, Sparkles } from "lucide-react"

export function AppPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute inset-x-8 -bottom-6 h-12 rounded-[40%] bg-primary/10 blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-border/40">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="ml-3 flex-1 truncate rounded-md bg-background/80 px-3 py-1 text-center text-[11px] text-muted-foreground">
            calendar-agent.app/app
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          {/* Calendar grid mock */}
          <div className="border-b border-border lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">This week</p>
                <p className="text-sm font-semibold">May 4 – May 10</p>
              </div>
              <div className="flex h-7 items-center gap-1 rounded-md border border-border bg-muted/40 px-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Today
              </div>
            </div>

            <div className="grid grid-cols-7 border-t border-border text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div
                  key={d}
                  className={`flex items-center justify-center border-r border-border py-2 last:border-r-0 ${i === 1 ? "bg-primary/5 text-primary" : ""}`}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="relative grid grid-cols-7 gap-px bg-border" aria-hidden>
              {Array.from({ length: 7 }).map((_, day) => (
                <div key={day} className="relative h-56 bg-card">
                  {day === 0 ? <MockEvent top={6} height={20} color="primary" label="Standup" /> : null}
                  {day === 1 ? <MockEvent top={14} height={32} color="accent" label="Design review" /> : null}
                  {day === 1 ? <MockEvent top={56} height={28} color="primary" label="1:1 Alex" /> : null}
                  {day === 2 ? <MockEvent top={24} height={48} color="primary" label="Customer call" /> : null}
                  {day === 3 ? <MockEvent top={10} height={24} color="accent" label="Lunch" /> : null}
                  {day === 4 ? <MockEvent top={40} height={36} color="primary" label="Roadmap planning" /> : null}
                </div>
              ))}
            </div>
          </div>

          {/* Chat mock */}
          <div className="flex h-full flex-col bg-card/60">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Calendar Assistant</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Powered by Gemini</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 p-4 text-xs">
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/10 px-3 py-2 text-primary-foreground/90">
                <p className="text-foreground">Book lunch with Sarah Friday at 1pm</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Checking your calendar
              </div>
              <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2">
                <p className="leading-relaxed text-foreground">
                  Friday at 1pm is open. I&apos;ll create a 1-hour event titled &ldquo;Lunch with Sarah&rdquo;.
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] text-primary">
                <CalendarPlus className="h-3 w-3" aria-hidden />
                Created &ldquo;Lunch with Sarah&rdquo;
              </div>
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                <span className="flex-1 truncate">Move my 3pm to tomorrow…</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowUp className="h-3 w-3" aria-hidden />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockEvent({
  top,
  height,
  color,
  label,
}: {
  top: number
  height: number
  color: "primary" | "accent"
  label: string
}) {
  const styles =
    color === "primary"
      ? "bg-primary/15 border-l-primary text-primary"
      : "bg-accent/20 border-l-accent text-accent-foreground"
  return (
    <div
      className={`absolute inset-x-1 truncate rounded border-l-2 px-1.5 text-[9px] font-medium leading-tight ${styles}`}
      style={{ top: `${top}%`, height: `${height}%` }}
    >
      {label}
    </div>
  )
}

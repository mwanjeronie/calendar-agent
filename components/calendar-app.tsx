"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { addDays, format, startOfWeek } from "date-fns"
import { CalendarDays, ChevronLeft, ChevronRight, LogOut, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WeekView } from "@/components/week-view"
import { ChatPanel } from "@/components/chat-panel"
import { EventDetail } from "@/components/event-detail"
import { type CalendarEvent, formatRangeLabel } from "@/lib/date-utils"

type Profile = { email?: string; name?: string; picture?: string }
type StatusResponse = { authenticated: boolean; configured: boolean; profile?: Profile }
type EventsResponse = { events: CalendarEvent[]; error?: string }

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.error || `Request failed: ${res.status}`)
    throw err
  }
  return res.json()
}

export function CalendarApp() {
  const [anchor, setAnchor] = useState<Date>(() => new Date())
  const [selected, setSelected] = useState<CalendarEvent | null>(null)

  const weekStart = useMemo(() => startOfWeek(anchor, { weekStartsOn: 1 }), [anchor])
  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart])

  const { data: status } = useSWR<StatusResponse>("/api/auth/status", fetcher, {
    revalidateOnFocus: false,
  })

  const eventsKey = useMemo(() => {
    const params = new URLSearchParams({
      timeMin: weekStart.toISOString(),
      timeMax: weekEnd.toISOString(),
    })
    return `/api/calendar/events?${params.toString()}`
  }, [weekStart, weekEnd])

  const {
    data: eventsData,
    isLoading,
    isValidating,
    mutate: refetchEvents,
  } = useSWR<EventsResponse>(eventsKey, fetcher, {
    revalidateOnFocus: false,
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Failed to load events")
    },
  })

  const events = eventsData?.events ?? []
  const profile = status?.profile ?? null

  // If status check confirms not authenticated, reload to show connect screen
  useEffect(() => {
    if (status && !status.authenticated) {
      window.location.reload()
    }
  }, [status])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.reload()
  }

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    profile?.email?.slice(0, 2).toUpperCase() ||
    "?"

  const loading = isLoading || isValidating

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/50 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-tight tracking-tight">Calendar Agent</h1>
            <p className="text-xs text-muted-foreground">{formatRangeLabel(weekStart, addDays(weekEnd, -1))}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAnchor(new Date())} aria-label="Jump to today">
            Today
          </Button>
          <div className="flex overflow-hidden rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setAnchor((d) => addDays(d, -7))}
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center px-3 text-xs font-medium tabular-nums text-muted-foreground">
              {format(weekStart, "MMM yyyy")}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setAnchor((d) => addDays(d, 7))}
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => refetchEvents()}
            aria-label="Refresh"
            disabled={loading}
          >
            <RefreshCcw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          </Button>

          <div className="ml-2 flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3">
            <Avatar className="h-7 w-7">
              {profile?.picture ? <AvatarImage src={profile.picture} alt="" /> : null}
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[180px] truncate text-xs font-medium md:block">
              {profile?.email || "Connected"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleLogout}
              aria-label="Disconnect Google"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[1fr_380px] lg:p-4">
        <section className="min-h-0">
          <WeekView anchorDate={anchor} events={events} onSelectEvent={(e) => setSelected(e)} loading={loading} />
        </section>
        <aside className="min-h-0">
          <ChatPanel onCalendarChange={() => refetchEvents()} />
        </aside>
      </main>

      <EventDetail event={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  )
}

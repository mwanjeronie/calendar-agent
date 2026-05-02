"use client"

import { useMemo } from "react"
import { format, isSameDay, isToday } from "date-fns"
import {
  type CalendarEvent,
  eventColorClasses,
  getEventEnd,
  getEventStart,
  getWeekDays,
  isAllDay,
} from "@/lib/date-utils"
import { cn } from "@/lib/utils"

const HOUR_HEIGHT = 56 // px per hour
const START_HOUR = 0
const END_HOUR = 24

type Props = {
  anchorDate: Date
  events: CalendarEvent[]
  onSelectEvent?: (e: CalendarEvent) => void
  loading?: boolean
}

export function WeekView({ anchorDate, events, onSelectEvent, loading }: Props) {
  const days = useMemo(() => getWeekDays(anchorDate), [anchorDate])
  const hours = useMemo(() => {
    const list: number[] = []
    for (let h = START_HOUR; h < END_HOUR; h++) list.push(h)
    return list
  }, [])

  const allDayByDay = useMemo(() => {
    return days.map((d) => events.filter((e) => isAllDay(e) && isSameDay(getEventStart(e), d)))
  }, [days, events])

  const timedByDay = useMemo(() => {
    return days.map((d) => events.filter((e) => !isAllDay(e) && isSameDay(getEventStart(e), d)))
  }, [days, events])

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card">
      {/* Header row with day labels */}
      <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border">
        <div className="border-r border-border" aria-hidden />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className={cn(
              "flex flex-col items-center gap-1 border-r border-border px-2 py-3 last:border-r-0",
              isToday(d) && "bg-primary/5",
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {format(d, "EEE")}
            </span>
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                isToday(d) ? "bg-primary text-primary-foreground" : "text-foreground",
              )}
            >
              {format(d, "d")}
            </span>
          </div>
        ))}
      </div>

      {/* All-day strip */}
      {allDayByDay.some((arr) => arr.length > 0) && (
        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border bg-muted/30">
          <div className="flex items-center justify-end border-r border-border px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            All day
          </div>
          {allDayByDay.map((dayEvents, idx) => (
            <div key={idx} className="flex flex-col gap-1 border-r border-border p-1.5 last:border-r-0">
              {dayEvents.map((e) => {
                const colors = eventColorClasses(e.id)
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onSelectEvent?.(e)}
                    className={cn(
                      "truncate rounded-md px-2 py-1 text-left text-xs font-medium transition-colors",
                      colors.bg,
                      colors.text,
                    )}
                  >
                    {e.summary || "(No title)"}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="relative flex-1 overflow-auto">
        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
          {/* Hour gutter */}
          <div className="border-r border-border">
            {hours.map((h) => (
              <div
                key={h}
                className="relative border-b border-border/60 pr-2 text-right text-[10px] font-medium text-muted-foreground"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute -top-2 right-2">
                  {h === 0 ? "" : format(new Date(2024, 0, 1, h), "h a")}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIdx) => (
            <DayColumn
              key={day.toISOString()}
              day={day}
              events={timedByDay[dayIdx]}
              hours={hours}
              onSelectEvent={onSelectEvent}
            />
          ))}
        </div>

        {loading && (
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center bg-background/40 pt-10">
            <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
              Loading events…
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DayColumn({
  day,
  events,
  hours,
  onSelectEvent,
}: {
  day: Date
  events: CalendarEvent[]
  hours: number[]
  onSelectEvent?: (e: CalendarEvent) => void
}) {
  const now = new Date()
  const showNowLine = isSameDay(now, day)
  const minutesIntoDay = now.getHours() * 60 + now.getMinutes()
  const nowTop = (minutesIntoDay / 60) * HOUR_HEIGHT

  const placedEvents = useMemo(() => layoutEvents(events, day), [events, day])

  return (
    <div className="relative border-r border-border last:border-r-0" style={{ height: hours.length * HOUR_HEIGHT }}>
      {hours.map((h) => (
        <div key={h} className="border-b border-border/60" style={{ height: HOUR_HEIGHT }} />
      ))}

      {placedEvents.map(({ event, top, height, leftPct, widthPct }) => {
        const colors = eventColorClasses(event.id)
        const start = getEventStart(event)
        const end = getEventEnd(event)
        return (
          <button
            key={event.id}
            type="button"
            onClick={() => onSelectEvent?.(event)}
            className={cn(
              "absolute overflow-hidden rounded-md border-l-2 px-2 py-1 text-left text-xs shadow-sm transition-colors",
              colors.bg,
              colors.bar.replace("bg-", "border-l-"),
            )}
            style={{
              top,
              height: Math.max(20, height - 2),
              left: `calc(${leftPct}% + 2px)`,
              width: `calc(${widthPct}% - 4px)`,
            }}
            title={event.summary}
          >
            <div className="truncate font-semibold text-foreground">{event.summary || "(No title)"}</div>
            {height > 30 && (
              <div className="truncate text-[10px] text-muted-foreground">
                {format(start, "h:mm a")} – {format(end, "h:mm a")}
              </div>
            )}
            {height > 60 && event.location ? (
              <div className="truncate text-[10px] text-muted-foreground">{event.location}</div>
            ) : null}
          </button>
        )
      })}

      {showNowLine && (
        <div className="pointer-events-none absolute left-0 right-0 z-10" style={{ top: nowTop }}>
          <div className="relative">
            <span className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-destructive" aria-hidden />
            <div className="h-px bg-destructive" />
          </div>
        </div>
      )}
    </div>
  )
}

type PlacedEvent = {
  event: CalendarEvent
  top: number
  height: number
  leftPct: number
  widthPct: number
}

function layoutEvents(events: CalendarEvent[], day: Date): PlacedEvent[] {
  // Sort by start
  const sorted = [...events].sort((a, b) => getEventStart(a).getTime() - getEventStart(b).getTime())

  // Group overlapping events into clusters
  type Item = { event: CalendarEvent; start: number; end: number; col?: number; cols?: number }
  const items: Item[] = sorted.map((e) => {
    const s = getEventStart(e)
    const en = getEventEnd(e)
    const dayStart = new Date(day)
    dayStart.setHours(0, 0, 0, 0)
    const startMin = Math.max(0, (s.getTime() - dayStart.getTime()) / 60000)
    const endMin = Math.min(24 * 60, (en.getTime() - dayStart.getTime()) / 60000)
    return { event: e, start: startMin, end: Math.max(endMin, startMin + 15) }
  })

  // Greedy column assignment within overlap groups
  let cluster: Item[] = []
  let clusterEnd = 0
  const clusters: Item[][] = []

  for (const it of items) {
    if (cluster.length === 0 || it.start < clusterEnd) {
      cluster.push(it)
      clusterEnd = Math.max(clusterEnd, it.end)
    } else {
      clusters.push(cluster)
      cluster = [it]
      clusterEnd = it.end
    }
  }
  if (cluster.length) clusters.push(cluster)

  for (const c of clusters) {
    const colsEnds: number[] = []
    for (const it of c) {
      let placed = false
      for (let i = 0; i < colsEnds.length; i++) {
        if (colsEnds[i] <= it.start) {
          it.col = i
          colsEnds[i] = it.end
          placed = true
          break
        }
      }
      if (!placed) {
        it.col = colsEnds.length
        colsEnds.push(it.end)
      }
    }
    const totalCols = colsEnds.length
    for (const it of c) it.cols = totalCols
  }

  return items.map((it) => ({
    event: it.event,
    top: (it.start / 60) * HOUR_HEIGHT,
    height: ((it.end - it.start) / 60) * HOUR_HEIGHT,
    leftPct: ((it.col ?? 0) / (it.cols ?? 1)) * 100,
    widthPct: (1 / (it.cols ?? 1)) * 100,
  }))
}

import { addDays, format, isSameDay, isSameWeek, isToday, startOfWeek } from "date-fns"

export type CalendarEvent = {
  id: string
  summary: string
  description?: string
  location?: string
  start: { dateTime?: string; date?: string; timeZone?: string }
  end: { dateTime?: string; date?: string; timeZone?: string }
  htmlLink?: string
  attendees?: { email: string; responseStatus?: string }[]
}

export function getWeekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function getEventStart(e: CalendarEvent): Date {
  return new Date(e.start.dateTime ?? e.start.date ?? "")
}

export function getEventEnd(e: CalendarEvent): Date {
  return new Date(e.end.dateTime ?? e.end.date ?? "")
}

export function isAllDay(e: CalendarEvent): boolean {
  return Boolean(e.start.date && !e.start.dateTime)
}

export function eventColorClasses(id: string): { bar: string; bg: string; text: string } {
  // 5 deterministic colors based on event id
  const palette = [
    { bar: "bg-chart-1", bg: "bg-chart-1/10 hover:bg-chart-1/15", text: "text-chart-1" },
    { bar: "bg-chart-2", bg: "bg-chart-2/10 hover:bg-chart-2/15", text: "text-chart-2" },
    { bar: "bg-chart-3", bg: "bg-chart-3/15 hover:bg-chart-3/20", text: "text-chart-3" },
    { bar: "bg-chart-4", bg: "bg-chart-4/10 hover:bg-chart-4/15", text: "text-chart-4" },
    { bar: "bg-chart-5", bg: "bg-chart-5/10 hover:bg-chart-5/15", text: "text-chart-5" },
  ]
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return palette[h % palette.length]
}

export function formatRangeLabel(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()
  if (sameMonth) {
    return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`
  }
  if (sameYear) {
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
  }
  return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`
}

export { addDays, format, isSameDay, isSameWeek, isToday, startOfWeek }

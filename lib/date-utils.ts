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
  hangoutLink?: string
  conferenceData?: {
    entryPoints?: { entryPointType?: string; uri?: string; label?: string }[]
    conferenceSolution?: { name?: string; iconUri?: string }
  }
}

const VIDEO_HOST_RE =
  /\b(?:meet\.google\.com|zoom\.us|zoom\.com|teams\.microsoft\.com|teams\.live\.com|webex\.com|gotomeeting\.com|whereby\.com|around\.co|meet\.jit\.si|jitsi\.org|riverside\.fm|huddle\.com)\b/i

export function getMeetingLink(e: CalendarEvent): { url: string; provider: string } | null {
  // 1. Google Meet's dedicated field
  if (e.hangoutLink) return { url: e.hangoutLink, provider: "Google Meet" }

  // 2. Conference data entry points
  const ep = e.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video" && p.uri)
  if (ep?.uri) {
    const provider = e.conferenceData?.conferenceSolution?.name ?? providerFromUrl(ep.uri)
    return { url: ep.uri, provider }
  }

  // 3. Scan location and description for video URLs
  const haystack = `${e.location ?? ""}\n${e.description ?? ""}`
  const urlMatch = haystack.match(/https?:\/\/[^\s<>"')]+/g)
  if (urlMatch) {
    for (const url of urlMatch) {
      if (VIDEO_HOST_RE.test(url)) {
        return { url, provider: providerFromUrl(url) }
      }
    }
  }
  return null
}

export function isVirtualMeeting(e: CalendarEvent): boolean {
  return getMeetingLink(e) !== null
}

function providerFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes("meet.google.com")) return "Google Meet"
    if (host.includes("zoom.us") || host.includes("zoom.com")) return "Zoom"
    if (host.includes("teams.microsoft") || host.includes("teams.live")) return "Microsoft Teams"
    if (host.includes("webex.com")) return "Webex"
    if (host.includes("gotomeeting.com")) return "GoToMeeting"
    if (host.includes("whereby.com")) return "Whereby"
    if (host.includes("jit.si") || host.includes("jitsi")) return "Jitsi"
    if (host.includes("riverside.fm")) return "Riverside"
    return host.replace(/^www\./, "")
  } catch {
    return "Video call"
  }
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

"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Copy, ExternalLink, Loader2, MapPin, RefreshCw, Sparkles, Users, Video } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type CalendarEvent, getEventEnd, getEventStart, getMeetingLink, isAllDay } from "@/lib/date-utils"

export function EventDetail({
  event,
  onOpenChange,
}: {
  event: CalendarEvent | null
  onOpenChange: (open: boolean) => void
}) {
  const open = Boolean(event)
  const meeting = event ? getMeetingLink(event) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        {event ? (
          <div className="flex flex-col">
            <DialogHeader className="space-y-1.5 px-6 pb-4 pt-6 text-left">
              <DialogTitle className="text-balance text-xl tracking-tight">
                {event.summary || "(No title)"}
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {meeting ? `${meeting.provider} · video call` : "Event"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 border-t border-border/80 px-6 py-4 text-sm">
              <Row icon={<Calendar className="h-4 w-4" aria-hidden />}>
                {format(getEventStart(event), "EEEE, MMMM d, yyyy")}
              </Row>
              {!isAllDay(event) ? (
                <Row icon={<Clock className="h-4 w-4" aria-hidden />}>
                  <span className="tabular-nums">
                    {format(getEventStart(event), "h:mm a")} – {format(getEventEnd(event), "h:mm a")}
                  </span>
                </Row>
              ) : (
                <Row icon={<Clock className="h-4 w-4" aria-hidden />}>All day</Row>
              )}
              {event.location && !meeting ? (
                <Row icon={<MapPin className="h-4 w-4" aria-hidden />}>{event.location}</Row>
              ) : null}
              {event.attendees?.length ? (
                <Row icon={<Users className="h-4 w-4" aria-hidden />}>
                  <ul className="space-y-0.5">
                    {event.attendees.map((a) => (
                      <li key={a.email} className="text-muted-foreground">
                        {a.email}
                      </li>
                    ))}
                  </ul>
                </Row>
              ) : null}
              {event.description ? (
                <div className="mt-2 rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed text-foreground">
                  {event.description}
                </div>
              ) : null}
            </div>

            {meeting ? <MeetingPrep event={event} meetingUrl={meeting.url} provider={meeting.provider} /> : null}

            <div className="flex flex-wrap gap-2 border-t border-border/80 px-6 py-4">
              {meeting ? (
                <Button asChild className="gap-2">
                  <a href={meeting.url} target="_blank" rel="noreferrer">
                    <Video className="h-4 w-4" aria-hidden />
                    Join {meeting.provider}
                  </a>
                </Button>
              ) : null}
              {event.htmlLink ? (
                <Button asChild variant="outline" className="gap-2 bg-transparent">
                  <a href={event.htmlLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Open in Google Calendar
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1 text-foreground">{children}</div>
    </div>
  )
}

function MeetingPrep({ event, meetingUrl, provider }: { event: CalendarEvent; meetingUrl: string; provider: string }) {
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // Reset whenever a different event is opened
  useEffect(() => {
    setNotes("")
    setStatus("idle")
    setError(null)
    setCopied(false)
    abortRef.current?.abort()
  }, [event.id])

  async function generate() {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setNotes("")
    setError(null)
    setStatus("loading")
    try {
      const res = await fetch("/api/meeting-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          event: {
            summary: event.summary,
            description: event.description,
            location: event.location,
            start: event.start.dateTime ?? event.start.date,
            end: event.end.dateTime ?? event.end.date,
            attendees: event.attendees?.map((a) => a.email),
            provider,
            meetingUrl,
          },
        }),
      })
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Request failed: ${res.status}`)
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setNotes(acc)
      }
      setStatus("done")
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return
      setStatus("error")
      setError(e instanceof Error ? e.message : "Couldn't generate notes")
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(notes)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const isStreaming = status === "loading"

  return (
    <section className="border-t border-border/80 bg-muted/20 px-6 py-5" aria-labelledby="prep-heading">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Meeting brief
          </p>
          <h3 id="prep-heading" className="text-pretty text-base leading-tight tracking-tight">
            Prep notes,{" "}
            <span className="font-serif italic font-normal text-muted-foreground">in seconds.</span>
          </h3>
        </div>
        {status === "idle" ? (
          <Button size="sm" onClick={generate} className="shrink-0 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Generate
          </Button>
        ) : null}
        {status === "done" ? (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCopy}
              className="h-8 gap-1.5 px-2 text-xs"
              aria-label="Copy notes to clipboard"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={generate}
              className="h-8 gap-1.5 px-2 text-xs"
              aria-label="Regenerate notes"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              Redo
            </Button>
          </div>
        ) : null}
      </div>

      {status === "idle" && !notes ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Generate context, agenda, talking points, and follow-ups based on the event details. Notes are produced
          fresh each time and never stored.
        </p>
      ) : null}

      {(isStreaming || status === "done") && notes ? (
        <PrepNotes content={notes} streaming={isStreaming} />
      ) : null}

      {isStreaming && !notes ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Drafting notes…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <p className="font-medium">Couldn&apos;t generate notes</p>
          <p className="mt-0.5 break-words text-destructive/80">{error}</p>
          <button
            type="button"
            onClick={generate}
            className="mt-1.5 underline-offset-2 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : null}
    </section>
  )
}

/** Lightweight Markdown-ish renderer for the strict structure the route prompts for. */
function PrepNotes({ content, streaming }: { content: string; streaming: boolean }) {
  const sections = parseSections(content)
  return (
    <div className="mt-4 space-y-4 text-sm leading-relaxed">
      {sections.map((s, i) => (
        <div key={i} className="space-y-1.5">
          <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {s.heading}
          </h4>
          {s.bullets.length ? (
            <ul className="space-y-1.5">
              {s.bullets.map((b, j) => (
                <li key={j} className="flex gap-2 text-foreground">
                  <span aria-hidden className="mt-[0.55em] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                  <span className="min-w-0 flex-1">{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-foreground">{s.body}</p>
          )}
        </div>
      ))}
      {streaming ? <span aria-hidden className="inline-block h-3 w-1.5 animate-pulse bg-foreground/60 align-middle" /> : null}
    </div>
  )
}

function parseSections(md: string): { heading: string; body: string; bullets: string[] }[] {
  const lines = md.split(/\r?\n/)
  const out: { heading: string; body: string; bullets: string[] }[] = []
  let current: { heading: string; body: string; bullets: string[] } | null = null
  for (const raw of lines) {
    const line = raw.trimEnd()
    const headingMatch = /^#{1,6}\s+(.+)$/.exec(line)
    if (headingMatch) {
      if (current) out.push(current)
      current = { heading: headingMatch[1].trim(), body: "", bullets: [] }
      continue
    }
    if (!current) {
      // Content before any heading; create an implicit section
      if (line.trim()) {
        current = { heading: "Notes", body: "", bullets: [] }
      } else {
        continue
      }
    }
    const bulletMatch = /^[-*•]\s+(.+)$/.exec(line.trim())
    if (bulletMatch) {
      current.bullets.push(stripBoldMarkers(bulletMatch[1].trim()))
    } else if (line.trim()) {
      current.body = current.body ? `${current.body} ${stripBoldMarkers(line.trim())}` : stripBoldMarkers(line.trim())
    }
  }
  if (current) out.push(current)
  return out
}

function stripBoldMarkers(s: string): string {
  // Strip simple **bold** and *italic* markers to keep prose clean
  return s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/(^|[^*])\*(?!\*)([^*]+)\*/g, "$1$2")
}

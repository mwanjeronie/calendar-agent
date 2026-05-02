"use client"

import { format } from "date-fns"
import { Calendar, Clock, ExternalLink, MapPin, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type CalendarEvent, getEventEnd, getEventStart, isAllDay } from "@/lib/date-utils"

export function EventDetail({
  event,
  onOpenChange,
}: {
  event: CalendarEvent | null
  onOpenChange: (open: boolean) => void
}) {
  const open = Boolean(event)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {event ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-balance">{event.summary || "(No title)"}</DialogTitle>
              <DialogDescription>Event details</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <Row icon={<Calendar className="h-4 w-4" aria-hidden />}>
                {format(getEventStart(event), "EEEE, MMMM d, yyyy")}
              </Row>
              {!isAllDay(event) ? (
                <Row icon={<Clock className="h-4 w-4" aria-hidden />}>
                  {format(getEventStart(event), "h:mm a")} – {format(getEventEnd(event), "h:mm a")}
                </Row>
              ) : (
                <Row icon={<Clock className="h-4 w-4" aria-hidden />}>All day</Row>
              )}
              {event.location ? (
                <Row icon={<MapPin className="h-4 w-4" aria-hidden />}>{event.location}</Row>
              ) : null}
              {event.attendees?.length ? (
                <Row icon={<Users className="h-4 w-4" aria-hidden />}>
                  <ul className="space-y-1">
                    {event.attendees.map((a) => (
                      <li key={a.email} className="text-muted-foreground">
                        {a.email}
                      </li>
                    ))}
                  </ul>
                </Row>
              ) : null}
              {event.description ? (
                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed text-foreground">
                  {event.description}
                </div>
              ) : null}
            </div>
            {event.htmlLink ? (
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href={event.htmlLink} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Calendar
                </a>
              </Button>
            ) : null}
          </>
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

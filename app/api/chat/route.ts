import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import { createEvent, deleteEvent, listEvents, readTokensFromCookies, updateEvent } from "@/lib/google"

export const maxDuration = 60

export async function POST(req: Request) {
  const tokens = await readTokensFromCookies()
  if (!tokens) {
    return new Response(JSON.stringify({ error: "not_authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "GOOGLE_GENERATIVE_AI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey and add it in Project Settings → Vars.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
  const google = createGoogleGenerativeAI({ apiKey })

  const { messages, timeZone } = (await req.json()) as {
    messages: UIMessage[]
    timeZone?: string
  }

  const tz = timeZone || "UTC"
  const now = new Date()

  const tools = {
    list_events: tool({
      description:
        "List events from the user's primary Google Calendar within a time range. Use this to answer questions about the user's schedule, find conflicts, or look up existing events before creating new ones.",
      inputSchema: z.object({
        timeMin: z.string().describe("ISO 8601 lower bound (inclusive). e.g. 2025-01-01T00:00:00Z"),
        timeMax: z.string().describe("ISO 8601 upper bound (exclusive). e.g. 2025-01-08T00:00:00Z"),
        query: z
          .string()
          .nullable()
          .describe("Optional free-text search across event fields. Pass null when not needed."),
      }),
      execute: async ({ timeMin, timeMax, query }) => {
        const events = await listEvents({ timeMin, timeMax, q: query ?? undefined, maxResults: 50 })
        return events.map((e) => ({
          id: e.id,
          summary: e.summary,
          location: e.location,
          description: e.description,
          start: e.start.dateTime ?? e.start.date,
          end: e.end.dateTime ?? e.end.date,
          attendees: e.attendees?.map((a) => a.email),
          link: e.htmlLink,
        }))
      },
    }),
    create_event: tool({
      description: "Create a new event on the user's primary Google Calendar.",
      inputSchema: z.object({
        summary: z.string().describe("Title of the event"),
        start: z.string().describe("ISO 8601 start datetime, e.g. 2025-01-15T14:00:00"),
        end: z.string().describe("ISO 8601 end datetime, e.g. 2025-01-15T15:00:00"),
        description: z.string().nullable().describe("Optional notes. Pass null when not needed."),
        location: z.string().nullable().describe("Optional location. Pass null when not needed."),
        attendees: z
          .array(z.string())
          .nullable()
          .describe("Optional list of attendee emails. Pass null when not needed."),
      }),
      execute: async ({ summary, start, end, description, location, attendees }) => {
        const event = await createEvent({
          summary,
          start,
          end,
          description: description ?? undefined,
          location: location ?? undefined,
          attendees: attendees ?? undefined,
          timeZone: tz,
        })
        return {
          id: event.id,
          summary: event.summary,
          start: event.start.dateTime ?? event.start.date,
          end: event.end.dateTime ?? event.end.date,
          link: event.htmlLink,
        }
      },
    }),
    update_event: tool({
      description: "Update fields on an existing event by ID. Only pass fields you want to change.",
      inputSchema: z.object({
        id: z.string().describe("The Google Calendar event ID"),
        summary: z.string().nullable(),
        start: z.string().nullable().describe("ISO 8601 start datetime, or null to leave unchanged"),
        end: z.string().nullable().describe("ISO 8601 end datetime, or null to leave unchanged"),
        description: z.string().nullable(),
        location: z.string().nullable(),
      }),
      execute: async ({ id, summary, start, end, description, location }) => {
        const event = await updateEvent(id, {
          summary: summary ?? undefined,
          start: start ?? undefined,
          end: end ?? undefined,
          description: description ?? undefined,
          location: location ?? undefined,
          timeZone: tz,
        })
        return {
          id: event.id,
          summary: event.summary,
          start: event.start.dateTime ?? event.start.date,
          end: event.end.dateTime ?? event.end.date,
        }
      },
    }),
    delete_event: tool({
      description: "Delete an event by ID. Confirm with the user before calling unless they have already confirmed.",
      inputSchema: z.object({
        id: z.string().describe("The Google Calendar event ID"),
      }),
      execute: async ({ id }) => {
        await deleteEvent(id)
        return { id, deleted: true }
      },
    }),
  }

  const system = `You are a helpful calendar assistant connected to the user's Google Calendar.

Current time: ${now.toISOString()}
User's IANA time zone: ${tz}

Guidelines:
- When the user references relative times like "tomorrow at 3pm", "next Friday", "this evening", interpret them in the user's time zone (${tz}) and convert to ISO 8601 in that zone (without a Z suffix). The Google Calendar API will use the time zone you provide.
- Default new event duration is 1 hour unless otherwise specified.
- Before creating events that may conflict, check with list_events if helpful.
- After creating, updating, or deleting events, briefly confirm what was done with key details (title, date, time).
- Be concise. Use short sentences and avoid markdown headings.
- Never expose raw event IDs to the user; refer to events by title and time.
- If a request is ambiguous (e.g. "schedule a meeting"), ask one clarifying question.
- Today's date is ${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: tz })}.`

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
  })

  return result.toUIMessageStreamResponse()
}

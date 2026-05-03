import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const maxDuration = 60

type EventInput = {
  summary?: string
  description?: string
  location?: string
  start?: string
  end?: string
  attendees?: string[]
  provider?: string
  meetingUrl?: string
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return new Response(
      "GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it in Project Settings to use meeting notes.",
      { status: 500 },
    )
  }

  const body = (await req.json()) as { event?: EventInput }
  const event = body.event ?? {}

  const lines: string[] = []
  if (event.summary) lines.push(`Title: ${event.summary}`)
  if (event.start && event.end) lines.push(`When: ${event.start} – ${event.end}`)
  if (event.provider) lines.push(`Format: ${event.provider} video call`)
  if (event.location) lines.push(`Location/link context: ${event.location}`)
  if (event.attendees?.length) lines.push(`Attendees: ${event.attendees.join(", ")}`)
  if (event.description) lines.push(`Description: ${event.description}`)

  const eventBlock = lines.join("\n") || "(No event details available)"

  const system = `You are a sharp executive assistant preparing a concise, no-fluff brief for a virtual meeting.

Write in plain language a thoughtful person would actually use. No emojis. No headings like "Introduction". No restating the title.

Output STRICTLY this Markdown structure with these exact section headings, nothing else:

## Context
A 1–2 sentence summary of what this meeting appears to be about, inferred from the title, attendees, and description. Be specific. If you genuinely cannot tell, say so briefly instead of guessing.

## Agenda
3–5 bullet points covering the most likely flow of the meeting. Start each bullet with a verb (e.g. "Walk through…", "Decide on…", "Review…"). Keep each bullet to one short sentence.

## Talking points
3–4 bullets the meeting host should be ready to articulate. These are positions, status updates, or proposals — not questions.

## Questions to ask
3–4 sharp open-ended questions to surface information from the other attendees. Avoid yes/no questions.

## Follow-ups to capture
2–3 bullets describing the kind of decisions or commitments to record during the meeting (e.g. "Owner and date for the migration plan").

Keep the entire output under 220 words.`

  const prompt = `Generate prep notes for this meeting:\n\n${eventBlock}`

  const google = createGoogleGenerativeAI({ apiKey })
  const result = streamText({
    model: google("gemini-2.5-flash"),
    system,
    prompt,
  })

  return result.toTextStreamResponse()
}

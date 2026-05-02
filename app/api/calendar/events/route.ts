import { NextResponse } from "next/server"
import { listEvents, readTokensFromCookies } from "@/lib/google"

export async function GET(req: Request) {
  const tokens = await readTokensFromCookies()
  if (!tokens) {
    return NextResponse.json({ error: "not_authenticated", events: [] }, { status: 401 })
  }
  const url = new URL(req.url)
  const timeMin = url.searchParams.get("timeMin")
  const timeMax = url.searchParams.get("timeMax")
  if (!timeMin || !timeMax) {
    return NextResponse.json({ error: "timeMin and timeMax are required" }, { status: 400 })
  }
  try {
    const events = await listEvents({ timeMin, timeMax })
    return NextResponse.json({ events })
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown"
    return NextResponse.json({ error: message, events: [] }, { status: 500 })
  }
}

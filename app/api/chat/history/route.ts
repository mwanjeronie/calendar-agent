import { NextResponse } from "next/server"
import type { UIMessage } from "ai"
import { readTokensFromCookies } from "@/lib/google"
import { readChatHistory, saveChatHistory } from "@/lib/chat-history"

export async function GET() {
  const tokens = await readTokensFromCookies()
  if (!tokens) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 })
  }
  const history = await readChatHistory()
  return NextResponse.json(history)
}

export async function POST(req: Request) {
  const tokens = await readTokensFromCookies()
  if (!tokens) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    conversationId?: unknown
    messages?: unknown
  } | null
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "messages are required" }, { status: 400 })
  }

  const conversationId = typeof body.conversationId === "string" ? body.conversationId : null
  const saved = await saveChatHistory({
    conversationId,
    messages: body.messages as UIMessage[],
  })
  return NextResponse.json(saved)
}

import { NextResponse } from "next/server"
import { readTokensFromCookies } from "@/lib/google"
import { writeChatHistory } from "@/lib/chat-history"

export async function POST() {
  const tokens = await readTokensFromCookies()
  if (!tokens) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 })
  }

  const conversationId = crypto.randomUUID()
  await writeChatHistory({ conversationId, messages: [] })
  return NextResponse.json({ conversationId, messages: [] })
}

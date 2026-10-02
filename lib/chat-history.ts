import { cookies } from "next/headers"
import type { UIMessage } from "ai"

export const CHAT_HISTORY_COOKIE = "gcal_chat"
const MAX_COOKIE_LENGTH = 3800

export type StoredChat = {
  conversationId: string | null
  messages: UIMessage[]
}

const emptyChat: StoredChat = { conversationId: null, messages: [] }

export async function readChatHistory(): Promise<StoredChat> {
  const store = await cookies()
  const raw = store.get(CHAT_HISTORY_COOKIE)?.value
  if (!raw) return emptyChat
  try {
    const parsed = JSON.parse(raw) as Partial<StoredChat>
    return {
      conversationId: typeof parsed.conversationId === "string" ? parsed.conversationId : null,
      messages: Array.isArray(parsed.messages) ? (parsed.messages as UIMessage[]) : [],
    }
  } catch {
    return emptyChat
  }
}

function encode(chat: StoredChat) {
  let messages = chat.messages.slice(-20)
  let payload = JSON.stringify({ conversationId: chat.conversationId, messages })
  while (payload.length > MAX_COOKIE_LENGTH && messages.length > 0) {
    messages = messages.slice(1)
    payload = JSON.stringify({ conversationId: chat.conversationId, messages })
  }
  if (payload.length > MAX_COOKIE_LENGTH) {
    payload = JSON.stringify({ conversationId: chat.conversationId, messages: [] })
  }
  return payload
}

export async function writeChatHistory(chat: StoredChat) {
  const store = await cookies()
  store.set(CHAT_HISTORY_COOKIE, encode(chat), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function saveChatHistory(next: StoredChat) {
  const current = await readChatHistory()
  if (
    current.conversationId &&
    next.conversationId &&
    current.conversationId !== next.conversationId
  ) {
    return current
  }
  await writeChatHistory(next)
  return next
}

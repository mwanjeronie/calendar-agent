"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp, CalendarPlus, CheckCircle2, Clock, Loader2, Pencil, RotateCcw, Sparkles, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ToolName = "list_events" | "create_event" | "update_event" | "delete_event"

const TOOL_LABELS: Record<ToolName, { running: string; done: string; icon: React.ComponentType<{ className?: string }> }> = {
  list_events: { running: "Checking your calendar", done: "Checked your calendar", icon: Clock },
  create_event: { running: "Creating event", done: "Created event", icon: CalendarPlus },
  update_event: { running: "Updating event", done: "Updated event", icon: Pencil },
  delete_event: { running: "Deleting event", done: "Deleted event", icon: Trash2 },
}

const SUGGESTIONS = [
  "What's on my calendar today?",
  "Schedule a 30-minute focus block tomorrow at 9am",
  "Move my next meeting to 4pm",
  "Find a free hour this week for lunch",
]

export function ChatPanel({ onCalendarChange }: { onCalendarChange?: () => void }) {
  const [input, setInput] = useState("")
  const scrollerRef = useRef<HTMLDivElement>(null)
  const timeZone =
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC"

  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages, timeZone },
      }),
    }),
  })

  // Auto-scroll
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, status])

  // Trigger calendar refresh after a tool that mutates
  useEffect(() => {
    if (!onCalendarChange) return
    const last = messages[messages.length - 1]
    if (!last || last.role !== "assistant" || status === "streaming") return
    const mutated = last.parts?.some(
      (p) =>
        p.type === "tool-create_event" ||
        p.type === "tool-update_event" ||
        p.type === "tool-delete_event",
    )
    if (mutated) onCalendarChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || status === "streaming" || status === "submitted") return
    sendMessage({ text })
    setInput("")
  }

  const isBusy = status === "streaming" || status === "submitted"

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground font-serif text-[14px] leading-none text-background"
          >
            <span className="-mt-px italic">C</span>
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight tracking-tight">Calendar Assistant</span>
            <span className="text-[11px] text-muted-foreground">Gemini 2.5 Flash</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && !isBusy ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMessages([])}
              className="h-8 gap-1.5 px-2 text-xs"
              aria-label="Clear conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Clear
            </Button>
          ) : null}
          {isBusy ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => stop()}>
              Stop
            </Button>
          ) : null}
        </div>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <EmptyState onPick={(s) => sendMessage({ text: s })} />
        ) : (
          <ul className="flex flex-col gap-4">
            {messages.map((m) => (
              <li key={m.id}>
                <Message message={m} />
              </li>
            ))}
            {status === "submitted" && (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Thinking…
              </li>
            )}
          </ul>
        )}
      </div>

      {error ? (
        <div className="border-t border-destructive/30 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium">Couldn&apos;t complete that request</p>
              <p className="mt-0.5 break-words text-destructive/80">{error.message || "Something went wrong."}</p>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="shrink-0 rounded border border-destructive/40 px-2 py-1 font-medium hover:bg-destructive/10"
            >
              Reset
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-lg border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as unknown as React.FormEvent)
              }
            }}
            placeholder="Ask about your schedule, or tell me what to plan…"
            rows={1}
            className="min-h-0 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Message"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isBusy} aria-label="Send message">
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex h-full flex-col gap-6 py-6">
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Ask the assistant
        </p>
        <h2 className="text-pretty text-lg leading-tight tracking-tight">
          What&apos;s on your mind?{" "}
          <span className="font-serif italic font-normal text-muted-foreground">Try one of these.</span>
        </h2>
      </div>
      <ul className="flex flex-col gap-1.5">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="group flex w-full items-center justify-between gap-3 rounded-md border border-border/80 bg-background px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50"
            >
              <span className="leading-snug">{s}</span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type AnyPart = {
  type: string
  text?: string
  state?: string
  input?: unknown
  output?: unknown
  errorText?: string
}

function Message({ message }: { message: { role: string; parts?: AnyPart[] } }) {
  const isUser = message.role === "user"
  const parts = (message.parts ?? []) as AnyPart[]

  if (isUser) {
    const text = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("")
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
          <p className="whitespace-pre-wrap text-pretty">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <div
              key={i}
              className="max-w-[92%] rounded-2xl rounded-bl-sm bg-muted/60 px-3 py-2 text-sm text-foreground"
            >
              <p className="whitespace-pre-wrap text-pretty leading-relaxed">{part.text}</p>
            </div>
          )
        }
        if (part.type.startsWith("tool-")) {
          const name = part.type.replace("tool-", "") as ToolName
          const meta = TOOL_LABELS[name] ?? { running: name, done: name, icon: Sparkles }
          const Icon = meta.icon
          const isDone = part.state === "output-available"
          const isError = part.state === "output-error"
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 self-start rounded-full border px-2.5 py-1 text-xs",
                isError
                  ? "border-destructive/40 bg-destructive/5 text-destructive"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
              ) : isError ? (
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              )}
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span>{isDone ? meta.done : isError ? `Failed: ${meta.running}` : meta.running}</span>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

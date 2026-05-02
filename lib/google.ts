import { cookies } from "next/headers"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar"

export const GOOGLE_TOKENS_COOKIE = "gcal_tokens"

export type GoogleTokens = {
  access_token: string
  refresh_token?: string
  expires_at: number // ms epoch
  scope?: string
  token_type?: string
}

export function getRedirectUri(req: Request) {
  const url = new URL(req.url)
  // Honor x-forwarded-* when behind a proxy / on Vercel
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host
  return `${proto}://${host}/api/auth/google/callback`
}

export function buildAuthUrl(redirectUri: string, state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) throw new Error("Missing GOOGLE_CLIENT_ID")
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: `${CALENDAR_SCOPE} openid email profile`,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  })
  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<GoogleTokens> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
  }

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${res.status} ${text}`)
  }
  const data = (await res.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
    scope: string
    token_type: string
  }
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    scope: data.scope,
    token_type: data.token_type,
  }
}

async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
  }
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token refresh failed: ${res.status} ${text}`)
  }
  const data = (await res.json()) as {
    access_token: string
    expires_in: number
    scope?: string
    token_type?: string
  }
  return {
    access_token: data.access_token,
    refresh_token: refreshToken,
    expires_at: Date.now() + data.expires_in * 1000,
    scope: data.scope,
    token_type: data.token_type,
  }
}

export async function readTokensFromCookies(): Promise<GoogleTokens | null> {
  const store = await cookies()
  const raw = store.get(GOOGLE_TOKENS_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as GoogleTokens
  } catch {
    return null
  }
}

export async function writeTokensToCookies(tokens: GoogleTokens) {
  const store = await cookies()
  store.set(GOOGLE_TOKENS_COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearTokensCookie() {
  const store = await cookies()
  store.delete(GOOGLE_TOKENS_COOKIE)
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await readTokensFromCookies()
  if (!tokens) return null

  // refresh ~60s before expiry
  if (tokens.expires_at - 60_000 < Date.now()) {
    if (!tokens.refresh_token) return null
    const refreshed = await refreshAccessToken(tokens.refresh_token)
    await writeTokensToCookies(refreshed)
    return refreshed.access_token
  }
  return tokens.access_token
}

export type CalendarEvent = {
  id: string
  summary: string
  description?: string
  location?: string
  start: { dateTime?: string; date?: string; timeZone?: string }
  end: { dateTime?: string; date?: string; timeZone?: string }
  htmlLink?: string
  attendees?: { email: string; responseStatus?: string }[]
}

async function gcalFetch(path: string, init: RequestInit = {}) {
  const accessToken = await getValidAccessToken()
  if (!accessToken) throw new Error("Not authenticated with Google")
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google Calendar API ${res.status}: ${text}`)
  }
  return res.json()
}

export async function listEvents(params: {
  timeMin: string
  timeMax: string
  q?: string
  maxResults?: number
}): Promise<CalendarEvent[]> {
  const search = new URLSearchParams({
    timeMin: params.timeMin,
    timeMax: params.timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: String(params.maxResults ?? 100),
  })
  if (params.q) search.set("q", params.q)
  const data = await gcalFetch(`/calendars/primary/events?${search.toString()}`)
  return (data.items ?? []) as CalendarEvent[]
}

export async function createEvent(input: {
  summary: string
  description?: string
  location?: string
  start: string // ISO string, dateTime
  end: string
  timeZone?: string
  attendees?: string[]
}): Promise<CalendarEvent> {
  const tz = input.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  const body = {
    summary: input.summary,
    description: input.description,
    location: input.location,
    start: { dateTime: input.start, timeZone: tz },
    end: { dateTime: input.end, timeZone: tz },
    attendees: input.attendees?.map((email) => ({ email })),
  }
  return (await gcalFetch(`/calendars/primary/events`, {
    method: "POST",
    body: JSON.stringify(body),
  })) as CalendarEvent
}

export async function updateEvent(
  id: string,
  input: Partial<{
    summary: string
    description: string
    location: string
    start: string
    end: string
    timeZone: string
  }>,
): Promise<CalendarEvent> {
  const tz = input.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  const body: Record<string, unknown> = {}
  if (input.summary !== undefined) body.summary = input.summary
  if (input.description !== undefined) body.description = input.description
  if (input.location !== undefined) body.location = input.location
  if (input.start) body.start = { dateTime: input.start, timeZone: tz }
  if (input.end) body.end = { dateTime: input.end, timeZone: tz }
  return (await gcalFetch(`/calendars/primary/events/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })) as CalendarEvent
}

export async function deleteEvent(id: string): Promise<void> {
  const accessToken = await getValidAccessToken()
  if (!accessToken) throw new Error("Not authenticated with Google")
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  if (!res.ok && res.status !== 410) {
    const text = await res.text()
    throw new Error(`Google Calendar API ${res.status}: ${text}`)
  }
}

export async function getProfile(): Promise<{ email?: string; name?: string; picture?: string } | null> {
  const accessToken = await getValidAccessToken()
  if (!accessToken) return null
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return null
  return res.json()
}

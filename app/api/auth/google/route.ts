import { NextResponse } from "next/server"
import { buildAuthUrl, getRedirectUri } from "@/lib/google"

export async function GET(req: Request) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      {
        error: "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables.",
      },
      { status: 500 },
    )
  }
  const redirectUri = getRedirectUri(req)
  const state = crypto.randomUUID()
  const url = buildAuthUrl(redirectUri, state)
  const res = NextResponse.redirect(url)
  res.cookies.set("gcal_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  })
  return res
}

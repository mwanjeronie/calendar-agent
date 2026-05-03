import { NextResponse } from "next/server"
import { exchangeCodeForTokens, getRedirectUri, GOOGLE_TOKENS_COOKIE } from "@/lib/google"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")

  const baseUrl = `${url.protocol}//${url.host}`

  if (error) {
    return NextResponse.redirect(`${baseUrl}/app?auth_error=${encodeURIComponent(error)}`)
  }
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/app?auth_error=missing_code`)
  }

  const cookieHeader = req.headers.get("cookie") ?? ""
  const cookieState = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("gcal_oauth_state="))
    ?.split("=")[1]

  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${baseUrl}/app?auth_error=state_mismatch`)
  }

  try {
    const redirectUri = getRedirectUri(req)
    const tokens = await exchangeCodeForTokens(code, redirectUri)

    const res = NextResponse.redirect(`${baseUrl}/app?auth=success`)
    res.cookies.set(GOOGLE_TOKENS_COOKIE, JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
    res.cookies.delete("gcal_oauth_state")
    return res
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown_error"
    return NextResponse.redirect(`${baseUrl}/app?auth_error=${encodeURIComponent(message)}`)
  }
}

import { NextResponse } from "next/server"
import { getProfile, readTokensFromCookies } from "@/lib/google"

export async function GET() {
  const tokens = await readTokensFromCookies()
  const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  if (!tokens) {
    return NextResponse.json({ authenticated: false, configured })
  }
  try {
    const profile = await getProfile()
    return NextResponse.json({ authenticated: true, configured, profile })
  } catch {
    return NextResponse.json({ authenticated: false, configured })
  }
}

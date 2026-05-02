import { NextResponse } from "next/server"
import { GOOGLE_TOKENS_COOKIE } from "@/lib/google"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(GOOGLE_TOKENS_COOKIE)
  return res
}

import { CalendarApp } from "@/components/calendar-app"
import { ConnectGoogle } from "@/components/connect-google"
import { readTokensFromCookies } from "@/lib/google"

export default async function Page() {
  const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  const tokens = configured ? await readTokensFromCookies() : null

  if (!tokens) {
    return <ConnectGoogle configured={configured} />
  }

  return <CalendarApp />
}

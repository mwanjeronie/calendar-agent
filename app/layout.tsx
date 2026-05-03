import type { Metadata, Viewport } from "next"
import { Geist, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: "Calendar Agent",
  description: "An AI assistant that manages your Google Calendar through natural conversation.",
  generator: "v0.app",
  verification: {
    google: "A6xkxYAOvSrEI1xTkzc6d2rUN2kUXh80WaPIRTbo1iU",
  },
}

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${instrumentSerif.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors closeButton />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

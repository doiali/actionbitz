import "./globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'
import Providers from '@/components/app-providers'
import HotjarScript from '@/components/hotjar-script'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Actionbitz - Simple todo app with a journal of your actions",
  description:
    "Simple Todo app for busy individuals with lots of todos! Those who know plannig to do the thing is not doing the thing!",
  keywords: [
    "todo app",
    "task management",
    "Actionbitz",
    "productivity tools",
  ],
  openGraph: {
    title: "Actionbitz - Get Things Done, Bit by Bit",
    description:
      "Simple Todo app for busy individuals with lots of todos! Those who know plannig to do the thing is not doing the thing!",
    url: "https://actionbitz.com",
    siteName: "Actionbitz",
    images: [
      {
        url: "https://actionbitz.com/static/landing-cover.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "Actionbitz - Simple todo app with a journal of your actions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Actionbitz - Simple todo app with a journal of your actions",
    description:
      "Simple Todo app for busy individuals with lots of todos! Those who know plannig to do the thing is not doing the thing!",
    images: ["https://actionbitz.com/static/landing-cover.png"], // Replace with your actual image URL
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class" // dark | light
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              {children}
            </SessionProvider>
          </ThemeProvider>
        </Providers>
        <HotjarScript />
        <Analytics/>
        {process.env.NODE_ENV === 'production' && <Script async src="https://scripts.simpleanalyticscdn.com/latest.js" />}
      </body>
    </html>
  )
}

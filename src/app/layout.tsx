import "./globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'
import Providers from '@/components/app-providers'

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
  title: "ActionBitz - Get Things Done, Bitz by Bitz",
  description:
    "Take action and do what you gotta do. Track all your action bitz, bitz by bitz with ActionBitz. Level up 1% every single day!",
  keywords: [
    "todo app",
    "task management",
    "ActionBitz",
    "productivity tools",
  ],
  openGraph: {
    title: "ActionBitz - Get Things Done, Bit by Bit",
    description:
      "Take action and do what you gotta do. Track all your action bitz, bitz by bitz with ActionBitz. Level up 1% every single day",
    url: "https://actionbitz.com",
    siteName: "ActionBitz",
    images: [
      {
        url: "https://actionbitz.com/actionbitz.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "ActionBitz - Get Things Done, Bitz by Bitz",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ActionBitz - Get Things Done, Bitz by Bitz",
    description:
      "Take action and do what you gotta do. Track all your action bitz, bitz by bitz with ActionBitz. Level up 1% every single day!",
    images: ["https://actionbitz.com/actionbitz.png"], // Replace with your actual image URL
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
      </body>
    </html>
  )
}

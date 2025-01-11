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
  title: "Actionbitz - Get Things Done, bitz by bitz",
  description:
    "Take action and do what you gotta do. Track all your action bitz, bitz by bitz with Actionbitz. Level up 1% every single day!",
  keywords: [
    "todo app",
    "task management",
    "Actionbitz",
    "productivity tools",
  ],
  openGraph: {
    title: "Actionbitz - Get Things Done, Bit by Bit",
    description:
      "Take action and do what you gotta do. Track all your action bitz, bitz by bitz with Actionbitz. Level up 1% every single day",
    url: "https://actionbitz.com",
    siteName: "Actionbitz",
    images: [
      {
        url: "https://actionbitz.com/actionbitz.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "Actionbitz - Get Things Done, bitz by bitz",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Actionbitz - Get Things Done, bitz by bitz",
    description:
      "Take action and do what you gotta do. Track all your action bitz, bitz by bitz with Actionbitz. Level up 1% every single day!",
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

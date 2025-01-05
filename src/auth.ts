import NextAuth, { Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.findFirst({ where: { email } })
    return user || undefined
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isAPI = nextUrl.pathname.startsWith('/api/v1')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn && !isAPI) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
  },
  providers: [
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) return null
          const passwordsMatch = await bcrypt.compare(password, user.password || '')
          if (passwordsMatch) return user
        }
        return null
      },
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'a@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      }
    }),
  ],
})

type NextAuthenticatedRequest = NextRequest & {
  auth: Session & {
    user: Session['user'] & {
      id: string
    }
  }
}

type RouteHandlerFn = (
  req: NextAuthenticatedRequest,
  ctx: { params: Promise<Record<string, string | string[] | undefined>> }
) => unknown

export const withAuth = (fn: RouteHandlerFn) => {
  const handler = async (
    req: NextRequest,
    ctx: { params: Promise<Record<string, string | string[] | undefined>> }
  ) => {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).auth = session
    return fn(req as NextAuthenticatedRequest, ctx)
  }
  return handler
}
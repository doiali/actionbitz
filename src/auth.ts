import NextAuth, { Session } from 'next-auth'
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationRequest } from './lib/magic-link-request'
import seedUserTodos from './lib/seed-user'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    createUser: async ({ user }) => {
      await seedUserTodos(user)
    }
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
    Resend({
      from: "Actionbitz <no-reply@actionbitz.com>",
      sendVerificationRequest,
    })
  ],
})

type NextAuthenticatedRequest = NextRequest & {
  auth: Session & {
    user: Session['user'] & {
      id: string
    }
  }
}

export type RouteHandlerAuthFn<T extends Record<string, string | string[] | undefined>> = (
  req: NextAuthenticatedRequest,
  ctx: { params: Promise<T> }
) => Promise<Response>

export const withAuth = <Params extends Record<string, string | string[] | undefined>>(fn: RouteHandlerAuthFn<Params>) => {
  const handler = async (
    req: NextRequest,
    ctx: { params: Promise<Params> }
  ) => {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).auth = session
    try {
      return fn(req as NextAuthenticatedRequest, ctx)
    } catch (error) {
      console.error(error)
      return Response.json({ message: 'internal server error' }, { status: 500 })
    }
  }
  return handler
}
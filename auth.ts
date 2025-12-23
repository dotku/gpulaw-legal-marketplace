import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import type { UserRole, UserStatus } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      status: UserStatus
      locale: string
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    status: UserStatus
    locale: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
        session.user.status = user.status
        session.user.locale = user.locale
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Update last login time
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async createUser({ user }) {
      // Create a client profile by default for new users
      if (user.id) {
        await prisma.clientProfile.create({
          data: {
            userId: user.id,
            preferredLocale: user.locale || 'en',
          },
        })
      }
    },
  },
})

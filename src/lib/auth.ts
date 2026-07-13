import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        })

        // Auto-assign ADMIN role to specific email
        if (dbUser && dbUser.email === 'tathagatamandal68@gmail.com' && dbUser.role !== 'ADMIN') {
          dbUser = await prisma.user.update({
            where: { email: dbUser.email },
            data: { role: 'ADMIN' }
          })
        }

        if (dbUser) {
          token.id = dbUser.id
          // @ts-ignore
          token.role = dbUser.role
          // @ts-ignore
          token.department = dbUser.department
          // @ts-ignore
          token.phoneNumber = dbUser.phoneNumber
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id
        // @ts-ignore
        session.user.role = token.role
        // @ts-ignore
        session.user.department = token.department
        // @ts-ignore
        session.user.phoneNumber = token.phoneNumber
      }
      return session
    },
  },
}

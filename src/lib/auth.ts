import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = [
  'tathagatamandal68@gmail.com',
  'mamuhammed.2502405013@cukerala.ac.in',
  'nandana.2502405026@cukerala.ac.in',
  'amith.2500405002@cukerala.ac.in',
  'ashok.2500505030@cukerala.ac.in',
  'naja.2502405036@cukerala.ac.in',
  'tathagata.2500705021@cukerala.ac.in',
  'aryamithra.2502405028@cukerala.ac.in',
  'aiswarjinee.2501004039@cukerala.ac.in',
  'hiba.2500405008@cukerala.ac.in',
  'divyanshu.2502504008@cukerala.ac.in'
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  debug: true,
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
        if (dbUser && dbUser.email && ADMIN_EMAILS.includes(dbUser.email) && dbUser.role !== 'ADMIN') {
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

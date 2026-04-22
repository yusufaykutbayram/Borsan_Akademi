import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      tc_number: string;
      force_pw_change: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
    tc_number: string;
    force_pw_change: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    tc_number?: string;
    force_pw_change?: boolean;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Borsan Akademi",
      credentials: {
        name: { label: "Ad Soyad", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) {
          return null;
        }

        const users = await prisma.user.findMany({
          where: { name: credentials.name as string }
        });

        if (users.length === 0) return null;

        for (const user of users) {
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password_hash);
          if (isPasswordValid) {
            return {
              id: user.id,
              name: user.name,
              role: user.role,
              tc_number: user.tc_number,
              force_pw_change: user.force_pw_change
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tc_number = user.tc_number;
        token.force_pw_change = user.force_pw_change;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        if (token.tc_number) {
          session.user.tc_number = token.tc_number;
        }
        if (token.force_pw_change !== undefined) {
          session.user.force_pw_change = token.force_pw_change;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // To be created
  },
  session: { strategy: "jwt" }
})

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
      tc_number?: string | null;
      force_pw_change: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
    tc_number?: string | null;
    force_pw_change: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    tc_number?: string | null;
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
        console.log('Login attempt received:', credentials?.name);
        if (!credentials?.name || !credentials?.password) {
          console.log('Missing name or password');
          return null;
        }

        const users = await prisma.user.findMany({
          where: {
            OR: [
              { name: { equals: credentials.name as string, mode: 'insensitive' } },
              { tc_number: { equals: credentials.name as string, mode: 'insensitive' } },
              { sicil_no: { equals: credentials.name as string, mode: 'insensitive' } }
            ]
          }
        });

        console.log('Matching users found:', users.length);

        for (const user of users) {
          console.log('Comparing password for user:', user.name, 'TC:', user.tc_number);
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password_hash);
          console.log('Is password valid?', isPasswordValid);
          if (isPasswordValid) {
            console.log('Login success for user:', user.name);
            return {
              id: user.id,
              name: user.name,
              role: user.role,
              tc_number: user.tc_number || "",
              force_pw_change: user.force_pw_change
            };
          }
        }

        console.log('No valid user/password combination found');
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

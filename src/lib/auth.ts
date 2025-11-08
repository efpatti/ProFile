import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
 adapter: PrismaAdapter(prisma) as any,
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
  GitHubProvider({
   clientId: process.env.GITHUB_ID ?? "",
   clientSecret: process.env.GITHUB_SECRET ?? "",
  }),
  CredentialsProvider({
   name: "Credentials",
   credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
   },
   async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
     return null;
    }

    const user = await prisma.user.findUnique({
     where: { email: credentials.email },
    });

    if (!user || !user.password) {
     return null;
    }

    const isPasswordValid = await bcrypt.compare(
     credentials.password,
     user.password
    );

    if (!isPasswordValid) {
     return null;
    }

    return {
     id: user.id,
     email: user.email,
     name: user.name,
     image: user.image,
    };
   },
  }),
 ],
 callbacks: {
  async jwt({ token, user, account, trigger }) {
   if (user) {
    token.id = user.id;

    // Fetch user data including onboarding status
    const userData = await prisma.user.findUnique({
     where: { id: user.id },
     select: { hasCompletedOnboarding: true },
    });

    token.hasCompletedOnboarding = userData?.hasCompletedOnboarding ?? false;
   }

   // Refresh onboarding status on token refresh
   if (trigger === "update" && token.id) {
    const userData = await prisma.user.findUnique({
     where: { id: token.id as string },
     select: { hasCompletedOnboarding: true },
    });

    token.hasCompletedOnboarding = userData?.hasCompletedOnboarding ?? false;
   }

   if (account) {
    token.accessToken = account.access_token;
   }
   return token;
  },
  async session({ session, token }) {
   if (session.user) {
    session.user.id = token.id as string;
    session.user.hasCompletedOnboarding =
     token.hasCompletedOnboarding as boolean;
   }
   return session;
  },
 },
 pages: {
  signIn: "/auth/sign-in",
  signOut: "/auth/sign-out",
  error: "/auth/error",
  verifyRequest: "/auth/verify-request",
  newUser: "/onboarding",
 },
 session: {
  strategy: "jwt",
 },
 secret: process.env.NEXTAUTH_SECRET,
};

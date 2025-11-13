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
   console.log("[AUTH JWT] Callback triggered:", {
    trigger,
    userId: token.id || user?.id,
    currentHasCompletedOnboarding: token.hasCompletedOnboarding,
   });

   // Fresh login - always fetch from DB
   if (user) {
    token.id = user.id;

    const userData = await prisma.user.findUnique({
     where: { id: user.id },
     select: { hasCompletedOnboarding: true },
    });

    token.hasCompletedOnboarding = userData?.hasCompletedOnboarding ?? false;
    console.log(
     "[AUTH JWT] Fresh login - hasCompletedOnboarding:",
     token.hasCompletedOnboarding
    );
   }
   // Session update requested or token doesn't have the status - fetch from DB
   else if (
    trigger === "update" ||
    token.hasCompletedOnboarding === undefined
   ) {
    console.log("[AUTH JWT] Refreshing onboarding status for user:", token.id);
    const userData = await prisma.user.findUnique({
     where: { id: token.id as string },
     select: { hasCompletedOnboarding: true },
    });

    const newStatus = userData?.hasCompletedOnboarding ?? false;
    console.log("[AUTH JWT] Updated hasCompletedOnboarding:", newStatus);
    token.hasCompletedOnboarding = newStatus;
   }

   if (account) {
    token.accessToken = account.access_token;
   }

   console.log("[AUTH JWT] Final token state:", {
    hasCompletedOnboarding: token.hasCompletedOnboarding,
   });

   return token;
  },
  async session({ session, token }) {
   console.log("[AUTH SESSION] Building session:", {
    userId: token.id,
    hasCompletedOnboarding: token.hasCompletedOnboarding,
   });

   if (session.user) {
    session.user.id = token.id as string;
    session.user.hasCompletedOnboarding =
     token.hasCompletedOnboarding as boolean;
   }

   console.log("[AUTH SESSION] Final session:", {
    userId: session.user?.id,
    hasCompletedOnboarding: session.user?.hasCompletedOnboarding,
   });

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

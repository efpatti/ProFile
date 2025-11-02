import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

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
    // TODO: Implementar validação de credenciais
    // Por enquanto, retorna null (desabilitado)
    return null;
   },
  }),
 ],
 callbacks: {
  async jwt({ token, user, account }) {
   if (user) {
    token.id = user.id;
   }
   if (account) {
    token.accessToken = account.access_token;
   }
   return token;
  },
  async session({ session, token }) {
   if (session.user) {
    session.user.id = token.id as string;
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

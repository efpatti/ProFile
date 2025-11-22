import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const authOptions: NextAuthOptions = {
  // Note: OAuth providers still use database for account linking
  // For full backend-first architecture, consider removing OAuth or implementing
  // backend OAuth flow
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

        try {
          // Call backend API for authentication
          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.log('[AUTH] Login failed:', response.status);
            return null;
          }

          const data = await response.json();

          if (!data.success || !data.user) {
            return null;
          }

          // Return user data for NextAuth session
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.photoURL || null,
          };
        } catch (error) {
          console.error('[AUTH] Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("[AUTH JWT] Callback triggered:", {
        trigger,
        userId: token.id || user?.id,
        currentHasCompletedOnboarding: token.hasCompletedOnboarding,
      });

      // Fresh login - fetch onboarding status from backend
      if (user) {
        token.id = user.id;

        try {
          const response = await fetch(`${BACKEND_URL}/onboarding/status`, {
            headers: {
              'Authorization': `Bearer ${token.id}`, // Will need proper JWT token
            },
          });

          if (response.ok) {
            const data = await response.json();
            token.hasCompletedOnboarding = data.hasCompletedOnboarding ?? false;
          } else {
            token.hasCompletedOnboarding = false;
          }
        } catch (error) {
          console.error('[AUTH JWT] Error fetching onboarding status:', error);
          token.hasCompletedOnboarding = false;
        }

        console.log(
          "[AUTH JWT] Fresh login - hasCompletedOnboarding:",
          token.hasCompletedOnboarding
        );
      }
      // Session update requested or token doesn't have the status
      else if (
        trigger === "update" ||
        token.hasCompletedOnboarding === undefined
      ) {
        console.log("[AUTH JWT] Refreshing onboarding status for user:", token.id);

        try {
          const response = await fetch(`${BACKEND_URL}/onboarding/status`, {
            headers: {
              'Authorization': `Bearer ${token.id}`, // Will need proper JWT token
            },
          });

          if (response.ok) {
            const data = await response.json();
            token.hasCompletedOnboarding = data.hasCompletedOnboarding ?? false;
          } else {
            token.hasCompletedOnboarding = false;
          }
        } catch (error) {
          console.error('[AUTH JWT] Error refreshing onboarding status:', error);
        }

        console.log("[AUTH JWT] Updated hasCompletedOnboarding:", token.hasCompletedOnboarding);
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

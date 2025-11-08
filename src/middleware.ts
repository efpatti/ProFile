/**
 * Onboarding Middleware
 * Uncle Bob: "Clean code is simple and direct"
 * - Blocks access to /protected/* if user hasn't completed onboarding
 * - Redirects incomplete users to /onboarding
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = [
 "/",
 "/auth/sign-in",
 "/auth/sign-up",
 "/auth/signin", // Redirect route
 "/auth/signup", // Redirect route
 "/auth/error",
];
const ONBOARDING_ROUTE = "/onboarding";
const PROTECTED_PREFIX = "/protected";

export async function middleware(request: NextRequest) {
 const { pathname } = request.nextUrl;

 // 1. Allow public routes
 if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/api")) {
  return NextResponse.next();
 }

 // 2. Get auth token
 const token = await getToken({
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
 });

 // 3. If not authenticated, redirect to signin
 if (!token) {
  const url = new URL("/auth/sign-in", request.url);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
 }

 // 4. If on onboarding route, allow access
 if (pathname === ONBOARDING_ROUTE) {
  return NextResponse.next();
 }

 // 5. If trying to access protected routes, check onboarding completion
 if (pathname.startsWith(PROTECTED_PREFIX)) {
  const hasCompletedOnboarding = token.hasCompletedOnboarding as
   | boolean
   | undefined;

  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
   return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }
 }

 return NextResponse.next();
}

export const config = {
 matcher: [
  /*
   * Match all request paths except:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public files (public folder)
   */
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
 ],
};

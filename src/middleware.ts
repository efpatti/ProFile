/**
 * Middleware de Autenticação e Onboarding REFORÇADO
 *
 * REGRAS CRÍTICAS (500 MIL DÓLARES):
 * 1. Usuários não autenticados → /auth/sign-in
 * 2. Usuários autenticados SEM onboarding → /onboarding (BLOQUEIO TOTAL)
 * 3. Usuários com onboarding completo → Acesso liberado
 *
 * Uncle Bob: "The first rule of functions is that they should be small"
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rotas que NÃO requerem autenticação
const PUBLIC_ROUTES = [
 "/",
 "/auth/sign-in",
 "/auth/sign-up",
 "/auth/signin",
 "/auth/signup",
 "/auth/error",
];

const ONBOARDING_ROUTE = "/onboarding";
const SIGNIN_ROUTE = "/auth/sign-in";

export async function middleware(request: NextRequest) {
 const { pathname } = request.nextUrl;

 console.log("[MIDDLEWARE] =================================");
 console.log("[MIDDLEWARE] Path:", pathname);

 // 1. Allow static files and API routes (except protected APIs)
 if (
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api/auth") ||
  pathname.startsWith("/api/health") ||
  pathname.startsWith("/api/onboarding") || // permitir completar onboarding
  pathname.startsWith("/api/user") || // permitir user preferences e settings
  pathname.startsWith("/api/resume") || // permitir resume operations
  pathname.startsWith("/api/export") || // permitir exports
  pathname.includes(".") // arquivos estáticos
 ) {
  console.log("[MIDDLEWARE] Static/API route, allowing");
  return NextResponse.next();
 }

 // 2. Allow public routes
 if (PUBLIC_ROUTES.includes(pathname)) {
  console.log("[MIDDLEWARE] Public route, allowing");
  return NextResponse.next();
 }

 // 3. Get auth token
 const token = await getToken({
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
 });

 console.log("[MIDDLEWARE] Token exists:", !!token);
 console.log(
  "[MIDDLEWARE] Has completed onboarding:",
  token?.hasCompletedOnboarding
 );

 // 4. If not authenticated → sign-in
 if (!token) {
  console.log("[MIDDLEWARE] ❌ NOT AUTHENTICATED → Redirecting to sign-in");
  const url = new URL(SIGNIN_ROUTE, request.url);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
 }

 // 5. If on onboarding route, always allow (authenticated users can access onboarding)
 if (pathname === ONBOARDING_ROUTE) {
  console.log("[MIDDLEWARE] ✅ Onboarding route, allowing");
  return NextResponse.next();
 }

 // 6. CRITICAL: If onboarding NOT completed → FORCE to onboarding
 const hasCompletedOnboarding = token.hasCompletedOnboarding as
  | boolean
  | undefined;

 if (!hasCompletedOnboarding) {
  console.log("[MIDDLEWARE] ⛔ ONBOARDING INCOMPLETE → FORCING to /onboarding");
  return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
 }

 // 7. All checks passed, allow access
 console.log("[MIDDLEWARE] ✅ AUTHORIZED → Allowing access");
 return NextResponse.next();
}

export const config = {
 matcher: [
  /*
   * Match all request paths except:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public files with extensions
   */
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
 ],
};

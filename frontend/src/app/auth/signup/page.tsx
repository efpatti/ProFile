/**
 * Redirect route: /auth/signup → /auth/sign-up
 * NextAuth uses /signup by default, this redirects to our hyphenated route
 */
import { redirect } from "next/navigation";

export default async function SignUpRedirect({
 searchParams,
}: {
 searchParams?: Promise<{ callbackUrl?: string | string[] }>;
}) {
 const resolvedParams = (await searchParams) ?? {};
 const callbackParam = resolvedParams.callbackUrl;
 const callbackUrl = Array.isArray(callbackParam)
  ? callbackParam[0]
  : callbackParam || "/onboarding";
 redirect(`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

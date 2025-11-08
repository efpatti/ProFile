/**
 * Redirect route: /auth/signin → /auth/sign-in
 * NextAuth uses /signin by default, this redirects to our hyphenated route
 */
import { redirect } from "next/navigation";

export default async function SignInRedirect({
 searchParams,
}: {
 searchParams?: Promise<{ callbackUrl?: string | string[] }>;
}) {
 const resolvedParams = (await searchParams) ?? {};
 const callbackParam = resolvedParams.callbackUrl;
 const callbackUrl = Array.isArray(callbackParam)
  ? callbackParam[0]
  : callbackParam || "/protected/resume";
 redirect(`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Force session refresh endpoint
 * Used after onboarding completion to update JWT token with new hasCompletedOnboarding status
 */
export async function POST(request: NextRequest) {
 try {
  console.log("[REFRESH-SESSION] Fetching current session...");

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
   console.error("[REFRESH-SESSION] No session found");
   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  console.log("[REFRESH-SESSION] Session found for:", session.user.email);
  console.log(
   "[REFRESH-SESSION] Current hasCompletedOnboarding:",
   session.user.hasCompletedOnboarding
  );

  // The session is automatically refreshed when we call getServerSession
  // Return the updated session
  return NextResponse.json({
   success: true,
   hasCompletedOnboarding: session.user.hasCompletedOnboarding,
   message: "Session refreshed successfully",
  });
 } catch (error) {
  console.error("[REFRESH-SESSION] Error:", error);
  return NextResponse.json(
   { error: "Failed to refresh session" },
   { status: 500 }
  );
 }
}

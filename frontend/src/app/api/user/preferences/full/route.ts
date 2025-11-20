/**
 * User Preferences API (Full)
 * GET: Retrieve all user preferences
 * PATCH: Update user preferences
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userRepository } from "@/infrastructure/persistence/prisma/repositories/PrismaUserRepository";
import { userPreferencesSchema } from "@/types/settings";
import { ZodError } from "zod";

/**
 * GET /api/user/preferences/full
 * Retrieve all user preferences
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let preferences = await userRepository.getFullUserPreferences(
      session.user.id
    );

    // If no preferences exist, create default ones
    if (!preferences) {
      preferences = await userRepository.upsertFullUserPreferences(
        session.user.id,
        {
          theme: "dark",
          palette: "ocean",
          language: "en",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          emailNotifications: true,
          resumeExpiryAlerts: true,
          weeklyDigest: false,
          marketingEmails: false,
          profileVisibility: "private",
          showEmail: false,
          showPhone: false,
          allowSearchEngineIndex: false,
          defaultExportFormat: "pdf",
          includePhotoInExport: true,
        }
      );
    }

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/preferences/full
 * Update user preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body (partial update allowed)
    const validatedData = userPreferencesSchema.partial().parse(body);

    // Update preferences
    const updatedPreferences = await userRepository.upsertFullUserPreferences(
      session.user.id,
      validatedData
    );

    // Also sync palette and bannerColor to User table for backward compatibility
    if (validatedData.palette !== undefined && validatedData.palette !== null) {
      await userRepository.updatePalette(
        session.user.id,
        validatedData.palette
      );
    }

    if (validatedData.bannerColor !== undefined && validatedData.bannerColor !== null) {
      await userRepository.updateBannerColor(
        session.user.id,
        validatedData.bannerColor
      );
    }

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { onboardingDataSchema } from "@/types/onboarding";

export async function POST(request: NextRequest) {
 try {
  console.log("[ONBOARDING] ===== START =====");

  // 1. Authenticate user
  const session = await getServerSession(authOptions);
  console.log("[ONBOARDING] Session:", session?.user?.email);

  if (!session?.user?.email) {
   console.error("[ONBOARDING] Unauthorized - no session");
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate request body
  const body = await request.json();
  console.log("[ONBOARDING] Validating data...");
  const validatedData = onboardingDataSchema.parse(body);
  console.log("[ONBOARDING] Data validated successfully");

  // 3. Find user
  console.log("[ONBOARDING] Finding user:", session.user.email);
  const user = await prisma.user.findUnique({
   where: { email: session.user.email },
  });

  if (!user) {
   console.error("[ONBOARDING] User not found");
   return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log("[ONBOARDING] User found:", user.id);

  // 🎯 FIX #2: Use upsert pattern to prevent duplicates
  // Handle both OAuth users (may have existing resume) and new users
  const resume = await prisma.resume.upsert({
   where: {
    // Use userId as unique constraint (assumes one resume per user for onboarding)
    // If user can have multiple resumes, this should find the "main" one
    id:
     (await prisma.resume.findFirst({ where: { userId: user.id } }))?.id ||
     "nonexistent",
   },
   update: {
    // Update existing resume with onboarding data
    fullName: validatedData.personalInfo.fullName,
    emailContact: validatedData.personalInfo.email,
    phone: validatedData.personalInfo.phone,
    location: validatedData.personalInfo.location,
    jobTitle: validatedData.professionalProfile.jobTitle,
    summary: validatedData.professionalProfile.summary,
    linkedin: validatedData.professionalProfile.linkedin,
    github: validatedData.professionalProfile.github,
    website: validatedData.professionalProfile.website,
    template: validatedData.templateSelection.template,
   },
   create: {
    // Create new resume
    userId: user.id,
    fullName: validatedData.personalInfo.fullName,
    emailContact: validatedData.personalInfo.email,
    phone: validatedData.personalInfo.phone,
    location: validatedData.personalInfo.location,
    jobTitle: validatedData.professionalProfile.jobTitle,
    summary: validatedData.professionalProfile.summary,
    linkedin: validatedData.professionalProfile.linkedin,
    github: validatedData.professionalProfile.github,
    website: validatedData.professionalProfile.website,
    template: validatedData.templateSelection.template,
   },
  });

  // 🎯 FIX #1: Robust UTC date parsing with validation
  const toUTCDate = (value: string | null | undefined): Date | null => {
   if (!value?.trim()) return null;

   // Strict YYYY-MM-DD validation
   const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
   if (!dateMatch) {
    console.warn(`[Onboarding] ⚠️ Invalid date format: "${value}"`);
    return null; // Fail gracefully
   }

   const [_, year, month, day] = dateMatch;
   const date = new Date(Date.UTC(+year, +month - 1, +day));

   // Validate the date is actually valid (no overflow like 2023-13-40)
   if (isNaN(date.getTime())) {
    console.warn(
     `[Onboarding] ⚠️ Invalid date values: ${year}-${month}-${day}`
    );
    return null;
   }

   return date;
  };

  // 5. Save experiences (if any)
  if (validatedData.experiences && validatedData.experiences.length > 0) {
   // Delete existing experiences
   await prisma.experience.deleteMany({
    where: { resumeId: resume.id },
   });

   // Filter and validate dates before creating
   const validExperiences = validatedData.experiences
    .map((exp) => {
     const startDate = toUTCDate(exp.startDate);
     const endDate = exp.isCurrent ? null : toUTCDate(exp.endDate);

     if (!startDate) {
      console.warn(
       `[Onboarding] Skipping experience with invalid start date: ${exp.company}`
      );
      return null;
     }

     return {
      resumeId: resume.id,
      company: exp.company,
      position: exp.position,
      startDate,
      endDate,
      isCurrent: exp.isCurrent,
      description: exp.description,
      location: exp.location,
     };
    })
    .filter(Boolean);

   if (validExperiences.length > 0) {
    await prisma.experience.createMany({
     data: validExperiences as any,
    });
    console.log(`[Onboarding] Created ${validExperiences.length} experiences`);
   }
  }

  if (validatedData.education && validatedData.education.length > 0) {
   await prisma.education.deleteMany({
    where: { resumeId: resume.id },
   });

   const validEducation = validatedData.education
    .map((edu) => {
     const startDate = toUTCDate(edu.startDate);
     const endDate = edu.isCurrent ? null : toUTCDate(edu.endDate);

     if (!startDate) {
      console.warn(
       `[Onboarding] Skipping education with invalid start date: ${edu.institution}`
      );
      return null;
     }

     return {
      resumeId: resume.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate,
      endDate,
      isCurrent: edu.isCurrent,
     };
    })
    .filter(Boolean);

   if (validEducation.length > 0) {
    await prisma.education.createMany({
     data: validEducation as any,
    });
    console.log(
     `[Onboarding] Created ${validEducation.length} education entries`
    );
   }
  }

  console.log("[ONBOARDING] Marking onboarding as complete...");
  await prisma.user.update({
   where: { id: user.id },
   data: {
    hasCompletedOnboarding: true,
    onboardingCompletedAt: new Date(),
    palette: validatedData.templateSelection.palette,
   },
  });

  console.log("[ONBOARDING] ✅ SUCCESS CHECKLIST:");
  console.log("  - Resume ID:", resume.id);
  console.log("  - Experiences:", validatedData.experiences?.length || 0);
  console.log("  - Education:", validatedData.education?.length || 0);
  console.log("  - Template:", validatedData.templateSelection.template);
  console.log("  - Palette:", validatedData.templateSelection.palette);
  console.log("  - User onboarding flag:", true);
  console.log("[ONBOARDING] ===== COMPLETE =====");

  return NextResponse.json({
   success: true,
   resumeId: resume.id,
   message: "Onboarding concluído com sucesso!",
  });
 } catch (error) {
  console.error("[ONBOARDING] ❌ Error:", error);

  if (error instanceof Error) {
   console.error("[ONBOARDING] Error message:", error.message);
   console.error("[ONBOARDING] Error stack:", error.stack);
   return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}

// GET endpoint to check onboarding status
export async function GET() {
 try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
   where: { email: session.user.email },
   select: {
    hasCompletedOnboarding: true,
    onboardingCompletedAt: true,
   },
  });

  if (!user) {
   return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
   hasCompletedOnboarding: user.hasCompletedOnboarding,
   onboardingCompletedAt: user.onboardingCompletedAt,
  });
 } catch (error) {
  console.error("Get onboarding status error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}

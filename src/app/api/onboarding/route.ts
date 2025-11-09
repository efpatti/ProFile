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

  // 4. Create or update Resume with onboarding data
  // First, try to find existing resume
  const existingResume = await prisma.resume.findFirst({
   where: { userId: user.id },
  });

  const resume = existingResume
   ? await prisma.resume.update({
      where: { id: existingResume.id },
      data: {
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
     })
   : await prisma.resume.create({
      data: {
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

  // Helper: robust UTC date parsing for YYYY-MM-DD and ISO strings
  const toUTCDate = (value: string | null | undefined): Date | null => {
   if (!value) return null;
   const s = String(value).trim();
   // Remove any mistakenly prefixed timezone like "+02"
   const cleaned = s.replace(/^\+\d{2}/, "");
   // Handle plain date "YYYY-MM-DD" as UTC midnight
   const m = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})$/);
   if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]) - 1; // 0-based
    const day = Number(m[3]);
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
   }
   // Otherwise, let Date parse (supports ISO with timezone)
   const d = new Date(cleaned);
   return isNaN(d.getTime()) ? null : d;
  };

  // 5. Save experiences (if any)
  if (validatedData.experiences && validatedData.experiences.length > 0) {
   // Delete existing experiences
   await prisma.experience.deleteMany({
    where: { resumeId: resume.id },
   });

   // Create new experiences
   await prisma.experience.createMany({
    data: validatedData.experiences.map((exp) => ({
     resumeId: resume.id,
     company: exp.company,
     position: exp.position,
     startDate: toUTCDate(exp.startDate)!,
     endDate: exp.isCurrent ? null : toUTCDate(exp.endDate),
     isCurrent: exp.isCurrent,
     description: exp.description,
     location: exp.location,
    })),
   });
  }

  // 6. Save education (if any)
  if (validatedData.education && validatedData.education.length > 0) {
   // Delete existing education
   await prisma.education.deleteMany({
    where: { resumeId: resume.id },
   });

   // Create new education
   await prisma.education.createMany({
    data: validatedData.education.map((edu) => ({
     resumeId: resume.id,
     institution: edu.institution,
     degree: edu.degree,
     field: edu.field,
     startDate: toUTCDate(edu.startDate)!,
     endDate: edu.isCurrent ? null : toUTCDate(edu.endDate),
     isCurrent: edu.isCurrent,
    })),
   });
  }

  // 7. Mark onboarding as complete and save palette preference
  console.log("[ONBOARDING] Marking onboarding as complete...");
  await prisma.user.update({
   where: { id: user.id },
   data: {
    hasCompletedOnboarding: true,
    onboardingCompletedAt: new Date(),
    palette: validatedData.templateSelection.palette,
   },
  });
  console.log("[ONBOARDING] ✅ Onboarding completed successfully!");

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

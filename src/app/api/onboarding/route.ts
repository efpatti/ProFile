/**
 * Onboarding API Route
 * Uncle Bob: "Functions should do one thing. They should do it well. They should do it only."
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { onboardingDataSchema } from "@/types/onboarding";

export async function POST(request: NextRequest) {
 try {
  // 1. Authenticate user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate request body
  const body = await request.json();
  const validatedData = onboardingDataSchema.parse(body);

  // 3. Find user
  const user = await prisma.user.findUnique({
   where: { email: session.user.email },
  });

  if (!user) {
   return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

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
     startDate: new Date(exp.startDate),
     endDate: exp.endDate ? new Date(exp.endDate) : null,
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
     startDate: new Date(edu.startDate),
     endDate: edu.endDate ? new Date(edu.endDate) : null,
     isCurrent: edu.isCurrent,
    })),
   });
  }

  // 7. Mark onboarding as complete and save palette preference
  await prisma.user.update({
   where: { id: user.id },
   data: {
    hasCompletedOnboarding: true,
    onboardingCompletedAt: new Date(),
    palette: validatedData.templateSelection.palette,
   },
  });

  return NextResponse.json({
   success: true,
   resumeId: resume.id,
   message: "Onboarding concluído com sucesso!",
  });
 } catch (error) {
  console.error("Onboarding error:", error);

  if (error instanceof Error) {
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

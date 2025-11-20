import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const resume = await prisma.resume.create({
   data: {
    userId: session.user.id,
    ...data,
   },
  });

  return NextResponse.json(resume, { status: 201 });
 } catch (error) {
  console.error("Erro ao criar currículo:", error);
  return NextResponse.json(
   {
    error: error instanceof Error ? error.message : "Erro ao criar currículo",
   },
   { status: 400 }
  );
 }
}
export async function GET() {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
   where: { userId: session.user.id },
   orderBy: { updatedAt: "desc" },
   include: {
    skills: {
     orderBy: { order: "asc" },
    },
    experiences: {
     orderBy: { startDate: "desc" },
    },
    education: {
     orderBy: { startDate: "desc" },
    },
    languages: {
     orderBy: { order: "asc" },
    },
    projects: {
     orderBy: { startDate: "desc" },
    },
    certifications: {
     orderBy: { issueDate: "desc" },
    },
    awards: {
     orderBy: { date: "desc" },
    },
    recommendations: true,
    interests: true,
   },
  });

  // Transform the data to match the expected format
  const transformedResumes = resumes.map((resume) => ({
   ...resume,
   header: {
    name: resume.fullName || "",
    title: resume.jobTitle || "",
    email: resume.emailContact || "",
   },
   profile: {
    bio: resume.summary,
    location: resume.location,
    phone: resume.phone,
    website: resume.website,
    linkedin: resume.linkedin,
    github: resume.github,
   },
   skills: resume.skills || [],
   experiences:
    resume.experiences?.map((exp) => ({
     id: exp.id,
     company: exp.company,
     role: exp.position,
     startDate: exp.startDate?.toISOString().split("T")[0] || "",
     endDate: exp.endDate?.toISOString().split("T")[0] || null,
     isCurrentJob: exp.isCurrent || false,
     technologies: [],
     description: exp.description,
    })) || [],
   education:
    resume.education?.map((edu) => ({
     id: edu.id,
     institution: edu.institution,
     degree: edu.degree,
     field: edu.field,
     startDate: edu.startDate?.toISOString().split("T")[0] || "",
     endDate: edu.endDate?.toISOString().split("T")[0] || null,
     description: undefined,
    })) || [],
   languages: resume.languages?.map((lang) => lang.name) || [],
   projects: resume.projects || [],
   certifications: resume.certifications || [],
   awards: resume.awards || [],
   recommendations: resume.recommendations || [],
   interests: resume.interests?.[0] || { items: [] },
  }));

  return NextResponse.json({ resumes: transformedResumes });
 } catch (error) {
  console.error("Erro ao listar currículos:", error);
  return NextResponse.json(
   { error: "Erro ao listar currículos" },
   { status: 500 }
  );
 }
}

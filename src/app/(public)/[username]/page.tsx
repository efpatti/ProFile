import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PublicResumeViewer } from "@/presentation/components/resume/PublicResumeViewer";

const prisma = new PrismaClient();

interface Props {
 params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { username } = await params;

 // Buscar usuário pelo username
 const user = await prisma.user.findUnique({
  where: { username },
  include: {
   resumes: {
    where: { isPublic: true },
    take: 1,
   },
  },
 });

 if (!user || user.resumes.length === 0) {
  return {
   title: "Currículo não encontrado - ProFile",
  };
 }

 const resume = user.resumes[0];

 return {
  title: `${resume.fullName || user.name} - Currículo Profissional | ProFile`,
  description: resume.summary?.slice(0, 160) || "",
  openGraph: {
   title: resume.fullName || user.name || "",
   description: resume.jobTitle || "",
   type: "profile",
  },
  twitter: {
   card: "summary_large_image",
   title: resume.fullName || user.name || "",
   description: resume.jobTitle || "",
  },
 };
}

export default async function PublicResumePage({ params }: Props) {
 const { username } = await params;

 const user = await prisma.user.findUnique({
  where: { username },
  include: {
   resumes: {
    where: { isPublic: true },
    take: 1,
   },
  },
 });

 if (!user || user.resumes.length === 0) {
  notFound();
 }

 const resume = user.resumes[0];
 return <PublicResumeViewer resume={resume as any} />;
}

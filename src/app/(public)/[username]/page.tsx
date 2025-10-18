import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FirebaseResumeRepository } from "@/infrastructure/repositories/FirebaseResumeRepository";
import { PublicResumeViewer } from "@/presentation/components/resume/PublicResumeViewer";

const repository = new FirebaseResumeRepository();

interface Props {
 params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { username } = await params;
 const resume = await repository.findByUsername(username);

 if (!resume) {
  return {
   title: "Currículo não encontrado - ProFile",
  };
 }

 return {
  title: `${resume.fullName} - Currículo Profissional | ProFile`,
  description: resume.summary.slice(0, 160),
  openGraph: {
   title: resume.fullName,
   description: resume.headline,
   images: resume.linkedInBannerUrl ? [resume.linkedInBannerUrl] : [],
   type: "profile",
  },
  twitter: {
   card: "summary_large_image",
   title: resume.fullName,
   description: resume.headline,
   images: resume.linkedInBannerUrl ? [resume.linkedInBannerUrl] : [],
  },
 };
}

export default async function PublicResumePage({ params }: Props) {
 const { username } = await params;
 const resume = await repository.findByUsername(username);

 if (!resume) {
  notFound();
 }

 return <PublicResumeViewer resume={resume} />;
}

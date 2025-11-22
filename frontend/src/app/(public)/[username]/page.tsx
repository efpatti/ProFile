import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicResumeViewer } from "@/presentation/components/resume/PublicResumeViewer";

interface Props {
  params: Promise<{ username: string }>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// TODO: Backend needs to implement this endpoint:
// GET /api/public/resume/:username
// Response: { user: {...}, resume: {...} } or 404
async function fetchPublicResume(username: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/public/resume/${username}`, {
      cache: 'no-store', // or use Next.js revalidation
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[PUBLIC RESUME] Error fetching resume:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const data = await fetchPublicResume(username);

  if (!data || !data.resume) {
    return {
      title: "Currículo não encontrado - ProFile",
    };
  }

  const { user, resume } = data;

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

  const data = await fetchPublicResume(username);

  if (!data || !data.resume) {
    notFound();
  }

  return <PublicResumeViewer resume={data.resume as any} />;
}

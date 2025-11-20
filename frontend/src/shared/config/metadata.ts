import type { Metadata } from "next";

export const siteMetadata: Metadata = {
 title: "ProFile – Developer Profile & Banner Builder",
 description:
  "Create, preview and export professional developer banners and resumes.",
 applicationName: "ProFile",
 keywords: [
  "profile banner",
  "developer resume",
  "pdf export",
  "nextjs",
  "tailwind",
  "prisma",
  "postgresql",
 ],
 authors: [{ name: "ProFile" }],
 openGraph: {
  title: "ProFile – Build developer banners & resumes",
  description:
   "Create, preview and export professional developer banners and resumes.",
  type: "website",
 },
 icons: {
  icon: "/favicon.ico",
 },
};

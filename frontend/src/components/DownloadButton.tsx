// components/DownloadButton.tsx
"use client";

import { useState } from "react";
import { usePalette } from "@/styles/pallete_provider";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoDownload as DownloadIcon } from "react-icons/go";
import { useAuth } from "@/core/services/AuthProvider";

export const DownloadButton = ({
 logoUrl,
 selectedBg,
 type = "banner",
 lang,
}: {
 logoUrl?: string;
 selectedBg: BgBannerColorName;
 type?: "banner" | "resume";
 lang?: string;
}) => {
 const { palette } = usePalette();
 const { user } = useAuth();
 const [loading, setLoading] = useState(false);

 if (!palette) return null;

 const handleDownload = async () => {
  setLoading(true);
  const params = new URLSearchParams({ palette });
  if (logoUrl) params.append("logo", logoUrl);
  if (type === "resume" && lang) params.append("lang", lang);
  if (type === "resume" && selectedBg) params.append("bannerColor", selectedBg);
  if (type === "resume" && user?.uid) params.append("user", user.uid);
  const endpoint =
   type === "resume" ? "/api/download-resume" : "/api/download-banner";
  const res = await fetch(`${endpoint}?${params.toString()}`);
  if (!res.ok) {
   setLoading(false);
   alert("Download failed: " + (await res.text()));
   return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = type === "resume" ? "resume.pdf" : "linkedin-banner.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  setLoading(false);
 };

 return (
  <FloatingActionButton
   icon={<DownloadIcon />}
   selectedBg={selectedBg}
   onClick={handleDownload}
   tooltipText="Download"
   className={loading ? "opacity-50 cursor-not-allowed" : ""}
  />
 );
};

// components/DownloadButton.tsx
"use client";

import { useState } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoDownload as DownloadIcon } from "react-icons/go";

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
 const [loading, setLoading] = useState(false);

 if (!palette) return null;

 const handleDownload = async () => {
  setLoading(true);
  console.log("[DownloadButton] palette enviado para download:", palette);
  const params = new URLSearchParams({ palette });
  if (logoUrl) params.append("logo", logoUrl);
  if (type === "resume" && lang) params.append("lang", lang);
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

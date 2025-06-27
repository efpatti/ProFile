// components/DownloadBannerButton.tsx
"use client";

import { useState } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoDownload as DownloadIcon } from "react-icons/go";

export const DownloadBannerButton = ({
 logoUrl,
 selectedBg,
}: {
 logoUrl?: string;
 selectedBg: BgBannerColorName;
}) => {
 const { palette } = usePalette();
 const [loading, setLoading] = useState(false);

 const handleDownload = async () => {
  setLoading(true);
  const params = new URLSearchParams({ palette });
  if (logoUrl) params.append("logo", logoUrl);
  const res = await fetch(`/api/download-banner?${params.toString()}`);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "linkedin-banner.png";
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

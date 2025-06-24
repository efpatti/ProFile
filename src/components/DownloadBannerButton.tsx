import React, { useState } from "react";
import { usePalette } from "@/styles/PaletteProvider";

interface DownloadBannerButtonProps {
 logoUrl?: string;
}

export const DownloadBannerButton: React.FC<DownloadBannerButtonProps> = ({
 logoUrl,
}) => {
 const { palette } = usePalette();
 const [loading, setLoading] = useState(false);

 const handleDownload = async () => {
  setLoading(true);
  const params = new URLSearchParams({ palette });
  // Envie a URL completa da logo para a API
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
  <button
   onClick={handleDownload}
   className="mt-4 mb-2 px-6 py-2 rounded-lg bg-accent text-white font-semibold transition disabled:opacity-50"
   disabled={loading}
  >
   {loading ? "Gerando..." : "Download Banner (Puppeteer)"}
  </button>
 );
};

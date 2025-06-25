import React, { useState } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

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
  <motion.button
   onClick={handleDownload}
   disabled={loading}
   className="relative p-2 rounded-full bg-white shadow-lg hover:shadow-xl focus:outline-none"
   whileHover={{ scale: 1.1 }}
   whileTap={{ scale: 0.95 }}
   initial={{ opacity: 0.7 }}
   animate={{ opacity: 1 }}
   transition={{ type: "spring", stiffness: 300 }}
  >
   <FaDownload className="w-6 h-6 text-gray-800" />
  </motion.button>
 );
};

import type { NextApiRequest, NextApiResponse } from "next";
import { PuppeteerService } from "@/core/services/PuppeteerService";
import { BannerService } from "@/core/services/BannerService";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 try {
  const palette = (req.query.palette as string) || "darkGreen";
  const lang = (req.query.lang as string) || "pt-br";
  const bannerColor = (req.query.bannerColor as string) || undefined;
  const userId = (req.query.user as string) || undefined;
  console.log("[API] palette recebido:", palette, "bannerColor:", bannerColor);
  // Adicione outros parâmetros se necessário
  const buffer = await PuppeteerService.captureResumePDF(
   palette,
   lang,
   bannerColor,
   userId
  );
  if (!buffer || buffer.length < 1000) {
   res.status(500).json({
    error: "Resume PDF generation failed (empty or invalid buffer)",
   });
   return;
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  res.status(200).send(buffer);
 } catch (err) {
  console.error("Error generating resume PDF:", err);
  res.status(500).json({ error: "Failed to generate resume PDF" });
 }
}

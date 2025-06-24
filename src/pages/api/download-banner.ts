import type { NextApiRequest, NextApiResponse } from "next";
import { PuppeteerService } from "@/core/services/PuppeteerService";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 try {
  const palette = (req.query.palette as string) || "darkGreen";
  const logo = (req.query.logo as string) || "";
  const buffer = await PuppeteerService.captureBanner(palette, logo);
  console.log("[download-banner] Buffer length:", buffer?.length);
  if (!buffer || buffer.length < 1000) {
   console.error(
    "[download-banner] Invalid or empty buffer returned by Puppeteer"
   );
   res.status(500).json({
    error: "Banner image generation failed (empty or invalid buffer)",
   });
   return;
  }
  res.setHeader("Content-Type", "image/png");
  res.setHeader(
   "Content-Disposition",
   "attachment; filename=linkedin-banner.png"
  );
  res.status(200).send(buffer);
 } catch (err) {
  console.error("Error generating banner:", err);
  res.status(500).json({ error: "Failed to generate banner" });
 }
}

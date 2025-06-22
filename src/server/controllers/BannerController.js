import { PuppeteerService } from "../services/PuppeteerService.js";

export class BannerController {
 static async download(req, res) {
  try {
   const buffer = await PuppeteerService.captureBanner();
   res.setHeader("Content-Type", "image/png");
   res.setHeader(
    "Content-Disposition",
    "attachment; filename=linkedin-banner.png"
   );
   res.send(buffer);
  } catch (err) {
   console.error("Error generating banner:", err);
   res.status(500).json({ error: "Failed to generate banner" });
  }
 }
}

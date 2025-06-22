#!/usr/bin/env node
import { PuppeteerService } from "../server/services/PuppeteerService.js";
import fs from "fs";

(async () => {
 try {
  const buffer = await PuppeteerService.captureBanner();
  fs.writeFileSync("linkedin-banner.png", buffer);
  console.log("Banner generated successfully!");
 } catch (error) {
  console.error("Error generating banner:", error);
  process.exit(1);
 }
})();

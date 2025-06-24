import { NextRequest, NextResponse } from "next/server";
import { PuppeteerService } from "@/core/services/PuppeteerService";

export async function GET(req: NextRequest) {
 try {
  const { searchParams } = new URL(req.url);
  const palette = searchParams.get("palette") || "darkGreen";
  const logo = searchParams.get("logo") || "";
  const buffer = await PuppeteerService.captureBanner(palette, logo);
  return new NextResponse(buffer, {
   status: 200,
   headers: {
    "Content-Type": "image/png",
    "Content-Disposition": "attachment; filename=linkedin-banner.png",
   },
  });
 } catch (err) {
  console.error("Error generating banner:", err);
  return NextResponse.json(
   { error: "Failed to generate banner" },
   { status: 500 }
  );
 }
}

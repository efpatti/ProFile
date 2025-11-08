import { NextRequest, NextResponse } from "next/server";
import {
 PuppeteerService,
 closeBrowser,
} from "@/core/services/PuppeteerService";

export const runtime = "nodejs"; // ensure node runtime for puppeteer

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
 const palette = searchParams.get("palette") || undefined;
 const logo = searchParams.get("logo") || undefined;
 try {
  const buffer = await PuppeteerService.captureBanner(palette, logo);
  // Cast Buffer to BodyInit to satisfy TS
  return new NextResponse(buffer as unknown as BodyInit, {
   status: 200,
   headers: {
    "Content-Type": "image/png",
    "Content-Disposition": "inline; filename=banner.png",
    "Cache-Control": "no-store",
   },
  });
 } catch (e) {
  return NextResponse.json(
   { error: "Failed to export banner" },
   { status: 500 }
  );
 } finally {
  await closeBrowser();
 }
}

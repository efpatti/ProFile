import { NextRequest, NextResponse } from "next/server";
import {
 PuppeteerService,
 closeBrowser,
} from "@/core/services/PuppeteerService";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
 const palette = searchParams.get("palette") || undefined;
 const lang = searchParams.get("lang") || undefined;
 const bannerColor = searchParams.get("bannerColor") || undefined;
 const user = searchParams.get("user") || undefined;
 try {
  const buffer = await PuppeteerService.captureResumePDF(
   palette,
   lang,
   bannerColor,
   user
  );
  // Cast Buffer to BodyInit to satisfy TS (runtime supports Buffer)
  return new NextResponse(buffer as unknown as BodyInit, {
   status: 200,
   headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline; filename=resume.pdf",
    "Cache-Control": "no-store",
   },
  });
 } catch (e) {
  return NextResponse.json(
   { error: "Failed to export resume" },
   { status: 500 }
  );
 } finally {
  await closeBrowser();
 }
}

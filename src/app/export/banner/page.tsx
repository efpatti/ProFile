"use client";

import { Banner } from "../../../components/Banner";
import { useSearchParams } from "next/navigation";
import { BgBannerColorName } from "../../../styles/sharedStyleConstants";

export default function BannerExport() {
 const searchParams = useSearchParams();
 const palette =
  (searchParams?.get("palette") as BgBannerColorName) || "midnightSlate";
 const logo = searchParams?.get("logo") || undefined;
 const name = searchParams?.get("name") || "Seu Nome";

 return (
  <div
   style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9fafb",
    margin: 0,
    padding: 0,
   }}
  >
   <Banner selectedBg={palette} logoUrl={logo} />
  </div>
 );
}

import { siteMetadata } from "@/shared/config/metadata";
import { inter, manrope, jetbrains } from "@/shared/config/fonts";
import "./globals.css";
import { AppProviders } from "@/shared/providers/root_provider";
import Navbar from "@/components/Navbar";

export const metadata = siteMetadata;

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html
   lang="en"
   className={`${inter.variable} ${manrope.variable} ${jetbrains.variable}`}
  >
   <body>
    <AppProviders>
     <Navbar />
     {children}
    </AppProviders>
   </body>
  </html>
 );
}

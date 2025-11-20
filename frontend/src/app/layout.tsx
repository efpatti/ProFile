import { siteMetadata } from "@/shared/config/metadata";
import { inter, manrope, jetbrains } from "@/shared/config/fonts";
import "./globals.css";
import { AppProviders } from "@/shared/providers/root_provider";
import Navbar from "@/components/Navbar";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

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
    <ErrorBoundary>
     <AppProviders>
      <Navbar />
      {children}
     </AppProviders>
    </ErrorBoundary>
   </body>
  </html>
 );
}

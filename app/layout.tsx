import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope } from "next/font/google";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
// import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// export const metadata: Metadata = {
//   title: "C-SERP - Candidate Screening & Registration Portal",
//   description: "Secure and efficient screening portal for streamlined candidate management and verification. Ministry of Interior - Candidate Screening & Registration Portal.",
//   keywords: ["candidate screening", "registration portal", "Ministry of Interior", "C-SERP", "government portal"],
//   authors: [{ name: "Ministry of Interior" }],
//   creator: "Ministry of Interior",
//   publisher: "Ministry of Interior",
//   metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
//   openGraph: {
//     title: "C-SERP - Candidate Screening & Registration Portal",
//     description: "Secure and efficient screening portal for streamlined candidate management and verification.",
//     type: "website",
//     siteName: "C-SERP",
//     images: [
//       {
//         url: "/cserp-logo.png",
//         width: 1200,
//         height: 630,
//         alt: "C-SERP Logo",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "C-SERP - Candidate Screening & Registration Portal",
//     description: "Secure and efficient screening portal for streamlined candidate management and verification.",
//     images: ["/cserp-logo.png"],
//   },
//   icons: {
//     icon: [
//       { url: "/cserp-logo.png", type: "image/png" },
//       { url: "/cserp-logo.png", sizes: "32x32", type: "image/png" },
//       { url: "/cserp-logo.png", sizes: "16x16", type: "image/png" },
//     ],
//     apple: [
//       { url: "/cserp-logo.png", sizes: "180x180", type: "image/png" },
//     ],
//   },
//   manifest: "/manifest.json",
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

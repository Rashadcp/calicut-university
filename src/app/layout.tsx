import type { Metadata, Viewport } from "next";
import { EB_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calicut University | Feedback ",
  description: "Share your thoughts and help improve the future of higher education.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#12121d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${ebGaramond.variable} ${hanken.variable} bg-background text-on-surface font-body-md overflow-hidden selection:bg-secondary/30`}>
        {children}
      </body>
    </html>
  );
}


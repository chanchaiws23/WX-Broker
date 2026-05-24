import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Woxa | Institutional Brokers",
    template: "%s | Woxa",
  },
  description: "Search, filter, and review institutional brokers across CFD, bond, stock, and crypto desks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Woxa | Institutional Brokers",
    description: "Search, filter, and review institutional brokers across CFD, bond, stock, and crypto desks.",
    url: "/",
    siteName: "Woxa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Woxa | Institutional Brokers",
    description: "Curated broker directory for institutional markets.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#0a1628] text-slate-200">
        {children}
      </body>
    </html>
  );
}

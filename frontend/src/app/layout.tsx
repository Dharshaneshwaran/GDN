import type { Metadata } from "next";
import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiruppur Fabric Tracker",
  description: "Fabric outward, inward and shortage tracking for garment factories"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}

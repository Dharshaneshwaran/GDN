import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGuard } from "@/components/AuthGuard";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruroxz Exports",
  description: "Elite fabric movement tracking for garment industries"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex h-screen flex-col bg-slate-50 antialiased overflow-hidden">
        <AuthGuard>
          <Topbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
              <div className="mx-auto max-w-[1600px]">
                {children}
              </div>
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}

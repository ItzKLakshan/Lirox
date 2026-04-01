import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lirox | Modern PDF Utility",
  description: "Merge, split, and convert your PDFs with a beautiful modern interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6 transition-all duration-300">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

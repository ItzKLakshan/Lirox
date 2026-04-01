"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Files,
  SplitSquareHorizontal,
  Image as ImageIcon,
  FileImage,
  Clock,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Merge PDF", href: "/merge", icon: Files },
  { name: "Split PDF", href: "/split", icon: SplitSquareHorizontal },
  { name: "Image to PDF", href: "/image-to-pdf", icon: ImageIcon },
  { name: "PDF to Image", href: "/pdf-to-image", icon: FileImage },
  { name: "History", href: "/history", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 glass rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-card m-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-[120%]"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center space-x-3 py-8">
          <Image
            src="/logo.png"
            alt="Lirox Logo"
            width={40}
            height={40}
            className="rounded-xl shadow-lg"
          />
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Lirox
          </span>
        </div>

        <nav className="px-4 space-y-1 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        />
      )}
    </>
  );
}

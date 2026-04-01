import Link from "next/link";
import { Files, SplitSquareHorizontal, Image as ImageIcon, FileImage, Clock } from "lucide-react";

const tools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into a single file.",
    icon: Files,
    href: "/merge",
    color: "bg-blue-500",
  },
  {
    name: "Split PDF",
    description: "Extract pages or separate PDFs easily.",
    icon: SplitSquareHorizontal,
    href: "/split",
    color: "bg-indigo-500",
  },
  {
    name: "Image to PDF",
    description: "Convert JPG, PNG, etc. to PDF.",
    icon: ImageIcon,
    href: "/image-to-pdf",
    color: "bg-emerald-500",
  },
  {
    name: "PDF to Image",
    description: "Convert PDF pages to high quality images.",
    icon: FileImage,
    href: "/pdf-to-image",
    color: "bg-rose-500",
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Select a tool below to quickly edit or convert your PDF files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.name} className="group block">
            <div className="glass-card p-6 h-full flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${tool.color} shadow-lg group-hover:scale-110 transition-transform`}
              >
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 glass-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Recent Files
          </h2>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400">
            Your recent files will appear here locally.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Files are not uploaded to any server. Everything happens on your device.
          </p>
        </div>
      </div>
    </div>
  );
}

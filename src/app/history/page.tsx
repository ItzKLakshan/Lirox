"use client";

import { Clock, Trash2 } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Clock className="w-8 h-8 text-blue-600" />
          History
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          View and manage the recent files processed locally on your device.
        </p>
      </div>

      <div className="glass-card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-700 mt-8">
        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
          No history available
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
          Files processed will appear here for easy access. Remember, everything is kept safely on your device.
        </p>
      </div>
    </div>
  );
}

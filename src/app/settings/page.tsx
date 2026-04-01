"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Moon, Sun, Monitor, Shield, Zap } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    // Basic theme check for mock UI interaction
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Configure Lirox exactly how you like it.
        </p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Monitor className="w-5 h-5" /> Appearance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                theme === "light"
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                theme === "dark"
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <Moon className="w-6 h-6 text-slate-800 dark:text-slate-200" />
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                theme === "system"
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <Monitor className="w-6 h-6 text-slate-500" />
              <span className="font-medium">System</span>
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" /> Privacy & Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Local Processing Only
                </h4>
                <p className="text-sm text-slate-500">
                  Guarantee your files never leave your device
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle-1"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked
                  readOnly
                />
                <label
                  htmlFor="toggle-1"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"
                ></label>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 px-2">
              All PDF operations are strictly executed inside your browser. Lirox does not use any backend servers.
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Performance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Quality vs Speed (PDF to Image)
                </h4>
                <p className="text-sm text-slate-500">
                  Optimize extracting images for speed instead of quality
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle-2"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle-2"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

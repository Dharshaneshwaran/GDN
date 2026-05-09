import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        factory: {
          ink: "#020617",
          line: "#f8fafc",
          panel: "#ffffff",
          green: "#10b981",
          emerald: "#059669",
          blue: "#2563eb",
          amber: "#d97706",
          red: "#dc2626",
          sidebar: "#ffffff",
          accent: "#10b981",
        }
      },
      boxShadow: {
        "premium-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "premium-md": "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        "premium-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.01)",
        "premium-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
        "glass-soft": "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
      }
    }
  },
  plugins: []
};

export default config;

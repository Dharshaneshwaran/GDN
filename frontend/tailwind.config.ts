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
          ink: "#172026",
          line: "#d6dde2",
          panel: "#f7f9fa",
          green: "#176b4d",
          amber: "#b45309",
          red: "#b42318"
        }
      }
    }
  },
  plugins: []
};

export default config;

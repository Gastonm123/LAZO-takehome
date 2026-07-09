import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lazo: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(2, 132, 199, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

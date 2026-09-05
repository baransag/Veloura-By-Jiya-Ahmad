import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        veloura: {
          pastelRose: "#FFF0F3",
          pastelPink: "#FCE7EC",
          blushPink: "#F8D5DE",
          petalPink: "#F4B8C6",
          roseGlow: "#E889A1",
          roseAccent: "#E14D75",
          crimson: "#C2185B",
          velvetWine: "#8E1B3B",
          deepWine: "#500A1C",
          noirWine: "#25050D",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "pastel-silk": "linear-gradient(135deg, #FFF8FA 0%, #FCE7EC 50%, #F8D5DE 100%)",
        "rose-gradient": "linear-gradient(135deg, #8E1B3B 0%, #C2185B 50%, #E14D75 100%)",
        "soft-rose-glow": "radial-gradient(circle at 50% 50%, #FCE7EC 0%, #FFF8FA 100%)",
        "velvet-dark": "linear-gradient(145deg, #25050D 0%, #500A1C 50%, #8E1B3B 100%)",
      },
      boxShadow: {
        "soft-pink": "0 8px 30px rgba(225, 77, 117, 0.08)",
        "hover-pink": "0 14px 36px rgba(194, 24, 91, 0.15)",
        "glow-red": "0 0 25px rgba(225, 77, 117, 0.35)",
      }
    },
  },
  plugins: [],
};
export default config;

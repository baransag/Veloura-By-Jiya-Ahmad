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
          cherry: "#750A0A",
          copper: "#A22A0F",
          olive: "#808000",
          burgundy: "#470B24",
          mustard: "#DA9413",
          teal: "#115F78",
          claret: "#8E1137",
          caramel: "#5D2806",
          powderPink: "#E8C5C8",
          softPink: "#F7EAEC",
          beige: "#F6F1E8",
          cream: "#FDFBF7",
          creamMuted: "#EAE2D5",
          emerald: "#0D3A2F",
          emeraldBright: "#084A3B",
          wine: "#3D071E",
          softBlack: "#141211",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "silk-gradient": "linear-gradient(135deg, #FDFBF7 0%, #F7EAEC 40%, #F6F1E8 100%)",
        "luxury-dark": "linear-gradient(145deg, #141211 0%, #2A0917 50%, #141211 100%)",
        "wine-glow": "radial-gradient(circle at 50% 50%, #470B24 0%, #141211 100%)",
        "gold-accent": "linear-gradient(90deg, #DA9413 0%, #F5C563 50%, #DA9413 100%)",
      },
    },
  },
  plugins: [],
};
export default config;

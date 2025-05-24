import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'MainColor': "#375460",
        'SecColor': "#6498ad",
        'ThirdColor': "#2a474e",
      },
      height:{
        'headerSize': '4rem',
        'footerSize': '8rem',
        'iconSize': '2.5rem',
      },
      backgroundImage:{
        'MachineHead' : "url('/assets/Rectangle3.png')",
        'Music' : "url('/assets/Music.png')",
        'Multi' : "url('/assets/Multi.png')",
        'Books' : "url('/assets/Books.png')",
        'Clown' : "url('/assets/Spectacle.png')",
        'Cinema' : "url('/assets/Cinema.png')",
        'VisArt' : "url('/assets/VisArt.png')",
      }
    },
  },
  plugins: [],
};
export default config;

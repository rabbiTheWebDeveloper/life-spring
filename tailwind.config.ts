import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				'login-btn-gradient': 'linear-gradient(90deg, #9B468A 100%, #33C2DF 100%)',
      },
			boxShadow: {
        'login': '0 0 40.34px 4.63px rgba(0, 0, 0, 0.25)',
				'login-btn': '0 7.4px 19.43px rgba(0, 0, 0, 0.16)',
      },
			colors: {
				background: "#FFFFFF",
				foreground: "#000000",
				primary: {
					50: "#DEF8DB",
					100: "#D2F0D3",
					200: "#A7E1A9",
					300: "#76CC78",
					400: "#4CAF50",
					500: "#227F27",
					600: "#1E7023",
					700: "#19591C",
					800: "#134014",
					900: "#0E2B0F",
				},
			},
    },
  },
  plugins: [],
};
export default config;

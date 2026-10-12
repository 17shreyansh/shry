/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem", xl: "3rem" }, screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        obsidian: "#08090B",
        surface: "#111318",
        surface2: "#171A21",
        bone: "#E9E6DC",
        ink: "#F5F5F0",
        mute: "#A5A7AE",
        line: "rgba(245,245,240,0.12)",
        accent: "#BFEA5A",
      },
      fontFamily: {
        sans: ['"Geist Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono Variable"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: { label: "0.14em" },
    },
  },
  plugins: [],
};

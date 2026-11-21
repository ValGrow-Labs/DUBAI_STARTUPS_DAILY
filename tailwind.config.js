/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        raised: token("raised"),
        ink: token("ink"),
        body: token("body"),
        muted: token("muted"),
        line: token("line"),
        lime: token("lime"),
        onlime: token("onlime"),
        acc: token("acc"),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"Geist"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "90rem",
        read: "42rem",
      },
      borderRadius: {
        tile: "1.25rem",
        card: "0.875rem",
      },
      zIndex: {
        header: "40",
        overlay: "50",
        skip: "60",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};

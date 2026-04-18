/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        card: "var(--card)",
        navy: "var(--navy)",
        amber: "var(--amber)",
        subtext: "var(--subtext)",
        border: "var(--border)"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 60px -35px rgba(15, 23, 42, 0.45)"
      },
      keyframes: {
        slideForward: {
          "0%": { opacity: "0", transform: "translateX(34px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        slideBack: {
          "0%": { opacity: "0", transform: "translateX(-34px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        fadeRise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "step-forward": "slideForward 420ms ease-out",
        "step-back": "slideBack 420ms ease-out",
        "fade-rise": "fadeRise 480ms ease-out both"
      }
    }
  },
  plugins: []
};

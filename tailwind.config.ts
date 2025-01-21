import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          "btn-text": "rgba(var(--btn-text-color), <alpha-value>)",
          "btn-spinner": "rgba(var(--btn-spinner-color), <alpha-value>)",
          "btn-disabled": "rgba(var(--btn-disabled-text-color), <alpha-value>)",
        },
      },

      backgroundColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          "primary-dark": "rgba(var(--primary-bg-dark), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          "btn-bg": "rgba(var(--btn-bg-color), <alpha-value>)",
          "btn-bg-hover": "rgba(var(--btn-bg-hover-color), <alpha-value>)",
          "btn-active": "rgba(var(--btn-bg-active-color), <alpha-value>)",
          "btn-disabled": "rgba(var(--btn-disabled-bg-color), <alpha-value>)",
        },
      },

      fill: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },

      gradientColorStops: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          "primary-dark": "rgba(var(--primary-bg-dark), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
        from: {
          skin: {
            "gradient-from": "rgba(var(--gradient-from), <alpha-value>)",
            primary: "rgba(var(--primary-bg), <alpha-value>)",
            secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          },
        },
        to: {
          skin: {
            "gradient-to": "rgba(var(--gradient-to), <alpha-value>)",
            primary: "rgba(var(--primary-bg), <alpha-value>)",
            secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          },
        },
        via: {
          skin: {
            "gradient-via": "rgba(var(--gradient-via), <alpha-value>)",
            primary: "rgba(var(--primary-bg), <alpha-value>)",
            secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          },
        },
      },

      ringColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
          "btn-ring": "rgba(var(--btn-ring-color), <alpha-value>)",
        },
      },

      borderColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },

      boxShadowColor: {
        skin: {
          primary: "rgba(var(--primary-bg), <alpha-value>)",
          secondary: "rgba(var(--secondary-bg), <alpha-value>)",
        },
      },

      keyframes: {
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          to: { height: "0", opacity: "0" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },

      fontFamily: {
        gilroy: ["var(--font-gilroy-medium)"],
      },

      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        gradient: "gradient 8s linear infinite",
        "gradient-fast": "gradient 5s linear infinite",
        "accordion-down":
          "accordion-down 0.2s cubic-bezier(0.36, 0.66, 0.04, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.36, 0.66, 0.04, 1)",
        "border-beam": "border-beam calc(var(--duration)*1s) linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;

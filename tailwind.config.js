/** @type {import('tailwindcss').Config} */
module.exports = {
  //mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        blob1s: "blob 1s infinite",
        blob3s: "blob 3s infinite",
        blob5s: "blob 5s infinite",
        blob10s: "blob 10s infinite",
        blob15s: "blob 15s infinite",
        blob20s: "blob 20s infinite",
        blob25s: "blob 25s infinite",
        blob30s: "blob 30s infinite",
        blob40s: "blob 40s infinite",
        blob50s: "blob 50s infinite",
        blob55s: "blob 55s infinite",
        blob60s: "blob 60s infinite",
        blob70s: "blob 70s infinite",
        blob80s: "blob 80s infinite",
        blob90s: "blob 90s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "5%": {
            transform: "translate(-4px, -4px) scale(1.0)",
          },
          "10%": {
            transform: "translate(-8px, -8px) scale(1.0)",
          },
          "15%": {
            transform: "translate(-16px, -16px) scale(1.0)",
          },
          "20%": {
            transform: "translate(-20px, -20px) scale(1.0)",
          },
          "25%": {
            transform: "translate(-24px, -24px) scale(1.0)",
          },
          "30%": {
            transform: "translate(0px, -0px) scale(1.0)",
          },
          "35%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "40%": {
            transform: "translate(0px, -0px) scale(1.0)",
          },
          "45%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "50%": {
            transform: "translate(0px, -48px) scale(1.0)",
          },
          "55%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "60%": {
            transform: "translate(0px, -0px) scale(1.0)",
          },
          "65%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "70%": {
            transform: "translate(0px, -0px) scale(1.0)",
          },
          "75%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "80%": {
            transform: "translate(0px, -0px) scale(1.0)",
          },
          "85%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "90%": {
            transform: "translate(0px, -0px) scale(1.0)",
          },
          "95%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1.0)",
          },
        },
      },
      backgroundImage: {
        // 'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // 'gradient-conic':
        //   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
  ]
}

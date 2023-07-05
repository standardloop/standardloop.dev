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
            transform: "translate(96px, 0px) scale(1.0)",  // (1,0)
          },
          "6.25%": {
            transform: "translate(83px, 48px) scale(1.05)",  // (root(3)/2, -1/2) // 0.86602540378
          },
          "12.5%": {
            transform: "translate(68px, 68px) scale(1.1)",  // (root(2)/2, -root(2)/2) // 0.70710678118
          },
          "18.75%": {
            transform: "translate(48px, 83px) scale(1.05)",  // (1/2, -root(3)/2)
          },
          "25%": {
            transform: "translate(0px, 96px) scale(1.0)",  // (0, -1)
          },
          "31.25%": {
            transform: "translate(-48px, 83px) scale(0.95)",  // (-1/2, -root(3)/2)
          },
          "37.5%": {
            transform: "translate(-68px, 68px) scale(0.9)",
          },
          "43.75%": {
            transform: "translate(-83px, 48px) scale(0.95)",
          },
          "50%": {
            transform: "translate(-96px, 0px) scale(1.0)", // (-1,0)
          },
          "56.25%": {
            transform: "translate(-83px, -48px) scale(1.05)",
          },
          "62.5%": {
            transform: "translate(-68px, -68px) scale(1.1)",
          },
          "68.75%": {
            transform: "translate(-48px, -83px) scale(1.05)",
          },
          "75%": {
            transform: "translate(0px, -96px) scale(1.0)", // (0,1)
          },
          "81.25%": {
            transform: "translate(48px, -83px) scale(0.95)",
          },
          "87.5%": {
            transform: "translate(68px, -68px) scale(0.9)",
          },
          "93.75%": {
            transform: "translate(96px, -48px) scale(0.95)",
          },
          "100.0%": {
            transform: "translate(96px, 0px) scale(1.0)", // (1,0)
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

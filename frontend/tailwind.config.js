/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false,
        },
    content: [
      // Or if using `src` directory:
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    important: '#__next',
    theme: {
      extend: {
        fontFamily: {
            sans: ["PT Sans", "ui-sans-serif", "system-ui"],
            serif: ["PT Sans", "ui-serif", "Georgia"],
        },
      },
    },
    plugins: [],
  }
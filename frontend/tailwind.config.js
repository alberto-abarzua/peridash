/** @type {import('tailwindcss').Config} */

const my_colors = require('./src/utils/colors');

module.exports = {
    content: [
        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: '#__next',
    theme: {
        extend: {
            colors: my_colors,
            fontFamily: {
                sans: ['PT Sans', 'ui-sans-serif', 'system-ui'],
                serif: ['PT Sans', 'ui-serif', 'Georgia'],
            },
        },
    },
    plugins: [],
};

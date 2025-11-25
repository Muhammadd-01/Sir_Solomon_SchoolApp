/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#B4FF71',
                    dark: '#9DE05A',
                },
                accent: {
                    DEFAULT: '#C84AB6',
                    dark: '#A83A96',
                },
                navy: {
                    DEFAULT: '#081F5C',
                    light: '#0A2570',
                },
            },
        },
    },
    plugins: [],
}

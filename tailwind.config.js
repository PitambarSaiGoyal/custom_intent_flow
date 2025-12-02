/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './InjectionComponent.tsx',
    './ViewStateProvider.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
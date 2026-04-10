export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1e3a8a',    // blue-900
        },
        background: '#0f172a', // slate-900 for dark mode feel
        surface: '#1e293b',   // slate-800
        textLight: '#f8fafc', // slate-50
        textMuted: '#94a3b8', // slate-400
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teknofest: {
          // Primary blue colors from Teknofest theme
          'dark-blue': '#0a1628',
          'blue': '#0d2137',
          'medium-blue': '#1a3a5c',
          'light-blue': '#2a5a8c',
          // Accent orange/red
          'orange': '#e94e1b',
          'orange-hover': '#ff6b35',
          'red': '#dc2626',
          // Supporting colors
          'cyan': '#00d4ff',
          'purple': '#7c3aed',
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(180deg, #0a1628 0%, #0d2137 50%, #1a3a5c 100%)',
        'hero-pattern': 'radial-gradient(ellipse at center, #1a3a5c 0%, #0d2137 50%, #0a1628 100%)',
      },
      fontFamily: {
        'arabic': ['Tajawal', 'Cairo', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        }
      }
    },
  },
  plugins: [],
}

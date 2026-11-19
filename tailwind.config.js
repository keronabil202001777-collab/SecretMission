/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0B14",
        neonLime: "#CCFF00",
        neonPink: "#FF2A85",
        neonCyan: "#00E5FF",
        neonYellow: "#FFE600",
        neonPurple: "#8B5CF6",
        neonOrange: "#FF6B00",
        cardDark: "#151522",
        cardBorder: "#272738",
      },
      fontFamily: {
        display: ['Unbounded', 'Alexandria', 'sans-serif'],
        arabic: ['Alexandria', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px #000000',
        'brutal-sm': '2.5px 2.5px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-lime': '4px 4px 0px #CCFF00',
        'brutal-pink': '4px 4px 0px #FF2A85',
        'neon-glow': '0 0 25px rgba(204, 255, 0, 0.4)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-6px) rotate(var(--rot, 0deg))' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(3px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}

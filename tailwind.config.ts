import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'magical-pink': '#FFB6E1',
        'magical-purple': '#DDA0DD',
        'magical-blue': '#B0E0E6',
        'magical-yellow': '#FFE4B5',
        'sparkle-gold': '#FFD700',
        'sparkle-silver': '#C0C0C0',
        'moon-glow': '#F0E68C',
      },
      backgroundImage: {
        'gradient-magical': 'linear-gradient(135deg, #FFB6E1 0%, #DDA0DD 50%, #B0E0E6 100%)',
        'gradient-starry': 'radial-gradient(ellipse at top, #1a0033 0%, #330066 50%, #660099 100%)',
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'transform-sequence': 'transform-sequence 1.5s ease-out',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 182, 225, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 182, 225, 1)' },
        },
        'transform-sequence': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
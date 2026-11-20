/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F3FB',
          100: '#EDE5F7', // Secondary tone
          200: '#DECFF0',
          300: '#C2A7E4',
          400: '#9B72C7',
          500: '#8353B9',
          600: '#7041A6', // Brand Primary
          700: '#5A3289',
          800: '#46256C',
          900: '#341951',
          DEFAULT: '#7041A6',
        },
        secondary: {
          DEFAULT: '#EDE5F7',
          hover: '#E2D5F2',
          active: '#D4C2EB',
        },
        accent: {
          50: '#FEF4F7',
          100: '#FDE7EE',
          200: '#FCD0DE',
          300: '#F8A9C1',
          400: '#F482A3',
          500: '#F28BA8', // Brand Accent
          600: '#DE5681',
          700: '#BF3260',
          DEFAULT: '#F28BA8',
        },
        surface: {
          DEFAULT: '#FAF9FC', // Brand Background
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          subtle: '#F4F2F8',
          border: '#E8E4F0',
        },
        ink: {
          DEFAULT: '#292536', // Brand Text
          light: '#4C4660',
          muted: '#716B87',
          subtle: '#9D97B2',
          border: '#E4E0EC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px 0 rgba(41, 37, 54, 0.04)',
        'soft-md': '0 4px 16px 0 rgba(41, 37, 54, 0.06), 0 2px 6px -1px rgba(41, 37, 54, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(41, 37, 54, 0.08), 0 4px 10px -2px rgba(41, 37, 54, 0.03)',
        'soft-xl': '0 20px 35px -5px rgba(41, 37, 54, 0.09), 0 10px 15px -5px rgba(41, 37, 54, 0.04)',
        'glow-primary': '0 0 20px -3px rgba(112, 65, 166, 0.25)',
        'glow-accent': '0 0 20px -3px rgba(242, 139, 168, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};

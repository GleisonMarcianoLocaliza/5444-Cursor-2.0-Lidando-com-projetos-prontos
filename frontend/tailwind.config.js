/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Chakra Petch', 'sans-serif'],
      },
      fontSize: {
        'body-xxl': ['1.938rem', { lineHeight: '120%' }],
        'body-xl': ['1.562rem', { lineHeight: '120%' }],
        'body-lg': ['1.250rem', { lineHeight: '120%' }],
        'body-md': ['1.000rem', { lineHeight: '120%' }],
        'body-sm': ['0.812rem', { lineHeight: '120%' }],
        'body-xs': ['0.625rem', { lineHeight: '120%' }],
        'heading-xxl': ['4.750rem', { lineHeight: '125%' }],
        'heading-xl': ['3.812rem', { lineHeight: '125%' }],
        'heading-lg': ['3.062rem', { lineHeight: '125%' }],
        'heading-md': ['2.438rem', { lineHeight: '125%' }],
        'heading-sm': ['1.938rem', { lineHeight: '125%' }],
        'heading-xs': ['1.562rem', { lineHeight: '125%' }],
      },
      colors: {
        neutral: {
          background: '#FBFBFB',
          text: '#444444',
          divisor: '#F2F2F2',
          white: '#FFFFFF',
          black: '#000000',
        },
        primary: {
          dark: '#D9784A',
          pure: '#EE875D',
          light: '#F5B896',
        },
        secondary: {
          dark: '#23384D',
          pure: '#1D2F40',
          light: '#2E4B66',
        },
        security: {
          dark: '#212A34',
          pure: '#2A3441',
          light: '#3A4756',
        },
        feedback: {
          attention: '#FFD400',
          negative: '#FF3F48',
          positive: '#6EDC3B',
        },
      },
      boxShadow: {
        'elevation-1': '0 0 10px rgba(132, 132, 132, 0.1)',
        'elevation-2': '0 0 20px rgba(132, 132, 132, 0.2)',
        'elevation-3': '0 0 30px rgba(132, 132, 132, 0.25)',
      },
    },
  },
  plugins: [],
}

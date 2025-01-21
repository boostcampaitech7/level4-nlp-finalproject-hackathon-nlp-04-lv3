/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: 'var(--color-main)',
        line: 'var(--color-line)',
        text: {
          primary: 'var(--color-text-primary)',
          intermediate: 'var(--color-text-intermediate)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
          transparent: 'var(--color-text-transparent)',
        },
        surface: {
          primary1: 'var(--color-surface-primary-1)',
          primary2: 'var(--color-surface-primary-2)',
          secondary: 'var(--color-sorface-secondary)',
        },
        button: {
          primary: 'var(--color-button-primary)',
          primary2: 'var(--color-button-primary-2)',
          secondary: 'var(--color-button-secondary)',
          secondary2: 'var(--color-button-secondary-2)',
          primaryHover: 'var(--color-button-primary-hover)',
          secondaryHover: 'var(--color-button-secondary-hover)',
        },
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
        },
        accent: {
          highlight: 'var(--color-accent-highlight)',
          positive: 'var(--color-accent-positive)',
          negative: 'var(--color-accent-negative)',
          red: 'var(--color-accent-red)',
          purple: 'var(--color-accent-purple)',
        },
        purple: {
          100: '#8B59FF',
          200: '#9A6FFF',
          300: '#A781FF',
          400: '#BA9DFF',
          500: '#C9B3FF',
          600: '#D8C9FF',
          700: '#E5DAFF',
          800: '#F1EBFF',
        },
        orange: {
          100: '#FFA362',
          200: '#FFBB8B',
          300: '#FFC9A3',
          400: '#FFD4B5',
          500: '#FFE3CE',
          600: '#FFEBDC',
        },
        grey: {
          100: '#202020',
          200: '#3E3E3E',
          300: '#707070',
          400: '#848484',
          500: '#ACACAC',
          600: '#C0C0C0',
          700: '#D4D4D4',
          800: '#E8E8E8',
          900: '#F2F2F2',
          transparent: 'rgba(112, 112, 112, 0.1)',
        },
        black: '#000000',
        white: '#ffffff',
        whiteTransparent: 'rgba(255, 255, 255, 0.2)',
        blue: {
          100: '#436DFF',
          200: '#5F82FF',
          300: '#7C99FF',
          400: '#9BB1FF',
          500: '#BBCAFF',
          600: '#D3DCFF',
          700: '#EAEFFF',
          transparent: 'rgba(67, 109, 255, 0.08)',
          transparentInverse: 'rgba(67, 109, 255, 0.3)',
        },
        red: {
          100: '#FF4646',
          200: '#FF5757',
          300: '#FF6666',
          400: '#FF8383',
          500: '#FF9F9F',
          600: '#FFBFBF',
          700: '#FFDBDB',
          800: '#FFECEC',
          transparent: 'rgba(255, 70, 70, 0.08)',
          transparentInverse: 'rgba(255, 70, 70, 0.3)',
        },
      },
      fontFamily: {
        pretendardBlack: ['PretendardBlack', 'sans-serif'],
        pretendardBold: ['PretendardBold', 'sans-serif'],
        pretendardSemiBold: ['PretendardSemiBold', 'sans-serif'],
        pretendardExtraBold: ['PretendardExtraBold', 'sans-serif'],
        pretendardMedium: ['PretendardMedium', 'sans-serif'],
        pretendardRegular: ['PretendardRegular', 'sans-serif'],
        partialSans: ['PartialSans', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.display-l': {
          fontFamily: theme('fontFamily.pretendardBlack'),
          fontSize: '64px',
        },
        '.display-m': {
          fontFamily: theme('fontFamily.pretendardBold'),
          fontSize: '52px',
        },
        '.display-s': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '44px',
        },
        '.headline-l': {
          fontFamily: theme('fontFamily.pretendardExtraBold'),
          fontSize: '42px',
        },
        '.headline-m': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '38px',
        },
        '.headline-s': {
          fontFamily: theme('fontFamily.pretendardMedium'),
          fontSize: '34px',
        },
        '.title-l': {
          fontFamily: theme('fontFamily.pretendardBold'),
          fontSize: '38px',
        },
        '.titile-m': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '32px',
        },
        '.title-s': {
          fontFamily: theme('fontFamily.pretendardMedium'),
          fontSize: '30px',
        },
        '.body-l': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '28px',
        },
        '.body-m': {
          fontFamily: theme('fontFamily.pretendardMedium'),
          fontSize: '24px',
        },
        '.body-s': {
          fontFamily: theme('fontFamily.pretendardRegular'),
          fontSize: '22px',
        },
        '.button-l': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '24px',
        },
        '.button-m': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '20px',
        },
        '.button-s': {
          fontFamily: theme('fontFamily.pretendardMedium'),
          fontSize: '16px',
        },
        '.caption-l': {
          fontFamily: theme('fontFamily.pretendardSemiBold'),
          fontSize: '24px',
        },
        '.caption-m': {
          fontFamily: theme('fontFamily.pretendardMedium'),
          fontSize: '24px',
        },
        '.caption-s': {
          fontFamily: theme('fontFamily.pretendardRegular'),
          fontSize: '20px',
        },
      }

      addUtilities(newUtilities, {
        variants: ['responsive', 'hover', 'focus', 'dark'],
      })
    },
  ],
}

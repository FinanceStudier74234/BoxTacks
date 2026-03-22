import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          purple: '#8B5CF6',
          teal: '#06B6D4',
          coral: '#F97316',
          pink: '#EC4899',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-teal': 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
        'gradient-coral': 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.1), 0 2px 4px 0 rgba(0,0,0,0.06)',
        'panel': '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)',
        'brand': '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config

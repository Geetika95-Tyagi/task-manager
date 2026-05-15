import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg))',
        panel: 'hsl(var(--panel))',
        panel2: 'hsl(var(--panel-2))',
        text: 'hsl(var(--text))',
        muted: 'hsl(var(--muted))',
        line: 'hsl(var(--line))',
        accent: 'hsl(var(--accent))',
        accent2: 'hsl(var(--accent-hover))',
        cyan: 'hsl(var(--violet))',
        danger: 'hsl(var(--danger))',
        success: 'hsl(var(--success))'
      },
      boxShadow: {
        soft: '0 20px 50px -20px hsl(262 56% 52% / 0.15)',
        glow: '0 4px 16px -2px hsl(var(--accent) / 0.3)',
        card: '0 1px 3px hsl(268 18% 14% / 0.05), 0 6px 20px -4px hsl(262 40% 40% / 0.08)'
      },
      borderRadius: {
        xl2: '0.5rem',
        xl3: '0.625rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        display: ['2.5rem', { lineHeight: '1.12', letterSpacing: '-0.025em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }]
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;

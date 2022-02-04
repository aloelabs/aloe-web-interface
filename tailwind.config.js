module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height'
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'caution': '#FF7A00',
      'warning': '#EC2D5B',
      'gradient-start': '#C08FFF',
      'gradient-mid': '#6CCFE4',
      'gradient-end': '#88E2A1',
      'purple': {
        300: '#6002EE',
        400: '#6B40EE',
        500: '#865EF2',
        600: '#9E7DF5',
        700: '#BBA3F7',
      },
      'green': {
        300: '#00C143',
        400: '#0CCC5E',
        500: '#59D67C',
        600: '#90E1A3',
        700: '#BEEDC7',
      },
      'grey': {
        0: '#0A1821',
        25: '#0F1E29',
        50: '#11222E',
        75: '#1B2B37',
        100: '#223645',
        200: '#2F485A',
        300: '#3E5A6F',
        400: '#4A687F',
        500: '#647D93',
        600: '#7D94A7',
        700: '#A0B2C1',
        800: '#C2D1DD',
        900: '#E4EDF6',
        1000: '#FFFFFF',
      },
      // ...
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
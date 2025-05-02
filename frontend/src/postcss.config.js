// frontend/postcss.config.js
module.exports = {
  plugins: {
    'postcss-nesting': {}, // enables @apply inside nested rules like @layer
    tailwindcss: {},
    autoprefixer: {},
  },
}

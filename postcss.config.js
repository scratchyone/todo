module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-preset-env',
    'cssnano',
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            '@fullhuman/postcss-purgecss',
            {
              content: ['./pages/**/*.js', './components/**/*.js'],
              defaultExtractor: (content) =>
                content.match(/[A-Za-z0-9-_:/]+/g) || [],
            },
          ],
        ]
      : []),
  ],
};

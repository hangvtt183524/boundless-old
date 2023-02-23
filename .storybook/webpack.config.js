const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    use: ['vue-style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });

  config.module.rules.push({
    test: /\.styl$/,
    loader: "style-loader!css-loader!stylus-loader"
  });

  config.module.rules.push({
    test: /\.pug$/,
    oneOf: [
      {
        resourceQuery: /^\?vue/,
        use: [
          {
            loader: 'pug-plain-loader'
          }
        ]
      },
      {
        use: [
          /* config.module.rule('pug').oneOf('raw-pug-files').use('pug-raw') */
          {
            loader: 'raw-loader'
          },
          /* config.module.rule('pug').oneOf('raw-pug-files').use('pug-plain') */
          {
            loader: 'pug-plain-loader'
          }
        ]
      }
    ]
  })

  config.resolve.alias = {
    ...config.resolve.alias,
    "@/services/event-tracker": path.resolve(__dirname, "./__mocks__/event-tracker.js"),
    "@": path.resolve(__dirname, "../src")
  };

  // Return the altered config
  return config;
};

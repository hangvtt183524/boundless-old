const path = require('path')

module.exports = {
  outputDir: 'dist/dashboard',
  configureWebpack: {
    resolve: {
      alias: {
        'styles': path.resolve(__dirname, 'src/styles')
      }
    },
    devServer: {
      disableHostCheck: true
    }
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  },
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader')
    config.module.rule('csv').test(/\.csv$/).use('csv').loader('file-loader').options({ name: '[name].[ext]' })

    config.plugin('html')
      .tap(args => {
        args[0].template = path.join(__dirname, 'public/dashboard/index.html')
        return args
      })
    config.plugin('copy').tap(([options]) => {
      options[0].from = path.join(__dirname, 'public/dashboard/')
      return [options]
    })
  }
}

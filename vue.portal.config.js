const path = require('path')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true
})

process.env.VUE_APP_VERSION = gitRevisionPlugin.version()
process.env.VUE_APP_COMMITHASH = gitRevisionPlugin.commithash()
process.env.VUE_APP_BRANCH = gitRevisionPlugin.branch()

module.exports = {
  publicPath: './',
  pages: {
    index: {
      entry: 'src/engine/index.js',
      template: 'public/portal/index.html',
      filename: 'index.html'
    },
    wifi4eu: {
      entry: 'src/engine/index.js',
      template: 'public/portal/wifi4eu.html',
      filename: 'wifi4eu.html'
    }
  },
  outputDir: 'dist/portal',
  css: {
    extract: false
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      gitRevisionPlugin
    ],
    resolve: {
      alias: {
        'styles': path.resolve(__dirname, 'src/styles')
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')

    config.module.rule('eslint').use('eslint-loader')
    config.optimization.delete('splitChunks')

    // config.plugin('html')
    //   .tap(args => {
    //     console.log('args', args)
    //     args[0].template = path.join(__dirname, 'public/portal/index.html')
    //     return args
    //   })

    config.plugin('copy').tap(([options]) => {
      options[0].from = path.join(__dirname, 'public/portal/')
      return [options]
    })
  }
}

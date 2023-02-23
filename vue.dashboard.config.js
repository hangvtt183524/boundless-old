const path = require('path')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true
})

process.env.VUE_APP_VERSION = gitRevisionPlugin.version()
process.env.VUE_APP_COMMITHASH = gitRevisionPlugin.commithash()
process.env.VUE_APP_BRANCH = gitRevisionPlugin.branch()

module.exports = {
  outputDir: 'dist/dashboard',
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

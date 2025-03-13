const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    output: {
      filename: 'email-marketing.js',
      library: 'EmailMarketing',
      libraryTarget: 'umd',
    },
    optimization: {
      splitChunks: false,
    },
    css: {
      extract: true,
      sourceMap: false,
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
        .set('@', path.resolve(__dirname, 'src'))
  },
})
const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack');
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  }
})

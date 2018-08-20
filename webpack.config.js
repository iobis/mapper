const UglifyJS = require("uglifyjs-webpack-plugin")

module.exports = env => {
  let config = {
    entry: './app/main',
    output: {
      filename: 'bundle.js'
    },
    devServer: {
      port: 5000,
      inline: true
    },
    plugins: [],
    externals: {
      "jquery": "jQuery"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js'
      }
    }
  }

  if (env.production) {
    config.plugins.push(new UglifyJS())
  }

  return config

}
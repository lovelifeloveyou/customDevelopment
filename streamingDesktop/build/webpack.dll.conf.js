var path = require('path')
var webpack = require('webpack')

var context = path.join(__dirname, '..')

module.exports = {
  entry: {
    vendor: [
      'vue/dist/vue.common.js',
      'vuex',
      'vue-router',
      'axios'
      // 'vconsole'
    ]
  },
  output: {
    path: path.join(context, 'static/js'), // 打包后的 vendor.js放入 static/js 路径下
    filename: '[name].dll.js',
    library: '[name]'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(context, '[name].manifest.json'),
      name: '[name]',
      context: context
    }),
    // 压缩js代码
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: true, // 去除生产环境的 debugger 和 console.log
        drop_console: true
      },
      warnings: false,
      output: { // 删除打包后的注释
        comments: false
      }
    })
  ]
}

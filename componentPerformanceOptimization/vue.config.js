const path = require("path");
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  publicPath: './',
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("~", resolve("src/assets"))
      .set("@c", resolve("src/components"))
      .set("@v", resolve("src/views"))
      .set("@p", resolve("public"));
    config.module
      .rule('images')
        // 给 image-webpack-loader 加上缓存来加快编译
        .use('cache-loader')
          .before('url-loader')
          .loader('cache-loader')
          .options({
            cacheDirectory: path.join(__dirname, 'node_modules/.cache/image-webpack-loader')
          })
        .end()
        .use('image-webpack-loader')
          .loader('image-webpack-loader')
          .options({
            bypassOnDebug: true
          })
          .end()
        .end()
    config.plugins
        .delete('prefetch')
        .delete('preload');
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
          .use(new CompressionPlugin({
            test:/\.js$|\.html$|.\css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false // 不删除源文件
          }))
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ]
  },
  css: {
    // 组件样式内联
    extract: true,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem-exclude')({
            // 以设计稿750为例， 750 / 10 = 75
            remUnit: 90,
            exclude: '/node_modules/i'
          }),
        ]
      }
    },
    modules: false
  },
  devServer: {
    inline: true,
    disableHostCheck: true,
    port: 8080,
    /*proxy: {
      '/ess': {
        // 要访问的跨域的api的域名
        target: process.env.VUE_APP_BASE_API,
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/ess': ''
        }
      },
      '/file': {
        // 要访问的跨域的fileApi的域名
        target: process.env.VUE_APP_STATIC_SERVER_API,
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/file': ''
        }
      },
    }*/
  },
};

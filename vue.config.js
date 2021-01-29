'use strict';
const path = require('path');
const Webpack = require('webpack');
const defaultSettings = require('./src/settings.js');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// 匹配此 {RegExp} 的资源
const productionGzipExtensions = /\.(js|css|json|ttf)(\?.*)?$/i;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    host: '127.0.0.1',
    port: defaultSettings.port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [defaultSettings.proxy.name]: {
        target: defaultSettings.proxy.url,
        changeOrigin: true,
        pathRewrite: {
          ['^' + defaultSettings.proxy.name]: ''
        },
        cookiePathRewrite: {
          'admin': '/'
        }
      },
      '/image-base-url': {
        target: 'https://raw.githubusercontent.com/yemingrujing/Drawing_Images/main/',
        changeOrigin: true,
        pathRewrite: {
          '^/image-base-url': ''
        }
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.mode = 'production';
      const plugins = [
        new CompressionWebpackPlugin({
          filename: '[path][name].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 0,
          minRatio: 0.8
        }),
        new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      ];
      // 将每个依赖包打包成单独的js文件
      const optimization = {
        minimize: true,
        minimizer: [new TerserPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              // 移除console
              pure_funcs: ['console.log']
            }
          }
        })]
      };
      Object.assign(config, {
        plugins,
        optimization
      });
    } else {
      // 为开发环境修改配置
      config.mode = 'development';
      config.name = defaultSettings.title;
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end();
          config.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          });
          config.optimization.runtimeChunk('single');
        }
      );
  }
};

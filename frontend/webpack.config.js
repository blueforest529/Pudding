var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin"); 

var publicPath = process.env.NODE_ENV == 'production' ? './' : '/public/';

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: publicPath,
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: process.env.NODE_ENV == 'production' ? ExtractTextPlugin.extract({
          fallback: 'vue-style-loader',
          use: ['css-loader']
        }) : ['vue-style-loader', 'css-loader'],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/assets/img/',
          publicPath: publicPath+'assets/img/'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
            name:       '[name].[ext]',
            outputPath: '/assets/fonts/',
            publicPath: publicPath+'assets/fonts/'
        }
      }
                
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    proxy: {
      // /oauth URL 경로는 아래 proxy 서버를 이용한다.
      '/webapi' : {
        target: 'https://192.168.43.112:443',
        changeOrigin : true,
        secure: false
      }
    }
  },
  performance: {
    hints: false
  }
}

// 플러그인 설정
if (process.env.NODE_ENV == 'production') {
  module.exports.devtool = '#eval-source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // worth a try, but probably no effect
      publicPath: './',
      filename: 'index.html' // worth a try
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      publicPath: './',
      disable: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
} else { // development
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ])
}

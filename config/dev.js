const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const sourceDirectory = path.resolve(__dirname, '../src')
const buildDirectory = path.resolve(__dirname, '../build')
const publicDirectory = path.resolve(__dirname, '../public')

const generateHTML = () => glob.sync(`${sourceDirectory}/pages/*.html`).map(
  dir => new HtmlWebpackPlugin({
    hash: false,
    filename: path.basename(dir),
    template: dir,
    chunks: ['vendors', path.basename(dir).split('.')[0]]
  })
)

const config = {
  entry: {
    index: path.resolve(sourceDirectory, 'app.js'),
    editor: path.resolve(sourceDirectory, 'editor.js')
  },

  output: {
    path: publicDirectory,
    filename: 'bundle-[name].[hash:8].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: sourceDirectory,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        include: sourceDirectory,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',

      assets: path.resolve(sourceDirectory, 'assets'),
      stylesheets: path.resolve(sourceDirectory, 'stylesheets'),
      components: path.resolve(sourceDirectory, 'components'),
      utilities: path.resolve(sourceDirectory, 'utilities')
    }
  },

  devServer: {
    contentBase: buildDirectory,
    port: process.env.PORT || 31291
  },

  plugins: [
    ...generateHTML(),
    new CopyPlugin([
      { from: sourceDirectory + '/assets', to: publicDirectory + '/assets' }
    ])
  ],

  optimization: {
    // minimize: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
}

module.exports = config

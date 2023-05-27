import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

import { spawn } from 'child_process';

const isProd = process.env.NODE_ENV === 'production';

export default {
  mode: isProd ? 'production' : 'development',
  entry: {
    popup: './src/popup/main.tsx',
    options: './src/options/main.tsx',
    background: './src/background/background.ts',
    content: './src/content/main.tsx',
  },
  devtool: isProd ? false : 'inline-source-map',
  devServer: {
    contentBase: './',
    hot: true
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/options.html',
      filename: 'options.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: './' },
        { from: `public/icons/${ isProd ? 'prod' : 'dev' }`, to: './icons' }
      ]
    }),
    function () {
      this.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
        spawn('chrome.runtime.reload()', { shell: true });
      });
    }
  ],
  watch: true
};

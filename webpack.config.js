import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

import { spawn } from 'child_process';

export default {
  mode: 'development',
  entry: {
    popup: './popup/main.tsx',
    options: './options/main.tsx',
    background: './src/background.ts',
    content: './src/content.ts',
  },
  devtool: 'inline-source-map',
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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './popup.html',
      filename: 'popup.html'
    }),
    new HtmlWebpackPlugin({
      template: './options.html',
      filename: 'options.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public', to: './' },
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
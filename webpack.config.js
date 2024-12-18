import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pathBrowserify from 'path-browserify';
import url from 'url';
import util from 'util';
import streamBrowserify from 'stream-browserify';
import buffer from 'buffer';
import cryptoBrowserify from 'crypto-browserify';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './client/js/client.tsx',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.client.json'
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    extensionAlias: {
      '.js': ['.js', '.ts', '.tsx'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts']
    },
    fallback: {
      "path": false,
      "url": false,
      "util": false,
      "stream": false,
      "buffer": false,
      "crypto": false,
      "fs": false,
      "http": false,
      "net": false,
      "zlib": false,
      "tls": false,
      "https": false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  ],
  devtool: 'source-map',
  target: ['web', 'es2020']
};
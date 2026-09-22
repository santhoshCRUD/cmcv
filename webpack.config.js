import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { InjectManifest } from 'workbox-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin'; // For JS minification
import WebpackPwaManifest from 'webpack-pwa-manifest'; // Import the manifest plugin
import CompressionPlugin from 'compression-webpack-plugin'; // For PDF compression

export default {
  mode: 'production', // Set to 'development' for production builds

  entry: {
    // main: './app.js', // Ensure you have an entry point for your main JS
    styles: './styles/styles.scss',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve('dist'),
    publicPath: '/', // Ensure proper routing
  },
  // devServer: {
  //   static: path.resolve('dist'),  // Serve content from the 'dist' folder
  //   port: 9000,                     // Use any available port
  //   open: true,                     // Automatically open the app in the browser
  //   historyApiFallback: true,       // For SPA routing
  // },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          sources: {
            urlFilter: (attribute, value, resourcePath) => {
              if (value && value.includes('assets/')) {
                return false;
              }
              return true;
            },
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext][query]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    realContentHash: false, // Prevent hashing based on content for better caching
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
      // Uncomment if you want to minify CSS
      // new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './favicon.ico',
    }),
    new WebpackPwaManifest({
      filename: 'manifest.webmanifest',
      name: "CMCVCONNECT",
      short_name: "CMCVCONNECT",
      description: "Your Gateway to Campus, Wherever You Go",
      display: "standalone",
      theme_color: "#cccccc",
      background_color: "#ffffff",
      scope: "/",
      start_url: "/?source=pwa",
      id: "/?source=pwa",
      dir: "ltr",
      lang: "nl-NL",
      orientation: "any",
      version: "1.0.84",
      inject: true,
      fingerprints: false,
      ios: true,
      icons: [
        {
          src: path.resolve('images/icons/icon-16x16.png'),
          sizes: '16x16',
          type: 'image/png'
        },
        {
          src: path.resolve('images/icons/icon-32x32.png'),
          sizes: '32x32',
          type: 'image/png'
        },
        {
          src: path.resolve('images/icons/icon-48x48.png'),
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: path.resolve('images/icons/icon-180x180.png'),
          sizes: '180x180',
          type: 'image/png'
        },
        {
          src: path.resolve('images/icons/icon-192x192.png'),
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: path.resolve('images/icons/icon-512x512.png'),
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }),
    new InjectManifest({
      swSrc: './service-worker.js',
      swDest: 'service-worker.js',
    }),

    new CompressionPlugin({
      test: /\.pdf$/, // Apply compression specifically for PDF files
      filename: '[path][base].gz', // Create compressed versions with .gz extension
      algorithm: 'gzip',           // Use gzip compression
      threshold: 10240,            // Compress files larger than 10 KB
      minRatio: 0.8,               // Minimum compression ratio
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'images', to: 'images' },
        { from: 'utils.js', to: 'utils.js' },
        { from: 'assets', to: 'assets' },

      ],
    }),
  ],
};

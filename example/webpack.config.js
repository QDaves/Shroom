const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
      filename: "[name].[fullhash].js",
      path: path.resolve(__dirname, "dist/webpack"),
    },
    devtool: "source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".mjs"],
      fallback: { "buffer": false, "timers": false }
    },
    optimization: { splitChunks: { chunks: 'all' }, runtimeChunk: true, minimizer: [] },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env', '@babel/preset-typescript']
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|bmp)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({}),
      new HtmlWebpackPlugin({
        template: "./src/index.ejs",
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      port: 8081
    }
  };
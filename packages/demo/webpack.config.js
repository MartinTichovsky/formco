const fs = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const openBrowser = require("react-dev-utils/openBrowser");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");

const outDir = path.resolve(__dirname, "build");
const port = 9000;
let webOpened = false;

module.exports = (env = {}, argv = {}) => {
  const isEnvProduction = argv.mode !== "development";

  return {
    devtool: !isEnvProduction ? "source-map" : false,
    devServer: {
      static: {
        directory: path.join(__dirname, "build")
      },
      compress: true,
      port
    },
    entry: "./src/index",
    mode: isEnvProduction ? "production" : "development",
    resolve: {
      extensions: [".js", ".json", ".ts", ".tsx"]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        {
          oneOf: [
            {
              test: /\.tsx?$/,
              exclude: /node_modules|\.d\.ts$/,
              use: {
                loader: "ts-loader",
                options: {
                  onlyCompileBundledFiles: true,
                  transpileOnly: !isEnvProduction,
                  configFile: "tsconfig.build.json",
                  projectReferences: true
                }
              }
            },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: [
                isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 1,
                    sourceMap: false
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: isEnvProduction,
      ...(isEnvProduction
        ? {
            splitChunks: {
              chunks: "all",
              name: false
            },
            runtimeChunk: {
              name: (entrypoint) => `runtime-${entrypoint.name}`
            }
          }
        : {})
    },
    output: {
      path: outDir,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js"
    },
    performance: false,
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: path.resolve(__dirname, "public/index.html")
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                }
              }
            : undefined
        )
      ),
      new webpack.DefinePlugin({ "process.env": {} }),
      !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
      !isEnvProduction &&
        new ReactRefreshWebpackPlugin({
          overlay: {
            entry: require.resolve("react-dev-utils/webpackHotDevClient"),
            module: require.resolve("react-dev-utils/refreshOverlayInterop"),
            sockIntegration: false
          }
        }),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
            fs.copySync(path.resolve(__dirname, "public"), outDir, {
              dereference: true,
              filter: (file) => !file.endsWith("index.html")
            });

            if (!isEnvProduction && !webOpened) {
              webOpened = true;
              openBrowser(`http://localhost:${port}`);
            }
          });
        }
      }
    ].filter(Boolean)
  };
};

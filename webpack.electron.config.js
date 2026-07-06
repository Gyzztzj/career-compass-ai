const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = [
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: "./electron/main.ts",
    target: "electron-main",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "electron/dist"),
    },
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.electron.json",
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.DASHSCOPE_API_KEY": JSON.stringify(
          process.env.DASHSCOPE_API_KEY,
        ),
      }),
    ],
    externals: {
      electron: "commonjs2 electron",
    },
  },
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: "./electron/preload.ts",
    target: "electron-preload",
    output: {
      filename: "preload.js",
      path: path.resolve(__dirname, "electron/dist"),
    },
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.electron.json",
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    externals: {
      electron: "commonjs2 electron",
    },
  },
];

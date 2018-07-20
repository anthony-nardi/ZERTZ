const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 8000
  }
};

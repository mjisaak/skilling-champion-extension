const path = require("path");

module.exports = {
  entry: {
    main: path.join(__dirname, "../main.ts"),
    options: path.join(__dirname, "../options.ts"),
  },
  output: {
    path: path.join(__dirname, "./../../dist/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};

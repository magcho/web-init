module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './src/js/index.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  devtool: 'sourcemaps',
  module:{
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};

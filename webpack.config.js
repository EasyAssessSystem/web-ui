var webpack = require('webpack');

module.exports = {
  entry: {
    app:[
     'webpack-dev-server/client?http://localhost:8080',
     'webpack/hot/only-dev-server',
     './src/application.js'
    ],
    form:[
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/formeditor.js'
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  module:{
    loaders:[
      {test:/\.css$/,loader:'style!css'},
      {test:/\.html$/,loader:'ng-cache-loader'}
    ]
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // Wire in the hot loading plugin
  ]
};

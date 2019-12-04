const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  // plugins: [
  //   new DeclarationBundlerPlugin({
  //     moduleName: 'index',
  //     out: 'index.d.ts',
  //   })
  // ]
}

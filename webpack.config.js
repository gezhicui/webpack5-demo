const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

console.log('process.env.NODE_ENV=', process.env.NODE_ENV); // 打印环境变量

const config = {
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist'), // 输出文件目录
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/, //匹配所有的 css和less 文件
        /* 
          1、less-loader处理less文件
          2、postcss-loader自动添加 CSS3 部分属性的浏览器前缀
          3、css-loader可以处理样式文件
          4、MiniCssExtractPlugin.loader用来替代style-loader，把css抽离出js，并自动在html使用link引入
        */
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      // 分离css样式文件
      filename: '[name].[hash:8].css',
    }),
  ],
  devServer: {
    // webpack 在进行打包的时候，对静态文件的处理，例如图片，都是直接 copy 到 dist 目录下面。但是对于本地开发来说，这个过程太费时，也没有必要，所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，而不需对文件做任何移动，节省了时间和性能开销。
    static: {
      directory: path.join(__dirname, 'public'),
    },
    //启动gzip压缩
    compress: true,
    //端口
    port: 8080,
    //自动打开默认浏览器
    open: true,
  },
};

module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode); // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        test: /\.css$/, //匹配所有的 css 文件
        use: 'css-loader', // use: 对应的 Loader 名称
      },
    ],
  },
  plugins: [
    // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/img',
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

const path = require('path');
const glob = require('glob'); // 文件匹配模式
// 生成html文件，自动引入js
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 打包之前清除dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// css代码抽离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css压缩
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// js压缩
const TerserPlugin = require('terser-webpack-plugin');
// 单独提取 CSS 并清除用不到的 CSS  好像不生效，先注释掉
// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

console.log('process.env.NODE_ENV=', process.env.NODE_ENV); // 打印环境变量

function resolve(dir) {
  return path.join(__dirname, dir);
}

const PATHS = {
  src: path.join(__dirname, 'src'),
};
console.log('parh000000--------------', glob.sync(`${PATHS.src}/**/*.css`, { nodir: true }));

const config = {
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist'), // 输出文件目录
    // publicPath: './',
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
      {
        test: /\.(jpg|png|jpeg|gif|svg)$/,
        type: 'asset',
        generator: {
          filename: 'image/[name].[hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.js$/i,
        // 解析src下的模块
        include: resolve('src'),
        // 排除node_modules
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包
            options: {
              worker: 3,
            },
          },
          {
            //使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
            loader: 'babel-loader',
            options: {
              // @babel/preset-env : Babel 编译的预设，可以理解为 Babel 插件的超集
              presets: ['@babel/preset-env'],
              cacheDirectory: true, // 启用缓存
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 引入插件
    // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      // 分离css样式文件
      filename: '[name].[hash:8].css',
    }),

    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // }),
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
  resolve: {
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      components: resolve('src/components'),
    },
    // 如果用户引入模块文件时不带扩展名，webpack 就会按照 extensions 配置的数组从左到右的顺序去尝试解析模块,'...'为兼容默认配置
    extensions: ['.ts', '...'],
    // 告诉 webpack 优先 src 目录下查找需要解析的文件
    modules: [resolve('src'), 'node_modules'],
  },

  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
      // 在生产环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置。
      new TerserPlugin({}),
    ],
  },
};

module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode); // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置，smp.wrap（）为费时分析的方法
  return config;
};

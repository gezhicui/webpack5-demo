// 避免 webpack.config.js 太臃肿,将 Babel 配置文件提取出来,也可以全在config中配
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        useBuiltIns: 'entry',
        corejs: '3.9.1', // 是 core-js 版本号
        targets: {
          chrome: '58',
          ie: '11',
        },
      },
    ],
  ],
  // 使用插件处理目前尚未支持的语法
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};

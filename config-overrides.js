// 使用自定义引入UI组件的配置文件
const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(fixBabelImports('import', {
  libraryName: 'antd',
  libraryDirectory: 'es',
  style: true,
}),
  // 添加less加载器，打包时将less代码转为css代码（要下 less less-loader这两个包）
  addLessLoader({
    javascriptEnabled: true,
    // 修改主题色为#1DA57A
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
);


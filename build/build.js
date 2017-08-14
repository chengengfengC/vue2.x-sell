// https://github.com/shelljs/shelljs
require('./check-versions')(); // 添加版本判断文件
require('shelljs/global');
env.NODE_ENV = 'production';

var path = require('path');
var config = require('../config');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.conf');

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
);

var spinner = ora('building for production...');
spinner.start();

// 这里的几句是将static目录下的所有文件拷贝到dist/static目录下
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
rm('-rf', assetsPath);
mkdir('-p', assetsPath);
cp('-R', 'static/', assetsPath);

// 打包结束，输出最终信息
webpack(webpackConfig, function (err, stats) {
  spinner.stop();
  if (err) throw err;
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n');
});

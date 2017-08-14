require('./check-versions')(); // 添加版本判断文件
var config = require('../config');
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var opn = require('opn'); // 基于node.js的包能打开指定的浏览器
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();

/* webpack 模拟数据start */

// 从webpack的入口文件开始这里写我们自己的代码
// 先获取模拟的数据文件
// var appData = require('../data.json');
// 商家数据
// var seller = appData.seller;
// 商品信息
// var goods = appData.goods;
// 评价列表
// var ratings = appData.ratings;

// 开始编写路由
// var apiRoutes = express.Router();

// 商家的请求的接口,两个参数request 和 response 返回json数据
// apiRoutes.get('/seller', function(req, res) {
//   res.json({
//     errno: 0,
//     data: seller
//   });
// });

// 商品的请求接口
// apiRoutes.get('/goods', function(req, res) {
//   res.json({
//     errno: 0,
//     data: goods
//   });
// });

// 评论的请求接口
// apiRoutes.get('/ratings', function(req, res) {
//   res.json({
//     errno: 0,
//     data: ratings
//   });
// });

// 使用express调用上面的接口，express 对应的就是 app
// use 两个参数，第一个是路径(path)，第二个是具体路由
// 下面的写法我们就可以他通过 /api/goods就能请求到数据
// 例如：http://localhost:8080/api/ratings
// app.use('/api', apiRoutes);

/* webpack 模拟数据end */

var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
});

var hotMiddleware = require('webpack-hot-middleware')(compiler);
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

var uri = 'http://localhost:' + port;

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n');
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri); // 在浏览器中打开指定的链接
  }
});

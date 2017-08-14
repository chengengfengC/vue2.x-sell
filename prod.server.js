/**
 * 创建一个 node 我们自己的http-server文件
 */
var express = require('express');
var config = require('./config/index');

// 等于当前环境下的port，如果不存在则使用config/index下面的build的自定义 port
var port = process.env.port || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
  req.url('/index.html');
  next();
});

// 定义异步接口的路由，跟我们config/dev-server.js 一样的代码
// 从webpack的入口文件开始这里写我们自己的代码
// 先获取模拟的数据文件
var appData = require('./data.json');
// 商家数据
var seller = appData.seller;
// 商品信息
var goods = appData.goods;
// 评价列表
var ratings = appData.ratings;

// 开始编写路由
var apiRoutes = express.Router();

// 商家的请求的接口,两个参数request 和 response 返回json数据
apiRoutes.get('/seller', function(req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

// 商品的请求接口
apiRoutes.get('/goods', function(req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

// 评论的请求接口
apiRoutes.get('/ratings', function(req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

// 使用express调用上面的接口，express 对应的就是 app
// use 两个参数，第一个是路径(path)，第二个是具体路由
// 下面的写法我们就可以他通过 /api/goods就能请求到数据
// 例如：http://localhost:8080/api/ratings
app.use('/api', apiRoutes);

app.use(express.static('./dist'));

// 启动express
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n');
});


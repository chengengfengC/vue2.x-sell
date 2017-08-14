import Vue from 'vue';
import VueRouter from 'vue-router'; // 导入vue-router，因为vue-router的package里面的name 就叫vue-router 所以我们直接import他的name就可以了，然后赋值给VueRouter这个变量
import VueResource from 'vue-resource'; // 导入vue-resource
import App from './App';
// 引入自定义的tab区域的内容组件，可省略后缀名
import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';

// webpack的特性，可以再js里面引用css，这里引用全局css
import 'common/stylus/index.styl';

Vue.use(VueRouter); // 注册vue-router 组件
Vue.use(VueResource); // 注册vue-resource 组件

const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

// 实例化一个router
const router = new VueRouter({
  linkActiveClass: 'active', // 配置自定义的选中样式名称
  routes
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App) // 让我们可以通过JavaScript的方式去初始化一个模板,吧APP组件传入然后就可以去渲染 app 组件
});

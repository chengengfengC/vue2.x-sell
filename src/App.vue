<template>
  <div>
    <v-header v-bind:seller="seller"></v-header>

    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <!--  router-view 用来渲染 vue-router 指定的路由对应的组件  这里是指路由切换时要刷新的视图 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>

  </div>
</template>

<script ype="text/ecmascript-6">
  import header from 'components/header/header.vue';
  import {urlParse} from 'common/js/util';
  import sellerData from 'common/json/seller.js';
  
  // const ERR_OK = 0;

  export default {
    // 通过data方法获取数据 完整写法 data: function(){}
    data() {
      return {
        seller: { // 将id 赋值给seller.id
          id: (() => {
            let queryParam = urlParse();
            console.log('urlParam');
            console.log(queryParam);
            return queryParam.id;
          })() // 这个是一个立即执行函数
        }
      };
    },
    created() {
      console.log(sellerData);
      this.seller = Object.assign({}, this.seller, sellerData);

      /* webpack 模拟数据start */
      // this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      //   // success
      //   // response = response.json(); // 将返回的对象使用内置的方法转化为json对象，这个json() 方法是0.9x的版本，我们是1.x，需要用body
      //   response = response.body;
      //   if (response.errno === ERR_OK) {
      //     // this.seller = response.data;
      //     // 使用es6中给对象扩展属性的方法 这样子seller中的id就不会被干掉
      //     this.seller = Object.assign({}, this.seller, response.data);
      //     console.log('seller');
      //     console.log(this.seller);
      //   }
      // }, (response) => {
      //   // faild
      //   console.log('send ajax get faild .....');
      // });
      /* webpack 模拟数据end */
    },
    components: { // 注册 header 注册完了之后就可在标签中使用 v-header 标签了
       'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "./common/stylus/mixin.styl"
  // tab区域
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      // border-bottom:1px solid rgba(7,17,27,.1)
      border-1px(rgba(7,17,27,.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77,85,93)
          // a 的激活状态,样式名称与main.js配置的一致性
          &.active 
            color: rgb(240, 20, 20)
</style>

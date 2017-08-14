<!--
  商家详情页
-->
<template>
  <div class="seller" ref="seller">
    <div class="seller-content">  
      <div class="overview"> <!-- 商家概况 -->
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">  <!--商家评分-->
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark"> <!-- 商家名称下面的三等分-->
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!-- 收藏商家 -->
        <div @click="toggleFavorite" class="favorite">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <!--   -->
      <split></split>
      <!-- 公告与活动  -->
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <!--优惠信息列表-->
         <ul v-if="seller.supports" class="supports">
           <li class="supports-item border-1px" v-for="(item, index) in seller.supports" :key="index">
             <!--根据每一个的索引和下标去取对应的样式-->
             <span class="icon" :class="classMap[seller.supports[index].type]"></span>
             <span class="text">{{ seller.supports[index].description }}</span>
           </li>
         </ul>
      </div>
      <!--  -->
      <split></split>
      <!-- 商家实景轮播图 -->
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper"> <!--用来固定视口大小，超出部分才能使用bscroll 滚动-->
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <!--  -->
      <split></split>
      <!-- 商家信息 -->
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript">
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/store'; // 引入存储方法loadFromLocal
  import star from 'components/star/star';
  import split from 'components/split/split';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // favorite: false // 写死的
        favorite: (() => { // 用一个立即执行函数读取本地数据
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    watch: { // 观测seller的更新
      'seller'() { // 这里观测一开始没有的东西，才能正确获取到并操作，因为seller一开始就是一个空的Object，所以pics肯定也是没有的
       this.$nextTick(() => {
          this._initScroll();
          this._initPics();
        });
      }
    },
    created() {
      // 这里样式名称的是根据supports的type来的
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    mounted() { // 2.x 使用mounted方法替换 1.x 的ready()方法
      this.$nextTick(() => {
        this._initScroll();
        this._initPics();
      });
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        // 手动计算 图片 ul 和 外层的pic-wrapper的大小，bscroll 滚动的原理是 内层超过外层才能滚动，不然无效，也就是 ul 要大小 pic-wrapper 才行，现在两个大小一致，所以要在这里手动计算
        if (this.seller.pics) { // 获取seller中的商家图片
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length;
          this.$refs.picList.style.width = width + 'px';
          // BScroll横向滚动
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .seller 
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview // 商家概况
      position: relative
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc // 商家评分
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark // 配送信息等，三等分部分
        display: flex
        padding: 18px
        .block
          flex: 1 // 设置为1，自动占据大小
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, .1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite // 收藏
        position: absolute
        width: 50px // 设置一下宽度才不会出现那种文字切换看起来变动的感觉
        right: 11px
        top: 18px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text // 收藏的文本
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin // 公告与优惠
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, .1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports // 优惠
        .supports-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, .1))
          font-size: 0
        .icon // 优惠图标
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease // 减
            bg-image('decrease_4')
          &.discount // 折
            bg-image('discount_4')
          &.guarantee // 套餐
            bg-image('guarantee_4')
          &.invoice // 票
            bg-image('invoice_4')
          &.special // 保
            bg-image('special_4')
        .text
          line-height: 16px
          font-size: 12px
          font-weight 
          color: rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list 
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info 
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, .1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7, 17, 27, .1))
        font-size: 12px
        border: none
</style>
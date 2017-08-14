<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <!-- 返回按钮 -->
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <!-- 商品名称等概况 -->
        <div class="content">
          <h1 class="title"> {{ food.name }}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{ food.rating}}%</span>
          </div>
          <div class="price"> <!--价格-->
            <span class="now">￥{{food.price}}</span><span class="old"  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <!-- 购物车按钮 -->
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <!-- transition="fade" 加入动画延迟隐藏时间，防止元素被隐藏，抛物线动画获取不到元素无法计算位置 小球位置错乱的问题  -->
	  <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
	  </transition>
        </div>
        <!-- 上下边框组件 -->
        <split v-show="food.info"></split>
        <!-- 商品介绍 -->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <!-- 商品评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 传递当前商品的评价到 ratingselect组件  -->
          <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <!-- 评价 列表start  -->
          <div class="rating-wrapper">  
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index) in food.ratings" class="rating-item border-1px" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="user" width="12" height="12" class="avatar">
                </div>
                <!-- 评价时间 ，使用自定义过滤器格式化事件 -->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <!-- 评价内容 -->
                <p class="text">
                  <!-- 评价的图标类型和文本  -->
                  <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down': rating.rateType===1}"></span>
                  <span>{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecscript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import { formatDate } from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

  const ALL = 2; // 所有评价

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() { // data 用来观测数据变化
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() { // 显示food组件的方法
        this.showFlag = true;
        /* 每次这个组件层show的时候把评价的变量在初始化一遍，因为每个商品进来的时候评价的状态都需要是初始状态 */
        this.selectType  = ALL;
        this.onlyContent = true;
        this.$nextTick(() => { 
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() { // 返回按钮
        this.showFlag = false;
      },
      addFirst(event) 
        if (!event._constructed) {
          return;
        } 
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      needShow(type, text) { // 需要显示的评价类型
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType == ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      addFood(target) {
        this.$emit('add', target);
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate(time) { // 将评价的时间戳转换成 年月日，时分
        let date = new Date(time); // 先把时间戳转换成date格式
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px /*空出底部购物车的距离*/
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0 ,0 ,0)
    &.move-enter-active, &.move-leave-active // 食品层进入动画
      transition: all .2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header // 食品大图片  /*这里实现的效果就是图片不设定高度，即使图片加载不出来，也依然占据着固定的空间  图片布局 start*/
      position: relative
      width: 100%
      height: 0
      padding-top: 100% /*这里也可以是padding-bottom 这么做是可以让整个div看起来是宽高相等的样子*/
      img
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100% /* 图片布局 end*/
      .back // 返回按钮
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content // 商品层
      position: relative
      padding: 18px
      .title // 商品名
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)    
      .detail // 商品详细
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating // 月销量和好评率  
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price // 价格
        font-weight: 700 
        line-height: 24px
        .now // 现价
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old // 原价
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
    .cartcontrol-wrapper // 购物车加减按钮组件
      position: absolute
      right: 12px
      bottom: 12px
    .buy // 加入购物车按钮
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff;
      background: rgb(0, 160, 220)
      opacity: 1
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.2s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        z-index: -1
    .info // 商品详情
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text // 商品介绍
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating // 商品评价
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper // 评价区域
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, .1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)



</style>
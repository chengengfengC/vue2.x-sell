<!--
  商户评价页
-->
<template>
  <div class="ratings" ref="ratings">
   <div class="ratings-content">
     <!-- 评分层和评星层 -->
     <div class="overview">
      <div class="overview-left"> <!-- 商家总评分 -->
        <h1 class="score">{{seller.score}}</h1>
        <div class="title">综合评分</div>
        <div class="rank">高于周边商家{{seller.rankRate}}%</div>
      </div>
      <div class="overview-right"> <!-- 商家评星 -->
        <div class="score-wrapper">
          <span class="title">服务态度</span>
          <star :size="36" :score="seller.serviceScore"></star>
        </div>
        <div class="score-wrapper">
          <span class="title">商品评分</span>
          <star :size="36" :score="seller.foodScore"></star>
        </div>
        <div class="delivery-wrapper">
          <span class="title">送达时间</span>
          <span class="delivery">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
     </div>
     <split></split> <!--使用分割线组件-->
     <ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingselect> <!--使用评价组件-->
     <div class="rating-wrapper"> <!--用户对商户的评价-->
        <ul>
          <li v-for="(rating, index) in ratings" :key="index" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
     </div>
   </div> 
  </div>

</template>

<script>
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  import { formatDate } from 'common/js/date';
  import BScroll from 'better-scroll'; // 导入滚动类库
  import ratingsData from 'common/json/ratings.js';

  const ALL = 2; // 所有评价
  // const ERR_OK = 0;

  export default {
    props: { // 接收 APP.vue 中的 router-view 传递的 seller 对象
      seller: {
        type: Object
      }
    },
    data() { // data 用来观测数据变化
      return {
        ratings: [], // 存放评价
        selectType: ALL, // 继续对ratingselect组件变量的跟踪
        onlyContent: true
      };
    },
    created() {
      this.ratings = ratingsData;
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        });
      });

      /* 使用webpack模拟的后端请求 */
      // this.$http.get('/api/ratings').then(function (response) {
      //   response = response.body;
      //   if (response.errno === ERR_OK) {
      //     this.ratings = response.data;
      //     this.$nextTick(() => {
      //       this.scroll = new BScroll(this.$refs.ratings, {
      //         click: true
      //       });
      //     });
      //   }
      // }, function (response) {
      //   console.log('get resource fail......');
      // });
    },
    methods: {
      needShow(type, text) { // 需要显示的评价类型
        if (this.onlyContent && !text) { // 如果需要显示有内容，并且内容为空则返回
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
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
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .ratings // 商户评价外层
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview // 评分和评星层
      display: flex
      padding: 18px 0
      .overview-left // 评分
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, .1)
        text-align: center
        @media only screen and (max-width: 320px) // 因为iPhone5的width只有320，所以要单独写适配
          flex: 0 0 120px
          width: 120px
        .score // 评分数
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title // 综合评分
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank // 高于...
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right // 评星
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px) // 因为iPhone5的width只有320，所以要单独写适配
          padding-left: 6px
        .score-wrapper // 服务态度评星
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(225, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title // 这里和下面的都是文字和文字，默认是垂直对齐的所以不需要加
            // display: inline-block
            // vertical-align: top
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            font-size: 12px
            margin: 0 12px
            color: rgb(147, 153, 159)
    .rating-wrapper  // 用户对商户的评价
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, .1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper // 评价星级外层
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery // 配送时间
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text // 评价文本
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend// 推荐
            line-height: 16px
            .icon-thumb_up,.item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, .1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 12px
            color: rgb(7, 17, 27)
</style>
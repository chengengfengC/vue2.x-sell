<template>
  <div class="header">
    <!--左边区域-->
    <div class="content-wrapper">
      <!--商家头像区域-->
      <div class="avatar">
        <img width="64" height="64" v-bind:src="seller.avatar" alt="avatar">
      </div>
      <!--右边区域-->    
      <div class="content">
        <!--商家名-->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <!--描述和送达时间-->
        <div class="description">
          {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
        </div>
        <!-- 这里使用v-if 的原因是初始化时seller是空的，传给了header组件，所以这里取值就是seller为undefine,所以下面的获取优惠会报错，所以要加一个v-if判断一下-->
        <div v-if="seller.supports" class="support">
          <span class="icon" v-bind:class="classMap[ seller.supports[0].type ]"></span>
          <!-- 获取优惠的第一条数据 -->
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <!--右边的活动个数按钮-->
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{ seller.supports.length }}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!--底部公告-->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
      <i class="icon-keyboard_arrow_right"></i>      
    </div>
    <!--头部背景图-->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!--公告弹层-->
    <transition name="fade">
      <div v-show="detailShow" class="detail" @click="hideDetail">
        <!--这里开始经典的 sticky footer 布局 -->
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
          <!--公告标题-->
          <h1 class="name">{{ seller.name }}</h1>
          <!--使用自定义的star组件,根据score设置星星数量-->
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <!--弹层星星下面的线条和优惠信息的文字-->
          <!--<div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>-->
          <!--改成组件方式-->
          <v-line text="优惠信息"></v-line>
          <!--弹层的优惠信息列表-->
          <ul v-if="seller.supports" class="supports">
            <li class="supports-item" v-for="(item, index) in seller.supports" :key="index">
              <!--根据每一个的索引和下标去取对应的样式-->
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{ seller.supports[index].description }}</span>
            </li>
          </ul>
          <!--商家公告-->
          <!--<div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>-->
          <!--改成组件方式-->
          <v-line text="商家公告"></v-line>
          <!--商家公告内容-->
          <div class="bulletin">
            <p class="content">{{ seller.bulletin }}</p>
          </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
        <!--sticky footer 布局结束-->
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入star组件
  import star from 'components/star/star';
  import line from 'components/line/line';

  // 导出文件
  export default {
    // 通过 props 属性接收传递过来的参数
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false // 控制弹层的显示
      };
    },
    methods: {
      showDetail: function() { // 显示隐公告层
        this.detailShow = true;
      },
      hideDetail: function() { // 隐藏公告层
        this.detailShow = false;
      }
    },
    created() {
      // 这里样式名称的是根据supports的type来的
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // 注册star组件
    components: {
      star: star,
      'v-line': line
    }
  };
</script>

<!--这里的样式属性值都是设计图的一半-->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .header
    position: relative // 这里作为背景图的定位
    overflow: hidden
    color: #fff
    background: rgba(7,17,27,.5)
    // background: #666
    .content-wrapper // 外层
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .avatar // 头像
        display: inline-block
        vertical-align: top
        img          
          border-radius: 2px
      .content // 头像右侧内容
        display: inline-block
        margin-left: 16px
        .title // 商家名
          margin: 2px 0 8px 0
          .brand // 商家图标
            display: inline-block
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
            vertical-align: top
          .name //
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description // 描述
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support // 优惠
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease // 减
              bg-image('decrease_1')
            &.discount // 折
              bg-image('discount_1')
            &.guarantee // 套餐
              bg-image('guarantee_1')
            &.invoice // 票
              bg-image('invoice_1')
            &.special // 保
              bg-image('special_1')
          .text // 活动文字
            line-height: 12px
            font-size: 10px
            font-weight: 100
      .support-count // 右边活动个数
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0,0,0,.2)
        text-align: center
        .count
          vertical-align: top
          line-height: 24px        
          font-size: 12px
        .icon-keyboard_arrow_right
          vertical-align: top
          margin-left: 2px
          line-height: 24px
          font-size: 12px
    .bulletin-wrapper // 公告
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7,17,27,.2)
      .bulletin-title // 公告图片
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        margin: 0 4px
        font-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background // 背景图片
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      // 设置背景图片模糊
      filter: blur(10px) 
    .detail // 公告弹层
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: auto
      backdrop-filter: blur(10px) //  弹层背景模糊。IOS时才有效果
      opacity: 1
      background: rgba(7,17,27,.8)
      transform: translateX(0)
      &.fade-enter-active, &.fade-leave-active // 弹层过渡动画，最终状态
        transition: all .5s
      &.fade-enter, &.fade-leave-active //  进入和离开时的状态，这里需要写fade-leave-active 才会有从 1 -》 0 的效果，不然不会有效果
        opacity: 0
        transform: translateX(-100%)
        backgroun: rgba(7, 17, 27, 0)
      .detail-wrapper // 弹层的容器层
        width: 100%
        min-height: 100%
        .detail-main   
          margin-top: 64px
          padding-bottom: 64px
          .name // 弹层详情开始
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 16px
            padding:2px 0
            text-align: center
          // .title // 弹层的线条和优惠信息文字
          //   display: flex
          //   width: 80%
          //   margin: 28px auto 24px auto
          //   .line // 自适应的线条
          //     flex: 1 // 等分
          //     position: relative
          //     top: -6px
          //     border-bottom: 1px solid rgba(255, 255, 255, .2)
          //   .text // 优惠文字
          //     padding: 0 12px
          //     font-weight: 700
          //     font-size: 14px
          .supports // 优惠列表
            width: 80%
            margin: 0 auto
            .supports-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon // 优惠图标
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease // 减
                  bg-image('decrease_2')
                &.discount // 折
                  bg-image('discount_2')
                &.guarantee // 套餐
                  bg-image('guarantee_2')
                &.invoice // 票
                  bg-image('invoice_2')
                &.special // 保
                  bg-image('special_2')
              .text // 优惠文字
                line-height: 16px
                font-size: 12px
          .bulletin // 商家公告
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
      .detail-close // 关闭的图标
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size: 32px



</style>
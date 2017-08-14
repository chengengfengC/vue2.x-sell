<!--
  商品详情评价及店家评价组件
-->
<template>
  <div class="ratingselect">
    <!-- 评价的三种类型 全部、推荐、吐槽 -->
    <div class="rating-type border-1px">
      <span @click="select(2, $event)" class="block positive" :class="{'active': selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0, $event)" class="block positive" :class="{'active': selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1, $event)" class="block negative" :class="{'active': selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <!-- 是否只看有评价内容的勾选按钮  onlyContent 为 true添加 on 样式-->
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有评价的内容</span>
    </div>
  </div>
</template>

 <script type="text/ecmascript-6">
  const POSITIVE = 0; // 好评
  const NEGATIVE = 1; // 差评
  const ALL = 2; // 所有评价
  
  export default {
    props: { // 主要是用来接收评价条数和显示的文案
    ratings: {
        type: Array,
        default() { // 数组的默认必须是对象形式
          return [];
        }
      },
      selectType: { // 选择的评价类型
        type: Number,
        default: ALL
      },
      onlyContent: { // 是否只看有内容的评价
        type: Boolean,
        default: false
      },
      desc: { // 评价类型的显示的文案，当父子间传递数据进来的时候，这边就会被替换成传递过来的数据
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: {
      positives() { // 计算好评条数 使用过滤器拦截，data.json 里面的 rateType 正好是 0 或 1
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() { // 计算差评条数
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type, event) { // 改变查看的评价内容和评价样式
        if (!event._constructed) {
          return;
        }
        // 子组件派发事件，改变父组件(food)的 ratingType 状态
        this.$emit('select', type);
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        // 子组件派发事件，改变父组件（food)的 ratingType 状态
        this.$emit('toggle');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .ratingselect
    .rating-type // 评价类别
      padding: 18px 0 
      margin: 0 18px 
      border-1px(rgba(7, 17, 27, .1))
      font-size: 0 // 去除inline-block 产生的间隙
      .block // 评级类别公共样式
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px 
          font-size: 8px
        &.positive // 好评
          background: rgba(0, 160, 220, .2)
          &.active
            background: rgb(0, 160, 220)
        &.negative 
          background: rgba(77, 85, 93, .2)
          &.active 
            background: rgb(77, 85, 93)
    .switch // 是否只查看有内容的评价
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, .1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
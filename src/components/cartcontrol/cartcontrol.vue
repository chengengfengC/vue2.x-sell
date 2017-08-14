<!--
  商品加减按钮组件
-->
<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="txt/ecmascript-6">
  import Vue from 'vue';
  
  export default {
    props: {
      food: { // 传入商品
        type: Object,
      }
    },
    created() {
      // console.log(this.food);
    },
    methods: {
      addCart(event) { // 增加按钮点击事件
        if (!event._constructed) {  // 跟goods组件一样防止在pc端执行两次
          return;
        }
        console.log(`点击了增加按钮了`);
        if (!this.food.count) { // 如果food.count不存在也就是第一次点击
          // this.food.count = 1;
          Vue.set(this.food, 'count', 1); // 新增加一个不存在的属性需要用set接口才能检测到变化
        }else {
          this.food.count++;
        }
        /* 此处派发自定义事件，触发shopcart组件里面的小球动画,并且传入当前点击的元素 */
        this.$emit('add', event.target);
      },
      decreaseCart(event) { // 减少按钮点击事件
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      transition: all .4s linear
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner // 减按钮外层
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all .4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
    
      
</style>
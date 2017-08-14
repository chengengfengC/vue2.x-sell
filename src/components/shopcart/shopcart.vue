<template>
  <div>
    <div class="shopcart">
      <!-- 底部购物车主体  -->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <!--购物车的logo,，有一个外层容器包装它-->
          <div class="logo-wrapper">  <!--判断商品数量动态添加样式-->
            <div class="logo" :class="{'highlight':totalCount >0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount > 0}"></i>
            </div>
            <!--显示选中多少商品-->
            <div v-show="totalCount>0" class="num">{{totalCount}}</div>
          </div>
          <!--购物车旁边的价格和配送费-->
          <div class="price" :class="{'highlight':totalPrice > 0}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay"> <!-- 阻止点击结算的事件冒泡（弹出购物车列表层） -->
          <div class="pay" :class="payClass"> <!--还可以绑定一个方法-->
            <!--￥{{ minPrice }}元起送-->
            {{payDesc}} <!---获取计算属性动态改变提示为文字-->
        </div>
        </div>
      </div>
      <!-- 购物车动画的小球  -->
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 购物车列表展示 -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="emptyShopCart">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!-- 购物车弹出的黑色遮罩层 -->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'; // 导入滚动类库
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
    props: { // 获取子组件goods传递过来的参数
      selectFoods: { // 获取选中的商品，来计算价格
        type: Array,
        default() { // vue 里面如果类型是一个Array或者Object，那么默认值就是一个函数
          return [
            {
              price: 0,
              count: 0
            }
          ];
        }
      },
      deliveryPrice: { // 配送费
        type: Number,
        default: 0 // 设置默认值
      },
      minPrice: { // 多少元起送
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [ // 要执行动画时的显示的小球
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [], // 执行过后的小球
        fold: true
      };
    },
    computed: {
      // 计算数组中选中商品的总价
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() { // 返回选中商品的总数
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() { // 右侧按钮的状态显示，还差多少元，立即购买等
        if (this.totalPrice === 0) {
          // return '￥'+this.minPr';
          // 也可以使用ES6 的形式写 `` ${获取的值}
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() { // 判断按钮使用哪一个class
        if (this.ttalPrice < this.minPrice) {
          return 'no-enough';
       } else {
          return 'enough';
        }
      },
      listShow() { // 是否可以显示购物车列表
        if (!this.totalCount) { // this.totalCount < 0
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => { // 调用 BSCroll插件
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh(); // 因为listShow 是不断变化的，这里调用Bscroll的刷新接口
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el) {
        console.log(el);
        // 找到所有隐藏的小球设置成true
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el; // 存入当前的dom元素，以便动画函数里面使用
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() { // 购物车的是否折叠状态
        if (!this.totalCount) { // 当购物车候
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      emptyShopCart() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}`);
      },
      addFood(target) {
        this.drop(target);
      },
      beforeDrop(el) {
        let count = this.balls.length; // 拿到所有要做动画的小球
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); // 浏览器的接口，返回的是一个矩形的四个值
            let x = rect.left - 32; // 减去设定的小球的位置
            // 窗体的高度减去当前按钮的高度在减去设定的小球的高度
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = ''; // 显示小球
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webktiTransform = `transform3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) { // enter 和leave中必须使用done，否则动画过渡会立即完成，就是要告诉vue什么时候动画结束了的意思
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; // 触发浏览器重绘，才能隐藏动画过后的小球
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webktiTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); // transitionend css3 提供事件，监听transition的结束
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift(); // 移除动画结束之后的小球
        if (ball) {
          ball.show = false; // 重置小球的状态
          el.style.display = 'none';
        }
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .shopcart // 购物车外层
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content // 购物车内层
      display: flex
      background: #141d27
      font-size: 0      
      color: rgba(255, 255, 255, .4)
      .content-left // 购物车左边自适应区域
        flex: 1
        .logo-wrapper // 购物车图标外层
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo // 购物车 logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight // 当商品个数大于 0时的图标样式
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight // 当商品个数大于 0时的个数样式
                color: #fff
          .num // 选中商品数量
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price // 选中的商品价格
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box   
          border-right: 1px solid rgba(225, 255, 255, .1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc // 还需多少钱配送提示文字
          display: inline-block
          vertical-align: top 
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right // 购物车右边固定宽度区域
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align : center
          font-size: 12px
          font-weight: 700
          background: #23333b
          &.not-enough
            background: #23333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container // 动画小球的层
      .ball // 小球的动画的最终位置
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)// 小球的动画使用贝塞尔曲线
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list // 购物车列表样式
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 21, .1)
        .title
          float: left
          font-size: 14px
          color:rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, .1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
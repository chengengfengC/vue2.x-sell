<template>
  <div class="line">
    <div class="title">
      <div class="line"></div>
      <div class="text">{{ text }}</div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    // props: {
    //   text: {
    //     type: String
    //   }
    // }
    props: ['text'] // 直接简写方式，不指定类型
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .line
    .title // 弹层的线条和优惠信息文字
      display: flex
      width: 80%
      margin: 28px auto 24px auto
      .line // 自适应的线条
        flex: 1 // 等分
        position: relative
        top: -6px
        border-bottom: 1px solid rgba(255, 255, 255, .2)
      .text // 优惠文字
        padding: 0 12px
        font-weight: 700
        font-size: 14px
</style>
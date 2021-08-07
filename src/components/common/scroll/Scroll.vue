<template>
  <!-- 类名与外界相同也不要紧，style有个scoped属性会限制作用域的 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// !!! 视频用的是1.13.2版本，用最新版本不行
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  data() {
    return {
      scroll: null, //把scroll对象存在这个组件的数据里面保留
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // 不要用document.querySelector获取 dom可能也会有wrapper
    // 用id也不行，多个页面可能会用这个组件，id不能重复
    // 使用ref获取
    //1. new BScroll(指定挂载,对象要求)
    this.scroll = new BScroll(this.$refs.wrapper, {
     
      click: true, // div的点击需要加这个属性
      probeType: this.probeType, // 监听位置
      pullUpLoad: this.pullUpLoad, // 上拉
      //   observeDOM: true, //这个如果不设置，滚动条会失效
    });
    // 2.监听滚动的位置
    this.scroll.on("scroll", (position) => {
      // console.log(position);
      this.$emit("scroll", position);
    });
    // 3.监听scroll滚动到底部 上拉加载更多
    this.scroll.on("pullingUp", () => {
      // console.log('上拉');
      this.$emit("pullingUp");
    });
  },
  methods: {
    // 点击回到某个位置
    scrollTo(x, y, time = 300) {
      this.scroll.scrollTo(x, y, time);
    },
    // 完成上拉加载
    finishPullUp() {
      this.scroll.finishPullUp();
    },
  },
};
</script>

<style scoped>
</style>
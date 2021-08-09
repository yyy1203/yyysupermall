<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    <!-- 选项卡 -->
    <TabControl
      :titles="['流行', '新款', '精选']"
      class="tab-control"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed" />
    <!-- better-scroll滚动scroll -->
    <Scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- 轮播图homeswiper -->
      <HomeSwiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad" />
      <RecommendView :recommends="recommends" />
      <!-- 本周流行 -->
      <FeatureView />
      <!-- 选项卡 -->
      <TabControl
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2" />

      <GoodsList :goods="showGoods" />
    </Scroll>
    <!-- backtop不需要一起滚 -->
    <!-- 组件不能直接@click 需要加.navtive修饰符 修饰组件根元素的原生事件 -->
    <BackTop @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [], // 轮播
      recommends: [], // 推荐
      goods: {
        // 商品数据
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop", // 商品当前类型
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY:0 // 记录离开的位置
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  destroyed() {
    console.log('home destoryed');
  },
  // 这两个在有keep-live的时候才能用
  activated() {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    // 最好刷新一下 以防出现不能滚动的bug
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // 保存离开home时的位置
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    // 监听item中的图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.$bus.$on("itemImageLoad", () => {
      refresh();
    });
    // 获取tabControl的offsetTop
    // 组件没有offsetTop-> 所有的组件都有一个属性$el:用于获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop);
    // 在这里获取不准，可能图片还没加载完，在轮播图加载完再获取
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    // 点击切换商品
    tabClick(index) {
      // console.log(index);
      // 根据index切换商品类型
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 使两个选项卡同步
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // 点击backtop回到顶部
    backClick() {
      // console.log('backClick');
      // this.$refs.scroll.scroll.scrollTo(0,0,500);
      // 上面这样写可能有点难看懂，再去Scroll.vue里面做封装
      this.$refs.scroll.scrollTo(0, 0);
    },
    // 监听滚动
    contentScroll(position) {
      // 1.判断BackTop是否显示
      // console.log(position);
      // position.y是负的
      this.isShowBackTop = -position.y > 1000;

      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    // 上拉加载更多
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    // 轮播图加载完成
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     * 网络请求的方法
     */
    // 1.请求多个数据
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    // 2.请求商品数据
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list);
        // 还要再把goods里面的page=1，不然page还是0,上面的page只是一个变量
        this.goods[type].page += 1;
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* 设置padding视口就没有100vh了 */
  /* padding-top: 44px; */
  /* vh 视口 100vh->100%视口 50vh->50%视口 */
  height: 100vh;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动 使用bs后就不需要了*/
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9; */
}
.tab-control {
  /* relative 就可以让z-index起效果 */
  position: relative;
  z-index: 9;
}
/* bs滚动方案2 定位 */
.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
}

/* bs方案1 动态计算 */
/*  navbar44+tabbar49=93  */
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>

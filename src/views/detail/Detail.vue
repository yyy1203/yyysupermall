<template>
  <div id="detail">
    <DetailNavBar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <Scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <DetailSwiper :top-images="topImages" />
      <DetailBaseInfo :goods="goods" />
      <DetailShopInfo :shop="shop" />
      <DetailGoodsInfo :detail-info="detailInfo" @imageLoad="imageLoad" />
      <DetailParamInfo :param-info="paramInfo" ref="param" />
      <DetailCommentInfo :comment-info="commentInfo" ref="comment" />
      <GoodsList :goods="recommends" ref="recommend" />
    </Scroll>
    <DetailBottomBar @addToCart="addToCart"/>

    <BackTop @click.native="backClick" v-show="isShowBackTop" />
    <!-- <Toast :message="message" v-show="show"/> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";


import { debounce } from "common/utils";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";

import { itemListenerMixin } from "common/mixin";

import {mapActions} from 'vuex'

// import Toast from 'components/common/toast/Toast'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop,
    // Toast
  
  },
  mixins: [itemListenerMixin],

  data() {
    return {
      iid: null,
      topImages: [], // 轮播图
      goods: {}, // 商品基本信息
      shop: {}, // 店铺
      detailInfo: {},
      paramInfo: {}, // 参数
      commentInfo: {}, // 评论
      recommends: [], // 推荐
      themeTopYs: [], // 标题内容对应的y值
      getThemeTopY: null, // 防抖
      currentIndex: 0, // 当前滚动到第几个主题
      isShowBackTop: false,

      // toast相关
      // message:'',
      // show:false

    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      console.log(res);
      const data = res.result;
      // 1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
    });

    // 3.请求商品推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []; //先清空，不然不止4个值
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE); // js里面number的最大值
    }, 100);
  },
  mounted() {},
  destroyed() {
    // detail没有keep-alive，所以这里不用deactivated
    // 取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh();
      // 获取4个主题的offsetTop
      this.getThemeTopY();
    },
    // 点击标题，滚动到对应内容
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
    },
    // 监听滚动到哪个主题
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;
      //2.positionY和主题中值进行对比
      // [0，7938，9120，9452]
      // positionY 在 0 和 7938 之间，index=0
      // positionY 在 7938 和 9120 之间，index=1
      // positionY 在 9120 和 9452 之间，index=2

      // positionY 大于等于 9452值，index=3
      let length = this.themeTopYs.length;
      // **法一 普通做法
      /*   for (let i = 0; i < length; i++) {
        // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1])(
        // console.log(i);
        //}
        // 判断this.currentIndex != i 避免频繁打印

        if (
          this.currentIndex != i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          // console.log(i);
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        } 
      } */
      // **法二 hack做法，引入一个最大值与最后一个值进行比较
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex != i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

       // 3.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
    },
     // 点击backtop回到顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    // 加入购物车
    addToCart(){
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // 2.将商品添加到购物车里面
      // this.$store.commit('addCart',product)
      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res);
      // })
      this.addCart(product).then(res=>{
        console.log(res);
        // this.show = true;
        // this.message = res

        // setTimeout(() => {
        //   this.show = false;
        //   this.message=''
        // }, 1500);

        this.$toast.show()
      })
    }
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

/* 给一个固定的高度 */
.content {
  height: calc(100% - 44px);
}
</style>
<template>
  <div class="goods-item" @click="itemClick">
    <!-- @load 监听图片加载完成 -->
    <!-- <img :src="showImage" alt="" @load="imageLoad" /> -->
    <!-- 图片懒加载 -->
    <img v-lazy="showImage" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      defalut() {
        return {};
      },
    },
  },
  computed: {
    // 对首页商品和详情页的推荐商品做一个判断
    showImage() {
    		return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
      }
  },
  methods: {
    imageLoad() {
      // console.log('imgload');
      // GoodsListItem->Home 非父子组件通信，使用事件总线$bus
      // console.log(this.$bus); // 本身没有这个东西，要去Vue原型里面加
      this.$bus.$emit("itemImageLoad");
    },
    // 点击跳转到详情页
    itemClick() {
      // console.log('itemClick');
      // console.log(this.goodsItem.iid);
      this.$router.push("/detail/" + this.goodsItem.iid);
    },
  },
};
</script>

<style scope>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  /* 一行两个 */
  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

/* 小图标 */
.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
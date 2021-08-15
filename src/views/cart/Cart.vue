<template>
  <div class="cart">
    <!-- 导航 -->
    <NavBar class="nav-bar"
      ><div slot="center">购物车({{ length }})</div></NavBar
    >
    <!-- 商品列表 -->
    <CartList></CartList>
    <!-- 底部汇总 -->
    <CartBottomBar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList.vue";
import CartBottomBar from './childComps/CartBottomBar.vue'
import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // cartLength() {
    //   return this.$store.state.cartList.length;
    // },

    // mapGetters辅助函数混入getter
    // 两种语法
    // 1.使用对象展开运算符将 getter 混入 computed 对象中
    // ...mapGetters(['cartLength','cartList'])
    // 2.将一个 getter 属性另取一个名字，使用对象形式：
    ...mapGetters({
      length: "cartLength",
    }),
  },
};
</script>

<style scoped>
.cart{
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
</style>

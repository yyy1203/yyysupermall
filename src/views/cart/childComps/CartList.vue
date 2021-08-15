<template>
  <div class="cart-list">
    <Scroll class="content" ref="scroll">
        <CartListItem v-for="item in cartList" :key="item.iid" :item-info="item">
        </CartListItem>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";

import CartListItem from './CartListItem.vue'
import { mapGetters } from "vuex";
export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(["cartList"]),
  },
  activated() {
      this.$refs.scroll.refresh()
  },
};
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px - 40px);
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>
<template>
  <div class="bottom-bar">
    <div class="check-content">
      <CheckButton
        :is-checked="isSelectAll"
        @click.native="checkClick"
        class="check-button"
      ></CheckButton>
      <span>全选</span>
    </div>
    <div class="price">合计 : {{ totalPrice }}</div>
    <div class="calculate" @click="calcClick">去计算 ( {{ checkLength }} )</div>
  </div>
</template>

<script>
import CheckButton from "components/common/checkButton/CheckButton";

import { mapGetters } from "vuex";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(["cartList"]),
    // 合计
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    // 去计算
    checkLength() {
      return this.cartList.filter((item) => item.checked).length;
    },
    // 全选的显示状态
    isSelectAll() {
      // 购物车为空时
      if (this.cartList.length === 0) return false;
      // 1.使用filter
      // return !(this.cartList.filter((item) => !item.checked).length);

      // 2.使用find
      // return !this.cartList.find(item=>!item.checked)

      // 3.普通遍历
      for (let item of this.cartList) {
        if (!item.checked) {
          return false;
        }
      }
      return true;

      // 4.使用every
      // 5.使用some
    },
  },
  methods: {
    // 全选按钮的点击效果
    checkClick() {
      if (this.isSelectAll) {// 全部选中

        this.cartList.forEach((item) => {
          item.checked = false;
        });
      } else {// 部分或全部不选中
        this.cartList.forEach((item) => (item.checked = true));
      }
      // 不能这样简写 会有bug
      // this.cartList.forEach(item=>item.checked = !this.isSelectAll)
    },
    calcClick(){
      if(this.checkLength==0){
        this.$toast.show('请选择购买的商品',2000)
      }
    }
  },
};
</script>

<style scoped>
.bottom-bar {
  display: flex;
  height: 40px;
  background-color: #eee;
  position: relative;
  line-height: 40px;
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 20px;
  flex: 1;
}
.calculate {
  width: 90px;
  color: #fff;
  background-color: red;
  text-align: center;
}
</style>

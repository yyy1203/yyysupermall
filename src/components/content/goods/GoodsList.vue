<template>
  <div class="goods">
     <GoodsListItem v-for="(item, index) in goods" :key="index" :goods-item="item"></GoodsListItem>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
    name:'GoodsList',
    props:{
        goods:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components:{
        GoodsListItem
    }
}
</script>

<style>

/* 一行显示两个goodsItem */
.goods {
  display: flex;
  /* 包裹 */
  flex-wrap: wrap;
  /* 均等分 */
  justify-content: space-around;

  padding: 2px;
}
</style>
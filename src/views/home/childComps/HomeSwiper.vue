<template>
<!-- *bug：swiper有时候不起效果？？？-->
    <Swiper>
      <SwiperItem v-for="(item, index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" />
        </a>
      </SwiperItem>
    </Swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";
export default {
  name: "HomeSwiper",
  components: {
    Swiper,
    SwiperItem,
  },
  props:{
      banners:{
          type:Array,
          default(){
              return []
          }
      }
  }
};
</script>

<style>
</style>
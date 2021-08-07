<template>
  <!-- 在这里监听点击 不要去App.vue里面的，在那写要监听四个 -->
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <!-- 图片active插槽 -->
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <!-- 这样写样式不起效果  -->
    <!-- <slot :class="{ active: isActive }" name="item-text"></slot> -->
    <!-- 渲染的时候会直接把它这个替换成  <div slot="item-text">首页</div> -->
    <!-- 一般不会直接在插槽上绑定动态属性，因为渲染时会把它替换掉
     外面套一个div这样不会把原来的替换掉，上面两个最好也这样写  -->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      // isActive: true
    };
  },
  computed: {
    // 动态决定isActive
    isActive() {
      // /home -> item1(/home) = true
      // /home -> item1(/category) = false
      // /home -> item1(/cart) = false
      // /home -> item1(/profile) = false
      // indexOf()返回某个指定的字符串值在字符串中首次出现的位置。  == -1 说明不存在
      return this.$route.path.indexOf(this.path) !== -1;
      // 或者用这个也行
      //  return this.$route.path === this.path; 
    },
    // 根据传进来的值activeColor 给文字动态绑定style
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      // 路由跳转 动态路径props里面的path
      this.$router.replace(this.path);
    },
  },
};
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>

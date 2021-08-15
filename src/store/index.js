import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    // mutations唯一的目的就是修改state中状态
    // mutations中的每个方法尽可能完成的事件比较单一一点
    // 数量+1
    addCounter(state, payload) {
      payload.count++;
    },
    // 新添加商品
    addToCart(state, payload) {
      payload.checked = true;// 是否选中
      state.cartList.push(payload)
    }
  },
  actions: {
    // 有判断逻辑建议放actions里面
    addCart(context, payload) {
      return new Promise((reslove,reject)=>{
           // payload新添加的商品
      // let oldProduct = null;
      // for (let item of state.cartList) {
      //   if (item.iid === payload.iid) {
      //     oldProduct = item;
      //   }
      // }

      // 1.查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2.判断oldProduct +1或者新添加  做了两件事，放actions里面比较好
      if (oldProduct) {
        // oldProduct.count += 1;
        context.commit('addCounter', oldProduct)
        reslove('当前的商品数量+1')

      } else {
        payload.count = 1;
        // state.cartList.push(payload)
        context.commit('addToCart', payload)
        reslove('添加了新的商品')
      }
      })
    }
  },
  getters:{
    cartLength(state){
      return state.cartList.length;
    },
    cartList(state){
      return state.cartList;
    }
  },
  modules: {}
})

import {
  request
} from './request'

/* 封装首页home的全部网络请求 */

// 请求首页的多个数据
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
// 请求首页商品数据
export function getHomeGoods(type,page) {
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}


// 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
// 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function test() {
//   const names = ['why', 'aaa']
// }
//
// test()
//
// test()


// 保存商品数据分析
let totalNums = []

const nums1 = [20, 11, 222]
const nums2 = [111, 22, 333]

// totalNums=nums1;// 不能直接赋值!!!不然totalNums数据就只有一个nums1

// 方法1：循环push
// for (let n of nums1) {
//   totalNums.push(n)
// }

// 方法2：es6扩展(展开)运算符... 将一个数组转为用逗号分隔的参数序列。
totalNums.push(...nums1)

// push(...可变参数)// 如果是函数的(...item)就是可变参数
// 不能这样传
// totalNums.push([20, 11, 222]); // totalNums = [[20, 11, 222]]

import axios from 'axios'

// 可能有多个，使用export,而不是export default
// request封装v4.0 直接return instance(config) 因为它这个本身就是一个Promise
export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    // 旧接口 http://123.207.32.32:8000
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用 成功/失败
  instance.interceptors.request.use(config => {

    return config
  }, err => {
    // console.log(err);
  })

  // 2.2.响应拦截 成功/失败
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config) // 本身的返回值就是个promise
}
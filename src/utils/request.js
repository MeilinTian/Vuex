import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
})

request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 如果请求出错了，还没有发起，会经过这里
  return Promise.reject(error)
})

export default request

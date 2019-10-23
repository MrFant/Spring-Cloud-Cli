import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import {getToken} from '@/utils/auth'
import store from '../store'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_URL, // api的base_url
  timeout: 15000                  // 请求超时时间1.5s
})
// request拦截器
service.interceptors.request.use(config => {
  // 在请求拦截器里为请求加上token
  config.headers.Authorization=sessionStorage.getItem('cloud-ida-token');
  return config
}, error => {
  // Do something with request error
  console.error(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code == "200") {
      return res
    }

    if (res.code == '10002') {
      Message({
        showClose: true,
        message: res.msg,
        type: 'error',
        duration: 3 * 1000,
        onClose: () => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      });
      return Promise.reject(res.msg)
    }else{
      // 这个错误和下面的error不同
      Message({
        message: res.msg+"有返回的错误",
        type: 'error',
        duration: 3 * 1000
      })
      return res
    }
  },
  error => {
    // 当错误发生的时候弹出消息，比如500错误
    console.error('err' + error)// for debug
    Message({
      message: error.message+"服务器返回的错误",
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service


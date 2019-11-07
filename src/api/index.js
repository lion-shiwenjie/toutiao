import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `bearer ${local.getUser().token}`
// }
axios.defaults.transformResponse = [(data) => {
  // 对 data 进行任意转换处理
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 前拦截
axios.interceptors.request.use(config => {
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, err => {
  return Promise.reject(err)
})
// 后拦截
axios.interceptors.response.use(config => {
  return config
}, err => {
  if (err.response.status === 401) {
    return router.push('/login')
  }
  return Promise.reject(err)
})
export default axios

import axios from "axios";
import JSONbig from 'json-bigint'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
const router = useRouter()
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/mp/v1_0',
  //用来专门定义后端返回原始数据的处理
  //data为后端原始的字符串数据
  transformResponse: [function (data) {
    //后台返回的数据可能不是JSON格式的字符串
    //如果不是JSONbig就会报错，使用try catch捕获异常，处理异常的发生
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
request.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
request.interceptors.response.use(res => {
  console.log(res.data)
  return res.data ? res.data : res;
}, err => {
  const status = err.response.status
  if (status === 401) {
    window.localStorage.removeItem('userInfo')
    // 跳转到登录页面
    router.push('/login')
    ElMessage.error('登录状态无效，请重新登陆')
  } else if (status === 403) {
    // 没有操作权限
    ElMessage.error('登录失败，没有操作权限')
  } else if (status === 400) {
    // 客户端参数错误
    ElMessage.error('登录失败，请检查请求参数')
  } else if (status >= 500) {
    // 没有操作权限
    ElMessage.error('服务器端内部异常，请稍后再试')
  }
  return Promise.reject(error)
})
export default request
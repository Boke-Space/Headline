// 基于 axios 封装的请求模块
import ajax from 'axios'
import router from '../router'
import { Notify } from 'vant'
import { getToken, removeToken, setToken } from './token'
import { refreshTokenAPI } from '../api'
// 新建一个新的axios实例
const axios = ajax.create({
  //baseURL: 'http://toutiao.itheima.net' // 基地址
  baseURL: 'http://geek.itheima.net'
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标: 统一携带token
  // 判断本地有token再携带, 判断具体api/index.js里如果没有携带Authorization, 我在添加上去
  // 未定义叫undefined, null具体的值你得赋予才叫空
  // ?. 可选链操作符, 如果前面对象里没有length, 整个表达式原地返回undefined
  // 如果getToken()在原地有值token字符串, 才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 当状态码为2xx/3xx开头的进这里 对响应数据做点什么
  return response
}, async function (error) {
  // 响应状态码4xx/5xx进这里  对响应错误做点什么
  if (error.response.status === 401) {
    Notify({
      type: 'warning',
      message: '身份已经过期'
    })
    // 先清除token, 才能让路由守卫判断失效, 放行我去登录页
    // 方式1: 强制跳转到登陆, 用户有感知
    // router.currentRoute 相当于 在vue文件内this.$route -> 当前路由对象信息
    // fullPath, 路由对象里完整路由路径#后面的一切
    removeToken()
    // router.currentRoute 相当于 在vue文件内this.$route -> 当前路由对象信息
    // fullPath, 路由对象里完整路由路径#后面的一切
    router.replace(`/login?path=${router.currentRoute.fullPath}`)

  //   // 方式2: 使用refresh_token换回新的token再继续使用, JS代码实现, 用户无感知(效果好)
  //   const res = await refreshTokenAPI()
  //   // 新的token回来之后, 我们要做什么
  //   // 1. 更新token在本地
  //   setToken(res.data.data.token)
  //   // 2. 更新新的token在请求头里
  //   error.config.headers.Authorization = `Bearer ${res.data.data.token}`
  //   // 3. 未完成这次请求, 再一次发起
  //   // error.config就是上一次请求的配置对象
  //   // 结果我们要return回原本逻辑页面调用地方-还是return回去一个Promise对象
  //   return axios(error.config)
  // } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //   // 刷新的refresh_token也过期了
  //   localStorage.clear() // 清除localStorage里所有值
  //   // localStorage当前网页, 域名划分, 每个域名下有自己范围的localStorage
  //   Notify({
  //     type: 'warning',
  //     message: '身份已过期'
  //   })
  //   router.replace('/login')
  }
  return Promise.reject(error)
})


// 目标: token讲解
// 操作:
// 1. 手动修改localStorage里geek那个token改错(模拟过期)
// 2. 点击反馈/其他需要标明身份的接口(错误token携带给后台请求)
// 3. 反馈不感兴趣, 这次请求返回状态为 401, 进入错误响应拦截器
//
// 代码解决401问题
// 方式1: 清除token, 强制跳转回登录页面, 有感知重新登录, 拿到新token替换到本地
// 需要重新点击反馈按钮, 再次反馈 -> 感觉特别不好
// 方式2: 刷新token, 使用登录时保存的refresh_token, 调用另外一个接口, 换回来
// 新的token值, 替换到本地, 再次完成本次未完成的请求 -> 用户无感知体验好
// 1. 登录页面, localStorage.setItem('refresh_token', 存入refresh_token)
// 2. 401中, 注释掉跳转login的代码, 引入刷新token的api方法调用
// 3. 替换保存到本地新的token
// 4. error错误对象里headers替换成新的token
// 5. axios再次发起这次未完成请求, 返回Promise对象到最开始发请求的逻辑页面
// 注意: 调用刷新token的接口, 如果没携带refresh_token或者携带错误的都会导致500
//
// 401+500
// token和refresh_token都过期了 (前提, 是你手动把2个token改成错误的)
// 强制回到登录页

// 导出自定义函数, 参数对象解构赋值
export default ({
  url,
  method = 'GET',
  params,
  data,
  headers
}) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}





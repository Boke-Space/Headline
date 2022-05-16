import axios from '../utils/request'

// axios内部会把参数对象转成json字符串格式发给后台
// axios内部会自动携带请求参数(headers)里
// Content-Type: 'application/json' 帮你添加好

// 既引入也同时向外按需导出, 所有引入过来的方法 (中转) * 代表所有
export * from './article'
export * from './user'
export * from './search'
export * from './channel'
export * from './comment'

// 登录   登录接口
export const loginAPI = ({ mobile, code }) => axios({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

//  刷新token
// 请求拦截器统一携带的是token, 而这次请求需要带的是refreshToken
// 所以在axios请求拦截器里判断, 就是为了这种情况准备的
export const refreshTokenAPI = () => axios({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
  }
})








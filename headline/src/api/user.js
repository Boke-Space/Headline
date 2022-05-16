// 用户   关注
import axios from '../utils/request'

export const userFollowAPI = ({ userId }) => axios({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})

// 用户   取关
export const userUnFollowAPI = ({ userId }) => axios({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE',
})

// 用户 - 获取个人资料(编辑页面使用)
export const getUserProfileAPI = () => axios({
  url: '/v1_0/user/profile'
})

// 用户 - 获取基本资料（我的页面显示数据）
export const getUserInfoAPI = () => axios({
  url: '/v1_0/user'
})

// 用户 - 更新头像
// 如果你的请求体直接是FormData表单对象, 你也不用自己添加
// Content-Type, axios发现数据请求体是表单对象, 它也不会转换成json字符串
// 也不会带Content-Type: application/json, 而是交给浏览器, 浏览器发现请求体是formData会自己携带Content-Type
// Content-Type: application/json; axios携带的, 前提: data请求体是对象 -> json字符串 -> 发给后台
// Content-Type: multipart/form-data; 浏览器携带的, 前提: data请求体必须FormData类型对象
export const updateUserAvatarAPI = (formData) => axios({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: formData // fd外面一会儿传进来的new FormData() 表单对象
})

// 用户 - 更新基本资料
export const updateUserInfoAPI = (dataObj) => {
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  for (const prop in obj) { // 遍历参数对象里每个key
    if (dataObj[prop] === undefined) { // 用key去外面传入的参数对象匹配, 如果没有找到(证明外面没传这个参数)
      delete obj[prop] // 从obj身上移除这对属性和值
    } else {
      obj[prop] = dataObj[prop] // 如果使用了, 就从外面对象取出对应key值, 保存到obj上
    }
  }
  axios({
    url: '/v1_0/user/profile',
    method: 'PATCH', // 局部更新->PUT(全都更新)
    // data不会忽略值为null的那对key+value, params遇到null值会忽略不携带此对参数和值给后台
    data: obj
  })
}

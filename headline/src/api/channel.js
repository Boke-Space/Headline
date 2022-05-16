// 频道   获取所有频道
import axios from '../utils/request'

export const getAllChannelListAPI = () => axios({
  url: '/v1_0/channels',
  method: 'GET'
})

// 频道 获取用户选择的频道
// 用户如果没有登陆 默认返回后台默认设置的列表
export const getUserChannelAPI = () => axios({
  url: '/v1_0/user/channels',
  method: 'GET',
})

// 频道 更新覆盖频道
export const updateChannelAPI = (channels) => axios({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})

// 频道 删除用户选择的频道频道
export const deleteChannelAPI = (channelId) => axios({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

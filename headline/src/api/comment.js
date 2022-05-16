// 文章   评论    获取评列表
// offset第一页时, 不用在params携带(axios发现值为null会自动忽略此参数)
import axios from '../utils/request'

export const getCommentListAPI = ({ id, offset = null, limit = 10 }) => axios({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios只针对params参数, 如果发现键值对, 值为null, 会忽略此参数名和值不携带在url?后面
    type: 'a', // 什么时候需要外面传: 此值会变化
    source: id,
    offset,
    limit
  }
})

// 评论 - 喜欢
export const commentLikeAPI = ({ comId }) => axios ({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comId
  }
})

// 评论-取消喜欢
export const commentDisLikeAPI = ({ comId }) => axios({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

// 评论 - 发布
export const commentSendAPI = ({ artId, content }) => axios({
  url: '/v1_0/comments',
  method: 'POST',
  data: {
    target: artId,
    content: content
  }
})

// 文章   获取所有文章列表
import axios from '../utils/request'

export const getArticlesListAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',
  method: 'GET',
  params: {
    channel_id,
    timestamp
  }
})

// 文章   反馈  不感兴趣
export const articlesDislikeAPI = ({ artId }) => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  },
})

// 文章   反馈  反馈垃圾内容
export const articleReportAPI = ({ artId, type }) => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type
  },
})

// 文章   获取详情
export const getArticlesDeailAPI = ({ artId }) => axios({
  url: `/v1_0/articles/${artId}`,
})

// 文章 - 点赞
export const articleLikeAPI = ({ artId }) => {
  axios({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target: artId
    }
  })
}

// 文章 - 取消点赞
export const articleDisLikeAPI = ({ artId }) => { axios({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})
}

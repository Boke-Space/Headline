// 搜索   获取联想建议列表
import axios from '../utils/request'

export const getSuggeListAPI = ({ keywords }) => axios({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 搜索   搜索结果列表
export const getSearchResultAPI = ({ page = 1, per_page = 10, q  }) => axios({
  url: '/v1_0/search',
  params: {
    page,
    per_page,
    q
  }
})

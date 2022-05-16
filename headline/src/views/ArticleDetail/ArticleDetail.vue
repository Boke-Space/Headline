<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <van-loading color="#1989fa" class="loading"
      v-if="!Object.keys(articleDetail).length">文章疯狂加载ing...
    </van-loading>

    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container" >
        <!-- 文章标题 -->
        <h1 class="art-title">{{articleDetail.title}}</h1>

        <!-- 用户信息 -->
        <van-cell center title="张三" label="3天前">
          <template #icon>
            <van-image :src="articleDetail.aut_photo" class="avatar">
              <template v-slot:error>图片走丢了</template>
            </van-image>
          </template>
          <template #default>
            <div>
              <!-- 已关注-->
              <van-button type="info" size="mini" v-if="articleDetail.is_followed" @click="follow(true)">已关注</van-button>
              <!-- 未关注-->
              <van-button icon="plus" type="info" size="mini" plain v-else @click="follow(false)">关注</van-button>
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="articleDetail.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞(文章) -->
        <!-- attitude:  -1: 无态度，0-不喜欢，1-点赞 -->
        <div class="like-box">
          <van-button icon="good-job" type="danger" size="small" v-if="articleDetail.attitude === 1" @click="like(true)">已点赞</van-button>
          <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="like(false)">点赞</van-button>
        </div>



      </div>

      <!-- 文章评论区域 -->
      <CommentList></CommentList>

    </div>
  </div>
</template>

<script>
import {
  articleDisLikeAPI,
  articleLikeAPI,
  getArticlesDeailAPI,
  userFollowAPI,
  userUnFollowAPI,
} from '../../api'
  import { timeAgo } from '../../utils/date'
import CommentList from './CommentList'

  export default {
    name: 'ArticleDetail',
    components: { CommentList },
    data() {
      return {
        articleDetail: {},    //  文章详情对象
      }
    },
    async created() {
      const res = await getArticlesDeailAPI({
        artId: this.$route.query.art_id
      })
      this.articleDetail = res.data.data
    },
    methods: {
      formDate: timeAgo,
      // 关注/取关 -> 作者
      async follow(flag) {
        if (flag === true) {
          // 用户点在 "已关注" 按钮上
          // 页面   ->  显示关注按钮
          this.articleDetail.is_followed = false
          const res = await userUnFollowAPI({
            userId: this.articleDetail.aut_id
          })
          // 业务和接口 -> 取关接口
        } else {
          // 用户点在 "关注" 按钮上
          // 页面   ->  显示已关注按钮
          this.articleDetail.is_followed = true
          // 业务和接口 -> 关注接口
          const res = await userFollowAPI({
            userId: this.articleDetail.aut_id
          })
        }
      },
      async like(flag) {
        if (flag === true) {
          // 用户点在了 "已点赞" 身上
          // 显示"点赞"按钮
          this.articleDetail.attitude = 0
          // 0不喜欢, -1无态度
          // 业务和接口 -> 取消点赞
          const res = await articleDisLikeAPI({
            artId: this.articleDetail.art_id
          })
        } else {
          // 用户点在了 "点赞" 身上
          // 显示"已点赞"按钮
          this.articleDetail.attitude = 1
          // 业务和接口 -> 点赞接口
          const res = await articleLikeAPI({
            artId: this.articleDetail.art_id
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .van-nav-bar {
    background-color: #1edada;
  }
  .article-container {
    padding: 10px;
    margin-top: 46px;
  }
  .art-title {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
  }

  .art-content {
    font-size: 12px;
    line-height: 24px;
    width: 100%;
    overflow-x: scroll;
    word-break: break-all;
    /deep/ img{
      width: 100%;
    }
    /deep/ pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }

  .van-cell {
    padding: 5px 0;
    &::after {
      display: none;
    }
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #f8f8f8;
    margin-right: 5px;
    border: none;
  }

  .like-box {
    display: flex;
    justify-content: center;
  }

  .loading {
    margin-top: 50px;
    text-align: center;
  }
</style>

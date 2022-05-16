<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>

    <!-- 文章列表 -->
    <!-- 组件标签上, @事件名都是自定义事件(即使叫click), 需要组件内$emit('事件名')这个事件才能使用-->
    <!-- 如果想要直接绑定原生的事件↓-->
    <!-- 事件修饰符.native -> 给组件内根标签, 绑定原生click点击事件-->
    <div>
      <van-list v-model="bottomLoading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad" offset="50">
        <ArtileItem v-for="results in articleList" :key="results.art_id"
          :articleItem="results" :deleteShow="false" @click.native="gotoDetail(results.art_id)">
        </ArtileItem>
      </van-list>
    </div>

  </div>
</template>

<script>
  import { getSearchResultAPI } from '../../api'
  import ArtileItem from '../../components/ArticleItem'

  export default {
    name: 'SearchResult',
    components: { ArtileItem },
    data () {
      return {
        page: 1, // 页码
        articleList: [],     // 文章列表
        bottomLoading: false,   // 顶部加载状态
        finished: false     // 是否全部加载完成
      }
    },
    async created() {
      const res = await getSearchResultAPI({
        page: this.page,
        q: this.$route.params.kw
      })
      this.articleList = res.data.data.results
    },
    methods: {
      async onLoad() {
        //  数组长度不为0
        if (this.articleList.length) {
          this.page++
          const res = await getSearchResultAPI({
            page: this.page,
            q: this.$route.params.kw
          })

          //  数组长度为0
          if (!res.data.data.results.length) {
            this.finished = true
            return
          }

          this.articleList = [...this.articleList, ...res.data.data.results]
          this.bottomLoading = false

        }
      },
      // 跳转到详情
      gotoDetail (id) {
        this.$router.push({
          path: `/detail?art_id=${id}`
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .van-nav-bar {
    background-color: #1edada;
  }
  .search-result-container {
    padding-top: 46px;
  }
</style>

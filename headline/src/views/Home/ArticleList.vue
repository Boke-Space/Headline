<template>
  <div>
    <van-pull-refresh v-model="topLoading" @refresh="onReFresh()">
      <van-list v-model="bottomLoading" :finished="bottomFinished" finished-text="没有更多了"
                @load="onLoad()" :immediate-check="false" offset="50">
        <!-- 文章列表 -->
        <ArtileItem v-for="(item, index) in articleList" :key="index" :articleItem="item"
          @article-dislike="dislike" @article-report="report" @click.native="gotoDetail(item.art_id)">
        </ArtileItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<!-- 问题1: 网页刚打开, created里请求和onLoad里请求同时发送, 请求的都是最新数据-->
<!-- onLoad中, 2次一样的数据合并, 数据重复, key重复了-->
<!-- 原因: van-list组件, 组件挂载时, 默认就会判定一次是否触底-->
<!-- 第一页数据也是网络请求回来的, 标签先挂载了, 数据回来更新DOM, 所以标签没有高度, list的load事件上来就触发-->
<!-- 解决方案1: list组件添加 :immediate-check="false" 上来初始化时不要判定-->
<!-- 解决方案2: onLoad第一行, 写数组长度的判断-->

<script>
  import ArtileItem from '../../components/ArticleItem'
  import { articleReportAPI, articlesDislikeAPI, getArticlesListAPI } from '../../api'
  import { Notify } from 'vant'
  export default {
    name: 'ArticleList',
    components: { ArtileItem },
    props: {
      channelId: Number
    },
    data() {
      return {
        articleList: [],                  //文章列表数组
        bottomLoading: false,              // 底部加载状态
        bottomFinished: false,                  // 底部完成状态
        topLoading: false,                 // 顶部加载状态
        time: new Date().getTime(),       // 用于分页
      }
    },
    // 每个导航栏各自获取自己页面数据 互不影响
    async created() {
      this.getArticleList()
    },
    methods: {
      //  获取文章数据
      async getArticleList() {
        const res = await getArticlesListAPI({
          channel_id: this.channelId,
          timestamp: (new Date()).getTime()
        })
        //  展开运算符进行数组合并
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.time = res.data.data.pre_timestamp
        // 第一次 系统时间(timestamp) ->   后台 返回0-9条数据 ->携带第10条pre_timestamp值返回
        // 第二次 (timestamp)-上一次pre_timestamp (代表告诉后, 从指定的时间戳再往后找10个) 10-19条, 20条pre_timestamp返回
        if (res.data.data.pre_timestamp === null) this.bottomFinished = true // 第一次上面还是判定触底(触发onLoad方法时bottomLoading自动改true)
        if (!res.data.data.results.length) this.bottomFinished = true
      },
      //  底部下拉刷新
      async onLoad() {
        if (this.articleList.length) {
          this.getArticleList()
          this.bottomLoading = true
        } else {
          this.bottomLoading = false // 如果不关闭, 底部一直是加载中状态, 下次触底会再触发onLoad
          this.bottomFinished = true
        }
      },
      //  顶部上拉刷新
      async onReFresh() {
        //  清空数组 请求新的数据
        this.articleList = []
        this.time = new Date().getTime()
        this.getArticleList()
        this.topLoading = false
      },
      //  自定义事件 不感兴趣
      async dislike(id) {
        const res = await articlesDislikeAPI({
          artId: id
        })
        Notify({
          type: 'success',
          message: '反馈成功'
        })
      },
      //  自定义事件 反馈垃圾内容
      async report(id, value) {
        const res = await articleReportAPI({
          artId: id,
          type: value
        })
        Notify({
          type: 'success',
          message: '举报成功'
        })
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

<style scoped>

</style>

<template>
  <div>

    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()"/>
      <!-- 搜索组件 -->
      <van-search v-fofo v-model="kw" @input="input" @search="searchResult"
       placeholder="请输入搜索关键词" background-colr="#1edada;" shape="round"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div class="sugg-item" v-for="(suggest, index) in suggestList"
        :key="index" v-html="highlightSuggest(suggest,kw)" @click="suggestResult(suggest)">
      </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="historyClear"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span v-for="(history, index) in historyList" :key="index" @click="historyResult(history)"
          class="history-item">{{history}}
        </span>
      </div>
    </div>

  </div>
</template>

<script>
  import { getSuggeListAPI } from '../../api'

  export default {
    name: 'Search',
    data () {
      return {
        kw: '', // 搜索关键字
        timer: null, // 防抖的定时器
        suggestList: [], // 联想建议列表文字数组
        historyList: JSON.parse(localStorage.getItem('his'))  || [] // 搜索历史
      }
    },
    watch: {
      // ES6新增了2种引用类型(以前 Array, Object), (新增: Set Map)
      // Set: 无序不重复的value集合体 (无下角标)
      // 特点: 你传入的数组类型, 如果有重复元素, 会自动清理掉重复元素, 返回无重复的Set对象
      historyList: {
        deep: true,
        handler() {
          const hisrorySet = new Set(this.historyList)
          // Set类型对象 -> 转回 -> Array数组类型
          const hisroryArr = Array.from(hisrorySet)
          localStorage.setItem('his', JSON.stringify(hisroryArr))
        },
      }
    },
    methods: {
      // 输入框 - 内容实时改变触发事件方法
      input () {
        // 防抖: 延时执行逻辑代码, 事件再次触发时, 清除上一个定时器
        clearTimeout(this.timer)
        if (this.kw.length === 0) {
          this.suggestList = []
        } else {
          this.timer = setTimeout(async () => {
            const res = await getSuggeListAPI({
              keywords: this.kw
            })
            this.suggestList = res.data.data.options
          }, 300)
        }
      },
      //  将搜索结果的关键字高亮 originStr 搜索获取的结果 match 输入的关键字
      highlightSuggest(originStr, match) {
        // 字符串.replace() -> 替换第一个符合条件
        // 字符串.replaceAll() -> 替换全部
        const reg = new RegExp(match, 'ig') // i忽略大小写, g全局都匹配
        return originStr.replace(reg, (match) => {
          return `<span style="color: red">${match}</span>`
        })
      },
      // 坑: 路由跳转, 在watch之前执行, 所以我们要让路由跳转, 来一个定时器包裹, 让跳转最后执行
      //  搜索事件  跳转到搜索结果页面
      searchResult() {
       if (this.kw.length > 0) {
         this.historyList.push(this.kw)
         setTimeout(() => {
           this.$router.push({
             path: `/search_result/${this.kw}`
           })
         },0)
       }
      },
      // 建议列表点击 跳转到搜索结果页面
      suggestResult (suggest) {
        this.historyList.push(suggest)
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${suggest}`
          })
        },0)
      },
      historyResult(history) {
        this.historyList.push(history)
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${history}`
          })
        },0)
      },
      // 清除历史记录
      historyClear () {
        this.historyList = []
      }
    },
  }
</script>

<style scoped lang="less">
  .search-header {
    height: 46px;
    display: flex;
    align-items: center;
    background-color: #1edada;
    overflow: hidden;

    /*后退按钮*/

    .goback {
      padding-left: 14px;
    }

    /*搜索组件*/

    .van-search {
      flex: 1;
      background-color: #1edada;
    }
  }

  /*搜索建议列表样式 */
  .sugg-list {
    .sugg-item {
      padding: 0 15px;
      border-bottom: 1px solid #1edada;
      font-size: 14px;
      line-height: 50px;
      // 实现省略号的三行代码
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /**搜索历史 */
  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }

  .history-list {
    padding: 0 10px;
    .history-item {
      display: inline-block;
      font-size: 12px;
      padding: 8px 14px;
      background-color: #efefef;
      margin: 10px 8px 0px 8px;
      border-radius: 10px;
    }
  }
</style>

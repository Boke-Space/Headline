<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list" :class="{ 'art-cmt-container-1' : isShowCommentBox,
    'art-cmt-container-2' : !isShowCommentBox }">

      <!--  van-list包裹列表, 组件内源码, 检测网页滚动事件, 判断滚动位置是否快到达内容高度(触底)-->
      <!--  触发load事件执行 -> loading: 为true -> 底部加载中文字出现 -> 内部认为现在处于加载中状态-->

      <!--  mmediate-check 作用: 让list组件不要上来就检查是否触底-->
      <!--  因: list中列表内容是异步网络请求回来的, 标签挂载时, 没有高度, list就会判定触底执行一次-->
      <!--  onLoad方法-->
      <!--  问题: created发一起, onLoad立刻又发送一次, 请求2次第一页的数据/上来就请求第一页和第二页-->

      <van-list  v-model="bottomLoading" :finished="bottomFinished" finished-text="没有更多评论了，请发表评论"
        @load="onLoad" offset="50" :immediate-check="false">

        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="(comment, index) in commentList" :key="index">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="comment.aut_photo"  class="avatar">
              <span class="uname">{{ comment.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="comment.is_liking === true" @click="like(true, comment)"/>
              <van-icon name="like-o" size="16" color="gray" v-else @click="like(false, comment)"/>
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ comment.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(comment.pubdate) }}</div>
        </div>

      </van-list>

    </div>

    <!-- 发表评论容器 -->
    <div>
      <!-- 底部添加评论区域 - 1 (短) -->
      <!--  不是兄弟组件不能用v-if     -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCommentBox === true" style="ackground-color: #1edada;">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()"/>
        <div class="ipt-cmt-div" @click="isShowCommentBox = false">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" >
            <van-icon name="comment-o" size="0.53333334rem" @click="skipComement"/>
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="commentBlur"
          v-model.trim="commentText">
        </textarea>
        <van-button type="default"  @click="sendComment"
          :disabled="!commentText.length">发布
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>

import { commentDisLikeAPI, commentLikeAPI, commentSendAPI, getCommentListAPI } from '../../api'
import { timeAgo } from '../../utils/date'

  export default {
    name: 'CommentList',
    data () {
      return {
        commentList: [],          // 评论列表
        totalCount: 0,            // 评论总数量(必须后台返回)
        isShowCommentBox: true,   //显示底部评论输入框
        commentText: '',          // 发布评论的内容
        bottomLoading: false,     // 底部加载状态
        bottomFinished: false,    // 底部是否加载完成
        pageId: null              // 分页
      }
    },
    async created () {
     this.getCommentList()
    },
    methods: {
      timeAgo,
      async getCommentList() {
        const res = await getCommentListAPI({
          id: this.$route.query.art_id, // 文章id
          offset: this.pageId
        })
        this.commentList = [...this.commentList, ...res.data.data.results]
        this.totalCount = res.data.data.total_count
        this.pageId = res.data.data.last_id
        if (res.data.data.last_id === null) this.bottomFinished = true   //沒有下一頁了
        if (!res.data.data.results.length) this.bottomFinished = true
      },
      //  对文章进行点赞和取消赞
      async like (flag, commentObj) {
        if (flag === true) {
          // 用户点在了 "红心" 身上
          // 显示 -> "灰色的心"
          commentObj.is_liking = false
          await commentDisLikeAPI({
            comId: commentObj.com_id
          })
        } else {
          // 用户点在了 "灰心" 身上
          commentObj.is_liking = true
          await commentLikeAPI({
            comId: commentObj.com_id
          })
        }
      },
      //  跳转到评论区
      skipComement() {
        // 比较方便的方法(既能滚动也能带动画)
        // 原生标签.scrollIntoView(), 让原生的标签滚动到屏幕的最上面
        // 为何选择like-box不选择第一条评论, 因为头部导航会挡住
        // 注意: 有的人的电脑不支持这个方法, 没有滑动的效果 -> 只能用原生JS写(兼容性好)
        document.querySelector('.like-box').scrollIntoView({
          behavior: 'smooth' // 设置出现的滑动效果->平滑的动画
        })
      },
      //  评论框失焦
      commentBlur() {
        // 问题: 点击发布按钮, 发现点击事件不执行-排除代码问题
        // 原因: 高的评论容器-在页面点击发布一瞬间, 输入框失去了焦点, 被v-if和v-else移除了整个标签
        // 导致点击事件没来得及执行
        // 解决: 失去焦点时, 变量值, 在最后再执行
        // this.$nextTick() DOM更新(数据变化)
        setTimeout(() => {
          this.isShowCommentBox = true
        }, 100)
      },
      //  发送评论
      async sendComment() {
        const res = await commentSendAPI({
          artId: this.$route.query.art_id,
          content: this.commentText
        })
        this.commentList.unshift(res.data.data.new_obj)
        this.totalCount++
        this.commentText = ''
        this.skipComement()
      },
      // 下滑底部获取评论
      async onLoad () {
        if (this.commentList.length) {
          this.getCommentList()
          this.bottomLoading = true   //继续加载
        }
        this.bottomLoading = false    //加载完成
        this.bottomFinished = true
      }
    }
  }
</script>

<style scoped lang="less">
  .cmt-list {
    padding: 10px;
    .cmt-item {
      padding: 15px 0;
      + .cmt-item {
        border-top: 1px solid #f8f8f8;
      }
      .cmt-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cmt-header-left {
          display: flex;
          align-items: center;
          .avatar {
            width: 40px;
            height: 40px;
            background-color: #f8f8f8;
            border-radius: 50%;
            margin-right: 15px;
          }
          .uname {
            font-size: 12px;
          }
        }
      }
      .cmt-body {
        font-size: 14px;
        line-height: 28px;
        text-indent: 2em;
        margin-top: 6px;
        word-break: break-all;
      }
      .cmt-footer {
        font-size: 12px;
        color: gray;
        margin-top: 10px;
      }
    }
  }

  /*美化 - 文章详情 - 底部的评论页面 */
  // 外层容器
  .art-cmt-container-1 {
    padding-bottom: 46px;
  }
  .art-cmt-container-2 {
    padding-bottom: 80px;
  }

  // 发布评论的盒子 - 1
  .add-cmt-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    line-height: 46px;
    padding-left: 10px;
    background-color: #1edada;
    .ipt-cmt-div {
      flex: 1;
      border: 1px solid #efefef;
      border-radius: 15px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      padding-left: 15px;
      margin-left: 10px;
      background-color: #1edada;
    }
    .icon-box {
      width: 40%;
      display: flex;
      justify-content: space-evenly;
      line-height: 0;
    }
  }

  .child {
    width: 20px;
    height: 20px;
  }


  /*美化 - 文章详情 - 底部的评论页面 */
  // 外层容器
  .art-cmt-container-1 {
    padding-bottom: 46px;
  }
  .art-cmt-container-2 {
    padding-bottom: 80px;
  }

  // 发布评论的盒子 - 2
  .cmt-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding-left: 10px;
    box-sizing: border-box;
    background-color: white;
    textarea {
      flex: 1;
      height: 66%;
      border: 1px solid #efefef;
      background-color: #f8f8f8;
      resize: none;
      border-radius: 6px;
      padding: 5px;
    }
    .van-button {
      height: 100%;
      border: none;
    }
  }

  .add-cmt-box van-hairline--top {
    background-color: #1edada;
  }
</style>

<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ articleItem.title }}</span>
          <!-- 单图 -->
          <img v-if="articleItem.cover.type === 1"
               v-lazy="articleItem.cover.images[0]" class="thumb">
        </div>

        <!-- 多图 -->
        <div v-if="articleItem.cover.type > 1" class="thumb-box">
          <img v-for="(imgUrl, index) in articleItem.cover.images"
               :key="index" v-lazy="imgUrl" class="thumb">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ articleItem.aut_name }}</span>
            <span>{{ articleItem.comm_count }}</span>
            <span>{{ formaTime(articleItem.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="deleteShow"/>
        </div>
      </template>
    </van-cell>

    <!-- 反馈面板 -->
    <van-action-sheet v-model="show" :actions="actions"
      @select="onSelect" @cancel="onCancel" @close="onClose"
      :cancel-text="cancelText" get-container="body" />
  </div>

</template>

<script>
  import { timeAgo } from '../utils/date'
  import { firstActions, secondActions } from '../api/report'

  export default {
    name: 'ArtileItem',
    props: {
      articleItem: Object,    //文章对象
      deleteShow: {           //删除X显示
        type: Boolean,
        default: true         //首页默认显示  外部组件调用自行控制  不传参数默认显示
      }
    },
    data () {
      return {
        show: false,          //反馈面板显示/隐藏
        actions: firstActions,
        cancelText: '取消' // 底部按钮文字
      }
    },
    methods: {
      //  时间处理
      formaTime: timeAgo,
      // 反馈面板选择事件
      onSelect(action) {
        // action绑定的数据对象, index是索引
        if (action.name === '反馈垃圾内容') {
          this.actions = secondActions
          this.cancelText = '返回' // 修改底部按钮显示文字
        } else if (action.name === '不感兴趣'){
          this.$emit('article-dislike',this.articleItem.art_id)
          this.show = false
        } else {
          this.$emit('article-report',this.articleItem.art_id, action.value)
          this.actions = firstActions
          this.show = false
        }
      },
      // 取消事件
      onCancel() {
        if (this.cancelText === '返回') {
          this.actions = firstActions
          this.cancelText = '取消'
          this.show = true // 点返回不要让弹窗关闭, 点取消文字按钮, 弹窗默认关闭
        }
      },
      //  关闭面板
      onClose() {
        this.actions = firstActions
        this.cancelText = '取消'
      }
    },
  }
</script>

<style scoped lang="less">
  /* 标题样式 */
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

/* label描述样式 */
  .label-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 文章信息span */
  .label-box span {
    margin: 0 3px;

    &:first-child {
      margin-left: 0;
    }
  }

  /* 图片的样式, 矩形黄金比例：0.618 */
  .thumb {
    width: 113px;
    height: 70px;
    background-color: #f8f8f8;
    object-fit: cover;
  }

  /* 三图, 图片容器 */
  .thumb-box {
    display: flex;
    justify-content: space-between;
  }
</style>

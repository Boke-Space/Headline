<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
<!--      <van-cell>-->
<!--        &lt;!&ndash; 使用 title 插槽来自定义标题 &ndash;&gt;-->
<!--        <template #icon>-->
<!--          <img :src="$store.state.userPhoto" alt="" class="avatar">-->
<!--        </template>-->
<!--        <template #title>-->
<!--          <span class="username">{{ user.name }}</span>-->
<!--        </template>-->
<!--        <template #label>-->
<!--          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>-->
<!--        </template>-->
<!--      </van-cell>-->
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ user.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ user.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ user.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <UserEdit></UserEdit>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <!--  <van-cell icon="edit" title="编辑资料" is-link to="/edit"/>-->
      <!--  <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>-->
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout"/>
    </van-cell-group>

  </div>
</template>
<script>
  import { getUserInfoAPI } from '../../api'
  import { Dialog } from 'vant'
  import { removeToken } from '../../utils/token'
  import { mapMutations } from 'vuex/dist/vuex.mjs'
  import UserEdit from './UserEdit'

  export default {
    name: 'User',
    components: { UserEdit },
    data () {
      return {
        user: {} // 用户对象
      }
    },
    async created () {
      const res = await getUserInfoAPI()
      this.user = res.data.data
      this.USERPHOTO(this.user.photo)
    },
    methods: {
      ...mapMutations(['USERPHOTO']),
      logout() {
        // 主动退出 -> 用户点击退出, 清空token, 强制replace切换登录页
        // 被动退出 -> 把token值传后台, 后台返回401 -> 响应拦截器发现401状态证明你身份过期 -> 强制进登录页
        Dialog.confirm({
          title: '提示',
          message: '这就走了?不爱我了吗?'
        }).then(() => {
          removeToken()
          this.$router.replace('/login')
        }).catch(() => {

        })
      }
    },
  }
</script>

<style scoped lang="less">
  .user-container {
    .user-card {
      background-color: #1edada;
      color: white;
      padding-top: 20px;
      .van-cell {
        background-color: #1edada;
        color: white;
        &::after {
          display: none;
        }
        .avatar {
          width: 60px;
          height: 60px;
          background-color: #fff;
          border-radius: 50%;
          margin-right: 10px;
        }
        .username {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .user-data {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 14px;
      padding: 30px 0;
      .user-data-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.33%;
      }
    }
  }

  .van-cell-group {
    margin-top: 300px;
  }
</style>

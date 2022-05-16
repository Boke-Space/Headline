<template>
  <div>
    <!-- 头部标签 -->
    <van-nav-bar fixed>
      <!--v-slot 缩写# -->
      <template v-slot:left>
        Headline
          <!--  <img src="../../assets/toutiao_logo.png" class="logo"/>-->
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" color="#fff" @click="$router.push('/search')"/>
      </template>
    </van-nav-bar>

    <!-- 频道部分 -->
    <!-- 导航栏切换时重新发起请求获得文章列表数据-->
    <!-- 目前切换导航栏会导致原来页面数据刷新-->
    <!-- 现在需要每一个ArticleList都有自己的数据每个页面互不影响-->
    <div class="main">
      <van-tabs v-model="channelId" @change="channelChangeFn" sticky>
        <van-tab v-for="(item, index) in userChannelList" :key="index" :title="item.name">
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>

      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="show = true"/>
    </div>


    <!-- 弹出层组件 -->
    <van-popup v-model="show" class="edit_wrap">
      <ChannelEdit  :selectedList="userChannelList" :unselectedList="unselectedChannelList"
        @add-channel="addChannel" @delete-channel="deleteChannel" ref="editRef"
        @close-channel="closeChannel" v-model="channelId">
      </ChannelEdit>
    </van-popup>

  </div>
</template>

<script>
import { getAllChannelListAPI, getUserChannelAPI, updateChannelAPI, deleteChannelAPI } from '../../api'
  import ArticleList from './ArticleList'
  import ChannelEdit from './ChannelEdit'
  export default {
    name: 'Home',
    components: { ChannelEdit, ArticleList },
    data() {
      return {
        channelId: 0,           // tab导航 激活频道Id
        userChannelList: [],    // 用户选择频道列表
        allChannelList: [],     // 所有频道列表
        show: false,             // 编辑频道弹出层显示
        channelScrollTObj: {} // 保存每个频道的滚动位置
        // 值样子构想: {推荐频道ID: 滚动距离, html频道ID: 自己滚动距离}
      }
    },
    computed: {
      //  用户未选择的频道 = 所有频道列表 - 用户选择频道列表
      //  简便写法
      // return this.allChannelList.filter((bigObj) =>
      // this.userChannelList.findIndex((smallObj) =>
      // smallObj.id === bigObj.id) === -1)
      unselectedChannelList() {
        const unselectedArr = this.allChannelList.filter(all => {
          const index = this.userChannelList.findIndex(user => user.id === all.id)
          if (index > -1) return false
          else  return true
        })
        return  unselectedArr
      }
    },
    async created() {
      // 用户选择频道列表
      const res = await getUserChannelAPI()
      this.userChannelList = res.data.data.channels
      // 所有频道列表
      const res2 = await getAllChannelListAPI()
      this.allChannelList = res2.data.data.channels
    },
    // 只有使用keep-alive的组件才有这2个生命周期
    activated () { // 切回来
      console.log(this.$route)
      window.addEventListener('scroll', this.scrollFn)
      // window和document, 监听网页滚动的事件
      // html标签获取scrollTop, 滚动的距离, 和设置滚动的位置
      // 立刻设置, 滚动条位置
      document.documentElement.scrollTop = this.$route.meta.scrollT
      document.body.scrollTop = this.$route.meta.scrollT
    },
    deactivated () { // 切走
      window.removeEventListener('scroll', this.scrollFn)
    },
    // 先切走了, 滚动条回到顶部, 才触发deactivated失焦, 所以拿不到滚动位置了
    methods: {
      // tabs切换的事件  ->  获取文章列表数据
      channelChangeFn () {
        // tab切换后, 设置滚动条位置
        // tab切换时, 这个组件内部, 会把切走的容器height设置为0, 滚动条因为没有高度回到了顶部
        // 切回来的一瞬间, 没有高度, 滚动事件从底下上来也被触发了, 所以才把数据里设置为0
        // 切换来的一瞬间, 高度为0, 你设置滚动位置也无用
        this.$nextTick(() => {
          document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
          document.body.scrollTop = this.channelScrollTObj[this.channelId]
        })
      },
      //  添加频道
      async addChannel(unselected) {
        this.userChannelList.push(unselected)
        // 上面的代码出问题, 新增时, 名字被删除了
        // 原因: 所有数组里的对象, 都是同一个内存地址, 影响到ChannelEdit.vue中对象
        // 解决方法
        const newArr = this.userChannelList.filter((obj) => obj.id !== 0)
        const theNewArr = newArr.map((obj, index) => {
          const newObj = { ...obj } // 拷贝(浅拷贝)
          delete newObj.name
          newObj.seq = index
          return newObj // 让map方法把新对象收集起来形成一个新数组
        })
        const res = await updateChannelAPI({
          channels: theNewArr
        })
      },
      //  删除频道
      async deleteChannel(selected) {
        const index = this.userChannelList.findIndex(user => user.id === selected.id)
        this.userChannelList.splice(index, 1)
        const res = await deleteChannelAPI({
          channelId: selected.idq
        })
      },
      closeChannel() {
        this.show = false
        this.$refs.editRef.isEdit = false
        //  控制子组件ChannelEdit里的isEdit,使编辑状态变为初始
        //  也可以在在子组件中closePannel()中直接设置为false
      },
      // 监听网页滚动事件
      scrollFn () {
        // 谷歌浏览器内核, 和安卓手机内置浏览器的内核不是同一个
        // 获取scrollTop方式不同
        // 谷歌浏览器用的html的scrollTop
        // 有的浏览器用的body的scrollTop
        // Notify({
        //   message: document.body.scrollTop
        // })
        this.$route.meta.scrollT = document.documentElement.scrollTop || document.body.scrollTop
        // 同时保存当前频道的滚动距离
        this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop || document.body.scrollTop
      }
    }
  }
</script>

<style scoped lang="less">

  .van-nav-bar {
    background-color: #1edada;
  }

  .logo {
    width: 100px;
    height: 30px;
  }

  .main {
    padding-top: 44px;
  }

  // 设置 tabs 容器的样式
  ::v-deep .van-tabs__wrap {
    padding-right: 30px;
    background-color: #fff;
  }

  // 设置小图标的样式
  .moreChannels {
    position: fixed;
    top: 62px;
    right: 8px;
    z-index: 999;
  }

  /* 频道编辑弹出层铺满屏幕 */
  .edit_wrap{
    width: 100vw;
    height: 100vh;
  }

</style>

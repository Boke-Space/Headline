<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
<!--    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />-->

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profile.photo" @click="imageClickFn"/>
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange"/>
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profile.name" @click="nameClick"/>
      <van-cell title="生日" is-link :value="profile.birthday" @click="birthdayClick"/>
    </van-cell-group>

    <!-- 姓名修改弹窗 -->
    <van-dialog v-model="show" title="标题" show-cancel-button :before-close="beforeCloseFn">
      <input type="text" v-fofo v-model="inputUserName" />
    </van-dialog>

    <!-- 时间选择器 -->
    <!-- 组件可以自己搭配使用 -->
    <van-popup round v-model="dateTimePickerShow" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日"
        :min-date="minDate" :max-date="maxDate" @confirm="confirmDatetime"
        @cancel="dateTimePickerShow = false" />
    </van-popup>

  </div>
</template>

<script>
import { getUserProfileAPI, updateUserAvatarAPI, updateUserInfoAPI } from '../../api'
import { Notify } from 'vant'
import { formatDate } from '../../utils/date'
import { mapMutations } from 'vuex/dist/vuex.mjs'

  export default {
    name: 'UserEdit',
    data () {
      return {
        profile: {},            // 用户基本资料
        show: false,            // 控制姓名修改输入框出现/隐藏
        inputUserName: '',      // 修改名字-弹出框输入框绑定值
        minDate: new Date(1922, 0, 1),      // 最小范围
        maxDate: new Date(),                                // 最大范围 (默认获取系统日期-今日)
        currentDate: new Date(),                            // 当前时间
        dateTimePickerShow: false                           // 日期选择器-弹出层显示/隐藏
      }
    },
    async created() {
      const res = await getUserProfileAPI()
      this.profile = res.data.data
    },
    methods: {
      ...mapMutations(['USERPHOTO']),
      // 文件选择方法
      async onFileChange (e) {
        if (!e.target.files.length) return // 用户可能没有选择图片文件阻止代码往下
        console.log(e.target.files[0])
        const formData = new FormData()
        formData.append('photo', e.target.files[0])
        const res = await updateUserAvatarAPI(formData)
        this.profile.photo = res.data.data.photo
        console.log(res)
        this.USERPHOTO(res.data.data.photo)   //更新成功后同步到vuex
      },
      // 图片 - 点击事件
      imageClickFn () {
        this.$refs.iptFile.click() // JS模拟标签的事件触发, 为了让input[file]文件选择窗口出现
      },
      // 姓名 - 点击事件
      nameClick () {
        this.show = true
        this.inputUserName = this.profile.name
      },
      // 生日单元格 - 点击事件
      birthdayClick () {
        this.dateTimePickerShow = true // 时间选择器出现
        // 数据和页面显示 -> 年-月-日 格式的字符串
        // datetimePicker组件 -> 日期对象
        this.currentDate = new Date(this.profile.birthday) // 组件显示默认生日
      },
      // 日期选择器- 完成确认时间
      async confirmDatetime() {
        await updateUserInfoAPI({
          birthday: formatDate(this.currentDate)
        })
        this.dateTimePickerShow = false
        this.profile.birthday = formatDate(this.currentDate)
      },
      // 姓名 - 确认框 - 关闭前回调函数
      async beforeCloseFn (action, done) {
        if (action === 'confirm') {
          // utf-8 编码成 我们认识的 中文字符
          // url 编码 %E4%BB%8A%E6%99%9A
          // unicode 编码 \u4eca\u665a
          // \u4e00   ->   一
          // \u9fa5   ->   龥 yu(4声)
          const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
          if (reg.test(this.inputUserName) === true) {
            await updateUserInfoAPI({
              name: this.inputUserName
            })
            this.profile.name = this.inputUserName
            done()
          } else {
            Notify({
              type: 'warning',
              message: '用户名只能是1-7位中英数字组合'
            })
            done(false)
          }
        } else done()
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-edit-container {
    .avatar {
      width: 50px;
      height: 50px;
    }
  }

  ::v-deep .van-dialog__content {
    text-align: center;
    input {
      padding: 0;
      outline: none;
      border: none;
      text-align: center;
    }
  }
</style>

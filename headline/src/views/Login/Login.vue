<template>
  <div>
    <van-nav-bar title="Headline" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="formLogin.mobile"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
        required
        :rules="[
          {
            required: true,
            message: '请填写手机号',
            trigger: 'onChange',
            pattern: /^1[3456789]\d{9}$/,
          },
        ]"
      />
      <van-field
        v-model="formLogin.code"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        :rules="[
          {
            required: true,
            message: '请填写密码',
            trigger: 'onChange',
            pattern: /^\d{6}$/,
          },
        ]"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :loading="isLoding"
          :disabled="isLoding"
          loading-text="程序员拼命加载ing...">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '../../api'
import { Notify } from 'vant'
import { setToken } from '../../utils/token'

export default {
  name: 'Login',
  data () {
    return {
      formLogin: {
        mobile: '13888888888',
        code: '246810' // 默认只能用246810后台规定了
      },
      isLoding: false // 加载状态
    }
  },
  methods: {
    async onSubmit () {
      this.isLoding = true
      try {
        const res = await loginAPI(this.formLogin)
        console.log(res)
        Notify({ type: 'success', message: '登录成功' })
        setToken(res.data.data.token)
        localStorage.setItem('refreshToken', res.data.data.refresh_token)
        // this.$router.push() 压栈 会产生历史记录，可以回退
        // this.$router.replace() 替换  不会产生历史记录
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
          // 因为我们路由规则里/layout里没有重定向, 所以直接在这里写全
          // 前面不存在就返回/layout/home
        })
      } catch (err) {
        Notify({ type: 'warning', message: '手机号或密码错误' })
      }
      this.isLoding = false
    }
  }
}
</script>

<style scoped lang="less">
  .van-nav-bar {
    background-color: #1edada;

    /deep/ .van-nav-bar__title {
      color: white;
    }
  }

  .van-button {
    background-color: #1edada;
    border-radius: 25px;
  }
</style>

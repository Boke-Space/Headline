// vue.config.js
const path = require('path')
module.exports = {
  devServer: { // 服务器配置
    proxy: { // 代理配置
      // 后端完整接口地址: http://c.hm.163.com/nc/article/eadline/T1348647853363/0-40.html
      '/api': { // 请求相对路径以/api开头的, 才会走这里的配置
        target: 'http://c.m.163.com', // 在请求的axios的url前面拼接这个target地址
        // target+url 变成服务器代理请求的完整路径
        changeOrigin: true, // 改变请求来源(欺骗后台你的请求是从http://c.m.163.com)
        pathRewrite: { // 请求的url路径重写
          '^/api': '' // 因为真实路径中并没有/api这段, 所以要去掉这段才能拼接正确地址转发请求
        }
      }
    }
  },
  publicPath: './' // 告诉webpack打包的index.html引入其他资源文件以./开头, 不要默认/开头
}

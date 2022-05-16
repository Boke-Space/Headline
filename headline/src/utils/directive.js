// 插件对象(必须有install方法, 才可以注入到Vue.use中)
import Vue from 'vue'

const diretivesObj = {
  install () {
    Vue.directive('fofo', {
      inserted (el) {
        // 指令所在van-search组件
        // 组件根标签是div, input在内部
        // 以上都是原生标签对象
        // 搜索页面 el是div
        // 文章评论 el是textarea
        // 以后el还可能是input呢
        // 知识点: 原生DOM.nodeName 拿到标签名字 (注意: 大写的字符串)
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          // 判断: 不一定能获取得到, 需要加判断, 有值了, 再执行.focus()才不报错
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      }
    })
  }
}

export default diretivesObj

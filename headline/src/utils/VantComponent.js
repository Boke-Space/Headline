import Vue from 'vue'
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem,
  Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet,
  Popup, Row, Col, Badge, Search, Divider, Image as VanImage,
  Tag, CellGroup, Dialog, DatetimePicker, Loading, Lazyload
} from 'vant'

Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Popup)
Vue.use(Badge)
Vue.use(Row)
Vue.use(Col)
Vue.use(Search)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(DatetimePicker)
Vue.use(Loading)
Vue.use(Lazyload, {
  preLoad: 0.8, // 屏幕高度的范围百分比0-1, 预加载范围
  error: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_pic%2F19%2F01%2F05%2F93bf94dfeaf09010234db46956e3e864.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641697127&t=b9a5b72127fb33b467af142f34fef841' // 懒加载图片失败, 使用错误提示图片
})

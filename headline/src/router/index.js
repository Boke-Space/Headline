import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '../utils/token'
const Login = () => import('../views/Login/Login')
const Layout = () => import('../views/Layout/Layout')
const Home = () => import('../views/Home/Home')
const User = () => import('../views/User/User')
const Search = () => import('../views/Search/Search')
const SearchResult = () => import('../views/Search/SearchResult')
const ArticleDetail = () => import('../views/ArticleDetail/ArticleDetail')
const UserEdit = () => import('../views/User/UserEdit')
const Chat = () => import('../views/Chat/Chat')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: Login,
    // 路由独享守卫
    beforeEnter (to, from, next) {
      if (getToken()?.length > 0) {
        // next(false)
        // 问题: 你手动修改url路由路径, next(false)会给你跳转回form页面
        // 产生一次历史记录, 导致你的返回按钮, $router.back()失效
        // 返回登录页, 回不去
        // 解决:
        // 1. 想要进登录页不留在原地了, 而是返回首页
        next('/layout/home')
        // 2. 移动端App也没有地址栏, 不必特别纠结返回按钮
      } else {
        next() // 其他情况通通放行
      }
    }
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home,
        meta: {
          scrollT: 0 // 保存首页离开时, 滚动条位置
        }
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/search_result/:kw',
    component: SearchResult
  },
  {
    path: '/detail',
    component: ArticleDetail
  },
  {
    path: '/edit',
    component: UserEdit
  },
  {
    path: '/chat',
    component: Chat
  }
]

const router = new VueRouter({
  routes
})

// 路由 - 全局前置守卫(在路由发生真正跳转之前, 执行此函数)
// 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
// router.beforeEach((to, from, next) => {
//   // 需求: 如果你已经登录了, 不要切换到登录页面
//   if (getToken()?.length > 0 && to.path === '/login') {
//     // 想要进登录页不留在原地了, 而是返回首页
//     next('/layout/home')
//   } else {
//     next() // 其他情况通通放行
//   }
// })


export default router

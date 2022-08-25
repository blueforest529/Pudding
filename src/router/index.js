import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/checkresources',
    name: 'checkresources',
    component: () => import(/* webpackChunkName: "checkresources" */ '../views/CheckResourcesView.vue')
  },
  {
    path: '/recentupdate',
    name: 'recentupdate',
    component: () => import(/* webpackChunkName: "recentupdate" */ '../views/RecentUpdateView.vue')
  },
  {
    path: '/rulesofuse',
    name: 'rulesofuse',
    component: () => import(/* webpackChunkName: "rulesofuse" */ '../views/RulesOfUseView.vue')
  },
  {
    path: '/translationrequest',
    name: 'translationrequest',
    component: () => import(/* webpackChunkName: "translationrequest" */ '../views/TranslationRequestView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

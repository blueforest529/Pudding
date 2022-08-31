<<<<<<< HEAD
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
=======
import Vue from "vue";
import Router from "vue-router";
import store from '../store';
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import CheckResourcesView from '../views/CheckResourcesView.vue'
import RecentUpdateView from '../views/RecentUpdateView.vue'
import RulesOfUseView from '../views/RulesOfUseView.vue'
import TranslationRequestView from '../views/TranslationRequestView.vue'


Vue.use(Router);

const redirectAuth = () => (from, to, next) => {
    if (store.state.auth.isAuth) return next();
    next("/login");
};

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
          },
          {
            path: '/about',
            name: 'about',
            component: AboutView
          },
          {
            path: '/checkresources',
            name: 'checkresources',
            component: CheckResourcesView
          },
          {
            path: '/recentupdate',
            name: 'recentupdate',
            component: RecentUpdateView
          },
          {
            path: '/rulesofuse',
            name: 'rulesofuse',
            component: RulesOfUseView
          },
          {
            path: '/translationrequest',
            name: 'translationrequest',
            component: TranslationRequestView
          },
    ]
});


  
>>>>>>> 18f7c22a6eca06ca59dd5ac16d691187e046493e

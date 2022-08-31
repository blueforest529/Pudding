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


import Vue from 'vue'
import _ from "lodash";
import dateFormat from 'date-format';

import App from './App.vue'
import router from "./router"
import store from "./store"
import CheckupService from "./service/checkupService"

import axios from 'axios'
import Vuetify from 'vuetify'
import * as VeeValidate from 'vee-validate'

import '@mdi/font/css/materialdesignicons.css' 
import 'vuetify/dist/vuetify.min.css'
import './assets/css/style.css'

import NavDrawer from "./components/common/NavDrawer.vue";
Vue.component("nav-drawer", NavDrawer);

const checkup = new CheckupService();

Vue.prototype._ = _;
Vue.prototype.$axios        = axios
Vue.prototype.$checkup      = checkup
Vue.prototype.dateFormat    = dateFormat;
Vue.prototype.isDev         = process.env.NODE_ENV === 'development';
Vue.prototype.rootPath      = process.env.NODE_ENV === 'development' ? '/' : '/tools/';

Vue.use(Vuetify);
Vue.use(VeeValidate);

new Vue({
    router,
    store,
    vuetify: new Vuetify({
      theme: {
        themes: {
          light: {
            primary: '#3f51b5',
            secondary: '#b0bec5',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
        },
      },
    }),
    render: h => h(App)
  }).$mount('#app')

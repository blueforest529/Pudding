<<<<<<< HEAD
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
=======
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

import  auth  from "./modules/auth";
import  product  from "./modules/product";

Vue.use(Vuex) 
const store = new Vuex.Store({
    modules: { 
        auth: auth,
        product: product
    },
    plugins: [ 
        createPersistedState({ 
            paths: ["auth"], 
        }), 
    ], 
}) 

export default store
>>>>>>> 18f7c22a6eca06ca59dd5ac16d691187e046493e

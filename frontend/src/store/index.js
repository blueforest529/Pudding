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

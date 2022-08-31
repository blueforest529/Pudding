import Vue from 'vue'
import router from '../../router';

const auth = {
    state: { 
        isAuth: false,
        defaultInfo:{},
        checkOptions:{
            basic : {company : '', site : '', engineer : '', customer : ''},
            date:{start_date: '', end_date:''},
            ck_items: [],
            logo_file: ''
        }
    }, 
    mutations: {
        login(state, payload) {
            if (!payload.auth) {
                state.defaultInfo = {};
                state.checkOptions = {};
                window.localStorage.clear();
            }
            state.isAuth = payload.auth;
        }, 
        isAuth(state, status) {
            if (status == 401 || !status) {
                state.isAuth = false;
                state.defaultInfo = {};
                state.checkOptions = {};
                window.localStorage.clear();
                window.location.replace(Vue.prototype.rootPath);
                
            } 
        },
        defaultInfo(state, payload) {
            state.defaultInfo = payload;
        },
        checkOptions(state, payload) {
            state.checkOptions = payload;
        }
    }, 
    actions:{ 
    } 
}

export default auth
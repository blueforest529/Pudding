webpackJsonp([6],{NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("7+uW"),i={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("v-navigation-drawer",{attrs:{app:""},model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[n("v-list-item",[n("v-list-item-icon",[n("v-icon",[e._v("mdi-home")])],1),e._v(" "),n("v-list-item-content",[n("v-list-item-title",{staticClass:"text-h6"},[e._v("\n                    PUDDING\n                ")])],1)],1),e._v(" "),n("v-divider"),e._v(" "),n("v-list",{staticClass:"red_list"},[n("v-list-item-group",{model:{value:e.model,callback:function(t){e.model=t},expression:"model"}},e._l(e.menus,function(t,r){return n("v-list-item",{key:r,attrs:{link:"",to:{path:t.to}}},[n("v-list-item-icon",[n("v-icon",[e._v(e._s(t.icon))])],1),e._v(" "),n("v-list-item-content",[n("v-list-item-title",[e._v(e._s(t.text))])],1)],1)}),1)],1)],1),e._v(" "),n("div",{staticStyle:{float:"left","margin-left":"10px","margin-top":"350px","margin-bottom":"350px"}},[n("v-icon",{attrs:{large:"",color:"#367fc4"},on:{click:function(t){e.drawer=e.menuclick()}}},[e._v("\n            "+e._s(e.icon)+"\n        ")])],1)],1)},staticRenderFns:[]};var o={name:"App",data:function(){return{}},components:{"nav-drawer":n("VU/8")({data:function(){return{drawer:!1,icon:"mdi-chevron-right",menus:[{icon:"mdi-view-dashboard",text:"기본정보",to:"/"},{icon:"mdi-cards-heart",text:"최근 업데이트",to:"/recentupdate"},{icon:"mdi-needle",text:"리소스 확인",to:"/checkresources"},{icon:"mdi-file-chart",text:"번역요청",to:"/translationrequest"},{icon:"mdi-alien-outline",text:"리소스 작성 가이드",to:"/rulesofuse"}],model:[{to:"/"}]}},methods:{menuclick:function(){return this.drawer?this.icon="mdi-chevron-right":this.icon="mdi-chevron-left",!this.drawer}}},i,!1,function(e){n("a1YE")},null,null).exports}},a={render:function(){var e=this.$createElement,t=this._self._c||e;return t("v-app",[t("div",[t("v-main",[t("nav-drawer"),this._v(" "),t("v-container",{attrs:{fluid:""}},[t("router-view")],1)],1)],1)])},staticRenderFns:[]},l=n("VU/8")(o,a,!1,null,null,null).exports,c=n("/ocq"),s={render:function(){var e=this.$createElement;return(this._self._c||e)("div",[this._v("\n  hello\n")])},staticRenderFns:[]},u={name:"Home",components:{HelloWorld:n("VU/8")({name:"HelloWorld",data:function(){return{}}},s,!1,null,null,null).exports}},d={render:function(){var e=this.$createElement;return(this._self._c||e)("hello-world")},staticRenderFns:[]},m=n("VU/8")(u,d,!1,null,null,null).exports;r.default.use(c.a);var v=[{path:"/",name:"home",component:m},{path:"/about",name:"about",component:function(){return n.e(4).then(n.bind(null,"ZwIO"))}},{path:"/checkresources",name:"checkresources",component:function(){return n.e(3).then(n.bind(null,"Av2g"))}},{path:"/recentupdate",name:"recentupdate",component:function(){return n.e(2).then(n.bind(null,"pBxc"))}},{path:"/rulesofuse",name:"rulesofuse",component:function(){return n.e(1).then(n.bind(null,"oUTg"))}},{path:"/translationrequest",name:"translationrequest",component:function(){return n.e(0).then(n.bind(null,"rfuR"))}}],f=new c.a({mode:"history",base:Object({NODE_ENV:"production"}).BASE_URL,routes:v}),h=n("LvQi");r.default.use(h.a);var p=new h.a.Store({state:{},getters:{},mutations:{},actions:{},modules:{}}),_=n("3EgV"),b=n.n(_);r.default.config.productionTip=!1,r.default.use(b.a),new r.default({router:f,store:p,vuetify:new b.a({theme:{themes:{light:{primary:"#3f51b5",secondary:"#b0bec5",accent:"#8c9eff",error:"#b71c1c"}}}}),render:function(e){return e(l)}}).$mount("#app")},a1YE:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.fe5c95abc70fdb76fe07.js.map
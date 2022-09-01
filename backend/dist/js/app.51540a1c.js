(function(){"use strict";var t={1703:function(t,e,n){var r=n(144),o=n(998),s=n(2150),i=n(3059),a=function(){var t=this,e=t._self._c;return e(o.Z,[e("div",[e(i.Z,[e("nav-drawer"),e(s.Z,{attrs:{fluid:""}},[e("router-view")],1)],1)],1)])},u=[],l=n(9223),c=n(4716),f=n(4878),h=n(9949),m=n(6091),d=n(4219),p=n(4611),v=n(7180),y=function(){var t=this,e=t._self._c;return e("div",[e(v.Z,{attrs:{app:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[e(h.Z,[e(p.Z,[e(c.Z,[t._v("mdi-home")])],1),e(m.km,[e(m.V9,{staticClass:"text-h6"},[t._v(" PUDDING ")])],1)],1),e(l.Z),e(f.Z,{staticClass:"red_list"},[e(d.Z,{model:{value:t.model,callback:function(e){t.model=e},expression:"model"}},t._l(t.menus,(function(n,r){return e(h.Z,{key:r,attrs:{link:"",to:{path:n.to}}},[e(p.Z,[e(c.Z,[t._v(t._s(n.icon))])],1),e(m.km,[e(m.V9,[t._v(t._s(n.text))])],1)],1)})),1)],1)],1),e("div",{staticStyle:{float:"left","margin-left":"10px","margin-top":"350px","margin-bottom":"350px"}},[e(c.Z,{attrs:{large:"",color:"#367fc4"},on:{click:function(e){t.drawer=t.menuclick()}}},[t._v(" "+t._s(t.icon)+" ")])],1)],1)},b=[],x={data:()=>({drawer:!1,icon:"mdi-chevron-right",menus:[{icon:"mdi-view-dashboard",text:"기본정보",to:"/"},{icon:"mdi-cards-heart",text:"최근 업데이트",to:"/recentupdate"},{icon:"mdi-needle",text:"리소스 확인",to:"/checkresources"},{icon:"mdi-file-chart",text:"번역요청",to:"/translationrequest"},{icon:"mdi-alien-outline",text:"리소스 작성 가이드",to:"/rulesofuse"}],model:[{to:"/"}]}),methods:{menuclick(){return this.drawer?this.icon="mdi-chevron-right":this.icon="mdi-chevron-left",!this.drawer}}},_=x,g=n(1001),Z=(0,g.Z)(_,y,b,!1,null,null,null),w=Z.exports,k={name:"App",data:()=>({}),components:{"nav-drawer":w}},j=k,C=(0,g.Z)(j,a,u,!1,null,null,null),P=C.exports,O=n(8345),S=n(629);r.ZP.use(S.ZP);var T,q,V,D,M,W,A,E,F=new S.ZP.Store({state:{},getters:{},mutations:{},actions:{},modules:{}}),H=function(){var t=this,e=t._self._c;return e("hello-world")},L=[],N=n(266),I=n(924),G=n(1713),Q=function(){var t=this,e=t._self._c;return e(s.Z,[e(G.Z,{staticClass:"text-center"},[e(N.Z,{attrs:{cols:"12"}},[e(I.Z,{staticClass:"my-3",attrs:{src:n(9574),contain:"",height:"200"}})],1),e(N.Z,{staticClass:"mb-4"},[e("h1",{staticClass:"display-2 font-weight-bold mb-3"},[t._v(" Welcome to Vuetify ")]),e("p",{staticClass:"subheading font-weight-regular"},[t._v(" For help and collaboration with other Vuetify developers, "),e("br"),t._v("please join our online "),e("a",{attrs:{href:"https://community.vuetifyjs.com",target:"_blank"}},[t._v("Discord Community")])])]),e(N.Z,{staticClass:"mb-5",attrs:{cols:"12"}},[e("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v(" What's next? ")]),e(G.Z,{attrs:{justify:"center"}},t._l(t.whatsNext,(function(n,r){return e("a",{key:r,staticClass:"subheading mx-3",attrs:{href:n.href,target:"_blank"}},[t._v(" "+t._s(n.text)+" ")])})),0)],1),e(N.Z,{staticClass:"mb-5",attrs:{cols:"12"}},[e("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v(" Important Links ")]),e(G.Z,{attrs:{justify:"center"}},t._l(t.importantLinks,(function(n,r){return e("a",{key:r,staticClass:"subheading mx-3",attrs:{href:n.href,target:"_blank"}},[t._v(" "+t._s(n.text)+" ")])})),0)],1),e(N.Z,{staticClass:"mb-5",attrs:{cols:"12"}},[e("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v(" Ecosystem ")]),e(G.Z,{attrs:{justify:"center"}},t._l(t.ecosystem,(function(n,r){return e("a",{key:r,staticClass:"subheading mx-3",attrs:{href:n.href,target:"_blank"}},[t._v(" "+t._s(n.text)+" ")])})),0)],1)],1)],1)},U=[],$={name:"HelloWorld",data:()=>({ecosystem:[{text:"vuetify-loader",href:"https://github.com/vuetifyjs/vuetify-loader"},{text:"github",href:"https://github.com/vuetifyjs/vuetify"},{text:"awesome-vuetify",href:"https://github.com/vuetifyjs/awesome-vuetify"}],importantLinks:[{text:"Documentation",href:"https://vuetifyjs.com"},{text:"Chat",href:"https://community.vuetifyjs.com"},{text:"Made with Vuetify",href:"https://madewithvuejs.com/vuetify"},{text:"Twitter",href:"https://twitter.com/vuetifyjs"},{text:"Articles",href:"https://medium.com/vuetify"}],whatsNext:[{text:"Explore components",href:"https://vuetifyjs.com/components/api-explorer"},{text:"Select a layout",href:"https://vuetifyjs.com/getting-started/pre-made-layouts"},{text:"Frequently Asked Questions",href:"https://vuetifyjs.com/getting-started/frequently-asked-questions"}]})},z=$,B=(0,g.Z)(z,Q,U,!1,null,null,null),J=B.exports,K={name:"Home",components:{HelloWorld:J}},R=K,X=(0,g.Z)(R,H,L,!1,null,null,null),Y=X.exports,tt=function(){var t=this;t._self._c;return t._m(0)},et=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"about"},[e("h1",[t._v("This is an about page")])])}],nt={},rt=(0,g.Z)(nt,tt,et,!1,null,null,null),ot=rt.exports,st={},it=(0,g.Z)(st,T,q,!1,null,null,null),at=it.exports,ut={},lt=(0,g.Z)(ut,V,D,!1,null,null,null),ct=lt.exports,ft={},ht=(0,g.Z)(ft,M,W,!1,null,null,null),mt=ht.exports,dt={},pt=(0,g.Z)(dt,A,E,!1,null,null,null),vt=pt.exports;r.ZP.use(O.ZP);var yt=new O.ZP({routes:[{path:"/",name:"home",component:Y},{path:"/about",name:"about",component:ot},{path:"/checkresources",name:"checkresources",component:at},{path:"/recentupdate",name:"recentupdate",component:ct},{path:"/rulesofuse",name:"rulesofuse",component:mt},{path:"/translationrequest",name:"translationrequest",component:vt}]}),bt=n(8864);r.ZP.use(bt.Z);var xt=new bt.Z({});r.ZP.config.productionTip=!1,new r.ZP({router:yt,store:F,vuetify:xt,render:t=>t(P)}).$mount("#app")},9574:function(t,e,n){t.exports=n.p+"img/logo.4d6033c9.svg"}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var s=e[r]={exports:{}};return t[r](s,s.exports,n),s.exports}n.m=t,function(){var t=[];n.O=function(e,r,o,s){if(!r){var i=1/0;for(c=0;c<t.length;c++){r=t[c][0],o=t[c][1],s=t[c][2];for(var a=!0,u=0;u<r.length;u++)(!1&s||i>=s)&&Object.keys(n.O).every((function(t){return n.O[t](r[u])}))?r.splice(u--,1):(a=!1,s<i&&(i=s));if(a){t.splice(c--,1);var l=o();void 0!==l&&(e=l)}}return e}s=s||0;for(var c=t.length;c>0&&t[c-1][2]>s;c--)t[c]=t[c-1];t[c]=[r,o,s]}}(),function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var t={143:0};n.O.j=function(e){return 0===t[e]};var e=function(e,r){var o,s,i=r[0],a=r[1],u=r[2],l=0;if(i.some((function(e){return 0!==t[e]}))){for(o in a)n.o(a,o)&&(n.m[o]=a[o]);if(u)var c=u(n)}for(e&&e(r);l<i.length;l++)s=i[l],n.o(t,s)&&t[s]&&t[s][0](),t[s]=0;return n.O(c)},r=self["webpackChunkfrontend"]=self["webpackChunkfrontend"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(1703)}));r=n.O(r)})();
//# sourceMappingURL=app.51540a1c.js.map
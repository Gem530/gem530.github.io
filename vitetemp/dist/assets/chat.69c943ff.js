var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,i=(t,r,o)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[r]=o;import{u as n}from"./vuex.cf57797f.js";import"./index.c89e9310.js";import c from"./index.d321daa4.js";import d from"./index.f791b207.js";import m from"./my-friend.cf4df20c.js";import p from"./index.09041d9a.js";import{_ as f}from"./plugin-vue_export-helper.21dcd24c.js";import{d as l,a as x,r as b,l as u,o as j,e as v,m as y,q as O,t as I,u as g,f as h}from"./@vue.0069b3ae.js";import"./vue-router.8c9b9931.js";import"./vuex-persistedstate.fa252374.js";import"./index.3a5a0fca.js";import"./index.63254532.js";import"./index.b27fe81c.js";import"./axios.e7b69eb3.js";import"./avator.a76dfba7.js";const P={class:"content"},_=l((w=((e,t)=>{for(var r in t||(t={}))s.call(t,r)&&i(e,r,t[r]);if(o)for(var r of o(t))a.call(t,r)&&i(e,r,t[r]);return e})({},{name:"chat"}),t(w,r({setup(e){const t=x();n();const r=[d,m,p],o=b({index:0,list:[{icon:"icon-home",text:"首页"},{icon:"icon-smile",text:"好友"},{icon:"icon-user",text:"我的"}]});let s=Number(sessionStorage.getItem("tabNavIndex"));s||(s=0),o.index=s,u((()=>{}));const a=e=>{o.index=e,sessionStorage.setItem("tabNavIndex",e+"")};return(e,s)=>(j(),v("div",{class:"contanir theme",ref_key:"chat",ref:t},[y("div",P,[(j(),O(I(r[g(o).index])))]),h(c,{list:g(o).list,onTabClick:a,defaultIndex:g(o).index},null,8,["list","defaultIndex"])],512))}}))));var w,N=f(_,[["__scopeId","data-v-0a5df2d8"]]);export{N as default};
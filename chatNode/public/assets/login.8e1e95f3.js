var w=Object.defineProperty,S=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var v=(s,e,a)=>e in s?w(s,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[e]=a,m=(s,e)=>{for(var a in e||(e={}))I.call(e,a)&&v(s,a,e[a]);if(F)for(var a of F(e))b.call(e,a)&&v(s,a,e[a]);return s},_=(s,e)=>S(s,E(e));import{d as C,a as N,w as O,o as A,e as x,n as P,r as M,l as U,m as n,B as h,D as f,u as d,f as V,y as G,N as H,O as J}from"./@vue.e9e6dad2.js";import{u as T}from"./vuex.7ea12095.js";import{u as $}from"./vue-router.c4da8ae7.js";import{i as z}from"./index.31c63e4c.js";import{l as L,r as R}from"./index.1c19c252.js";import{_ as B}from"./plugin-vue_export-helper.21dcd24c.js";import{G as c}from"./index.eba3287f.js";import"./vuex-persistedstate.fa252374.js";import"./axios.58752079.js";const j=["width","height"],q={name:"g-code"},K=C(_(m({},q),{props:{w:{default:320},h:{default:150},num:{default:"1000"}},setup(s){const e=s,a=N();O(()=>e.num,(u,r)=>{P(()=>{t()})},{deep:!0,immediate:!0});const t=()=>{var u=a.value,r=u.getContext("2d");r.clearRect(0,0,u.width,u.height);const l=u.height/2;r.font=l+"px bold \u9ED1\u4F53",r.fillStyle="#fff",r.textAlign="center",r.textBaseline="middle",r.fillText(e.num,u.width/2,u.height/2)};return(u,r)=>(A(),x("canvas",{ref_key:"loginCheckout",ref:a,width:e.w,height:e.h},"\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301canvas\uFF0C\u8BF7\u66F4\u6362\u6D4F\u89C8\u5668\u540E\u518D\u8BD5",8,j))}}));var Q=B(K,[["__scopeId","data-v-2c5d53cc"]]);const g=s=>(H("data-v-02012df4"),s=s(),J(),s),W={class:"contanir theme"},X=g(()=>n("div",{class:"login-title"},"LOGIN",-1)),Y={class:"form-input"},Z=g(()=>n("span",null,"\u8D26 \u53F7\uFF1A",-1)),ee={class:"form-input"},te=g(()=>n("span",null,"\u5BC6 \u7801\uFF1A",-1)),se={class:"form-input code"},oe={name:"login"},ae=C(_(m({},oe),{setup(s){const e=T(),a=$(),t=M({num:"",name:"admin",pass:"admin",code:""}),u=/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);e.dispatch("setBaseAction",{isPc:!u}),U(()=>{});const r=()=>{t.num=Math.floor(Math.random()*(9999-1e3+1)+1e3),t.code=t.num};r();const l=()=>{if(t.name){if(!t.pass)return"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"}else return"\u8D26\u53F7\u4E0D\u80FD\u4E3A\u7A7A";return t.code.toString()!==t.num.toString()?"\u9A8C\u8BC1\u7801\u4E0D\u4E00\u81F4":!0},D=()=>{if(l()!==!0)return c({message:l(),type:"error",duration:1500}),!1;const p={name:t.name,pass:t.pass};L(p).then(o=>{c({message:"\u767B\u5F55\u6210\u529F",type:"success",duration:2e3}),console.log(o);const i=o.data[0];e.dispatch("setUserAction",{name:t.name,avator:i.avator,userId:i.Id}),z(),sessionStorage.setItem("token",JSON.stringify(o.token));const k=u?"/chat":"/index";a.push(k)}).catch(o=>{c({message:"\u767B\u5F55\u5931\u8D25\uFF1A"+o.message,type:"error",duration:2e3})})},y=()=>{const p={name:t.name,pass:t.pass};R(JSON.parse(JSON.stringify(p))).then(o=>{c({message:o.message,type:"success",duration:2e3})}).catch(o=>{c({message:"\u6CE8\u518C\u5931\u8D25\uFF1A"+o.message,type:"error",duration:2e3})})};return(p,o)=>(A(),x("div",W,[n("div",{class:G(["box",{"box-mobile":!d(e).getters.base.isPc}])},[X,n("div",Y,[Z,h(n("input",{type:"text",placeholder:"\u8D26\u53F7\uFF1Aadmin","onUpdate:modelValue":o[0]||(o[0]=i=>d(t).name=i)},null,512),[[f,d(t).name]])]),n("div",ee,[te,h(n("input",{type:"password",placeholder:"\u5BC6\u7801\uFF1Aadmin","onUpdate:modelValue":o[1]||(o[1]=i=>d(t).pass=i)},null,512),[[f,d(t).pass]])]),n("div",se,[h(n("input",{type:"text",placeholder:"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801","onUpdate:modelValue":o[2]||(o[2]=i=>d(t).code=i)},null,512),[[f,d(t).code]]),V(Q,{num:d(t).num,w:60,h:30,onClick:r},null,8,["num"])]),n("button",{onClick:D},"\u767B\u5F55"),n("button",{onClick:y},"\u6CE8\u518C")],2)]))}}));var he=B(ae,[["__scopeId","data-v-02012df4"]]);export{he as default};
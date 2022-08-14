var L=Object.defineProperty,S=Object.defineProperties;var j=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var N=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var y=(s,n,i)=>n in s?L(s,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[n]=i,f=(s,n)=>{for(var i in n||(n={}))N.call(n,i)&&y(s,i,n[i]);if(b)for(var i of b(n))O.call(n,i)&&y(s,i,n[i]);return s},w=(s,n)=>S(s,j(n));import{d as W,a as v,r as G,l as C,R as Q,o as P,e as I,B,C as x,u,m as d,x as F,I as T,N as V,O as q,J as z,n as U,f as J,A as K}from"./@vue.e9e6dad2.js";import{_ as X}from"./plugin-vue_export-helper.21dcd24c.js";const _=s=>(V("data-v-c0ac1862"),s=s(),q(),s),Y={class:"photo-overflow"},Z=["width"],ee=_(()=>d("span",null,"\u672A\u83B7\u53D6\u5230\u53D6\u666F\u6846\u62CD\u7167\u6743\u9650",-1)),te=_(()=>d("span",null,"\u8BF7\u70B9\u51FB\u53F3\u4E0A\u89D2\u5237\u65B0\u540E\u6388\u6743\uFF0C\u6216\u8005",-1)),oe=z(" \u76F4\u63A5\u624B\u673A\u62CD\u7167 "),ie=_(()=>d("button",{style:{position:"absolute",top:"0px",left:"0px"}},"\u62CD\u7167",-1)),ne={name:"g-find-frame"},ae=W(w(f({},ne),{props:{width:{default:350},height:{default:200}},emits:["getPhotoBlob"],setup(s,{emit:n}){const i=s,l=v(),g=v(),e=G({flag:!0,imgNewURL:"",widthD:0,heightD:0,clientWidthD:0,clientHeightD:0,photoW:0,photoH:0,photoFlag:!0});C(()=>{navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)?e.flag=!0:e.flag=!1}),Q(()=>{U(()=>{A()})});const A=()=>{e.clientWidthD=document.body.clientWidth,e.clientHeightD=document.body.clientHeight,i.width?(e.widthD=i.width,e.clientWidthD=i.width):e.widthD=e.clientWidthD,i.height?(e.heightD=i.height,e.clientHeightD=i.height):e.heightD=e.clientHeightD;const t=navigator;t.mediaDevices===void 0&&(t.mediaDevices={}),t.mediaDevices.getUserMedia===void 0&&(t.mediaDevices.getUserMedia=function(o){const c=t.webkitGetUserMedia||t.mozGetUserMedia;return c?new Promise(function(h,a){c.call(t,o,h,a)}):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}),t.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"environment"}}).then(function(o){"srcObject"in l.value?l.value.srcObject=o:l.value.src=window.URL.createObjectURL(o),l.value.onloadedmetadata=function(){l.value.play()},U(()=>{l.value.addEventListener("canplay",()=>{e.photoW=l.value.videoWidth,e.photoH=l.value.videoHeight,e.widthD>e.photoW&&(e.widthD=e.photoW),e.heightD>e.photoH&&(e.heightD=e.photoH*e.widthD/e.photoW)})})}).catch(function(o){e.photoFlag=!1,console.log(o.name+": "+o.message,o)})},M=async()=>{if(!e.photoFlag){g.value.click();return}const t=document.createElement("canvas"),o=t.getContext("2d");e.flag?(t.width=e.widthD*2,t.height=e.heightD*2):(t.width=e.widthD,t.height=e.heightD),o.drawImage(l.value,0,0,e.photoW,e.photoW*(e.heightD/e.widthD),0,0,t.width,t.height);const c=t.toDataURL("image/jpeg",1),h=await D(c);n("getPhotoBlob",{blob:h,baseUrl:c})},k=async()=>{const o=document.getElementById("ground-push-image").files[0],c=await H(o),h=await R(c);n("getPhotoBlob",{blob:h,baseUrl:c.src})},H=t=>new Promise((o,c)=>{const h=new Image,a=new FileReader;a.onload=function(r){h.src=r.target.result},a.onerror=function(r){c(r)},a.readAsDataURL(t),h.onload=function(){o(h)},h.onerror=function(r){c(r)}}),R=(t,o=.13)=>new Promise(async(c,h)=>{try{const a=document.createElement("canvas"),r=a.getContext("2d"),{width:p,height:m}=t;a.width=p,a.height=m,r.clearRect(0,0,p,m),r.drawImage(t,0,0,p,m);const $=a.toDataURL("image/jpeg",o),E=await D($);c(E)}catch(a){h(a)}}),D=t=>{const o=window.atob(t.split(",")[1]),c=new ArrayBuffer(o.length),h=new Uint8Array(c);for(let a=0;a<o.length;a++)h[a]=o.charCodeAt(a);return new Blob([c],{type:"image/jpeg"})};return(t,o)=>(P(),I("div",{class:"component theme",style:F(`width: ${u(e).clientWidthD}px;height: ${u(e).heightD}px;`)},[B(d("div",Y,[d("video",{class:"video-contain",ref_key:"video",ref:l,id:"video",width:u(e).clientWidthD,autoplay:"",playsinline:"","webkit-playsinline":"true",muted:""},null,8,Z)],512),[[x,u(e).photoFlag]]),B(d("div",{class:"error",style:F(`width: ${u(e).clientWidthD}px;height: ${u(e).heightD}px;`)},[ee,te,d("button",null,[oe,d("input",{type:"file",ref_key:"qrcodeImageDom",ref:g,id:"ground-push-image",onChange:k,accept:"image/*",capture:""},null,544)])],4),[[x,!u(e).photoFlag]]),d("div",{class:"btn-photo",onClick:M},[T(t.$slots,"default",{},()=>[ie],!0)])],4))}}));var se=X(ae,[["__scopeId","data-v-c0ac1862"]]);const ce={class:"contanir theme"},he=d("button",{style:{width:"100px",height:"30px","text-align":"center","line-height":"30px",color:"red"}},"\u62CD-\u62CD-\u7167",-1),le=["src"],de={name:"findFrame"},pe=W(w(f({},de),{setup(s){const n=v("");C(()=>{});const i=l=>{n.value=l.baseUrl};return(l,g)=>(P(),I("div",ce,[J(se,{width:500,height:300,onGetPhotoBlob:i},{default:K(()=>[he]),_:1}),d("img",{src:n.value,alt:""},null,8,le)]))}}));export{pe as default};
var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable,o=(t,r,a)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a,s=(e,t)=>{for(var r in t||(t={}))n.call(t,r)&&o(e,r,t[r]);if(a)for(var r of a(t))u.call(t,r)&&o(e,r,t[r]);return e},i=(e,a)=>t(e,r(a));import{a as d}from"./axios.e7b69eb3.js";function p({method:e="GET",url:t="",data:r={},header:a={},timeout:n=6e4,showLoading:u=!1}){return new Promise(((u,o)=>{let p={};p="post"===e||"POST"===e||"put"===e||"PUT"===e?{data:r||{}}:{params:r||{}},d(i(s({},p),{timeout:n,url:"https://57k67j9137.zicp.fun"+t,method:e,headers:Object.assign({token:"Bearer "+(sessionStorage.getItem("token")||"")},a)})).then((e=>{const{status:t,data:r}=e;200===t&&0!==r.code?u(r):o(r)})).catch((e=>{o(i(s({},e),{message:e.response.data}))}))}))}function c(e){return p({method:"POST",url:"/api/register",data:e})}function l(e){return p({method:"POST",url:"/api/userList",data:e})}function f(e){return p({method:"POST",url:"/api/sendMsgFriend",data:e})}function m(e){return p({method:"GET",url:"/api/getMsgList",data:{userId:e}})}function h(e){return p({method:"GET",url:"/api/getUnreadMsg",data:{userId:e}})}function O(e){return p({method:"POST",url:"/api/getUserMsgRecord",data:e})}function g(e){return p({method:"POST",url:"/api/updateUnreadMsg",data:e})}function P(e){return p({method:"POST",url:"/api/userFriendList",data:{userId:e}})}function T(e){return p({method:"POST",url:"/api/userFriendRequestList",data:{userId:e}})}function b(e){return p({method:"GET",url:"/api/getUserInfo",data:{userId:e}})}function S(e){return p({method:"POST",url:"/api/friendApply",data:e})}function j(e){return p({method:"POST",url:"/api/updateFriendRequest",data:e})}function y(e){return p({method:"POST",url:"/api/createGroup",data:e})}function I(e){return p({method:"POST",url:"/api/userGroupList",data:{userId:e}})}export{h as a,I as b,T as c,j as d,g as e,O as f,m as g,y as h,l as i,b as j,S as k,c as r,f as s,P as u};
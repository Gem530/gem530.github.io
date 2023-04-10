<template>
  <div>
    <h3>主系统首页</h3>
    <router-link :to="'/child/home'">跳转=>child</router-link>
    <br />
    <router-link :to="'/admin/login'">跳转=>admin</router-link>
  </div>
</template>
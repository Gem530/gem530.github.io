<template>
  <div class="home">
    <h3>子项目</h3>
    <router-link :to="'/'">跳转=>main</router-link>
    <br />
    <router-link :to="'/admin/login'">跳转=>admin</router-link>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
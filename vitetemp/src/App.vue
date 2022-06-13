<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
    import { getCurrentInstance } from 'vue'

    // 全局方法
    const app = getCurrentInstance()?.appContext.config.globalProperties

    // console.log(app)
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  overflow: hidden;
}
</style>

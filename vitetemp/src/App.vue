<template>
    <div>
        <router-view></router-view>
        <!-- <router-view v-slot="{ Component }">
            <keep-alive :include="includeList">
                <component :is="Component"/>
            </keep-alive>
        </router-view> -->
    </div>
</template>

<script setup lang="ts">
    import { getCurrentInstance } from 'vue'
    import { initScoket } from '@/util/ws.js'
    initScoket()

    // 全局方法
    const app = getCurrentInstance()?.appContext.config.globalProperties

    // console.log(app)
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}

html,
body,
#app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

button {
    min-width: 30px;
    min-height: 30px;
    background: skyblue;
    border: none;
    padding: 0 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    color: #ffffff;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
}
</style>

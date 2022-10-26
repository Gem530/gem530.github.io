<template>
  <!-- 加上key，是防止页面切换后，再返回时，页面不加载 -->
  <router-view v-slot="{ Component, route }" :key="key">
    <transition name="slide-fade" appear>
      <!-- appear 首次渲染应用过渡效果，可以添加appear。 在router-view加上key时，不加appear也会没有过渡效果 -->
      <component :is="Component" :key="route.path"></component>
    </transition>
  </router-view>

  <Footer></Footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const key = computed(() => route.path + '/' + (new Date()).getTime() + Math.random())
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  outline: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html,body {
  overflow-x: hidden;
}

h1 {
  color: aqua;
}
</style>

<template>
  <div>
    home
    <HelloWorld msg="hello world Vue3 Vite!" data-temp="111"></HelloWorld>
  </div>
</template>

<script lang="ts">
export default { name: 'home' }
</script>
<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
  import loadDom from '@/components/load.vue'
  import errDom from '@/components/err.vue'
  // const HelloWorld = defineAsyncComponent(() => import('./components/HelloWorld.vue'))
  // https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent vue官方异步组件
  const HelloWorld = defineAsyncComponent({
    loader: () => import('@/components/HelloWorld.vue'),
    delay: 100,
    timeout: 3000,
    errorComponent: errDom,
    loadingComponent: loadDom
  })
</script>

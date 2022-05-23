<template>
  <div>
    home
    {{tips}}
    <Hello-world msg="hello world Vue3 Vite!" data-temp="111"></Hello-world>
  </div>
</template>

<script lang="ts">
export default { name: 'home' }
</script>
<script setup lang="ts">
  import { provide, defineAsyncComponent } from 'vue'
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

  const tips = ref('tips-提示测试使用provide/inject')
  const changeInject = () => {
    tips.value = 'tips-值改变了'
    console.log(111)
  }

  provide('tips', tips) // 直接给tips，孙组件就是响应式的，这里改变了，孙组件里的值也会改变； 如果是tips.value就不是响应式的
  provide('changeInject', changeInject)
</script>

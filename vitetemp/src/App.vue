<template>
  <div>
    <left-dom></left-dom>
    <top-dom></top-dom>
    <content-dom></content-dom>
  </div>
</template>

<script setup lang="ts">
  import { getCurrentInstance } from 'vue'
  import leftDom from '@/components/base/left.vue'
  import topDom from '@/components/base/top.vue'
  import contentDom from '@/components/base/content.vue'

  // 全局方法
  const app = getCurrentInstance()?.appContext.config.globalProperties

  console.log(app)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

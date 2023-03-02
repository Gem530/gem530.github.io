<template>
  <div class="side-bar theme">
    <div class="logo">
      <img src="https://img1.baidu.com/it/u=2644452384,3800439215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="">
      <span v-if="!layoutStore.isCollapse">GEM-ADMIN</span>
    </div>
    <g-menu></g-menu>
  </div>
</template>

<script lang="ts" setup name="side-bar">
import useLayoutStore from '@/store/modules/layout'
const layoutStore = useLayoutStore()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sidebar.scss';
</style>
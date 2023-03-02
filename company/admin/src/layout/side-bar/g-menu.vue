<template>
  <el-menu
    mode="vertical"
    :unique-opened="false"
    :collapse="isCollapse"
    :collapse-transition="false"
    :default-active="defaultActive"
    :default-openeds="activeCollapse"
    @open="openMenu"
    @close="closeMenu"
  >
    <g-sub-menu
      :route="item"
      :key="item.path"
      v-for="item in userStore.menus"
    ></g-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup name="g-menu">
import { computed } from 'vue'
import useUserStore from '@/store/modules/user'
import useLayoutStore from '@/store/modules/layout'
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const isCollapse = computed(() => layoutStore.isCollapse)
const defaultActive = computed(() => layoutStore.defaultActive)
const activeCollapse = computed(() => layoutStore.activeCollapse)

const openMenu = (index: any) => {
  // console.log(index)
  layoutStore.pushCollapse(index)
}
const closeMenu = (index: any) => {
  // console.log(index)
  layoutStore.removeCollapse(index)
}
</script>

<style lang="scss">
</style>
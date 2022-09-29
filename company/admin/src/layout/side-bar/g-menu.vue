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
      v-for="item in store.state.menus"
    ></g-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup name="g-menu">
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const isCollapse = computed(() => store.state.isCollapse)
const defaultActive = computed(() => store.state.defaultActive)
const activeCollapse = computed(() => store.state.activeCollapse)

const openMenu = (index: any) => {
  // console.log(index)
  store.commit('pushCollapse', index)
}
const closeMenu = (index: any) => {
  // console.log(index)
  store.commit('removeCollapse', index)
}
</script>

<style lang="scss">
</style>
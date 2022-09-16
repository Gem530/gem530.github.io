<template>
  <el-menu
    mode="vertical"
    :unique-opened="true"
    :collapse="isCollapse"
    :collapse-transition="false"
  >
    <GSubMenu
      :route="item"
      :key="item.path"
      v-for="item in store.state.menus"
    ></GSubMenu>
  </el-menu>
</template>

<script lang="ts" setup name="GMenu">
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const isCollapse = ref(false)
// console.log(store.state.menus)
// console.log(111111)
</script>

<style lang="scss">
</style>
<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
  >
    <GSubMenu
      :key="item.path"
      :path="item.path"
      :name="item.meta.title"
      :children="item.children"
      v-for="item in store.state.menus"
    ></GSubMenu>
  </el-menu>
</template>

<script lang="ts" setup name="GMenu">
import { ref } from 'vue'
import { useStore } from 'vuex'
import GSubMenu from './GSubMenu.vue'
const store = useStore()
const isCollapse = ref(false)
console.log(store.state.menus)
console.log(111111)
</script>
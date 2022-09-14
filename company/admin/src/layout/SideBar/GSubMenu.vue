<template>
  <el-menu-item :index="props.name" :to="props.path">
    <el-icon><setting /></el-icon>
    <template #title>{{props.name}}</template>
    <GSubMenu
      :key="item.path"
      :path="item.path"
      :name="item.meta.title"
      v-for="item in props.children"
    ></GSubMenu>
  </el-menu-item>
</template>

<script lang="ts" setup name="GSubMenu">
import { ref, defineProps } from 'vue'
const props: any = defineProps({
  path: {
    type: String
  },
  name: {
    type: String
  },
  children: {
    type: Array,
    default: () => []
  }
})
</script>
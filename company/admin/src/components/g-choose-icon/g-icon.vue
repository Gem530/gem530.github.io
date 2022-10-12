<template>
  <template v-if="icon.indexOf(props.filter) !== -1">
    <i :class="`iconfont ${icon}`" :style="`font-size: ${size}px`"></i>
  </template>
  <template v-else>
    <el-icon :style="`font-size: ${size}px`"><component :is="icon"/></el-icon>
  </template>
</template>

<script lang="ts" setup name="g-icon">
import { defineProps, withDefaults } from 'vue'
const props = withDefaults(defineProps<{
  icon: string,
  size?: number,
  filter?: string
}>(), {
  size: 16,
  filter: 'icon-'
})
</script>
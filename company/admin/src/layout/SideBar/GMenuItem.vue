<template>
  <div class="g-menu-item">
    <el-icon><component v-if="props.icon" :is="props.icon" class="g-menu-icon"></component></el-icon>
    <span>{{props.text}}</span>
  </div>
</template>

<script lang="ts" setup name="GMenuItem">
import { defineProps } from 'vue'
const props = defineProps({
  icon: String,
  text: String
})
</script>

<style lang="scss">
</style>
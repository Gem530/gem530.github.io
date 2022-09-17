<template>
  <div class="g-menu-item theme">
    <el-icon class="g-menu-icon"><component v-if="props.icon" :is="props.icon"></component></el-icon>
    <span class="sub-menu-text">{{props.text}}</span>
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
.g-menu-item {
  @include flex();

  .g-menu-icon {
    margin-right: 10px;
  }
}
</style>
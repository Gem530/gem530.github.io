<template>
  <div class="g-menu-item theme">
    <g-icon class="g-menu-icon" v-if="props.icon" :icon="props.icon"></g-icon>
    <span class="sub-menu-text">{{props.text}}</span>
  </div>
</template>

<script lang="ts" setup name="g-menu-item">
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
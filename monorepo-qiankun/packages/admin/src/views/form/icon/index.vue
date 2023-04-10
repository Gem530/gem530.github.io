<template>
  <div>
    <h2>icon选择器</h2>
    <g-choose-icon v-model:icon="icon"></g-choose-icon>
  </div>
</template>

<script lang="ts" setup name="choose-icon">
import { ref, watch } from 'vue'
const icon = ref('Avatar')
watch(() => icon.value, (val) => {
  console.log('icon', val)
})
</script>
<template>
  <div>
    <h2>树形组件</h2>
    <g-tree v-model="id" @select="selectTree"></g-tree>
  </div>
</template>

<script lang="ts" setup name="g-tree">
import { ref } from 'vue'

const id = ref('')
const selectTree = (item: any) => {
  console.log(item)
}
</script>
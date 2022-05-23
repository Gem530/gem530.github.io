<template>
  <div>
      {{tips}}
      <button @click="changeInject">provide/inject改变值</button>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'

  const tips = inject('tips')
  const changeInject = inject('changeInject')
</script>

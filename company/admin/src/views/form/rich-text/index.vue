<template>
  <div>
    <h2>富文本</h2>
    <g-wang-editor v-model="content" :height="500"></g-wang-editor>
    <h3>内容展示</h3>
    <div v-html="content" class="rich-show-content"></div>
  </div>
</template>

<script lang="ts" setup name="rich-text">
import { ref } from 'vue'
const content = ref('默认值!!')
</script>
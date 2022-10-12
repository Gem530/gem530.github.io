<template>
  <div>
    <h2>富文本</h2>
    <g-wang-editor v-model="content" :height="500"></g-wang-editor>
    <h3>内容展示</h3>
    <div v-html="content" class="rich-show-content"></div>
    <el-button v-copy="content" v-copy:callback="copySuccess">copy</el-button>
  </div>
</template>

<script lang="ts" setup name="rich-text">
import { ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
const content = ref('默认值!!')
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any

const copySuccess = (text: string) => {
  console.log(text)
  proxy.$modal.message({type:'success',message:'复制成功!!'})
}
</script>
<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p ref="pDom" v-bind="attrs">
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>

  <button @click="countAddHandle(1)">countAdd</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script setup lang="ts">
  import { ref, useAttrs } from 'vue'

  // withDefaults与defineProps搭配使用，withDefaults第二个参数是给defineProps的值给默认值
  withDefaults(defineProps<{
    msg: string
  }>(), {
    msg: 'Vue3 Message Title'
  })
  // emit在vue3中需要先定义
  const emit = defineEmits(['countAdd'])

  const pDom = ref() // 这个就是定义Ref实例
  const attrs = useAttrs() // 这个就是定义attrs

  const count = ref(0)

  function countAddHandle (num: any = false): void {
    emit('countAdd', 2)

    // console.log(pDom.value)
    console.log(attrs.test, num)
  }
</script>

<style lang="scss" scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

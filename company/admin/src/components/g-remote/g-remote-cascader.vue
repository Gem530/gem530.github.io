<template>
  <el-cascader :props="props" />
</template>

<script lang="ts" setup name="g-remote-cascader">
import { Resolve, CascaderNode } from 'element-plus'
let id = 0
const props = {
  lazy: true,
  lazyLoad(node: CascaderNode, resolve: Resolve) {
    const { level } = node
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map((item) => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2,
      }))
      // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
      resolve(nodes)
    }, 1000)
  },
}
</script>
<template>
  <van-config-provider :theme-vars="themeVars" class="height">
    <van-nav-bar class="custom-nav-bar" :title="titleName" :="attrs" @click-left="clickLeft">
      <template v-if="slots.left" #left><slot name="left"></slot></template>
      <template v-if="slots.title" #title><slot name="title"></slot></template>
      <template v-if="slots.right" #right><slot name="right"></slot></template>
    </van-nav-bar>
  </van-config-provider>
</template>

<script lang="ts" setup name="NavBar">
import { useRoute, useRouter } from 'vue-router'
import {
  ref,
  useAttrs,
  defineProps,
  withDefaults,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

const attrs = useAttrs()
const route = useRoute()
const router = useRouter()
const { slots } = getCurrentInstance() as ComponentInternalInstance as any
const props = withDefaults(defineProps<{
  title?: string|boolean,
  backPath?: string|boolean,
}>(), {
  title: true,
  backPath: true
})

const titleName = ref('')
const themeVars = ref({
  navBarIconColor: '#333',
  navBarBackgroundColor: 'transparent'
})
if (typeof props.title == 'boolean') titleName.value = route.meta.title as string
else if (props.title) titleName.value = props.title

const clickLeft = () => {
  if (typeof props.backPath == 'boolean' && props.backPath) router.go(-1)
  else if (props.backPath) router.push(props.backPath)
}
</script>

<style lang="scss" scoped>
.height {
  min-height: 46px;
}
.custom-nav-bar{
  backdrop-filter: blur(8px); // 动态毛玻璃的效果 这个盒子下层的的元素出现毛玻璃效果
}
</style>
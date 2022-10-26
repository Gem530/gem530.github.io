<template>
  <van-nav-bar class="custom-nav-bar" :title="titleName" :="attrs" @click-left="clickLeft">
    <template v-if="slots.left" #left><slot name="left"></slot></template>
    <template v-if="slots.title" #title><slot name="title"></slot></template>
    <template v-if="slots.right" #right><slot name="right"></slot></template>
  </van-nav-bar>
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
if (typeof props.title == 'boolean') titleName.value = route.meta.title as string
else if (props.title) titleName.value = props.title

const clickLeft = () => {
  if (typeof props.backPath == 'boolean' && props.backPath) router.go(-1)
  else if (props.backPath) router.push(props.backPath)
}
</script>

<style lang="scss">
.custom-nav-bar{
  &.van-nav-bar{
    box-shadow: 0 2px 5px 0 rgba(37,27,96,0.10);
    background:var(--body-color-white) !important;
    .van-icon{
      color:var(--body-txet-nav-color) !important;
    }
    .van-nav-bar__title{
      font-family: SFCompactDisplay-Bold;
      font-size:16px;
      color:var(--body-color-nav-darkblue) !important;
    }
  }
}
</style>
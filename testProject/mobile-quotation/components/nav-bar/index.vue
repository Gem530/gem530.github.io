<template>
  <!-- <client-only> -->
    <van-config-provider :theme-vars="themeVars" class="height">
      <van-nav-bar class="custom-nav-bar" :title="titleName" fixed placeholder z-index="10" :="attrs" @click-left="clickLeft">
        <template v-if="slots.left" #left><slot name="left"></slot></template>
        <template v-if="slots.title" #title><slot name="title"></slot></template>
        <template v-if="slots.right" #right><slot name="right"></slot></template>
      </van-nav-bar>
    </van-config-provider>
  <!-- </client-only> -->
</template>

<script lang="ts" setup name="NavBar">
const slots = useSlots()
const attrs = useAttrs()
const route = useRoute()
const router = useRouter()
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
  // console.log(route, router, window.history)
  if (typeof props.backPath == 'boolean' && props.backPath) {
    // 适用了适用window.open打开了子页面，从而导致导航栏返回按钮无效
    if (window?.history?.state?.back) {
      // 有可以返回的页面，即返回上一页
      router.go(-1)
    } else {
      // 没有可以返回的页面，跳转到首页
      router.push('/')
    }
  } else if (props.backPath) router.push(props.backPath)
}
</script>

<style lang="scss" scoped>
.height {
  min-height: 46px;
}
.custom-nav-bar{
  // backdrop-filter: blur(8px); // 动态毛玻璃的效果 这个盒子下层的的元素出现毛玻璃效果
  overflow: hidden;
}
</style>
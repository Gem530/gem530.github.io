<template>
  <div v-if="!route.hidden">
    <el-sub-menu
      :index="route.path"
      v-if="route.children"
      popper-append-to-body>
      <template #title>
        <!-- <GMenuItem :icon="route.meta?.icon" :text="route.meta?.title"></GMenuItem> -->
        <g-icon v-if="route.meta?.icon" :icon="route.meta?.icon"></g-icon>
        <span class="sub-menu-text">{{route.meta?.title}}</span>
      </template>

      <!-- 递归实现多级菜单 -->
      <g-sub-menu
        :route="item"
        :key="item.path"
        v-for="item in route.children"
      ></g-sub-menu>
    </el-sub-menu>

    <el-menu-item v-else :index="route.path" @click="toPath(route.path)">
        <g-icon v-if="route.meta?.icon" :icon="route.meta?.icon"></g-icon>
        <template #title>{{route.meta?.title}}</template>
    </el-menu-item>
  </div>
</template>

<script lang="ts" setup name="g-sub-menu">
import { useRouter } from 'vue-router'
import { ref, toRefs, defineProps } from 'vue'
import useLayoutStore from '@/store/modules/layout'
const router = useRouter()
const layoutStore = useLayoutStore()
const props: any = defineProps({
  path: {
    type: String
  },
  route: {
    type: Object
  }
})
const { route } = toRefs(props)

const toPath = (path: string) => {
  layoutStore.setDefaultActive(path)
  router.push(path)
}
</script>

<style lang="scss">
</style>
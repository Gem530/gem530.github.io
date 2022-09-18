<template>
  <div v-if="!route.hidden">
    <el-sub-menu
      :index="route.path"
      v-if="route.children"
      popper-append-to-body>
      <template #title>
        <!-- <GMenuItem :icon="route.meta?.icon" :text="route.meta?.title"></GMenuItem> -->
        <el-icon><component v-if="route.meta?.icon" :is="route.meta?.icon"></component></el-icon>
        <span class="sub-menu-text">{{route.meta?.title}}</span>
      </template>

      <!-- 递归实现多级菜单 -->
      <GSubMenu
        :route="item"
        :key="item.path"
        v-for="item in route.children"
      ></GSubMenu>
    </el-sub-menu>

    <el-menu-item v-else :index="route.path" @click="toPath(route.path)">
        <el-icon><component v-if="route.meta?.icon" :is="route.meta?.icon"></component></el-icon>
        <template #title>{{route.meta?.title}}</template>
    </el-menu-item>
  </div>
</template>

<script lang="ts" setup name="GSubMenu">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, toRefs, defineProps } from 'vue'
const store = useStore()
const router = useRouter()
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
  store.commit('setDefaultActive', path)
  router.push(path)
}
</script>

<style lang="scss">
</style>
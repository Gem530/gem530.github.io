<template>
  <div v-if="!route.hidden">
    <el-sub-menu
      v-if="route.children"
      :index="route.meta?.title">
      <template #title>
          <GMenuItem :icon="route.meta?.icon" :text="route.meta?.title"></GMenuItem>
      </template>

      <!-- 递归实现多级菜单 -->
      <GSubMenu
        :route="item"
        :key="item.path"
        v-for="item in route.children"
      ></GSubMenu>
    </el-sub-menu>

    <el-menu-item v-else :index="route.meta?.title" @click="toPath(route.path)">
        <template #title>
          <GMenuItem :icon="route.meta?.icon" :text="route.meta?.title"></GMenuItem>
        </template>
    </el-menu-item>
  </div>
</template>

<script lang="ts" setup name="GSubMenu">
import { useRouter } from 'vue-router'
import { ref, toRefs, defineProps } from 'vue'
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
  router.push(path)
}
</script>

<style lang="scss">
</style>
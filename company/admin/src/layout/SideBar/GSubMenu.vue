<template>
  <div v-if="!route.hidden">
    <el-sub-menu
      v-if="route.children"
      :index="route.meta?.title">
      <template #title>
        <!-- <el-icon><setting /></el-icon> -->
        <span>{{route.meta?.title}}</span>
      </template>
      <GSubMenu
        :route="item"
        :key="item.path"
        v-for="item in route.children"
      ></GSubMenu>
    </el-sub-menu>

    <el-menu-item v-else :index="route.meta?.title">
        <template #title>
          <!-- <el-icon><setting /></el-icon> -->
          <span>{{route.meta?.title}}</span>
        </template>
    </el-menu-item>
  </div>
</template>

<script lang="ts" setup name="GSubMenu">
import { ref, toRefs, defineProps } from 'vue'
const props: any = defineProps({
  path: {
    type: String
  },
  route: {
    type: Object
  }
})
const { route } = toRefs(props)
</script>

<style lang="scss">
</style>
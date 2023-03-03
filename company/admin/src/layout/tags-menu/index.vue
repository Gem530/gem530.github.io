<template>
  <el-tabs
    type="card"
    class="theme"
    v-model="editableTabsValue"
    @tab-change="changeTab"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      :key="item.path"
      :name="item.path"
      :label="item.meta?.title"
      v-for="item in editableTabs"
      :closable="item.path !== '/home'"
    ></el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup name="tags-menu">
import useLayoutStore from '@/store/modules/layout'
import useTagsStore from '@/store/modules/tags-view'
import { ref, watch, computed, } from 'vue'
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router'
const tagsStore = useTagsStore()
const layoutStore = useLayoutStore()
const route = useRoute()
const router = useRouter()
const editableTabs = computed(() => tagsStore.tagsView)
const editableTabsValue = ref('')

watch(() => route, (val: RouteLocationNormalizedLoaded) => {
  editableTabsValue.value = val.path
}, { deep: true, immediate: true })

const changeTab = (path: string) => {
  // console.log(i)
  layoutStore.setDefaultActive(path)
  router.push(path)
}
const removeTab = (path: string) => {
  // console.log(path)
  layoutStore.delTagsView(path)
}
</script>

<style lang="scss">
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
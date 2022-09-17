<template>
  <el-breadcrumb separator="/">
    <template
      :key="item.path"
      v-for="(item, i) in breadList">
      <el-breadcrumb-item v-if="item.path">
        <div v-if="(i + 1) < breadList.length">
          <GMenuItem :icon="item.meta?.icon" :text="item.meta?.title"></GMenuItem>
        </div>
        <a v-else :href="item.path" class="color-black theme">
          <GMenuItem :icon="item.meta?.icon" :text="item.meta?.title"></GMenuItem>
        </a>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts" setup name="Breadcrumb">
import { ref, watch } from 'vue'
import { useRouter, RouteLocationMatched } from 'vue-router'
const router = useRouter()
const breadList = ref<RouteLocationMatched[]>([])

watch(() => router.currentRoute, () => {
  breadList.value = router.currentRoute.value.matched
}, { deep: true, immediate: true })
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-left: 10px;

  .el-breadcrumb__inner .color-black,
  .el-breadcrumb__inner .color-black:hover {
    font-weight: 600;
    // color: #000;
    cursor: pointer;
  }
}
</style>
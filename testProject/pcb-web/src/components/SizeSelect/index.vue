<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div class="size-icon--style global-flex flex-end">
      <!-- <svg-icon class-name="size-icon" icon-class="size" /> -->
      布局大小
      <el-icon style="margin-left: 4px;"><arrow-down /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useAppStore from "@/store/modules/app";

const appStore = useAppStore();
const size = computed(() => appStore.size);

const sizeOptions = ref([
    { label: "较大", value: "large" },
    { label: "默认", value: "default" },
    { label: "稍小", value: "small" },
]);

const handleSetSize = (size: string) => {
    appStore.setSize(size);
}
</script>

<style lang="scss" scoped>
.size-icon--style {
  height: 100%;
  font-size: 12px;
  color: #3d3d3d;
  // line-height: 14px;
  padding: 0 8px;
  cursor: pointer;
}
</style>

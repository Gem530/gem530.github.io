<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div class="size-icon--style global-flex flex-end">
      <!-- <svg-icon class-name="bold-icon" icon-class="bold" /> -->
      字体大小
      <el-icon style="margin-left: 4px;"><arrow-down /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="bold === item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useAppStore from "@/store/modules/app";

const appStore = useAppStore();
const bold = computed(() => appStore.bold);

const sizeOptions = ref([
    { label: "加粗", value: "bold" },
    { label: "不加粗", value: "default" },
]);

const handleSetSize = (bold: string) => {
    appStore.setBold(bold);
    // if (bold == 'bold') {
    //   document.body.style = '--el-vxe-table-weight: 600;'
    // } else {
    //   document.body.style = '--el-vxe-table-weight: 400;'
    // }
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

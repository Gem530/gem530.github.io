<template>
  <el-config-provider :locale="zhCn">
    <router-view/>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// import { provide } from 'vue'
// import * as echarts from "echarts"
// provide("echarts", echarts)
</script>
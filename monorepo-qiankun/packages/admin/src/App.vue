<template>
  <el-config-provider :locale="zhCn">
  <!-- <el-config-provider :locale="zhCn" namespace="admin"> -->
    <router-view/>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// import { provide } from 'vue'
// import * as echarts from "echarts"
// provide("echarts", echarts)
</script>
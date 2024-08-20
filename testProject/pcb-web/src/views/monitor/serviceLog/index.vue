<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <XTable toolId="serviceLogTable" height="100%" class="xtable-content"
            :pageShow="false"
            :data="mainTableData"
            :columnList="mainColumnList"
            show-footer="true"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField:'id' }"
            :loading="mainTableLoading"
      >
        <template #default-make="scope">
          <el-button link type="primary" @click="onDownload(scope.row.name)">下载</el-button>
        </template>
      </XTable>
    </el-card>
  </div>
</template>

<script setup name="ServiceLog">

import { queryList } from "@/api/monitor/serviceLog/index";


const mainTableData = ref([]);
const mainTableLoading = ref(false);
const mainColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "日志名称", width: "200", field: "name", align: "center" },
  { title: "日志大小(KB)", width: "120", field: "size", align: "center" },
  { title: "操作", fixed: 'right', width: "60", field: "make", align: "center"},
]);
const {proxy} = getCurrentInstance();

const refreshTableData = () => {
  mainTableLoading.value = true;
  queryList()
    .then((res) => {
      mainTableData.value = res.data;
    })
    .finally(() => {
      mainTableLoading.value = false;
    })
}

const onDownload = (val) => {
  proxy?.download('/monitor/log/E4B88BE8BDBDE697A5E5BF97?logName=' + val,
    {}, val);
}

onMounted(() => {
  refreshTableData();
});
</script>

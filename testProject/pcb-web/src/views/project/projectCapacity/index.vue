<template>
  <div class="p-2 xtable-page">

    <div class="search">
      <el-form :model="tabQueryParams" ref="queryFormRef" label-width="90px"
               class="demo-form-inline">
      <div style="display: flex; flex-wrap: wrap; align-items: center" class="searchMain">
          <div>
            <el-form-item label="查询日期">
              <el-date-picker v-model="tabQueryParams.submitTimeStart"
                              type="datetime" placeholder="选择日期时间"
                              style="width: calc(50% - 9px)"
                              format="YYYY-MM-DD HH:mm:ss"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              @change="checkDates"
                              :clearable="false"/>
                <span style="width: 10px;margin-left: 7px">-</span>
              <el-date-picker v-model="tabQueryParams.submitTimeEnd"
                              type="datetime" placeholder="选择日期时间"
                              style="width: calc(50% - 9px)"
                              format="YYYY-MM-DD HH:mm:ss"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              @change="checkDates"
                              :clearable="false"/>
            </el-form-item>
          </div>
        <div style="padding-left: 10px" class="global-flex">
          <el-button @click="handleQuery" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
          <el-button @click="exportDataEvent" type="primary" style="margin-left: auto;">导出</el-button>

      </div>
      </el-form>

    </div>

    <XTable
      border
      class="xtable-content"
      height="100%"
      toolId="ProjectCapacity"
      ref="xTableRef"
      :seqConfig="{}"
      :data="tableData"
      :pageShow="false"
      :loading="viewTableLoading"
      :columnList="electricColumnList"
      :sort-config="{ remote: false }"
      tooltip-config/>

  </div>
</template>

<script setup name="ProjectCapacity">

import { computed, ref } from "vue";
import {getMiProjectReport} from "@/api/project/projectCapacity";
import dayjs from "dayjs";
import useAppStore from "@/store/modules/app";
import {deepClone} from "@/utils";


const initColumn = [
  { title: '订单类型', width: '150', field: 'orderTypeName', align: 'center', fixed: 'left',},
]
const electricColumnList = ref(deepClone(initColumn));

// 默认导出
const exportDataEvent = () => {
  const $table = xTableRef.value.xTableRef

  if ($table) {
    $table.exportData({
      filename: '工程产能统计_'+ (tabQueryParams.value.camUserName===undefined?'':tabQueryParams.value.camUserName+'_')+dayjs(tabQueryParams.value.submitTimeStart).format("YYYY-MM-DD")+ '至'+dayjs(tabQueryParams.value.submitTimeEnd).format("YYYY-MM-DD"),
      sheetName: '工程产能统计',
      type: 'xlsx',
      columnFilterMethod ({ column }) {
        return !['checkbox'].includes(column.type)
      },
      isMerge: true
    })
  }
}


const checkDates = () => {
  if (tabQueryParams.value.submitTimeStart && tabQueryParams.value.submitTimeEnd) {
    const start = new Date(tabQueryParams.value.submitTimeStart).getTime();
    const end = new Date(tabQueryParams.value.submitTimeEnd).getTime();
    if (start > end) {
      ElMessage.error('开始日期不能晚于结束日期');
      // 重设结束日期为空
      tabQueryParams.value.submitTimeEnd = null;
    }
  }
};



/**
 * 查询参数
 */
const  tabQueryParams  = ref({
  submitTimeStart : dayjs().startOf('month').format('YYYY-MM-DD 00:00:00'),
  submitTimeEnd: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
  camUserName: undefined
});
const xTableRef = ref();
const tableData = ref([])
const viewTableLoading = ref(false);
const tableSize = computed(() => useAppStore().size=== 'small' ? 'mini' : useAppStore().size === 'large' ? 'medium' : 'small')
watch(() => tableSize.value, () => {
  if (xTableRef.value) {
    xTableRef.value.recalculate(true)
  }
})

/** 查询按钮操作 */
const handleQuery = () => {
  viewTableLoading.value = true;
  QueryDetails();
}

/** 搜索按钮操作 */
const reset = () => {
  tabQueryParams.value.submitTimeStart = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
  // 将submitTimeEnd设置为new Date()的后一天的凌晨00:00:00
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  tabQueryParams.value.submitTimeEnd= dayjs(tomorrow).format("YYYY-MM-DD 00:00:00");
  tabQueryParams.value.camUserName= undefined;
  viewTableLoading.value = true;
  QueryDetails();
}

/**
 * 查询
 */
const QueryDetails =()=>{

  getMiProjectReport({
    submitTimeStart: tabQueryParams.value.submitTimeStart,
    submitTimeEnd: tabQueryParams.value.submitTimeEnd,
  })
    .then((res) =>{
      let tempColumn = []
      electricColumnList.value = deepClone(initColumn)
      if (res?.data?.length) {
        if (res.data[0]?.camList?.length) {
          tempColumn.push({
            title: 'CAM',
            field: 'CAM',
            align: 'center',
            children: [
            ]
          })
          res.data[0].camList.map((m, mi) => {
            tempColumn[tempColumn.length-1].children
              .push({
                title: m.userName,
                field: `camList[${mi}].quantity`,
                width: '80px',
                align: 'center' })
          })
        }
        if (res.data[0]?.pretrialList?.length) {
          tempColumn.push({
            title: '预审',
            field: 'reAudit',
            align: 'center',
            children: [
            ]
          })
          res.data[0].pretrialList.map((m, mi) => {
            tempColumn[tempColumn.length-1].children
              .push({
                title: m.userName,
                field: `pretrialList[${mi}].quantity`,
                width: '80px',
                align: 'center' })
          })
        }
        if (res.data[0]?.miAuditList?.length) {
          tempColumn.push({
            title: '审核',
            field: 'miAudit',
            align: 'center',
            children: [
            ]
          })
          res.data[0].miAuditList.map((m, mi) => {
            tempColumn[tempColumn.length-1].children
              .push({
                title: m.userName,
                field: `miAuditList[${mi}].quantity`,
                width: '80px',
                align: 'center' })
          })
          electricColumnList.value.splice(2, 0, ...(tempColumn || []))
        }
      }
      tableData.value = res.data;
    })
    .finally(() => {
      viewTableLoading.value = false;
    })
}


/**
 * 页面刷新数据
 */
onMounted(() => {
  viewTableLoading.value = true;
  reset();
  // QueryDetails();
});

</script>


<style scoped>

</style>


<style lang="scss" scoped>

.searchMain {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

:deep(.borderBoldTable .vxe-table--main-wrapper){
  padding: 1px !important;
}
:deep(.borderBoldTable .vxe-table--body) {
  margin-left: 1px !important;
}
:deep(.borderBoldTable .vxe-table--header-wrapper) {
  padding-left: 1px !important;
  padding-top: 1px !important;
}
:deep(.borderBoldTable .vxe-body--column) {
  border: 1px solid #6c6161 !important;
}
:deep(.borderBoldTable .vxe-header--column) {
  border: 1px solid #6c6161 !important;
}
</style>

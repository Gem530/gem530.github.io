<template>
  <div class="p-2 xtable-page">

    <div class="search">
      <el-form :model="tabQueryParams" ref="queryFormRef" label-width="90px"
               class="demo-form-inline">
      <div style="display: flex; flex-wrap: wrap; align-items: center" class="searchMain">
          <div>
            <el-form-item label="查询日期">
              <el-date-picker v-model="tabQueryParams.submitTimeStart"
                              type="date" placeholder="选择日期时间"
                              style="width: calc(50% - 9px)"
                              format="YYYY-MM-DD"
                              value-format="YYYY-MM-DD 00:00:00"
                              @change="checkDates"
                              :clearable="false"/>
                <span style="width: 10px;margin-left: 7px">-</span>
              <el-date-picker v-model="tabQueryParams.submitTimeEnd"
                              type="date" placeholder="选择日期时间"
                              style="width: calc(50% - 9px)"
                              format="YYYY-MM-DD"
                              value-format="YYYY-MM-DD 23:59:59"
                              @change="checkDates"
                              :clearable="false"/>
            </el-form-item>
          </div>
          <div>
              <el-form-item label="CAM工程师">
              <el-input
                v-model="tabQueryParams.camUserName"
                clearable
                style="width: 200px"
              />
              </el-form-item>
          </div>
        <div style="padding-left: 10px" class="global-flex">
          <el-button @click="handleQuery" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-tooltip
            class="box-item"
            effect="dark"
            raw-content
            :content="`样板新单：单双面为:1  四层板为:1.5  六层板为:2.0  ,每多两层加0.5<br/>
            量产新单: 单双面为:1.5  四层板为:2.0  六层板为:2.5  ,每多两层加0.5<br/>
            返单有改：单双面为:0.8  四层板为:1.3  六层板为:1.8,每多两层加0.5<br/>
            返单：每款0.25<br/>
            样转批：单双面为:0.5  四层板为:1  六层板为:1.5 , 每多两层加0.5`"
          >
            <el-icon style="margin-left: 10px;color: #f3d8c4;"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
          <el-button @click="exportDataEvent" type="primary" style="margin-left: auto;">导出</el-button>

      </div>
      </el-form>

    </div>

    <vxe-table
      ref="xTableRef"
      :size="tableSize"
      :class="tableData&&tableData.length>0?'borderBoldTable':''"
      :column-config="{resizable: true}"
      :data="tableData"
      :span-method="colspanMethod"
      :row-style="rowStyle"
      align="center"
      border="full"
      show-overflow
      height="780"
      max-height="780"
      :row-config="{height: 40}"
      :loading ="viewTableLoading"
      :export-config="{}"
    >
      <vxe-column field="camUserName" title="CAM工程师" width="94"></vxe-column>
      <vxe-column field="type" title="类型" width="78"></vxe-column>

      <vxe-colgroup title="合计">
        <vxe-column title="分配款数"    width="78" field="sumAssignQuantity"></vxe-column>
        <vxe-column title="完成款数"    width="78" field="sumFinishedQuantity"></vxe-column>
        <vxe-column title="绩效款数"    width="78" field="sumAchievementQuantity"></vxe-column>
      </vxe-colgroup>

      <vxe-colgroup :title="item.title" v-for="(item, index) in titleList" :key="index">
        <vxe-column title="分配款数" width="78" :field="`layerList[${index}].assignQuantity`"></vxe-column>
        <vxe-column title="完成款数" width="78" :field="`layerList[${index}].finishedQuantity`"></vxe-column>
        <vxe-column title="绩效款数" width="78" :field="`layerList[${index}].achievementQuantity`"></vxe-column>
      </vxe-colgroup>

    </vxe-table>





  </div>
</template>

<script setup name="ProjectCapacity">

import { computed, ref } from "vue";
import {queryPageNew} from "@/api/project/projectCapacity";
import dayjs from "dayjs";
import useAppStore from "@/store/modules/app";



const titleList = ref([
]) ;

// 默认导出
const exportDataEvent = () => {
  const $table = xTableRef.value

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
  tabQueryParams.value.submitTimeEnd= dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
  tabQueryParams.value.camUserName= undefined;
  viewTableLoading.value = true;
  QueryDetails();
}

/**
 * 查询
 */
const QueryDetails =()=>{

  queryPageNew({
    submitTimeStart: tabQueryParams.value.submitTimeStart,
    submitTimeEnd: tabQueryParams.value.submitTimeEnd,
    camUserName: tabQueryParams.value.camUserName,
  })
    .then((res) =>{
      tableData.value = res.data.reportsVoList;
      titleList.value = res.data.titleVos;
    })
    .finally(() => {
      viewTableLoading.value = false;
    })
}


const colspanMethod = ({ _rowIndex, _columnIndex }) => {
  if (_rowIndex % 5 === 0) {
    if (_columnIndex === 0 ) {
      return { rowspan: 5, colspan: 1 }
    }else {
      return { rowspan: 1, colspan: 1 }
    }
  }else if (_columnIndex === 0 ) {
    return { rowspan: 0, colspan: 0 }
  }
}

const sheetMethod = (e) => {
  console.log('sheetMethod', e);
}


const rowStyle= ({ rowIndex }) => {
  if (rowIndex % 40 < 5) {
    return 'background: #f5f0ff;' // 淡紫色
  } else if (rowIndex % 40 < 10) {
    return 'background: #e5e5ff;' // 淡蓝色
  } else if (rowIndex % 40 < 15) {
    return 'background: #fff0e5;' // 浅橙色
  } else if (rowIndex % 40 < 20) {
    return 'background: #d9e5ff;' // 深蓝色
  } else if (rowIndex % 40 < 25) {
    return 'background: #c9dfff;' // 深紫色
  } else if (rowIndex % 40 < 30) {
    return 'background: #f5f5ff;' // 深蓝色
  } else if (rowIndex % 40 < 35) {
    return 'background: #e5f5ff;' // 淡蓝色
  } else {
    return 'background: #e5e5f5;' // 浅紫色
  }
}


// /**
//  * 重新进入页面时刷新
//  */
// onActivated(() => {
//   viewTableLoading.value = true;
//   QueryDetails();
// })


/**
 * 页面刷新数据
 */
onMounted(() => {
  viewTableLoading.value = true;
  QueryDetails();
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

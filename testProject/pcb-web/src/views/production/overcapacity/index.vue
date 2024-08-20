<template>
  <div class="p-2 xtable-page">
    <div class="p-2">
      <el-button style="float:right;" plain @click="handleExport">导出 </el-button>
      <div style="float:right;" class="totalTitle">款数：{{headData.commodityCount}}&nbsp;&nbsp;|&nbsp;&nbsp; 面积：{{headData.sumSetArea}}㎡</div>
    </div>


    <el-card shadow="never" class="xtable-card">
      <XTable toolId="overcapacity" class="xtable-content" height="100%"
              v-model:page-size="mainQueryParams.pageSize"
              v-model:current-page="mainQueryParams.pageNum"
              :loading="mainTableLoading"
              :page-params="{ perfect: true, total: mainTableTotal }"
              :data="mainTableData"
              :columnList="mainColumnList"
              show-footer="true"
              ref="XTableRef"
              border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :sort-config="{remote: true}"
              :intervalCondition="intervalCondition"
              :isAutoHeight="true"
      >

        <template #default-residenceTime="scope">
          <el-tag v-if="scope.row.residenceTime === 0">0</el-tag>
          <el-tag v-else>{{scope.row.residenceTime}}</el-tag>
        </template>

        <template #default-isRemediation="scope">
          <el-tag v-if="scope.row.isRemediation === '0'" type="success">否</el-tag>
          <el-tag v-else type="danger">是</el-tag>
        </template>


      </XTable>
    </el-card>



  </div>
</template>

<script setup name="Overcapacity">

import {getOvercapacitySum, queryPage} from "@/api/production/overcapacity";
import {ref} from "vue";


/**
 * 声名需要处理的时间条件字段
 */
const intervalCondition = ['beginTime','residenceTime'];
const mainTableLoading = ref(false);
const mainTableTotal = ref(0);
const mainTableData = ref([]);
const headData = ref({
    cardNum:0,
    commodityCount:0,
    sumSetArea:0
});
const mainColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "过数人", width: "100", field: "operatorUserName", align: "center" , filterType: "input"  },
  { title: "所属部门", width: "60", field: "operatorDeptName", align: "center" , filterType: "input" },
  { title: "接单时间", width: "130", field: "beginTime", align: "center" , filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: "停留时间(小时)", width: "100", field: "residenceTime", align: "center" ,filterType: 'intervalNumber' },
  { title: "过数工序", width: "100", field: "craftName", align: "center" , filterType: "input" },
  { title: "产品编码", width: "70", field: "commodityCode", align: "center" , filterType: "input" },
  { title: "产品名称", field: "commodityName", align: "center", filterType: "input" },
  { title: "排产单号", field: "productionCode", align: "center", filterType: "input" },
  { title: "流转卡号", field: "circulationCardNumber", align: "center", filterType: "input" },
  { title: "是否补料", field: "isRemediation", align: "center"
    ,filterType: 'radioButton',
    filterParam: {placeholder: '请选择是/否'},
    filterData: () => [{label: '是', value: '1'},{label: '否', value: '0'}]
  },
  { title: "面积", field: "areaDivide", align: "center"}
]);
/**
 * 初始化首页查询参数
 */
const { mainQueryParams } = toRefs(reactive({
  mainQueryParams: {
    pageNum: 1,
    pageSize: 20,
    beginTimeStart: undefined,
    beginTimeEnd: undefined,
    residenceTimeStart: undefined,
    residenceTimeEnd: undefined,
    operatorUserName: undefined,
    operatorDeptName: undefined,
    beginTime: undefined,
    residenceTime: undefined,
    craftName: undefined,
    commodityCode: undefined,
    commodityName: undefined,
    productionCode: undefined,
    circulationCardNumber: undefined,
    isRemediation: undefined,
    areaDivide: undefined
  }
}));

/**
 * 发送查询请求,刷新页面数据
 */
const refreshTableData = () => {
  console.log(mainQueryParams);
  mainTableLoading.value = true;

  getOvercapacitySum(mainQueryParams.value)
    .then((res) => {
      headData.value = res.data;
    })
    .finally(() => {
      mainTableLoading.value = false;
    });


  queryPage(mainQueryParams.value)
    .then((res) => {
      mainTableData.value = res.rows;
      mainTableTotal.value = res.total;
    })
    .finally(() => {
      mainTableLoading.value = false;
    });



}

/**
 * 搜索条件更新
 */
const searchChange = (param) => {
  mainQueryParams.value = {...param}
  refreshTableData();
}


/**
 * 定义代理对象
 */
const {proxy} = getCurrentInstance();
/** 导出按钮操作 */
const handleExport = () => {

  if (mainTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("/production/production/exportOvercapacity", {
          ...mainQueryParams.value
        }, `过数产能统计模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    mainQueryParams.value.beginTimeStart === undefined &&
    mainQueryParams.value.beginTimeEnd === undefined &&
    mainQueryParams.value.residenceTimeStart === undefined &&
    mainQueryParams.value.residenceTimeEnd === undefined &&
    mainQueryParams.value.operatorUserName === undefined &&
    mainQueryParams.value.operatorDeptName === undefined &&
    mainQueryParams.value.craftName === undefined &&
    mainQueryParams.value.commodityCode === undefined &&
    mainQueryParams.value.commodityName === undefined &&
    mainQueryParams.value.productionCode === undefined &&
    mainQueryParams.value.circulationCardNumber === undefined &&
    mainQueryParams.value.isRemediation === undefined
  ){
    ElMessageBox.confirm(
      '没有设置筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportComplaintList
    )
  }else{
    exportComplaintList();
  }
};

const exportComplaintList = () => {
  proxy?.download("/production/production/exportOvercapacity", {
    ...mainQueryParams.value
  }, `过数产能统计_${new Date().getTime()}.xlsx`);
}


/**
 * 渲染完页面后刷新页面数据
 */
onMounted(() => {
  refreshTableData();
});

</script>


<style scoped>

.totalTitle{
  padding: 0px !important;
  margin: 0px;
  line-height: 24px !important;
  display: flex !important;
  justify-content: end !important;
  font-size: 14px !important;
  color: #0892c7 !important;
  font-weight: bold;
  margin-right: 10px;
}
</style>

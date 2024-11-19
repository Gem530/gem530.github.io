<template v-if="checkPermi(['report:costPlateBalance:list'])">
  <div class="p-2 xtable-page">
    <div class="p-2">
      <el-row :gutter="10" class="mb8 global-flex flex-between">
      <el-col :span="1.5" class="primary-color">
        <el-form :model="mainQueryParams" ref="queryFormRef" label-width="80px"
                 class="demo-form-inline">
          <el-form-item label="结存月份" prop="costMonth" style="margin-bottom: 0;">
            <el-date-picker class="width-100" :clearable="false" v-model="mainQueryParams.costMonth" type='month' placeholder='请选择结存月份' valueFormat='YYYY-MM' @change="handleQuery"/>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1.5"  class="global-flex flex-end">
        <div class="totalTitle">发料总量：{{headData.receiveQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp;
          退料总量：{{headData.returnQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp;
          发料总金额：{{headData.receiveTotalPrice}}&nbsp;&nbsp;|&nbsp;&nbsp;
          退料料总金额：{{headData.returnTotalPrice}}&nbsp;&nbsp;|&nbsp;&nbsp;
          实际发生总金额：{{headData.actuallyTotalPrice}}&nbsp;&nbsp;|&nbsp;&nbsp;
          投产总量：{{headData.productionQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp;
          领料总量：{{headData.actuallyReceiveQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp;
          多领总量：{{headData.overQuantity}}</div>
        <el-button plain @click="handleExport"  v-if="checkPermi(['report:costPlateBalance:export'])" >导出 </el-button>
      </el-col>


      </el-row>
    </div>


    <el-card shadow="never" class="xtable-card width-100" v-if="checkPermi(['report:costPlateBalance:list'])" >
      <XTable toolId="costPlateBalance" class="xtable-content" height="100%"
              v-model:page-size="mainQueryParams.pageSize"
              v-model:current-page="mainQueryParams.pageNum"
              :loading="mainTableLoading"
              :page-params="{ perfect: true, total: mainTableTotal }"
              :data="mainTableData"
              :columnList="mainColumnList"
              ref="XTableRef"
              border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :sort-config="{remote: true}"
              :intervalCondition="intervalCondition"
              :isAutoHeight="true"
      >


        <template #default-type="scope">
          <dict-tag :options="typeList" :value="scope.row.type"/>
        </template>

<!--        如果投产数量为0,则展示减号-->
        <template #default-productionQuantity="scope">
          <div v-if="scope.row.productionQuantity === '0'">-</div>
          <div v-if="scope.row.productionQuantity !== '0'">{{scope.row.productionQuantity}}</div>
        </template>

        <template #header-actuallyTotalPrice="{ row }">
          <el-tooltip
            class="box-item"
            effect="dark"
            raw-content
            :content="'实际发生金额 = 发料金额 - 退料金额'"
          >
            <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
          </el-tooltip>
          实际发生金额
        </template>

        <template #header-actuallyReceiveQuantity="{ row }">
          <el-tooltip
            class="box-item"
            effect="dark"
            raw-content
            :content="'实际领料数量 = 发料数量 - 退料数量\n'"
          >
            <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
          </el-tooltip>
          实际领料数量
        </template>


      </XTable>
    </el-card>



  </div>
</template>

<script setup name="CostPlateBalance">

import {ref} from "vue";
import {getCostCraftDetailSum, queryCostCraftDetailPage, queryCostPlateBalancePage} from "@/api/report/costReport";
import {listMaterialProductionInOut} from "@/api/purchase/materialProductionInOut";
import dayjs from "dayjs";
import {checkPermi} from "@/utils/permission";


/**
 * 声名需要处理的时间条件字段
 */
const intervalCondition = [
  'receiveTime',
  'receiveQuantity',
  'returnQuantity',
  'receivePrice',
  'returnPrice',
  'receiveTotalPrice',
  'returnTotalPrice',
  'actuallyTotalPrice',
  'productionQuantity',
  'actuallyReceiveQuantity',
  'overQuantity',
];
const mainTableLoading = ref(false);
const mainTableTotal = ref(0);
const mainTableData = ref([]);
const typeList = ref([
  {label: '领料', value: '16',elTagType: 'primary'},
  {label: '还料', value: '17',elTagType: 'success'}
]);
const headData = ref({
  receiveQuantity:0,
  returnQuantity:0,
  receiveTotalPrice:0,
  returnTotalPrice:0,
  actuallyTotalPrice:0,
  productionQuantity:0,
  actuallyReceiveQuantity:0,
  overQuantity:0,
});
const initHeadData = () => {
  headData.value = {
    receiveQuantity:0,
    returnQuantity:0,
    receiveTotalPrice:0,
    returnTotalPrice:0,
    actuallyTotalPrice:0,
    productionQuantity:0,
    actuallyReceiveQuantity:0,
    overQuantity:0,
  }
}
const mainColumnList = ref([
  {title: "序号", type: 'seq', field: 'index',fixed: "left", align: 'center', width: '60'},
  {title: '排产单号', field: 'productionCode',fixed: "left", align: 'center',width: '100', filterType: 'input'},
  {title: '合同编码', field: 'saleOrderCode', align: 'center',fixed: "left",width: '100', filterType: 'input',},
  {title: '产品编码', field: 'commodityCode', align: 'center',fixed: "left", width: '180',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: '发料时间', field: 'receiveTime', align: 'center',width: '130',fixed: "left",
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: "物料编码", width: "80", field: "materialCode", align: "center" , filterType: "input" },
  { title: "物料名称", width: "80", field: "materialName", align: "center" , filterType: "input" },
  { title: "材质牌号", width: "90", field: "materialQuality", align: "center" , filterType: "input" },
  { title: "板厚(mm)", width: "90", field: "boardThickness", align: "center" , filterType: "input" },
  { title: "铜厚(OZ)", width: "90", field: "copperThickness", align: "center" , filterType: "input" },
  { title: "颜色", width: "70", field: "color", align: "center" , filterType: "input" },
  { title: "级别", width: "70", field: "level", align: "center", filterType: "input" },
  { title: "品牌", width: "70", field: "manufacturer", align: "center", filterType: "input" },
  { title: "规格型号", width: "90", field: "specification", align: "center", filterType: "input" },
  { title: "单位", width: "60", field: "unit", align: "center", filterType: "input" },
  {title: '发料数量', field: 'receiveQuantity', align: 'center',width: '80',filterType: "intervalNumber"},
  {title: '退料数量', field: 'returnQuantity', align: 'center',width: '80',filterType: "intervalNumber"},
  {title: '发料单价(元)', field: 'receivePrice', align: 'center',width: '80',filterType: "intervalNumber"},
  {title: '发料金额(元)', field: 'receiveTotalPrice', align: 'center',width: '100',filterType: "intervalNumber"},
  {title: '退料金额(元)', field: 'returnTotalPrice', align: 'center',width: '100',filterType: "intervalNumber"},
  {title: '实际发生金额(元)', field: 'actuallyTotalPrice', align: 'center',width: '120',filterType: "intervalNumber"},
  {title: '投产数量', field: 'productionQuantity', align: 'center',width: '80',filterType: "intervalNumber"},
  {title: '实际领用数量', field: 'actuallyReceiveQuantity', align: 'center',width: '120',filterType: "intervalNumber"},
  {title: '多领数量', field: 'overQuantity', align: 'center',width: '80',filterType: "intervalNumber"},
]);
/**
 * 初始化首页查询参数
 */
const { mainQueryParams } = toRefs(reactive({
  mainQueryParams: {
    pageNum: 1,
    pageSize: 20,
    costMonth: dayjs(new Date).format('YYYY-MM'),
    productionCode: undefined,
    saleOrderCode: undefined,
    commodityCode: undefined,
    receiveTimeStart: undefined,
    materialCode: undefined,
    materialName: undefined,
    materialQuality: undefined,
    boardThickness: undefined,
    copperThickness: undefined,
    color: undefined,
    level: undefined,
    manufacturer: undefined,
    specification: undefined,
    unit: undefined,
    receiveQuantityStart: undefined,
    returnQuantityStart: undefined,
    receivePriceStart: undefined,
    returnPriceStart: undefined,
    receiveTotalPriceStart: undefined,
    returnTotalPriceStart: undefined,
    actuallyTotalPriceStart: undefined,
    productionQuantityStart: undefined,
    actuallyReceiveQuantityStart: undefined,
    overQuantityStart: undefined,
    receiveTimeEnd: undefined,
    receiveQuantityEnd: undefined,
    returnQuantityEnd: undefined,
    receivePriceEnd: undefined,
    returnPriceEnd: undefined,
    receiveTotalPriceEnd: undefined,
    returnTotalPriceEnd: undefined,
    actuallyTotalPriceEnd: undefined,
    productionQuantityEnd: undefined,
    actuallyReceiveQuantityEnd: undefined,
    overQuantityEnd: undefined,
  }
}));


/** 搜索按钮操作 */
const handleQuery = () => {
  mainQueryParams.value.pageNum = 1;
  refreshTableData();
}

/**
 * 发送查询请求,刷新页面数据
 */
const refreshTableData = () => {
  console.log(mainQueryParams);
  mainTableLoading.value = true;

  queryCostPlateBalancePage(mainQueryParams.value)
    .then((res) => {
      if (res.data.list) {
        mainTableData.value = res.data.list.rows;
        mainTableTotal.value = res.data.list.total;
        headData.value = res.data;
      }else{
        mainTableData.value = [];
        mainTableTotal.value = 0;
        initHeadData();
      }
    })
    .finally(() => {
      mainTableLoading.value = false;
    });

}

/**
 * 搜索条件更新
 */
const searchChange = (param) => {
  let costMonth = mainQueryParams.value.costMonth
  mainQueryParams.value = param
  mainQueryParams.value.costMonth = costMonth
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
        exportComplaintList();
      }
    )
  }

  else{
    exportComplaintList();
  }
};


// 辅助函数：将 Date 对象格式化为 "yyyyMMdd" 格式
function formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从 0 开始的，所以需要 +1
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
}

const exportComplaintList = () =>{
  proxy?.download('cost/plateBalance/export', {
    ...mainQueryParams.value, tableName: 'costPlateBalance'
  }, `发料成本明细_${formatDate(new Date())}.xlsx`);
}



const XTableRef = ref();

const route = useRoute();
const isFirst = ref(0)

const routeMonth = ref('')


/**
 * 重新进入页面时
 */
onActivated(() => {
  if (isFirst.value === 0) {
    isFirst.value++
    return;
  }
  isFirst.value++

  if (route.query.month && routeMonth.value && (route.query.month === routeMonth.value)) return;
  const month = route.query.month;

  routeMonth.value = month
  if (month) {
    mainQueryParams.value.costMonth = month;
    refreshTableData();
  }
})

/**
 * 渲染完页面后刷新页面数据
 */
onMounted(() => {
  isFirst.value = 0
  if (route.query.month && routeMonth.value && (route.query.month === routeMonth.value)) return;
  const month = route.query.month;

  routeMonth.value = month
  if (month) {
    mainQueryParams.value.costMonth = month;
  }
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

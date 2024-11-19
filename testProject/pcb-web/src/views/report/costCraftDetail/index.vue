<template>
  <div class="p-2 xtable-page">
    <div class="p-2 global-flex flex-end" >
      <div class="totalTitle">领料总量：{{headData.receiveQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp; 还料总量：{{headData.returnQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp; 领料总金额：{{headData.receiveTotalPrice}}&nbsp;&nbsp;|&nbsp;&nbsp; 还料总金额：{{headData.returnTotalPrice}}</div>
      <el-button v-if="checkPermi(['report:costCraftDetail:export'])" plain @click="handleExport" >导出 </el-button>
    </div>


    <el-card shadow="never" class="xtable-card" v-if="checkPermi(['report:costCraftDetail:list'])">
      <XTable toolId="costCraftDetail" class="xtable-content" height="100%"
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


        <template #default-quantity="scope">
          <div> {{scope.row.type === '17' ? '-' + scope.row.quantity : scope.row.quantity}}</div>
        </template>


      </XTable>
    </el-card>



  </div>
</template>

<script setup name="CostCraftDetail">

import {ref} from "vue";
import {getCostCraftDetailSum, queryCostCraftDetailPage} from "@/api/report/costReport";
import {checkPermi} from "@/utils/permission";
import dayjs from "dayjs";


const XTableRef = ref();
const routeMonth = ref('')
/**
 * 声名需要处理的时间条件字段
 */
const intervalCondition = [
  'bizTime',
  'quantity',
  'price',
  'totalPrice',
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
});
const mainColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center", fixed: 'left' },
  { title: "业务日期", width: "100", field: "bizTime", align: "center" , filterType: 'intervalDate', fixed: 'left',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    }
  },
  { title: "领料单号", width: "120", field: "code", align: "center" , fixed: 'left', filterType: "input"  },
  { title: "业务类型", width: "90", field: "type", align: "center", fixed: 'left',
    filterType: 'radioButton',
    filterParam: {placeholder: '请选择领料/还料'},
    filterData: () => typeList.value
  },
  { title: "领料部门", width: "90", field: "createDeptName", align: "center" , filterType: "input"  },
  { title: "领料人", width: "90", field: "createByName", align: "center" , filterType: "input" },
  { title: "工序", width: "80", field: "craftName", align: "center" , filterType: "input" },
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
  { title: "操作数量", width: "90", field: "quantity", align: "center", filterType: "intervalNumber"},
  { title: "单价(元)", width: "90", field: "price", align: "center", filterType: "intervalNumber"},
  { title: "金额(元)", width: "90", field: "totalPrice", align: "center", filterType: "intervalNumber"},
  { title: "备注", width: "130", field: "remark", align: "center", filterType: "input" },
]);
/**
 * 初始化首页查询参数
 */
const { mainQueryParams } = toRefs(reactive({
  mainQueryParams: {
    pageNum: 1,
    pageSize: 20,
    bizTimeStart: undefined,
    bizTimeEnd: undefined,
    code: undefined,
    type: undefined,
    createDeptName: undefined,
    createByName: undefined,
    craftName: undefined,
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
    quantityStart: undefined,
    quantityEnd: undefined,
    priceStart: undefined,
    priceEnd: undefined,
    totalPriceStart: undefined,
    totalPriceEnd: undefined,
    remark: undefined
  }
}));

/**
 * 发送查询请求,刷新页面数据
 */
const refreshTableData = () => {
  mainTableLoading.value = true;

  getCostCraftDetailSum(mainQueryParams.value)
    .then((res) => {
      headData.value = res.data;
    })
    .finally(() => {
      mainTableLoading.value = false;
    });


  queryCostCraftDetailPage(mainQueryParams.value)
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
    mainQueryParams.value.bizTimeStart === undefined &&
    mainQueryParams.value.bizTimeEnd === undefined &&
    mainQueryParams.value.code === undefined &&
    mainQueryParams.value.type === undefined &&
    mainQueryParams.value.createDeptName === undefined &&
    mainQueryParams.value.createByName === undefined &&
    mainQueryParams.value.craftName === undefined &&
    mainQueryParams.value.materialCode === undefined &&
    mainQueryParams.value.materialName === undefined &&
    mainQueryParams.value.materialQuality === undefined &&
    mainQueryParams.value.boardThickness === undefined &&
    mainQueryParams.value.copperThickness === undefined &&
    mainQueryParams.value.color === undefined &&
    mainQueryParams.value.level === undefined &&
    mainQueryParams.value.manufacturer === undefined &&
    mainQueryParams.value.specification === undefined &&
    mainQueryParams.value.unit === undefined &&
    mainQueryParams.value.quantityStart === undefined &&
    mainQueryParams.value.quantityEnd === undefined &&
    mainQueryParams.value.priceStart === undefined &&
    mainQueryParams.value.priceEnd === undefined &&
    mainQueryParams.value.totalPriceStart === undefined &&
    mainQueryParams.value.totalPriceEnd === undefined &&
    mainQueryParams.value.remark === undefined
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
      // 设置createTimeStart为30天前的时间
      () => {
        mainQueryParams.value.isThirty = true;
        exportComplaintList();
      })
  }else{
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

const route = useRoute();
const exportComplaintList = () =>{
  proxy?.download('purchase/materialInOutRecord/exportCostCraft', {
    ...mainQueryParams.value, tableName: 'costCraftDetail'
  }, `工序成本明细_${formatDate(new Date())}.xlsx`);
}
const isFirst = ref(0)


/**
 * 重新进入页面时
 */
onActivated(() => {
  if (isFirst.value === 0) {
    isFirst.value++
    return;
  }
  isFirst.value++
  console.log(routeMonth.value)
  if (route.query.month && routeMonth.value && (route.query.month == routeMonth.value)) return;
  const month = route.query.month;
  routeMonth.value = month
  console.log(route.query, month)
  if (month) {
    mainQueryParams.value.bizTimeStart = dayjs(month).startOf('month').format('YYYY-MM-DD');
    mainQueryParams.value.bizTimeEnd = dayjs(month).endOf('month').format('YYYY-MM-DD');

    let searchTempList = [
      {field: 'bizTime', defaultValue: [mainQueryParams.value.bizTimeStart, mainQueryParams.value.bizTimeEnd]},
    ]
    setTimeout(() => {
      XTableRef.value.filterFieldEvent(searchTempList)
    }, 100)
    // refreshTableData();
  }
})

/**
 * 渲染完页面后刷新页面数据
 */
onMounted(() => {
  isFirst.value = 0
  console.log(routeMonth.value)
  if (route.query.month && routeMonth.value && (route.query.month == routeMonth.value)) return;
  const month = route.query.month;
  routeMonth.value = month
  console.log(route.query, month)
  if (month) {
    mainQueryParams.value.bizTimeStart = dayjs(month).startOf('month').format('YYYY-MM-DD');
    mainQueryParams.value.bizTimeEnd = dayjs(month).endOf('month').format('YYYY-MM-DD');

    let searchTempList = [
      {field: 'bizTime', defaultValue: [mainQueryParams.value.bizTimeStart, mainQueryParams.value.bizTimeEnd]},
    ]
    setTimeout(() => {
      XTableRef.value.filterFieldEvent(searchTempList)
    }, 100)
  } else {
    refreshTableData();
  }
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

<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" class="xtable-tab" @tab-change="changeTab" v-model="activeName">
        <el-tab-pane label="工序外协" name="0" v-if="checkPermi(['report:costOutSourceDetail:craftList'])">
          <el-row :gutter="10" class="mb8 global-flex flex-between width-100">
            <el-col :span="1.5" class="primary-color">
              <el-form :model="mainQueryParams" ref="queryFormRef" label-width="80px"
                       class="demo-form-inline">
                <el-form-item label="结存月份" prop="costMonth" style="margin-bottom: 0;">
                  <el-date-picker class="width-100" :clearable="false" v-model="mainQueryParams.costMonth" type='month' placeholder='请选择结存月份' valueFormat='YYYY-MM' @change="handleQuery"/>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="1.5" class="global-flex flex-end">
              <div class="totalTitle">加工总数：{{headData.quantity}}&nbsp;&nbsp;|&nbsp;&nbsp;收货总数：{{headData.receiveQuantity}}&nbsp;&nbsp;|&nbsp;&nbsp;加工总面积(㎡)：{{headData.totalArea}}&nbsp;&nbsp;|&nbsp;&nbsp;
                收货总面积(㎡)：{{headData.receiveTotalArea}}&nbsp;&nbsp;|&nbsp;&nbsp;
                收货总金额(元)：{{headData.totalPrice}}</div>
              <el-button plain @click="handleExport"  v-if="checkPermi(['report:costOutSourceDetail:craftExport'])">导出 </el-button>
            </el-col>
          </el-row>
          <XTable toolId="costOutSourceCraftDetail" class="xtable-content" height="100%"
                  v-model:page-size="mainQueryParams.pageSize"
                  v-model:current-page="mainQueryParams.pageNum"
                  :loading="mainTableLoading"
                  :page-params="{ perfect: true, total: mainTableTotal }"
                  :data="mainTableData"
                  :columnList="outSourceCraftDetailColumnList"
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
            <template #default-unit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
            </template>
            <template #default-receiveUnit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.receiveUnit)?.label }}</div>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="菲林/网板外协" name="1" v-if="checkPermi(['report:costOutSourceDetail:feiLinList'])">
          <el-row :gutter="10" class="mb8 global-flex flex-between width-100">
            <el-col :span="1.5" class="primary-color">
              <el-form :model="completeQueryparam" ref="queryFormRef" label-width="80px"
                       class="demo-form-inline">
                <el-form-item label="结存月份" prop="costMonth" style="margin-bottom: 0;">
                  <el-date-picker class="width-100" :clearable="false" v-model="completeQueryparam.costMonth" type='month' placeholder='请选择结存月份' valueFormat='YYYY-MM' @change="getCompleteList"/>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="1.5" class="global-flex flex-end">
              <div class="totalTitle">确认总金额(元)：{{totalPrice}}&nbsp;&nbsp;|&nbsp;&nbsp;确认总面积(㎡)：{{totalArea}}</div>
              <el-button plain @click="handleFeiLinExport"  v-if="checkPermi(['report:costOutSourceDetail:feiLinExport'])">导出 </el-button>
            </el-col>
          </el-row>
          <XTable toolId="outSourceFeiLinOrderCost" v-model:page-size="completeQueryparam.pageSize"
                  v-model:current-page="completeQueryparam.pageNum"
                  height="100%" class="xtable-content" :loading="loading"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: comTotal }"
                  :showRefresh="true"
                  :data="outSourceFilinCompleteList" :columnList="completeColumnList"
                  ref="completeTableRef" border @searchChange="searchCompleteChange" :column-config="{ resizable: true }"
                  :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id' }">
            <template #default-isCompression="scope">
              <div v-for="item in isCompressionList">
                <span>{{ item.value == scope.row.isCompression ? item.label : "" }}</span>
              </div>
            </template>

            <template #default-isCcd="scope">
              <div v-for="item in isCCDList">
                <span>{{ item.value == scope.row.isCcd ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-type="scope">
              <div v-for="item in orderTypeList">
                <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-wangBanType="scope">
              <div v-for="item in wangBanTypeOptions">
                <span>{{ item.value == scope.row.wangBanType ? item.label : "" }}</span>
              </div>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>





  </div>
</template>

<script setup name="CostOutSourceDetail">

import {ref} from "vue";
import dayjs from "dayjs";
import {listFeiLinPageList, queryCostOutSourceDetailPage} from "@/api/report/costReport";
import {checkPermi} from "@/utils/permission";

// 菲林表格相关
const completeQueryparam  = ref({
  pageNum: 1,
  pageSize: 20,
  costMonth: dayjs(new Date).format('YYYY-MM'),
  params: {}
});
const loading = ref(true);
const comTotal = ref(0);
const outSourceFilinCompleteList = ref([]);

const mainTableLoading = ref(false);
const mainTableTotal = ref(0);
const mainTableData = ref([]);
const typeList = ref([
  {label: '领料', value: '16',elTagType: 'primary'},
  {label: '还料', value: '17',elTagType: 'success'}
]);
const activeName = ref('0')
const headData = ref({
  quantity:0,
  receiveQuantity:0,
  totalArea:0,
  receiveTotalArea:0,
  totalPrice:0,
});

const totalArea = ref(0);
const totalPrice = ref(0);

const initHeadData = () => {
  headData.value = {
    quantity:0,
    receiveQuantity:0,
    totalArea:0,
    receiveTotalArea:0,
    totalPrice:0,
  }
}

const unitOptions = ref([
  { value: "1", label: "大料" },
  { value: "2", label: "PNL" },
  { value: "3", label: "SET" },
])
const wangBanTypeOptions = ref([
  {value: "1", label: "普通"},
  {value: "2", label: "碳油"}
])
const isCompressionList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
]);
const isCCDList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
]);
const orderTypeList = ref([
  { label: '菲林', value: "1" },
  { label: '网板', value: "2" },
]);

// 获取 搜索条件
const searchCompleteChange = (params) => {
  let costMonth = completeQueryparam.value.costMonth
  completeQueryparam.value = params
  completeQueryparam.value.costMonth = costMonth
  getCompleteList()
}

/** 查询菲林网板外协单列表 */
const getCompleteList = () => {
  completeQueryparam.value.status = "1";
  loading.value = true;
  listFeiLinPageList(completeQueryparam.value)
  .then((res) => {
  if (res.data.list) {
    outSourceFilinCompleteList.value = res.data.list.rows;
    comTotal.value = res.data.list.total;
    totalArea.value = res.data.totalArea;
    totalPrice.value = res.data.totalPrice;
  }else{
    outSourceFilinCompleteList.value = [];
    comTotal.value = 0;
    totalArea.value = 0;
  }
  })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 声名需要处理的时间条件字段
 */
const intervalCondition = [
  'receiveTime',
  'quantity',
  'length',
  'width',
  'totalArea',
  'receiveQuantity',
  'basePrice',
  'receivePrice',
  'receiveTotalArea',
  'totalPrice',
  'price',
  'confirmCompleteTime',
  'orderCreateTime',
  'outSourceCostTime',
  'confirmQuantity',
  'area'
];
const completeColumnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60' ,fixed: "left"},
  { width: '120', title: '确认完成日期', field: 'confirmCompleteTime', align: 'center' ,filterType: 'intervalDate',  filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    } ,fixed: "left"},
  { title: '外协单号', width: '120', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' },fixed: "left" },
  { title: '外协类型',field: 'type', width: '80',    align: 'center',    filterType: 'radio',    filterParam: { placeholder: '请输入类型' },
    filterData: () => orderTypeList.value ,fixed: "left"},
  { width: '120',title: '排产单号',field: 'productionNo',align: 'center',filterType: 'input',filterParam: { placeholder: '请输入排产单编号' },fixed: "left"},
  { width: '120', title: '产品编码', field: 'commodityNo', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' },fixed: "left"},
  // { width: '120', title: '供应商编码', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' }},
  { width: '120', title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' }},
  { title: '加工数量', width: '80', field: 'quantity', align: 'center' , filterType: 'input', },
  { title: '确认数量', width: '80', field: 'confirmQuantity', align: 'center' ,filterType: "intervalNumber"},
  { title: '长（mm）', width: '80', field: 'length', align: 'center', filterType: 'input', },
  { title: '宽（mm）', width: '80', field: 'width', align: 'center' , filterType: 'input', },
  { title: '确认面积（㎡）', width: '80', field: 'area', align: 'center' ,filterType: "intervalNumber"},
  { title: '确认完成金额(元)', width: '150', field: 'price', align: 'center' ,filterType: "intervalNumber"},
  { title: '是否压膜', width: '80', field: 'isCompression', align: 'center',    filterType: 'radio',    filterParam: { placeholder: '请输入类型' },
    filterData: () => isCompressionList.value },
  { title: '是否CCD', width: '80', field: 'isCcd', align: 'center',    filterType: 'radio',    filterParam: { placeholder: '请输入类型' },
    filterData: () => isCCDList.value},
  { title: '菲林原因', width: '120', field: 'reason', align: 'center', filterType: 'input', },
  { title: '其他要求', width: '120', field: 'otherRequirement', align: 'center', filterType: 'input', },
  { title: '网板类型', width: '120', field: 'wangBanType', align: 'center' ,    filterType: 'radio',    filterParam: { placeholder: '请输入类型' },
    filterData: () => wangBanTypeOptions.value},
  { title: '备注', width: '120', field: 'remark', align: 'center' , filterType: 'input', },
  { width: '90', title: '下单人', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入下单人' }},
  { width: '120', title: '下单时间', field: 'outSourceCostTime', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
]);

const outSourceCraftDetailColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' ,fixed: "left"},
  { title: '收货日期', field: 'receiveTime', width: '100', align: 'center',filterType: 'intervalDate',  filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    } ,fixed: "left"},
  { title: '收货单号', field: 'code', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收货单号' } ,fixed: "left"},
  { title: '外协单号', field: 'orderCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' },fixed: "left" },
  { title: '排产单号', field: 'productionCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入排产单号' } ,fixed: "left"},
  { title: '产品编码', width: '160', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' },fixed: "left" },
  { title: '供应商', width: '160', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '加工工序', width: '120', field: 'craftName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '加工数量', field: 'quantity', width: '100', align: 'center',filterType: "intervalNumber" },
  { title: '外发单位', width: '100', field: 'unit', align: 'center',filterType: 'radioButton',
    filterParam: {placeholder: '请输入外发单位'},
    filterData: () => unitOptions.value,
    filterCustom: {label: 'label', value: 'value'}
  },
  { title: '加工时间', field: 'orderCreateTime', width: '100', align: 'center',filterType: 'intervalDate',  filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '长(mm)', width: '100', field: 'length', align: 'center',filterType: "intervalNumber" },
  { title: '宽(mm)', width: '100', field: 'width', align: 'center',filterType: "intervalNumber" },
  { title: '加工总面积(㎡)', width: '100', field: 'totalArea', align: 'center',filterType: "intervalNumber"},
  { title: '外发类型', width: '100', field: 'typeName', align: 'center', filterType: 'input', },
  { title: '加工要求', width: '180', field: 'requirement', align: 'center', filterType: 'input', },
  { title: '备注', field: 'remark', width: '100', align: 'center', filterType: 'input', },
  { title: '收货人', field: 'createByName', width: '100', align: 'center', filterType: 'input', },
  { title: '收货单位', width: '100', field: 'receiveUnit', align: 'center',filterType: 'radioButton',
    filterParam: {placeholder: '请输入收货单位'},
    filterData: () => unitOptions.value,
    filterCustom: {label: 'label', value: 'value'}
  },
  { title: '已收数量', field: 'receiveQuantity', width: '100', align: 'center',filterType: "intervalNumber" },
  { title: '基价(元)', width: '60',  field: 'basePrice', align: 'center',filterType: "intervalNumber" },
  { title: '单价(元)', width: '80',  field: 'receivePrice', align: 'center',filterType: "intervalNumber"},
  { title: '收货面积(㎡)', width: '100', field: 'receiveTotalArea', align: 'center',filterType: "intervalNumber" },
  { title: '收货金额(元)', width: '80',  field: 'totalPrice', align: 'center',filterType: "intervalNumber" },
  { title: '计价参数', field: 'countParam', width: '100', align: 'center', filterType: 'input'},
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


  queryCostOutSourceDetailPage(mainQueryParams.value)
    .then((res) => {

      if (res.data.list) {
        mainTableData.value = res.data.list.rows;
        // 将收货日期转为年月日的格式
        mainTableData.value.forEach(item => {
          item.receiveTime = dayjs(item.receiveTime).format('YYYY-MM-DD')
        })
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
  // receiveTimeStart转为当天00:00:00
  mainQueryParams.value.receiveTimeStart = mainQueryParams.value.receiveTimeStart ? dayjs(mainQueryParams.value.receiveTimeStart).format('YYYY-MM-DD 00:00:00') : undefined;
  // receiveTimeEnd转为当天23:59:59
  mainQueryParams.value.receiveTimeEnd = mainQueryParams.value.receiveTimeEnd ? dayjs(mainQueryParams.value.receiveTimeEnd).format('YYYY-MM-DD 23:59:59') : undefined;
  refreshTableData();
}


/**
 * 定义代理对象
 */
const {proxy} = getCurrentInstance();
/** 工序外协导出按钮操作 */
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

/** 菲林/网板导出按钮操作 */
const handleFeiLinExport = () => {

  if (mainTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
      exportFeiLinList();
      }
    )
  }
  else{
    exportFeiLinList();
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
  proxy?.download('cost/outSourceCraft/exportOutSourceCraftDetail', {
    ...mainQueryParams.value, tableName: 'costOutSourceCraftDetail'
  }, `工序外协成本明细_${formatDate(new Date())}.xlsx`);
}

const exportFeiLinList = () =>{
  proxy?.download('cost/outSourceCraft/exportFeiLinDetail', {
    ...completeQueryparam.value, tableName: 'outSourceFeiLinOrderCost'
  }, `菲林网板成本明细_${formatDate(new Date())}.xlsx`);
}

/**
 * 标签页变更时触发刷新接口
 */
const changeTab = (name) => {
  if (name === '0'){
    refreshTableData();
  }else  if (name === '1'){
    getCompleteList();
  }
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
    completeQueryparam.value.costMonth = month;
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
    completeQueryparam.value.costMonth = month;
  }
  activeName.value = checkPermi(['report:costOutSourceDetail:craftList']) ? '0' : '1'
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

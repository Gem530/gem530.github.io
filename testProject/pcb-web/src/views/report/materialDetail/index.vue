<template>
  <div class="p-2 xtable-page">
    <el-card v-if="checkPermi(['report:material:list'])" shadow="never" class="xtable-card">
      <template #header>
        <el-col :span="24" style="justify-content: flex-end;display: flex;">
          <el-button v-if="checkPermi(['report:material:export'])" type="primary" @click="handleExport">导出</el-button>
        </el-col>
      </template>
      <XTable :toolId="materialTableId" :pageShow="true" v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
        :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }" :data="orderList"
        :scroll-y="{ enabled: true }" :loading="loading" size="mini" :columnList="columnList" border
        @searchChange="handleQuery" :column-config="{ resizable: true }">
        <template #default-type="scope">
          <div v-for="item in typeList">
            <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
          </div>
        </template>

        <template #default-isAccountOrder="scope">
          <div v-for="item in isAccountOrderList">
            <span>{{ item.value == scope.row.isAccountOrder ? item.label : "" }}</span>
          </div>
        </template>

        <template #default-inOutType="scope">
          <span v-if="inTypeList.includes(scope.row.type)">入库</span>
          <span v-else>出库</span>
        </template>
      </XTable>
    </el-card>

    <el-dialog v-model="exportVisible" title="导出提示" width="20%" align-center destroy-on-close>
      <span>
        没有设置过滤条件，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="doHandleExport30">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MaterialDetailReport">

import { parseTime } from "@/utils/ruoyi";
import {listMaterial} from "@/api/report/MaterialDetail";
import {ref} from "vue";
import {checkPermi} from "@/utils/permission";

const { proxy } = getCurrentInstance();
const exportVisible = ref(false);
const orderList = ref([]);
const loading = ref(true);
const total = ref(0);
const materialTableId = ref("materialReportTableId");

const { queryParams } = toRefs(reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
}));

const inTypeList = ref([ '1','6','7']);

const typeList = ref([
  {label: '采购', value: '1' },
  {label: '采购退货', value: '2' },
  {label: '物料借出', value: '5' },
  {label: '借出归还', value: '6' },
  {label: '物料借入', value: '7' },
  {label: '借入归还', value: '8' },
]);

const inOutTypeList = ref([
  {label: '入库', value: '1' },
  {label: '出库', value: '2' },
]);

const isAccountOrderList = ref([
  {label: '已对账', value: '1' },
  {label: '未对账', value: '0' },
]);

const intervalCondition = ['quantity', 'price', 'totalPrice', 'accountTime'];

const columnList = ref([
  { title: "序号", field: 'index', type: 'seq', align: 'center', width: '60' },
  { title: '来源', width: '100', field: 'type', align: 'center', filterType: 'checkboxButton' , filterData:()=>typeList.value },
  { title: '单据类型', width: '90', field: 'inOutType', align: 'center', filterType: 'radio', filterData: () => inOutTypeList.value },
  { title: '单据编号', field: 'code', align: 'center', filterType: 'input' },
  { title: '对账状态', width: '90' , field: 'isAccountOrder', align: 'center' , filterType: 'radio', filterData: () => isAccountOrderList.value },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center',
    filterType: 'date', filterParam: { type: 'month', placeholder: '',valueFormat: 'YYYY-MM' }
  },
  { title: '对账数量', width: '100', field: 'quantity', align: 'center', filterType: 'intervalNumber', },
  { title: '对账单价(元)', width: '100', field: 'price', align: 'center', filterType: 'intervalNumber',},
  { title: '对账总金额(元)', width: '110', field: 'totalPrice', align: 'center', filterType: 'intervalNumber', },
  { title: '供应商名称',  field: 'supplierName', align: 'center', filterType: 'input' },
  { title: '供应商代码', width: '100', field: 'supplierCode', align: 'center', filterType: 'input' },
  { title: '对账人', width: '100', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '对账时间', width: '160', field: 'accountTime', align: 'center',
    filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'datetime' }, endParams: { type: 'datetime' }, valueFormat: 'YYYY-MM-DD HH:mm:ss' }
  },
]);

const getList = async () => {
  loading.value = true;
  const res = await listMaterial(queryParams.value);
  orderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}


/** 搜索按钮操作 */
const handleQuery = async (params) => {
  if(params.type) {
    params.typeList = params.type;
    params.type = undefined;
  }
  queryParams.value = params;
  getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  //如果没有设置起始时间，将默认导出30天内的数据
  let count = 0;
  for (const key in queryParams.value) {
    console.log(key);
    if(key!='pageNum'&&key!='pageSize'){
      count++;
    }
  }
  if (!queryParams.value.deliveryTimeStart && count <= 0) {
    exportVisible.value = true;
  } else {
    doHandleExport();
  }
}

const doHandleExport = () => {
  proxy?.download('report/materialDetail/export', {
    ...queryParams.value, tableName: materialTableId.value, exportPageSize: total.value
  }, `物料明细查询_${parseTime(new Date())}.xlsx`)
}

const doHandleExport30 = () => {
  proxy?.download('report/materialDetail/export', {
    ...queryParams.value, tableName: materialTableId.value, isExport30Days: true
  }, `物料明细查询_${parseTime(new Date())}.xlsx`).finally(() => {
    exportVisible.value = false;
  })
}

onMounted(() => {
  getList();
})
</script>

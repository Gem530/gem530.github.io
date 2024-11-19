<template>
  <div class="p-2 xtable-page">
    <el-card v-if="checkPermi(['report:commodity:list'])" shadow="never" class="xtable-card">
      <template #header>
        <el-col :span="24" style="justify-content: flex-end;display: flex;">
          <el-button v-if="checkPermi(['report:commodity:export'])" type="primary" @click="handleExport">导出</el-button>
        </el-col>
      </template>
      <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
        <el-col :span="20">
          <p class="totalTitle">总对账数量：{{accQuantityTotal?accQuantityTotal:0}}&nbsp;&nbsp;|&nbsp;&nbsp; 总对账合计金额：{{accTotalAmountTotal?accTotalAmountTotal:0}}  </p>
        </el-col>
      </el-row>
      <XTable :toolId="orderTableId" :pageShow="true" v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
        :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }" :data="orderList"
        :scroll-y="{ enabled: true }" :loading="loading" size="mini" :columnList="columnList" border
        @searchChange="handleQuery" :column-config="{ resizable: true }">
        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-model="scope">
          <div v-for="item in orderTypeList">
            <span>{{ item.value == scope.row.model ? item.label : "" }}</span>
          </div>
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

<script setup name="OrderSaleDetailReport">

import { listPostOrder,getPostCount } from "@/api/report/saleOrderDetail";
import { getListCustomer } from "@/api/basedata/customer";

import { parseTime } from "@/utils/ruoyi";
import {listUserByRoleKey} from "@/api/system/user";
import {checkPermi} from "@/utils/permission";

const accQuantityTotal=ref();
const accTotalAmountTotal=ref();
const { proxy } = getCurrentInstance();
const exportVisible = ref(false);
const orderList = ref([]);
const loading = ref(true);
const total = ref(0);
const orderTableId = ref("reportOrderDetailTable");

const customerCodeList = ref();
const customerNameList = ref();
const salerList = ref();
const intervalCondition = ['accountMonth', 'deliveryTime','placeOrderTime'];

const orderTypeList = ref([
  { label: '批量', value: "1" },
  { label: '样品', value: "2" },
]);

const { queryParams } = toRefs(reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
}));

const columnList = ref([
  { title: "序号", field: 'index', type: 'seq', align: 'center', width: '60' },
  {
    title: '对账月份', width: '80', field: 'accountMonth', align: 'center',
    filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' }
  },
  { title: '客户编码', width: '100', field: 'customerCodeIdList', align: 'center', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
  {
    title: '送货时间', width: '125', sortable: true, field: 'deliveryTime', align: 'center',
    filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'datetime' }, endParams: { type: 'datetime' }, valueFormat: 'YYYY-MM-DD HH:mm:ss' }
  },
  { title: '下单时间', width: '100' , field: 'placeOrderTime', align: 'center' ,
    filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'datetime' }, endParams: { type: 'datetime' }, valueFormat: 'YYYY-MM-DD HH:mm:ss' }
  },
  { title: '业务员', width: '100', field: 'cusSaleUserName', align: 'center', filterType: 'checkboxSearch' , filterData:()=>salerList.value},
  { title: '客户PO', width: '100', field: 'customerPo', align: 'center', filterType: 'input' },
  { title: '批/样', width: '100', field: 'model', align: 'center',
    filterType: 'radio', filterData: () => orderTypeList.value },
  { title: '产品编码', width: '100', field: 'commodityCode', align: 'center', filterType: 'input' },
  { title: '产品名称', width: '120', field: 'commodityName', align: 'center', filterType: 'input' },
  { title: '下单数量（PCS）', width: '100', field: 'orderQuantity', align: 'center' },
  { title: '送货数量（PCS）', width: '100', field: 'deliveryQuantity', align: 'center' },
  { title: '备品数量（PCS）', width: '100', field: 'reserveQuantity', align: 'center' },
  { title: '订单欠数', width: '100', field: 'diffQuantity', align: 'center' },
  { title: '送货面积（m²）', width: '100', field: 'deliveryArea', align: 'center' },
  { title: '送货备注', width: '100', field: 'deliveryRemark', align: 'center' },
  { title: '送货单号', width: '100', field: 'deliveryCode', align: 'center', filterType: 'input' },
  { title: '销售单号', width: '100', field: 'saleCode', align: 'center', filterType: 'input' },
  { title: '下单面积（m²）', width: '100', field: 'saleArea', align: 'center' },
  { title: '平米价（元/m²）', width: '100', field: 'squarePrice', align: 'center' },
  { title: '单价（元/PCS）', width: '100', field: 'price', align: 'center' },
  { title: '对账平米价（元/m²）', width: '100', field: 'accSquarePrice', align: 'center' },
  { title: '对账单价（元/PCS）', width: '100', field: 'accPrice', align: 'center' },
  { title: '对账数量', width: '100', field: 'accQuantity', align: 'center' },
  { title: '合同额', width: '100', field: 'saleAmount', align: 'center' },
  { title: '模具费', width: '100', field: 'mouldCost', align: 'center' },
  { title: '测试架费', width: '100', field: 'testFrameCost', align: 'center' },
  { title: '飞针费', width: '100', field: 'flyProbeCost', align: 'center' },
  { title: '工程费', width: '100', field: 'engineeringCost', align: 'center' },
  { title: '样板费', width: '100', field: 'sampleCost', align: 'center' },
  { title: '加急费', width: '100', field: 'expeditedCost', align: 'center' },
  { title: '其他费用', width: '100', field: 'otherCost', align: 'center' },
  { title: '对账扣款金额', width: '100', field: 'discountPrice', align: 'center' },
  { title: '板金额', width: '100', field: 'boardAmount', align: 'center' },
  { title: '合计金额', width: '100', field: 'totalAmount', align: 'center' },
  { title: '对账合计金额', width: '100', field: 'accTotalAmount', align: 'center' },
]);

const getList = async () => {
  loading.value = true;
  const res = await listPostOrder(queryParams.value);
  orderList.value = res.rows;
  total.value = res.total;
  loading.value = false;

  const resCount = await getPostCount(queryParams.value);
  accQuantityTotal.value=resCount.accQuantity;
  accTotalAmountTotal.value=resCount.accTotalAmount;
  console.log("accQuantityTotal.value",accQuantityTotal.value);
}


/** 搜索按钮操作 */
const handleQuery = async (params) => {
  queryParams.value = params;
  if(queryParams.value.accountMonthStart){
    queryParams.value.accountMonthStart = parseTime(queryParams.value.accountMonthStart, '{y}-{m}-{d}');
  }
  if(queryParams.value.accountMonthEnd){
    queryParams.value.accountMonthEnd = parseTime(queryParams.value.accountMonthEnd, '{y}-{m}-{d}');
  }
  if(queryParams.value.cusSaleUserName){
    queryParams.value.salerIdList = queryParams.value.cusSaleUserName;
    queryParams.value.cusSaleUserName=undefined;
  }
  if(queryParams.value.sorts && queryParams.value.sorts.length > 0) {
    queryParams.value.sorts.forEach(item => {
      queryParams.value.orderByColumn = item.prop;
      queryParams.value.isAsc = item.order;
    })
  }
  getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  //如果没有设置起始时间，将默认导出30天内的数据
  let count = 0;
  for (const key in queryParams.value) {
    console.log(key);
    if(key!='pageNum'&&key!='pageSize'&&key!='sorts'){
      count++;
    }
  }
  console.log(count);
  console.log(queryParams.value);
  if (!queryParams.value.deliveryTimeStart && count <= 0) {
    exportVisible.value = true;
  } else {
    doHandleExport();
  }
}

const doHandleExport = () => {
  proxy?.download('report/saleOrderDetail/export', {
    ...queryParams.value, tableName: orderTableId.value, exportPageSize: total.value
  }, `成品明细查询_${parseTime(new Date())}.xlsx`)
}

const doHandleExport30 = () => {
  proxy?.download('report/saleOrderDetail/export', {
    ...queryParams.value, tableName: orderTableId.value, isExport30Days: true
  }, `成品明细查询_${parseTime(new Date())}.xlsx`).finally(() => {
    exportVisible.value = false;
  })
}
const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerCode
        }
      });
    }
    const saleRes = await listUserByRoleKey("saler");
    salerList.value = saleRes.data.map(item=>{
        return {
          value:item.userId,
          label:item.nickName
        }
      });
  }

onMounted(() => {
  getList();
  getListCust();
})
</script>

<style lang="scss" scoped>
.totalTitle{

    padding: 0px !important;
    margin: 0px !important;
    line-height: 24px !important;
    display: flex !important;
    justify-content: end !important;
    font-size: 14px !important;
    color: #0892c7 !important;
    font-weight: bold;
    margin-right: 10px;
}
</style>

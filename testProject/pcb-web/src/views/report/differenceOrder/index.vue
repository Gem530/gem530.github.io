<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-click="tabChange" v-model="tabValue">
        <el-tab-pane label="销售订单" name="销售订单">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                      :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div class="search" style="width:100%">
              <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="100px" class="demo-form-inline">
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="产品编码" prop="commodityCode">
                      <el-input v-model="queryParams.commodityCode" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="销售单号" prop="saleOrderNo">
                      <el-input v-model="queryParams.saleOrderNo" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label="" prop="onlyDifference">
                      <el-checkbox v-model="queryParams.onlyDifference" @keyup.enter="handleQuery">只显示欠数订单</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14" style="justify-content: flex-end;display: flex;">
                    <div class="pl-10">
                      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                      <el-button plain @click="handleExport">导出</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </transition>
          <XTable :toolId="orderTableId" :pageShow="true" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
                  :page-params="{ perfect: true, total: total }" :data="orderList"
                  :scroll-y="{ enabled: true }" :loading="loading" size="mini" :columnList="columnList" border
                  @searchChange="handleQuery" :column-config="{ resizable: true }">
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="退货订单" name="退货订单">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                      :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div class="search" style="width:100%">
              <el-form :model="orderBackQueryParams" ref="queryFormRef" size="small" label-width="100px" class="demo-form-inline">
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="产品编码" prop="commodityCode">
                      <el-input v-model="orderBackQueryParams.commodityCode" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="退货单号" prop="saleOrderBackNo">
                      <el-input v-model="orderBackQueryParams.saleOrderBackNo" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="销售单号" prop="saleOrderNo">
                      <el-input v-model="orderBackQueryParams.saleOrderNo" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label="" prop="onlyDifference">
                      <el-checkbox v-model="orderBackQueryParams.onlyDifference" @keyup.enter="handleQuery">只显示欠数订单</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" style="justify-content: flex-end;display: flex;">
                    <div class="pl-10">
                      <el-button type="primary" icon="Search" @click="orderBackHandleQuery">搜索</el-button>
                      <el-button icon="Refresh" @click="resetOrderBackQuery">重置</el-button>
                      <el-button plain @click="orderBackHandleExport">导出</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </transition>
          <XTable :toolId="orderBackTableId" :pageShow="true" v-model:page-size="orderBackQueryParams.pageSize"
                  v-model:current-page="orderBackQueryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
                  :page-params="{ perfect: true, total: orderBackTotal }" :data="orderBackList"
                  :scroll-y="{ enabled: true }" :loading="orderBackLoading" size="mini" :columnList="orderBackColumnList" border
                  @searchChange="orderBackHandleQuery" :column-config="{ resizable: true }">
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup name="DifferenceOrder">

import { listOrder, orderBackListOrder } from "@/api/report/differenceOrder";
import { parseTime } from "@/utils/ruoyi";

const { proxy } = getCurrentInstance();

const orderList = ref([]);
const loading = ref(true);
const total = ref(0);
const orderTableId = ref("oewOrderTable");

const orderBackList = ref([]);
const orderBackLoading = ref(true);
const orderBackTotal = ref(0);
const orderBackTableId = ref("oewOrderBackTable");

const { queryParams, orderBackQueryParams } = toRefs(reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc,desc,asc",
    orderByColumn: "placeOrderTime,code,id",
    onlyDifference: true,
  },
  orderBackQueryParams: {
    pageNum: 1,
    pageSize: 20,
    onlyDifference: true,
  },
}));
const columnList = ref([
  { title: "序号", field: 'index', type: 'seq', align: 'center', width: '60' },
  { title: '销售单号', width: '200', field: 'saleOrderNo', align: 'center' },
  { title: '产品编码', width: '200', field: 'commodityCode', align: 'center' },
  { title: '产品名称',   field: 'commodityName', align: 'center' },
  { title: '下单时间', width: '200', field: 'placeOrderTime', align: 'center' },
  { title: '工厂交期', width: '200', field: 'dispatchTime', align: 'center' },
  { title: '订单数量', width: '120', field: 'orderQuantity', align: 'center' },
  { title: '已发数量', width: '120', field: 'deliveryQuantity', align: 'center' },
  { title: '差欠数量', width: '120', field: 'differenceQuantity', align: 'center' }
]);
const orderBackColumnList = ref([
  { title: "序号", field: 'index', type: 'seq', align: 'center', width: '60' },
  { title: '退货单号', width: '200', field: 'saleOrderBackNo', align: 'center' },
  { title: '销售单号', width: '200', field: 'saleOrderNo', align: 'center' },
  { title: '产品编码', width: '200', field: 'commodityCode', align: 'center' },
  { title: '产品名称',  field: 'commodityName', align: 'center' },
  { title: '退货时间', width: '200', field: 'backTime', align: 'center' },
  { title: '工厂交期', width: '200', field: 'dispatchTime', align: 'center' },
  { title: '退货数量', width: '120', field: 'backQuantity', align: 'center' },
  { title: '已发数量', width: '120', field: 'deliveryQuantity', align: 'center' },
  { title: '差欠数量', width: '120', field: 'differenceQuantity', align: 'center' }
]);
const tabValue = ref("销售订单");

const tabChange = (val) => {
  if (val.props.name === "销售订单") {
    getList()
  }else if (val.props.name === "退货订单") {
    getOrderBackList();
  }
}

const getList = async () => {
  loading.value = true;
  queryParams.value.isAsc = "desc,desc";
  queryParams.value.orderByColumn = "createTime,commodityCode";
  const res = await listOrder(queryParams.value);
  orderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

const getOrderBackList = async () => {
  orderBackLoading.value = true;
  const res = await orderBackListOrder(orderBackQueryParams.value);
  orderBackList.value = res.rows;
  orderBackTotal.value = res.total;
  orderBackLoading.value = false;
}
const resetQuery = () => {
  queryParams.value.commodityCode = undefined;
  queryParams.value.saleOrderNo = undefined;
  queryParams.value.onlyDifference = true;
  getList();
}

const resetOrderBackQuery = () => {
  orderBackQueryParams.value.commodityCode = undefined;
  orderBackQueryParams.value.saleOrderBackNo = undefined;
  orderBackQueryParams.value.saleOrderNo = undefined;
  orderBackQueryParams.value.onlyDifference = true;
  getOrderBackList();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
}
/** 搜索按钮操作 */
const orderBackHandleQuery = () => {
  getOrderBackList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('report/differenceOrder/export', {
    ...queryParams.value, tableName: orderTableId.value, exportPageSize: total.value
  }, `销售单欠数订单_${parseTime(new Date())}.xlsx`)
}

/** 导出按钮操作 */
const orderBackHandleExport = () => {
  proxy?.download('report/differenceOrder/orderBackExport', {
    ...orderBackQueryParams.value, tableName: orderBackTableId.value, exportPageSize: total.value
  }, `退货单欠数订单_${parseTime(new Date())}.xlsx`)
}

onMounted(() => {
  getList();
})
</script>

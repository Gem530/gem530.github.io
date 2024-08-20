<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <div style="width: 100%; text-align: right; padding-bottom: 10px">
        <el-button type="primary" @click="() => {backOrderAddVisible = true}">退货下单</el-button>
      </div>
      <XTable toolId="orderBackMainTable" height="100%" class="xtable-content"
            v-model:page-size="mainQueryParams.pageSize"
            v-model:current-page="mainQueryParams.pageNum"
            :intervalCondition="intervalCondition"
            :page-params="{ perfect: true, total: mainTableTotal }"
            :data="mainTableData"
            :columnList="mainColumnList"
            ref="XTableRef"
            :scroll-x="{ enabled: true }"
            border :showRefresh="true"
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField:'id' }"
            :loading="mainTableLoading"
      >
        <template #default-status="scope">
          <span v-if="scope.row.status === '0'">待处理</span>
          <span v-else>处理完成</span>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </XTable>
    </el-card>

    <el-drawer
      v-model="backOrderAddVisible"
      title="退货下单"
      direction="rtl"
      size="80%"
      destroy-on-close
    >
      <BackOrderAdd @close="closeAddBackOrder" @submit="submitBackOrder"/>
    </el-drawer>
  </div>
</template>

<script setup name="Order">

import { queryPage, deleteBackOrder } from "@/api/order/orderBack";
import { parseTime } from "@/utils/ruoyi";
import BackOrderAdd from "@/views/order/orderBack/backOrderAdd.vue";

const { proxy } = getCurrentInstance();

const intervalCondition = ['backTime', 'placeOrderTime'];
const { mainQueryParams } = toRefs(reactive({
  mainQueryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    backTimeStart: undefined,
    backTimeEnd: undefined,
    saleOrderNo: undefined,
    placeOrderTimeStart: undefined,
    placeOrderTimeEnd: undefined,
    commodityCode: undefined,
    commodityName: undefined,
    reason: undefined,
  }
}));
const mainTableTotal = ref(0);
const mainTableData = ref([]);
const mainTableLoading = ref(false);
const backOrderAddVisible = ref(false);
const mainColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "状态", width: "60", field: "status", align: "center" },
  { title: "退货单号", width: "120", field: "code", align: "center", filterType: "input" },
  { title: "退货时间", width: "130", field: "backTime", align: "center", filterType: 'intervalDate', filterParam: { placeholder: '起始时间', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD'  }  },
  { title: "订单编号", width: "130", field: "saleOrderNo", align: "center", filterType: "input" },
  { title: "下单时间", width: "130", field: "placeOrderTime", align: "center", filterType: 'intervalDate', filterParam: { placeholder: '下单时间', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD'  }  },
  { title: "退货人", width: "80", field: "createByName", align: "center", filterType: 'input' },
  { title: "产品编码", width: "130", field: "commodityCode", align: "center", filterType: "input" },
  { title: "产品名称", width: "180", field: "commodityName", align: "center", filterType: "input" },
  { title: "产品PO", width: "120", field: "customerPo", align: "center", filterType: "input" },
  { title: "订货数量", width: "100", field: "orderQuantity", align: "center", },
  { title: "送货数量", width: "100", field: "deliveryQuantity", align: "center", },
  { title: "已退货数量", width: "100", field: "returnQuantity", align: "center", },
  { title: "可退货数量", width: "100", field: "canReturnQuantity", align: "center", },
  { title: "退货数量", width: "100", field: "quantity", align: "center", },
  { title: "退货原因", width: "130", field: "reason", align: "center", filterType: "input" },
  { title: "操作", fixed: 'right', width: "60", field: "make", align: "center"},
]);

const footerMethod = () => {

}

const closeAddBackOrder = () => {
  backOrderAddVisible.value = false;
}

const submitBackOrder = () => {
  backOrderAddVisible.value = false;
  refreshTableData();
}

const searchChange = (param) => {
  mainQueryParams.value = {...param}
  formatDateQuery();
  refreshTableData();
}

const refreshTableData = () => {
  console.log(mainQueryParams);
  mainTableLoading.value = true;
  queryPage(mainQueryParams.value)
    .then((res) => {
      mainTableData.value = res.rows;
      mainTableTotal.value = res.total;
    })
    .finally(() => {
      mainTableLoading.value = false;
    })
}

const onDelete = (orderId) => {
  ElMessageBox.confirm(
    '是否确认删除此退货单',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      proxy?.$modal.loading('加载中...')
      deleteBackOrder({
        backOrderId: orderId,
      })
        .then(() =>{
          refreshTableData();
        }).finally(() => proxy?.$modal.closeLoading());
    })
}

const formatDateQuery = () => {
  if (mainQueryParams.value.backTimeStart) {
    mainQueryParams.value.backTimeStart = parseTime(mainQueryParams.value.backTimeStart, '{y}-{m}-{d} 00:00:00');
  }
  if (mainQueryParams.value.backTimeEnd) {
    mainQueryParams.value.backTimeEnd = parseTime(mainQueryParams.value.backTimeEnd, '{y}-{m}-{d} 23:59:59');
  }
  if (mainQueryParams.value.placeOrderTimeStart) {
    mainQueryParams.value.placeOrderTimeStart = parseTime(mainQueryParams.value.placeOrderTimeStart, '{y}-{m}-{d} 00:00:00');
  }
  if (mainQueryParams.value.placeOrderTimeEnd) {
    mainQueryParams.value.placeOrderTimeEnd = parseTime(mainQueryParams.value.placeOrderTimeEnd, '{y}-{m}-{d} 23:59:59');
  }
}

onMounted(() => {
  refreshTableData();
});
</script>

<style scoped>
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
</style>

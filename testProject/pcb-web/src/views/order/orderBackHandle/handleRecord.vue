<template>
  <el-divider content-position="left">报废</el-divider>
  <XTable height="180px"
          :page-show="false"
          :data="scrapData"
          :columnList="scrapColumnList"
          ref="addOrderTableRef"
          border
          :column-config="{ resizable: true }"
          :row-config="{ keyField:'id' }"
          :loading="tableLoading"
  >
  </XTable>
  <el-divider content-position="left">重新入库</el-divider>
  <XTable height="180px"
          :page-show="false"
          :data="reInventoryData"
          :columnList="reInventoryColumnList"
          ref="addOrderTableRef"
          border
          :column-config="{ resizable: true }"
          :row-config="{ keyField:'id' }"
          :loading="tableLoading"
  >
  </XTable>
  <el-divider content-position="left">重新发货</el-divider>
  <XTable height="180px"
          :page-show="false"
          :data="reDeliveryData"
          :columnList="reDeliveryColumnList"
          ref="addOrderTableRef"
          border
          :column-config="{ resizable: true }"
          :row-config="{ keyField:'id' }"
          :loading="tableLoading"
  >
    <template #default-make="scope">
      <el-button link type="primary" @click="printDelivery(scope.row.id)">打印送货单</el-button>
    </template>
  </XTable>
  <div class="text-center" style="margin-top: 10px">
    <el-button @click="cancel">关 闭</el-button>
  </div>
</template>

<script setup name="backOrderHandleRecord">

import { defineProps } from "vue";
import { queryHandleRecord } from "@/api/order/orderBackHandle/index";


const props = defineProps({
  backOrder: {
    required: true,
    type: Object,
  },
})

const emit = defineEmits(['close', 'printDelivery']);

const cancel = () => {
  emit('close');
}

const tableLoading = ref(false);
const scrapData = ref([]);
const scrapColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "报废数量", width: "100", field: "quantity", align: "center", },
  { title: "报废工序", width: "150", field: "craftName", align: "center", },
  { title: "责任人", width: "110", field: "responsibleName", align: "center", },
  { title: "责任厂家", width: "110", field: "responsibleSupplierName", align: "center", },
  { title: "操作人", width: "80", field: "createByName", align: "center", },
  { title: "操作时间", width: "150", field: "createTime", align: "center", },
  { title: "备注", width: "200", field: "remark", align: "center", },
]);

const reInventoryData = ref([]);
const reInventoryColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "入库数量", width: "150", field: "quantity", align: "center", },
  { title: "操作人员", width: "150", field: "createByName", align: "center", },
  { title: "操作时间", width: "200", field: "intOutTime", align: "center", },
  { title: "库位", width: "150", field: "storageName", align: "center", },
  { title: "备注", width: "200", field: "remark", align: "center", },
]);

const reDeliveryData = ref([]);
const reDeliveryColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "发货数量", width: "80", field: "quantity", align: "center" },
  { title: "备品数量", width: "60", field: "reserveQuantity", align: "center" },
  { title: "箱数", width: "50", field: "caseNum", align: "center" },
  { title: "操作人", width: "80", field: "createByName", align: "center" },
  { title: "操作时间", width: "150", field: "createTime", align: "center" },
  { title: "发货地址", width: "200", field: "cusAddress", align: "center" },
  { title: "备注", width: "200", field: "remark", align: "center", },
  { title: "操作", fixed: 'right', width: "80", field: "make", align: "center", },
]);

const printDelivery = (val) => {
  emit('printDelivery', val)
}

const loadData = () => {
  tableLoading.value = true;
  queryHandleRecord({
    orderBackId: props.backOrder.value.id
  }).then(res => {
    reInventoryData.value = res.data.inOutRecordVoList;
    reDeliveryData.value = res.data.deliveryRecordVoList;
    scrapData.value = res.data.commodityScrapVoList;
  }).finally(() => {
    tableLoading.value = false;
  })
}

onMounted(() => {
  //加载数据
  loadData();
});
</script>

<style scoped>
  /deep/ .el-input__wrapper {
    width: 100%;
  }
</style>

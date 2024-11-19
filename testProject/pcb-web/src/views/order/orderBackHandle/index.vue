<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs class="xtable-tab" @tab-click="tabChange" v-model="tabValue">
        <el-tab-pane label="未完成" name="未完成">
          <XTable toolId="orderBackHandleUndoTable" height="100%" class="xtable-content"
                  v-model:page-size="undoQueryParams.pageSize"
                  v-model:current-page="undoQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: undoTableTotal }"
                  :data="undoTableData"
                  :columnList="undoColumnList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="undoSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="undoTableLoading"
          >
            <template #default-make="scope">
              <el-button link type="primary" @click="openScrap(scope.row)">报废</el-button>
              <el-button link type="primary" @click="openReInventory(scope.row)">重新入库</el-button>
              <el-button link type="primary" @click="openReDelivery(scope.row)">退货重发</el-button>
              <el-button link type="primary" @click="openHandleRecord(scope.row)">处理记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="已完成">
          <XTable toolId="orderBackHandleDoneTable" height="100%" class="xtable-content"
                  v-model:page-size="doneQueryParams.pageSize"
                  v-model:current-page="doneQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: doneTableTotal }"
                  :data="doneTableData"
                  :columnList="doneColumnList"
                  ref="XTableRef2"
                  border :showRefresh="true"
                  @searchChange="doneSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="doneTableLoading"
          >
            <template #default-make="scope">
              <el-button link type="primary" @click="openReDelivery(scope.row)">退货重发</el-button>
              <el-button link type="primary" @click="openHandleRecord(scope.row)">处理记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->

    <el-drawer
      v-model="handleRecordVisible"
      direction="rtl"
      size="60%"
      destroy-on-close
    >
      <template #header="{ close, titleId, titleClass }">
        <div :id="titleId" :class="titleClass" style="text-align: center">
          {{selectedBackOrder.value.code + '  ' + selectedBackOrder.value.commodityCode + '  退货处理记录'}}
        </div>
      </template>
      <HandleRecord @close="closeHandleRecord" :backOrder="selectedBackOrder" @printDelivery="printBackHandleDelivery"/>
    </el-drawer>

    <el-dialog
      v-model="scrapVisible"
      width="30%"
      destroy-on-close
    >
      <template #header="{ close, titleId, titleClass }">
        <div :id="titleId" :class="titleClass" style="text-align: center">
          {{selectedBackOrder.value.code + '  ' + selectedBackOrder.value.commodityCode + '  退货报废(' + selectedBackOrder.value.undoQuantity +')'}}
        </div>
      </template>
      <Scrap @close="closeScrap" :backOrder="selectedBackOrder" @confirm="closeScrap"/>
    </el-dialog>

    <el-dialog
      v-model="reDeliveryVisible"
      width="40%"
      destroy-on-close
    >
      <template #header="{ close, titleId, titleClass }">
        <div :id="titleId" :class="titleClass" style="text-align: center">
          {{selectedBackOrder.value.code + '  ' + selectedBackOrder.value.commodityCode + '  重新发货(' + calcMaxReDeliveryQuantity() +')'}}
        </div>
      </template>
      <ReDelivery @close="cancleReDelivery" :backOrder="selectedBackOrder" @confirm="submitReDelivery" @check="checkInventory" :maxReDeliveryQuantity="calcMaxReDeliveryQuantity()"/>
    </el-dialog>

    <el-dialog
      v-model="reInventoryVisible"
      width="30%"
      destroy-on-close
    >
      <template #header="{ close, titleId, titleClass }">
        <div :id="titleId" :class="titleClass" style="text-align: center">
          {{selectedBackOrder.value.code + '  ' + selectedBackOrder.value.commodityCode + '  重新入库(' + selectedBackOrder.value.undoQuantity +')'}}
        </div>
      </template>
      <ReInventory @close="closeReInventory" :backOrder="selectedBackOrder" @confirm="closeReInventory" @check="checkInventory"/>
    </el-dialog>

    <!-- 库存锁定提示框 -->
    <InventoryLock title="产品盘点提示" inventoryType="1" v-model:show="inventoryCheck" :data="inventoryRes" @close="inventoryCheck = false"/>

    <div v-show="false">
      <DeliveryPrintOrderBack ref="printRef"/>
    </div>

  </div>
</template>

<script setup name="OrderBackHandle">

import { queryPageContainsBackHandleData } from "@/api/order/orderBack";
import HandleRecord from "@/views/order/orderBackHandle/handleRecord.vue";
import Scrap from "@/views/order/orderBackHandle/scrap.vue";
import ReInventory from "@/views/order/orderBackHandle/reInventory.vue";
import ReDelivery from "@/views/order/orderBackHandle/reDelivery.vue";
import PrintDelivery from "@/views/order/orderBackHandle/printDelivery.vue";
import {listCommodityInventory} from "@/api/order/commodity";
import {ref} from "vue";
import { decryptBase64ByStr } from '@/utils/crypto'

const tabValue = ref("未完成");
const intervalCondition = ['backTime', 'placeOrderTime'];
const { undoQueryParams } = toRefs(reactive({
  undoQueryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    saleOrderNo: undefined,
    commodityCode: undefined,
    commodityName: undefined,
    //状态待处理
    status: '0',
  }
}));
const undoTableTotal = ref(0);
const undoTableData = ref([]);
const undoTableLoading = ref(false);
const undoColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "退货单号", width: "130", field: "code", align: "center", filterType: "input" },
  { title: "退货时间", width: "130", field: "backTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: "产品编码", width: "130", field: "commodityCode", align: "center", filterType: "input" },
  { title: "产品名称", width: "300", field: "commodityName", align: "center", filterType: "input" },
  { title: "订单编号", width: "130", field: "saleOrderNo", align: "center", filterType: "input" },
  { title: "退货数量", width: "100", field: "quantity", align: "center", },
  { title: "待处理数量", width: "100", field: "undoQuantity", align: "center", },
  { title: "已处理数量", width: "100", field: "doneQuantity", align: "center", },
  { title: "报废数量", width: "100", field: "scrapQuantity", align: "center", },
  { title: "重新入库数量", width: "100", field: "reInventoryQuantity", align: "center", },
  { title: "退货重发数量", width: "100", field: "reDeliveryQuantity", align: "center", },
  { title: "操作", fixed: 'right', width: "260", field: "make", align: "center",},
]);

const { doneQueryParams } = toRefs(reactive({
  doneQueryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    saleOrderNo: undefined,
    commodityCode: undefined,
    commodityName: undefined,
    //状态已处理
    status: '1',
  }
}));
const doneTableTotal = ref(0);
const doneTableData = ref([]);
const doneTableLoading = ref(false);
const doneColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "退货单号", width: "130", field: "code", align: "center", filterType: "input" },
  { title: "退货时间", width: "130", field: "backTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: "产品编码", width: "130", field: "commodityCode", align: "center", filterType: "input" },
  { title: "产品名称", width: "300", field: "commodityName", align: "center", filterType: "input" },
  { title: "订单编号", width: "130", field: "saleOrderNo", align: "center", filterType: "input" },
  { title: "退货数量", width: "100", field: "quantity", align: "center", },
  { title: "待处理数量", width: "100", field: "undoQuantity", align: "center", },
  { title: "已处理数量", width: "100", field: "doneQuantity", align: "center", },
  { title: "报废数量", width: "100", field: "scrapQuantity", align: "center", },
  { title: "重新入库数量", width: "100", field: "reInventoryQuantity", align: "center", },
  { title: "退货重发数量", width: "100", field: "reDeliveryQuantity", align: "center", },
  { title: "操作", fixed: 'right', width: "160", field: "make", align: "center",},
]);
const handleRecordVisible = ref(false);
const scrapVisible = ref(false);
const reDeliveryVisible = ref(false);
const reInventoryVisible = ref(false);
const printRef = ref();

const selectedBackOrder = reactive({
  value: {
    id: undefined,
    code: undefined,
    commodityCode: undefined,
    commodityId: undefined,
  }
});
const XTableRef = ref();
const XTableRef2 = ref();
const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()
const resetSelectedBackOrder = () => {
  selectedBackOrder.value = {
    id: undefined,
    code: undefined,
    commodityCode: undefined,
  }
}

const calcMaxReDeliveryQuantity = () => {
  let quantity = selectedBackOrder.value.quantity - selectedBackOrder.value.reDeliveryQuantity;
  if (quantity > 0) {
    return quantity;
  } else {
    return 0;
  }
}

const openHandleRecord = (backOrder) => {
  handleRecordVisible.value = true;
  selectedBackOrder.value = backOrder;
}

const closeHandleRecord = () => {
  handleRecordVisible.value = false;
  resetSelectedBackOrder();
}

const openScrap = (backOrder) => {
  scrapVisible.value = true;
  selectedBackOrder.value = backOrder;
}

const closeScrap = () => {
  scrapVisible.value = false;
  resetSelectedBackOrder();
  refreshUndoTableData();
}

const openReInventory = (backOrder) => {
  reInventoryVisible.value = true;
  selectedBackOrder.value = backOrder;
}

const closeReInventory = () => {
  reInventoryVisible.value = false;
  resetSelectedBackOrder();
  refreshUndoTableData();
}

const openReDelivery = (backOrder) => {
  reDeliveryVisible.value = true;
  selectedBackOrder.value = backOrder;
}

const cancleReDelivery = () => {
  reDeliveryVisible.value = false;
}

const submitReDelivery = (val) => {
  reDeliveryVisible.value = false;
  resetSelectedBackOrder();
  if (tabValue.value === "未完成") {
    refreshUndoTableData();
  } else {
    refreshDoneTableData();
  }
  ElMessageBox.confirm(
    '是否打印送货单',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    }
  )
    .then(() => {
      printRef.value.doBackPrint(val);
    });
}

const printBackHandleDelivery = (val) => {
  printRef.value.doBackPrint(val);
}

const tabChange = (val) => {
  if (val.props.name === "未完成") {
    refreshUndoTableData()
  }else if (val.props.name === "已完成") {
    refreshDoneTableData()
  }
}


const undoSearchChange = (param) => {
  undoQueryParams.value = {
    ...param,
    //状态待处理
    status: '0',
  }
  refreshUndoTableData();
}

const refreshUndoTableData = () => {
  console.log(undoQueryParams);
  undoTableLoading.value = true;
  queryPageContainsBackHandleData(undoQueryParams.value)
    .then((res) => {
      undoTableData.value = res.rows;
      undoTableTotal.value = res.total;
    })
    .finally(() => {
      undoTableLoading.value = false;
    })
}

const doneSearchChange = (param) => {
  doneQueryParams.value = {
    ...param,
    //状态已处理
    status: '1',
  }
  refreshDoneTableData();
}

const refreshDoneTableData = () => {
  console.log(doneQueryParams);
  doneTableLoading.value = true;
  queryPageContainsBackHandleData(doneQueryParams.value)
    .then((res) => {
      doneTableData.value = res.rows;
      doneTableTotal.value = res.total;
    })
    .finally(() => {
      doneTableLoading.value = false;
    })
}

const inventoryCheck = ref(false);
const inventoryRes = ref([]);

const checkInventory = async (fn) => {
  // 查询是否存在盘点中产品
  let query = {
    pageNum: 1,
    pageSize: 20,
    IdList: selectedBackOrder.value.commodityId,
    status: '1'
  }
  let bol = false
  const res = await listCommodityInventory(query);
  if (res.rows && res.rows.length > 0) {
    inventoryRes.value = res.rows;
    inventoryCheck.value = true;
    // return;
    bol = true
  }
  fn && fn(bol)
}
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = decryptBase64ByStr(newVal)
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      let tab = params.tab ? params.tab : '未完成';
      tabValue.value = tab
      let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
      if (tab === '未完成') {
        undoQueryParams.value.code = params.bizNo
        setTimeout(() => {
          XTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === '已完成') {
        doneQueryParams.value.orderCode = params.bizNo
        setTimeout(() => {
          XTableRef2.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
    refreshUndoTableData();
});
</script>

<style scoped>
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
</style>

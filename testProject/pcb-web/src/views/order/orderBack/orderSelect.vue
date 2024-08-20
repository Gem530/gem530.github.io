<template>
    <el-container>
      <el-aside width="300px" style="padding: 0 0; background-color: #fff; margin-right: 5px">
        <div style="font-size:12px; font-weight:600; line-height: 20px; background-color: rgb(238, 241, 246); text-align: center">已选订单</div>
        <XTable height="400px"
                :pageShow="false"
                :data="selectedTableData"
                :columnList="selectedColumnList"
                ref="XTableRef"
                border
                :column-config="{ resizable: true }"
                :row-config="{ keyField:'id' }"
                :loading="tableLoading"
                :show-header="false"
        >
          <template #default-make="scope">
            <el-button link type="primary" @click="removeSelected(scope.row)">X</el-button>
          </template>
        </XTable>
      </el-aside>
      <el-main style="margin-left: 5px; padding: 0">
        <XTable toolId="orderSelectTable" height="360px"
                :pageShow="true" v-model:page-size="orderQuery.pageSize"
                v-model:current-page="orderQuery.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="tableData"
                :columnList="columnList"
                show-footer="true"
                ref="orderSelectTableRef"
                border
                :column-config="{ resizable: true }"
                :checkbox-config="{ reserve: true }"
                :row-config="{ keyField:'id' }"
                :loading="tableLoading"
                @checkbox-all="orderSelect"
                @checkbox-change="orderSelect"
                @searchChange="searchChange"
        >
          <template #default-orderType="scope">
            <span>{{resDictData.order_type.find(item => item.value === scope.row.orderType).label}}</span>
          </template>
          <template #default-model="scope">
            <span>{{resDictData.order_model.find(item => item.value === scope.row.model).label}}</span>
          </template>
        </XTable>
      </el-main>
    </el-container>
    <div class="text-center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
</template>

<script setup name="backOrderAdd">

import { listOrderContainsBackData } from "@/api/order/directOrder/index";
import { defineProps } from "vue";

const emit = defineEmits(['close', 'confirm']);

const props = defineProps({
  customerId: {
    required: true,
    type: String,
  },
  onClose: {
    required: true,
    type: Function,
  },
  selectedOrder: {
    required: false,
    type: Array,
  }
})

const { orderQuery } = toRefs(reactive({
  orderQuery: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    name: undefined,
    cusId: undefined,
  },
}))

const resDictData = reactive({
  //批量/样品
  order_model: [{
    value: '1',
    label: '批量',
  },{
    value: '2',
    label: '样品',
  }],
  //订单类型
  order_type: [{
    value: '1',
    label: '新单',
  },{
    value: '2',
    label: '返单',
  },{
    value: '3',
    label: '返单有改',
  },{
    value: '4',
    label: '样转批',
  }],
})

const orderSelectTableRef = ref();
const selectedTableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);
const tableData = ref([]);
const columnList = ref([
  { type: "checkbox", fixed: 'left', width: "60", align: "center" },
  { width: "110", fixed: 'left', title: "产品编码", field: "commodityCode", align: "center", filterType: "input", filterParam: { placeholder: "请输入产品编码" } },
  { width: "120", title: "订单编号", field: "code", align: "center", filterType: "input", },
  { width: "150", title: "产品名称", field: "commodityName", align: "center", filterType: "input", filterParam: { placeholder: "请输入产品名称" } },
  { width: "110", title: "客户物料编码", field: "materialNumber", align: "center", filterType: "input", filterParam: { placeholder: "请输入客户物料编码" } },
  { width: "120", title: "下单时间", field: "placeOrderTime", align: "center" },
  { width: "60", title: "新/返", field: "orderType", align: "center", filterType: "radioButton", filterParam: { placeholder: "请选择新/返" }, filterData: () => resDictData.order_type, filterCustom: { label: "label", value: "value" } },
  { width: "60", title: "批/样", field: "model", align: "center", filterType: "radioButton", filterParam: { placeholder: "请选择批/样" }, filterData: () => resDictData.order_model, filterCustom: { label: "label", value: "value" } },
  { width: "100", title: "产品PO", field: "customerPo", align: "center", filterType: "input", filterParam: { placeholder: "请输入产品PO" } },
  { width: "50", title: "板材", field: "materialQuality", align: "center", filterType: "input", },
  { width: "60", title: "订货数量(pcs)", field: "quantity", align: "center" },
  { width: "60", title: "可退货数量(pcs)", field: "canReturnQuantity", align: "center", },
  { width: "60", title: "发货数量(pcs)", field: "deliveryQuantity", align: "center", },
  { width: "60", title: "退货数量(pcs)", field: "alreadyReturnQuantity", align: "center", },
]);
const selectedColumnList = ref([
  { title: "序号", width: "30", type: "seq", filed: "index", align: "center" },
  { title: "销售单号", width: "110", field: "code", align: "center"},
  { title: "产品编码", width: "110", field: "commodityCode", align: "center"},
  { title: "操作", width: "30", field: "make", align: "center"},
]);

/**
 * 移除已选订单
 */
const removeSelected = (data) => {
  let index = selectedTableData.value.indexOf(data);
  if (index > -1) {
    selectedTableData.value.splice(index, 1);
  }
  orderSelectTableRef.value.xTableRef.setCheckboxRow(data, false);
}

const submitForm = () => {
  emit('confirm', selectedTableData.value);
}

const cancel = () => {
  emit('close');
}

/**
 * 选择产品
 */
const orderSelect = () => {
  const $table = orderSelectTableRef.value.xTableRef
  if ($table) {
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    selectedTableData.value = selectRecords.map(item => item);
  }
}


const loadOrderData = () => {
  tableLoading.value = true;
  listOrderContainsBackData(orderQuery.value)
    .then(res => {
      tableData.value = res.rows;
      total.value = res.total;
    })
    .finally(() => {
      tableLoading.value = false;
    })
}

const searchChange = (param) => {
  orderQuery.value = {...param, cusId: props.customerId}
  loadOrderData();
}

/**
 * 编辑数据重新build
 */
const editDataRebuild = () => {
  //重新回显已经勾选的数据
  const $table = orderSelectTableRef.value.xTableRef
  if ($table) {
    $table.setCheckboxRow(props.selectedOrder, true);
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    selectedTableData.value = selectRecords.map(item => item);
  }

}

onMounted(() => {
  orderQuery.value.cusId = props.customerId;
  //加载订单数据
  loadOrderData();
  //编辑数据重新build
  editDataRebuild();
});

</script>

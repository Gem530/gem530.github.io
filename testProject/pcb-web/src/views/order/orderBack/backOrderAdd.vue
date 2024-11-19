<template>
  <div class="ptable-card">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      :rules="formRule"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="下单客户" prop="customerId">
            <el-select v-model="formData.customerId" placeholder="请选择" style="width: 100%" @change="customerChange"
                       :loading="customerLoading" loading-text="加载客户列表中" filterable default-first-option>
              <el-option v-for="cus in customerList" :label="cus.customerCode" :value="cus.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退货时间" style="width: 100%" prop="backTime">
            <el-date-picker value-format="YYYY-MM-DD HH:mm:ss"
              v-model="formData.backTime"
              type="datetime"
              placeholder="请选择"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: left">
        <el-button type="primary" @click="openSelectOrder">选择订单</el-button>
        <el-button @click="clearAddTable">清空</el-button>
      </el-col>
    </el-row>
    <XTable toolId="orderBackAddTable" height="100%" class="ptable-content"
            :page-show="false"
            :data="addTableData"
            :columnList="addColumnList"
            ref="addOrderTableRef"
            border
            :column-config="{ resizable: true }"
            :edit-config="{trigger: 'click', enabled: true, mode: 'cell'}"
            :edit-rules="tableRule"
            :row-config="{ keyField:'id' }"
            :loading="addTableLoading"
    >
      <template #default-make="scope">
        <el-button link type="primary" @click="onDelete(scope.row.id)">删除</el-button>
      </template>
      <template #edit-returnQuantity="scope">
        <el-input-number style="width: 100%" :controls="false" v-model="scope.row.returnQuantity"  :min="0" :precision="0"/>
      </template>
      <template #edit-reason="scope">
        <el-input v-model="scope.row.reason" :maxlength="1000"/>
      </template>
    </XTable>
    <div class="text-right" style="margin-top: 10px">
      <el-button type="primary" @click="submitForm(formRef)" :loading="submitLoading">确 定</el-button>
      <el-button @click="cancel" :loading="submitLoading">取 消</el-button>
    </div>
  </div>

  <el-dialog
    v-model="orderSelectVisible"
    title="选择订单"
    width="80%"
    append-to-body
    destroy-on-close
  >
    <OrderSelect :customerId="formData.customerId" @close="closeSelectOrder"
                 @confirm="confirmOrder" :selectedOrder="addTableData"/>
  </el-dialog>
</template>

<script setup name="backOrderAdd"  lang="ts">

import { saveBackOrder } from "@/api/order/orderBack";
import { parseTime } from "@/utils/ruoyi";
import { getListCustomer } from '@/api/basedata/customer/index';
import OrderSelect from "@/views/order/orderBack/orderSelect.vue";
import { VXETable } from "vxe-table";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const emit = defineEmits(['close', 'submit']);

const { formData, formRule, tableRule } = toRefs(reactive({
  formData: {
    customerId: undefined,
    backTime: parseTime(new Date()),
  },
  formRule: {
    customerId: [
      { required: true, message: '下单客户不能为空', trigger: 'change' },
    ],
    backTime: [
      { required: true, message: '下单时间不能为空', trigger: 'change' },
    ],
  },
  tableRule: {
    returnQuantity: [
      { required: true, message: '退货数量不能为空', trigger: 'blur',},
      { validator: 'test', trigger: 'change',  message: "退货数量不能为空"},
    ],
  }
}))
VXETable.validators.add('test', {
  cellValidatorMethod({cellValue}) {
    if (cellValue === 0) {
      return new Error('退货数量不能为0');
    }
  }
})

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

const addOrderTableRef = ref();
const formRef = ref();
const addTableLoading = ref(false);
const customerLoading = ref(false);
const submitLoading = ref(false);
const orderSelectVisible = ref(false);
const addTableData = ref([]);
const addColumnList = ref([
  { title: "序号", fixed: 'left', width: "50", type: "seq", filed: "index", align: "center" },
  { width: "110", fixed: 'left', title: "产品编码", field: "commodityCode", align: "center", filterType: "input", filterParam: { placeholder: "请输入产品编码" } },
  { width: "120", title: "订单编号", field: "code", align: "center", filterType: "input", },
  { width: "150", title: "产品名称", field: "commodityName", align: "center", filterType: "input", filterParam: { placeholder: "请输入产品名称" } },
  { width: "110", title: "客户物料编码", field: "materialNumber", align: "center", filterType: "input", filterParam: { placeholder: "请输入客户物料编码" } },
  { width: "100", title: "产品PO", field: "customerPo", align: "center", filterType: "input", filterParam: { placeholder: "请输入产品PO" } },
  { width: "60", title: "订货数量(pcs)", field: "quantity", align: "center" },
  { width: "60", title: "可退货数量(pcs)", field: "canReturnQuantity", align: "center", },
  { width: "60", title: "发货数量(pcs)", field: "deliveryQuantity", align: "center", },
  { width: "150", title: "退货数量(pcs)", field: "returnQuantity", align: "center", editRender: {placeholder: '请点击输入'}},
  { width: "300", title: "退货原因", field: "reason", align: "center", editRender: {placeholder: '请点击输入'}},
  { title: "操作", fixed: 'right', width: "100", field: "make", align: "center", filterType: "input" },
]);
const customerList = ref([]);

const clearAddTable = () => {

}

const customerChange = () => {
  addTableData.value = [];
}

const onDelete = (rowId) => {
  addTableData.value = addTableData.value.filter(item => item.id !== rowId);
}

const validateShipOver = (tabData) => {
  let flag = true;
  tabData.forEach((item) => {
    if (item.returnQuantity > item.canReturnQuantity) {
      flag = false;
      return;
    }
  });
  return flag;
}

const submitForm = async (formEl) => {
  let err = false;
  if (addTableData.value.length === 0) {
    ElMessage({
      type: 'error',
      message: '请至少选择一个订单',
    });
    return;
  }
  formEl.validate((valid) => {
    if (!valid) {
      err = true;
    }
  })
  const $table = addOrderTableRef.value.xTableRef;
  if ($table) {
    if (!validateShipOver(addTableData.value)) {
        await proxy?.$modal.confirm("退货数量大于可退货数量，是否仍然退货？")
    }

    $table.validate(true)
      .then(res => {
        if (res) {
          err = true;
        }
        if (!err) {
          //校验通过，保存退货数据
          //需要将id转换为saleOrderId供后端接收
          let saveList = addTableData.value.map(item => {
            return {
              reason: item.reason,
              saleOrderId: item.id,
              returnQuantity: item.returnQuantity
            }
          })
          submitLoading.value = true;
          saveBackOrder({
            backTime: formData.value.backTime,
            cusId: formData.value.customerId,
            saveList: saveList,
          }).then(() => {
            emit('submit');
          }).finally(() => {
            submitLoading.value = false;
          })
        }
      });
  }
}
const cancel = () => {
  emit('close');
}

const closeSelectOrder = () => {
  orderSelectVisible.value = false;
}

const confirmOrder = (val) => {
  val.forEach(item => {
    let find = addTableData.value.find(o => o.id === item.id);
    item.returnQuantity = find ? find.returnQuantity : undefined;
    item.reason = find ? find.reason : undefined;
  })
  addTableData.value = JSON.parse(JSON.stringify(val));
  orderSelectVisible.value = false;
}

const openSelectOrder = () => {
  if (formData.value.customerId) {
    orderSelectVisible.value = true;
  } else {
    ElMessage({
      type: 'error',
      message: '请选择客户',
    })
  }
}

const loadCustomer = () => {
  customerLoading.value = true;
  getListCustomer()
    .then(res => {
      customerList.value = res.data;
    })
    .finally(() => {
      customerLoading.value = false;
    })
}

onMounted(() => {
  //加载客户清单
  loadCustomer();
});
</script>

<style scoped>
  /deep/ .el-input__wrapper {
    width: 100%;
  }
</style>

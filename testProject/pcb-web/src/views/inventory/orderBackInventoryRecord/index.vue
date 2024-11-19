<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="处理数量" prop="handleQuantity">
            <el-input v-model="queryParams.handleQuantity" placeholder="请输入处理数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="操作人" prop="operatorId">
            <el-input v-model="queryParams.operatorId" placeholder="请输入操作人" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="订单详情id" prop="saleOrderDetailId">
            <el-input v-model="queryParams.saleOrderDetailId" placeholder="请输入订单详情id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="报废责任人" prop="scrapUser">
            <el-input v-model="queryParams.scrapUser" placeholder="请输入报废责任人" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="报废数量" prop="scrapOutQuantity">
            <el-input v-model="queryParams.scrapOutQuantity" placeholder="请输入报废数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="退货单id" prop="returnOrderId">
            <el-input v-model="queryParams.returnOrderId" placeholder="请输入退货单id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <XTable v-loading="loading" :columnList="columnList" :data="orderBackInventoryRecordList" class="xtable-content" height="100%"
      v-model:page-size="queryParams.pageSize"
      v-model:current-page="queryParams.pageNum"
      :page-params="{ perfect: true, total: total }"
      @search-change="getList"
      @checkbox-change="handleSelectionChange" ref="xtableRef"
      @checkbox-all="handleSelectionChange">
        <template #default-make="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" ></el-button>
          </el-tooltip>
        </template>
      </XTable>
    </el-card>
    <!-- 添加或修改退货产品处理记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="orderBackInventoryRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="处理数量" prop="handleQuantity">
          <el-input v-model="form.handleQuantity" placeholder="请输入处理数量" />
        </el-form-item>
        <el-form-item label="操作人" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="订单详情id" prop="saleOrderDetailId">
          <el-input v-model="form.saleOrderDetailId" placeholder="请输入订单详情id" />
        </el-form-item>
        <el-form-item label="报废责任人" prop="scrapUser">
          <el-input v-model="form.scrapUser" placeholder="请输入报废责任人" />
        </el-form-item>
        <el-form-item label="报废数量" prop="scrapOutQuantity">
          <el-input v-model="form.scrapOutQuantity" placeholder="请输入报废数量" />
        </el-form-item>
        <el-form-item label="退货单id" prop="returnOrderId">
          <el-input v-model="form.returnOrderId" placeholder="请输入退货单id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="OrderBackInventoryRecord" lang="ts">
import { listOrderBackInventoryRecord, getOrderBackInventoryRecord, delOrderBackInventoryRecord, addOrderBackInventoryRecord, updateOrderBackInventoryRecord } from '@/api/inventory/orderBackInventoryRecord';
import { OrderBackInventoryRecordVO, OrderBackInventoryRecordQuery, OrderBackInventoryRecordForm } from '@/api/inventory/orderBackInventoryRecord/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const xtableRef = ref()
const orderBackInventoryRecordList = ref<OrderBackInventoryRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const orderBackInventoryRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: OrderBackInventoryRecordForm = {
  id: undefined,
  inventoryNo: undefined,
  sourceType: undefined,
  handleQuantity: undefined,
  operatorId: undefined,
  saleOrderDetailId: undefined,
  positionMes: undefined,
  scrapNodeName: undefined,
  scrapUser: undefined,
  scrapOutQuantity: undefined,
  status: undefined,
  returnOrderId: undefined,
  remark: undefined
}
const data = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    inventoryNo: undefined,
    sourceType: undefined,
    handleQuantity: undefined,
    operatorId: undefined,
    saleOrderDetailId: undefined,
    positionMes: undefined,
    scrapNodeName: undefined,
    scrapUser: undefined,
    scrapOutQuantity: undefined,
    status: undefined,
    returnOrderId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    inventoryNo: [
      { required: true, message: "出库编码不能为空", trigger: "blur" }
    ],
    sourceType: [
      { required: true, message: "出库类型不能为空", trigger: "change" }
    ],
    handleQuantity: [
      { required: true, message: "处理数量不能为空", trigger: "blur" }
    ],
    operatorId: [
      { required: true, message: "操作人不能为空", trigger: "blur" }
    ],
    saleOrderDetailId: [
      { required: true, message: "订单详情id不能为空", trigger: "blur" }
    ],
    positionMes: [
      { required: true, message: "库位信息不能为空", trigger: "blur" }
    ],
    scrapNodeName: [
      { required: true, message: "报废工序名不能为空", trigger: "blur" }
    ],
    scrapUser: [
      { required: true, message: "报废责任人不能为空", trigger: "blur" }
    ],
    scrapOutQuantity: [
      { required: true, message: "报废数量不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "0正常品 1报废 2重新发货不能为空", trigger: "change" }
    ],
    returnOrderId: [
      { required: true, message: "退货单id不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const columnList = ref([
{ width: '55',type: 'checkbox',align: 'center',  },
{ title: '${comment}',field: 'id',align: 'center',  },
{ title: '出库编码',field: 'inventoryNo',align: 'center',  },
{ title: '出库类型',field: 'sourceType',align: 'center',  },
{ title: '处理数量',field: 'handleQuantity',align: 'center',  },
{ title: '操作人',field: 'operatorId',align: 'center',  },
{ title: '订单详情id',field: 'saleOrderDetailId',align: 'center',  },
{ title: '库位信息',field: 'positionMes',align: 'center',  },
{ title: '报废工序名',field: 'scrapNodeName',align: 'center',  },
{ title: '报废责任人',field: 'scrapUser',align: 'center',  },
{ title: '报废数量',field: 'scrapOutQuantity',align: 'center',  },
{ title: '0正常品 1报废 2重新发货',field: 'status',align: 'center',  },
{ title: '退货单id',field: 'returnOrderId',align: 'center',  },
{ title: '备注',field: 'remark',align: 'center',  },
{ title: '操作',field: 'make',align: 'center',  },
]);

/** 查询退货产品处理记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrderBackInventoryRecord(queryParams.value);
  orderBackInventoryRecordList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  orderBackInventoryRecordFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: OrderBackInventoryRecordVO[]) => {
  // ids.value = selection.map(item => item.id);
  // single.value = selection.length != 1;
  // multiple.value = !selection.length;
  const $table = xtableRef.value.xTableRef
  if ($table) {
    const selection = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()) // 获取选择的行数据列表
    ids.value = selection.map((item: any) => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加退货产品处理记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderBackInventoryRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getOrderBackInventoryRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改退货产品处理记录";
}

/** 提交按钮 */
const submitForm = () => {
  orderBackInventoryRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrderBackInventoryRecord(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addOrderBackInventoryRecord(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: OrderBackInventoryRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除退货产品处理记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delOrderBackInventoryRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/orderBackInventoryRecord/export', {
    ...queryParams.value
  }, `orderBackInventoryRecord_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

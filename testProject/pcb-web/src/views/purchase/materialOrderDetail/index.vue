<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="物料ID" prop="rawMaterialId">
            <el-input v-model="queryParams.rawMaterialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="采购数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入采购数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="申请明细ID" prop="applyDetailId">
            <el-input v-model="queryParams.applyDetailId" placeholder="请输入申请明细ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商ID" prop="supplierId">
            <el-input v-model="queryParams.supplierId" placeholder="请输入供应商ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="受理人ID" prop="handleUserId">
            <el-input v-model="queryParams.handleUserId" placeholder="请输入受理人ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="采购单价" prop="price">
            <el-input v-model="queryParams.price" placeholder="请输入采购单价" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="采购总价" prop="totalPrice">
            <el-input v-model="queryParams.totalPrice" placeholder="请输入采购总价" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="入库数量" prop="inventoryQuantity">
            <el-input v-model="queryParams.inventoryQuantity" placeholder="请输入入库数量" clearable @keyup.enter="handleQuery" />
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

      <XTable v-loading="loading" :columnList="columnList" :data="materialOrderDetailList" class="xtable-content" height="100%"
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
    <!-- 添加或修改采购明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="materialOrderDetailFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="采购数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入采购数量" />
        </el-form-item>
        <el-form-item label="申请明细ID" prop="applyDetailId">
          <el-input v-model="form.applyDetailId" placeholder="请输入申请明细ID" />
        </el-form-item>
        <el-form-item label="供应商ID" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商ID" />
        </el-form-item>
        <el-form-item label="受理人ID" prop="handleUserId">
          <el-input v-model="form.handleUserId" placeholder="请输入受理人ID" />
        </el-form-item>
        <el-form-item label="采购单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入采购单价" />
        </el-form-item>
        <el-form-item label="采购总价" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入采购总价" />
        </el-form-item>
        <el-form-item label="入库数量" prop="inventoryQuantity">
          <el-input v-model="form.inventoryQuantity" placeholder="请输入入库数量" />
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

<script setup name="MaterialOrderDetail" lang="ts">
import { listMaterialOrderDetail, getMaterialOrderDetail, delMaterialOrderDetail, addMaterialOrderDetail, updateMaterialOrderDetail } from '@/api/purchase/materialOrderDetail';
import { MaterialOrderDetailVO, MaterialOrderDetailQuery, MaterialOrderDetailForm } from '@/api/purchase/materialOrderDetail/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const xtableRef = ref()
const materialOrderDetailList = ref<MaterialOrderDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialOrderDetailFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MaterialOrderDetailForm = {
  id: undefined,
  rawMaterialId: undefined,
  quantity: undefined,
  applyDetailId: undefined,
  supplierId: undefined,
  deliverTime: undefined,
  handleUserId: undefined,
  handleUserName: undefined,
  price: undefined,
  totalPrice: undefined,
  inventoryQuantity: undefined,
  status: undefined
}
const data = reactive<PageData<MaterialOrderDetailForm, MaterialOrderDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    quantity: undefined,
    applyDetailId: undefined,
    supplierId: undefined,
    deliverTime: undefined,
    handleUserId: undefined,
    handleUserName: undefined,
    price: undefined,
    totalPrice: undefined,
    inventoryQuantity: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "采购数量不能为空", trigger: "blur" }
    ],
    applyDetailId: [
      { required: true, message: "申请明细ID不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商ID不能为空", trigger: "blur" }
    ],
    deliverTime: [
      { required: true, message: "要求交期不能为空", trigger: "blur" }
    ],
    handleUserId: [
      { required: true, message: "受理人ID不能为空", trigger: "blur" }
    ],
    handleUserName: [
      { required: true, message: "受理人名称不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "采购单价不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "采购总价不能为空", trigger: "blur" }
    ],
    inventoryQuantity: [
      { required: true, message: "入库数量不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const columnList = ref([
{ width: '55',type: 'checkbox',align: 'center',  },
{ title: '${comment}',field: 'id',align: 'center',  },
{ title: '物料ID',field: 'rawMaterialId',align: 'center',  },
{ title: '采购数量',field: 'quantity',align: 'center',  },
{ title: '申请明细ID',field: 'applyDetailId',align: 'center',  },
{ title: '供应商ID',field: 'supplierId',align: 'center',  },
{ title: '要求交期',field: 'deliverTime',align: 'center',  },
{ title: '受理人ID',field: 'handleUserId',align: 'center',  },
{ title: '受理人名称',field: 'handleUserName',align: 'center',  },
{ title: '采购单价',field: 'price',align: 'center',  },
{ title: '采购总价',field: 'totalPrice',align: 'center',  },
{ title: '入库数量',field: 'inventoryQuantity',align: 'center',  },
{ title: '状态',field: 'status',align: 'center',  },
{ title: '操作',field: 'make',align: 'center',  },
]);
/** 查询采购明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialOrderDetail(queryParams.value);
  materialOrderDetailList.value = res.rows;
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
  materialOrderDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialOrderDetailVO[]) => {
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
  dialog.title = "添加采购明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialOrderDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改采购明细";
}

/** 提交按钮 */
const submitForm = () => {
  materialOrderDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialOrderDetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialOrderDetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialOrderDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除采购明细编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialOrderDetail(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialOrderDetail/export', {
    ...queryParams.value
  }, `materialOrderDetail_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

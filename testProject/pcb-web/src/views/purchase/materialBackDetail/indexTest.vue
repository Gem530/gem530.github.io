<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="物料ID" prop="rawMaterialId">
            <el-input v-model="queryParams.rawMaterialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="库存ID" prop="storageId">
            <el-input v-model="queryParams.storageId" placeholder="请输入库存ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model="queryParams.price" placeholder="请输入单价" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商ID" prop="supplierId">
            <el-input v-model="queryParams.supplierId" placeholder="请输入供应商ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="采购明细ID" prop="materialOrderDetailId">
            <el-input v-model="queryParams.materialOrderDetailId" placeholder="请输入采购明细ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="退货人ID" prop="backUserId">
            <el-input v-model="queryParams.backUserId" placeholder="请输入退货人ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="审核人ID" prop="auditUserId">
            <el-input v-model="queryParams.auditUserId" placeholder="请输入审核人ID" clearable @keyup.enter="handleQuery" />
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

      <el-table v-loading="loading" :data="materialBackDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="创建部门名称" align="center" prop="createDeptName" />
        <el-table-column label="创建者名称" align="center" prop="createByName" />
        <el-table-column label="更新者名称" align="center" prop="updateByName" />
        <el-table-column label="物料ID" align="center" prop="rawMaterialId" />
        <el-table-column label="库存ID" align="center" prop="storageId" />
        <el-table-column label="数量" align="center" prop="quantity" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="单价" align="center" prop="price" />
        <el-table-column label="供应商ID" align="center" prop="supplierId" />
        <el-table-column label="采购明细ID" align="center" prop="materialOrderDetailId" />
        <el-table-column label="类型" align="center" prop="type" />
        <el-table-column label="退货人ID" align="center" prop="backUserId" />
        <el-table-column label="退货人名称" align="center" prop="backUserName" />
        <el-table-column label="退货时间" align="center" prop="backTime" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="审核人ID" align="center" prop="auditUserId" />
        <el-table-column label="审核人名称" align="center" prop="auditUserName" />
        <el-table-column label="审核时间" align="center" prop="ausitTime" />
        <el-table-column label="退货单号" align="center" prop="code" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改物料退货明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="materialBackDetailFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="库存ID" prop="storageId">
          <el-input v-model="form.storageId" placeholder="请输入库存ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="供应商ID" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商ID" />
        </el-form-item>
        <el-form-item label="采购明细ID" prop="materialOrderDetailId">
          <el-input v-model="form.materialOrderDetailId" placeholder="请输入采购明细ID" />
        </el-form-item>
        <el-form-item label="退货人ID" prop="backUserId">
          <el-input v-model="form.backUserId" placeholder="请输入退货人ID" />
        </el-form-item>
        <el-form-item label="审核人ID" prop="auditUserId">
          <el-input v-model="form.auditUserId" placeholder="请输入审核人ID" />
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

<script setup name="MaterialBackDetail" lang="ts">
import { listMaterialBackDetail, getMaterialBackDetail, delMaterialBackDetail, addMaterialBackDetail, updateMaterialBackDetail } from '@/api/purchase/materialBackDetail';
import { MaterialBackDetailVO, MaterialBackDetailQuery, MaterialBackDetailForm } from '@/api/purchase/materialBackDetail/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const materialBackDetailList = ref<MaterialBackDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialBackDetailFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MaterialBackDetailForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  rawMaterialId: undefined,
  storageId: undefined,
  quantity: undefined,
  unit: undefined,
  price: undefined,
  supplierId: undefined,
  materialOrderDetailId: undefined,
  type: undefined,
  backUserId: undefined,
  backUserName: undefined,
  backTime: undefined,
  remark: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  ausitTime: undefined,
  code: undefined
}
const data = reactive<PageData<MaterialBackDetailForm, MaterialBackDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    rawMaterialId: undefined,
    storageId: undefined,
    quantity: undefined,
    unit: undefined,
    price: undefined,
    supplierId: undefined,
    materialOrderDetailId: undefined,
    type: undefined,
    backUserId: undefined,
    backUserName: undefined,
    backTime: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    ausitTime: undefined,
    code: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    createDeptName: [
      { required: true, message: "创建部门名称不能为空", trigger: "blur" }
    ],
    createByName: [
      { required: true, message: "创建者名称不能为空", trigger: "blur" }
    ],
    updateByName: [
      { required: true, message: "更新者名称不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    storageId: [
      { required: true, message: "库存ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商ID不能为空", trigger: "blur" }
    ],
    materialOrderDetailId: [
      { required: true, message: "采购明细ID不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    backUserId: [
      { required: true, message: "退货人ID不能为空", trigger: "blur" }
    ],
    backUserName: [
      { required: true, message: "退货人名称不能为空", trigger: "blur" }
    ],
    backTime: [
      { required: true, message: "退货时间不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    auditUserId: [
      { required: true, message: "审核人ID不能为空", trigger: "blur" }
    ],
    auditUserName: [
      { required: true, message: "审核人名称不能为空", trigger: "blur" }
    ],
    ausitTime: [
      { required: true, message: "审核时间不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "退货单号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询物料退货明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialBackDetail(queryParams.value);
  materialBackDetailList.value = res.rows;
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
  materialBackDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialBackDetailVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物料退货明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialBackDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialBackDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改物料退货明细";
}

/** 提交按钮 */
const submitForm = () => {
  materialBackDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialBackDetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialBackDetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialBackDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物料退货明细编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialBackDetail(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/materialBackDetail/export', {
    ...queryParams.value
  }, `materialBackDetail_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

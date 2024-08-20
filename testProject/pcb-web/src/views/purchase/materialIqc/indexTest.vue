<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="物料ID" prop="rawMaterialId">
            <el-input v-model="queryParams.rawMaterialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="采购明细id" prop="materialOrderDetailId">
            <el-input v-model="queryParams.materialOrderDetailId" placeholder="请输入采购明细id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="检测人ID" prop="checkUserId">
            <el-input v-model="queryParams.checkUserId" placeholder="请输入检测人ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="收货记录id" prop="materialReceiveId">
            <el-input v-model="queryParams.materialReceiveId" placeholder="请输入收货记录id" clearable @keyup.enter="handleQuery" />
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

      <el-table v-loading="loading" :data="materialIqcList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="创建部门名称" align="center" prop="createDeptName" />
        <el-table-column label="创建者名称" align="center" prop="createByName" />
        <el-table-column label="更新者名称" align="center" prop="updateByName" />
        <el-table-column label="物料ID" align="center" prop="rawMaterialId" />
        <el-table-column label="数量" align="center" prop="quantity" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="采购明细id" align="center" prop="materialOrderDetailId" />
        <el-table-column label="检测时间" align="center" prop="checkTime" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="处理方式" align="center" prop="handleType" />
        <el-table-column label="检测单号" align="center" prop="code" />
        <el-table-column label="检测人ID" align="center" prop="checkUserId" />
        <el-table-column label="检测人名称" align="center" prop="checkUserName" />
        <el-table-column label="收货记录id" align="center" prop="materialReceiveId" />
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
    <!-- 添加或修改IQC检测记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="materialIqcFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="采购明细id" prop="materialOrderDetailId">
          <el-input v-model="form.materialOrderDetailId" placeholder="请输入采购明细id" />
        </el-form-item>
        <el-form-item label="检测人ID" prop="checkUserId">
          <el-input v-model="form.checkUserId" placeholder="请输入检测人ID" />
        </el-form-item>
        <el-form-item label="收货记录id" prop="materialReceiveId">
          <el-input v-model="form.materialReceiveId" placeholder="请输入收货记录id" />
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

<script setup name="MaterialIqc" lang="ts">
import { listMaterialIqc, getMaterialIqc, delMaterialIqc, addMaterialIqc, updateMaterialIqc } from '@/api/purchase/materialIqc';
import { MaterialIqcVO, MaterialIqcQuery, MaterialIqcForm } from '@/api/purchase/materialIqc/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const materialIqcList = ref<MaterialIqcVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialIqcFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MaterialIqcForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  rawMaterialId: undefined,
  quantity: undefined,
  unit: undefined,
  materialOrderDetailId: undefined,
  checkTime: undefined,
  remark: undefined,
  handleType: undefined,
  code: undefined,
  checkUserId: undefined,
  checkUserName: undefined,
  materialReceiveId: undefined
}
const data = reactive<PageData<MaterialIqcForm, MaterialIqcQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    rawMaterialId: undefined,
    quantity: undefined,
    unit: undefined,
    materialOrderDetailId: undefined,
    checkTime: undefined,
    handleType: undefined,
    code: undefined,
    checkUserId: undefined,
    checkUserName: undefined,
    materialReceiveId: undefined,
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
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    materialOrderDetailId: [
      { required: true, message: "采购明细id不能为空", trigger: "blur" }
    ],
    checkTime: [
      { required: true, message: "检测时间不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    handleType: [
      { required: true, message: "处理方式不能为空", trigger: "change" }
    ],
    code: [
      { required: true, message: "检测单号不能为空", trigger: "blur" }
    ],
    checkUserId: [
      { required: true, message: "检测人ID不能为空", trigger: "blur" }
    ],
    checkUserName: [
      { required: true, message: "检测人名称不能为空", trigger: "blur" }
    ],
    materialReceiveId: [
      { required: true, message: "收货记录id不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询IQC检测记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialIqc(queryParams.value);
  materialIqcList.value = res.rows;
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
  materialIqcFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialIqcVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加IQC检测记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialIqcVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialIqc(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改IQC检测记录";
}

/** 提交按钮 */
const submitForm = () => {
  materialIqcFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialIqc(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialIqc(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialIqcVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除IQC检测记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialIqc(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/materialIqc/export', {
    ...queryParams.value
  }, `materialIqc_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

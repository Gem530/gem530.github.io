<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="物料ID" prop="rawMaterialId">
            <el-input v-model="queryParams.rawMaterialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="生产日期" prop="productionDate">
            <el-date-picker clearable
              v-model="queryParams.productionDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择生产日期"
            />
          </el-form-item>
          <el-form-item label="仓库ID" prop="storageId">
            <el-input v-model="queryParams.storageId" placeholder="请输入仓库ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="采购明细id" prop="materialOrderDetailId">
            <el-input v-model="queryParams.materialOrderDetailId" placeholder="请输入采购明细id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="收货人ID" prop="receiveUserId">
            <el-input v-model="queryParams.receiveUserId" placeholder="请输入收货人ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="保质期天数" prop="expirationDays">
            <el-input v-model="queryParams.expirationDays" placeholder="请输入保质期天数" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="过期日期" prop="expirationDate">
            <el-date-picker clearable
              v-model="queryParams.expirationDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择过期日期"
            />
          </el-form-item>
          <el-form-item label="IQC处理数量" prop="iqcQuantity">
            <el-input v-model="queryParams.iqcQuantity" placeholder="请输入IQC处理数量" clearable @keyup.enter="handleQuery" />
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

      <el-table v-loading="loading" :data="materialReceiveList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="创建部门名称" align="center" prop="createDeptName" />
        <el-table-column label="创建者名称" align="center" prop="createByName" />
        <el-table-column label="更新者名称" align="center" prop="updateByName" />
        <el-table-column label="物料ID" align="center" prop="rawMaterialId" />
        <el-table-column label="生产日期" align="center" prop="productionDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.productionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库ID" align="center" prop="storageId" />
        <el-table-column label="数量" align="center" prop="quantity" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="采购明细id" align="center" prop="materialOrderDetailId" />
        <el-table-column label="收货时间" align="center" prop="receiveTime" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="收货人ID" align="center" prop="receiveUserId" />
        <el-table-column label="收货人名称" align="center" prop="receiveUserName" />
        <el-table-column label="保质期天数" align="center" prop="expirationDays" />
        <el-table-column label="过期日期" align="center" prop="expirationDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货编号" align="center" prop="code" />
        <el-table-column label="IQC处理数量" align="center" prop="iqcQuantity" />
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
    <!-- 添加或修改采购收货记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="materialReceiveFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="生产日期" prop="productionDate">
          <el-date-picker clearable
            v-model="form.productionDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="仓库ID" prop="storageId">
          <el-input v-model="form.storageId" placeholder="请输入仓库ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="采购明细id" prop="materialOrderDetailId">
          <el-input v-model="form.materialOrderDetailId" placeholder="请输入采购明细id" />
        </el-form-item>
        <el-form-item label="收货人ID" prop="receiveUserId">
          <el-input v-model="form.receiveUserId" placeholder="请输入收货人ID" />
        </el-form-item>
        <el-form-item label="保质期天数" prop="expirationDays">
          <el-input v-model="form.expirationDays" placeholder="请输入保质期天数" />
        </el-form-item>
        <el-form-item label="过期日期" prop="expirationDate">
          <el-date-picker clearable
            v-model="form.expirationDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择过期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="IQC处理数量" prop="iqcQuantity">
          <el-input v-model="form.iqcQuantity" placeholder="请输入IQC处理数量" />
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

<script setup name="MaterialReceive" lang="ts">
import { listMaterialReceive, getMaterialReceive, delMaterialReceive, addMaterialReceive, updateMaterialReceive } from '@/api/purchase/materialReceive';
import { MaterialReceiveVO, MaterialReceiveQuery, MaterialReceiveForm } from '@/api/purchase/materialReceive/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const materialReceiveList = ref<MaterialReceiveVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialReceiveFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MaterialReceiveForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  rawMaterialId: undefined,
  productionDate: undefined,
  storageId: undefined,
  quantity: undefined,
  unit: undefined,
  materialOrderDetailId: undefined,
  receiveTime: undefined,
  remark: undefined,
  receiveUserId: undefined,
  receiveUserName: undefined,
  expirationDays: undefined,
  expirationDate: undefined,
  code: undefined,
  iqcQuantity: undefined
}
const data = reactive<PageData<MaterialReceiveForm, MaterialReceiveQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    rawMaterialId: undefined,
    productionDate: undefined,
    storageId: undefined,
    quantity: undefined,
    unit: undefined,
    materialOrderDetailId: undefined,
    receiveTime: undefined,
    receiveUserId: undefined,
    receiveUserName: undefined,
    expirationDays: undefined,
    expirationDate: undefined,
    code: undefined,
    iqcQuantity: undefined,
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
    productionDate: [
      { required: true, message: "生产日期不能为空", trigger: "blur" }
    ],
    storageId: [
      { required: true, message: "仓库ID不能为空", trigger: "blur" }
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
    receiveTime: [
      { required: true, message: "收货时间不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    receiveUserId: [
      { required: true, message: "收货人ID不能为空", trigger: "blur" }
    ],
    receiveUserName: [
      { required: true, message: "收货人名称不能为空", trigger: "blur" }
    ],
    expirationDays: [
      { required: true, message: "保质期天数不能为空", trigger: "blur" }
    ],
    expirationDate: [
      { required: true, message: "过期日期不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "收货编号不能为空", trigger: "blur" }
    ],
    iqcQuantity: [
      { required: true, message: "IQC处理数量不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询采购收货记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialReceive(queryParams.value);
  materialReceiveList.value = res.rows;
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
  materialReceiveFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialReceiveVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加采购收货记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialReceiveVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialReceive(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改采购收货记录";
}

/** 提交按钮 */
const submitForm = () => {
  materialReceiveFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialReceive(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialReceive(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialReceiveVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除采购收货记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialReceive(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/materialReceive/export', {
    ...queryParams.value
  }, `materialReceive_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

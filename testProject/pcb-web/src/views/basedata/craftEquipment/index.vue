<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="工艺id" prop="craftId">
            <el-input v-model="queryParams.craftId" placeholder="请输入工艺id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="设备id" prop="equipmentId">
            <el-input v-model="queryParams.equipmentId" placeholder="请输入设备id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never" class="xtable-card">
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

      <el-table v-loading="loading" :data="craftEquipmentList" @selection-change="handleSelectionChange" height="100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="工艺id" align="center" prop="craftId" />
        <el-table-column label="设备id" align="center" prop="equipmentId" />
        <el-table-column label="备注" align="center" prop="remark" />
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
    <!-- 添加或修改工艺设备对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="craftEquipmentFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工艺id" prop="craftId">
          <el-input v-model="form.craftId" placeholder="请输入工艺id" />
        </el-form-item>
        <el-form-item label="设备id" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备id" />
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

<script setup name="CraftEquipment" lang="ts">
import { listCraftEquipment, getCraftEquipment, delCraftEquipment, addCraftEquipment, updateCraftEquipment } from '@/api/basedata/craftEquipment';
import { CraftEquipmentVO, CraftEquipmentQuery, CraftEquipmentForm } from '@/api/basedata/craftEquipment/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const craftEquipmentList = ref<CraftEquipmentVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const craftEquipmentFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CraftEquipmentForm = {
  id: undefined,
  craftId: undefined,
  equipmentId: undefined,
  remark: undefined
}
const data = reactive<PageData<CraftEquipmentForm, CraftEquipmentQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    craftId: undefined,
    equipmentId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "工艺id不能为空", trigger: "blur" }
    ],
    equipmentId: [
      { required: true, message: "设备id不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工艺设备列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCraftEquipment(queryParams.value);
  craftEquipmentList.value = res.rows;
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
  craftEquipmentFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CraftEquipmentVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工艺设备";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CraftEquipmentVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCraftEquipment(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工艺设备";
}

/** 提交按钮 */
const submitForm = () => {
  craftEquipmentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCraftEquipment(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCraftEquipment(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CraftEquipmentVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除工艺设备编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCraftEquipment(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/craftEquipment/export', {
    ...queryParams.value
  }, `craftEquipment_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

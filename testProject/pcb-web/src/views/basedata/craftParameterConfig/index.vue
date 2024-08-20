<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="工艺ID" prop="craftId">
            <el-input v-model="queryParams.craftId" placeholder="请输入工艺ID" clearable @keyup.enter="handleQuery" />
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

      <el-table v-loading="loading" :data="craftParameterConfigList" @selection-change="handleSelectionChange" height="100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="创建部门名称" align="center" prop="createDeptName" />
        <el-table-column label="创建者名称" align="center" prop="createByName" />
        <el-table-column label="更新者名称" align="center" prop="updateByName" />
        <el-table-column label="工艺ID" align="center" prop="craftId" />
        <el-table-column label="是否按pnl区分" align="center" prop="isDifferentiatePnl" />
        <el-table-column label="是否加粗" align="center" prop="isBold" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="参数类型" align="center" prop="type" />
        <el-table-column label="参数名称" align="center" prop="name" />
        <el-table-column label="备选项" align="center" prop="options" />
        <el-table-column label="编码" align="center" prop="code" />
        <el-table-column label="默认值(可输入条件表达式)" align="center" prop="defaultValue" />
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
    <!-- 添加或修改工艺参数配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="craftParameterConfigFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工艺ID" prop="craftId">
          <el-input v-model="form.craftId" placeholder="请输入工艺ID" />
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

<script setup name="CraftParameterConfig" lang="ts">
import { listCraftParameterConfig, getCraftParameterConfig, delCraftParameterConfig, addCraftParameterConfig, updateCraftParameterConfig } from '@/api/basedata/craftParameterConfig';
import { CraftParameterConfigVO, CraftParameterConfigQuery, CraftParameterConfigForm } from '@/api/basedata/craftParameterConfig/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const craftParameterConfigList = ref<CraftParameterConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const craftParameterConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CraftParameterConfigForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  craftId: undefined,
  isDifferentiatePnl: undefined,
  isBold: undefined,
  unit: undefined,
  type: undefined,
  name: undefined,
  options: undefined,
  code: undefined,
  defaultValue: undefined
}
const data = reactive<PageData<CraftParameterConfigForm, CraftParameterConfigQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    craftId: undefined,
    isDifferentiatePnl: undefined,
    isBold: undefined,
    unit: undefined,
    type: undefined,
    name: undefined,
    options: undefined,
    code: undefined,
    defaultValue: undefined,
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
    craftId: [
      { required: true, message: "工艺ID不能为空", trigger: "blur" }
    ],
    isDifferentiatePnl: [
      { required: true, message: "是否按pnl区分不能为空", trigger: "blur" }
    ],
    isBold: [
      { required: true, message: "是否加粗不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "参数类型不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "参数名称不能为空", trigger: "blur" }
    ],
    options: [
      { required: true, message: "备选项不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    defaultValue: [
      { required: true, message: "默认值(可输入条件表达式)不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工艺参数配置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCraftParameterConfig(queryParams.value);
  craftParameterConfigList.value = res.rows;
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
  craftParameterConfigFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CraftParameterConfigVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工艺参数配置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CraftParameterConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCraftParameterConfig(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工艺参数配置";
}

/** 提交按钮 */
const submitForm = () => {
  craftParameterConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCraftParameterConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCraftParameterConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CraftParameterConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除工艺参数配置编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCraftParameterConfig(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/craftParameterConfig/export', {
    ...queryParams.value
  }, `craftParameterConfig_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

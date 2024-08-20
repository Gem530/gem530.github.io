<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="公式id" prop="ruleId">
            <el-input v-model="queryParams.ruleId" placeholder="请输入公式id" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="公式值" prop="ruleValue">
            <el-input v-model="queryParams.ruleValue" placeholder="请输入公式值" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="公式参数" prop="ruleParam">
            <el-input v-model="queryParams.ruleParam" placeholder="请输入公式参数" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="公式参数值" prop="ruleParamValue">
            <el-input v-model="queryParams.ruleParamValue" placeholder="请输入公式参数值" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="所属单位ID" prop="ownerId">
            <el-input v-model="queryParams.ownerId" placeholder="请输入所属单位ID" clearable style="width: 240px"  @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['outsource:sourceHalfCountAttrLog:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['outsource:sourceHalfCountAttrLog:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['outsource:sourceHalfCountAttrLog:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['outsource:sourceHalfCountAttrLog:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

        <XTable v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="sourceHalfCountAttrLogList"
                :columnList="columnList"
                ref="XTableRef"
                border
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                @checkbox-all="selectChangeEvent"
                @checkbox-change="selectChangeEvent"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }"
        >
            <template #default-make="scope">

                <el-tooltip content="修改" placement="top">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['outsource:sourceHalfCountAttrLog:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['outsource:sourceHalfCountAttrLog:remove']"></el-button>
                </el-tooltip>
                <el-tooltip content="详情" placement="top">
                    <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)" v-hasPermi="['outsource:sourceHalfCountAttrLog:get']"></el-button>
                </el-tooltip>
            </template>
        </XTable>
    </el-card>
    <!-- 添加或修改外协计价记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="sourceHalfCountAttrLogFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公式id" prop="ruleId">
          <el-input v-model="form.ruleId" placeholder="请输入公式id" />
        </el-form-item>
        <el-form-item label="公式值" prop="ruleValue">
          <el-input v-model="form.ruleValue" placeholder="请输入公式值" />
        </el-form-item>
        <el-form-item label="公式参数" prop="ruleParam">
          <el-input v-model="form.ruleParam" placeholder="请输入公式参数" />
        </el-form-item>
        <el-form-item label="公式参数值" prop="ruleParamValue">
          <el-input v-model="form.ruleParamValue" placeholder="请输入公式参数值" />
        </el-form-item>
        <el-form-item label="所属单位ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入所属单位ID" />
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

<script setup name="SourceHalfCountAttrLog" lang="ts">
import { listSourceHalfCountAttrLog, getSourceHalfCountAttrLog, delSourceHalfCountAttrLog, addSourceHalfCountAttrLog, updateSourceHalfCountAttrLog } from '@/api/outsource/sourceHalfCountAttrLog';
import { SourceHalfCountAttrLogVO, SourceHalfCountAttrLogQuery, SourceHalfCountAttrLogForm } from '@/api/outsource/sourceHalfCountAttrLog/types';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sourceHalfCountAttrLogList = ref<SourceHalfCountAttrLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const sourceHalfCountAttrLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SourceHalfCountAttrLogForm = {
  id: undefined,
  ruleId: undefined,
  ruleValue: undefined,
  ruleParam: undefined,
  ruleParamValue: undefined,
  ownerId: undefined
}
const data = reactive<PageData<SourceHalfCountAttrLogForm, SourceHalfCountAttrLogQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ruleId: undefined,
    ruleValue: undefined,
    ruleParam: undefined,
    ruleParamValue: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    ruleId: [
      { required: true, message: "公式id不能为空", trigger: "blur" }
    ],
    ruleValue: [
      { required: true, message: "公式值不能为空", trigger: "blur" }
    ],
    ruleParam: [
      { required: true, message: "公式参数不能为空", trigger: "blur" }
    ],
    ruleParamValue: [
      { required: true, message: "公式参数值不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所属单位ID不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { type: 'checkbox', align: 'center', field: "checkbox",  width: '40', },
        { title: '${comment}', field: 'id', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入${comment}' } },
        { title: '公式id', field: 'ruleId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入公式id' } },
        { title: '公式值', field: 'ruleValue', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入公式值' } },
        { title: '公式参数', field: 'ruleParam', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入公式参数' } },
        { title: '公式参数值', field: 'ruleParamValue', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入公式参数值' } },
        { title: '所属单位ID', field: 'ownerId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入所属单位ID' } },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedSourceHalfCountAttrLogList = ref<SourceHalfCountAttrLogVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceHalfCountAttrLogVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedSourceHalfCountAttrLogList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询外协计价记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceHalfCountAttrLog(queryParams.value);
  sourceHalfCountAttrLogList.value = res.rows;
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
  sourceHalfCountAttrLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SourceHalfCountAttrLogVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加外协计价记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SourceHalfCountAttrLogVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSourceHalfCountAttrLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改外协计价记录";
}

/** 提交按钮 */
const submitForm = () => {
  sourceHalfCountAttrLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSourceHalfCountAttrLog(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSourceHalfCountAttrLog(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceHalfCountAttrLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除外协计价记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delSourceHalfCountAttrLog(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceHalfCountAttrLog/export', {
    ...queryParams.value
  }, `sourceHalfCountAttrLog_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

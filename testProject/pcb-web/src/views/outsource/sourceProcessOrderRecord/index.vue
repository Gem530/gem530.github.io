<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="所属单位ID" prop="ownerId">
            <el-input v-model="queryParams.ownerId" placeholder="请输入所属单位ID" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="加工 报废或者发货数量" prop="number">
            <el-input v-model="queryParams.number" placeholder="请输入加工 报废或者发货数量" clearable style="width: 240px"  @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['outsource:sourceProcessOrderRecord:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['outsource:sourceProcessOrderRecord:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['outsource:sourceProcessOrderRecord:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['outsource:sourceProcessOrderRecord:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

        <XTable v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="sourceProcessOrderRecordList"
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
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['outsource:sourceProcessOrderRecord:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['outsource:sourceProcessOrderRecord:remove']"></el-button>
                </el-tooltip>
                <el-tooltip content="详情" placement="top">
                    <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)" v-hasPermi="['outsource:sourceProcessOrderRecord:get']"></el-button>
                </el-tooltip>
            </template>
        </XTable>
    </el-card>
    <!-- 添加或修改外协加工接单明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="sourceProcessOrderRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属单位ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入所属单位ID" />
        </el-form-item>
        <el-form-item label="加工 报废或者发货数量" prop="number">
          <el-input v-model="form.number" placeholder="请输入加工 报废或者发货数量" />
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

<script setup name="SourceProcessOrderRecord" lang="ts">
import { listSourceProcessOrderRecord, getSourceProcessOrderRecord, delSourceProcessOrderRecord, addSourceProcessOrderRecord, updateSourceProcessOrderRecord } from '@/api/outsource/sourceProcessOrderRecord';
import { SourceProcessOrderRecordVO, SourceProcessOrderRecordQuery, SourceProcessOrderRecordForm } from '@/api/outsource/sourceProcessOrderRecord/types';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sourceProcessOrderRecordList = ref<SourceProcessOrderRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const sourceProcessOrderRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SourceProcessOrderRecordForm = {
  id: undefined,
  ownerId: undefined,
  number: undefined,
  recordType: undefined
}
const data = reactive<PageData<SourceProcessOrderRecordForm, SourceProcessOrderRecordQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ownerId: undefined,
    number: undefined,
    recordType: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所属单位ID不能为空", trigger: "blur" }
    ],
    number: [
      { required: true, message: "加工 报废或者发货数量不能为空", trigger: "blur" }
    ],
    recordType: [
      { required: true, message: "1.加工 2.报废 3.发货不能为空", trigger: "change" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { type: 'checkbox', align: 'center', field: "checkbox",  width: '40', },
        { title: '主键ID', field: 'id', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入主键ID' } },
        { title: '所属单位ID', field: 'ownerId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入所属单位ID' } },
        { title: '加工 报废或者发货数量', field: 'number', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工 报废或者发货数量' } },
        { title: '1.加工 2.报废 3.发货', field: 'recordType', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入1.加工 2.报废 3.发货' } },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedSourceProcessOrderRecordList = ref<SourceProcessOrderRecordVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceProcessOrderRecordVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedSourceProcessOrderRecordList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询外协加工接单明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceProcessOrderRecord(queryParams.value);
  sourceProcessOrderRecordList.value = res.rows;
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
  sourceProcessOrderRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SourceProcessOrderRecordVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加外协加工接单明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SourceProcessOrderRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSourceProcessOrderRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改外协加工接单明细";
}

/** 提交按钮 */
const submitForm = () => {
  sourceProcessOrderRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSourceProcessOrderRecord(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSourceProcessOrderRecord(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceProcessOrderRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除外协加工接单明细编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delSourceProcessOrderRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceProcessOrderRecord/export', {
    ...queryParams.value
  }, `sourceProcessOrderRecord_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

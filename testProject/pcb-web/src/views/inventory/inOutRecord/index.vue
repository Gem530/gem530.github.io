<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="产品ID" prop="rawMaterialId">
            <el-input v-model="queryParams.rawMaterialId" placeholder="请输入产品ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="仓库ID" prop="storageId">
            <el-input v-model="queryParams.storageId" placeholder="请输入仓库ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="业务ID" prop="bizId">
            <el-input v-model="queryParams.bizId" placeholder="请输入业务ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="所属单位ID" prop="ownerId">
            <el-input v-model="queryParams.ownerId" placeholder="请输入所属单位ID" clearable @keyup.enter="handleQuery" />
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

        <XTable v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="inOutRecordList"
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
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" ></el-button>
                </el-tooltip>
                <el-tooltip content="详情" placement="top">
                    <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)" ></el-button>
                </el-tooltip>
            </template>
        </XTable>
    </el-card>
    <!-- 添加或修改成品出入库记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="inOutRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="仓库ID" prop="storageId">
          <el-input v-model="form.storageId" placeholder="请输入仓库ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="业务ID" prop="bizId">
          <el-input v-model="form.bizId" placeholder="请输入业务ID" />
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

<script setup name="InOutRecord" lang="ts">
import { listInOutRecord, getInOutRecord, delInOutRecord, addInOutRecord, updateInOutRecord } from '@/api/inventory/inOutRecord';
import { InOutRecordVO, InOutRecordQuery, InOutRecordForm } from '@/api/inventory/inOutRecord/types';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const inOutRecordList = ref<InOutRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const inOutRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InOutRecordForm = {
  id: undefined,
  rawMaterialId: undefined,
  storageId: undefined,
  quantity: undefined,
  intOutTime: undefined,
  type: undefined,
  bizId: undefined,
  no: undefined,
  ownerId: undefined
}
const data = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    storageId: undefined,
    quantity: undefined,
    intOutTime: undefined,
    type: undefined,
    bizId: undefined,
    no: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键id不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "产品ID不能为空", trigger: "blur" }
    ],
    storageId: [
      { required: true, message: "仓库ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    intOutTime: [
      { required: true, message: "出入库时间不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    bizId: [
      { required: true, message: "业务ID不能为空", trigger: "blur" }
    ],
    no: [
      { required: true, message: "出入库记录编号不能为空", trigger: "blur" }
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
        { title: '主键id', field: 'id', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入主键id' } },
        { title: '产品ID', field: 'rawMaterialId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品ID' } },
        { title: '仓库ID', field: 'storageId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入仓库ID' } },
        { title: '数量', field: 'quantity', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入数量' } },
        { title: '出入库时间', field: 'intOutTime', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入出入库时间' } },
        { title: '类型', field: 'type', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入类型' } },
        { title: '业务ID', field: 'bizId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入业务ID' } },
        { title: '出入库记录编号', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入出入库记录编号' } },
        { title: '所属单位ID', field: 'ownerId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入所属单位ID' } },
    { title: '操作', field: 'make', align: 'center', width: '120', fixed: 'right', },
]);

const checkedInOutRecordList = ref<InOutRecordVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<InOutRecordVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedInOutRecordList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询成品出入库记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInOutRecord(queryParams.value);
  inOutRecordList.value = res.rows;
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
  inOutRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InOutRecordVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加成品出入库记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: InOutRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getInOutRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改成品出入库记录";
}

/** 提交按钮 */
const submitForm = () => {
  inOutRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInOutRecord(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addInOutRecord(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: InOutRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除成品出入库记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delInOutRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('inventory/inOutRecord/export', {
    ...queryParams.value
  }, `inOutRecord_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

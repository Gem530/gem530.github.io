<template>
  <div class="p-2  xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <div class="p-2" style="text-align: right;width: 100%">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </div>
      </template>

      <XTable
      class="xtable-content"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        :data="sourceHalfCountAttrList"
        :columnList="columnList"
        ref="XTableRef"
        height="100%"
        border
        @searchChange="searchChange"
        :column-config="{ resizable: true }"
        @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent"
        :checkbox-config="{reserve: true }"
        :showRefresh="true"
        :row-config="{ keyField:'id' }"
        v-loading="loading"
      >
        <template #default-type="scope">
          {{ typeOptions.find(item => item.value == scope.row.type)?.label}}
        </template>
        <template #default-status="scope">
          {{ statusOptions.find(item => item.value == scope.row.status)?.label}}
        </template>
        <template #default-valueType="scope">
          {{ valueTypeOptions.find(item => item.value == scope.row.valueType)?.label}}
        </template>

        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </XTable>
    </el-card>
    <!-- 添加或修改半制程外协计价配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body>
      <div v-loading="dialogLoading">
        <el-form ref="sourceHalfCountAttrFormRef" :model="form" :disabled="dialog.title.includes('详情')" :rules="rules" label-width="260px">
           <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" :collapse-tags="true" filterable placeholder="请选择类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="工序名称">
            <el-select
              v-model="form.craftId"
              placeholder="请选择工序"
              style="width: 100%;"
              clearable
              @change="getCraftAllPermeter"
              filterable
              fit-input-width
            >
              <el-option v-for="item in craftList" :key="item.id" :label="item.craftName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工序参数">
            <el-select
              v-model="form.key"
              placeholder="请选择工序参数"
              style="width: 100%;"
              clearable
              @change="changePermeter"
              filterable
              fit-input-width
            >
              <el-option v-for="item in craftParameterConfigList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工艺ID">
            <el-input v-model="form.craftId" :disabled="true" />
          </el-form-item>

          <el-form-item label="key" prop="key">
            <el-input v-model="form.key" placeholder="请输入key" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
         
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" :collapse-tags="true" filterable placeholder="请选择状态">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="值的类型" prop="valueType">
            <el-select v-model="form.valueType" :collapse-tags="true" filterable placeholder="请选择类型">
              <el-option v-for="item in valueTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-show="!dialog.title?.includes('详情')">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SourceHalfCountAttr" lang="ts">
import { listSourceHalfCountAttr, getSourceHalfCountAttr, delSourceHalfCountAttr, addSourceHalfCountAttr, updateSourceHalfCountAttr } from '@/api/outsource/sourceHalfCountAttr';
import { SourceHalfCountAttrVO, SourceHalfCountAttrQuery, SourceHalfCountAttrForm } from '@/api/outsource/sourceHalfCountAttr/types';
import { VxeTableEvents } from 'vxe-table'
import { getCraftList} from "@/api/basedata/craft";
  import { craftParameterList } from "@/api/basedata/craftParameterConfig";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;


const sourceHalfCountAttrList = ref<SourceHalfCountAttrVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const dialogLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const sourceHalfCountAttrFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SourceHalfCountAttrForm = {
  id: undefined,
  craftId: undefined,
  ownerId: undefined,
  paramId: undefined,
  type: undefined,
  status: '1',
  name: undefined
}
const data = reactive<PageData<SourceHalfCountAttrForm, SourceHalfCountAttrQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    craftId: undefined,
    ownerId: undefined,
    paramId: undefined,
    type: undefined,
    status: undefined,
    name: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "工艺ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ],
    paramId: [
      { required: true, message: "工艺配置ID不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "blur" }
    ],
    valueType: [
      { required: true, message: "值的类型不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
        { title: '工艺', field: 'craftName',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入' } },
        { title: 'key', field: 'key',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入' } },
        { title: '类型', field: 'type', align: 'center', filterType:'radioButton',  filterData:()=>typeOptions.value },
        { title: '状态', field: 'status', align: 'center', filterType:'radioButton',  filterData:()=>statusOptions.value },
        { title: '名称', field: 'name',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入' } },
        { title: '值类型', field: 'valueType', align: 'center' },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedSourceHalfCountAttrList = ref<SourceHalfCountAttrVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const statusOptions = ref([
  {value: "1", label: "启用"},
  {value: "0", label: "停用"}
])
// 1工艺参数 2字段 3公共 4pp
const typeOptions = ref([
  {value: "1", label: "工艺参数"},
  {value: "2", label: "工艺数据字段"},
  {value: "3", label: "公共参数"},
  {value: "4", label: "pp参数"},

])
const valueTypeOptions = ref([
  {value: "1", label: "数字"},
  {value: "2", label: "文本"}
])


const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceHalfCountAttrVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedSourceHalfCountAttrList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询半制程外协计价配置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceHalfCountAttr(queryParams.value);
  sourceHalfCountAttrList.value = res.rows;
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
  sourceHalfCountAttrFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SourceHalfCountAttrVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加半制程外协计价配置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SourceHalfCountAttrVO) => {
  dialogLoading.value = true;
  reset();
  if(row.craftId){
   await getCraftAllPermeter(row.craftId);
  }
  dialog.visible = true;
  dialog.title = "修改半制程外协计价配置";
  const _id = row?.id || ids.value[0]
  const res = await getSourceHalfCountAttr(_id).finally(() => dialogLoading.value = false);
  Object.assign(form.value, res.data);

}
/** 详情按钮操作 */
const handleDetail = async (row?: SourceHalfCountAttrVO) => {
  dialogLoading.value = true;
  reset();
  if(row.craftId){
   await getCraftAllPermeter(row.craftId);
  }
  dialog.visible = true;
  dialog.title = "半制程外协计价配置详情";
  const _id = row?.id || ids.value[0]
  const res = await getSourceHalfCountAttr(_id).finally(() => dialogLoading.value = false);
  Object.assign(form.value, res.data);

}

/** 提交按钮 */
const submitForm = () => {
  sourceHalfCountAttrFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSourceHalfCountAttr(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSourceHalfCountAttr(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceHalfCountAttrVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项？').finally(() => loading.value = false);
  await delSourceHalfCountAttr(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}


  const craftParameterConfigList = ref<any[]>([]);

 let queryFormRef2: any = reactive({craftId: ""});

  /** 查询当前工艺所有配置参数 */
  async function getCraftAllPermeter(craftId: any) {

    queryFormRef2.craftId = craftId;
    const res = await craftParameterList(queryFormRef2);

    craftParameterConfigList.value = res.data;
    craftParameterConfigList.value.forEach((item: any) => {
      item.id = item.id.toString();
    });

  }
  async function changePermeter(id: any) {


    craftParameterConfigList.value.forEach((item: any) => {
      if (item.id == id) {

        form.value.name = item.name;

      }
    });


  }

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceHalfCountAttr/export', {
    ...queryParams.value
  }, `sourceHalfCountAttr_${new Date().getTime()}.xlsx`)
}
  const craftList = ref<any[]>([]);
  /** 查询工艺列表 */
  const getCraftListNoPage = async () => {
    let craftQuery:any= {
      isOpen: '1'

    }
    const res = await getCraftList(craftQuery);
    craftList.value = res.data;
  };

onMounted(() => {
  getList();
  getCraftListNoPage();
});
</script>

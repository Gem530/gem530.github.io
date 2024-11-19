<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="报废类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择报废类型" clearable>
              <el-option
                v-for="dict in scrap_record_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="报废数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入报废数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="业务ID" prop="bizid">
            <el-input v-model="queryParams.bizid" placeholder="请输入业务ID" clearable @keyup.enter="handleQuery" />
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

      <XTable v-loading="loading" :columnList="columnList" :data="scrapRecordList" class="xtable-content" height="100%"
      v-model:page-size="queryParams.pageSize"
      v-model:current-page="queryParams.pageNum"
      :page-params="{ perfect: true, total: total }"
      @search-change="getList"
      @checkbox-change="handleSelectionChange" ref="xtableRef"
      @checkbox-all="handleSelectionChange">
        <template #default-type="scope">
          <dict-tag :options="scrap_record_type" :value="scope.row.type"/>
        </template>
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
    <!-- 添加或修改报废记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="scrapRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报废类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择报废类型">
            <el-option
                v-for="dict in scrap_record_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报废数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入报废数量" />
        </el-form-item>
        <el-form-item label="业务ID" prop="bizid">
          <el-input v-model="form.bizid" placeholder="请输入业务ID" />
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

<script setup name="ScrapRecord" lang="ts">
import { listScrapRecord, getScrapRecord, delScrapRecord, addScrapRecord, updateScrapRecord } from '@/api/order/scrapRecord';
import { ScrapRecordVO, ScrapRecordQuery, ScrapRecordForm } from '@/api/order/scrapRecord/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { scrap_record_type } = toRefs<any>(proxy?.useDict('scrap_record_type'));

const xtableRef = ref()
const scrapRecordList = ref<ScrapRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const scrapRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ScrapRecordForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  type: undefined,
  quantity: undefined,
  bizid: undefined,
  code: undefined
}
const data = reactive<PageData<ScrapRecordForm, ScrapRecordQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    type: undefined,
    quantity: undefined,
    bizid: undefined,
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
    type: [
      { required: true, message: "报废类型不能为空", trigger: "change" }
    ],
    quantity: [
      { required: true, message: "报废数量不能为空", trigger: "blur" }
    ],
    bizid: [
      { required: true, message: "业务ID不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "业务ID不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

const columnList = ref([
{ width: '55',type: 'selection',align: 'center',  },
{ title: '${comment}',field: 'id',align: 'center',  },
{ title: '创建部门名称',field: 'createDeptName',align: 'center',  },
{ title: '创建者名称',field: 'createByName',align: 'center',  },
{ title: '更新者名称',field: 'updateByName',align: 'center',  },
{ title: '报废类型',field: 'type',align: 'center',  },
{ title: '报废数量',field: 'quantity',align: 'center',  },
{ title: '业务ID',field: 'bizid',align: 'center',  },
{ title: '业务ID',field: 'code',align: 'center',  },
{ type: 'primary',title: '操作',align: 'center',  },
]);

/** 查询报废记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listScrapRecord(queryParams.value);
  scrapRecordList.value = res.rows;
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
  scrapRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ScrapRecordVO[]) => {
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
  dialog.title = "添加报废记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ScrapRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getScrapRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改报废记录";
}

/** 提交按钮 */
const submitForm = () => {
  scrapRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateScrapRecord(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addScrapRecord(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ScrapRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除报废记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delScrapRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('order/scrapRecord/export', {
    ...queryParams.value
  }, `scrapRecord_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

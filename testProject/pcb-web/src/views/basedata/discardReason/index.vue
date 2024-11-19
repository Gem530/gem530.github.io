<template>
  <div class="p-2 xtable-page">

    <!-- <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="24" class="global-flex flex-end"> -->
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >
              新增
            </el-button>
          </div>
          <!-- </el-col>
        </el-row>
      </template> -->

      <XTable toolId="basedataDiscardReason" :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="discardReasonList"
              :columnList="columnList"
              ref="newVxeTableRef" border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }" >
        <template #default-make="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       >修改
            </el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       >删除
            </el-button>
        </template>
      </XTable>

    <!-- </el-card> -->
    <!-- 添加或修改报废原因对话框 -->
    <el-dialog :title="dialog.title" :close-on-click-modal="false" :close-on-press-escape="false"
               v-model="dialog.visible" width="500px">

      <el-form ref="discardReasonFormRef" :model="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="工艺 " prop="craftId">
          <el-select style="width: 100%;" v-model="form.craftId" filterable placeholder="请选择">
            <el-option
              v-for="item in craftOptions"
              :key="item.id"
              :label="item.craftName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报废原因 " prop="discardReason">
          <el-input
            style="width: 100%;"
            v-model="form.discardReason"
            :rows="3"
            type="textarea"
            placeholder="请输入报废原因"
          />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DiscardReason" lang="ts">
import {
  listDiscardReason,
  getDiscardReason,
  delDiscardReason,
  addDiscardReason,
  updateDiscardReason
} from "@/api/basedata/discardReason";
import { getCraftList } from "@/api/basedata/craft";
import { DiscardReasonVO, DiscardReasonQuery, DiscardReasonForm } from "@/api/basedata/discardReason/types";
import { CraftVO } from "@/api/basedata/craft/types";
import {ref} from "vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const discardReasonList = ref<DiscardReasonVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const discardReasonFormRef = ref<ElFormInstance>();
const newVxeTableRef = ref();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ""
});

const initFormData: DiscardReasonForm = {
  id: undefined,
  craftId: undefined,
  discardReason: undefined,
  remark: undefined
};
const data = reactive<PageData<DiscardReasonForm, DiscardReasonQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    craftName: undefined,
    discardReason: undefined,
    params: {}
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "工艺名不能为空", trigger: "blur" }
    ],
    discardReason: [
      { required: true, message: "报废原因不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

let craftOptions: CraftVO[] = [];

const columnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  { width:'500',title:'工艺名',field:'craftName',align:'center', filterType: 'input', filterParam: { placeholder: '请输入工艺名' } },
  { width:'500',title:'报废原因',field:'discardReason',align:'center', filterType: 'input', filterParam: { placeholder: '请输入报废原因' } },
  {title: '操作', field: "make", align: 'center', },
]);

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params;
  getList();
}

/**
 * 查询工艺列表
 */
const getListCraft = async () => {
  const res = await getCraftList();
  craftOptions = res.data;
};
/** 查询报废原因列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDiscardReason(queryParams.value);
  discardReasonList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  discardReasonFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: DiscardReasonVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加报废原因";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: DiscardReasonVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDiscardReason(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改报废原因";
};

/** 提交按钮 */
const submitForm = () => {
  discardReasonFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDiscardReason(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addDiscardReason(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: DiscardReasonVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm("确定删除此条数据吗？").finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delDiscardReason(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("basedata/discardReason/export", {
    ...queryParams.value
  }, `discardReason_${new Date().getTime()}.xlsx`);
};

onMounted(() => {
  getList();
  getListCraft();
});
</script>

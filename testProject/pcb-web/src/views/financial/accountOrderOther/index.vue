<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="金额" prop="price">
            <el-input v-model="queryParams.price" placeholder="请输入金额" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="对账单ID" prop="accountOrderId">
            <el-input v-model="queryParams.accountOrderId" placeholder="请输入对账单ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"

              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <XTable v-loading="loading" :columnList="columnList" :data="accountOrderOtherList" class="xtable-content" height="100%"
      v-model:page-size="queryParams.pageSize"
      v-model:current-page="queryParams.pageNum"
      :page-params="{ perfect: true, total: total }"
      @search-change="getList"
      @checkbox-change="handleSelectionChange" ref="xtableRef"
        @checkbox-all="handleSelectionChange">
        <template #default-make="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"

              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"

              ></el-button>
            </el-tooltip>
          </template>
      </XTable>
    </el-card>
    <!-- 添加或修改对账单其他增减记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="accountOrderOtherFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="金额" prop="price">
          <el-input v-model="form.price" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="对账单ID" prop="accountOrderId">
          <el-input v-model="form.accountOrderId" placeholder="请输入对账单ID" />
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

<script setup name="AccountOrderOther" lang="ts">
import { listAccountOrderOther, getAccountOrderOther, delAccountOrderOther, addAccountOrderOther, updateAccountOrderOther } from '@/api/financial/accountOrderOther';
import { AccountOrderOtherVO, AccountOrderOtherQuery, AccountOrderOtherForm } from '@/api/financial/accountOrderOther/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const xtableRef = ref()
const accountOrderOtherList = ref<AccountOrderOtherVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const accountOrderOtherFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AccountOrderOtherForm = {
  id: undefined,
  type: undefined,
  price: undefined,
  remark: undefined,
  accountOrderId: undefined,
  recordTime: undefined
}
const data = reactive<PageData<AccountOrderOtherForm, AccountOrderOtherQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    price: undefined,
    accountOrderId: undefined,
    recordTime: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    accountOrderId: [
      { required: true, message: "对账单ID不能为空", trigger: "blur" }
    ],
    recordTime: [
      { required: true, message: "入账/出账时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询对账单其他增减记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAccountOrderOther(queryParams.value);
  accountOrderOtherList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

const columnList = ref([
{ width: '55',type: 'checkbox',align: 'center',  },
{ title: '${comment}',field: 'id',align: 'center',  },
{ title: '类型',field: 'type',align: 'center',  },
{ title: '金额',field: 'price',align: 'center',  },
{ title: '备注',field: 'remark',align: 'center',  },
{ title: '对账单ID',field: 'accountOrderId',align: 'center',  },
{ title: '入账/出账时间',field: 'recordTime',align: 'center',  },
{ title: '操作',field: 'make',align: 'center',  },
]);

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  accountOrderOtherFormRef.value?.resetFields();
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
const handleSelectionChange = () => {
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
  dialog.title = "添加对账单其他增减记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AccountOrderOtherVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrderOther(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改对账单其他增减记录";
}

/** 提交按钮 */
const submitForm = () => {
  accountOrderOtherFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAccountOrderOther(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addAccountOrderOther(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: AccountOrderOtherVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除对账单其他增减记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delAccountOrderOther(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/accountOrderOther/export', {
    ...queryParams.value
  }, `accountOrderOther_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

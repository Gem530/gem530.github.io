<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="金额" prop="price">
            <el-input v-model="queryParams.price" placeholder="请输入金额" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="财务扣款记录表ID" prop="accountOrderDeductionId">
            <el-input v-model="queryParams.accountOrderDeductionId" placeholder="请输入财务扣款记录表ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="单位ID" prop="ownerId">
            <el-input v-model="queryParams.ownerId" placeholder="请输入单位ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商ID" prop="supplierId">
            <el-input v-model="queryParams.supplierId" placeholder="请输入供应商ID" clearable @keyup.enter="handleQuery" />
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
                :data="AccountOrderDeductionAssignList"
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
    <!-- 添加或修改财务扣款记录分配对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="AccountOrderDeductionAssignFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="金额" prop="price">
          <el-input v-model="form.price" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="财务扣款记录表ID" prop="accountOrderDeductionId">
          <el-input v-model="form.accountOrderDeductionId" placeholder="请输入财务扣款记录表ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="单位ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入单位ID" />
        </el-form-item>
        <el-form-item label="供应商ID" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商ID" />
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

<script setup name="AccountOrderDeductionAssign" lang="ts">
import { listAccountOrderDeductionAssign, getAccountOrderDeductionAssign, delAccountOrderDeductionAssign, addAccountOrderDeductionAssign, updateAccountOrderDeductionAssign } from '@/api/financial/AccountOrderDeductionAssign';
import { AccountOrderDeductionAssignVO, AccountOrderDeductionAssignQuery, AccountOrderDeductionAssignForm } from '@/api/financial/AccountOrderDeductionAssign/types';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const AccountOrderDeductionAssignList = ref<AccountOrderDeductionAssignVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const AccountOrderDeductionAssignFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AccountOrderDeductionAssignForm = {
  id: undefined,
  price: undefined,
  remark: undefined,
  accountOrderDeductionId: undefined,
  assignTime: undefined,
  userName: undefined,
  userId: undefined,
  ownerId: undefined,
  supplierId: undefined,
  supplierName: undefined,
  type: undefined
}
const data = reactive<PageData<AccountOrderDeductionAssignForm, AccountOrderDeductionAssignQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    price: undefined,
    accountOrderDeductionId: undefined,
    assignTime: undefined,
    userName: undefined,
    userId: undefined,
    ownerId: undefined,
    supplierId: undefined,
    supplierName: undefined,
    type: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    accountOrderDeductionId: [
      { required: true, message: "财务扣款记录表ID不能为空", trigger: "blur" }
    ],
    assignTime: [
      { required: true, message: "分配时间不能为空", trigger: "blur" }
    ],
    userName: [
      { required: true, message: "用户名不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商ID不能为空", trigger: "blur" }
    ],
    supplierName: [
      { required: true, message: "供应商名称不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型(责任人、供应商)不能为空", trigger: "change" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { type: 'checkbox', align: 'center', field: "checkbox",  width: '40', },
        { title: '${comment}', field: 'id', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入${comment}' } },
        { title: '金额', field: 'price', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入金额' } },
        { title: '备注', field: 'remark', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
        { title: '财务扣款记录表ID', field: 'accountOrderDeductionId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入财务扣款记录表ID' } },
        { title: '分配时间', field: 'assignTime', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入分配时间' } },
        { title: '用户名', field: 'userName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入用户名' } },
        { title: '用户ID', field: 'userId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入用户ID' } },
        { title: '单位ID', field: 'ownerId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位ID' } },
        { title: '供应商ID', field: 'supplierId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商ID' } },
        { title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
        { title: '类型(责任人、供应商)', field: 'type', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入类型(责任人、供应商)' } },
    { title: '操作', field: 'make', align: 'center', width: '120', fixed: 'right', },
]);

const checkedAccountOrderDeductionAssignList = ref<AccountOrderDeductionAssignVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderDeductionAssignVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedAccountOrderDeductionAssignList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询财务扣款记录分配列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAccountOrderDeductionAssign(queryParams.value);
  AccountOrderDeductionAssignList.value = res.rows;
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
  AccountOrderDeductionAssignFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AccountOrderDeductionAssignVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加财务扣款记录分配";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AccountOrderDeductionAssignVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrderDeductionAssign(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改财务扣款记录分配";
}

/** 提交按钮 */
const submitForm = () => {
  AccountOrderDeductionAssignFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAccountOrderDeductionAssign(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addAccountOrderDeductionAssign(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: AccountOrderDeductionAssignVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除财务扣款记录分配编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delAccountOrderDeductionAssign(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/AccountOrderDeductionAssign/export', {
    ...queryParams.value
  }, `AccountOrderDeductionAssign_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="物流周期" prop="logisticsCycle">
            <el-input v-model="queryParams.logisticsCycle" placeholder="请输入物流周期" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="是否默认1否 2是" prop="isDefault">
            <el-input v-model="queryParams.isDefault" placeholder="请输入是否默认1否 2是" clearable @keyup.enter="handleQuery" />
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

      <el-table v-loading="loading" :data="customerAddressList" @selection-change="handleSelectionChange" height="100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="联系人" align="center" prop="name" />
        <el-table-column label="联系电话" align="center" prop="phone" />
        <el-table-column label="联系地址" align="center" prop="address" />
        <el-table-column label="物流周期" align="center" prop="logisticsCycle" />
        <el-table-column label="是否默认1否 2是" align="center" prop="isDefault" />
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
    <!-- 添加或修改客户地址对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="customerAddressFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物流周期" prop="logisticsCycle">
          <el-input v-model="form.logisticsCycle" placeholder="请输入物流周期" />
        </el-form-item>
        <el-form-item label="是否默认1否 2是" prop="isDefault">
          <el-input v-model="form.isDefault" placeholder="请输入是否默认1否 2是" />
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

<script setup name="CustomerAddress" lang="ts">
import { listCustomerAddress, getCustomerAddress, delCustomerAddress, addCustomerAddress, updateCustomerAddress } from '@/api/basedata/customerAddress';
import { CustomerAddressVO, CustomerAddressQuery, CustomerAddressForm } from '@/api/basedata/customerAddress/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerAddressList = ref<CustomerAddressVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const customerAddressFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerAddressForm = {
  id: undefined,
  name: undefined,
  phone: undefined,
  address: undefined,
  logisticsCycle: undefined,
  isDefault: undefined,
  remark: undefined,
  type:undefined
}
const data = reactive<PageData<CustomerAddressForm, CustomerAddressQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    name: undefined,
    phone: undefined,
    address: undefined,
    logisticsCycle: undefined,
    isDefault: undefined,
    type:undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "联系人不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "联系地址不能为空", trigger: "blur" }
    ],
    logisticsCycle: [
      { required: true, message: "物流周期不能为空", trigger: "blur" }
    ],
    isDefault: [
      { required: true, message: "是否默认1否 2是不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户地址列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerAddress(queryParams.value);
  customerAddressList.value = res.rows;
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
  customerAddressFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerAddressVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户地址";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerAddressVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerAddress(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改客户地址";
}

/** 提交按钮 */
const submitForm = () => {
  customerAddressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      //客户地址type默认为1
      form.value.type='1';
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerAddress(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomerAddress(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerAddressVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户地址编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerAddress(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/customerAddress/export', {
    ...queryParams.value
  }, `customerAddress_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

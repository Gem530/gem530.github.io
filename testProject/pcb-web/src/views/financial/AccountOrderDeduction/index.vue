<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              >导出</el-button>
          </el-col> -->
        </el-row>
      </template>
      <XTable
        toolId="financialAccountOrderDeduction"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        height="100%"
        class="xtable-content"
        :page-params="{ perfect: true, total: total }"
        :data="AccountOrderDeductionList"
        :columnList="columnList"
        ref="XTableRef"
        border
        @searchChange="searchChange"
        :column-config="{ resizable: true }"
        :showRefresh="true"
        @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent"
        :checkbox-config="{ reserve: true }"
        :row-config="{ keyField: 'id' }"
      >
        <template #default-type="scope">
          <div v-for="item in typeList">
            <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
          </div>
        </template>
        <template #default-make="scope">
          <el-button link v-if="!scope.row.hasAccountOrder" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link v-if="!scope.row.hasAccountOrder" type="primary" @click="handleDelete(scope.row)">删除</el-button>
          <el-button
            link
            v-if="!scope.row.hasAccountOrder && scope.row.isAssignFinish == 1 && scope.row.type == 1"
            type="primary"
            @click="assignAccountOrder(scope.row)"
            >分配</el-button
          >
          <el-button link v-if="!scope.row.hasAccountOrder && scope.row.type == 1" type="primary" @click="assignRecord(scope.row)"
            >分配记录</el-button
          >
        </template>
      </XTable>
    </el-card>
    <!-- 添加或修改财务扣款记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="40%" append-to-body>
      <el-form class="account-date-width" ref="AccountOrderDeductionFormRef" :model="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="扣款类型：" prop="type">
              <el-radio-group v-model="form.type" :disabled="dialog.title?.includes('修改')">
                <el-radio v-for="dict in typeList" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="扣款时间：" prop="deductionTime">
              <el-date-picker
                v-model="form.deductionTime"
                style="width: 100%"
                type="datetime"
                placeholder="请选择扣款时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="form.type === '1'">
            <el-form-item label="客户名称：" prop="customerId">
              <el-select
                v-model="form.customerId"
                :disabled="dialog.title?.includes('修改')"
                placeholder="请选择客户名称"
                @change="setCustomerName"
                clearable
                filterable
                transfer
                style="width: 100%"
                popup-class-name="pop-select"
              >
                <el-option v-for="item in customerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="form.type === '2'">
            <el-form-item label="供应商名称：" prop="supplierId">
              <el-select
                v-model="form.supplierId"
                :disabled="dialog.title?.includes('修改')"
                placeholder="请选择供应商名称："
                @change="setSupplierName"
                clearable
                filterable
                transfer
                style="width: 100%"
                popup-class-name="pop-select"
              >
                <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="金额：" prop="price">
              <el-input-number
                style="width: 100%"
                placeholder="请输入金额"
                :precision="2"
                :controls="false"
                :disabled="dialog.title?.includes('修改') && form.type == '2'"
                v-model="form.price"
              />
              <span v-if="form.type === '1' && dialog.title?.includes('修改')" class="labelTip"
                >已分配金额：{{ form.assignedPrice
                }}</span
              >
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改财务扣款记录对话框 -->
    <el-dialog :title="assignDialog.title" v-model="assignDialog.visible" width="40%" append-to-body>
      <el-form ref="assignFormRef" :model="assignForm" :rules="assignRules" label-width="160px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="分配金额：">
              <el-input v-model="assignPrice" disabled type="text" placeholder="分配金额" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="分配类型：" prop="type">
              <el-radio-group v-model="assignForm.type" :disabled="assignDialog.title?.includes('修改')">
                <el-radio v-for="dict in assignTypeList" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="assignForm.type === '3'">
            <el-form-item label="责任人名称：" prop="userId">
              <el-select
                v-model="assignForm.userId"
                :disabled="assignDialog.title?.includes('修改')"
                placeholder="请选择责任人名称"
                @change="setUserName"
                clearable
                filterable
                transfer
                style="width: 100%"
                popup-class-name="pop-select"
              >
                <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="assignForm.type === '2'">
            <el-form-item label="供应商名称：" prop="supplierId">
              <el-select
                v-model="assignForm.supplierId"
                :disabled="assignDialog.title?.includes('修改')"
                placeholder="请选择供应商名称"
                @change="setAssignSupplierName"
                clearable
                filterable
                transfer
                style="width: 100%"
                popup-class-name="pop-select"
              >
                <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="责任金额：" prop="price">
              <el-input-number style="width: 100%" placeholder="请输入责任金额" :precision="2" :controls="false" v-model="assignForm.price" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="assignForm.remark" :rows="2" type="textarea" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitAssignForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancelAssign">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="recordDialog.title" v-model="recordDialog.visible" width="60%" append-to-body>
      <el-row>
        <el-col :span="24">
          <XTable
            :pageShow="true"
            :loading="loading"
            :columnList="recordColumnList"
            v-model:page-size="assignQueryParams.pageSize"
            v-model:current-page="assignQueryParams.pageNum"
            :page-params="{ perfect: true, total: recordTotal }"
            border
            ref="tableRef"
            height="400"
            size="mini"
            :row-config="{ isCurrent: true, isHover: true }"
            :data="recordList"
            :column-config="{ resizable: true }"
            :radio-config="{ trigger: 'row' }"
            @searchChange="recordSearchChange"
            @radio-change="selectChangeEvent"
          >
            <template #default-type="scope">
              <div v-for="item in assignTypeList">
                <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-make="scope">
              <el-button v-if="!scope.row.hasAccountOrder" link type="primary" @click="assignDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup name="AccountOrderDeduction" lang="ts">
import dayjs from 'dayjs'
import { postListAccountOrderDeduction, getAccountOrderDeduction, delAccountOrderDeduction, addAccountOrderDeduction, updateAccountOrderDeduction,verifyStatus } from '@/api/financial/AccountOrderDeduction';
import { AccountOrderDeductionVO, AccountOrderDeductionQuery, AccountOrderDeductionForm } from '@/api/financial/AccountOrderDeduction/types';
import { VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { listCustomer,getListCustomer } from '@/api/basedata/customer';
import { CustomerVO } from '@/api/basedata/customer/types';
import { listSupplier } from '@/api/basedata/supplier';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { listUser } from '@/api/system/user';
import { AccountOrderDeductionAssignVO, AccountOrderDeductionAssignForm, AccountOrderDeductionAssignQuery } from '@/api/financial/AccountOrderDeductionAssign/types';
import { listAccountOrderDeductionAssign, delAccountOrderDeductionAssign, addAccountOrderDeductionAssign, updateAccountOrderDeductionAssign } from '@/api/financial/AccountOrderDeductionAssign';
import { BigNumber } from 'bignumber.js';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const AccountOrderDeductionList = ref<AccountOrderDeductionVO[]>([]);
const recordList = ref<AccountOrderDeductionAssignVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const recordTotal = ref(0);
const assignPrice = ref(0);
const queryFormRef = ref<ElFormInstance>();
const AccountOrderDeductionFormRef = ref<ElFormInstance>();
const assignFormRef = ref<ElFormInstance>();
const tableRef = ref<VxeTableInstance<AccountOrderDeductionAssignVO>>();
const checkedOrderDeductionId = ref<any>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const assignDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AccountOrderDeductionForm = {
  id: undefined,
  price: undefined,
  remark: undefined,
  deductionTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
  assignedPrice: undefined,
  customerId: undefined,
  customerName: undefined,
  supplierId: undefined,
  ownerId: undefined,
  supplierName: undefined,
  isAssignFinish: undefined,
  no: undefined,
  customerCode: undefined,
  supplierCode: undefined,
  type: "1"
}

const initAssignFormData: AccountOrderDeductionAssignForm = {
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
  type: "2"
}
// 校验分配金额
const checkAssignPrice = (rule: any, value: string, callback: Function) => {
  console.log(value);
  console.log(assignPrice.value);
  if (Number(value) > assignPrice.value) {
    callback(new Error(`金额不能超过` + assignPrice.value));
  } else {
    callback();
  }
}
// 校验金额
const checkPrice = (rule: any, value: string, callback: Function) => {
  const assignedPrice = form.value.assignedPrice ? form.value.assignedPrice : 0;
  if (Number(value) < assignedPrice) {
    callback(new Error(`金额不能小于` + assignedPrice));
  } else {
    callback();
  }
}
const data = reactive<PageData<AccountOrderDeductionForm, AccountOrderDeductionQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    price: undefined,
    deductionTime: undefined,
    assignedPrice: undefined,
    customerId: undefined,
    customerName: undefined,
    supplierId: undefined,
    ownerId: undefined,
    supplierName: undefined,
    isAssignFinish: undefined,
    type: undefined,
    no: undefined,
    customerCode: undefined,
    supplierCode: undefined,
    params: {
    }
  },
  rules: {
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" },
      { validator: checkPrice, trigger: 'blur' }
    ],
    deductionTime: [
      { required: true, message: "扣款时间不能为空", trigger: "change" }
    ],
    customerId: [
      { required: true, message: "客户名称不能为空", trigger: "change" }
    ],
    supplierId: [
      { required: true, message: "供应商名称不能为空", trigger: "blur" }
    ]
  }
});

const assignData = reactive<PageData<AccountOrderDeductionAssignForm, AccountOrderDeductionAssignQuery>>({
  form: { ...initAssignFormData },
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
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" },
      { validator: checkAssignPrice, trigger: 'blur' }
    ],
  }
});

const XTableRef = ref()
const typeList = ref([
  { label: '客户扣款', value: "1" },
  { label: '供应商扣款', value: "2" },
]);
const assignTypeList = ref([
  { label: '责任在供应商', value: "2" },
  { label: '责任在本厂', value: "3" },
]);

const customerCodeList = ref();
const customerNameList = ref();

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '扣款单号', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入扣款单号' } },
  { title: '扣款类型', field: 'type', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择扣款类型' }, filterData: () => typeList.value },
  { title: '扣款原因', field: 'remark', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入扣款原因' } },
  { title: '扣款时间', field: 'deductionTime', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择扣款时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '已分配金额', field: 'assignedPrice', align: 'center' },
  { title: '客户编号', field: 'customerCodeIdList', align: 'center',filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value },
  { title: '客户名称', field: 'customerNameIdList', align: 'center',filterType: 'checkboxSearch' , filterData:()=>customerNameList.value },
  { title: '供应商编号', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编号' } },
  { title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '扣款金额', field: 'price', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '200', fixed: 'right', showOverflow: false },
]);

const recordColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '扣款单号', field: 'accountOrderDeductionNo', align: 'center' },
  { title: '客户名称', field: 'customerName', align: 'center' },
  { title: '分配时间', field: 'assignTime', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择分配时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '扣款金额', field: 'price', align: 'center' },
  { title: '分配类型', field: 'type', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择分配类型' }, filterData: () => assignTypeList.value },
  { title: '责任供应商', field: 'supplierName', align: 'center' },
  { title: '责任人', field: 'userName', align: 'center' },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '120', fixed: 'right', showOverflow: false },
]);
const customerList = ref<Array<{ label: string, value: number }>>([]);
const supplierList = ref<Array<{ label: string, value: number }>>([]);
const userList = ref<Array<{ label: string, value: number }>>([]);

const checkedAccountOrderDeductionList = ref<AccountOrderDeductionVO[]>([]);

const { queryParams, form, rules } = toRefs(data);
const { queryParams: assignQueryParams, form: assignForm, rules: assignRules } = toRefs(assignData);

const selectChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderDeductionVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedAccountOrderDeductionList.value = selectRecords.map(item => item);
  }
}
const setCustomerName = (val: any) => {
  const customer = customerList.value.find(item => item.value == val);
  form.value.customerName = customer?.label;
}
const setSupplierName = (val: any) => {
  const supplier = supplierList.value.find(item => item.value == val);
  form.value.supplierName = supplier?.label;
}
const setUserName = (val: any) => {
  const user = userList.value.find(item => item.value == val);
  assignForm.value.userName = user?.label;
}
const setAssignSupplierName = (val: any) => {
  const supplier = supplierList.value.find(item => item.value == val);
  assignForm.value.supplierName = supplier?.label;
}
// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}
const recordSearchChange = (params: any) => {
  assignQueryParams.value = params
  assignQueryParams.value.accountOrderDeductionId = checkedOrderDeductionId.value;
  console.log(assignQueryParams.value);
  getRecordList();
}
/** 查询财务扣款记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await postListAccountOrderDeduction(queryParams.value);
  AccountOrderDeductionList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
const getRecordList = async () => {
  loading.value = true;
  const res = await listAccountOrderDeductionAssign(assignQueryParams.value);
  recordList.value = res.rows;
  recordTotal.value = res.total;
  loading.value = false;
}
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}
const cancelAssign = () => {
  reset();
  assignDialog.visible = false;
}
/** 表单重置 */
const reset = () => {
  assignForm.value = { ...initAssignFormData };
  form.value = { ...initFormData };
  AccountOrderDeductionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AccountOrderDeductionVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "扣款单录入";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AccountOrderDeductionVO) => {
  //校验是否有分配记录
   //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      getList();
      return;
    }


  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrderDeduction(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "扣款单修改";
}
/** 分配按钮操作 */
const assignAccountOrder = async (row?: AccountOrderDeductionVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrderDeduction(_id);
  assignPrice.value = BigNumber(res.data.price).minus(BigNumber(res.data.assignedPrice)).toNumber();
  assignForm.value.accountOrderDeductionId = res.data.id;
  console.log(checkedOrderDeductionId.value);
  assignDialog.visible = true;
  assignDialog.title = "扣款单分配";
}
/** 提交分配按钮 */
const submitAssignForm = () => {
  assignFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (assignForm.value.id) {
        await updateAccountOrderDeductionAssign(assignForm.value).finally(() => buttonLoading.value = false);
      } else {
        await addAccountOrderDeductionAssign(assignForm.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      assignDialog.visible = false;
      await getList();
    }
  });
}

/** 提交按钮 */
const submitForm = () => {
  AccountOrderDeductionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAccountOrderDeduction(form.value).finally(() => buttonLoading.value = false);
      } else {
        // 新增时，已分配金额默认为0
        form.value.assignedPrice = 0;
        // 新增时，是否分配完成默认为未完成 1否2是
        form.value.isAssignFinish = '1';
        await addAccountOrderDeduction(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

const assignRecord = async (row?: AccountOrderDeductionVO) => {
  recordDialog.visible = true;
  recordDialog.title = "扣款单分配记录";
  assignQueryParams.value.accountOrderDeductionId = row?.id;
  checkedOrderDeductionId.value = row?.id;
  console.log(assignQueryParams.value);
  await getRecordList();
}

/** 删除分配记录按钮操作 */
const assignDelete = async (row?: AccountOrderDeductionAssignVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除数据项？').finally(() => loading.value = false);
  await delAccountOrderDeductionAssign(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getRecordList();
  await getList();
}
/** 删除按钮操作 */
const handleDelete = async (row?: AccountOrderDeductionVO) => {
     //验证订单是否能确认
    let hasUpdate = await verifyStatus({id:row.id});
    if (!hasUpdate.data) {
      ElMessage.error("数据状态已变更，请刷新页面后重试");
      //刷新列表
      getList();
      return;
    }
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除财务扣款记录编号为"' + row?.no + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delAccountOrderDeduction(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/AccountOrderDeduction/export', {
    ...queryParams.value
  }, `AccountOrderDeduction_${new Date().getTime()}.xlsx`)
}

const setCustomerList = async () => {
  const res: any = await getListCustomer(queryParams.value);
  customerList.value = res.data.map((item: CustomerVO) => {
    return {
      label: item.customerName,
      value: item.id
    }
  })
}

const setSupplierList = async () => {
  queryParams.value.pageSize=1000;
  const res: any = await listSupplier(queryParams.value);
  supplierList.value = res.rows.map((item: SupplierVO) => {
    return {
      label: item.supplierName,
      value: item.id
    }
  })
}

const setUserList = async () => {
  await listUser(queryParams.value).then((res: any) => {
    userList.value = res.rows.map((item: any) => {
      return {
        label: item.userName,
        value: item.userId
      }
    })
  })
}

const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerCode
        }
      });
      customerNameList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerName
        }
      });
    }

  }

onMounted(() => {
  getList();

  getListCust();
  setCustomerList();
  setSupplierList();
  setUserList();
});
</script>
<style lang="scss" scoped>
.labelTip {
  color: #adb2b7;
  font-size: 12px;
  width: 100%;
}
</style>

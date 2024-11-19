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
        border
        height="100%"
        ref="XTableRef"
        :loading="loading"
        :showRefresh="true"
        class="xtable-content"
        :columnList="columnList"
        :row-config="{ keyField: 'id' }"
        :data="AccountOrderDeductionList"
        :checkbox-config="{ reserve: true }"
        :column-config="{ resizable: true }"
        :intervalCondition="intervalCondition"
        toolId="financialAccountOrderDeduction"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        @searchChange="searchChange"
        @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent"
      >
        <template #default-type="scope">
          <div v-for="item in typeList">
            <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
          </div>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)">查看</el-button>
          <el-button link v-if="!scope.row.hasAccountOrder" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link v-if="!scope.row.hasAccountOrder" type="primary" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </XTable>
    </el-card>

    <!-- 添加或修改财务扣款记录对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="45%">
      <el-collapse v-model="activeNames" v-loading="dialogLoading">
        <el-collapse-item title="基本信息" name="1">
          <el-form class="account-date-width" ref="AccountOrderDeductionFormRef" :model="form" :rules="rules" label-width="120px" :disabled="dialog.title?.includes('详情')">
            <el-row>
              <el-col :span="12">
                <el-form-item label="扣款类型：" prop="type">
                  <el-select v-model="form.type" :disabled="dialog.title?.includes('修改')" class="width-100">
                    <el-option
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                      v-for="dict in typeList">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.type === '1'">
                <el-form-item label="选择客户：" prop="customerId">
                  <el-select
                    v-model="form.customerId"
                    :disabled="dialog.title?.includes('修改')"
                    placeholder="请选择客户"
                    @change="setCustomerName"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    popup-class-name="pop-select"
                  >
                    <el-option v-for="item in customerList" :key="item.value" :label="item.customerCode + '-' + item.label + '-' + item.reconciliationTime + '号'" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.type === '2'">
                <el-form-item label="选择供应商：" prop="supplierId">
                  <el-select
                    v-model="form.supplierId"
                    :disabled="dialog.title?.includes('修改')"
                    placeholder="请选择供应商"
                    @change="setSupplierName"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    popup-class-name="pop-select"
                  >
                    <el-option v-for="item in supplierList" :key="item.value" :label="item.supplierCode + '-' + item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="扣款时间：" prop="deductionTime">
                  <el-date-picker
                    clearable
                    type="datetime"
                    style="width: 100%"
                    placeholder="请选择扣款时间"
                    v-model="form.deductionTime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="扣款金额：" prop="price">
                  <el-input v-model="form.price" maxlength="13">
                    <template #append>元</template>
                  </el-input>
                  <!-- <XInputNumber
                    :precision="2"
                    :controls="false"
                    style="width: 100%"
                    v-model="form.price"
                    placeholder="请输入扣款金额"
                    :disabled="dialog.title?.includes('修改') && form.type == '2'"
                  /> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联订单：" prop="order">
                  <el-input v-model="form.saleOrderCode" readonly placeholder="请选择关联订单" @click="openOrder"
                    :disabled="!(form.type && (form.type == 1 ? form.customerId : form.supplierId))"
                  >
                  <template #suffix><img src="@/assets/images/dialog-open-icon.svg"/></template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" :rows="1" maxlength="200" type="textarea" placeholder="备注" />
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="form.type === '1'">
                <XTable
                  :showHead="false"
                  :pageShow="false"
                  ref="validXTableRef"
                  :edit-rules="validRules"
                  :data="responsibilityData"
                  :valid-config="{msgMode: 'full'}"
                  :columnList="responsibilityColumnList">
                  <template #default-userId="{row}">
                    <el-select
                      transfer
                      clearable
                      filterable
                      style="width: 100%"
                      v-model="row.userId"
                      placeholder=" "
                      popup-class-name="pop-select"
                    >
                      <el-option
                        :key="item.userId"
                        :value="item.userId"
                        :label="item.nickName"
                        v-for="item in sysUserList"
                      ></el-option>
                    </el-select>
                  </template>
                  <template #default-price="{row}">
                    <XInputNumber class="width-100" :precision="2" v-model="row.price" placeholder="请输入责任金额"></XInputNumber>
                  </template>
                  <template #default-make="{row, rowIndex}">
                    <el-button v-if="!dialog.title?.includes('详情')" link type="primary" @click="delResponsibibility(row, rowIndex)">删除</el-button>
                  </template>
                </XTable>
                <el-button v-if="!dialog.title?.includes('详情')" link icon="plus" type="primary" style="margin: 10px 0;" @click="addResponsibibility">添加一行</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <template #footer>
        <div class="global-flex flex-center" v-loading="dialogLoading">
          <template v-if="!dialog.title?.includes('详情')">
            <el-button style="width: 150px;" :loading="buttonLoading" @click="cancel">取消</el-button>
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm">确认{{dialog.title == '新增品质扣款' ? '新增' : '修改'}}</el-button>
          </template>
          <el-button v-else style="width: 150px;" :loading="buttonLoading" @click="cancel">关闭</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 选择关联订单数据 -->
    <el-dialog :title="recordDialog.title" v-model="recordDialog.visible" width="60%" destroy-on-close>
      <el-row>
        <el-col :span="24" class="primary-color">
          *仅展示当前{{form.type === '1' ? '客户' : '供应商'}}近2个月的订单数据
        </el-col>
        <el-col :span="24">
          <XTable
            border
            height="400"
            :data="recordList"
            :loading="recordLoading"
            ref="customOrderTableRef"
            :columnList="recordColumnList"
            :column-config="{ resizable: true }"
            :checkbox-config="{checkStrictly: true}"
            v-model:page-size="queryOrderParams.pageSize"
            v-model:current-page="queryOrderParams.pageNum"
            :row-config="{ isCurrent: true, isHover: true }"
            :page-params="{ perfect: true, total: recordTotal }"
            @searchChange="recordSearchChange"
            @checkbox-change="selectRecordChange"
          >
          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div class="global-flex flex-center">
          <el-button style="width: 150px;" @click="cancelOrder">取消</el-button>
          <el-button style="width: 150px;" type="primary" @click="confirmOrder">确认选择</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AccountOrderDeduction" lang="ts">
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { deepClone } from '@/utils'
import { getUserList, getQueryOrder, postListAccountOrderDeduction, getAccountOrderDeduction, delAccountOrderDeduction, addAccountOrderDeduction, updateAccountOrderDeduction,verifyStatus } from '@/api/financial/AccountOrderDeduction';
import { AccountOrderDeductionVO, AccountOrderDeductionQuery, AccountOrderDeductionForm } from '@/api/financial/AccountOrderDeduction/types';
import { VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { listCustomer,getListCustomer } from '@/api/basedata/customer';
import { CustomerVO } from '@/api/basedata/customer/types';
import { listSupplier } from '@/api/basedata/supplier';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { listUser } from '@/api/system/user';
import { BigNumber } from 'bignumber.js';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const activeNames = ref(['1'])
const AccountOrderDeductionList = ref<AccountOrderDeductionVO[]>([]);
const recordList = ref<any[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const dialogLoading = ref(false)
const recordLoading = ref(false)
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const recordTotal = ref(0);
const assignPrice = ref(0);
const customOrderTableRef = ref()
const queryFormRef = ref<ElFormInstance>();
const AccountOrderDeductionFormRef = ref<ElFormInstance>();
const tableRef = ref<VxeTableInstance<any>>();
const checkedOrderDeductionId = ref<any>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordInfo = ref()

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

// 0+正数且小数点后最多2位校验
const twoPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
  // callback(twoPositiveNumberWithTwoDecimals(value))
  if (!value) {
    callback(new Error('请输入扣款金额'))
  } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
    callback(new Error('金额大于0，保留两位小数'))
  } else {
    callback()
  }
}
const data = reactive<PageData<any, any>>({
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
    type: [
      { required: true, message: "请选择扣款类型", trigger: "change" }
    ],
    price: [
      { required: true, validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'blur' }
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

const initQueryOrder = {
  pageNum: 1,
  pageSize: 20,
  supplierId: undefined, // 供应商ID type为2是必填
  type: "1", // 类型（2：供应商、1：客户）
  // saleOrderCode: undefined, // 销售订单编码
  // commodityName: undefined, // 产品名称
  // commodityCode: undefined, // 产品编码
  customerId: undefined, // 客户ID type为1是必填
}
const queryOrderParams = ref(deepClone(initQueryOrder));

const XTableRef = ref()
const validXTableRef = ref()
const typeList = ref([
  { label: '客户扣款', value: "1" },
  { label: '供应商扣款', value: "2" },
]);
const assignTypeList = ref([
  { label: '责任在供应商', value: "2" },
  { label: '责任在本厂', value: "3" },
]);
// 责任人列表
const sysUserList = ref<any[]>([])

const customerCodeList = ref();
const customerNameList = ref();

const responsibilityData = ref<any[]>([])
const responsibilityColumnList = ref([
  { title: '责任人', field: 'userId', align: 'center' },
  { title: '责任金额(元)', field: 'price', align: 'center' },
  { title: '操作', width: '80', field: 'make', align: 'center' },
])
const validRules = ref({
  userId: [{ required: true, message: '请选择责任人' }],
  price: [{
    validator ({ cellValue }: any) {
      if (!cellValue) {
        return new Error('请输入责任金额')
      } if (Number(cellValue) <= 0) {
        return new Error('责任金额不可小于0')
      }
    }
  }],
})
const intervalCondition = ['deductionTime', 'createTime']
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '扣款类型', width: '80', field: 'type', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择扣款类型' }, filterData: () => typeList.value },
  { title: '扣款单位', width: '160', field: 'ownerName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入扣款单位' } },
  { title: '扣款金额(元)', width: '110', field: 'price', align: 'center', sortable: true },
  { title: '责任人', width: '100', field: 'dutyName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入责任人' } },
  { title: '责任金额(元)', width: '110', field: 'dutyPrice', align: 'center' },
  { title: '扣款时间', width: '130', field: 'deductionTime', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '关联订单', width: '160', field: 'saleOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入关联订单' } },
  { title: '关联对账单', width: '160', field: 'accountOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入关联对账单' } },
  { title: '备注', field: 'remark', minWidth: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入备注' } },
  { title: '创建人', width: '80', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入创建人' } },
  { title: '创建时间', field: 'createTime', width:'130', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', showOverflow: false },
]);

const recordColumnList = ref([
  { title: "", type: 'checkbox', align: 'center', width: '60' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '订单号', width: '150', field: 'saleOrderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单号' } },
  { title: '产品编码', width: '150', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
  { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品名称' } },
]);
const customerList = ref<any[]>([]);
const supplierList = ref<any[]>([]);
const userList = ref<any[]>([]);

const checkedAccountOrderDeductionList = ref<AccountOrderDeductionVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderDeductionVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedAccountOrderDeductionList.value = selectRecords.map((item: any) => item);
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
// 获取责任人列表
const getUserListList = () => {
  getUserList().then((res) => {
    if (res.code == 200) {
      sysUserList.value = res.data || []
    }
  })
}
// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}
// 清除初始化已有的搜索条件
const initSearch = (params: any) => {
  // const newKeyArr = Object.keys(params)
  const initKeyArr = Object.keys(initQueryOrder)
  for (let key in queryOrderParams.value) {
    if (!initKeyArr.includes(key)) {
      queryOrderParams.value[key] = undefined
    }
  }
  Object.assign(queryOrderParams.value, params)
  // console.log(initKeyArr)
}
const recordSearchChange = async (params: any) => {
  initSearch(params)
  // queryOrderParams.value = params
  // queryOrderParams.value.accountOrderDeductionId = checkedOrderDeductionId.value;
  console.log(queryOrderParams.value);
  await getRecordList();
  if (recordInfo.value?.id) {
    nextTick(() => {
      const crtRecord = recordList.value.find((f: any) => f.id == recordInfo.value.id)
      selectRecordChange({ row: crtRecord, checked: true })
    })
  }
}
/** 查询财务扣款记录列表 */
const getList = async () => {
  loading.value = true;
  // 处理排序
  if (queryParams.value.sorts && queryParams.value.sorts.length > 0) {
      queryParams.value.sorts.forEach((item: any) => {
        queryParams.value.orderByColumn = item.prop;
        queryParams.value.isAsc = item.order;
    })
  }
  const res = await postListAccountOrderDeduction(queryParams.value);
  AccountOrderDeductionList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
// 获取 客户/供应商 关联订单
const getRecordList = async () => {
  recordLoading.value = true
  const res = await getQueryOrder(queryOrderParams.value).finally(() => recordLoading.value = false);
  recordList.value = res.rows || [];
  recordTotal.value = res.total;
}
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  recordInfo.value = undefined
  responsibilityData.value = []
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
  dialog.title = "新增品质扣款";
  getUserListList();
}
// 查看按钮操作
const handleDetail = async (row?: any) => {
  reset();
  const _id = row?.id || ids.value[0]
  dialog.visible = true;
  dialog.title = "品质扣款详情";
  dialogLoading.value = true
  const res = await getAccountOrderDeduction(_id).finally(() => dialogLoading.value = false);
  form.value = res.data
  responsibilityData.value = form.value?.deductionDutyList || []
  getUserListList();
}
/** 修改按钮操作 */
const handleUpdate = async (row?: any) => {
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
  dialog.visible = true;
  dialog.title = "修改品质扣款";
  dialogLoading.value = true
  const res = await getAccountOrderDeduction(_id).finally(() => dialogLoading.value = false);
  form.value = res.data
  responsibilityData.value = form.value?.deductionDutyList || []
  getUserListList();
}

/** 提交按钮 */
const submitForm = () => {
  AccountOrderDeductionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let params = deepClone(form.value)
      // responsibilityData
      if (params.type == 1) {
        // 客户扣款，不需要传供应商id
        params.supplierId = undefined
        // 只有客户时，才有责任人表格
        const errMap = await validXTableRef.value.xTableRef.fullValidate(true)
        if (errMap) return;
        if (responsibilityData.value?.length) {
          params.deductionDutyList = responsibilityData.value.map((m: any) => {
            return {
              id: m?.id || undefined,
              price: m.price,
              userId: m.userId,
            }
          })
          let tempDutyPrice = 0
          if (params.deductionDutyList.length > 1) {
            // tempDutyPrice = params.deductionDutyList.reduce((prev: any, next: any) => Number(prev.price) + Number(next.price))
            tempDutyPrice = params.deductionDutyList.reduce((prev: any, next: any) => new Decimal(Number(prev.price || 0)).add(new Decimal(Number(next.price || 0))).toNumber())
          } else {
            tempDutyPrice = params.deductionDutyList[0].price
          }
          console.log(tempDutyPrice, params.price)
          if (tempDutyPrice > params.price) {
            proxy?.$modal.msgError('责任金额之和不能大于扣款金额')
            return
          }
        }
      } else {
        // 供应商扣款，不需要传客户id
        params.customerId = undefined
      }

      buttonLoading.value = true;
      if (params.id) {
        await updateAccountOrderDeduction(params).finally(() => buttonLoading.value = false);
      } else {
        // // 新增时，已分配金额默认为0
        // params.assignedPrice = 0;
        // // 新增时，是否分配完成默认为未完成 1否2是
        // params.isAssignFinish = '1';
        await addAccountOrderDeduction(params).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
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
      value: item.id,
      ...item
    }
  })
}

const setSupplierList = async () => {
  // queryParams.value.pageSize=1000;
  const res: any = await listSupplier();
  supplierList.value = res.rows.map((item: SupplierVO) => {
    return {
      label: item.supplierName,
      value: item.id,
      ...item
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

// 打开关联订单
const openOrder = async () => {
  // console.log(form.value)
  recordDialog.visible = true
  recordDialog.title = '关联订单'
  queryOrderParams.value = deepClone(initQueryOrder)
  queryOrderParams.value.type = form.value.type
  if (queryOrderParams.value.type == 1) {
    queryOrderParams.value.customerId = form.value.customerId
  } else {
    queryOrderParams.value.supplierId = form.value.supplierId
  }
  await getRecordList()
  if (form.value?.saleOrderId) {
    nextTick(() => {
      const crtRecord = recordList.value.find((f: any) => f.id == form.value.saleOrderId)
      selectRecordChange({ row: crtRecord, checked: true })
    })
  }
}
const cancelOrder = () => {
  recordDialog.visible = false
}
const confirmOrder = () => {
  console.log(recordInfo.value)
  form.value.saleOrderId = recordInfo.value?.id || undefined
  form.value.saleOrderCode = recordInfo.value?.saleOrderCode || undefined
  recordDialog.visible = false
}
const selectRecordChange = ({row,checked}: any) => {
  const $table = customOrderTableRef.value.xTableRef
  if ($table) {
    $table.clearCheckboxRow()
    $table.setCheckboxRow(row,checked)
    if (checked) {
      recordInfo.value = row
    } else {
      recordInfo.value = undefined
    }
  }
}

// 新增责任人
const addResponsibibility = () => {
  responsibilityData.value.push({
    userId: undefined,
    price: undefined
  })
}
// 删除责任人
const delResponsibibility = (row: any, rowIndex: any) => {
  responsibilityData.value.splice(rowIndex, 1)
}

onMounted(() => {
  getList();

  getListCust();
  setCustomerList();
  setSupplierList();
  // setUserList();
});
</script>
<style lang="scss" scoped>
.labelTip {
  color: #adb2b7;
  font-size: 12px;
  width: 100%;
}
</style>

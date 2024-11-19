<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs @tab-click="radioTableHandle" v-model="radioTable" class="xtable-tab">
        <el-tab-pane label="本厂地址" name="本厂地址">
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </div>
          <XTable toolId="basedataAddressCompany"  :loading="loading" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: total }" :data="addressList" :columnList="columnList" ref="XTableRef" :showRefresh="true"
            border @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">

            <template #default-isDefault="scope">
              <el-switch @change="changeDeafultAddress(scope.row)" v-model="scope.row.isDefault" :active-value="1"
                         :inactive-value="0" />
            </template>
            <template #default-status="scope">
              <el-switch @change="changeStatusFlag(scope.row)" v-model="scope.row.status" active-value="1" inactive-value="0" />
            </template>
            <template #default-make="scope">
              <el-button link type="primary"  @click="handleUpdate(scope.row)"
                >修改</el-button>
              <el-button link type="danger"  @click="handleDelete(scope.row)"
                >删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="客户地址" name="客户地址">
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </div>
          <XTable toolId="basedataAddressCustomer" :loading="custLoading" v-model:page-size="custQueryParams.pageSize" v-model:current-page="custQueryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: cusTotal }" :data="customerAddressList" :columnList="customerColumnList" :showRefresh="true"
            ref="custTableRef" border @searchChange="searchCustChange" :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }">
            <!-- <template #default-isDefault="scope">
              <div v-for="item in isDefalutList">
                <span>{{ item.value == scope.row.isDefault ? item.label : "" }}</span>
              </div>
            </template> -->
            <template #default-isDefault="scope">
              <el-switch @change="changeDeafultAddress(scope.row)" v-model="scope.row.isDefault" :active-value="1"
                         :inactive-value="0" />
            </template>
            <template #default-status="scope">
              <el-switch @change="changeStatusFlag(scope.row)" v-model="scope.row.status" active-value="1" inactive-value="0" />
            </template>
            <template #default-make="scope">
              <el-button link type="primary"  @click="handleUpdate(scope.row)"
                >修改</el-button>
              <el-button link type="danger"  @click="handleDelete(scope.row)"
                >删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="供应商地址" name="供应商地址">
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </div>
          <XTable toolId="basedataAddressSupplier" :loading="supplierLoading" v-model:page-size="custQueryParams.pageSize" v-model:current-page="custQueryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: supplierTotal }" :data="supplierAddressList" :showRefresh="true"
            :columnList="supplierColumnList" ref="supplierTableRef" border @searchChange="searchSupplierChange"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <!-- <template #default-isDefault="scope">
              <div v-for="item in isDefalutList">
                <span>{{ item.value == scope.row.isDefault ? item.label : "" }}</span>
              </div>
            </template> -->
            <template #default-isDefault="scope">
              <el-switch @change="changeDeafultAddress(scope.row)" v-model="scope.row.isDefault" :active-value="1"
                         :inactive-value="0" />
            </template>
            <template #default-status="scope">
              <el-switch @change="changeStatusFlag(scope.row)" v-model="scope.row.status" active-value="1" inactive-value="0" />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdate(scope.row)"
                >修改</el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)"
                >删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->
    <!-- 添加或修改本厂地址对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="55%">
      <el-form ref="addressFormRef" :model="form" :rules="rules" label-width="120px" v-loading="dialogTableLoading">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="地址类型：" prop="type">
              <el-radio-group v-model="form.type" :disabled="dialog.title?.includes('修改')" @change="addressTypeChange">
                <el-radio v-for="dict in typeList" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="是否默认：" prop="isDefault">
              <el-radio-group v-model="form.isDefault">
                <el-radio v-for="dict in isDefalutList" :key="dict.value" :label="Number(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type === '1'">
            <el-form-item label="客户名称：" prop="customerId">
              <el-select v-if="checkPermi(['system:address:view'])" v-model="form.customerId" :disabled="dialog.title?.includes('修改')" placeholder="请选择客户"
                clearable filterable transfer style="width: 100%" popup-class-name="pop-select">
<!--                <el-option v-for="item in customerList" :key="item.value" :label="item.label"-->
<!--                  :value="item.value"></el-option>-->
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.customerCode +'-'+ item.customerName"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.customerCode }}</span>
                  <span
                    style="
                          float: right;
                          padding-left: 20px;
                        "
                  >{{ item.customerName }}</span
                  >
                </el-option>
              </el-select>

              <el-select v-hasNotPermi="['system:address:view']" v-model="form.customerId" :disabled="dialog.title?.includes('修改')" placeholder="请选择客户名称"
                         clearable filterable transfer style="width: 100%" popup-class-name="pop-select">
                <!--                <el-option v-for="item in customerList" :key="item.value" :label="item.label"-->
                <!--                  :value="item.value"></el-option>-->
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.customerCode"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.customerCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type === '3'">
            <el-form-item label="供应商名称：" prop="supplierId">
              <el-select v-model="form.supplierId" :disabled="dialog.title?.includes('修改')" placeholder="请选择供应商"
                clearable filterable transfer style="width: 100%" popup-class-name="pop-select">
                <el-option v-for="item in supplierList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"></el-col>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="name">
              <el-input v-model="form.name" placeholder="联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="phone">
              <el-input v-model="form.phone" placeholder="联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址：" prop="address">
              <el-input v-model="form.address" placeholder="联系地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流周期：" prop="logisticsCycle">
              <!-- <el-input type="number" v-model="form.logisticsCycle" placeholder="请输入物流周期" /> -->
              <el-input-number style="width: 100%;" v-model="form.logisticsCycle" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
  </div>
</template>

<script setup name="Address" lang="ts">
import {

  updateCustomerAddress,

} from "@/api/basedata/customerAddress";
import { CustomerAddressVO, CustomerAddressForm, CustomerAddressQuery } from "@/api/basedata/customerAddress/types";
import { postlistAddress, getAddress, delAddress, addAddress, updateAddress } from '@/api/basedata/address';
import { AddressVO, AddressQuery, AddressForm } from '@/api/basedata/address/types';
import {getListCustomer, listCustomer } from '@/api/basedata/customer';
import { CustomerVO } from '@/api/basedata/customer/types';
import { listSupplier } from '@/api/basedata/supplier';
import { SupplierVO } from '@/api/basedata/supplier/types';
import {checkPermi} from "@/utils/permission";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const addressList = ref<AddressVO[]>([]);
const customerAddressList = ref<AddressVO[]>([]);
const supplierAddressList = ref<AddressVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const custLoading = ref(true);
const supplierLoading = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const cusTotal = ref(0);
const supplierTotal = ref(0);
const addressFormRef = ref<ElFormInstance>();
const dialogTableLoading = ref(false)
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: AddressForm = {
  id: undefined,
  name: undefined,
  phone: undefined,
  address: undefined,
  logisticsCycle: undefined,
  isDefault: 1,
  remark: undefined,
  customerId: undefined,
  type: undefined,
  ownerId: undefined
}
const data = reactive<PageData<AddressForm, AddressQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    name: undefined,
    phone: undefined,
    address: undefined,
    logisticsCycle: undefined,
    isDefault: undefined,
    customerId: undefined,
    type: undefined,
    ownerId: undefined,
    params: {}
  },
  rules: {
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
      { required: true, message: "是否默认不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "地址类型不能为空", trigger: "blur" }
    ]
    ,
    customerId: [
      { required: true, message: "请选择客户", trigger: "blur" }
    ]
    ,
    supplierId: [
      { required: true, message: "请选择供应商", trigger: "blur" }
    ]
  }
});

const custData = reactive<PageData<AddressForm, AddressQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    name: undefined,
    phone: undefined,
    address: undefined,
    logisticsCycle: undefined,
    isDefault: undefined,
    customerId: undefined,
    type: undefined,
    ownerId: undefined,
    params: {}
  },
  rules: {}
});

const XTableRef = ref();
const custTableRef = ref();
const supplierTableRef = ref();
const isDefalutList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "0" },
]);
const statusList = ref([
  { label: '启用', value: "1" },
  { label: '已禁用', value: "0" },
]);
const typeList = ref([
  { label: '本厂地址', value: "2" },
  { label: '客户地址', value: "1" },
  { label: '供应商地址', value: "3" },
]);
const columnList = ref([
  //{ type: 'checkbox', align: 'center', field: "checkbox", width: '40', },
  { title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false },
  { title: '联系人', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系人' } },
  { title: '联系电话', field: 'phone', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系电话' } },
  { title: '联系地址', field: 'address', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系地址' } },
  { title: '物流周期', field: 'logisticsCycle', align: 'center' },
  { title: '是否默认', field: 'isDefault', align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请选择默认' }, filterData: () => isDefalutList.value },
  { title: '备注', field: 'remark', align: 'center' },
   { title: '状态', field: 'status', align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请选择状态' }, filterData: () => statusList.value },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false },
]);

const customerCodeList = ref();
const customerNameList = ref();
const customerColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false },
  // { title: '客户编码', field: 'customerCode', align: 'center', width: '70', filterType: 'input', filterParam: { placeholder: '请输入编码' }},
  // { title: '客户名称', field: 'customerName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' },isPermi: () => checkPermi(['system:address:view']) },
  
  {title: '客户编码', field: 'customerCode', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
  {title: '客户名称', field: 'customerName', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerNameList.value ,isPermi: () => checkPermi(['system:address:view']) },
  
  { title: '联系人', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系人' } },
  { title: '联系电话', field: 'phone', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系电话' } },
  { title: '联系地址', field: 'address', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系地址' } },
  { title: '物流周期', field: 'logisticsCycle', align: 'center' },
  { title: '是否默认', field: 'isDefault', align: 'center', filterType: 'radio', filterParam: { placeholder: '请输入是否默认' }, filterData: () => isDefalutList.value },
  { title: '备注', field: 'remark', align: 'center' },
    { title: '状态', field: 'status', align: 'center',  filterType: 'radioButton', filterParam: { placeholder: '请选择状态' }, filterData: () => statusList.value  },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false },
]);
const supplierColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false },
  { title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '联系人', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系人' } },
  { title: '联系电话', field: 'phone', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系电话' } },
  { title: '联系地址', field: 'address', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入联系地址' } },
  { title: '物流周期', field: 'logisticsCycle', align: 'center' },
  { title: '是否默认', field: 'isDefault', align: 'center', filterType: 'radio', filterParam: { placeholder: '请输入是否默认' }, filterData: () => isDefalutList.value },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '状态', field: 'status', align: 'center',  filterType: 'radioButton', filterParam: { placeholder: '请选择状态' }, filterData: () => statusList.value },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false },
]);
//const checkedAddressList = ref<AddressVO[]>([]);
const { queryParams, form, rules } = toRefs(data);
const { queryParams: custQueryParams } = toRefs(custData);
const customerList = ref<Array<{ label: string, value: number }>>([]);
const supplierList = ref<Array<{ label: string, value: number }>>([]);

//改变地址的默认地址
const changeDeafultAddress = async (row?: any) => {
  const data: any = {};
  Object.assign(data, row);
  await updateCustomerAddress(data).then(() =>
    proxy?.$modal.msgSuccess("修改成功")
  ).catch((e) =>
    console.log(e)
  ).finally(() =>
    buttonLoading.value = false
  );
   if (radioTable.value == '本厂地址') {
    await getList();
  } else if (radioTable.value == '客户地址') {
    await getCustList();
  } else {
    await getSuppliertList();
  }
};


/** 状态修改 */
const changeStatusFlag = async (row?: any) => {
  const data: any = {};
  Object.assign(data, row);
  await updateCustomerAddress(data).then(() =>
    proxy?.$modal.msgSuccess("修改成功")
  ).catch((e) =>
    console.log(e)
  ).finally(() =>
    buttonLoading.value = false
  );
   if (radioTable.value == '本厂地址') {
    await getList();
  } else if (radioTable.value == '客户地址') {
    await getCustList();
  } else {
    await getSuppliertList();
  }
}


//头部按钮组
const radioTable = ref('本厂地址');
// 切换菜单栏不刷新
const radioTableHandle = (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;
  //getList()
}
//地址类型切换
const addressTypeChange = (val: any) => {
  console.log(dialog.title)
  let dialogHead: string = "添加";;
  let dialogTitle: string = "本厂地址";;
  if (dialog.title?.includes('修改')) {
    dialogHead = "修改";
  }
  if (form.value.type == '1') {
    dialogTitle = "客户地址";
  } else if (form.value.type == '3') {
    dialogTitle = "供应商地址";
  }
  dialog.title = dialogHead + dialogTitle;
  console.log("dialog.title", dialog.title);
}
// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}
// 获取 客户地址搜索条件
const searchCustChange = (params: any) => {
  queryParams.value = params
  getCustList()
}
// 获取 供应商地址搜索条件
const searchSupplierChange = (params: any) => {
  queryParams.value = params
  getSuppliertList();
}
/** 查询本厂地址列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.type = '2';

  queryParams.value.customerIdList=queryParams.value.customerCode;
  queryParams.value.customerCode=undefined;

  const res = await postlistAddress(queryParams.value);
  addressList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询客户地址列表 */
const getCustList = async () => {
  custLoading.value = true;
  queryParams.value.type = '1';
  queryParams.value.customerIdList=queryParams.value.customerCode;
  queryParams.value.customerNameIdList=queryParams.value.customerName;
  queryParams.value.customerName=undefined;
  queryParams.value.customerCode=undefined;
  const res = await postlistAddress(queryParams.value);
  customerAddressList.value = res.rows;
  cusTotal.value = res.total;
  custLoading.value = false;
}
/** 查询供应商地址列表 */
const getSuppliertList = async () => {
  supplierLoading.value = true;
  queryParams.value.type = '3';
  queryParams.value.customerIdList=queryParams.value.customerCode;
  queryParams.value.customerNameIdList=queryParams.value.customerName;
  queryParams.value.customerName=undefined;
  queryParams.value.customerCode=undefined;
  const res = await postlistAddress(queryParams.value);
  supplierAddressList.value = res.rows;
  supplierTotal.value = res.total;
  supplierLoading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  addressFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: AddressVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  //地址类型默认参数设置
  if (radioTable.value == '本厂地址') {
    form.value.type = '2';
  } else if (radioTable.value == '客户地址') {
    form.value.type = '1';
  } else {
    form.value.type = '3';
  }
  dialog.visible = true;
  dialog.title = "添加" + radioTable.value;
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AddressVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "修改" + radioTable.value;
  dialogTableLoading.value = true
  const _id = row?.id || ids.value[0]
  const res = await getAddress(_id);
  const tmp = JSON.parse(JSON.stringify(res.data));
  tmp.isDefault = Number(tmp.isDefault);
  tmp.customerId = String(tmp.customerId);
  tmp.type = tmp.type;
  form.value = tmp;
  console.log("form.value", form.value);
  dialogTableLoading.value = false
   if (radioTable.value == '本厂地址') {
    await getList();
  } else if (radioTable.value == '客户地址') {
    await getCustList();
  } else {
    await getSuppliertList();
  }
}

/** 提交按钮 */
const submitForm = () => {
  addressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      setDefalut();
      if (form.value.id) {
        await updateAddress(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addAddress(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      if (form.value.type == '1') {
        await getCustList();
      } else if (form.value.type == '2') {
        await getList();
      } else {
        await getSuppliertList();
      }
    }
  });
}
const setDefalut = () => {
  //本厂地址默认参数设置
  if (form.value.type == '2') {
    form.value.customerId = 0;
  }
}
/** 删除按钮操作 */
const handleDelete = async (row?: AddressVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('如果该地址被使用过，删除后会导致无法显示，建议将状态设为禁用! 请确认是否继续删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delAddress(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  if (radioTable.value == '本厂地址') {
    await getList();
  } else if (radioTable.value == '客户地址') {
    await getCustList();
  } else {
    await getSuppliertList();
  }

}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/address/export', {
    ...queryParams.value
  }, `address_${new Date().getTime()}.xlsx`)
}

const setCustomerList = async () => {
  const res: any = await getListCustomer();
  customerList.value = res.data.map((item: CustomerVO) => {
    return {
      id : String(item.id),
      customerName: item.customerName,
      customerCode: item.customerCode
    }
  })
}

const setSupplierList = async () => {
  const res: any = await listSupplier(queryParams.value);
  supplierList.value = res.rows.map((item: SupplierVO) => {
    return {
      label: item.supplierName,
      value: item.id
    }
  })
}

const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerCode } });
      customerNameList.value = resCust.map(item=>{ return { value:item.id, label:item.customerName } });
    }
}

onMounted(() => {
  getListCust();
  getList();
  getCustList();
  getSuppliertList();

  setCustomerList();
  setSupplierList();
});
</script>
<style lang="scss" scoped>
.addCustomerInput {
  display: grid !important;
}

.pop-select {
  width: 100%;
}
</style>

<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8" style=" margin-right: 0px;justify-content: end;">
          <el-col :span="1.5">
            <!-- v-if="checkPermi(['basedata:deliveryConfig:add'])" -->
            <el-button type="primary"  @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>
      </template>

      <XTable toolId="deliverPrintConfigList" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" :showRefresh="true"
        :page-params="{ perfect: true, total: total }" :data="deliveryConfigList" :columnList="columnList" ref="XTableRef"
        border @searchChange="searchChange" :column-config="{ resizable: true }" :checkbox-config="{ reserve: true }"
        class="xtable-content" :row-config="{ keyField: 'id' }">
        <template #default-type="scope">
          <span>
            {{ configTypeStrings[scope.row.type as keyof typeof ConfigTypeEnum] }}
          </span>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.type=='2'||scope.row.type=='4'" link type="primary" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" @click="preDetail(scope.row)">详情</el-button>
        </template>
      </XTable>
    </el-card>

    <el-drawer  v-model="dialog.visible" :title="dialog.title" size="55%" 
      modal-class="mi-drawer-scoped"
        draggable>
      <el-form border label-width="120px" :disabled="dialog.title?.includes('详情') || dialog.title?.includes('审核')"
        ref="deliveryConfigFormRef" :model="form" :rules="rules">

        <el-row>

          <el-col :span="24">
            <el-form-item size="small" label="客户名称显示:" prop="showType">
              <el-radio-group style="width: 98%;" v-model="form.showType" >
                <el-radio style="width: 12%;"  :label="ConfigTypeEnum.CUSTOMER_SHOW_CODE"  >客户编码</el-radio>
                <el-radio style="width: 12%;"  :label="ConfigTypeEnum.CUSTOMER_SHOW_NAME"  >客户名称</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="配置类型:" prop="type">
              <el-radio-group style="width: 98%;" v-model="form.type" :disabled="form.type=='1'||form.type=='3'">
                <el-radio style="width: 12%;" v-if="form.type&&form.type=='1'" :label="ConfigTypeEnum.COMMON" :disabled="true">通用送货格式</el-radio>
                <el-radio style="width: 12%;" v-if="form.type&&form.type=='3'" :label="ConfigTypeEnum.BACK" :disabled="true">通用退货格式</el-radio>
                <el-radio style="width: 12%;" v-if="form.type!='3'&&form.type!='1'" :label="ConfigTypeEnum.CUSTOMER" >客户送货格式</el-radio>
                <el-radio style="width: 12%;" v-if="form.type!='3'&&form.type!='1'" :label="ConfigTypeEnum.CUSTOMER_BACK" >客户退货格式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="待选列名:">
              <el-checkbox-group v-model="form.waitCheck" @change="handleCheckedChangeDept">
                <el-checkbox style="width: 12%;" v-for="item in waitCheckCol" :value="item.value" :key="item.value"
                  :label="item.label" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="已选列名:">
              <el-row style="font-size:12px;min-height:24px;width:100%">
                <el-col :span="24">
                  <span v-if="validateColWidth" style="color: red;">列宽合计不能大于100%，请调整列宽</span>
                </el-col>
              </el-row>

              <XTable :pageShow="false" :data="checkedDeliveryConfigList" :columnList="checkedColumnList"
                ref="checkedXTableRef" border keep-source :column-config="{ resizable: true }"
                :checkbox-config="{ reserve: true }" :edit-rules="validRules"
                :edit-config="{ trigger: 'click', mode: 'row', autoClear: true, showStatus: true }" height="430px"
                :disabled="dialog.title?.includes('详情') || dialog.title?.includes('审核')"
                :show-footer="true" :footer-method="footerMethod"
                :scroll-y="{ enabled: true, gt: 10 }" :row-config="{ keyField: 'id' }">
                <template #default-aliasName="{ row, rowIndex }">
                  <span>{{ row.aliasName }}</span>
                </template>
                <template #edit-aliasName="{ row }">
                  <el-input v-model="row.aliasName" maxlength="100"></el-input>
                </template>
                <template #default-colWidth="{ row, rowIndex }">
                  <span>{{ row.colWidth }}</span>
                </template>
                <template #edit-colWidth="{ row }">
                  <el-input-number v-model="row.colWidth" style="width:100%" :precision="0" maxLength="5"
                    @change="clearValidate" :controls="false" type="number" :min="0" />
                </template>
                <template #default-make="{ row, rowIndex }">
                  <el-button link type="primary" v-if="rowIndex > 0" @click="rowUp(row, rowIndex)">上移</el-button>
                  <el-button link type="primary" v-if="rowIndex < (checkedDeliveryConfigList.length - 1)"
                    @click="rowDown(row, rowIndex)">下移</el-button>
                </template>
              </XTable>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="font-size:12px">
          <el-col :span="3" style="display: flex;justify-content: end;">
            <span style="color: red;">*注：</span>
          </el-col>
          <el-col :span="10">
            <span style="color: red;">1、三联纸大小有限，请适度选择要显示的列</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 18px;font-size:12px">
          <el-col :span="3">
            <span style="color: red;"></span>
          </el-col>
          <el-col :span="14" >
            <span style="color: red;">2、列宽之和不足100%列时，会自动补齐到最后一列</span>
          </el-col>
          <el-col :span="4" v-if="form.type == '1'||form.type == '3'" style="display: flex;justify-content: center;">
            <el-button type="primary" @click="doPrePrint">预览</el-button>
          </el-col>
        </el-row>

        <el-row v-if="!form.type || form.type == '2'|| form.type == '4'">
          <el-col :span="6">
            <el-form-item label="客户：" prop="customerId">
              <el-select v-model="form.customerId"
                :disabled="dialog.title?.includes('详情') || dialog.title?.includes('审核')" @change="setCustomerName"
                clearable filterable transfer style="width: 100%" popup-class-name="pop-select">
                <el-option v-for="item in customerList" :key="item.id" :label="item.customerCode"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item size="small" label="客户地址：" prop="addressId">
              <el-input v-model="form.customerAddress" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="4" style="display: flex;justify-content: center;">
            <el-button type="primary" @click="doPrePrint">预览</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item size="small" label="备注:">
              <el-input maxlength="1000" v-model="form.remark"
                :disabled="dialog.title?.includes('详情') || dialog.title?.includes('审核')" :rows="2" type="textarea"
                placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" type="primary" v-show="dialog.title?.includes('修改') || dialog.title?.includes('添加')"
              @click="submitForm">
              保 存
            </el-button>
            <el-button :loading="buttonLoading" @click="dialog.visible = false">取 消</el-button>
          </span>
        </div>
      </template>
    </el-drawer>
    <DeliveryPrint ref="deliverCardRef" />
  </div>
</template>

<script setup name="DeliveryConfig" lang="ts">
import { postListDeliveryConfig, getDeliveryConfig, delDeliveryConfig, addDeliveryConfig, updateDeliveryConfig } from '@/api/basedata/deliveryConfig';
import { DeliveryConfigVO, DeliveryConfigQuery, DeliveryConfigForm, ConfigTypeEnum, configTypeStrings } from '@/api/basedata/deliveryConfig/types';
import { VXETable, VxeTableInstance, VxeTablePropTypes } from "vxe-table";
import { getListCustomer } from "@/api/basedata/customer";
import { listCustomerAddressByCusId } from "@/api/basedata/customerAddress";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const validateColWidth = ref(false);
const deliverCardRef = ref();
const deliveryConfigList = ref<DeliveryConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);

const waitCheckCol = [
  { value: 'commodityCode', label: '产品编码' },
  { value: 'commodityName', label: '产品名称' },
  { value: 'customerPo', label: '客户PO号' },
  { value: 'customerMaterialCode', label: '客户物料编码' },
  { value: 'customerMaterialName', label: '客户物料名称' },
  { value: 'specification', label: '规格型号' },
  { value: 'unit', label: '单位' },
  { value: 'orderQuantity', label: '订货数量' },
  { value: 'quantity', label: '交货数量' },
  { value: 'reserveQuantity', label: '备品数量' },
  { value: 'waitDeliveryQuantity', label: '差欠数量' },
  { value: 'caseNum', label: '箱数' },
  { value: 'remark', label: '送货备注' },
  { value: 'packRequirement', label: '包装要求' },
  { value: 'dispatchTime', label: '客户交期' },
  { value: 'urgent', label: '加急' },
  { value: 'commodityType', label: '产品类型' },
  { value: 'preDeliveryHour', label: '提前发货' },
];

const checkedXTableRef = ref();
const deliveryConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeliveryConfigForm = {
  id: undefined,
  remark: undefined,
  customerId: undefined,
  deliveryConfig: undefined,
  seq: undefined,
  type: undefined,
  ownerId: undefined,
  showType:'11',
  waitCheck: []
}
const data = reactive<PageData<DeliveryConfigForm, DeliveryConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerId: undefined,
    deliveryConfig: undefined,
    seq: undefined,
    type: undefined,
    ownerId: undefined,
    customerAddress: undefined,
    params: {
    }
  },
  rules: {
    customerId: [
      { required: true, message: "客户不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
  }
});

const XTableRef = ref()
const customerCodeList = ref();
const customerNameList = ref();
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '类型', field: 'type', width: '100', align: 'center' },
  //{ title: '客户编码', field: 'customerCode', width: '100', align: 'center', filterType: 'input' },
  //{ title: '客户名称', field: 'customerName', width: '100', align: 'center', filterType: 'input' },
  { title: '客户编码', field: 'customerCode', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value },
  { title: '客户名称', field: 'customerName', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerNameList.value },
 
  { title: '出货单配置列', field: 'deliveryConfigListStr', width: '400', align: 'center' },
  { title: '修改时间', field: 'updateTime', width: '100', align: 'center' },
  { title: '修改人', field: 'updateByName', width: '100', align: 'center' },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false },
  { title: '列名', field: 'colName', width: '120', align: 'center', },
  { title: '别名', field: 'aliasName', width: '200', align: 'center', showOverflow: false, editRender: {} },
  { title: '列宽(%)', field: 'colWidth', width: '200', align: 'center', showOverflow: false, editRender: {} },
  { title: '操作', field: 'make', align: 'center', width: '160', showOverflow: false, fixed: 'right', },
]);

const checkedDeliveryConfigList = ref<DeliveryConfigVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

//Tab正整数校验
const positiveIntValid = (cellValue: any) => {
  if (!/^[1-9]\d*$/.test(cellValue)) {
    return new Error('请输入正整数')
  }
  if (cellValue > 100) {
    return new Error('请输入小于100的数')
  }
  //输出的参数合计大于100
  let _total = 0;
  checkedDeliveryConfigList.value.forEach(item => {
    _total += Number(item.colWidth);
  });
  if (_total > 100) {
    return new Error('列宽之和不能大于100%')
  }
}
VXETable.validators.add('positiveIntValid', {
  cellValidatorMethod({ cellValue }) {
    return positiveIntValid(cellValue)
  }
})
const validRules = ref<VxeTablePropTypes.EditRules>({
  colWidth: [
    { required: true, validator: 'positiveIntValid', message: "请输入正整数" }
  ],
  aliasName: [
    { required: true }
  ],
  type: [
    { required: true }
  ],
})
const footerMethod: VxeTablePropTypes.FooterMethod<DeliveryConfigVO> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "colWidth") {
        return `${sumNum(data, "colWidth")} `;
      }
      return "";
    })
  ];
};
const sumNum = (list: DeliveryConfigVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    // console.log(field + ': --' + item[field])
    count += Number(item[field] || 0);
  });
  return Number(count.toFixed(4));
};

const rowUp = async (row: any, rowIndex: number) => {
  console.log(row, rowIndex);
  const _list = checkedDeliveryConfigList.value;
  const _index = _list.findIndex(item => item.id === row.id);
  const _temp = _list[_index];
  _list[_index] = _list[_index - 1];
  _list[_index - 1] = _temp;
  checkedDeliveryConfigList.value = _list;
  console.log(checkedDeliveryConfigList.value);
  await checkedXTableRef.value.xTableRef.reloadData(checkedDeliveryConfigList.value);
}

const rowDown = async (row: any, rowIndex: number) => {
  console.log(row, rowIndex);
  const _list = checkedDeliveryConfigList.value;
  const _index = _list.findIndex(item => item.id === row.id);
  const _temp = _list[_index];
  _list[_index] = _list[_index + 1];
  _list[_index + 1] = _temp;
  checkedDeliveryConfigList.value = _list;
  console.log(checkedDeliveryConfigList.value);
  //await checkedXTableRef.value.xTableRef.updateData();
  await checkedXTableRef.value.xTableRef.reloadData(checkedDeliveryConfigList.value);
}

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}

/** 查询deliveryConfig列表 */
const getList = async () => {
  loading.value = true;
  
  queryParams.value.customerIdList=queryParams.value.customerCode;
  queryParams.value.customerNameIdList=queryParams.value.customerName;
  queryParams.value.customerCode=undefined;
  queryParams.value.customerName=undefined;

  const res = await postListDeliveryConfig(queryParams.value);
  deliveryConfigList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deliveryConfigFormRef.value?.resetFields();
  checkedDeliveryConfigList.value = [];
}


/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加送货单打印配置";
}

const handleCheckedChangeDept = (value: string[]) => {

  const isUpdate = dialog.title?.includes('修改');
  const isAdd = dialog.title?.includes('添加');

  let _total = 0;
  if (isUpdate) {
    checkedDeliveryConfigList.value.forEach(item => {
      _total += Number(item.colWidth ? item.colWidth : 0);
    });
  }

  const _list = value.map((item, index) => {
    const _check = waitCheckCol.filter(item2 => item2.label == item);
    let colWidth = 0;
    //最后一个直接补齐
    if (isUpdate) {
      if (index == value.length - 1) {
        colWidth = Number(100 - _total).toFixed(0);
      } else {
        checkedDeliveryConfigList.value.filter(item2 => item2.colName == item).forEach(item2 => {
          colWidth = item2.colWidth;
        });
      }
    }
    if (isAdd) {
      let addWidth = Number(100 / value.length).toFixed(0);
      if (index == value.length - 1) {
        addWidth = 100 - (addWidth * (value.length - 1));
      }
      colWidth = addWidth;
    }

    return {
      id: index,
      colName: item,
      aliasName: item,
      colValue: _check && _check.length > 0 ? _check[0].value : item,
      colWidth: colWidth,
    }
  });
  checkedDeliveryConfigList.value = _list;
}

const handleDetail = async (row?: DeliveryConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeliveryConfig(_id);
  Object.assign(form.value, res.data);

  //设置地址
  if (form.value.customerId) {
    setCustomerName(form.value.customerId);
  }
  //构建已选List
  let checkList: any = [];
  const _list = res.data.deliveryConfig.map((item, index) => {
    checkList.push(item.colName);
    return {
      id: index,
      colName: item.colName,
      aliasName: item.aliasName,
      colWidth: item.colWidth,
      colValue: item.colValue,
    }
  });
  checkedDeliveryConfigList.value = _list;
  form.value.waitCheck = checkList;
  dialog.visible = true;
  dialog.title = "送货单打印配置详情";
}

const preDetail = async (row?: DeliveryConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeliveryConfig(_id);
  Object.assign(form.value, res.data);

  //设置地址
  if (form.value.customerId) {
    await setCustomerName(form.value.customerId);
  }
  //构建已选List
  let checkList: any = [];
  const _list = res.data.deliveryConfig.map((item, index) => {
    checkList.push(item.colName);
    return {
      id: index,
      colName: item.colName,
      aliasName: item.aliasName,
      colWidth: item.colWidth,
      colValue: item.colValue,
    }
  });
  checkedDeliveryConfigList.value = _list;
  form.value.waitCheck = checkList;
  await deliverCardRef.value.doDemoPrint(form.value);
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DeliveryConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeliveryConfig(_id);
  Object.assign(form.value, res.data);

  //设置地址
  if (form.value.customerId) {
    await setCustomerName(form.value.customerId);
  }
  //构建已选List
  let checkList: any = [];
  const _list = res.data.deliveryConfig.map((item, index) => {
    checkList.push(item.colName);
    return {
      id: index,
      colName: item.colName,
      aliasName: item.aliasName,
      colWidth: item.colWidth,
      colValue: item.colValue,
    }
  });
  checkedDeliveryConfigList.value = _list;
  form.value.waitCheck = checkList;
  dialog.visible = true;
  dialog.title = "修改送货单打印配置";
}

const validateInfo = async () => {
  //明细校验
  let _valid = true;
  if (checkedDeliveryConfigList.value.length == 0) {
    proxy?.$modal.msgError("请选择出货单配置列");
    return;
  }
  const $table = checkedXTableRef.value.xTableRef;
  if ($table) {
    let errMap = await $table.validate(true);
    if (errMap) {
      _valid = false;
    }
  }
  await deliveryConfigFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      _valid = false;
    }
  });

  //显示提示
  let _total = 0;
  checkedDeliveryConfigList.value.forEach(item => {
    _total += Number(item.colWidth);
  });
  if (_total > 100) {
    validateColWidth.value = true;
  }

  return _valid;
}


const clearValidate = async (row?: any) => {
  validateColWidth.value = false;
}


/** 提交按钮 */
const submitForm = async () => {
  let _valid = await validateInfo();
  if (!_valid) {
    return;
  }
  buttonLoading.value = true;
  const checkTabList = checkedXTableRef.value.xTableRef.getTableData().fullData;
  checkTabList.forEach((item, index) => {
    item.seq = index
  });
  form.value.deliveryConfig = checkTabList;
  console.log(form.value);
  console.log(checkTabList);
  if (form.value.id) {
    await updateDeliveryConfig(form.value).finally(() => buttonLoading.value = false);
  } else {
    //form.value.type = ConfigTypeEnum.CUSTOMER;
    await addDeliveryConfig(form.value).finally(() => buttonLoading.value = false);
  }
  proxy?.$modal.msgSuccess("修改成功");
  dialog.visible = false;
  await getList();
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeliveryConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delDeliveryConfig(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}


/**
 * 客户
 */
let customerList: any[] = [];
const getCustomerList = async () => {
  const res = await getListCustomer();
  customerList = res.data;
}

const setCustomerName = async (value: string) => {
  form.value.customerCode = undefined;
  form.value.customerAddress = undefined;

  const selectedOption = customerList.find(option => option.id === value);
  console.log(customerList, value, selectedOption);
  form.value.customerCode = selectedOption.customerCode;
  form.value.customerName = selectedOption.customerName;

  const res = await listCustomerAddressByCusId(value);
  console.log(res);
  //默认选中默认地址
  res.forEach((item: any) => {
    if (item.isDefault == 1) {
      form.value.customerAddress = item.address;
    }
  });
  if (res.length > 0 && !form.value.customerAddress) {
    form.value.customerAddress = res[0].address;
  }
}

const doPrePrint = async () => {
  let _valid = await validateInfo();
  if (!_valid) {
    return;
  }
  const checkTabList = checkedXTableRef.value.xTableRef.getTableData().fullData;
  checkTabList.forEach((item, index) => {
    item.seq = index
  });
  form.value.deliveryConfig = checkTabList;
  console.log(form.value);
  await deliverCardRef.value.doDemoPrint(form.value);
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
  getCustomerList();
});
</script>

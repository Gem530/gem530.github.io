<template>
  <el-form
    border
    label-width="100px"
    :disabled="props.type == HandleEnum.INFO || props.type == HandleEnum.EXAMINE"
    ref="accountFormRef"
    :model="form"
    :rules="rules"
  >
    <el-row>
      <el-col v-if="props.showCraftSelect" :span="4">
        <el-form-item size="small" label="工序名称" prop="craftId">
          <el-select v-model="form.craftId" clearable filterable placeholder="请选择工序" style="width: 100%;">
            <el-option v-for="item in craftList" :key="item.id" :label="item.craftName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="props.showCategorySelect" :span="6">
        <el-form-item size="small" label="物料类别：" prop="categoryId">
          <el-select clearable :disabled="props.type == HandleEnum.EDIT" placeholder="请选择物料类别" style="width: 100%;" v-model="form.categoryId">
            <el-option v-for="item in rawMaterialCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="props.showCustomerSelect" :span="6">
        <el-form-item size="small" label="客户：" prop="companyId">
          <el-select
            :disabled="props.type == HandleEnum.EDIT"
            placeholder="请选择客户"
            style="width: 100%;"
            v-model="form.companyId"
            @change="selectCustomerChange"
            filterable
          >
            <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.companyId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="props.showSupplierSelect" :span="6">
        <el-form-item size="small" label="供应商：" prop="supplierId">
          <el-select
            :disabled="props.type == HandleEnum.EDIT"
            placeholder="请选择供应商"
            style="width: 100%;"
            v-model="form.supplierId"
            @change="selectSupplierChange"
            filterable
          >
            <el-option v-for="item in SupplierList" :key="item.id" :label="item.supplierCode+'-'+item.supplierName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="props.showSupplierStr" :span="6">
        <el-form-item size="small" label="客户：" prop="customerName">
          <el-input v-model="form.customerName" :disabled="true" style="width: 100%;" />
        </el-form-item>
      </el-col>

      <!-- <el-col v-if="props.showCurrency" :span="3">
        <el-form-item size="small" label="币种："> 人民币</el-form-item>
      </el-col> -->
      <el-col :span="3">
        <el-form-item size="small" label="币种："> {{ form.currency }}</el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item size="small" label="对账日期：" prop="accountTime">
          <el-date-picker
            v-model="form.accountTime"
            style="width: 100%;"
            type="date"
            placeholder="选择日期时间"
            @change="handleSearchChange"
            value-format="YYYY-MM-DD 23:59:59"
            :clearable="false"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item size="small" label="回款截止日期：" prop="endTime">
          <el-date-picker v-model="form.endTime" style="width: 100%;" type="date" placeholder="选择日期时间" value-format="YYYY-MM-DD 23:59:59" />
        </el-form-item>
      </el-col>

      <el-col v-if="props.showIsTaxSelect" :span="6">
        <el-form-item size="small" label="是否含税： " prop="isTax">
          <el-radio-group v-model="form.isTax" size="small" :disabled="props.type == HandleEnum.EDIT">
            <el-radio-button :label="undefined">全部</el-radio-button>
            <el-radio-button label="1">含税</el-radio-button>
            <el-radio-button label="0">不含税</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="props.showIsTax" :span="6"> 是否含税：{{ form.isTax?(form.isTax == '1' ? '含税' : '不含税'):'' }} </el-col>
      <el-col :span="4">
        <el-form-item size="small" label="对账月份： " prop="accountMonth">
          <el-date-picker
            v-model="form.accountMonth"
            style="width: 100%;"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM-01 23:59:59"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item size="small" label="备注：">
          <el-input v-model="form.remark" maxLength="100" :rows="1" type="textarea" placeholder="" />
        </el-form-item>
      </el-col>
      <div style="flex: 1;display: flex; justify-content: flex-end; align-items: flex-start;"
        v-show="props.type == HandleEnum.EDIT || props.type == HandleEnum.ADD">
        <el-form-item label-width="0">
          <el-button type="primary" icon="Search" @click="handleSearchChange">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-row>
  </el-form>
</template>

<script setup name="AccountForm" lang="ts">
import { listRawMaterialCategoryNoPage } from '@/api/basedata/rawMaterialCategory';
import { getCraftList } from "@/api/basedata/craft";
import { listSupplier, } from '@/api/financial/accountOrder';
import { HandleEnum } from '@/api/financial/accountOrder/types';
import { parseTime } from "@/utils/ruoyi";
import {listCompany} from "@/api/basedata/customer";
import useUserStore from '@/store/modules/user';

const accountFormRef = ref();
const emits = defineEmits(['handleSearch', 'reset'])
const props = withDefaults(defineProps<{
  type?: HandleEnum,
  showSupplierSelect?: boolean,
  showSupplierStr?: string,
  showCustomerSelect?: boolean,
  showCategorySelect?: boolean,
  showCraftSelect?: boolean,
  showIsTaxSelect?: boolean,
  showIsTax?: boolean,
  isOutSource?: boolean,
  showCurrency?:boolean
  row?: any
}>(), {
  type: HandleEnum.ADD,
  showSupplierSelect: true,
  showSupplierStr: '',
  showCustomerSelect: false,
  showCategorySelect: false,
  showCraftSelect: false,
  showIsTaxSelect: false,
  showIsTax: false,
  isOutSource: false,
  showCurrency:false,
  row: {}
})
const initOutFormData: any = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  commodityInOutRecordId: undefined,
  ownerId: undefined,
  companyId:undefined,
  saleOrderBackId: undefined,
  accountTime: parseTime(new Date(), '{y}-{m}-{d} 23:59:59')
}

const insertFormData = reactive<PageData<any, any>>({
  form: { ...initOutFormData },
  queryParams: {

  },
  rules: {
    accountTime: [
      { required: true, message: "对账日期不能为空", trigger: "blur" }
    ],
    accountMonth: [
      { required: true, message: "对账月份不能为空", trigger: "blur" }
    ]
  }
});
const { form: form, rules: rules } = toRefs(insertFormData);
import { deepClone } from '@/utils';
const handleSearchChange = async () => {
  let selectForm:any = {};
  selectForm.accountTime = form.value.accountTime;
  selectForm.endTime = form.value.endTime;
  if(props.showCraftSelect){
selectForm.craftId = form.value.craftId;
  }
  if(props.showCategorySelect){
selectForm.categoryId = form.value.categoryId;
  }
  if(props.showSupplierSelect){
selectForm.supplierId = form.value.supplierId;
selectForm.companyId = form.value.companyId;
  }
  if(props.showIsTaxSelect){
selectForm.isTax = form.value.isTax;
  }
  if(props.showCustomerSelect){
selectForm.customerId = form.value.customerId;
selectForm.companyId = form.value.companyId;
  }





  emits('handleSearch', selectForm);
}

const validateForm = async () => {
  let res=false;
  await accountFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      console.log("validateForme");
      res=true;
    }
  });
  return res;
}


/** 表单重置 */
const resetQuery = async () => {

  if (props.type == HandleEnum.EDIT) {
    Object.assign(form.value, props.row);
  } else {
    form.value.customerId = undefined;
    form.value.ownerId = undefined;
    form.value.accountTime = parseTime(new Date(), '{y}-{m}-{d} 23:59:59');
    form.value.currency = undefined;
    form.value.endTime = undefined;
    form.value.isTax = undefined;
    form.value.accountMonth = undefined;
    form.value.remark = undefined;
    form.value.categoryId = undefined;
    form.value.craftId = undefined;
    form.value.companyId = undefined;
    form.value.supplierId = undefined;
  }
  emits('reset');
  emits('handleSearch');
}
//选择客户
const selectCustomerChange = (value: any) => {


  let customer = customerList.value?.find(item => item.companyId === value);
  if (customer == undefined) {
    return;
  }
  form.value.customerId=customer.id;
  form.value.currency = customer.currency;
  form.value.isTax = customer.isTax;
};
//选择供应商
const selectSupplierChange = (value: string) => {

  if (value == undefined || value == null || value == "") {
    form.value.currency = undefined;
    return;
  }
  let supplier = SupplierList.value?.find(item => item.id === value);
  if (supplier == undefined) {
    return;
  }
  form.value.companyId = supplier.ownerId;
  form.value.currency = supplier.currency;
  form.value.isTax = supplier.isTax;
   useUserStore().setSupplier({supplierId:supplier.id});
};

/**
 * 物料类别下拉列表
 */
const rawMaterialCategory = ref<any[]>([]);
const getListRawMaterialCategory = async () => {
  const res: any = await listRawMaterialCategoryNoPage();
  rawMaterialCategory.value = res;
}
/**
 * 获取供应商列表
 */
const SupplierList = ref<any[]>([]);
//客户列表
const customerList = ref<any[]>([]);

/**
 * 查询客户列表
 */
const getCustomerList = async () => {
  const res: any = await listCompany();
  customerList.value = res.data;
}
/**
 * 获取供应商列表
 */
const getSupplierList = async () => {
  const res: any = await listSupplier();
  SupplierList.value = res;
}

/** 查询工艺列表 */
const craftList = ref<any[]>([]);
const getCraftListNoPage = async () => {
  const res = await getCraftList();
  craftList.value = res.data;
};
const initFormData = async () => {
  if (props.showCategorySelect) {
    await getListRawMaterialCategory();
  }
  if (props.showSupplierSelect) {
    await getSupplierList();
  }
  if(props.showCustomerSelect){
    await getCustomerList();
  }
  if (props.showCraftSelect) {
    await getCraftListNoPage();
  }

  if (props.type != HandleEnum.ADD) {
    Object.assign(form.value, props.row);
    useUserStore().setSupplier({supplierId:form.value.supplierId});
  }else{
    useUserStore().setSupplier({});
  }

}

onMounted(() => {
  initFormData();
});

defineExpose({ form, validateForm })
</script>

<template>
  <el-form ref="formRef" label-width="80px" :disabled="disabled" :model="outsourceForm" :rules="rules">
    <el-row>
      <el-col :span="8">
        <el-form-item label="外协供应商" label-width="100" prop="supplierId">
          <el-select v-model="outsourceForm.supplierId" :collapse-tags="true" :disabled="props.isConfirm" filterable placeholder="请选择供应商">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
          </el-select> </el-form-item
      ></el-col>

      <el-col :span="8">
        <el-form-item label="外协数量" label-width="100" prop="quantity">
          <el-input v-model.number="outsourceForm.quantity" :min="1" :max="999999" type="number" :disabled="props.orderInfo.preOutsourceStatus=='5'" @input="(v) => mustIntHandle(v, 'quantity')">
            <template #append>PCS</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="props.isShow">
        <el-form-item label="外协平米价" label-width="100" prop="areaPrice">
          <el-input v-model.number="outsourceForm.areaPrice" type="number">
            <template #append>元/㎡</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="props.isShow">
        <el-form-item label="外协单价" label-width="100" prop="price">
          <el-input v-model.number="outsourceForm.price" type="number"   >
            <template #append>元/PCS</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col v-if="checkAddress" :span="8">
        <el-form-item label="" label-width="20">
          <el-radio-group v-model="outsourceForm.addressType" @change="addressChange" class="ml-4">
            <el-radio label="1">发给客户</el-radio>
            <el-radio label="2">发回本厂</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货地址" label-width="100" prop="addressId">
          <el-select v-model="outsourceForm.addressId" :disabled="props.isConfirm" :collapse-tags="true" filterable placeholder="请选择地址">
            <el-option v-for="item in addressList"
            :key="item.id"
            :label="`${item.status==0?'(已禁用)-':''}${item.address}`"
            :value="item.id"
            :disabled="item.status==0"
            />
          </el-select>
        </el-form-item>
      </el-col>
       <el-col :span="8">
        <el-form-item label="要求交期" label-width="100" prop="deliverTime">
          <el-date-picker
              style="width: 100%;"
              v-model="outsourceForm.deliverTime"
              type="date"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD 23:59:59"
              format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              :clearable="false"
            />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" label-width="100" prop="remark">
          <el-input v-model="outsourceForm.remark" maxlength="400" type="textarea" />
        </el-form-item>
      </el-col>
      <el-col v-if="props.isConfirm" :span="24">
        <el-form-item label="确认备注" label-width="100" prop="remark">
          <el-input v-model="outsourceForm.confirmRemark" maxlength="400" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider content-position="left" v-if="props.isShow">其他费用</el-divider>
    <el-row v-if="props.isShow">
      <el-col :span="4">
        <el-form-item label="模具费" label-width="50" prop="mouldCost">
          <el-input :class="{'inputSmallFont': outsourceForm.mouldCost?.length > numMax}" v-model.number="outsourceForm.mouldCost" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="测试架费" label-width="65" prop="testFrameCost">
          <el-input :class="{'inputSmallFont': outsourceForm.testFrameCost?.length > numMax}" v-model.number="outsourceForm.testFrameCost" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="飞针费" label-width="50" prop="flyProbeCost">
          <el-input :class="{'inputSmallFont': outsourceForm.flyProbeCost?.length > numMax}" v-model.number="outsourceForm.flyProbeCost" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="工程费" label-width="50" prop="engineeringCost">
          <el-input :class="{'inputSmallFont': outsourceForm.engineeringCost?.length > numMax}" v-model.number="outsourceForm.engineeringCost" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="样板费" label-width="50" prop="sampleCost">
          <el-input :class="{'inputSmallFont': outsourceForm.sampleCost?.length > numMax}" v-model.number="outsourceForm.sampleCost" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="加急费" label-width="50" prop="expeditedCost">
          <el-input :class="{'inputSmallFont': outsourceForm.expeditedCost?.length > numMax}" v-model.number="outsourceForm.expeditedCost" type="number" />
        </el-form-item>
      </el-col>

      <el-col :span="6" style="text-align:center">
        <span>其他费用</span>
        <el-button type="text" icon="Plus" @click.prevent="addOtherCost()"></el-button>
      </el-col>
      <el-col :span="6" v-for="(item, index) in outsourceForm.otherCostList" :key="item.title+index">
        <el-form-item label-width="0">
          <div style="display:flex; width: 100%;">
            <el-input v-model="item.title" style="width:85px;display:inline-block"></el-input>

            <el-input-number
              style="flex:1;padding-left: 5px;"
              class="inputSmallFont2"
              v-model.number="item.price"
              type="number"
              :precision="2"
              :controls="false"
            ></el-input-number>
            <el-button type="text" icon="Close" @click.prevent="removeotherCost(item)"></el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="SendOutSource" lang="ts">
import {ref} from "vue";
import {listOutSourceAddressList, listOutSourceSupplierList} from "@/api/outsource/sourceFullProcessOrder";

const numMax = 10;
const props = withDefaults(defineProps<{
  checkAddress: any,
  orderInfo: any,
  outSourceOrder:any,
  disabled: any,
   isShow: boolean,
  isConfirm: any,
  mustInt?: boolean,

}>(), {
  checkAddress:true,
  orderInfo: {},
  outSourceOrder:{},
  disabled: false,
   isShow: true,
  isConfirm:false,
  mustInt: false,
})

const outsourceForm = ref({
  supplierId: undefined,
  supplierName: undefined,
  quantity: undefined,
  areaPrice: undefined,
  price: undefined,
  addressId:undefined,
  addressType: '1',
  mouldCost: undefined,
  testFrameCost: undefined,
  flyProbeCost: undefined,
  engineeringCost: undefined,
  sampleCost: undefined,
  expeditedCost: undefined,
  remark:undefined,
  confirmRemark:undefined,
  deliverTime:undefined,
  otherCostList: [] as any[]
});

const rules = reactive({
  supplierId: [{ required: true, message: '请选择外协供应商', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入外协数量', trigger: 'blur' }],
  areaPrice: [{ required: true, message: '请输入外协平米价', trigger: 'blur' }],
  price: [{ required: true, message: '请输入外协单价', trigger: 'blur' }],
  addressId: [{ required: true, message: '请选择发货地址', trigger: 'change' }],
  deliverTime: [{ required: true, message: '请选择要求交期', trigger: 'change' }],
})

const formRef = ref<ElFormInstance>();
const supplierList: any = ref([]);
/** 时间禁选*/
const disabledDate = (date:any) => {

   const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;

}
/** 查询外协供应商列表 */
const queryOutSourceSupplierList = async () => {
  const res = await listOutSourceSupplierList();
  supplierList.value = res.data
}

const addressList: any = ref([]);
const disabled = ref(false);
const
addressChange = (val: any) => {
    outsourceForm.value.addressId=undefined;
    getAddressList();

}

// 去除小数点
const mustIntHandle = (v, field) => {
  if (props.mustInt) {
    outsourceForm.value[field] = v ? v.toString().replaceAll(/\./g, '') : v
    console.log(v)
  }
}

const getAddressList = async () => {

  console.log("outsourceForm.value.addressType",outsourceForm.value.addressType);

  if(outsourceForm.value.addressType == '1'){

    const customerAddressRes = await listOutSourceAddressList(props.orderInfo.cusId)
    addressList.value = customerAddressRes.data;
  }else {
    const ourAddressRes = await listOutSourceAddressList();
    addressList.value = ourAddressRes.data
  }

}

//新建其他费按钮事件
const addOtherCost = () => {
  if (outsourceForm.value.otherCostList.length >= 8) {
    ElMessage.warning("最多添加8条其他费用");
    return;
  }
  var tmp = '其他费用' + (outsourceForm.value.otherCostList.length + 1);
  outsourceForm.value.otherCostList.push({
    title: tmp,
    price: undefined,
  });
};

//删除选中的其他费用按钮
const removeotherCost = (item: any) => {
  var index = outsourceForm.value.otherCostList.indexOf(item)
  if (index !== -1) {
    outsourceForm.value.otherCostList.splice(index, 1)
  }
};
const submitOtherCost = (fn: Function) => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      if(outsourceForm.value.quantity){
        if (outsourceForm.value.quantity > props.orderInfo.quantity) {
          ElMessage.warning("外协数量不能大于订单数量");
          return;
        }
      }
      if(outsourceForm.value.supplierId){
        supplierList.value.forEach((item: any) => {
          if (item.id == outsourceForm.value.supplierId) {
            outsourceForm.value.supplierName = item.supplierName
          }
        })
      }
      fn && fn(outsourceForm.value)
    }
  });

}

const initForm = () => {


  if(Object.keys(props.outSourceOrder).length != 0){
    outsourceForm.value = props.outSourceOrder
      console.log("outsourceForm:",outsourceForm.value)
  }else{
 outsourceForm.value.price = props.orderInfo.price? props.orderInfo.price:0;
  outsourceForm.value.quantity = props.orderInfo.selfQuantity? props.orderInfo.selfQuantity:0;
  outsourceForm.value.area = props.orderInfo.area? props.orderInfo.area:0;
    outsourceForm.value.areaPrice =  props.orderInfo.areaPrice? props.orderInfo.areaPrice:0;
  }
  console.log("props.outSourceOrder",props.orderInfo)

  // if(outsourceForm.value.price && outsourceForm.value.quantity){
  //   const price=outsourceForm.value.price*10000;
  //   const quantity=outsourceForm.value.quantity*10000;
  //   const area=outsourceForm.value.area*10000;
  //   outsourceForm.value.areaPrice =  Number(price * quantity /  (area*10000)).toFixed(2);
  // }

  disabled.value = props.disabled
  getAddressList();

}

const countAreaPrice = () => {
  let areaPrice = 0;
  let price= outsourceForm.value.price? outsourceForm.value.price:0;
  let quantity= outsourceForm.value.quantity? outsourceForm.value.quantity:0;
  let area= outsourceForm.value.area? outsourceForm.value.area:0;
  if(price&&quantity){
    areaPrice = Number((price*10000) * (quantity*10000) / (area*10000*10000));
  }
  outsourceForm.value.areaPrice = Number(areaPrice.toFixed(2));
}


onMounted(() => {
  queryOutSourceSupplierList();
  initForm();
});


defineExpose({submitOtherCost})
</script>

<style lang="scss" scoped>
.inputSmallFont{
  font-size: 12px;
}
::v-deep(.inputSmallFont2 .el-input__inner){
    width: 100%;
    box-sizing: border-box;
}
</style>

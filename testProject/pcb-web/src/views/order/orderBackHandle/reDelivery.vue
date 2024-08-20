<template>
  <div v-loading="isLoading">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      :rules="formRule"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单编号" prop="saleOrderNo">
            <el-input type="text" v-model="formData.saleOrderNo" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品编码" prop="commodityCode">
            <el-input type="text" v-model="formData.commodityCode" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称" prop="commodityName">
            <el-input type="text" v-model="formData.commodityName" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" prop="inventoryQuantity">
            <el-input type="text" v-model="formData.inventoryQuantity" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发货地址" style="width: 100%" prop="addressId">
            <el-select v-model="formData.addressId" placeholder="请选择" style="width: 100%"
                       filterable default-first-option>
              <el-option v-for="address in addressList" 
              :label="`${address.status==0?'(已禁用)-':''}${address.address}`" 
              :disabled="address.status==0"
              :value="address.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发货数量" style="width: 100%" prop="quantity">
            <el-input-number style="width: 100%" :controls="false" v-model="formData.quantity" placeholder="请输入"
                             :max="calcMaxQuantity()" :min="0" :precision="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备品数量" style="width: 100%" prop="reserveQuantity">
            <el-input-number style="width: 100%" :controls="false" v-model="formData.reserveQuantity"
                             :max="calcMaxReserveQuantity()" :min="0" :precision="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="箱数" style="width: 100%" prop="caseNum">
            <el-input-number style="width: 100%" :controls="false" v-model="formData.caseNum"
                             :min="0" :precision="0"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="物流单号" style="width: 100%" prop="logisticsNo">
            <el-input v-model="formData.logisticsNo" maxLength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流公司" style="width: 100%" prop="logisticsCompany">
            <el-input v-model="formData.logisticsCompany" maxLength="100" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="发货备注" style="width: 100%" prop="remark">
            <el-input type="textarea" v-model="formData.remark" :rows="3" :maxlength="1000" show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center" style="margin-top: 10px">
      <el-button type="primary" @click="submitForm(formRef)" :loading="submitLoading">确 定</el-button>
      <el-button @click="cancel" :loading="submitLoading">关 闭</el-button>
    </div>
  </div>
</template>

<script setup name="backOrderReDelivery">

import { defineProps } from "vue";
import { listCustomerAddressByCusId } from "@/api/basedata/customerAddress/index";
import { saveReDelivery } from "@/api/order/orderBackHandle";
import { queryByCommodity } from '@/api/inventory/inventory/index';
import { deleteBackOrder } from "@/api/order/orderBack";

const zeroValid = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error('发货数量不能为0'))
  } else {
    callback()
  }
}

const { formData, formRule } = toRefs(reactive({
  formData: {
    saleOrderNo: undefined,
    commodityCode: undefined,
    commodityName: undefined,
    addressId: undefined,
    quantity: undefined,
    remark: undefined,
    inventoryQuantity: undefined,
    reserveQuantity: undefined,
    caseNum: undefined,
  },
  formRule: {
    addressId: [
      { required: true, message: '发货地址不能为空', trigger: 'change' },
    ],
    quantity: [
      { required: true, message: '发货数量不能为空', trigger: 'change' },
      { validator: zeroValid, trigger: 'change',},
    ]
  },
}))

const props = defineProps({
  backOrder: {
    required: true,
    type: Object,
  },
  maxReDeliveryQuantity: {
    required: true,
    type: Number,
  },
})

const formRef = ref();
const emit = defineEmits(['close']);
const submitLoading = ref(false);
const isLoading = ref(false);
const addressList = ref([]);

const cancel = () => {
  emit('close');
}

const submitForm = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      saveReDelivery({
        saleOrderBackId: props.backOrder.value.id,
        saleOrderId: props.backOrder.value.saleOrderId,
        quantity: formData.value.quantity,
        addressId: formData.value.addressId,
        remark: formData.value.remark,
        reserveQuantity: formData.value.reserveQuantity,
        caseNum: formData.value.caseNum,
        logisticsNo: formData.value.logisticsNo,
        logisticsCompany: formData.value.logisticsCompany,
      }).then(res => {
        emit('confirm', res.data);
      }).finally(() => {
        submitLoading.value = false;
      })
    }
  })
}

const calcMaxQuantity = () => {
  let reserveQuantity = formData.value.reserveQuantity ? formData.value.reserveQuantity : 0;
  if (props.maxReDeliveryQuantity > formData.value.inventoryQuantity) {
    return formData.value.inventoryQuantity - reserveQuantity;
  } else {
    return props.maxReDeliveryQuantity - reserveQuantity;
  }
}

const calcMaxReserveQuantity = () => {
  let quantity = formData.value.quantity ? formData.value.quantity : 0;
  if (props.maxReDeliveryQuantity > formData.value.inventoryQuantity) {
    return formData.value.inventoryQuantity - quantity;
  } else {
    return props.maxReDeliveryQuantity - quantity;
  }
}

const loadSupplierData = async () => {
  listCustomerAddressByCusId(props.backOrder.value.cusId)
    .then(res => {
      addressList.value = res;
      let find = res.find(item => item.isDefault === 1&&item.status==1);
      if (find) {
        formData.value.addressId = find.id;
      } else {
        if (res.length !== 0) {
          // formData.value.addressId = res[0].id;
           let select = addressList.value.find(item => item.status==1);
          // formInline.addressId = customerAddressList.value[0].id
          formData.value.addressId = select?.id
        }
      }
    })
}

const loadCommodityInventory = async () => {
  //查产品库存
  queryByCommodity({
    commodityId: props.backOrder.value.commodityId,
  }).then(res => {
    formData.value.inventoryQuantity = res.data;
  })
}

const loadInitData = () => {
  isLoading.value = true;
  Promise.all([loadSupplierData(), loadCommodityInventory()])
    .then(() => {
      isLoading.value = false;
    })
}

onMounted(() => {
  //加载数据
  formData.value.commodityCode = props.backOrder.value.commodityCode;
  formData.value.commodityName = props.backOrder.value.commodityName;
  formData.value.saleOrderNo = props.backOrder.value.saleOrderNo;
  loadInitData();
});
</script>

<style scoped>
  /deep/ .el-input__wrapper {
    width: 100%;
  }
  :deep(.el-input__wrapper){
    width: 100%;
    padding-left: 7px !important;
    padding-right: 7px !important;
  }
  :deep(.el-input__inner){
    text-align: left;
  }
</style>

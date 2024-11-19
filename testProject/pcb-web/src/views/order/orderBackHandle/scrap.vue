<template>
  <div style="text-align: center; width: 100%; margin-bottom: 10px" >
    <el-radio-group v-model="responsibleType" >
      <el-radio-button label="1" >本厂责任</el-radio-button>
      <el-radio-button label="2" >供应商责任</el-radio-button>
    </el-radio-group>
  </div>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="100px"
    :rules="responsibleType === '1' ? selfFormRule : supplierFormRule"
  >
    <el-row >
      <el-col :span="24">
        <el-form-item label="报废工序" prop="craftId">
          <el-select v-model="formData.craftId" placeholder="请选择" style="width: 100%"
                     :loading="craftLoading" loading-text="加载中" filterable default-first-option>
            <el-option v-for="craft in craftList" :label="craft.craftName" :value="craft.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="responsibleType === '1'">
        <el-form-item label="责任人" style="width: 100%" prop="responsible">
          <el-select v-model="formData.responsible" placeholder="请选择" style="width: 100%"
                     :loading="responsibleLoading" loading-text="加载中" filterable default-first-option>
            <el-option v-for="responsible in responsibleList" :label="responsible.nickName" :value="responsible.userId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="responsibleType === '2'">
        <el-form-item label="供应商" prop="responsibleSupplierId">
          <el-select v-model="formData.responsibleSupplierId" placeholder="请选择" style="width: 100%"
                     :loading="supplierLoading" loading-text="加载中" filterable default-first-option>
            <el-option v-for="supplier in supplierList" :label="supplier.supplierName" :value="supplier.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报废数量" style="width: 100%" prop="quantity">
          <el-input-number style="width: 100%" :controls="false" v-model="formData.quantity" placeholder="请输入"
                           :max="props.backOrder.value.undoQuantity" :min="0" :precision="0"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报废备注" style="width: 100%" prop="remark">
          <el-input type="textarea" v-model="formData.remark" :rows="3" :maxlength="1000" show-word-limit>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="text-right" style="margin-top: 10px">
    <el-button type="primary" @click="submitForm(formRef)" :loading="submitLoading">确 定</el-button>
    <el-button @click="cancel" :loading="submitLoading">关 闭</el-button>
  </div>
</template>

<script setup name="backOrderScrap">

import { defineProps } from "vue";
import { getCraftList } from "@/api/system/config/index";
import { listUser } from "@/api/system/user/index";
import { listSupplierNoPage } from "@/api/basedata/supplier/index";
import { saveSelfScrap, saveSupplierScrap } from "@/api/order/orderBackHandle";

const zeroValid = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error('报废数量不能为0'))
  } else {
    callback()
  }
}

const { formData, selfFormRule, supplierFormRule } = toRefs(reactive({
  formData: {
    addressId: undefined,
    saleOrderCode: undefined,
    commodityCode: undefined,
    commodityName: undefined,
    quantity: undefined,
    remark: undefined,
    craftId: undefined,
    responsible: undefined,
    responsibleSupplierId: undefined,
  },
  selfFormRule: {
    craftId: [
      { required: true, message: '报废工序不能为空', trigger: 'change' },
    ],
    responsible: [
      { required: true, message: '责任人不能为空', trigger: 'change' },
    ],
    quantity: [
      { required: true, message: '报废数量不能为空', trigger: 'change' },
      { validator: zeroValid, trigger: 'change',},
    ],
  },
  supplierFormRule: {
    responsibleSupplierId: [
      { required: true, message: '供应商不能为空', trigger: 'change' },
    ],
    quantity: [
      { required: true, message: '报废数量不能为空', trigger: 'change' },
      { validator: zeroValid, trigger: 'change',},
    ],
  },
}))

const props = defineProps({
  backOrder: {
    required: true,
    type: Object,
  },
})

const formRef = ref();
const emit = defineEmits(['close']);
const responsibleType = ref("1");
const craftList = ref([]);
const craftLoading = ref(false);
const responsibleList = ref([]);
const responsibleLoading = ref(false);
const supplierList = ref([]);
const supplierLoading = ref(false);
const submitLoading = ref(false);


const cancel = () => {
  emit('close');
}

const loadCraftData = () => {
  craftLoading.value = true;
  getCraftList({})
    .then(res => {
      craftList.value = res.data;
    })
    .finally(() => {
      craftLoading.value = false;
    })
}

const loadResponsibleData = () => {
  responsibleLoading.value = true;
  listUser({})
    .then(res => {
      responsibleList.value = res.rows;
    })
    .finally(() => {
      responsibleLoading.value = false;
    })
}

const loadSupplierData = () => {
  supplierLoading.value = true;
  listSupplierNoPage({
    type: ['2', '3'],
  })
    .then(res => {
      supplierList.value = res;
    })
    .finally(() => {
      supplierLoading.value = false;
    })
}

const submitForm = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      if (responsibleType.value === "1") {
        saveSelfScrap({
          saleOrderBackId: props.backOrder.value.id,
          saleOrderId: props.backOrder.value.saleOrderId,
          quantity: formData.value.quantity,
          scrapType: responsibleType.value,
          craftId: formData.value.craftId,
          responsible: formData.value.responsible,
          responsibleSupplierId: formData.value.responsibleSupplierId,
          remark: formData.value.remark,
        }).then(() => {
          emit('confirm');
        }).finally(() => {
          submitLoading.value = false;
        });
      } else if (responsibleType.value === "2") {
        saveSupplierScrap({
          saleOrderBackId: props.backOrder.value.id,
          saleOrderId: props.backOrder.value.saleOrderId,
          quantity: formData.value.quantity,
          scrapType: responsibleType.value,
          craftId: formData.value.craftId,
          responsible: formData.value.responsible,
          responsibleSupplierId: formData.value.responsibleSupplierId,
          remark: formData.value.remark,
        }).then(() => {
          emit('confirm');
        }).finally(() => {
          submitLoading.value = false;
        });
      }
    }
  })
}

onMounted(() => {
  //加载工艺数据
  loadCraftData();
  //加载责任人数据
  loadResponsibleData();
  //加载供应商数据
  loadSupplierData();
});
</script>

<style scoped>
  :deep(.el-input__wrapper){
    width: 100%;
    padding-left: 7px !important;
    padding-right: 7px !important;
  }
  :deep(.el-input__inner){
    text-align: left;
  }
</style>

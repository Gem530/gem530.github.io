<template>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="100px"
    :rules="formRule"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item label="仓库" style="width: 100%" prop="storageId">
          <el-select v-model="formData.storageId" placeholder="请选择" style="width: 100%"
                     :loading="storageLoading" loading-text="加载中" filterable default-first-option>
            <el-option v-for="storage in storageList" :label="storage.name" :value="storage.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="入库数量" style="width: 100%" prop="quantity">
          <el-input-number style="width: 100%" :controls="false" v-model="formData.quantity" placeholder="请输入"
                           :max="props.backOrder.value.undoQuantity" :min="0" :precision="0"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" style="width: 100%" prop="remark">
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
</template>

<script setup name="backOrderReInventory">

import { defineProps } from "vue";
import { commodityStorages } from "@/api/system/config/index";
import { saveReInventory } from "@/api/order/orderBackHandle/index";

const zeroValid = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error('入库数量不能为0'))
  } else {
    callback()
  }
}

const { formData, formRule } = toRefs(reactive({
  formData: {
    storageId: undefined,
    quantity: undefined,
    remark: undefined,
  },
  formRule: {
    storageId: [
      { required: true, message: '入库仓库不能为空', trigger: 'change' },
    ],
    quantity: [
      { required: true, message: '入库数量不能为空', trigger: 'change' },
      { validator: zeroValid, trigger: 'change',},
    ]
  },
}))

const formRef = ref();
const emit = defineEmits(['close']);
const submitLoading = ref(false);
const storageLoading = ref(false);
const storageList = ref([]);

const cancel = () => {
  emit('close');
}

const submitForm = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      saveReInventory({
        saleOrderBackId: props.backOrder.value.id,
        saleOrderId: props.backOrder.value.saleOrderId,
        quantity: formData.value.quantity,
        storageId: formData.value.storageId,
        remark: formData.value.remark,
      }).then(() => {
        emit('confirm');
      }).finally(() => {
        submitLoading.value = false;
      })
    }
  })
}

const loadStorage = () => {
  storageLoading.value = true;
  commodityStorages()
    .then(res => {
      storageList.value = res.data;
      if (res.data.length !== 0) {
        formData.value.storageId = res.data[0].id;
      }
    })
    .finally(() => {
      storageLoading.value = false;
    })
}

const props = defineProps({
  backOrder: {
    required: true,
    type: Object,
  },
})

onMounted(() => {
  //加载数据
  loadStorage();
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

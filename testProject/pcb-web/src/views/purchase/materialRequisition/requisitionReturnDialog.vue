<template>
  <el-dialog :title="props.title" v-model="showFlag" width="50%" destroy-on-close :close-on-click-modal="false" v-loading="isLoading">
    <el-form border label-width="100px" ref="formRef" :model="form" :rules="rules" v-if="props.formShow">
      <el-row>
        <el-col :span="8">
          <el-form-item size="small" label="物料编码">
            <el-input v-model="form.rawMaterialCode" clearable style="width: 100%;" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="物料名称">
            <el-input v-model="form.name" :disabled="true" clearable style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small" label="领用数量">
            <el-input v-model="form.quantity" :disabled="true" clearable style="width: 80%;"></el-input>{{ form.units }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item size="small" label="物料规格">
            <!-- text 文本输入域 type="textarea"-->
            <el-input v-model="form.materialSpec" :disabled="true" clearable type="textarea" :rows="2" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item size="small" label="可归还数量">
            <el-input v-model="form.returnableQuantity" clearable style="width: 80%;" :disabled="true"></el-input>{{ form.units }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item size="small" label="归还数量" prop="returnQuantity">
            <el-input-number v-model="form.returnQuantity" clearable style="width: 80%;" :max="form.returnableQuantity"  :controls="false" :min="1" :precision="0"></el-input-number>{{ form.units }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="small" label="入库仓 " prop="storageId">
            <el-select v-model="form.storageId" clearable filterable placeholder="请选择入库仓" style="width: 100%;">
                <el-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="small" label="备注：">
            <el-input v-model="form.remark" maxLength="100"  :rows="2" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 横线 -->
    <el-divider content-position="left" v-if="props.formShow">归还记录</el-divider>
    <XTable :page-show="false" :data="dataList" :columnList="columnList" height="200px" :isAutoHeight="true" :loading="loading">
      <template #default-quantity="scope">
             <div>{{ scope.row.quantity?Number(scope.row.quantity).toFixed(0):0 }}</div>
      </template> 
     <template #default-storageId="scope">
             {{ storageOptions.find(item => item.id === scope.row.storageId)?.name }}
      </template> 

    </XTable>
    <template #footer>
      <div style="display: flex; justify-content: center;">
        <span class="dialog-footer">
          <el-button v-if="formShow" :loading="buttonLoading" @click="cancel">取消</el-button>
          <el-button v-if="formShow" :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="RequisitionReturn" lang="ts">
import {MaterialStorageVO} from "@/api/purchase/materialStorage/types";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
  import {
    getReturnRecordListById,submitReturn
  } from '@/api/purchase/materialRequisition'
import { emit } from "process";
  
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const buttonLoading = ref(false);
const loading = ref(true);
const form = ref({} as any)
const formRef = ref();

//定义必填项
const rules = {
  returnQuantity: [
    { required: true, message: '请输入归还数量', trigger: 'blur' },
  ],
  storageId: [
    { required: true, message: '请选择入库仓', trigger: 'change' }
  ]
}


const emits = defineEmits(['refresh', 'reset', 'update:show'])

const props = withDefaults(defineProps<{
  show: boolean,
  title: string,
  formShow?: boolean,
  formData:any
}>(), {
  show: false,
  title: '',
  formShow: true,
  row: ()=>{},
  formData: ()=>{}
})
//仓库
let storageOptions = ref([]);

const showFlag = computed({
  get () {
    return props.show
  },
  set (val) {
    emits('update:show', val)
  }
})

// 处理物料规格字段 ，拼接成字符串
const materialSpec = computed(() => {
  if (form.value) {
    let materialSpec = '';
    if (form.value.materialQuality) {
      materialSpec += '材质牌号：'+form.value.materialQuality + ' ';
    }
    if (form.value.manufacturer) {
      materialSpec += '品牌：'+form.value.manufacturer + ' ';
    }
    if (form.value.thickness) {
      materialSpec += '厚度：'+form.value.thickness + ' ';
    }
    if (form.value.copperThickness) {
      materialSpec += '铜厚：'+form.value.copperThickness + ' ';
    }
    if (form.value.boardThickness) {
      materialSpec += '板厚：'+form.value.boardThickness + ' ';
    }
    if (form.value.diameter) {
      materialSpec += '直径：'+form.value.diameter + ' ';
    }
    if (form.value.length) {
      materialSpec += '长：'+form.value.length + ' ';
    }
    if (form.value.width) {
      materialSpec += '宽：'+form.value.width + ' ';
    }
    if (form.value.color) {
      materialSpec += '颜色：'+form.value.color + ' ';
    }
    if (form.value.level) {
      materialSpec += '级别：'+form.value.level + ' ';
    }
    if (form.value.specification) {
      materialSpec += '规格型号：'+form.value.specification + ' ';
    }
    return form.value.materialSpec=materialSpec;
  }
  });

//监听 formShow
watch(() => props.formData, (val) => {
  if (val) {
    form.value = props.formData
    form.value.materialSpec = materialSpec.value;
  }
}, {immediate: true})

const dataList = ref([]);
  //确认选中的物料表
const columnList = ref([
  {title: '序号', align: 'center', width: '50', type: 'seq'},
  {title: '操作时间', field: 'createTime',  align: 'center',},
  {title: '操作人', field: 'createByName',  align: 'center',},
  {title: '归还数量', field: 'quantity',  align: 'center',},
  {title: '入库仓', field: 'storageId', align: 'center',},
  {title: '备注', field: 'remark', align: 'center',},
]);

/**
 * 提交表单
 */
const submitForm = () => {
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      buttonLoading.value = true;
     ElMessageBox.confirm(
      '是否确定提交?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      proxy?.$modal.loading('加载中...');
      submitReturn(form.value).then(() => {
        buttonLoading.value = false;
         ElMessage({
        type: 'success',
        message: '操作成功',
      })
      emits('refresh');
      showFlag.value = false;
       
      }).catch(() => {
        buttonLoading.value = false;
      }).finally(() => {
        proxy?.$modal.closeLoading()
      });
         
    }).catch(() => {
      buttonLoading.value = false;
    });
    }
  })
}
const getReturnRecordList = async () => {
  loading.value = true;  
  getReturnRecordListById(form.value.id).then((res: any) => {
    dataList.value = res.data;
  }).finally(() => {
    loading.value = false;
  })
}
const cancel = () => {
  showFlag.value = false
}
watch(() => form.value.id, (val) => {
  if (val) {
    getReturnRecordList();
  }
}, {immediate: true})

/**
 * 物料盘点弹窗
 */
const getMaterialStorage= async () => {
  
  const storageResponse: any = await listMaterialStorage();
  storageOptions.value = storageResponse.rows;
  
}

onMounted(() => {
getMaterialStorage();
// getReturnRecordList();
});

defineExpose({ form })
</script>

<style></style>

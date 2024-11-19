<template>
  <el-dialog title="选择签名/印章" v-model="showFlag" width="50%" destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-tabs v-model="tabRadioTable" @tab-change="list" type="border-card">
      <div>
        <span>*点击选择一个签名/印章</span>
      </div>
      <el-tab-pane label="电子签名" :name="2">
        <div v-if="!existSignList" style="text-align: center;">您还没有新增签名，请去【基础数据】==》【签章管理】模块设置您的签章。</div>
        <el-form v-else label-width="0px" class="custom-form" v-loading="loading">
          <el-form-item label="" class="custom-form-item">
            <ImgChoice :data="listSignVo" @choose="choose"></ImgChoice>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="电子印章" :name="1">
        <div v-if="!existSignList" style="text-align: center;">您还没有新增印章，请去【基础数据】==》【签章管理】模块设置您的签章。</div>
        <el-form v-else label-width="0px" class="custom-form" v-loading="loading">
          <el-form-item label="" class="custom-form-item">
            <ImgChoice :data="listSignVo" @choose="choose"></ImgChoice>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :disabled="true" :name="3">
        <template #label>
          <span style="color: rgba(64, 158, 255, 1)">*点击选择一个签名/印章</span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <!-- 居中显示 -->
      <div style="text-align: center;">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="existSignList" :loading="buttonLoading" type="primary" @click="submit">确 认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="ContractFileDialog" lang="ts">

import { ref } from 'vue'
import { signList } from '@/api/basedata/sign';
import { SignVO, SignQuery, SignForm } from '@/api/basedata/sign/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
const loading = ref(false);

const signRef = ref<ElFormInstance>();

const tabRadioTable = ref(2);

const listSignVo = ref<SignVO[]>([]);
const existSignList = ref(false);
const key = ref<string>('');
const signType = ref<string>('');
const name = ref<string>('');

/** 数据查询 */
function list() {
  console.log('tabRadioTable.value', tabRadioTable.value)
  loading.value = true;
  /**
   *
id:"1805205278824603649"
key :  "000000/2c79a3f109df46039f86405dca33a553_印章.png"
name :  "印章.png"
signName :  "印章2"
signType : "1"
url: "https://pcb-test.oss-cn-shen"
   */
  signList({signType: tabRadioTable.value}).then(res => {
    listSignVo.value = res.data;
    existSignList.value = res.data?.length > 0;
    loading.value = false;
  }).finally(() => {
    loading.value = false;
  })
}

const emits = defineEmits(['update:show', 'submit', 'cancel'])

const props = withDefaults(defineProps<{
  show: boolean,
}>(), {
  show: false,
})
const showFlag = computed({
  get () {
    return props.show
  },
  set (val) {
    emits('update:show', val)
  }
})
const cancel = () => {
  emits('cancel')
  showFlag.value = false
}

/**
 * 需要得到选中的签章的信息
 */
const submit = () => {
  //判断是否选择了签章
  if (!key.value) {
    ElMessage.error('请选择签章');
    return;
  }
  proxy?.$modal.confirm('是否选择 ' + name.value + ' 去签名？').then(() => {
      console.log("选择的签章为：", key.value);
      emits('submit', key.value, signType.value);
      showFlag.value = false;
    }
  ).finally(() => loading.value = false);
}


/**
 * 需要得到选中的签章的信息
 */
const choose = (row:any) => {
 key.value = row.key;
 signType.value = row.signType;
 name.value = row.signName;
 console.log(key.value);
}

onMounted(() => {
  list();
})
</script>
<style scoped>
.custom-form-item {

  display: flex;
  align-items: center;
}
</style>

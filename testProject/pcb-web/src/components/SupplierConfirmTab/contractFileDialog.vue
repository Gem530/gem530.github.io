<template>
  <el-dialog title="附件下载" v-model="showFlag" width="50%" destroy-on-close :close-on-click-modal="false">
    <el-form ref="ossFormRef" :model="form" :rules="ossRules" label-width="80px">
      <el-form-item label="附件类型">
        <!-- 单选按钮 默认单据附件 -->
        <el-radio-group v-model="filerBizType" @change="form.fileList=[]">
          <el-radio v-for="item in fileTypeRadio" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <div>
          <div style="color: #AAA">*注：单据附件：确认双方不同于系统签订附件的合同附件，双方只可上传一个</div>
          <div style="padding-left: 28px;color: #AAA;">凭证附件：用于佐证合同的凭证附件，双方都可以上传多个</div>
        </div>
      </el-form-item>
      <el-form-item label="附件名称">
        <XUpload
          v-if="filerBizType == '1'"
          v-model:model-value="form.fileList"
          :fileType="fileType"
          model="download"
          :limit="1"
          @delFile="(val, files) => delFile(val, files, 1)"
          :multiple="false"
        ></XUpload>
        <XUpload
          v-else
          :isWaterMark="true"
          v-model:model-value="form.fileList"
          :fileType="fileType"
          model="download"
          @delFile="(val, files) => delFile(val, files, 1)"
          :multiple="true"
        ></XUpload>
      </el-form-item>
      <el-form-item label="">
        <div>
          <div style="color: #AAA">支持扩展名：.pdf .jpg .png。</div>
        </div>
      </el-form-item>
    </el-form>
    <div class="expand-wrapper">
      <vxe-table
        border
        show-overflow
        :row-config="{height: 45}"
        :column-config="{ resizable: true }"
        height="450"
        :data="fileList"
        :loading="loading"
      >
        <vxe-column align="center" width="50" field="index" title="序号" type="seq"></vxe-column>
        <vxe-column align="center" width="90" field="bizType" title="类型">
          <template #default="scope">
            <div v-for="item in fileTypeList">
              <span v-if="item.value == scope.row.bizType">{{ item.label }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="ownerName" title="单位名称"></vxe-column>
        <vxe-column align="center" width="90" field="createByName" title="上传人"></vxe-column>
        <vxe-column align="center" width="160" field="createTime" title="上传时间"></vxe-column>
        <vxe-column field="name" title="附件">
          <template #default="scope">
            <el-button type="primary" link @click="downLoadHandle(scope.row.key)">{{scope.row.name}}</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <template #footer>
      <!-- 居中显示 -->
      <div style="text-align: center;">
        <el-button @click="cancelOSS">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitOSSForm">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="ContractFileDialog" lang="ts">
import fileSaver from "file-saver";
import { ref } from 'vue'
import { MaterialOrderDetailVO } from "@/api/purchase/materialOrderDetail/types";
import {  listFile, uploadFile } from "@/api/purchase/materialOrderDetail";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

/**采购单预览 */
import {OssForm, OssQuery} from "@/api/system/oss/types";
import {FileItemVO} from "@/api/upload/types";
import {downloadUrl} from "@/api/upload";
import {RecordVO} from "@/api/purchase/record/types";

const buttonLoading = ref(false);
const loading = ref(false);

const recordVisible = ref(false);
const filerBizType = ref<string>("1");

const ossFormRef = ref<ElFormInstance>();
const fileList = ref<FileItemVO[]>([]);


const fileTypeRadio = ref([
  { label: '单据附件', value: "1" },
  { label: '凭证', value: "20" },
]);

const fileTypeList = ref([
  { label: '单据附件', value: "15" },
  { label: '单据附件', value: "16" },
  { label: '签名附件', value: "17" },
  { label: '签名附件', value: "18" },
  { label: '签名附件', value: "19" },
  { label: '凭证附件', value: "20" },
]);
const orderId = ref<number|string>("");
/**运行文件上传的类型 */
const fileType: string[] = ["pdf", "jpg", "png"];
const initOSSFormData = {
  file: [],
}
const ossData = reactive<PageData<OssForm, OssQuery>>({
  form: { ...initOSSFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    fileName: '',
    originalName: '',
    fileSuffix: '',
    createTime: '',
    service: ''
  },
  rules: {
    file: [
      { required: true, message: "文件不能为空", trigger: "blur" }
    ]
  }
});
const { queryParams:ossQueryParams, form:ossForm, rules:ossRules } = toRefs(ossData);
const initFormData: MaterialOrderForm = {
  id: undefined,
  code: undefined,
  supplierId: undefined,
  addressId: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  submitUserId: undefined,
  submitUserName: undefined,
  remark: undefined,
  status: undefined,
  createTime: undefined
}

const data = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    confirmStatus: '2',
    params: {
    }
  },
  rules : {}
});
const { form } = toRefs(data);

/** 取消按钮 */
function cancelRecord() {
  recordVisible.value = false;
}

// 上传文件
const craftFileChange = async (val:any) => {
  setTimeout(()=>form.value.fileList = val ,500);
  console.log("craftFileChange",val)
}

// 删除文件
const delFile = (val: any, files: any, type?: number) => {
  form.value.fileList =undefined;
}

/** 文件按钮操作 */
const handleFile = async (id: any) => {
  resetOSS();
  loading.value = true;
  orderId.value = id;
  // 查询已上传的附件
  if (props.findType === 1){
    const res = await listFile({bizId:props.id});
    fileList.value = res.data;
    loading.value = false;
  }else{
    const res = await listFile({bizId: id});
    fileList.value = res.data;
    loading.value = false;
  }
}

// 文件下载
const downLoadHandle = (key: string) => {
  let loadingBox: any = undefined;
  loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
  downloadUrl(key).then(res => {
    loadingBox.close()
    if (res.code == 200) {
      const { data } = res
      // window.open(data[key])
      fileSaver.saveAs(data[key])
    }
  }).catch((err) => {
    loadingBox.close()
  })
}

/** 文件上传提交按钮 */
const submitOSSForm = () => {

  if (!form.value.fileList||form.value.fileList.length == 0) {
    proxy?.$modal.msgError("请选择文件");
    return;
  }
  //根据,分割ossForm.value.file得到一个数组
  if (filerBizType.value == '1' && form.value.fileList.length > 1) {
    proxy?.$modal.msgError("只能上传一个文件");
    return;
  }
  let filerType = '20';
  if(filerBizType.value == '1'){
    filerType=props.bizType;
  }
  let tempFileList = JSON.parse(JSON.stringify(form.value.fileList))
  tempFileList.forEach((item) => {item.moduleCode = props.moduleCode, item.bizType = filerType, item.bizCode = props.bizCode, item.tempImgUrls = undefined, item.url = undefined});
  buttonLoading.value = true;

  uploadFile({id: orderId.value, bizType:filerType,fileList: tempFileList}).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    form.value.fileList=[];
    handleFile(orderId.value);
  }).finally(() => {
    buttonLoading.value = false;
  });
}

/** 取消按钮 */
function cancelOSS() {
  resetOSS();
  showFlag.value = false
}
/** 表单重置 */
function resetOSS() {
  ossForm.value = { ...initOSSFormData };
  ossFormRef.value?.resetFields();
}

const emits = defineEmits(['update:show'])

const props = withDefaults(defineProps<{
  show: boolean,
  id:any,
  moduleCode: string,
  findType: number,
  bizType: string,
  bizCode: string,
}>(), {
  show: false,
  id: undefined,
  moduleCode: '',
  findType: 1,//查找类型   1  根据code查文件   2 根据id查文件
  bizType: '',
  bizCode: ''
})
const showFlag = computed({
  get () {
    return props.show
  },
  set (val) {
    emits('update:show', val)
  }
})
//监听 formShow
watch(() => props.id, (val) => {
  if (val) {
   handleFile(val);
  }
}, {immediate: true})

onMounted(() => {
  resetOSS();
})
</script>

<style></style>

<template>
  <el-dialog title="附件下载" v-model="showFlag" width="55%" destroy-on-close :close-on-click-modal="false">
    <el-form ref="ossFormRef" :model="form" :rules="ossRules" label-width="80px">

      <el-form-item label="" label-width="0">

        <XUpload
          :isWaterMark="true"
          v-model:model-value="form.fileList"
          model="download"
          @delFile="(val, files) => delFile(val, files, 1)"
          :multiple="true"
        >
          <div class="global-flex flex-start" style="color: #AAA">
            <el-button type="primary" slot="trigger">上传文件</el-button>
            &nbsp;&nbsp;&nbsp;支持批量上传,格式不限
          </div>
        </XUpload>

      </el-form-item>

    </el-form>

    <FileView ref="fileViewRef"></FileView>
    <div>
      <XTable
        border
        show-overflow
        :row-config="{height: 45}"
        :column-config="{ resizable: true }"
        height="450"
        :data="fileList"
        :pageShow="false"
        :loading="loading"
        :columnList="columnList"
      >

<!--        <template #default-src="scope">-->
<!--          <ImagePreview-->
<!--            :width="100"-->
<!--            :height="100"-->
<!--            :src="scope.row.url"-->
<!--            :type="scope.row.type"-->
<!--            :preview-src-list="[scope.row.url]"-->
<!--          />-->
<!--        </template>-->

          <template #default-make="scope">
            <el-button  type="primary" link @click="preview(scope.row)">预览</el-button>
            <el-button  type="primary" link @click="downLoadHandle(scope.row.key)">下载</el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="delAssignFile(scope.row.id)">删除</el-button>
          </template>
      </XTable>
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
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

/**采购单预览 */
import {OssForm, OssQuery} from "@/api/system/oss/types";
import {FileItemVO} from "@/api/upload/types";
import {addBatchFile, deleteFile, downloadUrl, listContractFiles} from "@/api/upload";

const buttonLoading = ref(false);
const loading = ref(false);
const signVisible = ref(false);
const recordVisible = ref(false);

const ossFormRef = ref<ElFormInstance>();
const fileList = ref<FileItemVO[]>([]);

const columnList = ref([
{ width: '50',type: 'seq',title: '序号',field: 'index',align: 'center',  },
  { title: '文件名',field: 'name',align: 'center',  },
  {title: '文件大小(kb)', field: 'size', align: 'center',width: '80'},
  { width: '90',title: '上传人',field: 'createByName',align: 'center',  },
  { width: '160',title: '上传时间',field: 'createTime',align: 'center',  },
  // {title: '缩略图', field: 'src', align: 'center', showOverflow: false},
{ width: '150',title: '操作',align: 'center',field: 'make'  },
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


const fileViewRef = ref()
const preview = (row) => {
  fileViewRef.value.preview(row)
}

// 上传文件
const craftFileChange = async (val:any) => {
  setTimeout(()=>form.value.fileList = val ,600);
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
  const res = await listContractFiles(props.id);
  fileList.value = res;
  loading.value = false;
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

const delAssignFile = async(_ids: any) => {
  await proxy?.$modal.confirm('是否删除文件？').finally(() => loading.value = false);
  await deleteFile(_ids);
  await handleFile(orderId.value);
}


/** 文件上传提交按钮 */
const submitOSSForm = () => {

  if (!form.value.fileList||form.value.fileList.length == 0) {
    proxy?.$modal.msgError("请选择文件");
    return;
  }
  console.log('form.value.fileList',form.value.fileList);
  let tempFileList = JSON.parse(JSON.stringify(form.value.fileList))
  tempFileList.forEach((item) => {item.moduleCode = props.moduleCode, item.bizType = props.bizType, item.bizId = props.id, item.tempImgUrls = undefined, item.url = undefined});
  buttonLoading.value = true;

  addBatchFile(tempFileList).then(res => {
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

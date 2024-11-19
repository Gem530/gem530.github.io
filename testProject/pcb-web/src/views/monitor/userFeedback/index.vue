<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card" >
        <XTable toolId="userFeedbackTable" class="xtable-content" height="100%" v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="userFeedbackList"
                :columnList="columnList"
                :intervalCondition="intervalCondition"
                ref="XTableRef"
                border
                :loading="loading"
                :showRefresh="true"
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                :row-config="{ keyField:'id' }"
        >
          <template #default-make="scope">
            <el-button link type="primary" @click="openFile(scope.row)">查看文件</el-button>
          </template>
        </XTable>
    </el-card>

    <!--文件-->
    <el-drawer :title="fileDialog.title" v-model="fileDialog.visible" size="60%" visible.sync="false" draggable
               :destroy-on-close="true">
      <XTable :pageShow="false" class="xtable-content" :loading="fileLoading" :data="fileList"
              :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef7" border
              :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
              :page-params="{ perfect: true, total: fileTotal }">
        <template #default-fileName="scope">
          {{ scope.row.name }}
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
        </template>
        <template #default-src="scope">
          <ImagePreview
            :width="100"
            :height="100"
            :src="scope.row.url"
            :type="scope.row.type"
            :preview-src-list="[scope.row.url]"
          />
        </template>
      </XTable>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="fileDialog.visible=false">取 消</el-button>
        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script setup name="UserFeedback" lang="ts">
import {getFeedbackFileList, listUserFeedback} from '@/api/monitor//userFeedback';
import { UserFeedbackVO, UserFeedbackQuery, UserFeedbackForm } from '@/api/monitor/userFeedback/types';
import {ref} from "vue";
import {downloadUrl} from "@/api/upload";
import fileSaver from "file-saver";
import {ElLoading} from "element-plus";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userFeedbackList = ref<UserFeedbackVO[]>([]);
const fileList = ref<any[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const fileLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const fileTotal = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userFeedbackFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserFeedbackForm = {
  id: undefined,
  ownerId: undefined,
  feedback: undefined
}
const data = reactive<PageData<UserFeedbackForm, UserFeedbackQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    feedback: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    feedback: [
      { required: true, message: "反馈意见不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([
  { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '姓名', width: '100', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入姓名' } },
  { title: '手机号', width: '120', field: 'phoneNumber', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入手机号' } },
  { title: '反馈时间', width: '160', field: 'createTime', align: 'center',  filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: '详细内容', field: 'feedback', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入详细内容' }},
  { title: '操作', width: '160', field: 'make', align: 'center'},
]);

const fileColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '文件名称', field: 'name', align: 'center'},
  {title: '缩略图', field: 'src', align: 'center', showOverflow: false},
  {title: '文件大小', width: '80', field: 'size', align: 'center'},
  {title: '上传人', width: '120', field: 'createByName', align: 'center'},
  {title: '上传时间', width: '130', field: 'createTime', align: 'center'},
]);

const intervalCondition = ['createTime'];

const { queryParams, form, rules } = toRefs(data);

const fileDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询用户反馈意见列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserFeedback(queryParams.value);
  userFeedbackList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查看文件按钮 */
const openFile = async (row: any) => {
  fileDialog.title = "反馈图片";
  fileDialog.visible = true;
  fileLoading.value = true;
  await getFeedbackFileList(row.id).then(res =>{
    fileList.value = res.data;
  }).finally(() => fileLoading.value = false);
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  userFeedbackFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 文件下载 */
const downLoadHandle = (key: string) => {
  let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
  console.log(key)
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

onMounted(() => {
  getList();
});
</script>

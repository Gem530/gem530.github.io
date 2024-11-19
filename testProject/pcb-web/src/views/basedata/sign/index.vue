<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
          <el-col :span="1.5"> -->
          <el-form class="width-100">
            <el-form-item>
              <div class="width-100 text-right">
                <el-button type="primary" v-if="checkPermi(['basedata:sign:add'])" @click="handleAdd">新增</el-button>
              <!-- </el-col>
              <el-col :span="1.5"> -->
                <el-button type="primary" v-if="checkPermi(['basedata:sign:export'])" @click="handleExport">导出</el-button>
              </div>
            </el-form-item>
          </el-form>
          <!-- </el-col>
        </el-row>
      </template> -->
      <el-tabs v-if="checkPermi(['basedata:sign:listView'])" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="电子签名" :name="2">
          <XTable
            class="xtable-content"
            height="100%"
            :loading="loading"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="signList"
            :columnList="columnList"
            ref="XTableRef"
            border
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{reserve: true }"
            :row-config="{ keyField:'id' }"
            :showRefresh="true"
            toolId="pdfSignToolId"
            :intervalCondition="['createTime', 'updateTime']"
          >
            <template #default-signType="{ row }">
              {{ PdfSignTypeEnum.find(item => item.value == row.signType)?.label }}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:detail'])" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:edit'])" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:edit'])" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:detail'])" @click="preview(scope.row)">预览</el-button>
              <!-- <el-button link type="primary" @click="previewSignature(scope.row)">预览签章效果</el-button>
              <el-button link type="primary" @click="querySignList">签章列表</el-button> -->
            </template>
          </XTable>

        </el-tab-pane>
        <el-tab-pane label="电子印章" :name="1">
          <XTable
            class="xtable-content"
            height="100%"
            :loading="loading"
            v-model:page-size="querySignParams.pageSize"
            v-model:current-page="querySignParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="signList"
            :columnList="columnList2"
            ref="XTableRef"
            border
            @searchChange="searchSignChange"
            :column-config="{ resizable: true }"
            @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{reserve: true }"
            :row-config="{ keyField:'id' }"
            :showRefresh="true"
            toolId="pdfSignToolId"
            :intervalCondition="['createTime', 'updateTime']"
          >
            <template #default-signType="{ row }">
              {{ PdfSignTypeEnum.find(item => item.value == row.signType)?.label }}
            </template>
            <template #default-useModule="{ row }">
              {{ moduleTypeList.find(item => item.value == row.useModule)?.label }}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:detail'])" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:edit'])" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:edit'])" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" v-if="checkPermi(['basedata:sign:detail'])" @click="preview(scope.row)">预览</el-button>
              <!-- <el-button link type="primary" @click="previewSignature(scope.row)">预览签章效果</el-button>
              <el-button link type="primary" @click="querySignList">签章列表</el-button> -->
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>

    <!-- </el-card> -->
    <!-- 添加或修改签章管理对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="35%">
      <el-form ref="signFormRef" :model="form" :rules="rules" label-width="100px" :disabled="dialog.title == '签章详情'">
        <el-form-item label="签章类型：" prop="signType">
          <el-radio-group v-model="form.signType" @change="signTypeChange">
            <el-radio v-for="item in signTypeRadio" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 签名名称 -->
        <el-form-item label="签章名称：" prop="signName">
          <el-input v-model="form.signName" maxLength="100" clearable style="width: 60%;" />
        </el-form-item>
        <el-form-item v-if="form.signType == '1'" prop="useModule">
          <template #label>
                <span>
                  <el-tooltip content="指定了默认单据的签章，在该单据需要签章时，会自动使用该印章进行确认" placement="top">
                    <el-icon> <question-filled /> </el-icon>
                  </el-tooltip>
                  默认模块：
                </span>
          </template>
          <el-select v-model="form.useModule" clearable filterable placeholder="请选择" style="width: 60%;">
            <el-option
              v-for="item in moduleTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 签章上传 使用xupload -->
        <el-form-item v-if="dialog.title != '签章详情'" label="上传附件：" prop="fileHandleList">
          <div class="global-flex flex-start">
            <XUpload
              class="upload-width-auto"
              v-model:model-value="form.fileList"
              :fileType="fileType"
              @fileChange="handleFileChange"
              @delFile="handleFileChange"
              model="preview"
              :limit="1"
              :multiple="false"
              :fileSize="5"
              accept="image/png, image/jpeg"
            ></XUpload>
            <!-- 提示 -->
            <span style="margin-left:10px;font-size: 12px;color: #AAA">
              仅支持.jpg/png格式，且文件大小不超过5M<br>若使用图片上传，请确保签章的背景为白色（建议用白纸签字/盖章后进行拍照上传）
            </span>
          </div>
        </el-form-item>

        <el-form-item :label="dialog.title == '签章详情' ? '签章预览：':'效果预览：'" prop="fileList">
          <div class="global-flex flex-start">
            <XUpload
              class="upload-none upload-width-auto"
              v-model:model-value="form.fileHandleList"
              :fileType="fileType"
              model="preview"
              :limit="1"
              :multiple="false"
              :fileSize="5"
              :readOnly="true"
              accept="image/png, image/jpeg"
            ></XUpload>
          </div>
        </el-form-item>

        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入文字" clearable style="width: 60%" rows="3" maxLength="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign"></signDialog>

    <FileView ref="fileViewRef"></FileView>

    <el-dialog destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" visible.sync="false" draggable>
      <div v-loading="loadingSignReview">
        <el-image style="width=595px;height=842px; border: 1px solid #ff0000;" :src="imageSrc" v-if="imageSrc"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Sign" lang="ts">
import {
  listSign,
  getSign,
  delSign,
  addSign,
  updateSign,
  getSignPdf,
  handleSign,
  queryUseModule
} from '@/api/basedata/sign';
import { SignVO, SignQuery, SignForm } from '@/api/basedata/sign/types';
import { VxeTableEvents } from 'vxe-table'
import {ref} from "vue";
import {checkPermi} from "@/utils/permission";
import {ElMessageBox} from "element-plus";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const signList = ref<SignVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const loadingSignReview = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const signFormRef = ref<ElFormInstance>();
const fileViewRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
/**运行文件上传的类型 */
const fileType: string[] = ["jpg", "png"];
const signTypeRadio = ref([
  { label: '电子签名', value: "2" },
  { label: '电子印章', value: "1" },
]);

const moduleTypeList = ref([
  { label: '采购合同', value: "1" },
  { label: '采购送货', value: "2" },
  { label: '采购退货', value: "3" },
  { label: '采购对账', value: "4" },
]);

const initFormData: SignForm = {
  id: undefined,
  bizStr: undefined,
  signName: undefined,
  signType: '2',
  state: undefined,
  ownerId: undefined
}
const data = reactive<PageData<SignForm, SignQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    bizStr: undefined,
    signName: undefined,
    signType: '2',
    state: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    signName: [
      { required: true, message: "请输入签章名称", trigger: "change" }
    ],
    signType: [
      { required: true, message: "请选择签章类型", trigger: "change" }
    ],
    fileHandleList: [
      { required: true, message: "请上传附件", trigger: ["change","blur"] }
    ]
  }
});
// PdfSignTypeEnum 1个人章 2个人签名 3 公司盖章
const PdfSignTypeEnum = [
  { label: '电子印章', value: '1' },
  { label: '电子签名', value: '2' },
  // { label: '公司盖章', value: '3' }
]

/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '签名预览'
});
const XTableRef = ref()

const columnList = ref([

  { title:"序号" ,type: 'seq',field:'seq' , align: 'center', width: '60' },
  { title: '签章名称', field: 'signName', align: 'center',winWidth: '200', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '签章类型', field: 'signType', align: 'center',winWidth: '120',},
  { title: '上传人', field: 'createByName', align: 'center', winWidth: '80',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '上传日期', field: 'createTime', align: 'center', winWidth: '140', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    } },
  { title: '修改人', field: 'updateByName', align: 'center', winWidth: '80',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '最后修改时间', field: 'updateTime', align: 'center', winWidth: '140', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    } },
  { title: '备注', field: 'remark', align: 'center',filterType: 'input',winWidth: '160', },
  //{ title: '单位名称', field: 'ownerName', align: 'center', width: '200', filterType: 'input', filterParam: { placeholder: '' } },
  //{ title: '签章附件', field: 'name', align: 'center' },
  { title: '操作', field: 'make', align: 'center', winWidth: '240', fixed: 'right', autoExpend: true },
]);

const columnList2 = ref([
  { title:"序号" ,type: 'seq',field:'seq' , align: 'center', width: '60' },
  { title: '签章名称', field: 'signName', align: 'center',winWidth: '200', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '签章类型', field: 'signType', align: 'center',winWidth: '120',},
  { title: '默认使用模块', field: 'useModule', align: 'center',winWidth: '140', filterType: 'radio', filterData: () => moduleTypeList.value },
  { title: '上传人', field: 'createByName', align: 'center', winWidth: '80',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '上传日期', field: 'createTime', align: 'center', winWidth: '140', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    } },
  { title: '修改人', field: 'updateByName', align: 'center', winWidth: '80',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '最后修改时间', field: 'updateTime', align: 'center', winWidth: '140', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    } },
  { title: '备注', field: 'remark', align: 'center',filterType: 'input',winWidth: '160', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', autoExpend: true },
]);

const checkedSignList = ref<SignVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const querySignParams = ref({
  pageNum: 1,
  pageSize: 20,
  bizStr: undefined,
  signName: undefined,
  signType: '1',
  state: undefined,
  ownerId: undefined,
  params: {}
});

const selectChangeEvent: VxeTableEvents.CheckboxAll<SignVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedSignList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

// 获取 搜索条件
const searchSignChange = (params: any) => {
  querySignParams.value = params
  getSignList()
}

/** 查询签章管理列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.signType = editableTabsValue.value;
  const res = await listSign(queryParams.value);
  signList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询电子签章列表 */
const getSignList = async () => {
  loading.value = true;
  querySignParams.value.signType = editableTabsValue.value;
  const res = await listSign(querySignParams.value);
  signList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  signFormRef.value?.resetFields();
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

/** 多选框选中数据 */
const handleSelectionChange = (selection: SignVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加签章管理";
}

/** 详情按钮 */
const handleDetail = async (row?: SignVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSign(_id);
  Object.assign(form.value, res.data);
  // 给form.fileList 加一条数据
  form.value.fileHandleList = [{ name: res.data.name, url: res.data.url, key: res.data.key, size: res.data.size,type:res.data.type }];
  dialog.visible = true;
  dialog.title = "签章详情";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SignVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSign(_id);
  Object.assign(form.value, res.data);
   console.log(res.data);
  // 给form.fileList 加一条数据
  form.value.fileList = [{ name: res.data.name, url: res.data.url, key: res.data.key, size: res.data.size,type:res.data.type }];
  form.value.fileHandleList = [{ name: res.data.name, url: res.data.url, key: res.data.key, size: res.data.size,type:res.data.type }];
  console.log(form.value.fileList)
  dialog.visible = true;
  dialog.title = "修改签章管理";
}
/** 修改按钮操作 */
const handleSelect = async (row?: SignVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSign(_id);
  Object.assign(form.value, res.data);

  // 给form.fileList 加一条数据
  form.value.fileList = [{ name: res.data.name, url: res.data.url, key: res.data.key, size: res.data.size,type:res.data.type }];
  form.value.fileHandleList = [{ name: res.data.name, url: res.data.url, key: res.data.key, size: res.data.size,type:res.data.type }];
  console.log("form.value.fileHandleList:",form.value.fileHandleList)
  dialog.visible = true;
  dialog.title = "修改签章管理";
}

/** 提交按钮 */
const submitForm = () => {
  signFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.size=form.value.fileHandleList[0].size;
      form.value.name=form.value.fileHandleList[0].name;
      form.value.key=form.value.fileHandleList[0].key;
      if (form.value.id) {
        // 印章类型判断是否存在默认使用模块
        if(form.value.signType == '1' && form.value.useModule) {
          const res = await queryUseModule({useModule: form.value.useModule, id: form.value.id});
          if (res.data) {
            await proxy?.$modal.confirmNew('当前模块已被其他签章关联，继续指定该模块将会取消之前关联的签章').finally(() => buttonLoading.value = false);
            form.value.cancelUseModule = '1';
          }
        }
        if(!form.value.useModule) {
          form.value.useModule = undefined;
        }
        await updateSign(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        // 印章类型判断是否存在默认使用模块
        if(form.value.signType == '1' && form.value.useModule) {
          const res = await queryUseModule({useModule: form.value.useModule});
          if (res.data) {
            await proxy?.$modal.confirmNew('当前模块已被其他签章关联，继续指定该模块将会取消之前关联的签章').finally(() => buttonLoading.value = false);
            form.value.cancelUseModule = '1';
          }
        }
        await addSign(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      // 重置表单
      reset();
      dialog.visible = false;
      await getVoidedList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SignVO) => {
  const _ids = row?.id;
  await proxy?.$modal.confirm('确认删除"' + row.signName + '"签章吗？').finally(() => loading.value = false);
  await delSign(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/**
 * 单选切换
 */
const signTypeChange = () => {
  // 选择改变后重新处理图片
  if(form.value.fileList?.length > 0) {
    form.value.fileHandleList=[];
    handleSign({key:form.value.fileList[0].key,signType:form.value.signType}).then(res => {
      form.value.fileHandleList = [{url:res.data.url,key:res.data.key,size:form.value.fileList[0].size,name:form.value.fileList[0].name,type:form.value.fileList[0].type}];
      console.log(form.value.fileHandleList);
    })
    signFormRef.value?.clearValidate('fileList');
    signFormRef.value?.clearValidate('fileHandleList');
  }
  // form.value.fileList = [];
  // form.value.fileHandleList = [];
  // signFormRef.value?.clearValidate('fileList');
  // signFormRef.value?.clearValidate('fileHandleList');
  // signFormRef.value?.validateField('fileList');
  // signFormRef.value?.validateField('fileHandleList');

}
/**
 * handleFileChange 清空form.fileList 校验
 */
const handleFileChange = (file: any) => {

  if (file.length > 0) {
    form.fileList = file;
    form.value.fileHandleList=[];
    handleSign({key:file[0].key,signType:form.value.signType}).then(res => {
      form.value.fileHandleList = [{url:res.data.url,key:res.data.key,size:form.value.fileList[0].size,name:form.value.fileList[0].name,type:form.value.fileList[0].type}];
      console.log(form.value.fileHandleList);

    })

    signFormRef.value?.clearValidate('fileList');
    signFormRef.value?.clearValidate('fileHandleList');
  } else {
    form.value.fileList = [];
    form.value.fileHandleList = [];
    signFormRef.value?.validateField('fileList');
    signFormRef.value?.validateField('fileHandleList');
  }
}

/** 导出按钮操作 */
const handleExport = () => {
  if(2 == editableTabsValue.value) {
    proxy?.download('pdf/sign/export',  {...queryParams.value, tableName: 'pdfSignToolId'}, `签章列表_${new Date().getTime()}.xlsx`)
  } else {
    proxy?.download('pdf/sign/export',  {...querySignParams.value, tableName: 'pdfSignToolId'}, `签章列表_${new Date().getTime()}.xlsx`)
  }
}

/**===============签名列表========= */

const signVisible = ref(false);

const querySignList = async () => {
    signVisible.value = true;
}
const submitSign = async (key:any, ) => {
    console.log(key);
}
const cancelSign = async () => {
    console.log('cancel');

}
/**======================================= */
const preview = (row) => {
  console.log(row);

  fileViewRef.value.preview(row)
  console.log(row);
}
const  imageSrc = ref('');
const previewSignature = (row) => {
        reportDrawer.visible = true;
        loadingSignReview.value = true;
        getSignPdf({key:row.key,type:row.signType}).then(res => {
        const blob = res;
        imageSrc.value = URL.createObjectURL(res);
        loadingSignReview.value = false;
        });
}
// 监听form.fileList

const editableTabsValue = ref(2);


const getVoidedList = async () => {
  if (2 == editableTabsValue.value) {
    getList();
  } else {
    getSignList();
  }
}

onMounted(() => {
  getList();
});
</script>

<style>

 .sign_text {
   width: 100px;
   text-align: center;
 }
 .upload-none {
   .el-upload-list__item-status-label {
     display: none !important;
   }
 }

 .upload-width-auto {
   width: auto !important;
 }

</style>

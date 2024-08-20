<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
          </el-col>
        </el-row>
      </template>

      <XTable toolId="projectEcn" :pageShow="true" v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
        :intervalCondition="['notifyTime']" :page-params="{ perfect: true, total: total }" :data="ecnList"
        :scroll-y="{ enabled: true }" :loading="loading" size="mini" :columnList="columnList" border
        @searchChange="handleQuery" :column-config="{ resizable: true }">

        <template #default-notifyTime="scope">
          <span>{{ parseTime(scope.row.notifyTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-hasAcknowledgment="scope">
          <el-icon v-if="scope.row.hasAcknowledgment=='1'"><Check /></el-icon>
        </template>
        <template #default-hasImpedanceReport="scope">
          <el-icon v-if="scope.row.hasImpedanceReport=='1'"><Check /></el-icon>
        </template>
        <template #default-hasSection="scope">
          <el-icon v-if="scope.row.hasSection=='1'"><Check /></el-icon>
        </template>
        <template #default-hasImpedanceBar="scope">
          <el-icon v-if="scope.row.hasImpedanceBar=='1'"><Check /></el-icon>
        </template>
        <template #default-hasFilm="scope">
          <el-icon v-if="scope.row.hasFilm=='1'"><Check /></el-icon>
        </template>
        <template #default-hasSealedSample="scope">
          <el-icon v-if="scope.row.hasSealedSample=='1'"><Check /></el-icon>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="qualityFile(scope.row)">品质文件</el-button>
          <el-button link type="primary" @click="accountUReportHandle(scope.row)">工程文件</el-button>
          <el-button link type="primary" @click="miPre(scope.row)">预览MI</el-button>
        </template>
      </XTable>
    </el-card>

    <el-drawer :title="fileDialog.title" v-model="fileDialog.visible" size="60%" visible.sync="false" draggable destroy-on-close>
      <el-tabs type="border-card"  v-model="fileTab" class="xtable-tab"  @tab-click="radioFileTableHandle" >
        <el-tab-pane label="MI文件" name="MI文件">
          <XTable  :pageShow="false"
            class="xtable-content" :loading="loading" :data="filesDataObj.miFileList" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef1" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="开料方案" name="开料方案">
          <XTable :pageShow="false"   class="xtable-content" :loading="loading" :data="filesDataObj.schemeFileVos" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef2" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="工序文件" name="工序文件">
          <XTable :pageShow="false"   class="xtable-content" :loading="loading" :data="filesDataObj.craftFileVos" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef3" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="工模治具" name="工模治具">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.modelFileVos" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef4" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="层压结构" name="层压结构">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.laminatedFileVos" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef5" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="外形图" name="外形图">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.outSideFileList" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef6" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="产品文件" name="产品文件">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.saleOrderFileVos" :show-footer="false"
            :columnList="fileColumnList" ref="fileleteTableRef7" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="cacelFile">取 消</el-button>
          <!-- <el-button type="primary" >下载全部</el-button> -->
        </div>
      </template>
    </el-drawer>


    <el-drawer :title="pzFileDialog.title" v-model="pzFileDialog.visible" size="60%" visible.sync="false" draggable destroy-on-close>
      <el-tabs type="border-card"  v-model="pzFileTab" class="xtable-tab"  >
        <el-tab-pane label="品质文件" name="品质文件">
          <el-button  type="primary" @click="handleFile(pzFileRowId)">上传文件</el-button>
          <XTable  :pageShow="false"
            class="xtable-content" :loading="loading" :data="pzFileList" :show-footer="false"
            :columnList="pzFileColumnList" ref="fileleteTableRef2" border :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }" :page-params="{ perfect: true, total: fileTotal }">


            <template #default-make="scope">
              <el-button link type="primary" @click="deleteFile(scope.row.id)">删除</el-button>
              <el-button link type="primary" @click="downLoadFile(scope.row.key)">下载</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="pzFileDialog.visible = false">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <MIPrint ref="MIPrintRef"  ></MIPrint>

    <!-- 添加或修改OSS对象存储对话框 -->
    <el-dialog :title="dialogOSS.title" v-model="dialogOSS.visible" width="500px">
      <el-form ref="ossFormRef" :model="pzForm" label-width="80px">
        <el-form-item label="文件名">
          <XUpload v-model:model-value="pzForm.file" model="download" :limit="1" @fileChange="craftFileChange" @delFile="(val, files) => delFile(val, files, 1)"></XUpload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitOSSForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="dialogOSS.visible=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="InProgressOrder" lang="ts">
import fileSaver from "file-saver";
import { listOrder, getPrintOrder,getProjectFile,getQualityProjectFile,uploadPZFile,deletePZFile } from '@/api/report/inProgressOrder';
import { sortBy } from "@/utils/dict";
import { getDicts } from "@/api/system/dict/data";
import { getReportUrl } from '@/utils/report';
import { InProgressOrderVO, InProgressOrderQuery, InProgressOrderForm } from '@/api/report/inProgressOrder/types';
import { VxeTableInstance } from 'vxe-table';
import * as QRCode from "qrcode";
import {loadFile} from '@/utils/pdfToImg';
import {downloadUrl} from '@/api/upload/index';

const MIPrintRef = ref();
const fileTotal = ref(0);
const fileTab = ref('MI文件');
const filesData = ref<any>([]);
const filesDataObj = ref<any>([]);
const fileDialog = reactive<DialogOption>({ visible: false, title: ''});

const pzFileList = ref<any>([]);
const pzFileTab = ref('品质文件');
const pzFileRowId = ref();
const pzFileDialog = reactive<DialogOption>({ visible: false, title: ''});
const dialogOSS = reactive<DialogOption>({visible: false,title: ''});
const pzForm = ref({
  file:'',
  bizId:''
});


const fileColumnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60' },
  { title: '工序名称', width: '120', field: 'craftName', align: 'center' ,visible:false},
  { title: '开料方案', width: '120', field: 'schemeName', align: 'center' ,visible:false},
  { title: '物料编码', width: '120', field: 'materialNumber', align: 'center' ,visible:false},
  { title: '物料名称', width: '120', field: 'materialName', align: 'center' ,visible:false},
  { title: '产品名称', width: '120', field: 'commodityCode', align: 'center' ,visible:false},
  { title: '文件名称',  field: 'fileName', align: 'center' },
  { title: '文件大小', width: '80', field: 'size', align: 'center' },
  { title: '上传人', width: '120', field: 'createByName', align: 'center' },
  { title: '上传时间', width: '120', field: 'createTime', align: 'center' },
]);
const pzFileColumnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '文件名', field: 'name', align: 'center',minWidth: '200'},
  {title: '上传人', field: 'createByName', align: 'center',width: '70'},
  {title: '文件大小(kb)', field: 'size', align: 'center',width: '80'},
  {title: '上传时间', field: 'createTime', align: 'center',width: '120'},
  {title: '操作', field: 'make', align: 'center',width: '120'},
])

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ecnList = ref<InProgressOrderVO[]>([]);
const loading = ref(true);
const total = ref(0);
const ecnFormRef = ref<ElFormInstance>();
const ecnTable = reactive<DialogOption>({
  visible: false,
  title: ''
});
let resDictData = ref<Record<string, any>>({
  //表面处理
  order_surface_treatment: [],
  //阻焊颜色
  order_commodity_solder: [],
  //字符颜色
  order_character: [],
  //成型方式
  order_commodity_form: [],
  //测试方式
  order_commodity_testway: [],
})
const code = ref("");
const url = ref("");
const fileName = ref("");
const imageUrls = ref<any>([]);
const productionDetails = ref<any>([]);
const allData = ref<any>();
const commodityInfos = ref<any>([]);
const publicCommodityInfo = ref<any>([]);
const drillHeaders = ref<any>([]);
const drillInfos = ref<any>([]);
const drillTitles = ref<any>([]);
const n_drillInfos = ref<any>([]);
const n_drillHeaders = ref<any>([]);
const n_drillTitles = ref<any>([]);
const qcCodeImage = ref<any>([]);
const schemeImages = ref<any>([]);
const laminateImages = ref<any>([]);
//存压合工艺参数
const laminateInfo = ref<any>();
const outsideImages = ref<any>([]);
const scrapped = [1, 2, 3, 4, 5, 6, 7];
const cardRef = ref();

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '待制订单'
});

let reportUrl = ref("");
const printType = ref("all");

// 切换菜单栏不刷新
const radioFileTableHandle = (tab: any, event: any) => {
  console.log("tab", tab.props.label);
  fileTab.value = tab.props.label;
  if (fileTab.value == "MI文件") {
    fileColumnList.value[1].visible = false;
    fileColumnList.value[2].visible = false;
    fileColumnList.value[3].visible = false;
    fileColumnList.value[4].visible = false;
    fileColumnList.value[5].visible = false;
  } else if(fileTab.value == "开料方案"){
    fileColumnList.value[1].visible = false;
    fileColumnList.value[2].visible = true;
    fileColumnList.value[3].visible = false;
    fileColumnList.value[4].visible = false;
    fileColumnList.value[5].visible = false;
  }else if(fileTab.value == "工序文件"){
    fileColumnList.value[1].visible = true;
    fileColumnList.value[2].visible = false;
    fileColumnList.value[3].visible = false;
    fileColumnList.value[4].visible = false;
    fileColumnList.value[5].visible = false;
  }else if(fileTab.value == "工模治具"){
    fileColumnList.value[1].visible = true;
    fileColumnList.value[2].visible = false;
    fileColumnList.value[3].visible = true;
    fileColumnList.value[4].visible = true;
    fileColumnList.value[5].visible = false;
  }else if(fileTab.value == "层压结构"){
    fileColumnList.value[1].visible = true;
    fileColumnList.value[2].visible = false;
    fileColumnList.value[3].visible = false;
    fileColumnList.value[4].visible = false;
    fileColumnList.value[5].visible = false;
  }else if(fileTab.value == "外形图"){
    fileColumnList.value[1].visible = false;
    fileColumnList.value[2].visible = false;
    fileColumnList.value[3].visible = false;
    fileColumnList.value[4].visible = false;
    fileColumnList.value[5].visible = false;
  }else  {
    fileColumnList.value[1].visible = false;
    fileColumnList.value[2].visible = false;
    fileColumnList.value[3].visible = false;
    fileColumnList.value[4].visible = false;
    fileColumnList.value[5].visible = true;
  }
}
const cacelFile = () => {
  filesDataObj.value = null;
  fileDialog.visible = false;
}
/** 对账单按钮操作 */
const accountUReportHandle = async (row: InProgressOrderVO) => {
  fileDialog.title = "工程文件";
  fileTab.value = ref('MI文件');
  fileDialog.visible = true;
  let query={
    pageNum: 1,
    pageSize: 20,
    id: row.id
  }
  filesDataObj.value=await getProjectFile(query);
  if(filesDataObj.value.miFileList){
    filesDataObj.value.miFileList.forEach((item:any)=>{
      item.sysFileVo=[item];
    })
  }
  if(filesDataObj.value.outSideFileList){
    filesDataObj.value.outSideFileList.forEach((item:any)=>{
    item.sysFileVo=[item];
  })
  }
  
  console.log("filesDataObj",filesDataObj);
}

const qualityFile = async (row: InProgressOrderVO) => {
  pzFileRowId.value='';
  pzFileList.value=[];
  pzFileDialog.title = "品质文件";
  pzFileTab.value = ref('品质文件');
  pzFileDialog.visible = true;
  await getQualityFileList(row.id);
}
const getQualityFileList = async (rowId: any) => {
  pzFileRowId.value=rowId;
  pzFileList.value=await getQualityProjectFile({ id: rowId });
}


const currentPdfList = ref<string[]>([])
const miPre = async (row: InProgressOrderVO) => {
  printType.value = "outsideImages";
  await doPrint(row, null);
  reportDrawer.title = "mi预览";
  reportDrawer.visible = true;
}
const initFormData: InProgressOrderForm = {
  productionNo: "",
  commodityId: "",
  productionId: "",
  commodityName: undefined,
  quantity: "",
  area: "",
  placeOrderTime: "",
  miCompleteTime: "",
  feedTime: "",
  dispatchTime: "",
  materialLayer: "",
  commoditySolder: "",
  surfaceTreatment: "",
  characterColor: "",
  commodityForm: "",
  commodityTestWay: ""
}

const data = reactive<PageData<InProgressOrderForm, InProgressOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    params: {
    }
  },
  rules: {
    commodityName: [
      { required: true, message: "产品名称不能为空", trigger: "change" }
    ],
    notifyTime: [
      { required: true, message: "通知日期不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form: outForm, rules: rules } = toRefs(data);

//状态: 是否完结 1完结 2未完结
const statusFilterData = ref([
  { label: '是', value: "1" },
  { label: '否', value: "0" },
])

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '排产单号', width: '90', field: 'productionNo', align: 'center' },
  { title: '产品编码', width: '90', field: 'commodityCode', align: 'center' ,filterType: 'input'},
  { title: '产品名称', width: '160', field: 'commodityName', align: 'center' },
  { title: '订单数量(PCS)', width: '80', field: 'quantity', align: 'center' },
  { title: '订单面积(㎡)', width: '90', field: 'area', align: 'center' },
  { title: '下单时间', width: '120', field: 'placeOrderTime', align: 'center' },
  { title: 'MI完成时间', width: '120', field: 'miCompleteTime', align: 'center' },
  { title: '投料时间', width: '120', field: 'feedTime', align: 'center' },
  { title: '工厂交期', width: '80', field: 'dispatchTime', align: 'center' },
  { title: '板层', width: '60', field: 'materialLayer', align: 'center' },
  { title: '阻焊颜色', width: '80', field: 'commoditySolder', align: 'center'  },
  { title: '表面处理', width: '80', field: 'surfaceTreatment', align: 'center' },
  { title: '字符颜色', width: '80', field: 'characterColor', align: 'center'  },
  { title: '成形方式', width: '80', field: 'commodityForm', align: 'center' },
  { title: '测试方式', width: '80', field: 'commodityTestWay', align: 'center'  },
  { title: '承认书/出货报告', width: '80', field: 'hasAcknowledgment', align: 'center', filterType: 'radio', filterData: () => statusFilterData.value },
  { title: '阻抗报告', width: '80', field: 'hasImpedanceReport', align: 'center' , filterType: 'radio', filterData: () => statusFilterData.value  },
  { title: '切片', width: '80', field: 'hasSection', align: 'center' , filterType: 'radio', filterData: () => statusFilterData.value  },
  { title: '阻抗条', width: '80', field: 'hasImpedanceBar', align: 'center' , filterType: 'radio', filterData: () => statusFilterData.value  },
  { title: '菲林', width: '80', field: 'hasFilm', align: 'center', filterType: 'radio', filterData: () => statusFilterData.value   },
  { title: '封样', width: '80', field: 'hasSealedSample', align: 'center' , filterType: 'radio', filterData: () => statusFilterData.value  },
  { title: '操作', field: 'make', align: 'center', fixed: 'right', width: 240, showOverflow: false },
]);


/** 查询ECN通知列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrder(queryParams.value);
  ecnList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
}

/** 表单重置 */
const reset = () => {
  ecnFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = (params: any) => {
  queryParams.value = params;
  getList();
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  ecnTable.visible = true;
  ecnTable.title = "添加ECN通知";
  //设置默认日期
  setDafaultDate();
}

const setDafaultDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  console.log("setDafaultDate", `${year}-${month}-${day}`);
}
/**
 * 获取字典数据
 */
const getDictOptions = async () => {
  const rules = [['dictSort', 'asc']];
  const string = "order_surface_treatment,order_commodity_solder,order_character,order_commodity_form,order_commodity_testway";
  getDicts(string)
    .then(res => {
      const dictData = res.data;
      string.split(",").forEach(item => {
        Object.keys(resDictData.value).forEach(dictItem => {
          if (item == dictItem) {
            resDictData.value[dictItem] = sortBy(dictData.filter(info => {
              return item == info.dictType
            }), rules);
          }
        })
      })
    });
  console.log(resDictData);
};



const doPrint = async (data: any, type: string) => {
  await getPrintOrder(data).then(res => {
    console.log("res", res);
        if(!res.planId){
          ElMessage.error("订单关联mi为空");
        }
        doMIPrint(res.planId, 'noOutsideImages');
  });
}

const doMIPrint = async (planId: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(planId, type);
}

/** 文件按钮操作 */
const handleFile = (rowId:any) => {
  dialogOSS.title = "上传回执";
  dialogOSS.visible = true;
  pzForm.value.bizId = rowId;
  pzForm.value.file = undefined;
}
// 上传文件
const craftFileChange = (val:any) => {
  pzForm.value.fileList = val
}
// 删除文件
const delFile = (val: any, files: any, type?: number) => {
    pzForm.value.fileList =undefined;
}

/** 文件上传提交按钮 */
const submitOSSForm =async () => {
  if(!pzForm.value.fileList){
    proxy?.$modal.msgError("请选择文件");
    return;
  }
  await uploadPZFile({ id: pzForm.value.bizId, fileList: pzForm.value.fileList }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
  }).finally(() => {
    dialogOSS.visible = false;
  });
  await getQualityFileList(pzForm.value.bizId);
}

const deleteFile = async(rowId:any)=>{
  await proxy?.$modal.confirm('是否确认删除？');
  await deletePZFile({id:rowId});
  await getQualityFileList(pzForm.value.bizId);
}
// 文件下载
const downLoadFile = (key: string) => {
  let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
  downloadUrl(key).then(res => {
    loadingBox.close()
    if (res.code == 200) {
      const { data } = res
      // window.open(data[key])
      fileSaver.saveAs(data[key])
    }
  }).catch((err) => {
  })
}

onMounted(() => {
  getList();
  getDictOptions();
}) 
</script>

<style lang="scss">.pop-select {
  z-index: 9999 !important;
}</style>

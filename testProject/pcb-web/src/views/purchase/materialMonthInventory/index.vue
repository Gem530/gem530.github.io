<template>
  <div class="p-2 xtable-page">
    <!-- <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch"> -->
        <el-form class="global-flex flex-start" :model="mainQueryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="结存年月" prop="yearMonth">
            <el-date-picker clearable
              v-model="mainQueryParams.yearMonth" type="month"
              value-format="YYYY-MM"
              placeholder="请选择年月"
            />
          </el-form-item>
          <el-form-item label="结存版本" prop="version">
            <el-input type="number" v-model="mainQueryParams.version" placeholder="" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <!--  class="flex-grow" style="margin-right: 0;" -->
            <!-- <div class="global-flex flex-end align-start flex-grow"> -->
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            <!-- </div> -->
          </el-form-item>
        </el-form>
      <!-- </div>
    </transition> -->

    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab only-one-tab">
      <el-tab-pane label="物料结存" :name="1">
        <div class="head-btn-flex">
          <el-button @click="handleImport">导入结存</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
        </div>
        <XTable toolId="purchaseMaterialMonthInventory" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="materialMonthInventoryList"
                :columnList="columnList"
                ref="XTableRef"
                border :showRefresh="true"
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                @checkbox-all="selectChangeEvent"
                @checkbox-change="selectChangeEvent"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }" >
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="占位tab" name="占位tab"></el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->

    <el-dialog
        v-model="exportVisible"
        title="导出提示"
        width="20%"
        align-center
        destroy-on-close
    >
      <span>
        没有设置结存年月，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加或修改物料月度结存对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" >
      <el-form ref="materialMonthInventoryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="年月" prop="yearMonth">
          <el-date-picker clearable
            v-model="form.yearMonth"
            type="month"
            value-format="YYYY-MM"
            placeholder="请选择年月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库数量" prop="outQuantity">
          <el-input v-model="form.outQuantity" placeholder="请输入出库数量" />
        </el-form-item>
        <el-form-item label="入库数量" prop="inQuantity">
          <el-input v-model="form.inQuantity" placeholder="请输入入库数量" />
        </el-form-item>
        <el-form-item label="出库金额" prop="outTotal">
          <el-input v-model="form.outTotal" placeholder="请输入出库金额" />
        </el-form-item>
        <el-form-item label="入库金额" prop="inTotalPrice">
          <el-input v-model="form.inTotalPrice" placeholder="请输入入库金额" />
        </el-form-item>
        <el-form-item label="所属单位ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入所属单位ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="upload.title" v-model="upload.open" width="550px">
      <el-row>
        <el-form-item label="结存时间节点" prop="yearMonth">
          <el-date-picker v-model="upload.yearMonth" type="datetime" placeholder="请选择结存时间" style="width: 100%" :clearable="false"/>
        </el-form-item>
      </el-row>
      <div class="el-upload__tip">
        <span>提示：请按照实际情况录入结存时间节点。例如：时间节点选择2024-04-01 00:00:00（结存月份会按照结存时间前一秒所在月份显示，即2024-04-01 00:00:00的结存月份为2024-03），导入结存后，后续物料的平均单价均以此时间之后的进出库记录计算。</span>
      </div>
      <div class="el-upload__tip">
        <span> </span>
      </div>

      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?yearMonth=' + dayjs(upload.yearMonth).format('YYYY-MM-DD HH:mm:ss')"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <XTable :showHead="false" :pageShow="false" :columnList="columnListExport" :data="tableData" style="width: 100%">
          <template #default-remark="scope">
           <span style="color:red">【必填项】</span> {{ scope.row.remark }}
          </template>
      </XTable>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="MaterialMonthInventory" lang="ts">
import {
  addMaterialMonthInventory,
  delMaterialMonthInventory,
  getMaterialMonthInventory,
  listMaterialMonthInventory,
  updateMaterialMonthInventory
} from '@/api/purchase/materialMonthInventory';
import {
  MaterialMonthInventoryForm,
  MaterialMonthInventoryQuery,
  MaterialMonthInventoryVO
} from '@/api/purchase/materialMonthInventory/types';
import {VxeTableEvents} from 'vxe-table'
import {ref} from "vue";
import {checkPermi} from "@/utils/permission";
import { globalHeaders } from "@/utils/request";
import dayjs from "dayjs";

  /*** 导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  yearMonth:dayjs(new Date()).add(-1, 'month').format("YYYY-MM"),
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/materialMonthInventory/importData"
});
const uploadRef = ref<ElUploadInstance>();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const tableData = [
  {
    seq: 1,
    name: '物料编码',
    remark: '不能为空，且物料必须在ERP系统中已有。',
  },
  {
    seq: 2,
    name: '本月库存数',
    remark: '不能为空，且请填写>0的数字。',
  },
  {
    seq: 3,
    name: '本月库存单价',
    remark: '不能为空，且请填写>0的数字。',
  },
]

const materialMonthInventoryList = ref<MaterialMonthInventoryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialMonthInventoryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MaterialMonthInventoryForm = {
  id: undefined,
  rawMaterialId: undefined,
  quantity: undefined,
  price: undefined,
  yearMonth: undefined,
  outQuantity: undefined,
  inQuantity: undefined,
  outTotal: undefined,
  inTotalPrice: undefined,
  ownerId: undefined,
  version:undefined,
}
const data = reactive<PageData<MaterialMonthInventoryForm, MaterialMonthInventoryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    version:undefined,
    rawMaterialId: undefined,
    quantity: undefined,
    price: undefined,
    yearMonth: undefined,
    outQuantity: undefined,
    inQuantity: undefined,
    outTotal: undefined,
    inTotalPrice: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    yearMonth: [
      { required: true, message: "年月不能为空", trigger: "blur" }
    ],
    outQuantity: [
      { required: true, message: "出库数量不能为空", trigger: "blur" }
    ],
    inQuantity: [
      { required: true, message: "入库数量不能为空", trigger: "blur" }
    ],
    outTotal: [
      { required: true, message: "出库金额不能为空", trigger: "blur" }
    ],
    inTotalPrice: [
      { required: true, message: "入库金额不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所属单位ID不能为空", trigger: "blur" }
    ]
  }
});
const mainData = reactive<PageData<MaterialMonthInventoryForm, MaterialMonthInventoryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    version:undefined,
    rawMaterialId: undefined,
    quantity: undefined,
    price: undefined,
    yearMonth: undefined,
    outQuantity: undefined,
    inQuantity: undefined,
    outTotal: undefined,
    inTotalPrice: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
  }
});

const XTableRef = ref()
const columnListExport = ref([
{ width: '50',title: '序号',field: 'seq',align: 'center',  },
{ width: '120',title: '重要列名',field: 'name',align: 'center',  },
{ minWidth: '345',title: '说明',field: 'remark',align: 'center',  },
]);
const columnList = ref([

  {title: "序号", type: 'seq', align: 'center', field: 'index', width: '60'},
  {title: '结存版本', field: 'version', align: 'center', width: '80', showOverflow: false,},
  {title: '物料类别', field: 'categoryName', width: '100', align: 'center', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '物料编码', field: 'materialCode', align: 'center', width: '100', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '物料名称', field: 'materialName', align: 'center', width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '材质牌号', field: 'materialQuality', align: 'center', width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '板厚', field: 'boardThickness', align: 'center', width: '60', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '铜厚', field: 'copperThickness', align: 'center', width: '60', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '颜色', field: 'color', align: 'center', width: '60', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '级别', field: 'level', align: 'center', width: '60', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  {title: '长', field: 'length', align: 'center', filterType: 'input', filterParam: {placeholder: ''}, width: '60', showOverflow: false},
  {title: '宽', field: 'width', align: 'center', filterType: 'input', filterParam: {placeholder: ''}, width: '60', showOverflow: false},
  {title: '品牌', field: 'manufacturer', align: 'center', width: '80', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center' },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  {title: '单位', field: 'units', align: 'center', width: '60', showOverflow: false, filterType: 'input', filterParam: {placeholder: ''}},
  { title:'上月结存库存数',field:'lastMonthInventoryQuantity',align:'center',width: '110',  },
  { title:'上月结存单价',field:'lastMonthInventoryPrice',align:'center',width: '110', isPermi: () => checkPermi(['purchase:MonthInventory:price'])},
  { title:'上月结存总金额',field:'lastMonthTotalAmount',align:'center', width: '110',isPermi: () => checkPermi(['purchase:MonthInventory:price']) },
  { title:'本月结存入库数',field:'inQuantity',align:'center', width: '110',  },
  { title:'本月结存入库金额',field:'inTotalPrice',align:'center', width: '110', isPermi: () => checkPermi(['purchase:MonthInventory:price'])},
  { title:'本月结存出库数',field:'outQuantity',align:'center',width: '110',  },
  { title:'本月结存出库金额',field:'outTotal',align:'center',width: '110', isPermi: () => checkPermi(['purchase:MonthInventory:price']) },
  { title:'本月结存库存数',field:'quantity',align:'center', width: '110',  },
  { title:'本月结存库存单价',field:'price',align:'center', width: '110', isPermi: () => checkPermi(['purchase:MonthInventory:price']) },
  { title:'本月结存总金额',field:'totalAmount',align:'center', width: '110', isPermi: () => checkPermi(['purchase:MonthInventory:price']) },

]);

const checkedMaterialMonthInventoryList = ref<MaterialMonthInventoryVO[]>([]);

const { queryParams, form, rules } = toRefs(data);
const { queryParams:mainQueryParams } = toRefs(mainData);
const selectChangeEvent: VxeTableEvents.CheckboxAll<MaterialMonthInventoryVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedMaterialMonthInventoryList.value = selectRecords.map(item => item);
    }
}

const queryParamsCopy = ref();
// 获取 搜索条件
const searchChange = (params: any) => {

    //删除原本不属于queryParams的属性
    for (const key in queryParams.value) {
      if (queryParamsCopy && queryParamsCopy.value && typeof queryParamsCopy.value === 'object'
        && !queryParamsCopy.value.hasOwnProperty(key)) {
        delete queryParams.value[key];
      }
    }
    queryParamsCopy.value = queryParams.value;
    queryParams.value={...mainQueryParams.value,...params}
    getList()
}

/** 查询物料月度结存列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialMonthInventory(queryParams.value);
  materialMonthInventoryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}


const exportVisible = ref(false);
const mainTableToolId = ref('purchaseMaterialMonthInventory');
/** 导出操作 */
const exportExcel = async () => {
  exportVisible.value = false;
  proxy?.download('system/materialMonthInventory/export', {
    ...queryParams.value, tableName: mainTableToolId.value
  }, `物料结存_${new Date().getTime()}.xlsx`);
}

/** 导出前操作 */
const exportExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!queryParams.value.yearMonth) {
    exportVisible.value = true;
  } else {
    proxy?.download('system/materialMonthInventory/export', {
      ...queryParams.value, tableName: mainTableToolId.value
    }, `物料结存_${new Date().getTime()}.xlsx`);
  }
}


/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  materialMonthInventoryFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  queryParams.value.yearMonth = mainQueryParams.value.yearMonth;
  queryParams.value.version = mainQueryParams.value.version;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  mainQueryParams.value = {};
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: MaterialMonthInventoryVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物料月度结存";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialMonthInventoryVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialMonthInventory(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改物料月度结存";
}

/** 提交按钮 */
const submitForm = () => {
  materialMonthInventoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialMonthInventory(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMaterialMonthInventory(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}
// 新增属性
const editableTabsValue = ref(1);
const getVoidedList = async () => {
  if (1 == editableTabsValue.value) {
    getList();
  }

}

/**
 * 物料结存导出
 */
const downloadInventry= async () => {

}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialMonthInventoryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物料月度结存编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialMonthInventory(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/materialMonthInventory/export', {
    ...queryParams.value
  }, `materialMonthInventory_${new Date().getTime()}.xlsx`)
}

/** 导入按钮操作 */
const handleImport = () => {
  upload.title = "导入结存";
  upload.open = true;
  uploadRef.value?.clearFiles();
};

/**文件上传中处理 */
const handleFileUploadProgress = () => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value?.handleRemove(file);
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getVoidedList();
};
/** 时间禁选*/
const disabledDate = (date:any) => {
  let today = new Date(dayjs(new Date()).add(-1, 'month').format("YYYY-MM"));
  today.setHours(0, 0, 0, 0);
  return new Date(date).getTime() > new Date(today).getTime();
}
/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value?.submit();
  // proxy?.$modal.loading("正在上传");
  // uploadRef.value?.clearFiles();
  // proxy?.$modal.closeLoading();
}

onMounted(() => {
  getList();
});
</script>

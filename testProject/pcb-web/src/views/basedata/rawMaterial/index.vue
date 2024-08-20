<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8" style="justify-content: end;">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">
              新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain icon="Download" @click="handleExport">导出
            </el-button>
          </el-col>
        </el-row>
      </template>
      <el-tabs type="border-card" v-model="editableTabsValue" @tab-change="handlerClick" class="xtable-tab">
        <el-tab-pane label="使用中" name="0">
          <XTable toolId="basedataRawMaterial" :pageShow="true" v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum" :page-params="{ perfect: true, total: total }"
            :data="rawMaterialList" :columnList="columnList" :loading="loading" height="100%" class="xtable-content"
            ref="newVxeTableRef" border @searchChange="searchChange" :column-config="{ resizable: true }" :showRefresh="true"
            @checkbox-all="checkboxChangeEvent" @checkbox-change="checkboxChangeEvent">
            <template #default-status="scope">
              <el-switch @change="changeFlag(scope.row)" v-model="scope.row.status" active-value="0" inactive-value="1" />
            </template>
            <template #default-make="scope">
              <!--            <el-tooltip content="修改" placement="top">-->
              <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <!--            </el-tooltip>-->
              <!--            <el-tooltip content="删除" placement="top">-->
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <!--            </el-tooltip>-->
              <!--            <el-tooltip content="详情" placement="top">-->
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
              <!--            </el-tooltip>-->
            </template>

          </XTable>
        </el-tab-pane>
        <el-tab-pane label="不使用" name="2">
          <XTable toolId="basedataRawMaterial" :pageShow="true" v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum" :page-params="{ perfect: true, total: total }"
            :data="stopRawMaterialList" :columnList="columnList" :loading="stopLoading" height="100%"
            class="xtable-content" ref="newVxeTableRef" border @searchChange="searchChangeStop"
            :column-config="{ resizable: true }" @checkbox-all="checkboxChangeEvent" :showRefresh="true"
            @checkbox-change="checkboxChangeEvent">
            <template #default-status="scope">
              <el-switch @change="changeFlag(scope.row)" v-model="scope.row.status" active-value="0" inactive-value="1" />
            </template>
            <template #default-make="scope">
              <!--            <el-tooltip content="修改" placement="top">-->
              <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <!--            </el-tooltip>-->
              <!--            <el-tooltip content="删除" placement="top">-->
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <!--            </el-tooltip>-->
              <!--            <el-tooltip content="详情" placement="top">-->
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
              <!--            </el-tooltip>-->
            </template>

          </XTable>
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <!-- 添加或修改原料对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="rawMaterialFormRef" :model="form" :rules="rules" :disabled="dialog.title === '查看原料'"
        label-width="90px" label-position="right" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="物料类别" prop="categoryId">
              <el-select style="width: 100%;" v-model="form.categoryId" filterable placeholder="请选择" @change="getUnits">
                <el-option v-for="item in rawMaterialCategorys" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="物料名称" prop="name">
              <el-input v-model="form.name" placeholder="物料名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="材质牌号" prop="materialQuality">
              <el-input v-model="form.materialQuality" placeholder="材质牌号" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="单位：" prop="units">
              <el-select v-model="form.units" placeholder="请选择或输入单位" filterable allow-create default-first-option
                :reserve-keyword="false" clearable style="width: 440px">
                <el-option v-for="dict in units_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="品牌" prop="manufacturer">
              <el-input v-model="form.manufacturer" placeholder="品牌" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="铜厚" prop="copperThickness">
              <el-input v-model="form.copperThickness" placeholder="铜厚" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="长" prop="length">
              <!-- <el-input v-model="form.length" placeholder="请输入长" @input="(val) => mustNumber(val, 'length')"> -->
              <el-input v-model="form.length" placeholder="请输入长" >
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="宽" prop="width">
              <!-- <el-input v-model="form.width" placeholder="请输入宽" @input="(val) => mustNumber(val, 'width')"> -->
              <el-input v-model="form.width" placeholder="请输入宽" >
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="板厚" prop="boardThickness">
              <el-input v-model="form.boardThickness" placeholder="请输入板厚" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="颜色" >
              <el-input v-model="form.color" placeholder="请输入颜色" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="级别" >
              <el-input v-model="form.level" placeholder="请输入级别" />
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="默认仓库" prop="defaultStorageId">
              <el-select v-model="form.defaultStorageId" placeholder="请选择或输入仓库" filterable allow-create clearable
                style="width: 440px">
                <el-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直径">
              <el-input v-model="form.diameter" placeholder="请输入直径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厚度">
              <el-input v-model="form.thickness" placeholder="请输入厚度" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格型号">
              <el-input v-model="form.specification" placeholder="请输入规格型号" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="默认供应商" prop="">
              <el-select style="width: 100%;" v-model="form.supplier" filterable placeholder="请选择">
                <el-option v-for="item in suppliers" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="备注" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文件" prop="file">
              <XUpload v-model:model-value="form.file" model="download"></XUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>



      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button v-show="!detailDisabled" :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="RawMaterial" lang="ts">
import {
  listRawMaterial,
  getRawMaterial,
  delRawMaterial,
  addRawMaterial,
  updateRawMaterial,
  editRawMaterialStatus
} from '@/api/basedata/rawMaterial';
import { listMaterialStorage } from "@/api/purchase/materialStorage";
import { MaterialStorageVO } from "@/api/purchase/materialStorage/types";
import { RawMaterialVO, RawMaterialQuery, RawMaterialForm, StatusEnum } from '@/api/basedata/rawMaterial/types';
import { SupplierVO } from "@/api/basedata/supplier/types";
import { RawMaterialCategoryVO, RawMaterialCategoryForm, RawMaterialCategoryQuery } from '@/api/basedata/rawMaterialCategory/types';
import { listRawMaterialCategoryNoPage } from '@/api/basedata/rawMaterialCategory';
import { type VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { material_type } = toRefs<any>(proxy?.useDict('material_type'));
const { units_type } = toRefs<any>(proxy?.useDict('units_type'));
const { sys_storage_type } = toRefs<any>(proxy?.useDict('sys_storage_type'));

const rawMaterialList = ref<RawMaterialVO[]>([]);
const stopRawMaterialList = ref<RawMaterialVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const stopLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const stopTotal = ref(0);
const dialogTableLoading = ref(false)

const queryFormRef = ref<ElFormInstance>();
const rawMaterialFormRef = ref<ElFormInstance>();

const editableTabsValue = ref('0');
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

import { listSupplier, getSupplier, listSupplierNoPage } from '@/api/basedata/supplier';
import { number } from "echarts";
import { getDicts } from "@/api/system/dict/data";


const initFormData: RawMaterialForm = {
  id: undefined,
  categoryId: undefined,
  name: undefined,
  specification: undefined,
  materialQuality: undefined,
  units: undefined,
  defaultStorageId: undefined,
  manufacturer: undefined,
  supplier: undefined,
  remark: undefined,
  color: undefined,
  level: undefined,
  copperThickness: undefined,
  length: undefined,
  width: undefined,
  fileId: undefined,
  boardThickness: undefined,
  file: undefined
}
 const positiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
//  if (!/^(\d{0,6})(\.\d{0,2})?$/.test(value)) {
   if (value){
     if (!/^(0|[1-9]\d{0,5})(\.\d{0,2})?$/.test(value)) {
       callback(new Error('请输入合理的数字'))
     } else {
       callback()
     }
   }else {
     callback()
   }

}
const data = reactive<PageData<RawMaterialForm, RawMaterialQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    categoryId: undefined,
    name: undefined,
    specification: undefined,
    materialQuality: undefined,
    units: undefined,
    manufacturer: undefined,
    supplier: undefined,
    color: undefined,
    level: undefined,
    copperThickness: undefined,
    length: undefined,
    width: undefined,
    fileId: undefined,
    boardThickness: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    categoryId: [
      { required: true, message: "物料类别不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "物料名称不能为空", trigger: "blur" },
      { max: 50, message: "物料名称输入不能超过50个字符", trigger: "blur" }
    ],
    units: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    remark: [
      { max: 50, message: "备注输入不能超过50个字符", trigger: "blur" }
    ],
    length: [
      { validator: positiveNumberWithTwoDecimalsHandle, trigger: "change" }
    ],
    width: [
      { validator: positiveNumberWithTwoDecimalsHandle, trigger: "change" }
    ],
  },

});

const { queryParams, form, rules } = toRefs(data);
const { queryParams: stopQuery } = toRefs(data);

const getUnits = (val) => {

  const crtObj = rawMaterialCategorys.value.find(v => v.id == val)
  form.value.units = crtObj?.unit
  form.value.defaultStorageId = crtObj?.defaultStorageName as any;
}
/**
 *只能输入整数
 * @param val
 * @param field
 */
const mustNumber = (val: any, field: string) => {
  const temp = val
  console.log(temp)
  // e = e.replace(/\D/g,'')
  // console.log(e.target)
  // form.value[field] = temp.replace(/\D/g, '')
    // 使用正则表达式匹配整数部分不超过6位，小数部分不超过2位
  // 使用正则表达式匹配整数部分不超过6位，小数部分不超过2位
  const regexResult = temp.match(/^(\d{0,6})(\.\d{0,2})?$/);

  // 更新 form.value[field] 为匹配到的值（可能是整数和小数的部分）

  form.value[field] = regexResult ? (regexResult[1] || '0') + (regexResult[2] !== undefined ? regexResult[2] : '') : '';


}

/** 查询原料列表使用未使用按钮传值处理 */
const handlerClick = () => {

}


/**
 * 物料类别下拉列表
 */
const rawMaterialCategorys = ref<RawMaterialCategoryVO[]>([]);

const getListRawMaterialCategorys = async () => {
  const res = await listRawMaterialCategoryNoPage();
  rawMaterialCategorys.value = res;
}
//仓库
let storageOptions: MaterialStorageVO[] = [];
const getListRawMaterialStoragge = async () => {
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
}


/**
 * 查询供应商列表
 */
let suppliers: SupplierVO[] = [];
const getSupplierLists = async () => {
  const res = await listSupplierNoPage();
  suppliers = res;
  suppliers.forEach(item => {
    item.supplierName = String(item.supplierName)
  })
}


/** 查询原料列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRawMaterial(queryParams.value);
  rawMaterialList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询原料列表 */
const getStopList = async () => {
  stopLoading.value = true;
  const res = await listRawMaterial(stopQuery.value);
  stopRawMaterialList.value = res.rows;
  stopTotal.value = res.total;
  stopLoading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  rawMaterialFormRef.value?.resetFields();
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

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加原料";
  detailDisabled.value = false;
}

/** 查看详情按钮操作(原材料) */
const handleSelect = async (row?: RawMaterialVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "查看原料";
  const _id = row?.id || ids.value[0]
  dialogTableLoading.value = true
  const res = await getRawMaterial(_id);
  Object.assign(form.value, res.data);

  form.value.supplier = res.data.supplierId
  form.value.defaultStorageId = res.data.storageName

  detailDisabled.value = true
  dialogTableLoading.value = false
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RawMaterialVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "修改原料";
  const _id = row?.id || ids.value[0]
  dialogTableLoading.value = true
  const res = await getRawMaterial(_id);
  Object.assign(form.value, res.data);
  form.value.supplier = res.data.supplierId
  form.value.defaultStorageId = res.data.storageName
  detailDisabled.value = false
  dialogTableLoading.value = false
}

/** 提交按钮 */
const submitForm = () => {
  rawMaterialFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRawMaterial(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addRawMaterial(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      searchChange();
      searchChangeStop();
      getListRawMaterialStoragge();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RawMaterialVO) => {
  console.log("row", row)
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除原料编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delRawMaterial(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  searchChange();
  searchChangeStop();
}

const detailDisabled = ref(false)


/** 导出前操作 */
const handleExport = async () => {

  if (editableTabsValue.value == '0') {
    queryParams.value.status = StatusEnum.USE
    proxy?.download('/basedata/rawMaterial/export', {
      ...queryParams.value, tableName: 'basedataRawMaterial'
    }, `物料_${new Date().getTime()}.xlsx`);

  } else if (editableTabsValue.value == '2') {
    stopQuery.value.status = StatusEnum.STOP
    proxy?.download('/basedata/rawMaterial/export', {
      ...stopQuery.value, tableName: 'basedataRawMaterial'
    }, `物料_${new Date().getTime()}.xlsx`);
  }



}

onMounted(() => {
  searchChange();
  searchChangeStop();
  // handlerClick();
  // getList();
  getSupplierLists();
  getListRawMaterialCategorys();
  getListRawMaterialStoragge();
});

interface tagRow {
  label: string
  column: string
  value: string | number
}

const newVxeTableRef = ref()

// 搜索条件与表格字段不一致时，用于搜索条件字段置换
const serachDataFormat = ref([
  { tableShowField: 'categoryName', searchField: 'categoryId' },
  { tableShowField: 'unitName', searchField: 'units' },
])
watch(() => units_type.value, (val) => {
}, { deep: true, immediate: true })

const columnList = ref([

  { title: "序号", type: 'seq', fixed: "left", field: 'index', align: 'center', width: '60' },
  // {type:'checkbox',width:'60',align:'center'},
  { title: '物料编码', field: 'code', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } },
  { title: '单位名称', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },

  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入厚度' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入板厚' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '默认供应商', field: 'supplierName', width: '160', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '长(mm)', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽(mm)', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '默认仓库', field: 'storageName', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' } },
   { title: '备注', field: 'remark', width: '80', align: 'center',},
  { title: '状态', field: 'status', width: '80', align: 'center', fixed: 'right', },
  { title: '操作', field: 'make', align: 'center', fixed: 'right', width: 170, showOverflow: false },
])

/** 状态修改 */
const changeFlag = async (row?: any) => {
  await editRawMaterialStatus({ id: row.id }).then(res => {
    buttonLoading.value = false
    searchChange();
    searchChangeStop();
    //操作成功
    proxy?.$modal.msgSuccess("操作成功");
  })
}

// 获取 搜索条件
const searchChange = (params?: any) => {
  // Object.assign(queryParams.value, params)
  if (params) {
    queryParams.value = params
  }
  queryParams.value.status = StatusEnum.USE
  getList();
}
//停用的搜索条件
const searchChangeStop = (params?: any) => {
  // Object.assign(queryParams.value, params)
  if (params) {
    stopQuery.value = params
  }
  stopQuery.value.status = StatusEnum.STOP
  getStopList();
}

// 多选框选择
const checkboxChangeEvent = () => {
  const $table = newVxeTableRef.value.xTableRef
  if ($table) {
    const selectRecords = $table.getCheckboxRecords() // 获取选择的行数据列表
    ids.value = selectRecords.map(item => item.id);
    single.value = selectRecords.length != 1;
    multiple.value = !selectRecords.length;
  }
}
</script>

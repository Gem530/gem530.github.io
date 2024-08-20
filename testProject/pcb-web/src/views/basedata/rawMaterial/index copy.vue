<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">

          <el-form-item label="物料名称" prop="copperThickness">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
          <el-form-item label="物料编码" prop="length">
            <el-input v-model="queryParams.code" placeholder="请输入编码" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
          <el-form-item label="类别" prop="width">
            <el-input v-model="queryParams.categoryId" placeholder="请输入类别" clearable @keyup.enter="handleQuery"/>
          </el-form-item>

          <el-form-item label="单位" prop="boardThickness">
            <el-input v-model="queryParams.units" placeholder="请输入单位" clearable @keyup.enter="handleQuery"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
    </transition>

    <el-card shadow="never">
      <el-tabs type="card" v-model="editableTabsValue" @tab-change="handlerClick">
        <el-tab-pane label="使用中" name="0"></el-tab-pane>
        <el-tab-pane label="不使用" name="2"></el-tab-pane>
      </el-tabs>
      <template #header>
        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >
              新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
                       >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
                       >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
                       >导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="rawMaterialList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="物料编码" align="center" prop="code"/>
        <el-table-column label="物料名称" align="center" prop="name"/>
        <el-table-column label="物料类别" align="center" prop="categoryName"/>
        <el-table-column label="单位名称" align="center" prop="unitName"/>
        <el-table-column label="材质牌号" align="center" prop="materialQuality"/>
        <el-table-column label="品牌" align="center" prop="manufacturer"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="供应商" align="center" prop="supplierName"/>
        <el-table-column label="状态" align="center" prop="status"/>
        <el-table-column label="颜色" align="center" prop="color"/>
        <el-table-column label="级别" align="center" prop="level"/>
        <el-table-column label="铜厚" align="center" prop="copperThickness"/>
        <el-table-column label="长" align="center" prop="length"/>
        <el-table-column label="宽" align="center" prop="width"/>
        <el-table-column label="板厚" align="center" prop="boardThickness"/>

        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template #default="scope">

            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                         ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                         ></el-button>
            </el-tooltip>

            <el-tooltip content="详情" placement="top">
              <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)"
                         ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>


    <!-- 添加或修改原料对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="rawMaterialFormRef" :model="form" :rules="rules" :disabled="dialog.title === '查看原料'"
               label-width="90px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="物料类别" prop="categoryId">
              <el-select style="width: 100%;" v-model="form.categoryId" filterable placeholder="请选择">
                <el-option
                  v-for="item in rawMaterialCategorys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>



            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="物料名称" prop="name">
              <el-input v-model="form.name" placeholder="物料名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="材质牌号" prop="materialQuality">
              <el-input v-model="form.materialQuality" placeholder="材质牌号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单位" prop="units">
              <el-select v-model="form.units" placeholder="请选择" clearable style="width: 440px">
                <el-option v-for="dict in units_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>

          </el-col>

          <el-col :span="12">
            <el-form-item label="品牌" prop="manufacturer">
              <el-input v-model="form.manufacturer" placeholder="品牌"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="铜厚" prop="copperThickness">
              <el-input v-model="form.copperThickness" placeholder="铜厚"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="长" prop="length">
              <el-input v-model="form.length" placeholder="请输入长"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="宽" prop="width">
              <el-input v-model="form.width" placeholder="请输入宽"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="板厚" prop="boardThickness">
              <el-input v-model="form.boardThickness" placeholder="请输入板厚"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="颜色" prop="width">
              <el-input v-model="form.color" placeholder="请输入颜色"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="级别" prop="width">
              <el-input v-model="form.level" placeholder="请输入级别"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="供应商" prop="">
              <el-select style="width: 100%;" v-model="form.supplier" filterable placeholder="请选择">
                <el-option
                  v-for="item in suppliers"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id"
                />
              </el-select>


            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="备注"/>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
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
  updateRawMaterial
} from '@/api/basedata/rawMaterial';
import {RawMaterialVO, RawMaterialQuery, RawMaterialForm} from '@/api/basedata/rawMaterial/types';
import {SupplierVO} from "@/api/basedata/supplier/types";
import { RawMaterialCategoryVO, RawMaterialCategoryForm, RawMaterialCategoryQuery } from '@/api/basedata/rawMaterialCategory/types';
import { listRawMaterialCategoryNoPage} from '@/api/basedata/rawMaterialCategory';
const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const {material_type} = toRefs<any>(proxy?.useDict('material_type'));
const {units_type} = toRefs<any>(proxy?.useDict('units_type'));

const rawMaterialList = ref<RawMaterialVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const queryFormRef = ref<ElFormInstance>();
const rawMaterialFormRef = ref<ElFormInstance>();

const editableTabsValue = ref(0);
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

import {listSupplier, getSupplier, listSupplierNoPage} from '@/api/basedata/supplier';


const initFormData: RawMaterialForm = {
  id: undefined,
  categoryId: undefined,
  name: undefined,
  specification: undefined,
  materialQuality: undefined,
  units: undefined,
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
}
const data = reactive<PageData<RawMaterialForm, RawMaterialQuery>>({
  form: {...initFormData},
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
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "id不能为空", trigger: "blur"}
    ],
    categoryId: [
      {required: true, message: "物料类别不能为空", trigger: "blur"}
    ],
    name: [
      {required: true, message: "物料名称不能为空", trigger: "blur"}
    ],
    units: [
      {required: true, message: "单位不能为空", trigger: "blur"}
    ],
  },

});

const {queryParams, form, rules} = toRefs(data);


/** 查询原料列表使用未使用按钮传值处理 */
const handlerClick = () => {
  queryParams.value.delFlag = editableTabsValue.value
  getList()
}


/**
 * 物料类别下拉列表
 */
let rawMaterialCategorys: RawMaterialCategoryVO[] = [];

const getListRawMaterialCategorys = async () =>{
  const res = await listRawMaterialCategoryNoPage();
  console.log(res);
  rawMaterialCategorys = res;
}


/**
 * 查询供应商列表
 */
let suppliers: SupplierVO[] = [];
const getSupplierLists = async () => {
  const res = await listSupplierNoPage();
  console.log(res);
  suppliers = res;
  suppliers.forEach(item => {
    item.supplierName = String(item.supplierName)
  })
  console.log(suppliers);
}


/** 查询原料列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRawMaterial(queryParams.value);
  rawMaterialList.value = res.rows;
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

/** 多选框选中数据 */
const handleSelectionChange = (selection: RawMaterialVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加原料";
}

/** 查看详情按钮操作(原材料) */
const handleSelect = async (row?: RawMaterialVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRawMaterial(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "查看原料";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RawMaterialVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRawMaterial(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改原料";
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
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RawMaterialVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除原料编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  await delRawMaterial(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/rawMaterial/export', {
    ...queryParams.value
  }, `rawMaterial_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  handlerClick();
  // getList();
  getSupplierLists();
  getListRawMaterialCategorys();
});
</script>

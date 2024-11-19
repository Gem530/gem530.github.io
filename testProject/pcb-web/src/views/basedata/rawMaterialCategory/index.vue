<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5"> -->
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
          <!-- </el-col>
          <el-col :span="1.5"> -->
            <el-button type="primary" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button
            >
          <!-- </el-col>
          <el-col :span="1.5"> -->
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              >删除</el-button
            >
          </div>
          <!-- </el-col>
        </el-row>
      </template> -->

      <XTable toolId="basedataRawMaterialCategory"
        :pageShow="true"
        :loading="loading"
        :columnList="columnList"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        border :showRefresh="true"
        ref="tableRef"
        height="100%"
        class="xtable-content"
        :row-config="{ isHover: true}"
        :data="materialTypeList"
        @searchChange="searchChange"
        @checkbox-all="handleSelectionChange"
        @checkbox-change="handleSelectionChange"
      >
        <template #default-defaultStorageId="scope">
          <span>{{ materialStorageList.find(item => item.id == scope.row.defaultStorageId)?.name }}</span>
        </template>
        <template #default-isIqc="scope">
          <span>{{ scope.row.isIqc == 0 ? '否' : '是' }}</span>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button link type="primary" @click="handleDetails(scope.row)" >详情</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </XTable>
    <!-- </el-card> -->

    <!-- 添加或修改原料对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="30%" style="min-width: 450px;">
      <el-form
        ref="RawMaterialCategoryFormRef"
        :model="form"
        :rules="rules"
        :disabled="dialog.title === '物料分类详情'"
        label-width="120px"
        label-position="right"
        width="50%"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="物料分类代码：" prop="code">
              <el-input v-model="form.code" :disabled="!dialog.title?.includes('添加')" placeholder="请输入物料分类代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="物料分类名称：" prop="name">
              <el-input v-model="form.name" :disabled="!dialog.title?.includes('添加')" placeholder="请输入物料分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="库存单位：" prop="unit">
              <el-select
                v-model="form.unit"
                placeholder="请选择或输入单位"
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                clearable
                style="width: 440px"
              >
                <el-option v-for="dict in unitList" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="保存期限：" prop="defaultExpirationDays">
              <el-input-number
                style="width: 80%;"
                class="number-left"
                :precision="0"
                :controls="false"
                v-model="form.defaultExpirationDays"
                placeholder="请输入"
              />天
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="所属仓库：" prop="defaultStorageId">
              <el-select
                v-model="form.defaultStorageId"
                placeholder="请选择仓库"
                allow-create
                default-first-option
                :reserve-keyword="false"
                clearable
                style="width: 440px"
              >
                <el-option v-for="dict in materialStorageList" :key="dict.id" :label="dict.name" :value="dict.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="IQC检测：" prop="iqcInspectFlag">
              <el-radio-group v-model="form.isIqc">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">

            <el-form-item label="关联角色" prop="roleIds" >
              <template #label>
                <span>
              <el-tooltip content="被关联的角色,可以对该物料进行受理和审核操作" placement="top">
              <el-icon> <question-filled />  </el-icon>
            </el-tooltip>
                 关联角色
                </span>
              </template>
              <el-select style="width: 100%;" v-model="form.roleIds" filterable multiple placeholder="请选择">
                <el-option
                  v-for="item in craftRoles"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="关联工序" prop="craftIds" >
              <template #label>
                <span>
              <el-tooltip content="在进行生产领料时,只能选择该物料类别所适用的工艺" placement="top">
              <el-icon> <question-filled />  </el-icon>
            </el-tooltip>
                 适用工序
                </span>
              </template>
              <el-select style="width: 100%;" v-model="form.craftIds" filterable multiple placeholder="请选择">
                <el-option
                  v-for="item in crafts"
                  :key="item.id"
                  :label="item.craftName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <!-- <div class="dialog-footer" style="text-align: center"> -->
          <el-button :loading="buttonLoading" type="primary" v-show="!dialog.title?.includes('详情')" @click="submitForm">保存</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        <!-- </div> -->
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="RawMaterialCategory" lang="ts">

import { listRawMaterialCategory, getRawMaterialCategory, delRawMaterialCategory, addRawMaterialCategory, updateRawMaterialCategory } from '@/api/basedata/rawMaterialCategory';
import { RawMaterialCategoryVO, RawMaterialCategoryQuery, RawMaterialCategoryForm } from '@/api/basedata/rawMaterialCategory/types';
import { listMaterialStorageNoPage } from '@/api/purchase/materialStorage';
import { MaterialStorageVO } from '@/api/purchase/materialStorage/types';
import { getDicts } from '@/api/system/dict/data';
import {getRoleLists, listCraft} from "@/api/basedata/craft";
import {RoleVO} from "@/api/system/role/types";
import {CraftVO} from "@/api/basedata/craft/types";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

let unitList :DictDataOption[]=[];

const getUnitsType = async ()=>{

  await getDicts('units_type').then((resp) => {
    unitList = resp.data.map(
      (p): DictDataOption => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass })
    );

  });
}


const materialTypeList = ref<RawMaterialCategoryVO[]>([]);
//选中的物料分类
const selectMaterialTypeList = ref<RawMaterialCategoryVO[]>([]);
//仓库地址
const materialStorageList = ref<MaterialStorageVO[]>([]);


const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const names = ref<Array<string>>([]);
const single = ref(true);
const multiple = ref(true);

const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const RawMaterialCategoryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RawMaterialCategoryForm = {
  id: undefined,
  code: undefined,
  name: undefined,
  unit: undefined,
  defaultStorageId: undefined,
  defaultExpirationDays: undefined,
  isIqc: '0',
   roleIds: [],
}
const data = reactive<PageData<RawMaterialCategoryForm, RawMaterialCategoryQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    name: undefined,
    unit: undefined,
    defaultStorageId: undefined,
    defaultExpirationDays: undefined,
    isIqc: undefined,
    params: {
    }
  },
  rules: {

    code: [
      { required: true, message: "物料分类编码不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "库存单位不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "物料分类名称不能为空", trigger: "blur" }
    ],
    defaultStorageId: [
      { required: true, message: "所属仓库不能为空", trigger: "change" }
    ],
    isIqc: [
      { required: true, message: "是否IQC检测不能为空", trigger: "change" }
    ],
    roleIds: [
      { required: true, message: "关联角色不能为空", trigger: "blur" }
    ],
    craftIds: [
      { required: true, message: "关联工序不能为空", trigger: "blur" }
    ],
    defaultExpirationDays: [
      {validator:(rule: any, value: any, callback: any)=>validatePass(rule, value, callback),trigger: 'change'},
      { required: true, message: "保存期限不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

const validatePass = (rule: any, value: any, callback: any) => {
  if (value == 0) {
      callback(new Error('保存期限填写必须大于0'))
    }else {
      callback()
    }
}

const columnList = ref([
  { type: 'checkbox', align: 'center', width: '40' },
  { title: '序号', width: '50',type:'seq',  align: 'center', },
  { title: '物料分类代码', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料分类代码' } },
  { title: '物料分类名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料分类名称' } },
  { title: '库存单位', field: 'unit', align: 'center', },
  { title: '保存期限（天）', field: 'defaultExpirationDays', align: 'center',  },
  { title: '所属仓库', field: 'defaultStorageId', align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请选择所属仓库'}, filterData: ()=>materialStorageList.value, filterCustom: { label: 'name', value: 'id' } },
  { title: '适用工序', field: 'craftNames', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入适用工序名称' } },
  { title: '是否IQC检测', field: 'isIqc', align: 'center', },
  { title: '操作',field:'make', width: '180', align: 'center', },
]);
// 获取 搜索条件
const searchChange = async(params: any) => {
  queryParams.value = params
  await getList();
  setSelectRow();
}
const setSelectRow = () => {
  const $table = tableRef.value.xTableRef
  if ($table) {
    let st = materialTypeList.value.filter(item => {
      return selectMaterialTypeList.value.some(item2 => item.id == item2.id);
    });
    $table.setCheckboxRow(st, true);
  }
}
/** 查询物料分类列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRawMaterialCategory(queryParams.value);
  materialTypeList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询仓库列表 */
const getStorageList = async () => {

    const res = await listMaterialStorageNoPage();
    materialStorageList.value = res.data;

}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  RawMaterialCategoryFormRef.value?.resetFields();
}

const tableRef = ref()
/** 多选框选中数据 */
const handleSelectionChange = ({checked}) => {
  const $table = tableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords();


      if (checked) {
      //把records中的每一条数据设置selected为true
      selectMaterialTypeList.value.push(...records.filter(item => !selectMaterialTypeList.value.some(item2 => item.id == item2.id)))
    } else {
      selectMaterialTypeList.value = selectMaterialTypeList.value.filter(item => {
        return !materialTypeList.value.some(item2 => item.id == item2.id);
      });
    }

  }
  if (selectMaterialTypeList) {
      ids.value = selectMaterialTypeList.value.map((item: RawMaterialCategoryVO) => item.id);
    names.value = selectMaterialTypeList.value.map((item: RawMaterialCategoryVO) => item.name);
    single.value = selectMaterialTypeList.value.length != 1;
    multiple.value = !selectMaterialTypeList.value.length;
  }

}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物料分类";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RawMaterialCategoryVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRawMaterialCategory(_id);
  Object.assign(form.value, res.data);
  //将res.data中的defaultStorageId的值转成string类型
  form.value.defaultStorageId = res.data.defaultStorageId;

  dialog.visible = true;
  dialog.title = "修改物料分类";
}

/** 详情按钮 查看单条记录信息*/

const handleDetails = async (row?: RawMaterialCategoryVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRawMaterialCategory(_id);

  Object.assign(form.value, res.data);
  //将res.data中的defaultStorageId的值转成string类型
 form.value.defaultStorageId = res.data.defaultStorageId;
  dialog.visible = true;
  dialog.title = "物料分类详情";
}

/** 提交按钮 */
const submitForm = () => {
  RawMaterialCategoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      let msg = "修改成功"
      if (form.value.id) {
        await updateRawMaterialCategory(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addRawMaterialCategory(form.value).finally(() => buttonLoading.value = false);
        msg = "添加成功"
      }
      proxy?.$modal.msgSuccess(msg);
      dialog.visible = false;
      await getList();
      getUnitsType();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RawMaterialCategoryVO) => {
  const _ids = row?.id || ids.value;
  const code = row?.code || names.value;

  await proxy?.$modal.confirm('是否确认删除物料分类名称为："' + code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delRawMaterialCategory(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
 //判断selectMaterialTypeList中是否数据
  if (selectMaterialTypeList) {
     single.value = selectMaterialTypeList.value.length != 1;
    multiple.value = !selectMaterialTypeList.value.length;
  }
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialType/export', {
    ...queryParams.value
  }, `materialType_${new Date().getTime()}.xlsx`)
}
  /**
   * 查询角色列表
   */
  let craftRoles: RoleVO[] = [];
  const getCraftRoleLists = async () => {
    const res = await getRoleLists();
    console.log(res);
    craftRoles = res.data;
    craftRoles.forEach(item => {
      item.roleName = String(item.roleName);
    });
    console.log(craftRoles);
  };
  /**
   * 查询工艺列表
   */
  let crafts: CraftVO[]= [];
  const getCraftList = async () => {
    const res = await listCraft({isOpen : "1"});
    console.log(res);
    crafts = res.rows;
    crafts.forEach(item => {
      item.craftName = String(item.craftName);
    });
  };

onMounted(() => {
   getStorageList();
  getList();
  getCraftRoleLists();
  getCraftList();
  getUnitsType();
});
</script>

<style lang="scss" scoped>

  :deep(.number-left) {
    .el-input__wrapper {
      padding-left: 7px;
      padding-right: 7px;
    }
    .el-input__inner {
      text-align: left;
    }
  }
</style>

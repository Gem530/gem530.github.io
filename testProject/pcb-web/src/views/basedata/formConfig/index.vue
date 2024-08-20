<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" >删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <XTable toolId="basedataFormConfig" :pageShow="true" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
              :page-params="{ perfect: true, total: total }"
              :data="formConfigList"
              :columnList="columnList"
              ref="newVxeTableRef" border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }" @checkbox-all="checkboxChangeEvent" @checkbox-change="checkboxChangeEvent">
        <template #default-isHidden="scope">
          <dict-tag :options="sys_is_hidden" :value="scope.row.isHidden" />
        </template>
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" ></el-button>
          </el-tooltip>
        </template>
      </XTable>

    </el-card>
    <!-- 添加或修改表单配置对话框 -->
    <el-drawer  :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="formConfigFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="表单编号" prop="formCode">
              <el-input v-model="form.formCode" placeholder="表单编号" />
            </el-form-item>
          </el-col>

            <el-col :span="24">
                <el-form-item label="字段编号" prop="fieldCode">
                    <el-input v-model="form.fieldCode" placeholder="字段编号" />
                </el-form-item>
            </el-col>
          <el-col :span="24">
              <el-form-item label="是否隐藏" prop="isHidden">
               <el-select v-model="form.isHidden" placeholder="请选择" clearable style="width: 440px">
                  <el-option v-for="dict in sys_is_hidden" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
          </el-col>

          <div v-for="(item, index) in form.craftParameterConfigs" :key="index" style="display: flex">

            <!--  添加-->
            <el-col :span="4" v-if="index === form.craftParameterConfigs.length - 1">
              <div class="mb-2 flex items-center text-sm">
                <p @click="configsAdd">+</p>
              </div>
            </el-col>

            <!--  删除-->
            <el-col :span="4" v-if="index !== 0">
              <div class="mb-2 flex items-center text-sm">
                <p @click="configsDelete(index)">-</p>
              </div>
            </el-col>

          </div>

        </el-row>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer >

  </div>
</template>

<script setup name="FormConfig" lang="ts">

import { listFormConfig, getFormConfig, delFormConfig, addFormConfig, updateFormConfig } from '@/api/basedata/config';
import { FormConfigVO, FormConfigQuery, FormConfigForm } from '@/api/basedata/config/types';
import {getDicts} from "@/api/system/dict/data";
import { DictDataVO } from '@/api/system/dict/data/types';
import {listUserByRoleKey} from '@/api/system/user';
import {UserVO} from '@/api/system/user/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const formConfigList = ref<FormConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const formConfigFormRef = ref<ElFormInstance>();

const { sys_is_hidden } = toRefs<any>(proxy?.useDict("sys_is_hidden"));

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const newVxeTableRef = ref();

const columnList = ref([
  {type:'checkbox',width:'60',align:'center'},
  {title:'表单编号',field:'formCode',align:'center',filterType:'input',filterParam:{ placeholder: '请输入表单编号' }},
  {title:'字段编号',field:'fieldCode',align:'center',filterType:'input',filterParam:{ placeholder: '请输入字段编号' }},
  {title:'是否隐藏',field:'isHidden',align:'center',filterType:'radioButton',filterParam:{ placeholder: '请输入是否隐藏' },filterData:()=>sys_is_hidden.value}
]);

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}


const initFormData: FormConfigForm = {
  id: undefined,
  formCode: undefined,
  fieldCode: undefined,
  isHidden: undefined
}
const data = reactive<PageData<FormConfigForm, FormConfigQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    formCode: undefined,
    fieldCode: undefined,
    isHidden: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    formCode: [
      { required: true, message: "表单编号不能为空", trigger: "blur" }
    ],
    fieldCode: [
      { required: true, message: "字段编号不能为空", trigger: "blur" }
    ],
    isHidden: [
      { required: true, message: "是否隐藏(1=隐藏，0=不隐藏)不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询单配置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listFormConfig(queryParams.value);
  formConfigList.value = res.rows;
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
  formConfigFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: FormConfigVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加表单配置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: FormConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getFormConfig(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改表单配置";
}

/** 提交按钮 */
const submitForm = () => {
  formConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateFormConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addFormConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: FormConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除单配置编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delFormConfig(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/formConfig/export', {
    ...queryParams.value
  }, `formConfig_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
    getList();
});
</script>

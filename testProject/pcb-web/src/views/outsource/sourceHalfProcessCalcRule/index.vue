<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-col :span="24" align="right">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
      </template>
      <el-tabs type="border-card" v-model="tabsValue" class="xtable-tab">
        <el-tab-pane label="外协加工" name="外协加工">
          <XTable
            toolId="outsourceSourceHalfProcessCalcRuleHalf"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="sourceHalfProcessCalcRuleList"
            :columnList="columnList"
            ref="XTableRef"
            border
            :showRefresh="true"
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
          >
            <template #default-type="scope"> <sapn>1</sapn> </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="网版/菲林外协" name="网版/菲林外协">
          <XTable
            toolId="outsourceSourceHalfProcessCalcRuleNetwork"
            height="100%"
            class="xtable-content"
            v-model:page-size="halfQueryParams.pageSize"
            v-model:current-page="halfQueryParams.pageNum"
            :page-params="{ perfect: true, total: halfTotal }"
            :data="halfRuleList"
            :columnList="halfColumnList"
            ref="HalfXTableRef"
            border
            :showRefresh="true"
            @searchChange="halfSearchChange"
            :column-config="{ resizable: true }"
          >
            <template #default-type="scope"> {{ typeStrings[scope.row.type as keyof typeof typeStrings] }} </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdateHalf(scope.row)">修改</el-button>
              <el-button link type="primary" @click="handleDeleteHalf(scope.row)">删除</el-button>
              <el-button link type="primary" @click="handleSelectHalf(scope.row)">详情</el-button>
            </template>
          </XTable></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <!-- 添加或修改外协加工计价规则对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="1500px" :close-on-click-modal="false">
      <el-row>
        <el-col :span="16">
          <el-form ref="sourceHalfProcessCalcRuleFormRef" :model="form" :rules="rules" label-width="120px" :disabled="dialog.title?.includes('详情')" v-loading="dialogLoading">
            <el-form-item label="工序名称" prop="craftId">
              <el-select v-model="form.craftId" placeholder="请选择工序" style="width: 100%;" @change="getCraftRule" filterable fit-input-width>
                <el-option v-for="item in craftList" :key="item.id" :label="item.craftName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="外协供应商" prop="supplierId">
              <el-select v-model="form.supplierId" style="width: 100%;" :collapse-tags="true" filterable placeholder="请选择供应商">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="计价公式设置" prop="formula">
              <el-input v-model="form.formula" maxLength="2000" :rows="30" type="textarea" placeholder="请输入计价公式" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" maxLength="1000" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="120px" :disabled="dialog.title?.includes('详情')">
            <el-form-item v-for="attr in craftAttrList" :label="attr.name">
              <el-tag v-for="vo in  attr.list" type="primary" style="margin-right:10px ;margin-bottom:5px ;" @click="changeCraftAttr(vo.name)"
                >{{vo.name}}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <!-- <div class="dialog-footer"> -->
          <el-button :loading="buttonLoading" v-if="!dialog.title?.includes('详情')" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="halfDialog.title" v-model="halfDialog.visible" width="1000px">
      <el-row>
        <el-col :span="16">
          <el-form ref="halfRuleFormRef" :model="halfForm" :rules="halfRules" label-width="80px" :disabled="halfDialog.title?.includes('详情')" v-loading="dialogLoading">
            <el-form-item label="外协类型" prop="type">
              <el-select
                v-model="halfForm.type"
                style="width: 100%;"
                placeholder="请选择类型"
                :disabled="halfDialog.title?.includes('详情') || halfDialog.title?.includes('审核')"
              >
                <el-option :key="1" label="外协网板" value="1" />
                <el-option :key="2" label="外协菲林" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商" >
              <el-select
                v-model="halfForm.supplierId"
                placeholder="请选择供应商"
                style="width: 100%;"
                @change="getSupplierPrice"
                :disabled="halfDialog.title?.includes('详情') || halfDialog.title?.includes('审核')"
                filterable
                clearable
              >
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="外协基价" prop="formula">
          <el-input-number v-model="halfForm.formula" :controls="false" :min="0" :precision="2" style="width:100%"
            :disabled="halfDialog.title?.includes('详情') || halfDialog.title?.includes('审核')"> </el-input-number>
        </el-form-item> -->
            <el-form-item label="计价公式设置" prop="formula">
              <el-input v-model="halfForm.formula" maxLength="2000" :rows="10" type="textarea" placeholder="请输入计价公式" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="120px">
            <el-form-item v-for="attr in craftAttrList" :label="attr.name">
              <el-tag v-for="vo in  attr.list" type="primary" style="margin-right:10px ;margin-bottom:5px ;" @click="changeFeilinCraftAttr(vo.name)"
                >{{vo.name}}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <!-- <div class="dialog-footer"> -->
          <el-button :loading="buttonLoading" v-if="!halfDialog.title?.includes('详情')" type="primary" @click="submitFormHalf">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancelHalf">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SourceHalfProcessCalcRule" lang="ts">
import { getSupplierMaterialPrice,listSourceHalfProcessCalcRule, getSourceHalfProcessCalcRule, delSourceHalfProcessCalcRule, addSourceHalfProcessCalcRule, updateSourceHalfProcessCalcRule,getRuleByCraftId } from '@/api/outsource/sourceHalfProcessCalcRule';
import { SourceHalfProcessCalcRuleVO, SourceHalfProcessCalcRuleQuery, SourceHalfProcessCalcRuleForm,SourceHalfProcessCalcRuleTypeEnum,typeStrings } from '@/api/outsource/sourceHalfProcessCalcRule/types';
import { getAllAttr} from '@/api/outsource/sourceHalfCountAttr';
import { SupplierVO } from "@/api/basedata/supplier/types";
import { VxeTableEvents } from 'vxe-table'
import {  listOutSourceSupplierList} from "@/api/outsource/sourceFullProcessOrder";
import { getCraftList} from "@/api/basedata/craft";
import { CraftQuery} from '@/api/basedata/craft/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sourceHalfProcessCalcRuleList = ref<SourceHalfProcessCalcRuleVO[]>([]);
const halfRuleList = ref<SourceHalfProcessCalcRuleVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const halfTotal = ref(0);
const tabsValue = ref('外协加工')
const queryFormRef = ref<ElFormInstance>();
const sourceHalfProcessCalcRuleFormRef = ref<ElFormInstance>();
const halfRuleFormRef = ref<ElFormInstance>();
//工序参数列表
const craftAttrList: any = ref([{
  name: '工序参数',
  list: [
    { name: '工序名称' },
    { name: '计价系数' },
    { name: '计价公式' },
  ]

}]);
//供应商列表
const supplierList: any = ref([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const halfDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});



const initFormData: SourceHalfProcessCalcRuleForm = {
  id: undefined,
  ownerId: undefined,
  supplierId: undefined,
  craftId: undefined,
  type: undefined,
  formula: undefined,
  remark: undefined
}
const data = reactive<PageData<SourceHalfProcessCalcRuleForm, SourceHalfProcessCalcRuleQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    supplierId: undefined,
    craftId: undefined,
    type: undefined,
    formula: undefined,
    params: {
    }
  },
  rules: {
    craftId: [
      { required: true, message: "请选择工序", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "请选择外协供应商", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    formula: [
      { required: true, message: "计价公式不能为空", trigger: "blur" }
    ]
  }
});
const { queryParams, form, rules } = toRefs(data);

const initHalfFormData: SourceHalfProcessCalcRuleForm = {
  id: undefined,
  ownerId: undefined,
  price: undefined,
  supplierId: undefined,
  craftId: undefined,
  type: undefined,
  formula: undefined,
  remark: undefined
}
const halfData = reactive<PageData<SourceHalfProcessCalcRuleForm, SourceHalfProcessCalcRuleQuery>>({
  form: {...initHalfFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    supplierId: undefined,
    craftId: undefined,
    type: undefined,
    formula: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "请选择类型", trigger: "change" }
    ],
    supplierId: [
      { required: true, message: "请选择供应商", trigger: "blur" }
    ],
    formula: [
      { required: true, message: "请输入外协基价", trigger: "blur" }
    ]
  }
});
const { queryParams:halfQueryParams, form:halfForm, rules:halfRules } = toRefs(halfData);

const dialogLoading = ref(false)
const XTableRef = ref()
const HalfXTableRef = ref()
const typeList = ref([
  { label: '网板', value: "1" },
  { label: '菲林', value: "2" },
]);
const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '供应商', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } , width: '160'},
        { title: '工序名称', field: 'craftName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入工艺名称' }, width: '100' },
        { title: '计价系数', field: 'type', align: 'center', width: '60' },
        { title: '计价公式', field: 'formula', align: 'center' },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);
const halfColumnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
         { title: '类型', field: 'type', align: 'center', filterType: 'radioButton',filterData: () => typeList.value},
        { title: '供应商', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
        { title: '外协基价', field: 'formula', align: 'center',  },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);



// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询外协加工计价规则列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.type = SourceHalfProcessCalcRuleTypeEnum.GONG_YI;
  const res = await listSourceHalfProcessCalcRule(queryParams.value);
  sourceHalfProcessCalcRuleList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

// 获取 搜索条件
const halfSearchChange = (params: any) => {
    halfQueryParams.value = params
    getHalfList()
}

/** 查询外协加工计价规则列表 */
const getHalfList = async () => {
  loading.value = true;
  const res = await listSourceHalfProcessCalcRule(halfQueryParams.value);
  halfRuleList.value = res.rows;
  halfTotal.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}
/** 取消按钮 */
const cancelHalf = () => {
  halfReset();
  halfDialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  sourceHalfProcessCalcRuleFormRef.value?.resetFields();
}
/** 表单重置 */
const halfReset = () => {
  halfForm.value = {...initFormData};
  halfRuleFormRef.value?.resetFields();
}



/** 详情按钮操作 */
const handleSelectHalf = async (row?: SourceHalfProcessCalcRuleVO) => {
  reset();
  halfDialog.visible = true;
  halfDialog.title = "外协加工计价规则详情";

  const _id = row?.id || ids.value[0]
  dialogLoading.value = true;
  const res = await getSourceHalfProcessCalcRule(_id).finally(() => { dialogLoading.value = false; });
  Object.assign(halfForm.value, res.data);
}



/** 修改按钮操作 */
const handleUpdateHalf = async (row?: SourceHalfProcessCalcRuleVO) => {
  reset();
  getAttrList();
  halfDialog.visible = true;
  halfDialog.title = "修改外协加工计价规则";
  const _id = row?.id || ids.value[0]
  dialogLoading.value = true;
  const res = await getSourceHalfProcessCalcRule(_id).finally(() => { dialogLoading.value = false; });
  Object.assign(halfForm.value, res.data);
}



/** 删除按钮操作 */
const handleDeleteHalf = async (row?: SourceHalfProcessCalcRuleVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceHalfProcessCalcRule(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getHalfList();
}

/** 新增按钮操作 */
const handleAdd = () => {
  console.log(tabsValue.value);
  getAttrList();
  if(tabsValue.value == '外协加工') {
    reset();
    dialog.visible = true;
     dialog.title = "外协加工参数设置";

  } else {
    halfReset();
    halfDialog.visible = true;
     halfDialog.title = "网板/菲林外协参数设置";
  }

}

/** 修改按钮操作 */
const handleUpdate = async (row?: SourceHalfProcessCalcRuleVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "修改外协加工计价规则";
  const _id = row?.id || ids.value[0]
  dialogLoading.value = true;
  const res = await getSourceHalfProcessCalcRule(_id).finally(() => { dialogLoading.value = false; });
  getAttrList();
  Object.assign(form.value, res.data);
}
/** 详情按钮操作 */
const handleSelect = async (row?: SourceHalfProcessCalcRuleVO) => {
   getAttrList();
  reset();
  dialog.visible = true;
  dialog.title = "外协加工计价规则详情";
  const _id = row?.id || ids.value[0]
  dialogLoading.value = true;
  const res = await getSourceHalfProcessCalcRule(_id).finally(() => { dialogLoading.value = false; });
  Object.assign(form.value, res.data);
}

/** 提交按钮 */
const submitFormHalf = () => {
  halfRuleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;

      if(halfForm.value.formula <= 0) {
        proxy?.$modal.msgError("外协基价不能小于等于0");
        buttonLoading.value = false
        return;
      }
       if (!halfForm.value.supplierId) {
         await proxy?.$modal.confirm('未选择供应商将会批量操作所有供应商数据 请确认？').catch(() => buttonLoading.value = false);
      }
      if (halfForm.value.id) {
        await updateSourceHalfProcessCalcRule(halfForm.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSourceHalfProcessCalcRule(halfForm.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      halfDialog.visible = false;
      await getHalfList();
    }
  });
}

/** 提交按钮 */
const submitForm = () => {
  sourceHalfProcessCalcRuleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.type = SourceHalfProcessCalcRuleTypeEnum.GONG_YI;
      buttonLoading.value = true;


      if (form.value.id) {
        await updateSourceHalfProcessCalcRule(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSourceHalfProcessCalcRule(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceHalfProcessCalcRuleVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceHalfProcessCalcRule(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceHalfProcessCalcRule/export', {
    ...queryParams.value
  }, `sourceHalfProcessCalcRule_${new Date().getTime()}.xlsx`)
}

/** 查询外协供应商列表 */
const queryOutSourceSupplierList = async () => {
  const res = await listOutSourceSupplierList();
  supplierList.value = res.data
}

const changeFeilinCraftAttr = async (name:any) => {

  if(name && !halfDialog.title?.includes('详情')){
    halfForm.value.formula = halfForm.value.formula || '';
    halfForm.value.formula = halfForm.value.formula + '['+name+']';
  }
};
const changeCraftAttr = async (name:any) => {

  if(name && !dialog.title?.includes('详情')){
    form.value.formula = form.value.formula || '';
    form.value.formula = form.value.formula + '['+name+']';
  }

};
/**
 * 查询供应商物料价格
 * @param data
 */
const getSupplierPrice = async () => {
  let supplierId = halfForm.value.supplierId;
  let type = halfForm.value.type;
  if(!supplierId || !type) {
    return;
  }
  const res =  await getSupplierMaterialPrice(supplierId,type);
  halfForm.value.formula = res.data;
};

/**
 *根据工序查询计价公式
 * @param data
 */
const getCraftRule = async () => {

  console.log(form.value.craftId);
  console.log(form.value.formula);

  if(!form.value.craftId || form.value.formula) {
    return;
  }
  const res =  await getRuleByCraftId(form.value.craftId);
  if(!form.value.formula){
    form.value.formula = res.data.formula;
  }
};

/**
 * 查询所有参数
 * @param data
 */
const getAttrList = async () => {
  getAllAttr().then((res) => {
    craftAttrList.value = res.data;
  });
};
  import {CraftVO} from "@/api/basedata/craft/types";
import { el } from 'element-plus/es/locale';
  const craftList = ref<CraftVO[]>([]);
  /** 查询工艺列表 */
  const getCraftListNoPage = async () => {
    let craftQuery:CraftQuery= {
      isOpen: '1',
      isOutSource: '1',
    }
    const res = await getCraftList(craftQuery);
    craftList.value = res.data;
  };
onMounted(() => {

  getList();
  getHalfList();
  queryOutSourceSupplierList();
  getCraftListNoPage()
});
</script>

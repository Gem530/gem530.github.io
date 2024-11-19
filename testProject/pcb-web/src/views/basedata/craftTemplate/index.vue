<template>
  <div class="p-2 xtable-page">

    <!-- <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5"> -->
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >
              新增
            </el-button>
          </div>
          <!-- </el-col>
        </el-row>
      </template> -->

      <XTable toolId="basedataCraftTemplate" :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
              :loading="loading"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="craftTemplateList"
              :columnList="columnList"
              ref="newVxeTableRef" border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }" >
        <template #default-craftList="scope">
          <el-tag>开始</el-tag>
          <el-icon>
            <Right />
          </el-icon>
          <span v-for="item in scope.row.craftList" class="text-center">
              <el-tag effect="plain">{{ item.craftName }}</el-tag>
              <el-icon><Right /></el-icon>
            </span>
          <el-tag>结束</el-tag>
        </template>
        <template #default-make="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       >修改
            </el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       >删除
            </el-button>
        </template>
      </XTable>
    <!-- </el-card> -->
    <!-- 添加或修改工艺模板对话框 -->
    <el-drawer
        v-model="drawer.visible"
        :title="drawer.title"
        size="75%"
        :direction="drawer.direction"
        destroy-on-close = true
        :before-close="handleClose">
      <el-form ref="craftTemplateFormRef" :model="form" :rules="rules" v-loading="dialogTableLoading">
        <div class="flex_class">
          <el-form-item label="" prop="craftIdList">
            <el-transfer
              v-model="form.craftIdList"
              target-order="push"
              :props="{
                  key:'id',
                  label:'craftName',
                }"
              :titles="['工艺名', '已选工艺']"
              filterable
              filter-placeholder="请输入内容"
              :data="craftOptions"
              @change="transferChanged"
              @right-check-change="checkChanged"
            />
            <el-button style="background-color: #79bbff;" @click="moveUp">
              <el-icon>
                <ArrowUp />
              </el-icon>
            </el-button>
            <el-button style="background-color: #79bbff;" @click="moveDown">
              <el-icon>
                <ArrowDown />
              </el-icon>
            </el-button>
          </el-form-item>

          <el-card class="templateBox" shadow="never">
            <div class="text-center">
              <div>
                 <el-form-item label="" prop="templateName">
                <el-input class="text-center" v-model="form.templateName" placeholder="请输入工艺流程模板名"
                          style="width: 180px;"></el-input>
                 </el-form-item>
              </div>
              <div class="mt10">
                <el-tag>
                  开始
                </el-tag>
              </div>
              <el-icon>
                <Bottom />
              </el-icon>
              <div v-for="(info,index) in selectedCraftOptions.dataList" :key="index">
                <el-tag effect="plain">
                  {{ info.craftName }}
                </el-tag>
                <div>
                  <el-icon>
                    <Bottom />
                  </el-icon>
                </div>
              </div>
              <div>
                <el-tag>
                  结束
                </el-tag>
              </div>
            </div>
          </el-card>

        </div>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="CraftTemplate" lang="ts">
import {
  listCraftTemplate,
  getCraftTemplate,
  delCraftTemplate,
  addCraftTemplate,
  updateCraftTemplate
} from "@/api/basedata/craftTemplate";
import { CraftTemplateVO, CraftTemplateQuery, CraftTemplateForm } from "@/api/basedata/craftTemplate/types";
import { getCraftList } from "@/api/basedata/craft";
import { CraftVO } from "@/api/basedata/craft/types";
import { ElMessageBox } from "element-plus";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const craftTemplateList = ref<CraftTemplateVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const craftTemplateFormRef = ref<ElFormInstance>();

const drawer = reactive<DrawerOption>({
  visible: false,
  title: "",
  direction: "rtl"
});

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("你确定关闭该窗口吗?", '提示')
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const initFormData: CraftTemplateForm = {
  id: undefined,
  templateName: undefined,
  remark: undefined,
  craftIdList: []
};
const data = reactive<PageData<CraftTemplateForm, CraftTemplateQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    templateName: undefined,
    params: {}
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    craftIdList: [
      { required: true, message: "请至少选择一项工艺", trigger: "blur" }
    ],
    templateName: [
      { required: true, message: "工艺模板名不能为空", trigger: "blur" },
      {max: 50, message: "工艺名称输入不能超过50个字符", trigger: "blur"}
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

let craftOptions: CraftVO[] = [];

let selectedCraftOptions = reactive({
  dataList: [] as CraftVO[]
});

const columnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  { width:'500',title:'模板名',field:'templateName',align:'center', filterType: 'input', filterParam: { placeholder: '请输入模板名' } },
  { width:'500',title:'模板预览',field:'craftList',align:'center'},
  { title:'操作',align:'center',field: 'make'},
]);

/**
 * 查询工艺列表
 */
const getListCraft = async () => {
  const res = await getCraftList();
  craftOptions = res.data;
};

/**
 * 穿梭框change事件
 */
const transferChanged = (
  value: any,
  direction: "left" | "right",
  movedKeys: string[] | number[]
) => {
  selectedCraftOptions.dataList = [];
  value.forEach((item: string | number) => {
    craftOptions.forEach(info => {
      if (item == info.id) {
        selectedCraftOptions.dataList.push(info);
      }
    });
  });
};

const selectRightValue = ref<string | number[]>([]); //右侧被选中的元素的key值组成的数组
const checkChanged = (arr: Array<number>) => {
  //右侧选中元素触发的时间
  selectRightValue.value = arr;
};

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params;
  getList();
}

/** 查询工艺模板列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCraftTemplate(queryParams.value);
  craftTemplateList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const moveUp = () => {
  let rightValue = form.value.craftIdList;
  let rightValue2 = selectedCraftOptions.dataList;
  if (selectRightValue.value?.length === 1) {
    let selectKey = rightValue.indexOf(selectRightValue.value[0]); //右侧数组被选中的元素的索引index
    if (selectKey === 0) {
      ElMessage.warning("已经在最顶部，不能再上移");
    } else {
      let temp = rightValue[selectKey - 1];
      rightValue.splice(selectKey - 1, 1, rightValue[selectKey]);
      rightValue.splice(selectKey, 1, temp);
      let temp2 = rightValue2[selectKey - 1];
      rightValue2.splice(selectKey - 1, 1, rightValue2[selectKey]);
      rightValue2.splice(selectKey, 1, temp2);
    }
  } else {
    ElMessage.warning("只能且必须选中一项要移动的列");
  }
};
const moveDown = () => {
  let rightValue = form.value.craftIdList;
  let rightValue2 = selectedCraftOptions.dataList;
  if (selectRightValue.value?.length === 1) {
    let selectKey = rightValue.indexOf(selectRightValue.value[0]); //右侧数组被选中的元素的索引index
    if (selectKey + 1 === rightValue.length) {
      ElMessage.warning("已经在最底部，不能再下移");
    } else {
      let temp = rightValue[selectKey + 1];
      rightValue.splice(selectKey + 1, 1, rightValue[selectKey]);
      rightValue.splice(selectKey, 1, temp);
      let temp2 = rightValue2[selectKey + 1];
      rightValue2.splice(selectKey + 1, 1, rightValue2[selectKey]);
      rightValue2.splice(selectKey, 1, temp2);
    }
  } else {
    ElMessage.warning("只能且必须选中一项要移动的列");
  }
};

/** 取消按钮 */
const cancel = () => {
  reset();
  drawer.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  craftTemplateFormRef.value?.resetFields();
  selectedCraftOptions.dataList = [];
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: CraftTemplateVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  drawer.visible = true;
  drawer.title = "添加工艺模板";
};

const dialogTableLoading = ref(false)
/** 修改按钮操作 */
const handleUpdate = async (row?: CraftTemplateVO) => {
  reset();
  drawer.visible = true;
  drawer.title = "修改工艺模板";
  dialogTableLoading.value = true
  const _id = row?.id || ids.value[0];
  const res = await getCraftTemplate(_id);
  Object.assign(form.value, res.data);
  Object.assign(selectedCraftOptions.dataList, res.data.craftList);
  dialogTableLoading.value = false
};

/** 提交按钮 */
const submitForm = () => {
  console.log(form.value);
  craftTemplateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCraftTemplate(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCraftTemplate(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      drawer.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CraftTemplateVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm("是否确认删除工艺模板编号为\"" + _ids + "\"的数据项？").finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delCraftTemplate(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("basedata/craftTemplate/export", {
    ...queryParams.value
  }, `craftTemplate_${new Date().getTime()}.xlsx`);
};

onMounted(() => {
  getListCraft();
  getList();
});
</script>

<style>
.el-drawer__body {
  width: 100%;
  height: 700px;
}

.el-transfer {
  height: 700px;
}

.el-transfer-panel {
  width: 35%;
  height: 100%;
}

.el-transfer-panel__body {
  height: 90%
}

.flex_class {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.templateBox {
  width: 25%;
  display: inline-block;
  flex-direction: column;
}
</style>

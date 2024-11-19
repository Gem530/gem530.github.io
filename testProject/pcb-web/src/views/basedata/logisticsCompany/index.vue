<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
        <XTable v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :showRefresh="true" toolId="logisticsCompany"
                :page-params="{ perfect: true, total: total }"
                height="100%" class="xtable-content"
                :data="logisticsCompanyList"
                :columnList="columnList"
                ref="XTableRef"
                border
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                :row-config="{ keyField:'id' }"
        >
            <template #default-isOpenConfig="scope">
              <el-switch @change="changeFlag(scope.row)" v-model="scope.row.isOpenConfig" active-value="1"
                         inactive-value="0"/>
            </template>
            <template #default-make="scope">

                <el-tooltip content="修改参数" placement="top">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
                </el-tooltip>
<!--                <el-tooltip content="删除" placement="top">-->
<!--                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>-->
<!--                </el-tooltip>-->
<!--                <el-tooltip content="详情" placement="top">-->
<!--                    <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)"></el-button>-->
<!--                </el-tooltip>-->
            </template>
        </XTable>
    <!-- </el-card> -->
    <!-- 添加或修改物流公司对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="50%" append-to-body>
      <el-form ref="logisticsCompanyFormRef" :model="form" :rules="rules" label-width="80px">

        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="参数配置:">
              <el-col :span="24">
                <vxe-table border show-overflow keep-source ref="XTableRefFL" :data="form.configParams" size="mini"
                           align="center" :edit-rules="validRules"
                           :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
                  <vxe-column field="make" title="操作" width="60">

                    <template #header>
                      <el-icon @click="addConfigRow" style="color: rgb(64, 158, 255);font-size:19px">
                        <CirclePlusFilled />
                      </el-icon>
                    </template>
                    <template #edit="scope">
                      <el-icon @click="removeConfig(scope.row)" color="red" size="19px">
                        <RemoveFilled />
                      </el-icon>
                    </template>
                    <template #default="scope">
                      <el-icon @click="removeConfig(scope.row)" color="red" size="19px">
                        <RemoveFilled />
                      </el-icon>
                    </template>
                  </vxe-column>
                  <vxe-column field="label" title="参数描述" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.label" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                  <vxe-column field="name" title="参数名称" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.name" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                  <vxe-column field="value" title="参数值" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.value" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                </vxe-table>

              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <!-- <div class="dialog-footer" style="text-align: center"> -->
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        <!-- </div> -->
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="LogisticsCompany" lang="ts">
import { listLogisticsCompany, getLogisticsCompany, delLogisticsCompany, addLogisticsCompany, updateLogisticsCompany } from '@/api/basedata/logisticsCompany';
import { LogisticsCompanyVO, LogisticsCompanyQuery, LogisticsCompanyForm } from '@/api/basedata/logisticsCompany/types';
import {VxeTableEvents, VxeTableInstance, VxeTablePropTypes} from 'vxe-table'
import {changeItemVO, FLItemVO} from "@/api/project/ecn/types";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const logisticsCompanyList = ref<LogisticsCompanyVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const logisticsCompanyFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//变更列表校验
const validRules = ref<VxeTablePropTypes.EditRules<changeItemVO>>({
  label: [
    { required: true, message: '参数描述必须填写' },
  ],
  name: [
    { required: true, message: '参数名称必须填写' },
  ],
  value: [
    { required: true, message: '参数值必须填写' },
  ]
})

const initFormData: LogisticsCompanyForm = {
  id: undefined,
  ownerId: undefined,
  name: undefined,
  fullName: undefined,
  code: undefined,
  phone: undefined,
  configParams: undefined,
  isOpenConfig: undefined,
  website: undefined
}
const data = reactive<PageData<LogisticsCompanyForm, LogisticsCompanyQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    name: undefined,
    fullName: undefined,
    code: undefined,
    phone: undefined,
    configParams: undefined,
    isOpenConfig: undefined,
    website: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "物流公司名简称不能为空", trigger: "blur" }
    ],
    fullName: [
      { required: true, message: "物流公司名全称不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "物流公司编码不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "电话不能为空", trigger: "blur" }
    ],
    configParams: [
      { required: true, message: "参数信息不能为空", trigger: "blur" }
    ],
    isOpenConfig: [
      { required: true, message: "是否开启物流配置不能为空", trigger: "blur" }
    ],
    website: [
      { required: true, message: "官网不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([
    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { title: '物流公司名简称', field: 'name', width:'150',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物流公司名简称' } },
    { title: '物流公司名全称', field: 'fullName',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物流公司名全称' } },
    { title: '物流公司编码', field: 'code', width:'150',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物流公司编码' } },
    { title: '电话', field: 'phone', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入电话' } },
    // { title: '参数信息', field: 'configParams', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入参数信息' } },
    { title: '是否开启物流配置', field: 'isOpenConfig', width:'120',align: 'center'},
    { title: '官网', field: 'website',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入官网' } },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedLogisticsCompanyList = ref<LogisticsCompanyVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<LogisticsCompanyVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedLogisticsCompanyList.value = selectRecords.map(item => item);
    }
}

const XTableRefFL = ref<VxeTableInstance<FLItemVO>>();

const addConfigRow = async () => {
  const $table = XTableRefFL.value
  if ($table) {
    const { row: newRow } = await $table.insert({})
    // 插入一条数据并触发校验
    const errMap = await $table.validate(newRow)
    if (errMap) {
      // 校验失败
    }
  }
}
//删除变更行
const removeConfig = async (_row: number) => {
  const $table = XTableRefFL.value
  if ($table) {
    const { row: newRow } = await $table.remove(_row)
  }
}

//完整校验
const fullValidEvent = async () => {
  const $table2 = XTableRefFL.value;
  let result = true;
  if ($table2) {
    const errMap2 = await $table2.fullValidate();
    if (errMap2) {
      const msgList2: string[] = []
      Object.values(errMap2).forEach((errList) => {
        errList.forEach((params) => {
          const { rowIndex, column, rules } = params
          rules.forEach((rule) => {
            msgList2.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
          })
        })
      })
      result = false;
    } else {
      console.log("fl校验成功");
      console.log($table2.getTableData());
      if ($table2.getTableData().tableData.length > 0) {
        form.value.configParams = $table2.getTableData().tableData;
      } else {
        form.value.configParams = [];
      }
    }
  }
  return result;
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询物流公司列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLogisticsCompany(queryParams.value);
  logisticsCompanyList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

const changeFlag = async (row:any) => {
  await updateLogisticsCompany(row).finally(() =>  buttonLoading.value = false);
  //操作成功
  proxy?.$modal.msgSuccess("操作成功");
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  logisticsCompanyFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LogisticsCompanyVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物流公司";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LogisticsCompanyVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getLogisticsCompany(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改物流公司参数";
}

/** 提交按钮 */
const submitForm = () => {
  logisticsCompanyFormRef.value?.validate(async (valid: boolean) => {
    const isValidChangeList = await fullValidEvent();
    if (valid && isValidChangeList) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateLogisticsCompany(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLogisticsCompany(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: LogisticsCompanyVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物流公司编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delLogisticsCompany(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/logisticsCompany/export', {
    ...queryParams.value
  }, `logisticsCompany_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

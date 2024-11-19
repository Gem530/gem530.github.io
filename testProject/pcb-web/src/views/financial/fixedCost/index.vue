<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-dropdown class="mt-[1px]" v-if="checkPermi(['financial:fixedCost:import'])">
              <el-button type="primary" style="margin-left: 12px;">成本导入
                <el-icon class="el-icon--right"><arrow-down /></el-icon
              ></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="importTemplate">模板下载</el-dropdown-item>
                  <el-dropdown-item @click="handleImport">导入</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd" v-hasPermi="['financial:fixedCost:add']">新增成本费用</el-button>
          </el-col>
        </el-row>
      </template>

      <XTable
        border
        height="100%"
        ref="XTableRef"
        :loading="loading"
        :showRefresh="true"
        :data="fixedCostList"
        class="xtable-content"
        :columnList="columnList"
        toolId="financialFixedCost"
        @searchChange="searchChange"
        :row-config="{ keyField:'id' }"
        :checkbox-config="{reserve: true }"
        :column-config="{ resizable: true }"
        :intervalCondition="intervalCondition"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
      >
        <template #default-type="{row}">
          {{ fixed_cost_type.find((f: any) => f.value == row.type)?.label }}
        </template>
        <template #default-bearDeptId="{row}">
          {{ row.bearDeptId?.length ? row.bearDeptId.map((m: any) => m.deptName).join(',') : '' }}
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)" v-hasPermi="['financial:fixedCost:check']">查看</el-button>
          <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['financial:fixedCost:edit']" v-if="scope.row.showOperation">编辑</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)" v-hasPermi="['financial:fixedCost:del']" v-if="scope.row.showOperation">删除</el-button>
        </template>
      </XTable>
    </el-card>

    <!-- 添加或修改固定成本对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="45%" @close="cancel" destroy-on-close>
      <el-collapse v-model="activeNames" v-loading="dialogLoading">
        <el-collapse-item title="基本信息" name="1">
          <el-form ref="fixedCostFormRef" :model="form" :rules="rules" label-width="110px" :disabled="dialog.title == '成本费用详情'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="业务类型" prop="type">
                  <el-select v-model="form.type" placeholder="请选择业务类型" class="width-100" @change="changeType">
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      v-for="item in fixed_cost_type"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="['1','2','4'].includes(form.type+'')">
                <!-- 水电 费，多选不必填 -->
                <el-form-item label="所属部门" v-if="['1','2'].includes(form.type+'')" prop="">
                  <el-select filterable v-model="form.bearDeptId" multiple placeholder="请选择所属部门" class="width-100">
                    <el-option
                      :key="item.deptId"
                      :value="item.deptId"
                      :label="item.deptName"
                      v-for="item in deptProdList"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属部门" v-else prop="bearDeptId">
                  <el-select filterable v-model="form.bearDeptId" placeholder="请选择所属部门" class="width-100">
                    <el-option
                      :key="item.deptId"
                      :value="item.deptId"
                      :label="item.deptName"
                      v-for="item in deptProdList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属月份" prop="costMonth">
                  <el-date-picker
                    clearable
                    type="month"
                    class="width-100"
                    value-format="YYYY-MM"
                    v-model="form.costMonth"
                    placeholder="请选择所属月份"
                    :disabled-date="disabledHandle">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="成本金额(元)" required prop="price">
                  <XInputNumber class="number-left" style="width: 100%;" v-model="form.price" :min="0" :precision="2" placeholder="请输入成本金额(元)" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" rows="1" maxlength="200" type="textarea" placeholder="请输入内容" />
                </el-form-item>
              </el-col>

              <template v-if="dialog.title == '成本费用详情'">
                <el-col :span="12">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input v-model="form.createByName"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker
                      clearable
                      type="datetime"
                      class="width-100"
                      v-model="form.createTime"
                      placeholder="请选择创建时间">
                    </el-date-picker>
                    <!-- value-format="YYYY-MM-DD HH:mm:ss" -->
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="凭证信息" name="2">
          <div class="global-flex">
            <XUpload multiple v-model:model-value="form.preFileList" model="download" :disabled="dialog.title == '成本费用详情'">
              <el-button type="primary" :disabled="dialog.title == '成本费用详情'">上传附件</el-button>
              <span style="color: #909399;margin-left:10px">支持批量上传，格式不限</span>
            </XUpload>
          </div>
          <FileTable :data="form.sysFileList" makeWidth="160">
            <template #makeBtn="{row}">
              <el-button v-if="dialog.title != '成本费用详情'" link type="primary" @click="delFile(row)">删除</el-button>
            </template>
          </FileTable>
        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <div class="global-flex flex-center" v-loading="dialogLoading">
          <template v-if="dialog.title != '成本费用详情'">
            <el-button style="width: 150px;" :loading="buttonLoading" @click="cancel">取消</el-button>
            <el-button style="width: 150px;" :loading="buttonLoading" type="primary" @click="submitForm">确认{{ dialog.title == '新增成本费用' ? '新增' : '修改' }}</el-button>
          </template>
          <el-button v-else style="width: 150px;" @click="cancel">关闭</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 用户导入对话框 -->
    <GExportInvoice
      width="500px"
      :tipShowByStep="[1]"
      :title="upload.title"
      v-model:open="upload.open"
      :close-on-click-modal="false"
      :loading="importButtonLoading"
      @close ="getList"
      @confirm="startProcess">
      <template #export-tip>
        <div>注意事项:</div>
        <div>1、<span style="color: rgba(247, 34, 45, 1);">业务类型：必填</span>，单选</div>
        <div>2、<span style="color: rgba(247, 34, 45, 1);">今日用量：必填</span></div>
      </template>
    </GExportInvoice>
  </div>
</template>

<script setup name="FixedCost" lang="ts">
import dayjs from 'dayjs'
import {checkPermi} from "@/utils/permission";
import { VxeTableEvents } from 'vxe-table'
import { listDept } from '@/api/system/dept'
import { deepClone, downloadImg } from '@/utils'
import { FixedCostVO, FixedCostQuery, FixedCostForm } from '@/api/financial/fixedCost/types';
import { importData, getFixedCostList, getFixedCost, delFixedCost, addFixedCost, updateFixedCost } from '@/api/financial/fixedCost';
import { listTenantConfig } from '@/api/system/tenantConfig';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { fixed_cost_type } = toRefs<any>(proxy?.useDict("fixed_cost_type"));

const total = ref(0);
const loading = ref(true);
const showSearch = ref(true);
const deptList = ref<any[]>([])
const buttonLoading = ref(false)
const dialogLoading = ref(false)
const deptProdList = ref<any[]>([])
const fixedCostList = ref<any[]>([]);
let invalidMonth = ref(2);

const queryFormRef = ref();
const fixedCostFormRef = ref();

const dialog = reactive<any>({
  visible: false,
  title: ''
});

/** 初始化按钮加载效果 */
const importButtonLoading = ref(false);
/*** 用户导入参数 */
const upload = reactive<any>({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // // 设置上传的请求头部
  // headers: globalHeaders(),
  // // 上传的地址
  // url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
})

const activeNames = ref(['1','2'])
const initFormData: any = {
  id: undefined,
  type: undefined,
  price: undefined,
  remark: undefined,
  costMonth: undefined,
  createTime: undefined,
  createByName: undefined,
  sysFileList: [],
  preFileList: [],
}
const validateZero = (rule: any, value: any, callback: any) => {
  if ((value+'') == '') {
    callback(new Error('成本金额不能为空'))
  } else if (Number(value) <= 0) {
    callback(new Error('成本金额必须大于0'))
  } else if (!/^\d{1,10}(\.\d{1,2})?$/.test(value)) {
    callback(new Error('成本金额最多输入10位整数及2位小数'))
  } else {
    callback()
  }
}
const data = reactive<any>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    price: undefined,
    remark: undefined,
    costMonth: undefined,
    customerId: undefined,
    bearDeptId: undefined,
    createTime: undefined,
    createByName: undefined,
  },
  rules: {
    // remark: [
    //   { required: true, message: "备注不能为空", trigger: "blur" }
    // ],
    costMonth: [
      { required: true, message: "所属月份不能为空", trigger: "change" }
    ],
    bearDeptId: [
      { required: true, message: "所属部门不能为空", trigger: "change" }
    ],
    type: [
      { required: true, message: "请选择业务类型", trigger: "change" }
    ],
    price: [
      // { required: true, message: "成本金额不能为空", trigger: "blur" },
      { validator: validateZero, trigger: "blur" }
    ],
  }
});

const XTableRef = ref()

const intervalCondition = ['costMonth', 'createTime']
const columnList = ref([
  { title:"序号", type: 'seq',  align: 'center', width: '60' },
  { title: '业务类型', field: 'type', width:'100',align: 'center',
    filterType: 'radioButton',
    filterParam: { placeholder: '请输入业务类型' },
    filterData: () => fixed_cost_type.value
  },
  { title: '所属月份', field: 'costMonth', width:'130',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'month', placeholder: '请选择结束月份', valueFormat: 'YYYY-MM' },
      startParams: { type: 'month', placeholder: '请选择开始月份', valueFormat: 'YYYY-MM' },
    }
  },
  { title: '所属部门', field: 'bearDeptId', width:'100',align: 'center',
    filterType: 'checkboxSearch',
    filterParam: { placeholder: '请输入所属部门' },
    filterCustom: { label: 'deptName', value: 'deptId' },
    filterData: () => deptList.value
  },
  { title: '成本金额(元)', field: 'price', width:'110',align: 'center', sortable: true },
  { title: '备注', field: 'remark',align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入备注' }
  },
  { title: '创建人', field: 'createByName', width:'100',align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入创建人' }
  },
  { title: '创建时间', field: 'createTime', width:'130', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始时间', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedFixedCostList = ref<FixedCostVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

// 只能选择当前月份以及之前的两个月，比如当前日期为2024年8月，则只能选择，2024年6月、7月、8月
const disabledHandle = (date: any) => {
  let disMonth = dayjs(new Date()).subtract(invalidMonth.value, 'month').format('YYYY-MM') // 两个月前的时间
  let crtMonth = dayjs(date).format('YYYY-MM') // 日历的当前时间
  // console.log(disMonth, crtMonth, dayjs(new Date()).format('YYYY-MM'))
  if (!disMonth) return false

  return new Date(crtMonth).getTime() < new Date(disMonth).getTime()
}
/** 导入按钮操作 */
const handleImport = () => {
  upload.title = "成本导入";
  upload.open = true;
}
/** 下载模板操作 */
const importTemplate = () => {
  proxy?.download("cost/fixedCost/importTemplate", {
  }, `成本导入模板_${new Date().getTime()}.xlsx`);
}
// 导入
const startProcess = async (fileList: any, fn: Function) => {
  let key = fileList[0].key;
  let name = fileList[0].name;
  let size = fileList[0].size;
  let type = fileList[0].type;
  importButtonLoading.value = true
  const res = await importData({key: key,fileName: name,fileSize: size,fileType: type,updateSupport:false}).finally(()=>{
    importButtonLoading.value = false
  });
  fn && fn({
    resMsg: res.msg,
    fileKey: res.data,
    isSuccess: !res.data,
  })
}

// 每次改变 业务类型，需要清空部门，否则会出现
const oldType = ref<any>(undefined)
const changeType = (val: any) => {
  if (['1','2','4'].includes((oldType.value||'')+'') && !['1','2'].includes((val||'')+'')) {
    // 用水/用电/人工成本变为其他几种类型，所属部门需要清空
    form.value.bearDeptId = undefined
  }
  oldType.value = val
}

// 获取 搜索条件
const searchChange = (params: any) => {
  console.log(params)
  queryParams.value = params
  getList()
}

// 查询部门
const getListDept = () => {
  // { isProduction: 1 }  列表展示所有的，新增/编辑只要生产部门的(即isProduction=1)
  listDept().then((res: any) => {
    if (res.code == 200) {
      deptList.value = res.data || []
      deptProdList.value = deptList.value.filter((f) => f.isProduction == '1')
    }
  })
}

/** 查询固定成本列表 */
const getList = async () => {
  loading.value = true;
  let params = JSON.parse(JSON.stringify(queryParams.value))
  if (params.bearDeptId?.length) {
    params.bearDeptIds = params.bearDeptId
    delete params.bearDeptId
  }
  if (params.sorts?.length) {
    let isAsc = params.sorts.map((m: any) => m.order).join(',')
    let orderByColumn = params.sorts.map((m: any) => m.prop).join(',')
    params.isAsc = isAsc
    params.orderByColumn = orderByColumn
    delete params.sorts
  }
  const res = await getFixedCostList(params);
  fixedCostList.value = res.rows;
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
  fixedCostFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  getTenantConfig();
  dialog.visible = true;
  dialog.title = "新增成本费用";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: FixedCostVO) => {
  reset();
  getTenantConfig();
  dialog.visible = true;
  dialog.title = "编辑成本费用";
  dialogLoading.value = true
  const _id = row?.id
  const res = await getFixedCost(_id).finally(() => dialogLoading.value = false);
  res.data.price = res.data.price ? Number(res.data?.price || 0).toFixed(2) : res.data.price
  if (res.data?.bearDeptId?.length) res.data.bearDeptId = ['1','2'].includes(res.data.type+'') ? res.data.bearDeptId.map((m: any) => m.deptId) : res.data.bearDeptId[0]?.deptId
  form.value = res.data
  console.log(form.value)
}

// 查看详情
const handleDetail = async (row?: FixedCostVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "成本费用详情";
  const _id: any = row?.id
  dialogLoading.value = true
  const res = await getFixedCost(_id).finally(() => dialogLoading.value = false);
  res.data.price = res.data.price ? Number(res.data?.price || 0).toFixed(2) : res.data.price
  if (res.data?.bearDeptId?.length) res.data.bearDeptId = ['1','2'].includes(res.data.type+'') ? res.data.bearDeptId.map((m: any) => m.deptId) : res.data.bearDeptId[0]?.deptId
  form.value = res.data
}

/** 提交按钮 */
const submitForm = () => {
  fixedCostFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let params = deepClone(form.value)
      if (params?.preFileList?.length) {
        params.sysFileList = [...params.sysFileList, ...params.preFileList]
        delete params.preFileList
      }
      if (!['1','2','4'].includes(params.type+'')) {
        params.bearDeptId = undefined
      }
      if (params?.bearDeptId?.length) {
        // 选择人工的时候，是单选
        params.bearDeptId = Array.isArray(params?.bearDeptId) ? params?.bearDeptId.map((m: any) => {
          const crtDept = deptProdList.value.find((f: any) => f.deptId == m)
          return {
            deptId: crtDept?.deptId,
            deptName: crtDept?.deptName
          }
        }) : [{
            deptId: params?.bearDeptId,
            deptName: deptProdList.value.find((f: any) => f.deptId == params?.bearDeptId)?.deptName
        }]
      }

      // if (dialog.title == "编辑成本费用") {
      //   await proxy?.$modal.confirm(h('p', null, [
      //     h('span', null, '修改后，会影响之前的生产成本数据'),
      //     h('span', {style: 'color: var(--el-color-primary);'}, '(相关页面需要手动刷新才能更新数据)'),
      //     h('span', null, '，是否继续修改？'),
      //   ]), {
      //     cancelButtonText: '我再想想',
      //     confirmButtonText: '确认继续',
      //   });
      // }

      buttonLoading.value = true;
      if (params.id) {
        if(!params.bearDeptId){
          params.bearDeptId = [];
        }
        await updateFixedCost(params).finally(() =>  buttonLoading.value = false);
      } else {
        await addFixedCost(params).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: FixedCostVO) => {
  const _ids: any = row?.id
  await proxy?.$modal.confirm(h('p', null, [
    // h('span', null, '删除后，会影响之前的生产成本数据'),
    // h('span', {style: 'color: var(--el-color-primary);'}, '(相关页面需要手动刷新才能更新数据)'),
    // h('span', null, '，是否确删除？'),
    h('span', null, '是否确认删除该数据？'),
  ]), {
    cancelButtonText: '我再想想',
    confirmButtonText: '确认删除',
  });
  loading.value = true
  await delFixedCost(_ids).finally(() => loading.value = false);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

// 删除文件
const delFile = (row: any) => {
  // console.log(row)
  form.value.sysFileList = form.value.sysFileList.filter((f: any) => f.key != row.key)
}

const getTenantConfig = async () => {
  let params = {
    code: "costMonthNumber"
  }
  const res:any = await listTenantConfig(params);
  if (res && res.length > 0 && res[0].values && res[0].values.length > 0) {
    invalidMonth.value = Math.abs(res[0].values[0]);
  }
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('cost/fixedCost/export', {
    ...queryParams.value
  }, `fixedCost_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getListDept()
  getList();
  getTenantConfig();
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

<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <div style="float:right;">
<!--            <el-button link type="primary" @click=""> 点击刷新数据</el-button>-->
            <el-button type="primary" @click="handleExport" v-hasPermi="['report:costDept:export']">导出</el-button>
        </div>
      </template>

        <XTable height="100%" class="xtable-content" toolId="costDept"
                v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="deptList"
                :columnList="columnList"
                ref="XTableRef"
                v-loading="loading"
                border :showRefresh="true"
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                @checkbox-all="selectChangeEvent"
                @checkbox-change="selectChangeEvent"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }"
        >
<!--            <template #default-make="scope">-->
<!--              <el-button link type="primary" @click="handleUpdate(scope.row)">更新数据</el-button>-->
<!--            </template>-->
        </XTable>
    </el-card>
  </div>
</template>

<script setup name="CostDept" lang="ts">
import { listDept} from '@/api/report/costDept';
import { DeptVO, DeptQuery, DeptForm } from '@/api/report/costDept/types';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const deptList = ref<DeptVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deptFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeptForm = {
  id: undefined,
  ownerId: undefined,
  remark: undefined,
  costMonth: undefined,
  deptId: undefined,
  materialCraftPrice: undefined,
  artificialPrice: undefined
}
const data = reactive<PageData<DeptForm, DeptQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    costMonth: undefined,
    deptId: undefined,
    materialCraftPrice: undefined,
    artificialPrice: undefined,
    orderByColumn: undefined,
    isAsc: undefined,
    params: {
    }
  },
  rules: {
  }
});
// const intervalCondition = ['costMonth'];
const XTableRef = ref()

const columnList = ref([
    { title:"序号" ,type: 'seq',  align: 'center', width: '160' },
    // { type: 'checkbox', align: 'center', field: "checkbox",  width: '40', },
  { title: '生产部门', field: 'deptName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入部门名称' } },
  { title: '所属月份', field: 'costMonth', width: '260',align: 'center', filterType: 'date',
    filterParam: { type: 'month', placeholder: '请选择结存月份', valueFormat: 'YYYY-MM' }
  },
  { title: '工序物料成本(元)', sortable: true, field: 'materialCraftPrice', align: 'center'},
  { title: '人工成本(元)', sortable: true, field: 'artificialPrice', align: 'center'},
  { title: '用电成本(元)', sortable: true, field: 'electricPrice', align: 'center'},
  { title: '用水成本(元)', sortable: true, field: 'waterPrice', align: 'center'},
    // { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', },
]);

const checkedDeptList = ref<DeptVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<DeptVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedDeptList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
  if (params.sorts && params.sorts.length > 0) {
    params.sorts.forEach((item : any) => {
      queryParams.value.orderByColumn = item.prop;
      queryParams.value.isAsc = item.order;
    })
  }
    getList()
}

/** 查询部门成本列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDept(queryParams.value);
  deptList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}


/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  deptFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DeptVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// 辅助函数：将 Date 对象格式化为 "yyyyMMdd" 格式
function formatDate(date : any) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从 0 开始的，所以需要 +1
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
}

// 修改后的 handleExport 函数
const handleExport = () => {
  proxy?.download('cost/dept/export', {
    ...queryParams.value
  }, `部门成本统计_${formatDate(new Date())}.xlsx`);
};


onMounted(() => {
  getList();
});
</script>

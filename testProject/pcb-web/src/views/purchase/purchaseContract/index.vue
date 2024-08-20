<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <h1>采购合同签章</h1>
        </el-row>
      </template>

      <vxe-table
        align="center"
        ref="tableRef"
        border
        :loading="loading"
        auto-resize
        :data="tableDataOpen"
        @toggle-row-expand="toggleExpandChangeEvent"
      >
        <vxe-column type="seq" width="50" title="序号" :fixed="seqFixed"></vxe-column>
        <vxe-column align="center" type="expand" width="40" :fixed="expandFixed">
          <template #content="{ row, rowIndex }">
            <div class="expand-wrapper">
              <vxe-table border :data="otherList">
                <vxe-column field="role" title="物料编码"></vxe-column>
                <vxe-column field="address" title="物料名称"></vxe-column>
                <vxe-column field="address" title="规格型号"></vxe-column>
                <vxe-column field="address" title="材质牌号"></vxe-column>
                <vxe-column field="address" title="板厚"></vxe-column>
                <vxe-column field="address" title="铜厚"></vxe-column>
                <vxe-column field="address" title="颜色"></vxe-column>
                <vxe-column field="address" title="级别"></vxe-column>
                <vxe-column field="address" title="长(mm)"></vxe-column>
                <vxe-column field="address" title="宽(mm)"></vxe-column>
                <vxe-column field="address" title="品牌"></vxe-column>
                <vxe-column field="address" title="采购单位"></vxe-column>
                <vxe-column field="address" title="申请数量"></vxe-column>
                <vxe-column field="address" title="采购数量"></vxe-column>
                <vxe-column field="address" title="采购单价"></vxe-column>
                <vxe-column field="address" title="采购金额"></vxe-column>
                <vxe-column field="address" title="要求交期"></vxe-column>
              </vxe-table>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="sex" title="采购单号"></vxe-column>
        <vxe-column field="age" title="供应商名称" :fixed="ageFixed"></vxe-column>
        <vxe-column field="age" title="收货地址" :fixed="ageFixed"></vxe-column>
        <vxe-column field="age" title="制单人" :fixed="ageFixed"></vxe-column>
        <vxe-column field="age" title="制单时间" :fixed="ageFixed"></vxe-column>
        <vxe-column field="age" title="备注" :fixed="ageFixed"></vxe-column>
        <vxe-column field="age" title="操作" :fixed="ageFixed">
          <template #default="{ row, rowIndex }">
            <el-button link type="primary" @click="dialogExamine.visible = true">签章</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div style="display: flex; justify-content: center;">
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
      </div>
    </el-card>

    <!-- 查看 -->
    <el-dialog v-model="dialogExamine.visible" title="签章" width="30%" draggable>
      <div style="display: flex; justify-content: center;">
        <h1>签章成功！</h1>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogExamine.visible = false">取消</el-button>
            <el-button type="primary" @click="dialogExamine.visible = false"> 确定 </el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PurchaseContract" lang="ts">


import {
  listRawMaterial,
  getRawMaterial,
  delRawMaterial,
  addRawMaterial,
  updateRawMaterial
} from '@/api/basedata/rawMaterial';
import {RawMaterialVO, RawMaterialQuery, RawMaterialForm} from '@/api/basedata/rawMaterial/types';
import {SupplierVO} from "@/api/basedata/supplier/types";
import { listSupplier, getSupplier, listSupplierNoPage } from '@/api/basedata/supplier';


import { ref } from 'vue'
import { VxeTableInstance, VxeTablePropTypes, VxeColumnPropTypes } from 'vxe-table'

const gridData = [
  {
    date: '2016',
    name: 'John',
    address: '150',
  },
  {
    date: ' 60',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '20',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
  {
    date: '2016',
    name: 'John Smith',
    address: ' 152',
  },
]

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  num: string
  num2: string
  address: string
}
const formData = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const xTable = ref<VxeTableInstance<RowVO>>()

const tableData = ref<RowVO[]>([
  { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, num: '3.8', num2: '3.8', address: 'test abc' },
  { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, num: '511', num2: '511', address: 'Guangzhou' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, num: '12.8', num2: '12.8', address: 'Shanghai' },
  { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 23, num: '103', num2: '103', address: 'test abc' },
  { id: 10005, name: 'Test5', role: 'Develop', sex: 'Women', age: 30, num: '56', num2: '56', address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 21, num: '49', num2: '49', address: 'test abc' },
  { id: 10007, name: 'Test7', role: 'Test', sex: 'Man', age: 29, num: '400.9', num2: '400.9', address: 'test abc' },
  { id: 10008, name: 'Test8', role: 'Develop', sex: 'Man', age: 35, num: '5000', num2: '5000', address: 'test abc' }
])

const sortEvent = (field: VxeColumnPropTypes.Field, order: VxeTablePropTypes.SortOrder) => {
  const $table = xTable.value
  if ($table) {
    $table.sort({ field, order })
  }
}

const clearSortEvent = () => {
  const $table = xTable.value
  if ($table) {
    $table.clearSort()
  }
}

// ========================================================================================
// 展开行

interface RowOpenVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  address: string
}

const tableRef = ref<VxeTableInstance<RowOpenVO>>()

const tableDataOpen = ref<RowOpenVO[]>([
  { id: 10001, name: 'Test1', role: 'DevelopDevelopDevelop', sex: 'Man', age: 28, address: 'test abc test abc test abc test abc test abc test abc test abc test abc' },
  { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { id: 10004, name: 'Test4', role: 'DesignerDesignerDesignerDesigner', sex: 'Women', age: 36, address: 'Guangzhou test abc test abc test abc test abc test abc test abc test abc' },
  { id: 10005, name: 'Test5', role: 'Develop', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Man', age: 34, address: 'test abc' }
])

const otherList = ref([
  { id: 50001, name: 'Test5001', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
  { id: 50002, name: 'Test5002', role: 'Test', sex: 'Women', age: 22, address: 'test abc test abc test abc test abc test abc' }
])

const seqFixed = ref<VxeColumnPropTypes.Fixed>()
const expandFixed = ref<VxeColumnPropTypes.Fixed>()
const ageFixed = ref<VxeColumnPropTypes.Fixed>()

const toggleSeqFixed = () => {
  seqFixed.value = seqFixed.value ? null : 'left'
}

const toggleExpandFixed = () => {
  expandFixed.value = expandFixed.value ? null : 'left'
}

const toggleAgeFixed = () => {
  ageFixed.value = ageFixed.value ? null : 'right'
}

const expandEvent1 = () => {
  const $table = tableRef.value
  if ($table) {
    $table.toggleRowExpand(tableData.value[1])
  }
}

const expandEvent2 = () => {
  const $table = tableRef.value
  if ($table) {
    $table.setRowExpand([tableData.value[2], tableData.value[3]], true)
  }
}

const expandAllEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.setAllRowExpand(true)
  }
}

const clearExpandEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.clearRowExpand()
  }
}

const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<RowVO> = ({ expanded }) => {
  console.log('行展开事件' + expanded)
}



//==================================================================================
// 受理表单数据
const labelPosition = ref('right')

const formLabelAlign = reactive({
  name: '',
  region: '',
  type: '',
})

//合计

const footerMethod: VxeTablePropTypes.FooterMethod<RowVO> = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "num1") {
        return `${sumNum(data, "num1")} `;
      }
      if (column.field == "num1") {
        return `${sumNum(data, "num1")} `;
      }
      return "";
    })
  ];
};
//=======================================================================

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const rawMaterialList = ref<RawMaterialVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
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
const dialogMaterial = reactive<DialogOption>({
  visible: false,
  title: '审核'
});
const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '受理'
});




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
const handleSelect = async () => {
  reset();

  dialog.visible = true;
  dialog.title = "查看原料";
}

/** 修改按钮操作 */
const handleUpdate = async () => {
  reset();

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
  const _ids = row?.materialCode || ids.value;
  await proxy?.$modal.confirm('是否确认删除原料编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
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
});
</script>

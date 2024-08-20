<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" class="xtable-tab">
        <el-tab-pane label="待收货列表">
          <el-row style="width: 100%">
            <el-col :span="24" align="right">
              <el-button plain @click="handleExportBefore">导出 </el-button>
            </el-col>
          </el-row>
          <XTable
            toolId="outsourceSourceHalfProcessReceiveWait"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :intervalCondition="intervalCondition"
            :page-params="{ perfect: true, total: orderTotal }"
            :data="orderList"
            :columnList="columnList"
            ref="XTableRef"
            :loading="orderLoading"
            border :showRefresh="true"
            @searchChange="searchOrderChange"
            :column-config="{ resizable: true }"
          >
            <template #default-unit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
            </template>
            <!-- <template #default-quantity="{ row }">
              <div>{{ row.quantity?Number(row.quantity).toFixed(0):0 }}</div>
            </template> -->
            <!-- <template #default-waitQuantity="{ row }">
              <div>{{ row.waitQuantity?Number(row.waitQuantity).toFixed(0):0 }}</div>
            </template> -->
            <!-- <template #default-receiveQuantity="{ row }">
              <div>{{ row.receiveQuantity?Number(row.receiveQuantity).toFixed(0):0 }}</div>
            </template> -->
            <template #default-receiveUnit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.receiveUnit)?.label }}</div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-if="!wxhSwitch && scope.row.waitQuantity!=0" @click="handleUpdate(scope.row)">收货</el-button>
              <el-button link type="primary" v-if="!wxhSwitch" @click="handleDelete(scope.row)">结单</el-button>
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="收货记录">
          <XTable
            toolId="outsourceSourceHalfProcessReceiveRecord"
            height="100%"
            class="xtable-content"
            v-model:page-size="recordQueryParams.pageSize"
            v-model:current-page="recordQueryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="sourceHalfProcessReceiveList"
            :columnList="recordColumnList"
            ref="OrderXTableRef"
            border :showRefresh="true"
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{ reserve: true }"
              :intervalCondition="recordCondition"
            :row-config="{ keyField: 'id' }"
            :loading="loading"
          >
          <!-- <template #default-quantity="{ row }">
            <div>{{ row.quantity?Number(row.quantity).toFixed(0):0 }}</div>
          </template>
          <template #default-receiveQuantity="{ row }">
            <div>{{ row.receiveQuantity?Number(row.receiveQuantity).toFixed(0):0 }}</div>
          </template>
          <template #default-waitQuantity="{ row }">
            <div>{{ row.waitQuantity?Number(row.waitQuantity).toFixed(0):0 }}</div>
          </template> -->
            <template #default-unit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
            </template>
            <template #default-make="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="详情" placement="top">
                <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加或修改外协加工收货记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="sourceHalfProcessReceiveFormRef" :model="form" :rules="rules" label-width="80px" v-loading="dialogTableLoading">
        <el-form-item label="单位ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入单位ID" />
        </el-form-item>
        <el-form-item label="半外协订单id" prop="halfProcessOrderId">
          <el-input v-model="form.halfProcessOrderId" placeholder="请输入半外协订单id" />
        </el-form-item>
        <el-form-item label="收货数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入收货数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer :title="drawer.title" v-model="drawer.visible" size="70%">
      <el-form ref="sourceHalfProcessOrderFormRef" :model="form" size="small" :rules="rules" label-width="80px" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="6">
            <el-form-item label="收货人">
              <el-input :disabled="true" v-model="nickname"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货日期">
              <el-input :disabled="true" v-model="currentTime"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外协单号">
              <el-input :disabled="true" v-model="form.code"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外协供应商">
              <el-input :disabled="true" v-model="form.supplierName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排产单号">
              <el-input :disabled="true" v-model="form.productionCode"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品编号">
              <el-input :disabled="true" v-model="form.commodityCode"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工工序">
              <el-input :disabled="true" v-model="form.craftName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="长">
              <el-input :disabled="true" v-model="form.length"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="宽">
              <el-input :disabled="true" v-model="form.width"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外发类型">
              <el-input :disabled="true" v-model="form.typeName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工单位">
              <el-input :disabled="true" v-model="displayUnit"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工数量">
              <el-input :disabled="true" v-model="form.quantity"> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="加工要求">
              <el-input :disabled="true" v-model="form.requirement" type="textarea" :rows="5"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加工备注">
              <el-input :disabled="true" v-model="form.orderRemark" type="textarea" :rows="3"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-show="!drawer.title?.includes('详情')" label="收货单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择收货单位" @change="unitChange">
                <el-option v-for="item in unitList" :key="item.unit" :label="item.unitName" :value="item.unit" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item  v-show="drawer.title?.includes('详情')" label="收货单位">
              <el-input :disabled="true" v-model="displayReceiveUnit"></el-input>
            </el-form-item> -->
          </el-col>
           <!-- <el-col :span="6">
                <el-form-item  v-show="drawer.title?.includes('详情')" label="待收数">
                    <el-input :disabled="true" v-model="form.waitQuantity"></el-input>
                  </el-form-item>
          </el-col> -->
          <el-col :span="18">
            <el-form-item label="收货数" v-show="!drawer.title?.includes('详情')" prop="checkedTypeList">
              <el-checkbox-group v-model="form.checkedTypeList">
                <div v-for="t in typeList" :key="t.id" class="unit-flex">
                  <el-checkbox class="checkClass" :key="t.id" :label="t.id">{{ t.typeName }} </el-checkbox>
                  <el-form-item :prop="'typeList.' + t.receiveQuantity" :rules="checkReceiveQuantity(t.id)">
                    <el-input v-model="t.receiveQuantity" type="number" :max = "t.quantity">
                      <template #append>{{ t.quantity }}</template></el-input
                    >
                  </el-form-item>
                </div>

              </el-checkbox-group>
            </el-form-item>

          </el-col>

          <el-col :span="24">
            <el-form-item v-show="!drawer.title?.includes('详情')" label="收货备注">
              <el-input v-model="form.remark" type="textarea" :rows="3"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button :loading="buttonLoading" type="primary" v-show="!drawer.title?.includes('详情')" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <el-dialog
      v-model="exportVisible"
      title="导出提示"
      width="20%"
      align-center
      destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="handleExport">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SourceHalfProcessReceive" lang="ts">
import { listSourceHalfProcessReceive, listSourceHalfProcessOrder, getSourceHalfProcessOrder, delSourceHalfProcessReceive, addSourceHalfProcessReceive, updateSourceHalfProcessReceive } from '@/api/outsource/sourceHalfProcessReceive';
import { SourceHalfProcessReceiveVO, SourceHalfProcessReceiveQuery, SourceHalfProcessReceiveForm } from '@/api/outsource/sourceHalfProcessReceive/types';

import { VxeTableEvents } from 'vxe-table'

const wxhSwitch = ref(import.meta.env.VITE_WXH_SWITCH === 'true');

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sourceHalfProcessReceiveList = ref<SourceHalfProcessReceiveVO[]>([]);
const orderList = ref<SourceHalfProcessReceiveVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const orderLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const orderTotal = ref(0);

const queryFormRef = ref<ElFormInstance>();
const sourceHalfProcessReceiveFormRef = ref<ElFormInstance>();
const sourceHalfProcessOrderFormRef = ref<ElFormInstance>();
const dialogTableLoading = ref(false)

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const drawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const unitOptions = ref([
  { value: "1", label: "大料" },
  { value: "2", label: "PNL" },
  { value: "3", label: "SET" },
])
const initFormData: SourceHalfProcessReceiveForm = {
  id: undefined,
  ownerId: undefined,
  halfProcessOrderId: undefined,
  quantity: undefined,
  receiveTime: undefined,
  remark: undefined,
  unit: undefined,
  createByName: undefined,
  code: undefined,
  totalPrice: undefined,
  addressId: undefined,
  receiveQuantity: undefined,
  length: undefined,
  width: undefined,
  placeOrderTime: undefined,
  completeTime: undefined,
  planId: undefined,
  productionId: undefined,
  productionCode: undefined,
  craftId: undefined,
  commodityId: undefined,
  type: undefined,
  typeName: undefined,
  orderUnitName: undefined,
  requirement: undefined,
  schemeQuantity: undefined,
  schemeLength: undefined,
  schemeWidth: undefined,
  pnlQuantity: undefined,
  pnlLength: undefined,
  pnlWidth: undefined,
  setQuantity: undefined,
  setLength: undefined,
  setWidth: undefined,
  halfProcessOrderCode: undefined,
  supplierName: undefined,
  commodityCode: undefined,
  craftName: undefined,
  orderQuantity: undefined,
  orderUnit: undefined,
  typeList: [],
}

const checkReceiveQuantity = (unitId: any) => {

  if (form.value.checkedTypeList) {
    if (form?.value?.checkedTypeList.includes(unitId)) {
      let flag = false;
      let check = [];
      if (typeList.value) {
        typeList.value.forEach((item: any) => {
          if (item.id == unitId) {
            if (!item.receiveQuantity || item.receiveQuantity <=0) {
              check = [
                { required: true, message: '请输入收货数', trigger: 'blur' },
              ];
              flag = true;
              return;
            } else if ( Number(item.receiveQuantity )> Number(item.quantity)) {
              check = [
                { required: true, message: '收货数不能大于待收数', trigger: 'blur' },
              ];
              flag = true;
              return;
            } else if (['2','3'].includes(form.value.unit) && !/^[0-9]\d*$/.test(Number(item.receiveQuantity))) {
              check = [
                { required: true, message: '请输入整数', trigger: 'blur' },
              ];
            } else {
              check = [{ required: false, message: '', trigger: 'blur' }];
            }

          }
        });
      }
      if (flag) {
        return check;
      }
      return check;
    }

  }
  return [];
}
const data = reactive<PageData<SourceHalfProcessReceiveForm, SourceHalfProcessReceiveQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    halfProcessOrderId: undefined,
    quantity: undefined,
    receiveTime: undefined,
    unit: undefined,
    code: undefined,
    params: {
    }
  },
  rules: {


    checkedTypeList: [
      { required: true, message: "请选择收货类型", trigger: "change" }
    ],

    unit: [
      { required: true, message: "请选择收货单位", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

const receiveData = reactive<PageData<SourceHalfProcessReceiveForm, SourceHalfProcessReceiveQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    halfProcessOrderId: undefined,
    quantity: undefined,
    receiveTime: undefined,
    unit: undefined,
    code: undefined,
    params: {
    }
  },
  rules: {

  }
});
const { queryParams:recordQueryParams } = toRefs(receiveData);

const XTableRef = ref()
const OrderXTableRef = ref()

const exportVisible = ref(false);
const recordCondition = ['receiveTime'];
const recordColumnList = ref([

  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '收货单号', field: 'code', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收货单号' } },
  { title: '外协单号', field: 'orderCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '排产单号', field: 'productionCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入排产单号' } },
  { title: '产品编码', width: '160', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
  { title: '供应商', width: '160', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '加工工序', width: '120', field: 'craftName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '加工数量', field: 'quantity', width: '100', align: 'center', },
  { title: '外发单位', width: '100', field: 'unit', align: 'center', },
  { title: '长', width: '100', field: 'length', align: 'center', },
  { title: '宽', width: '100', field: 'width', align: 'center', },
  { title: '外发类型', width: '100', field: 'typeName', align: 'center', },
  { title: '加工要求', width: '180', field: 'requirement', align: 'center', },
  { title: '备注', field: 'remark', width: '100', align: 'center', },
  { title: '收货人', field: 'createByName', width: '100', align: 'center', },
  { title: '收货时间', field: 'receiveTime', width: '100', align: 'center',filterType: 'intervalDate',  filterParam: {
       startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    } },
  { title: '已收数', field: 'receiveQuantity', width: '100', align: 'center', },
]);

const intervalCondition = ['placeOrderTime'];
const columnList = ref([

  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '外协单号', field: 'code', width: '140', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '排产单号', field: 'productionCode', width: '140', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入排产单号' } },
  { title: '产品编码', width: '120', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
  {title: '下单时间', width: '140',  field: 'placeOrderTime', align: 'center',filterType: 'intervalDate',  filterParam: {
       startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
      { title: '加工数量', width: '100', field: 'quantity', align: 'center', },
  { title: '供应商', width: '160', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '加工工序', width: '100', field: 'craftName', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入工序' }},
  { title: '长', width: '100', field: 'length', align: 'center', },
  { title: '宽', width: '100', field: 'width', align: 'center', },
  { title: '外发类型', width: '100', field: 'typeName', align: 'center', },
  { title: '加工要求', width: '100', field: 'requirement', align: 'center', },
  { title: '备注', field: 'remark', width: '100', align: 'center', },
  { title: '下单人', field: 'createByName', width: '100', align: 'center', },

  { title: '外发单位', width: '100', field: 'unit', align: 'center', },
  { title: '待收数量', field: 'waitQuantity', width: '100', align: 'center', },
  { title: '收货单位', field: 'receiveUnit', width: '100', align: 'center', },
  { title: '已收数', field: 'receiveQuantity', width: '100', align: 'center', },
  { title: '表面处理类型', width: '100', field: 'surfaceTreatment', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedSourceHalfProcessReceiveList = ref<SourceHalfProcessReceiveVO[]>([]);



const unitList = ref<any>([])
const typeList = ref<any>([])

// 获取 搜索条件
const unitChange = () => {
  if (!form.value.unit) {
    return;
  }
  let unit = unitList.value.filter(item => item.unit == form.value.unit);
  typeList.value = unit[0].typeList;
  form.value.checkedTypeList = [];
  //当只有一个的时候设置默认选中form.checkedTypeList
  console.log("=====================", typeList.value);
  if(typeList.value&&typeList.value.length==1){
    form.value.checkedTypeList=[];
    form.value.checkedTypeList?.push(typeList.value[0].id);
  }
}


const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceHalfProcessReceiveVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedSourceHalfProcessReceiveList.value = selectRecords.map(item => item);
  }
}

// 获取 搜索条件
const searchChange = (params: any) => {
  recordQueryParams.value = params
  getList()
}
// 获取 搜索条件
const searchOrderChange = (params: any) => {
  queryParams.value = params
  getOrderList();
}
/** 查询外协加工收货记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceHalfProcessReceive(recordQueryParams.value);
  sourceHalfProcessReceiveList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询外协加工收货记录列表 */
const getOrderList = async () => {
  orderLoading.value = true;
  const res = await listSourceHalfProcessOrder(queryParams.value);
  orderList.value = res.rows;



  orderTotal.value = res.total;
  orderLoading.value = false;
}


/** 取消按钮 */
const cancel = () => {
  reset();
  drawer.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  sourceHalfProcessReceiveFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SourceHalfProcessReceiveVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加外协加工收货记录";
}

/** 导出前操作 */
const handleExportBefore = async () => {
  if (!queryParams.value.placeOrderTimeStart) {
    exportVisible.value = true;
  } else {
      proxy?.download('outsource/sourceHalfProcessReceive/export', {
        ...queryParams.value, tableName: 'outsourceSourceHalfProcessReceiveWait'
      }, `外协加工收货_${new Date().getTime()}.xlsx`);
  }
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SourceHalfProcessReceiveVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  drawer.visible = true;
  drawer.title = "外协加工收货";
  dialogTableLoading.value = true
  const res = await getSourceHalfProcessOrder(_id);
  Object.assign(form.value, row);
  form.value.orderUnit=row?.unit;
  form.value.orderRemark = row?.remark;

  unitList.value = res.data.unitList;
  typeList.value = unitList.value[0].typeList;
  form.value.unit = unitList.value[0].unit;
  form.value.remark = '';
  //当只有一个的时候设置默认选中form.checkedTypeList
  console.log("=====================", typeList.value);
  if(typeList.value&&typeList.value.length==1){
    form.value.checkedTypeList=[];
    form.value.checkedTypeList?.push(typeList.value[0].id);
  }

  dialogTableLoading.value = false
}
/** 详情按钮操作 */
const handleSelect = async (row?: SourceHalfProcessReceiveVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  console.log(row);

  Object.assign(form.value, row);
    form.value.orderUnit=row?.unit;
  form.value.orderRemark = row?.remark;
  drawer.visible = true;
  drawer.title = "外协加工订单详情";
}

/** 提交按钮 */
const submitForm = () => {

  sourceHalfProcessOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.typeList = typeList.value;
      form.value.isCompression = '0';
      form.value.outSourceTime = new Date();
      form.value.commodityId = '0';
      await addSourceHalfProcessReceive(form.value).finally(() => buttonLoading.value = false);

      proxy?.$modal.msgSuccess("添加成功");
      drawer.visible = false;
      await getOrderList();
      getList();
    }
  });
}

/** 结单按钮操作 */
const handleDelete = async (row?: SourceHalfProcessReceiveVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认结单外协加工收货记录编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceHalfProcessReceive(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
   await getOrderList();

}

/** 导出按钮操作 */
const handleExport = () => {
  exportVisible.value = false;
  proxy?.download('outsource/sourceHalfProcessReceive/export', {
    ...queryParams.value, tableName: 'outsourceSourceHalfProcessReceiveWait'
  }, `外协加工收货_${new Date().getTime()}.xlsx`);
}
import useUserStore from '@/store/modules/user';
import { number } from 'vue-types';
import {ref} from "vue";
const { nickname } = useUserStore();
// 使用 ref 创建 currentTime 变量
const currentTime = ref(getCurrentTime());
// 获取当前时间的方法
function getCurrentTime() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Intl.DateTimeFormat('zh-CN', options).format(now);
}
// 更新当前时间
function updateCurrentTime() {
  const update = () => {
    currentTime.value = getCurrentTime();
    requestAnimationFrame(update); // 递归调用，实现动画效果
  };
  update(); // 启动更新
}

const displayUnit = computed(() => {
  return unitOptions.value.find(v => v.value == form.value.orderUnit)?.label;
})
const displayReceiveUnit = computed(() => {
  return unitOptions.value.find(v => v.value == form.value.receiveUnit)?.label;
})

onMounted(() => {
  getList();
  getOrderList();
  updateCurrentTime();
});
</script>

<style lang="scss" scoped>
:deep(.el-checkbox-group),
.unit-flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 10px;
}
</style>

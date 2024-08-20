<template>
  <div class="p-2">
    <el-card shadow="never">
      <el-tabs type="border-card">
        <el-tab-pane label="实时库存">
          <XTable
            v-loading="waitLoading"
            v-model:page-size="waitQueryParams.pageSize"
            v-model:current-page="waitQueryParams.pageNum"
            :page-params="{ perfect: true, total: auditedTotal }"
            :data="waitAuditedBackList"
            :columnList="waitColumnList"
            ref="XTableRef"
            border
            @searchChange="waitSearchChange"
            :column-config="{ resizable: true }"
          >
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="出入库记录">
          <XTable
            v-loading="loading"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="sourceFullProcessOrderBackList"
            :columnList="columnList"
            ref="XTableRef"
            border
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
          >
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup name="SourceFullProcessOrderBack" lang="ts">
import { listSourceFullProcessOrderBack, } from '@/api/outsource/sourceFullProcessOrderBack';
import { SourceFullProcessOrderBackVO, SourceFullProcessOrderBackQuery, SourceFullProcessOrderBackForm } from '@/api/outsource/sourceFullProcessOrderBack/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sourceFullProcessOrderBackList = ref<SourceFullProcessOrderBackVO[]>([]);
const waitAuditedBackList = ref<SourceFullProcessOrderBackVO[]>([]);

const loading = ref(true);
const waitLoading = ref(true);

const total = ref(0);
const auditedTotal = ref(0);









const supplierId = ref<string | number>('');

const initFormData: SourceFullProcessOrderBackForm = {
  id: undefined,
  fullProcessOrderId: undefined,
  quantity: undefined,
  backTime: undefined,
  reason: undefined,
  no: undefined,
  ownerId: undefined,
  backList: []
}
const data = reactive<PageData<SourceFullProcessOrderBackForm, SourceFullProcessOrderBackQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    fullProcessOrderId: undefined,
    quantity: undefined,
    backTime: undefined,
    reason: undefined,
    no: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {

  }
});
//待审核
const waitAuditedData = reactive<PageData<SourceFullProcessOrderBackForm, SourceFullProcessOrderBackQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,

    pageSize: 20,
    supplierId: undefined,
    fullProcessOrderId: undefined,
    quantity: undefined,
    backTime: undefined,
    reason: undefined,
    no: undefined,
    ownerId: undefined,
    status: "2",
    params: {
    }
  },
  rules: {

  }
});

const XTableRef = ref()



const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
       { title: '单据状态',width:'100', field: 'status', align: 'center', },
        { title: '退货单号',width:'200', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单外协订单ID' } },
        { title: '产品库存单号',width:'200', field: 'inventoryCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单外协订单ID' } },
        { title: '产品名称', width:'200',field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单外协订单ID' } },
        { title: '退货数量(PCS)', width:'140',field: 'quantity', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货数量' } },
        { title: '外协供应商', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货时间' } },
        { title: '外协单价', width:'100',field: 'price', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货原因' } },
        { title: '库存数', width:'100',field: 'inventoryQuantity', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货单号' } },
        { title: '存货仓',field: 'storageId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入所属单位ID' } },
]);
const waitColumnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
       { title: '单据状态',width:'100', field: 'status', align: 'center', },
        { title: '退货单号',width:'200', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单外协订单ID' } },
        { title: '产品库存单号',width:'200', field: 'inventoryCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单外协订单ID' } },
        { title: '产品名称', width:'200',field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单外协订单ID' } },
        { title: '退货数量(PCS)', width:'140',field: 'quantity', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货数量' } },
        { title: '外协供应商',width:'180', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货时间' } },
        { title: '外协单价', width:'100',field: 'price', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货原因' } },
        { title: '库存数', width:'100',field: 'inventoryQuantity', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货单号' } },
        { title: '存货仓',field: 'storageId', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入所属单位ID' } },
]);



const { queryParams,  } = toRefs(data);
const { queryParams:waitQueryParams } = toRefs(waitAuditedData);


const selectTotal = ref(0);

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}
// 获取 搜索条件
const waitSearchChange = (params: any) => {
    waitQueryParams.value = params
    getWaitList()
}

/** 查询订单外协退货订单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceFullProcessOrderBack(queryParams.value);
  sourceFullProcessOrderBackList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询订单外协退货订单列表 */
const getWaitList = async () => {
  waitLoading.value = true;
  waitQueryParams.value.status = "2";
  const res = await listSourceFullProcessOrderBack(waitQueryParams.value);
  waitAuditedBackList.value = res.rows;
  auditedTotal.value = res.total;
  waitLoading.value = false;
}



// 更新当前时间
function updateCurrentTime() {
  const update = () => {
    currentTime.value = getCurrentTime();
    requestAnimationFrame(update); // 递归调用，实现动画效果
  };
  update(); // 启动更新
}
onMounted(() => {

  getList();

  getWaitList();
});
</script>

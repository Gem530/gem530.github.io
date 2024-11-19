<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <!-- <el-col :span="1.5" class="primary-color">
            每月1号自动更新上月数据
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="primary" :disabled="loading" @click="exportData" v-hasPermi="['report:orderProfitCost:export']">导出</el-button>
          </el-col>
        </el-row>
      </template>

      <XTable
        border
        height="100%"
        ref="XTableRef"
        :seq-config="{}"
        :loading="loading"
        :showRefresh="true"
        :data="orderProfitList"
        class="xtable-content"
        :columnList="columnList"
        toolId="orderProfitCostTool"
        :row-config="{ keyField:'id' }"
        :checkbox-config="{reserve: true }"
        :column-config="{ resizable: true }"
        :intervalCondition="intervalCondition"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        @searchChange="searchChange"
      >
        <template #default-make="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </XTable>
    </el-card>

    <!-- 添加或修改固定成本对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="65%" @close="cancel" destroy-on-close>
      <el-form ref="anyRef" :model="form" :rules="rules" label-width="110px" :disabled="dialog.title.includes('详情')" v-loading="dialogLoading">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-row>
            <el-col :span="6">
              <el-form-item label="下单时间:" prop="placeOrderTime">
                <el-input v-model="form.placeOrderTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号:" prop="orderCode">
                <el-input v-model="form.orderCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品编码:" prop="commodityCode">
                <el-input v-model="form.commodityCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同状态:" prop="orderFlowStatusStr">
                <el-input v-model="form.orderFlowStatusStr"></el-input>
              </el-form-item>
            </el-col>

<!--            <el-col :span="6">-->
<!--              <el-form-item label="客户名称:" prop="cusName">-->
<!--                <el-input v-model="form.cusName"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="6">
              <el-form-item label="客户代码:" prop="cusCode">
                <el-input v-model="form.cusCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单面积:" prop="orderArea">
                <el-input v-model="form.orderArea">
                  <template #append>㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单数量:" prop="orderQuantity">
                <el-input v-model="form.orderQuantity"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="送货数量:" prop="deliveryQuantity">
                <el-input v-model="form.deliveryQuantity"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同差数:" prop="differentQuantity">
                <el-input v-model="form.differentQuantity"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="orderSumPrice">
                <template #label>
                  <div class="global-flex flex-end">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      content="合计成本=板料成本+本厂工序成本+外协加工成本+固定成本+报废成本+品质扣款"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                    &nbsp;合计成本:
                  </div>
                </template>
                <el-input v-model="form.orderSumPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="orderGrossProfit">
                <template #label>
                  <div class="global-flex flex-end">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      content="毛利润=该订单的送货金额-该订单的生产成本"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                    &nbsp;毛利润:
                  </div>
                </template>
                <el-input v-model="form.orderGrossProfit">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item title="板料成本" name="2">
          <el-row>
            <el-col :span="6">
              <el-form-item label="板料数量:" prop="plateQuantity">
                <el-input v-model="form.plateQuantity">
                  <template #append>张</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="板料均价:" prop="platePrice">
                <el-input v-model="form.platePrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="板料合计成本:" prop="plateSumPrice">
                <el-input v-model="form.plateSumPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item title="工序成本" name="3">
          <XTable
            border
            :pageShow="false"
            ref="workTableRef"
            max-height="440px"
            :data="form.craftList"
            :columnList="columnWorkList"
            :footer-method="footerMethod"
            :show-footer="!!form.craftList?.length">
          </XTable>
        </el-collapse-item>

        <el-collapse-item title="固定成本" name="4">
          <el-row>
            <!-- <el-col :span="6" v-for="item in form.fixedPrice">
              <el-form-item :label="`${fixed_cost_type.find((f: any) => f.value == item.type)?.label}:`">
                <el-input v-model="item.price">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6" v-for="item in fixed_cost_type">
              <el-form-item :label="`${item?.label}:`">
                <el-input :model-value="form.fixedPrice?.length ? form.fixedPrice.find((f: any) => f.type == item.value)?.price : ''">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item title="补料成本" name="5">
          <el-row>
            <el-col :span="6">
              <el-form-item label="补料数量:" prop="feedQuantity">
                <el-input v-model="form.feedQuantity">
                  <template #append>PCS</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="补料面积:" prop="feedArea">
                <el-input v-model="form.feedArea">
                  <template #append>㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="补料成本合计:" prop="feedPrice">
                <el-input v-model="form.feedPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item title="品质扣款" name="6">
          <el-row>
            <el-col :span="6">
              <el-form-item label="客户扣款:" prop="cusDeductionPrice">
                <el-input v-model="form.cusDeductionPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商扣款:" prop="supDeductionPrice">
                <el-input v-model="form.supDeductionPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品质扣款合计:" prop="deductionPrice">
                <el-input v-model="form.deductionPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      </el-form>

      <template #footer>
        <div class="global-flex flex-center">
          <el-button style="width: 150px;" @click="cancel">关闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="OrderProfitCost" lang="ts">
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js';
import { deepClone, downloadImg } from '@/utils'
import { getProfiOrderList } from '@/api/financial/orderProfitCost';
import { queryDetailProductionProfit } from '@/api/financial/productionProfitCost';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { fixed_cost_type, order_flow_status } = toRefs<any>(proxy?.useDict("fixed_cost_type","order_flow_status"));

const total = ref(0);
const loading = ref(true);
const showSearch = ref(true);
const buttonLoading = ref(false)
const dialogLoading = ref(false)
const orderProfitList = ref<any[]>([]);

const queryFormRef = ref<ElFormInstance>();
const anyRef = ref<ElFormInstance>();

const dialog = reactive<any>({
  visible: false,
  title: ''
});

const workList = ref([])

const activeNames = ref(['1','2','3','4','5','6'])
const initFormData: any = {
  id: undefined,
  type: undefined,
  price: undefined,
  remark: undefined,
  costMonth: undefined,
  createTime: undefined,
  createByName: undefined,
  fileList: [],
  preFileList: [],
}
const validateZero = (rule: any, value: any, callback: any) => {
  if (value == '') {
    callback(new Error('成本金额不能为空'))
  } else if (Number(value) <= 0) {
    callback(new Error('成本金额不可小于0'))
  }
}
const data = reactive<PageData<any, any>>({
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
    type: [
      { required: true, message: "请选择业务类型", trigger: "change" }
    ],
    price: [
      { required: true, message: "成本金额不能为空", trigger: "blur" },
      { validator: validateZero, trigger: "blur" }
    ],
  }
});

const XTableRef = ref()
// const flowStatusOptions = ref([
//   {value: "1", label: "待处理"},
//   {value: "2", label: "MI制作"},
//   {value: "21", label: "MI制作"},
//   {value: "22", label: "MI制作"},
//   {value: "23", label: "MI制作"},
//   {value: "24", label: "MI制作"},
//   {value: "3", label: "订单预投"},
//   {value: "4", label: "生产投料"},
//   {value: "5", label: "生产中"},
//   {value: "6", label: "已完成"},
//   {value: "7", label: "外协完成"},
//   {value: "8", label: "外协"},
//   {value: "-1", label: "库存发货"},
// ])

const intervalCondition = ['placeOrderTime', 'createTime']
const columnList = ref([
  { title:"序号" , field: 'seq', fixed: 'left', align: 'center', width: '60' },
  { title: '下单时间', field: 'placeOrderTime', width:'130',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束月份', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始月份', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { title: '订单号', field: 'orderCode', width:'130',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单号' } },
  { title: '产品编码', field: 'commodityCode', width:'130',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
  { title: '订单状态', field: 'orderFlowStatusStr', width:'130',align: 'center',
    filterType: 'checkboxButton',
    // filterParam: { placeholder: '请输入订单状态' },
    filterData: () => [...order_flow_status.value],
  },
  { title: '客户代码', field: 'cusCode', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户代码' } },
  // { title: '客户名称', field: 'cusName', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '订单面积(㎡)', field: 'orderArea', width:'100',align: 'center', },
  { title: '订单数量', field: 'orderQuantity', width:'100',align: 'center', },
  { title: '送货数量', field: 'deliveryQuantity', width:'100',align: 'center', },
  { title: '合同差数', field: 'differentQuantity', width:'100',align: 'center', },
  { title: '板料成本(元)', field: 'platePrice', width:'100',align: 'center', },
  { title: '本厂工序成本(元)', field: 'selfCraftPrice', width:'110',align: 'center', },
  { title: '外协加工成本(元)', field: 'outsourceCraftPrice', width:'110',align: 'center', },
  { title: '其他固定成本', field: 'fixedPrice', width: '100', align: 'center', children: [
    // { title: '用水成本(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '用电成本(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '人工成本(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '运费(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '设备折旧费(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '其他(元)', field: 'createTime', width:'100',align: 'center', },
  ] },
  { title: '补料成本', field: 'remediationPrice', width:'100',align: 'center', children: [
    { title: '补料数量(PNL)', field: 'remediationPrice.pnlQuantity', width:'100',align: 'center', },
    { title: '补料面积(㎡)', field: 'remediationPrice.orderArea', width:'100',align: 'center', },
    { title: '补料金额(元)', field: 'remediationPrice.sumPrice', width:'100',align: 'center', },
  ] },
  { title: '品质扣款', field: 'deductionPrice', width:'100',align: 'center', children: [
    { title: '客户扣款(元)', field: 'cusDeductionPrice', width:'100',align: 'center', },
    { title: '供应商扣款(元)', field: 'supDeductionPrice', width:'100',align: 'center', },
  ] },
  { title: '合计成本(元)', field: 'sumPrice', width:'100',fixed: 'right',align: 'center' },
  { title: '毛利润(元)', field: 'orderGrossProfit', width:'100',fixed: 'right',align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '100', fixed: 'right', },
]);
const columnWorkList = ref([
  { title: '工序类型', field: 'craftName', align: 'center', },
  { title: '本厂工序成本(元)', field: 'craftPrice', align: 'center', },
  { title: '外协工序成本(元)', field: 'outCraftPrice', align: 'center', },
])

const { queryParams, form, rules } = toRefs(data);

// 获取 搜索条件
const searchChange = (params: any) => {
  console.log(params)
  queryParams.value = params
  // queryParams.value.costMonth = "2024-06-01"
  getList()
}

// 获取列表数据
const getFormatList = async (isExport?: boolean) => {
  let params = deepClone(queryParams.value)
  if (params?.orderFlowStatusStr) {
    params.flowStatusList = params.orderFlowStatusStr
    delete params.orderFlowStatusStr
  }
  if (isExport) {
    // 去除页码，不算在搜索条件内
    delete params?.pageNum
    delete params?.pageSize
    let hasSearch = false
    for (let key in params) {
      if (Array.isArray(params[key]) && params[key]?.length) {
        params[key].map((m: any) => {
          if (!!m) {
            // 判断是否有值，有值则说明有筛选条件，用于判断数组
            hasSearch = true
          }
        })
      } else if (!!params[key]) {
        // 判断是否有值，有值则说明有筛选条件
        hasSearch = true
      }
    }
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照创建时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
      params.placeOrderTimeStart = dayjs(new Date()).subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
  }
  return getProfiOrderList(params)
}

/** 查询固定成本列表 */
const getList = async () => {
  loading.value = true;
  const res = await getFormatList().finally(() => loading.value = false);
  // console.log(res.rows)
  if (res.rows?.length) {
    // 遍历出导出的序号
    res.rows.map((m: any, mi: number) => {
      m.seq = mi + ((queryParams.value.pageNum - 1) * (queryParams.value.pageSize || 0)) + 1
      m.cusDeductionPrice = Number(m?.cusDeductionPrice || 0) ? '+'+m?.cusDeductionPrice : m?.cusDeductionPrice
      m.supDeductionPrice = Number(m?.supDeductionPrice || 0) ? '-'+m?.supDeductionPrice : m?.supDeductionPrice
    })
  }
  const fixedPriceColumn: any = columnList.value.find((f: any) => f.field == 'fixedPrice')
  fixedPriceColumn.children = []
  fixed_cost_type.value?.length && fixed_cost_type.value.map((m: any, mi: number) => {
    fixedPriceColumn.children.push({
      title: (m.label||'')+'(元)',
      field: `fixedPrice[${mi}].price`,
      align: 'center',
      minWidth: '95',
      // sortable: true
    })
  })

  // if (res.rows?.length && res.rows[0]?.fixedPrice?.length) {
  //   const fixedPriceColumn = columnList.value.find((f: any) => f.field == 'fixedPrice')
  //   fixedPriceColumn.children = []
  //   res.rows[0]?.fixedPrice.map((m: any, mi: number) => {
  //     const crtType = fixed_cost_type.value.find((f: any) => m.type == f.value)
  //     fixedPriceColumn.children.push({
  //       title: crtType?.label,
  //       field: `fixedPrice[${mi}].price`,
  //       align: 'center',
  //       minWidth: '90',
  //       // sortable: true
  //     })
  //   })
  // }

  orderProfitList.value = res.rows || [];
  // orderProfitList.value = [{createTime: '2024-08-05'}];
  total.value = res.total;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  anyRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增成本费用";
}

// 查看详情
const handleDetail = async (row?: any) => {
  reset();
  dialog.visible = true;
  dialog.title = "订单利润详情";
  const _id = row?.saleOrderId
  dialogLoading.value = true
  const res = await queryDetailProductionProfit({saleOrderId:_id}).finally(() => dialogLoading.value = false);
  res.data.cusDeductionPrice = Number(res.data?.cusDeductionPrice || 0) ? '+'+res.data?.cusDeductionPrice : res.data?.cusDeductionPrice
  res.data.supDeductionPrice = Number(res.data?.supDeductionPrice || 0) ? '-'+res.data?.supDeductionPrice : res.data?.supDeductionPrice
  res.data.deductionPrice = Number(res.data?.deductionPrice || 0) && !res.data?.deductionPrice.toString().includes('-') ? '+'+res.data?.deductionPrice : res.data?.deductionPrice
  form.value = res.data
  form.value.orderQuantity = row.orderQuantity
  form.value.deliveryQuantity = row.deliveryQuantity
  form.value.differentQuantity = row.differentQuantity
  form.value.orderSumPrice = row.sumPrice
  form.value.orderGrossProfit = row.orderGrossProfit
}


/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('cost/fixedCost/export', {
    ...queryParams.value
  }, `fixedCost_${new Date().getTime()}.xlsx`)
}
/**
 * 导出数据
 */
const exportData = async () => {
  const $table = XTableRef.value.xTableRef;
  if ($table) {
    // 只能导出1w条数据
    proxy?.$modal.loading('')
    const res = await getFormatList(true).finally(() => proxy?.$modal.closeLoading());
    if (res.rows?.length) {
      // 遍历出导出的序号
      res.rows.map((m: any, mi: number) => {
        m.seq = mi + ((queryParams.value.pageNum - 1) * (queryParams.value.pageSize || 0)) + 1
      })
    }
    let maxData = res.rows || []
    $table.exportData({
      type: 'xlsx',
      data: maxData,
      useStyle: true, //是否导出样式
      sheetName: '订单利润核算',
      filename: '订单利润核算_' + dayjs(new Date()).format("YYYYMMDD"),
      columnFilterMethod ({ column }: any) {
        return !['make'].includes(column.field)
      },
      // 没有效果，已经执行afterExportMethod方法，但是还在导出中
      // beforeExportMethod ({options}: any) {
      //   console.log('beforeExportMethod', options)
      //   proxy?.$modal.loading('')
      // },
      // afterExportMethod ({options}: any) {
      //   console.log('afterExportMethod', options)
      //   proxy?.$modal.closeLoading('')
      // },
    })
  }
}
const sumNum = (list: any[], field: string) => {
  let count: any = 0;
  list.forEach(item => {
    if (item[field] && item[field].toString().includes(":")){
      count = new Decimal(count).add(new Decimal(Number(item[field].substring((item[field].lastIndexOf(":"))+1) || 0)))
    }else {
      count = new Decimal(count).add(new Decimal(Number(item[field] || 0)))
    }
  });
  return Number(count);
};
// 表格尾部合计
const footerMethod = ({ columns, data }: any) => {
  return [
    columns.map((column: any, columnIndex: any) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if(column.field.includes("craftPrice")){
        return `${sumNum(data, column.field)} `;
      }
      if(column.field.includes("outCraftPrice")){
        return `${sumNum(data, column.field)} `;
      }
      return "";
    })
  ];
}

onMounted(() => {
  getList();
});
</script>

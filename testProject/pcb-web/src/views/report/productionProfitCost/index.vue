<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-between">
          <el-col :span="1.5" class="primary-color">
            <el-form :model="queryParams" ref="queryFormRef" label-width="80px"
                 class="demo-form-inline">
                <el-form-item label="结存月份" prop="costMonth" style="margin-bottom: 0;">
                  <el-date-picker class="width-100" :clearable="false" v-model="queryParams.costMonth" type='month' placeholder='请选择结存月份' valueFormat='YYYY-MM' @change="handleQuery"/>
                </el-form-item>
              </el-form>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" :disabled="loading" @click="exportData" v-hasPermi="['report:productionProfitCost:export']">导出</el-button>
          </el-col>
        </el-row>
      </template>

      <XTable
        border
        height="100%"
        ref="XTableRef"
        :loading="loading"
        :showRefresh="true"
        :data="orderProfitList"
        class="xtable-content"
        :columnList="columnList"
        toolId="prodProfitCostTool"
        @searchChange="searchChange"
        :row-config="{ keyField:'id' }"
        :checkbox-config="{reserve: true }"
        :column-config="{ resizable: true }"
        :intervalCondition="intervalCondition"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }">
        <!-- :sort-config="{ multiple: true }" -->
        <!-- <template #header-custMonth>
          <div class="global-flex flex-center">
            <el-tooltip
              effect="dark"
              placement="bottom-start"
              content="指当前排产单的创建月份"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
            &nbsp;<div style="white-space: nowrap;">所属月</div>
          </div>
        </template> -->
        <template #default-make="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
        </template>

        <template #default-selfCraftPrice="scope">
          <el-button link type="primary"
                     :class="{ underline: isUnderline }"
                     @click="handleCraftDetailClick(queryParams.costMonth)">{{ scope.row.selfCraftPrice }}</el-button>
        </template>

        <template #default-platePrice="scope">
          <el-button link type="primary"
                     :class="{ underline: isOutUnderline }"
                     @click="handlePlateDetailClick(queryParams.costMonth)">{{ scope.row.platePrice }}</el-button>
        </template>

        <template #default-outsourceCraftPrice="scope">
          <el-button link type="primary"
                     :class="{ underline: isPlateUnderline }"
                     @click="handleOutSourceDetailClick(queryParams.costMonth)">{{ scope.row.outsourceCraftPrice }}</el-button>
        </template>
      </XTable>
    </el-card>

    <!-- 添加或修改固定成本对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="65%" @close="cancel" destroy-on-close>
      <el-form ref="anyRef" :model="form" :rules="rules" label-width="125px" :disabled="dialog.title.includes('详情')" v-loading="dialogLoading">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-row>
            <el-col :span="6">
              <el-form-item label="所属月:" prop="costMonth">
                <el-input v-model="form.costMonth"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="排产单号:" prop="productionCode">
                <el-input v-model="form.productionCode"></el-input>
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
              <el-form-item label="排产合计成本:" prop="productionSumPrice">
                <!-- <template #label>
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
                </template> -->
                <el-input v-model="form.productionSumPrice">
                  <!-- <template #append>元</template> -->
                </el-input>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="6">
              <el-form-item label="" prop="orderSumPrice">
                <template #label>
                  <div class="global-flex flex-end">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      content="合计成本=板料成本+本厂工序成本+外协加工成本+固定成本+品质扣款"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                    &nbsp;订单合计成本:
                  </div>
                </template>
                <el-input v-model="form.orderSumPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col> -->

            <el-col :span="6">
              <el-form-item label="" prop="orderGrossProfit">
                <template #label>
                  <div class="global-flex flex-end">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      content="排产毛利润=该排产的送货金额-订单合计成本"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                    &nbsp;排产毛利润:
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
              <el-form-item label="板料成本合计:" prop="plateSumPrice">
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

        <el-collapse-item title="品质扣款" name="5">
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

<script setup name="ProductionProfitCost" lang="ts">
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js';
import { deepClone } from '@/utils'
import { getProductionProfiOrderList, queryDetailProductionProfit } from '@/api/financial/productionProfitCost';
const { proxy } = getCurrentInstance() as any;
const { fixed_cost_type, order_flow_status } = toRefs<any>(proxy?.useDict("fixed_cost_type", "order_flow_status"));

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

const activeNames = ref(['1','2','3','4','5'])
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
    costMonth: dayjs(new Date).format('YYYY-MM'),
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

const router = useRouter();
const handleCraftDetailClick = (month : any) => {
  // 使用正确的路由路径或路由对象进行导航
  router.push({ name: 'CostCraftDetail', query: { month: month } });
}
const handlePlateDetailClick = (month : any) => {
  // 使用正确的路由路径或路由对象进行导航
  router.push({ name: 'CostPlateBalance', query: { month: month } });
}
const handleOutSourceDetailClick = (month : any) => {
  // 使用正确的路由路径或路由对象进行导航
  router.push({ name: 'CostOutSourceDetail', query: { month: month } });
}

// 是否显示下划线
const isUnderline = ref(false);
const isOutUnderline = ref(false);
const isPlateUnderline = ref(false);

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

const intervalCondition = ['createTime']
const columnList = ref([
  { title:"序号" , field: 'seq', fixed: 'left', align: 'center', width: '60' },
  { title: '结存月份', field: 'costMonth', width:'130',align: 'center', showHeaderOverflow: false,
    // filterType: 'date', filterParam: { type: 'month', placeholder: '请选择结存月份', valueFormat: 'YYYY-MM' }
  },
  { title: '排产单号', field: 'productionCode', width:'130',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入排产单号' } },
  { title: '订单号', field: 'orderCode', width:'130',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单号' } },
  { title: '产品编码', field: 'commodityCode', width:'130',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
  { title: '合同状态', field: 'orderFlowStatusStr', width:'130',align: 'center',
    filterType: 'checkboxButton',
    // filterParam: { placeholder: '请输入合同状态' },
    filterData: () => [...order_flow_status.value,{label:"库存发货",value:"-1"}],
  },
  { title: '客户代码', field: 'cusCode', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户代码' } },
  // { title: '客户名称', field: 'cusName', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
  { title: '订单面积(㎡)', field: 'orderArea', width:'100',align: 'center', },
  { title: '订单数量', field: 'orderQuantity', width:'100',align: 'center', },
  { title: '送货数量', field: 'deliveryQuantity', width:'100',align: 'center', },
  { title: '合同差数', field: 'differentQuantity', width:'100',align: 'center', },
  { title: '上期在线数量', field: 'lastQuantity', width:'100',align: 'center', },
  { title: '上期在线面积(㎡)', field: 'lastArea', width:'110',align: 'center', },
  { title: '上期板材在线金额(元)', field: 'lastMaterialPrice', width:'130',align: 'center', },
  { title: '上期外协在线金额(元)', field: 'lastOutsourcePrice', width:'130',align: 'center', },
  { title: '本期板材金额(元)', field: 'materialPrice', width:'110',align: 'center', },
  { title: '本期外协金额(元)', field: 'outsourcePrice', width:'110',align: 'center', },
  { title: '在线数量', field: 'onlineQuantity', width:'100',align: 'center', },
  { title: '在线面积(㎡)', field: 'onlineArea', width:'100',align: 'center', },
  { title: '板材在线金额(元)', field: 'plateOnlinePrice', width:'110',align: 'center', },
  { title: '外协在线金额(元)', field: 'outsourceOnlinePrice', width:'110',align: 'center', },
  { title: '完结面积(㎡)', field: 'overArea', width:'100',align: 'center', },
  { title: '板材完结金额(元)', field: 'plateOverPrice', width:'110',align: 'center', },
  { title: '外协完结金额(元)', field: 'outsourceOverPrice', width:'110',align: 'center', },
  { title: '完结总金额(元)', field: 'overSumPrice', width:'100',align: 'center', },
  { title: '板料成本(元)', field: 'platePrice', width:'100',align: 'center', },
  { title: '本厂工序成本(元)', field: 'selfCraftPrice', width:'110',align: 'center', },
  { title: '外协加工成本(元)', field: 'outsourceCraftPrice', width:'110',align: 'center', },
  { title: '其他固定成本', field: 'fixedPrice', width:'100',align: 'center', children: [
    // { title: '用水成本(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '用电成本(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '人工成本(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '运费(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '设备折旧费(元)', field: 'createTime', width:'100',align: 'center', },
    // { title: '其他(元)', field: 'createTime', width:'100',align: 'center', },
  ] },
  { title: '品质扣款', field: 'deductionPrice', width:'100',align: 'center', children: [
    { title: '客户扣款(元)', field: 'cusDeductionPrice', width:'100',align: 'center', },
    { title: '供应商扣款(元)', field: 'supDeductionPrice', width:'100',align: 'center', },
  ] },
  { title: '排产合计成本(元)', field: 'sumPrice', width:'130',fixed: 'right',align: 'center' },
  { title: '排产毛利润(元)', field: 'orderGrossProfit', width:'110',fixed: 'right',align: 'center' },
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
  let costMonth = queryParams.value.costMonth
  queryParams.value = params
  queryParams.value.costMonth = costMonth
  getList()
}
/** 表单重置 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery()
}

// 获取列表数据
const getFormatList = async (isExport?: boolean) => {
  let params = deepClone(queryParams.value)
  if (params?.orderFlowStatusStr) {
    params.flowStatusList = params.orderFlowStatusStr
    delete params.orderFlowStatusStr
  }
  if (params.sorts?.length) {
    let isAsc = params.sorts.map((m: any) => m.order).join(',')
    let orderByColumn = params.sorts.map((m: any) => m.prop).join(',')
    params.isAsc = isAsc
    params.orderByColumn = orderByColumn
    delete params.sorts
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
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认导出当前结存月份的数据(最大1w条)', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
      // params.costMonthStart = dayjs(new Date()).subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss')
      // 需要限制最大1w条
      params.pageNum = 1
      params.pageSize = 10000
    }
  }
  return getProductionProfiOrderList(params)
}

/** 查询固定成本列表 */
const getList = async () => {
  // 没有筛选条件，默认一个月
  loading.value = true;
  const res = await getFormatList().finally(() => loading.value = false);
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

  orderProfitList.value = res.rows;
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

// 查看详情
const handleDetail = async (row?: any) => {
  reset();
  dialog.visible = true;
  dialog.title = "排产利润详情";
  const _id = row?.saleOrderId
  dialogLoading.value = true
  const res = await queryDetailProductionProfit({productionId: row?.productionId, saleOrderId: _id,costMonth: row?.costMonth}).finally(() => dialogLoading.value = false);
  res.data.cusDeductionPrice = Number(res.data?.cusDeductionPrice || 0) ? '+'+res.data?.cusDeductionPrice : res.data?.cusDeductionPrice
  res.data.supDeductionPrice = Number(res.data?.supDeductionPrice || 0) ? '-'+res.data?.supDeductionPrice : res.data?.supDeductionPrice
  res.data.deductionPrice = Number(res.data?.deductionPrice || 0) && !res.data?.deductionPrice.toString().includes('-') ? '+'+res.data?.deductionPrice : res.data?.deductionPrice
  form.value = res.data
  form.value.orderQuantity = row.orderQuantity
  form.value.deliveryQuantity = row.deliveryQuantity
  form.value.differentQuantity = row.differentQuantity
  form.value.productionSumPrice = row.sumPrice
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
      sheetName: '排产利润核算',
      filename: '排产利润核算_' + dayjs(new Date()).format("YYYYMMDD"),
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

<style scoped>
.underline {
  text-decoration: underline;
}
</style>

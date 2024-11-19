<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-model="type" type="border-card" @tab-click="handleClick" class="xtable-tab">
        <el-tab-pane label="可入库列表" :name="0">
          <XTable toolId="productionInOut" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  v-loading="loading"
                  :data="inOutList"
                  :columnList="columnList"
                  border :showRefresh="true"
                  height="100%" class="xtable-content"
                  :intervalCondition="['createTime']"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  ref="xTableRef"
          >
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdate(scope.row)">确认入库</el-button>
              <el-button link type="primary" @click="getRecords(scope.row)">入库记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="入库记录" :name="1">
          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <div class="totalTitle">入库数量：{{sumData.quantity}}pcs &nbsp;&nbsp;|&nbsp;&nbsp;入库面积：{{sumData.area}}㎡ &nbsp;&nbsp;|&nbsp;&nbsp;报废数量：{{sumData.scrapNum}}pcs</div>
          </div>
          <XTable toolId="productionInOutHistory" v-model:page-size="queryHistoryParams.pageSize"
                  v-model:current-page="queryHistoryParams.pageNum"
                  v-loading="loading"
                  :page-params="{ perfect: true, total: historyTotal }"
                  :data="inOutHistoryList"
                  :columnList="columnHistoryList"
                  border :showRefresh="true"
                  height="100%" class="xtable-content"
                  :intervalCondition="['intOutTime']"
                  @searchChange="searchHistoryChange"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  ref="xTableRef2"
          >
            <template #default-type="scope">
              <span v-if="scope.row.type==3">生产入库</span>
              <span v-if="scope.row.type==4">订单出库</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--确认入库-->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="60%"
               :close-on-click-modal="false"
               v-loading="isLoading">
      <div>
        <h3 style="text-align:center;">
          <span style="padding-right:20px;">需入库pcs数:{{getNeedQuantity()}}</span>
          <span>余量: {{getRemainQuantity()}}</span>
        </h3>
        <div style="text-align: center">

        </div>
        <div class="orderLi" style="overflow:hidden;">
          <el-divider content-position="left">按订单入库</el-divider>
          <XTable :showHead="false" :pageShow="false" :columnList="columnListConfirmEntry" :data="currentInfo.saleOrderVoList"
                    size="small" border v-loading="dialogTableLoading"
                    style="width: 100%; margin-top:20px;">
              <template #default-quantity="{row,$index}">
                <el-input-number :precision="0" @blur="numberChange(row.quantity,currentInfo.saleOrderVoList[$index])"
                                 v-model.number="row.quantity" :min="0"/>
              </template>
              <template #default-storageCuang="scope">
                成品仓
              </template>
          </XTable>
        </div>
      </div>
      <div style="float: right;color: red;padding-top: 20px">提示：入库数量如果填错可删除入库记录重新入库</div>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!--入库记录-->
    <el-dialog :title="dialogHistory.title" v-model="dialogHistory.visible" width="80%"
               :close-on-click-modal="false"
               v-loading="isLoading">
      <XTable :showHead="false" :pageShow="false" :columnList="columnListStorageRecord" :data="inRecordList"
                v-loading="dialogTableLoading"
                style="width: 100%; margin-top:20px;">
          <template #default-make="scope">
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
          </template>
      </XTable>
    </el-dialog>

    <!-- 库存锁定提示框 -->
    <InventoryLock title="产品盘点提示" inventoryType="1" v-model:show="inventoryCheck" :data="inventoryRes" @close="inventoryCheck = false"/>
  </div>
</template>

<script setup name="ProductionStorage" lang="ts">
  import {
    listCanStorageCard,
    listCard,
    getInInventoryDetails, saveCommodityInOutRecord, getInRecordList, delInRecords, getInOutList, getInOutSum
  } from '@/api/production/card';
  import {CardVO, CardQuery, CardForm} from '@/api/production/card/types';
  import {deepClone} from "@/utils";
  import {ref} from "vue";
  import {listCommodityInventory} from "@/api/order/commodity";
  import { decryptBase64ByStr } from '@/utils/crypto'

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const inOutList = ref<CardVO[]>([]);
  const inOutHistoryList = ref<CardVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const historyTotal = ref(0);
  const dialogTableLoading = ref(false)

  const sumData =ref({
    quantity:0,
    area:0,
    scrapNum:0
  })
  const xTableRef = ref();
  const xTableRef2 = ref();
  const route = useRoute();
  /**
   * 进入页面次数
   */
  const isFirst = ref(0)
  /**
   * 待办跳转参数
   */
  const pendingParams = ref()
  const getRemainQuantity = () => {
    const sum = currentInfo.value.saleOrderVoList.reduce((total, current) => total + current.quantity, 0);
    const result = getNeedQuantity() - sum;
    return result;
  }

  const getNeedQuantity = () => {
    const result = currentInfo.value.saleOrderVoList.reduce((total, current) => total + current.canInInventoryQuantity, 0);
    return result;
  }

  const numberChange = (value: any, data: any) => {
    if (value == undefined || value == null || value == '') {
      data.quantity = 0
    }
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const dialogHistory = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: '',
    direction: "rtl"
  });

  const initFormData: CardForm = {
    id: undefined,
    productionId: undefined,
    ownerId: undefined,
    bundleCode: undefined,
    bundleCount: undefined,
    parentId: undefined,
    code: undefined,
    bundlePnlQuantity: undefined,
    quantityPerCard: undefined,
    pnlId: undefined
  }
  const data = reactive<PageData<CardForm, CardQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      isAsc: "desc",
      orderByColumn: "create_time",
      productionId: undefined,
      ownerId: undefined,
      bundleCode: undefined,
      bundleCount: undefined,
      parentId: undefined,
      code: undefined,
      bundlePnlQuantity: undefined,
      quantityPerCard: undefined,
      pnlId: undefined,
      params: {}
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      productionId: [
        {required: true, message: "排产单ID不能为空", trigger: "blur"}
      ],
      ownerId: [
        {required: true, message: "单位ID不能为空", trigger: "blur"}
      ],
      bundleCode: [
        {required: true, message: "扎号不能为空", trigger: "blur"}
      ],
      bundleCount: [
        {required: true, message: "排产总扎数不能为空", trigger: "blur"}
      ],
      parentId: [
        {required: true, message: "父卡ID不能为空", trigger: "blur"}
      ],
      code: [
        {required: true, message: "流转卡卡号不能为空", trigger: "blur"}
      ],
      bundlePnlQuantity: [
        {required: true, message: "本卡PNL数量不能为空", trigger: "blur"}
      ],
      quantityPerCard: [
        {required: true, message: "每张卡配置的PNL数量不能为空", trigger: "blur"}
      ],
      pnlId: [
        {required: true, message: "工艺pnlId不能为空", trigger: "blur"}
      ]
    }
  });

  const queryHistoryParams = ref({
    pageNum: 1,
    pageSize: 20,
    productionId: undefined,
    ownerId: undefined,
    bundleCode: undefined,
    bundleCount: undefined,
    parentId: undefined,
    code: undefined,
    bundlePnlQuantity: undefined,
    quantityPerCard: undefined,
    pnlId: undefined,
    params: {}
  });
  const columnListConfirmEntry = ref([
  { width: '120',title: '销售订单',field: 'orderCode',align: 'center',  },
  { width: '100',title: '订单安排生产',field: 'orderQuantity',align: 'center',  },
  { width: '120',title: '已入库总pcs数量',field: 'alreadySumPcsQuantity',align: 'center',  },
  { width: '145',title: '流转卡已入库pcs数量',field: 'alreadyCardPcsQuantity',align: 'center',  },
  { width: '130',title: '下单时间',field: 'placeOrderTime',align: 'center',  },
  { width: '130',title: '交期',field: 'deliveryTime',align: 'center',  },
  { width: '110',title: '可入库pcs数量',field: 'canInInventoryQuantity',align: 'center',  },
  { width: '160',title: '入库数',field: 'quantity',align: 'center',  },
  { width: '90',title: '库位',field: 'storageCuang',align: 'center',  },
  ]);
  const columnListStorageRecord = ref([
  { width: '150',title: '流转卡号',field: 'code',align: 'center',  },
  { width: '150',title: '排产单号',field: 'productionVo.code',align: 'center',  },
  { width: '150',title: '客户编码',field: 'customerCode',align: 'center',  },
  { width: '150',title: '产品编码',field: 'commodityCode',align: 'center',  },
  { width: '150',title: '产品名称',field: 'commodityName',align: 'center',  },
  { width: '150',title: 'SET数量',field: 'bundleSetQuantity',align: 'center',  },
  { width: '150',title: 'PCS数量',field: 'bundlePcsQuantity',align: 'center',  },
  { width: '150',title: '报废PCS数量',field: 'scrapPcsQuantity',align: 'center',  },
  { width: '150',title: '入库PCS数量',field: 'completedQuantity',align: 'center',  },
  { width: '150',title: '生产人员',field: 'productionUserName',align: 'center',  },
  { width: '150',title: '生产时间',field: 'productionTime',align: 'center',  },
  { width: '100',title: '操作',field: 'make',align: 'center',  },
  ]);
  const columnList = ref([

    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '流转卡号',
      field: 'code',
      width: '120',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入流转卡号'}
    },
    {
      title: '排产单号',
      field: 'productionCode',
      width: '100',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      width: "120",
      title: '排产时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      }
    },
    {
      width: "120",
      title: '客户编码',
      field: 'customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: "150",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: "120",
      title: '生产SET数量',
      field: 'bundleSetQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '生产PCS数量',
      field: 'bundlePcsQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '报废pcs数量',
      field: 'scrapPcsQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '可入库pcs数量',
      field: 'canInInventoryQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '当前工序',
      field: 'currentCraftName',
      align: 'center',
    },
    {
      width: "120",
      title: '接单时间',
      field: 'startTime',
      align: 'center',
    },

    {title: '操作', field: 'make', showOverflow: false, align: 'center', width: '150', fixed: 'right',},
  ]);

  const typeOptions = ref([
  { value: "3", label: "生产入库" },
  { value: "4", label: "订单出库" },
])
  const columnHistoryList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '操作类型',
      field: 'type',
      width: '120',
      fixed: "left",
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
      placeholder: '请选择操作类型',
      },
      filterData: () => typeOptions.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      title: '流转卡号',
      field: 'cardCode',
      width: '120',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入流转卡号'}
    },
    {
      title: '排产单号',
      field: 'productionCode',
      width: '100',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      width: "120",
      title: '客户编码',
      field: 'customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: "150",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: "120",
      title: '生产SET数量',
      field: 'bundleSetQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '生产PCS数量',
      field: 'bundlePcsQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '报废pcs数量',
      field: 'scrapPcsQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '本次入库pcs数',
      field: 'quantity',
      align: 'center',
    },
    {
      width: "120",
      title: '操作人员',
      field: 'createByName',
      align: 'center',
    },
    {
      width: "120",
      title: '操作时间',
      field: 'intOutTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      }
    },
    {title: '操作', field: 'make', showOverflow: false, align: 'center', width: '70', fixed: 'right',},
  ]);

  const {queryParams, form, rules} = toRefs(data);

  // 获取 搜索条件
  const searchChange = (params: any) => {
    console.log(params);
    queryParams.value = params;
     Object.keys(params).forEach(key => {
      if(key=='productionVo.code'){
          //排产单号
          queryParams.value['productionCode'] = params[key];
      }
    });
    queryParams.value.isAsc = "desc";
    queryParams.value.orderByColumn = "create_time";
    getList()
  }

  const searchHistoryChange = (params: any) => {
    queryHistoryParams.value = params;
    getHistoryList()
  }

  const type = ref(0);

  const handleClick = (pane: any, ev: any) => {
    if (pane.index == 0) {
      type.value = 0;
      getList();
    } else {
      type.value = 1;
      getHistoryList();
    }
  }

  /** 查询可入库流转卡列表 */
  const getList = async () => {
    loading.value = true;
    const res = await listCanStorageCard(queryParams.value);
    inOutList.value = res.rows;
    // dealData(inOutList.value);
    total.value = res.total;
    loading.value = false;
  }

  const getSum = async () =>{
    const resSum:any = await getInOutSum(queryHistoryParams.value);
    sumData.value = resSum.data;
  }

  /** 查询出入库记录列表 */
  const getHistoryList = async () => {
    loading.value = true;
    const res = await getInOutList(queryHistoryParams.value);
    inOutHistoryList.value = res.rows;
    historyTotal.value = res.total;
    loading.value = false;
    getSum();
  }

  const dealData = async (rows: any[]) => {
    rows.forEach(item => {
      item.customerCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.customerCode
      }).join("/") : item.saleOrderVoList[0].commodityCode;
      item.commodityCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.commodityCode
      }).join("/") : item.saleOrderVoList[0].commodityCode;
      item.commodityName = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.commodityName
      }).join("/") : item.saleOrderVoList[0].commodityName;
      item.customerCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.customerCode
      }).join("/") : item.saleOrderVoList[0].customerCode;
    })
  }

  const inventoryCheck = ref(false);
  const inventoryRes = ref<any[]>([]);

  /** 提交按钮 */
  const submitForm = async () => {
    // 查询是否存在盘点中产品
    let ids = currentInfo.value.saleOrderVoList.map(item => item.commodityId);
    let query = {
      pageNum: 1,
      pageSize: 20,
      IdList: ids,
      status: '1'
    }
    const res = await listCommodityInventory(query);
    if (res.rows && res.rows.length > 0) {
      inventoryRes.value = res.rows;
      inventoryCheck.value = true;
      return;
    }

    const b:boolean =  currentInfo.value.saleOrderVoList.some(item=>{
      return item.quantity > item.canInInventoryQuantity && item.quantity > 0;
    })
    if(b){
      ElMessage.error("入库数量不能大于生产提交数量");
      return;
    }
    const b1:boolean =  currentInfo.value.saleOrderVoList.some(item=>{
      return item.canInInventoryQuantity <= 0 && item.quantity > 0;
    })
    if(b1){
      ElMessage.error("可入库数量小于或等于0");
      return;
    }
    // const b2:boolean =  currentInfo.value.saleOrderVoList.some(item=> item.quantity <= 0)
    // if(b2){
    //   ElMessage.error("入库数小于或等于0");
    //   return;
    // }
    let list = currentInfo.value.saleOrderVoList.filter((v: any) => v.quantity > 0)
    if (!list.length) {
      ElMessage.error("入库数小于或等于0");
      return
    }

    // console.log('入库成功', currentInfo.value.saleOrderVoList)
    buttonLoading.value = true;
    await saveCommodityInOutRecord(list).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("入库成功");
    dialog.visible = false;
    await getList();
  }

  /** 取消按钮 */
  const cancel = () => {
    dialog.visible = false;
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  }

  const inRecordList = ref();

  /** 确认入库操作 */
  const handleUpdate = async (row?: any) => {
    currentInfo.value = deepClone(row);
    console.log(row)
    let ids = row.orderIds.split("/");
    const param = {
      bizId: row.id,
      saleOrderIdList: ids,
      type: '3',//生产入库
    }
    dialog.visible = true;
    dialog.title = "入库";
    dialogTableLoading.value = true
    const res = await getInInventoryDetails(param);
    currentInfo.value.saleOrderVoList = res.data;
    currentInfo.value.saleOrderVoList.forEach(item=>{
      item.quantity = item.canInInventoryQuantity
    })
    dialogTableLoading.value = false
  }

  /*删除入库记录*/
  const handleDelete = async (row: any) => {
    await proxy?.$modal.confirm('您确定要删除该生产入库记录').finally(() => loading.value = false);
    const data = {
      idList:[row.id]
    }
    proxy?.$modal.loading('加载中...')
    await delInRecords(data).finally(() => proxy?.$modal.closeLoading());
    dialogHistory.visible = false;
    proxy?.$modal.msgSuccess("删除成功");
    if(type.value == 0){
      getList();
    }else {
      getHistoryList();
    }
  }

  const getRecords = async (row: any) => {
    const data = {
      type: '3',
      bizId: row.id
    }
    dialogHistory.visible = true;
    dialogHistory.title = "入库记录";
    dialogTableLoading.value = true
    const res = await getInRecordList(data);
    inRecordList.value = res.data;
    dealData(inRecordList.value);
    dialogTableLoading.value = false
  }

  let currentInfo = ref();


  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('production/card/export', {
      ...queryParams.value
    }, `card_${new Date().getTime()}.xlsx`)
  }
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = decryptBase64ByStr(newVal)
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      let tab = !isNaN(Number(params.tab)) ? Number(params.tab) : 0;
      type.value = tab
      let tempColumnList = [{field: 'productionCode', defaultValue: params.bizNo}]
      if (tab === 0) {
        queryParams.value.code = params.bizNo
        setTimeout(() => {
          xTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === 1) {
        queryHistoryParams.value.code = params.bizNo;
        setTimeout(() => {
          xTableRef2.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
    getList();
});
</script>

<style>
  .flex_column_display {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .totalTitle{
    padding: 0px !important;
    margin: 0px;
    line-height: 24px !important;
    display: flex !important;
    justify-content: end !important;
    font-size: 14px !important;
    color: #0892c7 !important;
    font-weight: bold;
    margin-right: 10px;
  }
</style>

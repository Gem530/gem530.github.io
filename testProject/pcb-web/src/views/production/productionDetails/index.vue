<template>
  <div class="p-2 xtable-page">
    <div class="p-2">
        <el-radio-group v-model="queryParams.isRemediation" @change="getList">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="0">正常投料</el-radio-button>
          <el-radio-button label="1">补料</el-radio-button>
        </el-radio-group>
      <el-button style="float:right;" plain @click="handleExport">导出 </el-button>
      <div style="float:right;" class="totalTitle">排产数量：{{sumData.productionNum}}&nbsp;&nbsp;|&nbsp;&nbsp; 净面积：{{sumData.sumSetArea}}㎡</div>
      </div>


    <el-card shadow="never" class="xtable-card">
          <XTable toolId="productionDetails" v-model:page-size="queryParams.pageSize" height="100%"
                  class="xtable-content"
                  :loading="loading"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="productionList"
                  :columnList="columnList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  :isAutoHeight="true"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :row-style="setRowStyle"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :sort-config="{remote: true}"
                  :intervalCondition="recordCondition"
          >
<!--            <template #default-productionStatus="scope">-->
<!--              <el-tag :type="statusOptions.find(vo => vo.value == scope.row.productionStatus)?.type">{{statusOptions.find(vo => vo.value == scope.row.productionStatus)?.label}}</el-tag>-->
<!--            </template>-->

            <template #default-isRemediation="scope">
              <el-tag v-if="scope.row.isRemediation == '是'" type="danger">{{scope.row.isRemediation}}</el-tag>
              <el-tag v-else type="success">{{ scope.row.isRemediation}}</el-tag>
            </template>

            <template #default-planCode="scope">
                <el-button :text="true" type='primary' @click="doMIPrint(scope.row, 'noOutsideImages')">{{scope.row.planCode}}</el-button>
            </template>
            <template #default-scrapRate="scope">
              <el-popover placement="right" :width="400" trigger="click">
                <template #reference>
                  <el-button link type='primary'>{{scope.row.scrapRate}}</el-button>
                </template>
                <XTable :showHead="false" :pageShow="false" :columnList="columnListScrapRate" :data="scope.row.saleOrderVoList">
                </XTable>
              </el-popover>
            </template>

            <template #default-commodityName="scope">
              <el-popover :width="750" trigger="click">
                <template #reference>
                  <el-button link type='primary'>{{scope.row.commodityName}}</el-button>
                </template>
                <XTable :showHead="false" :pageShow="false" :columnList="columnListProductName" :data="scope.row.saleOrderVoList">
                  <template #default-unit="scope">
                    pcs
                  </template>
                  <template #default-make="scope">
                      <el-button link type="primary" icon="Edit"  @click="openOrderDetail(scope.row)" >详情</el-button>
                  </template>
                </XTable>
              </el-popover>
            </template>
            <template #default-saleOrderId="scope">
              <el-popover placement="right" :width="500" trigger="click">
                <template #reference>
                  <el-button link type='primary'>查看</el-button>
                </template>
                <XTable :showHead="false" :pageShow="false" :columnList="columnListSaleOrderId" :data="scope.row.saleOrderVoList">
                </XTable>
              </el-popover>
            </template>
            <template #default-pnlFeedId="scope">
              <el-popover placement="right" :width="450" trigger="click">
                <template #reference>
                  <el-button link type='primary'>查看</el-button>
                </template>
                <XTable :showHead="false" :pageShow="false" :columnList="columnListPnlFeedId" :data="scope.row.pnlBoList">
                </XTable>
              </el-popover>
            </template>
            <template #default-status="scope">
              {{scope.row.productionIdList.length>0 ? '已投料':'未投料'}}
            </template>
          </XTable>
    </el-card>

    <!--详情预览-->
    <el-drawer
      v-model="orderDrawer.visible"
      :title="orderDrawer.title"
      :direction="orderDrawer.direction"
      :destroy-on-close="true"
      size="45%"
      :modal-class="`add-prod-drawder ${ownerId == '101' && 'normal-prod-drawder'}`"
    >
      <template #header>
        <span class="el-drawer__title no-wrap">{{orderDrawer.title}}</span>
        <TotalTitle :start="true" :firstBorder="true" :list="[
          { title: `总价：${ currentVo?.totalOrderPrice||0 }元` },
          { title: `税金：${ currentVo?.tax||0 }元` },
          { title: `总金额：${ currentVo?.totalPrice||0 }元` },
        ]"></TotalTitle>
      </template>
      <SaleDescriptions v-if="currentVo" :currentInfo="currentVo" :isShow="false"></SaleDescriptions>
    </el-drawer>

    <MIPrint ref="MIPrintRef"></MIPrint>

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
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="ProductionDetails" lang="ts">
  import {
    getProductionSum,
    listProductionDetails,
  } from '@/api/production/production';
  import {ProductionVO, ProductionQuery, ProductionForm} from '@/api/production/production/types';
  import { ref} from "vue";
  import dayjs from "dayjs";
  import {deepClone} from "@/utils";
  import useUserStore from '@/store/modules/user';

  const { ownerId } = useUserStore();

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const productionList = ref<ProductionVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);

  const queryFormRef = ref<ElFormInstance>();

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const initFormData: ProductionForm = {
    id: undefined,
    ownerId: undefined,
    planStartTime: undefined,
    planCompleteTime: undefined,
    startTime: undefined,
    completeTime: undefined,
    completeQuantity: undefined,
    confirmUserId: undefined,
    confirmUserName: undefined,
    productionStatus: undefined,
    planId: undefined,
    isPause: undefined,
    code: undefined,
    isComplete: undefined,
    area: undefined,
    isRemediation: undefined,
    remediationProductionId: undefined,
    isMerge: undefined
  }

  const initQueryParam = {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "create_time",
    ownerId: undefined,
  }

  const data = reactive<PageData<ProductionForm, ProductionQuery>>({
    form: {...initFormData},
    queryParams: {
      ...initQueryParam
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      ownerId: [
        {required: true, message: "单位ID不能为空", trigger: "blur"}
      ],
      planStartTime: [
        {required: true, message: "计划开始时间不能为空", trigger: "blur"}
      ],
      planCompleteTime: [
        {required: true, message: "计划完成时间不能为空", trigger: "blur"}
      ],
      startTime: [
        {required: true, message: "开始时间不能为空", trigger: "blur"}
      ],
      completeTime: [
        {required: true, message: "完成时间不能为空", trigger: "blur"}
      ],
      completeQuantity: [
        {required: true, message: "完成数量不能为空", trigger: "blur"}
      ],
      confirmUserId: [
        {required: true, message: "确认人ID不能为空", trigger: "blur"}
      ],
      confirmUserName: [
        {required: true, message: "确认人名字不能为空", trigger: "blur"}
      ],
      productionStatus: [
        {required: true, message: "排产状态(10=待开始，20=进行中，30=完成，40=暂停)不能为空", trigger: "change"}
      ],
      planId: [
        {required: true, message: "MI工艺单ID不能为空", trigger: "blur"}
      ],
      isPause: [
        {required: true, message: "是否暂停(默认为否)不能为空", trigger: "blur"}
      ],
      code: [
        {required: true, message: "排产单编码不能为空", trigger: "blur"}
      ],
      isComplete: [
        {required: true, message: "是否已完成不能为空", trigger: "blur"}
      ],
      area: [
        {required: true, message: "排产净面积不能为空", trigger: "blur"}
      ],
      isRemediation: [
        {required: true, message: "是否补料不能为空", trigger: "blur"}
      ],
      remediationProductionId: [
        {required: true, message: "补料关联的排产单ID不能为空", trigger: "blur"}
      ],
      isMerge: [
        {required: true, message: "是否尾扎合并不能为空", trigger: "blur"}
      ]
    }
  });

  const sumData =ref({
    cardNum:0,
    productionNum:0,
    sumSetArea:0
  })

  const statusOptions = ref([
    {label: '待开始', value: "10",type:"warning"},
    // {label: '驳回', value: "11",type:"danger"},
    {label: '进行中', value: "20",type:"success"},
    {label: '完成', value: "30",type:"warning"},
    // {label: '暂停', value: "40"},
  ]);

  const remediation = ref([
    {label: '否', value: "0"},
    {label: '是', value: "1"},
  ]);
  const columnListScrapRate = ref([
  { width: '120',title: '产品编码',field: 'commodityCode',align: 'center',  },
  { width: '120',title: '产品名称',field: 'commodityName',align: 'center',  },
  { width: '120',title: '排产数量',field: 'productionQuantity',align: 'center',  },
  { width: '120',title: '报废数量',field: 'scrapQuantity',align: 'center',  },
  { width: '120',title: '报废率(%)',field: 'scrapRate',align: 'center',  },
  ]);
  const columnListProductName = ref([
  { width: '120',title: '产品编码',field: 'commodityCode',align: 'center',  },
  { width: '120',title: '产品名称',field: 'commodityName',align: 'center',  },
  { width: '120',title: '客户编码',field: 'customerCode',align: 'center',  },
  { width: '100',title: '版本号',field: 'version',align: 'center',  },
  { width: '100',title: '板材',field: 'materialQuality',align: 'center',  },
  { width: '100',title: '单位',field: 'unit',align: 'center',  },
  { minWidth: '60',title: '操作',field: 'make',align: 'center',  },
  ]);
  const columnListSaleOrderId = ref([
  { width: '100',title: '订单编号',field: 'code',align: 'center',  },
  { width: '100',title: '客户编码',field: 'customerCode',align: 'center',  },
  { width: '130',title: '客户交期',field: 'deliveryTime',align: 'center',  },
  { width: '130',title: '最迟发货',field: 'dispatchTime',align: 'center',  },
  ]);
  const columnListPnlFeedId = ref([
  { width: '100',title: 'Pnl',field: 'name',align: 'center',  },
  { width: '100',title: '计划投料',field: 'preFeedQuantity',align: 'center',  },
  { width: '100',title: '已投数量',field: 'feedQuantity',align: 'center',  },
  { width: '100',title: '已投面积',field: 'feedArea',align: 'center',  },
  ]);

  const XTableRef = ref()
  const recordCondition = ['createTime'];
  const columnList = ref([
    {title: "序号", type: 'seq',field:"index", align: 'center', width: '60'},
    // {
    //   title: '状态',
    //   field: 'productionStatus',
    //   width: '80',
    //   align: 'center',
    //   filterType: 'radioButton',
    //   filterParam: {
    //     placeholder: '请选择状态',
    //   },
    //   filterData: () => statusOptions.value,
    //   filterCustom: {label: 'label', value: 'value'}
    // },
    {
      width: "120",
      title: '排产单号',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      title: '是否补料',
      field: 'isRemediation',
      width: '80',
      align: 'center',
      filterType: 'radioButton',
      filterData: () => remediation.value
    },
    {
      width: "120",
      title: 'MI单号',
      field: 'planCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI单号'}
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
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: "120",
      title: '客户编码',
      field: 'customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {width: "120", title: '大料总孔数', field: 'schemeHoleNumber', align: 'center'},
    {width: "120", title: 'MI开料板厚', field: 'copperThickness', align: 'center'},
    {width: "120", title: '当前工序', field: 'currentCraftName', align: 'center'},
    {width: "120", title: '生产面积(㎡)', field: 'setArea', align: 'center'},
    {width: "120", title: '排产数量(pcs)', field: 'productionNum', align: 'center'},
    {width: "120", title: '生产面积(PNL)', field: 'area', align: 'center'},
    {width: "120", title: 'PNLA数量', field: 'pnlANum', align: 'center'},
    {width: "120", title: 'PNLA长', field: 'pnlALength', align: 'center'},
    {width: "120", title: 'PNLA宽', field: 'pnlAWidth', align: 'center'},
    {width: "120", title: 'PNLB数量', field: 'pnlBNum', align: 'center'},
    {width: "120", title: 'PNLB长', field: 'pnlBLength', align: 'center'},
    {width: "120", title: 'PNLB宽', field: 'pnlBWidth', align: 'center'},
    {width: "120", title: '完成数量(pcs)', field: 'completeNum', align: 'center'},
    {width: "120", title: '报废率(%)', field: 'scrapRate', align: 'center'},
    {width: "120", title: '合同编号', field: 'orderCode', align: 'center'},
    {width: "120", title: '层数', field: 'materialLayer', align: 'center'},
    {width: "120", title: '表面处理', field: 'surfaceTreatment', align: 'center'},
    {width: "120", title: '订单数量', field: 'orderQuantity', align: 'center'},
    {width: "120", title: '订单面积', field: 'orderArea', align: 'center'},
    {width: "120", title: '大料张数', field: 'schemeFeedQuantity', align: 'center'},
    {width: "120", title: 'SET长', field: 'unitedLength', align: 'center'},
    {width: "120", title: 'SET宽', field: 'unitedWidth', align: 'center'},
    {width: "120", title: 'PCS/SET', field: 'unitedNumber', align: 'center'},
    {
      width: "120",
      title: '预计开始时间',
      field: 'planStartTime',
      align: 'center',
      // filterType: 'intervalDate', filterParam: {
      //   startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      //   endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      // }
    },
    {
      width: "120",
      title: '预计完成时间',
      field: 'planCompleteTime',
      align: 'center',
      // filterType: 'intervalDate', filterParam: {
      //   startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      //   endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      // }
    },
    {
      width: "120",
      title: '实际开始时间',
      field: 'startTime',
      align: 'center',
    },
    {
      width: "120",
      title: '实际完成时间',
      field: 'completeTime',
      align: 'center',
    },
    {
      width: "120",
      title: '创建时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
  ]);

  const {queryParams, form, rules} = toRefs(data);

  const currentVo = ref();

  const orderDrawer = reactive<DrawerOption>({
    title: '订单详情',
    visible: false,
    direction: "rtl"
  });

  const openOrderDetail =(row:any)=>{
    currentVo.value = row;
    orderDrawer.visible = true;
    orderDrawer.title = row.code;
  }

  const MIPrintRef = ref();


  const doMIPrint = async (data: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(data.planId, type);
  }

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = deepClone(initQueryParam);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.value[key] = params[key];
      }
    });
    getList()
  }

  /** 查询生产-排产单列表 */
  const getList = async () => {
    loading.value = true;
    const res = await listProductionDetails(queryParams.value);
    productionList.value = res.rows;
    total.value = res.total;
    loading.value = false;
    const resSum = await getProductionSum(queryParams.value);
    sumData.value = resSum.data;

  }


  const exportVisible = ref(false);

  /** 导出按钮操作 */
  const handleExport = () => {
    if (!queryParams.value.createTimeStart) {
      exportVisible.value = true;
    }else {
      exportExcel();
    }

  }

  const exportExcel = ()=>{
    if(!queryParams.value.createTimeStart && !queryParams.value.createTimeEnd){
      queryParams.value.createTimeStart = dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00");
      queryParams.value.createTimeEnd = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
    }
    exportVisible.value = false;
    proxy?.download('production/production/exportProductionDetails', {
      ...queryParams.value, tableName: 'productionDetails'
    }, `排产单查询_${new Date().getTime()}.xlsx`);
  }

  onMounted(() => {
    getList();
  });
</script>

<style scoped>
  .el-dropdown-menu__item {
    font-size: 14px; /* 适当调整字体大小 */
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

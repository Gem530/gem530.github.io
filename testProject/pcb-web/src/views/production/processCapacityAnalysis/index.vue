<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" label-width="70px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="开始时间" prop="supplierCode">
                <el-date-picker size="small"
                                v-model="queryParams.startTime"
                                type="datetime"
                                style="width: 100%;"
                                :clearable = "false"
                                placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>

              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="结束时间" prop="supplierName">
                <el-date-picker size="small"
                                v-model="queryParams.endTime"
                                type="datetime"
                                style="width: 100%;"
                                :clearable = "false"
                                placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="产品编码" prop="companyManager">
                <el-input v-model="queryParams.commodityCode" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="产品名称" prop="companyManagerPhone">
                <el-input v-model="queryParams.commodityName" clearable
                          @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="客户编码" prop="customerCode">
                <el-input v-model="queryParams.customerCode" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="排产单号" prop="productionCode">
                <el-input v-model="queryParams.productionCode" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <div style="margin-left: 20px;"></div>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </transition>

    <div style="display: flex;flex:1;overflow: hidden;">
      <div style="flex:none; width: 30%; height: 100%; margin-right: 10px;display: flex;flex-direction: column;">
        <XTable

                toolId="productionCardCraftSum"
                :page-show="false"
                v-loading="loading"
                :data="craftList"
                :columnList="columnList"
                border :showRefresh="true" :isNeedEmitRefresh="true" @refresh="getList"
                height="100%" class="xtable-content"
                :column-config="{ resizable: true }"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id',isCurrent:'true' }"
                @cell-click="cellClickEvent"
        >
        <template #default-setQuantity="scope">
          {{scope.row.setQuantity}}
          <el-tooltip
            class="box-item"
            effect="dark"
            raw-content
            v-if="scope.row.unit == '2' && scope.row.extendCraftName"
            :content="`测试架结存有小数的情况会向下取整<br>
                        如：1pnl=4set=24pcs<br>
                         本卡1pnl，前面工序报废1set和2pcs<br>
                        报废pcs：6+2=8pcs<br>
                        测试架结存数：(24-6-2)/6=2.66≈2set<br>
                        结存面积：2*set面积<br><br>`"
          >
            <el-icon style="margin-left: 10px;color: #f3d8c4;"><QuestionFilled /></el-icon>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            raw-content
            v-if="scope.row.unit == '2' && !scope.row.extendCraftName"
            :content="`FQC结存有小数的情况会向下取整，出单向上取整<br>
                        如：1pnl=4set=24pcs<br>
                         本卡1pnl，前面工序报废1set和2pcs<br>
                        报废pcs：6+2=8pcs<br>
                        FQC结存数：(24-6-2)/6=2.66≈2set<br>
                        结存面积：2*set面积<br>
                         若包装接5pcs<br>
                         出单set数： 5/6=0.83set<br>
                         出单面积：0.83*set面积<br>
                         则 FQC结存数：(24-6-2-5)/6=1.83≈1set<br>
                         结存面积：1*set面积<br><br>`"
          >
            <el-icon style="margin-left: 10px;color: #f3d8c4;"><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <template #default-outArea="scope">
          <el-link type="primary"  >{{ scope.row.outArea }} </el-link>
        </template>
        <template #default-pnlArea="scope">
          <el-link type="primary"  >{{ scope.row.pnlArea }} </el-link>
        </template>
        </XTable>

      </div>
      <div :span="18" style="flex:none; width: 70%; height: 100%;display: flex;flex-direction: column;">
         <el-tabs type="border-card" class="xtable-tab">
        <el-tab-pane :label="paneName">
        <XTable
                v-if="showXTable"
                toolId="productionCardCraftDetail"
                ref="detailRef"
                v-loading="loading"
                :page-show="false"
                :data="outHistoryList"
                :columnList="columnHistoryList"
                border
                height="100%" class="xtable-content"
                :checkbox-config="{reserve: true }"
                :footer-method="footerMethod"
                show-footer
                :scroll-y="{enabled: true,gt: 50}"
        >
          <template #default-pnlQuantity="{row}">
            {{row.pnlQuantity}}{{unitOption.find(v=>v.value == row.countUnit)?.label}}
          </template>
          <template #default-make="{row}">
            <el-button link type="primary" @click="doMIPrint(row,'noOutsideImages')">MI详情</el-button>
          </template>
        </XTable>
        <XTable
              v-else
                toolId="productionEndCardCraftDetail"
                ref="endDetailRef"
                v-loading="loading"
                :page-show="false"
                :data="outHistoryList"
                :columnList="columnEndHistoryList"
                border
                height="100%" class="xtable-content"
                :checkbox-config="{reserve: true }"
                :footer-method="footerMethod"
                show-footer
                :scroll-y="{enabled: true,gt: 50}"
        >
          <template #default-finishSetArea="{ row }">
              {{ BigNumber(row.finishSetArea).dp(4)}}
            </template>
          <template #default-pnlQuantity="{row}">
            {{row.pnlQuantity}}{{unitOption.find(v=>v.value == row.countUnit)?.label}}
          </template>
          <template #default-make="{row}">
            <el-button link type="primary" @click="doMIPrint(row,'noOutsideImages')">MI详情</el-button>
          </template>
        </XTable>
          </el-tab-pane>
      </el-tabs>
      </div>
    </div>

    <MIPrint ref="MIPrintRef"  ></MIPrint>
  </div>
</template>

<script setup name="ProductionAnalysis" lang="ts">
  import {CardVO} from '@/api/production/card/types';
  import {getCraftProductivityAnalysis} from "@/api/production/production";
  import {ProductionForm, ProductionQuery, ProductionVO} from "@/api/production/production/types";
  import dayjs from "dayjs";
  import {VxeTableEvents, VxeTablePropTypes} from "vxe-table";
  import { BigNumber } from 'bignumber.js';

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const MIPrintRef = ref();
  const craftList = ref<ProductionVO[]>([]);
  const outHistoryList = ref<CardVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const historyTotal = ref(0);
  const detailRef = ref();
  const endDetailRef = ref();
  const paneName = ref("出单记录");
  const showXTable = ref(true);

  const unitOption = ref([
    {label: 'pcs', value: '1'},
    {label: 'set', value: '2'},
    {label: 'pnl', value: '3'},
  ])

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

  const initFormData: ProductionForm = {
    id: undefined,
    customerCode: undefined,
    startTime:undefined,
    completeTime:undefined,
  }
  const data = reactive<PageData<ProductionForm, ProductionQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      productionCode: undefined,
      customerCode: undefined,
      startTime: dayjs(new Date()).format("YYYY-MM-DD 08:00:00"),
      // startTime: dayjs(new Date()).format("2023-11-01 00:00:00"),
      endTime:dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      commodityCode: undefined,
      commodityName: undefined,
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

  const columnList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '30'},
    {
      title: '工序名称',
      field: 'craftName',
      width: '90',
      align: 'center',
    },
    {
      title: '结存PNL数量',
      field: 'pnlQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: '结存SET数量',
      field: 'setQuantity',
      width: '100',
      align: 'center',
    },
    {
      width: "100",
      title: '出单面积',
      field: 'outArea',
      align: 'center',
    },
    {
      width: "120",
      title: '结存面积',
      field: 'pnlArea',
      align: 'center',
    },
  ]);
  const columnHistoryList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '记录时间',
      field: 'finishTime',
      width: '120',
      align: 'center',
    },
    {
      title: '流转卡号',
      field: 'code',
      width: '120',
      align: 'center',
    },
    {
      title: '排产单号',
      field: 'productionCode',
      width: '100',
      align: 'center',
    },
    {
      title: '工序',
      field: 'craftName',
      width: '120',
     align: 'center',
    },
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
    },
    {
      width: "150",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
    },
    {
      width: "120",
      title: '客户编码',
      field: 'customerCode',
      align: 'center',
    },
    {
      width: "120",
      title: '出单面积',
      field: 'finishSetArea',
      align: 'center',
    },
    {
      width: "120",
      title: '类型',
      field: 'pnlName',
      align: 'center',
    },
    {
      width: "120",
      title: '长',
      field: 'pnlLength',
      align: 'center',
    },
    {
      width: "120",
      title: '宽',
      field: 'pnlWidth',
      align: 'center',
    },
    {
      width: "120",
      title: '数量',
      field: 'pnlQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '单片长',
      field: 'singleLength',
      align: 'center',
    },
    {
      width: "120",
      title: '单片宽',
      field: 'singleWidth',
      align: 'center',
    },
    {
      width: "120",
      title: 'SET长',
      field: 'unitedLength',
      align: 'center',
    },
    {
      width: "120",
      title: 'SET宽',
      field: 'unitedWidth',
      align: 'center',
    },
    {
      width: "120",
      title: 'PCS/SET',
      field: 'pcsPerSet',
      align: 'center',
    },
    {
      width: "80",
      title: '操作',
      fixed: "right",
      field: 'make',
      align: 'center',
    },
  ]);
    const columnEndHistoryList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '记录时间',
      field: 'beginTime',
      width: '120',
      align: 'center',
    },
    {
      title: '流转卡号',
      field: 'code',
      width: '120',
      align: 'center',
    },
    {
      title: '排产单号',
      field: 'productionCode',
      width: '100',
      align: 'center',
    },
    {
      title: '工序',
      field: 'craftName',
      width: '120',
     align: 'center',
    },
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
    },
    {
      width: "150",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
    },
    {
      width: "120",
      title: '客户编码',
      field: 'customerCode',
      align: 'center',
    },
    {
      width: "120",
      title: '结存面积',
      field: 'finishSetArea',
      align: 'center',
    },
    {
      width: "120",
      title: '类型',
      field: 'pnlName',
      align: 'center',
    },
    {
      width: "120",
      title: '长',
      field: 'pnlLength',
      align: 'center',
    },
    {
      width: "120",
      title: '宽',
      field: 'pnlWidth',
      align: 'center',
    },
    {
      width: "120",
      title: '数量',
      field: 'pnlQuantity',
      align: 'center',
    },
    {
      width: "120",
      title: '单片长',
      field: 'singleLength',
      align: 'center',
    },
    {
      width: "120",
      title: '单片宽',
      field: 'singleWidth',
      align: 'center',
    },
    {
      width: "120",
      title: 'SET长',
      field: 'unitedLength',
      align: 'center',
    },
    {
      width: "120",
      title: 'SET宽',
      field: 'unitedWidth',
      align: 'center',
    },
    {
      width: "120",
      title: 'PCS/SET',
      field: 'pcsPerSet',
      align: 'center',
    },
    {
      width: "80",
      title: '操作',
      fixed: "right",
      field: 'make',
      align: 'center',
    },
  ]);

  const {queryParams, form, rules} = toRefs(data);

  const queryFormRef = ref<ElFormInstance>();
  // 获取 搜索条件
  const searchChange = (params: any) => {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.value[key] = params[key];
      }
    });
    getList()
  }

  const searchHistoryChange = (params: any) => {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.value[key] = params[key];
      }
    });
  }

  const footerMethod: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == 'index') {
          return columns.length;
        }
        if (column.field == "finishSetArea") {
          return `${sumNum(data, "finishSetArea")} `;
        }
        if (column.field == "pnlQuantity") {
          return `${sumNum(data, "pnlQuantity")} `;
        }
        return "";
      })
    ];
  };

  const sumNum = (list: any[], field: string) => {
    let count = 0;
    list.forEach(item => {
      count += Number(item[field]);
    });
    return BigNumber(count).dp(4);
  };

  /** 查询左边边框数据 */
  const getList = async () => {
    loading.value = true;
    const res = await getCraftProductivityAnalysis(queryParams.value);
    craftList.value = res.data;
    loading.value = false;
  }

  const cellClickEvent: VxeTableEvents.CellClick<any> = ({row, column }) => {
    if (column.field == 'pnlArea') {
          showXTable.value=false;
            paneName.value = "结存记录";
            outHistoryList.value = row.endCardCraftlVoList;
            nextTick(() => {
              endDetailRef.value.xTableRef.updateFooter();
            });
    } else {

             showXTable.value=true;
            paneName.value = "出单记录";
            outHistoryList.value = row.cardCraftlVoList;
            detailRef.value.xTableRef.updateFooter();
    }
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


  const resetQuery = () => {
    queryParams.value.pageNum = 1;
    queryFormRef.value?.resetFields();
    queryParams.value.commodityCode = undefined;
    queryParams.value.commodityName = undefined;
    queryParams.value.startTime= dayjs(new Date()).format("YYYY-MM-DD 00:00:00");
    queryParams.value.endTime=dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    getList();
  }

  const inRecordList = ref();


  let currentInfo = ref();


  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('production/card/export', {
      ...queryParams.value
    }, `card_${new Date().getTime()}.xlsx`)
  }
  const doMIPrint = async (data: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(data.planId, type);
  }

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
</style>

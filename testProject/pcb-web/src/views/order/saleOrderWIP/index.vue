<template>
  <div class="p-2 xtable-page">
    <div class="text-center p-2">
      <el-row>
        <el-col :span="24">
          <div style="float: right">
            <div style="display:flex;;line-height: 24px;font-size: 14px">
              <!-- <div style="width: 90px;background-color: #C0FDFF">外协订单</div>
              <div style="width: 90px;background-color: #FAECD8">订单未排产</div>
              <div style="width: 90px;background-color: #F2FFEB">排产已完成</div> -->
              <div style="width: 20px"></div>
              <el-checkbox v-model="queryParams.showDeliverComplete" @change="getList" size="medium"
                         true-label="4" false-label="5"
                         style="height:24px;margin-right:5px; ">只显示发货未完成
              </el-checkbox>
              <el-button type="primary"
                        @click="exportToExcel">导出excel
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <XTable
              ref="prodTable"
              toolId="saleOrderWIP"
              style="height: 100%;"
              :pageShow="false"
              height="100%"
              v-loading="loading"
              :data="saleOrderWIPList"
              :columnList="columnList"
              border :showRefresh="true"
              class="xtable-content"
              @searchChange="searchChange"
              :isNeedEmitRefresh="true"
              @refresh="handleQuery"
              :column-config="{ resizable: true }"
              :row-config="{isCurrent:'true' }"
              :menu-config="menuConfig"
              @menu-click="contextMenuClickEvent"
              :scroll-y="{enabled: true,gt: 50}"
              :row-style="setRowStyle"
              :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','planStartTime']"
      >
        <template #header-tool>
          <ColorRule :list="[
            { title: '外协订单', color: '#C0FDFF' },
            { title: '订单未排产', color: '#FAECD8' },
            { title: '排产已完成', color: '#F2FFEB' },
          ]"></ColorRule>
        </template>
        <template #default-orderType="{row}">
          <div v-for="item in resDictData.order_type">
            <span v-if="item.dictValue==row.orderType">{{item.dictLabel}}</span>
          </div>
        </template>
        <template #default-commodityCode="{row}">
          <span v-if="row.isRemediation"
                style="position:absolute;top:0px;right:0px;background-color:red; color:white;border-radius:30%;font-size:8px;line-height:15px;padding:0px 2px;">
            补
          </span>
          {{row.commodityCode}}
        </template>
        <template #default-isPaused="{row}">
          <el-tag type="success" v-if="'正常'==row.isPaused" >{{row.isPaused}}</el-tag>
          <el-tag type="warning" v-else>{{row.isPaused}}</el-tag>
        </template>
      </XTable>
    <!-- </el-card> -->

    <!--PCB制作单预览 -->
    <el-drawer destroy-on-close v-model="drawer.visible" :title="drawer.title" size="25%" visible.sync="false" >
      <template #header="{ close, titleId, titleClass }">
        <div class="text-center">{{currentInfo?.code+'-生产详情'}}</div>
      </template>
      <el-timeline>
        <el-timeline-item v-for="(node, index) in cardNodeList"
                          :key="index"
                          :color="node.color"
                          type="primary"
                          size="normal"
                          style="padding-bottom:5px;">
          <el-card>
            <div class="timeline-name"
                 style="display:flex;justify-content:space-between;align-content:center;width: 100%">
              <div style="height:28px;line-height:28px;font-weight:bolder;">{{ node.craftName }}</div>
            </div>
            <p class="timeline-time">开始时间：{{ node.beginTime}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script setup name="SaleOrderWIP" lang="ts">
  import {ref} from "vue";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {getOrderWIP, listCardNode} from "@/api/production/production";
  import {deepClone} from "@/utils";
  import * as xlsx from 'xlsx';
  // import * as xlsxs from 'xlsx-style-vite'
  // import xlsxs from "xlsx-style";// vue3不支持
  import fileSaver from "file-saver";
  import {VxeTableEvents, VxeTablePropTypes} from "vxe-table";
  import {getCardNodes} from "@/api/production/cardNode";
  import {getListCustomer} from "@/api/basedata/customer";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const prodTable = ref();
  const loading = ref(false);
  const total = ref(0);
  const saleOrderWIPList = ref([]);
  const saleOrderWIPAllList = ref([]);
  const tempQuery = ref()

  let initQueryParams = {
    showDeliverComplete: '4',
    code: undefined,
    params: {}
  }

  let queryParams = ref<any>({
    ...initQueryParams
  });

  const getList = async () => {
    loading.value = true;
    const res = await getOrderWIP(queryParams.value);
    saleOrderWIPList.value = res.data
    saleOrderWIPAllList.value = res.data
    loading.value = false;
  }
  const customerCodeList = ref();
  const columnList = ref([
    {width: '30', title: '序号',field:"index", type: 'seq', align: 'center',},
    {width: '30', title: '新/返', field: 'orderType', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {width: '40', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
    {width: '90', title: '客户PO', field: 'customerPo', align: 'center', filterType: 'input'},
    {width: '40', title: '合同编号', field: 'code', align: 'center', filterType: 'input'},
    {width: '100', title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品编码'},},
    {width: '120', title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input'},
    {width: '120', title: '客户物料编码', field: 'materialNumber', align: 'center', filterType: 'input'},
    {width: '20', title: '金厚', field: 'goldenThickness', align: 'center', filterType: 'input'},
    {width: '20', title: '板层', field: 'materialLayer', align: 'center', filterType: 'input'},
    {width: '70', title: '下单日期', field: 'placeOrderTime', align: 'center',filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: '70', title: '工厂交期', field: 'dispatchTime', align: 'center',filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: '70', title: '客户交期', field: 'deliveryTime', align: 'center',filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    // {width: '70', title: '预投时间', field: 'preFeedTime', align: 'center',},
    {width: '50', title: '合同送货数', field: 'quantity', align: 'center',},

    {width: '50', title: '开料', field: 'cutNum', align: 'center',},
    {width: '50', title: '压合', field: 'laminationNum', align: 'center',},
    {width: '50', title: '外层钻孔', field: 'drillNum', align: 'center',},
    {width: '50', title: '沉铜', field: 'copperNum', align: 'center',},
    {width: '50', title: '外层线路', field: 'outSideLineNum', align: 'center',},
    {width: '50', title: '图形电镀', field: 'graphicNum', align: 'center',},
    {width: '50', title: '蚀刻前一锣', field: 'etchGloneNum', align: 'center',},
    {width: '50', title: '锣半孔', field: 'halfHoleNum', align: 'center',},
    {width: '50', title: '退膜/蚀刻', field: 'etchNum', align: 'center',},
    {width: '50', title: '蚀检QC', field: 'etchQCNum', align: 'center',},
    {width: '50', title: '阻焊', field: 'solderResistNum', align: 'center',},
    {width: '50', title: '阻焊QC', field: 'solderResisQCtNum', align: 'center',},
    {width: '50', title: '丝印字符', field: 'printingCharacterNum', align: 'center',},
    {width: '50', title: '表面处理', field: 'surfaceTreatmentNum', align: 'center',},
    {width: '50', title: '成型', field: 'formingNum', align: 'center',},
    {width: '50', title: '飞针', field: 'testNum', align: 'center',},
    {width: '50', title: '测试架', field: 'testNumPcs', align: 'center',},
    {width: '50', title: 'FQC', field: 'fqcNum', align: 'center',},
    {width: '50', title: '包装', field: 'packageNum', align: 'center',},

    {width: '50', title: '差额数量', field: 'diffQuantity', align: 'center',},
    {width: '50', title: '已发货', field: 'deliverQuantity', align: 'center',},
    {width: '50', title: '退货数量', field: 'returnQuantity', align: 'center',},
    {width: '50', title: '入库数', field: 'inventoryNumber', align: 'center',},
    {width: '50', title: '入库差数', field: 'inventoryDiffNumber', align: 'center',},
    {width: '50', title: '订单面积(set)', field: 'totalArea', align: 'center',},
    {width: '50', title: '预投面积(set)', field: 'preProductionArea', align: 'center',},
    {width: '50', title: '暂停', field: 'isPaused', align: 'center',},
    {width: '50', title: '实投面积(pnl)', field: 'realProductionArea', align: 'center',},
    {width: '50', title: '差额面积(set)', field: 'diffProductionArea', align: 'center',},
    {width: '70', title: '投产日期', field: 'planStartTime', align: 'center',filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: '50', title: '入库面积', field: 'inventoryArea', align: 'center',},
    {width: '50', title: '报废数', field: 'scrapNumber', align: 'center',},
    {width: '50', title: '报废面积', field: 'scrapArea', align: 'center',},
    {width: '30', title: '加急', field: 'urgent', align: 'center',},
    // {width: '120', title: '层数', field: 'layerNumber', align: 'center',},
    {width: '30', title: '板厚', field: 'commodityThickness', align: 'center',},
  ]);

  let resDictData = ref({
    //订单类型
    order_type: [],
  })

  const currentInfo = ref({});

  const menuConfig = reactive<VxeTablePropTypes.MenuConfig<any>>({
    body: {
      options: [
        [
          {code: 'detail', name: '生产详情', visible: true, disabled: false},
        ]
      ]
    },
  })

  const contextMenuClickEvent: VxeTableEvents.MenuClick<any> = ({menu, row, column}) => {
    switch (menu.code) {
      case 'detail':
        if(row.productionId){
          currentInfo.value = row;
          getCardNodes(row.productionId).then(res=>{
            cardNodeList.value = res.data;
            cardNodeList.value.forEach((info: any) => {
              if (info.finishTime != null) {
                info.color = '#67C23A';
              } else if (info.beginTime == null) {
                info.color = '#909399'
              } else {
                info.color = '#409EFF';
              }
            })
            drawer.visible = true;
          });
        } else {
          ElMessage.warning("此订单暂未排产");
        }
        break;
      default:
        break;
    }
  }

  const cardNodeList = ref([]);

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: '',
    direction: "rtl"
  });

  //合并  ：span-method="rowSpanMethod"
  const rowSpanMethod = ({row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data}: any) => {
    // 合并参考字段,根据此字段进行合并行
    const referenceField = "productionCode";
    if (column.property === "productionCode") {
      if (rowIndex > 0) {
        if (row[referenceField] === items[rowIndex - 1][referenceField]) {
          row.seq = items[rowIndex - 1].seq;
        } else {
          row.seq = items[rowIndex - 1].seq + 1;
        }
      } else if (rowIndex === 0) {
        row.seq = seq;
      }
      let prevRow = data[$rowIndex - 1];
      let nextRow = data[$rowIndex + 1];
      if (prevRow && prevRow[referenceField] === row[referenceField]) {
        return {rowspan: 0, colspan: 0};
      } else {
        let countRowspan = 1;
        while (nextRow && nextRow[referenceField] === row[referenceField]) {
          nextRow = data[++countRowspan + $rowIndex];
        }
        if (countRowspan > 1) {
          return {rowspan: countRowspan, colspan: 1};
        }
      }
    }
  }

  // 不为空返回true
  const unIsEmpty = (value: any) => {
    let res = false
    if (value == undefined || value == null || ((typeof value == 'string') && value == '')) {
      res = true
    }
    return !res
  }
  // 不为空返回true
  const getTimeNumber = (value: any) => {
    return new Date(value).getTime()
  }
  // 获取 搜索条件
  const searchChange = (params: any) => {
    // queryParams.value = deepClone(initQueryParams) ;
    // Object.keys(params).forEach(key => {
    //   if (params[key] !== null && params[key] !== undefined) {
    //     queryParams.value[key] = params[key];
    //   }
    // });
    // getList()

    console.log("params=================",params);

    tempQuery.value = params

    let tmp = deepClone(saleOrderWIPAllList.value)
    for (let key in params) {
      const item = params[key]
      if (unIsEmpty(item)) {
        if (key == 'code') tmp = tmp.filter(o => o.code && o.code.includes(item.toLocaleUpperCase()))
        if (key == 'commodityCode') tmp = tmp.filter(o => o.commodityCode && o.commodityCode.includes(item.toLocaleUpperCase()))
        if (key == 'commodityName') tmp = tmp.filter(o => o.commodityName && o.commodityName.includes(item))

        //if (key == 'customerCode') tmp = tmp.filter(o => o.customerCode && o.customerCode.includes(item.toLocaleUpperCase()))
        if (key == 'customerCode') tmp = tmp.filter(o =>
          {
            if(o.customerCode){
              //o.customerCode&&item.find(o.customerCode)
              let tf= item.filter(it=> it.includes(o.customerCode));
              console.log("=========-???",tf)
              return tf.length>0;
            }else{
              return false;
            }
          }
        )

        if (key == 'customerPo') tmp = tmp.filter(o => o.customerPo && o.customerPo.toString().includes(item))
        if (['deliveryTimeEnd'].includes(key)) tmp = tmp.filter(o => o.deliveryTime && getTimeNumber(o.deliveryTime) <= getTimeNumber(item))
        if (['deliveryTimeStart'].includes(key)) tmp = tmp.filter(o => o.deliveryTime && getTimeNumber(o.deliveryTime) >= getTimeNumber(item))
        if (['dispatchTimeEnd'].includes(key)) tmp = tmp.filter(o => o.dispatchTime && getTimeNumber(o.dispatchTime) <= getTimeNumber(item))
        if (['dispatchTimeStart'].includes(key)) tmp = tmp.filter(o => o.dispatchTime && getTimeNumber(o.dispatchTime) >= getTimeNumber(item))
        if (key == 'goldenThickness') tmp = tmp.filter(o => o.goldenThickness && o.goldenThickness.includes(item))
        if (key == 'materialLayer') tmp = tmp.filter(o => o.materialLayer && o.materialLayer.includes(item))
        if (key == 'materialNumber') tmp = tmp.filter(o => o.materialNumber && o.materialNumber.includes(item))
        if (key == 'orderType') tmp = tmp.filter(o => o.orderType && o.orderType==(item))
        if (['placeOrderTimeEnd'].includes(key)) tmp = tmp.filter(o => o.placeOrderTime && getTimeNumber(o.placeOrderTime) <= getTimeNumber(item))
        if (['placeOrderTimeStart'].includes(key)) tmp = tmp.filter(o => o.placeOrderTime && getTimeNumber(o.placeOrderTime) >= getTimeNumber(item))
        if (['planStartTimeEnd'].includes(key)) tmp = tmp.filter(o => o.planStartTime && getTimeNumber(o.planStartTime) <= getTimeNumber(item))
        if (['planStartTimeStart'].includes(key)) tmp = tmp.filter(o => o.planStartTime && getTimeNumber(o.planStartTime) >= getTimeNumber(item))
      }
    }
    saleOrderWIPList.value = tmp
    // console.log(params)
  }

  const setRowStyle = (scope: any) => {
    if (scope.row.outSourceQuantity > 0 || scope.row.flowStatus == '8') {
      return {
        backgroundColor: 'rgb(192, 253, 255)',
      }
    }
    if (scope.row.isProduction == '0') {
      return {
        backgroundColor: 'rgb(250, 236, 216)',
      }
    }
    if(scope.row.isFinishProduction){
      return {
        backgroundColor: 'rgb(242, 255, 235)',
      }
    }
  }

  /*导出*/
  const exportToExcel = async () => {
    // proxy?.download('production/production/exportOrder', {
    //   ...queryParams.value, tableName: "saleOrderWIP"
    // }, `销售WIP_${new Date().getTime()}.xlsx`);


    var num = saleOrderWIPList.value.length;

    if (!saleOrderWIPList.value?.length) {
      return;
    }
    const temColumnList = prodTable.value?.toolList && prodTable.value.toolList.filter((item: any) => item.field && item.title && item.visible).sort((a:any, b:any) => a.sortIndex - b.sortIndex) || columnList.value
    var result = saleOrderWIPList.value.map((item, index) => {
      let param = {}
      temColumnList.forEach((v: any) => {
        if (v.field && v.field != 'make') {
          if (v.field == 'index') {
            param['index'] = index + 1
          } else if (v.field == 'orderType') {
            param['orderType'] = resDictData.value.order_type.find((el: any) => el.dictValue == item['orderType'])?.dictLabel
          } else if (v.field.includes('.')) {
            const tempArr = v.field.split('.')
            let tempRes = 'item'
            tempArr.forEach((v: any) => {
              tempRes += `['${v}']`
            })
            param[tempArr[tempArr.length - 1]] = eval(tempRes)
          } else {
            param[v.field] = item[v.field]
          }
        }
      })
      return param
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const currentDate = `${year}-${month}-${day}`;

    //数据导入
    var ws = xlsx.utils.json_to_sheet(result, { origin: "A2" });

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 23 } }
    ];

    //表名
    ws["A1"] = { v: `${currentDate} 销售WIP` };

    //列名
    const titleList = temColumnList.filter((item:any) => (item.field && item.field != 'make') && item.title).map((item: any) => item.title)
    xlsx.utils.sheet_add_aoa(ws, [titleList],
      { origin: "A2" });

    const wchList = titleList.map((item: any) => {
      return {
        wch: 8
      }
    })
    ws["!cols"] = wchList;

    const cellStyle = {
      font: {
        name: '宋体',
        sz: 9,
        //color: { rgb: "ffffff" },
        //bold: true,
        //italic: false,
        //underline: false,
        height: 50
      },
      alignment: { horizontal: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };

    var range = xlsx.utils.decode_range(ws["!ref"]);

    for (let i = range.s.r; i <= range.e.r; i++) {
      for (let j = range.s.c; j <= range.e.c; j++) {
        var cellName = xlsx.utils.encode_cell({ r: i, c: j });
        ws[cellName] = Object.assign({}, ws[cellName], { s: cellStyle });
      }
    }

    var workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, ws, 'sheet1');
    var file = xlsx.write(workbook, { type: 'buffer' });
    try {
      fileSaver.saveAs(
        new Blob([file], { type: "application/octet-stream" }),
        `${currentDate}-销售WIP.xlsx`
      );
    } catch (e) {
      // this.$message.error(e);
    }
  }

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_type";
    getDicts(string)
      .then(res => {
        const dictData = res.data;
        string.split(",").forEach(item => {
          Object.keys(resDictData.value).forEach(dictItem => {
            if (item == dictItem) {
              resDictData.value[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });
  };

  /** 搜索按钮操作 */
  const handleQuery = async () => {
    await getList();
    searchChange(tempQuery.value)
  }
  const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.customerCode, label:item.customerCode } });
    }
  }

  onMounted(() => {
    getListCust()
    getList()
    getDictOptions()
  });
</script>

<style lang="scss">

</style>

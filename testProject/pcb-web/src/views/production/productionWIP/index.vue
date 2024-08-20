<template>
  <div class="p-2 xtable-page">
    <div class="text-center p-2">
      <el-row>
        <el-col :span="24">
          <div style="float: right">
            <div style="display:flex;;line-height: 24px;font-size: 14px">
              <div style="width: 110px;background-color: #F15060">报废率大于0.5%</div>
              <div style="width: 110px;background-color: #ffff00">交期在两天之内</div>
              <div style="width: 110px;background-color: #E37d7d">交期已过</div>
              <div style="width: 20px"></div>
              <el-button type="primary"
                         @click="exportToExcel">导出excel
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never" class="xtable-card">
      <XTable toolId="productionWIP"
              ref="prodTable"
              style="height: 100%;"
              height="100%"
              :pageShow="false"
              v-loading="loading"
              :data="productionWIPList"
              :columnList="columnList"
              border :showRefresh="true"
              class="xtable-content"
              @searchChange="searchChange"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id',isCurrent:'true' }"
              :scroll-y="{enabled: true,gt: 50}"
              :row-style="setRowStyle"
              :isNeedEmitRefresh="true"
              @refresh="handleQuery"
              :footer-method="footerMethod"
              show-footer
              show-footer-overflow
              :intervalCondition="['placeOrderTime','deliveryTime','productionTime','scrapRate','dispatchTime']"
      >
        <template #default-isRemediation="{row}">
          <el-tag v-if="row.isRemediation=='是'"
                  type="warning"
                  size="small">是</el-tag>
          <el-tag v-if="row.isRemediation=='否'"
                  type="success"
                  size="small">否</el-tag>
        </template>
        <template #default-orderType="{row}">
          <div v-for="item in resDictData.order_type">
            <span v-if="item.dictValue==row.orderType">{{item.dictLabel}}</span>
          </div>
        </template>
      </XTable>
    </el-card>
  </div>
</template>

<script setup name="ProductionWIP" lang="ts">
  import {ref} from "vue";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import dayjs from "dayjs";
  import {getProductionWIP} from "@/api/production/production";
  import {VxeTablePropTypes} from "vxe-table";
  import { deepClone } from '@/utils'
  import * as xlsx from 'xlsx';
  // import * as xlsxs from 'xlsx-style-vite'
  // import xlsxs from "xlsx-style";// vue3不支持
  import fileSaver from "file-saver";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const prodTable = ref()
  const loading = ref(false);
  const total = ref(0);
  const productionWIPList = ref([]);
  const productionWIPAllList = ref([]);
  const tempQuery = ref()

  let queryParams = ref<any>({
    code: undefined,
    params: {}
  });

  const getList = async () => {
    loading.value = true;
    const res = await getProductionWIP(queryParams.value);
    productionWIPList.value = res.data
    productionWIPAllList.value = res.data
    loading.value = false;
  }

  const columnList = ref([
    {title: "序号", type: 'seq', fixed: "left", field: 'index', align: 'center', width: '30'},
    {
      width: '100',
      title: '排产单号',
      fixed: "left",
      field: 'productionCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      width: '30',
      title: '是否补料',
      fixed: "left",
      field: 'isRemediation',
      align: 'center',
    },
    {
      width: '50',
      title: '新/返',
      fixed: "left",
      field: 'orderType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '40',
      title: '客户编号',
      fixed: "left",
      field: 'customerCode',
      align: 'center',
    },
    {
      width: '75',
      title: '客户PO',
      fixed: "left",
      field: 'customerPo',
      align: 'center',
    },
    {width: '120', title: '客户物料编码', field: 'materialNumber', align: 'center', filterType: 'input'},
    {
      width: '110',
      title: '产品编号',
      fixed: "left",
      field: 'commodityNo',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编号'}
    },
    {
      width: '30',
      title: '板层',
      fixed: "left",
      field: 'materialLayer',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板层'}
    },
    {
      width: '70',
      title: '下单日期',
      fixed: "left",
      field: 'placeOrderTime',
      align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: '70',
      title: '交货日期',
      fixed: "left",
      field: 'dispatchTime',
      align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: '60', title: '合同送货数量(pcs)', fixed: "left", field: 'deliverQuantity', align: 'center'},
    {width: '70', title: '在线结存', fixed: "left", field: 'sumPnlQuantity', align: 'center'},
    {width: '60', title: '在线结存面积(㎡)', fixed: "left", field: 'sumPnlArea', align: 'center'},
    {
      width: '70',
      title: '投产日期',
      field: 'productionTime',
      align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: '150',
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },

    {title: '阻焊颜色', field: 'solderCs', width: '50', align: 'center',filterType: 'input'},
    {title: '字符', field: 'characterGTO', width: '50', align: 'center',filterType: 'input'},
    {title: '成型方式', field: 'forming', width: '50', align: 'center',filterType: 'input'},
    {title: '测试方式', field: 'testWay', width: '50', align: 'center',filterType: 'input'},
    {width: '40', title: 'PNL长', field: 'pnlLength', align: 'center'},
    {width: '40', title: 'PNL宽', field: 'pnlWidth', align: 'center'},
    {width: '70', title: '投料面积(㎡)', field: 'productionArea', align: 'center'},

    {width: '50', title: '开料', field: 'cutNum', align: 'center',},
    {width: '50', title: '压合', field: 'laminationNum', align: 'center',},
    {width: '50', title: '外层钻孔', field: 'drillNum', align: 'center',},
    {width: '50', title: '导电膜', field: 'filmNum', align: 'center',},
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


    {width: '50', title: '报废数', field: 'scrapQuantity', align: 'center',},
    {width: '60', title: '报废率', field: 'scrapRate', align: 'center',filterType: 'intervalNumber'},
    {width: '50', title: '报废面积', field: 'scrapArea', align: 'center',},
    {width: '50', title: '入库数(pcs)', field: 'inventoryQuantity', align: 'center',},
    {width: '50', title: '入库面积', field: 'inventoryArea', align: 'center',},
    {width: '50', title: '入库差数', field: 'inventoryDiffNumber', align: 'center',},
    {width: '50', title: '差额面积', field: 'inventoryDiffArea', align: 'center',},
  ]);

  let resDictData = ref({
    //订单类型
    order_type: [],
  })

  const currentInfo = ref({});

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

  const footerMethod: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if(column.field === 'materialNumber'){
          return '';
        }
        if(column.field.includes("Quantity")){
          return `${sumNum(data, column.field)} `;
        }
        if(column.field.includes("Area")){
          return `${sumNum(data, column.field).toFixed(4)} `;
        }
        if(column.field.includes("Num") && column.field!='solderResisQCtNum'){
          return `${sumNum(data, column.field)} `;
        }
        return "";
      })
    ];
  };

  // const sumNum = (list: any[], field: string) => {
  //   let count = 0;
  //   list.forEach(item => {
  //     if (item[field] && item[field].toString().includes(":")){
  //       count += Number(item[field].substring((item[field].lastIndexOf(":"))+1))
  //     }else {
  //       count += Number(item[field]);
  //     }
  //   });
  //   return Number(count.toFixed(4));
  // };
  const sumNum = (list, field) => {
    let totalPnl = 0;
    let totalSet = 0;
    let count = 0;
    let hasColon = false;

    list.forEach(item => {
      if (item[field] && (item[field].toString().includes("+") || item[field].toString().includes(":"))) {
        hasColon = true;
        const parts = item[field].toString().split(/[+:]/); // 按加号或冒号分隔部分
        parts.forEach(part => {
          const pnlMatch = part.match(/(\d+)/); // 匹配 pnl 值
          const setMatch = part.match(/(\d+)set/); // 匹配 set 值
          if (pnlMatch && !part.includes("set")) {
            totalPnl += Number(pnlMatch[1]); // 累加 pnl 值
          }
          if (setMatch) {
            totalSet += Number(setMatch[1]); // 累加 set 值
          }
        });
      } else {
        count += Number(item[field]); // 直接累加纯数字
      }
    });

    if (hasColon) {
      return `${totalPnl}pnl+${totalSet}set`;
    } else {
      return count;
    }
  };

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
    // queryParams.value = params;
    // getList()
    tempQuery.value = params

    let tmp = deepClone(productionWIPAllList.value)
    for (let key in params) {
      const item = params[key]
      if (unIsEmpty(item)) {
        console.log("searchChange",key,item)
        if (key == 'characterGTO') tmp = tmp.filter(o => o.characterGTO && o.characterGTO.includes(item))
        if (key == 'commodityName') tmp = tmp.filter(o => o.commodityName && o.commodityName.includes(item))
        if (key == 'forming') tmp = tmp.filter(o => o.forming && o.forming.includes(item))
        if (key == 'commodityNo') tmp = tmp.filter(o => o.commodityNo && o.commodityNo.includes(item.toLocaleUpperCase()))
        if (key == 'materialNumber') tmp = tmp.filter(o => o.materialNumber && o.materialNumber.includes(item))
        if (key == 'materialLayer') tmp = tmp.filter(o => o.materialLayer && o.materialLayer.includes(item))
        if (key == 'orderType') tmp = tmp.filter(o => o.orderType && o.orderType.includes(item))
        if (key == 'productionCode') tmp = tmp.filter(o => o.productionCode && o.productionCode.includes(item.toLocaleUpperCase()))
        //if (key == 'scrapRate') tmp = tmp.filter(o => o.scrapRate && o.scrapRate.includes(item))
        if (key == 'scrapRateStart') tmp = tmp.filter(o => o.scrapRate && (Number(o.scrapRate.replace("%", "")) > item))
        if (key == 'scrapRateEnd') tmp = tmp.filter(o => o.scrapRate && (Number(o.scrapRate.replace("%", "")) < item))

        if (key == 'solderCs') tmp = tmp.filter(o => o.solderCs && o.solderCs.includes(item))
        if (key == 'testWay') tmp = tmp.filter(o => o.testWay && o.testWay.includes(item))
        if (['deliveryTimeEnd'].includes(key)) tmp = tmp.filter(o => o.deliveryTime && getTimeNumber(o.deliveryTime) <= getTimeNumber(item))
        if (['deliveryTimeStart'].includes(key)) tmp = tmp.filter(o => o.deliveryTime && getTimeNumber(o.deliveryTime) >= getTimeNumber(item))
        if (['productionTimeEnd'].includes(key)) tmp = tmp.filter(o => o.productionTime && getTimeNumber(o.productionTime) <= getTimeNumber(item))
        if (['productionTimeStart'].includes(key)) tmp = tmp.filter(o => o.productionTime && getTimeNumber(o.productionTime) >= getTimeNumber(item))
        if (['placeOrderTimeEnd'].includes(key)) tmp = tmp.filter(o => o.placeOrderTime && getTimeNumber(o.placeOrderTime) <= getTimeNumber(item))
        if (['placeOrderTimeStart'].includes(key)) tmp = tmp.filter(o => o.placeOrderTime && getTimeNumber(o.placeOrderTime) >= getTimeNumber(item))
        if (['dispatchTimeEnd'].includes(key)) tmp = tmp.filter(o => o.dispatchTime && getTimeNumber(o.dispatchTime) <= getTimeNumber(item))
        if (['dispatchTimeStart'].includes(key)) tmp = tmp.filter(o => o.dispatchTime && getTimeNumber(o.dispatchTime) >= getTimeNumber(item))
        // if (['planStartTimeEnd'].includes(key)) tmp = tmp.filter(o => o.planStartTime && getTimeNumber(o.planStartTime) <= getTimeNumber(item))
        // if (['planStartTimeStart'].includes(key)) tmp = tmp.filter(o => o.planStartTime && getTimeNumber(o.planStartTime) >= getTimeNumber(item))
      }
    }
    productionWIPList.value = tmp
    // console.log(params)
  }

  const setRowStyle = (scope: any) => {
    const scrapRate = scope.row.scrapRate?.replace("%", "");
    if (scrapRate > 0.5) {
      return {
        backgroundColor: 'rgb(241,80,96)',
      }
    }

    // const now = new Date();
    // if(now.getTime() >  new Date(scope.row.deliveryTime).getTime()){
    //   return {
    //     backgroundColor: 'rgb(227,125,125)',
    //   }
    // }
    // if(dayjs(now).add(2,"days").diff(dayjs(scope.row.deliveryTime)) > 0){
    //   return {
    //     backgroundColor: 'rgb(255,255,0)',
    //   }
    // }
    if (scope.row.isDeliveryPassed) {
      return {
        backgroundColor: 'rgb(227,125,125)',
      }
    }
    if (scope.row.isDeliveryInTowDays) {
      return {
        backgroundColor: 'rgb(255,255,0)',
      }
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

  /*导出*/
  const exportToExcel = async () => {
    // proxy?.download('production/production/export', {
    //   ...queryParams.value, tableName: "productionWIP"
    // }, `生产WIP_${new Date().getTime()}.xlsx`);


    var num = productionWIPList.value.length;
    // columnList.value

    if (!productionWIPList.value?.length) {
      return;
    }
    const temColumnList = prodTable.value?.toolList && prodTable.value.toolList.filter((item: any) => item.field && item.title && item.visible).sort((a:any, b:any) => a.sortIndex - b.sortIndex) || columnList.value
    var result = productionWIPList.value.map((item, index) => {
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
    ws["A1"] = { v: `${currentDate} 生产WIP` };

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
        `${currentDate}-生产WIP.xlsx`
      );
    } catch (e) {
      // this.$message.error(e);
    }
  }

  /** 搜索按钮操作 */
  const handleQuery = async () => {
    await getList();
    searchChange(tempQuery.value)
  }

  onMounted(() => {
    getList()
    getDictOptions()
  });
</script>

<style lang="scss">

</style>

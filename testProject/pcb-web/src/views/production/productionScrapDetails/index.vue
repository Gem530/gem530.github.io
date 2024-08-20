<template>
  <div class="p-2 xtable-page">
    <div class="search">
      <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="100px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="开始日期" prop="cusId">
              <el-date-picker size="small"
                              v-model="queryParams.startTime"
                              :disabled-date="disabledDateStart"
                              type="date"
                              placeholder="选择开始时间" value-format="YYYY-MM-DD 00:00:00" format="YYYY-MM-DD"/>

            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="结束日期" prop="cusId">
              <el-date-picker size="small"
                              v-model="queryParams.endTime"
                              :disabled-date="disabledDateEnd"
                              type="date"
                              placeholder="选择结束时间" value-format="YYYY-MM-DD 23:59:59" format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="global-flex flex-end">
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="exportOrder">导出订单</el-button>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" class="xtable-card">
      <div style="height: 70%;width:100%">
        <XTable toolId="productionScrapDetail"
                style="height: 100%;"
                height="100%"
                :pageShow="false"
                v-loading="loading"
                :data="scrapList"
                :columnList="columnList"
                border :showRefresh="true"
                class="xtable-content"
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                @cell-click="handleCellClick"
                show-footer
                :footer-method="footerMethod"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id',isCurrent:'true' }"
                :scroll-y="{enabled: true,gt: 50}"
        >
          <template #default-scrapArea="scope">
            {{(scope.row.pcsQuantity / scope.row.saleOrderVo.unitedNumber * scope.row.saleOrderVo.unitedLength *
            scope.row.saleOrderVo.unitedWidth / 1000000).toFixed(4)}}
          </template>
          <template #default-reasonId="scope">
            {{reasonOptions.find(v => v.id == scope.row.reasonId)?.discardReason}}
          </template>
          <template #default-craftId="scope">
            {{craftOptions.find(v => v.id == scope.row.craftId)?.craftName}}
          </template>

        </XTable>
      </div>
      <div style="height: 30%;width: 100%">
        <XTable toolId="productionScrapDetails"
                style="height: 100%;"
                height="100%"
                :pageShow="false"
                v-loading="loading"
                :data="scrapDetailList"
                :columnList="columnDetailList"
                border
                class="xtable-content"
                show-footer
                :footer-method="footerMethodDetail"
                :column-config="{ resizable: true }"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }"
        >
          <template #default-orderCode="scope">
            {{currentInfo.saleOrderVo?.code}}
          </template>
          <template #default-placeOrderTime="scope">
            {{currentInfo.saleOrderVo?.placeOrderTime}}
          </template>
          <template #default-dispatchTime="scope">
            {{currentInfo.saleOrderVo?.dispatchTime}}
          </template>
          <template #default-orderType="scope">
            {{resDictData.order_type.find(item => item.dictValue == currentInfo.saleOrderVo?.orderType)?.dictLabel }}
          </template>
          <template #default-model="scope">
            {{resDictData.order_model.find(item => item.dictValue == currentInfo.saleOrderVo?.model)?.dictLabel }}
          </template>
          <template #default-urgent="scope">
            {{resDictData.order_urgent.find(item => item.dictValue == currentInfo.saleOrderVo?.urgent)?.dictLabel }}
          </template>
          <template #default-commodityCode="scope">
            {{currentInfo.saleOrderVo?.commodityCode}}
          </template>
          <template #default-commodityName="scope">
            {{currentInfo.saleOrderVo?.commodityName}}
          </template>
          <template #default-customerCode="scope">
            {{currentInfo.saleOrderVo?.customerCode}}
          </template>
          <template #default-orderQuantity="scope">
            {{currentInfo.saleOrderVo?.quantity}}
          </template>
          <template #default-productionPcsQuantity="scope">
            {{scope.row.pnlQuantity * scope.row.setPerPnl * currentInfo.saleOrderVo?.unitedNumber}}
          </template>

          <template #default-scrapQuantity="scope">
            {{scope.row.pcsQuantity}}
          </template>
          <template #default-area="scope">
            {{(scope.row.pcsQuantity / currentInfo.saleOrderVo?.unitedNumber * currentInfo.saleOrderVo?.unitedLength *
            currentInfo.saleOrderVo?.unitedWidth / 1000000).toFixed(4)}}
          </template>
          <template #default-reasonId="scope">
            {{reasonOptions.find(v => v.id == scope.row.reasonId)?.discardReason}}
          </template>
          <template #default-craftId="scope">
            {{craftOptions.find(v => v.id == scope.row.craftId)?.craftName}}
          </template>
          <template #default-responsible="scope">
            <span v-if="scope.row.type=='1'">{{scope.row.responsibleUserName}}</span>
            <span v-if="scope.row.type=='2'">{{scope.row.supplierName}}</span>
          </template>
          <template #default-singleLength="scope">
            {{currentInfo.saleOrderVo?.singleLength}}
          </template>
          <template #default-singleWidth="scope">
            {{currentInfo.saleOrderVo?.singleWidth}}
          </template>
          <template #default-unitedNumber="scope">
            {{currentInfo.saleOrderVo?.unitedNumber}}
          </template>
          <template #default-unitedWay="scope">
            {{currentInfo.saleOrderVo?.unitedWayLength}} * {{currentInfo.saleOrderVo?.unitedWayWidth}}
          </template>
          <template #default-materialLayer="scope">
            {{currentInfo.saleOrderVo?.materialLayer}}
          </template>
          <template #default-commodityThickness="scope">
            {{currentInfo.saleOrderVo?.commodityThickness}}
          </template>
          <template #default-materialCopperOutside="scope">
            {{currentInfo.saleOrderVo?.materialCopperOutside}}
          </template>
          <template #default-materialQuality="scope">
            {{currentInfo.saleOrderVo?.materialQuality}}
          </template>
          <template #default-materialBrand="scope">
            {{currentInfo.saleOrderVo?.materialBrand}}
          </template>
          <template #default-surfaceTreatment="scope">
            {{currentInfo.saleOrderVo?.surfaceTreatment}}
          </template>
          <template #default-goldenThickness="scope">
            {{currentInfo.saleOrderVo?.goldenThickness}}
          </template>
          <template #default-commoditySolder="scope">
            {{currentInfo.saleOrderVo?.commoditySolder}}
          </template>
          <template #default-characterColor="scope">
            {{currentInfo.saleOrderVo?.characterColor}}
          </template>
          <template #default-commodityTestWay="scope">
            {{currentInfo.saleOrderVo?.commodityTestWay}}
          </template>
          <template #default-specialRequirement="scope">
            {{currentInfo.saleOrderVo?.specialRequirement}}
          </template>
        </XTable>
      </div>
    </el-card>
  </div>
</template>

<script setup name="ProductionScrapDetails" lang="ts">
  import {getDetailByIds, getScrapDetails} from "@/api/production/scrap";
  import {ref} from "vue";
  import {getCraftList, getUserByCraftId} from "@/api/basedata/craft";
  import {getListDiscardReason} from "@/api/basedata/discardReason";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import dayjs from "dayjs";
  import { deepClone } from "@/utils";

  import * as xlsx from 'xlsx';
  // import * as xlsxs from 'xlsx-style-vite'
  // import xlsxs from "xlsx-style";// vue3不支持
  import fileSaver from "file-saver";

  const loading = ref(false);
  const total = ref(0);
  const scrapList = ref([]);
  const scrapDetailList = ref([]);
  const craftOptions = ref<any[]>([]);
  const reasonOptions = ref<any[]>([]);

  let initQueryParams = {
    startTime: dayjs(new Date()).subtract(10,"day").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    code: undefined,
    //reasonId: "",
    params: {}
  }

  let queryParams = ref<any>({
    ...initQueryParams
  });

  const disabledDateStart = (data: any) => {
    let res = false
    if (queryParams.value.endTime) {
      if (new Date(queryParams.value.endTime).getTime() < new Date(data).getTime()) {
        res = true
      }
    }
    return res
  }
  const disabledDateEnd = (data: any) => {
    let res = false
    if (queryParams.value.startTime) {
      if (new Date(queryParams.value.startTime).getTime() > new Date(data).getTime()) {
        res = true
      }
    }
    return res
  }

  const getList = async () => {
    loading.value = true;
    const res = await getScrapDetails(queryParams.value);
    scrapList.value = res.data
    loading.value = false;
  }

  const getDetail = async () => {
    const req = {
      idList: currentInfo.value.ids.split(',')
    }
    const res = await getDetailByIds(req);
    scrapDetailList.value = res.data;
  }

  const columnList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '产品编码',
      field: 'saleOrderVo.commodityCode',
      width: '120',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    {
      title: '产品名称',
      field: 'saleOrderVo.commodityName',
      width: '120',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    {
      title: '客户编码',
      field: 'saleOrderVo.customerCode',
      width: '120',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    {
      width: "120",
      title: '单片长(mm)',
      field: 'saleOrderVo.singleLength',
      align: 'center',
    },
    {
      width: "120",
      title: '单片宽(mm)',
      field: 'saleOrderVo.singleWidth',
      align: 'center',
    },
    {
      width: "120",
      title: 'pcs/set',
      field: 'saleOrderVo.unitedNumber',
      align: 'center',
    },
    {
      width: "120",
      title: '报废项目',
      field: 'reasonId',
      align: 'center',
      filterType: 'select',
      filterParam: {
        placeholder: '请选择报废项目',filterable: true
      },
      filterData: () => reasonOptions.value,
      filterCustom: {label: 'discardReason', value: 'id'}
    },
    {
      width: "120",
      title: '报废工序',
      field: 'craftId',
      align: 'center',
      filterType: 'select',
      filterParam: {
        placeholder: '请选择报废工序',filterable: true
      },
      filterData: () => craftOptions.value,
      filterCustom: {label: 'craftName', value: 'id'}
    },
    {
      width: "120",
      title: '报废次数',
      field: 'quantity',
      align: 'center'
    },
    {
      width: "120",
      title: '报废数量(pcs)',
      field: 'pcsQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '报废面积(㎡)',
      field: 'scrapArea',
      align: 'center'
    },
     {
      width: "160",
      title: '报废时间',
      field: 'scrapTime',
      align: 'center'
    },
  ]);

  const columnDetailList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '报废日期',
      field: 'createTime',
      width: '120',
      align: 'center'
    },
    {
      title: '流转卡号',
      field: 'productionCardCode',
      width: '120',
      align: 'center'
    },
    {
      title: '排产单号',
      field: 'productionCode',
      width: '120',
      align: 'center'
    },
    {
      title: '合同编号',
      field: 'orderCode',
      width: '120',
      align: 'center'
    },
    {
      title: '下单日期',
      field: 'placeOrderTime',
      width: '120',
      align: 'center'
    },
    {
      title: '交货日期',
      field: 'dispatchTime',
      width: '120',
      align: 'center'
    },
    {
      title: '新/返',
      field: 'orderType',
      width: '120',
      align: 'center'
    },
    {
      title: '批/样',
      field: 'model',
      width: '120',
      align: 'center'
    },
    {
      title: '加急',
      field: 'urgent',
      width: '120',
      align: 'center'
    },
    {
      title: '产品编码',
      field: 'commodityCode',
      width: '120',
      align: 'center'
    },
    {
      title: '产品名称',
      field: 'commodityName',
      width: '120',
      align: 'center'
    },
    {
      title: '客户编号',
      field: 'customerCode',
      width: '120',
      align: 'center',
    },
    {
      title: '订单数(pcs)',
      field: 'orderQuantity',
      width: '120',
      align: 'center'
    },
    {
      title: '实投数(pcs)',
      field: 'productionPcsQuantity',
      width: '120',
      align: 'center'
    },
    {
      title: '报废数(pcs)',
      field: 'scrapQuantity',
      width: '120',
      align: 'center'
    },
    {
      title: '面积(㎡)',
      field: 'area',
      width: '120',
      align: 'center'
    },
    {
      title: '报废项目',
      field: 'reasonId',
      width: '120',
      align: 'center'
    },
    {
      title: '报废工序',
      field: 'craftId',
      width: '120',
      align: 'center'
    },
    {
      title: '责任人',
      field: 'responsible',
      width: '120',
      align: 'center'
    },
    {
      title: '操作人',
      field: 'createByName',
      width: '120',
      align: 'center'
    },
    {
      width: "120",
      title: '单片长(mm)',
      field: 'singleLength',
      align: 'center',
    },
    {
      width: "120",
      title: '单片宽(mm)',
      field: 'singleWidth',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入单位ID'}
    },
    {
      width: "120",
      title: 'pcs/set',
      field: 'unitedNumber',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入单位ID'}
    },
    {
      title: '连片方式',
      field: 'unitedWay',
      width: '120',
      align: 'center'
    },
    {
      title: '板层',
      field: 'materialLayer',
      width: '120',
      align: 'center'
    },
    {
      title: '板厚(mm)',
      field: 'commodityThickness',
      width: '120',
      align: 'center'
    },
    {
      title: '成品铜厚',
      field: 'materialCopperOutside',
      width: '120',
      align: 'center'
    },
    {
      title: '板材',
      field: 'materialQuality',
      width: '120',
      align: 'center'
    },
    {
      title: '品牌',
      field: 'materialBrand',
      width: '120',
      align: 'center'
    },
    {
      title: '表面处理',
      field: 'surfaceTreatment',
      width: '120',
      align: 'center'
    },
    {
      title: '金厚/u',
      field: 'goldenThickness',
      width: '120',
      align: 'center'
    },
    {
      title: '阻焊',
      field: 'commoditySolder',
      width: '120',
      align: 'center'
    },
    {
      title: '字符',
      field: 'characterColor',
      width: '120',
      align: 'center'
    },
    {
      title: '测试方式',
      field: 'commodityTestWay',
      width: '120',
      align: 'center'
    },
    {
      title: '特殊要求',
      field: 'specialRequirement',
      width: '120',
      align: 'center'
    },
  ]);

  let resDictData = ref({
    //加急
    order_urgent: [],
    //订单类型
    order_type: [],
    //批量/样品
    order_model: [],
    //板材
    order_material_quality: [],
    //成品板厚
    finish_plate_thickness: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //表面处理
    order_surface_treatment: [],
    //阻焊颜色
    order_commodity_solder: [],
    //字符颜色
    order_character: [],
    //币种
    currency_type: [],
    //包装要求
    order_packaging_requirements: [],
    //付款方式
    payment_method: [],
    //运输方式
    shipping_type: [],
    //板材品牌
    order_plate_brand: [],
    //板材级别
    order_material_level: [],
    //阻焊面数
    order_commodity_solder_count: [],
    //阻焊光泽
    order_commodity_solder_gloss: [],
    //字符面数
    order_character_count: [],
    //成型方式
    order_commodity_form: [],
    //测试方式
    order_commodity_testway: [],
    //过孔要求
    order_hole_requirement: [],
    //检验标准
    order_inspection_standard: [],
    //产品类型
    sys_commodity_type: [],
  })

  const currentInfo = ref({});

  const handleCellClick = ({row}: any) => {
    currentInfo.value = row;
    getDetail();
  }

  // 初始化表格组件的搜索条件
  const initTableSearch = () => {
    const tempParam = Object.keys(initQueryParams)
    Object.keys(queryParams.value).forEach(key => {
      if (!tempParam.includes(key)) {
        queryParams.value[key] = undefined
      }
    })
  }
  // 获取 搜索条件
  const searchChange = (params: any) => {
    // queryParams.value = deepClone(initQueryParams) ;
    initTableSearch()
    Object.keys(params).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".")+1);
        queryParams.value[queryParamsKey] = params[key];
      }else {
        if (params[key] !== null && params[key] !== undefined) {
          console.log(params[key])
          queryParams.value[key] = params[key];
        }
      }
    });
    getList()
    scrapDetailList.value = [];
  }

  /**
   * 查询工艺列表
   */
  const getListCraft = async () => {
    const res = await getCraftList();
    craftOptions.value = res.data;
  };

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_urgent,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_plate_brand,order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type";
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

  /**
   * 查询报废原因列表
   */
  const getListReason = async () => {
    const res = await getListDiscardReason({});
    reasonOptions.value = res.data;
    
    reasonOptions.value.push({id:'0',discardReason:'订单完成自动报废'});
  };

  /** 搜索按钮操作 */
  const handleQuery = () => {
    getList();
  }

  // 导出订单
  const exportOrder = () => {
    if (!scrapList.value?.length) {
      // ElMessage.info("请选择需要导出的数据");
      return;
    }
    var result = scrapList.value.map((item, index) => {
      return {
        //序号
        index: index + 1,
        //产品编码
        commodityCode: item.saleOrderVo.commodityCode,
        //产品名称
        commodityName: item.saleOrderVo.commodityName,
        //客户编码
        customerCode: item.saleOrderVo.customerCode,
        //单片长(mm)
        singleLength: item.saleOrderVo.singleLength,
        //单片宽(mm)
        singleWidth: item.saleOrderVo.singleWidth,
        //pcs/set
        unitedNumber: item.saleOrderVo.unitedNumber,
        //报废项目
        reasonId: reasonOptions.value.find((v: any) => v.id == item.reasonId)?.discardReason,
        //报废工序
        craftId: craftOptions.value.find((v: any) => v.id == item.craftId)?.craftName,
        //报废次数
        quantity: item.quantity,
        //报废数量(pcs)
        pcsQuantity: item.pcsQuantity,
        //报废面积(㎡)
        // {{(scope.row.pcsQuantity / scope.row.saleOrderVo.unitedNumber * scope.row.saleOrderVo.unitedLength *
          // scope.row.saleOrderVo.unitedWidth / 1000000).toFixed(4)}}
        scrapArea: (item.pcsQuantity / item.saleOrderVo.unitedNumber * item.saleOrderVo.unitedLength * item.saleOrderVo.unitedWidth / 1000000).toFixed(4),
        //报废时间
        scrapTime: item.scrapTime
      }
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
    ws["A1"] = { v: `${currentDate} 报废明细表` };

    //列名
    xlsx.utils.sheet_add_aoa(ws, [['序号','产品编码', '产品名称', '客户编码','单片长(mm)', '单片宽(mm)',
        'pcs/set', '报废项目', '报废工序', '报废次数', '报废数量(pcs)', '报废面积(㎡)', '报废时间'
      ]],
      { origin: "A2" });

    ws["!cols"] = [{ wch: 6 }, { wch: 17 }, { wch: 20 }, { wch: 8 }, { wch: 12 }, { wch: 12 },
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },{ wch: 8 }, { wch: 8 }
    ];

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
        `${currentDate}-报废明细.xlsx`
      );
    } catch (e) {
      // this.$message.error(e);
    }
  }
  const sumNum = (list: OrderVO[], field: string) => {
    let count = 0;
    list.forEach(item => {
      // console.log(field + ': --' + item[field])
      if (field == 'scrapArea') {
        count += (item.pcsQuantity / item.saleOrderVo.unitedNumber * item.saleOrderVo.unitedLength * item.saleOrderVo.unitedWidth / 1000000)
      } else if (field == 'productionPcsQuantity') {
        count += item.pnlQuantity * item.setPerPnl * (currentInfo.value.saleOrderVo?.unitedNumber || 0)
      } else if (field == 'area') {
        count += (item.pcsQuantity / currentInfo.value.saleOrderVo?.unitedNumber * currentInfo.value.saleOrderVo?.unitedLength * currentInfo.value.saleOrderVo?.unitedWidth / 1000000)
      } else if (field == 'saleOrderVo.orderQuantity') {
        count += currentInfo.value.saleOrderVo?.quantity
      } else {
        count += Number(item[field] || 0);
      }
    });
    return Number(count.toFixed(4));
  };

  const footerMethod: VxeTablePropTypes.FooterMethod<OrderVO> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == "saleOrderVo.commodityCode") {
          return `${scrapList.value?.length || 0} `;
        }
        if (column.field == "pcsQuantity") {
          return `${sumNum(data, "pcsQuantity")} `;
        }
        if (column.field == "scrapArea") {
          // (item.pcsQuantity / item.saleOrderVo.unitedNumber * item.saleOrderVo.unitedLength * item.saleOrderVo.unitedWidth / 1000000).toFixed(4)
          return `${(sumNum(data, "scrapArea") || 0).toFixed(4)} `;
        }
        return "";
      })
    ];
  };

  const footerMethodDetail: VxeTablePropTypes.FooterMethod<OrderVO> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == "createTime") {
          return `${scrapDetailList.value?.length || 0} `;
        }
        if (column.field == "orderQuantity") {
          return `${sumNum(data, "saleOrderVo.orderQuantity")} `;
        }
        if (column.field == "productionPcsQuantity") {
          return `${sumNum(data, "productionPcsQuantity")} `;
        }
        if (column.field == "scrapQuantity") {
          return `${sumNum(data, "pcsQuantity")} `;
        }
        if (column.field == "area") {
          // (item.pcsQuantity / item.saleOrderVo.unitedNumber * item.saleOrderVo.unitedLength * item.saleOrderVo.unitedWidth / 1000000).toFixed(4)
          return `${(sumNum(data, "area") || 0).toFixed(4)} `;
        }
        return "";
      })
    ];
  };

  onMounted(() => {
    getList()
    getListCraft()
    getListReason()
    getDictOptions()
  });
</script>

<style lang="scss">

</style>

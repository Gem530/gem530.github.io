<template>
  <div class="p-2">
    <el-row>
      <el-col :span="24">
        <el-card class="el-card" shadow="always">
          <p class="tipClass">提示：数值分别是 面积（m²）、总金额（元）、平米金额（元/m²）； 统一币种：RMB； 起始日期：每月1号；</p>
          <el-row>
            <el-col :span="4" :xs="{span: 24}" class="searchDate">
              <span>看板日期：</span>
              <el-date-picker v-model="form.queryTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                :disabled-date="pickerOptions"
                value-format="YYYY-MM-DD 23:59:59" @change="handleQuery"  />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="mainCard" v-loading="loading">
      <el-col :span="8" :xs="{span: 24}" class="cardCol" v-for="type in typeList" :key="type.value">
        <el-card class="el-card" shadow="always">
          <template #header>
              <div style="display: flex;justify-content: space-between; align-items: center;">
                <div class="card-header cardTitle"><span>{{ type.label }}</span></div>
                <div>
                  <span style="font-size: 14px; color: #1677FF;font-weight: bold;">截止时间至{{stopTime}}</span>
                </div>
              </div>
          </template>
          <el-row>
            <el-col :span="8" :xs="{span: 24}" class="cardCol" v-for="_dateType in dateTypeList" :key="_dateType.value">
              <el-card class="cardClass" shadow="hover"
                v-for="item in saleDashboardList.filter(item => item.type === type.value && item.dateType == _dateType.value)"
                :key="item.id"
                @click="openDetail(item)"
                >
                <template #header>
                  <div class="card-header headTitle">
                    <span>{{ _dateType.label }}{{type.label.includes('送货')?'送货':'下单'}}</span>
                    <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </div>

                </template>
                <div class="cardData" v-if="item.dateType = _dateType.value">
                  <span class="infoItem">{{ item.area ? Number(item.area) : 0 }}</span>
                  <span class="infoItem">{{ item.totalAmount ? Number(item.totalAmount) : 0 }}</span>
                  <span class="infoItem">{{ item.squareMetersAmount ? Number(item.squareMetersAmount) : 0
                  }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
    </el-row>
    <!-- 详情弹窗 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="60%">

      <div class="global-flex flex-between" style="width: 100%;margin-bottom: 10px;">
        <!-- 居左 -->
        <el-select v-model="currentDataType" @change="handleDetailDateType"
        >
          <!-- label拼接type.label -->
          <el-option v-for="item in dateTypeList" :key="item.value"
                     :label="`${item.label}${typeList.filter(type => type.value === currentType)[0].label.includes('送货')?'送货':'下单'}`"
                     :value="item.value"
          />
        </el-select>
        <!-- 居右 -->
        <el-button type="primary" @click="exportData">导出</el-button>
      </div>
      <XTable
        :toolId="`saleDashboardDetailList`"
        ref="newVxeTableRef"
        height="500"
        :pageShow="false"
        class="xtable-content"
        :span-method="mergeCells"
        :data="detailList"
        :columnList="columnList"
        :footer-method="footerMethod"
        width="100%"
        show-footer
        border
        :cell-style="cellStyle"
        :footer-cell-style="cellStyle"
        :footer-span-method="footerSpanMethod"
        :column-config="{ resizable: true }"
      >

        <template #default-orderMiType="{row}">
          {{ resDictData?.order_type.find(v => v.dictValue == row.orderMiType)?.dictLabel }}
        </template>


      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">

          <el-button style="width: 160px;" @click="dialog.visible=false">关&nbsp;&nbsp;&nbsp;&nbsp;闭</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="SaleDashboard" lang="ts">
import { getDashboardInfo,getDashboardInfoDetail } from '@/api/order/saleDashboard';
import { SaleDashboardForm, SaleDashboardQuery, SaleDashboardVO, OrderTypeEnum } from '@/api/order/saleDashboard/types';
import { ref } from "vue";
import dayjs from "dayjs";
import {getDicts} from "@/api/system/dict/data";
import {sortBy} from "@/utils/dict";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const stopTime = ref();
const saleDashboardList = ref<SaleDashboardVO[]>([]);
const saleDashboardDetailList = ref<any[]>([]);
const todayOrderList = ref<SaleDashboardVO[]>([]);
const todayOrderDetailList = ref<any[]>([]);
const detailList = ref<any[]>([]);
  const newVxeTableRef = ref();
const typeList = [
  { label: '下单情况', value: "1" },
  { label: '下单情况(本厂)', value: "2" },
  { label: '下单情况(外协)', value: "3" },
  { label: '送货情况(包含退货)', value: "4" },
  { label: '送货情况(包含退货)(本厂)', value: "5" },
  { label: '送货情况(包含退货)(外协)', value: "6" },
];
const materialLayerList = [
  { label: '单层板', value: "1" },
  { label: '双面板', value: "2" },
  { label: '三层板', value: "3" },
  { label: '四层板', value: "4" },
  { label: '六层板', value: "6" },
  { label: '八层板', value: "8" },
];
const dateTypeList = ref([
  { label: '当日', value: "1" },
  { label: '本周', value: "2" },
  { label: '当月', value: "3" },
]);
const columnList = ref([
  { title: "", field: 'materialLayer', align: 'center',  },
  { title: '', field: 'orderMiType',  align: 'center',},
  { title: '款数', field: 'commodityCount',  align: 'center' },
  { title: '面积(㎡)',  field: 'area', align: 'center' },
  {title: '平米价(元/㎡)',   field: 'squareMetersAmount', align: 'center'},
  { title: '总金额(元)',  field: 'totalAmount', align: 'center', },

]);
let resDictData = ref({

    //订单类型
    order_type: [],

  })
const footerMerge = computed(() => [
  { row: 0, col: 0, rowspan: 1, colspan: 2 }
])
function footerSpanMethod ({ column }) {
  if (column.field == 'materialLayer') {
    return { rowspan: 1, colspan: 2 };
  }
  if (column.field == 'orderMiType') {
    return { rowspan: 0, colspan: 0 };
  }
}
function cellStyle ({ column }) {
  if (column.field == 'orderMiType') {
    return { background: 'var(--vxe-table-header-background-color) !important' };
  }
  if (column.field == 'materialLayer') {
    return { background: 'var(--vxe-table-header-background-color) !important' };
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
const loading = ref(true);
const total = ref(0);
// 详情弹窗
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: SaleDashboardForm = {
  id: undefined,
  queryTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
}
const data = reactive<PageData<SaleDashboardForm, SaleDashboardQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    queryTime: undefined,
    params: {}
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  queryParams.value.queryTime = form.value.queryTime;
  getList();
  getListDetail();
}

/**
 * 打开详情
 */
const detail = ref();
const currentDataType = ref();
const currentType = ref();
const openDetail = (item: any) => {

  detail.value = item;
  currentDataType.value = item.dateType;
  currentType.value = item.type;
  dialog.title = typeList.filter(type => type.value === item.type)[0].label + '-明细详情';
  dialog.visible = true;
  console.log("saleDashboardDetailList", saleDashboardDetailList.value);

  todayOrderDetailList.value = saleDashboardDetailList.value.filter(detail => item.type === detail.type);
  console.log("todayOrderDetailList", todayOrderDetailList.value);

  detailList.value = todayOrderDetailList.value.filter(detail => item.dateType === detail.dateType)[0].saleDashboardDetailInfoVoList;
  // newVxeTableRef.value?.xTableRef?.setMergeCells(mergeCellsMethod.value);
  // setTimeout(() => {
  //   newVxeTableRef.value?.xTableRef?.setMergeFooterItems(footerMerge.value)
  // }, 100)
}
/**
 * 单元格合并方法
 * @param row
 * @param items
 * @param seq
 * @param rowIndex
 * @param $rowIndex
 * @param _rowIndex
 * @param column
 * @param data
 * @returns {{colspan: number, rowspan: number}}
 */
const mergeCells = ({row, items, seq, rowIndex, $rowIndex, _rowIndex, column, data}) => {
  if (column.property === "materialLayer") {
    // code的合并
    const referenceField = "materialLayer";
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

// 表格尾部合计
const footerMethod = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == 'index') {
        return columns.length;
      }
      if (column.field == "area") {
        return `${Number(sumNum(data, "area").toFixed(4))} `;
      }
      if (column.field == "totalAmount") {
        return `${Number(sumNum(data, "totalAmount").toFixed(2))} `;
      }
      if (column.field == "commodityCount") {
        return `${Number(sumNum(data, "commodityCount").toFixed(4))}`;
      }
      if (column.field == "squareMetersAmount") {
        const totalSum = sumNum(data, "totalAmount");
        const countSum = sumNum(data, "area");
        // 避免除以零的情况
        if (countSum === 0) {
          return "0"; // 或者任何适合表示无法计算的字符串
        }
        return `${Number((totalSum / countSum).toFixed(2))}`;
      }
      return "";
    })
  ];
}
const sumNum = (list: any[], field: string) => {
  let count = 0;
  list.forEach(item => {
    count += Number(item[field]);
  });
  return Number(count.toFixed(4));
};
/**
 * 导出数据
 */
const exportData = async () => {
  const $table = newVxeTableRef.value.xTableRef;
  if ($table) {
    $table.exportData({
      type: 'xlsx',
      data: detailList.value,
      useStyle: true, //是否导出样式
      sheetName: typeList.filter(type => type.value === currentType.value)[0].label + '详情',
      filename: typeList.filter(type => type.value === currentType.value)[0].label + '详情_' + dayjs(new Date()).format("YYYYMMDD"),
      isMerge: true, //是否合并单元格

    })
  }
}
/**
 * 更换时间类型
 * @param val
 */
const handleDetailDateType = async (val: any) => {
  console.log("handleDetailDateType", val);
  console.log("todayOrderDetailList", todayOrderDetailList.value);
  let list = todayOrderDetailList.value.filter(detail => val == detail.dateType);
  console.log("list", list);
  detailList.value = list[0].saleDashboardDetailInfoVoList;
  console.log("detailList", detailList.value);

}
const mergeCellsMethod = computed({
  get() {
    nextTick(() => {

      const mergeCells: any = [];
      const referenceFields = ["orderMiType"];
      for (let rowIndex = 0; rowIndex < detailList.value.length; rowIndex++) {
        const row = detailList.value[rowIndex];
        const prevRow = detailList.value[rowIndex - 1];
        let nextRow = detailList.value[rowIndex + 1];

        if (rowIndex > 0 && referenceFields.every(field => row[field] === prevRow[field])) {
          // 当前行与前一行相同，不显示当前行
          continue;
        }
        let countRowspan = 1;

        while (nextRow && referenceFields.every(field => nextRow[field] === row[field])) {
          nextRow = detailList.value[++countRowspan + rowIndex];
        }
        if (countRowspan > 1 && newVxeTableRef.value?.xTableRef) {
          // 需要合并的情况
          referenceFields.forEach((field, colIndex) => {

            const col = getColumnIndex(field); // 获取列索引
            mergeCells.push({row: rowIndex, col, rowspan: countRowspan, colspan: 1});
          });
        }
      }
      console.log("mergeCells", mergeCells);

      return mergeCells;

    });
  },
  set(val: any) {
    return val
  }
})

const getColumnIndex = (field: any) => {
  const columns = newVxeTableRef.value?.xTableRef?.getColumns();
  const columnIndex = columns.findIndex(col => col.field === field);
  return columnIndex;
};


const getList = async () => {
  loading.value = true;
  const _queryTime = dayjs(queryParams.value.queryTime).format("YYYY-MM-DD");
  const _nowTime = dayjs(new Date()).format("YYYY-MM-DD");
  //查询日期为当前时间时，显示截止时间为当前时间，否则显示为查询日期的23:59:59
  console.log("======getList",_queryTime,_nowTime);
  if(_queryTime==_nowTime){
    stopTime.value = dayjs(new Date()).format("YYYY-MM-DD HH:mm");
  }else{
    stopTime.value = dayjs(queryParams.value.queryTime).format("YYYY-MM-DD 23:59");
  }
  const res = await getDashboardInfo(queryParams.value);
  saleDashboardList.value = res;
  todayOrderList.value = saleDashboardList.value.filter(item => item.type === OrderTypeEnum.ORDER && item.dateType === OrderTypeEnum.DAY);
  console.log(saleDashboardList.value);
  total.value = res.total;
  loading.value = false;
}

const getListDetail = async () => {
  loading.value = true;
  const _queryTime = dayjs(queryParams.value.queryTime).format("YYYY-MM-DD");
  const _nowTime = dayjs(new Date()).format("YYYY-MM-DD");
  //查询日期为当前时间时，显示截止时间为当前时间，否则显示为查询日期的23:59:59
  console.log("======getList",_queryTime,_nowTime);
  if(_queryTime==_nowTime){
    stopTime.value = dayjs(new Date()).format("YYYY-MM-DD HH:mm");
  }else{
    stopTime.value = dayjs(queryParams.value.queryTime).format("YYYY-MM-DD 23:59");
  }
  const res = await getDashboardInfoDetail(queryParams.value);
  saleDashboardDetailList.value = res.data;

  //console.log(saleDashboardList.value);
  //total.value = res.total;
  //loading.value = false;
}


//限制最大日期选择
const pickerOptions = (time:any) => {
      return time.getTime() > Date.now();
}
const cancel = () => {
}
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let str = "hello";
str = capitalizeFirstLetter(str);
onMounted(() => {
  getList();
  getListDetail();
  getDictOptions();
});

</script>
<style lang="scss" scoped>
:deep(.el-card__header) {
  padding: 18px 20px !important;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.searchDate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  word-break: keep-all;
}

.tipClass {
  text-align: left;
  color: #1677FF;
  font-weight: bold;
}

.mainCard {
  padding-top: 5px;
}

.cardCol {
  padding-left: 0px;
  padding-right: 5px;
}

.cardClass {
  border: 1px solid #409EFF;
  border-radius: 20px;
  background-color: #F8F9FC;
}

.headTitle {
  position: relative;
  text-align: center;
  color: rgb(64, 158, 255);
  font-size: 22px;
  line-height: 20px;
  .el-icon {
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translate(0, -50%);
  }
}

.cardTitle {
  text-align: left;
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
}

.cardData {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.infoItem {
  justify-content: space-between;
  height: 40px;
  line-height: 24px;
  font-size: 28px;
  @media screen and (max-width: 1600px) {
    font-size: 24px;
  }
}</style>

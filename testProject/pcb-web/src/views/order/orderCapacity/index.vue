<template>
  <div class="p-2 xtable-page">

    <div class="search" style="height:50px">
      <el-form :model="queryParams" ref="queryFormRef" label-width="75px"
               class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="查询日期：">
            <!-- <interval-date ref="timeRef" class="init-date" v-model="queryTime" :start-params="queryParams.startTime" :end-params="queryParams.endTime">
            </interval-date> -->
                <el-date-picker ref="timeRef" class="init-date" v-model="queryTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                value-format="YYYY-MM-DD 23:59:59" @change="handleQuery" :clearable="false" />

            </el-form-item>
          </el-col>

          <el-col :span="4" >
            <!-- <el-button @click="handleQuery" type="primary">查询</el-button> -->
            <el-button @click="reset">重置</el-button>
          </el-col>
          <el-col :span="16" >
              <div class="totalTitle">
                当日已下单总款数:{{ totalQuantity }}&nbsp;&nbsp;|&nbsp;&nbsp; 当日已下单总面积：{{ totalArea.toFixed(4) }}㎡&nbsp;&nbsp;|&nbsp;&nbsp;
                当月已下单总款数:{{ month_totalQuantity }}&nbsp;&nbsp;|&nbsp;&nbsp; 当月已下单总面积：{{ month_totalArea.toFixed(4) }}㎡
              <span style="width: 10px;margin-left: 7px"></span>
              <el-button @click="exportData" type="primary">导出</el-button>
              </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <vxe-table
      id="orderData"
      ref="tableRef"
      :class="tableData&&tableData.length>0?'borderBoldTable':''"
      :size="tableSize"
      :column-config="{resizable: true}"
      :data="tableData"
      header-row-class-name="boldHeader"
      align="center"
      :cell-style="cellStyle"
      border
      show-overflow
      height="90%"
      :row-config="{height: 40}"
      :loading="tableLoading"
      :export-config="{}"
    >
      <vxe-column field="colName" fixed="left" title="" width="120"></vxe-column>

      <vxe-colgroup :title="item" v-for="(item, index) in tableList" :key="item">
        <vxe-column title="当日款数" width="90" :field="`list${index}.sumQuantity`"></vxe-column>
        <!-- <vxe-column title="面积(㎡)" width="80" :field="`list${index}.sumArea`">
          <template #default="{row}">
            {{Number(row[`list${index}`]?.sumArea || 0).toFixed(4)}}
          </template>
        </vxe-column>
        <vxe-column title="金额" width="100" :field="`list${index}.sumPrice`">
          <template #default="{row}">
            {{row[`list${index}`]?.sumPrice == '/' ? row[`list${index}`]?.sumPrice : Number(row[`list${index}`]?.sumPrice || 0).toFixed(2)}}
          </template>
        </vxe-column> -->
        <vxe-column title="当月累计款数" width="100" :field="`list${index}.monthSumQuantity`"></vxe-column>
        <!-- <vxe-column title="投料款数" width="70" :field="`list${index}.productionQuantity`"></vxe-column> -->
      </vxe-colgroup>
    </vxe-table>

    <!-- <el-row>
      <el-col :span="24">
        <p class="orderCapacityDesc">1:日期为:报价未下单为:报价提交日期;<span style="color: red;">新单</span>、返单、返单有改/样转批:下单日期</p>
      </el-col>
    </el-row>
    <el-row>
      <p class="orderCapacityDesc">2:合计下单:款数统计<span style="color: red;">新单</span>、返单有改/样转批、返单款数列合计</p>
    </el-row>
    <el-row>
      <p class="orderCapacityDesc">3:当月合计:统计查询日期当月的合计数据:(原有)</p>
    </el-row>
    <el-row>
      <p class="orderCapacityDesc">4:投料款数:根据产品找到已投料的数据，若是拼板几个型号算几款，若同产品则比较订单号，订单号相同算同一款，订单号不同算不同款数分别计算;(原有)</p>
    </el-row>
    <el-row>
      <p class="orderCapacityDesc">5:投料款数根据订单预投模块查询日期区间的对应投料人区分。(跟下单人无关，谁投料就算谁的款数)</p>
    </el-row> -->
  </div>
</template>

<script setup name="OrderCapacity">

import {computed, ref} from "vue";
import {queryCapacity} from "@/api/order/orderCapacity";
import dayjs from "dayjs";
import useAppStore from "@/store/modules/app";

const tableRef = ref();
const timeRef = ref();
const tableList = ref([])
const tableData = ref([])
const tableLoading = ref(false);
const totalQuantity = ref(0);
const totalArea = ref(0);
const totalPrice = ref(0);
const month_totalQuantity = ref(0);
const month_totalArea = ref(0);
const tableSize = computed(() => useAppStore().size === 'small' ? 'mini' : useAppStore().size === 'large' ? 'medium' : 'small')
watch(() => tableSize.value, () => {
  if (tableRef.value) {
    tableRef.value.recalculate(true)
  }
})

// const queryTime = ref([
//   dayjs(new Date()).format('YYYY-MM-DD 00:00:00'), dayjs(new Date()).format('YYYY-MM-DD 23:59:59')
// ])

const queryTime = ref(dayjs(new Date()).format('YYYY-MM-DD 00:00:00'))

/**
 * 查询参数
 */
const queryParams = ref({
  startTime: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
  endTime: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }
});

/**
 * 导出数据
 */
const exportData = () => {
  const $table = tableRef.value;
  const time = queryTime.value;
  if ($table) {
    $table.exportData({
      filename: '销售个人产能统计' +dayjs(time).format("YYYY-MM-DD")
      // + dayjs(time[0]).format("YYYY-MM-DD") +'至'+
      //   dayjs(time[1]).format("YYYY-MM-DD")
        ,
      type: 'xlsx',
      sheetName: '销售个人产能统计',
      useStyle:true //是否导出样式
    })
  }
}

/** 查询按钮操作 */
const handleQuery = () => {
  // const time = queryTime.value;
  // if (!time[0] && !time[1]) {
  //   ElMessage({
  //     type: 'error',
  //     message: '请选择开始时间和结束时间',
  //   })
  //   return;
  // }
  // if (time[0] > time[1]) {
  //   ElMessage({
  //     type: 'error',
  //     message: '开始时间不能大于结束时间',
  //   })
  //   return;
  // }
  tableLoading.value = true;
  QueryDetails();
}

/** 重置按钮操作 */
const reset = () => {
  queryTime.value = dayjs(new Date()).format('YYYY-MM-DD 00:00:00');
  //timeRef.value.initData([dayjs(new Date()).format('YYYY-MM-DD 00:00:00'), dayjs(new Date()).format('YYYY-MM-DD 23:59:59')]);
  nextTick(() => {
    tableLoading.value = true;
    QueryDetails();
  })
}

/**
 * 查询
 */
const QueryDetails = () => {
  const time = queryTime.value;

  queryCapacity({
    placeOrderTimeStart: time,
    placeOrderTimeEnd: time,
    // placeOrderTimeStart: time[0],
    // placeOrderTimeEnd: time[1],
  }).then((res) => {
    // 初始化页面数据
    totalQuantity.value = 0;
    totalPrice.value = 0;
    totalArea.value = 0;

    month_totalQuantity.value = 0;
    month_totalArea.value = 0;

    tableData.value = [];
    tableList.value = res.data?.length && res.data.map((m) => m.name);
    // 无数据不处理
    if (res.data.length > 0) {
      // 构建竖向表头
      let quotationCol = {colName: '报价未下单',};
      let orderCol = {colName: '新单',};
      let returnedCol = {colName: '返单',};
      let returnChangeCol = {colName: '返单有改/样转批',};
      let totalCol = {colName: '合计下单',};
      let feedQuantityCol = {colName: '投料款数',};
      // 处理后台数据
      res.data?.length && res.data.forEach((item, index) => {
        item.quotation.sumPrice = '/';
        item.quotation.productionQuantity = '/';
        quotationCol['list' + index] = item.quotation;
        orderCol['list' + index] = item.order;
        returnedCol['list' + index] = item.returned;
        returnChangeCol['list' + index] = item.returnChange;
        totalCol['list' + index] = item.total;
        feedQuantityCol['list' + index] = item.production;
        calcTotal(item.total);
      });
      // 填充后台数据
      tableData.value.push(orderCol);
      tableData.value.push(returnedCol);
      tableData.value.push(returnChangeCol);
      tableData.value.push(totalCol);
      tableData.value.push(quotationCol);
      tableData.value.push(feedQuantityCol);
      console.log("tableData.value",tableData.value);
    }
  }).finally(() => {
      tableLoading.value = false;
    })
}

/**
 * 计算合计数据
 */
const calcTotal = (value) => {
  totalQuantity.value = totalQuantity.value + Number(value.sumQuantity);
  totalArea.value = totalArea.value + Number(value.sumArea);
  totalPrice.value = totalPrice.value + Number(value.sumPrice);

  month_totalQuantity.value = month_totalQuantity.value + Number(value.monthSumQuantity);
  month_totalArea.value = month_totalArea.value + Number(value.monthSumArea);
}

/**
 * 列样式
 */
const cellStyle= ({ _columnIndex}) => {
  if (_columnIndex===0 ) {
    return {'background-color': '#f5f0ff'}; // 淡紫色
  } else if ((_columnIndex - 1) % 16 < 2) {
    return {'background-color': '#f5f0ff !important'}; // 淡蓝色
  } else if ((_columnIndex - 1) % 16 < 4) {
    return {'background-color': '#e5e5ff !important'}; // 淡蓝色
  } else if ((_columnIndex - 1) % 16 < 6) {
    return {'background-color': '#fff0e5 !important'}; // 浅橙色
  } else if ((_columnIndex - 1) % 16 < 8) {
    return {'background-color': '#d9e5ff !important'}; // 深蓝色
  } else if ((_columnIndex - 1) % 16 < 10) {
    return {'background-color': '#c9dfff !important'}; // 深紫色
  } else if ((_columnIndex - 1) % 16 < 12) {
    return {'background-color': '#f5f5ff !important'}; // 深蓝色
  } else if ((_columnIndex - 1) % 16 < 14) {
    return {'background-color': '#e5f5ff !important'}; // 淡蓝色
  } else {
    return {'background-color': '#e5e5f5 !important'}; // 浅紫色
  }
}

/**
 * 重新进入页面时刷新
 */
onActivated(() => {
  tableLoading.value = true;
  QueryDetails();
})

/**
 * 页面刷新数据
 */
onMounted(() => {
  tableLoading.value = true;
  QueryDetails();
});

</script>

<style lang="scss" scoped>
.totalTitle{
  width: 100%;
  padding: 0px !important;
  display: flex !important;
  justify-content: end !important;
  font-size: 14px !important;
  color: #248e8e !important;
  font-weight: bold;
}

.searchMain {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
.orderCapacityDesc{
  margin:2px;
  font-size: 14px;
}

:deep(.init-date) {
  width: 100%;
  justify-content: flex-start;
  .el-date-editor {
    width: 180px !important;
  }
}

:deep(.borderBoldTable .vxe-table--main-wrapper){
  padding: 1px !important;
}
:deep(.borderBoldTable .vxe-table--body) {
  margin-left: 1px !important;
}
:deep(.borderBoldTable .vxe-table--header-wrapper) {
  padding-left: 1px !important;
  padding-top: 1px !important;
}
:deep(.borderBoldTable .vxe-body--column) {
  border: 1px solid #6c6161 !important;
}
:deep(.borderBoldTable .vxe-header--column) {
  border: 1px solid #6c6161 !important;
}

</style>

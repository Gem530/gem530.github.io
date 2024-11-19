<template>
  <div class="p-2 xtable-page">

    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-start width-100">
          <el-col :span="4" class="primary-color">
        <el-form :model="queryParams" ref="queryFormRef" label-width="40px"
                 class="demo-form-inline">
          <el-form-item label="月份" prop="costMonth" style="margin-bottom: 0;">
            <el-date-picker class="width-100" :clearable="false" :disabled-date="disabledDate" v-model="queryParams.month" type='month' placeholder='请选择月份' valueFormat='YYYY-MM' @change="electricHandleQuery"/>
          </el-form-item>
        </el-form>
          </el-col>
          <el-col :span="19" class="flex-start">
            <div  class="totalTitle">提示 : 读数为空的可手动点击录入，录入后显示为蓝色字体</div>
          </el-col>
          <el-col :span="1" class="flex-end">
            <el-button type="primary" :disabled="loading" @click="exportData" v-hasPermi="['report:waterElectricReport:export']">导出</el-button>
          </el-col>

        </el-row>
      </template>
      <el-tabs type="border-card" class="xtable-tab" @tab-change="changeTab" v-model="activeName">
        <el-tab-pane label="电表" name="0" v-if="checkPermi(['report:waterElectricReport:electricList'])">


        <XTable
        border
        size="mini"
        height="100%"
        ref="electricTableRef"
        :seqConfig="{}"
        :data="electricList"
        :pageShow="false"
        :loading="loading"
        :showRefresh="true"
        class="xtable-content"
        :columnList="electricColumnList"
        :span-method="mergeCells"
        :sort-config="{ remote: false }"
        :page-params="{ perfect: true, total: total }"
        tooltip-config
        @cell-mouseenter="handleCellMouseenter"
        @cell-click="handleCellClick"
        @searchChange="electricHandleQuery">
         <template #default-location="scope">
          <el-button link type="primary" @click="OpenTheElectricLineChart(scope.row)">{{scope.row.location}}</el-button>
        </template>
          <template #default-type="scope">
            <div v-for="item in typeList">
              <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
            </div>
          </template>
          <template v-for="({forColumn}, index) in electricInsertColumn"
                    v-slot:[forColumn]="scope">
            <div
              style="color: #1677FF"
              v-if="scope.row.children[index].value !== undefined && (scope.row.children[index].isManually == '1')"
              type="primary">{{scope.row.children[index].value}}</div>
            <div v-if="scope.row?.children?.length && scope.row.children?.length >= index && (scope.row.children[index].isManually !== '1')" >{{scope.row.children[index].value}}</div>

          </template>
      </XTable>
        </el-tab-pane>

        <el-tab-pane label="水表" name="1" v-if="checkPermi(['report:waterElectricReport:waterList'])">
          <XTable
            border
            size="mini"
            height="100%"
            ref="waterTableRef"
            :seqConfig="{}"
            :data="waterList"
            :pageShow="false"
            :loading="loading"
            :showRefresh="true"
            :span-method="mergeCells"
            class="xtable-content"
            :column-config="{
              resizable: true
            }"
            @cell-click="handleCellClick"
            tooltip-config
            @cell-mouseenter="handleCellMouseenter"
            :columnList="waterColumnList"
            :sort-config="{ remote: false }"
            :page-params="{ perfect: true, total: total }"
            @searchChange="electricHandleQuery">
            <template #default-location="scope">
              <el-button link type="primary" @click="OpenTheWaterLineChart(scope.row)">{{scope.row.location}}</el-button>
            </template>
           <template v-for="({forColumn}, index) in waterInsertColumn"
                     v-slot:[forColumn]="scope">
<!--             <el-input-->
<!--               class="center-text"-->
<!--               v-model="scope.row.children[index].value" v-if="scope.row.children[index].value == undefined "-->
<!--               link type="primary" @click="inputWaterNumber(scope.row, index)"></el-input>-->
             <div
               style="color: #1677FF"
               v-if="scope.row.children[index].value !== undefined && (scope.row.children[index].isManually == '1')"
               type="primary">{{scope.row.children[index].value}}</div>
             <div v-if="scope.row?.children?.length && scope.row.children?.length >= index && (scope.row.children[index].isManually !== '1')" >{{scope.row.children[index].value}}</div>

           </template>
            <template #default-type="scope">
              <div v-for="item in typeList">
                <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
              </div>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="能耗统计" name="2" v-if="checkPermi(['report:waterElectricReport:energyList'])">

          <el-row style="width: 100%;height: 100%">

            <el-col class="xtable-card" :span="9">
<!--          <el-container>-->
<!--            <el-aside width="580px" style="height:810px;overflow-y:auto;background-color: rgb(255,255,255)">-->
              <XTable
                height="100%"
                toolId="waterElectricEnergy"
                ref="energyTableRef"
                :data="energyList"
                :pageShow="false"
                :loading="loading"
                :showRefresh="true"
                class="xtable-content"
                :columnList="energyInitColumn"
                @searchChange="electricHandleQuery">
              </XTable>
<!--            </el-aside>-->
<!--            <el-main style="padding:0px;overflow-x:hidden;">-->
            </el-col>
            <el-col  id="initDateCol" :span="15" style="height: 100%">
              <div id="initDate" class="init-date"  :loading="loading">
                <div ref="electricAndWaterLineRef"  style="height: 200%"/>
              </div>
<!--            </el-main>-->
<!--          </el-container>-->
            </el-col>
          </el-row>

        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-if="electricLineChartDialogVisible" v-model="electricLineChartDialogVisible" width="70%" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="init-date">
        <div ref="electricLineRef" style="height: 350px" />
      </div>
    </el-dialog>

<!--    inputWaterNumber事件后打开的弹窗，用于填写数据-->
    <el-dialog v-if="waterNumberDialogVisible"
               v-model="waterNumberDialogVisible"
               :title="waterNumberDialogTitle"
               width="20%"
               :before-close="handleClose"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               draggable
    >
      <el-form
        :model="receiveFromData"
        ref="receiveFormRef"
        :rules="receiveFormRule"
        label-width="auto"
      >

          <el-row  style="margin-left: 12px" >
            <el-form-item  label="位置" style="width: 100%;" >
            <el-col :span="20" style="">
              <el-input v-model="receiveFromData.location" disabled/>
            </el-col>
            </el-form-item>
            <el-form-item  label="日期" style="width: 100%">
              <el-col :span="20">
                <el-input v-model="receiveFromData.dateStr" disabled/>
              </el-col>
            </el-form-item>
            <el-form-item  label="读数值" prop="waterNumber"  style="width: 100%">
              <el-col :span="20">
<!--                <el-input-number v-model="receiveFromData.waterNumber" :precision="2" :min="0" :max="99999999" :step="1" :controls="false" />-->
                <XInputNumber class="number-left" :controls="false" style="width: 100%" v-model="receiveFromData.waterNumber" placeholder="请输入读数值" precision="2" min="0" max="99999999.99" />
              </el-col>
            </el-form-item>
          </el-row>
<!--      </el-row>-->

      </el-form>
      <template #footer>
        <!--        <span class="dialog-footer">-->
        <div class="text-center">
          <el-button @click="waterNumberDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="waterNumberDialogConfirm">确 定</el-button>
        </div>
        <!--        </span>-->
      </template>


  </el-dialog>
  </div>
</template>

<script setup name="WaterElectricReport" lang="ts">
import dayjs from 'dayjs'
import { deepClone } from '@/utils';
import {
  getElectricList,
  getEqpElectricMonthList, getEqpWaterMonthList,
  getWaterAndElectricReport,
  getWaterList, insertOrUpdateRead
} from '@/api/report/waterElectricReport/index';
import {checkPermi} from "@/utils/permission";
import {ref} from "vue";
import * as echarts from 'echarts';

const disabledDate = (time: Date) => {
  let now = new Date();
  // 判断now是否为当月1号,如果是当月1号,那只能选上个月及之前的
  const isFirstDayOfMonth = now.getDate() === 1;

  if (isFirstDayOfMonth) {
    // 当前日期是当月1号，只能选择上个月及之前的日期
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return time.getTime() > lastMonth.getTime();
  } else {
    // 当前日期不是当月1号,可以选这个时间及之前的数据
    return time.getTime() > Date.now()
  }

}

// 点击 单元格,触发小折线图
const handleCellClick = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, triggerRadio, triggerCheckbox, triggerTreeNode, triggerExpandNode, $event }) => {

  let  WorkInfo = JSON.parse(JSON.stringify(row));
  let number = ($columnIndex - 4 ) / 2;
  let child = WorkInfo.children[number];

  if (child.value == undefined || child.isManually == '1'){
    if (nowTabName.value === '1') {
      inputWaterNumber(WorkInfo, number);
    }else{
      inputElectricNumber(WorkInfo, number);
    }
  }


}

// 鼠标移入触发
const handleCellMouseenter = ({ row,  $columnIndex, $event }) => {

  let  WorkInfo = JSON.parse(JSON.stringify(row));
  let number = ($columnIndex - 4 ) / 2;
  // 如果number是整数或者小于0
  if (Number.isInteger(number) && number >= 0){
    let child = WorkInfo.children[number];

    if (child.value == undefined || child.isManually == '1'){
      // 鼠标变换为小拇指
      $event.target.style.cursor = 'pointer';
    }
  }

}
const electricTableRef = ref()
const waterTableRef = ref()
const energyTableRef = ref()
const queryFormRef = ref()
const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const loading = ref(true);
const electricList = ref<any[]>([]);
const waterList = ref<any[]>([]);
const energyList = ref<any[]>([]);

const electricLineRef = ref();
const electricAndWaterLineRef = ref();
const electricLineList = ref([]);
const OpenTheElectricLineChart = (row : any)=> {
  electricLineChartDialogVisible.value = true
  setTimeout(() => {
    proxy?.$modal.loading("正在加载数据，请稍候！");
    getEqpElectricMonthList({id: row.id, month: queryParams.value.month}).then((res: any) => {

      electricLineList.value = res.data;

      let xAxisDate = electricLineList.value?.map(item => item.dateStr);
      let yAxisDate = electricLineList.value?.map(item => item.dosage);

      const craftCapacityInstance = echarts.init(electricLineRef.value);
      let option;

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: row.location + ' : '+queryParams.value.month+'用电趋势',
          show: true,
          left: '40%',
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '2',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisDate,
            axisTick: {
              alignWithLabel: true
            },
            name: '日期',
            axisLabel:{ interval: 0,rotate: 15,}
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '用电量(度)'
          }
        ],
        series: [
          {
            name: '用电量(度)',
            type: 'line',
            barWidth: '80%',
            data: yAxisDate,
            label: {
              show: true,
              position: 'top'
            },
          }
        ]
      };

      if (option) {
        craftCapacityInstance.clear();
        craftCapacityInstance.setOption(option);
      }
      proxy?.$modal.closeLoading();
    })
  }, 10)
};

const OpenTheWaterLineChart = (row : any)=> {
  electricLineChartDialogVisible.value = true
  setTimeout(() => {
    proxy?.$modal.loading("正在加载数据，请稍候！");
    getEqpWaterMonthList({id: row.id, month: queryParams.value.month}).then((res: any) => {
      electricLineList.value = res.data;

      let xAxisDate = electricLineList.value?.map(item => item.dateStr);
      let yAxisDate = electricLineList.value?.map(item => item.dosage);

      const craftCapacityInstance = echarts.init(electricLineRef.value);
      let option;

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: row.location + ' : '+queryParams.value.month+'用水趋势',
          show: true,
          left: '40%',
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '2',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisDate,
            axisTick: {
              alignWithLabel: true
            },
            name: '日期',
            axisLabel:{ interval: 0,rotate: 15,}
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '用水量(吨)'
          }
        ],
        series: [
          {
            name: '用水量(吨)',
            type: 'line',
            barWidth: '80%',
            data: yAxisDate,
            label: {
              show: true,
              position: 'top'
            },
          }
        ]
      };

      console.log(option)
      if (option) {
        craftCapacityInstance.clear();
        craftCapacityInstance.setOption(option);
      }
      proxy?.$modal.closeLoading();
    })
  }, 10)
};



/**
 * 初始化更新读数表单数据
 */
let receiveFromData = ref({
  waterNumber: undefined,
  location: undefined,
  dateStr: undefined,
})


/**
 * 表单填写规则
 */
const receiveFormRule = ref({
  waterNumber: [
    { required: true, message: '读数值不能为空', trigger: ["blur","change"] }
  ]
})


const electricLineChartDialogVisible = ref(false);
const waterNumberDialogVisible = ref(false);
const waterNumberDialogTitle = ref('修改');
const waterIndex = ref();
const eqpId = ref();
const readId = ref();
const insertType = ref();
const handleClose = () => {
  electricLineChartDialogVisible.value = false
  waterNumberDialogVisible.value = false;
  eqpId.value = undefined;
  waterIndex.value = undefined;
  receiveFromData.value.waterNumber = undefined;
  insertType.value = undefined;
  readId.value = undefined;
}
const inputWaterNumber = (row : any, index : any)=> {
  waterNumberDialogVisible.value = true;
  // waterNumberDialogTitle.value = row.location+' : 修改' + row.children[index].dateStr + '用水读数';
  console.log('row.children[index].value',row.children[index].value)
  receiveFromData.value.waterNumber = row.children[index].value;
  receiveFromData.value.location = row.location;
  receiveFromData.value.dateStr = row.children[index].dateStr;
  // if (isNaN(receiveFromData.value.waterNumber)){
  //   receiveFromData.value.waterNumber = 0;
  // }
  eqpId.value = row.id;
  readId.value = row.children[index].id;
  waterIndex.value = index;
  insertType.value = '1';// 水类型
}
const inputElectricNumber = (row : any, index : any) => {
  waterNumberDialogVisible.value = true;
  // waterNumberDialogTitle.value = row.location+' : 修改' + row.children[index].dateStr + '用电读数';
  receiveFromData.value.waterNumber =row.children[index].value;
  receiveFromData.value.location = row.location;
  receiveFromData.value.dateStr = row.children[index].dateStr;
  eqpId.value = row.id;
  readId.value = row.children[index].id;
  waterIndex.value = index;
  insertType.value = '2';// 电类型
}

const receiveFormRef = ref();


const waterNumberDialogConfirm = () => {

  receiveFormRef.value.validate((valid: any) => {
    console.log(valid)
    if (valid) {
      const data = {
        eqpId: eqpId.value,
        index: waterIndex.value,
        waterNumber: receiveFromData.value.waterNumber,
        month: queryParams.value.month,
        type: insertType.value,
        id: readId.value
      }
      insertOrUpdateRead(data).then(() => {
        handleClose();
        electricHandleQuery();
      })
    }
  })
}



const initQuery = {
  month: dayjs(new Date).format('YYYY-MM'),
}
const queryParams = ref(deepClone(initQuery))
const typeList = ref([
  { label: "水表", value: "1" },
  { label: "电表", value: "2" },
]);

const initColumn = [
  // { title: '表类型', width: '90', field: 'type', align: 'center', fixed: 'left',},
  { title: '工序', width: '90', field: 'craftName', align: 'center', fixed: 'left',},
  { title: '序号', width: '90', type: 'seq', align: 'center', fixed: 'left',},
  { title: '位置', width: '90', field: 'location', align: 'center', fixed: 'left',},
  { title: '倍数', width: '90', field: 'times', align: 'center', fixed: 'left',},
  { title: '合计', field: 'total', align: 'center', fixed: 'right', width: '120'},
  { title: '平均每天', field: 'avg', align: 'center', fixed: 'right', width: '120' },
]
const energyInitColumn = [
  // { title: '序号', width: '90', type: 'seq', align: 'center', fixed: 'left',},
  { title: '日期', field: 'dateStr', align: 'center'},
  { title: '当日入库(㎡)', field: 'area', align: 'center'},
  { title: '用水量(吨)', field: 'waterQuantity', align: 'center'},
  { title: '用水能耗', field: 'waterEnergyCost', align: 'center'},
  { title: '用电量(度)', field: 'electricQuantity', align: 'center'},
  { title: '用电能耗', field: 'electricEnergyCost', align: 'center' },
]
const electricColumnList = ref(deepClone(initColumn));
const waterColumnList = ref(deepClone(initColumn));
let waterInsertColumn = ref<any[]>([])
let electricInsertColumn = ref<any[]>([])

/** 查询电表月数据 */
const queryElectricList = async () => {
  electricInsertColumn.value = [];
  loading.value = true;
  let params = deepClone(queryParams.value)

  let res: any = await getElectricList(params);
  if (res?.data?.length) {
    // console.log(res.data[0]?.craftelectricList)
    if (res.data[0]?.children?.length) {
      electricColumnList.value = deepClone(initColumn)
      let tempColumn: any[] = []
      res.data[0].children.map((m: any, mi: number) => {
        tempColumn.push({
          title: m.dateStr,
          field: 'work'+mi,
          align: 'center',
          children: [
            { title: '读数', field: `children[${mi}].value`, minWidth: '80px', align: 'center' },
            { title: '用量', field: `children[${mi}].dosage`, minWidth: '80px', align: 'center' }
          ]
        })
        electricInsertColumn.value.push({forColumn: 'default-children['+mi+'].value'})
      })
      electricColumnList.value.splice(2, 0, ...(tempColumn || []))
    }
  console.log(electricInsertColumn.value);
  }
  electricList.value = res.data;
  // total.value = res.total;
  loading.value = false;
}

// 查询水表月数据
const queryWaterList = async () => {
  waterInsertColumn.value = [];
  loading.value = true;
  let params = deepClone(queryParams.value)

  let res: any = await getWaterList(params);
  if (res?.data?.length) {
    // console.log(res.data[0]?.craftwaterList)
    if (res.data[0]?.children?.length) {
      waterColumnList.value = deepClone(initColumn)
      let tempColumn: any[] = []
      res.data[0].children.map((m: any, mi: number) => {
        tempColumn.push({
          title: m.dateStr,
          field: 'work'+mi,
          align: 'center',
          children: [
            { title: '读数', field: `children[${mi}].value`, minWidth: '80px', align: 'center' },
            { title: '用量', field: `children[${mi}].dosage`, minWidth: '80px', align: 'center' }
          ]
        })
        waterInsertColumn.value.push({sort: 'work'+mi , forColumn: 'default-children['+mi+'].value' , childrenColumn: 'children['+mi+']'})
      })
      waterColumnList.value.splice(2, 0, ...(tempColumn || []))
    }
    //  else {
    //   const crtMonth = waterColumnList.value.find((f: any) => f.field == 'month')
    //   crtMonth.width = 'auto'
    // }
  }
  waterList.value = res.data;
  // total.value = res.total;
  loading.value = false;
}

const echartHeight = ref(0)
// 查询能耗统计
const queryEnergyList = async () => {
  loading.value = true;
  setTimeout(() => {
    echartHeight.value = document.getElementById("initDateCol")?.clientHeight || 400
    console.log('打印宽度',document.getElementById("initDate")?.clientWidth,'-----------打印高度',document.getElementById("initDate")?.clientHeight)
    console.log('打印宽度',document.getElementById("initDateCol")?.clientWidth,'-----------打印高度',document.getElementById("initDateCol")?.clientHeight)
    const craftCapacityInstance = echarts.init(electricAndWaterLineRef.value);
    craftCapacityInstance.showLoading();
    // proxy?.$modal.loading("正在加载数据，请稍候！");
  let params = deepClone(queryParams.value)
  getWaterAndElectricReport(params).then((res : any) => {
    res.data.forEach((item: any) => {
      item.waterEnergyCost = item.waterEnergyCost === '-1' ? 0 : item.waterEnergyCost
      item.electricEnergyCost = item.electricEnergyCost === '-1' ? 0 : item.electricEnergyCost
    })
    energyList.value = res.data;


    let energyCopyList;
    // 判断当前时间的月份是否和查询的月份一致
    if (dayjs(params.month).format('YYYY-MM') == dayjs().format('YYYY-MM')) {
      // 获取当月的当前天数
      let days = new Date().getDate();
      console.log('当前天数',days)
      // energyList.value这个列表只保留后面days-1个数据
      energyList.value = energyList.value.slice(energyList.value.length - (days - 1));
      energyCopyList = deepClone(res.data)
      // 将energyCopyList倒序
      energyCopyList.reverse();

      // 将energyCopyList索引超过days -1的数据中的waterEnergyCost和electricEnergyCost设置为undefined
      for (let i = energyCopyList.length - 1; i > days - 2; i--) {
        energyCopyList[i].waterEnergyCost = undefined;
        energyCopyList[i].electricEnergyCost = undefined;
      }
    }else{
      energyCopyList = deepClone(res.data)
      // 将energyCopyList倒序
      energyCopyList.reverse();
    }

    let xAxisDate = energyCopyList?.map(item => item.dateStr);
    let yAxisDate = energyCopyList?.map(item => item.waterEnergyCost);
    let yAxisTwoDate = energyCopyList?.map(item => item.electricEnergyCost);

    const craftCapacityInstance = echarts.init(electricAndWaterLineRef.value);
    craftCapacityInstance.showLoading();
    let option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      title: {
        text: queryParams.value.month+' 水电能耗趋势',
        show: true,
        left: '41%',
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '2',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisDate,
          axisTick: {
            alignWithLabel: false
          },
          name: '日期',
          axisLabel:{ interval: 0,rotate: 15,}
        }
      ],
      legend: {
        data: ['用水量(吨)', '用电量(度)'],
        top: '3.8%',
      },
      yAxis: [
        {
          type: 'value',
          name: '用水量(吨)'
        },
        {
          type: 'value',
          name: '用电量(度)'
        },
      ],
      series: [
        {
          name: '用水量(吨)',
          type: 'line',
          barWidth: '60%',
          data: yAxisDate,
          label: {
            show: true,
            position: 'top'
          },
        },
        {
          name: '用电量(度)',
          type: 'line',
          barWidth: '60%',
          data: yAxisTwoDate,
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top'
          },
        },
      ]
    };

    if (option) {
      craftCapacityInstance.clear();
      craftCapacityInstance.hideLoading();
      craftCapacityInstance.setOption(option);
      craftCapacityInstance.resize({height:echartHeight.value});
    }

    // proxy?.$modal.closeLoading();
    loading.value = false;
  });
  }, 10)
}


const mergeCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data }: any) => {
  if (column.property === "craftName") {
    const referenceField = "craftName";
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
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[referenceField] === row[referenceField]) {
        nextRow = data[++countRowspan + $rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
}

/** 搜索按钮操作 */
const electricHandleQuery = (params?: any) => {
  if (nowTabName.value === '0'){
    queryElectricList();
  }else  if (nowTabName.value === '1'){
    queryWaterList();
  }else  if (nowTabName.value === '2'){
    queryEnergyList();
  }
}


/**
 * 导出数据
 */
const exportData = async () => {
  if (nowTabName.value === '0'){
    const $table = electricTableRef.value.xTableRef;
    if ($table) {
      let maxData = electricList.value
      $table.exportData({
        type: 'xlsx',
        data: maxData,
        useStyle: true, //是否导出样式
        sheetName: '电表统计',
        filename: '电表统计_' + dayjs(new Date()).format("YYYYMMDD"),
        columnFilterMethod ({ column }: any) {
          return !['make'].includes(column.field)
        },
      })
    }
  }else  if (nowTabName.value === '1'){
    const $table = waterTableRef.value.xTableRef;
    if ($table) {
      let maxData = waterList.value
      $table.exportData({
        type: 'xlsx',
        data: maxData,
        useStyle: true, //是否导出样式
        sheetName: '水表统计',
        filename: '水表统计_' + dayjs(new Date()).format("YYYYMMDD"),
        columnFilterMethod ({ column }: any) {
          return !['make'].includes(column.field)
        },
      })
    }
  }else  if (nowTabName.value === '2'){
    const $table = energyTableRef.value.xTableRef;
    if ($table) {
      let maxData = energyList.value
      $table.exportData({
        type: 'xlsx',
        data: maxData,
        useStyle: true, //是否导出样式
        sheetName: '能耗统计',
        filename: '能耗统计_' + dayjs(new Date()).format("YYYYMMDD"),
        columnFilterMethod ({ column }: any) {
          return !['make'].includes(column.field)
        },
      })
    }
  }

}


/**
 * 标签页变更时触发刷新接口
 */
const changeTab = (name : any) => {
  if (name === '0'){
    queryElectricList();
    nowTabName.value = '0'
  }else  if (name === '1'){
    queryWaterList();
    nowTabName.value = '1'
  }else  if (name === '2'){
    queryEnergyList();
    nowTabName.value = '2'
  }
}
const activeName = ref('0')
const nowTabName = ref('0')

onMounted(() => {
  let now = new Date();
  // 判断now是否为当月1号,如果是当月1号,那只能选上个月及之前的
  const isFirstDayOfMonth = now.getDate() === 1;

  if (isFirstDayOfMonth) {
    // 当前日期是当月1号，只能选择上个月及之前的日期
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    queryParams.value.month = dayjs(lastMonth).format('YYYY-MM')
  } else {
    queryParams.value.month = dayjs(now).format('YYYY-MM')
  }

  queryElectricList();
  nowTabName.value = '0'

  // queryWaterList();
  // nowTabName.value = '1'

  // queryEnergyList();
  // nowTabName.value = '2'
})
</script>

<style lang="scss" scoped>
.pop-select {
  z-index: 9999 !important;
}
.center-text {
  text-align: center !important;
}

.totalTitle{
  padding: 0px !important;
  margin: 0px;
  line-height: 24px !important;
  //display: flex !important;
  justify-content: end !important;
  font-size: 15px !important;
  color: #727272 !important;
  //font-weight: bold;
  margin-left: 10px !important;

}
</style>

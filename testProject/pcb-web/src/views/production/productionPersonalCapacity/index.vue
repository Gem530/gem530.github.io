<template>
  <div class="p-2 xtable-page">
      <el-tabs type="border-card" @tab-click="handleClick" class="xtable-tab" v-model="editableTabsValue">
        <el-tab-pane label="统计图表" name="0">
          <el-card shadow="never" style="margin:0;width: 100%;height: 50%">
            <el-row style="width: 100%; height: 38px;margin-top: -10px;">
              <el-col :span="7">
                <el-form-item label="查询日期：">
                  <interval-date ref="timeRef" class="init-date" v-model="queryTime" :start-params="dateParams.startTime"
                                 :end-params="dateParams.endTime">
                  </interval-date>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button @click="getCraftList" type="primary">查询</el-button>
              </el-col>
            </el-row>
            <div class="init-date">
              <div ref="craftCapacity" style="height: 330px" />
            </div>
          </el-card>

          <el-card shadow="never" style="margin:0;width: 100%;height: 50%">
            <el-row style="width: 100%; height: 38px; margin-top: -10px;">
              <el-col :span="7">
                <el-form-item label="查询日期：">
                  <interval-date ref="timeRef" class="init-date" v-model="queryTime2" :start-params="dateParams2.startTime"
                                 :end-params="dateParams2.endTime">
                  </interval-date>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button @click="getCraftPersonList" type="primary">查询</el-button>
              </el-col>
            </el-row>
            <div class="init-date">
              <div ref="craftPersonCapacity" style="height: 330px" />
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="上报记录" name="1">
          <el-row style="width: 100%">
            <el-col :span="12">
            </el-col>
            <el-col :span="10">
              <p class="totalTitle">产品数汇总：{{ commodityCodeSum }} &nbsp;&nbsp;|&nbsp;&nbsp;本卡面积汇总(㎡)：{{cardAreaTotal}} &nbsp;&nbsp;|&nbsp;&nbsp;上报面积汇总(㎡)：{{alreadyReportedAreaTotal}} </p>
            </el-col>
            <el-col :span="2" class="mb8 global-flex flex-end">
              <el-button type="primary"  @click="handleExport">导  出</el-button>
            </el-col>
          </el-row>

          <XTable
            border
            :loading="loading"
            ref="xtable"
            :data="tableData"
            :showRefresh="true"
            :page-params="{ perfect: true, total: total }"
            :columnList="columnList"
            @searchChange="searchChange"
            :footer-method="footerMethod"
            :intervalCondition="['createTime']"
            height="100%" class="xtable-content"
            v-model:pageSize="queryParams.pageSize"
            v-model:currentPage="queryParams.pageNum"
            toolId="ProductionPersonalCapacityXTable"
          >
            <template #default-unit="scope">
              <span>{{ scope.row.unit=='1'?'pnl':'set' }}</span>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>

  </div>
</template>

<script setup name="ProductionPersonalCapacity" lang="ts">
  import { deepClone } from '@/utils'
  import {
    listCapacity,
    getCapacity,
    delCapacity,
    addCapacity,
    updateCapacity,
    getCount,
    getCraftCapacity, getPersonalCapacityByCraft
  } from '@/api/production/capacity';
  import { pa } from 'element-plus/es/locale';
  import {ref} from "vue";
  import dayjs from "dayjs";
  import * as echarts from 'echarts';
  import {getCache} from "@/api/monitor/cache";
  import {CapacityVO, CraftPersonalCapacityVo} from "@/api/production/capacity/types";
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  const xtable = ref()
  const formRef = ref()
  const craftList = ref<CapacityVO[]>([]);
  const craftPersonList = ref<CraftPersonalCapacityVo[]>([]);
  const name = ref();
  const craftCapacity = ref();
  const craftPersonCapacity = ref();
  const app = {};
  const queryTime = ref([
    dayjs(new Date()).format('YYYY-MM-DD 00:00:00'), dayjs(new Date()).format('YYYY-MM-DD 23:59:59')
  ])
  /**
   * 日期参数
   */
  const dateParams = ref({
    startTime: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    endTime: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }
  });

  const queryTime2 = ref([
    dayjs(new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'), dayjs(new Date()).format('YYYY-MM-DD')
  ])

  /**
   * 日期参数
   */
  const dateParams2 = ref({
    startTime: { type: 'date', valueFormat: 'YYYY-MM-DD' }, endTime: { type: 'date', valueFormat: 'YYYY-MM-DD' }
  });

  const getCraftList = async () => {
    if (!queryTime.value[0] && !queryTime.value[1]) {
      proxy?.$modal.msgError("请先选择开始时间和结束时间");
      return false;
    }
    if (!queryTime.value[0]) {
      queryTime.value[0] = dayjs('2020-01-01').format('YYYY-MM-DD 00:00:00');
    }
    if (!queryTime.value[1]) {
      queryTime.value[1] = dayjs(new Date()).format('YYYY-MM-DD 23:59:59');
    }

    const params = {startTime: queryTime.value[0], endTime :queryTime.value[1]};
    proxy?.$modal.loading("正在加载数据，请稍候！");
    const res = await getCraftCapacity(params);
    proxy?.$modal.closeLoading();

    craftList.value = res.data;
    let xAxisDate = craftList.value?.map(item => item.craftName);
    let yAxisDate = craftList.value?.map(item => item.area);

    const craftCapacityIntance = echarts.init(craftCapacity.value, undefined, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    let option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      title: {
        text: '各工序产能',
        show: true,
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisDate,
          axisTick: {
            alignWithLabel: true
          },
          name: '工艺',
          axisLabel:{ interval: 0,rotate: 15,}
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '面积(m²)'
        }
      ],
      series: [
        {
          name: '面积',
          type: 'bar',
          barWidth: '60%',
          data: yAxisDate,
          label: {
            show: true,
            position: 'top'
          },
        }
      ]
    };

    if (option && typeof option === 'object') {
      craftCapacityIntance.clear();
      craftCapacityIntance.setOption(option);
    }

    // 先关闭点击事件，防止点击一次查询多次情况
    craftCapacityIntance.getZr().off('click');
    craftCapacityIntance.off('click');
    // 为柱状图添加点击事件
    craftCapacityIntance.getZr().on('click', function (params) {
      let pointInPixel = [params.offsetX, params.offsetY];
      if (craftCapacityIntance.containPixel('grid', pointInPixel)) {
        let pointInGrid = craftCapacityIntance.convertFromPixel({seriesIndex: 0}, pointInPixel);
        let xIndex = pointInGrid[0]; //获取下标
        name.value = xAxisDate[xIndex];
        // 查询数据
        getCraftPersonList();
      }
    })

    window.addEventListener("resize",()=>{
      craftCapacityIntance.resize()
    });
  }

  const getCraftPersonList = async () => {
    if (!name.value) {
      proxy?.$modal.msgError("请先选择工序");
      return false;
    }
    if (!queryTime2.value[0] && !queryTime2.value[1]) {
      proxy?.$modal.msgError("请选择开始时间和结束时间");
      return false;
    }
    if (!queryTime2.value[0]) {
      queryTime2.value[0] = dayjs('2020-01-01').format('YYYY-MM-DD');
    }
    if (!queryTime2.value[1]) {
      queryTime2.value[1] = dayjs(new Date()).format('YYYY-MM-DD');
    }
    // 默认需查询截止时间数据
    let endTime = dayjs(new Date(queryTime2.value[1]).getTime() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD');

    const params = {startCraftTime: queryTime2.value[0], endCraftTime :endTime, craftName:name.value};
    proxy?.$modal.loading("正在加载数据，请稍候！");
    const res = await getPersonalCapacityByCraft(params);
    proxy?.$modal.closeLoading();

    craftPersonList.value = res.data;
    let day = craftPersonList.value?.map(item => item.day);
    // 处理数据
    let craftMap = new Map();
    craftPersonList.value?.forEach(item => {
      item.capacityVoList.forEach(capacity => {
        if (craftMap.has(capacity.userName)) {
          craftMap.get(capacity.userName).push(capacity.area);
        } else {
          let areas = [];
          areas.push(capacity.area);
          craftMap.set(capacity.userName, areas);
        }
      })
    });
    let datas = [];
    const craftCapacityIntance = echarts.init(craftPersonCapacity.value, undefined, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    let option;
    const labelOption = {
      show: true,
      position: 'top'
    };

    craftMap?.forEach((value, key) => {
      if(key == '全部'){
        datas.push({name: key, type: 'bar', barGap: 0, label: labelOption, emphasis: {focus: 'series'}, data: value});
      }else{
        datas.push({name: key, type: 'bar', label: labelOption, emphasis: {focus: 'series'}, data: value});
      }
    });
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      title: {
        text: name.value + '工序产能',
        show: true,
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      legend: {
        data: [...craftMap.keys()]
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: day
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '面积(m²)'
        }
      ],
      series: datas,
      dataZoom: [{
        show: true, // 为true 滚动条出现
        realtime: true, // 实时更新
        type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
        height: 14, // 表示滚动条的高度，也就是粗细
        start: 0, // 表示默认展示20%～60%这一段。
        startValue: 0, // 从头开始。
        endValue: 15,  // 最多15个
      }, {
        type: "inside",
        show: true,
        // xAxisIndex: [0],
        left: "9%",
        bottom: 24,
        start: 0,
        end: 15, //初始化滚动条
      },
      ]
    };

    if (option && typeof option === 'object') {
      craftCapacityIntance.clear();
      craftCapacityIntance.setOption(option);
    }

 /*   // 点击类型自动切换为平铺
    craftCapacityIntance.on('magictypechanged', params => {
      if (params.currentType === 'line') {
        for (let i in params.newOption.series) {
          params.newOption.series[i].stack = ''
        }
        craftCapacityIntance.setOption(params.newOption)
      }
      if (params.currentType === 'bar') {
        for (let i in params.newOption.series) {
          params.newOption.series[i].stack = ''
        }
        craftCapacityIntance.setOption(params.newOption)
      }
    });*/

    window.addEventListener("resize",()=>{
      craftCapacityIntance.resize()
    });
  }

  const initQuery = {
    time: [],
    isAsc: 'desc',
    orderByColumn: 'create_time',
    pageNum: 1,
    pageSize: 20,
  }
  const loading = ref(true);
  const total = ref(0);
  const cardAreaTotal = ref(0);
  const commodityCodeSum = ref(0);
  const alreadyReportedAreaTotal = ref(0);

  const editableTabsValue = ref('0');
  const queryParams = ref({...deepClone(initQuery)})
  const tableData = ref([])
  const columnList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60',field:'seq'},
    {
        title: '部门',
        field: 'createDeptName',
        align: 'center',
        filterType: 'input',
        filterParam: { placeholder: '请输入部门', }
    },
    {
      title: '用户名',
      field: 'createByName',
      align: 'center',
      filterType: 'input',
      filterParam: { placeholder: '请输入用户名', }
    },
    {
      title: '所属工序',
      field: 'craftName',
      align: 'center',
      filterType: 'input',
      filterParam: { placeholder: '请输入所属工序', }
    },
    {
      title: '上报时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: { placeholder: '请输入产品编码', }
    },
    {
      title: '流转卡号',
      field: 'cardCode',
      align: 'center',
      filterType: 'input',
      filterParam: { placeholder: '请输入流转卡号', }
    },
    {
      title: '本卡面积(㎡)',
      field: 'cardArea',
      align: 'center'
    },
    {
      title: '上报数量',
      field: 'reportedQuantity',
      align: 'center',
    },
    {
      title: '上报单位',
      field: 'unit',
      align: 'center',
    },
    {
      title: '上报面积(㎡)',
      field: 'alreadyReportedArea',
      align: 'center',
    },
  ])
  const getList = async() => {
    let params = deepClone(queryParams.value)
    if (params.time?.length == 2) {
      // params.startTime = params.time[0]
      // params.endTime = params.time[1]
    }
    params.time = undefined

    loading.value = true;
    params.type='0'
    //params.status = '1'
    params.isAsc='desc'
    params.orderByColumn = 'create_time'
    const res = await listCapacity(params);
    tableData.value = res.rows;
    total.value = res.total;
    loading.value = false;
    getListCount();
    console.log('getList', params)
  }
  const getListCount = async() => {
    let params = deepClone(queryParams.value)
    if (params.time?.length == 2) {
      params.startTime = params.time[0]
      params.endTime = params.time[1]
    }
    params.time = undefined

    params.type='0'
    //params.status = '1'
    const res = await getCount(params);
    let obj= res.data;
    cardAreaTotal.value = obj.cardAreaTotal;
    alreadyReportedAreaTotal.value = obj.alreadyReportedAreaTotal;
    commodityCodeSum.value = obj.commodityCodeSum;
    if(cardAreaTotal.value==null){
      cardAreaTotal.value=0;
    }
    if(alreadyReportedAreaTotal.value==null){
      alreadyReportedAreaTotal.value=0;
    }
    if(commodityCodeSum.value==null){
      commodityCodeSum.value=0;
    }
  }
  const initParams = (params) => {
    console.log('initParams', params);

    // let time = queryParams.value.time
    let pageNum = queryParams.value.pageNum
    let pageSize = queryParams.value.pageSize

    queryParams.value = params
    // queryParams.value.time = time
    queryParams.value.startTime=params.createTimeStart
    queryParams.value.endTime=params.createTimeEnd
    queryParams.value.pageNum = pageNum
    queryParams.value.pageSize = pageSize
    // for (let key in queryParams.value) {
    //     if (!initQuery[key]) {
    //         queryParams.value[key] = undefined
    //         delete queryParams.value[key]
    //     }
    // }
    // Object.keys(queryParams.value).forEach((key) => {
    //     if (!initQuery[key]) {
    //         queryParams.value[key] = undefined
    //         delete queryParams.value[key]
    //     }
    // })
    // Object.keys(params).forEach((key) => {
    //     const initArr = Object.keys(initQuery)
    //     console.log(initArr)
    //     if (!initArr.includes(key)) {
    //         console.log('initParams', key, params[key]);

    //         queryParams.value[key] = undefined
    //         if (params[key]) {
    //             queryParams.value[key] = params[key]
    //         }
    //     }
    // })
    // console.log(params, queryParams.value)
  }
  const handleClick = (pane: any, ev: any) => {
    if (pane.index == 0) {
      getCraftList()
    } else {
      getList()
    }
  }
  const searchChange = (params) => {
    console.log('searchChange', params)
    initParams(params)
    getList()
  }
  const handleQuery = () => {
    console.log('handleQuery', queryParams.value)
    getList()
  }
  const resetQuery = () => {
    // formRef.value.resetFields()
    // console.log('resetQuery', queryParams.value)
    queryParams.value.time = []
    getList()
  }
  const footerMethod = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == "code") {
          return `${sumNum(data, "code")} `;
        }
        if (column.field == "area") {
          return `${sumNum(data, "area")} `;
        }
        if (column.field == "reportArea") {
          return `${sumNum(data, "reportArea")} `;
        }
        return "";
      })
    ];
  };
  const sumNum = (list, field) => {
    let count = 0;
    list.forEach(item => {
      // console.log(field + ': --' + item[field])
      count += Number(item[field] || 0);
    });
    return Number(count.toFixed(4));
  };

  /** 导出按钮操作 */
  const handleExport = () => {

    let params = deepClone(queryParams.value)
    // if (params.time?.length == 2) {
    //     params.startTime = params.time[0]
    //     params.endTime = params.time[1]
    // }
    // params.time = undefined

    params.type='0'
    //params.status = '1'
    if(params.createDeptName==undefined
      && params.createByName==undefined
      && params.craftName==undefined
      && params.commodityCode==undefined
      && params.cardCode==undefined
      && params.startTime==undefined
      && params.endTime==undefined
    ){
      ElMessageBox.confirm(
        '没有筛选条件，将默认导出30天内的数据?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          proxy?.download('personal/capacity/export', {
            ...params, tableName: 'ProductionPersonalCapacityXTable'
          }, `个人产能分析_${new Date().getTime()}.xlsx`);
        })
        .catch(() => {
          return;
        })


    }else{
      proxy?.download('personal/capacity/export', {
        ...params, tableName: 'ProductionPersonalCapacityXTable'
      }, `个人产能分析_${new Date().getTime()}.xlsx`);
    }

  }

onMounted(() => {
  getCraftList();
})
</script>
<style lang="scss" scoped>
  .el-drawer__header {
    margin-bottom: 0px !important;
  }
  .totalTitle{
    width: 100%;
    padding: 0px !important;
    padding-top: 8px !important;
    margin: 0px 10px 10px 0;
    line-height: 24px !important;
    display: flex !important;
    justify-content: end !important;
    font-size: 14px !important;
    color: #0892c7 !important;
    font-weight: bold;
  }
  :deep(.init-date) {
    width: 100%;
    justify-content: flex-start;
    .el-date-editor {
      width: 180px !important;
    }
  }
</style>

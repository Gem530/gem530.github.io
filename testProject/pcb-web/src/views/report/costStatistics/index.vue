<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search">
        <el-form :model="queryParams" ref="queryFormRef" label-width="130px"
                 class="demo-form-inline">
          <el-row>
            <el-col :span="8">
              <el-form-item label="选择近1年的数据" prop="timeBetween">
                  <!-- :disStart="disStart" -->
                <IntervalDate
                  :auto="true"
                  :isAcceptValue="true"
                  v-model="queryParams.timeBetween"
                  :endParams="{type: 'month',placeholder: '选择开始时间',valueFormat:'YYYY-MM'}"
                  :startParams="{type: 'month',placeholder: '选择开始时间',valueFormat:'YYYY-MM'}"
                ></IntervalDate>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" label-width="80px">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="width-100 global-flex flex-end">
                <el-button type="primary" :disabled="loading" @click="exportData" v-hasPermi="['report:costStatistics:export']">导出</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </transition>
    <el-card shadow="never" class="xtable-card">
      <!-- <template #header>
        <div class="width-100 global-flex flex-end">
          <el-button type="primary" :disabled="loading" @click="exportData" v-hasPermi="['report:costStatistics:export']">导出</el-button>
        </div>
      </template> -->

      <XTable
        border
        size="mini"
        height="100%"
        ref="tableRef"
        :seqConfig="{}"
        :data="costList"
        :pageShow="false"
        :loading="loading"
        :showRefresh="true"
        class="xtable-content"
        :columnList="columnList" 
        :sort-config="{ remote: false }"
        :intervalCondition="['notifyTime']"
        :scroll-y="{ enabled: true, gt: 20 }"
        :page-params="{ perfect: true, total: total }"
        @searchChange="handleQuery">
        <!-- <template #default-make="{ row }">
          <el-button link type="primary" @click="refreshData(row)">更新数据</el-button>
        </template> -->
      </XTable>
    </el-card>
  </div>
</template>
  
<script setup name="CostStatistics" lang="ts">
import dayjs from 'dayjs'
import { deepClone } from '@/utils';
import { getCraftListCost } from '@/api/report/costStatistics/index';

const tableRef = ref()
const queryFormRef = ref()
const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const loading = ref(true);
const costList = ref<any[]>([]);

const initEnd = dayjs(new Date()).format('YYYY-MM')
const initStart = dayjs(new Date()).subtract(1, 'year').format('YYYY-MM')
const disStart = ref(initStart)
const initQuery = {
  // endTime: undefined,
  // startTime: undefined,
  timeBetween: [initStart, initEnd],
}
const queryParams = ref(deepClone(initQuery))

const initColumn = [
  { title: "序号", type: 'seq', align: 'center', width: '60', fixed: 'left' },
  { title: '所属月份', width: '90', field: 'costMonth', align: 'center', fixed: 'left',
  // sortable: true 
  },
  { title: '合计', field: 'sumPrice', align: 'center', fixed: 'right', width: '120', sortable: true },
  // { title: '操作', field: 'make', align: 'center', fixed: 'right', width: '100', showOverflow: false },
]
const columnList = ref(deepClone(initColumn));
/** 查询ECN通知列表 */
const getList = async () => {
  loading.value = true;
  let params = deepClone(queryParams.value)
  if (params?.timeBetween?.length) {
    params.costMonthStart = params.timeBetween[0]
    if (params?.timeBetween?.length == 2) params.costMonthEnd = params.timeBetween[1]
    delete params?.timeBetween
  }
  let res: any = await getCraftListCost(params);
  if (res?.data?.length) {
    // console.log(res.data[0]?.craftCostList)
    if (res.data[0]?.craftCostList?.length) {
      columnList.value = deepClone(initColumn)
      let tempColumn: any[] = []
      res.data[0].craftCostList.map((m: any, mi: number) => {
        tempColumn.push({
          title: m.craftName,
          field: 'work'+mi,
          align: 'center',
          children: [
            { title: '总成本', field: `craftCostList[${mi}].price`, minWidth: '80px', align: 'center', sortable: true },
            { title: '平米均价', field: `craftCostList[${mi}].areaPrice`, minWidth: '80px', align: 'center', sortable: true },
            { title: 'PCS均价', field: `craftCostList[${mi}].pcsPrice`, minWidth: '80px', align: 'center', sortable: true }
          ]
        })
      })
      columnList.value.splice(2, 0, ...(tempColumn || []))
    }
    //  else {
    //   const crtMonth = columnList.value.find((f: any) => f.field == 'month')
    //   crtMonth.width = 'auto'
    // }
  }
  costList.value = res.data;
  // total.value = res.total;
  loading.value = false;
}

/** 表单重置 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = (params?: any) => {
  if (params) {
    let arr = []
    for (let key in initQuery) { arr.push(key) }
    for (let key in queryParams.value) {
      if (!arr.includes(key)) {
        queryParams.value[key] = undefined
      }
    }
    Object.assign(queryParams.value, params)
  }
  getList();
}

// 更新数据
const refreshData = (row: any) => {
  console.log(row)
  getList()
}

/**
 * 导出数据
 */
const exportData = async () => {
  const $table = tableRef.value.xTableRef;
  if ($table) {
    let maxData = costList.value
    // 判断是否有筛选条件
    let params = deepClone(queryParams.value)
    // // 去除页码，不算在搜索条件内
    // delete params?.pageNum
    // delete params?.pageSize
    let hasSearch = false
    for (let key in params) {
      if (Array.isArray(params[key]) && params[key]?.length) {
        params[key].map((m) => {
          if (!!m) {
            // 判断是否有值，有值则说明有筛选条件，用于判断数组
            hasSearch = true
          }
        })
      } else if (!!params[key]) {
        // 判断是否有值，有值则说明有筛选条件
        hasSearch = true
      }
    }
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认导出全部数据(最大1w条)', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
      maxData = maxData.slice(0, 10000)
    }
    $table.exportData({
      type: 'xlsx',
      data: maxData,
      useStyle: true, //是否导出样式
      sheetName: '工序成本统计',
      filename: '工序成本统计_' + dayjs(new Date()).format("YYYYMMDD"),
      columnFilterMethod ({ column }: any) {
        return !['make'].includes(column.field)
      },
      // 没有效果，已经执行afterExportMethod方法，但是还在导出中
      // beforeExportMethod ({options}: any) {
      //   console.log('beforeExportMethod', options)
      //   proxy?.$modal.loading('')
      // },
      // afterExportMethod ({options}: any) {
      //   console.log('afterExportMethod', options)
      //   proxy?.$modal.closeLoading('')
      // },
    })
  }
}

onMounted(() => {
  getList();
}) 
</script>

<style lang="scss">
.pop-select {
  z-index: 9999 !important;
}
</style>
  
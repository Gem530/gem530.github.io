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
                :key="item.id">
                <template #header>
                  <div class="card-header headTitle"><span>{{ _dateType.label }}{{type.label.includes('送货')?'送货':'下单'}}</span></div>
                </template>
                <div class="cardData" v-if="item.dateType = _dateType.value">
                  <span class="infoItem">{{ item.area ? Number(item.area).toFixed(4) : 0.00 }}</span>
                  <span class="infoItem">{{ item.totalAmount ? Number(item.totalAmount).toFixed(2) : 0.00 }}</span>
                  <span class="infoItem">{{ item.squareMetersAmount ? Number(item.squareMetersAmount).toFixed(2) : 0.00
                  }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>

      </el-col>
    </el-row>

  </div>
</template>

<script setup name="SaleDashboard" lang="ts">
import { getDashboardInfo } from '@/api/order/saleDashboard';
import { SaleDashboardForm, SaleDashboardQuery, SaleDashboardVO, OrderTypeEnum } from '@/api/order/saleDashboard/types';
import { ref } from "vue";
import dayjs from "dayjs";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const stopTime = ref();
const saleDashboardList = ref<SaleDashboardVO[]>([]);
const todayOrderList = ref<SaleDashboardVO[]>([]);
const typeList = [
  { label: '下单情况', value: "1" },
  { label: '下单情况（本厂）', value: "2" },
  { label: '下单情况（外协）', value: "3" },
  { label: '送货情况（包含退货）', value: "4" },
  { label: '送货情况(包含退货)（本厂）', value: "5" },
  { label: '送货情况(包含退货)（外协）', value: "6" },
];
const dateTypeList = ref([
  { label: '当日', value: "1" },
  { label: '本周', value: "2" },
  { label: '当月', value: "3" },
]);

const loading = ref(true);
const total = ref(0);

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
}

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
  text-align: center;
  color: rgb(64, 158, 255);
  font-size: 26px;
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

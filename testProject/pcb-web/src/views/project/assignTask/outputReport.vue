<template>
  <div>
    <vxe-toolbar>
<!--      <template #buttons>-->
<!--        <vxe-button @click="allAlign = 'left'">居左</vxe-button>-->
<!--        <vxe-button @click="allAlign = 'center'">居中</vxe-button>-->
<!--        <vxe-button @click="allAlign = 'right'">居右</vxe-button>-->
<!--      </template>-->
    </vxe-toolbar>
    <el-row>
      <el-col :span="6">
    <el-form-item size="small" label="查询日期:">
      <el-date-picker  v-model="tabQueryParams.startTime" style="width: 100%;" type="date"
                      value-format="YYYY-MM-DD" :clearable="false" @change="flushData" />
    </el-form-item>
      </el-col>
    </el-row>
    <vxe-table
      :column-config="{resizable: true}"
      :data="tableData"
      header-row-class-name="boldHeader"
      :span-method="colspanMethod"
      align="center"
      border
      show-overflow
      height="580"
      :row-config="{height: 40}"
      :loading ="viewTableLoading"
    >

      <vxe-column field="category" title="分类">
        <template #default="{row}">
          <div v-html="row.category"></div>
        </template>
      </vxe-column>

      <vxe-colgroup title="新单">
      <vxe-column field="newPlateLayer" title="板层"></vxe-column>
      <vxe-column field="newQuantity" title="款数"></vxe-column>
      <vxe-column field="newArea" title="面积（m²）"></vxe-column>
      </vxe-colgroup>

      <vxe-colgroup title="返单">
      <vxe-column field="returnQuantity" title="款数"></vxe-column>
      <vxe-column field="returnArea" title="面积（m²）"></vxe-column>
      </vxe-colgroup>

      <vxe-colgroup title="样品">
      <vxe-column field="samplePlateLayer" title="板层"></vxe-column>
      <vxe-column field="sampleQuantity" title="款数"></vxe-column>
      <vxe-column field="sampleArea" title="面积（m²）"></vxe-column>
      </vxe-colgroup>




    </vxe-table>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref } from 'vue'
import {
  getOutputReport
} from "@/api/project/productionPlan";
const tableData = ref([])


const viewTableLoading = ref(true);

/**
 * 查询参数
 */
const  tabQueryParams  = ref({
  startTime: dayjs(new Date()).format('YYYY-MM-DD')
});

/**
 * 查询
 */
const QueryDetails =()=>{

  getOutputReport({
    queryTime: tabQueryParams.value.startTime
  })
    .then((res) =>{
      tableData.value =res.data;
    })
    .finally(() => {
      viewTableLoading.value = false;
    })
}

const colspanMethod = ({ _rowIndex, _columnIndex }) => {

    if (_rowIndex % 3 === 0) {
      if (_columnIndex === 0  || _columnIndex === 4 || _columnIndex === 5) {
        return { rowspan: 3, colspan: 1 }
      }else {
        return { rowspan: 1, colspan: 1 }
      }
    }else if (_columnIndex === 0  || _columnIndex === 4 || _columnIndex === 5) {
      return { rowspan: 0, colspan: 0 }
    }

}


const flushData = ()=>{
  viewTableLoading.value = true;
  QueryDetails();
};


/**
 * 页面刷新数据
 */
onMounted(() => {
  QueryDetails();
});

</script>

<style scoped>
.boldHeader{
 font-weight: bold;
}
</style>

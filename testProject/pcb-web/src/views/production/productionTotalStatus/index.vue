<template>
  <div class="p-2 xtable-page">
    <!-- <span>计划拖期汇总</span> -->
    <div style="display: flex;align-items: center;">
      <div class="p-2" style="padding-right: 30px">
        <el-radio-group v-model="queryParams.model" @change="changeProType">
          <el-radio-button label="1">批量</el-radio-button>
          <el-radio-button label="2">样品</el-radio-button>
          <el-radio-button label="">全部</el-radio-button>
        </el-radio-group>
      </div>
      <el-checkbox style="margin-left: 5px;" v-model="queryParams.isRemediationDesc" @change="changeProType">
        只显示补料排产
      </el-checkbox>
    </div>


    <el-card shadow="never" class="xtable-card">
      <div style="height: 40%;width:100%">
        <XTable
          border
          keep-source
          size="small"
          align="center"
          :page-show="false"
          class="xtable-half"
          ref="mainRef"
          :show-footer="true"
          show-header-overflow
          show-footer-overflow
          :footer-method="footerMethod"
          @cell-dblclick="onMainTableCellDblClick"
          show-overflow
          :row-config="{height: 23}"
          :column-config="{resizable: true}"
          :loading="loading"
          :data="deliverDays"
        >
          <vxe-column title="交期状况" field="days">
            <template #default="{row}">
              {{showDeliveryDays(row.days)}}
            </template>
          </vxe-column>
          <vxe-column v-for="item in craftList.filter(vo => vo.craftName !='表面后处理' && vo.craftName !='沉金')"
                      :key="item.id"
                      :title="item.craftName"
                      :field="item.id.toString()">
            <template #header="{column}">
              <el-button type="primary" link
                         @click="showColumnDetail(column.field)">{{column.title}}
              </el-button>
            </template>
            <template #default="{row}">
              {{showStatusInfo(row.days,item.id)}}
            </template>
            <template #footer="	{column, columnIndex, items}">
              <el-button type="primary" link
                         @click="showColumnDetail(column.field)">{{items[columnIndex]}}
              </el-button>
            </template>
          </vxe-column>
          <vxe-column title="交期汇总"
                      field="rowSumarry">
            <template #default="{row}">
              <el-button type="primary" link
                         @click="showRowDetail(row.days)">
                {{row.rowTotalInfo.area.toFixed(4)}}m²/{{row.rowTotalInfo.count}}款
              </el-button>
            </template>
            <template #footer="	{column, columnIndex, items}">
              <el-button type="primary" link
                         @click="showAllDetail(column.field)">{{items[columnIndex]}}
              </el-button>
            </template>
          </vxe-column>
        </XTable>
      </div>
      <div style="width: 100%; padding: 5px;display: flex;align-items: center;justify-content: space-between;">
        <el-button type="primary" link @click="removeCheckedDetail()">移除选中行</el-button>
        <div>
          <el-select style="width: 100px" v-model="targetCraft" clearable :collapse-tags="true" filterable placeholder="目标工序">
            <el-option
              v-for="item in craftList"
              :key="item.id"
              :label="item.craftName"
              :value="item.craftName"
            />
          </el-select>
          <el-button type="primary" @click="exportExcel()">导出EXCEL</el-button>
        </div>
      </div>
      <div style="height: 60%;width: 100%">
        <XTable
          toolId="productionTotalStatusChecked"
          ref="checkedRef"
          style="height: 100%;"
          height="100%"
          :pageShow="false"
          v-loading="loading"
          :data="checkedDetailList"
          :columnList="checkedDetailColumnList"
          :sort-config="{multiple:true,remote:false}"
          border
          class="xtable-content"
          :column-config="{ resizable: true }"
          :checkbox-config="{reserve: true }"
          :row-config="{ keyField:'id' }"
          show-footer :showRefresh="true" :isNeedEmitRefresh="true" @refresh="getList"
          :footer-method="footerMethodDetail"
          @cell-click="cellClickEventChecked"
        >
          <template #default-differTime="scope">
            {{scope.row.subtractTime}}
          </template>
          <template #default-nodeName="scope">
            {{craftList.find(item => item.id == scope.row.craftId)?.craftName }}
          </template>
          <template #default-feedSetArea="{row}">
            {{Number(row.feedSetArea).toFixed(4)}}
          </template>
          <template #default-pnlSetArea="{row}">
            {{Number(row.pnlSetArea).toFixed(4)}}
          </template>
          <template #default-model="{ row }">
            <!-- <div>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div> -->
            <template v-if="row.model && row.model.includes('+')">
              <span v-for="(item, index) in row.model.split('+')" :key="index">
                {{ resDictData?.order_model.find(v => v.dictValue == item)?.dictLabel }}{{ (index + 1) == row.model.split('+').length ? '' : '+' }}
              </span>
            </template>
            <div v-else>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div>
          </template>
<!--          <template #default-urgent="{ row }">-->
<!--            <template v-if="row.urgent && row.urgent.includes('+')" :key="index">-->
<!--              <span v-for="(item, index) in row.urgent.split('+')">-->
<!--                {{ resDictData?.order_urgent.find(v => v.dictValue == item)?.dictLabel }}{{ (index + 1) == row.urgent.split('+').length ? '' : '+' }}-->
<!--              </span>-->
<!--            </template>-->
<!--            <div v-else>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div>-->
<!--          </template>-->
          <template #default-make="{row}">
              <el-button link type="primary" @click="handleDelete(row)">移除</el-button>
          </template>
        </XTable>
      </div>
    </el-card>

    <el-dialog title="详情" v-model="dialog.visible" width="90%" @close="closeDialog">
      <div class="ptable-card" style="height: 650px;">
        <el-form label-width="70px" class="no-padding-pop">
        <el-row>
          <el-col :span="4">
            <el-form-item label="产品编码">
              <el-input style="width: 100%" v-model="detailQuery.commodityCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户编码">
              <el-select style="width: 100%" v-model="detailQuery.customerCode" clearable placeholder=" ">
                <el-option v-for="(item,index) in customerCodeList" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="在线工序">
              <el-select style="width: 100%" v-model="detailQuery.nodeName" clearable placeholder=" ">
                <el-option v-for="(item,index) in nodeNameList" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="交货日期">
              <el-date-picker type="date" style="width: 100%" v-model="detailQuery.planCompleteTime" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="流转卡号">
              <el-input v-model="detailQuery.code" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="50px" label="批/样">
              <el-select style="width: 100%" v-model="detailQuery.model" clearable placeholder=" ">
                <el-option v-for="(item,index) in modelList" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="20px">
              <div style="width: 100%;" class="global-flex flex-end">
                <el-button type="primary" @click="searchDetail">查询</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
        <XTable
          ref="detailRef"
          toolId="productionTotalStatusDetail"
          :pageShow="false"
          v-loading="loading"
          height="100%" class="ptable-content"
          :data="detailData"
          :columnList="detailColumnList"
          border
          :sort-config="{multiple:true,remote:false}"
          @checkbox-all="selectAllChangeEvent"
          @checkbox-change="selectChangeEvent"
          :column-config="{ resizable: true }"
          :row-config="{isCurrent:'true' }"
          :scroll-y="{enabled: true,gt: 50}"
          :footer-method="footerMethodDetail"
          show-footer
          @cell-click="cellClickEvent"
        >
          <template #default-differTime="scope">
            {{scope.row.subtractTime}}
          </template>
          <template #default-nodeName="scope">
            {{craftList.find(item => item.id == scope.row.craftId)?.craftName }}
          </template>
          <template #default-feedSetArea="{row}">
            {{Number(row.feedSetArea).toFixed(4)}}
          </template>
          <template #default-pnlSetArea="{row}">
            {{Number(row.pnlSetArea).toFixed(4)}}
          </template>
          <template #default-model="{ row }">
            <!-- <div>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div> -->
            <template v-if="row.model && row.model.includes('+')">
              <span v-for="(item, index) in row.model.split('+')" :key="index">
                {{ resDictData?.order_model.find(v => v.dictValue == item)?.dictLabel }}{{ (index + 1) == row.model.split('+').length ? '' : '+' }}
              </span>
            </template>
            <div v-else>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div>
          </template>
<!--          <template #default-urgent="{ row }">-->
<!--            &lt;!&ndash; <div>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div> &ndash;&gt;-->
<!--            <template v-if="row.urgent && row.urgent.includes('+')" :key="index">-->
<!--              <span v-for="(item, index) in row.urgent.split('+')">-->
<!--                {{ resDictData?.order_urgent.find(v => v.dictValue == item)?.dictLabel }}{{ (index + 1) == row.urgent.split('+').length ? '' : '+' }}-->
<!--              </span>-->
<!--            </template>-->
<!--            <div v-else>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div>-->
<!--          </template>-->
        </XTable>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button @click="cancel">关闭</el-button>
          <el-button :loading="buttonLoading" type="primary"
                     @click="addProduction">加入排产
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ProductionTotalStatus" lang="ts">
  import {ref} from "vue";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {deepClone} from "@/utils";
  import {exportDailyProduction, getProductionCardTotal} from "@/api/production/production";
  import {VxeTableEvents, VxeTablePropTypes} from "vxe-table";
  import {AccountMaterialInOutVo} from "@/api/financial/accountOrder/types";


  import * as xlsx from 'xlsx';
  // import * as xlsxs from 'xlsx-style-vite'
  // import xlsxs from "xlsx-style";// vue3不支持
  import fileSaver from "file-saver";
  import dayjs from "dayjs";

  const mainRef = ref();
  const loading = ref(false);
  const total = ref(0);
  const cardList = ref<any>([]);
  const craftList = ref<any[]>([]);
  const deliverDays = ref<any[]>([]);
  //选中节点对应的详情记录
  const detailData = ref([]);
  //加入排产数据
  const checkedDetailList = ref<any>([]);

  const targetCraft = ref("");

  let initQueryParams = {
    mode: undefined,
    params: {}
  }

  let queryParams = ref<any>({
    ...initQueryParams
  });

  const detailQuery = ref<Record<string, any>>({
    craftId: undefined,
    days: undefined,
    commodityCode: undefined,
    customerCode: undefined,
    nodeName: undefined,
    planCompleteTime: undefined,
    code: undefined,
    model: undefined,
  })
  const modelList = ref([])
  const nodeNameList = ref([])
  const customerCodeList = ref([])

  const getList = async () => {
    loading.value = true;
    const res = await getProductionCardTotal(queryParams.value);
    craftList.value = res.data.craftVoList
    cardList.value = res.data.cardTotalVoList
    getRowTotalInfo();
    loading.value = false;
  }

  const detailColumnList = ref([
    {type: 'checkbox', align: 'center', field: "checkbox", width: '50',},
    {width: '30', type: "seq", title: '序号', field: 'index', align: 'center',},
    {width: '130px', title: '流转卡号', field: 'code', align: 'center', sortable: true},
    {width: '110px', title: '排产时间', field: 'createTime', align: 'center', sortable: true},
    {width: '60px', title: '客户编码', field: 'customerCode', align: 'center', sortable: true},
    {width: '110px', title: '产品编码', field: 'commodityCode', align: 'center',},
    {width: '150px', title: '产品名称', field: 'commodityName', align: 'center',},
    {width: '40px', title: '样/批', field: 'model', align: 'center',},
    {width: '40px', title: '加急', field: 'urgent', align: 'center',},
    {width: '50px', title: '类型', field: 'pnlName', align: 'center',},
    {width: '80px', title: '在线工序', field: 'nodeName', align: 'center', sortable: true},
    {width: '80px', title: '交货日期', field: 'planCompleteTime', align: 'center', sortable: true},
    {width: '80px', title: '总孔数(万)', field: 'sumDrillQuantity', align: 'center', sortable: true},
    {width: '60px', title: '排产数量', field: 'bundlePnlQuantity', align: 'center',},
    {width: '80px', title: '排产面积(m²)', field: 'feedSetArea', align: 'center',},
    {width: '100px', title: '结存时间', field: 'differTime', align: 'center', sortable:true },
    {width: '80px', title: '结存面积(m²)', field: 'pnlSetArea', align: 'center',},
    {width: '60px', title: '结存pnl数量', field: 'pnlQuantity', align: 'center',},
    {width: '60px', title: '结存set数量', field: 'setQuantity', align: 'center',},
    {width: '45', title: '长(mm)', field: 'pnlLength', align: 'center',},
    {width: '45', title: '宽(mm)', field: 'pnlWidth', align: 'center',},
    {width: '30', title: '层数', field: 'materialLayer', align: 'center',},
    {width: '50', title: '表面处理', field: 'surfaceTreatment', align: 'center',},
    {width: '50', title: '阻焊', field: 'solderCs', align: 'center',},
    {width: '50', title: '字符', field: 'characterGTO', align: 'center',},
    {width: '60', title: '测试方式', field: "testWay", align: 'center',},
  ])

  const checkedDetailColumnList = ref([
    {type: 'checkbox', align: 'center', field: "checkbox", width: '50',},
    {width: '30', type: "seq", title: '序号', field: 'index', align: 'center',},
    {width: '130px', title: '流转卡号', field: 'code', align: 'center', sortable: true},
    {width: '110px', title: '排产时间', field: 'createTime', align: 'center', sortable: true},
    {width: '60px', title: '客户编码', field: 'customerCode', align: 'center', sortable: true},
    {width: '110px', title: '产品编码', field: 'commodityCode', align: 'center',},
    {width: '150px', title: '产品名称', field: 'commodityName', align: 'center',},
    {width: '40px', title: '样/批', field: 'model', align: 'center',},
    {width: '40px', title: '加急', field: 'urgent', align: 'center',},
    {width: '50px', title: '类型', field: 'pnlName', align: 'center',},
    {width: '80px', title: '在线工序', field: 'nodeName', align: 'center', sortable: true},
    {width: '80px', title: '交货日期', field: 'planCompleteTime', align: 'center', sortable: true},
    {width: '80px', title: '总孔数(万)', field: 'sumDrillQuantity', align: 'center', sortable: true},
    {width: '60px', title: '排产数量', field: 'bundlePnlQuantity', align: 'center',},
    {width: '80px', title: '排产面积(m²)', field: 'feedSetArea', align: 'center',},
    {width: '100px', title: '结存时间', field: 'differTime', align: 'center',sortable:true},
    {width: '80px', title: '结存面积(m²)', field: 'pnlSetArea', align: 'center',},
    {width: '60px', title: '结存pnl数量', field: 'pnlQuantity', align: 'center',},
    {width: '60px', title: '结存set数量', field: 'setQuantity', align: 'center',},
    {width: '45', title: '长(mm)', field: 'pnlLength', align: 'center',},
    {width: '45', title: '宽(mm)', field: 'pnlWidth', align: 'center',},
    {width: '30', title: '层数', field: 'materialLayer', align: 'center',},
    {width: '50', title: '表面处理', field: 'surfaceTreatment', align: 'center',},
    {width: '50', title: '阻焊', field: 'solderCs', align: 'center',},
    {width: '50', title: '字符', field: 'characterGTO', align: 'center',},
    {width: '60', title: '测试方式', field: "testWay", align: 'center',},
    {width: "100", title: '操作', showOverflow: 'false', field: 'make', align: 'center', fixed: 'right',},
  ])


  let resDictData = ref({
    //批量/样品
    order_model: [],
    //加急
    order_urgent: [],
  })


  //显示天数信息
  const showDeliveryDays = (days: any) => {
    if (days == -7) {
      return '-7天及以上';
    }
    if (days == 7) {
      return '7天及以上';
    }

    return days + '天';
  }

  //计算行汇总信息
  const getRowTotalInfo = () => {
    deliverDays.value.forEach(dayItem => {
      var tmp: any = cardList.value.filter(o => {
        return o.deliverDays == dayItem.days;
      });
      dayItem.rowTotalInfo.area = 0;
      dayItem.rowTotalInfo.count = 0;
      dayItem.rowTotalInfo.count += tmp.length;
      tmp.forEach(item => {
        dayItem.rowTotalInfo.area += item.pnlSetArea ? Number(item.pnlSetArea) : 0;
      });
    })
  }

  const checkedRef = ref();

  //主表单元格双击
 const onMainTableCellDblClick: VxeTableEvents.CellDblclick<any> = ({ row, column })=> {
   let mergeCraft = craftList.value.find(vo => vo.craftName == '表面处理');
   const ids = craftList.value.map(vo =>  {
     if(vo.craftName == '表面处理' || vo.craftName == '表面后处理' || vo.craftName == '沉金'){
       return vo.id
     }
   });
    var item = cardList.value.filter(o => {
      if(parseInt(column.field) == mergeCraft.id){
        return o.deliverDays == row.days && ids.includes(o.craftId);
      }else {
        return o.deliverDays == row.days && o.craftId == parseInt(column.field);
      }
    })
    if (item) {
      detailQuery.value.days = row.days
      detailQuery.value.craftId = parseInt(column.field)
      detailData.value = item;
      initSearchDetailHandle(item)
      dialog.visible = true;
    }
  };

  const removeCheckedDetail = () => {
    const $table = checkedRef.value.xTableRef
    if ($table) {
      const ids = $table.getCheckboxRecords().map(item => item.id);
      checkedDetailList.value = checkedDetailList.value.filter(item => !ids.includes(item.id));
    }
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const checkUnConfirmList = ref<any>([]);

  /*加入排产按钮*/
  const addProduction = () => {
    const idList = checkedDetailList.value.map(item => item.id);
    checkedDetailList.value = checkedDetailList.value.length > 0 ? checkedDetailList.value.concat(checkUnConfirmList.value.filter(item => !idList.includes(item.id))) : checkUnConfirmList.value;
    ElMessage.success("加入成功");
  }

  const cancel = () => {
    dialog.visible = false;
  }

  const detailRef = ref();

  const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = () => {
    const $table = detailRef.value.xTableRef
    if ($table) {
      if (checkedDetailList.value.length > 0) {
        checkUnConfirmList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
      } else {
        checkUnConfirmList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
      }
    }
  }

  const selectChangeEvent: VxeTableEvents.CheckboxChange<AccountMaterialInOutVo> = ({checked, row}) => {
    const tableRef = detailRef.value.xTableRef
    if (tableRef) {
      const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
      checkUnConfirmList.value = selectRecords.map(item => item);
    }
  }

  const initSearchDetailHandle = (tmp: any[]) => {
    tmp = deepClone(tmp)
    modelList.value = tmp.map(m => m.model)
    modelList.value = [...(new Set(modelList.value))]
    modelList.value = modelList.value.map((item: any) => {
      let label = ''
      if (item && item.includes('+')) {
        item.split('+').map((el, elIndex) => {
          label += resDictData.value?.order_model.find(v => v.dictValue == el)?.dictLabel
          if ((elIndex + 1) != item.split('+').length) {
            label += '+'
          }
        })
      } else {
        label = resDictData.value?.order_model.find(v => v.dictValue == item)?.dictLabel
      }
      return {
        label: label,
        value: item
      }
    })
    nodeNameList.value = tmp.map(m => m.craftId)
    nodeNameList.value = [...(new Set(nodeNameList.value))]
    nodeNameList.value = nodeNameList.value.map((item: any) => {
      const label = craftList.value.find(v => v.id == item)?.craftName
      return {
        label: label,
        value: item
      }
    })
    customerCodeList.value = tmp.map(m => m.customerCode)
    customerCodeList.value = [...(new Set(customerCodeList.value))]
    // console.log(detailData.value)
  }
  //显示列合计
  const showColumnDetail = (craftId) => {
    detailQuery.value.craftId = craftId;
    let mergeCraft = craftList.value.find(vo => vo.craftName == '表面处理');
    const ids = craftList.value.map(vo =>  {
      if(vo.craftName == '表面处理' || vo.craftName == '表面后处理' || vo.craftName == '沉金'){
        return vo.id
      }
    });
    var tmp = cardList.value.filter(o => {
      if (craftId == mergeCraft.id){
        return ids.includes(o.craftId);
      }else {
        return o.craftId == craftId;
      }
    })
    detailData.value = tmp;
    initSearchDetailHandle(tmp)
    dialog.visible = true;
  };

  //显示状态信息
  const showStatusInfo = (days: any, craftId: any) => {
    let mergeCraft = craftList.value.find(vo => vo.craftName == '表面处理');
    const ids = craftList.value.map(vo =>  {
      if(vo.craftName == '表面处理' || vo.craftName == '表面后处理' || vo.craftName == '沉金'){
        return vo.id
      }
    });
    var itemList: any = cardList.value.filter(o => {
      if(craftId == mergeCraft.id){
        return o.deliverDays == days && ids.includes(o.craftId);
      }else {
        return o.deliverDays == days && o.craftId == craftId;
      }
    });
    if (itemList.length > 0) {
      var totalArea = itemList.reduce((prev: any, cur: any) => {
        return prev + Number(cur.pnlSetArea);
      }, 0);
      return totalArea.toFixed(4) + '㎡/' + itemList.length + '款';
    } else {
      return '';
    }
  };

  //显示行合计
  const showRowDetail = (days: any) => {
    detailQuery.value.days = days
    var result = [];
    var tmp = cardList.value.filter(o => {
      return o.deliverDays == days;
    })
    detailData.value = tmp;
    initSearchDetailHandle(tmp)
    dialog.visible = true;
  };

  //显示所有合计
  const showAllDetail = () => {
    detailData.value = cardList.value
    initSearchDetailHandle(cardList.value)
    dialog.visible = true;
  }

  const footerMethod: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
    let mergeCraft = craftList.value.find(vo => vo.craftName == '表面处理');
    const ids = craftList.value.map(vo =>  {
      if(vo.craftName == '表面处理' || vo.craftName == '表面后处理' || vo.craftName == '沉金'){
        return vo.id
      }
    });

    let result = columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "";
      } else if (columnIndex == columns.length - 1) {
        let area = cardList.value.reduce((prev, curr) => {
          return prev + Number(curr.pnlSetArea);
        }, 0);
        return area.toFixed(4) + "㎡/" + cardList.value.length + "款";
      } else {
        let area = 0;
        let allList = cardList.value.filter(v => {
          if(column.field == mergeCraft.id){
            if (ids.includes(v.craftId)){
              area += Number(v.pnlSetArea);
            }
            return ids.includes(v.craftId);
          }else {
            if (v.craftId == column.field) {
              area += Number(v.pnlSetArea);
            }
            return v.craftId == column.field
          }


        });
        return area.toFixed(4) + "㎡/" + allList.length + "款";
      }
      return "";
    })
    return [result]
  };

  const footerMethodDetail: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
    let filteredData = data.filter((obj, index, self) =>
      self.findIndex((t) => t.id === obj.id) === index
    );
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == 'index') {
          return detailData.value.length;
        }
        if (column.field == "feedSetArea") {
          return `${sumNum(filteredData, "feedSetArea").toFixed(4)} `;
        }
        if (column.field == "pnlSetArea") {
          return `${sumNum(data, "pnlSetArea").toFixed(4)} `;
        }
        return "";
      })
    ];
  };

  const sumNum = (list: any[], field: string) => {
    let count = 0;
    list.forEach(item => {
      count += Number(item[field]);
    });
    return Number(count.toFixed(4));
  };

  const handleDelete = (row)=>{
    checkedDetailList.value = checkedDetailList.value.filter(vo=> row.id != vo.id);
  }

  const cellClickEvent: VxeTableEvents.CellClick<any> = ({row, column }) => {
    const tableRef = detailRef.value.xTableRef;
    tableRef.toggleCheckboxRow(row);
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkUnConfirmList.value = selectRecords.map(item => item);
  }

  const cellClickEventChecked: VxeTableEvents.CellClick<any> = ({row, column }) => {
    const tableRef = checkedRef.value.xTableRef;
    tableRef.toggleCheckboxRow(row);
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
  }

  //导出excel
  const exportExcel = ()=> {
    if (checkedDetailList.value.length === 0) {
      ElMessage.info("请选择需要导出的数据");
      return;
    }
    const htmlCollection = document.getElementsByClassName("sort-id");
    const idToIndex = {};
    if(htmlCollection){
      for (let i = 0; i < htmlCollection.length; i++) {
        const id = htmlCollection[i].innerText || "";
        idToIndex[id] = i;
      }
    }
    const list = (checkedDetailList.value || []).sort((o1, o2) => {
      const s1 = (idToIndex[o1.productionId + o1.nodeName] || 0);
      const s2 = (idToIndex[o2.productionId + o2.nodeName] || 0);
      return s1 - s2;
    });

    const temColumnList1 = checkedRef.value?.toolList && checkedRef.value.toolList.filter((item: any) => item.field && item.title && item.visible).sort((a:any, b:any) => a.sortIndex - b.sortIndex) || columnList.value
    const temColumnList = [
      {title: '序号', field: 'index'},
      {title: '订单类型', field: 'model'},
      {title: '是否补料', field: 'isRemediation'},
      {title: '客户编码', field: "customerCode"},
      {title: '加急', field: 'urgent'},
      {title: '产品编码', field: 'commodityCode'},
      {title: '产品名称', field: 'commodityName'},
      {title: '类型', field: 'pnlName'},
      {title: '排产时间', field: 'createTime'},
      {title: '工厂交期', field: 'planCompleteTime'},
      {title: '总孔数(万)', field: "sumDrillQuantity"},
      {title: '排产数量', field: "bundlePnlQuantity"},
      {title: '结存面积', field: "pnlSetArea"},
      {title: '结存pnl数量', field: 'pnlQuantity'},
      { title: '结存set数量', field: 'setQuantity'},
      {title: '长(mm)', field: 'pnlLength'},
      {title: '宽(mm)', field: 'pnlWidth'},
      {title: '层数', field: "materialLayer"},
      {title: '表面处理', field: "surfaceTreatment"},
      {title: '阻焊', field: "solderCs"},
      {title: '字符', field: "characterGTO"},
      {title: '测试方式', field: "testWay"},
      {title: '在线工序', field: 'nodeName'},
      {title: '排产工序', field: 'chargeNode'},
      {title: '备注', field: 'remark'},
    ];

    var result = list.map((item, index) => {
      let param = {}
      temColumnList.forEach((v: any) => {
        if (v.field && v.field != 'make') {
          if (v.field == 'index') {
            param['index'] = index + 1
          } else if (v.field == 'isRemediation') {
            param['isRemediation'] = item.isRemediation == '1' ? '补料':'正常'
            // resDictData.value.order_type.find((el: any) => el.dictValue == item['orderType'])?.dictLabel
          } else if (v.field == 'sourceTypeName') {
            param['sourceTypeName'] = item.pnlName
          } else if (v.field == 'model') {
            let label = ''
            if (item.model && item.model.includes('+')) {
              item.model.split('+').map((el, elIndex) => {
                label += resDictData.value?.order_model.find(v => v.dictValue == el)?.dictLabel
                if ((elIndex + 1) != item.model.split('+').length) {
                  label += '+'
                }
              })
            } else {
              label = resDictData.value?.order_model.find(v => v.dictValue == item.model)?.dictLabel
            }
            param['model'] = label
          } else if (v.field == 'feedSetArea'){
            param['feedSetArea'] = Number(item.feedSetArea).toFixed(4)
          } else if (v.field == 'pnlSetArea'){
            param['pnlSetArea'] = Number(item.pnlSetArea).toFixed(4)
          } else if (v.field == 'createTime') {
            param['createTime'] = dayjs(new Date(item.createTime)).format("YYYY-MM-DD")
          } else if (v.field == 'planCompleteTime') {
            param['planCompleteTime'] = dayjs(new Date(item.planCompleteTime)).format("YYYY-MM-DD")
          } else if (v.field == 'taskArea') {
            param['taskArea'] = Number(item.taskArea).toFixed(4)
          } else if (v.field == 'nodeName') {
            param['nodeName'] = craftList.value.find(info => info.id == item.craftId)?.craftName
          } else if (v.field == 'chargeNode') {
            param['chargeNode'] = targetCraft.value
          } else if (v.field == 'remark') {
            param['remark'] = ''
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

    exportDailyProduction(result);
    return ;
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
    ws["A1"] = { v: `${currentDate} 计划排单表` };

    //列名
    const titleList = temColumnList.filter((item:any) => (item.field && item.field != 'make') && item.title).map((item: any) => item.title)
    xlsx.utils.sheet_add_aoa(ws, [titleList],
      { origin: "A2" });

    const wchList = titleList.map((item: any) => {
      return {
        wch: 8
      }
    })
    ws["!cols"] = [{ wch: 3 }, { wch: 3 }, { wch: 3 }, { wch: 5 }, {wch:3}, { wch: 12 }, { wch: 12 },{ wch: 3 },
      { wch: 8 }, { wch: 8 }, { wch: 6 }, { wch: 4 }, { wch: 7 },{ wch: 4 }, { wch: 4 }, { wch: 4 },
      { wch: 3 }, { wch: 5 }, { wch: 3 }, { wch: 3 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, {wch:5}
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
        `${currentDate}-计划排单表.xlsx`
      );
    } catch (e) {
      // this.$message.error(e);
    }
    // var result = list.map((item, index) => {
    //   return {
    //     //序号
    //     index: index + 1,
    //     //订单类型
    //     orderType: item.orderType,
    //     isRemediation: item.isRemediation ? '补料':'正常',
    //     //客户编码
    //     customerCode: item.customerCode,
    //     //加急
    //     urgent: item.urgent,
    //     //产品编码
    //     commodityCode: item.commodityCode,
    //     //产品名称
    //     commodityName: item.commodityName,
    //     //类型
    //     sourceTypeName: item.pnlName,
    //     //排产时间
    //     createTime: dayjs(new Date(item.createTime)).format("YYYY-MM-DD"),
    //     //工厂交期
    //     planCompleteTime: dayjs(new Date(item.planCompleteTime)).format("YYYY-MM-DD"),
    //     //总孔数
    //     sumDrillQuantity: item.sumDrillQuantity == null ? '' : item.sumDrillQuantity,
    //     //排产数量
    //     bundlePnlQuantity: item.bundlePnlQuantity,
    //     //排产面积
    //     //taskArea: Number(item.taskArea.toFixed(4)),
    //     //结存面积
    //     pnlSetArea: item.pnlSetArea,
    //     // 结存数量
    //     pnlQuantity: item.pnlQuantity,
    //     //长
    //     pnlLength: item.pnlLength,
    //     //宽
    //     pnlWidth: item.pnlWidth,
    //     //层数
    //     materialLayer: item.materialLayer,
    //     //表面处理
    //     surfaceTreatment: (item.surfaceTreatment || ""),
    //     //阻焊
    //     solderCs: (item.solderCs || ""),
    //     //字符
    //     characterGTO: (item.characterGTO || ""),
    //     //测试方式
    //     testWay: (item.testWay || ""),
    //     //工艺
    //     //productionPlanName: item.productionPlanName,
    //     //在线工序
    //     nodeName: craftList.value.find(info => info.id == item.craftId)?.craftName ,
    //     //排产工序
    //     chargeNode: targetCraft.value,
    //     //备注
    //     remark:'',
    //     //流转卡号
    //     //productionCode: item.productionCode,
    //   }
    // });

    // const today = new Date();
    // const year = today.getFullYear();
    // const month = today.getMonth() + 1;
    // const day = today.getDate();
    // const currentDate = `${year}-${month}-${day}`;

    // //数据导入
    // var ws = xlsx.utils.json_to_sheet(result, { origin: "A2" });

    // ws['!merges'] = [
    //   { s: { r: 0, c: 0 }, e: { r: 0, c: 23 } }
    // ];

    // //表名
    // ws["A1"] = { v: `${targetCraft.value} ${currentDate} 计划排单表` };

    // //列名
    // xlsx.utils.sheet_add_aoa(ws, [['序号','订单类型', '是否补料', '客户编码','加急', '产品编码', '产品名称', '类型',
    //     '排产时间', '工厂交期', '总孔数(万)', '排产数量', '结存面积(m²)', '结存数量','长(mm)', '宽(mm)',
    //     '层数', '表面处理', '阻焊', '字符', '测试方式','在线工序','排产工序','备注'
    //   ]],
    //   { origin: "A2" });

    // ws["!cols"] = [{ wch: 3 }, { wch: 3 }, { wch: 3 }, { wch: 5 }, {wch:3}, { wch: 12 }, { wch: 12 },{ wch: 4 },
    //   { wch: 8 }, { wch: 8 }, { wch: 6 }, { wch: 4 }, { wch: 7 },{ wch: 4 }, { wch: 4 }, { wch: 4 },
    //   { wch: 3 }, { wch: 5 }, { wch: 3 }, { wch: 3 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, {wch:5}
    // ];

    // const cellStyle = {
    //   font: {
    //     name: '宋体',
    //     sz: 9,
    //     //color: { rgb: "ffffff" },
    //     //bold: true,
    //     //italic: false,
    //     //underline: false,
    //     height: 50
    //   },
    //   alignment: { horizontal: "center" },
    //   border: {
    //     top: { style: "thin" },
    //     bottom: { style: "thin" },
    //     left: { style: "thin" },
    //     right: { style: "thin" }
    //   }
    // };

    // var range = xlsx.utils.decode_range(ws["!ref"]);

    // for (let i = range.s.r; i <= range.e.r; i++) {
    //   for (let j = range.s.c; j <= range.e.c; j++) {
    //     var cellName = xlsx.utils.encode_cell({ r: i, c: j });
    //     ws[cellName] = Object.assign({}, ws[cellName], { s: cellStyle });
    //   }
    // }

    // var workbook = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(workbook, ws, 'sheet1');
    // var file = xlsx.write(workbook, { type: 'buffer' });
    // try {
    //   fileSaver.saveAs(
    //     new Blob([file], { type: "application/octet-stream" }),
    //     `${currentDate}-计划排单表.xlsx`
    //   );
    // } catch (e) {
    //   // this.$message.error(e);
    // }
  };

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = deepClone(initQueryParams);
    Object.keys(params).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".") + 1);
        queryParams.value[queryParamsKey] = params[key];
      } else {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.value[key] = params[key];
        }
      }
    });
    getList()
  }

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_model,order_urgent";
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
  const handleQuery = () => {
    getList();
  }

  // 不为空返回true
  const unIsEmpty = (value: any) => {
    let res = false
    if (value == undefined || value == null || ((typeof value == 'string') && value == '')) {
      res = true
    }
    return !res
  }
  // 详情接口查询
  const searchDetail = () => {
    let tmp = cardList.value
    if (unIsEmpty(detailQuery.value.craftId)) {
      let mergeCraft = craftList.value.find(vo => vo.craftName == '表面处理');
      const ids = craftList.value.map(vo =>  {
        if(vo.craftName == '表面处理' || vo.craftName == '表面后处理' || vo.craftName == '沉金'){
          return vo.id
        }
      });
      if(detailQuery.value.craftId == mergeCraft.id){
        tmp = tmp.filter(o => ids.includes(o.craftId))
      } else {
        tmp = tmp.filter(o => o.craftId == detailQuery.value.craftId)
      }
    }
    if (unIsEmpty(detailQuery.value.days)) {
      tmp = tmp.filter(o => o.deliverDays == detailQuery.value.days)
    }
    if (unIsEmpty(detailQuery.value.commodityCode)) {
      tmp = tmp.filter(o => o.commodityCode.includes(detailQuery.value.commodityCode))
    }
    if (unIsEmpty(detailQuery.value.customerCode)) {
      tmp = tmp.filter(o => o.customerCode == detailQuery.value.customerCode)
    }
    if (unIsEmpty(detailQuery.value.nodeName)) {
      tmp = tmp.filter(o => o.craftId == detailQuery.value.nodeName)
    }
    if (unIsEmpty(detailQuery.value.planCompleteTime)) {
      tmp = tmp.filter(o => o.planCompleteTime == detailQuery.value.planCompleteTime)
    }
    if (unIsEmpty(detailQuery.value.code)) {
      tmp = tmp.filter(o => o.code.includes(detailQuery.value.code))
    }
    if (unIsEmpty(detailQuery.value.model)) {
      tmp = tmp.filter(o => o.model == detailQuery.value.model)
    }
    detailData.value = tmp
  }

  // 关闭详情弹框
  const closeDialog = () => {
    nextTick(() => {
      for (let key in detailQuery.value) {
        detailQuery.value[key] = undefined
      }
      modelList.value = []
      nodeNameList.value = []
      customerCodeList.value = []
    })
  }

  onMounted(() => {
    for (var i = -7; i <= 7; i++) {
      deliverDays.value.push({
        days: i,
        rowTotalInfo: {
          area: 0,
          count: 0
        }
      });
    }
    getDictOptions()
    getList()
  });


    // 关闭详情弹框
  const changeProType = () => {
      console.log("queryParams.mode",queryParams.value);
      if(queryParams.value.isRemediationDesc){
        queryParams.value.isRemediation='1'
      }else{
        queryParams.value.isRemediation=undefined;
      }
      getList().finally(()=>{
        mainRef.value.xTableRef.updateFooter();
      })
  }
</script>

<style lang="scss" scoped>
:deep(.xtable-half) {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  width: 100%;
  overflow: hidden;
  .showText,
  .x-page-dom,
  .x-table-dom {
    width: 100% !important;
  }
  .x-table-dom {
    flex: 1;
    overflow: hidden;

    .vxe-table--main-wrapper,
    .vxe-table--render-wrapper,
    .vxe-table {
      width: 100%;
      height: 100% !important;
    }

    .vxe-table--main-wrapper {
      display: flex;
      flex-direction: column;

      .vxe-table--header-wrapper {
        width: 100%;
      }
      .vxe-table--body-wrapper {
        width: 100%;
        flex: 1;
      }
    }

    // 固定列的高度是计算出来的，头部/主体/尾部都使用了定位
    // .vxe-table--fixed-wrapper {
    //   // position: absolute;
    //   // top: 0;
    //   // left: 0;
    //   // width: 100%;
    //   height: 100% !important;
    //   .vxe-table--fixed-right-wrapper {
    //     // width: 100%;
    //     height: 100% !important;
    //     display: flex;
    //     flex-direction: column;

    //     // .vxe-table--header-wrapper {
    //     //   width: 100%;
    //     // }
    //     .vxe-table--body-wrapper {
    //       // width: 100%;
    //       flex: 1 !important;
    //     }
    //   }
    // }
  }

}
.no-padding-pop {
  .el-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>

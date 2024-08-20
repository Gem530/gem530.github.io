<template>
  <div class="p-2 xtable-page">
    <SupConfirmTab
      :dataList="dataList"
      :columnList="columnList"
      :columnList2="columnList"
      :columnList3="columnList"
      :intervalCondition="['deliverTime']"
      toolId1="waitFullConfirmDetails"
      toolId2="confirmFullDetails"
      toolId3="waitOtherFullConfirmDetails"
      :loading="loading"
      :total="total"
      :moduleCode="moduleCode"
      :bizType="bizType"
      :dictData="resDictData"
      @searchChange="searchChange"
      @exportExcel="exportExcel"
      @cancelAccount="cancelAccount"
    ></SupConfirmTab>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import {getDicts} from "@/api/system/dict/data";
import {sortBy} from "@/utils/dict";
import {listSupplierOrder, outSourceCancelOrder} from "@/api/outsource/sourceFullProcessOrder";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dataList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

// 文件上传类型
const moduleCode = ref('4');
const bizType = ref('16');

let resDictData = ref({
  //加急
  order_urgent: [],
  //订单类型
  order_type: [],
  //批量/样品
  order_model: [],
  //阻焊颜色
  order_commodity_solder: [],
  //字符颜色
  order_character: [],
  //板材
  order_material_quality: [],
})

/**
 * 获取字典数据
 */
const getDictOptions = async () => {
  const rules = [['dictSort', 'asc']];
  const string = "order_urgent,order_type,order_model,order_commodity_solder,order_character,order_material_quality";
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

const columnList = ref([
  {title: "序号", width: '50', type: 'seq', field: 'index', align: 'center',},
  {title: '单据状态', width: '90', field: 'confirmStatus', align: 'center',},
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入外协单号'}
  },
  { title: '外协供应商', width: '160', field: 'supplierName', align: 'center'},
  {title: '客户名称', width: '160', field: 'ownerName', align: 'center',},
  {
    width: '50',
    title: '加急',
    field: 'urgent',
    align: 'center',
    filterType: 'radioButton',
    filterParam: {placeholder: '请选择加急'},
    filterData: () => [...resDictData.value.order_urgent],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: '90',
    title: '客户交期',
    field: 'deliverTime',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
    }
  },
  {
    width: '60',
    title: '新/返',
    field: 'orderType',
    align: 'center',
    filterType: 'radioButton',
    filterParam: {placeholder: '请选择新/返'},
    filterData: () => [...resDictData.value.order_type],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: '80',
    title: '批/样',
    field: 'model',

    align: 'center',
    filterType: 'radioButton',
    filterParam: {placeholder: '请选批量/样品'},
    filterData: () => [...resDictData.value.order_model],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    title: '产品编码',
    width: '160',
    field: 'commodityCode',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入产品编码'}
  },
  {
    title: '产品名称',
    width: '180',
    field: 'commodityName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入产品名称'}
  },
  {title: '外协数量（PCS）', width: '100', field: 'quantity', align: 'center',},
  {title: '外协单价', width: '80', field: 'price', align: 'center',},
  {title: '外协总价', width: '80', field: 'totalPrice', align: 'center'},
  {
    width: '90',
    title: '板材',
    field: 'materialQuality',
    align: 'center',
    filterType: 'select',
    filterParam: {placeholder: '请选择板材'},
    filterData: () => [...resDictData.value.order_material_quality],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}

  },
  {
    title: '成品板厚',
    width: '80',
    field: 'commodityThickness',
    align: 'center',
  },
  {
    title: '层数',
    width: '80',
    field: 'materialLayer',
    align: 'center',
  },
  {
    title: '内层铜厚',
    width: '80',
    field: 'materialCopperInside',
    align: 'center',
  },
  {
    title: '外层铜厚',
    width: '80',
    field: 'materialCopperOutside',
    align: 'center',
  },
  {
    width: '90',
    title: '表面处理',
    field: 'surfaceTreatment',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入表面处理'}
  },
  {
    width: '90',
    title: '阻焊颜色',
    field: 'commoditySolder',
    align: 'center',
    filterType: 'select',
    filterParam: {placeholder: '请选择阻焊颜色'},
    filterData: () => [...resDictData.value.order_commodity_solder],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: '90',
    title: '字符',
    field: 'characterColor',
    align: 'center',
    filterType: 'select',
    filterParam: {placeholder: '请输入字符'},
    filterData: () => [...resDictData.value.order_character],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },

  {
    title: 'SET长',
    width: '80',
    field: 'unitedLength',
    align: 'center',
  },
  {
    title: 'SET宽',
    width: '80',
    field: 'unitedWidth',
    align: 'center',
  },
  {title: '联片数量', width: '80', field: 'unitedNumber', align: 'center'},
  {title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right',},
]);

// 获取 搜索条件
const searchChange = async (params: any) => {
  loading.value = true;
  const res = await listSupplierOrder(params);
  dataList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 导出前操作 */
const exportExcel = async (queryParams:any,toolId :any) => {
        proxy?.download('outsource/sourceFullProcessOrder/supExport', {
          ...queryParams, tableName: toolId
        }, `外协订单_${new Date().getTime()}.xlsx`);
      }
/**
 * 查询外协订单列表
 * */
const getSupplierList = async () => {
   let queryParams= {
    pageNum: 1,
    pageSize: 20,
    confirmStatus: '2',
   }
  searchChange(queryParams);
}

/** 取消单据 */
const cancelAccount = async (order: any) => {
  order.status = '4';
  order.confirmStatus = '1';
  await outSourceCancelOrder(order).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("修改成功");
}

onMounted(() => {
  getSupplierList();
  getDictOptions();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>

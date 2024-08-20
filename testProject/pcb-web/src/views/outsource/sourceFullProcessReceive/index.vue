<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <!-- <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="18">
            <el-radio-group v-model="radioTable">
              <el-radio-button label="申请列表" @change="radioTableHandle" />
            </el-radio-group>
          </el-col> -->

      <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              >导出</el-button
            >
          </el-col> -->
      <!-- </el-row>
      </template> -->
      <el-tabs type="border-card" class="xtable-tab"  @tab-click="radioTableHandle">
        <el-tab-pane label="待收货列表">
          <XTable toolId="outsourceSourceFullProcessReceiveWait" height="100%" class="xtable-content"
                  v-model:page-size="queryParams.pageSize" :loading="loading"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="sourceFullProcessReceiveList"
                  :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','deliverTime','createTime']"
                  :columnList="columnList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{ reserve: true }"
                  :row-config="{ keyField: 'id' }"
          >
            <template #default-dispatchTime="{ row }">
              <div>{{dateFormat(row.dispatchTime)}}</div>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{dateFormat(row.placeOrderTime)}}</div>
            </template>
            <template #default-urgent="{ row }">
              <div>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div>
            </template>
            <template #default-orderType="{row}">
              <div>{{ resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</div>
            </template>
            <template #default-model="{ row }">
              <div>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div>
            </template>
            <template #default-materialQuality="{ row }">
              <div>{{ resDictData?.order_material_quality.find(v => v.dictValue == row.materialQuality)?.dictLabel }}</div>
            </template>
            <template #default-commodityThickness="{ row }">
              <div>{{ resDictData?.finish_plate_thickness.find(v => v.dictValue == row.commodityThickness)?.dictLabel }}</div>
            </template>
            <template #default-surfaceTreatment="{ row }">
              <div>{{ resDictData?.order_surface_treatment.find(v => v.dictValue == row.surfaceTreatment)?.dictLabel }}</div>
            </template>
            <template #default-commoditySolder="{ row }">
              <div>{{ resDictData?.order_commodity_solder.find(v => v.dictValue == row.commoditySolder)?.dictLabel }}</div>
            </template>
            <template #default-characterColor="{ row }">
              <div>{{ resDictData?.order_character.find(v => v.dictValue == row.characterColor)?.dictLabel }}</div>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-storageId="{ row }">
              <div>{{ materialStorageList?.find(v => v.id == row.storageId)?.name }}</div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-if="!wxhSwitch && scope.row.waitReceiveNum>0" @click="handleUpdate(scope.row)" >收货</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)" >申请单详情</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="收货记录">
          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <el-button plain @click="handleExportRecord">导出 </el-button>
          </div>
          <XTable toolId="outsourceSourceFullProcessReceiveRecord" height="100%" class="xtable-content"
                  v-loading="receiveLoading"
                  v-model:page-size="receiveQueryParams.pageSize"
                  v-model:current-page="receiveQueryParams.pageNum"
                  :page-params="{ perfect: true, total: receiveTotal }"
                  :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','deliverTime','createTime','receiveTime']"
                  :data="receiveList"
                  :columnList="receiveColumnList"
                  border :showRefresh="true"
                  @searchChange="receiveQuerySchChange"
                  :column-config="{ resizable: true }"
          >
            <template #default-dispatchTime="{ row }">
              <div>{{dateFormat(row.dispatchTime)}}</div>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{dateFormat(row.placeOrderTime)}}</div>
            </template>
            <template #default-urgent="{ row }">
              <div>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div>
            </template>
            <template #default-orderType="{row}">
              <div>{{ resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</div>
            </template>
            <template #default-model="{ row }">
              <div>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div>
            </template>
            <template #default-materialQuality="{ row }">
              <div>{{ resDictData?.order_material_quality.find(v => v.dictValue == row.materialQuality)?.dictLabel }}</div>
            </template>
            <template #default-commodityThickness="{ row }">
              <div>{{ resDictData?.finish_plate_thickness.find(v => v.dictValue == row.commodityThickness)?.dictLabel }}</div>
            </template>
            <template #default-surfaceTreatment="{ row }">
              <div>{{ resDictData?.order_surface_treatment.find(v => v.dictValue == row.surfaceTreatment)?.dictLabel }}</div>
            </template>
            <template #default-commoditySolder="{ row }">
              <div>{{ resDictData?.order_commodity_solder.find(v => v.dictValue == row.commoditySolder)?.dictLabel }}</div>
            </template>
            <template #default-characterColor="{ row }">
              <div>{{ resDictData?.order_character.find(v => v.dictValue == row.characterColor)?.dictLabel }}</div>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-storageName="{ row }">
              <div>{{ materialStorageList?.find(v => v.id == row.storageId)?.name }}</div>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加或修改订单外协收货记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%">
      <el-row>
        <el-col :span="8">
          <h3>受理人: {{ nickname }}</h3>
        </el-col>
        <el-col :span="8">
          <h3>受理时间: {{ currentTime }}</h3>
        </el-col>
      </el-row>

      <XTable ref="xTable" :pageShow="false" :edit-rules="validRules" :data="formReceiveList" :columnList="formReceiveColumnList" border>
        <template #default-quantity="{ row }">
          <el-input-number :precision="0" :min="1" :disabled="dialog.title?.includes('详情')" style="width: 99%;"
                           :controls="false" v-model="form.quantity"  />
        </template>
        <template #default-reserveQuantity="{ row }">
          <el-input-number :precision="0" :min="0" :disabled="dialog.title?.includes('详情')" style="width: 99%;"
                           :controls="false" v-model="form.reserveQuantity"  />
        </template>
        <template #default-storageId="{ row }">
          <el-select
            v-model="form.storageId"
            placeholder="请选择入库仓"
            :disabled="dialog.title?.includes('详情') || storageIdFlag"
            style="width: 100%;"
          >
            <el-option v-for="item in materialStorageList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </template>
        <template #default-dispatchTime="{ row }">
          {{dateFormat(row.dispatchTime)}}
        </template>
        <template #default-urgent="{ row }">
          <div>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div>
        </template>
        <template #default-orderType="{row}">
          <div>{{ resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</div>
        </template>
        <template #default-model="{ row }">
          <div>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div>
        </template>
        <template #default-remark="{ row }">
          <el-input maxLength="1000" v-model="form.remark" :disabled="dialog.title?.includes('详情')" placeholder="备注" />
        </template>
      </XTable>

      <template #footer>
        <div style="display: flex; justify-content: center;">

          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" v-show="dialog.title?.includes('收货')" @click="submitForm" >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改订单外协订单对话框 -->
    <el-drawer :title="drawer.title" v-model="drawer.visible" size="70%">
      <div v-loading="dialogTableLoading">
        <SendOutSource
          ref="SendOutSourceRef"
          v-if="!dialogTableLoading"
          :orderInfo="currentInfo"
          :disabled="disabled"
          :checkAddress="false"
          :isShow="false"
          :outSourceOrder="outSourceOrder"
        ></SendOutSource>
        <SaleDescriptions style="padding-top: 50px;" v-if="currentInfo" :isShow="false" :currentInfo="currentInfo"
                          :customerList="detailCustomerList" :resDictData="resDictData"></SaleDescriptions>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <!-- <el-button type="primary" v-show="dialog.title?.includes('收货')" @click="submitForm" >
           确认
         </el-button> -->
          <el-button @click="drawerCancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="SourceFullProcessReceive" lang="ts">
  import { listSourceFullProcessReceive,listSourceReceive, getSourceFullProcessReceive, delSourceFullProcessReceive, addSourceFullProcessReceive, updateSourceFullProcessReceive } from '@/api/outsource/sourceFullProcessReceive';
  import { SourceFullProcessReceiveVO, SourceFullProcessReceiveQuery, SourceFullProcessReceiveForm } from '@/api/outsource/sourceFullProcessReceive/types';
  import { VxeTableEvents } from 'vxe-table'
  import useUserStore from '@/store/modules/user';
  import { listMaterialStorageNoPage } from '@/api/purchase/materialStorage';
  import { MaterialStorageVO } from '@/api/purchase/materialStorage/types';
  import { VXETable, VxeTableInstance } from "vxe-table";
  import { VxeTablePropTypes } from "vxe-table";
  import { SourceFullProcessOrderVO } from '@/api/outsource/sourceFullProcessOrder/types';
  import {  getSourceFullProcessOrder, } from '@/api/outsource/sourceFullProcessOrder';
  import {  getOrder } from '@/api/order/directOrder';
  import { getDicts } from "@/api/system/dict/data";
  import { sortBy } from "@/utils/dict";
  import { el } from 'element-plus/es/locale';
  import dayjs from "dayjs";
  import {ref} from "vue";

  const wxhSwitch = ref(import.meta.env.VITE_WXH_SWITCH === 'true');

  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  const disabled = ref(false);
  const xTable = ref();
  const sourceFullProcessReceiveList = ref<SourceFullProcessReceiveVO[]>([]);
  const formReceiveList = ref<SourceFullProcessReceiveVO[]>([]);
  const receiveList = ref<SourceFullProcessReceiveVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const receiveLoading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const receiveTotal = ref(0);
  const SendOutSourceRef = ref<any>();
  let currentInfo = ref<any>(undefined);
  const queryFormRef = ref<ElFormInstance>();
  const outSourceOrder = ref<SourceFullProcessOrderVO>();
  const sourceFullProcessReceiveFormRef = ref<ElFormInstance>();

  const waitReceiveQuantity = computed(() => {
    return form.value.outSourceQuantity-form.value.receiveQuantity;
  })
  const drawer = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });
  const dateFormat = (cellValue : any) => {
    return dayjs(cellValue).format("YYYY-MM-DD")
  }
  /** 查询仓库列表 */
  const getStorageList = async () => {

    const res = await listMaterialStorageNoPage({name:'成品'});
    materialStorageList.value = res.data;

  }
  const validRules = ref<VxeTablePropTypes.EditRules<SourceFullProcessReceiveForm>>({
    quantity: [
      { required: true, message: "数量不能为空" }
    ],
    storageId: [
      { required: true, message: "请选择仓库" }
    ]});
  //仓库地址
  const materialStorageList = ref<MaterialStorageVO[]>([]);

  const radioTable = ref('申请列表');
  const detailCustomerList = ref<any[]>([]);
  // 切换菜单栏
  const radioTableHandle = async (tab: any, event: any) => {
    radioTable.value = tab.props.label;
    if (radioTable.value == "待收货列表") {
      await getList();
    } else  {
      await getReceiveList();
    }
  }
  const { nickname } = useUserStore();
  // 使用 ref 创建 currentTime 变量
  const currentTime = ref(getCurrentTime());
  // 获取当前时间的方法
  function getCurrentTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('zh-CN', options).format(now);
  }

  // 更新当前时间
  function updateCurrentTime() {
    const update = () => {
      currentTime.value = getCurrentTime();
      requestAnimationFrame(update); // 递归调用，实现动画效果
    };
    update(); // 启动更新
  }
  const initFormData: SourceFullProcessReceiveForm = {
    id: undefined,
    fullProcessOrderId: undefined,
    quantity: undefined,
    waitReceiveNum: undefined,
    receiveTime: undefined,
    storageId: undefined,
    remark: undefined
  }

  const data = reactive<PageData<SourceFullProcessReceiveForm, SourceFullProcessReceiveQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      fullProcessOrderId: undefined,
      quantity: undefined,
      receiveTime: undefined,
      storageId: undefined,
      ownerId: undefined,
      params: {
      }
    },
    rules: {
      quantity: [
        { required: true, message: "收货数量不能为空", trigger: "blur" }
      ],
      storageId: [
        { required: true, message: "仓库不能为空", trigger: "blur" }
      ]
    }
  });

  const receiveData = reactive<PageData<SourceFullProcessReceiveForm, SourceFullProcessReceiveQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      fullProcessOrderId: undefined,
      quantity: undefined,
      receiveTime: undefined,
      storageId: undefined,
      ownerId: undefined,
      params: {
      }
    },
    rules: {
    }
  });

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

  const XTableRef = ref()

  const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { title: '外协单号', width: '120', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
    { title: '外协供应商', width: '160', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商' } },
    // { title: '外协单价', width: '80', field: 'price', align: 'center', },
    { title: '客户名称', width: '160', field: 'cusName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
    { title: '客户编码', width: '80', field: 'customerCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户编码' } },
    // { title: '加急', width: '80', field: 'urgent', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
    {
      width: '60',
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
      title: '交货日期',
      field: 'dispatchTime',

      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      }},
    {
      width: '90',
      title: '要求交期',
      field: 'deliverTime',

      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      }
    },
    {
      width: '90',
      title: '外协时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      }
    },
    {
      width: '90',
      title: '下单时间',
      field: 'placeOrderTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      }
    },
    // { title: '新/返', width: '80', field: 'orderType', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
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
    // { title: '批/样', width: '80', field: 'model', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
    {
      width: '80',
      title: '批/样',
      field: 'model',

      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择批量/样品'},
      filterData: () => [...resDictData.value.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    { title: '产品编码', width: '100', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
    { title: '产品名称', width: '140', field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品名称' } },
    { title: '订单数量', width: '80', field: 'saleQuantity', align: 'center', },
    // { title: '订单单价', width: '80', field: 'salePrice', align: 'center', },
    { title: '订单面积', width: '80', field: 'area', align: 'center', },
    // { title: '平米价', width: '80', field: 'areaPrice', align: 'center', },
    // { title: '订单总价', width: '80', field: 'totalPrice', align: 'center' },
    { title: '外协数量', width: '80', field: 'outSourceQuantity', align: 'center', },
    { title: '待收数', width: '80', field: 'waitReceiveNum', align: 'center', },
    { title: '收货数', width: '80', field: 'receiveQuantity', align: 'center',},
    { title: '备品数量', width: '80', field: 'reserveQuantity', align: 'center',  },
    { title: '入库仓', width: '80', field: 'storageId', align: 'center', },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
  ]);
  //收货列表
  const formReceiveColumnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { title: '外协单号', width: '120', field: 'code', align: 'center' },
    { title: '外协供应商', width: '140', field: 'supplierName', align: 'center'},
    // { title: '外协单价', width: '80', field: 'price', align: 'center', },
    { title: '客户名称', width: '160', field: 'cusName', align: 'center', },
    { title: '客户编码', width: '80', field: 'customerCode', align: 'center',},
    { title: '加急', width: '80', field: 'urgent', align: 'center',},
    { title: '交货日期', width: '80', field: 'dispatchTime', align: 'center', },
    { title: '要求交期', width: '80', field: 'deliverTime', align: 'center', },
    { title: '新/返', width: '80', field: 'orderType', align: 'center', },
    { title: '批/样', width: '80', field: 'model', align: 'center',  },
    { title: '产品编码', width: '100', field: 'commodityCode', align: 'center', },
    { title: '产品名称', width: '80', field: 'commodityName', align: 'center',},
    { title: '订单数量', width: '80', field: 'saleQuantity', align: 'center', },
    // { title: '订单单价', width: '80', field: 'salePrice', align: 'center', },
    { title: '订单面积', width: '80', field: 'area', align: 'center', },
    // { title: '平米价', width: '80', field: 'areaPrice', align: 'center', },
    // { title: '订单总价', width: '80', field: 'totalPrice', align: 'center' },
    { title: '外协数量', width: '80', field: 'outSourceQuantity', fixed: 'right', align: 'center', },
    { title: '待收数', width: '80', field: 'waitReceiveNum', fixed: 'right', align: 'center',  },
    { title: '已收数', width: '80', field: 'receiveQuantity', fixed: 'right',align: 'center', },
    { title: '收货数量', width: '80', field: 'quantity', fixed: 'right',align: 'center',  },
    { title: '备品数量', width: '80', field: 'reserveQuantity', fixed: 'right',align: 'center',  },
    { title: '入库仓', width: '180', field: 'storageId', fixed: 'right', align: 'center',  },
    { title: '备注', field: 'remark', align: 'center', width: '120', fixed: 'right', },
  ]);
  const receiveColumnList = ref([

    { title:"序号" ,type: 'seq', field:'index', align: 'center', width: '60' },
    { title: '外协单号', width: '120', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
    { title: '外协供应商', width: '180', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商' } },
    // { title: '外协单价', width: '80', field: 'price', align: 'center', },
    { title: '客户名称', width: '180', field: 'cusName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } },
    { title: '客户编码', width: '80', field: 'customerCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户编码' } },
    // { title: '加急', width: '80', field: 'urgent', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
    {
      width: '60',
      title: '加急',
      field: 'urgent',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.value.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    // { title: '交货日期', width: '140', field: 'dispatchTime', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
    {
      width: '90',
      title: '交货日期',
      field: 'dispatchTime',

      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      }
    },
    {
      width: '90',
      title: '要求交期',
      field: 'deliverTime',

      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      }
    },
    {
      width: '90',
      title: '收货时间',
      field: 'receiveTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      }
    },
    {
      width: '90',
      title: '外协时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      }
    },
    {
      width: '90',
      title: '下单时间',
      field: 'placeOrderTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      }
    },
    // { title: '新/返', width: '80', field: 'orderType', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
    {
      width: '60',
      title: '新/返',
      field: 'orderType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    // { title: '批/样', width: '80', field: 'model', align: 'center', filterType: 'input', filterParam: { placeholder: '客户编码' } },
    {
      width: '80',
      title: '批/样',
      field: 'model',

      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.value.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    { title: '产品编码', width: '80', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' } },
    { title: '产品名称', width: '80', field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品名称' } },
    { title: '订单数量', width: '80', field: 'saleQuantity', align: 'center', },
    // { title: '订单单价', width: '80', field: 'salePrice', align: 'center', },
    { title: '订单面积', width: '80', field: 'area', align: 'center', },
    // { title: '平米价', width: '80', field: 'areaPrice', align: 'center', },
    // { title: '订单总价', width: '80', field: 'totalPrice', align: 'center' },
    { title: '外协数量', width: '80', field: 'outSourceQuantity',  align: 'center', },
    { title: '收货数量', width: '80', field: 'quantity',align: 'center', },
    { title: '备品数量', width: '80', field: 'reserveQuantity', align: 'center',  },
    { title: '入库仓', width: '100', field: 'storageName', align: 'center' },
    { title: '备注', field: 'remark', align: 'center', width: '120',  },
  ]);
  const dialogTableLoading = ref(false)

  const checkedSourceFullProcessReceiveList = ref<SourceFullProcessReceiveVO[]>([]);

  const { queryParams, form, rules } = toRefs(data);

  const { queryParams:receiveQueryParams} = toRefs(receiveData);


  const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceFullProcessReceiveVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
      const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
      checkedSourceFullProcessReceiveList.value = selectRecords.map(item => item);
    }
  }

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = params
    getList()
  }
  // 获取 搜索条件
  const receiveQuerySchChange = (params: any) => {
    receiveQueryParams.value = params
    getReceiveList()
  }

  /** 查询订单外协待收货记录列表 */
  const getList = async () => {
    loading.value = true;
    const res = await listSourceFullProcessReceive(queryParams.value);
    sourceFullProcessReceiveList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }
  /** 查询订单外协待收货记录列表 */
  const getReceiveList = async () => {
    receiveLoading.value = true;
    const res = await listSourceReceive(receiveQueryParams.value);
    receiveList.value = res.rows;
    receiveTotal.value = res.total;
    receiveLoading.value = false;
  }

  /** 取消按钮 */
  const cancel = () => {
    reset();
    dialog.visible = false;
  }
  /** 取消按钮 */
  const drawerCancel = () => {

    drawer.visible = false;
  }

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    sourceFullProcessReceiveFormRef.value?.resetFields();
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    handleQuery();
  }

  /** 多选框选中数据 */
  const handleSelectionChange = (selection: SourceFullProcessReceiveVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    dialog.visible = true;
    dialog.title = "添加订单外协收货记录";
  }
  const storageIdFlag = ref(false);

  /** 修改按钮操作 */
  const handleUpdate = async (row?: SourceFullProcessReceiveVO) => {
    reset();
    const _id = row?.id || ids.value[0]
    // const res = await getSourceFullProcessReceive(_id);
    dialog.visible = true;
    formReceiveList.value = [];

    formReceiveList.value.push(row);

    form.value.fullProcessOrderId = row?.id;
    if(row?.storageId){
      storageIdFlag.value = true;
    }else{
      storageIdFlag.value = false;
    }
    form.value.storageId = row?.storageId;
    form.value.waitReceiveNum = row?.waitReceiveNum;
    form.value.quantity = undefined;

    form.value.outSourceQuantity = row.outSourceQuantity;
    form.value.receiveQuantity = row.receiveQuantity;

    dialog.title = "订单外协收货";
  }
  /** 详情按钮操作 */
  const handleDetail = async (row?: SourceFullProcessReceiveVO) => {
    reset();
    drawer.visible = true;
    drawer.title = "详情";
    const _id = row?.id
    disabled.value = true;
    const saleOrderId = row?.saleOrderId;
    if (_id) {
      dialogTableLoading.value = true
      await getSourceFullProcessOrder(_id).then(res => {
        outSourceOrder.value = res.data;
        outSourceOrder.value.cusId = row.cusId;
        dialogTableLoading.value = false
        console.log("1",outSourceOrder.value);

      })
    }
    if (saleOrderId) {
      dialogTableLoading.value = true
      await getOrder(saleOrderId).then(res => {
        currentInfo.value = res.data;
        detailCustomerList.value.push({
          id:res.data.cusId,
          customerName:res.data.cusName,
          customerCode:res.data.customerCode
        })
        dialogTableLoading.value = false
        console.log("2",currentInfo.value);
      })
    }
  }

  /*数据校验*/
  const validAllEvent = async () => {
    const $table = xTable.value.xTableRef
    console.log($table.getTableData().tableData);

    if ($table) {
      const errMap = await $table.validate(true)
      if (errMap) {

        proxy?.$modal.msgError("请填写收货信息！");
      }
      return errMap;
    }
  }


  /** 提交按钮 */
  const submitForm = async() => {
    // const errMap = await validAllEvent();
    // if (errMap) {
    //   return;
    // }
    //数据校验
    //判断 form
    if (!form.value.quantity||form.value.quantity<0) {
      proxy?.$modal.msgError("请填写收货数量！");
      return;
    }
    if (!form.value.storageId) {
      proxy?.$modal.msgError("请选择仓库！");
      return;
    }
    if(!form.value.waitReceiveNum){
      proxy?.$modal.msgError("待收数量为0！");
      return;
    }

    if (form.value.quantity > form.value.waitReceiveNum) {
      await proxy?.$modal.confirm("收货数量大于订单数量，是否仍然收货？")
    }

    buttonLoading.value = true;
    await addSourceFullProcessReceive(form.value).then(() => {
      dialog.visible = false;
    }).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("入库成功");
    await getList();
  }


  /** 删除按钮操作 */
  const handleDelete = async (row?: SourceFullProcessReceiveVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认删除订单外协收货记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
    await delSourceFullProcessReceive(_ids);
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
  }

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('outsource/sourceFullProcessReceive/export', {
      ...queryParams.value
    }, `sourceFullProcessReceive_${new Date().getTime()}.xlsx`)
  }

  /** 导出按钮操作 */
  const handleExportRecord = () => {
    proxy?.download('outsource/sourceFullProcessReceive/exportReceive', {
      ...receiveQueryParams.value, tableName: 'outsourceSourceFullProcessReceiveRecord'
    }, `外协收货记录_${new Date().getTime()}.xlsx`)
  }

  onMounted(() => {
    getList();

    updateCurrentTime();
    getStorageList();
    getReceiveList();
    getDictOptions();
  });
</script>

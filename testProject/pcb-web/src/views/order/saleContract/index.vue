<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <!-- <div class="search" v-show="showSearch"> -->
        <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="80px"
                 class="demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="下单时间" prop="cusId">
                <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                v-model="queryParams.placeOrderTimeStart"
                                type="datetime"
                                placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
                <span style="width: 10px;margin-left: 5px">-</span>
                <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                                v-model="queryParams.placeOrderTimeEnd"
                                type="datetime"
                                placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="产品编码" prop="commodityCode">
                <el-input v-model="queryParams.commodityCode" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="产品名称" prop="commodityName">
                <el-input v-model="queryParams.commodityName" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="物料编码" prop="materialNumber">
                <el-input v-model="queryParams.materialNumber" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <div style="float: right">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery">重置</el-button>
              </div>
            </el-col>

<!--            <el-col :span="4">-->
<!--              <el-form-item label="销售单号" prop="code">-->
<!--                <el-input v-model="queryParams.code" clearable @keyup.enter="handleQuery"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="6">
              <el-form-item label="业务员" prop="cusExchangeRate">
                <el-select class="width-100" v-model="queryParams.cusSaleUserId" clearable :collapse-tags="true" filterable
                           placeholder="请选择业务员">
                  <el-option
                    v-for="item in salerOptions"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="客户PO" prop="customerPo">
                <el-input v-model="queryParams.customerPo" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4">
              <el-form-item label="下单客户" prop="cusId">
                <el-select v-model="queryParams.customerCodeList" clearable
                           placeholder="请选择客户" filterable multiple collapse-tags
                >
                  <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.customerCode +'-'+ item.customerName"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.customerCode }}</span>
                    <span style="float: right;padding-left: 20px;">{{ item.customerName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="5">
              <el-form-item label="">
                <el-radio-group size="small"
                                v-model="queryParams.finishType"
                                type="vertical"
                                @change="handleQuery"
                >
                  <el-radio-button label="1">全部</el-radio-button>
                  <el-radio-button label="2">未完成</el-radio-button>
                  <el-radio-button label="3">已完成</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      <!-- </div> -->
    </transition>


    <el-dialog v-model="dialogCotractUpload.visible" title="合同回签查看上传" center width="60%" draggable>
      <el-form>
      <el-col :span="24" style="margin-bottom: 5px;">
        <XUpload v-model:model-value="formInline.quotationFileList" model="download"></XUpload>
      </el-col>
      <el-col :span="24" style="margin-bottom: 5px;">
        <XTable ref="popFileRef" :data="popoverFileList.filter((v: any) => v.delFlag == 0)"  border :columnList="quotionFileList" :pageShow="false">
          <template #default-make="{row}">
            <el-button link type="primar" @click="deletequotationEvent(row)">删除</el-button>
            <el-button link type="primar"  @click="downLoadHandle(row.key)">下载</el-button>
          </template>
        </XTable>
      </el-col>
        <div class="text-right" style="margin-top: 5px;">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormUpload">确 定</el-button>
          <el-button @click="cancelCotractUpload">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-model="dialogCotractCompleted.visible"   title="订单信息修改" center width="60%">
      <el-form ref="auditOrderFormRef" :model="formInline" label-width="120px">
        <el-row>
        <el-col :span="12">
          <el-form-item width="80" label="客户PO" prop="customerPo">
              <el-input v-model="formInline.customerPo" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item width="120" label="客户物料编码"  prop="materialNumber">
              <el-input v-model="formInline.materialNumber" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item width="120" label="客户物料名称" prop="materialName">
            <el-input v-model="formInline.materialName" :maxlength="50"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item width="120" label="市场备注"  prop="remark">
            <el-input type="textarea" v-model="formInline.remark" :maxlength="1000"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item width="120" label="特殊要求"  prop="specialRequirement">
            <el-input type="textarea" v-model="formInline.specialRequirement" :maxlength="1000"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24" style="margin-bottom: 5px;">
          <XUpload v-model:model-value="formInline.quotationFileList" model="download"></XUpload>
        </el-col>
        <el-col :span="24" style="margin-bottom: 5px;">
         <XTable ref="popFileRef" :data="popoverFileList.filter((v: any) => v.delFlag == 0)"  border :columnList="quotionFileList" :pageShow="false">
            <template #default-make="{row}">
              <el-button link type="primar" @click="deletequotationEvent(row)">删除</el-button>
              <el-button link type="primar"  @click="downLoadHandle(row.key)">下载</el-button>
            </template>
          </XTable>
        </el-col>
        </el-row>
        <div class="text-right" style="margin-top: 5px;">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormComplete">确 定</el-button>
          <el-button @click="cancelCotractCompleted">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <ETable
      style="height: 100%;" :showRefresh="true"
      ref="detailListTable" idField="id" border
      :lazy="true" :pagination="true" :toolId="mainTableToolId"
      pagePosition="bottom" class="kingzon-page-table"  :footerData="footerData" :showFooter="true"
      :total="total"
      :data="orderList"
      :loading="loading"
      :columnList="columnList"
      :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','quantity']"
      :pageNumber="queryParams.pageNum"
      :pageSize="queryParams.pageSize"
      :rowCss="setRowStyle"
      @rowClick="rowClick"
      @rowDblClick="cellDBLClickEvent"
      @rowContextMenu="rowContextMenu"
      @searchChange="searchChange"
    >

    <template #header-tool>
      <ColorRule :list="[
        { title: '库存发货', color: '#F2FFEB' },
        { title: '订单已撤回', color: '#ECB0B1' },
      ]"></ColorRule>
      <el-button @click="exportExcelBefore" style="float: right">导出</el-button>
    </template>
    <template #header-eqHours="scope">
      EQ时长(H)
      <el-tooltip
        class="box-item"
        effect="dark"
        raw-content
        :content="`累计的EQ时长`"
      >
        <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
      </el-tooltip>
    </template>

      <template #default-status="{row}">
        <!-- <div>{{ statusOptions.find(v => v.value == row.status)?.label }}</div> -->
        <el-tag :type="row.status=='1'?'info':''" size="small">{{ statusOptions.find(v => v.value == row.status)?.label }}</el-tag>
      </template>
      <template #default-flowStatus="{row}">
        <el-tag :type="row.flowStatus=='1'? 'info':
                        ['2','21','22','23','24'].includes(row.flowStatus)? '':
                        row.flowStatus=='3' ? 'danger':
                        row.flowStatus=='8'?'warning':'success'" size="small">{{ flowStatusOptions.find(v => v.value == row.flowStatus)?.label }}</el-tag>
      </template>
      <template #default-urgent="{ row }">
        <el-tag :type="row.urgent=='正常'? 'success':'warning'" size="small">{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</el-tag>
      </template>
      <template #default-placeOrderTime="{ row }">
        <div>{{dateFormat(row.placeOrderTime)}}</div>
      </template>
      <template #default-dispatchTime="{ row }">
        <div>{{dateFormat(row.dispatchTime)}}</div>
      </template>
      <template #default-deliveryTime="{ row }">
        <div>{{dateFormat(row.deliveryTime)}}</div>
      </template>
      <template #default-finishTime="{ row }">
        <div>{{row.finishTime?dateFormat(row.finishTime):''}}</div>
      </template>
      <template #default-orderType="{row}">
        <el-tag :type="row.orderType=='1'?'':
                       row.orderType=='2'?'success':row.orderType=='3'?'warning':'info'" size="small">{{ resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</el-tag>
      </template>
      <template #default-model="{ row }">
        <el-tag :type="row.model=='1'?'':'success'" size="small">{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</el-tag>
      </template>
      <template #default-unit="{ row }">
        <span>PCS</span>
      </template>
      <template #default-cusIsTaxRate="{row}">
        <span v-if="row.cusIsTaxRate==0">否</span>
        <span v-if="row.cusIsTaxRate==1">是</span>
      </template>
      <template #default-cusCurrency="{ row }">
        <div>{{ resDictData?.currency_type.find(v => v.dictValue == row.cusCurrency)?.dictLabel }}</div>
      </template>
      <template #default-cusPaymentMethod="{ row }">
        <div>{{ resDictData?.payment_method.find(v => v.dictValue == row.cusPaymentMethod)?.dictLabel}}</div>
      </template>
      <template #default-deliveryMethod="{ row }">
        <span>自动</span>
      </template>
      <template #default-eqStatus="{ row }">
        <el-switch
              v-model="row.eqStatus"
              disabled
              size="small"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
            />
      </template>
    </ETable>

    <!-- 右键菜单 -->
    <div class="context-box" ref="contextBoxRef" v-click-outside="clickOutside">
      <div class="context-box-list" v-for="(list, listIndex) in menuConfig?.body?.options" :key="listIndex">
        <template v-for="(item, index) in list" :key="index">
          <div class="context-box-menu pointer" v-if="item.visible" @click="contextMenuClickEvent({menu: item, row:currentContext, column:true} as any)">
            <vxe-icon :name="item.prefixIcon?.substring(9)"></vxe-icon>
            <span class="context-box-name">{{ item.name }}</span>
          </div>
        </template>
      </div>
    </div>

    <!--详情预览-->
    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      :direction="drawer.direction"
      :destroy-on-close="true"
      size="45%"
      :modal-class="`add-prod-drawder ${ownerId == '101' && 'normal-prod-drawder'}`"
    >
      <template #header>
        <span class="el-drawer__title no-wrap">{{drawer.title}}</span>
        <TotalTitle :start="true" :firstBorder="true" :list="[
          { title: `总价：${ currentInfo?.totalOrderPrice||0 }元` },
          { title: `税金：${ currentInfo?.tax||0 }元` },
          { title: `总金额：${ currentInfo?.totalPrice||0 }元` },
        ]"></TotalTitle>
      </template>
      <SaleDescriptions v-if="currentInfo" :currentInfo="currentInfo" :customerList="customerList"
                        :resDictData="resDictData" :quotationShow="quotationShow" :orderEtrShow="orderEtrShow"></SaleDescriptions>
    </el-drawer>

    <el-dialog v-model="outsourceDialog.visible" :destroy-on-close="true" :close-on-click-modal="false" width="55%">
      <template #header>
        <div style="text-align: center">{{outsourceDialog.title}}</div>
      </template>
      <SendOutSource ref="costRef" :orderInfo="currentInfo" :isShowOrderPrice="true"></SendOutSource>
      <div class="text-right">
        <el-button style="margin-left: 100px" :loading="buttonLoading" type="primary" @click="submitOtherCost">确 定
        </el-button>
        <el-button :loading="buttonLoading" @click="cancelOtherCost">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="exportVisible"
      title="导出提示"
      width="20%"
      align-center
      destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
          <el-button @click="exportVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>

    <!--报价下单预览 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="65%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
    <!--销售合同预览 -->
    <el-drawer destroy-on-close v-model="previewDrawer.visible" :title="previewDrawer.title" size="75%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!--编辑销售合同 -->
    <el-drawer destroy-on-close v-model="editOrder.visible" :title="editOrder.title" size="95%" visible.sync="false" draggable>
      <DirectOrder
        :isComp="true"
        :code="editOrder.code"
        @save="getList"
        @finish="finishHandle"
        @close="editOrder.visible = false"
      ></DirectOrder>
    </el-drawer>

    <!-- 操作记录 -->
    <OperatRecord v-model:show="operatInfo.show" :title="operatInfo.title" :data="operatInfo.data"></OperatRecord>

    <!-- 进度查询 -->
    <ProgressCheck v-model:show="progressInfo.show" :id="progressInfo.id" :title="progressInfo.title" :data="progressInfo.data" :codeUrl="codeUrl" :loading="progressInfo.loading" @confirm="progressConfirm"></ProgressCheck>
  </div>
</template>

<script setup name="SaleContract" lang="ts">
import DirectOrder from '../directOrder';
import ETable from '@/components/Etable/index.vue'
import {ClickOutside as vClickOutside} from 'element-plus'
import {
  addOrder,
  delOrder,
  getOrder,
  listOrder,
  listPostOrder,
  listOrderCust,
  exportListOrder,
  saveOutSourceOrder,
  updateOrder,
  updateOrderAndUpload, updateOrderComplete, setRecall, totalAmount, finishedOrder,
  getLoggerById,
  getOrderProcess,
  setInventoryShippedBack,
  setInventoryShipped, checkBeforeOutSource
} from "@/api/order/directOrder";
import {OrderForm, OrderQuery, OrderVO} from '@/api/order/directOrder/types';
import {computed, ref} from "vue";
import dayjs from "dayjs";
import {VxeTableEvents, VxeTablePropTypes} from "vxe-table";
import {CustomerVO} from "@/api/basedata/customer/types";
import {getListCustomer} from "@/api/basedata/customer";
import {UserVO} from "@/api/system/user/types";
import {getDicts} from "@/api/system/dict/data";
import {generateUrlLink, listUserByRoleKey} from "@/api/system/user";
import {useRouter} from 'vue-router'
import {sortBy} from "@/utils/dict";
import {downloadUrl, listContractFiles} from "@/api/upload";
import {deepClone} from "@/utils";
import {getQuotation} from "@/api/order/quotation";
import {getReportUrl} from "@/utils/report";
import useTagsViewStore from '@/store/modules/tagsView';
import {checkPermi} from "@/utils/permission";
import OperatRecord from './components/operatRecord'
import ProgressCheck from './components/progressCheck'
import * as QRCode from "qrcode";

import useUserStore from '@/store/modules/user';

const { ownerId } = useUserStore();

/**
 * 销售下单文件
 */
 //显示订单额外字段，菲林封样等
 const orderEtrShow = ref(false);

  const exportVisible = ref(false);
  const popoverFileList = ref<any[]>([]);
  const router = useRouter();
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const xTable = ref();
  const newVxeTableRef = ref();
  const orderList = ref<OrderVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const costRef = ref();
  const contextBoxRef = ref()
  const currentContext = ref(undefined)

  const queryFormRef = ref<ElFormInstance>();
  const orderFormRef = ref<ElFormInstance>();

  const mainTableToolId = ref('saleContract');

  // 查看报价单详情
  const quotationShow = ref(true)

let formInline = ref({
  id: undefined,
  customerPo:undefined,
  materialNumber:undefined,
  materialName:undefined,
  remark:undefined,
  specialRequirement:undefined,
  quotationFileList: [],
  popoverFileList: [],
});

  const operatInfo = ref<Record<string, any>>({
    data: [],
    show: false,
    title: '查看操作记录',
  })
  const progressInfo = ref<Record<string, any>>({
    data: [],
    show: false,
    id: undefined,
    loading: false,
    title: '生产进度设置',
  })

  /*外协提交*/
  const submitOtherCost = () => {
    costRef.value.submitOtherCost((data: any) => {
      console.log('data', data)
      console.log(currentInfo.value)
      currentInfo.value.outSourceOrderInfo = data;
      currentInfo.value.outSourceOtherCostList = data.otherCostList
      buttonLoading.value = true;
      saveOutSourceOrder(currentInfo.value).then(res => {
        if (res.code == 200) {
          outsourceDialog.visible = false;
          ElMessage({type: 'success', message: '操作成功'})
          getList();
          getTotalAmount();
        }
      }).finally(() => {buttonLoading.value = false;})
    });
  }

  /*外协取消*/
  const cancelOtherCost = () => {
    outsourceDialog.visible = false;
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

const previewDrawer = reactive<DrawerOption>({
  visible: false,
  title: "销售合同预览",
  direction: "rtl"
});

  const dialogCotractUpload = reactive<DialogOption>({
    visible: false,
    title: '合同回签查看上传'
  });

const dialogCotractCompleted = reactive<DialogOption>({
  visible: false,
  title: '订单信息修改'
});

  // 编辑订单
  const editOrder = reactive({
    visible: false,
    title: '编辑销售合同',
    code: undefined
  });

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const dateFormat = (cellValue : any) => {
    return dayjs(cellValue).format("YYYY-MM-DD")
  }

  const statusOptions = ref([
    {value: "1", label: "未审核"},
    {value: "2", label: "已审核"},
    {value: "3", label: "撤回"}
  ])

  const flowStatusOptions = ref([
    {value: "1", label: "待处理"},
    {value: "2", label: "MI制作"},
    {value: "21", label: "MI制作"},
    {value: "22", label: "MI制作"},
    {value: "23", label: "MI制作"},
    {value: "24", label: "MI制作"},
    {value: "3", label: "订单预投"},
    {value: "4", label: "生产投料"},
    {value: "5", label: "生产中"},
    {value: "6", label: "已完成"},
    {value: "7", label: "外协完成"},
    {value: "8", label: "外协"},
    {value: "9", label: "库存发货"},
    {value: "10", label: "库存发货完成"},

  ])

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
    //流程状态
    order_flow_status:[],
    //测试架
    order_test_frame:[],
  })
  //客户
  const customerList = ref<CustomerVO[]>([]);
  //销售人员
  const salerOptions = ref<UserVO[]>([]);

  //客户下拉数据
  const getCustomerList = async () => {
    const res = await getListCustomer();
    customerList.value = res.data;
  };

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_urgent,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_plate_brand,order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type,order_flow_status,order_test_frame";
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

    const salerResponse: any = await listUserByRoleKey("saler");
    salerOptions.value = salerResponse.data;
  };
  const initFormData: OrderForm = {
    id: undefined,
    testFrame:undefined,
    code: undefined,
    placeOrderTime: undefined,
    cusId: undefined,
    cusPrincipal: undefined,
    cusPrincipalPhone: undefined,
    cusFax: undefined,
    cusPaymentMethod: undefined,
    cusMonthlyStatementWay: undefined,
    cusCurrency: undefined,
    cusExchangeRate: undefined,
    cusTransStyle: undefined,
    cusAddress: undefined,
    cusQualityStand: undefined,
    cusAddressId: undefined,
    cusEmail: undefined,
    cusCustomerData: undefined,
    cusSaleUserId: undefined,
    cusIsTaxRate: undefined,
    cusRemark: undefined,
    commodityName: undefined,
    commodityType: undefined,
    commodityId: undefined,
    commodityCode: undefined,
    surfaceTreatment: undefined,
    model: undefined,
    materialLayer: undefined,
    serialNumber: undefined,
    materialNumber: undefined,
    materialName: undefined,
    specialRequirement: undefined,
    packRequirement: undefined,
    materialQuality: undefined,
    materialBrand: undefined,
    materialLevel: undefined,
    materialCopperOutside: undefined,
    materialCopperInside: undefined,
    remark: undefined,
    commodityRemark: undefined,
    singleWidth: undefined,
    singleLength: undefined,
    unitedWidth: undefined,
    unitedLength: undefined,
    unitedNumber: undefined,
    unitedWayLength: undefined,
    unitedWayWidth: undefined,
    commoditySolder: undefined,
    commoditySolderCount: undefined,
    goldenThickness: undefined,
    commoditySolderGloss: undefined,
    commoditySolderRequirement: undefined,
    poreCopper: undefined,
    characterColor: undefined,
    characterCount: undefined,
    commodityForm: undefined,
    characterRequirement: undefined,
    setCross: undefined,
    warpagePlate: undefined,
    commodityTestWay: undefined,
    testPoint: undefined,
    spareQuantity: undefined,
    copperFoil: undefined,
    vCut: undefined,
    holeRequirement: undefined,
    inspectionStandard: undefined,
    goldArea: undefined,
    pp: undefined,
    nickelThickness: undefined,
    tinThickness: undefined,
    minLineWidth: undefined,
    minLineSpace: undefined,
    minAperture: undefined,
    holeCount: undefined,
    holeDensity: undefined,
    submitUserId: undefined,
    submitTime: undefined,
    auditUserId: undefined,
    auditTime: undefined,
    auditComment: undefined,
    customerPo: undefined,
    deliveryTime: undefined,
    dispatchTime: undefined,
    quantity: undefined,
    urgent: undefined,
    area: undefined,
    price: undefined,
    areaPrice: undefined,
    orderType: undefined,
    totalPrice: undefined,
    totalOrderPrice: undefined,
    tax: undefined,
    engineeringCost: undefined,
    testFrameCost: undefined,
    flyProbeCost: undefined,
    mouldCost: undefined,
    expeditedCost: undefined,
    otherCost: undefined,
    sampleCost: undefined,
    flowStatus: undefined,
    status: undefined,
    commodityThickness: undefined,
    cusSaleUserName: undefined,
    submitUserName: undefined,
    auditUserName: undefined,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    cusName: undefined,
    quotationFileList:[],
    otherCostList:[],
  }
  const initQueryParams: any = {
    pageNum: 1,
    pageSize: 50,
    isAsc: "desc,desc,asc",
    orderByColumn: "placeOrderTime,code,id",
    finishType: '1',
    isInventoryShipped: undefined,
    placeOrderTimeStart: undefined,
    placeOrderTimeEnd: undefined,
    commodityName: undefined,
    materialNumber: undefined,
    cusId: undefined,
    cusSaleUserName: undefined,
    cusSaleUserId: undefined,
    // code: undefined,
    cusExchangeRate: undefined,
    customerPo: undefined,
    commodityCode: undefined,
    // customerCodeList: undefined
  }
  const data = reactive<PageData<OrderForm, OrderQuery>>({
    form: {...initFormData},
    queryParams: {...initQueryParams},
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      code: [
        {required: true, message: "订单编号不能为空", trigger: "blur"}
      ],
      placeOrderTime: [
        {required: true, message: "下单时间不能为空", trigger: "blur"}
      ],
      cusId: [
        {required: true, message: "客户ID不能为空", trigger: "blur"}
      ],
      cusPrincipal: [
        {required: true, message: "负责人不能为空", trigger: "blur"}
      ],
      cusIsTaxRate: [
        {required: true, message: "客户是否含税(0-不含，1-含)不能为空", trigger: "blur"}
      ],
      commodityName: [
        {required: true, message: "产品名称不能为空", trigger: "blur"}
      ],
      commodityType: [
        {required: true, message: "产品类型不能为空", trigger: "change"}
      ],
      commodityId: [
        {required: true, message: "产品id不能为空", trigger: "blur"}
      ],
      commodityCode: [
        {required: true, message: "产品编码不能为空", trigger: "blur"}
      ],
      surfaceTreatment: [
        {required: true, message: "表面处理不能为空", trigger: "blur"}
      ],
      model: [
        {required: true, message: "批量/样品不能为空", trigger: "blur"}
      ],
      materialLayer: [
        {required: true, message: "板层不能为空", trigger: "blur"}
      ],
      serialNumber: [
        {required: true, message: "流水号不能为空", trigger: "blur"}
      ],
      materialQuality: [
        {required: true, message: "板材不能为空", trigger: "blur"}
      ],
      singleWidth: [
        {required: true, message: "单片宽不能为空", trigger: "blur"}
      ],
      singleLength: [
        {required: true, message: "单片长不能为空", trigger: "blur"}
      ],
      unitedWidth: [
        {required: true, message: "联片宽不能为空", trigger: "blur"}
      ],
      unitedLength: [
        {required: true, message: "联片长不能为空", trigger: "blur"}
      ],
      unitedNumber: [
        {required: true, message: "联片数量不能为空", trigger: "blur"}
      ],
      unitedWayLength: [
        {required: true, message: "联片方式长不能为空", trigger: "blur"}
      ],
      unitedWayWidth: [
        {required: true, message: "联片方式宽不能为空", trigger: "blur"}
      ],
      commoditySolder: [
        {required: true, message: "阻焊颜色不能为空", trigger: "blur"}
      ],
      characterColor: [
        {required: true, message: "字符颜色不能为空", trigger: "blur"}
      ],
      commodityForm: [
        {required: true, message: "成形方式不能为空", trigger: "blur"}
      ],
      commodityTestWay: [
        {required: true, message: "测试方式不能为空", trigger: "blur"}
      ],
      deliveryTime: [
        {required: true, message: "客户交期不能为空", trigger: "blur"}
      ],
      dispatchTime: [
        {required: true, message: "发货日期不能为空", trigger: "blur"}
      ],
      quantity: [
        {required: true, message: "订单数量不能为空", trigger: "blur"}
      ],
      urgent: [
        {required: true, message: "加急不能为空", trigger: "blur"}
      ],
      area: [
        {required: true, message: "面积不能为空", trigger: "blur"}
      ],
      price: [
        {required: true, message: "单价不能为空", trigger: "blur"}
      ],
      areaPrice: [
        {required: true, message: "平米价不能为空", trigger: "blur"}
      ],
      orderType: [
        {required: true, message: "订单类型不能为空", trigger: "change"}
      ],
      totalPrice: [
        {required: true, message: "含税总价不能为空", trigger: "blur"}
      ],
      totalOrderPrice: [
        {required: true, message: "不含税总价不能为空", trigger: "blur"}
      ],
      tax: [
        {required: true, message: "税金不能为空", trigger: "blur"}
      ],
      engineeringCost: [
        {required: true, message: "工程费不能为空", trigger: "blur"}
      ],
      testFrameCost: [
        {required: true, message: "测试架费不能为空", trigger: "blur"}
      ],
      flyProbeCost: [
        {required: true, message: "飞针费不能为空", trigger: "blur"}
      ],
      mouldCost: [
        {required: true, message: "模具费不能为空", trigger: "blur"}
      ],
      expeditedCost: [
        {required: true, message: "加急费不能为空", trigger: "blur"}
      ],
      otherCost: [
        {required: true, message: "其他费不能为空", trigger: "blur"}
      ],
      sampleCost: [
        {required: true, message: "样板费不能为空", trigger: "blur"}
      ],
      flowStatus: [
        {required: true, message: "流程状态不能为空", trigger: "change"}
      ],
      status: [
        {required: true, message: "订单状态不能为空", trigger: "change"}
      ],
      commodityThickness: [
        {required: true, message: "成品板厚不能为空", trigger: "blur"}
      ],
      cusSaleUserName: [
        {required: true, message: "业务员名称不能为空", trigger: "blur"}
      ],
      submitUserName: [
        {required: true, message: "提交人名称不能为空", trigger: "blur"}
      ],
      auditUserName: [
        {required: true, message: "审核人名称不能为空", trigger: "blur"}
      ],
      createDeptName: [
        {required: true, message: "创建部门名称不能为空", trigger: "blur"}
      ],
      createByName: [
        {required: true, message: "创建者名称不能为空", trigger: "blur"}
      ],
      updateByName: [
        {required: true, message: "更新者名称不能为空", trigger: "blur"}
      ],
      cusName: [
        {required: true, message: "客户名称不能为空", trigger: "blur"}
      ]
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  const sumNum = (list: OrderVO[], field: string) => {
    let count = 0;
    list.forEach(item => {
      count += Number(item[field]);
    });
    return Number(count.toFixed(4));
  };

  const footerMethod: VxeTablePropTypes.FooterMethod<OrderVO> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        // TODO 接口获取数据
        /*if (column.field == "area") {
          return `${sumNum(data, "area")} `;
        }
        if (column.field == "totalPrice") {
          return `${sumNum(data, "totalPrice")} `;
        }
        if (column.field == "totalOrderPrice") {
          return `${sumNum(data, "totalOrderPrice")} `;
        }
        if (column.field == "tax") {
          return `${sumNum(data, "tax")} `;
        }
        if (column.field == "quantity") {
          return `${sumNum(data, "quantity")} `;
        }*/
        return "";
      })
    ];
  };

  //合并  ：span-method="rowSpanMethod"
  const rowSpanMethod = ({row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data}: any) => {
    if (column.property === "code" || column.property === "cusName" || column.property === "customerCode") {
      // 合并参考字段,根据此字段进行合并行
      const referenceField = "code";
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

  //计算合并 开启虚拟滚动时使用该方法  :merge-cells="mergeCellsMethod"
  const mergeCellsMethod = computed({
    get() {
      const mergeCells: any = [];
      const referenceFields = ["code", "cusName", "customerCode"];
      for (let rowIndex = 0; rowIndex < orderList.value.length; rowIndex++) {
        const row = orderList.value[rowIndex];
        const prevRow = orderList.value[rowIndex - 1];
        let nextRow = orderList.value[rowIndex + 1];

        if (rowIndex > 0 && referenceFields.every(field => row[field] === prevRow[field])) {
          // 当前行与前一行相同，不显示当前行
          continue;
        }
        let countRowspan = 1;

        while (nextRow && referenceFields.every(field => nextRow[field] === row[field])) {
          nextRow = orderList.value[++countRowspan + rowIndex];
        }
        if (countRowspan > 1) {
          // 需要合并的情况
          referenceFields.forEach((field, colIndex) => {
            const col = getColumnIndex(field); // 获取列索引
            mergeCells.push({row: rowIndex, col, rowspan: countRowspan, colspan: 1});
          });
        }
      }
      return mergeCells;
    },
    set(val: any) {
      return val
    }
  })

  const getColumnIndex = (field: any) => {
    const columns = newVxeTableRef.value.xTableRef.getColumns();
    const columnIndex = columns.findIndex(col => col.field === field);
    return columnIndex;
  };

  const beforeFeed = ref(['2','21','22','23','24','3'])

  const menuConfig = reactive<VxeTablePropTypes.MenuConfig<OrderVO>>({
    body: {
      options: [
        [
          {code: 'details', name: '详情', prefixIcon: 'vxe-icon-link', visible: true, disabled: false},
          // {code: 'back', name: '外协撤回', prefixIcon: 'vxe-icon-undo', visible: true, disabled: false},
          {code: 'outsource', name: '发外协', prefixIcon: 'vxe-icon-send', visible: true, disabled: false}
        ],
        [
          {code: 'quotationDetails', name: '查看报价单信息', prefixIcon: 'vxe-icon-edit', visible: true, disabled: false},
          {code: 'edit', name: '编辑合同', prefixIcon: 'vxe-icon-edit', visible: true, disabled: false},
          {code: 'preview', name: '预览合同', prefixIcon: 'vxe-icon-file-pdf', visible: true, disabled: false},
          // {code: 'stop', name: '暂停产品', prefixIcon: 'vxe-icon-square-caret-right-fill', visible: true, disabled: false},
          {code: 'recover', name: '恢复产品', prefixIcon: 'vxe-icon-chart-pie', visible: true, disabled: false},
          {code: 'rollback', name: '订单撤回', prefixIcon: 'vxe-icon-undo', visible: true, disabled: false},
          //{code: 'finished', name: '产品已完成', prefixIcon: 'vxe-icon-check', visible: true, disabled: false},
          {code: 'finishedOrder', name: '订单信息修改', prefixIcon: 'vxe-icon-check', visible: true, disabled: false},
          {code: 'inventoryShipped', name: '库存发货', prefixIcon: 'vxe-icon-edit', visible: true, disabled: false},
          {code: 'closeInventoryShipped', name: '取消库存发货', prefixIcon: 'vxe-icon-edit', visible: true, disabled: false},
          // {code: 'contractUpload', name: '合同回签查看上传', prefixIcon: 'vxe-icon-edit', visible: true, disabled: false},
          {code: 'contractPrint', name: '报价单打印', prefixIcon: 'vxe-icon-edit', visible: true, disabled: false},
          {code: 'operatRecord', name: '查看操作记录', prefixIcon: 'vxe-icon-file-txt', visible: true, disabled: false},
          {code: 'progressCheck', name: '生产进度设置', prefixIcon: 'vxe-icon-file-txt', visible: true, disabled: false},
        ],
      ]
    },
    visibleMethod({options, column, row}) {
      let finishedCheck = checkPermi(['order:orderContract:finished']);
      options.forEach(list => {
        list.forEach(item => {
          item.disabled = false
          if (column) {
            //查看报价单信息
            if (item.code === 'quotationDetails') {
              if (row.saleQuotationId != '' &&  row.saleQuotationId!=null) {
                item.visible = true
              } else {
                item.visible = false
              }
            }

            if (item.code === 'inventoryShipped') {
              if (beforeFeed.value.includes(row.flowStatus) && row.flowStatus != '8' && row.isInventoryShipped != '1') {
                item.visible = true
              } else {
                item.visible = false
              }
            }
            if (item.code === 'closeInventoryShipped') {
              if (beforeFeed.value.includes(row.preInventoryShippedStatus) && row.flowStatus != '10' && row.isInventoryShipped != '0') {
                item.visible = true
              } else {
                item.visible = false
              }
            }
            if (item.code === 'edit') {
              if (row.status != '2') {
                item.visible = true
              } else {
                item.visible = false
              }
            }
            if (item.code === 'details') {
              if (row.flowStatus == '1') {
                item.visible = false
              } else {
                item.visible = true
              }
            }
            if (item.code === 'outsource') {
              if (beforeFeed.value.includes(row.flowStatus) && row.status == '2' && row.isInventoryShipped != '1') {
                item.visible = true
              } else {
                item.visible = false
              }
            }
            if ( item.code === 'rollback') {
              if (row.flowStatus == '6' || row.flowStatus == '7' || row.status=='3') {
                item.visible = false
              } else {
                item.visible = true
              }
            }
            if (item.code === 'stop' || item.code === 'finished') {
              if (row.flowStatus == '6' || row.flowStatus == '7') {
                item.visible = false
              } else {
                item.visible = true
              }
              if (item.code === 'stop' && row.suspendFlag == '1') {
                item.visible = false
              }
            }
            if (item.code === 'finishedOrder') {
              if (row.status == '2') {
                item.visible = true
              } else {
                item.visible = false
              }
            }
            if (item.code === 'back') {
              if (row.flowStatus == '8') {
                item.visible = true;
              } else {
                item.visible = false
              }
            }
            if (item.code === 'finished') {
              if (finishedCheck) {
                if (row.flowStatus == "6") {
                  item.visible = false;
                } else {
                  item.visible = true;
                }
              } else {
                item.visible = false
              }
            }
            if (item.code === 'recover') {
              if (row.suspendFlag == '1') {
                item.visible = true;
              } else {
                item.visible = false
              }
            }
            if (item.code === 'progressCheck') {
              // console.log(row?.status, row?.flowStatus)
              if (['2', '3'].includes(row.status)) {
                if (['1'].includes(row.flowStatus)) {
                  item.visible = false;
                } else {
                  item.visible = true;
                }
              } else {
                item.visible = false
              }
            }
          } else {
            item.disabled = true
          }
          if (item.children) {
            item.children.forEach(childItem => {
              childItem.disabled = item.disabled
            })
          }

        })
      })
      return true
    }
  })

  let currentInfo = ref<any>(undefined);
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '报价单'
});
  const outsourceDialog = reactive<DialogOption>({
    visible: false,
    title: '全流程外协'
  });
const quotationFormRef = ref<ElFormInstance>();
const quotationDialog = reactive<DialogOption>({
  visible: false,
  title: '查看报价单详情'
});

  // 判断字符串中有无时间字符串
  const isTime = (str: string) => {
    return /([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/.test(str)
  }
  // cst时间转换为gmt时间
  const gmtFormat = (str: string) => {
    let dateS= str.split(" ");
    let strGMT = dateS[0]+" "+dateS[1]+" "+dateS[2]+" "+dateS[5]+" "+dateS[3]+" GMT+0800";
    let date = new Date(Date.parse(strGMT));
    return date;
  }

  const contextMenuClickEvent: VxeTableEvents.MenuClick<OrderVO> = ({menu, row, column}) => {
    quotationShow.value = true
    orderEtrShow.value = true;
    currentInfo.value = row;
    // console.log(row)
    switch (menu.code) {
      case 'outsource':
        if (row && column) {
          checkBeforeOutSource({id: row.id}).then(() => {
            outsourceDialog.visible = true;
          })
        }
        break;
      case 'back':
        if (row && column) {
          loading.value = true;
          row.flowStatus = row.preOutsourceStatus;
          updateOrder(row).finally(() => {
            getList();
            getTotalAmount();
          });
          loading.value = false;
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
        }
        break;
      case 'details':
        if (row && column) {
          drawer.visible = true;
          drawer.title = row.code;
          // const dayjs1 = dayjs(row.deliveryTime);
          // const dayjs2 = dayjs(row.dispatchTime);
          // // 提前发货时间
          // let preDeliveryHour = Math.abs(dayjs1 - dayjs2) / (60 * 60 * 1000); // 将毫秒转换为小时并取绝对值*/
          // row.preDeliveryHour=preDeliveryHour;
          // currentInfo.value.preDeliveryHour=row.preDeliveryHour;
          // //是否含税
          // currentInfo.value.isTax=row.cusIsTaxRate;
          // currentInfo.value.fileList=row.popoverFileList;
          currentInfo.value = row;
        }
        break;
      case 'edit':
        if (row && column) {
          //未审核和撤回都可以编辑
          if ('1' == row.status ||'3' == row.status ) {
            // router.push('/order/directOrder?code=' + row.code);
            editOrder.visible = true
            editOrder.code = row.code
            editOrder.title = `编辑 ${row.code}`
          }
        }
        break;
      case 'preview':
        if (row && column) {
          previewDrawer.visible=true;
          reportUrl.value = getReportUrl()+ `&_n=PCB加工合同&_u=file:directOrder.ureport.xml&url=order/saleOrder/getPreviewInfo&ids=${row.id}&listUrl=order/saleOrder/getPreviewList&ids=${row.id}`;
          reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
        }
        break;
      case 'quotationDetails':
        if (row && column) {
          //查看报价单信息
          const _id = row.saleQuotationId;
          getQuotation(_id).then((res: any) => {
            // form.value=res.data;
            orderEtrShow.value = false;
            quotationShow.value = false
            currentInfo.value = res.data;
            currentInfo.value.popoverFileList = res.data.quotationFileList
            drawer.visible = true;
            drawer.title = "查看报价单详情";

          })
        }
        break;
      case 'contractPrint':
        if (row && column) {
          //报价单打印
          if (row.saleQuotationId!=null){
            const _id = row.saleQuotationId;
            getQuotation(_id).then((res: any) => {
              // var code = res.data.code
              reportDrawer.title = "报价单预览";
              reportDrawer.visible = true;
              //通过主键和报价单编号
              reportUrl.value = getReportUrl() + `&_n=报价单&_u=file:saleQuotation.ureport.xml&url=order/quotation/report/${row.saleQuotationId}&listUrl=order/quotation/reportList&id=${row.saleQuotationId}`;
              console.log(reportUrl.value);
            })
          }else{
            //报价单ID为空 查询销售合同里面的数据填充
            const _id = row.id;
          //  getOrder(_id).then((res: any) => {
              // var code = res.data.code
              reportDrawer.title = "报价单预览";
              reportDrawer.visible = true;
              //通过主键和报价单编号
              reportUrl.value = getReportUrl() + `&_n=报价单&_u=file:saleQuotation.ureport.xml&url=order/saleOrder/report/${row.id}&listUrl=order/saleOrder/reportList&code=${row.code}`;
              console.log(reportUrl.value);
           // })
          }
        }
        break;
      case 'stop':
        if (row && column) {
          ElMessageBox.confirm(
            '确定要暂停产品编号为' + row.commodityCode + '的产品吗?',
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning',
            }
          ).then(() => {
            row.suspendFlag = '1';
            updateOrder(row).finally(() => {
              getList();
              getTotalAmount();
            });
            ElMessage({
              type: 'success',
              message: '操作成功',
            })
          })
        }
        break;
        //库存设置
      case 'inventoryShipped':
        if (row && column) {
          ElMessageBox.confirm(
              '确定要把产品编号为' + row.commodityCode + '的产品设置成库存发货吗?',
              '提示',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning',
              }
          ).then(() => {
            // row.isInventoryShipped = '1';
            setInventoryShipped(row.id).then((res) => {
              getList();
              getTotalAmount();
              if(res.code == 200){
                ElMessage({
                  type: 'success',
                  message: '操作成功',
                })
              }
            });
          })
        }
        break;
        //取消库存设置
      case 'closeInventoryShipped':
        if (row && column) {
          ElMessageBox.confirm(
              '确定要把产品编号为' + row.commodityCode + '的产品取消库存发货吗?',
              '提示',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning',
              }
          ).then(() => {
            // row.isInventoryShipped = '0';
            setInventoryShippedBack(row.id).then((res) => {
              getList();
              getTotalAmount();
              if(res.code == 200){
                ElMessage({
                  type: 'success',
                  message: '操作成功',
                })
              }
            });
          })
        }
        break;
      //   //合同回签查看上传
      // case 'contractUpload':
      //   if (row && column) {
      //     const id = row.id;
      //     formInline.value.id = row.id;
      //     listContractFiles(id).then((res: any) => {
      //       popoverFileList.value = res;
      //       formInline.value.quotationFileList = [];
      //       dialogCotractUpload.visible = true;
      //     })
      //   }
      //   break;
      case 'recover':
        if (row && column) {
          ElMessageBox.confirm(
            '确定要恢复编号为' + row.commodityCode + '的产品吗?',
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning',
            }
          ).then(() => {
            row.suspendFlag = '0';
            updateOrder(row).then(res => {
              getList();
              getTotalAmount();
            });
            ElMessage({
              type: 'success',
              message: '操作成功',
            })
          })
        }
        break;
      case 'rollback':
        if (row && column) {
          if (row && column) {
            ElMessageBox.confirm(
                '确定要把产品编号为' + row.commodityCode + '的产品撤回吗?',
                '提示',
                {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  dangerouslyUseHTMLString: true,
                  type: 'warning',
                }
            ).then(() => {
              // row.status = '3';
              setRecall(row.id).then(res => {
                getList();
                getTotalAmount()
                if(res.code == 200){
                  ElMessage({
                    type: 'success',
                    message: '操作成功',
                  })
                }
              });
            })
          }
          break;


        }
        break;
      case 'finished':
        if (row && column) {
          const title = row.commodityCode + "产品手动完结"
          ElMessageBox.prompt('请输入手动完结备注', title, {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            inputType:'textarea',
            inputValidator: function(value) {
              if (value == null || !value.trim()) {
                return '完结备注不能为空';
              } else if (value.length > 500) {
                return '完结备注长度不能超过500个字符';
              }
              return true; // 验证通过
            }
          }).then(({ value }) => {
              finishedOrder(row.id, value).then((res)=>{
                ElMessage({
                  type: 'success',
                  message: '操作成功',
                })
                getList();
                getTotalAmount();
              });
            })
        }
        break;
      case 'finishedOrder':
        //已完成订单
        if (row && column) {
          const id = row.id;
          formInline.value.id = row.id;
          getOrder(id).then((res: any) => {
            formInline.value = res.data;
            popoverFileList.value = res.data.popoverFileList;
            formInline.value.quotationFileList=[];
            dialogCotractCompleted.visible = true;
          })
        }
        break;
      case 'operatRecord':
        //查看操作记录
        if (row && column) {
          const id = row.id;
          // console.log(row, column)
          getLoggerById(id).then((res: any) => {
            if (res.code == 200) {
              res.data?.length && res.data.map((m: any) => {
                m.attributes?.length && m.attributes.map((attr: any) => {
                  // console.log(attr)
                  if (attr.oldValue && isTime(attr.oldValue) && dayjs(attr.oldValue).isValid()) {
                    attr.oldValue = dayjs(gmtFormat(attr.oldValue)).format('YYYY-MM-DD HH:mm:ss')
                  }
                  if (attr.newValue && isTime(attr.newValue) && dayjs(attr.newValue).isValid()) {
                    attr.newValue = dayjs(gmtFormat(attr.newValue)).format('YYYY-MM-DD HH:mm:ss')
                  }
                })
              })
              operatInfo.value.show = true
              operatInfo.value.data = res.data || []
              operatInfo.value.title = `查看${row.code}-${row.commodityCode}操作记录`
            }
          })
        }
        break;
      case 'progressCheck':
        //查看操作记录
        progressInfo.value.show = true
        progressInfo.value.loading = true
        if (row && column) {
          const id = row.id;
          // console.log(row, column)
          progressInfo.value.id = id
          getOrderProcess(id).then((res: any) => {
            if (res.code == 200) {
              // res.data?.length && res.data.map((m: any) => {
              //   m.attributes?.length && m.attributes.map((attr: any) => {
              //     // console.log(attr)
              //     if (attr.oldValue && isTime(attr.oldValue) && dayjs(attr.oldValue).isValid()) {
              //       attr.oldValue = dayjs(gmtFormat(attr.oldValue)).format('YYYY-MM-DD HH:mm:ss')
              //     }
              //     if (attr.newValue && isTime(attr.newValue) && dayjs(attr.newValue).isValid()) {
              //       attr.newValue = dayjs(gmtFormat(attr.newValue)).format('YYYY-MM-DD HH:mm:ss')
              //     }
              //   })
              // })
              progressInfo.value.data = res.data
              progressInfo.value.title = `${row.code}-${row.commodityCode} 生产进度设置`
            }
          }).finally(() => {
            progressInfo.value.loading = false
          })
          generateUrlLink({
            path: 'pages/index/index',
            query: `url=/pages/saleContract/index&id=${id}`,
          }).then((res) => {
            if (res.code == 200) {
              QRCode.toDataURL(res.data, {errorCorrectionLevel: 'H'}, (err: any, url: string) => {
                if (err) {
                  console.log('Error: ' + err);
                } else {
                  codeUrl.value = url;
                }
              });
            }
          })
        }
        break;
      default:
    }
  }
  const codeUrl = ref('')
  const clickOutside = () => {
    contextBoxRef.value.style = 'display: none;'
  }
  //行右键单击
  const rowContextMenu = ({ row, originalEvent }: any) => {
    contextBoxRef.value.style = 'display: block;'
    nextTick(() => {
      const bodyWidth = document.body.clientWidth;
      const bodyHeight = document.body.clientHeight;
      const domWidth = contextBoxRef.value.clientWidth;
      const domHeight = contextBoxRef.value.clientHeight;
      // console.log('rowContextMenu', row, originalEvent, bodyWidth, bodyHeight, domWidth, domHeight);
      // 控制右键菜单不超出屏幕
      const domLeft = originalEvent.pageX > (bodyWidth - domWidth) ? (originalEvent.pageX - domWidth) : originalEvent.pageX;
      const domTop = originalEvent.pageY > (bodyHeight - domHeight) ? (bodyHeight - domHeight) : originalEvent.pageY;
      currentContext.value = row;
      originalEvent.returnValue = false;
      contextBoxRef.value.style = `
        display: block;
        top: ${domTop}px;
        left: ${domLeft}px;
      `;
      (menuConfig as any).visibleMethod({ options: menuConfig?.body?.options, column:true, row } as any)
    })
  }

  const setRowStyle = (row: any) => {
    if ('1' == row.isInventoryShipped){
      return {
        background: '#F2FFEB!important',
      }
    }
    if ('3' == row.status) {
      return {
        background: 'rgb(236,176,177) !important',
      }
    }
    if ('1' == row.suspendFlag) {
      return {
        background: 'rgb(250, 236, 216) !important',
      }
    } else if (row?.isSelected) {
      return {
        background: '#e6f7ff !important',
      }
    }
  }

  // 选中单行并高亮
  const rowClick = (row: any) => {
    orderList.value.map((v: any) => {
      v.isSelected = false
    })
    row.isSelected = true
  }

  const cellDBLClickEvent: VxeTableEvents.CellDblclick<OrderVO> = (row) => {
    console.log("双击事件");
    orderEtrShow.value = true

    if ('1' == row.status ||'3' == row.status) {
      // router.push('/order/directOrder?code=' + row.code);
      editOrder.visible = true
      editOrder.code = row.code
      editOrder.title = `编辑 ${row.code}`
    } else {
      drawer.visible = true;
      drawer.title = row.code;
      currentInfo.value = row;
    }
  }

  // 关闭编辑弹框
  const finishHandle = () => {
    getList()
    getTotalAmount();
    editOrder.visible = false
  }

  // 初始化表格组件的搜索条件
  const initTableSearch = () => {
    const tempParam = Object.keys(initQueryParams)
    Object.keys(queryParams.value).forEach(key => {
      if (!tempParam.includes(key)) {
        queryParams.value[key] = undefined
      }
    })
  }
  // 获取 搜索条件
  const searchChange = (params: any) => {
    console.log(params);
    // queryParams.value = deepClone(initQueryParams);
    // console.log(params)
    initTableSearch()
    queryParams.value['isInventoryShipped'] = undefined;
    //客户名称 编码查询转列表查询
    if(queryParams.value.cusName){
      queryParams.value['cusNameIdList'] = queryParams.value.cusName;
    }

    if(queryParams.value.customerCode){
      queryParams.value['cusNameCodeList'] = queryParams.value.customerCode;
    }

    Object.keys(params).forEach(key => {
      if (key == 'status') {
        queryParams.value['statusList'] = params[key];
      } else if (key == 'urgent') {
        queryParams.value['urgentList'] = params[key];
      } else if (key == 'orderType') {
        queryParams.value['orderTypeList'] = params[key];
      } else if (key == 'flowStatus') {
        // console.log(params[key]);
        // if(params[key].includes('-1')){
        //   queryParams.value['isInventoryShipped'] = '1';
        //   const newArray = params[key].filter(v => v!= '-1')
        //   if(newArray.length > 0){
        //     queryParams.value['flowStatusList'] = newArray;
        //   }
        // } else {
          queryParams.value['flowStatusList'] = params[key];
        // }
      } else if (params[key] !== null && params[key] !== undefined) {
        queryParams.value[key] = params[key];
      }
    });
    queryParams.value['flowStatus'] = undefined
    getList();
    getTotalAmount();
  }
  // 文件下载
  const downLoadHandle = (key: string) => {
    let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
    downloadUrl(key).then(res => {
      loadingBox.close()
      if (res.code == 200) {
        const { data } = res
        // window.open(data[key])
        fileSaver.saveAs(data[key])
      }
    }).catch((err) => {
      loadingBox.close()
    })
  }

  //删除已经上传的文件
  const deletequotationEvent= (row: any) => {
    ElMessageBox.confirm(
        "您确定要删除该记录吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
    )
        .then(() => {
          ElMessage({
            type: "success",
            message: "删除成功"
          });
          row.delFlag = 2;//删除该行记录
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除"
          });
        });

  }
  /**
   * 合同回签弹框，文件列表
   */
  const quotionFileList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60'},
    {title: '文件名', field: 'name', align: 'center',minWidth: '200'},
    {title: '上传人', field: 'updateByName', align: 'center',width: '70'},
    {title: '文件大小', field: 'size', align: 'center',width: '80'},
    {title: '上传时间', field: 'createTime', align: 'center',width: '120'},
    {title: '操作', field: 'make', align: 'center',width: '120'},
  ])
const intervalDateParam = ref({clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'})

const surfaceTreatmentOptions = ref([
    {value: "沉金", label: "沉金"},
    {value: "有铅喷锡", label: "有铅喷锡"},
    {value: "无铅喷锡", label: "无铅喷锡"},
    {value: "镀金", label: "镀金"},
    {value: "OSP", label: "OSP"},
    {value: "镀镍", label: "镀镍"},
    {value: "碳油+OSP", label: "碳油+OSP"},
    {value: "光板", label: "光板"},
    {value: "铜板", label: "铜板"},
    {value: "沉锡", label: "沉锡"},
    {value: "镍钯金", label: "镍钯金"},
    {value: "镀镍+碳油", label: "镀镍+碳油"},
    {value: "?", label: "?"},
    {value: "OSP+沉金", label: "OSP+沉金"},
  ])

const customerCodeList = ref();
const customerNameList = ref();

  const columnList = ref([
    // {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
    {title: "序号", field: 'index', type: 'index', align: 'center', width: '60' },
    {
      width: '90',
      title: '客户名称',
      field: 'cusNameIdList',
      align: 'center',
      filterType: 'checkboxSearch',
      filterParam: {placeholder: '请输入客户名称'},
      filterData:()=>customerNameList.value
    },
    {
      width: '80',
      title: '客户编码',
      field: 'customerCodeList',
      align: 'center',
      filterType: 'checkboxSearch',
      filterParam: {placeholder: '请输入客户编码'},
      filterData:()=>customerCodeList.value
    },
    {
      width: '70',
      title: '订单状态',
      field: 'status',
      align: 'center',
      filterType:'checkboxButton',
      filterParam:{ placeholder: '请输入订单状态' },filterData:()=> statusOptions.value
    },
    {
      width: '80',
      title: '合同状态',
      field: 'flowStatus',
      align: 'center',
      filterType: 'checkboxButton',
      filterParam: {placeholder: '请输入合同状态'},
      filterData: () => [...resDictData.value.order_flow_status],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '50',
      title: '加急',
      field: 'urgent',
      align: 'center',
      filterType: 'checkboxButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.value.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90',
      title: '下单日期',
      field: 'placeOrderTime',
      align: 'center',
      // filterType: 'intervalDate',
      // filterParam: {
      //   startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      //   endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      // }
    },
    {
      width: '90',
      title: '交货日期',
      field: 'dispatchTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: '90',
      title: '客户交期',
      field: 'deliveryTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间',type: 'datetime',  valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime',valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: '90',
      title: '完结时间',
      field: 'finishTime',
      align: 'center',
    },
    {
      width: '60',
      title: '新/返',
      field: 'orderType',
      align: 'center',
      filterType: 'checkboxButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '80',
      title: '批量/样品',
      field: 'model',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.value.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '70',
      title: '客户PO',
      field: 'customerPo',
      align: 'center',
      // filterType: 'input',
      // filterParam: {placeholder: '请输入客户PO'}

    },
    {
      width: '80',
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      // filterType: 'input',
      // filterParam: {placeholder: '请输入产品名称'},
    },
    {
      width: '80',
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      // filterType: 'input',
      // filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: '110',
      title: '客户物料编码',
      field: 'materialNumber',
      align: 'center',
    },
    {
      width: '100',
      title: 'EQ时长(H)',
      field: 'eqHours',
      align: 'center',
    },
    {
      width: '60',
      title: 'EQ确认',
      field: 'eqStatus',
      align: 'center',
    },
    {
      width: '90',
      title: '数量(pcs)',
      field: 'quantity',
      align: 'center',
      filterType: 'intervalNumber',
      // filterParam: {placeholder: '请输入数量',type:'number',precision:0}
    },
    {
      width: '100',
      title: '单价(元/pcs)',
      field: 'price',
      align: 'center',
    },
    {
      width: '90',
      title: '面积(㎡)',
      field: 'area',
      align: 'center',
    },
    {
      width: '110',
      title: '平米价(元/㎡)',
      field: 'areaPrice',
      align: 'center',
    },
    {
      width: '90',
      title: '总价(元)',
      field: 'totalPrice',
      align: 'center',
    },
    {
      width: '90',
      title: '板材',
      field: 'materialQuality',
      align: 'center',
      filterType: 'select',
      filterParam: {placeholder: '请输入板材' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_material_quality],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}

    },
    {
      width: '90',
      title: '成品板厚',
      field: 'commodityThickness',
      align: 'center',
      filterType: 'select',
      filterParam: {placeholder: '请输入成品板厚' , filterable : 'true'},
      filterData: () => [...resDictData.value.finish_plate_thickness],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90',
      title: '层数',
      field: 'materialLayer',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入层数'},
    },
    {
      width: '90',
      title: '内层铜厚',
      field: 'materialCopperInside',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入内层铜厚'},
      filterData: () => [...resDictData.value.order_material_copperinside],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90',
      title: '外层铜厚',
      field: 'materialCopperOutside',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入外层铜厚'},
      filterData: () => [...resDictData.value.order_material_copperoutside],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90',
      title: '表面处理',
      field: 'surfaceTreatment',
      align: 'center',
      filterType: 'select',
      filterParam: {placeholder: '请输入表面处理' , filterable : 'true'},
      filterData: () => surfaceTreatmentOptions.value
    },
    {
      width: '90',
      title: '阻焊颜色',
      field: 'commoditySolder',
      align: 'center',
      filterType: 'select',
      filterParam: {placeholder: '请输入阻焊颜色' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_commodity_solder],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90',
      title: '字符',
      field: 'characterColor',
      align: 'center',
      filterType: 'select',
      filterParam: {placeholder: '请输入字符' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_character],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '65',
      title: 'SET长',
      field: 'unitedLength',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入SET长',type:'number'},
    },
    {
      width: '65',
      title: 'SET宽',
      field: 'unitedWidth',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入SET宽',type:'number'}
    },
    {
      width: '90',
      title: '联片数量',
      field: 'unitedNumber',
      align: 'center',
    },
    {
      width: '90',
      title: '单位',
      align: 'center',
      field: "unit",
    },
    {
      width: '90',
      title: '合同编号',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入合同编号'}
    },
    {
      width: '50',
      title: '金额',
      field: 'totalOrderPrice',
      align: 'center',
    },
    {width: '50', title: '税金', field: 'tax', align: 'center'},
    // {
    //   width: '60',
    //   title: '本厂数量(pcs)',
    //   field: 'selfQuantity',
    //   align: 'center',
    // },
    {
      width: '60',
      title: '外协数量(pcs)',
      field: 'outSourceQuantity',
      align: 'center',
    },
    {
      width: '60',
      title: '排产总量(pcs)',
      field: 'productionQuantity',
      align: 'center',
    },
    { width: '60',
      title: '待入库(pcs)',
      field: 'waitInventoryQuantity',
      align: 'center',
      filterType: 'input'
    },
    {
      width: '60',
      title: '生产入库(pcs)',
      field: 'productionInventoryQuantity',
      align: 'center',
    },
    {
      width: '60',
      title: '外协入库(pcs)',
      field: 'outSourceInventoryQuantity',
      align: 'center',
    },
    { width: "60",
      title: "总库存(pcs)",
      field: 'commodityInventoryQuantity',
      align: "center" ,
    },
    {
      width: '60',
      title: '订单发货(pcs)',
      field: 'deliveryQuantity',
      align: 'center',
    },
    {
      width: '60',
      title: '退货重发(pcs)',
      field: 'reDeliveryQuantity',
      align: 'center',
    },
    {
      width: '60',
      title: '退货数量(pcs)',
      field: 'alreadyReturnQuantity',
      align: 'center',
    },
    {
      width: '60',
      title: '合同差数(pcs)',
      field: 'differentQuantity',
      align: 'center',
    },
    { width: '60',
      title: '差数面积(㎡)',
      field: 'differentArea',
      align: 'center'
    },
    { width: '60',
      title: '差数金额',
      field: 'differentTotalPrice',
      align: 'center'
    },
    {
      width: '60',
      title: '合并差数(pcs)',
      field: 'allDifferentQuantity',
      align: 'center',
    },
    { width: '60',
      title: '合并差数面积(㎡)',
      field: 'allDifferentArea',
      align: 'center'
    },
    { width: '60',
      title: '合并差数金额',
      field: 'allDifferentTotalPrice',
      align: 'center'
    },
    {
      width: '80',
      title: '是否含税',
      field: 'cusIsTaxRate',
      align: 'center',
    },
    {
      width: '80',
      title: '月结方式',
      field: 'cusMonthlyStatementWay',
      align: 'center',
    },
    {
      width: '65',
      title: '版本号',
      field: 'version',
      align: 'center',
    },
    {
      width: '90',
      title: '币种',
      field: 'cusCurrency',
      align: 'center',
    },
    {
      width: '90',
      title: '包装要求',
      field: 'packRequirement',
      align: 'center',
    },
    {
      width: '90',
      title: '付款方式',
      field: 'cusPaymentMethod',
      align: 'center',
    },
    {
      width: '90',
      title: '发货方式',
      field: "deliveryMethod",
      align: 'center',
    },
    {
      width: '90',
      title: '运输方式',
      field: 'cusTransStyle',
      align: 'center',
    },
    {
      width: '80',
      title: '业务员',
      field: 'cusSaleUserName',
      align: 'center',
      // filterType: 'input',
      // filterParam: {placeholder: '请输入业务员'}
    },
    {
      width: '90',
      title: '下单人',
      field: 'createByName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入下单人'}
    },
    {
      width: '90',
      title: '审核人',
      field: 'auditUserName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入审核人'}
    },
    {
      width: '90',
      title: '板材品牌',
      field: 'materialBrand',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材品牌'}
    },
    {
      width: '90',
      title: '板材级别',
      field: 'materialLevel',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材级别'}
    },
    {
      width: '90',
      title: '阻焊面数',
      field: 'commoditySolderCount',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊面数'}
    },
    {
      width: '90',
      title: '金厚(u\'\')',
      field: 'goldenThickness',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入金厚(u\'\')'}
    },
    {
      width: '90',
      title: '阻焊光泽',
      field: 'commoditySolderGloss',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊光泽'}
    },
    {
      width: '90',
      title: '阻焊要求',
      field: 'commoditySolderRequirement',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊要求'}
    },
    {
      width: '90',
      title: '孔铜厚',
      field: 'poreCopper',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入孔铜厚'}
    },
    {
      width: '90',
      title: '字符面数',
      field: 'characterCount',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符面数'}
    },
    {
      width: '90',
      title: '成形方式',
      field: 'commodityForm',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入成形方式'}
    },
    {
      width: '90',
      title: '字符要求',
      field: 'characterRequirement',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符要求'}
    },
    {
      width: '90',
      title: 'SET打叉',
      field: 'setCross',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入SET打叉'}
    },
    {
      width: '90',
      title: '板翘曲度',
      field: 'warpagePlate',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板翘曲度'}
    },
    {
      width: '90',
      title: '测试方式',
      field: 'commodityTestWay',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试方式'}
    },
    {
      width: '90',
      title: '测试点',
      field: 'testPoint',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试点'}
    },
    {width: '90',
      title: '备品数量',
      field: 'spareQuantity',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入备品数量'}},
    {
      width: '90',
      title: '铜箔',
      field: 'copperFoil',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入铜箔'}
    },
    {
      width: '90',
      title: 'V-CUT',
      field: 'vCut',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入V-CUT'}
    },
    {
      width: '90',
      title: '过孔要求',
      field: 'holeRequirement',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入过孔要求'}
    },
    {
      width: '90',
      title: '检验标准',
      field: 'inspectionStandard',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入检验标准'}
    },
    {
      width: '90',
      title: '金面积',
      field: 'goldArea',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入金面积'}
    },
    {
      width: '90',
      title: '外形要求',
      field: 'appearanceRequirements',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入外形要求'}
    },
    {width: '90', title: 'PP', field: 'pp', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入PP'}},
    {
      width: '90',
      title: '镍厚',
      field: 'nickelThickness',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入镍厚'}
    },
    {
      width: '90',
      title: '锡厚',
      field: 'tinThickness',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入锡厚'}
    },
    {
      width: '110',
      title: '客户物料名称',
      field: 'materialName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户物料名称'}
    },
    {
      width: '110',
      title: '订单特殊要求',
      field: 'specialRequirement',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入订单特殊要求'}
    },
    {
      width: '90',
      title: '最小线宽',
      field: 'minLineWidth',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入最小线宽'}
    },
    {
      width: '90',
      title: '最小线距',
      field: 'minLineSpace',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入最小线距'}
    },
    {
      width: '90',
      title: '最小孔径',
      field: 'minAperture',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入最小孔径'}
    },
    {
      width: '90',
      title: '总孔数',
      field: 'holeCount',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入总孔数'}
    },
    {
      width: '90',
      title: '孔密度',
      field: 'holeDensity',
      align: 'center',
      filterType: 'number',
      filterParam: {placeholder: '请输入孔密度'}
    },
    {
      width: '90',
      title: '模具费',
      field: 'mouldCost',
      align: 'center',
    },
    {
      width: '90',
      title: '测试架费',
      field: 'testFrameCost',
      align: 'center',
    },
    {
      width: '90',
      title: '飞针费',
      field: 'flyProbeCost',
      align: 'center',
    },
    {
      width: '90',
      title: '工程费',
      field: 'engineeringCost',
      align: 'center',
    },
    {
      width: '90',
      title: '样板费',
      field: 'sampleCost',
      align: 'center',
    },
    {
      width: '90',
      title: '加急费',
      field: 'expeditedCost',
      align: 'center',
    },
    {
      width: '90',
      title: '其他费用',
      field: 'otherCost',
      align: 'center',
    },
    {width: '120', title: '市场备注',field: 'remark', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入市场备注'}},
    {
      width: '120',
      title: '客户备注',
      field: 'cusRemark',
      align: 'center',
    },
  ]);

  const detailListTable = ref()
  //单元格合并
  function onGridCellSpan(data: any) {
      //合并合同编号 客户编码 客户名称
      if (data.column.field == 'code' || data.column.field == 'cusName' || data.column.field == 'customerCode') {
          try {
              let gridRows = detailListTable.value.eTableRef.frozenRows;
              //由于分页，需要计算当前行的实际Index
              let currentIndex = data.rowIndex % gridRows.length;
              //当不是第一条记录的时候，如果上一条记录与它相同，则会被合并
              if (currentIndex > 0
                  && gridRows[currentIndex - 1].code == data.row.code) {
                  return { rowspan: '', colspan: 1 };
              }

              let rows = 1;
              //当不是最后一条记录时，计算后面连续相同的行数
              while (currentIndex + rows <= gridRows.length - 1
                  && gridRows[currentIndex + rows].code == data.row.code) {
                  rows = rows + 1;
              }
              return { rowspan: rows, colspan: 1 }
          } catch (err) {
              console.log(err);
              console.log(data);
              return { rowspan: 1, colspan: 1 };
          }
      }
      return { rowspan: 1, colspan: 1 };
  }

  // 尾部总计
  const footerData = ref([{
      index: '合计',
      area: 0,
      totalPrice: 0,
      totalOrderPrice: 0,
      tax: 0,
      quantity: 0,
  }])

const getTotalAmount = async () => {
  // debugger;
  // loading.value = true;
  console.log(queryParams.value);
  const res = await totalAmount(queryParams.value);
  //orderList.value = res.rows;
  //footerData.value.area =res.data
  footerData.value[0].area = res.areaTotal;
  footerData.value[0].quantity = res.quantityTotal;
  footerData.value[0].totalOrderPrice = res.totalOrderPrice;
  footerData.value[0].totalPrice = res.totalPrice;
  footerData.value[0].tax = res.totalTax;
  // total.value = res.total;
  // loading.value = false;
  }



  /** 查询订单列表 */
  const getList = async () => {
    loading.value = true;
    console.log(queryParams.value);
    const res = await listPostOrder(queryParams.value);

    orderList.value = res.rows;

   /* for (let key in footerData.value[0]) {
      footerData.value[0][key] = 0
    }
    orderList.value.map((v: any) => {
      footerData.value[0].area += Number(v.area || 0)
      footerData.value[0].totalPrice += Number(v.totalPrice || 0)
      footerData.value[0].totalOrderPrice += Number(v.totalOrderPrice || 0)
      footerData.value[0].tax += Number(v.tax || 0)
      footerData.value[0].quantity += Number(v.quantity || 0)
    })
    footerData.value[0].area = footerData.value[0].area.toFixed(4)
    footerData.value[0].totalPrice = footerData.value[0].totalPrice.toFixed(2)
    footerData.value[0].totalOrderPrice = footerData.value[0].totalOrderPrice.toFixed(2)
    footerData.value[0].tax = footerData.value[0].tax.toFixed(2)
    footerData.value[0].quantity = footerData.value[0].quantity.toFixed(0)
*/
    total.value = res.total;
    loading.value = false;
  }

  /** 取消按钮 */
  const cancel = () => {
    reset();
    dialog.visible = false;
  }

  /** 查看回签按钮取消 */
  const cancelCotractUpload = () => {
    //reset();
    dialogCotractUpload.visible = false;
  }

/** 已完成信息修改按钮取消 */
const cancelCotractCompleted = () => {
  //reset();
  dialogCotractCompleted.visible = false;
}

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    orderFormRef.value?.resetFields();
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
    getTotalAmount();
  }

  /** 导出操作 */
  const exportExcel = async () => {
    exportVisible.value = false;
    proxy?.download('order/saleOrder/export', {
      ...queryParams.value, tableName: mainTableToolId.value
    }, `销售合同_${new Date().getTime()}.xlsx`);
  }

  /** 导出前操作 */
  const exportExcelBefore = async () => {
    //先看看有没有给起始时间，没有要给出提示
    //2024年3月1日需求  没有查询条件才需要默认导出30天  有按查询条件导
    let count = 0;
    for (const key in queryParams.value) {
      if (queryParams.value[key] !== null && queryParams.value[key] !== undefined) {
        count++;
      }
    }
    if (!queryParams.value.placeOrderTimeStart && count == 5) {
      exportVisible.value = true;
    } else {
      proxy?.download('order/saleOrder/export', {
        ...queryParams.value, tableName: mainTableToolId.value
      }, `销售合同_${new Date().getTime()}.xlsx`);
    }
  }

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    // queryParams.value.customerCodeList=undefined;
    queryParams.value.placeOrderTimeStart='';
    queryParams.value.placeOrderTimeEnd='';
    queryParams.value.cusSaleUserId='';
    handleQuery();
  }

  /** 多选框选中数据 */
  const handleSelectionChange = (selection: OrderVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    dialog.visible = true;
    dialog.title = "添加订单";
  }

  /** 修改按钮操作 */
  const handleUpdate = async (row?: OrderVO) => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getOrder(_id);
    Object.assign(form.value, res.data);
    dialog.visible = true;
    dialog.title = "修改订单";
  }


/** 文件上传确定按钮 */
const submitFormUpload = () => {
  let params = deepClone(formInline.value);
  // 文件
  params.quotationFileList = [...params.quotationFileList, ...popoverFileList.value] as any
  params.quotationFileList.map((v: any) => {
    if (v?.delFlag == undefined || v?.delFlag == '' || v?.delFlag == null) {
      v.delFlag = 0
    }
  })
  updateOrderAndUpload(params).finally(() => buttonLoading.value = false);
  params.quotationFileList.value=[];
  proxy?.$modal.msgSuccess("修改成功");
  dialogCotractUpload.visible = false;
  getList();
  getTotalAmount();
}

/**
 * 已完成信息修改
 */
const submitFormComplete = () => {
  let params = deepClone(formInline.value);
  // 文件
  params.quotationFileList = [...params.quotationFileList, ...popoverFileList.value] as any
  params.quotationFileList.map((v: any) => {
    if (v?.delFlag == undefined || v?.delFlag == '' || v?.delFlag == null) {
      v.delFlag = 0
    }
  })
  updateOrderComplete(params)
    .then(e => {
      params.quotationFileList.value=[];
      proxy?.$modal.msgSuccess("修改成功");
      queryParams.value.pageNum = 1;
      getList();
      getTotalAmount();
    })
    .finally(() => {
      buttonLoading.value = false
      dialogCotractCompleted.visible = false;
    });
}

// 进度确认按钮
const progressConfirm = (item: any) => {
      proxy?.$modal.msgSuccess("设置成功");
      console.log("item",item)
      getOrderProcess(item.saleOrderVo.id).then((res: any) => {
      if (res.code == 200) {
          progressInfo.value.data = res.data
        }
      })
}

  /** 提交按钮 */
  const submitForm = () => {
    orderFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        if (form.value.id) {
          await updateOrder(form.value).finally(() => buttonLoading.value = false);
        } else {
          await addOrder(form.value).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("修改成功");
        dialog.visible = false;
        await getList();
        await getTotalAmount();
      }
    });
  }

  /** 删除按钮操作 */
  const handleDelete = async (row?: OrderVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认删除订单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
    await delOrder(_ids);
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
    await getTotalAmount();
  }

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('system/order/export', {
      ...queryParams.value
    }, `order_${new Date().getTime()}.xlsx`)
  }

  const fisrtEnter = ref(false)
  onActivated(() => {
    // onMounted执行后再执行 http://www.codebaoku.com/question/question-sd-1010000043593478.html
    if(!fisrtEnter.value) return
    if (useTagsViewStore().refreshSale) {
      getList();
      getTotalAmount();
      getCustomerList();
      getDictOptions();
      useTagsViewStore().setRefreshSale(false)
    }
  })


  const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerCode
        }
      });
      customerNameList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerName
        }
      });
    }
  }



  onMounted(async () => {
    getList();
    getListCust();
    getTotalAmount();
    await getCustomerList();
    getDictOptions();
    fisrtEnter.value = true
  });
</script>

<style lang="scss" scoped>
:deep(.detail-prod-drawder) {
  .el-drawer__header {
    padding: 0px 20px;
    height: 35px;
    margin-bottom: 0px;
  }

  .el-drawer__body {
    padding: 5px 5px;
  }
}
:deep(.kingzon-page-table) {
  .datagrid-row-over {
    // background: transparent;
    .datagrid-row-over {
      background: transparent;
    }
  }
}

// :deep(.el-select) {
//   width: 100%;
// }

// :deep(.el-input__wrapper) {
//   width: 100%;
// }

:deep(.vxe-table--fixed-left-wrapper) {
  z-index: 2 !important;
  height: calc(100% - 10px) !important;
}

:deep(.vxe-table--fixed-right-wrapper) {
  z-index: 2 !important;
  height: calc(100% - 10px) !important;
}

:deep(.el-drawer__header) {
  padding: 0px 20px;
  height: 40px;
  margin-bottom: 0px;
}
</style>

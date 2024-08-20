<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" class="xtable-tab" v-model="editableTabsValue" @tab-change="radioTableHandle()">
        <el-tab-pane label="申请列表" :name="1">
          <XTable toolId="outsourceSourceFullProcessOrder" height="100%" class="xtable-content"
                  v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="sourceFullProcessOrderList"
                  :columnList="columnList"
                  show-footer="true"
                  :footer-method="footerMethod"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="loading"
                   :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','deliverTime','createTime']"
          >
           <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="uReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{dateFormat(row.placeOrderTime)}}</div>
            </template>
            <template #default-status="{row}">
              <div v-for="item in statusOptions">
                <el-tag :type="item.type" size="small" v-if="item.value == row.status">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-urgent="{ row }">
              <div>{{ resDictData?.order_urgent.find(v => v.dictValue == row.urgent)?.dictLabel }}</div>
            </template>
            <!-- <template #default-orderType="{row}">
              <div>{{ resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</div>
            </template> -->
            <template #default-orderType="{row}">
        <div>{{ resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</div>
      </template>
            <template #default-model="{ row }">
              <div>{{ resDictData?.order_model.find(v => v.dictValue == row.model)?.dictLabel }}</div>
            </template>
<!--            <template #default-materialQuality="{ row }">
              <div>{{
                  resDictData?.order_material_quality.find(v => v.dictValue == row.materialQuality)?.dictLabel
                }}
              </div>
            </template>-->
<!--            <template #default-commodityThickness="{ row }">
              <div>{{
                  resDictData?.finish_plate_thickness.find(v => v.dictValue == row.commodityThickness)?.dictLabel
                }}
              </div>
            </template>-->
             <template #default-dispatchTime="{ row }">
        <div>{{dateFormat(row.dispatchTime)}}</div>
      </template>
            <!-- <template #default-surfaceTreatment="{ row }">
              <div>{{
                  resDictData?.order_surface_treatment.find(v => v.dictValue == row.surfaceTreatment)?.dictLabel
                }}
              </div>
            </template> -->
<!--            <template #default-commoditySolder="{ row }">
              <div>{{
                  resDictData?.order_commodity_solder.find(v => v.dictValue == row.commoditySolder)?.dictLabel
                }}
              </div>
            </template>-->
<!--            <template #default-characterColor="{ row }">
              <div>{{ resDictData?.order_character.find(v => v.dictValue == row.characterColor)?.dictLabel }}</div>
            </template>-->
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-make="scope">
              <!-- <el-tooltip content="修改" placement="top">
            <el-button link type="primary" @click="handleUpdate(scope.row)" >修改</el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" @click="handleDelete(scope.row)" >删除</el-button>
          </el-tooltip>
          <el-tooltip content="详情" placement="top">
            <el-button link type="primary" @click="handleDetail(scope.row)" >详情</el-button>
          </el-tooltip> -->
              <el-button
                link
                type="primary"
                v-show="scope.row.isConfirmed == '0' && (scope.row.status == StatusEnum.BE_SUBMITTED || ((!scope.row.receiveQuantity || scope.row.receiveQuantity==0) && (!scope.row.backQuantity || scope.row.backQuantity==0)))"
                @click="handleUpdate(scope.row)"
                v-if="checkPermi(['outsource:full:edit'])"
              >编辑
              </el-button>
              <el-button
                link
                type="primary"
                v-show="scope.row.status == StatusEnum.BE_SUBMITTED"
                @click="checkPass(scope.row)"

              >提交
              </el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)"
                         >详情
              </el-button>
              <el-button
                link
                type="primary"
                v-show="scope.row.isConfirmed == '0' && (scope.row.status == StatusEnum.BE_SUBMITTED || ( scope.row.status == StatusEnum.CANCELLED&& ((!scope.row.receiveQuantity || scope.row.receiveQuantity==0) && (!scope.row.backQuantity || scope.row.backQuantity==0))))"
                @click="handleDelete(scope.row)"
                v-if="checkPermi(['outsource:full:del'])"
              >删除
              </el-button>
              <el-button
                link
                type="primary"
                v-show="scope.row.isConfirmed == '0' && scope.row.status !=  StatusEnum.CANCELLED"
                @click="handleCancelOutSource(scope.row)"
                v-if="checkPermi(['outsource:full:edit'])"
              >取消外协
              </el-button>
              <el-button link type="primary" v-show="wxhSwitch && scope.row.quantity != scope.row.receiveQuantity
                  && scope.row.status == StatusEnum.WAIT_RECEIVE && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">结单</el-button>
              <el-button link type="primary" v-show="wxhSwitch && scope.row.confirmStatus" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" v-show="wxhSwitch && scope.row.confirmStatus" @click="handleRecord(scope.row.id)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待确认列表" :name="2" v-if="wxhSwitch">
          <XTable toolId="outsourceSourceFullProcessOrder" height="100%" class="xtable-content"
                  v-model:page-size="waitQueryParams.pageSize"
                  v-model:current-page="waitQueryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="sourceFullProcessOrderList"
                  :columnList="columnList2"
                  show-footer="true"
                  :footer-method="footerMethod"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="loading"
                  :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','deliverTime','createTime']"
          >
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="uReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{dateFormat(row.placeOrderTime)}}</div>
            </template>
            <template #default-confirmStatus="{row}">
              <div v-for="item in confirmStatusOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === row.confirmStatus">{{item.label}}</el-tag>
              </div>
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
            <template #default-dispatchTime="{ row }">
              <div>{{dateFormat(row.dispatchTime)}}</div>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.quantity != scope.row.receiveQuantity && scope.row.detailStatus === '1'"
                         @click="handleStatement(scope.row)">结单</el-button>
              <el-button link type="primary" v-show="scope.row.confirmStatus == '1'" @click="handleConfirm(scope.row)">确认</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row.id)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已确认列表" :name="3" v-if="wxhSwitch">
          <XTable toolId="outsourceSourceFullProcessOrder" height="100%" class="xtable-content"
                  v-model:page-size="confirmQueryParams.pageSize"
                  v-model:current-page="confirmQueryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="sourceFullProcessOrderList"
                  :columnList="columnList2"
                  show-footer="true"
                  :footer-method="footerMethod"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="loading"
                  :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','deliverTime','createTime']"
          >
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="uReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{dateFormat(row.placeOrderTime)}}</div>
            </template>
            <template #default-confirmStatus="{row}">
              <div v-for="item in confirmStatusOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === row.confirmStatus">{{item.label}}</el-tag>
              </div>
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
            <template #default-dispatchTime="{ row }">
              <div>{{dateFormat(row.dispatchTime)}}</div>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.confirmStatus === '3'" @click="handleCancel(scope.row)">取消</el-button>
              <el-button link type="primary" v-show="scope.row.quantity != scope.row.receiveQuantity && scope.row.detailStatus === '1'"
                         @click="handleStatement(scope.row)">结单</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row.id)">确认记录</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加或修改订单外协订单对话框 -->
    <el-drawer :title="drawer.title" v-model="drawer.visible" size="70%">
      <div v-loading="dialogTableLoading">
        <SendOutSource
          ref="SendOutSourceRef"
          v-if="!dialogTableLoading"
          :orderInfo="currentInfo"
          :disabled="disabled"
          :isConfirm="isConfirm"
          :checkAddress="false"
          :outSourceOrder="outSourceOrder"
          :mustInt="true"
        ></SendOutSource>
        <SaleDescriptions style="padding-top: 50px;" v-if="currentInfo" :currentInfo="currentInfo"
          :customerList="detailCustomerList"                :resDictData="resDictData"></SaleDescriptions>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>

          <el-button
            :loading="buttonLoading"
            type="primary"
            v-show="drawer.title?.includes('编辑') || drawer.title?.includes('添加')"
            @click="handleSave"
          >
            保存
          </el-button>
          <el-button :loading="buttonLoading" type="primary" v-show="drawer.title?.includes('确认')" @click="handleCommit">提 交</el-button>
        </div>
      </template>
    </el-drawer>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="cancelOutSourceFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="外协数量" prop="quantity">
          <el-input :disabled="true" v-model="form.quantity" placeholder="请输入外协数量"/>
        </el-form-item>
        <el-form-item label="收货数量" prop="receiveQuantity">
          <el-input :disabled="true" v-model="form.receiveQuantity" placeholder="请输入收货数量"/>
        </el-form-item>
        <el-form-item label="退货数量" prop="backQuantity">
          <el-input :disabled="true" v-model="form.backQuantity" placeholder="请输入退货数量"/>
        </el-form-item>
        <el-form-item label="取消数量" prop="cancelQuantity">
          <el-input-number style="width: 100%;" :controls="false" v-model="form.cancelQuantity"
                :precision="0" placeholder="请输入取消数量"  :max="form.quantity-form.receiveQuantity" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button :loading="buttonLoading" type="primary" @click="handleCancelOustSourceSubmit">确 定</el-button>
          <el-button :loading="buttonLoading" @click="dialog.visible=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

        <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
      draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="fileId" :biz-code="bizCode"/>
    <!-- 操作记录 -->
    <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="recordId" />

    <!-- 结单和取消对话框 -->
    <el-dialog v-model="statement.visible" :title="statement.title" width="30%" align-center destroy-on-close>
      <el-row>
        <el-col :span="24">
          <el-form ref="detailOrderFormRef" :model="detailForm" :rules="detailRules" label-width="80px">
            <el-form-item :label="statement.describe" prop="confirmRemark">
              <el-input v-model="detailForm.confirmRemark" maxLength="2000" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="id" prop="id" v-show="false">
              <el-input v-model="detailForm.id"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statement.visible = false">取消</el-button>
          <el-button v-if="statement.title === '申请结单'" type="primary" @click="statementAccount">确认</el-button>
          <el-button v-if="statement.title === '申请取消'" type="primary" @click="cancelAccount">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SourceFullProcessOrder" lang="ts">
import {
  listSourceFullProcessOrder,
  getSourceFullProcessOrder,
  delSourceFullProcessOrder,
  cancelSourceFullProcessOrder,
  updateSourceFullProcessOrderStatus,
  updateSourceFullProcessOrder, compareList, outSourceStatementDetail, outSourceCancelOrder,
} from '@/api/outsource/sourceFullProcessOrder';
import {
  SourceFullProcessOrderVO,
  SourceFullProcessOrderQuery,
  SourceFullProcessOrderForm,
  StatusEnum
} from '@/api/outsource/sourceFullProcessOrder/types';
import {VxeTableEvents, VxeTablePropTypes} from 'vxe-table'
import {getDicts} from "@/api/system/dict/data";
import {sortBy} from "@/utils/dict";
import {getOrder} from '@/api/order/directOrder';
import {QuotationVO} from "@/api/order/quotation/types";
import dayjs from "dayjs";
import {checkPermi} from "@/utils/permission";
/**报表预览 */
import { getReportUrl } from '@/utils/report';
import {getSignPdf} from "@/api/financial/accountOrder";
import {MaterialOrderForm, MaterialOrderQuery} from "@/api/purchase/materialOrder/types";
import {ref} from "vue";
/** 报表预览地址 */
let reportUrl = ref("");
const uReportHandle = async (row: any) => {
  reportDrawer.title = "PCB外协合同预览";
  reportDrawer.visible = true;
  if(row.confirmStatus=="3"){
    getSignPdf({bizCode:row.code}).then(res=>{
      let vo = res.data;
      if (vo.url) {
        let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
        reportUrl.value = url;
        return;
      }
    });
  }
  reportUrl.value = getReportUrl() + `&_n=PCB外协合同&_u=file:outSource.ureport.xml&url=outsource/sourceFullProcessOrder/review/${row.id}`;
  reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
}

const wxhSwitch = ref(import.meta.env.VITE_WXH_SWITCH === 'true');

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

// 查询操作记录
const recordId = ref();
const recordVisible = ref(false);
const uploadVisible = ref(false);
// 文件上传类型
const moduleCode = ref('4');
const bizType = ref('15');
const fileId = ref<string | number>();
const bizCode = ref<string>();

const sourceFullProcessOrderList = ref<SourceFullProcessOrderVO[]>([]);
const buttonLoading = ref(false);
const outSourceOrder = ref<SourceFullProcessOrderVO>();
const loading = ref(true);
const disabled = ref(false);
const isConfirm = ref(false);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const SendOutSourceRef = ref<any>();
let currentInfo = ref<any>(undefined);
const queryFormRef = ref<ElFormInstance>();
const sourceFullProcessOrderFormRef = ref<ElFormInstance>();
const cancelOutSourceFormRef = ref<ElFormInstance>();
const dialogTableLoading = ref(false)
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: 'PCB外协加工合同预览'
});
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const editableTabsValue = ref(1);
const statusOptions = ref([
  {value: "1", label: "未提交", type:"info"},
  {value: "2", label: "已提交", type:"primary"},
  {value: "3", label: "已完成", type:"success"},
  {value: "4", label: "取消", type:"warning"}
])
const confirmStatusOptions = ref([
  { type:"warning", label: '待确认', value: "1" },
  { type:"primary", label: '待对方确认', value: "2" },
  { type:"success", label: '已确认', value: "3" }
])
 const dateFormat = (cellValue : any) => {
    return dayjs(cellValue).format("YYYY-MM-DD")
  }
const radioTable = ref('申请列表');


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

// 切换菜单栏
const radioTableHandle = async () => {

  if (editableTabsValue.value == 1) {
    queryParams.value.status = undefined;
    await getList();
  }else if(editableTabsValue.value == 2){
    await getWitaList();
  }else{
    await getConfirmList();
  }

}
const drawer = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SourceFullProcessOrderForm = {
  id: undefined,
  supplierId: undefined,
  quantity: undefined,
  receiveQuantity: undefined,
  cancelQuantity: undefined,
  outSourceQuantity: undefined,
  backQuantity: undefined,
  price: undefined,
  areaPrice: undefined,
  totalPrice: undefined,
  addressId: undefined,
  addressType: undefined,
  remark: undefined,
  engineeringCost: undefined,
  testFrameCost: undefined,
  flyProbeCost: undefined,
  mouldCost: undefined,
  expeditedCost: undefined,
  otherCost: undefined,
  sampleCost: undefined,
  code: undefined,
  status: undefined,
  ownerId: undefined,
  saleOrderId: undefined,
  confirmRemark: undefined,
  otherCostList: [] as any[]
}
//validateNumber
const validateNumber = (rule: any, value: any, callback: any) => {
  if (value <= 0) {
    callback(new Error("请输入大于0的数字"));
  } else {
    callback();
  }
};
const data = reactive<PageData<SourceFullProcessOrderForm, SourceFullProcessOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    quantity: undefined,
    price: undefined,
    areaPrice: undefined,
    totalPrice: undefined,
    addressId: undefined,
    addressType: undefined,
    engineeringCost: undefined,
    testFrameCost: undefined,
    flyProbeCost: undefined,
    mouldCost: undefined,
    expeditedCost: undefined,
    otherCost: undefined,
    sampleCost: undefined,
    no: undefined,
    status: undefined,
    ownerId: undefined,
    saleOrderId: undefined,
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "主键id不能为空", trigger: "blur"}
    ],

    cancelQuantity: [
      {required: true, message: "数量不能为空", trigger: "blur"},
      //大于0
      {validator: validateNumber, trigger: "blur"}

    ],


  }
});

const waitData = reactive<PageData<SourceFullProcessOrderForm, SourceFullProcessOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    quantity: undefined,
    price: undefined,
    areaPrice: undefined,
    totalPrice: undefined,
    addressId: undefined,
    addressType: undefined,
    engineeringCost: undefined,
    testFrameCost: undefined,
    flyProbeCost: undefined,
    mouldCost: undefined,
    expeditedCost: undefined,
    otherCost: undefined,
    sampleCost: undefined,
    no: undefined,
    status: '2',
    ownerId: undefined,
    saleOrderId: undefined,
    confirmStatus: '1',
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "主键id不能为空", trigger: "blur"}
    ],
    cancelQuantity: [
      {required: true, message: "数量不能为空", trigger: "blur"},
      //大于0
      {validator: validateNumber, trigger: "blur"}
    ],
  }
});

const confirmData = reactive<PageData<SourceFullProcessOrderForm, SourceFullProcessOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    quantity: undefined,
    price: undefined,
    areaPrice: undefined,
    totalPrice: undefined,
    addressId: undefined,
    addressType: undefined,
    engineeringCost: undefined,
    testFrameCost: undefined,
    flyProbeCost: undefined,
    mouldCost: undefined,
    expeditedCost: undefined,
    otherCost: undefined,
    sampleCost: undefined,
    no: undefined,
    status: '2',
    ownerId: undefined,
    saleOrderId: undefined,
    confirmStatusList: ['2','3'],
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "主键id不能为空", trigger: "blur"}
    ],
    cancelQuantity: [
      {required: true, message: "数量不能为空", trigger: "blur"},
      //大于0
      {validator: validateNumber, trigger: "blur"}
    ],
  }
});

const detailData = reactive<PageData<SourceFullProcessOrderForm, SourceFullProcessOrderQuery>>({
  form: { ...initFormData },
  queryParams: {},
  rules: {
    confirmRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const {form : detailForm, rules: detailRules } = toRefs(detailData);

const footerMethod: VxeTablePropTypes.FooterMethod<SourceFullProcessOrderVO> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "quantity") {
        return `${sumNum(data, "quantity").toFixed(4)} `;
      }
      return "";
    })
  ];
};

const sumNum = (list: QuotationVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    count += Number(item[field]);
  });
  return count;
};


const XTableRef = ref()

const columnList = ref([

  {title: "序号", width: '50', type: 'seq', align: 'center',},
  {title: '状态', width: '60', field: 'status', align: 'center',
  filterType: 'radioButton',  filterData: () => statusOptions.value, filterCustom: {
      label: 'label',
      value: 'value'
    }

},
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入外协单号'}
  },
  {
    title: '外协供应商',
    width: '160',
    field: 'supplierName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入供应商'}
  },
  {
    title: '客户名称',
    width: '180',
    field: 'cusName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入客户名称'}
  },
  {
    title: '客户编码',
    width: '80',
    field: 'customerCode',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入客户编码'}
  },
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
      width: '120',
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
    // {
    //   width: '90',
    //   title: '提交时间',
    //   field: 'submitTime',
    //   align: 'center',
    //   filterType: 'intervalDate',
    //   filterParam: {
    //     startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
    //     endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
    //   }
    // },
  // {
  //   title: '新/返',
  //   width: '80',
  //   field: 'orderType',
  //   align: 'center',
  // },
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
  // {
  //   title: '批/样',
  //   width: '80',
  //   field: 'model',
  //   align: 'center',
  // },
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

  {title: '外协单价', width: '80', field: 'price', align: 'center',},
  {title: '外协数量（PCS）', width: '100', field: 'quantity', align: 'center',},
  {title: '收货数量（PCS）', width: '100', field: 'receiveQuantity', align: 'center',},
  {title: '备品数量（PCS）', width: '100', field: 'reserveQuantity', align: 'center',},
  {title: '外协总价', width: '80', field: 'totalPrice', align: 'center'},
  {title: '订单数量（PCS）', width: '100', field: 'saleQuantity', align: 'center',},
  {title: '订单单价', width: '80', field: 'salePrice', align: 'center',},
  {title: '订单面积（m²）', width: '100', field: 'area', align: 'center',},
  {title: '平米价', width: '80', field: 'saleAreaPrice', align: 'center',},
  {title: '订单总价', width: '80', field: 'saleTotalPrice', align: 'center'},

  // {
  //   title: '板材',
  //   width: '80',
  //   field: 'materialQuality',
  //   align: 'center',
  // },
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
  // {
  //   title: '表面处理',
  //   width: '80',
  //   field: 'surfaceTreatment',
  //   align: 'center',
  // },
   {
      width: '90',
      title: '表面处理',
      field: 'surfaceTreatment',
      align: 'center',
       filterType: 'input',
    filterParam: {placeholder: '请输入表面处理'}
    },
  // {
  //   title: '阻焊颜色',
  //   width: '80',
  //   field: 'commoditySolder',
  //   align: 'center',
  // },
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
  // {
  //   title: '字符',
  //   width: '80',
  //   field: 'characterColor',
  //   align: 'center',
  // },
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
  {title: '单位', width: '80', field: 'unit', align: 'center'},

  {title: '操作', field: 'make', align: 'center', width: '260', fixed: 'right',},
]);

const columnList2 = ref([

  {title: "序号", width: '50', type: 'seq', align: 'center',},
  {title: '状态', width: '70', field: 'confirmStatus', align: 'center',},
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入外协单号'}
  },
  {
    title: '外协供应商',
    width: '160',
    field: 'supplierName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入供应商'}
  },
  {title: '外协单价', width: '80', field: 'price', align: 'center',},
  {
    title: '客户名称',
    width: '180',
    field: 'cusName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入客户名称'}
  },
  {
    title: '客户编码',
    width: '80',
    field: 'customerCode',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入客户编码'}
  },
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
    width: '120',
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
  {title: '收货数量（PCS）', width: '100', field: 'receiveQuantity', align: 'center',},
  {title: '备品数量（PCS）', width: '100', field: 'reserveQuantity', align: 'center',},
  {title: '外协总价', width: '80', field: 'totalPrice', align: 'center'},
  {title: '订单数量（PCS）', width: '100', field: 'saleQuantity', align: 'center',},
  {title: '订单单价', width: '80', field: 'salePrice', align: 'center',},
  {title: '订单面积（m²）', width: '100', field: 'area', align: 'center',},
  {title: '平米价', width: '80', field: 'saleAreaPrice', align: 'center',},
  {title: '订单总价', width: '80', field: 'saleTotalPrice', align: 'center'},

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

  {title: '成品板厚', width: '80', field: 'commodityThickness', align: 'center',},
  {title: '层数', width: '80', field: 'materialLayer', align: 'center',},
  {title: '内层铜厚', width: '80', field: 'materialCopperInside', align: 'center',},
  {title: '外层铜厚', width: '80', field: 'materialCopperOutside', align: 'center',},
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

  {title: 'SET长', width: '80', field: 'unitedLength', align: 'center'},
  {title: 'SET宽', width: '80', field: 'unitedWidth', align: 'center'},
  {title: '联片数量', width: '80', field: 'unitedNumber', align: 'center'},
  {title: '单位', width: '80', field: 'unit', align: 'center'},
  {title: '操作', field: 'make', align: 'center', width: '260', fixed: 'right',},
]);

const checkedSourceFullProcessOrderList = ref<SourceFullProcessOrderVO[]>([]);

const {queryParams, form, rules} = toRefs(data);
const {queryParams: waitQueryParams} = toRefs(waitData);
const {queryParams: confirmQueryParams} = toRefs(confirmData);

const detailCustomerList = ref<any[]>([]);
const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceFullProcessOrderVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedSourceFullProcessOrderList.value = selectRecords.map(item => item);
  }
}

// 获取 搜索条件
const searchChange = (params: any) => {
  if (editableTabsValue.value == 1) {
    queryParams.value = params;
    getList();
  }else if(editableTabsValue.value == 2){
    waitQueryParams.value = params;
    waitQueryParams.value.status = '2';
    waitQueryParams.value.confirmStatus = '1';
    getWitaList();
  }else{
    confirmQueryParams.value = params;
    waitQueryParams.value.status = '2';
    confirmQueryParams.value.confirmStatusList = ['2','3'];
    getConfirmList();
  }
}

/** 查询订单外协订单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.isConfirmed = '0';
  const res = await listSourceFullProcessOrder(queryParams.value);
  sourceFullProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询订单外协待确认列表 */
const getWitaList = async () => {
  loading.value = true;
  const res = await listSourceFullProcessOrder(waitQueryParams.value);
  sourceFullProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询订单外协已确认列表 */
const getConfirmList = async () => {
  loading.value = true;
  const res = await listSourceFullProcessOrder(confirmQueryParams.value);
  sourceFullProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  drawer.visible = false;
}
/** 取消外协按钮 */
const cancelOutSource = () => {


  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  sourceFullProcessOrderFormRef.value?.resetFields();
  isConfirm.value = false;
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
const handleSelectionChange = (selection: SourceFullProcessOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/**详情按钮操作 */
const handleDetail = async (row?: SourceFullProcessOrderVO) => {

  reset();
  const _id = row?.id
  disabled.value = true;
  const saleOrderId = row?.saleOrderId;
  if (_id) {
    await getSourceFullProcessOrder(_id).then(res => {


      outSourceOrder.value = res.data;
      outSourceOrder.value.cusId = row.cusId;
    })
  }
  if (saleOrderId) {

    drawer.visible = true;
    drawer.title = "详情";
    dialogTableLoading.value = true
    getOrder(saleOrderId).then(res => {

      dialogTableLoading.value = false
      currentInfo.value = res.data;
      detailCustomerList.value.push({
        id:res.data.cusId,
        customerName:res.data.cusName,
        customerCode:res.data.customerCode
      })
    })
  }


}
/** 修改按钮操作 */
const handleUpdate = async (row?: SourceFullProcessOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  disabled.value = false;
  const saleOrderId = row?.saleOrderId;
  drawer.visible = true;
  drawer.title = "编辑";
  if (_id) {
    dialogTableLoading.value = true
    await getSourceFullProcessOrder(_id).then(res => {
        console.log("外协订单",res.data);
      outSourceOrder.value = res.data;
      outSourceOrder.value.cusId = row.cusId;
      dialogTableLoading.value = false
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
      console.log("currentInfo",currentInfo.value);
      dialogTableLoading.value = false

    })
  }

}
let maxQuantity;
/** 确认按钮操作 */
const handleConfirm = async (row?: SourceFullProcessOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  disabled.value = false;
  isConfirm.value = true;
  const saleOrderId = row?.saleOrderId;
  drawer.visible = true;
  drawer.title = "订单确认";
  if (_id) {
    dialogTableLoading.value = true
    await getSourceFullProcessOrder(_id).then(res => {
      outSourceOrder.value = res.data;
      outSourceOrder.value.cusId = row.cusId;
      dialogTableLoading.value = false
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
    })
  }
  maxQuantity = row?.quantity;
}

const save = async (status: string, isConfirmed: string) => {
  SendOutSourceRef.value.submitOtherCost((data: any) => {

    if (data) {
      form.value = data;


      //验证
      if(form.value.price){
        let price = Number(form.value.price);
        if(price <= 0){
          proxy?.$modal.msgError("外协单价必须大于0");
          return;
        }
      }
      if(form.value.quantity){
        let quantity = Number(form.value.quantity);
        if(quantity <= 0){
          proxy?.$modal.msgError("外协数量必须大于0");
          return;
        }
      }

      if(form.value.areaPrice){
        let areaPrice = Number(form.value.areaPrice);
        if(areaPrice <= 0){
          proxy?.$modal.msgError("外协平米价必须大于0");
          return;
        }
      }
      // mouldCost
      if(form.value.mouldCost){
        let mouldCost = Number(form.value.mouldCost);
        if(mouldCost <= 0){
          proxy?.$modal.msgError("外协模具费必须大于0");
          return;
        }
      }


      // testFrameCost
      if(form.value.testFrameCost){
        let testFrameCost = Number(form.value.testFrameCost);
        if(testFrameCost <= 0){
          proxy?.$modal.msgError("外协测试架费必须大于0");
          return;
        }
      }
      // flyProbeCost
      if(form.value.flyProbeCost){
        let flyProbeCost = Number(form.value.flyProbeCost);
        if(flyProbeCost <= 0){
          proxy?.$modal.msgError("外协飞针费必须大于0");
          return;
        }
      }
      // engineeringCost
      if(form.value.engineeringCost){
        let engineeringCost = Number(form.value.engineeringCost);
        if(engineeringCost <= 0){
          proxy?.$modal.msgError("外协工程费必须大于0");
          return;
        }
      }
      // sampleCost
      if(form.value.sampleCost){
        let sampleCost = Number(form.value.sampleCost);
        if(sampleCost <= 0){
          proxy?.$modal.msgError("外协样板费必须大于0");
          return;
        }
      }


      //engineeringCost
      if(form.value.engineeringCost){
        let engineeringCost = Number(form.value.engineeringCost);
        if(engineeringCost <= 0){
          proxy?.$modal.msgError("工程费必须大于0");
          return;
        }
      }
       // expeditedCost
      if(form.value.expeditedCost){
        let expeditedCost = Number(form.value.expeditedCost);
        if(expeditedCost <= 0){
          proxy?.$modal.msgError("外协加急费必须大于0");
          return;
        }
      }
      //状态
      let flag = false;
      //其他费用：otherCostList
      if(form.value.otherCostList){
        form.value.otherCostList.forEach((item:any) => {
          if(item.title == undefined || item.title == ""){
            flag = true;
            proxy?.$modal.msgError("其他费用名称不能为空");
            return;
          }
          if(!item.price){
             flag = true;
            proxy?.$modal.msgError("请输入其他费用");
            return;
          }
            let cost = Number(item.cost);
            if(cost <= 0){
               flag = true;
              proxy?.$modal.msgError("其他费用必须大于0");
              return;
            }
        });
      }
      if(flag){
        return;
      }
      console.log("save status",status);
      console.log("save form.value.status",form.value.status);
      if(status){
        form.value.status = status;
      }
      form.value.isConfirmed = isConfirmed;
      buttonLoading.value = true;
      updateSourceFullProcessOrder(form.value).then(res => {
        proxy?.$modal.msgSuccess("修改成功");
        drawer.visible = false;
        radioTableHandle();
      }).finally(() => { buttonLoading.value = false; });

    }
  });


}

/** 提交*/
const checkPass = async (row: SourceFullProcessOrderVO) => {
  await proxy?.$modal.confirm('是否确认提交编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, StatusEnum.WAIT_RECEIVE);
}

const updateStatus = (id: any, status: string) => {
  proxy?.$modal.loading('加载中...')
  updateSourceFullProcessOrderStatus({id, value: status}).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getList();
    drawer.visible = false;
  }).finally(() => proxy?.$modal.closeLoading());
}

/**保存按钮 */
const handleSave = () => {
  //编辑不修改状态
  save(undefined, '0');
}

/** 提交按钮 */
const handleCommit = async () => {
  if (outSourceOrder.value.quantity > maxQuantity) {
    proxy?.$modal.msgError("数量不能大于"+ maxQuantity);
    return;
  }

  const res = await compareList(outSourceOrder.value);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
  } else {
    await proxy?.$modal.confirm('是否确认提交该数据项？').finally(() => loading.value = false);
  }

  save(undefined, '1');
}

/** 提交按钮 */
const submitForm = async () => {
  save(StatusEnum.WAIT_RECEIVE, '0');
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceFullProcessOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除订单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceFullProcessOrder(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

const checkHandle = (): any => {
  return new Promise((resolve, reject) => {
    proxy?.$modal.confirm('外协数量为0时订单会被直接删除, 请确认！').then(()=>{
      resolve(true)
    }).catch(()=>{
      resolve(false)
    })
  })
}

const handleCancelOustSourceSubmit = async () => {
  cancelOutSourceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {

    let resFlag = true
    //验证
    buttonLoading.value = true;
    await getSourceFullProcessOrder(form.value.id).then(async (res) => {

        let outOrder = res.data;
        if(outOrder){
          outOrder.receiveQuantity = outOrder.receiveQuantity || 0;
          if(form.value.cancelQuantity == (outOrder.quantity-outOrder.receiveQuantity)){
            resFlag = await checkHandle()
          }
        }
        if (res.code != 200) buttonLoading.value = false;
    }).catch(() => { buttonLoading.value = false; })
    if (!resFlag) {
      buttonLoading.value = false;
      return;
    }
      cancelSourceFullProcessOrder(form.value).then(res => {
        proxy?.$modal.msgSuccess("取消外协成功");
        dialog.visible = false;
        getList();
      }).finally(() => { buttonLoading.value = false; });

    }
  });
}
/** 取消外协按钮操作 */
const handleCancelOutSource = async (row?: SourceFullProcessOrderVO) => {
  form.value.id = row?.id;
  form.value.quantity = row?.quantity;
  form.value.receiveQuantity = row?.receiveQuantity;
  form.value.backQuantity = row?.backQuantity;
  form.value.cancelQuantity = undefined;
  if (form.value.backQuantity == undefined) {
    form.value.backQuantity = 0;
  }
  if (form.value.receiveQuantity == undefined) {
    form.value.receiveQuantity = 0;
  }

  dialog.visible = true;
  dialog.title = "取消外协";
  // const _ids = row?.id || ids.value;
  // await proxy?.$modal.confirm('是否确认删除订单外协订单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  // await delSourceFullProcessOrder(_ids);
  // proxy?.$modal.msgSuccess("删除成功");
  // await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceFullProcessOrder/export', {
    ...queryParams.value
  }, `sourceFullProcessOrder_${new Date().getTime()}.xlsx`)
}

/** 查询操作记录 */
const handleRecord = async (id: any) => {
  recordVisible.value = true;
  recordId.value = id;
}

/** 附件上传 */
const handleUpload = async (row: any) => {
  uploadVisible.value = true;
  fileId.value = row.id;
  bizCode.value = row.code;
}
const statement = reactive<any>({
  visible: false,
  title: '',
  describe: '',
});
const detailOrderFormRef = ref<ElFormInstance>();

/** 结单按钮 */
const handleStatement = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.commodityCode = row?.commodityCode;
  statement.visible = true;
}

/** 结单 */
const statementAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      var commodityCode = detailForm.value.commodityCode;
      detailForm.value.detailStatus = '3';
      await proxy?.$modal.confirm('是否确认产品编号为"' + commodityCode + '"的数据项结单？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await outSourceStatementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await radioTableHandle();
    }
  });
}

/** 取消按钮 */
const handleCancel = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.code = row?.code;
  statement.title = '申请取消';
  statement.describe = '取消备注';
  statement.visible = true;
}

/** 取消单据 */
const cancelAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      detailForm.value.status = '4';
      detailForm.value.confirmStatus = '2';
      await proxy?.$modal.confirm('是否确认取消订单号为"' + detailForm.value.code + '"的数据项？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await outSourceCancelOrder(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getConfirmList();
    }
  });
}

onMounted(() => {
  radioTableHandle();
  getDictOptions();
});
</script>

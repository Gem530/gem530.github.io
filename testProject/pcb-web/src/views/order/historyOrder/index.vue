<template>
  <div class="p-2 xtable-page">

    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-click="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="历史订单" name="历史订单">
          <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
            :leave-active-class="proxy?.animate.searchAnimate.leave">
            <div class="historySearch" v-show="showSearch">
              <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="100px" class="demo-form-inline">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="下单时间" prop="cusId">
                      <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                        v-model="queryParams.placeOrderTimeStart" type="datetime" placeholder="选择开始时间"
                        value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                      <span style="width: 10px;margin-left: 5px">-</span>
                      <el-date-picker style="width: calc((100% - 15px)/2)" size="small"
                        v-model="queryParams.placeOrderTimeEnd" type="datetime" placeholder="选择结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="产品名称" prop="commodityName">
                      <el-input v-model="queryParams.commodityName" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="物料编码" prop="materialNumber">
                      <el-input v-model="queryParams.materialNumber" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="下单客户" prop="cusId">
                      <el-select v-model="queryParams.customerIdList" placeholder="请选择客户" multiple filterable clearable
                        collapse-tags>
                        <el-option v-for="item in customerList" :key="item.id"
                          :label="item.customerCode + '-' + item.customerName" :value="item.id">
                          <span style="float: left">{{ item.customerCode }}</span>
                          <span style="float: right;padding-left: 20px;">{{ item.customerName }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-radio-group size="small" v-model="queryParams.finishType" type="vertical" @change="handleQuery"
                      style="vertical-align: middle; padding-left: 15px; float: right">
                      <el-radio-button label="1">全部</el-radio-button>
                      <el-radio-button label="2">未完成</el-radio-button>
                      <el-radio-button label="3">已完成</el-radio-button>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="销售单号" prop="code">
                      <el-input v-model="queryParams.code" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="业务员" prop="cusExchangeRate">
                      <el-select v-model="queryParams.cusSaleUserName" clearable :collapse-tags="true" filterable
                        placeholder="请选择业务员">
                        <el-option v-for="item in salerOptions" :key="item.userId" :label="item.nickName"
                          :value="item.nickName" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="客户PO" prop="customerPo">
                      <el-input v-model="queryParams.customerPo" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="产品编码" prop="commodityCode">
                      <el-input v-model="queryParams.commodityCode" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-row>
                      <el-col :span="8">
                        <div style="padding-left: 15px">
                          <el-button type="primary" @click="handleQuery">搜索</el-button>
                          <el-button @click="resetQuery">重置</el-button>
                        </div>
                      </el-col>
                      <!-- <el-col :span="16">
                      <el-button @click="exportExcelBefore" style="float: right">导出</el-button>
                    </el-col> -->
                    </el-row>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </transition>
          <ETable style="height: 100%;" :showRefresh="true" ref="detailListTable" idField="id" border :lazy="true"
            :pagination="true" toolId="mainHistoryOrderTableToolId" pagePosition="bottom" class="history-page-table"
            :footerData="footerData" :showFooter="true" :total="total" :data="orderList" :loading="loading"
            :columnList="columnList" :intervalCondition="['placeOrderTime', 'dispatchTime', 'deliveryTime']"
            :pageNumber="queryParams.pageNum" :pageSize="queryParams.pageSize" :rowCss="setRowStyle" @rowClick="rowClick"
            @rowContextMenu="rowContextMenu" @searchChange="searchChange">
            <template #default-status="{ row }">
              <el-tag :type="row.status == '1' ? 'info' : ''">{{ statusOptions.find(v => v.value == row.status)?.label
              }}</el-tag>
            </template>
            <template #default-flowStatus="{ row }">
              <el-tag :type="row.flowStatus == '1' ? 'info' :
                ['2', '21', '22', '23', '24'].includes(row.flowStatus) ? '' :
                  row.flowStatus == '3' ? 'danger' :
                    row.flowStatus == '8' ? 'warning' : 'success'">{{ flowStatusOptions.find(v => v.value ==
        row.flowStatus)?.label }}</el-tag>
            </template>
            <template #default-urgent="{ row }">
              <el-tag :type="row.urgent == '正常' ? 'success' : 'warring'">{{ resDictData?.order_urgent.find(v =>
                v.dictValue == row.urgent)?.dictLabel }}</el-tag>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{ dateFormat(row.placeOrderTime) }}</div>
            </template>
            <template #default-dispatchTime="{ row }">
              <div>{{ dateFormat(row.dispatchTime) }}</div>
            </template>
            <template #default-deliveryTime="{ row }">
              <div>{{ dateFormat(row.deliveryTime) }}</div>
            </template>
            <template #default-orderType="{ row }">
              <el-tag :type="row.orderType == '1' ? '' :
                row.orderType == '2' ? 'success' : row.orderType == '3' ? 'warning' : 'info'">{{
    resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</el-tag>
            </template>
            <template #default-model="{ row }">
              <el-tag :type="row.model == '1' ? '' : 'success'">{{ resDictData?.order_model.find(v => v.dictValue ==
                row.model)?.dictLabel }}</el-tag>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-cusIsTaxRate="{ row }">
              <span v-if="row.cusIsTaxRate == 0">否</span>
              <span v-if="row.cusIsTaxRate == 1">是</span>
            </template>
            <template #default-cusCurrency="{ row }">
              <div>{{ resDictData?.currency_type.find(v => v.dictValue == row.cusCurrency)?.dictLabel }}</div>
            </template>
            <template #default-deliveryMethod="{ row }">
              <span>自动</span>
            </template>
          </ETable>
          <!-- 右键菜单 -->
          <div class="context-box" ref="contextBoxRef" v-click-outside="clickOutside">
            <div class="context-box-list" v-for="(list, listIndex) in menuConfig?.body?.options" :key="listIndex">
              <template v-for="(item, index) in list" :key="index">
                <div class="context-box-menu pointer" v-if="item.visible"
                  @click="contextMenuClickEvent({ menu: item, row: currentContext, column: true } as any)">
                  <vxe-icon :name="item.prefixIcon?.substring(9)"></vxe-icon>
                  <span class="context-box-name">{{ item.name }}</span>
                </div>
              </template>
            </div>
          </div>
          <!--详情预览-->
          <el-drawer v-model="drawer.visible" :title="drawer.title" size="850px" :direction="drawer.direction"
            :destroy-on-close="true" modal-class="detail-prod-drawder">
            <SaleDescriptions v-if="currentInfo" :currentInfo="currentInfo" :customerList="customerList"
              :resDictData="resDictData" :quotationShow="quotationShow" :orderEtrShow="orderEtrShow"></SaleDescriptions>
          </el-drawer>

        </el-tab-pane>
        <el-tab-pane label="订单完结列表" name="订单完结列表">
          <el-row style="width:100%;margin-bottom: 5px;">
            <el-col :span="24" style="display: flex;justify-content:end">
              <el-button plain @click="handleExport">导出已完结订单</el-button>
            </el-col>
          </el-row>
          <XTable toolId="historyCompleteListTool" v-model:page-size="completeQueryParams.pageSize" :loading="loading2"
            v-model:current-page="completeQueryParams.pageNum" height="100%" class="xtable-content" :showRefresh="true"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total2 }"
            :data="deliveryRecordList" :columnList="columnList2" ref="XTableRef" border
            @searchChange="completeSearchChange" :checkbox-config="{ showHeader: false, reserve: true }"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-make="scope">
              <!-- checkPermi(['order:historySaleOrder:finishComplete'])&& -->
              <el-button link type="primary" v-if="checkPermi(['order:historySaleOrder:finishComplete'])&&scope.row.isHandFinish == '1'"
                @click="completeAudit(scope.row)">审核</el-button>
                <!-- checkPermi(['order:historySaleOrder:submitComplete'])&& -->
              <el-button link type="primary" v-if="checkPermi(['order:historySaleOrder:submitComplete'])&&scope.row.isHandFinish == '2'"
                @click="completeSubmit(scope.row)">提交</el-button>
                <!-- checkPermi(['order:historySaleOrder:cancelComplete'])&& -->
              <el-button link type="primary" v-if="checkPermi(['order:historySaleOrder:cancelComplete'])&&scope.row.isHandFinish == '2'"
                @click="completeCancel(scope.row)">取消完结</el-button>
            </template>
            <template #default-isHandFinish="{ row }">
              <el-tag :type="row.isHandFinish == '3' ? 'info' : ''">{{ auditStatusOptions.find(v => v.value ==
                row.isHandFinish)?.label }}</el-tag>
            </template>
            <template #default-status="{ row }">
              <el-tag :type="row.status == '1' ? 'info' : ''">{{ statusOptions.find(v => v.value == row.status)?.label
              }}</el-tag>
            </template>
            <template #default-flowStatus="{ row }">
              <el-tag :type="row.flowStatus == '1' ? 'info' :
                ['2', '21', '22', '23', '24'].includes(row.flowStatus) ? '' :
                  row.flowStatus == '3' ? 'danger' :
                    row.flowStatus == '8' ? 'warning' : 'success'">{{ flowStatusOptions.find(v => v.value ==
        row.flowStatus)?.label }}</el-tag>
            </template>
            <template #default-urgent="{ row }">
              <el-tag :type="row.urgent == '正常' ? 'success' : 'warring'">{{ resDictData?.order_urgent.find(v =>
                v.dictValue == row.urgent)?.dictLabel }}</el-tag>
            </template>
            <template #default-placeOrderTime="{ row }">
              <div>{{ dateFormat(row.placeOrderTime) }}</div>
            </template>
            <template #default-dispatchTime="{ row }">
              <div>{{ dateFormat(row.dispatchTime) }}</div>
            </template>
            <template #default-deliveryTime="{ row }">
              <div>{{ dateFormat(row.deliveryTime) }}</div>
            </template>
            <template #default-orderType="{ row }">
              <el-tag :type="row.orderType == '1' ? '' :
                row.orderType == '2' ? 'success' : row.orderType == '3' ? 'warning' : 'info'">{{
    resDictData?.order_type.find(v => v.dictValue == row.orderType)?.dictLabel }}</el-tag>
            </template>
            <template #default-model="{ row }">
              <el-tag :type="row.model == '1' ? '' : 'success'">{{ resDictData?.order_model.find(v => v.dictValue ==
                row.model)?.dictLabel }}</el-tag>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-cusIsTaxRate="{ row }">
              <span v-if="row.cusIsTaxRate == 0">否</span>
              <span v-if="row.cusIsTaxRate == 1">是</span>
            </template>
            <template #default-cusCurrency="{ row }">
              <div>{{ resDictData?.currency_type.find(v => v.dictValue == row.cusCurrency)?.dictLabel }}</div>
            </template>
            <template #default-deliveryMethod="{ row }">
              <span>自动</span>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>




    <el-dialog v-model="dialogCotractUpload.visible" title="合同回签查看上传" center width="60%" draggable>
      <el-form>
        <el-col :span="24" style="margin-bottom: 5px;">
          <XUpload v-model:model-value="formInline.quotationFileList" model="download"></XUpload>
        </el-col>
        <el-col :span="24" style="margin-bottom: 5px;">
          <XTable ref="popFileRef" :data="popoverFileList.filter((v: any) => v.delFlag == 0)" border
            :columnList="quotionFileList" :pageShow="false">
            <template #default-make="{ row }">
              <el-button link type="primary" @click="deletequotationEvent(row)">删除</el-button>
              <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
            </template>
          </XTable>
        </el-col>
        <div class="text-center" style="margin-top: 5px;">
          <el-button @click="cancelCotractUpload">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitFormUpload">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-model="dialogCotractCompleted.visible" title="已完成订单信息修改" center width="60%">
      <el-form ref="auditOrderFormRef" :model="formInline" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item width="80" label="客户PO" prop="customerPo">
              <el-input v-model="formInline.customerPo" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item width="120" label="客户物料编码" prop="materialNumber">
              <el-input v-model="formInline.materialNumber" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item width="120" label="客户物料名称" prop="materialName">
              <el-input v-model="formInline.materialName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item width="120" label="市场备注" prop="remark">
              <el-input type="textarea" v-model="formInline.remark" :maxlength="1000"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 5px;">
            <XUpload v-model:model-value="formInline.quotationFileList" model="download"></XUpload>
          </el-col>
          <el-col :span="24" style="margin-bottom: 5px;">
            <XTable ref="popFileRef" :data="popoverFileList.filter((v: any) => v.delFlag == 0)" border
              :columnList="quotionFileList" :pageShow="false">
              <template #default-make="{ row }">
                <el-button link type="primar" @click="deletequotationEvent(row)">删除</el-button>
                <el-button link type="primar" @click="downLoadHandle(row.key)">下载</el-button>
              </template>
            </XTable>
          </el-col>
        </el-row>
        <div class="text-center" style="margin-top: 5px;">
          <el-button @click="cancelCotractCompleted">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitFormComplete">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>


    <el-dialog v-model="exportVisible" title="导出提示" width="20%" align-center destroy-on-close>
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="auditDialogFormVisible.visible" title="审核意见" width="500" center>
      <el-form :model="auditForm" :rules="auditRules" ref="auditFormRef">
        <el-form-item label="审核备注：" label-width="100" prop="auditDialogRemark">
          <el-input type="textarea" v-model="auditForm.auditDialogRemark" :maxlength="500" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="auditDialogFormVisible.visible = false">取消</el-button>
          <el-button type="danger" @click="rejectAudit">驳回</el-button>
          <el-button type="primary" @click="passAudit">通过</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="HistoryOrder" lang="ts">
import fileSaver from "file-saver";
import ETable from '@/components/Etable/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import {
  addOrder,
  delOrder,
  getOrder,
  listOrder,
  listPostOrder,
  listCompletePostOrder,
  exportListOrder,
  saveOutSourceOrder,
  updateOrder,
  updateOrderAndUpload, updateOrderComplete, totalAmount,
  submitFinishedOrder, cancelFinishedOrder, rejectFinishedOrder,
  finishedOrder
} from '@/api/order/directOrder';
import { OrderForm, OrderQuery, OrderVO } from '@/api/order/directOrder/types';
import { computed, ref } from "vue";
import dayjs from "dayjs";
import { VxeTableEvents, VxeTablePropTypes } from "vxe-table";
import { CustomerVO } from "@/api/basedata/customer/types";
import { getListCustomer } from "@/api/basedata/customer";
import { UserVO } from "@/api/system/user/types";
import { getDicts } from "@/api/system/dict/data";
import { listUserByRoleKey } from "@/api/system/user";
import { useRouter } from 'vue-router'
import { sortBy } from "@/utils/dict";
import { downloadUrl, listContractFiles } from "@/api/upload";
import { deepClone } from "@/utils";
import { getQuotation } from "@/api/order/quotation";
import { getReportUrl } from "@/utils/report";
import { checkPermi } from "@/utils/permission";

const auditFormRef = ref();
const total2 = ref(0);
const loading2 = ref(true);
const intervalCondition = ['placeOrderTime', 'dispatchTime', 'deliveryTime','handFinishAuditTime'];
/**
 * 销售下单文件
 */
const exportVisible = ref(false);
const popoverFileList = ref<any[]>([]);
const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
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
  customerPo: undefined,
  materialNumber: undefined,
  materialName: undefined,
  remark: undefined,
  quotationFileList: [],
  popoverFileList: [],
});

/*外协提交*/
const submitOtherCost = () => {
  costRef.value.submitOtherCost((data: any) => {
    console.log('data', data)
    console.log(currentInfo.value)
    currentInfo.value.outSourceOrderInfo = data;
    currentInfo.value.outSourceOtherCostList = data.otherCostList
    saveOutSourceOrder(currentInfo.value).then(res => {
      if (res.code == 200) {
        outsourceDialog.visible = false;
        ElMessage({ type: 'success', message: '操作成功' })
        getList();
      }
    })
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
  title: '已完成订单信息修改'
});

const drawer = reactive<DrawerOption>({
  visible: false,
  title: "",
  direction: "rtl"
});

const dateFormat = (cellValue: any) => {
  return dayjs(cellValue).format("YYYY-MM-DD")
}

const statusOptions = ref([
  { value: "1", label: "未审核" },
  { value: "2", label: "已审核" },
  { value: "3", label: "撤回" }
])

const flowStatusOptions = ref([
  { value: "1", label: "待处理" },
  { value: "2", label: "MI制作" },
  { value: "21", label: "MI制作" },
  { value: "22", label: "MI制作" },
  { value: "23", label: "MI制作" },
  { value: "24", label: "MI制作" },
  { value: "3", label: "订单预投" },
  { value: "4", label: "生产投料" },
  { value: "5", label: "生产中" },
  { value: "6", label: "已完成" },
  { value: "7", label: "外协完成" },
  { value: "8", label: "外协" },

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
  order_flow_status: [],
  //测试架
  order_test_frame: [],
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
  testFrame: undefined,
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
  quotationFileList: [],
  otherCostList: [],
}
const initQueryParams: any = {
  pageNum: 1,
  pageSize: 50,
  isAsc: "desc,desc",
  orderByColumn: "placeOrderTime,code",
  finishType: '1',
  placeOrderTimeStart: undefined,
  placeOrderTimeEnd: undefined,
  commodityName: undefined,
  materialNumber: undefined,
  cusId: undefined,
  cusSaleUserName: undefined,
  code: undefined,
  cusExchangeRate: undefined,
  customerPo: undefined,
  commodityCode: undefined,
  customerIdList: undefined
}

const initFormData2: any = {
  id: undefined,
  auditDialogRemark: undefined,
}

const initQueryParams2: any = {
  pageNum: 1,
  pageSize: 50,
  isAsc: "desc,desc,desc",
  orderByColumn: "handFinishAuditTime,placeOrderTime,code",
  finishType: '1',
  // placeOrderTimeStart: undefined,
  // placeOrderTimeEnd: undefined,
  // commodityName: undefined,
  // materialNumber: undefined,
  // cusId: undefined,
  // cusSaleUserName: undefined,
  // code: undefined,
  // cusExchangeRate: undefined,
  // customerPo: undefined,
  // commodityCode: undefined,
  // customerIdList: undefined,
  // auditDialogRemark: undefined
}
const data = reactive<PageData<OrderForm, OrderQuery>>({
  form: { ...initFormData },
  queryParams: { ...initQueryParams },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "订单编号不能为空", trigger: "blur" }
    ],
    placeOrderTime: [
      { required: true, message: "下单时间不能为空", trigger: "blur" }
    ],
    cusId: [
      { required: true, message: "客户ID不能为空", trigger: "blur" }
    ],
    cusPrincipal: [
      { required: true, message: "负责人不能为空", trigger: "blur" }
    ],
    cusIsTaxRate: [
      { required: true, message: "客户是否含税(0-不含，1-含)不能为空", trigger: "blur" }
    ],
    commodityName: [
      { required: true, message: "产品名称不能为空", trigger: "blur" }
    ],
    commodityType: [
      { required: true, message: "产品类型不能为空", trigger: "change" }
    ],
    commodityId: [
      { required: true, message: "产品id不能为空", trigger: "blur" }
    ],
    commodityCode: [
      { required: true, message: "产品编码不能为空", trigger: "blur" }
    ],
    surfaceTreatment: [
      { required: true, message: "表面处理不能为空", trigger: "blur" }
    ],
    model: [
      { required: true, message: "批量/样品不能为空", trigger: "blur" }
    ],
    materialLayer: [
      { required: true, message: "板层不能为空", trigger: "blur" }
    ],
    serialNumber: [
      { required: true, message: "流水号不能为空", trigger: "blur" }
    ],
    materialQuality: [
      { required: true, message: "板材不能为空", trigger: "blur" }
    ],
    singleWidth: [
      { required: true, message: "单片宽不能为空", trigger: "blur" }
    ],
    singleLength: [
      { required: true, message: "单片长不能为空", trigger: "blur" }
    ],
    unitedWidth: [
      { required: true, message: "联片宽不能为空", trigger: "blur" }
    ],
    unitedLength: [
      { required: true, message: "联片长不能为空", trigger: "blur" }
    ],
    unitedNumber: [
      { required: true, message: "联片数量不能为空", trigger: "blur" }
    ],
    unitedWayLength: [
      { required: true, message: "联片方式长不能为空", trigger: "blur" }
    ],
    unitedWayWidth: [
      { required: true, message: "联片方式宽不能为空", trigger: "blur" }
    ],
    commoditySolder: [
      { required: true, message: "阻焊颜色不能为空", trigger: "blur" }
    ],
    characterColor: [
      { required: true, message: "字符颜色不能为空", trigger: "blur" }
    ],
    commodityForm: [
      { required: true, message: "成形方式不能为空", trigger: "blur" }
    ],
    commodityTestWay: [
      { required: true, message: "测试方式不能为空", trigger: "blur" }
    ],
    deliveryTime: [
      { required: true, message: "客户交期不能为空", trigger: "blur" }
    ],
    dispatchTime: [
      { required: true, message: "发货日期不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "订单数量不能为空", trigger: "blur" }
    ],
    urgent: [
      { required: true, message: "加急不能为空", trigger: "blur" }
    ],
    area: [
      { required: true, message: "面积不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    areaPrice: [
      { required: true, message: "平米价不能为空", trigger: "blur" }
    ],
    orderType: [
      { required: true, message: "订单类型不能为空", trigger: "change" }
    ],
    totalPrice: [
      { required: true, message: "含税总价不能为空", trigger: "blur" }
    ],
    totalOrderPrice: [
      { required: true, message: "不含税总价不能为空", trigger: "blur" }
    ],
    tax: [
      { required: true, message: "税金不能为空", trigger: "blur" }
    ],
    engineeringCost: [
      { required: true, message: "工程费不能为空", trigger: "blur" }
    ],
    testFrameCost: [
      { required: true, message: "测试架费不能为空", trigger: "blur" }
    ],
    flyProbeCost: [
      { required: true, message: "飞针费不能为空", trigger: "blur" }
    ],
    mouldCost: [
      { required: true, message: "模具费不能为空", trigger: "blur" }
    ],
    expeditedCost: [
      { required: true, message: "加急费不能为空", trigger: "blur" }
    ],
    otherCost: [
      { required: true, message: "其他费不能为空", trigger: "blur" }
    ],
    sampleCost: [
      { required: true, message: "样板费不能为空", trigger: "blur" }
    ],
    flowStatus: [
      { required: true, message: "流程状态不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "订单状态不能为空", trigger: "change" }
    ],
    commodityThickness: [
      { required: true, message: "成品板厚不能为空", trigger: "blur" }
    ],
    cusSaleUserName: [
      { required: true, message: "业务员名称不能为空", trigger: "blur" }
    ],
    submitUserName: [
      { required: true, message: "提交人名称不能为空", trigger: "blur" }
    ],
    auditUserName: [
      { required: true, message: "审核人名称不能为空", trigger: "blur" }
    ],
    createDeptName: [
      { required: true, message: "创建部门名称不能为空", trigger: "blur" }
    ],
    createByName: [
      { required: true, message: "创建者名称不能为空", trigger: "blur" }
    ],
    updateByName: [
      { required: true, message: "更新者名称不能为空", trigger: "blur" }
    ],
    cusName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ]
  }
});
const completeData = reactive<PageData<OrderForm, OrderQuery>>({
  form: { ...initFormData2 },
  queryParams: { ...initQueryParams2 },
  rules: {
    auditDialogRemark: [
      { required: true, message: "审核意见不能为空", trigger: "blur" }
    ]
  }
});
const { queryParams, form, rules } = toRefs(data);
const { queryParams: completeQueryParams, form: auditForm, rules: auditRules } = toRefs(completeData);


const sumNum = (list: OrderVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    count += Number(item[field]);
  });
  return Number(count.toFixed(4));
};

const footerMethod: VxeTablePropTypes.FooterMethod<OrderVO> = ({ columns, data }) => {
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
const rowSpanMethod = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data }: any) => {
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
          mergeCells.push({ row: rowIndex, col, rowspan: countRowspan, colspan: 1 });
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

const menuConfig = reactive<VxeTablePropTypes.MenuConfig<OrderVO>>({
  body: {
    options: [
      [
        { code: 'details', name: '详情', prefixIcon: 'vxe-icon-link', visible: true, disabled: false },
      ],
      [
        { code: 'finished', name: '产品已完成', prefixIcon: 'vxe-icon-check', visible: true, disabled: false },
      ],
    ]
  },
  visibleMethod({ options, column, row }) {
    options.forEach(list => {
      list.forEach(item => {
        item.disabled = false
        if (column) {
          //查看报价单信息
          if (item.code === 'details') {
            if (row.flowStatus == '1') {
              item.visible = false
            } else {
              item.visible = true
            }
          }
          if (item.code === 'stop' || item.code === 'rollback' || item.code === 'finished') {
            if (row.flowStatus == '6' || row.flowStatus == '7') {
              item.visible = false
            } else {
              item.visible = true
            }
            if (item.code === 'stop' && row.suspendFlag == '1') {
              item.visible = false
            }
            if(!checkPermi(['order:historySaleOrder:submitComplete'])){
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

const setRowStyle = (row: any) => {
  if ('3' == row.status) {
    return {
      backgroundColor: 'rgb(236,176,177)',
    }
  }
  if ('1' == row.suspendFlag) {
    return {
      backgroundColor: 'rgb(250, 236, 216)',
    }
  } else if (row?.isSelected) {
    return {
      backgroundColor: '#e6f7ff',
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
  // queryParams.value = deepClone(initQueryParams);
  initTableSearch()
  Object.keys(params).forEach(key => {
    if (key == 'flowStatus') {
      queryParams.value['flowStatusList'] = params[key];
    } else if (params[key] !== null && params[key] !== undefined) {
      queryParams.value[key] = params[key];
    }
  });
  queryParams.value['flowStatus'] = undefined

  queryParams.value.customerCodeList = queryParams.value.customerCode;
  queryParams.value.customerCode = undefined;

  getList();
  getTotalAmount()
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
const deletequotationEvent = (row: any) => {
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
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '文件名', field: 'name', align: 'center', minWidth: '200' },
  { title: '上传人', field: 'updateByName', align: 'center', width: '70' },
  { title: '文件大小', field: 'size', align: 'center', width: '80' },
  { title: '上传时间', field: 'createTime', align: 'center', width: '120' },
  { title: '操作', field: 'make', align: 'center', width: '120' },
])
const customerCodeList = ref();
const columnList = ref([
  { title: "序号", field: 'index', type: 'seq', align: 'center', width: '40' },
  {
    width: '60', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'checkboxSearch', filterData: () => customerCodeList.value
  },
  {
    width: '60', title: '订单状态', field: 'status', align: 'center', filterType: 'radioButton',
    filterParam: { placeholder: '请输入订单状态' }, filterData: () => statusOptions.value
  },
  {
    width: '60', title: '合同状态', field: 'flowStatus', align: 'center', filterType: 'checkboxButton',
    filterParam: { placeholder: '请输入合同状态' }, filterData: () => [...resDictData.value.order_flow_status],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '50', title: '加急', field: 'urgent', align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请输入加急' },
    filterData: () => [...resDictData.value.order_urgent], filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '100', title: '下单日期', field: 'placeOrderTime', align: 'center',
  },
  {
    width: '100', title: '交货日期', field: 'dispatchTime', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    width: '60', title: '新/返', field: 'orderType',
    align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请输入新/返' },
    filterData: () => [...resDictData.value.order_type], filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '80', title: '批量/样品', field: 'model', align: 'center',
    filterType: 'radioButton', filterParam: { placeholder: '请输入批量/样品' },
    filterData: () => [...resDictData.value.order_model],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '120', title: '客户PO', field: 'customerPo', align: 'center',
  },
  {
    width: '120', title: '产品名称', field: 'commodityName', align: 'center',
  },
  {
    width: '120', title: '产品编码', field: 'commodityCode', align: 'center',
  },
  {
    width: '110', title: '客户物料编码', field: 'materialNumber', align: 'center',
  },
  {
    width: '60', title: '数量(pcs)', field: 'quantity', align: 'center',
  },
  {
    width: '60', title: '面积(㎡)', field: 'area', align: 'center',
  },
  {
    width: '60', title: '板材', field: 'materialQuality', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入板材' },
    filterData: () => [...resDictData.value.order_material_quality],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }

  },
  {
    width: '60', title: '成品板厚', field: 'commodityThickness', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入成品板厚' },
    filterData: () => [...resDictData.value.finish_plate_thickness],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '60', title: '层数', field: 'materialLayer', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入层数' },
  },
  {
    width: '60', title: '内层铜厚', field: 'materialCopperInside', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入内层铜厚' },
    filterData: () => [...resDictData.value.order_material_copperinside],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '60', title: '外层铜厚', field: 'materialCopperOutside', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入外层铜厚' },
    filterData: () => [...resDictData.value.order_material_copperoutside],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '90', title: '表面处理', field: 'surfaceTreatment', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入表面处理' },
    filterData: () => [...resDictData.value.order_surface_treatment],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '90', title: '阻焊颜色', field: 'commoditySolder', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入阻焊颜色' },
    filterData: () => [...resDictData.value.order_commodity_solder],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '90', title: '字符', field: 'characterColor', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入字符' },
    filterData: () => [...resDictData.value.order_character],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '65', title: 'SET长', field: 'unitedLength', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入SET长', type: 'number' },
  },
  {
    width: '65', title: 'SET宽', field: 'unitedWidth', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入SET宽', type: 'number' }
  },
  {
    width: '90', title: '联片数量', field: 'unitedNumber', align: 'center',
  },
  {
    width: '90', title: '单位', align: 'center', field: "unit",
  },
  {
    width: '90', title: '合同编号', field: 'code', align: 'center',
  },
  {
    width: '60', title: '外协数量(pcs)', field: 'outSourceQuantity', align: 'center',
  },
  {
    width: '60', title: '排产总量(pcs)', field: 'productionQuantity', align: 'center',
  },
  {
    width: '60', title: '待入库(pcs)', field: 'waitInventoryQuantity', align: 'center', filterType: 'input'
  },
  {
    width: '60', title: '生产入库(pcs)', field: 'productionInventoryQuantity', align: 'center',
  },
  {
    width: '60', title: '外协入库(pcs)', field: 'outSourceInventoryQuantity', align: 'center',
  },
  {
    width: "60", title: "总库存(pcs)", field: 'commodityInventoryQuantity', align: "center",
  },
  {
    width: '60', title: '订单发货(pcs)', field: 'deliveryQuantity', align: 'center',
  },
  {
    width: '60', title: '退货重发(pcs)', field: 'reDeliveryQuantity', align: 'center',
  },
  {
    width: '60', title: '退货数量(pcs)', field: 'alreadyReturnQuantity', align: 'center',
  },
  {
    width: '60', title: '合同差数(pcs)', field: 'differentQuantity', align: 'center',
  },
  {
    width: '60', title: '差数面积(㎡)', field: 'differentArea', align: 'center'
  },
  {
    width: '65', title: '版本号', field: 'version', align: 'center',
  },
  {
    width: '90', title: '包装要求', field: 'packRequirement', align: 'center',
  },
  {
    width: '90', title: '发货方式', field: "deliveryMethod", align: 'center',
  },
  {
    width: '90', title: '运输方式', field: 'cusTransStyle', align: 'center',
  },
  {
    width: '90', title: '板材品牌', field: 'materialBrand', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入板材品牌' }
  },
  {
    width: '90', title: '板材级别', field: 'materialLevel', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入板材级别' }
  },
  {
    width: '90', title: '阻焊面数', field: 'commoditySolderCount', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入阻焊面数' }
  },
  {
    width: '90', title: '金厚(u\'\')', field: 'goldenThickness', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入金厚(u\'\')' }
  },
  {
    width: '90', title: '阻焊光泽', field: 'commoditySolderGloss', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入阻焊光泽' }
  },
  {
    width: '90', title: '阻焊要求', field: 'commoditySolderRequirement',
    align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入阻焊要求' }
  },
  {
    width: '90', title: '孔铜厚', field: 'poreCopper', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入孔铜厚' }
  },
  {
    width: '90', title: '字符面数', field: 'characterCount', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入字符面数' }
  },
  {
    width: '90', title: '成形方式', field: 'commodityForm', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入成形方式' }
  },
  {
    width: '90', title: '字符要求', field: 'characterRequirement', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入字符要求' }
  },
  {
    width: '90', title: 'SET打叉', field: 'setCross', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入SET打叉' }
  },
  {
    width: '90', title: '板翘曲度', field: 'warpagePlate', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入板翘曲度' }
  },
  {
    width: '90', title: '测试方式', field: 'commodityTestWay', align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入测试方式' }
  },
  {
    width: '90', title: '测试点', field: 'testPoint', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入测试点' }
  },
  {
    width: '90', title: '备品数量', field: 'spareQuantity', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入备品数量' }
  },
  {
    width: '90', title: '铜箔', field: 'copperFoil', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入铜箔' }
  },
  {
    width: '90', title: 'V-CUT', field: 'vCut', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入V-CUT' }
  },
  {
    width: '90', title: '过孔要求', field: 'holeRequirement', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入过孔要求' }
  },
  {
    width: '90', title: '检验标准', field: 'inspectionStandard', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入检验标准' }
  },
  {
    width: '90', title: '金面积', field: 'goldArea', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入金面积' }
  },
  {
    width: '90', title: '外形要求', field: 'appearanceRequirements', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入外形要求' }
  },
  { width: '90', title: 'PP', field: 'pp', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入PP' } },
  {
    width: '90', title: '镍厚', field: 'nickelThickness', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入镍厚' }
  },
  {
    width: '90', title: '锡厚', field: 'tinThickness', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入锡厚' }
  },
  {
    width: '110', title: '客户物料名称', field: 'materialName', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入客户物料名称' }
  },
  {
    width: '110', title: '订单特殊要求', field: 'specialRequirement', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入订单特殊要求' }
  },
  {
    width: '90', title: '最小线宽', field: 'minLineWidth', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入最小线宽' }
  },
  {
    width: '90', title: '最小线距', field: 'minLineSpace', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入最小线距' }
  },
  {
    width: '90', title: '最小孔径', field: 'minAperture', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入最小孔径' }
  },
  {
    width: '90', title: '总孔数', field: 'holeCount', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入总孔数' }
  },
  {
    width: '90', title: '孔密度', field: 'holeDensity', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入孔密度' }
  },
  {
    width: '90', title: '模具费', field: 'mouldCost', align: 'center',
  },
  {
    width: '90', title: '测试架费', field: 'testFrameCost', align: 'center',
  },
  {
    width: '90', title: '飞针费', field: 'flyProbeCost', align: 'center',
  },
  {
    width: '90', title: '工程费', field: 'engineeringCost', align: 'center',
  },
  {
    width: '90', title: '样板费', field: 'sampleCost', align: 'center',
  },
  {
    width: '90', title: '加急费', field: 'expeditedCost', align: 'center',
  },
  {
    width: '90', title: '其他费用', field: 'otherCost', align: 'center',
  },
  { width: '120', title: '市场备注', field: 'remark', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入市场备注' } },
  {
    width: '120', title: '客户备注', field: 'cusRemark', align: 'center',
  },
]);

const auditStatusOptions = ref([
  { value: "1", label: "待审核" },
  { value: "2", label: "审核驳回" },
  { value: "3", label: "审核通过" }
])

const columnList2 = ref([
  { title: "序号", field: 'index', type: 'seq', align: 'center', width: '40' },
  { width: '60', title: '申请状态', field: 'isHandFinish', align: 'center',  filterType: 'radioButton', filterData: () => auditStatusOptions.value},
  { width: '120', title: '完结备注', field: 'finishedRemark', align: 'center', },
  { width: '90', title: '申请人', field: 'handFinishAuditName', align: 'center', filterType: 'input'},
  { width: '90', title: '申请日期', field: 'handFinishAuditTime', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { width: '90', title: '审核意见', field: 'handFinishAuditRemark', align: 'center', },

  {
    width: '60', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'checkboxSearch', filterData: () => customerCodeList.value
  },
  {
    width: '60', title: '订单状态', field: 'status', align: 'center', filterType: 'radioButton',
    filterParam: { placeholder: '请输入订单状态' }, filterData: () => statusOptions.value
  },
  {
    width: '60', title: '合同状态', field: 'flowStatus', align: 'center', filterType: 'checkboxButton',
    filterParam: { placeholder: '请输入合同状态' }, filterData: () => [...resDictData.value.order_flow_status],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '50', title: '加急', field: 'urgent', align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请输入加急' },
    filterData: () => [...resDictData.value.order_urgent], filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '100', title: '下单日期', field: 'placeOrderTime', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    width: '100', title: '交货日期', field: 'dispatchTime', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    width: '60', title: '新/返', field: 'orderType',
    align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请输入新/返' },
    filterData: () => [...resDictData.value.order_type], filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '80', title: '批量/样品', field: 'model', align: 'center',
    filterType: 'radioButton', filterParam: { placeholder: '请输入批量/样品' },
    filterData: () => [...resDictData.value.order_model],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '120', title: '客户PO', field: 'customerPo', align: 'center',filterType: 'input'
  },
  {
    width: '120', title: '产品名称', field: 'commodityName', align: 'center',filterType: 'input'
  },
  {
    width: '120', title: '产品编码', field: 'commodityCode', align: 'center',filterType: 'input'
  },
  {
    width: '110', title: '客户物料编码', field: 'materialNumber', align: 'center',
  },
  {
    width: '60', title: '数量(pcs)', field: 'quantity', align: 'center',
  },
  {
    width: '60', title: '面积(㎡)', field: 'area', align: 'center',
  },
  {
    width: '60', title: '板材', field: 'materialQuality', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入板材' },
    filterData: () => [...resDictData.value.order_material_quality],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }

  },
  {
    width: '60', title: '成品板厚', field: 'commodityThickness', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入成品板厚' },
    filterData: () => [...resDictData.value.finish_plate_thickness],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '60', title: '层数', field: 'materialLayer', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入层数' },
  },
  {
    width: '60', title: '内层铜厚', field: 'materialCopperInside', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入内层铜厚' },
    filterData: () => [...resDictData.value.order_material_copperinside],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '60', title: '外层铜厚', field: 'materialCopperOutside', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入外层铜厚' },
    filterData: () => [...resDictData.value.order_material_copperoutside],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '90', title: '表面处理', field: 'surfaceTreatment', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入表面处理' },
    filterData: () => [...resDictData.value.order_surface_treatment],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '90', title: '阻焊颜色', field: 'commoditySolder', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入阻焊颜色' },
    filterData: () => [...resDictData.value.order_commodity_solder],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '90', title: '字符', field: 'characterColor', align: 'center', filterType: 'select',
    filterParam: { placeholder: '请输入字符' },
    filterData: () => [...resDictData.value.order_character],
    filterCustom: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    width: '65', title: 'SET长', field: 'unitedLength', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入SET长', type: 'number' },
  },
  {
    width: '65', title: 'SET宽', field: 'unitedWidth', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入SET宽', type: 'number' }
  },
  {
    width: '90', title: '联片数量', field: 'unitedNumber', align: 'center',
  },
  {
    width: '90', title: '单位', align: 'center', field: "unit",
  },
  {
    width: '90', title: '合同编号', field: 'code', align: 'center',filterType: 'input'
  },
  {
    width: '60', title: '外协数量(pcs)', field: 'outSourceQuantity', align: 'center',
  },
  {
    width: '60', title: '排产总量(pcs)', field: 'productionQuantity', align: 'center',
  },
  {
    width: '60', title: '待入库(pcs)', field: 'waitInventoryQuantity', align: 'center', filterType: 'input'
  },
  {
    width: '60', title: '生产入库(pcs)', field: 'productionInventoryQuantity', align: 'center',
  },
  {
    width: '60', title: '外协入库(pcs)', field: 'outSourceInventoryQuantity', align: 'center',
  },
  {
    width: "60", title: "总库存(pcs)", field: 'commodityInventoryQuantity', align: "center",
  },
  {
    width: '60', title: '订单发货(pcs)', field: 'deliveryQuantity', align: 'center',
  },
  {
    width: '60', title: '退货重发(pcs)', field: 'reDeliveryQuantity', align: 'center',
  },
  {
    width: '60', title: '退货数量(pcs)', field: 'alreadyReturnQuantity', align: 'center',
  },
  {
    width: '60', title: '合同差数(pcs)', field: 'differentQuantity', align: 'center',
  },
  {
    width: '60', title: '差数面积(㎡)', field: 'differentArea', align: 'center'
  },
  {
    width: '120', title: '操作', field: 'make', align: 'center', fixed: 'right', showOverflow: false
  },
]);
const detailListTable = ref()

// 尾部总计
const footerData = ref([{
  index: '合计',
  area: 0,
  totalPrice: 0,
  totalOrderPrice: 0,
  tax: 0,
  quantity: 0,
}])

/** 查询订单列表 */
const getList = async () => {
  loading.value = true;
  console.log(queryParams.value);
  const res = await listPostOrder(queryParams.value);
  orderList.value = res.rows;

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
  form.value = { ...initFormData };
  orderFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 导出操作 */
const exportExcel = async () => {
  exportVisible.value = false;
  proxy?.download('order/saleOrder/export', {
    ...queryParams.value, tableName: mainTableToolId.value
  }, `销售合同_${new Date().getTime()}.xlsx`);
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.value.placeOrderTimeStart = '';
  queryParams.value.placeOrderTimeEnd = '';
  queryParams.value.cusSaleUserId = '';
  queryParams.value.customerIdList = undefined;
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
  params.quotationFileList.value = [];
  proxy?.$modal.msgSuccess("修改成功");
  dialogCotractUpload.visible = false;
  getList();
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
  updateOrderComplete(params).finally(() => buttonLoading.value = false);
  params.quotationFileList.value = [];
  proxy?.$modal.msgSuccess("修改成功");
  dialogCotractCompleted.visible = false;
  queryParams.value.pageNum = 1;
  getList();
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
}

/** 导出按钮操作 */
const handleExport = () => {
  let tool_tableName = 'historyCompleteListTool';
  let queryInfo = {};
  queryInfo = { ...completeQueryParams.value, tableName: tool_tableName }
  proxy?.download('/order/saleOrder/exportHistoryComplete', queryInfo, `已完结订单_${new Date().getTime()}.xlsx`)
}

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
const getListCust = async () => {
  const custRes = await getListCustomer();
  const resCust = custRes.data;
  if (resCust) {
    customerCodeList.value = resCust.map(item => { return { value: item.id, label: item.customerCode } });
  }
}

const radioTable = ref('历史订单');
const orderEtrShow = ref(false);
const deliveryRecordList = ref<any[]>([]);
const auditDialogFormVisible = reactive<DialogOption>({ visible: false, title: '完结审核' });
// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;

  if (radioTable.value == "历史订单") {
    await getList();
  } else if (radioTable.value == "订单完结列表") {
    await getCompleteList();
  }

}
/** 查询已完成记录列表 */
const getCompleteList = async () => {
  loading2.value = true;
  const res = await listCompletePostOrder(completeQueryParams.value);
  deliveryRecordList.value = res.rows;
  total2.value = res.total;
  loading2.value = false;
}
// 初始化表格组件的搜索条件
const initCompleteTableSearch = () => {
  const tempParam = Object.keys(initQueryParams2)
  Object.keys(completeQueryParams.value).forEach(key => {
    if (!tempParam.includes(key)) {
      completeQueryParams.value[key] = undefined
    }
  })
}
// 获取 搜索条件
const completeSearchChange = (params: any) => {
  initCompleteTableSearch()
  Object.keys(params).forEach(key => {
    if (key == 'flowStatus') {
      completeQueryParams.value['flowStatusList'] = params[key];
    } else if (params[key] !== null && params[key] !== undefined) {
      completeQueryParams.value[key] = params[key];
    }
  });
  completeQueryParams.value['flowStatus'] = undefined

  completeQueryParams.value.customerCodeList = completeQueryParams.value.customerCode;
  completeQueryParams.value.customerCode = undefined;

  getCompleteList();
}

const clickOutside = () => {
  contextBoxRef.value.style = 'display: none;'
}
const contextMenuClickEvent: VxeTableEvents.MenuClick<OrderVO> = ({ menu, row, column }) => {
  quotationShow.value = true;
  orderEtrShow.value = true;
  currentInfo.value = row;
  // console.log(row)
  switch (menu.code) {
    case 'details':
      if (row && column) {
        drawer.visible = true;
        drawer.title = row.code;
        currentInfo.value = row;
      }
      break;
    case 'finished':
      if (row && column) {
        const title = row.commodityCode + "产品手动完结"
        ElMessageBox.prompt('请输入手动完结备注', title, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputValidator: function (value) {
            if (value == null || !value.trim()) {
              return '完结备注不能为空';
            } else if (value.length > 500) {
              return '完结备注长度不能超过500个字符';
            }
            return true; // 验证通过
          }
        }).then(({ value }) => {
          submitFinishedOrder(row.id, value).then((res) => {
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
    default:
  }
}
//行右键单击
const rowContextMenu = ({ row, originalEvent }: any) => {
  contextBoxRef.value.style = 'display: block;'
  nextTick(() => {
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;
    const domWidth = contextBoxRef.value.clientWidth;
    const domHeight = contextBoxRef.value.clientHeight;
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
    (menuConfig as any).visibleMethod({ options: menuConfig?.body?.options, column: true, row } as any)
  })
}

//完结审核
const auditId = ref();
const auditNo = ref();
//const auditDialogRemark = ref();
const completeAudit = (row: any) => {
  auditId.value = undefined;
  auditNo.value = undefined;
  auditForm.value.auditDialogRemark = undefined;
  auditId.value = row.id;
  auditNo.value = row.code;
  auditDialogFormVisible.visible = true;
}
//驳回
const rejectAudit = async () => {
  if (!auditId.value) {
    ElMessage({
      message: '驳回id不能为空',
      type: 'warning',
    })
  }
  //await proxy?.$modal.confirm('是否确认驳回"' + auditNo.value + '"？');

  auditFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      rejectFinishedOrder(auditId.value, auditForm.value.auditDialogRemark).then((res) => {
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        getCompleteList();
      }).finally(() => auditDialogFormVisible.visible = false);
    }
  });


}
//通过审核
const passAudit = async () => {
  if (!auditId.value) {
    ElMessage({
      message: '通过id不能为空',
      type: 'warning',
    })
  }

  //await proxy?.$modal.confirm('是否确认通过审核"' + auditNo.value + '"？');
  auditFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      finishedOrder(auditId.value, auditForm.value.auditDialogRemark).then((res) => {
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        getCompleteList();
      }).finally(() => auditDialogFormVisible.visible = false);
    }
  });
}
//取消审核
const completeCancel = async (row: any) => {
  if (!row.id) {
    ElMessage({
      message: '取消审核id不能为空',
      type: 'warning',
    })
  }
  await proxy?.$modal.confirm('是否确认将单号"' + row.code + '"的订单取消完结？');
  cancelFinishedOrder(row.id).then((res) => {
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
    getCompleteList();
  });
}
//驳回再提交
const completeSubmit = async (row: any) => {
  await proxy?.$modal.confirm('是否确认将单号"' + row.code + '"的订单提交完结审核？');
  submitFinishedOrder(row.id, row.finishedRemark).then((res) => {
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
    getCompleteList();
  });
}

onMounted(() => {
  getListCust();
  getList();
  getCustomerList();
  getDictOptions();
  getTotalAmount();
});
</script>

<style>
.el-form-item--small {
  margin-bottom: 15px
}

.el-select {
  width: 100%;
}

.el-input__wrapper {
  width: 100%;
}

.vxe-table--fixed-left-wrapper {
  z-index: 2 !important;
  height: calc(100% - 10px) !important;
}

.vxe-table--fixed-right-wrapper {
  z-index: 2 !important;
  height: calc(100% - 10px) !important;
}
</style>
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
</style>


<style lang="scss" scoped>

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

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

:deep(.add-prod-drawder) {
  .el-drawer__header {
    height: auto;
    padding: 5px !important;
    margin-bottom: 5px !important;
  }

  .el-drawer__body {
    padding: 5px 5px !important;

    .el-divider {
      margin: 0 0 6px 0 !important;
    }

    .error-left {
      .el-form-item__error {
        left: -20px;
      }
    }

    .error-left-one {
      .el-form-item__error {
        left: -30px;
      }
    }

    .el-form-item {
      margin-bottom: 6px !important;

      .el-form-item__label {
        padding-right: 3px !important;
      }

      .el-form-item__content {
        .el-form-item {
          margin-bottom: 0 !important;
        }

        .el-textarea,
        .el-input__wrapper,
        .el-textarea__inner {
          background-color: #FDFFE1 !important;
          color: #000000 !important;
        }

        .el-input__inner {
          color: #000000 !important;
        }

        .height-light .el-input__wrapper {
          background-color: #FED547 !important;
        }

        .el-input-group__prepend,
        .el-input-group__append {
          padding: 0 2px !important;
        }

        .el-input-number {
          width: 100% !important;

          .el-input__wrapper {
            padding: 1px 7px !important;

            .el-input__inner {
              width: 100% !important;
              text-align: left !important;
            }
          }
        }

        .el-input__inner {

          // 去除 数字表单 上下按钮
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }

          &[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
          }

          border: none;
        }
      }

      &.is-error .el-input__wrapper {
        box-shadow: 0 0 0 2px var(--el-color-danger) inset;
      }

      .el-form-item__error {
        display: none;
      }

      .error-right {
        .el-form-item__error {
          /* text-align: right; */
          left: 105px !important;
        }

        z-index: 10 !important;
      }
    }
  }

  .flex-start {
    .el-form-item__content {
      justify-content: flex-start !important;
      align-items: center;

      .el-input-number {
        flex: 1 !important;
        width: auto;
      }
    }
  }
}

:deep(.history-page-table) {
  width: 100%;

  .pagination {
    width: 100%;
  }
  
}
</style>

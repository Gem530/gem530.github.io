<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-if="checkPermi(['outsideReceive:delivery:list'])" class="xtable-tab" type="border-card" @tab-change="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="待发货" name="1">
          <div style="width: 100%; text-align: right; margin-bottom: 10px">
            <el-button v-if="checkPermi(['outsideReceive:delivery:add'])" :loading="buttonLoading" type="primary" @click="handleBatchAdd">批量发货</el-button>
            <el-button v-if="checkPermi(['outsideReceive:delivery:waitExport'])" :loading="buttonLoading" type="primary" @click="handleExport">导出</el-button>
          </div>

          <XTable toolId="sourceOrderWaitTool" v-model:page-size="waitQueryParams.pageSize" :loading="loading"
                  v-model:current-page="waitQueryParams.pageNum" height="100%" class="xtable-content"
                  :showRefresh="true"
                  :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: waitTotal }"
                  :data="waitList" :columnList="waitColumnList" ref="XTableRef" border @searchChange="waitSearchChange"
                  @checkbox-all="selectChangeEvent" @checkbox-change="selectChangeEvent"
                  :checkbox-config="{ checkMethod: selectableFun, showHeader: false, reserve: true }" :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }">
            <template #default-unit="scope">
              {{ unitList.find(item => item.value == scope.row.unit)?.label }}
            </template>
            <template #default-make="scope">
              <el-button v-if="checkPermi(['outsideReceive:delivery:add'])" link type="primary" @click="handleAdd(scope.row)">发货</el-button>
            </template>

          </XTable>
        </el-tab-pane>


        <el-tab-pane label="发货记录" name="2">
          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <div class="totalTitle">发货数量合计：{{deliveryCount.quantityCount}}&nbsp;&nbsp;|&nbsp;&nbsp; 发货面积合计(㎡)：{{deliveryCount.areaCount}}&nbsp;&nbsp;
              |&nbsp;&nbsp; 发货金额合计(元)：{{deliveryCount.priceCount}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <el-button v-if="checkPermi(['outsideReceive:delivery:export'])" :loading="buttonLoading" type="primary" @click="handleDeliveryExport">导出</el-button>
          </div>
          <XTable toolId="sourceOrderDeliveryTool" v-model:page-size="queryParams.pageSize" :loading=loading
                  v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
                  :showRefresh="true" ref="deliverTableRef"
                  :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
                  :data="dataList" :columnList="columnList" border @searchChange="searchChange"
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">

            <template #default-unit="scope">
              {{ unitList.find(item => item.value == scope.row.unit)?.label }}
            </template>
            <template #default-accountStatus="scope">
              {{ accountList.find(item => item.value == scope.row.accountStatus)?.label }}
            </template>
            <template #default-isSign="scope">
              {{ statusList.find(item => item.value == scope.row.isSign)?.label }}
            </template>
            <template #default-make="scope">
              <el-button v-if="checkPermi(['outsideReceive:delivery:edit']) && scope.row.isSign == '0'" link type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button v-if="checkPermi(['outsideReceive:delivery:file'])" link type="primary" @click="handleFile(scope.row)">凭证</el-button>
              <el-button v-if="checkPermi(['outsideReceive:delivery:print'])" link type="primary" @click="purchaseReportHandle(scope.row)">打印</el-button>
            </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <el-drawer :title="drawer.title" v-model="drawer.visible" size="88%" @close="drawerCancel" v-loading="drawLoading">
      <div class="ptable-card">
        <el-collapse v-model="activeNames">
          <el-form style="width: 100%;" :model="form" ref="orderFormRef" :rules="rules" label-width="130px" label-position="right"
                 :disabled="!drawer.title.includes('新增')">
            <el-collapse-item title="基本信息" class="out_delivery_collapse" name="1">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="客户名称:" prop="customerName">
                    <el-input v-model="form.customerName" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="发货时间:" prop="deliveryTime">
                    <el-date-picker class="width-100" v-model="form.deliveryTime" type="datetime"
                                    value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
                                    clearable></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item  label="收货人手机号:">
                    <el-input :disabled="logisticsDisabled" v-model="form.phoneNumber" maxlength="40"
                              placeholder="请填写人手机号"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="发货车辆:" prop="deliveryVehicle">
                    <el-input v-model="form.deliveryVehicle" maxLength="100"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="收货地址:" prop="deliveryAddress">
                    <el-select v-model="form.deliveryAddress" style="width: 100%;"
                               filterable allow-create default-first-option>
                      <el-option v-for="address in cusAddressList" :key="address.address" :label="address.address" :value="address.address"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物流公司:" prop="logisticsCompany">
                    <el-input :disabled="logisticsDisabled" v-model="form.logisticsCompany" maxLength="100"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物流单号:" prop="logisticsNumber">
                    <el-input :disabled="logisticsDisabled" v-model="form.logisticsNumber" maxLength="100"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="物流凭证:" prop="fileList">
                    <div class="global-flex flex-start">
                      <XUpload
                        :isWaterMark="true"
                        v-model:model-value="form.fileList"
                        :fileType="fileType"
                        @fileChange="handleFileChange"
                        @delFile="handleFileChange"
                        :readOnly="drawer.title?.includes('编辑')"
                        model="preview"
                        :multiple="false"
                        :fileSize="5"
                        accept="image/png, image/bmp, image/jpeg, image/jpg, image/gif"
                      ></XUpload>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-form>

            <el-collapse-item title="发货信息" name="2">
              <XTable v-if="drawer.title.includes('新增')" :pageShow="false" ref="tabTable" :data="tabOrderList" border :columnList="orderColumnList"
                      height="100%" class="ptable-content" :loading="dialogTableLoading"
                      :column-config="{ resizable: true }" keep-source
                      :edit-rules="validRules" size="mini"
                      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
                <template #default-unit="scope">
                  {{ unitList.find(item => item.value == scope.row.unit)?.label }}
                </template>
                <template #default-make="scope">
                  <el-button v-if="tabOrderList.length > 1" link type="primary"
                             @click="handleTabDelete(scope.row)">移除
                  </el-button>
                </template>
                <template #edit-quantity="scope">
                  <el-input-number style="width: 85%" :min="0" :max="scope.row.waitDeliverQuantity" :precision="0" :controls="false"
                                   v-model="scope.row.quantity"/>
                </template>
                <template #edit-remark="scope">
                  <el-input type="text" maxLength="254"
                            v-model="scope.row.remark"/>
                </template>
              </XTable>

              <XTable v-else :pageShow="false" ref="tabTable" :data="tabOrderList" border :columnList="deliveryColumnList"
                      height="100%" class="ptable-content" :loading="dialogTableLoading"
                      :column-config="{ resizable: true }" keep-source
                      :edit-rules="validRules" size="mini"
                      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
                <template #default-unit="scope">
                  {{ unitList.find(item => item.value == scope.row.unit)?.label }}
                </template>
                <template #edit-quantity="scope">
                  <el-input-number style="width: 85%" :min="0" :precision="0" :controls="false"
                                   v-model="scope.row.quantity"/>
                </template>
                <template #edit-remark="scope">
                  <el-input type="text" maxLength="254" v-model="scope.row.remark"/>
                </template>
              </XTable>
            </el-collapse-item>
        </el-collapse>


      </div>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="drawerCancel">取消</el-button>
            <el-button v-if="drawer.title?.includes('新增')" :loading="buttonLoading" type="primary" @click="submitAddForm">确认发货</el-button>
            <el-button v-else :loading="buttonLoading" type="primary" @click="submitEditForm">确认修改</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <DeliveryPrint ref="deliverCardRef" />

    <el-drawer v-model="ppppdrawer.visible" size="80%"  ></el-drawer>
    <!--    <DeliveryPrint ref="deliverCardRef" />-->
    <!-- 打印对话框 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
      <PrintPurchase />
    </el-drawer>

    <!-- 凭证对话框 -->
    <el-dialog :title="fileDialog.title" v-model="fileDialog.visible" width="45%" destroy-on-close>
      <XUpload v-model:model-value="form.files" model="download" style="text-align: end;"
               :multiple="true" :show-file-list="false" @fileChange="fileChange"  v-loading="dialogTableLoading"
               accept="image/png, image/bmp, image/jpeg, image/jpg, image/gif">
        <div class="global-flex">
          <span style="color: #b6b6b6;margin-right: 5px;">支持批量上传图片格式的附件</span><el-button type="primary">上传文件</el-button>
        </div>
      </XUpload>

      <XTable :pageShow="false" class="xtable-content" :loading="eqloading" :data="fileList"
              :show-footer="false" :columnList="eqfileColumnList" ref="fileListTableRef" border
              :column-config="{ resizable: true }"
      >

        <template #default-make="scope">
          <el-button link type="primary" @click="preview(scope.row)">预览</el-button>
          <el-button link type="primary" :text="true" @click="delFile(scope.row)">删除</el-button>
          <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
        </template>
      </XTable>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="fileDialog.visible = false">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitFile">确认添加</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <FileView ref="fileViewRef"></FileView>
  </div>
</template>

<script setup name="OutProcessDelivery" lang="ts">
import { DeliveryRecordVO } from '@/api/order/deliveryRecord/types';
import {VXETable, VxeTableEvents, VxeTablePropTypes} from 'vxe-table';
import dayjs from "dayjs";
import { deepClone } from '@/utils';
import { getListCustomer} from "@/api/basedata/customer";
import {ref} from "vue";
import {getSignPdf} from "@/api/financial/accountOrder";
import {getReportUrl} from "@/utils/report";
import {listSourceOrderDetail, querySourceOrderDetailList} from "@/api/outsource/sourceOrderDetail";
import {
  SourceOrderDetailForm,
  SourceOrderDetailQuery,
  SourceOrderDetailVO
} from "@/api/outsource/sourceOrderDetail/types";
import {getListAddress} from "@/api/basedata/address";
import {
  addSourceOrderDelivery, batchUpdaterDelivery,
  getSourceOrderDelivery,
  listDeliveryCount,
  listSourceOrderDelivery
} from "@/api/outsource/sourceOrderDelivery";
import {
  SourceOrderDeliveryForm,
  SourceOrderDeliveryQuery,
  SourceOrderDeliveryVO
} from "@/api/outsource/sourceOrderDelivery/types";
import {downloadUrl, listContractFiles} from "@/api/upload";
import {updateSourceOrderFiles} from "@/api/outsource/sourceOrder";
import fileSaver from "file-saver";
import {checkPermi} from "@/utils/permission";

const deliverCardRef = ref();

const deliverInfo = ref<any>();
const cardRef = ref();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { delivery_record_type } = toRefs<any>(proxy?.useDict('delivery_record_type'));

const waitList = ref<SourceOrderDetailVO[]>([]);
const fileList = ref<any[]>([])
const delFileIds = ref<any[]>([])

const buttonLoading = ref(false);
const loading = ref(true);
const drawLoading = ref(true);
const eqloading = ref(false);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const deliveryCount = ref({
  quantityCount:0,
  areaCount:0,
  priceCount:0,
});

const fileDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const activeNames = ref(['1','2']);

const queryFormRef = ref<ElFormInstance>();
const deliveryRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SourceOrderDeliveryForm = {
  id: undefined,
  ownerId: undefined,
  outSourceOrderDetailId: undefined,
  customerId: undefined,
  deliveryTime: undefined,
  phoneNumber: undefined,
  deliveryVehicle: undefined,
  logisticsCompany: undefined,
  logisticsNumber: undefined,
  deliveryAddress: undefined,
  quantity: undefined,
  remark: undefined,
  deliveryBoList: [],
  fileList: []
}

const data = reactive<PageData<SourceOrderDeliveryForm, SourceOrderDeliveryQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    outSourceOrderDetailId: undefined,
    customerId: undefined,
    deliveryTime: undefined,
    phoneNumber: undefined,
    deliveryVehicle: undefined,
    logisticsCompany: undefined,
    logisticsNumber: undefined,
    deliveryAddress: undefined,
    quantity: undefined,
  },
  rules: {
    deliveryTime: [
      { required: true, message: "发货时间不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户不能为空", trigger: "blur" }
    ],
  }
});

const waitData = reactive<PageData<SourceOrderDetailForm, SourceOrderDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    outSourceOrderId: undefined,
    commodityCode: undefined,
    length: undefined,
    width: undefined,
    quantity: undefined,
    unit: undefined,
    outSourceCraftId: undefined,
    processDeptId: undefined,
    requirement: undefined,
  },
  rules: {
  }
});

const validatePass = (value: any) => {
  if (!value) {
    return  new Error('发货数不能为空')
  } else if (Number(value) <= 0) {
    return new Error('请输入大于0的数字')
  }
}

VXETable.validators.add('validatePass', {
  cellValidatorMethod({ cellValue }) {
    return validatePass(cellValue)
  }
})

//=列表校验
const validRules = ref<VxeTablePropTypes.EditRules>({
  quantity: [
    { required: true, validator: 'validatePass', trigger: "blur" }
  ],
})
const { queryParams:waitQueryParams } = toRefs(waitData);

const { queryParams, form, rules } = toRefs(data);

const radioTable = ref('1');
const intervalCondition = ['createTime', 'length', 'width', 'quantity', 'waitProcessQuantity', 'processQuantity', 'waitDeliverQuantity',
  'deliverQuantity', 'startTime', 'finishTime', 'orderTime', 'orderQuantity', 'deliveryTime','price', 'totalPrice'];

const dataList = ref<SourceOrderDeliveryVO[]>([]);
const tabOrderList = ref<any[]>([]);
const checkedOrderList = ref<DeliveryRecordVO[]>([]);

const cusAddressList = ref<any[]>([]);

const waitTotal = ref(0);

const drawer = reactive<DialogOption>({ visible: false, title: '' });
const ppppdrawer = reactive<DialogOption>({ visible: false, title: '' });
const XTableRef = ref<ElFormInstance>();
const deliverTableRef = ref<ElFormInstance>();
const fileViewRef = ref<ElFormInstance>();

const checkCustomer = ref("");
const orderFormRef = ref<ElFormInstance>();
const tabTable = ref<ElFormInstance>();
const dialogTableLoading = ref(false);

const customerCodeList=ref();

const waitColumnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '40', fixed: 'left', },
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '50', fixed: 'left'},
  { title: '外协加工单号', minWidth: '150', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' }},
  { title: '客户订单号', minWidth: '130', field: 'orderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户订单号' }},
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品型号' }},
  { title: '客户名称', minWidth: '120', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100', filterType: 'intervalNumber', },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , filterType: 'intervalNumber',},
  { title: '接单总数', minWidth: '100', field: 'quantity', align: 'center' , filterType: 'intervalNumber',},
  { title: '接单总面积(㎡)', minWidth: '120', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center', filterType: 'radio', filterParam: { placeholder: '' }, filterData: () => unitList.value },
  { title: '加工部门', field: 'processDeptName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工部门' }},
  { title: '待加工', field: 'waitProcessQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '已加工', field: 'processQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '待发货', field: 'waitDeliverQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '已发货', field: 'deliverQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '加工要求', field: 'requirementQuery',  minWidth: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工要求' }},
  { title: '备注', field: 'remark', align: 'center', minWidth: '120', filterType: 'input', filterParam: { placeholder: '请输入备注' }},
  { title: '开始加工时间', field: 'startTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '完成加工时间', field: 'finishTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '接单/创建人', field: 'orderByName', align: 'center', minWidth: '100', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '接单/创建时间', field: 'orderTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '操作', width: '100', field: 'make', align: 'center', fixed: 'right',},
]);

const columnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '50', fixed: 'left'},
  { title: '外协加工单号', minWidth: '150', field: 'outSourceCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' }},
  { title: '客户订单号', minWidth: '130', field: 'orderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户订单号' }},
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品型号' }},
  { title: '发货单号', minWidth: '150', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入发货单号' }},
  { title: '回签状态', field: 'isSign',  minWidth: '80',align: 'center', filterType: 'radio', filterParam: { placeholder: '' }, filterData: () => statusList.value },
  { title: '客户名称', minWidth: '120', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100', filterType: 'intervalNumber', },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , filterType: 'intervalNumber',},
  { title: '接单总数', minWidth: '100', field: 'orderQuantity', align: 'center' , filterType: 'intervalNumber',},
  { title: '接单总面积(㎡)', minWidth: '120', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center', filterType: 'radio', filterParam: { placeholder: '' }, filterData: () => unitList.value },
  { title: '加工部门', field: 'processDeptName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工部门' }},
  { title: '本次发货数', field: 'quantity',  minWidth: '90',align: 'center', filterType: 'intervalNumber',},
  { title: '发货面积(㎡)', field: 'deliverArea',  minWidth: '100',align: 'center', },
  { title: '单价(元)', field: 'price',  minWidth: '100',align: 'center', filterType: 'intervalNumber', isPermi: () => checkPermi(['outsideReceive:delivery:price'])},
  { title: '发货总金额(元)', field: 'totalPrice',  minWidth: '110',align: 'center', filterType: 'intervalNumber', isPermi: () => checkPermi(['outsideReceive:delivery:price'])},
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '加工要求', field: 'requirementQuery',  minWidth: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工要求' }},
  { title: '备注', field: 'remark', align: 'center', minWidth: '120', filterType: 'input', filterParam: { placeholder: '请输入备注' }},
  { title: '发货人', minWidth: '90', field: 'createByName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入发货人' }},
  { title: '发货时间', field: 'deliveryTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '收货地址', minWidth: '140', field: 'deliveryAddress', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入收货地址' }},
  { title: '收货人手机号', minWidth: '120', field: 'phoneNumber', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入收货人手机号' }},
  { title: '发货车辆', minWidth: '90', field: 'deliveryVehicle', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入发货车辆' }},
  { title: '物流公司', minWidth: '90', field: 'logisticsCompany', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入物流公司' }},
  { title: '物流单号', minWidth: '90', field: 'logisticsNumber', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入物流单号' }},
  { title: '对账状态', minWidth: '90', field: 'accountStatus', align: 'center' , filterType: 'radio',
    isPermi: () => checkPermi(['outsideReceive:delivery:price']), filterParam: { placeholder: '' }, filterData: () => accountList.value },
  { title: '操作', width: '180', field: 'make', align: 'center', fixed: 'right',},
]);

const orderColumnList = ref([
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center',},
  { title: '客户订单号', minWidth: '130', field: 'orderCode', align: 'center', },
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center',},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100', },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , },
  { title: '接单数量', minWidth: '100', field: 'orderQuantity', align: 'center' ,},
  { title: '接单面积(㎡)', minWidth: '120', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center', },
  { title: '待加工', field: 'waitProcessQuantity',  minWidth: '80',align: 'center', },
  { title: '已加工', field: 'processQuantity',  minWidth: '80',align: 'center', },
  { title: '待发货', field: 'waitDeliverQuantity',  minWidth: '80',align: 'center', },
  { title: '已发货', field: 'deliverQuantity',  minWidth: '80',align: 'center', },
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', },
  { title: '加工要求', field: 'requirementQuery',  minWidth: '120',align: 'center', },
  { title: '加工备注', field: 'orderRemark', align: 'center', minWidth: '120', },
  { title: '本次发货数', width: '100', field: 'quantity', align: 'center', editRender: {}, fixed: 'right',},
  { title: '发货备注', width: '120', field: 'remark', align: 'center', editRender: {}, fixed: 'right',},
  { title: '操作', width: '140', field: 'make', align: 'center', fixed: 'right',},
]);

const deliveryColumnList = ref([
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center',},
  { title: '客户订单号', minWidth: '130', field: 'orderCode', align: 'center', },
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center',},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100', },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , },
  { title: '接单总数', minWidth: '100', field: 'orderQuantity', align: 'center' ,},
  { title: '接单面积(㎡)', minWidth: '120', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center', },
  { title: '加工部门', field: 'processDeptName',  minWidth: '100',align: 'center', },
  { title: '待加工', field: 'waitProcessQuantity',  minWidth: '80',align: 'center', },
  { title: '已加工', field: 'processQuantity',  minWidth: '80',align: 'center', },
  { title: '待发货', field: 'waitDeliverQuantity',  minWidth: '80',align: 'center', },
  { title: '已发货', field: 'deliverQuantity',  minWidth: '80',align: 'center', },
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', },
  { title: '加工要求', field: 'requirementQuery',  minWidth: '120',align: 'center', },
  { title: '加工备注', field: 'orderRemark', align: 'center', minWidth: '120', },
  { title: '本次发货数', width: '100', field: 'quantity', align: 'center', editRender: {}, fixed: 'right',},
  { title: '发货备注', width: '120', field: 'remark', align: 'center', editRender: {}, fixed: 'right',},
]);

const eqfileColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '附件名称', field: 'name', align: 'center'},
  {title: '上传人', width: '120', field: 'createByName', align: 'center'},
  {title: '上传时间', width: '160', field: 'createTime', align: 'center'},
  {title: '操作', width: '180', field: 'make', align: 'center'},
]);

const unitList = ref([
  { label: 'PNL', value: "2" },
  { label: 'SET', value: "3" },
  { label: '大料', value: "1" },
]);

const statusList = ref([
  { label: '未回签', value: "0" },
  { label: '已回签', value: "1" },
]);

const accountList = ref([
  { label: '未对账', value: "0" },
  { label: '已对账', value: "1" },
]);

let logisticsDisabled = ref(false);

/** 是否禁选 */
const selectableFun = (scope: any) => {
  //当前选择客户与已选择客户不一致时，禁选
  if (checkCustomer.value && scope.row.customerName != checkCustomer.value) {
    return false;
  }
  return true;
}

const selectChangeEvent: VxeTableEvents.CheckboxAll<DeliveryRecordVO> = async () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxRecords();
    const reserveSelect = tableRef.getCheckboxReserveRecords();
    checkedOrderList.value = selectRecords.map((item: any) => item);
    // console.log(selectRecords, reserveSelect)
    if (reserveSelect?.length) {
      checkedOrderList.value = checkedOrderList.value.concat(reserveSelect)
    }
  }
  if (checkedOrderList.value && checkedOrderList.value.length > 0) {
    checkCustomer.value = checkedOrderList.value[0].customerName;
    let searchTempList = [{field: 'customerName', defaultValue: checkCustomer.value}]
    if (!waitQueryParams.value?.customerName) {
      waitQueryParams.value.pageNum = 1
    }
    XTableRef.value.filterFieldEvent(searchTempList)
  } else {
    checkCustomer.value = "";
    // queryParams.value.customerName = undefined;
    waitQueryParams.value.pageNum = 1
    XTableRef.value.delFilterField(['customerName'])
    checkedOrderList.value=[];
  }
}

const drawerCancel = () => {
  console.log("drawerCancel")
  // checkedOrderList.value = [];
  drawer.visible = false;
}

/** 批量发货按钮 */
const handleBatchAdd = async() => {
  if (!checkedOrderList.value || checkedOrderList.value.length == 0) {
    proxy?.$modal.msgWarning("请选择单据");
    return;
  }
  reset();
  //如果列表中客户id不一样则报错
  let chcc=true;
  checkedOrderList.value.forEach((item: any) => {
    if (item.customerName != checkedOrderList.value[0].customerName) {
      chcc=false;
      return;
    }
  });
  if(!chcc){
    proxy?.$modal.msgError("请选择同一客户的单据");
    return;
  }
  tabOrderList.value = []
  tabOrderList.value = deepClone(checkedOrderList.value);
  let checkCust = tabOrderList.value[0];

  form.value.customerName = checkCust.customerName;
  form.value.customerId = checkCust.customerId;
  form.value.deliveryTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  buttonLoading.value = true;
  // 查询客户地址
  queryCusAddress(checkCust.customerId);

  const res = await querySourceOrderDetailList({ids: checkedOrderList.value.map((item: any) => item.id)})
    .finally(() => { buttonLoading.value = false; });
  refreshData(res.data);

  drawer.visible = true;
  drawer.title = "新增发货单";
}

/** 刷新数据 */
const refreshData = (refreshList: any[]) => {
  console.log("refreshData", refreshList)
  tabOrderList.value.forEach((item: any) => {
    item.orderReamrk = item.remark;
    item.remark = undefined;
    item.orderQuantity = item.quantity;
    item.outSourceOrderDetailId = item.id;
    if (refreshList && refreshList.length > 0) {
      refreshList.forEach((refreshObj: any) => {
        if (item.outSourceOrderDetailId == refreshObj.id) {
          item.deliverQuantity = refreshObj.deliverQuantity;
          item.waitDeliverQuantity = refreshObj.waitDeliverQuantity;
          item.waitProcessQuantity = refreshObj.waitProcessQuantity;
          item.processQuantity = refreshObj.processQuantity;
          item.quantity = item.waitDeliverQuantity;
        }
      });
    }
    item.id = undefined;
  });
}

/** 发货按钮 */
const handleAdd = async (row: any) => {
  reset;
  tabOrderList.value = [];
  tabOrderList.value.push(deepClone(row));
  form.value.customerName = row.customerName;
  form.value.customerId = row.customerId;
  form.value.deliveryTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  buttonLoading.value = true;
  // 查询客户地址
  queryCusAddress(row.customerId);

  // 刷新数量信息
  const res = await querySourceOrderDetailList({id: row.id}).finally(() => { buttonLoading.value = false; });
  refreshData(res.data);
  drawer.visible = true;
  drawer.title = "新增发货单";
}

/** 编辑按钮 */
const handleEdit = async(id: string | number) => {
  drawLoading.value = true;
  drawer.visible = true;
  drawer.title = "编辑发货单";
  // 查询详情信息
  await getSourceOrderDelivery(id).then(res => {
    form.value = res.data;
    tabOrderList.value = res.data.deliveryList;
  }).finally(() => drawLoading.value = false);
  // 查询凭证信息
  form.value.fileList = await listContractFiles(form.value.bizId);
}

/** 查询客户地址 */
const queryCusAddress = async (id: any) => {
  const res = await getListAddress({customerId: id});
  cusAddressList.value = res.data;
  form.value.deliveryAddress = res.data[0].address;
}

/** 删除按钮操作 */
const handleTabDelete = async (row?: any) => {
  await proxy?.$modal.confirm('是否确认移除加工单号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  tabOrderList.value = tabOrderList.value.filter((item: any) => item.outSourceOrderDetailId != row.outSourceOrderDetailId);
  proxy?.$modal.msgSuccess("删除成功");
}

// 切换菜单栏 ***********
const radioTableHandle = async () => {
  if ("1" == radioTable.value) {
    await getWaitList();
  } else {
    await getList();
  }
}

const searchChange = async(params: any) => {
  queryParams.value = {...params}
  if (!queryParams.value?.customerName) {
    if (XTableRef.value) {
      checkCustomer.value = undefined
      checkedOrderList.value = []
      XTableRef.value.xTableRef.clearCheckboxRow()
      XTableRef.value.xTableRef.clearCheckboxReserve()
    }
  }
  await getList();
}

const waitSearchChange = async(params: any) => {
  waitQueryParams.value = {...params}
  await getWaitList();
}


/** 查询待发货列表 */
const getWaitList = async () => {
  loading.value = true;
  waitQueryParams.value.isQueryDelivery = "1";
  console.log("waitQueryParams ", waitQueryParams.value)
  const res = await listSourceOrderDetail(waitQueryParams.value);
  waitList.value = res.rows;
  waitTotal.value = res.total;
  loading.value = false;
}

/** 查询发货记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceOrderDelivery(queryParams.value);
  dataList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  // 查询统计信息
  listDeliveryCount(queryParams.value).then(res => {
    deliveryCount.value = res.data;
  });
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  logisticsDisabled.value = false;
  deliveryRecordFormRef.value?.resetFields();
  cusAddressList.value = [];
  fileList.value = [];
  delFileIds.value = [];
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

/** 提交按钮 */
const submitAddForm = async () => {
  const $table = tabTable.value.xTableRef;
  orderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if ($table) {
        let errMap = await $table.validate(true);
        if (errMap) {
          console.log("errMap", errMap);
          return;
        }
      }
      buttonLoading.value = true;
      form.value.deliveryBoList = tabOrderList.value;
      form.value.deliveryBoList.map(item => {
        item.createDept = undefined;
        item.createDeptName = undefined;
        item.createByName = undefined;
        item.createBy = undefined;
        item.updateByName = undefined;
        item.updateBy = undefined;
        item.createTime = undefined;
        item.updatetime = undefined;
      })
      const res = await addSourceOrderDelivery(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("操作成功");
      const $table1 = XTableRef.value.xTableRef;
      if ($table1) {
        $table1.clearCheckboxRow()
        $table1.clearCheckboxReserve()
      }

      await proxy?.$modal.confirm("是否立即打印送货单？").finally(() => {
        drawer.visible = false;
        checkedOrderList.value = [];
        checkCustomer.value = "";
        waitQueryParams.value.customerCode = undefined;
        //getList();
      });
      purchaseReportHandle(res.data);

      drawer.visible = false;

      checkedOrderList.value = [];
      checkCustomer.value = "";
      waitQueryParams.value.customerName = undefined;
      getWaitList();
    }
  });
}

/** 确认修改按钮 */
const submitEditForm = async () => {
  const $table = tabTable.value.xTableRef;
  if ($table) {
    let errMap = await $table.validate(true);
    if (errMap) {
      console.log("errMap", errMap);
      return;
    }
  }
  buttonLoading.value = true;
  await batchUpdaterDelivery(tabOrderList.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  drawer.visible = false;
  getList();
}

const printHtmlV2 = (Id: any) => {
  let printNode = cardRef.value;
  console.log(printNode);
  const newDoc = document.implementation.createHTMLDocument('Print Document');
  const pageStyle = newDoc.createElement("style");
  pageStyle.innerHTML = "@page { margin: 0.5cm; }"; // 0.5厘米边距
  newDoc.head.appendChild(pageStyle);
  newDoc.body.style.margin = "0px";
  let newContent = printNode.cloneNode(true);
  newContent.style.display = 'block';
  newDoc.body.appendChild(newContent);
  newDoc.documentElement.innerHTML;
  // 创建一个新的 Blob 对象
  const blob = new Blob([newDoc.documentElement.innerHTML], { type: 'text/html' });
  // 创建一个 Blob URL
  const blobUrl = URL.createObjectURL(blob);
  // 创建一个 iframe 用于打印
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  // 将 iframe 添加到页面并触发打印
  document.body.appendChild(iframe);
  iframe?.contentWindow.print();
  // 清理 Blob URL 和 iframe
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(iframe);
  }, 3000); // 等待 1 秒后清理
}

/** 表格合并 */
const mergeCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data }: any) => {
  if (column.property === "code") {
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

const getListCust = async() => {
  const custRes = await getListCustomer();
  const resCust = custRes.data;
  if(resCust){
    customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerName } });
  }
}
/**运行文件上传的类型 */
const fileType: string[] = ["png", "bmp", "jpeg", "jpg", "gif"];

/**
 * handleFileChange 清空form.fileList 校验
 */
const handleFileChange = (fileList: any) => {
  if (fileList.length > 0) {
    form.value.fileList = fileList;
  } else {
    form.value.fileList = [];
  }
}

let reportUrl = ref("");

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '送货单'
});

/** 凭证按钮 */
const handleFile = async (row: any) => {
  reset();
  fileDialog.title = "查看凭证";
  fileDialog.visible = true;
  eqloading.value = true;
  // 查询凭证信息
  const res = await listContractFiles(row.bizId).finally(() => eqloading.value = false);
  fileList.value = res;
  form.value.bizId = row.bizId;
}

// 文件下载
const downLoadHandle = (key: string) => {
  let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
  console.log(key)
  downloadUrl(key).then(res => {
    loadingBox.close()
    if (res.code == 200) {
      const { data } = res
      fileSaver.saveAs(data[key])
    }
  }).catch((err) => {
    loadingBox.close()
  })
}

// 文件删除
const delFile = async(row: any) => {
  await proxy?.$modal.confirm('是否删除文件？').finally(() => loading.value = false);
  fileList.value = fileList.value.filter(item => item !== row)
  if(row.bizId) {
    delFileIds.value.push(row.bizId);
  }
}

/** 预览文件 */
const preview = (row: any) => {
  fileViewRef.value?.preview(row)
}

/** 文件修改 */
const fileChange = async (_value: any) => {
  // 增加文件信息
  _value.map(item => {
    // 判断是否已存在
    if (fileList.value.filter(old => old.name === item.name && old.size === item.size).length > 0) {
      return;
    } else {
      item.bizId = form.value.bizId;
      item.moduleCode = '18';
      item.bizType = '33';
      fileList.value.push(item);
    }
  })
}

/** 文件确认上传 */
const submitFile = async() => {
  buttonLoading.value = true;
  form.value.fileList = fileList.value.filter(item => !item.id);
  form.value.delFileIds = delFileIds.value;
  await updateSourceOrderFiles(form.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  fileDialog.visible = false;
}

/** 打印 */
const purchaseReportHandle = async (row: any) => {
  reportDrawer.title = "外协发货单报表预览";
  reportDrawer.visible = true;
  // 获取签名文件
  getSignPdf({bizId:row.bizId}).then(res=>{
    let vo = res.data;
    if (vo.url) {
      let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
      reportUrl.value = url;
      return;
    }
  });

  reportUrl.value = getReportUrl() + `&_n=发货单&_u=file:outSourceDelivery.ureport.xml&url=outsource/sourceOrderDelivery/printInfo/${row.bizId}&listUrl=outsource/sourceOrderDelivery/printList/${row.bizId}`;
  reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
  console.log("reportUrl", reportUrl.value);
}

/** 导出按钮操作 */
const handleExport = async () => {
  const $table = XTableRef.value.xTableRef;
  let hasSearch = false
  if ($table) {
    // 判断是否有筛选条件
    hasSearch = getHasSearch(waitQueryParams.value);
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照接单时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
    }
  }
  waitQueryParams.value.hasSearch = hasSearch;
  waitQueryParams.value.isQueryDelivery = "1";
  proxy?.download('outsource/sourceOrderDetail/export', {
    ...waitQueryParams.value, tableName: 'sourceOrderWaitTool'
  }, `外协加工待发货单_${new Date().getTime()}.xlsx`)
}

/** 导出按钮操作 */
const handleDeliveryExport = async () => {
  const $table = deliverTableRef.value.xTableRef;
  let hasSearch = false
  if ($table) {
    // 判断是否有筛选条件
    hasSearch = getHasSearch(queryParams.value);
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照接单时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
    }
  }
  queryParams.value.hasSearch = hasSearch;
  proxy?.download('outsource/sourceOrderDelivery/export', {
    ...queryParams.value, tableName: 'sourceOrderDeliveryTool'
  }, `外协加工发货单_${new Date().getTime()}.xlsx`)
}

/** 判断是否有筛选条件 */
const getHasSearch = (query: any): boolean => {
  let hasSearch = false
  let params = deepClone(query)
  delete params?.pageNum
  delete params?.pageSize
  delete params?.isQueryDelivery
  console.log(params)
  for (let key in params) {
    if (Array.isArray(params[key]) && params[key]?.length) {
      console.log("有值22~")
      params[key].map((m) => {
        if (!!m) {
          console.log("有值33~")
          // 判断是否有值，有值则说明有筛选条件，用于判断数组
          hasSearch = true
        }
      })
    } else if (!!params[key]) {
      // 判断是否有值，有值则说明有筛选条件
      console.log("有值1~",params[key])
      hasSearch = true
    }
  }
  return hasSearch
}

onMounted(async () => {
  await getWaitList();
});
</script>

<style>

.totalTitle {
  padding: 0px !important;
  margin: 0px;
  line-height: 24px !important;
  display: flex !important;
  justify-content: end !important;
  font-size: 14px !important;
  color: #0892c7 !important;
  font-weight: bold;
  margin-right: 10px;
}

.out_delivery_collapse .el-collapse-item__wrap {
  margin-left: -40px !important;
}
</style>

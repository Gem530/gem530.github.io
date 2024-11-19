<template>
  <div class="p-2 xtable-page">
      <el-tabs v-model="editableTabsValue" @tab-change="radioTableHandle()" class="xtable-tab">
        <el-tab-pane label="待受理列表" :name="1">
          <el-row class="head-btn-flex">
              <!-- <el-button :disabled="multiple" type="primary" @click="changeDeliveryTimeAllOpen('detail')">批量修改交期</el-button> -->
              <el-button :disabled="multiple" type="primary" @click="waitCheck">受理</el-button>
          </el-row>

          <XTable
            height="100%"
            toolId="purchasePurchaseHandleReceive"
            class="xtable-content"
            v-loading="loading"
            :pageShow="true"
            v-model:page-size="materialQueryParams.pageSize"
            v-model:current-page="materialQueryParams.pageNum"
            :page-params="{ perfect: true, total: totalMaterial }"
            ref="waitHandleTableRef"
            :data="materialOrderDetailList"
            :columnList="waitHandleColumnList"
            @checkbox-change="selectAllChangeEvent"
            :intervalCondition="['applyTime','actualStock','onWayStock']"
            :checkbox-config="{ reserve: true, showHeader:false }"
            :row-config="{ keyField:'id' }"
            border
            :showRefresh="true"
            @searchChange="radioTableHandle"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
            <template #default-status="scope">
              <div>待受理</div>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待审核列表" :name="2">
          <el-row class="head-btn-flex">
              <!-- <el-button :disabled="!selectedOrderList.length" type="primary" @click="changeDeliveryTimeAllOpen('order')">批量修改交期</el-button> -->
              <el-button :disabled="mergeMultiple" type="primary" @click="mergeCheck">合并采购单</el-button>
          </el-row>
          <XTable
            height="100%"
            toolId="purchasePurchaseHandleExamine"
            class="xtable-content"
            v-loading="loading"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="materialOrderList"
            :columnList="columnList"
            ref="materialCheckOrderRef"
            @checkbox-change="selectOneChangeEvent"
            :intervalCondition="['updateTime']"
            border
            :showRefresh="true"
            @searchChange="radioTableHandle"
            @toggle-row-expand="toggleExpandChangeEvent"
            :checkbox-config="{
          reserve: true,
          showHeader:false,
          checkMethod: selectableFun
        }"
            :row-config="{ keyField:'id' }"
          >
            <template #content-expand="{ row }">
              <XTable
                :pageShow="false"
                v-loading="!row.loading"
                class="expand-wrapper-left"
                :data="row.orderDetailVoList"
                :border="true"
                :columnList="materialColumnList"
                border
              >
              <template #default-isTax="scope">
                <span>{{ scope.row.isTax == '1' ? '是' : '否' }}</span>
              </template>
              </XTable>
            </template>

            <template #default-isTax="scope">
              <span>{{ scope.row.isTax == '1' ? '是' : '否' }}</span>
            </template>

            <template #default-status="scope">
              {{ StatusStrings[scope.row.status as keyof typeof statusStrings] }}
            </template>
            <template #default-make="scope">
              <el-button link type="primary"  @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="examineCheck(scope.row)">审核</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待提交列表" :name="3">
          <!-- <el-row :gutter="10" class="mb8" style="width: 100%;">
            <el-col :span="24" class="global-flex flex-end">
              <el-button :disabled="!selectedOrderWaitList.length" type="primary" @click="changeDeliveryTimeAllOpen('orderWait')">批量修改交期</el-button>
            </el-col>
          </el-row> -->
          <XTable
            height="100%"
            toolId="purchasePurchaseHandleSubmit"
            class="xtable-content"
            v-loading="loading"
            v-model:page-size="waitSubmitQueryParams.pageSize"
            v-model:current-page="waitSubmitQueryParams.pageNum"
            :page-params="{ perfect: true, total: totalWaitSubmit }"
            :data="materialOrderList"
            :columnList="columnListWait"
            ref="materialCheckOrderRefSubmit"
            @checkbox-change="selectOneChangeEventWait"
            :intervalCondition="['updateTime']"
            border
            :showRefresh="true"
            @searchChange="radioTableHandle"
            @toggle-row-expand="toggleExpandChangeEvent"
            :checkbox-config="{
          reserve: true,
          showHeader:false,
          checkMethod: selectableFun
        }"
            :row-config="{ keyField:'id' }"
          >
            <template #content-expand="{ row }">
              <XTable
                :pageShow="false"
                v-loading="!row.loading"
                class="expand-wrapper-left"
                size="small"
                :data="row.orderDetailVoList"
                :border="true"
                :columnList="materialColumnList"
                border
              >
              <template #default-isTax="scope">
                <span>{{ scope.row.isTax == '1' ? '是' : '否' }}</span>
              </template>
              </XTable>
            </template>
            <template #default-isTax="scope">
              <span>{{ scope.row.isTax == '1' ? '是' : '否' }}</span>
            </template>
            <template #default-status="scope">
              {{ StatusStrings[scope.row.status as keyof typeof statusStrings] }}
            </template>

            <template #default-make="scope">
              <el-button link type="primary"  @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="checkPass(scope.row)">提交</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>

    <el-drawer v-model="dialogMaterial.visible" :title="dialogMaterial.title" size="95%" destroy-on-close draggable>
      <el-row>
        <el-col :span="8">
          <h3>受理人: {{ nickname }}</h3>
        </el-col>
        <el-col :span="8">
          <h3>受理时间: {{ currentTime }}</h3>
        </el-col>
        <el-col :span="8" class="global-flex flex-end">
          <el-button :loading="buttonLoading" v-show="1 == editableTabsValue" @click="changeMonthlyMethod(null)">批量设置月结方式</el-button>
          <el-button :loading="buttonLoading" v-show="1 == editableTabsValue" @click="changeDeliveryTimeAllOpen(null)">批量设置交期</el-button>
          <el-button :loading="buttonLoading" v-show="1 == editableTabsValue" @click="changeAddressAllOpen">批量修改收货地址</el-button>

        </el-col>
      </el-row>
      <el-row v-if="hasDifferentAddress && 1 == editableTabsValue">
        <el-col><div style="color:red;">存在收货地址不同的物料申请，请确认!</div></el-col>
      </el-row>
      <XTable
        :pageShow="false"
        height="500"
        :column-config="{resizable: true}"
        size="mini"
        :data="waitHandleDetailList"
        :border="true"
        :columnList="handleColumnList"
        ref="waitHandleDetailRef"
        toolId="waitPurchasePurchaseHandleList"
        :footer-method="footerMethod"
        show-footer
        show-footer-overflow
        border
      >

      <template #default-make="scope">
        <el-button v-if="waitHandleDetailList.length > 1 && dialogMaterial.title?.includes('采购受理')" link type="primary"
          @click="handleTabDelete(scope.row)">移除</el-button>
      </template>
      <template #header-modificationPrice="{ row }">
        单价区间
        <el-tooltip
          class="box-item"
          effect="dark"
          raw-content
          :content="`请在【供应商基价】设置【单价浮动值】`"
        >
          <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
        </el-tooltip>
      </template>
      <template #default-modificationPrice="{ row }">
{{ (row.modificationPrice||row.modificationPrice==0)?(BigNumber(row.supplierPrice).minus(BigNumber(row.modificationPrice))<(BigNumber(0)))?0:BigNumber(row.supplierPrice).minus(BigNumber(row.modificationPrice)).toNumber():'' }}
-{{ (row.modificationPrice||row.modificationPrice==0)?BigNumber(row.supplierPrice).plus(BigNumber(row.modificationPrice)).toNumber():'' }}

      </template>

        <template #default-supplierId="{ row }">
          <el-select v-model="row.supplierId" filterable placeholder="请选择供应商" style="width: 100%;" @change="getSupplierPrice(row)">
            <el-option v-for="item in SupplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
          </el-select>
        </template>
        <template #default-monthlyMethod="{ row }">
          <el-select v-model="row.monthlyMethod" filterable placeholder="请选择月结方式" style="width: 100%;">
            <el-option v-for="dict in monthly_method" :key="dict.value" :label="dict.label" :value="dict.label"></el-option>
          </el-select>
        </template>
        <template #default-isTax="{ row }">
            <el-select placeholder=" " suffix-icon="" class="height-light font-14" v-model="row.isTax" >
              <el-option label="是" value="1"/>
              <el-option label="否" value="0"/>
            </el-select>
        </template>
        <template #default-supplierPrice="{ row }">
          <el-input-number
            :disabled="dialog.title === '物料申请详情'||row.disabled "
            style="width: 99%;"
            :controls="false"
            v-model="row.supplierPrice"
            :min="0.0001"
            :precision="4"
            @change="calculateSupplierPrice(row)"
          />
        </template>
        <template #default-deliverTime="scope">
          <el-date-picker
            :disabled="dialog.title === '物料申请详情'"
            style="width: 100%;"
            v-model="scope.row.deliverTime"
            type="date"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD 23:59:59"
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :clearable="false"
          />
        </template>
        <template #default-price="{ row }">
          <el-input-number
            :disabled="dialog.title === '物料申请详情'"
            @change="calculatePrice(row)"
            style="width: 99%;"
            :controls="false"
            v-model="row.price"
            :min="(row.modificationPrice||row.modificationPrice==0)?(BigNumber(row.supplierPrice).minus(BigNumber(row.modificationPrice))<(BigNumber(0)))?0.0001:BigNumber(row.supplierPrice).minus(BigNumber(row.modificationPrice)).toNumber():0.0001"
            :max="(row.modificationPrice||row.modificationPrice==0)?BigNumber(row.supplierPrice).plus(BigNumber(row.modificationPrice)).toNumber():99999999"
            :precision="4"
            v-inputNumber="(value: any) => row.price = value"
          />
        </template>
        <template #default-quantity="{ row }">
          <el-input-number
            :disabled="dialog.title === '物料申请详情'"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.quantity"
            :min="0.01"
            :precision="2"
            v-inputNumber="(value: any) => row.quantity = value"
          />
        </template>
        <template #default-applyRemark="{ row }">
          <el-input :rows="1" :max="200" type="textarea" v-model="row.applyRemark" autocomplete="off" />
        </template>
        <template #default-addressId="{ row }">
          <el-select v-model="row.addressId" placeholder=" " @change="checkAddreHasDifferent" v-if="1 == editableTabsValue" filterable>
            <el-option
              v-for="item in customerAddressList"
              :key="item.id"
              :label="`${item.status==0?'(已禁用)-':''}${item.address}`"
              :disabled="item.status==0"
              :value="item.id"
            />
          </el-select>
          <div v-else>{{  row.addressName}}</div>
        </template>
      </XTable>

      <template #footer>
        <el-button :loading="buttonLoading" v-show="dialogMaterial.title != '订单编辑'" type="primary" @click="handleSave()">保存 </el-button>
        <el-button :loading="buttonLoading" v-show="dialogMaterial.title === '订单编辑'" type="primary" @click="handleWaitSubmitSave()" >保存 </el-button>
        <el-button :loading="buttonLoading" v-show="dialogMaterial.title != '订单编辑'" plain @click="handleApply()">提交审核 </el-button>
        <el-button :loading="buttonLoading" v-show="dialogMaterial.title === '订单编辑'" plain @click="handleWaitSubmitApply()" >提交审核 </el-button>
        <el-button :loading="buttonLoading" plain @click="dialogMaterial.visible = false"> 关闭 </el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogMerge.visible" title="合并采购单选择" width="80%" draggable>
      <XTable :showHead="false" :pageShow="false" :columnList="columnListMergeOrder" v-loading="loading" :data="selectedOrderList" :border="true" style="width: 100%" row-key="id">
          <template #default-make="scope">
            <el-button link type="primary" @click="setMain(scope.row)">设为主单</el-button>
          </template>
      </XTable>
      <template #footer>
        <el-button @click="dialogMerge.visible = false">取消</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="dialogExamine.visible" title="审核" size="60%" draggable>
      <el-form border label-width="100px" :model="orderExamine">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="订单编码：">
              <span>{{orderExamine?.code}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item size="small" label="供应商：">
              <span>{{ orderExamine?.supplierName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="创建人员：">
              <span>{{ orderExamine?.submitUserName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item size="small" label="创建时间：">
              <span>{{ orderExamine?.updateTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="收货地址：">
              <span>{{ orderExamine?.addressName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="备注：">
              <span>{{ orderExamine?.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="height: calc(100% - 168px);">
      <div style="flex: none;height: 50% !important;" class="ptable-card">
      <XTable
        :pageShow="false"
        height="100%"
        class="ptable-content"
        style="height: 100%;"
        :column-config="{resizable: true}"
        size="mini"
        :data="orderExamine?.orderDetailVoList"
        :border="true"
        toolId="purchaseOrderDetail"
        :columnList="orderDetailColumnList"
        :footer-method="footerMethod"
        show-footer
        show-footer-overflow
        border
      >

      <template #default-isTax="scope">
        <span>{{ scope.row.isTax == '1' ? '是' : '否' }}</span>
      </template>
      </XTable>
      </div>
      <div v-if="confirmationRecordShow" style="flex: none;height: 50% !important;" class="ptable-card">
        <el-divider content-position="left">修改记录</el-divider>

        <XTable
        :showHead="false"
        :pageShow="false"
        :loading="confirmationRecordLoading"
        height="100%"
        class="ptable-content"
        style="height: 100%;"
        :column-config="{resizable: true}"
        size="mini"
        :data="queryRecordList"
        :border="true"

        :columnList="orderRecordColumnList"
        border
      >
      </XTable>
      </div>
      </div>
      <template #footer>
        <el-button :loading="buttonLoading" type="danger" @click="reject"> 驳回 </el-button>
        <el-button :loading="buttonLoading" type="primary" @click="examinePass"> 通过 </el-button>
        <el-button :loading="buttonLoading" @click="dialogExamine.visible = false">取消</el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogChangeAddressAll.visible" :title="dialogChangeAddressAll.title" width="50%" destroy-on-close draggable>
      <XTable
        :showHead="false"
        :pageShow="false"
        height="250"
        :column-config="{resizable: true}"
        size="mini"
        :data="customerAddressList"
        :border="true"
        :columnList="changAddressColumnList"
        @radio-change="radioChangeAddress"
        :radio-config="{

           checkMethod: changAddressAllRadioFun
        }"
        border
      >
        <template #default-status="scope">
          <!-- statusList -->
          {{statusList.find(item=>item.value==scope.row.status)?.label}}
        </template>
      </XTable>
      <template #footer>
        <el-button type="primary" @click="changAddressAllConfirm" :disabled="!addressId"> 确定 </el-button>
        <el-button @click="dialogChangeAddressAll.visible = false">取消</el-button>
      </template>
    </el-dialog>
       <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="id" :biz-code="bizCode"/>

    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign" />

    <!-- 设置交期 -->
    <el-dialog v-model="dialogChangeDeliveryTimeAll.visible" :title="dialogChangeDeliveryTimeAll.title" width="20%" destroy-on-close draggable>

      <el-form-item size="small" label="需求交期：" >
          <el-date-picker
            style="width: 100%;"
            v-model="batchDeliveryTime"
            type="date"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD 23:59:59"
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :clearable="false"
          />
      </el-form-item>
      <template #footer>
        <el-button type="primary" @click="changeDeliveryTimeConfirm" :disabled="!batchDeliveryTime"> 确定 </el-button>
        <el-button @click="dialogChangeDeliveryTimeAll.visible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 设置月结方式 -->
    <el-dialog v-model="dialogChangeMonthlyMethodAll.visible" :title="dialogChangeMonthlyMethodAll.title" width="20%" destroy-on-close draggable>
      <el-form-item size="small" label="月结方式：" >
          <el-select v-model="batchMonthlyMethod" filterable placeholder="请选择月结方式" style="width: 100%;">
            <el-option v-for="dict in monthly_method" :key="dict.value" :label="dict.label" :value="dict.label"></el-option>
          </el-select>
      </el-form-item>
      <template #footer>
        <el-button type="primary" @click="changeMonthlyMethodConfirm" :disabled="!batchMonthlyMethod"> 确定 </el-button>
        <el-button @click="dialogChangeMonthlyMethodAll.visible = false">取消</el-button>
      </template>
    </el-dialog>

        <!-- 提示同供应商采购单拆分 -->
        <el-dialog v-model="splitSupplierOrder.visible" :title="splitSupplierOrder.title" width="40%" destroy-on-close draggable>
          <span>
            以下物料的月结方式、含税方式在同一个供应商内不一致，是否继续操作。
          </span>
          <XTable
            :showHead="false"
            :pageShow="false"
            height="100%"
            class="ptable-content"
            style="height: 100%;"
            :column-config="{resizable: true}"
            size="mini"
            :data="promptList"
            :border="true"
            toolId="splitSupplierOrderDetail"
            :columnList="promptColumnList"
          >
          <template #default-isTax="scope">
            <span>{{ scope.row.isTax == '1' ? '是' : '否' }}</span>
          </template>
          <template #default-supplierId="{ row }">
            {{ SupplierList.filter(item => item.id==row.supplierId).length>0?SupplierList.filter(item => item.id==row.supplierId)[0].supplierName:'' }}
          </template>
          </XTable>
          <template #footer>
            <el-button type="primary" @click="confirmSplit" > 确定 </el-button>
            <el-button @click="splitSupplierOrder.visible = false">取消</el-button>
          </template>
        </el-dialog>

  </div>
</template>

<script setup name="PurchaseHandle" lang="ts">
import { getSupplierMaterialPrice ,getDefaultSupplierMaterialPrice,getDefaultSupplierMaterialPriceByRawIds,getSupplierMaterialPriceInfo} from '@/api/purchase/materialApply';
import { MaterialApplyQuery, MaterialApplyForm, RawMaterialVO } from '@/api/purchase/materialApply/types';

import { listMaterialOrderDetail,saveOrderDetailList ,submitOrderDetailList,checkOrderDetailList,updateMaterialOrderDeliveryTime ,updateMaterialApplyDeliveryTime} from '@/api/purchase/materialHandleDetail';
import { MaterialOrderDetailVO } from '@/api/purchase/materialHandleDetail/types';
import { operateRecordList } from '@/api/purchase/materialOrder';
import { listMaterialOrder, getMaterialOrder, modifyStatus, updateMaterialOrder, setMainOrder, modifyDetailStatus } from '@/api/purchase/materialHandle';
import { MaterialOrderVO,StatusStrings } from '@/api/purchase/materialHandle/types';
import { listCustomerAddressByOwnerId } from '@/api/basedata/customerAddress';
import { ElTable } from 'element-plus';
import useUserStore from '@/store/modules/user';
import { SupplierVO } from "@/api/basedata/supplier/types";
import { listSupplier,getSupplier} from '@/api/basedata/supplier';
import { listRawMaterialCategoryNoPage } from '@/api/basedata/rawMaterialCategory';
import { deepClone } from '@/utils'
import { VxeTableEvents } from 'vxe-table'
import {RecordVO} from "@/api/purchase/record/types";
import { decryptBase64ByStr } from '@/utils/crypto'

// 查询操作记录
const queryRecordList = ref<RecordVO[]>([]);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
// 金额千分号，逗号分隔,
 const priceFormat = (val: number|string, float: number = 2) => {
let num: string | number = Number(val || 0)
if (float <= 0) {
 num = num.toString().replace(/^-?\d+/g, (m: string) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
 } else {
num = num.toFixed(float).toString().replace(/^-?\d+/g, (m: string) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
 return num
}

const dialogMaterial = reactive<DialogOption>({
  visible: false,
  title: ''
});
const dialogChangeAddressAll = reactive<DialogOption>({
  visible: false,
  title: '批量修改收货地址'
});
//本厂收货地址
const customerAddressList = ref<any[]>([]);
const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});
const editableTabsValue = ref(1);
const waitHandleTableRef = ref()

/**合并采购单弹窗 */
const dialogMerge = reactive<DialogOption>({
  visible: false,
  title: ''
});
const radioTable = ref('待受理列表');

//选中的物料
const selectInventoryList = ref<RawMaterialVO[]>([]);
//确认选中的物料
const confirmSelectInventoryList = ref<RawMaterialVO[]>([]);
const loading = ref(true);

//是否展示确认记录
const confirmationRecordShow = ref(false);
const confirmationRecordLoading = ref(true);
const addressId = ref('');
const expandLoading = reactive({});

//待受理物料总数
const totalMaterial = ref(0);
//待审核物料总数
const total = ref(0);
//待提交物料总数
const totalWaitSubmit = ref(0);

const InventoryTableRef = ref<InstanceType<typeof ElTable>>()
const materialOrderRef = ref<InstanceType<typeof ElTable>>()
const materialCheckOrderRef = ref()
const materialCheckOrderRefSubmit = ref()
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//受理按钮
const multiple = ref(true);
//受理存在不同的收货地址
const hasDifferentAddress = ref(false);
//合并采购单按钮
const mergeMultiple = ref(true);

//待受理的ids
const waitIds = ref<Array<string | number>>([]);

//采购明细列表
const materialOrderDetailList = ref<MaterialOrderDetailVO[]>([]);

//待受理明细列表
const HandleDetailList = ref<MaterialOrderDetailVO[]>([]);
const waitHandleDetailList = ref<MaterialOrderDetailVO[]>([]);
const statusList = ref([
  { label: '启用', value: "1" },
  { label: '已禁用', value: "0" },
]);
const secordConfirm = ref(false);
const columnListMergeOrder = ref([
{ title: '采购单号',field: 'code',align: 'center',  },
{ title: '供应商名称',field: 'supplierName',align: 'center',  },
{ width: '380',title: '收货地址',field: 'addressName',align: 'center',  },
{ title: '备注',field: 'remark',align: 'center',  },
{ width: '260',title: '操作',field: 'make',fixed: 'right',align: 'center',  },
]);
const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()
/** 是否禁选 */
const changAddressAllRadioFun = (scope:any) => {
    return scope.row.status=='1';
    // return true;
}

/** 检测收货地址是否相同 */
const checkAddreHasDifferent = async () => {
  hasDifferentAddress.value = false;

  //遍历waitHandleDetailList.value，找出addressId不同的数据
  waitHandleDetailList.value.forEach((item) => {
    if (item.addressId != waitHandleDetailList.value[0].addressId) {
      hasDifferentAddress.value = true;
    }
  });

}
/** 批量修改收货地址-确认 */
const changAddressAllConfirm = async () => {

  //检测是否有选中的地址
  if(addressId.value){
   //将waitHandleDetailList.value中的addressId全部改为addressId
    waitHandleDetailList.value.forEach(item => {
      item.addressId = addressId.value;
    })
  }
  checkAddreHasDifferent();
  dialogChangeAddressAll.visible = false
}

/** 批量修改地址弹窗单选*/
const radioChangeAddress =  ({row}) => {
  if(row?.status==0){
    return;
  }
  if(row?.id){
    addressId.value = row.id;
  }
}

/** 打开批量修改地址弹窗 */
const changeAddressAllOpen = async () => {
  dialogChangeAddressAll.visible=true;
}
/**
 * 将待受理列表中所有的addressId改为addressId
 */
const changeAddressAll = () => {
   console.log('changeAddressAll',addressId.value);
   //将waitHandleDetailList.value中的addressId全部改为addressId
    waitHandleDetailList.value.forEach(item => {
      item.addressId = addressId.value;
    })
}
/**
 * 手动清空
 */
const clearWaitHandleDetailList = () => {
   const $table = waitHandleTableRef.value.xTableRef
      $table.clearCheckboxReserve();
     $table.clearCheckboxRow();
}

const selectAllChangeEvent: VxeTableEvents.CheckboxAll<RawMaterialVO> = () => {
  const $table = waitHandleTableRef.value.xTableRef
  if ($table) {
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
    HandleDetailList.value = selectRecords.map(item => item);
  }
   multiple.value = !HandleDetailList.value.length;
  disableWaitHandleCheck();
}
const disableWaitHandleCheck = () => {
  // if(HandleDetailList&&HandleDetailList.value.length>0){
  //   let row = HandleDetailList.value[0];
     //获取row中的物料类别id
  // const categoryId = row.categoryId;


  //遍历materialOrderList.value，找出supplierId和addressId和applyUserId 任何一项不同的数据 把它设置为禁选
  // materialOrderDetailList.value.forEach((item) => {
  //
  //   if (item.categoryId != categoryId ) {
  //     item.disabled = true;
  //   }else{
  //     item.disabled = false;
  //   }
  // });
  // }
  //  if (HandleDetailList.value?.length == 0) {
  //   materialOrderDetailList.value.forEach((item) => {
  //     item.disabled = false;
  //   });
  // }
}
/** 时间禁选*/
const disabledDate = (date:any) => {

   const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;

}
/** 多选框选中数据 */
const handleSelectionChange = (selection: MaterialOrderDetailVO[]) => {
  waitIds.value = selection.map(item => item.id);
  waitHandleDetailList.value = selection;
  multiple.value = !selection.length;
}

/** 查询采购明细列表 */
const getOrderDetailList = async () => {
  waitHandleDetailList.value = [];
  loading.value = true;
  const res = await listMaterialOrderDetail(materialQueryParams.value);
  materialOrderDetailList.value = res.rows;
  totalMaterial.value = res.total;
  loading.value = false;
}
/**查询采购订单列表 */
const materialOrderList = ref<MaterialOrderVO[]>([]);

/**选中的采购订单列表 */
const selectedOrderList = ref<MaterialOrderVO[]>([]);

/**待提交页面选中的采购订单列表 */
const selectedOrderWaitList = ref<MaterialOrderVO[]>([]);

/**审核订单明细对象 */
const orderExamine = ref<MaterialOrderVO>();

/**待提交对象 */
const waitSubmit = ref<MaterialOrderVO>();


//供应商列表
let SupplierList = ref([]);
/**
 * 获取供应商列表
 */
const getSupplierList = async () => {
  const SupplierResponse: any = await listSupplier();
  SupplierList.value = SupplierResponse.rows.filter((v:any) => v.status == '1');



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

const initFormData: MaterialApplyForm = {
  id: undefined,
  code: undefined,
  applyType: undefined,
  deliverTime: undefined,
  addressId: undefined,
  applyUserId: undefined,
  applyTime: undefined,
  remark: undefined,
  status: undefined,
  inventoryList: [],
  materialApplyDetailsList: []
}
const materialQueryParams: any= ref({
  pageNum: 1,
  pageSize: 20,
  code: undefined,
  materialCode:undefined,
  categoryId: undefined,
  name: undefined,
  specification: undefined,
  materialQuality: undefined,
  units: undefined,
  manufacturer: undefined,
  supplier: undefined,
  color: undefined,
  level: undefined,
  copperThickness: undefined,
  length: undefined,
  width: undefined,
  status: undefined,
  fileId: undefined,
  boardThickness: undefined,
  params: {}
})
const waitSubmitQueryParams: any= ref({
  pageNum: 1,
    pageSize: 20,
    applyCode: undefined,
    applyType: undefined,
    deliverTime: undefined,
    addressId: undefined,
    applyUserId: undefined,
    applyTime: undefined,
    remark: undefined,
    status: undefined,
    params: {
    }
})
const data = reactive<PageData<MaterialApplyForm, MaterialApplyQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    applyCode: undefined,
    applyType: undefined,
    deliverTime: undefined,
    addressId: undefined,
    applyUserId: undefined,
    applyTime: undefined,
    remark: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {

    addressId: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],
    ApplyDetailsList: [
      { required: true, message: "物料不能为空", trigger: "blur" }
    ],
  }
});


const { queryParams, form, rules } = toRefs(data);


/**
 * 物料类别下拉列表
 */
const rawMaterialCategory = ref([]);

const getListRawMaterialCategorys = async () => {
  const res: any = await listRawMaterialCategoryNoPage();

  rawMaterialCategory.value = res;
}


const { order_material_level: orderMaterialLevelList, units_type: unitsTypeList, order_plate_brand: orderPlateBrandList } = toRefs<any>(proxy?.useDict("order_material_level", "units_type", "order_plate_brand"));



const handleColumnList = ref([
{ width:'100',title:'申请单号',field:'code',align:'center', },
{ width:'100',title:'物料编码',field:'materialCode',align:'center', },
{ title:'物料名称',field:'name',align:'center',width:'100' },
{ title: '物料类别', field: 'categoryName', width: '80', align: 'center'},
{ title: '单位名称', field: 'units', width: '80', align: 'center' },
{ title: '材质牌号', field: 'materialQuality', width: '80', align: 'center' },
{ title: '品牌', field: 'manufacturer', width: '80', align: 'center' },
{ title: '厚度', field: 'thickness', width: '80', align: 'center' },
{ title: '规格型号', field: 'specification', width: '80', align: 'center' },
{ title: '铜厚', field: 'copperThickness', width: '80', align: 'center' },
{ title: '板厚', field: 'boardThickness', width: '80', align: 'center' },
{ title: '直径', field: 'diameter', width: '80', align: 'center' },
{ title: '长(mm)', field: 'length', width: '80', align: 'center' },
{ title: '宽(mm)', field: 'width', width: '80', align: 'center' },
{ title: '颜色', field: 'color', width: '80', align: 'center' },
{ title: '级别', field: 'level', width: '80', align: 'center' },
{ title:'申请备注',field:'applyRemark',align:'center',  width:'100'},
 { title: '实际库存', field: 'actualStock', width: '80', align: 'center', },
  { title: '在途数量', field: 'onWayStock', width: '120', align: 'center',},
{ width:'150',title:'供应商名称',field:'supplierId', align:'center', },
{ width:'80',title:'月结方式',field:'monthlyMethod', align:'center', },
{ width:'60',title:'是否含税',field:'isTax', align:'center', },
{ width:'100',title:'供应商基价',field:'supplierPrice', align:'center', },

{ title:'申请数量',field:'applyQuantity',align:'center',   width:'100'},
{ width:'125',title:'要求交期',field:'deliverTime',align:'center', },
{ title:'采购单价',field:'price',align:'center',   width:'100'},
{ title:'单价区间',field:'modificationPrice',align:'center',   width:'100'},
{ title:'采购数量',field:'quantity',align:'center',  width:'100'},
{ title:'采购金额',field:'totalPrice',align:'center',   width:'100'},
{ title:'收货地址',field:'addressId',align:'center',  width:'240' },
{ title:'操作',field:'make',align:'center', fixed: 'right',  width:'100' },
]);

const recordCondition = ['applyTime'];

//待受理表格
const waitHandleColumnList = ref([

  { type: 'checkbox', align: 'center', field: "checkbox", width: '40', },
  { title: '申请单号', field: 'code', width: '160', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入申请单号' } },
  { title: '需求来源', field: 'type', align: 'center',  width: '80' },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } },
  { title:'申请时间',field:'applyTime',align:'center',width:'120' ,
    filterType: 'intervalDate', filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: '单位名称', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入厚度' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入板厚' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '默认供应商', field: 'supplierName', width: '160', align: 'center', filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '长(mm)', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽(mm)', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },

  { title: '需求数量', field: 'applyQuantity', align: 'center' , width: '80'},
  { title: '申请备注', field: 'applyRemark', align: 'center' , width: '120'},
  { title: '收货地址', field: 'addressName',width: '260', align: 'center'},
  { title: '状态', field: 'status', align: 'center', width: '80'},
  { title: '实际库存', field: 'actualStock', width: '80', align: 'center',filterType: 'intervalNumber', },
  { title: '在途数量', field: 'onWayStock', width: '120', align: 'center',filterType: 'intervalNumber',},
]);


const columnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '40', },
  { title:'序号',type: 'seq', align: 'center', visible: false,  width: '40', },
  { field: 'expand', align: 'center', type: "expand", width: '30' },
  { title: '采购单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '供应商名称', field: 'supplierName',width:'200', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '收货地址', field: 'addressName',width:'400', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收货地址' } },
  { title: '状态', field: 'status', align: 'center', },
  { title: '受理人', field: 'submitUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入受理人' } },
  { title: '受理时间', field: 'updateTime', align: 'center', filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
    }},
  { width:'60',title:'总金额',field:'totalPrice', align:'center', },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '操作', width: '260',field:'make', align: 'center',fixed:'right',  showOverflow:false},
]);

const columnListWait = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '40', },
  { title:'序号',type: 'seq', align: 'center', visible: false,  width: '40', },
  { field: 'expand', align: 'center', type: "expand", width: '30' },
  { title: '采购单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '供应商名称', field: 'supplierName',width:'200', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '收货地址', field: 'addressName',width:'400', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收货地址' } },
  { title: '状态', field: 'status', align: 'center', },
  { title: '受理人', field: 'submitUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入受理人' } },
  { title: '受理时间', field: 'updateTime', align: 'center', filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
    }},

  { width:'60',title:'总金额',field:'totalPrice', align:'center', },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '操作', width: '260',field:'make',fixed: 'right',  align: 'center',  showOverflow:false},
]);

const materialColumnList = ref([
  { title:'序号',type: 'seq', align: 'center', width: '40', },
  { title: '物料编码', field: 'materialCode', align: 'center',width: '80', },
  { title: '物料名称', field: 'name', align: 'center',width: '80', },
   { title: '物料类别', field: 'categoryName', align: 'center',width: '80', },
   { title: '单位名称', field: 'units', width: '80', align: 'center', },
  { title: '材质牌号', field: 'materialQuality', align: 'center',width: '80', },
   { title: '品牌', field: 'manufacturer', align: 'center', width: '80',},
  { title: '厚度', field: 'thickness', width: '80', align: 'center', },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', },
  { title: '铜厚', field: 'copperThickness', width: '50', align: 'center', },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', },
  { title: '直径', field: 'diameter', width: '80', align: 'center',},
  { title: '默认供应商', field: 'supplierName', width: '100', align: 'center', },
  { title: '长', field: 'length', width: '80', align: 'center', },
  { title: '宽', field: 'width', width: '80', align: 'center', },
  { title: '颜色', field: 'color', width: '80', align: 'center', },
  { title: '级别', field: 'level', width: '80', align: 'center', },
  { title: '申请备注', field: 'applyRemark',width: '80', align: 'center', },
  { title: '申请数量', field: 'applyQuantity', align: 'center',  width: '80',},
  { title: '采购数量', field: 'quantity', align: 'center', width: '80', },
  { title: '采购单价', field: 'price', align: 'center', width: '80', },
  { title: '采购金额', field: 'totalPrice', align: 'center', width: '80', },
  { title: '要求交期', field: 'deliverTime', width: '200', align: 'center', },
  { width:'80',title:'月结方式',field:'monthlyMethod', align:'center',},
  { width:'100',title:'是否含税',field:'isTax', align:'center', },
]);
const changAddressColumnList = ref([
  { type: 'radio', align: 'center', field: "radio", width: '40', },
  { title: '联系人', field: 'name', align: 'center',  },
  { title: '联系电话', field: 'phone', align: 'center',  },
  { title: '联系地址', field: 'address',width:'300', align: 'center',},
  { title: '备注', field: 'remark', align: 'center' },
  { title: '状态', field: 'status', align: 'center', },
]);
const orderDetailColumnList = ref([
  { width:'60',title:'序号',align:'center',type:'seq'},
  { width:'120',title:'物料编码',field:'materialCode',align:'center',  },
  { width:'80',title:'物料名称',field:'name',align:'center',  },
  { width:'80',title:'物料类别',field:'categoryName',align:'center',  },
  { width:'80',title:'材质牌号',field:'materialQuality',align:'center',  },
  { title:'规格参数',field:'materialSpecification',align:'center',  },
  { width:'80',title:'采购数量',field:'quantity',align:'center',  },
  { width:'120',title:'申请备注',field:'applyRemark',align:'center',  },
  { width:'80',title:'单价',field:'price',align:'center',  },
  { width:'60',title:'单位',field:'units',align:'center',  },
  { width:'100',title:'总价',field:'totalPrice',align:'center',  },
  { width:'120',title:'要求交期',field:'deliverTime',align:'center',  },
  { width:'80',title:'月结方式',field:'monthlyMethod', align:'center',},
  { width:'100',title:'是否含税',field:'isTax', align:'center', },
]);
const orderRecordColumnList = ref([
 { width:'60',title:'序号',align:'center',type:'seq'},
{ title:'所属单位',field:'ownerName',align:'center',  },
{ width:'140',title:'物料名称',field:'materialName',align:'center',  },
{ width:'80',title:'操作人',field:'createByName',align:'center',  },
{ width:'160',title:'操作时间',field:'createTime',align:'center',  },
{ title:'操作内容',field:'operateContent',align:'center',  },
{ width:'160',title:'确认备注',field:'remark',align:'center',  },
]);

  //拆分提示
  const promptList = ref([]);
  const promptColumnList = ref([
    { width:'60',title:'序号',align:'center',type:'seq'},
    { width:'80',title:'物料编码',field:'materialCode',align:'center',  },
    { width:'120',title:'物料名称',field:'name',align:'center',  },
    { title: '供应商', field: 'supplierId', align: 'center', },
    { width:'80',title:'月结方式',field:'monthlyMethod', align:'center', },
    { width:'60',title:'是否含税',field:'isTax', align:'center', },
  ]);

// 切换菜单栏
const radioTableHandle = async (params?: any) => {
  console.log(editableTabsValue.value);

  if (1 == editableTabsValue.value) {
    if (params) {
      materialQueryParams.value = params
    }
    await getOrderDetailList();
    disableWaitHandleCheck();

  } else if (2 == editableTabsValue.value) {

    if (params) {
      queryParams.value = params
    }
    queryParams.value.status = "2";
    await getListWaitExamine();
    disableCheck();
    materialCheckOrderRef.value.xTableRef.clearRowExpand();
  } else if (3 == editableTabsValue.value) {
    if (params) {
      waitSubmitQueryParams.value = params
    }
    waitSubmitQueryParams.value.status = undefined;
    await getListWaitSubmit();
    materialCheckOrderRefSubmit.value.xTableRef.clearRowExpand();
  }
}

const listRadio = async () => {
  radioTableHandle(null);
}

/**
 * 查询物料集合是否有供应商 基价
 * @param data
 */
const getDefaultSupplierPrice = async () => {

   //得到waitHandleDetailList 的 id集合
  const ids = waitHandleDetailList.value.map(item => item.id);
  if (ids.length == 0) {
    return;
  }

  const res =  await getDefaultSupplierMaterialPrice(ids);

  let priceList= res.data;
  //遍历waitHandleDetailList.value，把supplierPrice设置为priceList中的supplierPrice
  waitHandleDetailList.value.forEach((item) => {
    //在priceList 中找到supplierId和rawMaterialId都相同的数据
    let basice =priceList.find(price=>price.rawMaterialId==item.rawMaterialId);
    if (basice) {
      item.modificationPrice = basice.modificationPrice;
      item.supplierPrice = basice.price;
      item.supplierId = basice.supplierId;
      item.disabled = true;
    }
    item.quantity= item.applyQuantity
    item.price = item.supplierPrice;
    if(item.price&&item.quantity){
      item.totalPrice = BigNumber(item.price).times(BigNumber(item.quantity));
    }
    if(item.totalPrice){
      item.totalPrice = item.totalPrice;
    }else{
      item.totalPrice = 0;
    }
    //  item.totalPrice = item.totalPrice.toFixed(2);
    //供应商月结含税
    let supMon =SupplierList.value.find(sup=>sup.id==item.supplierId);
    if(supMon){
      item.isTax = supMon.isTax;
      item.monthlyMethod = supMon.monthlyMethod;
    }
  });
};

/**
 * 查询供应商物料价格
 * @param data
 */
const getSupplierPrice = async (row: any) => {
  const supplierId = row.supplierId;
  const materialId = row.rawMaterialId;
  const res =  await getSupplierMaterialPriceInfo(supplierId, materialId);
  if(res.data){
    row.supplierPrice = res.data.price;
    row.modificationPrice = res.data.modificationPrice;
  }else{
    row.supplierPrice = undefined;
    row.modificationPrice = undefined;
  }
  if (row.supplierPrice) {
    row.price = row.supplierPrice;
    //row.totalPrice = row.price * row.quantity;
    if(row.price&&row.quantity){
      row.totalPrice = BigNumber(row.price).times(BigNumber(row.quantity));
    }else{
      row.totalPrice = 0
    }
    row.disabled = true;
  }else{
    row.disabled = false;
  }
  const supRes = await getSupplier(supplierId);
  if(supRes?.code=='200'){
    row.monthlyMethod=supRes.data?.monthlyMethod;
    row.isTax=supRes.data?.isTax;
  }

};
/**
 * 计算价格
 * @param data
 */
const calculatePrice = async (row: any) => {

   //获得单价
    const price = row.price;
    //获得数量
    const quantity = row.quantity;
    //判断单价和数量是否为空
    if (price == undefined || quantity == undefined) {
      return;
    }

    //计算总价
    //row.totalPrice = price * quantity;
    if(price&&quantity){
      row.totalPrice = BigNumber(price).times(BigNumber(quantity));
    }else{
      row.totalPrice = 0
    }
    //row.totalPrice = row.totalPrice.toFixed(4);

    //手动重算
    if(waitHandleDetailRef.value.xTableRef){
      waitHandleDetailRef.value.xTableRef.updateFooter()
    }
};
/**
 * 修改供应商价格
 * @param data
 */
const calculateSupplierPrice = async (row: any) => {

  row.price = row.supplierPrice;
  //row.totalPrice = row.price * row.quantity;
  if(row.price&&row.quantity){
    row.totalPrice = BigNumber(row.price).times(BigNumber(row.quantity));
  }else{
    row.totalPrice = 0
  }

       //手动重算
  if(waitHandleDetailRef.value.xTableRef){
      waitHandleDetailRef.value.xTableRef.updateFooter()
  }
  //  //获得单价
  //   const price = row.price;
  //   //获得数量
  //   const quantity = row.quantity;
  //   //判断单价和数量是否为空
  //   if (price == undefined || quantity == undefined) {
  //     return;
  //   }
  //   //计算总价
  //   row.totalPrice = price * quantity;

};

  // const {proxy} = getCurrentInstance() as ComponentInternalInstance;
/** 查询地址列表 */
const getCustomerAddressList = async () => {

  const res = await listCustomerAddressByOwnerId();
  customerAddressList.value = res.data;
  if (customerAddressList.value?.length > 0) {
    //过滤掉状态为0的数据
    customerAddressList.value = customerAddressList.value.filter(item => item.status == '1');
  }

}
/** 受理 */
const waitCheck = async () => {

    if(HandleDetailList.value.length==0){
      //提示
      ElMessage.error(`请选择受理物料`)
      return;
    }

  //   HandleDetailList.value.forEach((item) => {

  //   if (item.categoryId != HandleDetailList.value[0].categoryId ) {
  //     //提示
  //     ElMessage.error(`请选择同一物料类别`)
  //      return;
  //   }
  // });
   waitHandleDetailList.value = deepClone(HandleDetailList.value)

  checkOrderDetailList(waitHandleDetailList.value).then(async () => {
    getCustomerAddressList();
    proxy?.$modal.loading("加载中...");
    await getDefaultSupplierPrice();
    proxy?.$modal.closeLoading();
    checkAddreHasDifferent();
    waitHandleDetailList.value.map((v)=>{
      const itemSupplier =  SupplierList.value.find((vo)=> vo.id == v.supplierId)
      if(!itemSupplier){
        v.supplierId = undefined;
        v.isTax = undefined;
        v.monthlyMethod = undefined;
      }
    })
    dialogMaterial.title="采购受理";
    //重置供应商含税校验
    secordConfirm.value = false;
    confirmCallback.value = undefined;
    dialogMaterial.visible=true;
   }).catch((err) => {
     //清除勾选
     const $table = waitHandleTableRef.value.xTableRef
    if ($table) {
      // $table.clearCheckboxReserve();
      $table.clearCheckboxReserve();
      $table.clearCheckboxRow();
      HandleDetailList.value = [];
      waitHandleDetailList.value = [];
    }
     listRadio();
   });
}

/** 提交*/
const checkPass = async (row?: any) => {
   getCustomerAddressList();
 proxy?.$modal.loading("加载中...");
  await getMaterialOrder(row.id).then((res) => {
    waitSubmit.value = res.data
    waitHandleDetailList.value = waitSubmit.value.orderDetailVoList;
    waitHandleDetailList.value.forEach((item) => {
      if (item.supplierPrice) {
        item.disabled = true;
      }
      const itemSupplier =  SupplierList.value.find((vo)=> vo.id == item.supplierId)
      if(!itemSupplier){
        item.supplierId = undefined;
        item.isTax = undefined;
        item.monthlyMethod = undefined;
      }

      //设置月结方式
      // item.monthlyMethod = waitSubmit.value.monthlyMethod;
      // item.isTax = waitSubmit.value.isTax;
    });

  });

  //因为不确定是不是要基价逻辑，这里暂只去浮动值
  console.log(waitHandleDetailList)
  const ids = waitHandleDetailList.value.map(item => item.rawMaterialId);
  if (ids.length == 0) {
    return;
  }
  const res =  await getDefaultSupplierMaterialPriceByRawIds(ids);
  let priceList= res.data;
  //遍历waitHandleDetailList.value，把supplierPrice设置为priceList中的supplierPrice
  waitHandleDetailList.value.forEach((item) => {
      //在priceList 中找到supplierId和rawMaterialId都相同的数据
  let basice =priceList.find(price=>price.rawMaterialId==item.rawMaterialId);
  if (basice) {
    item.modificationPrice = basice.modificationPrice;
  }
});



  //重置供应商含税校验
  secordConfirm.value = false;
  confirmCallback.value = undefined;
  // await getDefaultSupplierPrice();
  proxy?.$modal.closeLoading();
   dialogMaterial.visible = true;
    dialogMaterial.title = '订单编辑';
}
const uploadVisible = ref(false);
const signVisible = ref(false);
// 文件上传类型
const moduleCode = ref('5');
const bizType = ref('15');
const id = ref<string | number>();
const bizCode = ref<string>();
/** 查询上传文件记录 */
const handleUpload = async (row: any) => {
  uploadVisible.value = true;
  id.value = row.id;
  bizCode.value = row.code;
}

/** 合并采购单 */
const mergeCheck = async () => {
  dialogMerge.visible =true
}

/** 设为主单 */
const setMain = async (row:any) => {
  await proxy?.$modal.confirm('是否确认将采购单号为:'+row?.code+'"的数据项【设为主单】？').finally(() => loading.value = false);
  //遍历selectedOrderList.value，把selectedOrderList.value中的id,装成一个数组
  let ids = selectedOrderList.value.map(item => item.id);
  await setMainOrder(row.id, ids);
  await radioTableHandle(null);
  dialogMerge.visible = false
   const $table = materialCheckOrderRef.value.xTableRef
  $table.clearCheckboxReserve();
  $table.clearCheckboxRow();
  selectedOrderList.value=[];

  materialCheckOrderRef.value.xTableRef.clearRowExpand();
}
/** 审核采购单 */
const examineCheck = async (expandedRows: any) => {
  dialogExamine.visible =true
  loading.value = true
  //确认记录loading
  confirmationRecordLoading.value = true
  //是否显示确认记录
  confirmationRecordShow.value = false;
  queryRecordList.value = [];
  await getMaterialOrder(expandedRows.id).then((res) => {
    orderExamine.value = res.data
    loading.value = false
  });
  // console.log(orderExamine.value?.supplierSwitch);
  //如果无纸化开关为1，显示确认记录
  if(orderExamine.value?.supplierSwitch=="1"){
      confirmationRecordShow.value = true;
      const res = await operateRecordList({id: expandedRows.id});
      queryRecordList.value = res.rows;
  }
  confirmationRecordLoading.value = false;

}
/** 审核驳回 */
const reject = async () => {
  // 获取orderExamine的id
  buttonLoading.value = true;
  await modifyStatus(orderExamine.value?.id as number, "4", orderExamine.value?.supplierId as number, orderExamine.value?.supplierSwitch).finally(() => { buttonLoading.value = false; });
  //清除勾选orderExamine.value?.id
  const $table = materialCheckOrderRef.value.xTableRef
  if ($table) {
        let order = selectedOrderList.value.filter(item => item.id == orderExamine.value?.id);
        $table.setCheckboxRow(order, false);
    }
    selectedOrderList.value = selectedOrderList.value.filter(item => item.id != orderExamine.value?.id);
    mergeMultiple.value = !(selectedOrderList.value.length > 1);

  await getListWaitExamine();
  dialogExamine.visible = false
}
/** 审核通过 */
const examinePass = async () => {
  // 无纸化开关打开则需选择签章并且没有签过
  if(orderExamine.value?.supplierSwitch == '1' && !orderExamine.value?.existSignHistory) {
    // 查询是否存在默认签章
    const res = await queryUseModule({useModule: '1'});
    // 存在则自动签名
    if(res.data) {
      submitSign(res.data.key, res.data.signType);
    } else {
      signVisible.value = true;
    }
  } else {
    // 获取orderExamine的id
    buttonLoading.value = true;
    await modifyStatus(orderExamine.value?.id as number, "3", orderExamine.value?.supplierId as number, orderExamine.value?.supplierSwitch).finally(() => { buttonLoading.value = false; });
    const $table = materialCheckOrderRef.value.xTableRef
    if ($table) {
      let order = selectedOrderList.value.filter(item => item.id == orderExamine.value?.id);
      $table.setCheckboxRow(order, false);
    }
    selectedOrderList.value = selectedOrderList.value.filter(item => item.id != orderExamine.value?.id);
    mergeMultiple.value = !(selectedOrderList.value.length > 1);
    await getListWaitExamine();
    dialogExamine.visible = false
  }
}


const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<MaterialOrderDetailVO> = ({ row, rowIndex }) => {

  //如果expandedRows.inventoryList为空就去获取详情
  if (!row.orderDetailVoList) {
    row.loading = false;
    getMaterialOrder(row.id).then((res) => {
      row.orderDetailVoList = res.data.orderDetailVoList;
      row.loading = true;
    });
  }
}

/**展开行触发*/
const handleExpand = (expandedRows: any) => {
  //如果expandedRows.inventoryList为空就去获取详情
  if (!expandedRows.orderDetailVoList) {
     expandedRows.loading = false;
    getMaterialOrder(expandedRows.id).then((res) => {
      expandedRows.orderDetailVoList = res.data.orderDetailVoList;
      expandedRows.loading = true;
    });
  }

}
//待审核列表
const selectOneChangeEvent: VxeTableEvents.CheckboxAll<MaterialOrderVO> = ({ checked,row }) => {
  const $table = materialCheckOrderRef.value.xTableRef
  if ($table) {
    const records =$table.getCheckboxReserveRecords().concat( $table.getCheckboxRecords());
    selectedOrderList.value = records.map(item => item);
  }
   mergeMultiple.value = !(selectedOrderList.value.length > 1);
  disableCheck();

}
//待提交列表
const selectOneChangeEventWait: VxeTableEvents.CheckboxAll<MaterialOrderVO> = ({ checked,row }) => {
  const $table = materialCheckOrderRefSubmit.value.xTableRef
  if ($table) {
    const records =$table.getCheckboxReserveRecords().concat( $table.getCheckboxRecords());
    selectedOrderWaitList.value = records.map(item => item);
  }
}

const disableCheck = () => {
  if(selectedOrderList&&selectedOrderList.value.length>0){
    let row = selectedOrderList.value[0];
     //获取row中的供应商id
  const supplierId = row.supplierId;
  //获取row中的地址id
  const addressId = row.addressId;
  //获取row中的受理人id
  const applyUserId = row.submitUserId;

  //遍历materialOrderList.value，找出supplierId和addressId和applyUserId 任何一项不同的数据 把它设置为禁选
  materialOrderList.value.forEach((item) => {

    if (item.supplierId != supplierId || item.addressId != addressId || item.submitUserId != applyUserId) {
      item.disabled = true;
    }else{
      item.disabled = false;
    }
  });
  }
   if (selectedOrderList.value?.length == 0) {
    materialOrderList.value.forEach((item) => {
      item.disabled = false;
    });
  }
}

/** 选择物料多选框选中数据 */
const selectOne = (selection: MaterialOrderVO[], row: MaterialOrderVO) => {

  // 用id判断selectInventoryList.value中是否包含row
  let selected = selectedOrderList.value.some(item => item.id == row.id);
  //用id判断selection.value中是否包含row
  let checkSelection = selection.some(item => item.id == row.id);
  //如果checkSelection为true，说明是选中，否则是取消选中
  //往selectInventoryList.value中添加数据
  if (!selected) {
    selectedOrderList.value.push(row);
  } else {
    if (!checkSelection) {
      //移除selectInventoryList.value中包含row的数据
      selectedOrderList.value = selectedOrderList.value.filter(item => item.id != row.id);
    }
  }
  mergeMultiple.value = !(selectedOrderList.value.length > 1);

  //获取row中的供应商id
  const supplierId = row.supplierId;
  //获取row中的地址id
  const addressId = row.addressId;
  //获取row中的受理人id
  const applyUserId = row.submitUserId;

  //遍历materialOrderList.value，找出supplierId和addressId和applyUserId 任何一项不同的数据 把它设置为禁选
  materialOrderList.value.forEach((item) => {

    if (item.supplierId != supplierId || item.addressId != addressId || item.submitUserId != applyUserId) {
      item.disabled = true;
    }
  });
  if(selection.length==0){
    materialOrderList.value.forEach((item) => {
      item.disabled=false;
    });
  }



}
/** 是否禁选 */
const selectableFun = (scope:any) => {
    return !scope.row.disabled;
    // return true;
}

/** 查询待审核的采购订单列表 */
const getListWaitExamine = async () => {
  loading.value = true;
  const res = await listMaterialOrder(queryParams.value);
  materialOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询采购订单列表 */
const getListWaitSubmit = async () => {
  loading.value = true;
  const res = await listMaterialOrder(waitSubmitQueryParams.value);
  materialOrderList.value = res.rows;
  totalWaitSubmit.value = res.total;
  loading.value = false;
}


/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  // materialApplyFormRef.value?.resetFields();
}
/** 新增表单重置 */
const confirmReset = () => {
  //遍历selectInventoryList 设置未选中
  selectInventoryList.value.forEach((item) => {
    InventoryTableRef.value?.toggleRowSelection(item, false);
  });
  selectInventoryList.value.length = 0;
  confirmSelectInventoryList.value.length = 0;
}

const confirmCallback = ref();
/**
 * 保存前的校验
 */
const saveValidate = (callback) => {
  //遍历waitHandleDetailList 判断 supplierPrice 和 quantity 和 price 和 totalprice和deliverTime 是否为空
  let check = false;
  let msg = "";
  waitHandleDetailList.value.forEach((item) => {
    if (!item.supplierId) {
      check = true;
      msg = "供应商不能为空"
      return;
    }
    //判断item.applyNum>0
    if (!item.supplierPrice||item.supplierPrice<=0) {
      check = true;
      msg = "供应商基价不能为空"
      return;
    }
    if (item.quantity == undefined||item.quantity<=0) {
      check = true;
      msg = "采购数量不能为空"
      return;
    }
    if (item.price == undefined || item.price <= 0) {
      check = true;
      msg = "请输入采购单价"
      return;
    }
    if (!item.deliverTime) {
      check = true;
      msg = "要求交期不能为空"
      return;
    }
    if (item.totalPrice == undefined || item.totalPrice <= 0) {
      check = true;
      msg = "采购金额不能小于等于0"
      return;
    }
    if (!item.monthlyMethod) {
      check = true;
      msg = "月结方式不能为空"
      return;
    }

    if (!item.isTax) {
      check = true;
      msg = "是否含税不能为空"
      return;
    }
  });
  if (check) {
    proxy?.$modal.msgError(msg);
    return false;
  }
  if(secordConfirm.value){
    return true;
  }
  confirmCallback.value=callback;
  return saveValidateSplit();

  return true;
}
//通过，确认要切割
const confirmSplit = ()=>{
  secordConfirm.value = true;
  splitSupplierOrder.visible = false;
  confirmCallback.value();
}


//验证是否要提示切割
const saveValidateSplit = () => {
    //判断是否存在同供应商多个月结方式和含税
    const repetitionItemList=findInconsistentRecords(waitHandleDetailList.value);
    console.log("repetitionItemList",repetitionItemList)
    console.log("waitHandleDetailList",waitHandleDetailList.value)
    if(repetitionItemList.length>0){
      let repetList = waitHandleDetailList.value.filter(item => {
          return repetitionItemList.some(item2 => item2.supplierId==item.supplierId)
      });
      promptList.value = deepClone(repetList);
      splitSupplierOrder.visible = true;
      return false;
    }
  return true;
}

//校验同供应商多个月结方式和含税
function findInconsistentRecords(users:any) {
    const userRecords = {};
    const inconsistentRecords = <any>[];

    // 遍历用户数组
    users.forEach(user => {
        const { supplierId, monthlyMethod, isTax } = user;

        // 如果用户ID不存在，则初始化记录
        if (!userRecords[supplierId]) {
            userRecords[supplierId] = { supplierId, monthlyMethod, isTax };
        } else {
            // 检查地址和性别是否与已记录的不同
            if (userRecords[supplierId].monthlyMethod !== monthlyMethod || userRecords[supplierId].isTax !== isTax) {
                // 记录不一致的信息
                inconsistentRecords.push({
                    supplierId,
                    original: userRecords[supplierId],
                    current: { monthlyMethod, isTax }
                });
                // 更新记录，这里可以选择保留任何一个版本，根据业务需求决定
                userRecords[supplierId] = { ...userRecords[supplierId], monthlyMethod, isTax };
            }
        }
    });

    return inconsistentRecords;
}

/** 待受理的 保存按钮操作 */
const handleSave = async () => {

  const flag = saveValidate(handleSave);
  console.log(flag);

  if (!flag) {
    return;
  }else{
    await proxy?.$modal.confirm('是否确认【保存】下列数据项？').finally(async () => loading.value = false);
    // waitSubmit.value.status = "2";
    buttonLoading.value = true;
    await saveOrderDetailList(waitHandleDetailList.value).then(async () => {
     proxy?.$modal.msgSuccess("保存成功");
     await listRadio();
    }).catch( async () => {
      await listRadio();
    }).finally(() => {buttonLoading.value = false;});

    dialogMaterial.visible = false;
    waitHandleDetailList.value = [];
    HandleDetailList.value = [];
    clearWaitHandleDetailList();
    materialCheckOrderRef.value.xTableRef.clearRowExpand();
    multiple.value=true;
  }

  // await getList();
}

/**待提交的 提价审核按钮 */
const handleWaitSubmitApply = async () => {

  const flag=saveValidate(handleWaitSubmitApply);
  if(!flag){
    return;
  }else
{
    await proxy?.$modal.confirm('是否确认【提交审核】下列数据项？').finally(() => loading.value = false);
    if (waitSubmit.value) {
      waitSubmit.value.orderDetailVoList = waitHandleDetailList.value;
      waitSubmit.value.status = "2";
    }
    buttonLoading.value = true;
    await updateMaterialOrder(waitSubmit.value).finally(() => {buttonLoading.value = false;});
    proxy?.$modal.msgSuccess("保存成功");
    await getListWaitSubmit();
    dialogMaterial.visible = false;
    waitHandleDetailList.value = [];
    HandleDetailList.value = [];
    clearWaitHandleDetailList();
    materialCheckOrderRefSubmit.value.xTableRef.clearRowExpand();

}
}

/** 待提交的 保存按钮操作 */
const handleWaitSubmitSave = async () => {
  const flag = saveValidate(handleWaitSubmitSave);
  if (!flag) {
    return;
  } else {
  await proxy?.$modal.confirm('是否确认【保存】下列数据项？').finally(() => loading.value = false);
  if (waitSubmit.value) {
  // 将waitHandleDetailList.value中的数据赋值给waitSubmit.value.orderDetailVoList
  waitSubmit.value.orderDetailVoList = waitHandleDetailList.value;
  }
  buttonLoading.value = true;
  await updateMaterialOrder(waitSubmit.value).finally(() => {buttonLoading.value = false;});
  proxy?.$modal.msgSuccess("保存成功");
  dialogMaterial.visible = false;
  waitHandleDetailList.value = [];
  HandleDetailList.value = [];
  await getListWaitSubmit();
  clearWaitHandleDetailList();
  materialCheckOrderRefSubmit.value.xTableRef.clearRowExpand();
  }
}


/** 提交按钮操作 */
const handleApply = async () => {
  const flag = saveValidate(handleApply);
  if (!flag) {
    return;
  } else {
  await proxy?.$modal.confirm('是否确认【提交】下列数据项？').finally(() => loading.value = false);
  buttonLoading.value = true;
  await submitOrderDetailList(waitHandleDetailList.value).then( async () => {
     proxy?.$modal.msgSuccess("保存成功");
     await radioTableHandle(null);

    }).catch( async () => {
    await radioTableHandle(null);
    }).finally(() => {buttonLoading.value = false;});

  dialogMaterial.visible = false
  waitHandleDetailList.value = [];
  HandleDetailList.value = [];
  clearWaitHandleDetailList();
  materialCheckOrderRef.value.xTableRef.clearRowExpand();
  multiple.value=true;
  }

}

const submitSign = async (key : any, signType : any) => {
  proxy?.$modal.loading("加载中...");
  await modifyDetailStatus({
      id: orderExamine.value?.id, status: "3", supplierId: orderExamine.value?.supplierId, code: orderExamine.value?.code,
      supplierSwitch: orderExamine.value?.supplierSwitch, signType: signType, imageKey: key
    }
  ).finally(() => {
    proxy?.$modal.closeLoading()
  });
  proxy?.$modal.msgSuccess("操作成功");
  const $table = materialCheckOrderRef.value.xTableRef
  if ($table) {
    let order = selectedOrderList.value.filter(item => item.id == orderExamine.value?.id);
    $table.setCheckboxRow(order, false);
  }
  selectedOrderList.value = selectedOrderList.value.filter(item => item.id != orderExamine.value?.id);
  mergeMultiple.value = !(selectedOrderList.value.length > 1);
  await getListWaitExamine();
  dialogExamine.visible = false
}

const cancelSign = async () => {
  signVisible.value = false;
}

import {VxeTablePropTypes} from "vxe-table";
import { BigNumber } from 'bignumber.js';
import {queryUseModule} from "@/api/basedata/sign";

const footerMethod: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if(column.field.includes("quantity")|| column.field.includes("totalPrice")){
          return `${sumNum(data, column.field,undefined)} `;
        }
        return "";
      })
    ];
  };
  const sumNum = (list:any, field:any,sumField:any) => {
    let count = 0;
    list.forEach(item => {
        count = BigNumber(Number(item[field])).plus(BigNumber(Number(count))).toNumber();
    });
      return count;
  };

  const batchDeliveryTime = ref();
  const batchMonthlyMethod = ref();
  const updateDeliveryTimeStr = ref();
  const waitHandleDetailRef = ref();

  const { monthly_method} = toRefs<any>(proxy?.useDict( 'monthly_method'));

  const dialogChangeDeliveryTimeAll = reactive<DialogOption>({
    visible: false,
    title: '批量设置交期'
  });
  const dialogChangeMonthlyMethodAll = reactive<DialogOption>({
    visible: false,
    title: '批量设置月结方式'
  });
  const splitSupplierOrder = reactive<DialogOption>({
    visible: false,
    title: '确认'
  });
    /** 打开批量修改月结方式弹窗 */
  const changeMonthlyMethod = async (dt:any) => {
    batchMonthlyMethod.value=undefined;
    dialogChangeMonthlyMethodAll.visible=true;
  }

   /** 批量修改月结方式 */
   const changeMonthlyMethodConfirm = async () => {
    if(batchMonthlyMethod.value){
        waitHandleDetailList.value.forEach(item => {
          item.monthlyMethod = batchMonthlyMethod.value;
        });
    }
    dialogChangeMonthlyMethodAll.visible = false
  }


  /** 打开批量修改要求交期弹窗 */
  const changeDeliveryTimeAllOpen = async (dt:any) => {
    batchDeliveryTime.value=undefined;
    updateDeliveryTimeStr.value=undefined;
    updateDeliveryTimeStr.value=dt;
    dialogChangeDeliveryTimeAll.visible=true;
  }

  /** 批量修改交期 */
  const changeDeliveryTimeConfirm = async () => {
    console.log("changeDeliveryTimeConfirm",updateDeliveryTimeStr.value);
    if(batchDeliveryTime.value){
      if(!updateDeliveryTimeStr.value){
        waitHandleDetailList.value.forEach(item => {
          item.deliverTime = batchDeliveryTime.value;
        });
        dialogChangeDeliveryTimeAll.visible = false
        return;
      }
      ///** 列表批量修改交期 */
      if(updateDeliveryTimeStr.value=='detail'&&HandleDetailList.value.length){
        let changeList = deepClone(HandleDetailList.value);
        let dbq={};
        dbq.idList = changeList.map((item)=>item.id);
        dbq.deliverTime = batchDeliveryTime.value;
        await updateMaterialApplyDeliveryTime(dbq);
          //清除勾选
        const $table = waitHandleTableRef.value.xTableRef
        if ($table) {
          $table.clearCheckboxReserve();
          $table.clearCheckboxRow();
          HandleDetailList.value = [];
        }
        listRadio();
      }else {
        let dbq={};
        if(updateDeliveryTimeStr.value=='order'&&selectedOrderList.value.length){
          let changeList = deepClone(selectedOrderList.value);
          dbq.idList = changeList.map((item)=>item.id);
        } else if(updateDeliveryTimeStr.value=='orderWait'&&selectedOrderWaitList.value.length){
          let changeList = deepClone(selectedOrderWaitList.value);
          dbq.idList = changeList.map((item)=>item.id);
        } else{
          ElMessage.error(`请选择修改日期的物料`)
        }
        dbq.deliverTime = batchDeliveryTime.value;
        await updateMaterialOrderDeliveryTime(dbq);
         //清除勾选
         const $table = materialCheckOrderRef.value.xTableRef
          if ($table) {
            $table.clearCheckboxReserve();
            $table.clearCheckboxRow();
            selectedOrderList.value = [];
          }
          const $table2 = materialCheckOrderRefSubmit.value.xTableRef
          if ($table2) {
            $table2.clearCheckboxReserve();
            $table2.clearCheckboxRow();
            selectedOrderWaitList.value = [];
          }
          listRadio();
      }
    }
    dialogChangeDeliveryTimeAll.visible = false
  }

/** 移除按钮操作 */
const handleTabDelete = async (row?: any) => {
  const _ids = row?.id || ids.value;
  console.log(row)
  await proxy?.$modal.confirm('是否确认移除单号为"' + row.code + '",物料编码为：'+row.materialCode+'的数据项？').finally(() => loading.value = false);
  waitHandleDetailList.value = waitHandleDetailList.value.filter((item: any) => item.id != _ids);
  proxy?.$modal.msgSuccess("移除成功");
}
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = decryptBase64ByStr(newVal)
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      let tab = !isNaN(Number(params.tab)) ? Number(params.tab) : 1;
      editableTabsValue.value = tab
      materialQueryParams.value.code = params.bizNo

      let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
      if (tab === 1) {
        setTimeout(() => {
          waitHandleTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === 2) {
        setTimeout(() => {
          materialCheckOrderRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
    radioTableHandle(null);
    updateCurrentTime()
    getSupplierList();
    getListRawMaterialCategorys();
});
</script>

<style>

.no-selection th .el-checkbox {
  display: none;
}
.expand-wrapper-left{
  margin-left: 19.5px;
}
</style>

<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" type="border-card" class="xtable-tab">
        <el-tab-pane label="按订单展示" :name="1">
          <XTable toolId="purchasePurchaseOrder" v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: total }" :data="materialOrderList" :columnList="columnList"
            ref="XTableRef" @toggle-row-expand="toggleExpandChangeEvent" border :showRefresh="true"
            @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-make="scope">
              <el-button link type="primary" v-if="scope.row.confirmStatus == '3' && scope.row.status =='3'
                  && Number(scope.row.receiveQuantity) == '0'" @click="handleCancel(scope.row)">取消</el-button>
              <el-button link type="primary" v-if="scope.row.confirmStatus == '1' && (scope.row.status =='3' || scope.row.status =='8')"
                         @click="handleConfirm(scope.row)">合同确认</el-button>
              <!--<el-button link type="primary" v-if="scope.row.orderType == '0'" @click="printDelivery(scope.row.id)">打印</el-button>-->
              <el-button link type="primary" @click="purchaseReportHandle(scope.row)">打印</el-button>
              <el-button link type="primary" v-if="Number(scope.row.receiveQuantity) == 0 && scope.row.orderType == '0' && scope.row.isConfirmed == '0'"
                @click="handleDelete(scope.row)">删除</el-button>
              <!--收货数量等于0可以驳回 -->
              <el-button link type="primary" v-if="scope.row.orderType == '0'" @click="handleCopy(scope.row)">复制</el-button>
              <el-button link type="primary" v-if="scope.row.orderType == '0' &&  scope.row.status == '3' && scope.row.isConfirmed == '0' && Number(scope.row.receiveQuantity) == 0"
                @click="handleReject(scope.row)">驳回</el-button>
              <el-button link type="primary" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" v-if="scope.row.status =='3' || scope.row.status =='8'" @click="generateUrlLink(scope.row)">分享链接</el-button>
              <el-button link type="primary" v-if="scope.row.status =='3' || scope.row.status =='8'" @click="handleRecord(scope.row.id)">确认记录</el-button>
            </template>
            <!--            <template #default-percentageOrder="scope">
              <el-progress :percentage="scope.row.percentageOrder"></el-progress>
            </template>-->
            <template #default-status="scope">
              <dict-tag :options="statusList" :value="scope.row.status" />
            </template>
            <template #default-confirmStatus="scope">
              <div v-if="scope.row.status == 3 || scope.row.status == 8" v-for="item in confirmStatusList">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-orderType="scope">
              <dict-tag :options="orderTypeList" :value="scope.row.orderType" />
            </template>
            <template #content-expand="{ row }">
              <div class="expand-wrapper">
                <vxe-table border :data="row.otherList">
                  <vxe-column label="${}" align="center" prop="id" v-if="false" />
                  <vxe-column field="detailStatus" title="详情状态" width="105" align="center">
                    <template #default="scope">
                      <dict-tag :options="material_order_detail_status" :value="scope.row.detailStatus" />
                    </template>
                  </vxe-column>
                  <vxe-column field="categoryName" title="物料类别"></vxe-column>
                  <vxe-column field="materialCode" title="物料编码"></vxe-column>
                  <vxe-column field="materialName" title="物料名称"></vxe-column>
                  <vxe-column field="actualSupplierName" title="实际供应商" width="65"></vxe-column>
                  <vxe-column field="materialQuality" title="材质牌号"></vxe-column>
                  <vxe-column field="boardThickness" title="板厚"></vxe-column>
                  <vxe-column field="copperThickness" title="铜厚"></vxe-column>
                  <vxe-column field="color" title="颜色"></vxe-column>
                  <vxe-column field="level" title="级别"></vxe-column>
                  <vxe-column field="length" title="长(mm)"></vxe-column>
                  <vxe-column field="width" title="宽(mm)"></vxe-column>
                  <vxe-column field="manufacturer" title="品牌"></vxe-column>
                  <vxe-column field="units" title="库存单位"></vxe-column>
                  <vxe-column field="applyRemark" title="申请备注"></vxe-column>
                  <vxe-column field="deliverTime" title="要求交期"></vxe-column>
                  <vxe-column field="quantity" title="采购数量"></vxe-column>
                  <vxe-column field="receiveQuantity" title="收货数量"></vxe-column>
                  <vxe-column field="receiveQuantity" title="入库数量"></vxe-column>
                  <vxe-column field="backQuantity" title="退货数"></vxe-column>
                  <vxe-column field="backResendQuantity" title="退货重收数" width="65"></vxe-column>
                  <vxe-column field="price" title="单价"></vxe-column>
                  <vxe-column field="totalPrice" title="采购总金额" width="65"></vxe-column>
                  <vxe-column align="center" title="操作" width="80">
                    <template #default="scope">
                      <el-button link type="primary" v-if="isConfirmed && !(scope.row.receiveQuantity > Number.EPSILON)"
                        @click="handleDeleteDetailOrder(scope.row, row)">删除</el-button>
                      <el-button link type="primary"
                        v-if="confirmStatus == '3' && scope.row.orderStatus === '3' && scope.row.detailStatus === '1' && scope.row.quantity != scope.row.receiveQuantity"
                        @click="handleStatement(scope.row)">结单</el-button>
                      <el-button link type="primary"
                                 v-if="scope.row.detailStatus === '4'" @click="handleStatementConfirm(scope.row)">结单确认</el-button>
<!--                      <el-button link type="primary"
                        v-if="scope.row.detailStatus === '2' && scope.row.quantity != scope.row.receiveQuantity && isConfirmed"
                        @click="closeStatementOfAccount(scope.row)">取消结单</el-button>-->
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="按物料展示" :name="2">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable toolId="purchasePurchaseOrderDetails" v-model:page-size="queryParamsDetail.pageSize"
            v-model:current-page="queryParamsDetail.pageNum" :intervalCondition="['createTime']" height="100%"
            class="xtable-content" :page-params="{ perfect: true, total: total }" :data="materialOrderDetailList"
            :columnList="columnList2" @toggle-row-expand="toggleExpandChangeEvent" border :showRefresh="true"
            @searchChange="searchDetailsChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <!--            <template #default-make="scope">
              <el-button link type="primary">打印</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              &lt;!&ndash;          <el-button link type="primary" @click="dialogExamine.visible = true">查看</el-button>&ndash;&gt;
            </template>-->
            <template #default-status="scope">
              <dict-tag :options="material_order_detail_status" :value="scope.row.status" />
            </template>

            <template #default-orderType="scope">
              <dict-tag :options="orderTypeList" :value="scope.row.orderType" />
            </template>
            <template #default-orderStatus="scope">
              <dict-tag :options="statusList" :value="scope.row.orderStatus" />
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

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

    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
      draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
      <PrintPurchase />
    </el-drawer>

<!--    <div v-show="false">
      <printPurchaseOrder ref="printRef" />
    </div>-->

    <el-dialog v-model="copyDialogMaterial.visible" :title="copyDialogMaterial.title" width="88%" destroy-on-close draggable>
      <el-row>
        <el-col :span="8">
          <h3 style="margin: 0;">受理人: {{ nickname }}</h3>
        </el-col>
        <el-col :span="11">
          <h3 style="margin: 0;">受理时间: {{ currentTime }}</h3>
        </el-col>
        <el-col :span="5" class="global-flex flex-end">
          <el-button :loading="buttonLoading" plain @click="copyDialogMaterial.visible = false"> 关闭 </el-button>
          <el-button :loading="buttonLoading" type="primary" @click="handleSave()">保存 </el-button>
          <el-button :loading="buttonLoading" plain @click="handleApply()">提交审核 </el-button>
        </el-col>
      </el-row>

      <XTable :pageShow="false" height="500" :column-config="{ resizable: true }" size="mini" :data="waitHandleDetailList"
        :border="true" :columnList="handleColumnList" border>
        <template #default-applyRemark="{ row }">
          <el-input :rows="1" :max="200" type="textarea" v-model="row.applyRemark" autocomplete="off" />
        </template>
        <template #default-supplierId="{ row }">
          <el-select v-model="row.supplierId" filterable placeholder="请选择供应商" style="width: 100%;"
            @change="getSupplierPrice(row)">
            <el-option v-for="item in SupplierList" :key="item.id" :label="item.supplierName"
              :value="item.id"></el-option>
          </el-select>
        </template>
        <template #default-supplierPrice="{ row }">
          <el-input-number :disabled="dialog.title === '物料申请详情' || row.disabled" style="width: 99%;" :controls="false"
            v-model="row.supplierPrice" :min="0.01" :precision="2" @change="calculateSupplierPrice(row)" />
        </template>
        <template #default-deliverTime="scope">
          <el-date-picker :disabled="dialog.title === '物料申请详情'" style="width: 100%;" v-model="scope.row.deliverTime"
            type="date" placeholder="选择日期时间" value-format="YYYY-MM-DD 23:59:59" format="YYYY-MM-DD"
            :disabled-date="disabledDate" :clearable="false" />
        </template>
        <template #default-price="{ row }">
          <el-input-number :disabled="dialog.title === '物料申请详情'" @change="calculatePrice(row)" style="width: 99%;"
            :controls="false" v-model="row.price" :min="0.0001" :precision="4" /> </template> <template
          #default-quantity="{ row }">
          <el-input-number :disabled="dialog.title === '物料申请详情'" style="width: 99%;" @change="calculatePrice(row)"
            :controls="false" v-model="row.quantity" :min="0.01" :precision="2" />
        </template>
        <template #default-totalPrice="{ row }">
          {{ priceFormat(row.totalPrice, 4) }}
        </template>
      </XTable>
    </el-dialog>

    <el-drawer :title="dialogConfirm.title" v-model="dialogConfirm.visible" size="80%" >
      <el-form :model="confirmForm" label-width="90px" ref="materialApplyFormRef" :rules="confirmRules" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="5">
            <el-form-item label="采购单号" prop="orderCode">
              <el-input v-model="confirmForm.orderCode" disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="confirmForm.supplierCode" disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="confirmForm.supplierName" disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认备注" prop="confirmRemark">
              <el-input v-model="confirmForm.confirmRemark" type="textarea" :rows="2"  maxlength="2000"
                        placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button v-if="dialogConfirm.title === '采购合同确认'" type="primary" plain @click="selectMaterial">选择物料</el-button>
        </el-col>
      </el-row>

      <XTable :pageShow="false" ref="confirmTable" :data="confirmSelectInventoryList" border :columnList="confirmSelectInventoryColumnList"
        :loading="dialogTableLoading">
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-deliverTime="scope">
          <el-date-picker
            :disabled="dialog.title === '物料申请详情'"
            style="width: 100%;"
            v-model="scope.row.deliverTime"
            type="date"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD 23:59:59"
            format="YYYY-MM-DD"
            clearable />
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-quantity="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="0" v-model="scope.row.quantity" @change="calculatePrice(scope.row)"/>
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-price="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="4" v-model="scope.row.price" @change="calculatePrice(scope.row)"/>
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-applyRemark="scope">
          <el-input style="width: 99%;"  v-model="scope.row.applyRemark" />
        </template>
        <template v-if="dialogConfirm.title === '采购合同确认'" #default-make="scope">
          <el-button link type="primary" @click="handleSelectDelete(scope.row)">删除</el-button>
        </template>
      </XTable>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialogConfirm.visible = false">取消</el-button>
            <el-button v-if="dialogConfirm.title === '采购合同取消确认'" :loading="buttonLoading" type="danger" @click="submitCancelOrder('6')">驳回</el-button>
            <el-button v-if="dialogConfirm.title === '采购合同取消确认'" :loading="buttonLoading" type="primary" @click="submitCancelOrder('3')">确定取消</el-button>
            <el-button v-if="dialogConfirm.title === '采购合同确认'" :loading="buttonLoading" type="primary" @click="submitConfirmForm">确 定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogMaterials.visible" title="选择物料" width="80%" draggable destroy-on-close>
      <el-row>
        <el-col :span="5">
          <el-table size="small" :data="selectInventoryList" height="440" :border="true">
            <el-table-column property="materialCode" fixed />
            <el-table-column v-show="false" property="materialName" label="已选物资" />
            <el-table-column align="center">
              <template #default="scope">
                <el-tooltip content="删除" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="CloseBold"
                    @click="handleInventoryListDelete(scope.row)"

                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="19">
          <XTable
            v-loading="materialsLoading"
            :pageShow="true"
            v-model:page-size="selectQueryParams.pageSize"
            v-model:current-page="selectQueryParams.pageNum"
            :page-params="{ perfect: true, total: selectTotal }"
            :data="materialInventoryList"
            :columnList="selectedMaterialColumnList"
            ref="inventoryTableRef"
            @searchChange="pageChange"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'id' }"
            @checkbox-change="selectChangeEvent"
            @checkbox-all="selectAllChangeEvent"
            height="440"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
            <template #default-materialCode="scope">
              <div>{{ scope.row.code }}</div>
            </template>
            <template #default-materialName="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="clearInventoryForm">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitInventoryForm">确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="操作记录" v-model="dialogRecord" width="70%" draggable destroy-on-close>
      <!-- <div class="expand-wrapper"> -->
        <vxe-table border show-overflow show-header-overflow :column-config="{ resizable: true }" height="500"
                   :data="queryRecordList" :loading="loading" >
          <vxe-column width="50" field="index" align="center" title="序号" type="seq"></vxe-column>
          <vxe-column width="80" field="ownerName" align="center" title="所属单位"></vxe-column>
          <vxe-column width="140" align="center" field="materialName" title="物料名称">
          <template #default="scope">
              <div>{{ scope.row.materialCode }}-{{ scope.row.materialName }}</div>
            </template>
          </vxe-column>
          <vxe-column width="100" align="center" field="createByName" title="操作人"></vxe-column>
          <vxe-column width="160" align="center" field="createTime" title="操作时间"></vxe-column>
          <vxe-column width="200" field="operateContent" title="操作内容"></vxe-column>
          <vxe-column width="160" field="remark" title="确认备注"></vxe-column>
        </vxe-table>
      <!-- </div> -->
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelRecord">取 消</el-button>
      </span>
      </template>
    </el-dialog>

    <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="id" :biz-code="bizCode"/>

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
          <el-button v-if="statement.title === '结单确认'" type="danger" @click="statementAccount('1')">驳回</el-button>
          <el-button v-if="statement.title === '申请结单'" type="primary" @click="statementAccount('3')">确认</el-button>
          <el-button v-if="statement.title === '申请取消'" type="primary" @click="cancelAccount">确认</el-button>
          <el-button v-if="statement.title === '结单确认'" type="primary" @click="statementAccount('2')">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PurchaseOrder" lang="ts">
import {
  addMaterialOrder,
  delMaterialOrder,
  getMaterialOrder,
  getMaterialOrderDetilList,
  listPurchaseMaterialOrder,
  updateDetailStatusClose,
  updateDetailStatusOpen,
  updateMaterialOrder,
  doRejectOrder, confirmOrder, operateRecordList, compareList, cancelOrder, getMaterialOrderDetil
} from '@/api/purchase/materialOrder';
import { MaterialOrderForm, MaterialOrderQuery, MaterialOrderVO } from '@/api/purchase/materialOrder/types';
import { ref } from 'vue'
import { VxeColumnPropTypes, VxeTableEvents } from 'vxe-table'
import {
  MaterialOrderDetailForm,
  MaterialOrderDetailQuery,
  MaterialOrderDetailVO
} from "@/api/purchase/materialOrderDetail/types";
import {delMaterialOrderDetail, listPurchaseOrderDetail} from "@/api/purchase/materialOrderDetail";

import useUserStore from '@/store/modules/user';
import { SupplierVO } from "@/api/basedata/supplier/types";
import { listSupplier} from '@/api/basedata/supplier';
import {
  copySaveOrderDetailList,
  copySubmitOrderDetailList,
  getMaterialOrderDetail, getStatementInfo,
  statementDetail
} from '@/api/purchase/materialHandleDetail';
import {
  getSupplierMaterialPrice,
  getDefaultSupplierMaterialPriceByRawIds,
  listMaterialInventory
} from '@/api/purchase/materialApply';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import clipboard3 from "vue-clipboard3";

/**采购单预览 */
import { getReportUrl } from '@/utils/report';
import {ElTable} from "element-plus";
import {deepClone} from "@/utils";
import {RecordVO} from "@/api/purchase/record/types";
import {getSignPdf} from "@/api/financial/accountOrder";
import { getUrlLink } from "@/api/purchase/materialOrder";
/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});
const purchaseReportHandle = async (row: any) => {
  reportDrawer.title = "采购订单报表预览";
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
  reportUrl.value = getReportUrl() + `&_n=采购单&_u=file:procure.ureport.xml&url=purchase/materialHandle/uReportReview/${row.id}&listUrl=purchase/materialHandle/uReportReviewList/${row.id}`;
  console.log("reportUrl", reportUrl.value);
}

// 是否已确认过
const isConfirmed = ref(false);
// 采购单确认状态
const confirmStatus = ref();
const uploadVisible = ref(false);
// 文件上传类型
const moduleCode = ref('5');
const bizType = ref('15');
const id = ref<string | number>();
const bizCode = ref<string>();

/**采购单预览 */

// const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const materialOrderList = ref<MaterialOrderVO[]>([]);
const materialOrderDetailList = ref<MaterialOrderDetailVO[]>([]);
const otherList = ref<MaterialOrderVO[]>([]);
const materialOrderUpdate = ref<MaterialOrderVO>();


const  material_order_detail_status  = ref([
  { label: '未结单', value: "1" },
  { label: '已结单', value: "2" },
  { label: '结单待对方确认', value: "3" },
  { label: '结单待确认', value: "4" }
]);

const statusList = ref([
  { label: '待提交', value: "1" },
  { label: '待审核', value: "2" },
  // { label: '待审核', value: "5" },
  // { label: '待审核', value: "6" },
  // { label: '待审核', value: "7" },
  { label: '审核通过', value: "3" },
  { label: '驳回', value: "4" },
  { label: '取消', value: "8" },

]);

const statusNewList = ref([
  { label: '待提交', value: "1" },
  { label: '待审核', value: "2" },
  { label: '审核通过', value: "3" },
  { label: '驳回', value: "4" },
  { label: '取消', value: "8" }
]);

const confirmStatusList = ref([
  { type:"warning", label: '待确认', value: "1" },
  { type:"primary", label: '待对方确认', value: "2" },
  { type:"success", label: '已确认', value: "3" }
]);

const orderTypeList = ref([
  { label: '电脑端', value: "0" },
  { label: '小程序', value: "1" },
]);
// const { material_order_status } = toRefs<any>(proxy?.useDict("material_order_status"));
const buttonLoading = ref(false);
const loading = ref(true);
const dialogTableLoading = ref(false);
const materialsLoading = ref(false);

const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialOrderFormRef = ref<ElFormInstance>();
const detailOrderFormRef = ref<ElFormInstance>();

const statement = reactive<any>({
  visible: false,
  title: '',
  describe: '',
});

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogConfirm = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogMaterials = reactive<DialogOption>({
  visible: false,
  title: '选择物料'
});

const dialogMaterial = reactive<DialogOption>({
  visible: false,
  title: '审核'
});

const dialogRecord = ref(false);

const seqFixed = ref<VxeColumnPropTypes.Fixed>()
const expandFixed = ref<VxeColumnPropTypes.Fixed>()
const ageFixed = ref<VxeColumnPropTypes.Fixed>()
const toggleExpandFixed = () => {
  expandFixed.value = expandFixed.value ? null : 'left'
}
// 查询操作记录
const queryRecordList = ref<RecordVO[]>([]);

const inventoryTableRef =  ref()
//物料池展示的物料
const materialInventoryList = ref<MaterialOrderDetailVO[]>([]);
//选中的物料
const selectInventoryList = ref<MaterialOrderDetailVO[]>([]);
//确认选中的物料
const confirmSelectInventoryList = ref<MaterialOrderDetailVO[]>([]);
//确认选中的物料-备份
const confirmSelectInventoryCopyList = ref<MaterialOrderDetailVO[]>([]);
//确认选中的物料
const confirmSelectInventoryColumnList = ref([
  { title: '序号', align: 'center', width: '50', type: 'seq' },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', },
  { title: '物料名称', field: 'materialName',  width: '80', align: 'center', },
  { title: '材质牌号', field: 'materialQuality',  width: '60', align: 'center', },
  { title: '规格型号', field: 'specification', width: '80', align: 'center',  },
  { title: '直径', field: 'diameter', width: '80', align: 'center',  },
  { title: '厚度', field: 'thickness', width: '80', align: 'center',  },
  { title: '板厚', field: 'boardThickness', width: '60', align: 'center', },
  { title: '铜厚', field: 'copperThickness', width: '50', align: 'center', },
  { title: '颜色', field: 'color', width: '60', align: 'center', },
  { title: '级别', field: 'level', width: '60', align: 'center', },
  { title: '长(mm)', field: 'length', width: '70', align: 'center', },
  { title: '宽(mm)', field: 'width', width: '70', align: 'center', },
  { title: '品牌', field: 'manufacturer', width: '60', align: 'center', },
  { title: '要求交期', field: 'deliverTime', fixed:'right', width: '180', align: 'center', },
  { title: '采购数量', field: 'quantity', fixed:'right', width: '80', align: 'center' },
  { title: '单位', field: 'units', width: '80', align: 'center' },
  { title: '采购单价', field: 'price', fixed:'right', width: '80', align: 'center' },
  { title: '采购金额', field: 'totalPrice', fixed:'right', width: '80', align: 'center' },
  { title: '采购备注', field: 'applyRemark', fixed:'right', width: '80', align: 'center' },
  { title: '操作',field:'make', fixed: 'right', width:'60', align: 'center', showOverflow:false},
]);

const SelectData = reactive<PageData<MaterialOrderDetailForm, MaterialOrderDetailQuery>>({
  form: { },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    categoryId: undefined,
    materialCode: undefined,
    materialName: undefined,
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
    fileId: undefined,
    boardThickness: undefined,
    params: {},
    actualStock:undefined,
    availableStock:undefined,
    onWayStock:undefined
  },
  rules: {}
});
const { queryParams:selectQueryParams  } = toRefs(SelectData);
const selectTotal = ref(0);

const selectedMaterialColumnList = ref([

  { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left', },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } },
  { title: '单位名称', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入厚度' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入板厚' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '默认供应商', field: 'supplierName', width: '160', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入' }},
  { title: '长', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '备注', field: 'remark', width: '80', align: 'center',  },
  { title: '实际库存', field: 'actualStock', width: '80', align: 'center',fixed: 'right',},
  { title: '可用库存', field: 'availableStock', width: '80', align: 'center',fixed: 'right', },
  { title: '在途数量', field: 'onWayStock', width: '120', align: 'center', fixed: 'right',},
]);

const initFormData: MaterialOrderForm = {
  id: undefined,
  code: undefined,
  supplierId: undefined,
  addressId: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  submitUserId: undefined,
  submitUserName: undefined,
  remark: undefined,
  status: undefined,
  createTime: undefined,
  confirmRemark: undefined
}
const data = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    params: {
    }
  },
  queryParamsDetail: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "采购单号不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商ID不能为空", trigger: "blur" }
    ],
    addressId: [
      { required: true, message: "收货地址ID不能为空", trigger: "blur" }
    ],
    auditUserId: [
      { required: true, message: "审核人ID不能为空", trigger: "blur" }
    ],
    auditUserName: [
      { required: true, message: "审核人名称不能为空", trigger: "blur" }
    ],
    submitUserId: [
      { required: true, message: "提交人ID不能为空", trigger: "blur" }
    ],
    submitUserName: [
      { required: true, message: "提交人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, queryParamsDetail, form, rules } = toRefs(data);

const confirmData = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {}
});

const { form : confirmForm, rules : confirmRules } = toRefs(confirmData);

const detailData = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
  form: { ...initFormData },
  queryParams: {},
  queryParamsDetail: {},
  rules: {
    confirmRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const {form : detailForm, rules: detailRules } = toRefs(detailData);

const XTableRef = ref();
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '50', },
  { field: "expand", type: 'expand', width: '40', align: 'center' },
  { title: '状态', field: 'status', align: 'center', width: '80', filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => statusNewList.value },
  { title: '确认状态', field: 'confirmStatus', align: 'center', width: '80', filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => confirmStatusList.value },
  { title: '单据类型', field: 'orderType', align: 'center', width: '90',filterType: 'radioButton',
    filterParam: {placeholder: '请选择电脑端/小程序'},
    filterData: () => [{label: '电脑端', value: '0'},{label: '小程序', value: '1'}]
  },
  { title: '采购单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '供应商', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商' } },
  { title: '下单时间', field: 'createTime', align: 'center', },
  /*{ title: '入库情况', field: 'percentageOrder', align: 'center'  },*/
  { title: '采购数量', width: '70', field: 'quantity', align: 'center', },
  { title: '收货数量', width: '70', field: 'receiveQuantity', align: 'center', },
  { title: '收货地址', field: 'address', align: 'center', width: '240', },
  { title: '备注', field: 'remark', align: 'center', width: '140', },
  { title: '操作', field: 'make', align: 'center', width: '460', fixed: 'right', },
]);

const columnList2 = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '50', },
  { title: '采购订单号', field: 'orderCode', width: '90', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  {
    title: '采购单状态', field: 'orderStatus', width: '80', align: 'center'
    , filterType: 'radioButton',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => statusList.value,
  },
  { title: '单据类型', field: 'orderType', align: 'center', width: '90',filterType: 'radioButton',
    filterParam: {placeholder: '请选择电脑端/小程序'},
    filterData: () => [{label: '电脑端', value: '0'},{label: '小程序', value: '1'}]
  },
  {
    title: '供应商', field: 'supplierName', width: '140', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入供应商' },
  },
  {
    title: '实际供应商', field: 'actualSupplierName', width: '140', align: 'center',
    filterType: 'input', filterParam: { placeholder: '请输入实际供应商' },
  },
  {
    title: '下单时间', field: 'createTime', width: '120', align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    title: '收货地址', field: 'addressName', width: '300', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '明细单状态', field: 'status', width: '110', align: 'center'
    , filterType: 'radioButton',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => material_order_detail_status.value,
  },
  {
    title: '物料类别', field: 'categoryName', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料编码', field: 'rawMaterialCode', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '物料名称', field: 'name', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '材质牌号', field: 'materialQuality', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '板厚', field: 'boardThickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '铜厚', field: 'copperThickness', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '颜色', field: 'color', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '级别', field: 'level', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '长(mm)', field: 'length', width: '80', align: 'center',
    filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '宽(mm)', field: 'width', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  {
    title: '品牌', field: 'manufacturer', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  { title: '厚度', field: 'thickness', width: '80', align: 'center' },
  { title: '规格型号', field: 'specification', width: '80', align: 'center' },
  { title: '直径', field: 'diameter', width: '80', align: 'center' },
  {
    title: '库存单位', field: 'units', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  { title: '申请备注', field: 'applyRemark', width: '80', align: 'center' },
  { title: '要求交期', field: 'deliverTime', width: '80', align: 'center' },
  { title: '采购数量', field: 'quantity', width: '80', align: 'center' },
  { title: '收货数量', field: 'receiveQuantity', width: '80', align: 'center' },
  { title: '入库数量', field: 'inventoryQuantity', width: '80', align: 'center' },
  { title: '退货数', field: 'backQuantity', width: '80', align: 'center' },
  { title: '退货重收数', field: 'backResendQuantity', width: '80', align: 'center' },
  { title: '单价', field: 'price', width: '80', align: 'center' },
  { title: '采购总金额', field: 'totalPrice', width: '80', align: 'center' },
  { title: '备注', field: 'remark', align: 'center', width: '80' },
]);

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList();
  XTableRef.value.xTableRef.clearRowExpand();
}

// 获取 搜索条件
const searchDetailsChange = (params: any) => {
  queryParamsDetail.value = params
  getPurchaseOrderDetailList();
}

// 新增属性
const editableTabsValue = ref(1);
/**
 * 查询tab页
 */
const getVoidedList = async () => {
  if (1 == editableTabsValue.value) {
    getList();
  } else {
    XTableRef.value.xTableRef.clearRowExpand()
    getPurchaseOrderDetailList();
  }
}

/**
 * 查询采购订单列表
 * */
const getList = async () => {
  loading.value = true;
  const res = await listPurchaseMaterialOrder(queryParams.value);
  materialOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  XTableRef.value.xTableRef.clearRowExpand();
}

/**
 * 查询按采购订单列表
 * */
const getPurchaseOrderDetailList = async () => {
  loading.value = true;
  const res = await listPurchaseOrderDetail(queryParamsDetail.value);
  materialOrderDetailList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  num: string
  num2: string
  address: string
}

/**
 * 点击箭头下拉
 * @param row
 * @param rowIndex
 */
const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<RowVO> = ({ row, rowIndex }) => {
  otherList.value = [{
    categoryId: undefined,
    materialCode: undefined,
    name: undefined,
    specification: undefined,
    materialQuality: undefined,
    boardThickness: undefined,
    copperThickness: undefined,
    color: undefined,
    level: undefined,
    length: undefined,
    width: undefined,
    manufacturer: undefined,
    units: undefined,
    deliverTime: undefined,
    quantity: undefined,
    inventoryQuantity: undefined,
    receiveQuantity: undefined,
    backResendQuantity: undefined,
    backQuantity: undefined,
    expirationDays: undefined
  }];
  const _id = row.id;
  isConfirmed.value = row.isConfirmed == 0;
  getMaterialOrderDetilList(_id).then(res => {
    row.otherList = res.data.orderDetailVoList;
    confirmStatus.value = res.data.confirmStatus;
  })
  loading.value = false;
  console.log('行展开事件' + row)
}


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  materialOrderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加采购订单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改采购订单";
}

/** 结单按钮 */
const handleStatement = async (row?: MaterialOrderDetailVO) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.materialCode = row?.materialCode;
  statement.title = '申请结单';
  statement.describe = '结单备注';
  statement.visible = true;
}

/** 结单确认按钮 */
const handleStatementConfirm = async (row?: MaterialOrderDetailVO) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.materialCode = row?.materialCode;
  const res = await getStatementInfo(row?.id);
  detailForm.value.confirmRemark = res.data.confirmRemark;
  statement.title = '结单确认';
  statement.describe = '结单备注';
  statement.visible = true;
}

/** 结单 */
const statementAccount = async (status: string) => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      var materialCode = detailForm.value.materialCode;
      detailForm.value.status = status;
      detailForm.value.idList = [detailForm.value.id];
      if(status == '1') {
        await proxy?.$modal.confirm('是否确认驳回物料编码编号为"' + materialCode + '"的数据项结单申请？').finally(() => loading.value = false);
      } else {
        await proxy?.$modal.confirm('是否确认物料编码编号为"' + materialCode + '"的数据项结单？').finally(() => loading.value = false);
      }
      proxy?.$modal.loading("加载中...");
      await statementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      XTableRef.value.xTableRef.clearRowExpand();
      await getList();
    }
  });
}

/** 取消按钮 */
const handleCancel = async (row?: MaterialOrderVO) => {
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
      var code = detailForm.value.code;
      detailForm.value.status = '8';
      detailForm.value.confirmStatus = '2';
      await proxy?.$modal.confirm('是否确认取消采购单号为"' + code + '"的数据项？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await cancelOrder(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getList();
    }
  });
}

/**
 *结单按钮
 * @param row
 */
const statementOfAccount = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  var materialCode = row?.materialCode;
  await proxy?.$modal.confirm('是否确认物料编码编号为"' + materialCode + '"的数据项结单？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  const res = await updateDetailStatusOpen(_id).finally(() => proxy?.$modal.closeLoading());
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("结单成功");
  XTableRef.value.xTableRef.clearRowExpand();
  await getList();
}

/**
 *取消结单按钮
 * @param row
 */
const closeStatementOfAccount = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  var materialCode = row?.materialCode;
  await proxy?.$modal.confirm('是否确认取消物料编号为"' + materialCode + '"的结单数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  const res = await updateDetailStatusClose(_id).finally(() => proxy?.$modal.closeLoading());
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("取消结单成功");
  XTableRef.value.xTableRef.clearRowExpand();
  await getList();
}



/** 提交按钮 */
const submitForm = () => {
  materialOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMaterialOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}
const exportVisible = ref(false);

const mainTableToolId = ref('purchasePurchaseOrderDetails');
/** 导出操作 */
const exportExcel = async () => {
  exportVisible.value = false;
  proxy?.download('purchase/materialHandleDetail/export', {
    ...queryParamsDetail.value, tableName: mainTableToolId.value
  }, `采购订单_${new Date().getTime()}.xlsx`);
}

/** 导出前操作 */
const exportExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!queryParamsDetail.value.createTimeStart) {
    exportVisible.value = true;
  } else {
    proxy?.download('purchase/materialHandleDetail/export', {
      ...queryParamsDetail.value, tableName: mainTableToolId.value
    }, `采购订单_${new Date().getTime()}.xlsx`);
  }
}


/** 删除按钮操作 */
const handleDelete = async (row?: MaterialOrderVO) => {
  const _ids = row?.id || ids.value;
  var code = row?.code;
  await proxy?.$modal.confirm('是否确认删除采购订单编号为"' + code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  await delMaterialOrder(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 删除按钮操作 */
const handleDeleteDetailOrder = async (row: MaterialOrderVO, fatherRow: any) => {
  const _ids = row?.id || ids.value;
  var materialCode = row?.materialCode;
  await proxy?.$modal.confirm('是否确认删除物料编码为"' + materialCode + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  await delMaterialOrderDetail(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  // var id = row?.id;
  XTableRef.value.xTableRef.toggleRowExpand(fatherRow);
  await getList();
}

const handleReject = async (row?: MaterialOrderVO) => {
  const _ids = row?.id || ids.value;
  var code = row?.code;
  const _data = {id: _ids};
  await proxy?.$modal.confirm('是否确认驳回采购订单编号为"' + code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  await doRejectOrder(_data).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("驳回成功");
  await getList();
}


//待受理明细列表
const waitHandleDetailList = ref<MaterialOrderDetailVO[]>([]);
const copyDialogMaterial = reactive<DialogOption>({
  visible: false,
  title: ''
});
const { nickname,userId } = useUserStore();
// 使用 ref 创建 currentTime 变量
const currentTime = ref(getCurrentTime());
let SupplierList: SupplierVO[] = [];
/**
 * 获取供应商列表
 */
 const getSupplierList = async () => {
  const SupplierResponse: any = await listSupplier();
  SupplierList = SupplierResponse.rows;
}
/** 时间禁选*/
const disabledDate = (date:any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
const handleColumnList = ref([
  { width:'100',title:'物料编码',field:'materialCode',align:'center', },
  { title:'物料名称',field:'materialName',align:'center',width:'100' },
  { title: '物料类别', field: 'materialName', width: '80', align: 'center'},
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
  { title: '申请备注', field: 'applyRemark', width: '80', align: 'center' },
  { width:'240',title:'供应商名称',field:'supplierId',align:'center', },
  { width:'100',title:'供应商基价',field:'supplierPrice',align:'center', },
  { title:'申请数量',field:'applyQuantity',align:'center',  width:'100'},
  { width:'125',title:'要求交期',field:'deliverTime',align:'center', },
  { title:'采购单价',field:'price',align:'center',  width:'100'},
  { title:'采购数量',field:'quantity',align:'center', width:'100'},
  { title:'采购金额',field:'totalPrice',align:'center',  width:'100'},
  { title:'收货地址',field:'addressName',align:'center', width:'240' },
]);

const handleCopy = async (row?: MaterialOrderVO) => {
  const _ids = row?.id;
  proxy?.$modal.loading("加载中...");
  await getMaterialOrderDetilList(_ids).then(res => {
    waitHandleDetailList.value = res.data.orderDetailVoList;
  }).finally(() => proxy?.$modal.closeLoading());
  await getDefaultSupplierPrice();
  waitHandleDetailList.value.forEach((item) => {
        item.addressId =  row?.addressId;
        item.addressName = row?.address;
        item.status = undefined;
  });
  console.log("waitHandleDetailList......", waitHandleDetailList.value);
  proxy?.$modal.closeLoading();
  copyDialogMaterial.title="采购订单复制";
  copyDialogMaterial.visible=true;
}
// 获取当前时间的方法
function getCurrentTime() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Intl.DateTimeFormat('zh-CN', options).format(now);
}
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
const getSupplierPrice = async (row: any) => {
  const supplierId = row.supplierId;
  const materialId = row.rawMaterialId;
  const res =  await getSupplierMaterialPrice(supplierId, materialId);
  row.supplierPrice = res.data;
  if (row.supplierPrice) {
    row.price = row.supplierPrice;
    row.totalPrice = row.price * row.quantity;
    row.disabled = true;
  }else{
    row.disabled = false;
  }
};
const calculateSupplierPrice = async (row: any) => {
  row.price = row.supplierPrice;
  row.totalPrice = row.price * row.quantity;
  row.totalPrice = row.totalPrice.toFixed(2);
};
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
  row.totalPrice = price * quantity;
  row.totalPrice = row.totalPrice.toFixed(4);
};
/** 待受理的 保存按钮操作 */
const handleSave = async () => {
  const flag = saveValidate();
  if (!flag) {
    return;
  }else{
    await proxy?.$modal.confirm('是否确认【保存】下列数据项？').finally(() => loading.value = false);
    // waitSubmit.value.status = "2";
    buttonLoading.value = true;
    await copySaveOrderDetailList(waitHandleDetailList.value).finally(() => { buttonLoading.value = false; });
    proxy?.$modal.msgSuccess("保存成功");
    await getVoidedList();
    dialogMaterial.visible = false;
    waitHandleDetailList.value = [];

    XTableRef.value.xTableRef.clearRowExpand();
    copyDialogMaterial.visible=false;
  }
}

/** 提交按钮操作 */
const handleApply = async () => {
  const flag = saveValidate();
  if (!flag) {
    return;
  } else {
    await proxy?.$modal.confirm('是否确认【提交】下列数据项？').finally(() => loading.value = false);
    buttonLoading.value = true;
    await copySubmitOrderDetailList(waitHandleDetailList.value).finally(() => { buttonLoading.value = false; });
    proxy?.$modal.msgSuccess("提交成功");
    await getVoidedList();
    dialogMaterial.visible = false
    waitHandleDetailList.value = [];
    XTableRef.value.xTableRef.clearRowExpand();
    copyDialogMaterial.visible=false;
  }
}
/**
 * 保存前的校验
 */
 const saveValidate = () => {
  //遍历waitHandleDetailList 判断 supplierPrice 和 quantity 和 price 和 totalprice和deliverTime 是否为空
  let check = false;
  let msg = "";
  waitHandleDetailList.value.forEach((item) => {
    if (item.supplierId == undefined) {
      check = true;
      msg = "供应商不能为空"
      return;
    }
    //判断item.applyNum>0
    if (item.supplierPrice == undefined) {
      check = true;
      msg = "供应商基价不能为空"
      return;
    }
    if (item.quantity == undefined) {
      check = true;
      msg = "采购数量不能为空"
      return;
    }
    if (item.price == undefined) {
      check = true;
      msg = "采购单价不能为空"
      return;
    }
    if (item.deliverTime == undefined) {
      check = true;
      msg = "要求交期不能为空"
      return;
    }
    if (item.totalPrice == undefined) {
      check = true;
      msg = "采购金额不能为空"
      return;
    }
  });
  if (check) {
    proxy?.$modal.msgError(msg);
    return false;
  }
  return true;
}

/**
 * 查询物料集合是否有供应商 基价
 * @param data
 */
const getDefaultSupplierPrice = async () => {
    //得到waitHandleDetailList 的 id集合
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
          item.supplierPrice = basice.price;
          item.supplierId = basice.supplierId;
          item.disabled = true;
        }
        item.applyQuantity = item.applyQuantity;
        item.quantity= item.quantity;
        item.price = item.supplierPrice;
        item.totalPrice = item.price * item.quantity;
        item.totalPrice = item.totalPrice.toFixed(2);
    });
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialOrder/export', {
    ...queryParams.value
  }, `materialOrder_${new Date().getTime()}.xlsx`)
}

/** 合同确认按钮操作 */
const handleConfirm = async (row?: MaterialOrderVO) => {
  reset();
  dialogTableLoading.value = true;
  materialOrderUpdate.value = row;
  confirmForm.value.orderCode = row?.code;
  confirmForm.value.supplierCode = row?.supplierCode;
  confirmForm.value.supplierName = row?.supplierName;
  confirmForm.value.confirmRemark = row?.confirmRemark;
  confirmForm.value.id = row?.id;
  if (row?.status == '8') {
    dialogConfirm.title = '采购合同取消确认';
    confirmData.rules = {
      confirmRemark: [
        {required: true, message: "确认备注不能为空", trigger: "change"}
      ],
    }
  } else {
    dialogConfirm.title = '采购合同确认';
    confirmData.rules = {}
  }
  getMaterialOrderDetil({id:row?.id, confirmStatus:row?.confirmStatus}).then(res => {
    confirmSelectInventoryList.value = res.data.orderDetailVoList;
    dialogConfirm.visible = true;
  });
  dialogTableLoading.value = false;
}

/**选择物料按钮 */
const selectMaterial = async() => {
  dialogMaterials.visible = true;
  selectInventoryList.value=[...confirmSelectInventoryList.value];

  confirmSelectInventoryCopyList.value=deepClone(confirmSelectInventoryList.value);

  selectInventoryList.value.forEach(item => {
    item.id = item.rawMaterialId;
  });
  materialsLoading.value = true;
  // selectQueryParams.value重置
  selectQueryParams.value = {
    pageNum: 1,
    pageSize: 20
  }
  await pageChange(null);

  // 为不属于当前页的数据设置选中缓存
  nextTick(() => {

    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      let st = materialInventoryList.value.filter(item => {
        return selectInventoryList.value.some(item2 => item.id == item2.rawMaterialId);
      });
      //得到selectInventoryList.value 中 rawMaterialId 在st中不存在的数据

      let temp = selectInventoryList.value.filter(item => {
        return !st.some(item2 => item.rawMaterialId == item2.id);
      });


      $table.setCheckboxRow(temp, true);
    }
  });
}
const pageChange = async(params: any) => {
  if (params){
    selectQueryParams.value = params
    if(Array.isArray(selectQueryParams.value.categoryId)){

      selectQueryParams.value.categoryIds = selectQueryParams.value.categoryId.join(",");
      selectQueryParams.value.categoryId = undefined;

    }
    //品牌 拼接
    if (selectQueryParams.value.manufacturer) {
      if (Array.isArray(selectQueryParams.value.manufacturer)) {
        selectQueryParams.value.manufacturer = selectQueryParams.value.manufacturer.join(",");
      }
    }
    //级别 拼接
    if (selectQueryParams.value.level) {
      if (Array.isArray(selectQueryParams.value.level)) {
        selectQueryParams.value.level = selectQueryParams.value.level.join(",");
      }
    }

  }
  materialsLoading.value = true;
  await getMaterialInventory();
  setTableSelect();
  materialsLoading.value = false;
}
/** 查询物料库存列表 */
const getMaterialInventory = async () => {
  const res = await listMaterialInventory(selectQueryParams.value);
  materialInventoryList.value = res.rows;
  materialInventoryList.value.forEach((item) => {
    item.materialCode = item.code;
    item.materialName = item.name;
    item.rawMaterialId = item.id;
  })
  selectTotal.value = res.total;
}

/**设置表格列表选中 */
const setTableSelect=()=>{

  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    //过滤materialInventoryList中id在selectInventoryList中的数据，
    let st = materialInventoryList.value.filter(item => {
      return selectInventoryList.value.some(item2 => item.id == item2.rawMaterialId);
    });
    //先为materialInventoryList中所有数据取消选中
    $table.setCheckboxRow(materialInventoryList, false);
    $table.setCheckboxRow(st, true);
  }
}
//选择物料全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<MaterialOrderDetailVO> = () => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    selectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}

//选择物料 单选
const selectChangeEvent: VxeTableEvents.CheckboxChange<MaterialOrderDetailVO> = ({ checked, row }) => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    selectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}

/** 已选物料确认按钮操作 */
const submitInventoryForm = () => {
  dialogMaterials.visible = false;
  //将已选中的赋值给confirmSelectInventoryList
  confirmSelectInventoryList.value = selectInventoryList.value;

  confirmSelectInventoryList.value.map((item2) => {
    let material =  confirmSelectInventoryCopyList.value.find(item => item.rawMaterialId == item2.id);
    if (material) {
      item2.quantity = material.quantity;
      item2.deliverTime = material.deliverTime;
      item2.price = material.price;
      item2.totalPrice = material.totalPrice;
      item2.confirmRemark = material.confirmRemark;
      item2.remark = material.remark;
      item2.id = material.id;
    }else{
      // 老数据没有的则新增
      item2.id = null;
    }
  });
}

/** 已选物料取消按钮操作 */
const clearInventoryForm = () => {
  dialogMaterials.visible = false;
  selectInventoryList.value = [];
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    $table.clearCheckboxReserve();
    $table.clearCheckboxRow();
  }
}

/** 已选物料 删除按钮操作 */
const handleInventoryListDelete = async (row?: MaterialOrderDetailVO) => {
  const id = row?.id;
  //删除已选物料
  selectInventoryList.value = selectInventoryList.value.filter(item => item.id != id);

  const $table =  inventoryTableRef.value.xTableRef;
  if ($table) {
    $table.setCheckboxRow(row, false);
  }
}

/** 确认已选物料删除按钮操作 */
const handleSelectDelete = async (row?: MaterialOrderDetailVO) => {
  const _ids = row?.id || ids.value;
  //删除已选物料
  selectInventoryList.value = selectInventoryList.value.filter(item => item.id != _ids);
  //删除确认已选物料
  confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id != _ids);

  const $table = inventoryTableRef.value.xTableRef;
  //将InventoryTableRef使用toggleRowSelection 取消选中
  if ($table) {
    //将InventoryTableRef使用toggleRowSelection 取消选中
    $table.setCheckboxRow(row, false);
  }
}

/** 提交按钮 */
const submitConfirmForm = async () => {
  if (confirmSelectInventoryList.value.length == 0) {
    proxy?.$modal.msgError("请选择物料");
    return;
  }
  let check = false;
  let msg = "";
  confirmSelectInventoryList.value.forEach((item) => {
    //判断item.applyNum>0
    if (item.quantity <= 0) {
      check = true;
      msg="申请数量必须大于0"
      return;
    }
    if (item.price <= 0) {
      check = true;
      msg="采购单间必须大于0"
      return;
    }
    if (item.deliverTime == undefined) {
      check = true;
      msg="要求交期不能为空"
      return;
    }
  });
  if (check) {
    proxy?.$modal.msgError(msg);
    return;
  }
  materialOrderUpdate.value.confirmRemark = confirmForm.value.confirmRemark;
  materialOrderUpdate.value.orderDetailBoList = confirmSelectInventoryList.value;

  // 校验是否有修改
  const res = await compareList(materialOrderUpdate.value);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
  } else {
    await proxy?.$modal.confirm('是否确认提交数据项？').finally(() => loading.value = false);
  }
  buttonLoading.value = true;
  await confirmOrder(materialOrderUpdate.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");


  dialogConfirm.visible = false;
  await getList();
}

// 更新当前时间
function updateCurrentTime() {
  const update = () => {
    currentTime.value = getCurrentTime();
    requestAnimationFrame(update); // 递归调用，实现动画效果
  };
  update(); // 启动更新
}

/** 取消按钮 */
const cancelRecord = () => {
  dialogRecord.value = false;
}

/** 查询操作记录 */
const handleRecord = async (id: any) => {
  dialogRecord.value = true;
  loading.value = true;
  const res = await operateRecordList({id: id});
  queryRecordList.value = res.rows;
  loading.value = false;
}

//解构出复制方法
const { toClipboard } = clipboard3();

/** 生成分享链接并复制 */
const generateUrlLink = async (row : any) => {
  let path = 'pages/subOne/procurementSignature/contract/detail/index';
  let query = 'id='+row.id+'&companyId=' + row.supplierCompanyId+'&shareUserId=' + userId;
  const res = await getUrlLink({path: path,query: query});
  console.log(res)
  try {
    await toClipboard(res.data);
    proxy?.$modal.msgSuccess("复制成功!");
  } catch (error) {
    alert("复制失败!请重试!")
  }
  return res.data || '' ;
}

/** 查询上传文件记录 */
const handleUpload = async (row: any) => {
  uploadVisible.value = true;
  id.value = row.id;
  bizCode.value = row.code;
}
const materialApplyFormRef = ref<ElFormInstance>();

/** 取消确认 */
const submitCancelOrder = async (status: string) => {
  materialApplyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (status == '6') {
        await proxy?.$modal.confirm('是否确认驳回该数据项的取消申请？');
      } else {
        await proxy?.$modal.confirm('是否确认取消该数据项？');
      }
      proxy?.$modal.loading("加载中...");
      await cancelOrder({id: confirmForm.value.id, confirmStatus: status, confirmRemark: confirmForm.value.confirmRemark}).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("操作成功");
      dialogConfirm.visible = false;
      await getList();
    }
  });
}

onMounted(() => {
  getList();
  getSupplierList();
  updateCurrentTime();
});
</script>
<style scoped lang="scss">
.expand-wrapper {
  padding-left: 39px;
}
</style>

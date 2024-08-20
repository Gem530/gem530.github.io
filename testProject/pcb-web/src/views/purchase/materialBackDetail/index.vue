<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="待审核列表" :name="1">
          <el-row style=" justify-content: end; width: 100%;">
            <div style="text-align: right">
              <el-button :loading="buttonLoading" type="primary" @click="borrowingMaterialReview">审核</el-button>
            </div>
          </el-row>
          <XTable
            toolId="purchaseMaterialBackDetailWait"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            height="100%"
            class="xtable-content"
            :page-params="{ perfect: true, total: total }"
            :data="materialBackDetailList"
            :columnList="columnList"
            :loading="loading"
            ref="xTableAuditList"
            size="mini"
            border
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
            :intervalCondition="['backTime']"
            :showRefresh="true"
          >
            <template #default-status="{ row }">
              <div>{{ statusOptions.find(v => v.value == row.status)?.label }}</div>
            </template>
            <template #default-type="scope">
              <dict-tag :options="back_detail_type" :value="scope.row.type" />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleExamine(scope.row)">审核 </el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="退货列表" :name="2">
          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleRoll">物料退货</el-button>
            </el-col>
          </el-row>
          <XTable
            toolId="purchaseMaterialBackDetailReturn"
            v-model:page-size="backQueryParams.pageSize"
            v-model:current-page="backQueryParams.pageNum"
            height="100%"
            class="xtable-content"
            :loading="loadingList"
            :page-params="{ perfect: true, total: totalList }"
            :data="materialBackDetailListALl"
            :columnList="columnList2"
            ref="xTable222"
            size="mini"
            border
            @searchChange="searchMaterialChange"
            :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }"
            :intervalCondition="['backTime']"
            :showRefresh="true"
          >
            <template #default-status="{ row }">
              <div>{{ statusOptions.find(v => v.value == row.status)?.label }}</div>
            </template>
            <template #default-confirmStatus="scope">
              <div v-for="item in confirmStatusList">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-type="scope">
              <dict-tag :options="back_detail_type" :value="scope.row.type" />
            </template>
            <template #default-make="scope">
<!--
              <el-button link type="primary" v-if="scope.row.confirmStatus == '3' && scope.row.status =='4'" @click="handleCancel(scope.row)">取消</el-button>
-->
              <el-button
                link
                type="primary"
                v-show="scope.row.status==statusOptions[0].value ||scope.row.status==statusOptions[2].value"
                @click="handleEdit(scope.row)"
                v-if="scope.row.backStatus != '4'"
                >编辑
              </el-button>
              <el-button
                link
                type="primary"
                v-show="scope.row.status==statusOptions[0].value ||scope.row.status==statusOptions[2].value"
                @click="handleDelete(scope.row)"
                v-if="scope.row.backStatus != '4'"
                >删除
              </el-button>
              <el-button
                link
                type="primary"
                v-show="scope.row.status==statusOptions[0].value ||scope.row.status==statusOptions[2].value"
                @click="handleUpdateBackDetailStatus(scope.row)"
                v-if="scope.row.backStatus != '4'"
                >提交
              </el-button>
              <el-button link type="primary" v-if="scope.row.confirmStatus == '1' && scope.row.status =='4'" @click="handleConfirm(scope.row)">退货确认</el-button>
              <el-button link type="primary" v-if="scope.row.status =='4'" @click="handleUpload(scope.row)">附件下载</el-button>
              <el-button link type="primary" v-if="scope.row.status =='4'" @click="generateUrlLink(scope.row)">分享链接</el-button>
              <el-button link type="primary" v-if="scope.row.status =='4'" @click="handleRecord(scope.row.id)">确认记录</el-button>
              <el-button link type="primary" v-if="scope.row.status =='4'" @click="uReportHandle(scope.row)" >打印</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-drawer title="物料新增退货" v-model="dialogExamine.visible" size="80%" draggable destroy-on-close>
      <!-- 物料退货 -->
      <!-- <el-dialog v-model="dialogExamine.visible" title="物料新增退货" center width="70%" draggable> -->
      <!-- 主体 -->
      <el-form :label-position="labelPosition" border label-width="100px" :model="formReturnOfGoods" :rules="formRules" ref="addForm">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="供应商：" prop="supplierId">
              <el-select style="width: 100%;" v-model="formReturnOfGoods.supplierId" filterable placeholder="请选择"
                         @change="getCustomerAddressList">
                <el-option v-for="item in suppliers" :key="item.id" :label="item.supplierCode+'-'+item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="退货时间：">
              <el-input v-model="formReturnOfGoods.backTime" placeholder="updateTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="收货地址：" prop="addressId">
              <el-select style="width: 100%;" v-model="formReturnOfGoods.addressId" filterable allow-create placeholder="请选择"
                         @blur="productSelect" >
                <el-option v-for="item in customerAddressList" :key="item.id" :label="item.address" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain @click="choosePurchase">选择物料</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handlempty()">清空 </el-button>
          </el-col>
        </el-row>
      </div>

      <XTable
        :pageShow="false"
        ref="xTableAdd"
        size="mini"
        :data="tableData"
        height="500"
        :column-config="{ resizable: true }"
        :columnList="addTableColumnList"
        border
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }"
        :edit-rules="editRules"
      >
        <template #edit-returnOfGoodsQuantity="{ row }">
          <el-input-number
            maxLength="11"
            :min="0"
            :max="row.quantity"
            placeholder="0"
            :precision="0"
            style="width: 99%;"
            :controls="false"
            v-model="row.returnOfGoodsQuantity"
          />
        </template>
        <template #default-returnOfGoodsQuantity="{ row }">
          {{ row.returnOfGoodsQuantity }}
        </template>

        <template #default-remark="{ row }">
          {{ row.remark }}
        </template>
        <template #edit-remark="{ row }">
          <el-input maxLength="100" style="width: 99%;" v-model="row.remark" />
        </template>

        <template #default-make="scope">
          <el-button size="small" text="plain" @click="deleteRowEvent(scope.row)">删除</el-button>
        </template>
      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialogExamine.visible = false">关闭</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="onSubmitCheckBtnClick('1')">保存</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="onSubmitCheckBtnClick('2')">提交</el-button>
          </span>
        </div>
      </template>
      <!-- </el-dialog> -->
    </el-drawer>

    <!-- 物料退货审核 -->
    <el-drawer v-model="dialogReturnApproval.visible" title="物料退货审批" center size="80%" draggable destroy-on-close>
      <div class="ptable-card">
        <XTable
          :pageShow="false"
          ref="xTableAudit"
          size="mini"
          :data="tableDataList"
          :column-config="{ resizable: true }"
          :columnList="auditColumnList"
          border
          :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }"
          :edit-rules="editRules"
          class="ptable-content"
        >
          <template #edit-price="{ row }">
            <el-input-number
              maxLength="11"
              :min="0"
              :precision="4"
              style="width: 99%;"
              @change="totalPriceCount(row)"
              :controls="false"
              v-model="row.price"
            />
          </template>
          <template #default-price="{ row }">
            {{ row.price }}
          </template>
          <template #default-remark="{ row }">
            {{ row.remark }}
          </template>
          <template #edit-remark="{ row }">
            <el-input maxLength="100" style="width: 99%;" v-model="row.remark" />
          </template>

          <template #default-make="scope">
            <el-button size="small" type="primary"  link @click="selectPurchaseOrderList(scope.row)">关联采购订单</el-button>
            <el-button size="small" type="primary"  link @click="delTableDataList(scope.row)">删除</el-button>
          </template>
        </XTable>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialogReturnApproval.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="onpassCheckBtnClick('3')">驳回 </el-button>
            <el-button :loading="buttonLoading" type="primary" @click="onpassCheckBtnClick('4')">通过</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!--选择物料弹窗-->
    <el-dialog
      v-model="purchaseDialog.visible"
      v-if="false"
      :title="purchaseDialog.title"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      width="98%"
    >
      <el-container>
        <el-aside width="310px" style="background-color: rgb(238, 241, 246)">
          <div style=" font-size:medium; font-weight:600">已选物料</div>
          <el-table :data="alreadySelectPurchase" tooltip-effect="dark" style="width: 100%;height: calc(100% - 40px);" :show-header="false">
            <el-table-column prop="materialCode" label="物料编码">
              <template #default="scope"> {{ scope.row.materialCode }} - {{ scope.row.name }} </template>
            </el-table-column>
            <el-table-column label="操作" width="50">
              <template #default="scope">
                <div style="text-align:center">
                  <el-button @click="removeDataOrder(scope.row)" type="text" size="small">X</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main style="padding:0px;overflow-x:hidden;">
          <el-table
            ref="purchaseTable"
            v-loading="loading"
            :data="materialInventoryList"
            tooltip-effect="dark"
            style="width: 100%;"
            height="450"
            :row-key="(row: any) => row.id"
            @select="handleSelectionChangePurchase"
          >
            <el-table-column type="selection" width="45" :reserve-selection="true" align="center" fixed> </el-table-column>
            <el-table-column prop="materialCode" width="80" label="物料编码" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="name" width="150" label="物料名称" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="boardThickness" width="150" label="板厚" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="copperThickness" width="150" label="铜厚" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="level" width="150" label="级别" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="color" width="150" label="颜色" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="length" width="150" label="长（mm）" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="width" width="150" label="宽（mm）" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="manufacturer" width="70" label="品牌" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="materialQuality" label="材质牌号" align="center" min-width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="unit" label="单位" align="center" min-width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="productionDate" label="生产日期" align="center" min-width="150" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="expirationDays" width="110" align="center" label="保质期（天）" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="expirationDate" width="80" align="center" label="过期日期" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="quantity" width="110" align="right" label="实际库存"> </el-table-column>
            <el-table-column prop="quantity" width="120" align="right" label="可用库存"> </el-table-column>
            <el-table-column prop="inTransitNumber" width="100" align="right" label="在途数"> </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParamsCommodity.pageNum"
            v-model:limit="queryParamsCommodity.pageSize"
            @pagination="choosePurchase"
          />
        </el-main>
      </el-container>
      <template #footer>
        <div class="text-center">
          <el-button @click="purchaseDialog.visible = false">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitPurchase">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="purchaseDialog.visible" :title="purchaseDialog.title" width="80%" draggable destroy-on-close>
      <el-row>
        <el-col :span="5">
          <el-table size="small" :data="alreadySelectPurchase" height="440" :border="true">
            <el-table-column property="materialCode" fixed />
            <el-table-column v-show="false" property="name" label="已选物料" />
            <el-table-column align="center">
              <template #default="scope">
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="CloseBold" @click="handleInventoryListDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="19">
          <XTable
            v-loading="loading"
            :pageShow="true"
            v-model:page-size="queryParamsCommodity.pageSize"
            v-model:current-page="queryParamsCommodity.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="materialInventoryList"
            :columnList="selectedMaterialColumnList"
            ref="inventoryTableRef"
            @searchChange="pageChange"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'id' }"
            @checkbox-change="selectChangeEvent"
            @checkbox-all="selectChangeEvent"
            height="440"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
            <!-- <template #default-units="scope">
              <dict-tag :options="unitsTypeList" :value="scope.row.units" />
            </template>
            <template #default-level="scope">
              <dict-tag :options="orderMaterialLevelList" :value="scope.row.level" />
            </template>
            <template #default-manufacturer="scope">
              <dict-tag :options="orderPlateBrandList" :value="scope.row.manufacturer" />
            </template> -->
          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="clearInventoryForm">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitPurchase">确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <!--  物料编辑 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="materialBackFormRef" :model="formBack" :rules="rules" label-width="120px">
        <el-form-item label="退货供应商" prop="rawMaterialId">
          <el-input v-model="formBack.supplierName" placeholder="退货供应商" disabled />
        </el-form-item>
        <el-form-item label="库存数">
          <el-input v-model="formBack.inventoryQuantity" disabled />
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input v-model.number="formBack.quantity" :max="formBack.inventoryQuantity" @input="handleInput" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="备注" prop="price">
          <el-input v-model="formBack.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitBackForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="dialog.visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--  关联采购单 -->
    <el-dialog :title="purchaseOrderDialog.title" v-model="purchaseOrderDialog.visible" width="80%" height="800">
      <XTable
        :pageShow="true"
        ref="selectOrderRef"
        size="mini"
        :data="purchaseOrderList"
        height="400"
        :column-config="{ resizable: true }"
        :columnList="purchaseOrderColumnList"
        border
        @checkbox-change="selectOneChangeEvent"
        :checkbox-config="{
          reserve: true,
          showHeader:false,
          checkMethod: selectableFun
        }"
        v-model:page-size="selectPurchaseQueryParams.pageSize"
        v-model:current-page="selectPurchaseQueryParams.pageNum"
        :intervalCondition="['createTime']"
        :page-params="{ perfect: true, total: selectPurchaseTotal }"
        @searchChange="searchPurchaseOrderChange"
      >
      </XTable>

      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="selectOneChangeSubmit">确 定</el-button>
          <el-button @click="purchaseOrderDialog.visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer title="物料退货确认单" v-model="dialogConfirm.visible" size="80%" draggable destroy-on-close>
      <el-form border label-width="100px" :model="formConfirm" :rules="formRules" ref="addForm">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="退货供应商:" prop="clientSupplierName">
              <el-input v-model="formConfirm.clientSupplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="退货人:">
              <el-input v-model="formConfirm.backUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="退货日期:">
              <el-input v-model="formConfirm.backTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <XTable
        :pageShow="false"
        ref="xTableConfirm"
        size="mini"
        :data="waitConfirmData"
        :loading="waitLoading"
        height="500"
        :column-config="{ resizable: true }"
        :columnList="waitColumnList"
        border
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }"
        :edit-rules="editRules"
      >
        <template #default-quantity="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="0" v-model="scope.row.quantity" @change="totalPriceCountCheck(scope.row)"/>
        </template>
        <template #default-rawMaterialInvontoryQuantity="scope">
          <span>{{ Number(scope.row.rawMaterialInvontoryQuantity).toFixed(0) }}</span>
        </template>
        <template #default-price="scope">
          <el-input-number style="width: 99%;"  :step="0.1" :controls="false" :precision="4" v-model="scope.row.price" @change="totalPriceCountCheck(scope.row)"/>
        </template>
        <template #default-confirmRemark="scope">
          <el-input style="width: 99%;"   v-model="scope.row.confirmRemark" />
        </template>
      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialogConfirm.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitConfirmForm">确认</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="fileId" :biz-code="bizCode"/>
    <!-- 操作记录 -->
    <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="recordId" />

    <!-- 打印单据-->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 取消对话框 -->
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
          <el-button v-if="statement.title === '申请取消'" type="primary" @click="cancelAccount">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MaterialBackDetail" lang="ts">
import {
  addMaterialBackDetail, cancelBackOrder, compareList, confirmMaterialBack,
  delMaterialBackDetail,
  getMaterialBackDetail,
  listMaterialBackDetail,
  saveMaterialBackDetail,
  updateBackDetailStatus,
  updateMaterialBackDetail,
  updateMaterialBackDetailQuantity, updateMaterialBackStatus
} from '@/api/purchase/materialBackDetail';
import {SupplierVO} from "@/api/basedata/supplier/types";
import {listSupplierNoPage} from '@/api/basedata/supplier';
import {
  DirectPurchase,
  MaterialBackDetailForm,
  MaterialBackDetailQuery,
  MaterialBackDetailVO
} from '@/api/purchase/materialBackDetail/types';
import {listMaterialInventory} from "@/api/purchase/materialInventory";
import {ref} from "vue";
import {MaterialInventoryVO} from "@/api/purchase/materialInventory/types";
import dayjs from "dayjs";
import {OrderVO} from "@/api/order/directOrder/types";
import {addOperateRecord, listPurchaseOrderDetail} from "@/api/purchase/materialOrderDetail";


import { VXETable, VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from "vxe-table";
import { deepClone } from '@/utils';
import {listBackDetail, listSupplierBackDetail} from "@/api/purchase/materialCheckDetail";
import {MaterialCheckDetailVO} from "@/api/purchase/materialCheckDetail/types";
import {RecordVO} from "@/api/purchase/record/types";
import {
  listCustomerSupplierAddress
} from "@/api/basedata/customerAddress";
import {CustomerAddressVO} from "@/api/basedata/customerAddress/types";
import {getReportUrl} from "@/utils/report";
import {getSignPdf} from "@/api/financial/accountOrder";
import {MaterialOrderForm, MaterialOrderQuery} from "@/api/purchase/materialOrder/types";
import useUserStore from "@/store/modules/user";
import { MaterialApplyVO } from "@/api/purchase/materialApply/types";
import clipboard3 from "vue-clipboard3";
import { getUrlLink } from "@/api/purchase/materialOrder";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const purchaseTable = ref<ElFormInstance>();

// 查询操作记录
const recordId = ref();
const recordVisible = ref(false);
const uploadVisible = ref(false);
// 文件上传类型
const moduleCode = ref('10');
const bizType = ref('15');
const fileId = ref<string | number>();
const bizCode = ref<string>();

const materialBackDetailList = ref<MaterialBackDetailVO[]>([]);
const materialBackDetailListALl = ref<MaterialBackDetailVO[]>([]);

const buttonLoading = ref(false);
const loading = ref(true);
const loadingList = ref(true);
const waitLoading = ref(false);

const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const totalList = ref(0);
const selectPurchaseTotal = ref(0);

const xTableAdd = ref();
const xTableAudit = ref();
const xTableConfirm = ref();
const selectOrderRef = ref();
const xTableAuditList = ref();
const addForm = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();
const materialBackDetailFormRef = ref<ElFormInstance>();
const materialBackFormRef = ref<ElFormInstance>();


const {back_detail_status} = toRefs<any>(proxy?.useDict("back_detail_status"));

const {back_detail_type} = toRefs<any>(proxy?.useDict("back_detail_type"));

// 操作记录
const recordList = ref<RecordVO[]>([]);
//待提交列表
const tableData = ref<MaterialInventoryVO[]>([]);
//待确认列表
const waitConfirmData = ref<MaterialCheckDetailVO[]>([]);
//待提交列表-备份
const tableDataCopy = ref<MaterialInventoryVO[]>([]);
//物料库存列表
const materialInventoryList = ref<MaterialInventoryVO[]>([]);
//已选物料
let alreadySelectPurchase = ref<MaterialInventoryVO[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: '退货编辑'
});

const purchaseOrderDialog = reactive<DialogOption>({
  visible: false,
  title: '选择采购单'
});

const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '退货'
});


const purchaseDialog = reactive<DialogOption>({
  visible: false,
  title: '选择物料'
});

const dialogReturnApproval = reactive<DialogOption>({
  visible: false,
  title: '物料退货审批'
});

const dialogConfirm = reactive<DialogOption>({
  visible: false,
  title: '退货编辑'
});

/** 确认表单 */
let formConfirm = reactive({
  clientSupplierName: undefined,
  backTime: undefined,
  backUserName: undefined,
});

/**
 * 退货
 */
let formReturnOfGoods = reactive({
  id: undefined,
  backTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  supplierName: undefined,
  otherReceiptList: [],
  quantity: undefined,
  returnOfGoodsQuantity: undefined,
  remark: undefined,
  supplierId: undefined,
});

/**
 * 审核菜单
 */
let formReturnApproval= reactive({
  supplierName:undefined,
  backTime:undefined,
});

/**
 * 退货
 */
let formBack = reactive({
  id: undefined,
  supplierName: undefined,
  quantity: undefined,
  remark: undefined,
  inventoryQuantity:undefined,
});


// 新增属性
const editableTabsValue = ref(1);

const initFormData: MaterialBackDetailForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  rawMaterialId: undefined,
  storageId: undefined,
  quantity: undefined,
  unit: undefined,
  price: undefined,
  supplierId: undefined,
  materialOrderDetailId: undefined,
  type: undefined,
  backUserId: undefined,
  backUserName: undefined,
  backTime: undefined,
  remark: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  ausitTime: undefined,
  code: undefined
}
const data = reactive<PageData<MaterialBackDetailForm, MaterialBackDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    rawMaterialId: undefined,
    storageId: undefined,
    quantity: undefined,
    unit: undefined,
    price: undefined,
    supplierId: undefined,
    materialOrderDetailId: undefined,
    type: undefined,
    backUserId: undefined,
    backUserName: undefined,
    backTime: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    ausitTime: undefined,
    status: undefined,
    code: undefined,
    params: {}
  },
  rules: {
    quantity: [
      {required: true, message: "数量不能为空", trigger: "blur"}
    ]
  }
});
const backData = reactive<PageData<MaterialBackDetailForm, MaterialBackDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    rawMaterialId: undefined,
    storageId: undefined,
    quantity: undefined,
    unit: undefined,
    price: undefined,
    supplierId: undefined,
    materialOrderDetailId: undefined,
    type: undefined,
    backUserId: undefined,
    backUserName: undefined,
    backTime: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    ausitTime: undefined,
    status: undefined,
    code: undefined,
    params: {}
  },
  rules: {
    quantity: [
      {required: true, message: "数量不能为空", trigger: "blur"}
    ]
  }
});
const selectPurchaseData = reactive<PageData<MaterialBackDetailForm, MaterialBackDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,

  },
  rules: {

  }
});

 const formRules = ref({
    supplierId: [
      { required: true, message: "请选择供应商", trigger: "blur" }
    ],
   addressId: [
     { required: true, message: "请选择退货地址", trigger: "blur" }
   ],
  }
);
// 0+正数且小数点后最多4位校验
const nullOrPositiveNumberWithTwoDecimals = (cellValue: any) => {
   if (!cellValue ) {
    return new Error('请输入大于等于0的数字')
  }else if (cellValue && !/^(0|[1-9]\d*)(\.\d{1,3})?$/.test(cellValue)) {
    return new Error('请输入数字、最多2位小数点')
  }
}
VXETable.validators.add('nullOrPositiveNumberWithTwoDecimals', {
  cellValidatorMethod({ cellValue }) {
    return nullOrPositiveNumberWithTwoDecimals(cellValue)
  }
})

const editRules = ref<VxeTablePropTypes.EditRules>({

  returnOfGoodsQuantity: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals' }
  ],
    price: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals' }
  ],
})

const {queryParams, form, rules} = toRefs(data);
const {queryParams:backQueryParams} = toRefs(backData);
const {queryParams:selectPurchaseQueryParams} = toRefs(selectPurchaseData);


const columnList = ref([
  { type: 'checkbox', fixed: 'left', width: '60', align: 'center', showOverflow: false },
  { title: "序号", fixed: 'left', width: '60', type: 'seq', align: 'center', showOverflow: false },
  { title: '退货状态',width: '80', field: 'status', align: 'center'},
  { title: '退货来源',width: '140', field: 'type', align: 'center'},
  { title: '退货单号',width: '140', field: 'code', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
    { title: '供应商编码',width: '100', field: 'supplierCode', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
      { title: '供应商名称',width: '160', field: 'supplierName', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料编码', width: '80',field: 'materialCode', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料名称',width: '80', field: 'name', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板厚', width: '60',field: 'boardThickness', align: 'center',  filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '铜厚', width: '60',field: 'copperThickness', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', width: '60',field: 'level', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色',width: '60', field: 'color', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长（mm）',width: '60', field: 'length', align: 'center',  filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '宽（mm）', width: '60',field: 'width', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌',width: '80', field: 'manufacturer', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '材质牌号',width: '80', field: 'materialQuality', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },

  { title: '退货数量', width: '80', field: 'quantity', align: 'center' },
  { title: '退货单价', width: '80',field: 'price', align: 'center' },
  { title: '退货总价', width: '80',field: 'totalPrice', align: 'center' },
  { title: '退货人员',width:'120', field: 'backUserName', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '退货时间',width: '120', field: 'backTime', align: 'center'
  , filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
},
  { title: '备注', width: '200',field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false },
]);

const columnList2 = ref([
  { title: "序号", fixed: 'left',width: '60',type: 'seq', align: 'center', showOverflow: false },

  { title: '退货状态',width: '80', field: 'status', align: 'center'
  , filterType: 'checkboxButton',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => statusOptions.value,
},
  { title: '确认状态',width: '80', field: 'confirmStatus', align: 'center'
    , filterType: 'radio',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => confirmStatusList.value,
  },
  { title: '退货来源',width: '140', field: 'type', align: 'center'},
  { title: '退货单号',width: '140', field: 'code', align: 'center',  filterType: 'input', filterParam: { placeholder: '' }},
   { title: '供应商编码',width: '100', field: 'supplierCode', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
   { title: '供应商名称',width: '160', field: 'supplierName', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料编码', width: '80',field: 'materialCode', align: 'center',filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称',width: '80', field: 'name', align: 'center',filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板厚', width: '60',field: 'boardThickness', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '铜厚', width: '60',field: 'copperThickness', align: 'center',filterType: 'input', filterParam: { placeholder: '' }},
  { title: '级别', width: '60',field: 'level', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '颜色',width: '60', field: 'color', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长（mm）',width: '60', field: 'length', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '宽（mm）', width: '60',field: 'width', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '品牌',width: '80', field: 'manufacturer', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '材质牌号',width: '80', field: 'materialQuality', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },

  { title: '库存数', width: '80', field: 'rawMaterialInvontoryQuantity', align: 'center' },
  { title: '退货数量', width: '80', field: 'quantity', align: 'center' },
  { title: '退货单价', width: '80',field: 'price', align: 'center' },
  { title: '退货总价', width: '80',field: 'totalPrice', align: 'center' },
  { title: '退货人员',width:'120', field: 'backUserName', align: 'center'  , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '退货时间',width: '120', field: 'backTime', align: 'center'
, filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
},
  { title: '备注', width: '200',field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '335', fixed: 'right', showOverflow: false },
]);

const selectedMaterialColumnList = ref([

  { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left', },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '单位名称', field: 'unit', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '备注', field: 'remark', width: '80', align: 'center',  },
  { title: '实际库存', field: 'quantity', width: '80', align: 'center',fixed: 'right',},

  { title: '在途数量', field: 'inTransitNumber', width: '120', align: 'center', fixed: 'right',},

]);


const addTableColumnList = ref([
{ title:'序号',align:'center', field:'seq' , type: 'seq',  width: '40', },
{ title:'物料编码',field:'materialCode',align:'center',  width: '80', },
{ title:'物料名称',field:'name',align:'center',   width: '80',},
{ title: '品牌', field: 'manufacturer', width: '80', align: 'center' },
{ title: '厚度', field: 'thickness', width: '80', align: 'center'},
  { title: '规格型号', field: 'specification', width: '80', align: 'center' },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center' },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center' },
  { title: '直径', field: 'diameter', width: '80', align: 'center' },
  { title: '长', field: 'length', width: '80', align: 'center', },
  { title: '宽', field: 'width', width: '80', align: 'center'  },
  { title: '颜色', field: 'color', width: '80', align: 'center'  },
  { title: '级别', field: 'level', width: '80', align: 'center'  },
{ title:'材质牌号',field:'materialQuality',align:'center',   width: '80',},
{ title:'库存数',field:'quantity',align:'center',    width: '80',fixed: 'right',},
{ title:'退货数',field:'returnOfGoodsQuantity',align:'center', editRender: {} , width: '80',fixed: 'right',  },
{ title:'备注',field:'remark',align:'center',  editRender: {}, width: '80',fixed: 'right', },
{ width:'200',title:'操作',align:'center', field:'make', width: '80',fixed: 'right',  },
]);

const waitColumnList = ref([
  { title:'序号',align:'center', field:'seq' , type: 'seq',  width: '60', },
  { title:'物料编码',field:'materialCode',align:'center',  width: '100', },
  { title:'物料名称',field:'name',align:'center'   },
  { title: '物料规格参数', field: 'specification', align: 'center' },
  { title: '单位', field: 'unit', width: '80', align: 'center' },
  { title: '退货数量', field: 'quantity', width: '100', align: 'center' },
  { title: '库存数量', field: 'rawMaterialInvontoryQuantity', width: '100', align: 'center' },
  { title: '退货单价', field: 'price', width: '100', align: 'center' },
  { title: '退货金额', field: 'totalPrice', width: '100', align: 'center' },
  { title: '退货原因', field: 'remark', width: '180', align: 'center' },
  { title: '确认备注', field: 'confirmRemark', width: '180', align: 'center' },
]);

const auditColumnList = ref([

{ title:'序号',field:'index', type:'seq' ,align:'center', width:'40' },
{ title:'退货单号',field:'code',align:'center', width:'120' },
{ title:'物料编码',field:'materialCode',align:'center', width:'80' },
{ title:'供应商名称',field:'supplierName',align:'center', width:'120' },
{ title:'物料名称',field:'name',align:'center', width:'80' },
{ title:'物料规格',field:'materialInfo',align:'center',  },
{ title:'退货数',field:'quantity',align:'center', width:'80' },
{ title:'退货单价',field:'price',align:'center',  editRender: {} ,width:'100'},
{ title:'总金额',field:'totalPrice',align:'center', width:'120' },
{ title:'备注',field:'remark',align:'center',  editRender: {} ,width:'120'},
{ title:'操作',field:'make',align:'center',   width:'120'},
]);

const purchaseOrderColumnList =ref([
    { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left', },
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60', },
  { title: '采购单号', field: 'orderCode', width: '160', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  {
    title: '供应商编码', field: 'supplierCode', width: '140', align: 'center',
  },
  {
    title: '供应商名称', field: 'supplierName', width: '140', align: 'center',
  },
  {
    title: '下单时间', field: 'createTime', width: '140', align: 'center',
    filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
   {
    title: '物料编码', field: 'rawMaterialCode', width: '80', align: 'center'
  },
  {
    title: '物料名称', field: 'name', width: '80', align: 'center'
  },
  { title: '规格型号', field: 'specification', width: '80', align: 'center' },
  { title: '采购单价', field: 'price', width: '80', align: 'center' },
  {
    title: '收货地址', field: 'addressName', width: '300', align: 'center'
  },
  {
    title: '物料类别', field: 'categoryName', width: '80', align: 'center'
  },

  {
    title: '材质牌号', field: 'materialQuality', width: '80', align: 'center'
  },
  {
    title: '板厚', field: 'boardThickness', width: '80', align: 'center'
  },
  {
    title: '铜厚', field: 'copperThickness', width: '80', align: 'center'
  },
  {
    title: '颜色', field: 'color', width: '80', align: 'center'
  },
  {
    title: '级别', field: 'level', width: '80', align: 'center'
  },
  {
    title: '长(mm)', field: 'length', width: '80', align: 'center',
  },
  {
    title: '宽(mm)', field: 'width', width: '80', align: 'center'
  },
  {
    title: '品牌', field: 'manufacturer', width: '80', align: 'center'
  },
  { title: '厚度', field: 'thickness', width: '80', align: 'center' },

  { title: '直径', field: 'diameter', width: '80', align: 'center' },
  {
    title: '库存单位', field: 'units', width: '80', align: 'center'
    , filterType: 'input', filterParam: { placeholder: '' },
  },
  { title: '要求交期', field: 'deliverTime', width: '80', align: 'center' },
  { title: '采购数量', field: 'quantity', width: '80', align: 'center' },
  { title: '收货数量', field: 'receiveQuantity', width: '80', align: 'center' },
  { title: '入库数量', field: 'inventoryQuantity', width: '80', align: 'center' },
  { title: '退货数', field: 'backQuantity', width: '80', align: 'center' },
  { title: '退货重收数', field: 'backResendQuantity', width: '80', align: 'center' },
  { title: '采购总金额', field: 'totalPrice', width: '80', align: 'center' },
  { title: '备注', field: 'remark', align: 'center', width: '80' },
  { title: '库存数', field: 'actualStock', align: 'center', width: '80' },
]);


const statusOptions = ref([
    { label: "待提交", value: "1" },
    { label: "待审核", value: "2" },
    { label: "已驳回", value: "3" },
    { label: "已审核", value: "4" },
    { label: "取消", value: "5" },
]);

const confirmStatusList = ref([
  { type:"warning", label: '待确认', value: "1" },
  { type:"primary", label: '待对方确认', value: "2" },
  { type:"success", label: '已确认', value: "3" }
]);

// 获取 搜索条件
const searchMaterialChange = (params: any) => {
  if (params) {
    if (params.status && Array.isArray(params.status)) {
       params.statusList = params.status.join(",");
       params.status = undefined;
    }
  }
  backQueryParams.value = params
  getListAll();
}
const searchChange = (params: any) => {
  queryParams.value = params
  queryParams.value.status = statusOptions.value[1].value
  getList()
}

/** 查询物料退货明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialBackDetail(queryParams.value);
  materialBackDetailList.value = res.rows;

  total.value = res.total;
  loading.value = false;
}
/** 查询物料退货明细列表 */
const getListAll = async () => {
  loadingList.value = true;
  const res = await listMaterialBackDetail(backQueryParams.value);
  materialBackDetailListALl.value = res.rows;
  totalList.value = res.total;
  loadingList.value = false;
}
const handleInput = async () => {

  if(formBack?.quantity && formBack?.inventoryQuantity){
    if (formBack.quantity > formBack.inventoryQuantity) {
        formBack.quantity = formBack.inventoryQuantity;
      }
  }

    }


/**
 * 物料新增退货
 */
const handleRoll = () => {
  formReturnOfGoods.supplierName = undefined;
  formReturnOfGoods.id = undefined;
  formReturnOfGoods.supplierId = undefined;
  formReturnOfGoods.addressName = undefined;
  formReturnOfGoods.addressId= undefined;
  tableData.value = [];
  dialogExamine.visible = true;
  customerAddressList.value = [];
}

const queryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});
const initQueryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});



/** 清空确认已选物料按钮操作 */
const handlempty = async () => {

   ElMessageBox.confirm(
      "您确定要清空记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  )
      .then(() => {

        tableData.value = [];
  //清空确认已选物料
     materialInventoryList.value = [];

      });
}
/**
 * 借料审核按钮弹窗
 */
const borrowingMaterialReview = async () => {
  const $table = xTableAuditList.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords.length < 1) {
      proxy?.$modal.msgError("请先选择待审核列表");
      return;
    }
    // tableDataList.value = selectRecords;
  tableDataListCopy.value=selectRecords;
  tableDataList.value=deepClone(tableDataListCopy.value);
  //拼接物料信息materialInfo
  tableDataList.value.forEach((item,index)=>{
    spliceMaterialInfo(item);
  })
    dialogReturnApproval.visible=true;
  }
    dialogReturnApproval.visible=true;
}
//拼接物料信息
const spliceMaterialInfo=(item:MaterialBackDetailVO)=>{
  let info = "";
  info += item.manufacturer ? "品牌："+item.manufacturer + " " : "";
  info += item.materialQuality ? "材质牌号："+item.materialQuality + " " : "";
  info += item.thickness ? "厚度："+item.thickness + " " : "";
  info += item.specification ? "规格型号："+item.specification + " " : "";
  info += item.copperThickness ? "铜厚："+item.copperThickness + " " : "";
  info += item.boardThickness ? "板厚："+item.boardThickness + " " : "";
  info += item.diameter ? "直径："+item.diameter + " " : "";
  info += item.length ? "长："+item.length + " " : "";
  info += item.width ? "宽："+item.width + " " : "";
  info += item.color ? "颜色："+item.color + " " : "";
  info += item.level ? "级别："+item.level + " " : "";
  item.materialInfo=info;
}

const pageChange = async(params: any) => {

  loading.value = true;
  if (params) {
    queryParamsCommodity.value = params;
  }else{
    queryParamsCommodity.value={...initQueryParamsCommodity.value};
  }

  queryParamsCommodity.value.isGreaterThanZero='1'
  const res = await listMaterialInventory(queryParamsCommodity.value);
  materialInventoryList.value = res.rows;

   total.value = res.total;
  loading.value = false;
setTableSelect()
}
/**
 * 选择物料
 */
const choosePurchase = async () => {
  addForm.value?.validate(async (valid: any) => {
    if (valid) {

  pageChange(null);
  purchaseDialog.visible = true;
  tableDataCopy.value=deepClone(tableData.value);
  alreadySelectPurchase.value=deepClone(tableDataCopy.value);

    }
  });

}
/**设置表格列表选中 */
const setTableSelect=()=>{

  // const $table = inventoryTableRef.value.xTableRef
  // if ($table) {
  //    //过滤materialInventoryList中id在selectInventoryList中的数据，
  //   let st = materialInventoryList.value.filter(item => {
  //     return alreadySelectPurchase.value.some(item2 => item.id == item2.rawMaterialId);
  //   });
  //   //先为materialInventoryList中所有数据取消选中
  //   $table.setCheckboxRow(materialInventoryList, false);
  //   $table.setCheckboxRow(st, true);
  // }
  nextTick(() => {
    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
        let st = materialInventoryList.value.filter(item => {
          return alreadySelectPurchase.value.some(item2 => item.id == item2.rawMaterialId);
      });
      let temp = alreadySelectPurchase.value.filter(item => {
        return !st.some(item2 => item.rawMaterialId == item2.id);
      });
      $table.setCheckboxRow(materialInventoryList, false);
      $table.setCheckboxRow(temp, true);
  }
  });


}




/**
 * 计算总金额
 */
const totalPriceCount = async (row:any) => {
  row.totalPrice=row.price * row.quantity
  row.totalPrice=row.totalPrice.toFixed(2);
}

/**
 * 计算总金额
 */
const totalPriceCountCheck = async (row:any) => {
  if(row.quantity > Number(row.rawMaterialInvontoryQuantity)){
    proxy?.$modal.msgError("退货数量不能超过"+row.rawMaterialInvontoryQuantity);
    return;
  }

  row.totalPrice=row.price * row.quantity
  row.totalPrice=row.totalPrice.toFixed(2);

}

/**
 * 审核按钮
 * @param row
 */
const handleExamine=  async (row?: MaterialBackDetailVO) => {

  tableDataListCopy.value=[row];
  tableDataList.value=deepClone(tableDataListCopy.value);
   tableDataList.value.forEach((item,index)=>{
    spliceMaterialInfo(item);
  })
  dialogReturnApproval.visible=true;
}
/**
 * 保存 提交
 * @param type
 */
const onSubmitCheckBtnClick = async (type: string) => {
  if (tableData.value.length <= 0) {
    ElMessage.error("请选择物料");
    return;
  }
//退货数校验
    let res: any = true;
    const _table = xTableAdd.value.xTableRef;
    let errMap = await _table.fullValidate(true);
    if (errMap) {
      res = false;
    }
    if (!res) {
      return;
    }
  buttonLoading.value = true;
  tableData.value.forEach(info => {
    info.status = type;
  })
  const directPurchase: DirectPurchase = {
    purchaseList: [],
    supplierId: "",
    addressId: "",
    addressName: ""
  };
  directPurchase.purchaseList = tableData.value;
  directPurchase.supplierId = formReturnOfGoods.supplierId;
  if(formReturnOfGoods.addressName) {
    directPurchase.addressName = formReturnOfGoods.addressName;
  }else{
    directPurchase.addressId = formReturnOfGoods.addressId;
  }
  await saveMaterialBackDetail(directPurchase).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  dialogExamine.visible = false;
  await getListAll();
}

/**
 * 通过 驳回
 * @param type
 */
const onpassCheckBtnClick = async (type: string) => {

  let check =true;
  if(type=="4"){
    //判断是否填了单价
   tableDataList.value.forEach((item,index)=>{
     if(!item.price){

        check=false;
       return;
     }
   })
  }
  if(!check){
     proxy?.$modal.msgError("请填写单价");
    return;
  }
  tableDataList.value.forEach(info => {
    info.status = type;
  })
  const directPurchase: DirectPurchase = {
    purchaseList: [],
    supplierId: "",
  };
  directPurchase.purchaseList = tableDataList.value;
  directPurchase.status = type;
  buttonLoading.value = true;
  await updateMaterialBackStatus(directPurchase).then((res) => {
    if(res && res.data && res.data.length>0){
      proxy?.$modal.msgError("库存不足，退货失败");
      //将tableDataList.value中库存数据修改为res.rows中的数据
      tableDataList.value.forEach((item,index)=>{
        let temp = res.data.find((item2)=>{
          return item2.id==item.rawMaterialInvontoryId;
        });
        if(temp){
          item.rawMaterialInvontoryQuantity=temp.quantity;
        }
      })
    }else{
      proxy?.$modal.msgSuccess("操作成功");
      dialogReturnApproval.visible = false;
      clearSelection();
    }
  }).catch(() => {
    proxy?.$modal.msgError("操作失败");
  }).finally(() => { buttonLoading.value = false; });
  await getList();
}

const reportDrawer = reactive({
  direction: 'left',
  visible: false,
  title: '采购退货单预览'
});
/** 报表预览地址 */
let reportUrl = ref("");

const uReportHandle = async (row : any) => {
  reportDrawer.title = "采购退货单预览";
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
  reportUrl.value = getReportUrl() + `&_n=采购退货单&_u=file:purchaseOrderBack.ureport.xml&url=system/materialBackDetail/materialBackPreview/${row.code}&listUrl=system/materialBackDetail/materialBackPreview?xyz=y&code=${row.code}&confirmStatus=${row.confirmStatus}`;
  console.log(reportUrl.value)
  reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
}

//移除已选订单
const removeDataOrder = (data: MaterialInventoryVO) => {
  var index = alreadySelectPurchase.value.indexOf(data);
  if (index > -1) {
    alreadySelectPurchase.value.splice(index, 1);
  }
  purchaseTable.value.toggleRowSelection(data, false);
}

/** 已选物料 删除按钮操作 */
const handleInventoryListDelete = async (row?: MaterialInventoryVO) => {
  const id = row?.id;
  //删除已选物料
  alreadySelectPurchase.value = alreadySelectPurchase.value.filter(item => item.id != id);

 const $table =  inventoryTableRef.value.xTableRef;
  if ($table) {
    $table.setCheckboxRow(row, false);
  }
}

const inventoryTableRef =  ref()
//选择物料 单选
const selectChangeEvent: VxeTableEvents.CheckboxChange<MaterialApplyVO> = ({ checked, row }) => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
      alreadySelectPurchase.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }

}
//选择订单
const handleSelectionChangePurchase = (val: MaterialInventoryVO[]) => {
  alreadySelectPurchase.value = val;
}
const xTable = ref<VxeTableInstance<MaterialInventoryVO>>();
/**
 * 保存
 * @param row
 */
const saveRowEvent = (row: MaterialInventoryVO) => {
  // row.unitedNumber = row.unitedWayLength * row.unitedWayWidth;
  console.log(row)
  const $table = xTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        VXETable.modal.message({content: `保存成功！name=${row.materialCode}`, status: "success"});
      }, 300);
    });
  }
};

const isActiveStatus = (row: OrderVO) => {
  const $table = xTable.value;
  if ($table) {
    return $table.isEditByRow(row);
  }
};

/**
 * 取消
 * @param row
 */
const cancelRowEvent = (row: MaterialInventoryVO) => {
  const $table = xTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      // 还原行数据
      $table.revertData(row);
    });
  }
};

//编辑
const editRowEvent = (row: MaterialInventoryVO) => {
  const $table = xTable.value;
  if ($table) {
    $table.setEditRow(row);
  }
};

//需要关联的数据
let selectedPurchaseOrder = ref<any>();

const searchPurchaseOrderChange = async (params: any) => {

  selectPurchaseQueryParams.value = params
   selectPurchaseQueryParams.value.rawMaterialId = selectedPurchaseOrder.value.rawMaterialId;
  const res = await listPurchaseOrderDetail(selectPurchaseQueryParams.value);
  purchaseOrderList.value = res.rows;
  selectPurchaseTotal.value = res.total;
  setTableSelectPurchase();
}

/**
 * 设置是否禁选
 */
const setTableSelectPurchase = () => {
 if(!selectedPurchaseOrder.value.materialOrderDetailId){
    purchaseOrderList.value.forEach(item => {
      item.checked = true;
    });
  }
  nextTick(() => {
    const $table = selectOrderRef.value?.xTableRef;
    if ($table) {
      //如果已经有选中的采购订单
    if(selectedPurchaseOrder.value.materialOrderDetailId){
      purchaseOrderList.value.forEach(item => {
        if(selectedPurchaseOrder.value.materialOrderDetailId==item.id){
          item.checked = true;
          $table.setCheckboxRow(item, true);
        }else{
          item.checked = false;
        }
      });
    }else{
      //如果没有选中的采购订单
      purchaseOrderList.value.forEach(item => {
        item.checked = true;
      });
    }
    }
  });
}



/** 查询采购订单明细 */
const selectPurchaseOrderList = async (row?: any) => {
selectedPurchaseOrder.value = row;
  const _id = row?.rawMaterialId

  selectPurchaseQueryParams.value.rawMaterialId = _id;
  selectPurchaseQueryParams.value.orderStatus = '3';
  const res = await listPurchaseOrderDetail(selectPurchaseQueryParams.value);
  purchaseOrderList.value = res.rows;
  selectPurchaseTotal.value = res.total;
  setTableSelectPurchase();
  purchaseOrderDialog.visible = true;
  // dialog.title = "修改物料退货明细";
}

/** 删除*/
const delTableDataList = async (row?: any) => {
  const _id = row?.id
  tableDataList.value = tableDataList.value.filter(item => item.id != _id);
  if (tableDataList.value.length == 0) {
    dialogReturnApproval.visible = false;
    clearSelection();
  }
}
/** 清除勾选*/
const clearSelection = async () => {
  const $table = xTableAuditList.value.xTableRef;
  if ($table) {
      $table.clearCheckboxReserve();
      $table.clearCheckboxRow();
      $table.setAllCheckboxRow(false);
  }
}

/**
 * 删除
 * @param row
 * @param index
 */
const deleteRowEvent = (row: MaterialInventoryVO) => {
  // const type = await VXETable.modal.confirm('您确定要删除该数据?');
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
        //删除该行记录
        // tableData.value.splice(index, 1);
        tableData.value = tableData.value.filter(item => item.id != row.id);
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};

const otherReceiptList = ref<MaterialInventoryVO[]>([]);
//选中的待审核的数据
const tableDataList = ref<MaterialInventoryVO[]>([]);
const tableDataListCopy = ref<MaterialInventoryVO[]>([]);
//采购订单的数据
const purchaseOrderList = ref<any[]>([]);
/** 已选物料取消按钮操作 */
const clearInventoryForm = () => {

 purchaseDialog.visible = false;
 alreadySelectPurchase.value = [];
 const $table = inventoryTableRef.value.xTableRef
 if ($table) {
   $table.clearCheckboxReserve();
   $table.clearCheckboxRow();
 }

}
//选择物料确认
const submitPurchase = () => {
  const list = alreadySelectPurchase.value.map((item) => {
    let materialInventoryVO: any = deepClone(item);

    if(tableDataCopy){
      console.log(tableDataCopy.value);
      let temp = tableDataCopy.value.find(item2 => item2.id == item.id);
      if(temp){
          materialInventoryVO.returnOfGoodsQuantity=temp.returnOfGoodsQuantity;
          materialInventoryVO.remark=temp.remark;
      }
    }
    return materialInventoryVO;
  })

  tableData.value=deepClone( list);
  cancelPurchase();
}


//订单返单取消
const cancelPurchase = () => {
  materialInventoryList.value = [];
  purchaseDialog.visible = false;
}


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  materialBackDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialBackDetailVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物料退货明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialBackDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialBackDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改物料退货明细";
}

/** 提交按钮操作 */
const handleUpdateBackDetailStatus = async (row?: MaterialBackDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  proxy?.$modal.loading('加载中...');
  const res = await updateBackDetailStatus(_id).finally(() => proxy?.$modal.closeLoading());
  Object.assign(form.value, res.data);
  dialog.title = "提交物料退货明细";
  getListAll();
}

/** 提交按钮 */
const submitForm = () => {
  materialBackDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialBackDetail(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMaterialBackDetail(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}
//记录选中的采购订单

//关联采购订单单选
const selectOneChangeEvent: VxeTableEvents.CheckboxAll<any> = ({ checked,row }) => {
 //将 purchaseOrderList中 id 不等于row.id的数据的checked设置为false
 if(checked){
   purchaseOrderList.value.forEach(item => {
        if(row.id!=item.id){
          item.checked = false;
        }else{
          item.checked = true;
        }
      });
}else{
     purchaseOrderList.value.forEach(item => {

          item.checked = true;
      });
 }
}
//关联采购订单确定按钮
const selectOneChangeSubmit = () => {
  const $table = selectOrderRef.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords.length > 0) {
       tableDataList.value.forEach(item => {
    if (selectedPurchaseOrder.value.id == item.id) {
      item.materialOrderDetailId = selectRecords[0].id;
      item.price = selectRecords[0].price;
      totalPriceCount(item);
    }
  });
    }else{
       tableDataList.value.forEach(item => {
    if (selectedPurchaseOrder.value.id == item.id) {
      item.materialOrderDetailId = undefined;
    }
  });
    }
  }
  purchaseOrderDialog.visible = false;
}

/** 是否禁选 */
const selectableFun = (scope:any) => {
    return scope.row.checked;
    // return true;
}
/**
 * 物料编辑确认按钮
 */
const submitBackForm = () => {
  buttonLoading.value = true;
  updateMaterialBackDetailQuantity(formBack).then(() => {
    proxy?.$modal.msgSuccess("编辑成功");
    dialog.visible = false;
    getListAll();
  }).catch(() => {
    proxy?.$modal.msgError("编辑失败");
    dialog.visible = false;
    getListAll();
  }).finally(() => buttonLoading.value = false);
}


/** 删除按钮操作 */
const handleDelete = async (row?: MaterialBackDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除退货单号为: '+row?.code+'且物料为: '+row?.name+'的物料？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delMaterialBackDetail(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getListAll();
}

/**
 * 编辑按钮
 * @param row
 */
const handleEdit = async (row?: MaterialBackDetailVO) => {
  dialog.title = row.materialCode+"-退货明细编辑";
  formBack.id = row?.id || ids.value;
  formBack.supplierName = row?.supplierName;
  formBack.quantity = row?.quantity;
  formBack.remark = row?.remark;
  formBack.inventoryQuantity = row?.rawMaterialInvontoryQuantity;
  dialog.visible = true;
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/materialBackDetail/export', {
    ...queryParams.value
  }, `materialBackDetail_${new Date().getTime()}.xlsx`)
}

const getVoidedList = async () => {


  if (editableTabsValue.value == 1) {
    queryParams.value.status = statusOptions.value[1].value;
     getList();
  }else{
    queryParams.value.status = undefined;
    getListAll();
  }
  // console.log(queryParams.value.status);


}
const customerAddressList = ref<CustomerAddressVO[]>([]);

watch(() => customerAddressList.value, (val) => {
}, { deep: true, immediate: true })
/** 查询地址列表 */

const getCustomerAddressList = async () => {
  customerAddressList.value = [];
  formReturnOfGoods.addressName = undefined;
  if (formReturnOfGoods.supplierId) {
    const res = await listCustomerSupplierAddress(formReturnOfGoods.supplierId);
    customerAddressList.value = res.data;
  }
}

const productSelect = async (e) => {
  let value = e.target.value; // 输入框值
  if (value) { // 只有输入才有这个值，下拉框选择的话 这个值为空
    formReturnOfGoods.addressName = value;
  }
}

/**
 * 查询供应商列表
 */
let suppliers: SupplierVO[] = [];
const getSupplierLists = async () => {
  const res = await listSupplierNoPage();
  console.log(res);
  suppliers = res;
  suppliers.forEach(item => {
    item.supplierName = String(item.supplierName)
  })
  console.log(suppliers);
}

/** 退货确认操作 */
const handleConfirm = async (row: any) => {
  formConfirm.backUserName = row.backUserName;
  formConfirm.backTime = row.backTime;
  formConfirm.clientSupplierName = row.supplierName;
  waitLoading.value = true;
  // 根据单号查询待确认列表
  const res = await listBackDetail({code: row.code, confirmStatus: row.confirmStatus});
  dialogConfirm.visible = true;
  waitConfirmData.value = res.data;
  waitLoading.value = false;
}

/** 提交按钮 */
const submitConfirmForm = async () => {
  let flag = false;
  waitConfirmData.value.forEach((item) => {
    //判断item.applyNum>0
    if (item.quantity <= 0) {
      proxy?.$modal.msgError("退货数量必须大于0");
      flag = true;
    }
    if(item.quantity > Number(item.rawMaterialInvontoryQuantity)){
      proxy?.$modal.msgError("退货数量不能超过"+item.rawMaterialInvontoryQuantity);
      flag = true;
    }
  });
  if (flag) {
    return;
  }
  const directPurchase: DirectPurchase = {
    purchaseList: [],
  };
  directPurchase.purchaseList = waitConfirmData.value;
  // 校验是否有修改
  const res = await compareList(directPurchase.purchaseList);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
  } else {
    await proxy?.$modal.confirm('是否确认提交数据项？').finally(() => loading.value = false);
  }
  buttonLoading.value = true;
  await confirmMaterialBack(directPurchase).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");


  dialogConfirm.visible = false;
  await getListAll();
}

/** 查询操作记录 */
const handleRecord = async (id: any) => {
  recordVisible.value = true;
  recordId.value = id;
}

//解构出复制方法
const { toClipboard } = clipboard3();
const { userId } = useUserStore();
/** 生成分享链接并复制 */
const generateUrlLink = async (row : any) => {
  // 退货单号
  let path = 'pages/subOne/procurementSignature/returnOrder/detail/index';
  let query = 'id='+row.code+'&status=' + row.confirmStatus+'&companyId=' + row.supplierCompanyId+'&shareUserId=' + userId;
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

/** 附件上传 */
const handleUpload = async (row: any) => {
  uploadVisible.value = true;
  fileId.value = row.bizId;
  bizCode.value = row.code;
}

const statement = reactive<any>({
  visible: false,
  title: '',
  describe: '',
});
const detailOrderFormRef = ref<ElFormInstance>();

const detailData = reactive<PageData<any, any>>({
  form: { ...initFormData },
  queryParams: {},
  rules: {
    confirmRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const {form : detailForm, rules: detailRules } = toRefs(detailData);

/** 取消按钮 */
const handleCancel = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.bizId = row?.bizId;
  detailForm.value.code = row?.code;
  statement.title = '申请取消';
  statement.describe = '取消备注';
  statement.visible = true;
}

/** 取消单据 */
const cancelAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      detailForm.value.status = '5';
      detailForm.value.confirmStatus = '2';
      await proxy?.$modal.confirm('是否确认取消单号为"' + detailForm.value.code + '"的数据项？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await cancelBackOrder(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("操作成功");
      statement.visible = false;
      await getVoidedList();
    }
  });
}

onMounted(() => {
  getVoidedList();
  getSupplierLists();
});
</script>import useUserStore from '@/store/modules/user';


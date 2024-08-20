<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row>
          <el-col :span="24" align="right">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              >退货申请</el-button
            >

<!--            <el-button-->
<!--              type="danger"-->
<!--              plain-->
<!--              icon="Delete"-->
<!--              :disabled="multiple"-->
<!--              @click="handleDelete()"-->

<!--              >删除</el-button-->
<!--            >-->


          </el-col>
        </el-row>
      </template>
      <el-tabs type="border-card" class="xtable-tab" @tab-click="radioTableHandle">
        <el-tab-pane label="待审核列表">
          <XTable toolId="outsourceSourceFullProcessOrderBackWait" height="100%" class="xtable-content"
            v-loading="waitLoading"
            v-model:page-size="waitQueryParams.pageSize"
            v-model:current-page="waitQueryParams.pageNum"
            :page-params="{ perfect: true, total: auditedTotal }"
            :data="waitAuditedBackList"
            :columnList="waitColumnList"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="waitSearchChange"
            :column-config="{ resizable: true }"
            @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'id' }"
            :intervalCondition="['backTime']"
          >

          <template #default-quantity="{ row }">
            <div>{{ row.quantity?Number(row.quantity).toFixed(0):0 }}</div>
          </template>
          <template #default-inventoryQuantity="{ row }">
            <div>{{ row.inventoryQuantity?Number(row.inventoryQuantity).toFixed(0):0 }}</div>
          </template>
          <template #default-status="{row}">
            <span>{{inventoryTypeStrings[row.status as keyof typeof FULLBACKSTATUSENUMS]}}</span>
          </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleToExamine(scope.row)" >审核</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)" >详情</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="退货列表">

             <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <el-button plain @click="handleExportRecord">导出 </el-button>
          </div>
          <XTable toolId="outsourceSourceFullProcessOrderBackReturn" height="100%" class="xtable-content"
            v-loading="loading"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="sourceFullProcessOrderBackList"
            :columnList="columnList"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="searchChange"
            :column-config="{ resizable: true }"
            @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'id' }"
            :intervalCondition="['backTime']"
          >
           <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button v-if="scope.row.status=='4'" link @click="accountUReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
          <template #default-quantity="{ row }">
            <div>{{ row.quantity?Number(row.quantity).toFixed(0):0 }}</div>
          </template>
          <template #default-status="{row}">
            <span>{{inventoryTypeStrings[row.status as keyof typeof FULLBACKSTATUSENUMS]}}</span>
          </template>
            <template #default-confirmStatus="scope">
              <div v-if="scope.row.status == 4" v-for="item in confirmStatusList">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="wxhSwitch && scope.row.confirmStatus == '3'" @click="handleCancel(scope.row)">取消</el-button>
              <el-button link type="primary" v-show="scope.row.confirmStatus == '1'" @click="handleConfirm(scope.row)">确认</el-button>
              <el-button
                link
                type="primary"
                v-show="scope.row.status==1||scope.row.status==3"
                @click="handleUpdate(scope.row)"

                >编辑</el-button
              >
              <el-button
                link
                type="primary"
                v-show="scope.row.status==1||scope.row.status==3"
                @click="handleDelete(scope.row)"

                >删除</el-button
              >
              <el-button
                link
                type="primary"
                v-show="scope.row.status==1||scope.row.status==3"
                @click="checkPass(scope.row)"

                >提交</el-button
              >
              <el-button link type="primary" @click="handleDetail(scope.row)" >详情</el-button>
              <el-button link type="primary" v-show="wxhSwitch && (scope.row.status==4 || scope.row.confirmStatus)" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" v-show="wxhSwitch && (scope.row.status==4 || scope.row.confirmStatus)" @click="handleRecord(scope.row.id)">确认记录</el-button>
              <el-button link type="primary" v-show="scope.row.status ==4" @click="accountUReportHandle(scope.row)" >打印</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-drawer :title="drawer.title" v-model="drawer.visible" size="80%" destroy-on-close>
          <el-card shadow="never" class="ptable-card">
      <el-form :model="selectForm" ref="backFormRef" :rules="selectRules" :disabled="drawer.title?.includes('详情')||drawer.title?.includes('审核')">
        <el-row>
          <el-col :span="6">
            <el-form-item label="退货供应商："  prop="supplierId">
              <el-select v-model="selectForm.supplierId" filterable placeholder="请选择供应商" @change="changeBackSupplier">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退货日期:" >
              <span v-if="!(drawer.title?.includes('审核')||drawer.title?.includes('详情'))">{{ currentTime }}</span>
              <span v-else>{{ selectForm.backTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="退货人:" >
              <span v-if="!drawer.title?.includes('审核')">{{ nickname }}</span>
              <span v-else>{{ selectForm.createByName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="退货地址：" prop="addressId">
              <el-select style="width: 100%;" v-model="selectForm.addressId" filterable allow-create placeholder="请选择"
                         @blur="productSelect" >
                <el-option v-for="item in customerAddressList" :key="item.id" :label="item.address" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10" class="mb8">

        <el-col :span="1.5">
          <el-button
            v-show="!(drawer.title?.includes('详情')||drawer.title?.includes('审核'))"
            type="primary"
            plain
            @click="selectMaterial"
            >选择产品</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-show="!(drawer.title?.includes('详情')||drawer.title?.includes('审核'))"
            @click="handlempty()"
            >清空
          </el-button>
        </el-col>
      </el-row>

      <XTable  :pageShow="false" ref="confirmTable" :edit-rules="validRules" :data="confirmOrderBackList" border :columnList="confirmColumnList">
        <template #default-categoryId="scope">
          <div>{{ scope.row.categoryName }}</div>
        </template>
        <template #default-unit="{ row }">
          <span>PCS</span>
        </template>
        <template #default-quantity="scope">
          <el-input-number style="width: 100%; text-align: left;" :controls="false"
          :precision="0"
          :min="1"
          :max="scope.row.canBackQuantity"
          :disabled="drawer.title?.includes('详情')||drawer.title?.includes('审核')"
          v-model="scope.row.quantity"   maxLength="11"
          />
        </template>
        <template #default-reason="scope">
          <el-input
            :disabled="drawer.title?.includes('详情')||drawer.title?.includes('审核')"
            style="width: 99%;"
            :controls="false" maxLength="1000"
            v-model="scope.row.reason"
          />
        </template>
        <template #default-make="scope">
          <el-button
            v-if="!drawer.title?.includes('详情')||drawer.title?.includes('审核')"
            link
            type="primary"
            @click="handleSelectDelete(scope.row)"

            >删除</el-button
          >
        </template>
      </XTable>
</el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancel">取消</el-button>
            <el-button
              v-if="!(drawer.title?.includes('详情')||drawer.title?.includes('审核'))"
              :loading="buttonLoading"
              type="primary"
              @click="submitForm"

              >确 定</el-button
            >
            <el-button
              type="danger"
              v-show="drawer.title?.includes('审核')"
              @click="reject(selectForm.id)"
              :loading="buttonLoading"
            >
              驳回
            </el-button>
            <el-button
              type="primary"
              v-show="drawer.title?.includes('审核')"
              @click="examinePass(selectForm.id)"
              :loading="buttonLoading"
            >
              通过
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>
    <SelectMaterial
      keyId="fullProcessOrderId"
      :total="selectTotal"
      :data="inventoryList"
      title="选择产品"
      v-model:loading="inventoryLoading"
      :selectColumnList="selectColumnList"
      v-model:show="dialog.visible"
      :columnList="inventoryColumnList"
      v-model:selectData="selectedOrderBackList"
      :leftAttrs="{'column-config':{ 'resizable': true }}"
      :rightAttrs="{'column-config':{ 'resizable': true }, 'toolId': 'SelectMaterialXTableId'}"
      @searchChange="pageChange"
      @confirm="submitInventoryForm"
      @close="dialog.visible = false"
    ></SelectMaterial>
    <!-- <el-dialog v-model="dialog.visible" title="选择产品" width="80%" draggable append-to-body modal>
      <el-row>
        <el-col :span="5">
          <XTable
            :pageShow="false"
            :data="selectedOrderBackList"
            :columnList="selectColumnList"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'fullProcessOrderId' }"
            height="440"
            ref="selectTableRef"
          >
            <template #default-make="scope">
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="CloseBold"
                  @click="handleInventoryListDelete(scope.row)"

                ></el-button>
              </el-tooltip>
              </template>
          </XTable>
        </el-col>
        <el-col :span="19">
          <XTable
            height="440"
            v-loading="inventoryLoading"
            :pageShow="true"
            v-model:page-size="selectQueryParams.pageSize"
            v-model:current-page="selectQueryParams.pageNum"
            :page-params="{ perfect: true, total: selectTotal }"
            :data="inventoryList"
            :columnList="inventoryColumnList"
            ref="inventoryTableRef"
            @searchChange="pageChange"
            :checkbox-config="{ reserve: true }"
              :column-config="{ resizable: true }"
            :row-config="{ keyField: 'fullProcessOrderId' }"
            @checkbox-change="selectChangeEvent"
            @checkbox-all="selectAllChangeEvent"
          >
          <template #default-unit="{ row }">
            <span>PCS</span>
          </template>
          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialog.visible = false">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitInventoryForm"
              >确 定</el-button
            >
          </span>
        </div>
      </template>
    </el-dialog> -->
    <el-dialog :title="updateDialog.title" v-model="updateDialog.visible" width="500px" destroy-on-close>
      <el-form ref="updateFormRef" :model="form" :rules="rules" label-width="120px">
         <el-form-item label="库存数量" prop="inventoryQuantity">
          <el-input-number style="width: 100%; text-align: left;" :controls="false" :disabled="true" v-model="form.inventoryQuantity"
                 />
        </el-form-item>
         <el-form-item label="未退货数量" prop="canBackQuantity">
          <el-input-number style="width: 100%; text-align: left;" :controls="false" :disabled="true" v-model="form.canBackQuantity"
                 />
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input-number style="width: 100%; text-align: left;" :controls="false" :min="1"  :max="form.canBackQuantity" :precision="0"  v-model="form.quantity" placeholder="请输入退货数量" maxLength="11"
                 />
        </el-form-item>
        <el-form-item label="退货原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入退货原因" maxLength="1000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button :loading="buttonLoading" type="primary" @click="submitUpdateForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="updateDialog.visible=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
      <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
      draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 退货单确认 -->
    <el-drawer :title="confirmDrawer.title" v-model="confirmDrawer.visible" size="70%" destroy-on-close>
      <el-card shadow="never" class="ptable-card">
        <el-form :model="selectForm" ref="backFormRef" :rules="selectRules" :disabled="true">
          <el-row>
            <el-col :span="6">
              <el-form-item label="退货供应商：" :label-width="formLabelWidth" prop="supplierId">
                <el-input v-model="selectForm.supplierCode" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="供应商名称：" :label-width="formLabelWidth" prop="supplierId">
                <el-input v-model="selectForm.supplierName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="退货日期:" :label-width="formLabelWidth">
                <el-input v-model="selectForm.backTime" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="退货人:" :label-width="formLabelWidth">
                <el-input v-model="selectForm.createByName" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <XTable  :pageShow="false" ref="confirmTable" :edit-rules="validRules" :data="confirmOrderBackList" border :columnList="confirmColumnList2">
          <template #default-unit="{ row }">
            <span>PCS</span>
          </template>
          <template #default-totalPrice="scope">
            {{Number(scope.row.quantity * scope.row.price).toFixed(2)}}
          </template>
          <template #default-quantity="scope">
            <el-input-number style="width: 100%; text-align: left;" :controls="false"
                             :precision="0"
                             :min="1"
                             :max="scope.row.canBackQuantity"
                             v-model="scope.row.quantity"   maxLength="11"
            />
          </template>
          <template #default-confirmRemark="scope">
            <el-input
              style="width: 99%;"
              :controls="false" maxLength="1000"
              v-model="scope.row.confirmRemark"
            />
          </template>
        </XTable>
      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancelComfirm">取 消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitConfrim">确 定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="fileId" :biz-code="bizCode"/>
    <!-- 操作记录 -->
    <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="recordId" />

    <el-dialog v-model="statement.visible" :title="statement.title" width="30%" align-center destroy-on-close>
      <el-row>
        <el-col :span="24">
          <el-form ref="detailOrderFormRef" :model="detailForm" :rules="detailRules" label-width="80px">
            <el-form-item label="取消备注" prop="confirmRemark">
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
          <el-button type="primary" @click="cancelAccount">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="SourceFullProcessOrderBack" lang="ts">
import {
  listSourceFullProcessOrderBack,
  getSourceFullProcessOrderBack,
  delSourceFullProcessOrderBack,
  listSourceInventoryOrderBack,
  addSourceFullProcessOrderBack,
  updateSourceOrderBackStatus,
  updateSourceFullProcessOrderBack,
  confirmOrderBack, compareList, sourceFullCancelBackOrder
} from '@/api/outsource/sourceFullProcessOrderBack';
import { SourceFullProcessOrderBackVO, SourceFullProcessOrderBackQuery, SourceFullProcessOrderBackForm,FULLBACKSTATUSENUMS,inventoryTypeStrings } from '@/api/outsource/sourceFullProcessOrderBack/types';
import { VxeTableEvents } from 'vxe-table'
import { VXETable, VxeTableInstance } from "vxe-table";
import { getBaseStorage } from "@/api/system/config";
const baseStorage = ref<any[]>([]);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const wxhSwitch = ref(import.meta.env.VITE_WXH_SWITCH === 'true');

const sourceFullProcessOrderBackList = ref<SourceFullProcessOrderBackVO[]>([]);
const waitAuditedBackList = ref<SourceFullProcessOrderBackVO[]>([]);
const confirmOrderBackList = ref<SourceFullProcessOrderBackVO[]>([]);
const selectedOrderBackList = ref<SourceFullProcessOrderBackVO[]>([]);
const inventoryList = ref<SourceFullProcessOrderBackVO[]>([]);
const buttonLoading = ref(false);
const confirmTable = ref();
const loading = ref(true);
const waitLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const auditedTotal = ref(0);

// 查询操作记录
const recordId = ref();
const recordVisible = ref(false);
const uploadVisible = ref(false);
// 文件上传类型
const moduleCode = ref('12');
const bizType = ref('15');
const fileId = ref<string | number>();
const bizCode = ref<string>();

const backFormRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();
const updateFormRef = ref<ElFormInstance>();
const inventoryLoading = ref(false);
import { deepClone } from '@/utils'
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const updateDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const formLabelWidth = '140px';
//头部按钮组
const radioTable = ref('待审核列表');
const radioTableHandle = (tab: any, event: any) => {
  console.log("tab", tab.props.label);
  radioTable.value = tab.props.label;
  if (radioTable.value == "待审核列表") {
    getWaitList()
  } else{
    getList()
  }
}
/** 新增按钮操作 */
const handleAdd = () => {
  confirmColumnList.value[10].visible = true;
  reset();
  drawer.visible = true;
  drawer.title = "退货申请";

}
const drawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const confirmDrawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const dateFormat = (cellValue : any) => {
  return dayjs(cellValue).format("YYYY-MM-DD")
}
const customerAddressList = ref<CustomerAddressVO[]>([]);

watch(() => customerAddressList.value, (val) => {
}, { deep: true, immediate: true })
/** 查询地址列表 */

const getCustomerAddressList = async () => {
  customerAddressList.value = [];
  selectForm.value.addressName = undefined;
  if (selectForm.value.supplierId) {
    const res = await listCustomerSupplierAddress(selectForm.value.supplierId);
    customerAddressList.value = res.data;
    console.log(customerAddressList.value)
  }
}

const productSelect = async (e) => {
  let value = e.target.value; // 输入框值
  if (value) { // 只有输入才有这个值，下拉框选择的话 这个值为空
    selectForm.value.addressName = value;
  }
}

/**审核弹窗按钮操作 */
const handleToExamine = async (row?: SourceFullProcessOrderBackVO) => {
  confirmColumnList.value[10].visible = false;
   selectForm.value.supplierId = row?.supplierId;
   selectForm.value.id = row?.id;
   selectForm.value.backTime = row?.backTime;
   selectForm.value.createByName = row?.createByName;
  confirmOrderBackList.value=[];
 var para = deepClone(row);
  para.backQuantity=para.backQuantity-para.quantity;
    para.canBackQuantity=para.canBackQuantity+para.quantity;
confirmOrderBackList.value.push(para);
  drawer.visible = true;
  drawer.title = "审核";
}
/**详情按钮操作 */
const handleDetail = async (row?: SourceFullProcessOrderBackVO) => {
confirmColumnList.value[10].visible = false;
  const _id = row?.id

selectForm.value.backTime = row?.backTime;
   selectForm.value.createByName = row?.createByName;
  selectForm.value.supplierId = row?.supplierId;
  confirmOrderBackList.value=[];
   var para = deepClone(row);
  para.backQuantity=para.backQuantity-para.quantity;
  para.canBackQuantity=para.canBackQuantity+para.quantity;
confirmOrderBackList.value.push(para);
  drawer.visible = true;
  drawer.title = "详情";

}

/** 确认按钮操作 */
const handleConfirm = async (row?: SourceFullProcessOrderBackVO) => {
  selectForm.value.backTime = row?.backTime;
  selectForm.value.createByName = row?.createByName;
  selectForm.value.supplierName = row?.supplierName;
  selectForm.value.supplierCode = row?.supplierCode;
  confirmOrderBackList.value=[];
  // 查询该订单下所有待确认的记录
  const res = await listSourceFullProcessOrderBack({code: row?.code, confirmStatus: '1'});
  confirmOrderBackList.value = res.rows;
  confirmOrderBackList.value.map(item => item.canBackQuantity = item.quantity+item.canBackQuantity);
  confirmDrawer.visible = true;
  confirmDrawer.title = "产品退货确认单";
}

/** 清空确认已选产品按钮操作 */
const handlempty = async () => {
  console.log("handlempty");
  const $table = confirmTable.value.xTableRef;
  selectedOrderBackList.value.forEach((item) => {
    $table.setCheckboxRow(item, false);
  });
  //清空确认已选产品
  confirmOrderBackList.value = [];
  selectedOrderBackList.value = [];

    const tableRef = inventoryTableRef.value?.xTableRef

  if (tableRef) {
    tableRef.clearCheckboxReserve();
    tableRef.clearCheckboxRow();
  }

}
/** 确认已选产品删除按钮操作 */
const handleSelectDelete = async (row?: SourceFullProcessOrderBackVO) => {
  const fullProcessOrderId = row?.fullProcessOrderId
  selectedOrderBackList.value = selectedOrderBackList.value.filter(item => item.fullProcessOrderId != fullProcessOrderId);
  let material = inventoryList.value.find(item => item.fullProcessOrderId == fullProcessOrderId);
  const $table = inventoryTableRef.value.xTableRef;
  if ($table) {
    $table.setCheckboxRow(material, false);
  }
  selectedOrderBackList.value = selectedOrderBackList.value.filter(item => item.fullProcessOrderId != fullProcessOrderId);
  confirmOrderBackList.value = confirmOrderBackList.value.filter(item => item.fullProcessOrderId != fullProcessOrderId);

}
/** 提交按钮 */
const submitForm = () => {
  backFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      //confirmOrderBackList.value是否为空
      if(confirmOrderBackList.value.length == 0){
        proxy?.$modal.msgError("请选择退货产品！");
        return ;
      }
      const $table = confirmTable.value.xTableRef
      if ($table) {
        const errMap = await $table.validate(true)
        if (errMap) {
          return ;
        }
      }
      confirmOrderBackList.value.map((item) => {
        if (selectForm.value.addressName) {
          item.addressName = selectForm.value.addressName;
        } else {
          item.addressId = selectForm.value.addressId;
        }
      });
      buttonLoading.value = true;
      form.value.backList = confirmOrderBackList.value;
      await addSourceFullProcessOrderBack(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("添加成功");
      drawer.visible = false;
      await getList();
      await getWaitList();
      //清空确认已选产品
      handlempty();
    }
  });
}

/** 提交按钮 */
const submitConfrim = async () => {
  //confirmOrderBackList.value是否为空
  if (confirmOrderBackList.value.length == 0) {
    proxy?.$modal.msgError("请选择退货产品！");
    return;
  }
  const $table = confirmTable.value.xTableRef
  if ($table) {
    const errMap = await $table.validate(true)
    if (errMap) {
      return;
    }
  }
  const res = await compareList(confirmOrderBackList.value);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
  } else {
    await proxy?.$modal.confirm('是否确认提交该数据项？').finally(() => loading.value = false);
  }
  buttonLoading.value = true;
  await confirmOrderBack(confirmOrderBackList.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  confirmDrawer.visible = false;
  await getList();
  await getWaitList();
}

/** 修改确认按钮 */
const submitUpdateForm = async () => {
   updateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      buttonLoading.value = true;
      await updateSourceFullProcessOrderBack(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("修改成功");
      updateDialog.visible = false;
      await getList();
      await getWaitList();
    }
  });
}



const validRules = ref<VxeTablePropTypes.EditRules<OrderVO>>({
  quantity: [
    { required: true, message: "请输入退货数量" }
  ],
  reason: [
    { required: true, message: "请输入退货原因" }
  ],})
const validEvent = async () => {
  const $table = confirmTable.value.xTableRef
  if ($table) {
    const errMap = await $table.validate()
    if (errMap) {
      VXETable.modal.message({ status: 'error', content: '校验不通过！' })
    } else {
      VXETable.modal.message({ status: 'success', content: '校验成功！' })
    }
  }
}


const supplierId = ref<string | number>('');
const initSelectFormData: SourceFullProcessOrderBackForm = {
  id: undefined,
  supplierId: undefined,
  createByName: undefined,
  quantity: undefined,
  reason: undefined,
  inventoryIdList: []
}
const SelectData = reactive<PageData<SourceFullProcessOrderBackForm, SourceFullProcessOrderBackQuery>>({
  form: { ...initSelectFormData },
  queryParams: {
    id: undefined,
    pageNum: 1,
    pageSize: 20,

  },
  rules: {
    supplierId: [
      { required: true, message: "请选择退货供应商", trigger: "blur" }
    ],
    /*addressId: [
      { required: true, message: "请选择退货地址", trigger: "blur" }
    ],*/
  }
});
const { form: selectForm, queryParams: selectQueryParams, rules: selectRules } = toRefs(SelectData);


const initFormData: SourceFullProcessOrderBackForm = {
  id: undefined,
  fullProcessOrderId: undefined,
  quantity: undefined,
  backTime: undefined,
  reason: undefined,
  no: undefined,
  ownerId: undefined,
  backList: []
}
const data = reactive<PageData<SourceFullProcessOrderBackForm, SourceFullProcessOrderBackQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    fullProcessOrderId: undefined,
    quantity: undefined,
    backTime: undefined,
    reason: undefined,
    no: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键id不能为空", trigger: "blur" }
    ],

    quantity: [
      { required: true, message: "退货数量不能为空", trigger: "blur" }
    ],

    reason: [
      { required: true, message: "退货原因不能为空", trigger: "blur" }
    ],

  }
});
//待审核
const waitAuditedData = reactive<PageData<SourceFullProcessOrderBackForm, SourceFullProcessOrderBackQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,

    pageSize: 20,
    supplierId: undefined,
    fullProcessOrderId: undefined,
    quantity: undefined,
    backTime: undefined,
    reason: undefined,
    no: undefined,
    ownerId: undefined,
    status: "2",
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键id不能为空", trigger: "blur" }
    ],
    fullProcessOrderId: [
      { required: true, message: "订单外协订单ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "退货数量不能为空", trigger: "blur" }
    ],
    backTime: [
      { required: true, message: "退货时间不能为空", trigger: "blur" }
    ],
    reason: [
      { required: true, message: "退货原因不能为空", trigger: "blur" }
    ],
    no: [
      { required: true, message: "退货单号不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所属单位ID不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const inventoryTableRef = ref()
//状态
const getTypeMainInfo =(_obj: any) => {
  let newArr=[];
    for (const [key, value] of Object.entries(_obj)) {
      newArr.push({ label: `${value}`, value: `${key}` })
    }
    return newArr;
}
const typeMainInfo = getTypeMainInfo(inventoryTypeStrings);
const confirmStatusList = ref([
  { type:"warning", label: '待确认', value: "1" },
  { type:"primary", label: '待对方确认', value: "2" },
  { type:"success", label: '已确认', value: "3" }
]);
const columnList = ref([

    { title:"序号" ,type: 'seq',field:'index',  align: 'center', width: '60' },
       { title: '单据状态',width:'70', field: 'status', align: 'center',  filterType: 'radioButton',
          filterData: () => typeMainInfo },
    /*{ title: '确认状态', field: 'confirmStatus', align: 'center', width: '80', filterType: 'radio',
      filterParam: { placeholder: '请输入状态' }, filterData: () => confirmStatusList.value },*/
        { title: '退货单号',width:'160', field: 'code', align: 'center', filterType: 'input', },
        { title: '外协单号',width:'130', field: 'outSourceCode', align: 'center', filterType: 'input', },
        {
          width: '120',
          title: '退货时间',
          field: 'backTime',
          align: 'center',
          filterType: 'intervalDate',
          filterParam: {
            startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
            endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
          }
        },
        { title: '退货地址', width:'160',field: 'addressName', align: 'center' },
        //{ title: '成品入库单号',width:'130', field: 'inventoryCode', align: 'center', filterType: 'input', },
        { title: '产品编码', width:'130',field: 'commodityCode', align: 'center', filterType: 'input', },
        { title: '产品名称', width:'200',field: 'commodityName', align: 'center', filterType: 'input', },
        { title: '退货数量(PCS)', width:'140',field: 'quantity', align: 'center',
          filterType: 'input',filterParam: {placeholder: '请输入数量',type:'number',precision:0,controls:false}  },
        { title: '退货供应商',  width:'200',field: 'supplierName', align: 'center', filterType: 'input', },
        { title: '外协单价', width:'100',field: 'price', align: 'center',
          filterType: 'input',filterParam: {placeholder: '请输入单价',type:'number',precision:4,controls:false} },
        { title: '外协数量(PCS)', width:'140',field: 'outSourceQuantity', align: 'center' },
        { title: '库存数', width:'80',field: 'inventoryQuantity', align: 'center',
        filterType: 'input',filterParam: {placeholder: '请输入数量',type:'number',precision:0,controls:false}   },
        { title: '存货仓', width:'80',field: 'storageName', align: 'center', filterType: 'radioButton',
          filterData: () => baseStorage.value,
          filterCustom: {label: 'name', value: 'id'}  },
    { title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right', },
]);
const waitColumnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
       { title: '单据状态',width:'70', field: 'status', align: 'center' },
        { title: '退货单号',width:'130', field: 'code', align: 'center', filterType: 'input', },
        { title: '外协单号',width:'130', field: 'outSourceCode', align: 'center', filterType: 'input', },
        {
          width: '120',
          title: '退货时间',
          field: 'backTime',
          align: 'center',
          filterType: 'intervalDate',
          filterParam: {
            startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
            endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
          }
        },
        { title: '退货地址', width:'130',field: 'addressName', align: 'center', filterType: 'input', },
        //{ title: '成品入库单号',width:'130', field: 'inventoryCode', align: 'center', filterType: 'input', },
        { title: '产品编码', width:'130',field: 'commodityCode', align: 'center', filterType: 'input', },
        { title: '产品名称', width:'200',field: 'commodityName', align: 'center', filterType: 'input', },
        { title: '退货数量(PCS)', width:'140',field: 'quantity', align: 'center',
          filterType: 'input',filterParam: {placeholder: '请输入数量',type:'number',precision:0} },
        { title: '退货供应商',width:'200', field: 'supplierName', align: 'center', filterType: 'input', },
        { title: '外协单价', width:'100',field: 'price', align: 'center',
          filterType: 'input',filterParam: {placeholder: '请输入单价',type:'number',precision:4}  },
        { title: '外协数量(PCS)', width:'140',field: 'outSourceQuantity', align: 'center' },
        { title: '库存数', width:'100',field: 'inventoryQuantity', align: 'center',
        filterType: 'input',filterParam: {placeholder: '请输入数量',type:'number',precision:0}  },
        { title: '存货仓', width:'80',field: 'storageName', align: 'center', filterType: 'radioButton',
          filterData: () => baseStorage.value,
          filterCustom: {label: 'name', value: 'id'}   },
    { title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right', },
]);

const confirmColumnList = ref([

  { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '产品编号', width: '140', field: 'commodityCode', align: 'center' },
  { title: '产品名称', width: '120', field: 'commodityName', align: 'center', },
  { title: '版本号', width: '100', field: 'version', align: 'center', },
  { title: '单价', width: '80', field: 'price', align: 'center', },
  { title: '存货仓', width: '120', field: 'storage', align: 'center', },
  { title: '库存数量(PCS)', width: '140', field: 'inventoryQuantity', align: 'center', },
  { title: '订单数量', width: '140', field: 'outSourceQuantity', align: 'center', },
  { title: '已退货数量', width: '140', field: 'backQuantity', align: 'center', },
  { title: '未退货数量', width: '140', field: 'canBackQuantity', align: 'center', },
  { title: '单位', width: '80', field: 'unit', align: 'center', },
  { title: '退货数量(PCS)', width: '100', field: 'quantity', align: 'center', },
  { title: '退货原因', width: '100', field: 'reason', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '120',visible:false, fixed: 'right', },
]);

const confirmColumnList2 = ref([
  { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '产品编号', width: '120', field: 'commodityCode', align: 'center' },
  { title: '产品名称', width: '140', field: 'commodityName', align: 'center', },
  { title: '退货仓', width: '120', field: 'storageName', align: 'center', },
  { title: '退货数量(PCS)', width: '100', field: 'quantity', align: 'center', },
  { title: '单位', width: '80', field: 'unit', align: 'center', },
  { title: '退货单价', width: '80', field: 'price', align: 'center', },
  { title: '退货金额', width: '80', field: 'totalPrice', align: 'center', },
  { title: '退货原因', width: '160', field: 'reason', align: 'center', },
  { title: '确认备注', width: '160', field: 'confirmRemark', align: 'center', },
]);
const selectColumnList = ref([
  { title: '', field: 'outSourceCode', align: 'center',width: '80', },
   { title: '已选产品', field: 'commodityCode', align: 'center' ,width: '90',},
  { title: '', align: 'center',  field: 'commodityName', },
  { title: '', align: 'center', field: 'make',width: '30', fixed: 'right',},
]);
const inventoryColumnList = ref([

        { type: 'checkbox', align: 'center', field: "checkbox", width: '30', },
        { title:"序号" ,type: 'seq',  align: 'center', width: '30' },
        { title: '外协单号', field: 'outSourceCode', align: 'center', filterType: 'input'   },
        { title: '客户名称', field: 'cusName', align: 'center', filterType: 'input' },
        { title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input'  },
        { title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input'  },
        { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input' },
        { title: '版本号', field: 'version', align: 'center', filterType: 'input' },
        { title: '单位', field: 'unit', align: 'center',  },
        { title: '外协数量(PCS)', field: 'outSourceQuantity', align: 'center',   },
        { title: '已退货数量', field: 'backQuantity', align: 'center', },
        { title: '未退货数量', field: 'canBackQuantity', align: 'center', },
        { title: '外协单价', field: 'price', align: 'center' ,
          filterType: 'input',filterParam: {placeholder: '请输入单价',type:'number',precision:4}},
        { title: '外协价格', field: 'totalPrice', align: 'center',  },
        { title: '库存数量(PCS)', field: 'inventoryQuantity', align: 'center',  },
        { title: '存货仓', field: 'storage', align: 'center', filterType: 'radioButton',
          filterData: () => baseStorage.value,
          filterCustom: {label: 'name', value: 'id'} },
]);

const checkedSourceFullProcessOrderBackList = ref<SourceFullProcessOrderBackVO[]>([]);

const { queryParams, form, rules } = toRefs(data);
const { queryParams:waitQueryParams } = toRefs(waitAuditedData);

//产品多选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<SourceFullProcessOrderBackVO> = () => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    selectedOrderBackList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}
/** 审核驳回 */
const reject = async (id:string|number|undefined) => {
  updateStatus(id,"3");
}

/** 审核通过 */
const examinePass = async (id:string|number|undefined) => {
  updateStatus(id, "4");
}

/** 提交*/
const checkPass = async (row: SourceFullProcessOrderBackVO) => {
  await proxy?.$modal.confirm('是否确认提交编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, "2", true);
}
const updateStatus = (id: any, status: string, flag: boolean = false) => {
  buttonLoading.value = true;
  if (flag) {
    // flag true 列表上的提交按钮，开启全局加载
    proxy?.$modal.loading('加载中...')
  }
  updateSourceOrderBackStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getList();
    getWaitList();
    drawer.visible = false;
  }).finally(() => {
    buttonLoading.value = false;
    if (flag) {
      // flag true 列表上的提交按钮，开启全局加载
      proxy?.$modal.closeLoading()
    }
  });

}
//产品单选
const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceFullProcessOrderBackVO> = () => {
    const tableRef = inventoryTableRef.value.xTableRef

    if (tableRef) {
        selectedOrderBackList.value = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());

        console.log(selectedOrderBackList.value);
    }
    console.log(selectedOrderBackList.value);

}

/** 已选产品确认按钮操作 */
const submitInventoryForm = () => {
  dialog.visible = false;
  //将已选中的赋值给confirmSelectInventoryList

  confirmOrderBackList.value = selectedOrderBackList.value;
  console.log('-----', selectedOrderBackList.value, confirmOrderBackList.value)


}
/** 已选产品 删除按钮操作 */
const handleInventoryListDelete = async (row?: SourceFullProcessOrderBackVO) => {
  const fullProcessOrderId = row?.fullProcessOrderId

  //删除已选产品
  selectedOrderBackList.value = selectedOrderBackList.value.filter(item => item.fullProcessOrderId != fullProcessOrderId);
  let material = inventoryList.value.find(item => item.fullProcessOrderId == fullProcessOrderId);
  const $table = inventoryTableRef.value.xTableRef;
  if ($table) {
    $table.setCheckboxRow(material, false);
  }
}


const selectTotal = ref(0);
/**选择产品按钮 */
const selectMaterial = async () => {

    backFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      selectQueryParams.value = initSelectFormData;
      await doSelectMaterial()
    }
    });
}

const pageChange = async (params: any) => {
  selectQueryParams.value = params
  await doSelectMaterial();

}
const doSelectMaterial = async () => {
  // 重置selectQueryParams

  if(selectForm.value.supplierId){
      selectQueryParams.value.supplierId = selectForm.value.supplierId;
    }
    console.log("doSelectMaterial",selectQueryParams.value.storage);
    if(selectQueryParams.value.storage){
      selectQueryParams.value.storageId=selectQueryParams.value.storage;
    }
    listSourceInventoryOrderBack(selectQueryParams.value).then((res) => {
      inventoryList.value = res.rows;
      selectTotal.value = res.total;
      inventoryLoading.value = false;
      setStorage( inventoryList.value)

    });
    dialog.visible = true;
    dialog.title = "选择产品";
    if (confirmOrderBackList.value&&confirmOrderBackList.value.length>0) {
    selectedOrderBackList.value = [...confirmOrderBackList.value];
      //遍历confirmSelectInventoryList.value 将quantity赋值给materialInventoryList中id相等的数据的quantity，
      confirmOrderBackList.value.forEach((item) => {
        selectedOrderBackList.value.forEach((item2) => {
          if (item.id == item2.id) {
            item2.quantity = item.quantity;
          }
        });
      });
    }
    setTableSelect();

}

/**设置表格列表选中 */
const setTableSelect = () => {

  const $table = inventoryTableRef.value?.xTableRef
  if ($table) {

    //过滤materialInventoryList中id在selectInventoryList中的数据，
    let st = inventoryList.value.filter(item => {
      return selectedOrderBackList.value.some(item2 => item.fullProcessOrderId == item2.fullProcessOrderId);
    });

      $table.setCheckboxRow(st, true);

  }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}
// 获取 搜索条件
const waitSearchChange = (params: any) => {
    waitQueryParams.value = params
    getWaitList()
}

/** 查询订单外协退货订单列表 */
const getList = async () => {
  loading.value = true;
  //queryParams.value.status = undefined;
  //转码

  queryParams.value.storageId=queryParams.value.storageName;

  const res = await listSourceFullProcessOrderBack(queryParams.value);
  sourceFullProcessOrderBackList.value = res.rows;
  setStorage( sourceFullProcessOrderBackList.value)
  total.value = res.total;
  loading.value = false;
}

/** 查询订单外协退货订单列表 */
const getWaitList = async () => {
  waitLoading.value = true;
  waitQueryParams.value.status = "2";
  //转码

  waitQueryParams.value.storageId=waitQueryParams.value.storageName;

  const res = await listSourceFullProcessOrderBack(waitQueryParams.value);
  waitAuditedBackList.value = res.rows;

  setStorage( waitAuditedBackList.value)
  auditedTotal.value = res.total;
  waitLoading.value = false;
}

const setStorage = (_list:any[]) => {
  if(_list&&_list.length>0){
    _list.filter((item:any) => {
      baseStorage.value.forEach((item2) => {
        if (item.storageId == item2.id) {
          item.storage = item2.name;
        }
      });
    });
  }
}

/** 取消按钮 */
const cancel = () => {
  reset();
  drawer.visible = false
}

/** 取消按钮 */
const cancelComfirm = () => {
  reset();
  confirmDrawer.visible = false
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  selectForm.value = {...initSelectFormData};
    confirmOrderBackList.value = [];
    selectForm.value.supplierId = undefined;
  // confirmTable.value?.resetFields();
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
const handleSelectionChange = (selection: SourceFullProcessOrderBackVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 修改按钮操作 */
const handleUpdate = async (row?: SourceFullProcessOrderBackVO) => {
  form.value.quantity=undefined;
  const _id = row?.id || ids.value[0]
  form.value.id = _id;
  form.value.quantity = row?.quantity;
  form.value.reason = row?.reason;
  form.value.inventoryQuantity = row?.inventoryQuantity;
  form.value.canBackQuantity = row.canBackQuantity+row.quantity;
  updateDialog.visible = true;
  updateDialog.title = "修改订单外协退货订单";
}


/** 删除按钮操作 */
const handleDelete = async (row?: SourceFullProcessOrderBackVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除订单外协退货订单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceFullProcessOrderBack(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceFullProcessOrderBack/export', {
    ...queryParams.value
  }, `sourceFullProcessOrderBack_${new Date().getTime()}.xlsx`)
}
  /** 导出按钮操作 */
  const handleExportRecord = () => {
    proxy?.download('outsource/sourceFullProcessOrderBack/exportBack', {
      ...queryParams.value, tableName: 'outsourceSourceFullProcessOrderBackReturn'
    }, `外协退货记录_${new Date().getTime()}.xlsx`)
  }
import {  listOutSourceSupplierList } from "@/api/outsource/sourceFullProcessOrder";
const supplierList: any = ref([]);
/** 查询外协供应商列表 */
const queryOutSourceSupplierList = async () => {
  const res = await listOutSourceSupplierList();
  supplierList.value = res.data
}
import useUserStore from '@/store/modules/user';
import dayjs from "dayjs";

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

const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  baseStorage.value = res.data;
};

const changeBackSupplier = (val: any) => {
  handlempty();
  getCustomerAddressList();
};

/** 对账单按钮操作 */
import { getReportUrl } from '@/utils/report';
import {ref} from "vue";
import {getSignPdf} from "@/api/financial/accountOrder";
import {CustomerAddressVO} from "@/api/basedata/customerAddress/types";
import {listCustomerSupplierAddress} from "@/api/basedata/customerAddress";
import {MaterialOrderForm, MaterialOrderQuery} from "@/api/purchase/materialOrder/types";
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '外协退货合同'
});
const accountUReportHandle = async (row: any) => {
  const reportName='_外协订单退货合同';
  reportDrawer.title = "外协订单退货合同预览";
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
  reportUrl.value = getReportUrl() + `&_n=${reportName}&_u=file:outSourceBack.ureport.xml&url=outsource/sourceFullProcessOrderBack/review/${row.id}&listUrl=outsource/sourceFullProcessOrderBack/listReview/${row.id}`;
  // reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
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

const statement = reactive<DialogOption>({
  visible: false,
  title: '',
});


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
const detailOrderFormRef = ref<ElFormInstance>();

/** 取消按钮 */
const handleCancel = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.code = row?.code;
  statement.title = '申请取消';
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
      await sourceFullCancelBackOrder(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getList();
    }
  });
}

onMounted(() => {
  console.log(wxhSwitch.value)
  getList();
  queryOutSourceSupplierList();
  updateCurrentTime();
  getWaitList();
  getListBaseStorage();
});
</script>

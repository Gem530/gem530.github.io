<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="4">
            <!-- <el-button type="primary" plain icon="Plus" @click="handleAdd"
              >外协对账</el-button> -->
          </el-col>
          <el-col :span="20" style="display: flex;justify-content: flex-end;">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              >外协对账</el-button>
<!--            <el-button :disabled="writeOffList.length == 0" type="primary" plain icon="Plus"-->
<!--              v-show="radioTable.includes('已审核')" @click="handleWriteOff">账单冲销</el-button>-->
          </el-col>
        </el-row>
      </template>

      <el-tabs class="xtable-tab" type="border-card" @tab-click="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="对账单列表" name="对账单列表">
          <XTable v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%"
            class="xtable-content" :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
            :data="orderFilinOutList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange" :showRefresh="true"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-status="scope">
              <span v-if="scope.row.payablePrice != 0">{{ scope.row.status }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="checkPass(scope.row)">提交</el-button>
              <el-button link type="primary" v-show="scope.row.status == '待审核'"
                @click="handleToExamine(scope.row)">审核</el-button>
              <el-button link type="primary" v-show="scope.row.status == '审核通过'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待审核列表" name="待审核列表">
          <XTable v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%"
            class="xtable-content" :intervalCondition="intervalCondition" :showRefresh="true"
            :page-params="{ perfect: true, total: waitTotal }" :data="orderFilinOutWaitList" :columnList="columnList"
            ref="custTableRef" border @searchChange="searchChange" :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }">
            <template #default-status="scope">
              <span v-if="scope.row.payablePrice != 0">{{ scope.row.status }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="checkPass(scope.row)">提交</el-button>
              <el-button link type="primary" v-show="scope.row.status == '待审核'"
                @click="handleToExamine(scope.row)">审核</el-button>
              <el-button link type="primary" v-show="scope.row.status == '审核通过'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已审核列表" name="已审核列表">
          <XTable v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%"
            class="xtable-content" :intervalCondition="intervalCondition" :showRefresh="true"
            :page-params="{ perfect: true, total: aduitTotal }" :data="orderFilinOutAduitList" :columnList="columnList"
            ref="aduitTableRef" border @searchChange="searchChange" :column-config="{ resizable: true }"
            @checkbox-all="handleSelectionChange" @checkbox-change="handleSelectionChange"
            :checkbox-config="{ trigger: 'row', checkMethod: selectableFun }" :row-style="tableRowClassName"
            :row-config="{ keyField: 'id' }">
            <template #default-status="scope">
              <span v-if="scope.row.payablePrice != 0">{{ scope.row.status }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="checkPass(scope.row)">提交</el-button>
              <el-button link type="primary" v-show="scope.row.status == '待审核'"
                @click="handleToExamine(scope.row)">审核</el-button>
              <el-button link type="primary" v-show="scope.row.status == '审核通过'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable>
      <el-form border label-width="100px"
        :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')" ref="addTabFormRef"
        :model="inOrOutQuery" :rules="tabRules">
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="工序名称" prop="craftId">
              <el-select v-model="form.craftId" placeholder="请选择工序" style="width: 100%;">
                <el-option v-for="item in craftList" :key="item.id" :label="item.craftName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="供应商：" prop="supplierId">
              <el-select :disabled="drawerBorrow.title?.includes('修改')" placeholder="请选择供应商" style="width: 100%;"
                v-model="inOrOutQuery.supplierId" @change="setSupplierInfo">
                <el-option v-for="item in SupplierList" :key="item.id" :label="item.supplierName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="币种："> {{ inOrOutQuery.currency }}</el-form-item>
          </el-col>
          <el-col :span="12" style="display: flex; justify-content: flex-start; align-items: center;"
            v-show="drawerBorrow.title?.includes('添加') || drawerBorrow.title?.includes('修改')">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleInOrOutQuery">搜索</el-button>
              <el-button icon="Refresh">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="!drawerBorrow.title?.includes('添加') && !drawerBorrow.title?.includes('修改')"></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="对账日期：" prop="accountTime">
              <el-date-picker v-model="inOrOutQuery.accountTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                value-format="YYYY-MM-DD 23:59:59" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="对账月份： " prop="accountMonth">
              <el-date-picker v-model="inOrOutQuery.accountMonth" style="width: 100%;" type="month" placeholder="选择月份"
                value-format="YYYY-MM-01 23:59:59" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="备注：">
              <el-input v-model="inOrOutQuery.remark" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs v-model="tabRadioTable" @tab-click="tabRadioTableHandle">

          <el-tab-pane label="外协收货" name="外协收货">
            <XTable :pageShow="true" v-model:page-size="inOrOutQuery.pageSize" v-model:current-page="inOrOutQuery.pageNum"
              :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: inOrOutTotal }" size="mini"
              :data="receiveList" :columnList="tabColumnList" ref="wangbanTableRef" @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectChangeEvent" border @searchChange="feilinSearchChange" :loading="inOrOutLoading"
              :checkbox-config="{ checkMethod: tabCheckMethod }" :column-config="{ resizable: true }">
              <template #default-unit="scope">
                <div v-for="item in unitOptions">
                  <span>{{ item.value == scope.row.unit ? item.label : "" }}</span>
                </div>
              </template>
              <template #default-checkQuantity="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :precision="2" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.checkQuantity" />
              </template>
              <template #default-checkPrice="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :precision="2" @change="calculatePrice(row)" style="width: 99%;" :controls="false"
                  v-model="row.checkPrice" />
              </template>

              <template #default-discountPrice="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :precision="2" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.discountPrice" />
              </template>
            </XTable>
          </el-tab-pane>
          <el-tab-pane label="外协报废" name="外协报废">
            <XTable :pageShow="true" v-model:page-size="inOrOutQuery.pageSize" v-model:current-page="inOrOutQuery.pageNum"
              :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: inOrOutTotal }" size="mini"
              :data="backList" :columnList="backColumnList" ref="feilinTableRef" @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectChangeEvent" border @searchChange="feilinSearchChange" :loading="inOrOutLoading"
              :checkbox-config="{ checkMethod: tabCheckMethod }" :disabled="inOrOutQuery.queryType == '1'"
              :column-config="{ resizable: true }">
              <template #default-checkQuantity="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :precision="2" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.checkQuantity" />
              </template>
              <template #default-checkPrice="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :precision="2" @change="calculatePrice(row)" style="width: 99%;" :controls="false"
                  v-model="row.checkPrice" />
              </template>

              <template #default-discountPrice="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :precision="2" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.discountPrice" />
              </template>
            </XTable>
          </el-tab-pane>
          <el-tab-pane label="其他金额" name="其他金额">
            <el-button v-if="otherAmountBtn" type="primary" @click="otherMoneyHandle"> 新增金额 </el-button>
            <vxe-table align="center" border ref="otherTableRef" height="400" size="mini" :row-config="{ isHover: true }"
              :data="accountOrderOtherList" @checkbox-all="selectOtherAllChangeEvent"
              @checkbox-change="selectOtherChangeEvent">
              <vxe-column width="40" type="checkbox"
                v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"> </vxe-column>
              <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
              <vxe-column v-if="!otherAmountBtn" width="180" title="创建时间" field="createTime"> </vxe-column>
              <vxe-column v-if="!otherAmountBtn" field="createByName" title="创建人" width="120"></vxe-column>
              <vxe-column field="recordTime" width="140" title="对账时间">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d} {h}:{m}') }}</span>
                </template>
              </vxe-column>
              <vxe-column field="type" width="80" title="金额类型">
                <template #default="scope">
                  <span>{{ scope.row.type == 1 ? '入金' : '出金' }}</span>
                </template>
              </vxe-column>
              <vxe-column field="price" width="80" title="金额"> </vxe-column>
              <vxe-column field="remark" fixed="right" title="备注"> </vxe-column>
              <vxe-column fixed="right" width="120" title="操作"
                v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')">
                <template #default="scope">
                  <el-button link type="primary" @click="handleUpdateOther(scope.row)"
                    >修改</el-button>
                  <el-button link type="primary" @click="handleDeleteOther(scope.row)"
                    >删除</el-button>
                </template>
              </vxe-column>
            </vxe-table>
          </el-tab-pane>

        </el-tabs>
      </el-form>

      <el-form border label-width="120px" :model="outForm">
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="外协总金额：" prop="borrowTotalPrice">{{ borrowTotalPrice }}</el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item size="small" label="退货总金额：" prop="backTotalPrice">{{ backTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="折扣总金额：" prop="backTotalPrice">{{ borrowDiscountTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="入金总金额：" prop="backDiscountTotalPrice">{{ otherRecoverTotalPrice
            }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="出金总金额：" prop="backDiscountTotalPrice">{{ otherOutTotalPrice
            }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="对账总金额：" prop="accountPrice">{{ borrowTotalPrice -
              borrowDiscountTotalPrice - backTotalPrice - otherOutTotalPrice + otherRecoverTotalPrice }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="addCancel">取消</el-button>
            <el-button type="danger" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSave">
              保存
            </el-button>
            <el-button type="primary" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSubmit">
              提交
            </el-button>
            <el-button type="danger" v-show="drawerBorrow.title?.includes('审核')" @click="reject(inOrOutQuery.id)">
              驳回
            </el-button>
            <el-button type="primary" v-show="drawerBorrow.title?.includes('审核')" @click="examinePass(inOrOutQuery.id)">
              通过
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="otherMoneyDialog.visible" :title="otherMoneyDialog.title" width="30%" draggable style="min-width: 450px;">
      <el-form ref="accountOrderOtherFormRef" :model="otherForm" :rules="otherRules" label-width="100px"
        label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="金额类型:" prop="type">
              <el-radio-group v-model="otherForm.type">
                <el-radio label="1">入金</el-radio>
                <el-radio label="2">出金</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="对账日期:" prop="recordTime">
              <el-date-picker v-model="otherForm.recordTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                value-format="YYYY-MM-DD 23:59:59" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="金额:" prop="price">
              <el-input-number style="width: 100%; text-align: left;" :controls="false" v-model="otherForm.price"
                :precision="2" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="otherForm.remark" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="otherCancel">取消</el-button>
            <el-button type="primary" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="otherSubmitForm" >
              保存
            </el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <writeOffDialog v-model:open="writerOffDialogOpen" :writeOffList="writeOffList" :type="writeOffType"
      @getList="getList"></writeOffDialog>
    <writeOffsRecordDialog v-model:open="writerOffRecordDialogOpen" :accountOrderWriteOff="accountOrderWriteOff"
      :type="writeOffType" @getList="getList"></writeOffsRecordDialog>

  </div>
</template>

<script setup name="OrderFilinOutDetail" lang="ts">
import writeOffDialog from '../components/writeOffDialog.vue';
import writeOffsRecordDialog from '../components/writeOffRecordDialog.vue';
import { OrderFilinOutDetailVO, OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';
import { VxeTableEvents } from 'vxe-table';
import { SupplierVO } from "@/api/basedata/supplier/types";
import { AccountOrderOtherVO, AccountOrderOtherForm, AccountOrderOtherQuery } from '@/api/financial/accountOrderOther/types';
import { SourceHalfProcessCalcRuleVO, SourceHalfProcessCalcRuleTypeEnum } from "@/api/outsource/sourceHalfProcessCalcRule/types";
import { listSourceHalfProcessCalcRule } from "@/api/outsource/sourceHalfProcessCalcRule";

import { OrderHalfProcessOutDetailVO, OrderHalfProcessOutDetailQuery, OrderHalfProcessOutDetailForm, HalfOutTypeEnum } from '@/api/financial/orderHalfProcessOutDetail/types';

import { listSourceHalfProcessReceiveList } from '@/api/outsource/sourceHalfProcessReceive';
import { listScrap } from '@/api/production/scrap';
import { ScrapVO, ScrapForm, ScrapQuery } from '@/api/production/scrap/types';
import { SourceHalfProcessReceiveVO, SourceHalfProcessReceiveForm, SourceHalfProcessReceiveQuery } from '@/api/outsource/sourceHalfProcessReceive/types';
import { listOrderHalfProcessOutDetail } from '@/api/financial/orderHalfProcessOutDetail';
import { getCraftList } from "@/api/basedata/craft";

import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  listAccountOrder,
  getAccountOrder,
  delAccountOrderNew,
  addAccountOrder,
  updateAccountOrder,
  listSupplier,
  updateAccountOrderStatus,
} from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, TypeEnum, StatusEnum } from '@/api/financial/accountOrder/types';
import { CraftVO } from "@/api/basedata/craft/types";
const craftList = ref<CraftVO[]>([]);
const unitOptions = ref([
   {value: "1", label: "大料"},
   {value: "2", label: "PNL"},
   {value: "3", label: "SET"},
 ])
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const orderFilinOutList = ref<AccountOrderVO[]>([]);
const orderFilinOutWaitList = ref<AccountOrderVO[]>([]);
const orderFilinOutAduitList = ref<AccountOrderVO[]>([]);
//已选择记录
const orderFilinOutDetailList = ref<OrderHalfProcessOutDetailVO[]>([]);
const backList = ref<ScrapVO[]>([]);
const receiveList = ref<SourceHalfProcessReceiveVO[]>([]);
const checkedOrderBackOutDetailList = ref<OrderHalfProcessOutDetailVO[]>([]);
const checkedOrderReceviceOutDetailList = ref<OrderHalfProcessOutDetailVO[]>([]);
//其他金额
const accountOrderOtherList = ref<AccountOrderOtherVO[]>([]);
//选中的其他金额
const selectedOrderOtherList = ref<AccountOrderOtherVO[]>([]);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const waitTotal = ref(0);
const aduitTotal = ref(0);
const inOrOutTotal = ref(0);
const inOrOutLoading = ref(true);
const feilinTableRef = ref();
const wangbanTableRef = ref();
const otherTableRef = ref();
const addTabFormRef = ref<ElFormInstance>();
const orderFilinOutDetailFormRef = ref<ElFormInstance>();
const supplierFilnPriceList = ref<SourceHalfProcessCalcRuleVO[]>([]);
//其他金额form
const accountOrderOtherFormRef = ref<ElFormInstance>();
const otherMoneyDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//冲销defin start
const aduitTableRef = ref();
const writerOffDialogOpen = ref(false);
const writerOffRecordDialogOpen = ref(false);
const writeOffList = ref<AccountOrderVO[]>([]);
const accountOrderWriteOff = ref<AccountOrderVO>();
const writeOffType = "1"
//其他金额form
//冲销defin end
const initFormData: OrderFilinOutDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  feilinOrderId: undefined,
  ownerId: undefined
}
const data = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    status: undefined,
    isTax: undefined,
    accountUserId: undefined,
    accountUserName: undefined,
    currency: undefined,
    quantity: undefined,
    price: undefined,
    discountPrice: undefined,
    totalPrice: undefined,
    accountOrderId: undefined,
    feilinOrderId: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "blur" }
    ],
    accountUserId: [
      { required: true, message: "对账人id不能为空", trigger: "blur" }
    ],
    accountUserName: [
      { required: true, message: "对账人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    accountOrderId: [
      { required: true, message: "对账单id不能为空", trigger: "blur" }
    ],
    feilinOrderId: [
      { required: true, message: "外协报废、收货记录ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", visible: false, width: '50' },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', },
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', field: 'status', width: '80', align: 'center', },
  { title: '对账月份', field: 'accountMonth', width: '100', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', field: 'code', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '供应商编码', field: 'supplierCode', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' } },
  { title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '对账日期', field: 'accountTime', width: '180', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入对账日期', valueFormat: 'YYYY-MM-DD' } },
  { title: '对账金额', field: 'accountPrice', align: 'center', },
  { title: '折扣金额', field: 'accountDiscountPrice', align: 'center', },
  { title: '付款金额', field: 'writeOffPrice', align: 'center', },
  { title: '剩余应付金额', field: 'payablePrice', width: '120', align: 'center', },
  { title: '对账人', field: 'accountUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账人' } },
  { title: '备注', field: 'remark', align: 'center', },
]);
const isCompressionList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
]);
const orderTypeList = ref([
  { label: '菲林', value: "1" },
  { label: '网板', value: "2" },
]);
const tabColumnList = ref([
  { type: 'checkbox', align: 'center', fixed: 'left', field: "checkbox", width: '50' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '供应商编码', width: '120', field: 'supplierCode', align: 'center' },
  { title: '供应商名称', width: '120', field: 'supplierName', align: 'center' },
  { title: '外协收货单号', width: '120', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '外协单号', width: '120', field: 'orderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '排产单号', width: '120', field: 'productionCode', align: 'center' },
  { title: '产品编码', width: '120', field: 'commodityCode', align: 'center' },
  { title: '加工工序', width: '120', field: 'craftName', align: 'center' },
  { title: '外发单位', width: '120', field: 'unit', align: 'center' },
  { title: '长', width: '120', field: 'length', align: 'center' },
  { title: '宽', width: '120', field: 'width', align: 'center' },
  { title: '外发类型', width: '120', field: 'type', align: 'center' },
  { title: '加工要求', width: '120', field: 'requirement', align: 'center' },
  { title: '收货数', width: '120', field: 'quantity', align: 'center' },
  { title: '核对数量', width: '70', fixed: 'right', field: 'checkQuantity', align: 'center' },
  { title: '加工单价', width: '80', fixed: 'right', field: 'price', align: 'center' },
  { title: '核对单价', width: '80', fixed: 'right', field: 'checkPrice', align: 'center' },
  { title: '折扣金额', width: '80', fixed: 'right', field: 'discountPrice', align: 'center' },
  { title: '总金额', width: '90', fixed: 'right', field: 'totalPrice', align: 'center' },
  { title: '备注', width: '90', fixed: 'right', field: 'remark', align: 'center' },
]);
const backColumnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '报废单号', width: '120', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单号' } },
  { title: '责任供应商', field: 'supplierName', align: 'center' },
  { title: '排产单号', field: 'productionCode', align: 'center' },
  { title: '流转卡号', field: 'productionCardCode', align: 'center' },
  { title: '排产时间', field: 'productionTime', align: 'center' },
  { title: '产品编码', field: 'commodityCode', align: 'center' },
  { title: '产品名称', field: 'commodityName', align: 'center' },
  { title: '订单数量', field: 'quantity', align: 'center' },
  { title: '订单面积', field: 'area', align: 'center' },
  { title: '报废数量', field: 'quantity', align: 'center' },
  { title: '报废面积', field: 'price', align: 'center' },
  { title: '核对数量', field: 'checkQuantity', align: 'center' },
  { title: '核对单价', field: 'checkPrice', align: 'center' },
  { title: '折扣金额', width: '80', field: 'discountPrice', align: 'center' },
  { title: '总金额', field: 'totalPrice', align: 'center' },
  { title: '备注', field: 'remark', align: 'center' },
]);
const { queryParams, form, rules } = toRefs(data);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});
//头部按钮组
const radioTable = ref('对账单列表');
const tabRadioTable = ref('外协报废');
const otherAmountBtn = ref(false);
//tab明细结构
const initOutFormData: OrderHalfProcessOutDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  halfProcessOrderId: undefined,
  halfProcessReceiveId: undefined,
  ownerId: undefined,
  productionScrapId: undefined
}
const initOutFormDataB: ScrapForm = {
  id: undefined,
  no: undefined,
  supplierId: undefined,
  quantity: undefined,
  reason: undefined,
}
const backData = reactive<PageData<ScrapForm, ScrapQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    status: undefined,
    supplierId: undefined,
    hasAccountOrder: undefined
  },
  rules: {
  }
});
const rData = reactive<PageData<SourceHalfProcessReceiveForm, SourceHalfProcessReceiveQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
  },
  rules: {
  }
});
const insertFormData = reactive<PageData<AccountOrderForm, AccountOrderQuery>>({
  form: { ...initOutFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    accountTime: undefined,
    supplierId: undefined,
    accountMonth: undefined,
    currency: undefined,
    code: undefined,
    remark: undefined,
    status: undefined,
    id: undefined,
  },
  rules: {
    supplierId: [
      { required: true, message: "供应商不能为空", trigger: "blur" }
    ],
    accountTime: [
      { required: true, message: "对账日期不能为空", trigger: "blur" }
    ],
    accountMonth: [
      { required: true, message: "对账月份不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "菲林单价不能为空", trigger: "blur" }
    ],
    checkQuantity: [
      { required: true, message: "核对数量不能为空", trigger: "blur" }
    ],
    checkPrice: [
      { required: true, message: "核对单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],

  }
});
//其他金额
const initOtherFormData: AccountOrderOtherForm = {
  index: undefined,
  id: undefined,
  type: "1",
  createByName: undefined,
  price: undefined,
  remark: undefined,
  accountOrderId: undefined,
  recordTime: undefined
}
const otherData = reactive<PageData<AccountOrderOtherForm, AccountOrderOtherQuery>>({
  form: { ...initOtherFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    price: undefined,
    accountOrderId: undefined,
    recordTime: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "金额类型不能为空", trigger: "change" }
    ],
    recordTime: [
      { required: true, message: "对账时间不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ]
  }
});
const intervalCondition = ['accountMonth', 'accountTime'];
const { queryParams: inOrOutQuery, form: outForm, rules: tabRules } = toRefs(insertFormData);
const { queryParams: otherQueryParams, form: otherForm, rules: otherRules } = toRefs(otherData);
const { queryParams: filinQueryParams } = toRefs(backData);
const { queryParams: rQueryParams } = toRefs(rData);

//供应商列表
let SupplierList: SupplierVO[] = [];
// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;
  columnList.value[0].visible = false
  if (radioTable.value == "对账单列表") {
    queryParams.value.status = undefined;
  } else if (radioTable.value == "已审核列表") {
    queryParams.value.status = StatusEnum.AUDITED;
    columnList.value[0].visible = true
  } else if (radioTable.value == "待审核列表") {
    queryParams.value.status = StatusEnum.BE_AUDITED;
  }
}
const tabRadioTableHandle = (tab: any, event: any) => {
  console.log("tab.props.name", tab.props.label);
  tabRadioTable.value = tab.props.label;
  otherAmountBtn.value = tabRadioTable.value == '其他金额' && !(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核'));
  if (tabRadioTable.value != '其他金额') {
  }
}

// 切换菜单栏 *********** end
const tabCheckMethod = (row: any) => {
  return !(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核'));
}
// 搜索 **************start
const feilinSearchChange = (params: any) => {
  const supplierId = inOrOutQuery.value.supplierId;
  if (!supplierId) {
    proxy?.$modal.msgSuccess("请选择供应商");
    return;
  }
  inOrOutQuery.value = params;
  inOrOutQuery.value.supplierId = supplierId;
  getAddListRecord();
}

const searchChange = (params: any) => {
  queryParams.value = params
  if (radioTable.value == "待审核列表") {
    queryParams.value.status = StatusEnum.BE_AUDITED;
  } else if (radioTable.value == "已审核列表") {
    queryParams.value.status = StatusEnum.AUDITED;
  }
  getList();
}
const getAllList = async () => {
  queryParams.value.status = undefined;
  getList();
}
const getWaitList = async () => {
  queryParams.value.status = StatusEnum.BE_AUDITED;
  queryParams.value.type = TypeEnum.SEMI_PROCESSING_OUTSOURCING;
  const res = await listAccountOrder(queryParams.value);
  orderFilinOutWaitList.value = res.rows;
  total.value = res.total;
}
const getAduitList = async () => {
  queryParams.value.status = StatusEnum.AUDITED;
  queryParams.value.type = TypeEnum.SEMI_PROCESSING_OUTSOURCING;
  const res = await listAccountOrder(queryParams.value);
  orderFilinOutAduitList.value = res.rows;
  total.value = res.total;
}
/** 查询外协报废/收货对账单明细列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.type = TypeEnum.SEMI_PROCESSING_OUTSOURCING;
  const res = await listAccountOrder(queryParams.value);
  //
  if (radioTable.value == "待审核列表") {
    orderFilinOutWaitList.value = res.rows;
  } else if (radioTable.value == "已审核列表") {
    orderFilinOutAduitList.value = res.rows;
  } else {
    orderFilinOutList.value = res.rows;
  }

  total.value = res.total;
  loading.value = false;
}
// 搜索 **************end
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  orderFilinOutDetailFormRef.value?.resetFields();
}

const addCancel = () => {
  reset();
  drawerBorrow.visible = false;
}

const resetTab = async () => {
  outForm.value = { ...initOutFormData };
  backList.value = [];
  receiveList.value = [];
  accountOrderOtherList.value = [];
  checkedOrderBackOutDetailList.value = [];
  checkedOrderReceviceOutDetailList.value = [];

  inOrOutQuery.value = new Object();
  addTabFormRef.value?.resetFields();
  tabRadioTable.value = "外协收货";
  inOrOutLoading.value = false;
}
//添加对账单表单 全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({ checked }) => {
  refreshListCheck();
}
//单选
const selectChangeEvent: VxeTableEvents.CheckboxAll<OrderFilinOutDetailVO> = () => {
  refreshListCheck();
}
//重新设置使得响应式生效
const refreshListCheck = () => {
  const checkInfo1 = feilinTableRef.value.xTableRef.getCheckboxRecords();
  checkedOrderBackOutDetailList.value = checkInfo1;
  const checkInfo2 = wangbanTableRef.value.xTableRef.getCheckboxRecords();
  checkedOrderReceviceOutDetailList.value = checkInfo2;
  console.log("select", checkInfo1);
  console.log("select", checkInfo2);
}
/** 新增按钮操作 */
const tabFeiLinList = async () => {

  await getAddListRecord();
}
const tabWangbanList = async () => {
  await getAddListRecord();
}
const handleAdd = async () => {
  drawerBorrow.visible = true;
  drawerBorrow.title = "添加外协加工对账";
  await resetTab();
  await tabFeiLinList();
  //await tabWangbanList();
}

const handleUpdate = async (row?: AccountOrderVO) => {
  await resetTab();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "修改外协加工对账单";
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";
  await tabFeiLinList();
  //await tabWangbanList();
}
/**详情按钮操作 */
const handleDetail = async (row?: AccountOrderVO) => {
  await resetTab();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "对账单详情";
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";
  await tabFeiLinList();
  //await tabWangbanList();
}
const setQueryParams = (_id: any) => {
  inOrOutQuery.value.accountTime = outForm.value.accountTime;
  inOrOutQuery.value.accountMonth = outForm.value.accountMonth;
  inOrOutQuery.value.supplierId = outForm.value.supplierId;
  inOrOutQuery.value.remark = outForm.value.remark;
  inOrOutQuery.value.currency = outForm.value.currency;
  inOrOutQuery.value.pageNum = 1;
  inOrOutQuery.value.pageSize = 10;
  inOrOutQuery.value.id = _id;
}
/** 查询tab记录 */
const getAddListRecord = async () => {
  inOrOutLoading.value = true;
  filinQueryParams.value.supplierId = inOrOutQuery.value.supplierId;
  rQueryParams.value.supplierId = inOrOutQuery.value.supplierId;
  //查询类型为view
  if (inOrOutQuery.value.queryType == "1") {
    //清空queryParams,查询记录
    queryParams.value = new Object();
    queryParams.value.accountOrderId = inOrOutQuery.value.id;
    orderFilinOutDetailList.value = (await listOrderHalfProcessOutDetail(queryParams.value)).rows;
    otherQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    listAccountOrderOther(otherQueryParams.value).then(res => {
      accountOrderOtherList.value = res.data;
      selectedOrderOtherList.value = res.data;
    });
    filinQueryParams.value.isAccountOrder = "1";
    rQueryParams.value.isAccountOrder = "1";
  } else {
    filinQueryParams.value.isAccountOrder = "0";
    rQueryParams.value.isAccountOrder = "0";
  }
  console.log("filinQueryParams.value", filinQueryParams.value)
  //退货
  const res = await listScrap(filinQueryParams.value);
  backList.value = res.rows;

  //setSupplierPrice(backList.value);
  //出货
  const res2 = await listSourceHalfProcessReceiveList(rQueryParams.value);
  console.log("res2222222222222222", res2)
  receiveList.value = res2.rows;
  //setSupplierPrice(receiveList.value);
  inOrOutTotal.value = res.total;
  setSelectRow(inOrOutQuery.value.queryType);
  inOrOutLoading.value = false
}
const setSupplierPrice = (_list: any) => {
  //设置单价
  _list.forEach((item: any) => {
    item.price = supplierFilnPriceList.value.filter(i => i.type == SourceHalfProcessCalcRuleTypeEnum.FEI_LIN)
      .find(item2 => item2.supplierId == item.supplierId)?.formula as string;
  });
}
const setSelectRow = (queryType?: string) => {
  let feiLinSt: any;
  let wangbanSt: any;
  let $f_table: any = feilinTableRef.value.xTableRef;
  let $w_table: any = wangbanTableRef.value.xTableRef;
  let f_list = checkedOrderBackOutDetailList.value;
  let w_list = checkedOrderReceviceOutDetailList.value;
  feiLinSt = backList.value.filter(item => {
    return f_list.some((item2: any) => item.id == item2.productionScrapId);
  });
  wangbanSt = receiveList.value.filter(item => {
    return w_list.some((item2: any) => item.id == item2.halfProcessReceiveId);
  });
  nextTick(() => {
    if (queryType == "1") {
      setCheckedListInfo();
      let f_checkedList = backList.value.filter(item => {
        return checkedOrderBackOutDetailList.value.some((item2: any) => item.id == item2.productionScrapId);
      });
      feilinTableRef.value.xTableRef.setCheckboxRow(f_checkedList, true);
      let w_checkedList = receiveList.value.filter(item => {
        return checkedOrderReceviceOutDetailList.value.some((item2: any) => item.id == item2.halfProcessReceiveId);
      });
      wangbanTableRef.value.xTableRef.setCheckboxRow(w_checkedList, true);
      otherTableRef.value.setCheckboxRow(selectedOrderOtherList.value, true);
    } else {
      $f_table.setCheckboxRow(feiLinSt, true);
      $w_table.setCheckboxRow(wangbanSt, true);
      setPriceInfo();
    }
    refreshListCheck();
  })
}
const setPriceInfo = () => {
  if (backList) {
    backList.value.forEach((item, inx) => {
      item.checkPrice = item.price ? item.price : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      const itemPrice: any = (item.checkPrice * 100).toFixed(2);
      const itemQuantity: any = (item.checkQuantity * 100).toFixed(2);
      item.totalPrice = itemPrice * itemQuantity / 10000;
    });
  }
  if (receiveList) {
    receiveList.value.forEach((item, inx) => {
      item.checkPrice = item.price ? item.price : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      item.discountPrice = 0;
      const itemPrice = (item.checkPrice * 100).toFixed(2);
      const itemQuantity = (item.checkQuantity * 100).toFixed(2);
      item.totalPrice = itemPrice * itemQuantity / 10000;
    });
  }
}
const setCheckedListInfo = () => {
  if (orderFilinOutDetailList) {
    checkedOrderBackOutDetailList.value = orderFilinOutDetailList.value.filter(item => item.type == HalfOutTypeEnum.TYPE_BACK);
    checkedOrderReceviceOutDetailList.value = orderFilinOutDetailList.value.filter(item => item.type == HalfOutTypeEnum.TYPE_RECEIVE);
    backList.value.forEach((item, inx) => {
      const detail: any = checkedOrderBackOutDetailList.value.find(itemA => itemA.productionScrapId == item.id);
      if (detail) {
        backList.value[inx] = setFeiLinListPriceInfo(item, detail);
      }
    });
    receiveList.value.forEach((item, inx) => {
      const detail: any = checkedOrderReceviceOutDetailList.value.find(itemA => itemA.halfProcessReceiveId == item.id);
      if (detail) {
        receiveList.value[inx] = setFeiLinListPriceInfo(item, detail);
      }
    });
  }
}
const setFeiLinListPriceInfo = (item: any, obj: any) => {
  if (!obj) {
    return;
  }
  item.checkPrice = obj?.price;
  item.checkQuantity = obj?.quantity;
  item.checkRemark = obj?.remark;
  item.discountPrice = obj?.discountPrice;
  item.totalPrice = obj?.totalPrice;
  return item;
}
const handleInOrOutQuery = async () => {
  inOrOutQuery.value.pageNum = 1;
  //判断是否选择了时间
  if (!inOrOutQuery.value.accountTime || !inOrOutQuery.value.supplierId) {
    proxy?.$modal.msgSuccess("请选择时间、供应商后点击搜索按钮");
    return;
  }
  await tabFeiLinList();
  //await tabWangbanList();
}

//设置表单信息
const setSupplierInfo = async (value: string) => {

  if (!value) {
    inOrOutQuery.value.currency = undefined;
    return;
  }
  //根据value 筛选出RawMaterialList中对应的数据,并赋值给form
  let supplier = SupplierList.find(item => item.id === value);
  if (supplier) {
    inOrOutQuery.value.currency = supplier.currency;
  }
  console.log("setSupplierInfo", supplier);
};
/**
 * 计算价格
 * @param data
 */
const calculatePrice = async (row: any) => {
  let price = row.checkPrice;
  let quantity = row.checkQuantity;
  if (!price || !quantity) {
    return;
  }
  price = (price * 100).toFixed(2);
  quantity = (quantity * 100).toFixed(2);
  row.totalPrice = price * quantity / 10000;
};
const calculateTotalPriceByType = (list: any, _type: any, fieldName: string) => {
  if (!list.value) {
    return 0;
  }
  const resNum = list.value
    .filter((item: any) => {
      let validType = true;
      if (_type) {
        validType = item.type == _type
      }
      return item[fieldName] && validType
    })
    .reduce((total: any, item: any) => {
      let totalTmp = total * 10000;
      let _tmp = item[fieldName] * 10000;
      return (totalTmp + _tmp) / 10000
    }, 0);
  return resNum;
};
//外付 总金额
const borrowTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedOrderReceviceOutDetailList, undefined, "totalPrice");
});
//外付 总退货金额
const backTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedOrderBackOutDetailList, undefined, "totalPrice");
});

//外付 总折扣金额
const borrowDiscountTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedOrderReceviceOutDetailList, undefined, "discountPrice");
});

//入金总金额
const otherRecoverTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList, "1", "price");
});
//出金总金额
const otherOutTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList, "2", "price");
});

const handleSubmit = () => {
  outForm.value.status = StatusEnum.BE_AUDITED;
  doSave();
}

const handleSave = () => {
  if (!outForm.value.status || outForm.value.status != StatusEnum.REJECTED) {
    outForm.value.status = StatusEnum.BE_SUBMITTED;
  }
  doSave();
}

const doSave = async () => {
  const vad = await validateForm();
  if (!vad) {
    return;
  }
  //得到供应商id
  Object.assign(outForm.value, inOrOutQuery.value);
  //类型
  outForm.value.type = TypeEnum.SEMI_PROCESSING_OUTSOURCING;
  outForm.value.accountPrice = borrowTotalPrice.value - borrowDiscountTotalPrice.value;
  outForm.value.accountDiscountPrice = borrowDiscountTotalPrice.value;
  outForm.value.accountMonth = inOrOutQuery.value.accountMonth;
  setListInfo();
  console.log(" doSave inOutForm.value", outForm.value);

  if (outForm.value.id == undefined) {
    addAccountOrder(outForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      getAllList();
    });
  } else {
    updateAccountOrder(outForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      getAllList();
    });
  }
}
const setListInfo = () => {
  //退货单参数set
  if (checkedOrderBackOutDetailList) {
    const backList: any = [];
    Object.assign(backList, checkedOrderBackOutDetailList.value);
    buildBackList(backList);
    outForm.value.orderHalfProcessOutDetailBoList = backList;

  }
  //收货单参数set
  if (checkedOrderReceviceOutDetailList) {
    const receiveList: any = [];
    Object.assign(receiveList, checkedOrderReceviceOutDetailList.value);
    buildReceiveList(receiveList);
    outForm.value.orderHalfProcessOutDetailBoList = outForm.value.orderHalfProcessOutDetailBoList?.concat(receiveList);
  }
  //设置其他金额
  if (accountOrderOtherList.value) {
    outForm.value.otherOrderBoList = accountOrderOtherList.value;
  }
}

const buildReceiveList = (receiveList: any) => {
  receiveList.forEach((item: any) => {
    item.currency = outForm.value.currency ? outForm.value.currency : '';
    item.type = HalfOutTypeEnum.TYPE_RECEIVE;
    item.isTax = item.isTax ? item.isTax : "2";

    item.halfProcessReceiveId = item.id;
    item.id = undefined;
    item.price = item.checkPrice;
    item.remark = item.checkRemark;
    item.quantity = item.checkQuantity;
    item.discountPrice = item.discountPrice ? item.discountPrice : 0;
    item.status = outForm.value.status;
  });
}
const buildBackList = (backList: any) => {
  backList.forEach((item: any) => {
    item.currency = outForm.value.currency ? outForm.value.currency : '';
    item.type = HalfOutTypeEnum.TYPE_BACK;
    item.isTax = item.isTax ? item.isTax : "2";

    item.productionScrapId = item.id;
    item.id = undefined;
    item.price = item.checkPrice;
    item.remark = item.checkRemark;
    item.quantity = item.checkQuantity;
    item.discountPrice = item.discountPrice ? item.discountPrice : 0;
    item.status = outForm.value.status;
  });
}
/*********** 新增验证 ******start*/
const validateForm = async () => {
  let res: any = false;
  await addTabFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      res = true;
    }
  });
  if (!res) {
    return res;
  }
  if (checkedOrderBackOutDetailList.value.length == 0
    && checkedOrderReceviceOutDetailList.value.length == 0
    && accountOrderOtherList.value.length == 0) {
    proxy?.$modal.msgError("请选择外协报废/收货单、或填写其他金额");
    return false;
  }
  const listTab = await validateList();
  res = res && listTab;
  return res;
}
const validateList = async () => {
  let finLinValid = true;
  let wangbanValid = true;
  let supplierValid = true;
  let res = true;
  let errMsg = "请填写核对单价、核对数量、折扣金额到勾选的外协报废单";
  let wbErrMsg = "请填写核对单价、核对数量、折扣金额到勾选的外协收货单";
  let noList = "";
  let wbnoList = "";
  let feiLinSupplier: any;
  let wangbanSupplier: any;
  const formSupplierId = inOrOutQuery.value.supplierId;
  if (checkedOrderBackOutDetailList.value.length > 0) {
    feiLinSupplier = checkedOrderBackOutDetailList.value[0]?.supplierId;
    supplierValid = !checkedOrderBackOutDetailList.value.some((item: any) => {
      return item.supplierId !== feiLinSupplier;
    });
    checkedOrderBackOutDetailList.value.forEach((item: any) => {
      if (!item.checkPrice || !item.checkQuantity) {
        if (finLinValid) {
          finLinValid = false;
        }
        noList += item.outSourceCode + "、";
      }
    });
  }
  if (checkedOrderReceviceOutDetailList.value.length > 0) {
    wangbanSupplier = checkedOrderReceviceOutDetailList.value[0]?.supplierId;
    supplierValid = !checkedOrderReceviceOutDetailList.value.some((item: any) => {
      return item.supplierId !== wangbanSupplier;
    });
    checkedOrderReceviceOutDetailList.value.forEach((item: any) => {
      if (!item.checkPrice || !item.checkQuantity || !item.discountPrice) {
        if (wangbanValid) {
          wangbanValid = false;
        }
        wbnoList += item.code + "、";
      }
    });
  }
  console.log("feiLinSupplier", feiLinSupplier, "wangbanSupplier", wangbanSupplier)
  console.log("feiLinSupplier", checkedOrderBackOutDetailList.value, "wangbanSupplier", checkedOrderReceviceOutDetailList.value)
  console.log("supplierValid", supplierValid)
  if (feiLinSupplier && wangbanSupplier && (feiLinSupplier != wangbanSupplier)) {
    supplierValid = false;
  }
  if (supplierValid) {
    let listSup = feiLinSupplier ? feiLinSupplier : wangbanSupplier;
    if (formSupplierId != listSup) {
      supplierValid = false;
    }
  }
  if (!supplierValid) {
    proxy?.$modal.msgError("供应商不一致，请重新选择");
    return false;
  }
  if (!finLinValid) {
    errMsg += noList;
    proxy?.$modal.msgError(errMsg);
    res = false;
  }
  if (!wangbanValid) {
    wbErrMsg += wbnoList;
    proxy?.$modal.msgError(wbErrMsg);
    res = false;
  }
  return res;
}
/*********** 新增验证 ******end*/


/************aduit 审核操作 start ***********/
/**审核弹窗 */
const handleToExamine = async (row?: AccountOrderVO) => {
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "对账单审核";
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";
  getAddListRecord();
}
/** 审核驳回 */
const reject = async (id: string | number | undefined) => {
  updateStatus(id, StatusEnum.REJECTED);
}
/** 审核通过 */
const examinePass = async (id: string | number | undefined) => {
  updateStatus(id, StatusEnum.AUDITED);
}
/** 提交*/
const checkPass = async (row: AccountOrderVO) => {
  await proxy?.$modal.confirm('是否确认提交对账单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, StatusEnum.BE_AUDITED);
}
const updateStatus = (id: any, status: string) => {
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
  });
}
/************aduit 审核操作 end ***********/

/************ 冲销操作 start ***********/
const handleWriteOff = async () => {
  //判断writeOffList是不是同一个供应商
  if (writeOffList.value.some(item => item.supplierId != writeOffList.value[0].supplierId)) {
    proxy?.$modal.msgError("所选的出入库记录不是同一个供应商");
    return;
  }
  writerOffDialogOpen.value = true;
}
const handleSelectionChange = () => {
  const $table = aduitTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    writeOffList.value = records;
  }
}
const selectableFun = (row: any) => {
  if (row.payablePrice === "0.0000") {
    return false;
  }
  return true;
}
const handleWriteOffRecord = async (row: AccountOrderVO) => {
  accountOrderWriteOff.value = row;
  writerOffRecordDialogOpen.value = true;

}
const tableRowClassName = (row: any) => {
  if (radioTable.value.includes("已审核") && row.row.payablePrice === "0.0000") {
    return {
      backgroundColor: '#F5FFFA'
    }
  } else if (radioTable.value.includes("已审核") && row.row.payablePrice != "0.0000") {
    return {
      backgroundColor: '#FFB6C1'
    }
  }
  return ''
}
/****** 冲销操作 end******/

/**
 * 获取供应商列表
 */
const getSupplierList = async () => {
  const SupplierResponse: any = await listSupplier();
  SupplierList = SupplierResponse;
}

/** 其他金额 *************start**********/
const handleUpdateOther = async (row: AccountOrderOtherVO) => {
  otherMoneyDialog.title = "修改其他金额";
  otherMoneyDialog.visible = true;
  Object.assign(otherForm.value, row);
}
/** 删除其他金额按钮操作 */
const handleDeleteOther = async (row: AccountOrderOtherVO) => {
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  if (row.id != undefined) {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.id != row.id);
  } else {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.index != row.index);
  }
  proxy?.$modal.msgSuccess("删除成功");
  selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.id != row.id);
}

const otherCancel = async () => {
  otherMoneyDialog.visible = false;
}
const otherMoneyHandle = async () => {
  otherForm.value = { ...initOtherFormData };
  otherMoneyDialog.title = "其他金额";
  otherMoneyDialog.visible = true;
  //tab切换回其他金额
  tabRadioTable.value = "其他金额";
}
//其他金额表单 全选
const selectOtherAllChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderOtherVO> = ({ checked }) => {
  const $table = otherTableRef.value;
  if ($table) {
    selectedOrderOtherList.value = $table.getCheckboxRecords();
  }
}
//其他金额表单 单选
const selectOtherChangeEvent: VxeTableEvents.CheckboxChange<AccountOrderOtherVO> = ({ checked, row }) => {
  const $table = otherTableRef.value;
  if ($table) {
    selectedOrderOtherList.value = $table.getCheckboxRecords()
  }
}
/** 其他金额确认按钮 */
const otherSubmitForm = () => {
  accountOrderOtherFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let accountOrderOtherVO: AccountOrderOtherVO = {
        id: otherForm.value.id,
        type: otherForm.value.type,
        createByName: otherForm.value.createByName,
        price: otherForm.value.price,
        remark: otherForm.value.remark,
        accountOrderId: otherForm.value.accountOrderId,
        recordTime: otherForm.value.recordTime,
        index: otherForm.value.index
      }
      //修改
      if (otherForm.value.id) {
        accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
          if (item.id == otherForm.value.id) {
            return accountOrderOtherVO;
          }
          return item;
        });
      } else {
        if (otherForm.value.index) {
          accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
            if (item.index == otherForm.value.index) {
              return accountOrderOtherVO;
            }
            return item;
          });
        } else {
          accountOrderOtherVO.index = Math.random();
          accountOrderOtherList.value.push(accountOrderOtherVO);
        }
      }
      otherMoneyDialog.visible = false;
    }
  });
}
/** 其他金额 ********END**********/

/** 删除按钮操作 */
const handleDelete = async (row?: OrderFilinOutDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除对账单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  await delAccountOrderNew(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getAllList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/orderFilinOutDetail/export', {
    ...queryParams.value
  }, `orderFilinOutDetail_${new Date().getTime()}.xlsx`)
}
const getSupplierPriceList = async () => {
  const SupplierResponse: any = await listSourceHalfProcessCalcRule();
  supplierFilnPriceList.value = SupplierResponse.rows;
}
/** 查询工艺列表 */
const getCraftListNoPage = async () => {
  const res = await getCraftList();
  craftList.value = res.data;
};
onMounted(() => {
  getAllList();
  getWaitList();
  getAduitList();

  getSupplierList();
  getSupplierPriceList();
  getCraftListNoPage()
});
</script>

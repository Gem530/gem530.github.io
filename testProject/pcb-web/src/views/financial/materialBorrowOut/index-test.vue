<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="18">
            <el-radio-group v-model="radioTable">
              <el-radio-button label="对账单列表" @change="listRadio" />
              <el-radio-button label="待审核列表" @change="notCheckListRadio" />
              <el-radio-button label="已审核列表" @change="checkListRadio" />
            </el-radio-group>
          </el-col>

          <el-col :span="6">
            <!-- <el-tag class="ml-2" v-show="radioTable.includes('已审核')" type="success">冲销完成</el-tag>
            <el-tag class="ml-2" v-show="radioTable.includes('已审核')" type="danger">未冲销</el-tag> -->
            <el-button
              type="primary"
              plain
              icon="Plus"
              v-show="!radioTable.includes('已审核')"
              @click="handleAdd"

              >借出对账单</el-button
            >

<!--            <el-button-->
<!--              :disabled="writeOffList.length == 0"-->
<!--              type="primary"-->
<!--              plain-->
<!--              icon="Plus"-->
<!--              v-show="radioTable.includes('已审核')"-->
<!--              @click="handleWriteOff"-->

<!--              >账单冲销</el-button-->
<!--            >-->
          </el-col>
        </el-row>
      </template>

      <el-table
        class="no-selection"
        v-loading="loading"
        size="small"
        :row-class-name="tableRowClassName"
        :data="accountOrderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" width="55" v-if="!radioTable.includes('已审核')" align="center" />
        <el-table-column type="selection" width="55" v-if="radioTable.includes('已审核')" :selectable="selectableFun" align="center" />
        <el-table-column label="单据状态" align="center" width="80" prop="status">
          <template #default="scope">
            <span v-if="scope.row.payablePrice != 0">{{ scope.row.status }}</span>

            <span v-else>冲销完成</span>
          </template>
        </el-table-column>
        <el-table-column label="对账月份" align="center" prop="accountMonth" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对账单号" align="center" width="120" prop="code" />
        <el-table-column label="供应商编码" align="center" width="100" prop="supplierCode" />
        <el-table-column label="供应商名称" align="center" prop="supplierName" />
        <el-table-column label="对账日期" align="center" prop="accountTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对账金额" align="center" prop="accountPrice" />
        <el-table-column label="折扣金额" align="center" prop="accountDiscountPrice" />
        <el-table-column label="剩余应收金额" align="center" width="120" prop="payablePrice" />
        <el-table-column label="对账人" align="center" prop="accountUserName" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              link
              type="primary"
              v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
              @click="handleUpdate(scope.row)"

              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
              @click="checkPass(scope.row)"

              >提交</el-button
            >
            <el-button
              link
              type="primary"
              v-show="scope.row.status == '待审核'"
              @click="handleToExamine(scope.row)"

              >审核</el-button
            >
            <el-button
              link
              type="primary"
              v-if="scope.row.payablePrice == 0"
              @click="accountUReportHandle(scope.row)"

              >对账单</el-button
            >
            <el-button
              link
              type="primary"
              v-show="scope.row.status == '审核通过'"
              @click="handleWriteOffRecord(scope.row)"

              >冲销记录</el-button
            >
            <el-button link type="primary" @click="handleDetail(scope.row)" >详情</el-button>
            <el-button
              link
              type="primary"
              v-show="scope.row.status == '未提交' || scope.row.status == '驳回'"
              @click="handleDelete(scope.row)"

              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="80%" draggable>
      <el-form
        border
        label-width="100px"
        :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
        :model="inOrOutQuery"
        ref="inOrOutQueryFormRef"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="供应商：" prop="supplierId">
              <el-select
                :disabled="drawerBorrow.title?.includes('修改')"
                placeholder="请选择供应商"
                style="width: 100%;"
                v-model="inOrOutQuery.supplierId"
                @change="setSupplierInfo"
              >
                <el-option v-for="item in SupplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="对账日期：" prop="accountTime">
              <el-date-picker
                v-model="inOrOutQuery.accountTime"
                style="width: 100%;"
                type="date"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD 23:59:59"
                clearable
                @change="handleSaveFlagFun"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="drawerBorrow.title?.includes('添加') || drawerBorrow.title?.includes('修改')">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleInOrOutQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetInOrOutQuery">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="对账月份： ">
              <el-date-picker
                v-model="inOrOutQuery.accountMonth"
                style="width: 100%;"
                type="month"
                placeholder="选择月份"
                value-format="YYYY-MM-01 23:59:59"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="inOrOutQuery.code">
            <el-form-item size="small" label="对账单号：">{{ inOrOutQuery.code }} </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="币种："> {{ inOrOutQuery.currency }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item size="small" label="备注：">
              <el-input v-model="inOrOutQuery.remark" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <vxe-table
        :loading="inOrOutLoading"
        align="center"
        border
        ref="tableRef"
        height="400"
        size="small"
        :row-config="{ isHover: true }"
        :data="inOrOutList"
        @checkbox-all="selectAllChangeEvent"
        @checkbox-change="selectChangeEvent"
      >
        >
        <vxe-column width="40" type="checkbox" v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"> </vxe-column>
        <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
        <vxe-column width="120" title="借料单号" field="code"> </vxe-column>
        <vxe-column field="type" title="借料类型" width="80"></vxe-column>
        <vxe-column field="supplierName" width="90" title="供应商名称"></vxe-column>
        <vxe-column field="materialCode" width="80" title="物料编码"> </vxe-column>
        <vxe-column field="name" width="80" title="物料名称"> </vxe-column>
        <vxe-column field="supplierName" width="80" title="物料规格"> </vxe-column>
        <vxe-column field="supplierName" title="规格参数"> </vxe-column>
        <vxe-column field="inOutQuantity" fixed="right" width="80" title="数量"> </vxe-column>
        <vxe-column field="inOutPrice" fixed="right" width="80" title="单价"> </vxe-column>
        <vxe-column field="quantity" fixed="right" width="100" title="核对数量">
          <template #default="{ row }">
            <el-input-number
              :disabled="drawerBorrow.title?.includes('详情')|| drawerBorrow.title?.includes('审核')"
              style="width: 99%;"
              @change="calculatePrice(row)"
              :controls="false"
              v-model="row.quantity"
            />
          </template>
        </vxe-column>

        <vxe-column field="price" fixed="right" width="120" title="核对单价">
          <template #default="{ row }">
            <el-input-number
              :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
              @change="calculatePrice(row)"
              style="width: 99%;"
              :controls="false"
              v-model="row.price"
            /> </template
        ></vxe-column>
        <vxe-column field="discountPrice" fixed="right" width="80" title="折扣金额">
          <template #default="{ row }">
            <el-input-number
              :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
              style="width: 99%;"
              :controls="false"
              v-model="row.discountPrice"
            /> </template
        ></vxe-column>
        <vxe-column field="totalPrice" fixed="right" width="120" title="总金额"> </vxe-column>
        <vxe-column field="addressId" fixed="right" width="50" title="备注"></vxe-column>
      </vxe-table>

      <el-form border label-width="120px" :model="inOutForm">
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="借出总金额：" prop="borrowTotalPrice"> {{ borrowTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="借出折扣总金额：" prop="borrowDiscountTotalPrice">
              {{ borrowDiscountTotalPrice
              }}</el-form-item
            >
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="还回总金额：" prop="backTotalPrice">{{ backTotalPrice }} </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="还回折扣总金额：" prop="backDiscountTotalPrice">{{ backDiscountTotalPrice }} </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="对账总金额：" prop="accountPrice"
              >{{ borrowTotalPrice - backTotalPrice -
              borrowDiscountTotalPrice - backDiscountTotalPrice }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <pagination
        v-show="inOrOutTotal > 0"
        :total="inOrOutTotal"
        v-model:page="inOrOutQuery.pageNum"
        v-model:limit="inOrOutQuery.pageSize"
        @pagination="getListInOutRecord"
      />
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="inOutCancel">取消</el-button>
            <el-button
              type="danger"
              v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSave"

            >
              保存
            </el-button>
            <el-button
              type="primary"
              v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSumbit"

            >
              提交
            </el-button>
            <el-button
              type="danger"
              v-show="drawerBorrow.title?.includes('审核')"
              @click="reject(inOrOutQuery.id)"

            >
              驳回
            </el-button>
            <el-button
              type="primary"
              v-show="drawerBorrow.title?.includes('审核')"
              @click="examinePass(inOrOutQuery.id)"

            >
              通过
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="writeOffDialog.visible" :title="writeOffDialog.title" width="70%" draggable>
      <el-divider content-position="center"> 已选账单信息</el-divider>
      <el-row>
        <vxe-table align="center" border max-height="200" size="small" :row-config="{ isHover: true }" :data="writeOffList">
          >
          <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
          <vxe-column width="120" title="对账单号" field="code"> </vxe-column>
          <vxe-column field="supplierName" title="供应商" width="120"></vxe-column>
          <vxe-column field="accountTime" width="130" title="对账日期">
            <template #default="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="accountMonth" width="150" title="对账月份">
            <template #default="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}-{d}') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="accountPrice" width="130" title="对账金额"> </vxe-column>
          <vxe-column field="accountPrice" width="100" title="应收金额"> </vxe-column>
          <vxe-column field="writeOffPrice" width="160" title="已收款金额"> </vxe-column>
          <vxe-column field="accountDiscountPrice" width="80" title="折扣金额"> </vxe-column>
          <vxe-column field="payablePrice" width="120" title="剩余应收金额"> </vxe-column>
        </vxe-table>
      </el-row>
      <el-divider content-position="center"> 待选付款单信息</el-divider>
      <el-row>
        <vxe-table
          align="center"
          border
          ref="paymentTableRef"
          max-height="300"
          size="small"
          :row-config="{ isHover: true }"
          :data="repaymentRecordList"
          @checkbox-all="selectPaymentAllChangeEvent"
          @checkbox-change="selectPaymentChangeEvent"
        >
          >
          <vxe-column width="40" type="checkbox"> </vxe-column>
          <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
          <vxe-column width="120" title="收款单号" field="code"> </vxe-column>
          <vxe-column field="supplierName" title="供应商" width="120"></vxe-column>
          <vxe-column field="payDate" width="130" title="收款日期">
            <template #default="scope">
              <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d}') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="payWay" width="150" title="收款方式"> </vxe-column>
          <vxe-column field="payCode" width="130" title="收据号/发票号"> </vxe-column>
          <vxe-column field="payExpireDate" width="100" title="票款到期日期">
            <template #default="scope">
              <span>{{ parseTime(scope.row.payExpireDate, '{y}-{m}-{d}') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="totalPrice" width="160" title="收款金额"> </vxe-column>
          <vxe-column field="balance" width="160" title="收款余额"> </vxe-column>
        </vxe-table>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="writeOffCancel">取消</el-button>
            <el-button type="primary" @click="handleWriteOffSave">保存</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="writeOffRecordDialog.visible" :title="writeOffRecordDialog.title" width="75%" draggable>
      <el-radio-group v-model="writerOffRadioTable">
        <el-radio-button label="冲销记录" @change="handleWriterOffRadioTable" />
        <el-radio-button label="历史记录" @change="handleWriterOffRadioTable" />
      </el-radio-group>
      <el-row>
        <vxe-table align="center" border height="600" size="small" :row-config="{ isHover: true }" :data="writeOffRecordList">
          >
          <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
          <vxe-column width="120" title="对账单号" field="code"> </vxe-column>
          <vxe-column field="supplierName" title="供应商" width="80"></vxe-column>

          <vxe-column field="accountMonth" width="120" title="对账月份">
            <template #default="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}-{d}') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="accountPrice" width="100" title="应付金额"> </vxe-column>
          <vxe-column field="accountPrice" width="100" title="对账金额"> </vxe-column>
          <vxe-column field="writeOffPrice" width="140" title="对账单扣款金额"> </vxe-column>
          <vxe-column field="writeOffPrice" width="100" title="已收金额"> </vxe-column>
          <vxe-column field="writeOffPrice" width="100" title="收款单号"> </vxe-column>

          <vxe-column field="accountTime" width="130" title="对账日期">
            <template #default="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d} {h}:{m}') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="remark" width="100" title="备注"></vxe-column>
          <vxe-column field="status" v-if="writerOffRadioTable.includes('冲销记录')" fixed="right" width="100" title="操作">
            <template #default="scope">
              <el-button link @click="cancelWriteOffRecord(scope.row)" >取消冲销</el-button>
            </template>
          </vxe-column>
          <vxe-column field="status" v-else fixed="right" width="100" title="状态">
            <template #default="scope">
              <el-tag class="ml-2" v-show="scope.row.status == '1'" type="success">冲销</el-tag>
              <el-tag class="ml-2" v-show="scope.row.status == '2'" type="danger">取消冲销</el-tag>
            </template>
          </vxe-column>
        </vxe-table>
      </el-row>
    </el-dialog>
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
  </div>
</template>

<script setup name="AccountOrder" lang="ts">
import {
  listAccountOrder,
  getAccountOrder,
  delAccountOrder,
  addAccountOrder,
  updateAccountOrder,
  listInOutRecord,
  listSupplier,
  updateAccountOrderStatus,
  getWriteOffListByAccountOrderId,
  cancelWriteOffRecordById,
  getWriteOffAllListByAccountOrderId,
  getRepaymentListBySupplierId,
  writeOffAccountOrder
} from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, InOrOutForm, InOrOutQuery, AccountMaterialInOutVo } from '@/api/financial/accountOrder/types';
import { SupplierVO } from "@/api/basedata/supplier/types";
import { VxeTableInstance, VxeTableEvents } from 'vxe-table'
import { RepaymentRecordVO } from '@/api/financial/repaymentRecord/types';
import { OrderWriteOffRecordVO } from '@/api/financial/orderWriteOffRecord/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const accountOrderList = ref<AccountOrderVO[]>([]);
//已选中的对账单
const writeOffList = ref<AccountOrderVO[]>([]);
//冲销记录集合
const writeOffRecordList = ref<OrderWriteOffRecordVO[]>([]);

//收款单列表
const repaymentRecordList = ref<RepaymentRecordVO[]>([]);

//选中的收款单列表
const selectedRepaymentRecordList = ref<RepaymentRecordVO[]>([]);

const buttonLoading = ref(false);
const loading = ref(true);
const inOrOutLoading = ref(false);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);

const total = ref(0);
const inOrOutTotal = ref(0);
const radioTable = ref('对账单列表');
const writerOffRadioTable = ref('冲销记录');
const queryFormRef = ref<ElFormInstance>();
const inOrOutQueryFormRef = ref<ElFormInstance>();
const accountOrderFormRef = ref<ElFormInstance>();

//冲销页面
const writeOffDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
//冲销记录页面
const writeOffRecordDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

/**
 * 借料
 * 采购
 */
const globalType = "借料"

/**
 * 1:借入
 * 2:借出
 */
const globalInOutType = "2"

/**
 * 类型（1订单外协、2采购、3借入、4借出、5外协加工、6外协模具）
 */
const accountOrderType = "4"

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});

//供应商列表
let SupplierList: SupplierVO[] = [];


//出入库记录
const inOrOutList = ref<AccountMaterialInOutVo[]>([]);
//已加载过的所有的出入库记录
const inOrOutListAll = ref<AccountMaterialInOutVo[]>([]);
//已选择的出入库记录
const selectedInOrOutList = ref<AccountMaterialInOutVo[]>([]);

/**
 * 获取供应商列表
 */
const getSupplierList = async () => {
  const SupplierResponse: any = await listSupplier();

  SupplierList = SupplierResponse;
}



const initInOutFormData: InOrOutForm = {
  id: undefined,
  borrowTotalPrice: 0,
  borrowDiscountTotalPrice: 0,
  accountPrice: 0,
  accountDiscountPrice: 0,
  code: undefined,
  currency: undefined,
  backTotalPrice: 0,
  backDiscountTotalPrice: 0,
  accountTime: undefined,
  supplierId: undefined,
  borrowDetailBoList: [],
}
const initQueryParams: InOrOutQuery = {
  pageNum: 1,
  pageSize: 20,
  type: undefined,
  accountTime: undefined,
  supplierId: undefined,
  accountMonth: undefined,
  isAccountOrde: undefined,
  currency: undefined,
  code: undefined,
  remark: undefined,
  id: undefined,
}


const insertFormData = reactive<PageData<InOrOutForm, InOrOutQuery>>({
  form: { ...initInOutFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    accountTime: undefined,
    supplierId: undefined,
    accountMonth: undefined,
    isAccountOrde: undefined,
    currency: undefined,
    code: undefined,
    remark: undefined,
    queryType: undefined,
    id: undefined,
  },
  rules: {
    id: [

    ],
  }
});

const initFormData: AccountOrderForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isAllWriteOff: undefined,
  isTax: undefined,
  accountTime: undefined,
  supplierId: undefined,
  accountMonth: undefined,
  accountPrice: undefined,
  accountDiscountPrice: undefined,
  writeOffPrice: undefined,
  payablePrice: undefined,
  otherPrice: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined
}
const data = reactive<PageData<AccountOrderForm, AccountOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    inOrOut: undefined,
    status: undefined,
    isAllWriteOff: undefined,
    isTax: undefined,
    accountTime: undefined,
    supplierId: undefined,
    accountMonth: undefined,
    accountPrice: undefined,
    accountDiscountPrice: undefined,
    writeOffPrice: undefined,
    payablePrice: undefined,
    otherPrice: undefined,
    accountUserId: undefined,
    accountUserName: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键id不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    isAllWriteOff: [
      { required: true, message: "是否已全部冲销不能为空", trigger: "blur" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "blur" }
    ],
    accountTime: [
      { required: true, message: "对账截止时间不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "厂商ID不能为空", trigger: "blur" }
    ],
    accountMonth: [
      { required: true, message: "对账月份不能为空", trigger: "blur" }
    ],
    accountPrice: [
      { required: true, message: "对账金额不能为空", trigger: "blur" }
    ],
    accountDiscountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    writeOffPrice: [
      { required: true, message: "已冲销金额不能为空", trigger: "blur" }
    ],
    payablePrice: [
      { required: true, message: "应收金额不能为空", trigger: "blur" }
    ],
    otherPrice: [
      { required: true, message: "其他金额不能为空", trigger: "blur" }
    ],
    accountUserId: [
      { required: true, message: "对账人id不能为空", trigger: "blur" }
    ],
    accountUserName: [
      { required: true, message: "对账人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const { queryParams: inOrOutQuery, form: inOutForm, rules: inOrOutRules } = toRefs(insertFormData);

const tableRef = ref<VxeTableInstance<AccountMaterialInOutVo>>()

const paymentTableRef = ref<VxeTableInstance<RepaymentRecordVO>>()


const handleSaveFlag = ref(false);


const handleSaveFlagFun = () => {
  handleSaveFlag.value = false;
}

/** 审核驳回 */
const reject = async (id: string | number | undefined) => {
  updateStatus(id, "3");
}
/** 审核通过 */
const examinePass = async (id: string | number | undefined) => {
  updateStatus(id, "4");
}
/** 提交*/
const checkPass = async (row: AccountOrderVO) => {
  await proxy?.$modal.confirm('是否确认提交对账单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, "2");
}

const updateStatus = (id: any, status: string) => {
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getList();
    drawerBorrow.visible = false;
  });
}


const handleSumbit = () => {
  inOutForm.value.status = "2";
  save();
}


const handleSave = () => {

  console.log(inOrOutQuery.value);

  if (inOutForm.value.status != "3") {
    inOutForm.value.status = "1";
  }

  save();

}

let reportUrl = ref("");
/** 对账单按钮操作 */
const accountUReportHandle = async (row: AccountOrderVO) => {
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl() + `&_u=file:borrow.ureport.xml&url=dev-api/financial/accountOrder/report/${row.id}&listUrl=dev-api/financial/orderBorrowDetail/reportList&id=${row.id}`;
}
//冲销确认
const handleWriteOffSave = () => {

  if (writeOffList.value.length == 0) {
    proxy?.$modal.msgSuccess("请选择对账单");
    return;
  }
  if (selectedRepaymentRecordList.value.length == 0) {
    proxy?.$modal.msgSuccess("请选择收款单");
    return;
  }
  if (selectedRepaymentRecordList.value.some(item => item.supplierId != selectedRepaymentRecordList.value[0].supplierId)) {
    proxy?.$modal.msgSuccess("所选的收款单不是同一个供应商");
    return;
  }
  //得到所有对账单id
  let accountOrderIds = writeOffList.value.map(item => item.id);
  //得到付款单id
  let paymentIds = selectedRepaymentRecordList.value.map(item => item.id);

  writeOffAccountOrder({ accountOrderIds, paymentIds }).then(res => {
    proxy?.$modal.msgSuccess("冲销成功");
    writeOffDialog.visible = false;
    getList();
  });
}


const save = () => {

  if (!handleSaveFlag.value) {
    proxy?.$modal.msgSuccess("请选择时间后点击搜索按钮");
    return;
  }
  //判断是否选择了对账月份，
  if (inOrOutQuery.value.accountMonth == undefined) {
    proxy?.$modal.msgSuccess("请选择对账月份");
    return;
  }
  //验证selectedInOrOutList是否为空
  if (selectedInOrOutList.value.length == 0) {
    proxy?.$modal.msgSuccess("请选择出入库记录");
    return;
  }
  //判断所选的出入库记录是否是同一个供应商
  if (selectedInOrOutList.value.some(item => item.supplierId != selectedInOrOutList.value[0].supplierId)) {
    proxy?.$modal.msgSuccess("所选的出入库记录不是同一个供应商");
    return;
  }
  //得到供应商id
  let supplierId = selectedInOrOutList.value[0].supplierId;
  //inOutForm 数据封装
  inOutForm.value.supplierId = supplierId;
  inOutForm.value.accountTime = inOrOutQuery.value.accountTime;
  inOutForm.value.borrowDetailBoList = selectedInOrOutList.value;
  inOutForm.value.borrowTotalPrice = borrowTotalPrice.value;
  inOutForm.value.borrowDiscountTotalPrice = borrowDiscountTotalPrice.value;
  inOutForm.value.backTotalPrice = backTotalPrice.value;
  inOutForm.value.backDiscountTotalPrice = backDiscountTotalPrice.value;
  inOutForm.value.accountPrice = borrowTotalPrice.value - backTotalPrice.value - borrowDiscountTotalPrice.value - backDiscountTotalPrice.value;
  inOutForm.value.accountDiscountPrice = borrowDiscountTotalPrice.value + backDiscountTotalPrice.value;
  inOutForm.value.accountMonth = inOrOutQuery.value.accountMonth;
  inOutForm.value.type = accountOrderType;
  if (inOutForm.value.id == undefined) {
      addAccountOrder(inOutForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      getList();

    });
  } else {
      updateAccountOrder(inOutForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      getList();

    });
  }

}

const setSelectRow = () => {
  const $table = tableRef.value
  if ($table) {
    let st = inOrOutList.value.filter(item => {
      return selectedInOrOutList.value.some(item2 => item.id == item2.id);
    });
    $table.setCheckboxRow(st, true);
  }
}
//冲销表单 选择收款单
const selectPaymentChangeEvent: VxeTableEvents.CheckboxChange<AccountMaterialInOutVo> = () => {
  const $table = paymentTableRef.value
  if ($table) {
    const records = $table.getCheckboxRecords()
    selectedRepaymentRecordList.value = records;
  }
}
//冲销表单 选择收款单
const selectPaymentAllChangeEvent: VxeTableEvents.CheckboxAll<RepaymentRecordVO> = () => {
  const $table = paymentTableRef.value
  if ($table) {
    const records = $table.getCheckboxRecords()
    selectedRepaymentRecordList.value = records;
  }
}


const selectAllChangeEvent: VxeTableEvents.CheckboxAll<RepaymentRecordVO> = ({ checked }) => {
  const $table = tableRef.value
  if ($table) {
    const records = $table.getCheckboxRecords()
    if (checked) {
      //把records中的每一条数据设置selected为true
      selectedInOrOutList.value.push(...records.filter(item => !selectedInOrOutList.value.some(item2 => item.id == item2.id)))
    } else {
      selectedInOrOutList.value = selectedInOrOutList.value.filter(item => {
        return !inOrOutList.value.some(item2 => item.id == item2.id);
      });
    }
  }
}

const selectChangeEvent: VxeTableEvents.CheckboxChange<AccountMaterialInOutVo> = ({ checked, row }) => {
  const $table = tableRef.value
  if ($table) {
    const records = $table.getCheckboxRecords()
    if (checked) {
      selectedInOrOutList.value.push(...records.filter(item => !selectedInOrOutList.value.some(item2 => item.id == item2.id)))
    } else {
      selectedInOrOutList.value = selectedInOrOutList.value.filter(item => item.id != row.id)
    }
  }
}

const borrowTotalPrice = computed(() => {
  return calculateTotalPriceByType("物料借出");
});

const borrowDiscountTotalPrice = computed(() => {
  return calculateDiscountTotalPriceByType("物料借出");
});

const backTotalPrice = computed(() => {
  return calculateTotalPriceByType("借出归还");
});

const backDiscountTotalPrice = computed(() => {
  return calculateDiscountTotalPriceByType("借出归还");
});

//计算总价，
const calculateTotalPriceByType = (type: string) => {
  return selectedInOrOutList.value
    .filter(item => item.type === type)
    .reduce((total, item) => total + parseFloat(item.totalPrice as string), 0);
};

//计算折扣金额
const calculateDiscountTotalPriceByType = (type: string) => {
  return selectedInOrOutList.value
    .filter(item => item.type === type && item.discountPrice !== null)
    .reduce((total, item) => total + parseFloat(item.discountPrice as string), 0);
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
  row.totalPrice = price * quantity;

};


/** 出入库记录搜索按钮操作 */
const handleInOrOutQuery = async () => {
  inOrOutQuery.value.pageNum = 1;

  //判断是否选择了时间
  if (inOrOutQuery.value.accountTime == undefined) {
    proxy?.$modal.msgSuccess("请选择时间后点击搜索按钮");
    return;
  }
  handleSaveFlag.value = true;
  await getListInOutRecord();
}

/** 出入库记录重置按钮操作 */
const resetInOrOutQuery = () => {
  inOrOutQueryFormRef.value?.resetFields();
  handleInOrOutQuery();
}

/** 待受理 */
const listRadio = async () => {
  queryParams.value.status = undefined;
  await getList();
}

/** 待审核 */
const notCheckListRadio = async () => {
  queryParams.value.status = "2";
  await getList();
}
/** 已审核 */
const checkListRadio = async () => {
  queryParams.value.status = "4";
  await getList();
}

//设置表单信息
const setSupplierInfo = (value: string) => {

  if (value == undefined || value == null || value == "") {
    inOrOutQuery.value.currency = undefined;
    return;
  }

  //根据value 筛选出RawMaterialList中对应的数据,并赋值给form
  let supplier = SupplierList.find(item => item.id === value);
  if (supplier == undefined) {
    return;
  }
  inOrOutQuery.value.currency = supplier.currency;

};

/** 查询对账单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.type = accountOrderType;
  const res = await listAccountOrder(queryParams.value);
  accountOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询出入库记录 */
const getListInOutRecord = async () => {
  inOrOutLoading.value = true
  inOrOutQuery.value.type = globalType;
  inOrOutQuery.value.inOrOut = globalInOutType;
  if (inOrOutQuery.value.isAccountOrde == undefined && inOrOutQuery.value.id == null) {
    inOrOutQuery.value.isAccountOrde = "2";
  }
  const res = await listInOutRecord(inOrOutQuery.value);
  inOrOutTotal.value = res.total;
  inOrOutList.value = res.rows;
  inOutFormList();
  await setSelected();
  console.log(inOrOutQuery.value.supplierId);
  if (inOrOutQuery.value.supplierId) {
    selectedInOrOutList.value = selectedInOrOutList.value.filter(item => item.supplierId == inOrOutQuery.value.supplierId);
  }
  setSelectRow();
}

/**新增表单列表赋值 */
const inOutFormList = () => {

  inOrOutList.value.forEach(item => {
    if (!inOrOutListAll.value.some(item2 => item.id == item2.id)) {
      inOrOutListAll.value.push(item);
      return;
    }
    const old = inOrOutListAll.value.find(f => f.id === item.id)
    if (!old) {
      return;
    }
    inOrOutList.value = inOrOutList.value.map(item => {
      if (item.id === old.id) {
        return old;
      }
      return item;
    });
  });
  inOrOutLoading.value = false

}

//*

/** 取消按钮 */
const writeOffCancel = () => {
  writeOffDialog.visible = false;

  repaymentRecordList.value = [];

}
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}
/** 出入库取消按钮 */
const inOutCancel = () => {
  inOutReset();
  drawerBorrow.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  accountOrderFormRef.value?.resetFields();
}
/** 出入库记录表单重置 */
const inOutReset = () => {
  inOutForm.value = { ...initInOutFormData };
  inOrOutQueryFormRef.value?.resetFields();
  selectedInOrOutList.value = [];
  inOrOutQuery.value = { ...initQueryParams };
  inOrOutList.value = [];
  inOrOutListAll.value = [];
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
const handleSelectionChange = (selection: AccountOrderVO[]) => {
  // console.log(selection);
  writeOffList.value = selection;
}

/** 新增按钮操作 */
const handleAdd = () => {
  inOutReset();
  drawerBorrow.visible = true;
  drawerBorrow.title = "添加对账单";
  getListInOutRecord();
}

/**取消冲销 */
const cancelWriteOffRecord = async (row: OrderWriteOffRecordVO) => {



  await cancelWriteOffRecordById(row.id);

  handleWriterOffRadioTable();

   getList();

  // row.id
}

/**冲销记录 RadioTable 点击事件*/
const handleWriterOffRadioTable = async () => {

  if (accountOrderWriteOff.value) {
    if (writerOffRadioTable.value == "冲销记录") {
      const res = await getWriteOffListByAccountOrderId(accountOrderWriteOff.value.id)
      writeOffRecordList.value = res.data;
    } else {
      const res = await getWriteOffAllListByAccountOrderId(accountOrderWriteOff.value.id)
      writeOffRecordList.value = res.data;
    }
  }
}


const accountOrderWriteOff = ref<AccountOrderVO>();

/** 冲销按钮操作 */
const handleWriteOff = async () => {

  //判断writeOffList是不是同一个供应商
  if (writeOffList.value.some(item => item.supplierId != writeOffList.value[0].supplierId)) {
    proxy?.$modal.msgError("所选的出入库记录不是同一个供应商");
    return;
  }
  const res = await getRepaymentListBySupplierId(writeOffList.value[0].supplierId)
  repaymentRecordList.value = res.data;
  writeOffDialog.visible = true;
  writeOffDialog.title = "冲销";
  console.log(repaymentRecordList.value);

}
/** 冲销记录按钮操作 */
const handleWriteOffRecord = async (row: AccountOrderVO) => {
  writeOffRecordDialog.title = "冲销记录";
  writeOffRecordDialog.visible = true;
  accountOrderWriteOff.value = row;
  handleWriterOffRadioTable();

}



/** 修改按钮操作 */
const handleUpdate = async (row?: AccountOrderVO) => {
  handleSaveFlag.value = true;
  inOutReset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "修改对账单";
  Object.assign(inOutForm.value, res.data);
  Object.assign(inOrOutQuery.value, inOutForm.value);
  inOrOutQuery.value.pageNum = 1;
  inOrOutQuery.value.pageSize = 10;
  inOrOutQuery.value.id = res.data.id;
  getListInOutRecord();
}


/**详情按钮操作 */
const handleDetail = async (row?: AccountOrderVO) => {
  inOutReset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "对账单详情";
  Object.assign(inOutForm.value, res.data);
  Object.assign(inOrOutQuery.value, inOutForm.value);
  inOrOutQuery.value.pageNum = 1;
  inOrOutQuery.value.pageSize = 10;
  inOrOutQuery.value.queryType = "1";
  inOrOutQuery.value.id = res.data.id;
  getListInOutRecord();
}
/**审核弹窗按钮操作 */
const handleToExamine = async (row?: AccountOrderVO) => {
  inOutReset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "对账单审核";
  Object.assign(inOutForm.value, res.data);
  inOrOutQuery.value.accountTime = inOutForm.value.accountTime;
  inOrOutQuery.value.accountMonth = inOutForm.value.accountMonth;
  inOrOutQuery.value.supplierId = inOutForm.value.supplierId;
  inOrOutQuery.value.pageNum = 1;
  inOrOutQuery.value.pageSize = 10;
  inOrOutQuery.value.id = res.data.id;
  inOrOutQuery.value.queryType = "1";
  getListInOutRecord();
}

const setSelected = () => {
  const temp = inOrOutList.value.filter(item => item.selected === true);
  //如果temp中有数据，则将temp中的数据添加到selectedInOrOutList中
  if (temp.length > 0) {
    selectedInOrOutList.value.push(...temp.filter(item => !selectedInOrOutList.value.some(item2 => item.id == item2.id)))
  }
}


/** 提交按钮 */
const submitForm = () => {
  accountOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAccountOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addAccountOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

const tableRowClassName = (row: any) => {

  //如果radioTable 包含已审核
  if (radioTable.value.includes("已审核") && row.row.payablePrice === "0.0000") {
    return 'success-row'
  } else if (radioTable.value.includes("已审核") && row.row.payablePrice != "0.0000") {
    return 'warning-row'
  }
  return ''

}

/** 删除按钮操作 */
const handleDelete = async (row?: AccountOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除对账单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delAccountOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/accountOrder/export', {
    ...queryParams.value
  }, `accountOrder_${new Date().getTime()}.xlsx`)
}
/** 是否禁选 */
const selectableFun = (row: any) => {
  if (row.payablePrice === "0.0000") {
    return false;
  }
  return true;
}
onMounted(() => {
  getList();
  getSupplierList();


});
</script>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: #ec808c81;
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>

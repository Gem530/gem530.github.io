<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="18">
            <el-radio-group v-model="radioTable">
              <el-radio-button label="对账单列表" @change="radioTableHandle" />
              <el-radio-button label="待审核列表" @change="radioTableHandle" />
              <el-radio-button label="已审核列表" @change="radioTableHandle" />
            </el-radio-group>
          </el-col>
          <el-col :span="6" class="global-flex flex-end">
            <el-tag class="ml-2" v-show="radioTable.includes('已审核')" type="success">冲销完成</el-tag>
            <el-tag class="ml-2" v-show="radioTable.includes('已审核')" type="danger">未冲销</el-tag>
            <el-button
              type="primary"
              plain
              icon="Plus"
              v-show="!radioTable.includes('已审核')"
              @click="handleAdd"

              >借入对账单</el-button
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
      <XTable toolId="financialMaterialBorrowAccount" height="100%" class="xtable-content"
        :pageShow="true"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :intervalCondition="intervalCondition"
        :page-params="{ perfect: true, total: total }"
        :data="accountOrderList"
        :columnList="columnList"
        ref="borrowTableRef"
        @checkbox-all="handleSelectionChange"
        @checkbox-change="handleSelectionChange"
        border :showRefresh="true"
        @searchChange="searchChange"
        :column-config="{ resizable: true }"
        :checkbox-config="{
           checkMethod: selectableFun
        }"
        :row-style="tableRowClassName"
      >
        <template #default-status="scope">
          <span v-if="scope.row.payablePrice!=0">{{ scope.row.status}}</span>
          <span v-else>冲销完成</span>
        </template>
        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-accountTime="scope">
          <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-make="scope">
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
            v-show="scope.row.status == '审核通过'"
            @click="handleWriteOffRecord(scope.row)"

            >冲销记录</el-button
          >
          <el-button
            link
            type="primary"
            v-if="scope.row.payablePrice == 0"
            @click="accountUReportHandle(scope.row)"

            >对账单</el-button
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
      </XTable>
    </el-card>

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" destroy-on-close size="80%" draggable>
      <el-form
        border
        label-width="100px"
        :disabled="drawerBorrow.title?.includes('详情')|| drawerBorrow.title?.includes('审核')"
        :model="inOrOutQuery"
        :rules="rules"
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
          <el-col :span="12" v-show="drawerBorrow.title?.includes('添加')|| drawerBorrow.title?.includes('修改')">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleInOrOutQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetInOrOutQuery">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="对账月份： " prop="accountMonth">
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

      <XTable
        :pageShow="true"
        v-model:page-size="inOrOutQuery.pageSize"
        v-model:current-page="inOrOutQuery.pageNum"
        :intervalCondition="intervalCondition"
        :page-params="{ perfect: true, total: inOrOutTotal }"
        :data="inOrOutList"
        :columnList="inOutColumnList"
        ref="tableRef"
        @checkbox-all="selectAllChangeEvent"
        @checkbox-change="selectChangeEvent"
        border
        @searchChange="inOutSearchChange"
        :column-config="{ resizable: true }"
      >
        <template #default-quantity="{ row }">
          <el-input-number
            :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.quantity"
          />
        </template>

        <template #default-price="{ row }">
          <el-input-number
            :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
            @change="calculatePrice(row)"
            style="width: 99%;"
            :controls="false"
            v-model="row.price"
          />
        </template>

        <template #default-discountPrice="{ row }">
          <el-input-number
            :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
            style="width: 99%;"
            @change="calculatePrice(row)"
            :controls="false"
            v-model="row.discountPrice"
          />
        </template>
      </XTable>

      <el-form border label-width="120px" :model="inOutForm">
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="借入总金额：" prop="borrowTotalPrice"> {{ borrowTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="借入折扣总金额：" prop="borrowDiscountTotalPrice"> {{ borrowDiscountTotalPrice }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="还回总金额：" prop="backTotalPrice">{{ backTotalPrice }} </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="还回折扣总金额：" prop="backDiscountTotalPrice">{{ backDiscountTotalPrice }} </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="对账总金额：" prop="accountPrice"
              >{{ borrowTotalPrice - backTotalPrice - borrowDiscountTotalPrice - backDiscountTotalPrice }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

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
              v-show="drawerBorrow.title?.includes('修改')|| drawerBorrow.title?.includes('添加')"
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

    <writeOffDialog v-model:open="writerOffDialogOpen" :writeOffList="writeOffList" :type="writeOffType" @getList="getList"></writeOffDialog>

    <writeOffsRecordDialog
      v-model:open="writerOffRecordDialogOpen"
      :accountOrderWriteOff="accountOrderWriteOff"
      :type="writeOffType"
      @getList="getList"
    ></writeOffsRecordDialog>

    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
  </div>
</template>

<script setup name="MaterialBorrowAccount" lang="ts">
import {
  listAccountOrder,
  getAccountOrder,
  delAccountOrder,
  addAccountOrder,
  updateAccountOrder,
  listInOutRecord,
  listSupplier,
  updateAccountOrderStatus,
   } from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, InOrOutForm, InOrOutQuery, AccountMaterialInOutVo, TypeEnum ,StatusEnum} from '@/api/financial/accountOrder/types';
import { SupplierVO } from "@/api/basedata/supplier/types";
import {   VxeTableEvents } from 'vxe-table'
import { RepaymentRecordVO} from '@/api/financial/repaymentRecord/types';
import { getReportUrl } from '@/utils/report';
import writeOffDialog from '../components/writeOffDialog.vue';
import writeOffsRecordDialog from '../components/writeOffRecordDialog.vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const borrowTableRef = ref()

//冲销页面开关
const writerOffDialogOpen = ref(false);
//冲销记录页面开关
const writerOffRecordDialogOpen = ref(false);
/**
 * 冲销类型
 * 1:付款
 * 2:收款
 */
const writeOffType = ref("2");


const accountOrderList = ref<AccountOrderVO[]>([]);
//已选中的对账单
const writeOffList = ref<AccountOrderVO[]>([]);
const loading = ref(true);
const inOrOutLoading = ref(false);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const inOrOutTotal = ref(0);
const radioTable = ref('对账单列表');
const inOrOutQueryFormRef = ref<ElFormInstance>();

/**
 * 借料
 * 采购
 */
const globalType = "借料"

/**
 * 1:借入
 * 2:借出
 */
const globalInOutType = "1"

/**
 * 类型（1订单外协、2采购、3借入、4借出、5外协加工、6外协模具）
 */
const accountOrderType = TypeEnum.BORROW_IN


const drawerBorrow = reactive<DialogOption>({

  visible: false,
  title: '订单审核'
});
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
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
  remark: undefined,
  borrowDetailBoList:[],
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
    currency:undefined,
    code:undefined,
    remark:undefined,
    queryType: undefined,
    id:undefined,
  },
  rules: {
    supplierId: [
        { required: true, message: '请选择供应商', trigger: 'change' }
    ],
    accountTime: [
        { required: true, message: '请选择对账日期', trigger: 'change' }
    ],
    accountMonth: [
        { required: true, message: '请选择对账月份', trigger: 'change' }
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
  form: {...initFormData},
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


  }
});

const { queryParams,  } = toRefs(data);
const { queryParams:inOrOutQuery, form: inOutForm, rules } = toRefs(insertFormData);

const tableRef = ref()

const handleSaveFlag = ref(false);


const handleSaveFlagFun = () => {
 handleSaveFlag.value = false;
}

const intervalCondition = ['accountMonth', 'accountTime'];

const columnList = ref([
  { type: 'checkbox', align: 'center', field:"checkbox", visible:false,width: '50',  },
  { title: '序号', width: '50',type:'seq', visible:true,align: 'center' },
  { title: '单据状态', field: 'status', width: '80', align: 'center', },
  { title: '对账月份', field: 'accountMonth', width: '100', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份' , startParams:{type:'month'}, endParams:{type:'month'}, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', field: 'code', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '供应商编码', field: 'supplierCode', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' } },
  { title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' } },
  { title: '对账日期', field: 'accountTime', width: '180', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请输入对账日期' ,valueFormat: 'YYYY-MM-DD' } },
  { title: '对账金额', field: 'accountPrice', align: 'center', },
  { title: '折扣金额', field: 'accountDiscountPrice', align: 'center',},
  { title: '剩余应付金额', field: 'payablePrice', width: '120', align: 'center', },
  { title: '对账人', field: 'accountUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账人' } },
  { title: '备注', field: 'remark', align: 'center',  },
  { title: '操作', field:'make', width: '240', align: 'center', },
]);
const inOutColumnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", visible: true, width: '40', },
  { width: '50', title: '序号', type:'seq',  align: 'center'},
  { width: '120', title: '借料单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入借料单号' } },
  { width: '80', title: '借料类型', field: 'type', align: 'center', },
  { width: '90', title: '供应商名称', field: 'supplierName', align: 'center' },
  { width: '80', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { width: '80', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { width: '80', title: '物料规格', field: 'supplierName', align: 'center',  },
  {  width: '80',title: '规格参数', field: 'supplierName', align: 'center',  },
  { width: '80', title: '数量', field: 'inOutQuantity', align: 'center',  },
  { width: '80', title: '单价', field: 'inOutPrice', align: 'center',  },
  { width: '100', title: '核对数量', field: 'quantity', align: 'center',},
  { width: '120', title: '核对单价', field: 'price', align: 'center', },
  { width: '80', title: '折扣金额', field: 'discountPrice', align: 'center', },
  { width: '120', title: '总金额', field: 'totalPrice', align: 'center',  },
  {  title: '备注', field: 'addressId', align: 'center' },
]);

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}

//  出入库搜索条件
const inOutSearchChange = (params: any) => {

  inOrOutQuery.value = params
  inOrOutQuery.value.accountTime = inOutForm.value.accountTime;
  inOrOutQuery.value.accountMonth = inOutForm.value.accountMonth;
  inOrOutQuery.value.supplierId = inOutForm.value.supplierId;
  inOrOutQuery.value.remark = inOutForm.value.remark;
  inOrOutQuery.value.currency = inOutForm.value.currency;
  inOrOutQuery.value.id = inOutForm.value.id;

  getListInOutRecord();
}

// 切换菜单栏
const radioTableHandle =async () => {

  if(radioTable.value=="对账单列表"){
     queryParams.value.status = undefined;

  }
  if(radioTable.value == "已审核列表"){
    console.log("已审核列表");

    columnList.value[0].visible = true
    columnList.value[1].visible = false
  }else{
    columnList.value[0].visible = false
    columnList.value[1].visible = true
  }
  await getList();
  setBorrowTableSelectRow();
}



/** 审核驳回 */
const reject = async (id:string|number|undefined) => {
  updateStatus(id,StatusEnum.REJECTED);
}

/** 审核通过 */
const examinePass = async (id:string|number|undefined) => {
  updateStatus(id, StatusEnum.AUDITED);
}
/** 提交*/
const checkPass = async (row: AccountOrderVO) => {
  await proxy?.$modal.confirm('是否确认提交对账单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, StatusEnum.BE_AUDITED);
  }

const updateStatus=(id:any,status:string)=>{
   updateAccountOrderStatus({ id, status}).then(res => {
        proxy?.$modal.msgSuccess("操作成功");
        getList();
        drawerBorrow.visible = false;
});
}


const handleSumbit = () => {
  inOutForm.value.status = StatusEnum.BE_AUDITED;
save();
}


const handleSave = () => {
 if(inOutForm.value.status!= StatusEnum.REJECTED){
    inOutForm.value.status = StatusEnum.BE_SUBMITTED;
 }
  save();
}

const save = () => {
  if(!handleSaveFlag.value){
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
  let  supplierId = selectedInOrOutList.value[0].supplierId;
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
  inOutForm.value.remark = inOrOutQuery.value.remark;
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
//设置出入库记录勾选
const setSelectRow = () => {
  const $table = tableRef.value.xTableRef
  if ($table) {
      let st = inOrOutList.value.filter(item => {
        return selectedInOrOutList.value.some(item2 => item.id == item2.id);
      });
       $table.setCheckboxRow(st, true);
  }
}
//设置借料记录勾选
const setBorrowTableSelectRow = () => {
  const $table = borrowTableRef.value.xTableRef
  if ($table) {
      let st = accountOrderList.value.filter(item => {
        return writeOffList.value.some(item2 => item.id == item2.id);
      });
       $table.setCheckboxRow(st, true);
  }
}
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<RepaymentRecordVO> = ({ checked }) => {
  const $table = tableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    // selectedRepaymentRecordList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
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
  const $table = tableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
    //  selectedInOrOutList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
    if (checked) {
      selectedInOrOutList.value.push(...records.filter(item => !selectedInOrOutList.value.some(item2 => item.id == item2.id)))
    } else {
      selectedInOrOutList.value = selectedInOrOutList.value.filter(item => item.id!=row.id)
    }
  }
}

const borrowTotalPrice = computed(() => {
  return calculateTotalPriceByType("物料借入");
});

const borrowDiscountTotalPrice = computed(() => {
  return calculateDiscountTotalPriceByType("物料借入");
});

const backTotalPrice = computed(() => {
  return calculateTotalPriceByType("借入归还");
});

const backDiscountTotalPrice = computed(() => {
  return calculateDiscountTotalPriceByType("借入归还");
});

//计算总价，
const calculateTotalPriceByType = (type:string) => {
  return selectedInOrOutList.value
    .filter(item => item.type === type)
    .reduce((total, item) => total + parseFloat(item.totalPrice as string), 0);
};

//计算折扣金额
const calculateDiscountTotalPriceByType = (type:string) => {
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
  if(row.discountPrice){
    row.totalPrice = price * quantity - row.discountPrice;
    return;
  }
  //计算总价
  row.totalPrice = price * quantity;
};


/** 出入库记录搜索按钮操作 */
const handleInOrOutQuery = async() => {
  inOrOutQuery.value.pageNum = 1;

  //判断是否选择了时间
  if (inOrOutQuery.value.accountTime == undefined ) {
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



//设置表单信息
const setSupplierInfo = (value: string) => {

  if (value == undefined || value == null || value == "") {
    inOrOutQuery.value.currency = undefined;
    return;
  }

  //根据value 筛选出RawMaterialList中对应的数据,并赋值给form
  let supplier  = SupplierList.find(item => item.id === value);
 if(supplier == undefined) {
    return;
  }
  inOrOutQuery.value.currency = supplier.currency;

};

/** 查询对账单列表 */
const getList = async () => {
  if (radioTable.value == "待审核列表") {
    queryParams.value.status = StatusEnum.BE_AUDITED;
  } else if (radioTable.value == "已审核列表") {
    queryParams.value.status = StatusEnum.AUDITED;
  }

  loading.value = true;
  queryParams.value.type = accountOrderType;
  const res = await listAccountOrder(queryParams.value);
  accountOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询出入库记录 */
const getListInOutRecord = async () => {

  inOrOutLoading.value=true
  inOrOutQuery.value.type= globalType;
  inOrOutQuery.value.inOrOut= globalInOutType;
  if(inOrOutQuery.value.isAccountOrde == undefined && inOrOutQuery.value.id == null){
    inOrOutQuery.value.isAccountOrde = "2";
  }
  const res = await listInOutRecord(inOrOutQuery.value);
  inOrOutTotal.value = res.total;
  inOrOutList.value = res.rows;
  inOutFormList();
  await setSelected();
  if(inOrOutQuery.value.supplierId){
    selectedInOrOutList.value=selectedInOrOutList.value.filter(item => item.supplierId == inOrOutQuery.value.supplierId);
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

/** 出入库取消按钮 */
const inOutCancel = () => {
  inOutReset();
  drawerBorrow.visible = false;
}


/** 出入库记录表单重置 */
const inOutReset = () => {
  inOutForm.value = {...initInOutFormData };
  inOrOutQueryFormRef.value?.resetFields();
  selectedInOrOutList.value = [];
  inOrOutQuery.value = {...initQueryParams };
  inOrOutList.value = [];
  inOrOutListAll.value = [];
}

/** 多选框选中数据 */
const handleSelectionChange = ({ checked }) => {
  const $table = borrowTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords()
      writeOffList.value = records;
  }
}

/** 新增按钮操作 */
const handleAdd = () => {
  inOutColumnList.value[0].visible = true;
  inOutReset();
  drawerBorrow.visible = true;
  drawerBorrow.title = "添加对账单";
  getListInOutRecord();
}



const accountOrderWriteOff = ref<AccountOrderVO>();

/** 冲销按钮操作 */
const handleWriteOff = async() => {

  //判断writeOffList是不是同一个供应商
  if (writeOffList.value.some(item => item.supplierId != writeOffList.value[0].supplierId)) {
    proxy?.$modal.msgError("所选的出入库记录不是同一个供应商");
    return;
  }
  //writeOffType==2
  //合计
  let total=0;
  writeOffList.value.forEach(item => {
    total += parseFloat(item.payablePrice as string);
  });
  if(total>0){
    writeOffType.value = "2";
  }else{
    writeOffType.value = "1";
  }
  writerOffDialogOpen.value =true;

}

/** 冲销记录按钮操作 */
const handleWriteOffRecord = async(row:AccountOrderVO) => {
  accountOrderWriteOff.value = row;
  writerOffRecordDialogOpen.value = true;
}

let reportUrl = ref("");
/** 对账单按钮操作 */
const accountUReportHandle = async(row:AccountOrderVO) => {
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl()+`&_u=file:borrow.ureport.xml&url=financial/accountOrder/report/${row.id}&listUrl=financial/orderBorrowDetail/reportList&id=${row.id}`;
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AccountOrderVO) => {
  inOutColumnList.value[0].visible = true;
  handleSaveFlag.value = true;
  inOutReset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "修改对账单";
  Object.assign(inOutForm.value, res.data);
  // Object.assign(inOrOutQuery.value,inOutForm.value);

  inOrOutQuery.value.accountTime = inOutForm.value.accountTime;
  inOrOutQuery.value.accountMonth = inOutForm.value.accountMonth;
  inOrOutQuery.value.supplierId = inOutForm.value.supplierId;
  inOrOutQuery.value.remark = inOutForm.value.remark;
  inOrOutQuery.value.currency = inOutForm.value.currency;

  inOrOutQuery.value.pageNum = 1;
  inOrOutQuery.value.pageSize = 10;
  inOrOutQuery.value.id = res.data.id;
  getListInOutRecord();
}


/**详情按钮操作 */
const handleDetail = async (row?: AccountOrderVO) => {
  inOutColumnList.value[0].visible = false;
  inOutReset();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  drawerBorrow.visible = true;
  drawerBorrow.title = "对账单详情";
  Object.assign(inOutForm.value, res.data);
  // Object.assign(inOrOutQuery.value, inOutForm.value);

  inOrOutQuery.value.accountTime = inOutForm.value.accountTime;
  inOrOutQuery.value.accountMonth = inOutForm.value.accountMonth;
  inOrOutQuery.value.supplierId = inOutForm.value.supplierId;
  inOrOutQuery.value.remark = inOutForm.value.remark;
  inOrOutQuery.value.currency = inOutForm.value.currency;

  inOrOutQuery.value.pageNum = 1;
  inOrOutQuery.value.pageSize = 10;
  inOrOutQuery.value.queryType = "1";
  inOrOutQuery.value.id = res.data.id;
  getListInOutRecord();
}
/**审核弹窗按钮操作 */
const handleToExamine = async (row?: AccountOrderVO) => {
  inOutColumnList.value[0].visible = false;
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

const setSelected =() => {
      const temp = inOrOutList.value.filter(item => item.selected===true);
      //如果temp中有数据，则将temp中的数据添加到selectedInOrOutList中
      if (temp.length > 0) {
        selectedInOrOutList.value.push(...temp.filter(item => !selectedInOrOutList.value.some(item2 => item.id == item2.id)))
      }
  }


const tableRowClassName = (  row:any )=> {

//如果radioTable 包含已审核
  if (radioTable.value.includes("已审核") && row.row.payablePrice === "0.0000") {
    return {
      backgroundColor: '#F5FFFA'
    }
  }else if(radioTable.value.includes("已审核") && row.row.payablePrice != "0.0000"){
    return {
     backgroundColor: '#FFB6C1'
    }
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

/** 是否禁选 */
const selectableFun = (scope: any) => {

   if ( scope.row.payablePrice == "0.0000") {
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

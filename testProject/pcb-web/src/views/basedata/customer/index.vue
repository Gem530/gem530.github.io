<template>
  <div class="p-2 xtable-page">

    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="default" plain icon="Download" @click="handleExport"
                       >导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <XTable toolId="basedataCustomer" :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
              :intervalCondition="['createTime']"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="customerList" :loading="mainLoading"
              :columnList="columnList"
              ref="newVxeTableRef" border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }" @checkbox-all="checkboxChangeEvent"
              @checkbox-change="checkboxChangeEvent">
        <template #default-customerLevel="scope">
          <div v-for="item in resDictData.customer_level">
            <span>{{ item.dictValue == scope.row.customerLevel ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-userNames="scope">
          <div style="text-align:left;">
            <el-tag v-for="(item,index) in scope.row.sysUserList"
                    :key="index"
                    style="margin-left:2px;margin-bottom:2px;">
              {{ item.nickName }}
            </el-tag>
          </div>
        </template>
        <template #default-paymentMethod="scope">
          <div v-for="item in resDictData.payment_method">
            <span>{{ item.dictValue == scope.row.paymentMethod ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-currency="scope">
          <div v-for="item in resDictData.currency_type">
            <span>{{ item.dictValue == scope.row.currency ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-monthlyMethod="scope">
          <div v-for="item in resDictData.monthly_method">
            <span>{{ item.dictValue == scope.row.monthlyMethod ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-shippingType="scope">
          <div v-for="item in resDictData.shipping_type">
            <span>{{ item.dictValue == scope.row.shippingType ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-checkStandard="scope">
          <div v-for="item in resDictData.check_standard">
            <span>{{ item.dictValue == scope.row.checkStandard ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-customerData="scope">
          <div v-for="item in resDictData.customer_data">
            <span>{{ item.dictValue == scope.row.customerData ? item.dictLabel : "" }}</span>
          </div>
        </template>
        <template #default-isTax="scope">
          <el-switch v-model="scope.row.isTax" active-value="1" inactive-value="0" disabled/>
        </template>
        <template #default-isDisabled="scope">
          <el-switch v-if="scope.row.isDisabled" v-model="scope.row.isDisabled"  @change="changeFlag(scope.row)" active-value="1" inactive-value="0"/>
        </template>
        <template #default-make="scope">
          <el-button link type="primary">导出</el-button>
          <!--          <el-tooltip content="配置销售人员" placement="top">-->
          <!--            <el-button link type="primary" icon="User" @click="handleUser(scope.row)">配置销售人员</el-button>-->
          <!--          </el-tooltip>-->
          <el-button link type="primary" @click="handleAddress(scope.row)"
                     >地址
          </el-button>
          <el-button link type="primary" @click="handleUpdate(scope.row)"
                     >修改
          </el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)" v-show="false"
                     >删除
          </el-button>
        </template>

      </XTable>
    </el-card>

    <!-- 新增编辑 -->
    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      size="50%"
      :direction="drawer.direction"
    >
      <el-form ref="customerFormRef" :model="form" :rules="rules" label-width="130px" v-loading="drawerLoading">
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="客户编码" prop="customerCode">
            <el-input v-model="form.customerCode" placeholder="请输入" :disabled="drawer.title=='修改客户'"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户名称" prop="companyId">
            <el-select v-model="form.companyId" :disabled="drawer.title !== '添加客户'" style="width: 100%" filterable allow-create default-first-option>
              <el-option v-for="company in companyList" :key="company.deptId" :label="company.deptName" :value="company.deptId"/>
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户级别" prop="customerLevel">
            <el-select v-model="form.customerLevel" clearable filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in resDictData.customer_level"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="对账时间" prop="reconciliationTime">
            <el-select v-model="form.reconciliationTime" clearable filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in resDictData.reconciliation_time"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="付款方式" prop="paymentMethod">
            <el-select v-model="form.paymentMethod" clearable filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in resDictData.payment_method"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="营业执照号">
            <el-input v-model="form.businessLicenseNumber" />
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="币种" prop="currency">
            <el-select v-model="form.currency" clearable filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in resDictData.currency_type"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="汇率(%)">
            <el-input-number v-model="form.exchangeRate" :min="0" controls-position="right" style="width:100%"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户电话">
            <el-input v-model="form.customerPhone" />
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="客户地址">
            <el-input v-model="form.companyAddress" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="公司负责人" prop="companyPrincipal">
            <el-input v-model="form.companyPrincipal" placeholder="请输入" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="负责人电话" prop="companyPrincipalPhone">
            <el-input v-model="form.companyPrincipalPhone" placeholder="请输入"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="月结方式">
            <el-select v-model="form.monthlyMethod" clearable filterable placeholder=" " style="width: 100%">
              <el-option
                v-for="item in resDictData.monthly_method"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="天数限制">
            <el-input-number v-model="form.dayNumberLimit" :min="0" controls-position="right" style="width:100%"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="运输方式">
            <el-select v-model="form.shippingType" clearable filterable placeholder=" " style="width: 100%">
              <el-option
                v-for="item in resDictData.shipping_type"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="采购负责人" prop="purchasingManager">
            <!-- <el-select placeholder=" "
              style="width: 100%;" filterable clearable v-model="form.purchasingManager">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select> -->
            <el-input v-model="form.purchasingManager" placeholder="请输入" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="采购联系电话">
            <el-input v-model="form.purchasingPhone" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="采购联系Email">
            <el-input v-model="form.purchasingEmail" placeholder=" "/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="财务联系人" prop="financeManager">
            <!-- <el-select    placeholder=" "
              style="width: 100%;" filterable clearable v-model="form.financeManager">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select> -->
            <el-input v-model="form.financeManager" placeholder="请输入" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="财务联系电话">
            <el-input v-model="form.financePhone" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="财务联系Email">
            <el-input v-model="form.financeEmail" placeholder=" "/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="仓库联系人" prop="warehouseKeeper">
            <!-- <el-select    placeholder=" "
              style="width: 100%;" filterable clearable v-model="form.warehouseKeeper">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select> -->
            <el-input v-model="form.warehouseKeeper" placeholder="请输入" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="仓库联系电话">
            <el-input v-model="form.warehousePhone" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="仓库联系Email">
            <el-input v-model="form.warehouseEmail" placeholder=" "/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="工程联系人" prop="projectManager">
            <!-- <el-select    placeholder=" "
              style="width: 100%;" filterable clearable v-model="form.projectManager">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select> -->
            <el-input v-model="form.projectManager" placeholder="请输入" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="工程联系电话">
            <el-input v-model="form.projectPhone" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="工程联系Email">
            <el-input v-model="form.projectEmail" placeholder=" "/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="其他联系人" prop="otherManager">
            <!-- <el-select    placeholder=" "
              style="width: 100%;" filterable clearable v-model="form.otherManager">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select> -->
            <el-input v-model="form.otherManager" placeholder="请输入" />
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="其他联系电话">
            <el-input v-model="form.otherPhone" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="其他联系Email">
            <el-input v-model="form.otherEmail" placeholder=" "/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="联系人QQ">
            <el-input v-model="form.contactsQq" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="开户银行">
            <el-input v-model="form.depositBank" placeholder=" "/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="银行账号">
            <el-input v-model="form.bankAccount" placeholder=" "/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="检验标准">
            <el-select v-model="form.checkStandard" clearable filterable placeholder=" " style="width: 100%">
              <el-option
                v-for="item in resDictData.check_standard"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户资料">
            <el-select v-model="form.customerData" :collapse-tags="true" multiple clearable filterable placeholder=" " style="width: 100%">
              <el-option
                v-for="item in resDictData.customer_data"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="是否含税">
            <el-switch v-model="form.isTax" active-value="1" inactive-value="0"/>
          </el-form-item>
        </div>
        <el-form-item size="small" label="纳税人识别号" prop="taxpayerIdentification">
          <el-input v-model="form.taxpayerIdentification" placeholder=" "/>
        </el-form-item>
        <el-form-item size="small" label="邮箱">
          <el-input v-model="form.email" placeholder=" "/>
        </el-form-item>
        <el-form-item size="small" label="传真">
          <el-input v-model="form.faxes" placeholder=" "/>
        </el-form-item>
        <el-form-item size="small" label="销售人员">
          <el-select v-model="form.salerList" clearable filterable multiple style="width: 100%"
                     placeholder=" ">
            <el-option
              v-for="item in salerOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="客户要求">
          <el-input v-model="form.customerDemand" type="textarea" :rows="3" maxlength="2000" show-word-limit placeholder=" "/>
        </el-form-item>
        <el-form-item size="small" label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder=" "/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="text-center" v-if="!drawerLoading">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 查看客户收货地址 -->
    <el-drawer v-model="addressDrawer.visible"
               :title="addressDrawer.title"
               size="75%"
               :direction="addressDrawer.direction">
      <el-card shadow="never">
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAddAddress"
                         >新增
              </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getAddressList"></right-toolbar>
          </el-row>
        </template>

        <el-table v-loading="loading" :data="customerAddressList" @selection-change="handleSelectionChange">
          <el-table-column label="联系人" align="center" prop="name" width="100"/>
          <el-table-column label="联系电话" align="center" prop="phone" width="100"/>
          <el-table-column label="联系地址" align="center" prop="address" width="180"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
          <el-table-column label="物流周期(小时)" align="center" prop="logisticsCycle" width="180"/>
          <el-table-column label="是否默认" align="center" prop="isDefault">
            <template #default="scope">
              <el-switch @change="changeDeafultAddress(scope.row)" v-model="scope.row.isDefault" :active-value="1"
                         :inactive-value="0"/>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <el-switch @change="changeDeafultAddress(scope.row)" v-model="scope.row.status" active-value="1" inactive-value="0" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300" fixed="right">
            <template #default="scope">
                <el-button link type="primary"  @click="handleUpdateAddress(scope.row)"
                           >编辑
                </el-button>
                <el-button link type="primary"  @click="handleDeleteAddress(scope.row)"
                           >删除
                </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="totalAddress>0"
          :total="totalAddress"
          v-model:page="queryParamsAddress.pageNum"
          v-model:limit="queryParamsAddress.pageSize"
          @pagination="getAddressList"
        />
      </el-card>
    </el-drawer>

    <el-dialog v-model="addressDialog.visible" :title="addressDialog.title" destroy-on-close
               :close-on-click-modal="false" width="350px">
      <el-form label-width="80px" ref="customerAddressFormRef" :model="formAddress" :rules="rulesAddress">
        <el-form-item size="small" label="物流周期" prop="logisticsCycle">
          <el-input-number  size="small" v-model="formAddress.logisticsCycle" :min="1" />
        </el-form-item>
        <el-form-item size="small" label="联系人" prop="name">
          <el-input v-model="formAddress.name" autocomplete="off" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系电话" prop="phone">
          <el-input v-model="formAddress.phone" autocomplete="off" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系地址" prop="address">
          <el-input v-model="formAddress.address" autocomplete="off" placeholder="请输入地址"></el-input>
        </el-form-item>
        <!-- <el-form-item size="small" label="物流周期" prop="logisticsCycle">
          <el-input v-model="formAddress.logisticsCycle" autocomplete="off" placeholder="请输入物流周期"></el-input>
        </el-form-item> -->
      </el-form>
      <div class="text-center">
        <el-button :loading="buttonLoading" @click="cancelAddress">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitAddress">确 定</el-button>
      </div>
    </el-dialog>
    <!--    <el-dialog v-model="salerDialog.visible" :title="salerDialog.title" destroy-on-close :close-on-click-modal="false"	 width="40%" >
          <el-checkbox-group v-model="alreadySaler">
            <el-checkbox v-for="item in salerOptions" :label="item.userId" :key="item.userId" style="width:100px; font-size:20px;">{{item.userName}}</el-checkbox>
          </el-checkbox-group>
          <div class="text-center">
            <el-button :loading="buttonLoading" type="primary" @click="submitSaler">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog> -->

  </div>
</template>

<script setup name="Customer" lang="ts">
  import {postListCustomer, getCustomer, delCustomer, addCustomer, updateCustomer, selectCompanyDept,disableCustomer,unDisableCustomer} from "@/api/basedata/customer";
  import {CustomerVO, CustomerQuery, CustomerForm} from "@/api/basedata/customer/types";
  import {getDicts} from "@/api/system/dict/data";
  import {DictDataVO} from "@/api/system/dict/data/types";
  import {listUser, listUserByRoleKey} from "@/api/system/user";
  import {UserVO} from "@/api/system/user/types";
  import {batchInsertCustomerUser, customerUserList} from "@/api/basedata/customerUser";
  import {any} from "vue-types";
  import {type VxeTableEvents} from 'vxe-table'
  import {
    listCustomerAddress,
    getCustomerAddress,
    addCustomerAddress,
    updateCustomerAddress,
    delCustomerAddress,
  } from "@/api/basedata/customerAddress";
  import {CustomerAddressVO, CustomerAddressForm, CustomerAddressQuery} from "@/api/basedata/customerAddress/types";
  import { UserForm,UserQuery } from "@/api/system/user/types";
  import {ref} from "vue";
  import {sortBy} from "@/utils/dict";
  import { CompanyDept } from "@/types/global";
  import { getListCustomer } from "@/api/basedata/customer";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const customerList = ref<CustomerVO[]>([]);
  const customerAddressList = ref<CustomerAddressVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const mainLoading = ref(false);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const totalAddress = ref(0);
  const companyList = ref<CompanyDept[]>([]);
  const drawerLoading = ref(false);
  const newVxeTableRef = ref();
  const queryFormRef = ref<ElFormInstance>();
  const customerFormRef = ref<ElFormInstance>();
  const customerAddressFormRef = ref<ElFormInstance>();

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const addressDrawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const addressDialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  const salerDialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });
  const initFormData: CustomerForm = {
    id: undefined,
    customerCode: undefined,
    customerName: undefined,
    customerLevel: undefined,
    companyId: undefined,
    salesman: undefined,
    reconciliationTime: undefined,
    paymentMethod: undefined,
    businessLicenseNumber: undefined,
    currency: undefined,
    exchangeRate: undefined,
    customerPhone: undefined,
    companyAddress: undefined,
    companyPrincipal: undefined,
    companyPrincipalPhone: undefined,
    monthlyMethod: undefined,
    dayNumberLimit: undefined,
    shippingType: undefined,
    purchasingManager: undefined,
    purchasingPhone: undefined,
    purchasingEmail: undefined,
    financeManager: undefined,
    financePhone: undefined,
    financeEmail: undefined,
    warehouseKeeper: undefined,
    warehousePhone: undefined,
    warehouseEmail: undefined,
    projectManager: undefined,
    projectPhone: undefined,
    projectEmail: undefined,
    otherManager: undefined,
    otherPhone: undefined,
    otherEmail: undefined,
    contactsQq: undefined,
    depositBank: undefined,
    bankAccount: undefined,
    checkStandard: undefined,
    customerData: undefined,
    isTax: '1',
    taxpayerIdentification: undefined,
    email: undefined,
    faxes: undefined,
    customerDemand: undefined,
    remark: undefined,
    salerList: undefined
  };
  const data = reactive<PageData<CustomerForm, CustomerQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      customerCode: undefined,
      customerName: undefined,
      customerLevel: undefined,
      salesman: undefined,
      reconciliationTime: undefined,
      paymentMethod: undefined,
      businessLicenseNumber: undefined,
      currency: undefined,
      exchangeRate: undefined,
      customerPhone: undefined,
      companyAddress: undefined,
      companyPrincipal: undefined,
      companyPrincipalPhone: undefined,
      monthlyMethod: undefined,
      dayNumberLimit: undefined,
      shippingType: undefined,
      purchasingManager: undefined,
      purchasingPhone: undefined,
      purchasingEmail: undefined,
      financeManager: undefined,
      financePhone: undefined,
      financeEmail: undefined,
      warehouseKeeper: undefined,
      warehousePhone: undefined,
      warehouseEmail: undefined,
      projectManager: undefined,
      projectPhone: undefined,
      projectEmail: undefined,
      otherManager: undefined,
      otherPhone: undefined,
      otherEmail: undefined,
      contactsQq: undefined,
      depositBank: undefined,
      bankAccount: undefined,
      checkStandard: undefined,
      customerData: undefined,
      isTax: undefined,
      email: undefined,
      faxes: undefined,
      customerDemand: undefined,
      remark: undefined,
      params: {}
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      customerCode: [
        {required: true, message: "客户编码不能为空", trigger: "blur"}
      ],
      companyId: [
        { required: true, message: "客户名称不能为空", trigger: "blur" }
      ],
      customerLevel: [
        {required: true, message: "客户级别不能为空", trigger: "blur"}
      ],
      reconciliationTime: [
        {required: true, message: "对账时间不能为空", trigger: "blur"}
      ],
      paymentMethod: [
        {required: true, message: "付款方式不能为空", trigger: "blur"}
      ],
      currency: [
        {required: true, message: "币种不能为空", trigger: "blur"}
      ],
      companyPrincipal: [
        {required: true, message: "公司负责人不能为空", trigger: "blur"}
      ],
      companyPrincipalPhone: [
        {required: true, message: "公司负责人电话不能为空", trigger: "blur"}
      ],
      taxpayerIdentification: [
        { max:50, message: "纳税人识别号输入不能超过50个字符", trigger: "change" }
      ],
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  /** 查询客户列表 */
  const getList = async () => {
    let tempQuery = JSON.parse(JSON.stringify(queryParams.value))
    tempQuery.customerCodeIdList=tempQuery.customerCode;
    tempQuery.customerNameIdList=tempQuery.customerName;
    tempQuery.customerName =undefined;
    tempQuery.customerCode =undefined;


    loading.value = true;
    const res = await postListCustomer(tempQuery);
    customerList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  };

  const initAddressFormData: CustomerAddressForm = {
    name: undefined,
    phone: undefined,
    address: undefined
  };
  const addressData = reactive<PageDataAddress<CustomerAddressForm, CustomerAddressQuery>>({
    formAddress: {...initAddressFormData},
    queryParamsAddress: {
      pageNum: 1,
      pageSize: 20,
      customerId: undefined,
      name: undefined,
      phone: undefined,
      address: undefined,
      params: {}
    },
    rulesAddress: {
      name: [
        {required: true, message: "联系人不能为空", trigger: "blur"}
      ],
      phone: [
        {required: true, message: "电话不能为空", trigger: "blur"}
      ],
      address: [
        {required: true, message: "联系地址不能为空", trigger: "blur"}
      ],
      logisticsCycle: [
        {required: true, message: "物流周期不能为空", trigger: "blur"}
      ]
    }
  });

  const {queryParamsAddress, formAddress, rulesAddress} = toRefs(addressData);
  //查询地址列表
  const getAddressList = async () => {
    loading.value = true;
    const res = await listCustomerAddress(queryParamsAddress.value);
    customerAddressList.value = res.rows;
    totalAddress.value = res.total;
    loading.value = false;
  };

  let resDictData = ref({
    //客户级别
    customer_level: [],
    //付款方式
    payment_method: [],
    //币种
    currency_type: [],
    //月结方式
    monthly_method: [],
    //运输方式
    shipping_type: [],
    //检验标准
    check_standard: [],
    //客户资料
    customer_data: [],
    //对账日期
    reconciliation_time: [],
  })

  //销售人员
  let salerOptions = ref([]);
  //用户列表
  let userOptions = ref([]);
  const userData = reactive<PageData<UserForm, UserQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    userName: '',
    phonenumber: '',
    status: '',
    deptId: ''
  },
  rules: {
  }
})

const { queryParams:userQueryParams } = toRefs<PageData<UserForm, UserQuery>>(userData);

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    let string = "customer_level,payment_method,currency_type,monthly_method,shipping_type,check_standard,customer_data,reconciliation_time";
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

        console.log(resDictData.value)
        console.log(resDictData.value.customer_level)
      });
    const salerResponse: any = await listUserByRoleKey("saler");
    salerOptions.value = salerResponse.data;

    //采购负责人等人员list
    const equipmentResponse: any = await listUser(userQueryParams.value);
    userOptions.value = equipmentResponse.rows;

  };
  /** 取消按钮 */
  const cancel = () => {
    reset();
    salerDialog.visible = false;
    drawer.visible = false;
    // alreadySaler.value = [];
  };

  const cancelAddress = () => {
    resetAddress();
    addressDialog.visible = false;
  };

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = params;
    getList();
  }

  const intervalDateParam = ref({clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'})

  const customerCodeList = ref();
  const customerNameList = ref();

  const columnList = ref([
    {type: 'checkbox', width: '60', align: "center"},
    {title: "序号", type: 'seq',field:'index', fixed: "left", align: 'center', width: '60'},
    {
      title: '客户编码',
      width: "120",
      field: 'customerCode',
      align: 'center',
      filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value
      // filterType: 'input',
      // filterParam: {placeholder: '请输入客户编码'}
    },
    {
      title: '客户名称',
      width: "120",
      field: 'customerName',
      align: 'center',
      filterType: 'checkboxSearch' , filterData:()=>customerNameList.value
      // filterType: 'input',
      // filterParam: {placeholder: '请输入客户名称'}
    },
    {
      title: '客户级别',
      width: "120",
      field: 'customerLevel',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择客户级别',
      },
      filterData: () => resDictData.value.customer_level,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '客户电话',
      width: "120",
      field: 'customerPhone',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户电话'}
    },
    {
      title: '公司地址', width: "120", field: 'companyAddress', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入公司地址'}
    },
    {
      title: '纳税人识别号', width: "120", field: 'taxpayerIdentification', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入纳税人识别号'}
    },
    {
      title: '公司负责人', width: "120", field: 'companyPrincipal', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入公司负责人'}
    },
    {
      title: '负责人电话', width: "120", field: 'companyPrincipalPhone', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入负责人电话'}
    },
    {
      title: '销售人员', width: "120", field: 'userNames', align: 'center', filterType: 'input',
      filterParam: {
        placeholder: '请输入销售人员',
      }
    },
    {
      title: '客户要求', width: "120", field: 'customerDemand', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入客户要求'}
    },
    {
      title: '月结方式', width: "120", field: 'monthlyMethod', align: 'center',
      filterType: 'select',
      filterParam: {placeholder: '请输入月结方式'},
      filterData: () => [{dictLabel:"全部",dictValue:"0",},...resDictData.value.monthly_method],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '天数限制', width: "120", field: 'dayNumberLimit', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入天数限制'}
    },
    {
      title: '对账时间', width: "120", field: 'reconciliationTime', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入对账时间'}
    },
    {
      title: '付款方式', width: "120", field: 'paymentMethod', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入付款方式'},
      filterData: () => [{dictLabel:"全部",dictValue:"0",},...resDictData.value.payment_method],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '币种', width: "120", field: 'currency', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入币种'},
      filterData: () => [{dictLabel:"全部",dictValue:"0",},...resDictData.value.currency_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '汇率(%)', width: "120", field: 'exchangeRate', align: 'center'
    },
    {
      title: '运输方式', width: "120", field: 'shippingType', align: 'center', filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择运输方式',
      },
      filterData: () => [{dictLabel:"全部",dictValue:"0",},...resDictData.value.shipping_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '检验标准', width: "120", field: 'checkStandard', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入检验标准'},
      filterData: () => [{dictLabel:"全部",dictValue:"0",},...resDictData.value.check_standard],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '客户资料', width: "120", field: 'customerData', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入客户资料'},
      filterData: () => [{dictLabel:"全部",dictValue:"0",},...resDictData.value.customer_data],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '是否含税', width: "120", field: 'isTax', align: 'center'
    },
    {
      title: '营业执照', width: "120", field: 'businessLicenseNumber', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入营业执照'}
    },
    {
      title: '邮箱', width: "120", field: 'email', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入邮箱'}
    },
    {
      title: '传真', width: "120", field: 'faxes', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入传真'}
    },
    {
      title: '备注', width: "120", field: 'remark', align: 'center', filterType: 'input',
      filterParam: {placeholder: '请输入备注'}
    },
    {
      title: '是否禁用', width: "120", field: 'isDisabled', align: 'center'
    },
    {
      title: '新增时间', width: "120", field: 'createTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },
    {title: '操作', field: 'make', align: 'center', fixed: 'right', width: 300,showOverflow: false},
  ])

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    customerFormRef.value?.resetFields();
    companyList.value = [];
  };

  const resetAddress = () => {
    formAddress.value = {...initAddressFormData};
    customerAddressFormRef.value?.resetFields();
  };

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  };

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    handleQuery();
  };

  /** 多选框选中数据 */
  const checkboxChangeEvent = () => {
    const $table = newVxeTableRef.value.xTableRef
    if ($table) {
      const selectRecords = $table.getCheckboxRecords() // 获取选择的行数据列表
      ids.value = selectRecords.map(item => item.id);
      single.value = selectRecords.length != 1;
      multiple.value = !selectRecords.length;
    }
  }

  /** 新增按钮操作 */
  const handleAdd = async () => {
    reset();
    drawer.title = "添加客户";
    drawerLoading.value = true;
    drawer.visible = true;

    const res = await selectCompanyDept();

    companyList.value = res.data;
    drawerLoading.value = false;
  };

  /** 修改按钮操作 */
  const handleUpdate = async (row?: CustomerVO) => {
    reset();
    drawer.visible = true;
    drawerLoading.value = true;
    const _id = row?.id || ids.value[0];
    await getCustomer(_id)
      .then(e => {
        companyList.value = [{deptId: e.data.companyId, deptName: e.data.companyName}]
        Object.assign(form.value, e.data);
      })
      .finally(e => {
        drawer.title = "修改客户";
        drawerLoading.value = false;
      });
  };

  /** 地址按钮操作 */
  const handleAddress = async (row?: CustomerVO) => {
    reset();
    const _id = row?.id || ids.value[0];
    queryParamsAddress.value.customerId = _id;
    getAddressList();
    // const res = await getCustomer(_id);
    // Object.assign(form.value, res.data);
    addressDrawer.title = row?.customerName + "-收货地址";
    addressDrawer.visible = true;
  };

  //新增地址按钮操作
  const handleAddAddress = () => {
    resetAddress();
    addressDialog.title = "添加客户地址";
    addressDialog.visible = true;
  };

  //删除地址按钮操作
  const handleDeleteAddress = async (row?: CustomerAddressVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm("如果该地址被使用过，删除后会导致无法显示，建议将状态设为禁用! 请确认是否继续删除？").finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...');
    await delCustomerAddress(_ids).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("删除成功");
    await getAddressList();
  };
  //修改地址按钮
  const handleUpdateAddress = async (row?: CustomerAddressVO) => {
    resetAddress();
    const _id = row?.id || ids.value[0];
    const res = await getCustomerAddress(_id);
    Object.assign(formAddress.value, res.data);
    addressDialog.title = "修改地址";
    addressDialog.visible = true;
  };
  //地址提交
  const submitAddress = () => {
    customerAddressFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
      //客户地址type默认为1
        formAddress.value.type='1';
        formAddress.value.isDefault = formAddress.value.isDefault ? formAddress.value.isDefault : 1;
        buttonLoading.value = true;
        if (formAddress.value.id) {
          await updateCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
        } else {
          formAddress.value.customerId = queryParamsAddress.value.customerId;
          if (customerAddressList.value.length == 0) {
            formAddress.value.isDefault = 2;
          }
          await addCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("修改成功");
        addressDialog.visible = false;
        await getAddressList();
      }
    });
  };
  //设为默认地址
  const changeDeafultAddress = async (row?: CustomerAddressVO) => {
    const data: CustomerAddressForm = {};
    Object.assign(data, row);
    await updateCustomerAddress(data).then(() =>
    proxy?.$modal.msgSuccess("修改成功")
    ).catch((e) =>
      console.log(e)
    ).finally(() => buttonLoading.value = false);
    await getAddressList();
  };
  //配置销售人员按钮
  // const handleUser = async(row?: CustomerVO) => {
  //   await listUserByRoleKey("saler").then(res=>{
  //     salerOptions = res.data;
  //     currentId = row?.id;
  //     console.log(currentId);
  //     customerUserList(currentId).then(response=>{
  //       console.log(response)
  //       const data = response.data;
  //       alreadySaler.value = data.map(item => {
  //         return item.userId;
  //       });
  //       salerDialog.title = row?.customerName + "-分配销售人员";
  //       salerDialog.visible = true;
  //     })
  //   });
  // }

  /**
   * 配置销售人员提交
   */
  // const submitSaler = () => {
  //   console.log(alreadySaler.value);
  //   const list:any = [];
  //   alreadySaler.value.forEach(info=>{
  //     const data = {
  //       "customerId" :currentId,
  //       "userId" : info
  //     }
  //     list.push(data)
  //   })
  //   batchInsertCustomerUser(list).then(res=>{
  //     if(res.code == 200 ){
  //       proxy?.$modal.msgSuccess("修改成功");
  //       cancel();
  //     }
  //   })
  // }

  /** 提交按钮 */
  const submitForm = () => {
    customerFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        let saveData = JSON.parse(JSON.stringify(form.value));
        buttonLoading.value = true;
        let customer = companyList.value.find(item => item.deptId === saveData.companyId);
        if (customer) {
          saveData.companyName = customer.deptName;
        } else {
          saveData.companyName = saveData.companyId;
          saveData.companyId = undefined;
        }
        if (form.value.id) {
          await updateCustomer(saveData).finally(() => buttonLoading.value = false);
        } else {
          await addCustomer(saveData).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("修改成功");
        drawer.visible = false;
        await getList();
      }
    });
  };

  /** 删除按钮操作 */
  const handleDelete = async (row?: CustomerVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm("是否确认删除客户编号为\"" + row?.customerCode + "\"的数据项？").finally(() => loading.value = false);
    await delCustomer(_ids);
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
  };

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('basedata/customer/export', {
      ...queryParams.value, tableName: 'basedataCustomer'
    }, `客户管理_${new Date().getTime()}.xlsx`);
  };

  /** 状态修改 */
  const changeFlag = async (row?: any) => {
    if(row.isDisabled&&row.isDisabled=='1'){
      mainLoading.value = true;
      await disableCustomer(row.id).then(res => {
        getList();
        //操作成功
        proxy?.$modal.msgSuccess("操作成功");
      }).finally(() => mainLoading.value = false);
    }else if(row.isDisabled&&row.isDisabled=='0'){
      mainLoading.value = true;
      await unDisableCustomer(row.id).then(res => {
        getList();
        //操作成功
        proxy?.$modal.msgSuccess("操作成功");
      }).finally(() => mainLoading.value = false);
    }
  }

  const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerCode } });
      customerNameList.value = resCust.map(item=>{ return { value:item.id, label:item.customerName } });
    }
}

  onMounted(() => {
    getListCust();
    getDictOptions().then(res => {
      getList();
    });
  });
</script>

<style>
  .el-form-item--small {
    margin-bottom: 14px;
    /*.el-form-item__error {*/
    /*  z-index: 10;*/
    /*}*/
  }
</style>

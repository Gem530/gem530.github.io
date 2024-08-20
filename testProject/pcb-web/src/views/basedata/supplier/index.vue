<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input v-model="queryParams.supplierCode" size="small"
                  />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="queryParams.supplierName" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="公司负责人" prop="companyManager">
                <el-input v-model="queryParams.companyManager" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="负责人电话" prop="companyManagerPhone">
                <el-input v-model="queryParams.companyManagerPhone" clearable
                  @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="公司电话" prop="companyPhone">
                <el-input v-model="queryParams.companyPhone" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="公司地址" prop="companyAddress">
                <el-input v-model="queryParams.companyAddress" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <el-form-item label="对账时间" prop="reconciliationTime">
                <el-input v-model="queryParams.reconciliationTime" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="纳税人识别号" prop="taxpayerIdentification">
                <el-input v-model="queryParams.taxpayerIdentification" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="新增时间" style="width: 308px;">
                <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
                  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="4" >
              <div style="float: right">
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="default" plain icon="Download" @click="handleExport"
              >导出 </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange"  height="100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="供应商编码 " align="center" prop="supplierCode" />
        <el-table-column label="供应商名称 " align="center" prop="supplierName" min-width="200"/>
        <el-table-column label="物料类别" width="160" align="center" prop="categorys">
          <template #default="scope">
            <el-tag v-for="item in scope.row.categorys">{{ item.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="月结方式 " align="center" prop="monthlyMethod">
          <template #default="scope">
            {{ monthly_method.find(v => v.value == scope.row.monthlyMethod)?.label }}
          </template>
        </el-table-column>
        <el-table-column label="工艺 " align="center" prop="crafts">
          <template #default="scope">
            <el-tag v-for="item in scope.row.crafts">{{ item.craftName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人电话" align="center" prop="companyManagerPhone" />
        <el-table-column label="公司负责人" align="center" prop="companyManager" />
        <el-table-column label="公司电话" align="center" prop="companyPhone" />
        <el-table-column label="公司地址" align="center" prop="companyAddress" />
        <el-table-column label="对账时间 " align="center" prop="reconciliationTime" />
        <el-table-column label="新增时间" align="center" prop="createTime" width="130" />
        <el-table-column label="修改时间" align="center" prop="updateTime" width="130"/>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch @change="changeFlag" v-model="scope.row.status" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
          <template #default="scope">
            <el-button link type="primary"  @click="handleUpdate(scope.row)"
              >修改</el-button>
            <el-button link type="primary"  @click="handleAddress(scope.row)"
              >地址管理</el-button>
            <el-button link type="primary"   @click="handleEdtail(scope.row)"
                       >详情</el-button>
            <el-button link type="primary"  @click="handleDelete(scope.row)" v-show="false"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <XTable toolId="basedataSupplier"
        :pageShow="true"
        :loading="loading"
        :columnList="columnList"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        border :showRefresh="true"
        ref="tableRef"
        height="100%"
        class="xtable-content"
        :row-config="{ isHover: true}"
        :data="supplierList"
        @searchChange="searchChange"
        @checkbox-all="newhandleSelectionChange"
        @checkbox-change="newhandleSelectionChange"
      >
        <template #default-categorys="scope">
          <el-tag v-for="item in scope.row.categorys">{{ item.name }}</el-tag>
        </template>
        <template #default-crafts="scope">
          <el-tag v-for="item in scope.row.crafts">{{ item.craftName }}</el-tag>
        </template>
        <template #default-status="scope">
          <el-switch @change="changeFlag(scope.row)" v-if="scope.row" v-model="scope.row.status" active-value="1" inactive-value="0" />
        </template>
        <template #default-make="scope">
            <el-button link type="primary"  @click="handleUpdate(scope.row)"
              >修改</el-button>
            <el-button link type="primary"  @click="handleAddress(scope.row)"
              >地址管理</el-button>
            <el-button link type="primary"   @click="handleEdtail(scope.row)"
                       >详情</el-button>
                       <!-- 供应商不可删除 -->
            <el-button v-show="false" link type="primary"  @click="handleDelete(scope.row)"
              >删除</el-button>
        </template>
      </XTable>

      <!-- <div style="display: flex;justify-content: flex-end;width: 100%;">
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                    v-model:limit="queryParams.pageSize" @pagination="getList" />
      </div> -->
    </el-card>

    <!-- 添加或修改供应商或详情对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="supplierFormRef" :model="form" :rules="rules" label-width="90px" label-position="right" v-loading="drawerLoading">
        <el-form-item size="small" label="供应商编码" prop="supplierCode">
          <el-input v-model="form.supplierCode" :disabled="dialog.title !== '添加供应商'"/>
        </el-form-item>
        <el-form-item size="small" label="供应商名称" prop="companyId">
          <el-select v-model="form.companyId" :disabled="dialog.title !== '添加供应商'" style="width: 100%"
            @update:modelValue="handleInput"
            filterable allow-create default-first-option>
            <el-option v-for="company in companyList" :key="company.deptId" :label="company.deptName" :value="company.deptId"/>
          </el-select>
        </el-form-item>

        <el-form-item size="small" label="对账时间" prop="reconciliationTime">
          <el-select v-model="form.reconciliationTime" clearable :disabled="detailDisabled" style="width: 100%">
            <el-option v-for="dict in reconciliation_time" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>

        <el-form-item size="small" label="纳税人识别号" prop="taxpayerIdentification">
          <el-input v-model="form.taxpayerIdentification" :disabled="detailDisabled"/>
        </el-form-item>

        <el-form-item size="small" label="物料类别" prop="categoryIds">
          <el-select v-model="form.categoryIds" multiple clearable filterable placeholder=" " :disabled="detailDisabled" style="width: 100%">
            <el-option v-for="dict in categorys" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>

        <el-form-item size="small" label="工艺" prop="craftIds">
          <el-select v-model="form.craftIds" multiple clearable filterable style="width: 100%" placeholder=" " :disabled="detailDisabled">
            <el-option v-for="item in craftListVos" :key="item.id" :label="item.craftName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item size="small" label="公司负责人" prop="companyManager">
          <el-input v-model="form.companyManager" :disabled="detailDisabled"/>
        </el-form-item>

        <el-form-item size="small" label="负责人电话" prop="companyManagerPhone">
          <el-input v-model="form.companyManagerPhone" :disabled="detailDisabled"/>
        </el-form-item>

        <el-form-item size="small" label="公司电话" prop="companyPhone">
          <el-input v-model="form.companyPhone" :disabled="detailDisabled"/>
        </el-form-item>

        <el-form-item size="small" label="公司地址" poro="" prop="companyAddress">
          <el-input v-model="form.companyAddress" :disabled="detailDisabled"/>
        </el-form-item>

        <el-form-item label="月结方式 ">
          <el-select v-model="form.monthlyMethod" clearable style="width: 100%" :disabled="detailDisabled" placeholder=" ">
            <el-option v-for="dict in monthly_method" :key="dict.value" :label="dict.label" :value="dict.label" />
          </el-select>
        </el-form-item>

        <el-form-item size="small" style="flex: 1;" label="是否含税" prop="isTax">
          <el-switch v-model="form.isTax" active-value="1" inactive-value="0" :disabled="detailDisabled"/>
        </el-form-item>

        <el-form-item size="small" label="币种" prop="currency">
          <el-select v-model="form.currency" clearable style="width: 100%" :disabled="detailDisabled">
            <el-option v-for="item in currencyTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="类型" prop="type">
          <el-select v-model="form.type" multiple clearable style="width: 100%" :disabled="detailDisabled">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="文件" >
          <XUpload v-model:model-value="form.files" model="download" ></XUpload>
        </el-form-item>
        <el-form-item size="small" label="需要供应商参与的模块" prop="module">
          <el-select v-model="form.module" multiple clearable style="width: 100%" :disabled="detailDisabled">
            <el-option v-for="item in modules" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer v-if="!detailDisabled">
        <div class="dialog-footer" style="text-align: center" v-if="!drawerLoading">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 查看客户收货地址 -->
    <el-drawer v-model="addressDrawer.visible" :title="addressDrawer.title" size="75%" :direction="addressDrawer.direction">
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

        <el-table v-loading="loading" border :data="customerAddressList" @selection-change="handleSelectionChange">
          <el-table-column label="联系人" align="center" prop="name" width="100" />
          <el-table-column label="联系电话" align="center" prop="phone" width="100" />
          <el-table-column label="联系地址" align="center" prop="address" width="180" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
          <el-table-column label="物流周期(小时)" align="center" prop="logisticsCycle" width="120" />
          <el-table-column label="是否默认" align="center" prop="isDefault">
            <template #default="scope">
              <el-switch @change="changeDeafultAddress(scope.row)" v-model="scope.row.isDefault" :active-value="1"
                         :inactive-value="0" />
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

        <pagination v-show="totalAddress > 0" :total="totalAddress" v-model:page="queryParamsAddress.pageNum"
                    v-model:limit="queryParamsAddress.pageSize" @pagination="getAddressList" />
      </el-card>
    </el-drawer>

    <el-dialog v-model="addressDialog.visible" :title="addressDialog.title" destroy-on-close :close-on-click-modal="false"
               width="350px">
      <el-form label-width="80px" ref="customerAddressFormRef" :model="formAddress" :rules="rulesAddress">
        <el-form-item size="small" label="物流周期" prop="logisticsCycle">
          <el-input-number  size="small" v-model="formAddress.logisticsCycle" :min="1" />
        </el-form-item>
        <el-form-item size="small" label="联系人" prop="name">
          <el-input v-model="formAddress.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系电话" prop="phone">
          <el-input v-model="formAddress.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系地址" prop="address">
          <el-input v-model="formAddress.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button :loading="buttonLoading" @click="cancelAddress">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitAddress">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Supplier" lang="ts">

import { getCraftList } from '@/api/basedata/craft';
import { listRawMaterialCategory } from '@/api/basedata/rawMaterialCategory';
import { listSupplier, getSupplier, delSupplier, addSupplier, updateSupplier, selectCompanyDept,modifyStatus } from '@/api/basedata/supplier';
import { SupplierVO, SupplierQuery, SupplierForm } from '@/api/basedata/supplier/types';
import { listRawMaterial } from '@/api/basedata/rawMaterial';
import { RawMaterialVO, RawMaterialQuery, RawMaterialForm } from '@/api/basedata/rawMaterial/types';
import {
  listCustomerAddress,
  getCustomerAddress,
  addCustomerAddress,
  updateCustomerAddress,
  delCustomerAddress
} from "@/api/basedata/customerAddress";
import { CustomerAddressVO, CustomerAddressForm, CustomerAddressQuery } from "@/api/basedata/customerAddress/types";
import { CraftQuery } from "@/api/basedata/craft/types";
import { CompanyDept } from "@/types/global";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { craft_parameter_type,
  reconciliation_time,
  monthly_method,
  sys_normal_disable,
  currency_type: currencyTypeList,
} = toRefs<any>(proxy?.useDict('craft_parameter_type', 'reconciliation_time', 'monthly_method', 'sys_normal_disable', 'currency_type'));

const tableRef = ref()
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const supplierList = ref<SupplierVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const totalRaw = ref(0);
const queryFormRefRaw = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();
const supplierFormRef = ref<ElFormInstance>();
const types = ref([
  { value: "1", label: "物料供应商" },
  { value: "2", label: "外协加工供应商" },
  { value: "3", label: "订单外协供应商" },
  { value: "4", label: "综合供应商" },
]);

const modules = ref([
  { value: "1", label: "采购合同确认" },
  { value: "2", label: "物料送货" },
  { value: "3", label: "物料退货确认" },
  { value: "4", label: "采购对账" },
]);

const columnList = ref([
  { type: 'checkbox', align: 'center', width: '40' },
  { title: '供应商编码', width: '80', field:'supplierCode',  align: 'center', },
  { title: '供应商名称', width: '80', field: 'supplierName', align: 'center', minWidth: '200' },
  { title: '物料类别', width: '80', field: 'categorys', align: 'center', filterType: 'input' },
  { title: '月结方式', width: '80', field: 'monthlyMethod', align: 'center', filterType: 'input' },
  { title: '工艺', width: '80', field: 'crafts', align: 'center', filterType: 'input'},
  { title: '负责人电话', width: '80', field: 'companyManagerPhone', align: 'center', },
  { title: '公司负责人', width: '80', field: 'companyManager', align: 'center', },
  { title: '公司电话', width: '80', field: 'companyPhone', align: 'center', },
  { title: '公司地址', width: '80', field: 'companyAddress', align: 'center', minWidth: '130' },
  { title: '纳税人识别号', width: '120', field: 'taxpayerIdentification', align: 'center', minWidth: '130' },
  { title: '对账时间',  field: 'reconciliationTime',  width: '160', align: 'center' },
  { title: '新增时间',  field: 'createTime', align: 'center', width:"130" },
  { title: '修改时间',  field: 'updateTime', align: 'center', width:"130" },
  {
    title: '状态', width: '80', field: 'status', align: 'center', showOverflow: false, filterType: 'radioButton',
    filterData: () => [{label: "全部", value: "",}, {label: "启用", value: "1",}, {label: "禁用", value: "0",}],
  },
  { title: '操作',field:'make', width: '260', align: 'center', showOverflow: false },
])

const arr = ref<Array<string | number>>([]);
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const companyList = ref<CompanyDept[]>([]);
const drawerLoading = ref(false);
/**
 * 配置原材料边框
 */
const rawDrawer = reactive<DrawerOption>({
  visible: false,
  title: "",
  direction: "rtl"
});
//地址管理 start
const customerAddressList = ref<CustomerAddressVO[]>([]);
const totalAddress = ref(0);
const customerAddressFormRef = ref<ElFormInstance>();
const initAddressFormData: CustomerAddressForm = {
  name: undefined,
  phone: undefined,
  address: undefined
};
const addressData = reactive<PageDataAddress<CustomerAddressForm, CustomerAddressQuery>>({
  formAddress: { ...initAddressFormData },
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
      { required: true, message: "联系人不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "电话不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "联系地址不能为空", trigger: "blur" }
    ],
    logisticsCycle: [
      { required: true, message: "物流周期不能为空", trigger: "blur" }
    ]
  }
});
const { queryParamsAddress, formAddress, rulesAddress } = toRefs(addressData);
const addressDrawer = reactive<DrawerOption>({
  visible: false,
  title: "",
  direction: "rtl"
});
/** 地址按钮操作 */
const handleAddress = async (row?: SupplierVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  queryParamsAddress.value.supplierId = _id;
  //类型指定为供应商
  queryParamsAddress.value.type = '3';
  getAddressList();
  addressDrawer.title = row?.supplierName + "-收货地址";
  addressDrawer.visible = true;
};
//改变默认地址
const changeDeafultAddress = async (row?: CustomerAddressVO) => {
  const data: CustomerAddressForm = {};
  Object.assign(data, row);
  await updateCustomerAddress(data).then(() =>
    proxy?.$modal.msgSuccess("修改成功")
  ).catch((e) =>
    console.log(e)
  ).finally(() =>
    buttonLoading.value = false
  );
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
//删除地址按钮操作
const handleDeleteAddress = async (row?: CustomerAddressVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm("如果该地址被使用过，删除后会导致无法显示，建议将状态设为禁用! 请确认是否继续删除？").finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delCustomerAddress(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getAddressList();
};
//新增地址按钮操作
const handleAddAddress = () => {
  resetAddress();
  addressDialog.title = "添加供应商地址";
  addressDialog.visible = true;
};
const addressDialog = reactive<DialogOption>({
  visible: false,
  title: ""
});
const cancelAddress = () => {
  resetAddress();
  addressDialog.visible = false;
};
//地址提交
const submitAddress = () => {
  customerAddressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      //供应商地址type为3,此处新增地址默认标志位为否.1否2是
      formAddress.value.type = '3';
      formAddress.value.isDefault = formAddress.value.isDefault ? formAddress.value.isDefault : 1;
      formAddress.value.supplierId = queryParamsAddress.value.supplierId;
      buttonLoading.value = true;
      if (formAddress.value.id) {
        await updateCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
      } else {
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
//查询地址列表
const getAddressList = async () => {
  loading.value = true;
  const res = await listCustomerAddress(queryParamsAddress.value);
  customerAddressList.value = res.rows;
  totalAddress.value = res.total;
  loading.value = false;
};
const resetAddress = () => {
  formAddress.value = { ...initAddressFormData };
  customerAddressFormRef.value?.resetFields();
};

//地址end

const initFormData = {
  id: undefined,
  companyId: undefined,
  reconciliationTime: undefined,
  materialType: undefined,
  craftIds: [],
  companyManager: undefined,
  companyManagerPhone: undefined,
  companyPhone: undefined,
  companyAddress: undefined,
  monthlyMethod: undefined,
  isTax: '1',
  delFlag: undefined,
  categoryIds: [],
  type: [],
  currency: undefined,
  files:[],
  module:['1','3','4'],
}
const data = reactive<PageData<SupplierForm, SupplierQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierName: undefined,
    reconciliationTime: undefined,
    materialType: undefined,
    companyManager: undefined,
    companyManagerPhone: undefined,
    companyPhone: undefined,
    companyAddress: undefined,
    monthlyMethod: undefined,
    isTax: undefined,
    type: undefined,
    currency: undefined,
    materialIds: [],
    typeList: [],
    params: {}
  },
  rules: {
    companyId: [
      { required: true, message: "供应商名称不能为空", trigger: "blur" }
    ],
    reconciliationTime: [
      { required: true, message: "对账时间不能为空", trigger: "change" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "change" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    companyManager: [
      { max:50, message: "电话输入不能超过50个字符", trigger: "change" }
    ],
    companyManagerPhone: [
      { max:50, message: "电话输入不能超过50个字符", trigger: "change" }
    ],
    companyPhone: [
      { max:50, message: "电话输入不能超过50个字符", trigger: "change" }
    ],
    companyAddress: [
      { max:100, message: "公司地址输入不能超过100个字符", trigger: "change" }
    ],
    taxpayerIdentification: [
      { max:50, message: "纳税人识别号输入不能超过50个字符", trigger: "change" }
    ],
  }
});
const { queryParams, form, rules } = toRefs(data);
/**
 * 定义供应商界面原材料查询
 */
const initFormDataRaw: RawMaterialForm = {
  id: undefined,
  categoryId: undefined,
  name: undefined,
  units: undefined,
  unitName: undefined,
  supplier: undefined,
  remark: undefined,
}
const detailDisabled = ref(false)
const dataRaw = reactive<PageData<RawMaterialForm, RawMaterialQuery>>({
  formRaw: { ...initFormDataRaw },
  queryParamsRaw: {
    pageNum: 1,
    pageSize: 20,
    categoryId: undefined,
    name: undefined,
    units: undefined,
    supplier: undefined,
    unitName: undefined,
    remark: undefined,
  },
  rulesRaw: {
  },
});

const categorys = ref([]);

const { queryParamsRaw, formRaw, rulesRaw } = toRefs(dataRaw);
/** 状态修改 */
const changeFlag = async (row?: SupplierVO) => {
  // const data: SupplierForm = {};
  // Object.assign(data, row);
  await modifyStatus({id:row.id}).then(res => {
    buttonLoading.value = false
    getList();
  })
}

/** 工艺列表 */
let craftListVos = ref([]);
const getCraftLists = async () => {
  let queryParams:CraftQuery = {
    isOpen: "1"
  }
  await getCraftList(queryParams)
    .then(res => {
      craftListVos.value = res.data;
    });
}


const getCategoryList = async () => {
  await listRawMaterialCategory()
    .then(res => {
      categorys.value = res.rows.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
    });
}

/** 查询供应商列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSupplier(proxy?.addDateRange(queryParams.value, dateRange.value));
  supplierList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

const searchChange = (params: any) => {
  queryParams.value = params;
  getList()
}
const rawList = ref<RawMaterialVO[]>([]);
/**
 * 查询物料列表
 */
const getRawtList = async () => {
  loading.value = true;
  const res = await listRawMaterial(queryParamsRaw.value);
  rawList.value = res.rows;
  totalRaw.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  buttonLoading.value = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  supplierFormRef.value?.resetFields();
  companyList.value = [];
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 查看原材料内搜索按钮操作 */
const handleQueryRaw = () => {
  queryParamsRaw.value.pageNum = 1;
  queryParams.value.taxpayerIdentification =undefined;
  getRawtList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', '']
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** xtable 多选框选中数据（供应商） */
const newhandleSelectionChange = () => {
  const $table = tableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords();

    ids.value = records.map((item: any) => item.id);
    single.value = records.length != 1;
    multiple.value = !records.length;
  }
}

/** 多选框选中数据（供应商） */
const handleSelectionChange = (selection: SupplierVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 多选框选中数据 (原材料)*/
const handleRawSelectionChange = (selection: RawMaterialVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  dialog.visible = true;
  drawerLoading.value = true;
  dialog.title = "添加供应商";
  detailDisabled.value = false;

  const res = await selectCompanyDept();

  companyList.value = res.data;
  drawerLoading.value = false;
}

/** 修改按钮操作   arr = res.data.materialType.split(','); */
const handleUpdate = async (row?: SupplierVO) => {
  reset();
  dialog.visible = true;
  drawerLoading.value = true;
  const _id = row?.id || ids.value[0]
  await getSupplier(_id)
    .then(e => {e
      companyList.value = [{deptId: e.data.companyId, deptName: e.data.companyName}]
      Object.assign(form.value, e.data);
    })
    .finally(e => {
      dialog.title = "修改供应商";
      drawerLoading.value = false;
      detailDisabled.value = false
    });
}

/** 查看详情按钮操作 */
const handleEdtail = async (row?: SupplierVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  await getSupplier(_id)
    .then(e => {
      companyList.value = [{deptId: e.data.companyId, deptName: e.data.companyName}]
      Object.assign(form.value, e.data);
      form.value.typeList = JSON.parse(JSON.parse(e.data.type));
    })
    .finally(e => {
      dialog.visible = true;
      dialog.title = "查看详情";
      detailDisabled.value = true
    });
}
/** 查看原材料按钮操作(原材料) */
/*const handleAuthEquipment = async (row?: SupplierVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  queryParamsRaw.value.categoryId = _id;
  const res = await listRawMaterial();
  Object.assign(rawList.value, res.rows);
  rawDrawer.visible = true;
  rawDrawer.title = rawList.rows.units + "原材料详情";
}*/

/** 提交按钮 (供应商)*/
const submitForm = () => {
  supplierFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let saveData = JSON.parse(JSON.stringify(form.value));
      let supplier = companyList.value.find(item => item.deptId === saveData.companyId);
      if (supplier) {
        saveData.companyName = supplier.deptName;
      } else {
        saveData.companyName = saveData.companyId;
        saveData.companyId = undefined;
      }
      let msg;
      saveData.crafts = undefined;
      saveData.categorys = undefined;
      buttonLoading.value = true;
      if (form.value.id) {
        msg = "修改成功"
        await updateSupplier(saveData).finally(() => buttonLoading.value = false);
      } else {
        await addSupplier(saveData).finally(() => buttonLoading.value = false);
        msg = "新增成功"
      }
      proxy?.$modal.msgSuccess(msg);
      dialog.visible = false;
      buttonLoading.value = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SupplierVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除供应商编号为"' + row?.supplierCode + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delSupplier(_ids).then(e => {
    proxy?.$modal.msgSuccess("删除成功");
  }).finally(() => proxy?.$modal.closeLoading());
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/supplier/export', {
    ...queryParams.value
  }, `supplier_${new Date().getTime()}.xlsx`)
}

const handleInput = (value: string) => {
      if (value.length > 50) {  // 如果长度超过10
        form.value.companyId = value.slice(0, 50);  // 截取前10个字符
      }
};

onMounted(() => {
  getList();
  getCraftLists();
  getCategoryList();
});
</script>

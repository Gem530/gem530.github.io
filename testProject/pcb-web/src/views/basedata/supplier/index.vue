<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8 global-flex flex-end">
          <el-col :span="1.5"> -->
          <div class="head-btn-flex">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增
            </el-button>
          <!-- </el-col>
          <el-col :span="1.5"> -->
            <el-button type="default" plain icon="Download" @click="handleExport"
              >导出 </el-button>
          </div>
          <!-- </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template> -->

      <XTable toolId="basedataSupplier"
        :pageShow="true"
        :loading="loading"
        :intervalCondition="intervalCondition"
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
        <template #default-accountDay="scope">
          {{ scope.row.accountDay?('每月'+scope.row.accountDay+'日'):'' }}
        </template>
        <template #default-categoryNames="scope">
          <el-tag v-for="item in scope.row.categoryNames">{{ item }}</el-tag>
        </template>
        <template #default-craftNames="scope">
          <el-tag v-for="item in scope.row.craftNames">{{ item }}</el-tag>
        </template>
        <template #default-status="scope">
          <el-switch @change="changeFlag(scope.row)" v-if="scope.row" v-model="scope.row.status" active-value="1" inactive-value="0" />
        </template>
        <template #default-type="scope">
          <el-tag v-for="item in scope.row.type">{{ SupplierTypeEnum.find(supplier => supplier.value == item)?.label}}</el-tag>
        </template>
        <template #default-module="scope">
          <el-tag v-for="item in scope.row.module">{{ SupplierModuleEnum.find(supplier => supplier.value == item)?.label}}</el-tag>
        </template>
        <template #default-make="scope">
          <el-button link type="primary"   @click="handleEdtail(scope.row)"
                       >详情</el-button>
                       <!-- 供应商不可删除 -->
            <el-button link type="primary"  @click="handleUpdate(scope.row)"
              >编辑</el-button>
            <el-button link type="primary"  @click="handleAddress(scope.row)"
              >地址管理</el-button>

            <el-button v-show="false" link type="primary"  @click="handleDelete(scope.row)"
              >删除</el-button>
        </template>
      </XTable>

    <!-- </el-card> -->

    <!-- 添加或修改供应商或详情对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="65%">
      <el-form ref="supplierFormRef" :model="form" :rules="rules" label-width="150px" label-position="right" v-loading="drawerLoading">

        <el-collapse v-model="activeNames" >
          <el-collapse-item title="基本信息" name="1">
            <el-row>
              <el-col :span="12">
                <el-form-item size="small" label="供应商编码" prop="supplierCode">
                  <el-input v-model="form.supplierCode"  maxLength="50" :disabled="dialog.title !== '新增供应商'"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item size="small" label="供应商名称" prop="companyId">
                  <el-select v-model="form.companyId" :disabled="dialog.title !== '新增供应商'" style="width: 100%"
                    @update:modelValue="handleInput"
                    filterable allow-create default-first-option>
                    <el-option v-for="company in companyList" :key="company.deptId" :label="company.deptName" :value="company.deptId"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item size="small" label="出账日" prop="accountDay">
                  <template #label>
                    <span><el-tooltip placement="top" v-if="dialog.title?.includes('新增')">
                          <template #content>到达出账日后，系统会自动生成上个账单周期的对账单</template>
                          <el-icon> <question-filled/> </el-icon>
                    </el-tooltip>出账日</span>
                  </template>
                  <el-select v-model="form.accountDay" clearable :disabled="detailDisabled" style="width: 100%"  @change="changeAccountDay">
                    <el-option v-for="dict in dayList" :key="dict.value" :label="dict.label" :value="dict.value"  />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item size="small" label="账单周期" prop="accountPeriod">
                  <el-input v-model="form.accountPeriod" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item size="small" label="结算方式" prop="monthlyMethod">
                  <el-select v-model="form.monthlyMethod" clearable style="width: 100%" :disabled="detailDisabled" placeholder=" ">
                    <el-option v-for="dict in monthly_method" :key="dict.value" :label="dict.label" :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item size="small" label="纳税人识别号" prop="taxpayerIdentification">
                  <el-input v-model="form.taxpayerIdentification"  maxLength="50" :disabled="detailDisabled"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item size="small" style="flex: 1;" label="是否含税" prop="isTax">
                  <el-switch v-model="form.isTax" active-value="1" inactive-value="0" :disabled="detailDisabled"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item size="small" label="币种" prop="currency">
                  <el-select v-model="form.currency" clearable style="width: 100%" :disabled="detailDisabled">
                    <el-option v-for="item in currencyTypeList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item size="small" style="flex: 1;" label="公司负责人" >
                  <el-input v-model="form.companyManager" :disabled="detailDisabled" maxLength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item size="small" label="负责人电话" >
                  <el-input v-model="form.companyManagerPhone" :disabled="detailDisabled"  maxLength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item size="small" style="flex: 1;" label="公司电话" >
                  <el-input v-model="form.companyPhone" :disabled="detailDisabled" maxLength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item size="small" label="公司地址" >
                  <el-input v-model="form.companyAddress" :disabled="detailDisabled"  maxLength="150"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item size="small" label="可供物料类别" prop="categoryIds">
                  <el-select v-model="form.categoryIds" multiple clearable filterable placeholder=" " :disabled="detailDisabled" style="width: 100%">
                    <el-option v-for="dict in categorys" :key="dict.id" :label="dict.name" :value="dict.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item size="small" label="可做工序" prop="craftIds">
                    <el-select v-model="form.craftIds" multiple clearable filterable style="width: 100%" placeholder=" " :disabled="detailDisabled">
                      <el-option v-for="item in craftListVos" :key="item.id" :label="item.craftName" :value="item.id" />
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item size="small" label="供应商类型" prop="type">
                  <el-select v-model="form.type" multiple clearable style="width: 100%" :disabled="detailDisabled">
                    <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item size="small" label="开启协同模块" prop="module">
                  <el-select v-model="form.module" multiple clearable style="width: 100%" :disabled="detailDisabled">
                    <el-option v-for="item in modules" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>
          <el-collapse-item title="文件信息" name="2" style="text-align: end;">
              <XUpload v-model:model-value="form.files"  model="download" v-if="!detailDisabled" style="text-align: end;"
                :multiple="true" :show-file-list="false" @fileChange="fileChange"  v-loading="dialogTableLoading">
                <div class="global-flex">
                  <span style="color: #b6b6b6;margin-right: 5px;">支持批量上传，格式不限</span><el-button type="primary">上传文件</el-button>
                </div>
              </XUpload>

                <div style="margin-bottom: 8px;"></div>
                <XTable :showHead="false" :pageShow="false" class="xtable-content" :loading="eqloading" :data="form.files?form.files:[]"
                        :show-footer="false" :columnList="eqfileColumnList" ref="fileleteTableRef6" border
                        :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                        >
                  <template #default-fileName="scope">
                    {{ scope.row.name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      :width="100"
                      :height="100"
                      :src="scope.row.url"
                      :type="scope.row.type"
                      :preview-src-list="[scope.row.url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
                    <el-button class="marginAndPadding"  v-if="!dialog.title?.includes('详情')" size="small" type="primary" :text="true" @click="delFile(scope.row.id)">删除</el-button>
                  </template>
                </XTable>
          </el-collapse-item>
          <el-collapse-item v-if="!dialog.title?.includes('新增')" title="地址信息" name="3">
            <el-row  style="width:100%;display: flex;justify-content: end;margin-bottom: 8px;">
                <el-button  v-if="!dialog.title?.includes('详情')"  type="primary" size="small" @click="handleAddAddressUpdate" >新增地址 </el-button>
            </el-row>
              <XTable :showHead="false" :pageShow="false" class="xtable-content"  :data="customerAddressList"
                      :show-footer="false" :columnList="addressColumnList" ref="addressTableRef" border
                      :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                      >

                    <template #default-isDefault="scope">
                        <el-switch :disabled="dialog.title?.includes('详情')" @change="changeDeafultAddress(scope.row)" v-model="scope.row.isDefault" :active-value="1" :inactive-value="0" />
                    </template>

                    <template #default-status="scope">
                        <el-switch :disabled="dialog.title?.includes('详情')" @change="changeDeafultAddress(scope.row)" v-model="scope.row.status" active-value="1" inactive-value="0" />
                    </template>
              </XTable>

          </el-collapse-item>
        </el-collapse>
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
      <!-- <el-card shadow="never">
        <template #header> -->
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAddAddress"
                         >新增
              </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getAddressList"></right-toolbar>
          </el-row>
        <!-- </template> -->

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
      <!-- </el-card> -->
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
import {RawMaterialVO, RawMaterialQuery, RawMaterialForm, StatusEnum} from '@/api/basedata/rawMaterial/types';
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
import {ref} from "vue";
import {deepClone} from "@/utils";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { craft_parameter_type,
  reconciliation_time,
  monthly_method,
  sys_normal_disable,
  currency_type: currencyTypeList,
} = toRefs<any>(proxy?.useDict('craft_parameter_type', 'reconciliation_time', 'monthly_method', 'sys_normal_disable', 'currency_type'));

const dayList=ref([]);

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
const mainTableToolId = ref('basedataSupplier');
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


import useUserStore from "@/store/modules/user";
import {ElMessage} from "element-plus";
import {addFile,addBatchFile, deleteFile, getFileListAndOssUrl} from "@/api/upload";
import fileSaver from "file-saver";
import {downloadUrl} from '@/api/upload/index';
const activeNames = ref(['1','2','3']);
const fileList = ref<any[]>([]);
const dialogTableLoading = ref(false);
const eqloading = ref(false);
const eqfilesDataObj = ref<any>([]);
const eqfileTab = ref('产品文件');
const eqfileColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '文件名称', field: 'name', align: 'center'},
  {title: '缩略图', field: 'src', align: 'center', showOverflow: false},
  {title: '文件大小', width: '80', field: 'size', align: 'center'},
  {title: '上传人', width: '80', field: 'createByName', align: 'center'},
  {title: '上传时间', width: '140', field: 'createTime', align: 'center'},
  {title: '操作', width: '100', field: 'make', align: 'center'},
]);

const addressColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '联系人', width: '120', field: 'name', align: 'center'},
  {title: '联系电话',  width: '160',field: 'phone', align: 'center', showOverflow: false},
  {title: '联系地址',  field: 'address', align: 'center'},
  {title: '物流周期', width: '80', field: 'logisticsCycle', align: 'center'},
  {title: '是否默认', width: '140', field: 'isDefault', align: 'center'},
  {title: '状态', width: '100', field: 'status', align: 'center'},
]);

const columnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', width: '40' },
  { title: '供应商编码', width: '100', field:'supplierCode', fixed: 'left', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' } },
  { title: '供应商名称', minWidth: '200' , field: 'supplierName', fixed: 'left', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入供应商名称' }},
  // { title: '物料类别', width: '80', field: 'categorys', align: 'center', filterType: 'input' , filterParam: { placeholder: '请输入物料类别' }},
  { title: '可供物料类别', width: '80', field: 'categoryNames', align: 'center', filterType: 'input' , filterParam: { placeholder: '请输入物料类别' }},
  { title: '月结方式', width: '80', field: 'monthlyMethod', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入月结方式' } },
  // { title: '工艺', width: '80', field: 'crafts', align: 'center', filterType: 'input'},
  { title: '工序', width: '80', field: 'craftNames', align: 'center', filterType: 'input'},
  { title: '公司负责人', width: '80', field: 'companyManager', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入公司负责人' }},
  { title: '负责人电话', width: '80', field: 'companyManagerPhone', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入负责人电话' }},
  { title: '收货地址', width: '80', field: 'companyAddress', align: 'center', minWidth: '130' ,filterType: 'input', filterParam: { placeholder: '请输入公司地址' }},
  { title: '纳税人识别号', width: '120', field: 'taxpayerIdentification', align: 'center', minWidth: '130' ,filterType: 'input', filterParam: { placeholder: '请输入纳税人识别号' }},
  { title: '出账日',  field: 'accountDay',  width: '160', align: 'center' },
  { title: '账单周期',  field: 'accountPeriod',  width: '160', align: 'center' },
  { title: '状态', width: '80', fixed: 'right', field: 'status', align: 'center', showOverflow: false, filterType: 'radioButton',
    filterData: () => [{label: "全部", value: "",}, {label: "启用", value: "1",}, {label: "禁用", value: "0",}],
  },
  {
    title: '创建时间', width: "120", field: 'createTime', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  { title: '最后修改时间',  field: 'updateTime', align: 'center', width:"130" },
  { title: '操作',field:'make', width: '260', fixed: 'right', align: 'center', showOverflow: false },
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


  const handleAddAddressUpdate = () => {
      queryParamsAddress.value.supplierId = form.value.id;
      //类型指定为供应商
      queryParamsAddress.value.type = '3';
      handleAddAddress();
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
  module:['1'],
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
    accountDay: [
      { required: true, message: "出账日不能为空", trigger: "change" }
    ],
    monthlyMethod: [
      { required: true, message: "结算方式不能为空", trigger: "change" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "change" }
    ],
    supplierCode: [
      { required: true, message: "供应商编码不能为空", trigger: "change" }
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

const intervalCondition = ['createTime'];

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
  //type转为数组
  queryParams.value.type = queryParams.value.type ? [queryParams.value.type] : undefined
  //module转为数组
  queryParams.value.module = queryParams.value.module ? [queryParams.value.module] : undefined
  console.log("入参：",queryParams.value.type)
  const res = await listSupplier(proxy?.addDateRange(queryParams.value, dateRange.value));
  supplierList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

const searchChange = (params: any) => {
  queryParams.value = params;
  queryParams.value.categorys = queryParams.value.categoryNames
  queryParams.value.crafts = queryParams.value.craftNames
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
  dialog.title = "新增供应商";
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

    //类型指定为供应商
    getSuppllerAddressList();
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

    getSuppllerAddressList();
}

/** 查看详情按钮操作 */
const getSuppllerAddressList = async (row?: SupplierVO) => {
  if(!form.value.id){
    return
  }
  //类型指定为供应商
  queryParamsAddress.value.supplierId = form.value.id;
  queryParamsAddress.value.type = '3';
  getAddressList();

  let query = {
      bizId: form.value.id,
      moduleCode: "6",//基础信息
      bizType: "11",//供应商基础信息
  }
  const filesQuery =await getFileListAndOssUrl(query);
  form.value.files = filesQuery.data;

}
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
        saveData.files.forEach(item=>{
          item.id=undefined;
        });
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
    ...queryParams.value, tableName: mainTableToolId.value
  }, `供应商数据_${new Date().getTime()}.xlsx`)
}

const handleInput = (value: string) => {
      if (value.length > 50) {  // 如果长度超过10
        form.value.companyId = value.slice(0, 50);  // 截取前10个字符
      }
};

/** 供应商类型美剧 **/
const SupplierTypeEnum = ref([
  { label: '物料供应商', value: '1' },
  { label: '外协加工供应商', value: '2' },
  { label: '订单外协供应商', value: '3' },
  { label: '综合供应商', value: '4' }
])

/** 供应商协同模块 **/
const SupplierModuleEnum = [
  { label: '采购合同确认', value: '1' },
  { label: '物料送货', value: '2' },
  { label: '物料退货确认', value: '3' },
  { label: '采购对账', value: '4' }
]

const fileChange2 = async (value: any) => {
  console.log("=============",value)
    if(!form.value.id){
      return;
    }
    eqloading.value = true;
    
    let query = {
      bizId: form.value.id,
      moduleCode: "6",//基础信息
      bizType: "11",//供应商基础信息
    }
    if(!form.value.id){
      query.bizId = undefined;
      query.bizCode = form.value.supplierCode
    }
    const filesQuery =await getFileListAndOssUrl(query);
    form.value.files = filesQuery.data;
    eqloading.value = false;
  }

  // 防抖函数的定义
 let timeout:any;
 function debounce(fn, delay) {
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn();
      }, delay);
    };
  }

  const fileChange = async (_value:any) => {
    console.log("_value",_value);

    let allFileList = deepClone((form.value.files || []));
    let addFileList = deepClone((form.value.files || []));
    addFileList = addFileList.filter(item=>item.id.includes('row_'));

    console.log("addFileList",addFileList);
    if(!addFileList||addFileList.length==0){
      console.log("文件已经上传完成，重复调用无需处理")
      return;
    }
    let dataList=[];
    for(let fileCount=0;fileCount<addFileList.length; fileCount++){
      let fileObj = addFileList[fileCount];
      let data = {
        moduleCode: "6",
        bizType: "11",
        type: fileObj.type,
        size: fileObj.size,
        name: fileObj.name,
        key: fileObj.key,
        bizId: 0,
        bizCode: undefined
      }
      if(form.value.id){
        data.bizId = form.value.id
      }else{
        data.bizCode = form.value.supplierCode;
      }
      //await addFile(data);
      dataList.push(data);
    }

    const debouncedFunction = debounce(async ()=>{
      const res = await addBatchFile(dataList)
      if (res.code == 200) {
        let query = {
          bizId: form.value.id,
          moduleCode: "6",//基础信息
          bizType: "11",//供应商基础信息
        }
        if(!form.value.id){
          query.bizId = undefined;
          query.bizCode = form.value.supplierCode
          form.value.files = allFileList;
        }else{
          const filesQuery =await getFileListAndOssUrl(query);
          form.value.files = filesQuery.data;
        }
      }
    },200)
    debouncedFunction();
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

  const delFile = async(_ids: any) => {
    await proxy?.$modal.confirm('是否删除文件？').finally(() => loading.value = false);
    eqloading.value = true;
    await deleteFile(_ids);
    form.value.files = [];
    let query = {
      bizId: form.value.id,
      moduleCode: "6",//基础信息
      bizType: "11",//供应商基础信息
    }
    const filesQuery =await getFileListAndOssUrl(query);
    form.value.files = filesQuery.data;
    eqloading.value = false;
  }

  const accountDayList = () =>{
    dayList.value=[];
    for(let i=1;i<29;i++){
      let obj={label:'每月'+i+'日',value:i+""};
      dayList.value.push(obj);
    }
  }

  const changeAccountDay = (params:any) => {
    if(!params){
      form.value.accountPeriod = '';
    }else{
      let endNub=Number(params)-1;
      if(endNub==0){
        form.value.accountPeriod = '上月'+params+'日-上月底';
      }else{
        form.value.accountPeriod = '上月'+params+'日-本月'+endNub+'日';
      }
    }
  }

onMounted(() => {
  getList();
  getCraftLists();
  getCategoryList();
  accountDayList();
});
</script>

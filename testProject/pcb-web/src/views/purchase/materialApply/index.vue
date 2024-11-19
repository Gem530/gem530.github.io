<template>
  <div class="p-2 xtable-page">
      <el-form>
        <el-form-item>
          <div class="global-flex flex-end width-100">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"> 新增 </el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="按订单展示" :name="1">
          <XTable
            height="100%"
            class="xtable-content"
            toolId="purchaseMaterialApply"
            v-loading="loading"
            :pageShow="true"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="materialApplyList"
            :columnList="columnList"
            ref="borrowTableRef"
            @checkbox-all="handleSelectionChange"
            @checkbox-change="handleSelectionChange"
            :intervalCondition="['applyTime']"
            border
            :showRefresh="true"
            @searchChange="searchChange"
            @toggle-row-expand="toggleExpandChangeEvent"
          >
            <template #content-expand="{ row }">
              <XTable
                :pageShow="false"
                v-loading="!row.loading"
                size="small"
                :data="row.inventoryList"
                :border="true"
                :columnList="materialColumnList"
                border
              >
                <template #default-categoryId="scope">
                  <div>{{ scope.row.categoryName }}</div>
                </template>
                <template #default-deliverTime="scope">
                  <span>{{ parseTime(scope.row.deliverTime, '{y}-{m}-{d}') }}</span>
                </template>
                <template #default-remark="scope">
                  <div>{{ row.remark }}</div>
                </template>
              </XTable>
            </template>

            <template #default-make="scope">
              <el-button v-show="scope.row.status=='1'" link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
              <el-button v-show="scope.row.status=='1'" link type="primary" @click="handleApply(scope.row)">提交</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="按物料展示" :name="2">
          <XTable
            height="100%"
            class="xtable-content"
            toolId="purchaseMaterialApply"
            v-loading="loadingByMaterial"
            :pageShow="true"
            v-model:page-size="byMaterialParams.pageSize"
            v-model:current-page="byMaterialParams.pageNum"
            :page-params="{ perfect: true, total: byMaterialTotal }"
            :data="listByMaterial"
            :columnList="listByMaterialColumnList"
            :intervalCondition="['applyTime','deliverTime']"
            border
            :showRefresh="true"
            @searchChange="searchChangeByMaterial"
          >
          <template #default-deliverTime="scope">
            <span>{{ parseTime(scope.row.deliverTime, '{y}-{m}-{d}') }}</span>
          </template>
            <template #default-status="scope">
              <!-- statusList -->
              <dict-tag :options="statusList" :value="scope.row.status" />
            </template>
            <template #default-make="scope">
              <el-button v-show="scope.row.status=='1'" link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-show="scope.row.status=='1'" link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
              <el-button v-show="scope.row.status=='1'" link type="primary" @click="handleApply(scope.row)">提交</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="80%">
      <div class="ptable-card">
        <el-form
          :model="form"
          label-width="80px"
          ref="materialApplyFormRef"
          :rules="rules"
          :disabled="dialog.title === '物料申请详情'"
          v-loading="dialogTableLoading"
          style="width: 100%;"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="收货地址" prop="addressId">
                <el-select style="width:100%;" v-model="form.addressId" placeholder=" " filterable>
                  <el-option
                    v-for="item in customerAddressList"
                    :key="item.id"
                    :label="`${item.status==0?'(已禁用)-':''}${item.address}`"
                    :disabled="item.status==0"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--          <el-col :span="10">-->
            <!--            <el-form-item label="备注" prop="remark">-->
            <!--              <el-input :rows="1" type="textarea" v-model="form.remark" autocomplete="off" />-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->
          </el-row>
        </el-form>

        <el-row :gutter="10" class="mb8" style="display: flex;justify-content: space-between;">
          <el-col :span="1.5">
            <el-button v-show="dialog.title != '物料申请详情'" type="primary" plain @click="selectMaterial">选择物料</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-show="dialog.title != '物料申请详情'" plain @click="handlempty()">清空 </el-button>
          </el-col>
          <el-col :span="18"></el-col>
          <el-col :span="1.5">
              <el-button v-show="dialog.title != '物料申请详情'" type="primary" plain @click="changeDeliveryTimeAllOpen">批量设置交期</el-button>
          </el-col>
        </el-row>

        <XTable
          :pageShow="false"
          ref="confirmTable"
          :data="confirmSelectInventoryList"
          border
          :columnList="confirmSelectInventoryColumnList"
          class="ptable-content"
          toolId="materialApplyDrawerTable"
          height="100%"
        >
          <template #default-deliverTime="scope">
            <el-date-picker
              :disabled="dialog.title === '物料申请详情'"
              style="width: 100%;"
              v-model="scope.row.deliverTime"
              type="date"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD 23:59:59"
              format="YYYY-MM-DD"
              clearable
            />
          </template>
          <template #default-quantity="scope">
            <el-input-number
              :disabled="dialog.title === '物料申请详情'"
              style="width: 99%;"
              :step="0.1"
              :controls="false"
              :precision="2"
              v-model="scope.row.quantity"
            />
          </template>
          <template #default-applyRemark="scope">
            <el-input
              :disabled="dialog.title === '物料申请详情'"
              :rows="1"
              :max="200"
              type="textarea"
              v-model="scope.row.applyRemark"
              autocomplete="off"
            />
          </template>
          <template #default-make="scope">
            <el-button v-if="dialog.title != '物料申请详情'" link type="primary" @click="handleSelectDelete(scope.row)">删除</el-button>
          </template>
        </XTable>
      </div>

      <template #footer>
        <el-button v-if="dialog.title != '物料申请详情'" :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button :loading="buttonLoading" @click="dialog.visible = false">取消</el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogMaterial.visible" title="选择物料" width="80%" draggable destroy-on-close>
      <el-row>
        <el-col :span="5">
          <XTable :pageShow="false" :columnList="columnListChooseMaterial" size="small" :data="selectInventoryList" height="440" :border="true">
            <!-- <el-table-column property="code" fixed />
            <el-table-column v-show="false" property="name" label="已选物资" /> -->
            <!-- <el-table-column align="center"> -->
              <template #default-make="scope">
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="CloseBold" @click="handleInventoryListDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            <!-- </el-table-column> -->
          </XTable>
        </el-col>
        <el-col :span="19">
          <XTable
            v-loading="materialLoading"
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
            :row-style="setRowStyle"
          >
            <template #header-tool>
              <ColorRule :list="[{ title: '库存告警', color: '#ECB0B1' }]"></ColorRule>
            </template>
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
        <el-button :loading="buttonLoading" type="primary" @click="submitInventoryForm">确 定</el-button>
        <el-button @click="clearInventoryForm">取消</el-button>
      </template>
    </el-dialog>

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
                :clearable="false"
              />
          </el-form-item>
          <template #footer>
            <el-button type="primary" @click="changeDeliveryTimeConfirm" :disabled="!batchDeliveryTime"> 确定 </el-button>
            <el-button @click="dialogChangeDeliveryTimeAll.visible = false">取消</el-button>
          </template>
        </el-dialog>
  </div>
</template>

<script setup name="MaterialApply" lang="ts">
  import { listMaterialApply, getMaterialApply, delMaterialApply, addMaterialApply, updateMaterialApply, listMaterialInventoryInfo, modifyStatus,listApplyByMaterial } from '@/api/purchase/materialApply';
  import { MaterialApplyVO, MaterialApplyQuery, MaterialApplyForm ,RawMaterialVO,RawMaterialQuery } from '@/api/purchase/materialApply/types';
  import { ElTable } from 'element-plus';
  import { VxeTableEvents } from 'vxe-table'
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  import { listRawMaterialCategoryNoPage } from '@/api/basedata/rawMaterialCategory';
  import { listCustomerAddressByOwnerId } from '@/api/basedata/customerAddress';
  import { CustomerAddressQuery, CustomerAddressVO } from '@/api/basedata/customerAddress/types';
  import { it } from 'node:test';
  const dialogMaterial = reactive<DialogOption>({
    visible: false,
    title: ''
  });
  const statusList = ref([
    { label: '待提交', value: "1" },
    { label: '已提交', value: "2" },

  ]);
  // 新增属性
  const editableTabsValue = ref(1);
  const materialApplyList = ref<MaterialApplyVO[]>([]);
  /**
   * 按物料展示的申请明细集合
   */
  const listByMaterial = ref<any[]>([]);

  //物料池展示的物料
  const materialInventoryList = ref<RawMaterialVO[]>([]);
  //选中的物料
  const selectInventoryList = ref<RawMaterialVO[]>([]);
  //确认选中的物料
  const confirmSelectInventoryList = ref<RawMaterialVO[]>([]);
  //确认选中的物料-备份
  const confirmSelectInventoryCopyList = ref<RawMaterialVO[]>([]);

  const buttonLoading = ref(false);
  const loading = ref(true);
  const loadingByMaterial = ref(true);

  const materialLoading = ref(false);

  const ids = ref<Array<string | number>>([]);

  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const byMaterialTotal = ref(0);
  const selectTotal = ref(0);

  const materialApplyFormRef = ref<ElFormInstance>();
  const inventoryTableRef =  ref()
  const confirmTable =  ref()

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const initFormData: MaterialApplyForm = {
    id: undefined,
    code: undefined,
    applyType: undefined,
    deliverTime: undefined,
    addressId: undefined,
    applyUserId: undefined,
    applyTime: undefined,
    remark: undefined,
    materialApplyDetailsList: []
  }
  const SelectData = reactive<PageData<MaterialApplyForm, RawMaterialQuery>>({
    form: { ...initFormData },
    queryParams: {
      id: undefined,
      pageNum: 1,
      pageSize: 20,
      categoryId: undefined,
      categoryIds: undefined,
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
      fileId: undefined,
      boardThickness: undefined,
      params: {},
      actualStock:undefined,
      availableStock:undefined,
      onWayStock:undefined,
      applyNum:undefined
    },
    rules: {
      addressId: [
        { required: true, message: "收货地址不能为空", trigger: "blur" }
      ],


    }
  });
  const { form:selectForm,  queryParams:selectQueryParams,  rules:selectRules } = toRefs(SelectData);

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

  const byMaterialParams = ref<MaterialApplyQuery>({
    pageNum: 1,
    pageSize: 20,

  });



  const customerAddressList = ref<CustomerAddressVO[]>([]);


  /**
   * 查询tab页
   */
  const getVoidedList = async () => {
    if (1 == editableTabsValue.value) {
      getList();
    } else {
      getListByMaterial();
    }
  }

  /** 时间禁选*/
  const disabledDate = (date:any) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;

  }

  /** 查询地址列表 */
  const getCustomerAddressList = async () => {

    const res = await listCustomerAddressByOwnerId();
    customerAddressList.value = res.data;

  }

  /**
   * 物料类别下拉列表
   */
  const rawMaterialCategory = ref([]);

  const getListRawMaterialCategorys = async () => {
    const res: any = await listRawMaterialCategoryNoPage();

    rawMaterialCategory.value = res;
  }
  const columnListChooseMaterial = ref([
  { field: 'code',align: 'center',  },
  { title: '已选物资',field: 'name',align: 'center',  },
  { field: 'make',align: 'center',  },
  ]);
  const columnList = ref([
    {title:'序号', align: 'center',type:'seq',width:'50' },
    { field:'expand',  align: 'center',type:"expand" ,width:'30' },
    { title: '申请单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入申请单号' } },
    { title: '申请类型', field: 'type', align: 'center' },
    { title: '收货地址', field: 'addressName', align: 'center' ,width:'350' },
    { title: '申请人', field: 'applyUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入申请人' } },
    { title: '申请时间', field: 'applyTime', align: 'center', filterType: 'intervalDate',  filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
      }
    },
    { title: '备注', field: 'remark', align: 'center' },
    { title: '操作',field:'make', width: '200', align: 'center', showOverflow:false },
  ]);
  //物料列
  const materialColumnList = ref([
    { title: '序号',type: 'seq', width: '55', align: 'center'},

    { title: '物料编码', field: 'code', align: 'center',width: '80', },
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
    { title: '库存单位', field: 'units',width: '80', align: 'center', },
    { title: '申请备注', field: 'applyRemark',width: '80', align: 'center', },
    { title: '实际库存', field: 'actualStock',width: '80', align: 'center', },
    { title: '可用库存', field: 'availableStock', width: '80',align: 'center', },
    { title: '在途数', field: 'onWayStock',width: '80', align: 'center', },
    { title: '要求交期', field: 'deliverTime', width: '200', align: 'center', },
    { title: '申请数量', field: 'quantity', align: 'center', width: '80',},
  ]);
  //物料列
  const listByMaterialColumnList = ref([
    { title: '序号',type: 'seq', width: '55', align: 'center'},
    { title: '申请单号', width: '100', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入申请单号' } },
    { title: '状态', width: '100', field: 'status', align: 'center', filterType: 'radioButton', filterParam: { placeholder: '请选择默认' }, filterData: () => statusList.value  },
    { title: '申请类型', width: '80', field: 'type', align: 'center' },
    { title: '收货地址', field: 'addressName', align: 'center' ,width:'350' },
    { title: '申请人',  width: '80',field: 'applyUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入申请人' } },
    { title: '受理时间', width: '160', field: 'applyTime', align: 'center', filterType: 'intervalDate',  filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
      }
    },
    { title: '物料编码', field: 'rawMaterialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
    { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
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
    { title: '库存单位', field: 'units',width: '80', align: 'center', },
    { title: '实际库存', field: 'actualStock',width: '80', align: 'center', },
    { title: '可用库存', field: 'availableStock', width: '80',align: 'center', },
    { title: '在途数', field: 'onWayStock',width: '80', align: 'center', },
    { title: '申请备注', field: 'applyRemark',width: '80', align: 'center', },
    { title: '要求交期', field: 'deliverTime', width: '200', align: 'center', filterType: 'intervalDate',  filterParam: {
        startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
        endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm' },
      }},
    { title: '申请数量', field: 'quantity', align: 'center', width: '80',},
  ]);

  const { order_material_level: orderMaterialLevelList, units_type: unitsTypeList, order_plate_brand: orderPlateBrandList } = toRefs<any>(proxy?.useDict("order_material_level", "units_type", "order_plate_brand"));

  const selectedMaterialColumnList = ref([

    { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left', },
    { title: '物料编码', field: 'code', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
    { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
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

  //确认选中的物料表
  const confirmSelectInventoryColumnList = ref([
    { title: '序号', align: 'center', width: '50', type: 'seq' },
    { title: '物料类别', field: 'categoryName', width: '80', align: 'center', },
    { title: '物料编码', field: 'code', width: '80', align: 'center', },
    { title: '物料名称', field: 'name',  width: '80', align: 'center', },
    { title: '材质牌号', field: 'materialQuality',  width: '60', align: 'center', },
    { title: '品牌', field: 'manufacturer',  width: '60', align: 'center', },
    { title: '厚度', field: 'thickness', width: '80', align: 'center',  },
    { title: '规格型号', field: 'specification', width: '80', align: 'center',  },
    { title: '铜厚', field: 'copperThickness', width: '50', align: 'center', },
    { title: '板厚', field: 'boardThickness', width: '60', align: 'center', },
    { title: '颜色', field: 'color', width: '60', align: 'center', },
    { title: '级别', field: 'level', width: '60', align: 'center', },
    { title: '长(mm)', field: 'length', width: '70', align: 'center', },
    { title: '宽(mm)', field: 'width', width: '70', align: 'center', },
    { title: '品牌', field: 'manufacturer', width: '60', align: 'center', },
    { title: '默认供应商', field: 'supplierName', width: '90', align: 'center', },
    { title: '库存单位', field: 'units', align: 'center',  width: '60', },
    { title: '实际库存', field: 'actualStock', width: '70', align: 'center', },
    { title: '可用库存', field: 'availableStock', width: '60', align: 'center', },
    { title: '在途数量', field: 'onWayStock', align: 'center',width: '80', },
    { title: '申请备注', field: 'applyRemark', fixed: 'right', width: '180', align: 'center', },
    { title: '要求交期', field: 'deliverTime', fixed:'right', width: '120', align: 'center', },
    { title: '需求数量', field: 'quantity', fixed: 'right', width: '100', align: 'center', },
    { title: '操作',field:'make', fixed: 'right', width:'60', align: 'center', showOverflow:false},
  ]);


  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = params;
    getList();

  }

  // 获取 搜索条件-按物料查询
  const searchChangeByMaterial = (params: any) => {
    byMaterialParams.value = params;
    getListByMaterial();

  }

  /**选择时间触发*/
  const changeDeliverTime = (date:any) => {

    //把form.value.deliverTime赋值给confirmSelectInventoryList中的deliverTime
    confirmSelectInventoryList.value.forEach((item) => {
      item.deliverTime = date;
    });

  }
  const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<MaterialApplyVO> = ({ row,rowIndex }) => {

    //如果expandedRows.inventoryList为空就去获取详情
    if (!row.inventoryList) {
      row.loading = false;
      getMaterialApply(row.id).then((res) => {
        row.inventoryList = res.data.inventoryList;
        row.loading = true;
      });
    }
  }

  /**展开行触发*/
  const handleExpand = (expandedRows:any) => {

    //如果expandedRows.inventoryList为空就去获取详情
    if(!expandedRows.inventoryList){
      expandedRows.loading = false;
      getMaterialApply(expandedRows.id).then((res) => {
        expandedRows.inventoryList = res.data.inventoryList;
        expandedRows.loading = true;
      });
    }
  }


  // 设置库存预警背景样式
  const setRowStyle = (scope: any) => {
    if (scope.row.warningQuantity) {
      return {
        background: 'rgb(236,176,177)',
      }
    }
  }

  import { deepClone } from '@/utils'
  /**选择物料按钮 */
  const selectMaterial = async() => {
    dialogMaterial.visible = true;
    dialogMaterial.title = "选择物料";
    selectInventoryList.value=[...confirmSelectInventoryList.value];

    confirmSelectInventoryCopyList.value=deepClone(confirmSelectInventoryList.value);

    selectInventoryList.value.forEach(item => {
      item.id = item.rawMaterialId;
    });
    materialLoading.value = true;
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
    materialLoading.value = true;
    await getMaterialInventory();
    setTableSelect();
    materialLoading.value = false;
  }

  /** 查询物料申请列表 */
  const getList = async () => {
    loading.value = true;
    console.log("queryParams.value",queryParams.value);
    // queryParams.value.status = "1";
    const res = await listMaterialApply(queryParams.value);
    materialApplyList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }
  /** 查询物料申请列表 */
  const getListByMaterial = async () => {
    console.log("byMaterialParams.value",byMaterialParams.value);

    loadingByMaterial.value = true;
    // queryParams.value.status = "1";
    const res = await listApplyByMaterial(byMaterialParams.value);
    listByMaterial.value = res.rows;
    byMaterialTotal.value = res.total;
    loadingByMaterial.value = false;
  }



  /** 查询物料库存列表 */
  const getMaterialInventory = async () => {
    const res = await listMaterialInventoryInfo(selectQueryParams.value);
    materialInventoryList.value = res.rows;
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


  /** 表单重置 */
  const reset = () => {
    form.value = { ...initFormData };
    materialApplyFormRef.value?.resetFields();
  }

  /** 新增表单重置 */
  const confirmReset = () => {

    selectInventoryList.value = [];
    confirmSelectInventoryList.value = [];

    selectQueryParams.value.pageNum = 1;


  }

  //选择物料全选
  const selectAllChangeEvent: VxeTableEvents.CheckboxAll<RawMaterialVO> = () => {
    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      selectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
    }
  }

  //选择物料 单选
  const selectChangeEvent: VxeTableEvents.CheckboxChange<MaterialApplyVO> = ({ checked, row }) => {
    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      selectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
      // let temp = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
      //temp 根据rawMaterialId去重 相同的rawMaterialId只保留一个
      // selectInventoryList.value = Array.from(new Set(temp.map(item => item.rawMaterialId))).map(item => temp.find(item2 => item2.rawMaterialId == item));
    }

  }

  /** 多选框选中数据 */
  const handleSelectionChange = (selection: MaterialApplyVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;

  }




  /** 新增按钮操作 */
  const handleAdd = () => {
    getCustomerAddressList();
    reset();
    dialog.visible = true;
    dialog.title = "添加物料申请";
    confirmReset();

  }

  /** 已选物料取消按钮操作 */
  const clearInventoryForm = () => {

    dialogMaterial.visible = false;
    selectInventoryList.value = [];
    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      $table.clearCheckboxReserve();
      $table.clearCheckboxRow();
    }

  }
  /** 已选物料确认按钮操作 */
  const submitInventoryForm = () => {
    dialogMaterial.visible = false;
//将已选中的赋值给confirmSelectInventoryList

    confirmSelectInventoryList.value = selectInventoryList.value;

    confirmSelectInventoryList.value.map((item2) => {
      let material =  confirmSelectInventoryCopyList.value.find(item => item.rawMaterialId == item2.id);
      if (material) {
        item2.quantity = material.quantity;
        item2.deliverTime = material.deliverTime;
        item2.id = material.id;
        item2.applyRemark = material.applyRemark;
      }
    });
  }

  const dialogTableLoading = ref(false)
  /** 修改按钮操作 */
  const handleUpdate = async (row?: MaterialApplyVO) => {
    getCustomerAddressList();
    reset();
    dialog.visible = true;
    dialog.title = "修改物料申请";
    dialogTableLoading.value = true
    const _id = row?.id || ids.value[0]
    const res = await getMaterialApply(_id);
    Object.assign(form.value, res.data);
    //为确认选择的confirmSelectInventoryList列表赋值
    confirmSelectInventoryList.value = res.data.inventoryList;
    //为已选物料列表赋值
    selectInventoryList.value = res.data.inventoryList;
    dialogTableLoading.value = false
  }


  /** 详情按钮操作 */
  const handleSelect = async (row?: MaterialApplyVO) => {
    getCustomerAddressList();
    reset();
    dialog.visible = true;
    dialog.title = "物料申请详情";
    dialogTableLoading.value = true
    const _id = row?.id || ids.value[0]
    const res = await getMaterialApply(_id);
    Object.assign(form.value, res.data);
    //为确认选择的confirmSelectInventoryList列表赋值
    confirmSelectInventoryList.value = res.data.inventoryList;
    //为已选物料列表赋值
    selectInventoryList.value = res.data.inventoryList;
    dialogTableLoading.value = false
  }

  /** 提交按钮 */
  const submitForm = () => {
    materialApplyFormRef.value?.validate(async (valid: boolean) => {
      if (confirmSelectInventoryList.value.length == 0) {
        proxy?.$modal.msgError("请选择物料");
        return;
      }
      let check = false;
      let msg = "";
      confirmSelectInventoryList.value.forEach((item) => {
        //判断item.applyNum>0
        if (item.quantity <= 0 || !item.quantity) {
          check = true;
          msg="申请数量必须大于0"
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
      form.value.materialApplyDetailsList=confirmSelectInventoryList.value;
      if (valid) {
        buttonLoading.value = true;
        if (form.value.id) {
          await updateMaterialApply(form.value).finally(() => buttonLoading.value = false);
          proxy?.$modal.msgSuccess("修改成功");
        } else {
          await addMaterialApply(form.value).finally(() => buttonLoading.value = false);
          proxy?.$modal.msgSuccess("新增成功");
        }
        dialog.visible = false;
        await getList();
        confirmReset();
      }
    });
  }

  /** 删除按钮操作 */
  const handleDelete = async (row?: MaterialApplyVO) => {
    const _ids = row?.id || ids.value;

    await proxy?.$modal.confirm('是否确认【删除】申请编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...');
    await delMaterialApply(_ids).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
  }
  /** 提交按钮操作 */
  const handleApply = async (row?: MaterialApplyVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认【提交】申请编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...');
    await modifyStatus(_ids as number, "2").finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("提交成功");
    await getList();
  }

  /** 已选物料 删除按钮操作 */
  const handleInventoryListDelete = async (row?: RawMaterialVO) => {
    const id = row?.id;
    //删除已选物料
    selectInventoryList.value = selectInventoryList.value.filter(item => item.id != id);

    const $table =  inventoryTableRef.value.xTableRef;
    if ($table) {
      $table.setCheckboxRow(row, false);
    }
  }


  /** 确认已选物料删除按钮操作 */
  const handleSelectDelete = async (row?: RawMaterialVO) => {

    //得到row的rawMaterialId
    let rawMaterialId=row?.rawMaterialId;

    const _ids = row?.id || ids.value;
    //删除已选物料
    selectInventoryList.value = selectInventoryList.value.filter(item => item.id != _ids);
    //删除确认已选物料
    confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id != _ids);

    const $table = inventoryTableRef.value.xTableRef;
    //将InventoryTableRef使用toggleRowSelection 取消选中
    // inventoryTableRef.value?.toggleRowSelection(row, false);
    if ($table) {
      //将InventoryTableRef使用toggleRowSelection 取消选中
      $table.setCheckboxRow(row, false);
    }
  }
  /** 清空确认已选物料按钮操作 */
  const handlempty = async () => {

    const $table = confirmTable.value.xTableRef;

    //将InventoryTableRef使用toggleRowSelection 取消选中
    selectInventoryList.value.forEach((item) => {
      // InventoryTableRef.value?.toggleRowSelection(item, false);
      $table.setCheckboxRow(item, false);
    });


    //清空已选物料
    // selectInventoryList.value = [];
    //清空确认已选物料
    confirmSelectInventoryList.value = [];

  }

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('purchase/materialApply/export', {
      ...queryParams.value
    }, `materialApply_${new Date().getTime()}.xlsx`)
  }

  const batchDeliveryTime = ref();
  const dialogChangeDeliveryTimeAll = reactive<DialogOption>({
    visible: false,
    title: '批量设置交期'
  });

    /** 打开批量修改要求交期弹窗 */
  const changeDeliveryTimeAllOpen = async () => {
    batchDeliveryTime.value=undefined;
    dialogChangeDeliveryTimeAll.visible=true;
  }


    /** 批量修改交期 */
  const changeDeliveryTimeConfirm = async () => {
    if(batchDeliveryTime.value){
      confirmSelectInventoryList.value.forEach(item => {
        item.deliverTime = batchDeliveryTime.value;
      })

    }
    dialogChangeDeliveryTimeAll.visible = false
  }


  onMounted(() => {
    getList();
    //选择物料列表
    getMaterialInventory();
    getListRawMaterialCategorys();

  });
</script>

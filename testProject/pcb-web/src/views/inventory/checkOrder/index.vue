<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs v-if="checkPermi(['inventory:checkOrder:list'])" v-model="editableTabsValue" class="xtable-tab" @tab-change="radioTableHandle()">
        <el-tab-pane label="成品盘点单" :name="1">
          <XTable toolId="inventoryCheckPlanOrder"
                  height="100%"
                  class="xtable-content"
                  v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="checkPlanOrderList"
                  :columnList="columnList" :loading="loading"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="radioTableHandle"
                  :intervalCondition="intervalCondition"
          >
            <template #default-type="scope">
              {{ typeList.find(item => item.value == scope.row.type)?.label }}
            </template>
            <template #default-code="scope">
              <el-button link type="primary" @click="handleDetail(scope.row.id)">{{scope.row.code}}</el-button>
            </template>
            <template #default-planName="scope">
              <el-button link type="primary" @click="handlePlanDetail(scope.row.inventoryCheckPlanId, false)">{{scope.row.planName}}</el-button>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="物料盘点单" :name="2">
          <XTable toolId="inventoryCheckPlanOrderRaw"
                  height="100%"
                  class="xtable-content"
                  v-model:page-size="rawQueryParams.pageSize"
                  v-model:current-page="rawQueryParams.pageNum"
                  :page-params="{ perfect: true, total: rawTotal }"
                  :data="rawCheckPlanOrderList" :intervalCondition="intervalCondition"
                  :columnList="columnList" :loading="rawLoading"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="radioTableHandle"

          >
            <template #default-type="scope">
              {{ typeList.find(item => item.value == scope.row.type)?.label }}
            </template>
            <template #default-code="scope">
              <el-button link type="primary" @click="handleDetail(scope.row.id)">{{scope.row.code}}</el-button>
            </template>
            <template #default-planName="scope">
              <el-button link type="primary" @click="handlePlanDetail(scope.row.inventoryCheckPlanId, false)">{{scope.row.planName}}</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->

    <!-- 盘点详情对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="70%" :before-close="cancel">
      <el-collapse v-model="activeNames" v-loading="dialogLoading">
        <el-collapse-item title="基本信息" name="1">
          <el-form :model="form"  ref="checkOrderRef" v-loading="dialogLoading">
            <el-row >
              <el-col :span="6">
                <el-form-item label="盘点单号：" label-width="100px" prop="code">
                  <el-input :disabled="true" v-model="form.code" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关联盘点计划：" label-width="140px" prop="planName">
                  <el-button link :disabled="false" type="primary" @click="handlePlanDetail(form.inventoryCheckPlanId, true)">{{form.planName}}</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据类型：" label-width="100px" prop="type">
                  <el-select :disabled="true" v-model="form.type" class="width-100">
                    <el-option :key="dict.value" :label="dict.label" :value="dict.value" v-for="dict in typeList" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="负责人：" label-width="100px" prop="headUserName">
                  <el-input :disabled="true" v-model="form.headUserName" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间：" label-width="100px" prop="createTime">
                  <el-input :disabled="true" v-model="form.createTime" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人：" label-width="140px" prop="createByName">
                  <el-input :disabled="true" v-model="form.createByName" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核时间：" label-width="100px" prop="auditTime">
                  <el-input :disabled="true" v-model="form.auditTime" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核人：" label-width="100px" prop="auditUserName">
                  <el-input :disabled="true" v-model="form.auditUserName" maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="盘点明细" name="2">
          <!-- 产品Table -->
          <XTable v-if="form.planType == '1'" toolId="checkOrderCommodityToolId"
                  :pageShow="true" v-model:page-size="queryParamsCommodity.pageSize"
                  v-model:current-page="queryParamsCommodity.pageNum"
                  :page-params="{ perfect: true, total: commodityTotal }"
                  :data="selectCommodity"
                  height="400"
                  :loading="detailLoading"
                  :columnList="detailCommodityColumnList"
                  ref="xTableRef" border
                  :showRefresh="true"
                  @searchChange="searchChangePlan"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }">
            <template #default-commodityName="scope">
              <div>{{ scope.row.code ? scope.row.code:scope.row.commodityName }}</div>
            </template>
            <template #default-commodityCode="scope">
              <div>{{ scope.row.name ?  scope.row.name:scope.row.commodityCode}}</div>
            </template>
            <template #default-units="scope">
              <div>PCS</div>
            </template>
            <template #default-differenceQuantity="scope">
              <span v-if="Number(scope.row.differenceQuantity) > 0" style="color: darkseagreen">+{{scope.row.differenceQuantity}}</span>
              <span v-else-if="Number(scope.row.differenceQuantity) < 0" style="color: red">{{scope.row.differenceQuantity}}</span>
              <span v-else>{{scope.row.differenceQuantity}}</span>
            </template>
          </XTable>

          <!-- 物料Table -->
          <XTable v-if="form.planType == '2'" toolId="checkOrderMaterialToolId"
                  :pageShow="true" v-model:page-size="queryParamsMaterial.pageSize"
                  v-model:current-page="queryParamsMaterial.pageNum"
                  :page-params="{ perfect: true, total: materialsTotal }"
                  height="400"
                  :loading="detailLoading"
                  :data="selectMaterial"
                  :columnList="detailMaterialColumnList"
                  ref="xTableRef"
                  :showRefresh="true"
                  @searchChange="searchChangePlan"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
            <template #default-materialCode="scope">
              <div>{{ scope.row.code ? scope.row.code:scope.row.materialCode }}</div>
            </template>
            <template #default-materialName="scope">
              <div>{{ scope.row.name ?  scope.row.name:scope.row.materialName}}</div>
            </template>
            <template #default-differenceQuantity="scope">
              <span v-if="Number(scope.row.differenceQuantity) > 0" style="color: darkseagreen">+{{scope.row.differenceQuantity}}</span>
              <span v-else-if="Number(scope.row.differenceQuantity) < 0" style="color: red">{{scope.row.differenceQuantity}}</span>
              <span v-else>{{scope.row.differenceQuantity}}</span>
            </template>
          </XTable>
        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancel">
              关闭
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 盘点计划对话框 -->
    <el-drawer :title="dialogPlan.title" v-model="dialogPlan.visible" size="70%" :before-close="cancelPlan">
      <el-collapse v-model="activeNames" v-loading="dialogLoading">
        <el-collapse-item title="基本信息" name="1">
          <el-form :model="form"  ref="checkOrderRef" v-loading="dialogLoading">
            <el-row>
              <el-col :span="5">
                <el-form-item label="盘点类型：" prop="type">
                  <el-select :disabled="true" v-model="form.type"  class="width-100">
                    <el-option :key="dict.value" :label="dict.label" :value="dict.value" v-for="dict in typeList" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="盘点计划名称：" label-width="150px" prop="planName">
                  <el-input :disabled="true" v-model="form.planName" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点时间：" label-width="120px" prop="planTime">
                  <el-date-picker
                    :disabled="true"
                    clearable
                    type="date"
                    style="width: 100%"
                    placeholder="请选择盘点时间"
                    v-model="form.planTime"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="负责人：" label-width="110px" prop="headUserId">
                  <el-input :disabled="true" v-model="form.headUserName" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col v-if="form.auditTime" :span="5">
                <el-form-item label="审核时间："  prop="auditTime">
                  <el-input :disabled="true" v-model="form.auditTime" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col v-if="form.auditTime" :span="7">
                <el-form-item label="审核人：" label-width="150px" prop="auditUserName">
                  <el-input :disabled="true" v-model="form.auditUserName" maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="盘点明细" name="2">
          <!-- 产品Table -->
          <XTable v-if="form.planType == '1'" toolId="checkOrderCommodityToolId"
                  :pageShow="true" v-model:page-size="queryParamsCommodity.pageSize"
                  v-model:current-page="queryParamsCommodity.pageNum"
                  :page-params="{ perfect: true, total: commodityTotal }"
                  :data="selectCommodity"
                  height="400"
                  :loading="detailLoading"
                  :columnList="detailCommodityColumnList"
                  ref="xTableRef" border
                  :showRefresh="true"
                  @searchChange="searchChangePlan"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }">
            <template #default-commodityName="scope">
              <div>{{ scope.row.code ? scope.row.code:scope.row.commodityName }}</div>
            </template>
            <template #default-commodityCode="scope">
              <div>{{ scope.row.name ?  scope.row.name:scope.row.commodityCode}}</div>
            </template>
            <template #default-units="scope">
              <div>PCS</div>
            </template>
            <template #default-differenceQuantity="scope">
              <span v-if="Number(scope.row.differenceQuantity) > 0" style="color: darkseagreen">+{{scope.row.differenceQuantity}}</span>
              <span v-else-if="Number(scope.row.differenceQuantity) < 0" style="color: red">{{scope.row.differenceQuantity}}</span>
              <span v-else>{{scope.row.differenceQuantity}}</span>
            </template>
          </XTable>

          <!-- 物料Table -->
          <XTable v-if="form.planType == '2'" toolId="checkOrderMaterialToolId"
                  :pageShow="true" v-model:page-size="queryParamsMaterial.pageSize"
                  v-model:current-page="queryParamsMaterial.pageNum"
                  :page-params="{ perfect: true, total: materialsTotal }"
                  height="400"
                  :loading="detailLoading"
                  :data="selectMaterial"
                  :columnList="detailMaterialColumnList"
                  ref="xTableRef"
                  :showRefresh="true"
                  @searchChange="searchChangePlan"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
            <template #default-materialCode="scope">
              <div>{{ scope.row.code ? scope.row.code:scope.row.materialCode }}</div>
            </template>
            <template #default-materialName="scope">
              <div>{{ scope.row.name ?  scope.row.name:scope.row.materialName}}</div>
            </template>
            <template #default-differenceQuantity="scope">
              <span v-if="Number(scope.row.differenceQuantity) > 0" style="color: darkseagreen">+{{scope.row.differenceQuantity}}</span>
              <span v-else-if="Number(scope.row.differenceQuantity) < 0" style="color: red">{{scope.row.differenceQuantity}}</span>
              <span v-else>{{scope.row.differenceQuantity}}</span>
            </template>
          </XTable>
        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancelPlan">
              关闭
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="CheckOrder" lang="ts">
import {ref} from "vue";
import {CheckOrderForm, CheckOrderQuery, CheckOrderVO} from "@/api/inventory/checkOrder/types";

import { listCheckPlanDetail } from "@/api/inventory/checkPlanDetail";

import {getCheckOrder, listCheckOrder} from "@/api/inventory/checkOrder";
import {getCheckPlan} from "@/api/inventory/checkPlan";
import {checkPermi} from "@/utils/permission";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const editableTabsValue = ref(1);

const checkPlanOrderList = ref<CheckOrderVO[]>([]);
const rawCheckPlanOrderList = ref<CheckOrderVO[]>([]);
const selectCommodity = ref<any[]>([]);
const selectMaterial = ref<any[]>([]);

const query = ref();

const orderId = ref();

const loading = ref(true);
const rawLoading = ref(true);
const dialogLoading = ref(false);
const buttonLoading = ref(false);
const detailLoading = ref(false);

const total = ref(0);
const rawTotal = ref(0);
const commodityTotal = ref(0);
const materialsTotal = ref(0);

const isPlan = ref(false);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogPlan = reactive<DialogOption>({
  visible: false,
  title: ''
});

const checkOrderRef = ref<ElFormInstance>();

const activeNames = ref(['1','2'])

const initFormData: CheckOrderForm = {
  id: undefined,
  ownerId: undefined,
  type: undefined,
  planName: undefined,
  headUserName: undefined,
  auditUserName: undefined,
  auditTime: undefined,
  remark: undefined
}
const data = reactive<PageData<CheckOrderForm, CheckOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    type: undefined,
    planType: '1',
    planName: undefined,
    headUserName: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "盘点类型不能为空", trigger: "change" }
    ],
    planName: [
      { required: true, message: "盘点计划名称不能为空", trigger: "blur" }
    ],
    planTime: [
      { required: true, message: "盘点时间不能为空", trigger: "blur" }
    ],
    headUserId: [
      { required: true, message: "负责人不能为空", trigger: "blur" }
    ],
  }
});
const { queryParams, form, rules } = toRefs(data);

const rawData = reactive<PageData<CheckOrderForm, CheckOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    type: undefined,
    planName: undefined,
    headUserName: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    params: {
    }
  },
  rules: {}
});
const { queryParams: rawQueryParams} = toRefs(rawData);

const queryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

const queryParamsMaterial = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

const XTableRef = ref()

const intervalCondition = ['createTime', 'auditTime'];

const typeList = ref([
  {label: '盘盈', value: '1' },
  {label: '盘亏', value: '2' },
]);

const columnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '80'},
  {title: '盘点单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入盘点单号' } },
  {title: '盘点计划名称', field: 'planName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入计划名称' } },
  {title: '单据类型', width: '160', field: 'type', align: 'center', filterType: 'radioButton', filterData: () => typeList.value},
  {title: '负责人', width: '120', field: 'headUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入名称' }},
  {title: '创建人', width: '120', field: 'createByName', align: 'center', filterType: "input", filterParam: { placeholder: '请输入名称' }},
  {title: '创建时间', width: '200', field: 'createTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
  {title: '审核人', width: '120', field: 'auditUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入名称' }},
  {title: '审核时间', width: '200', field: 'auditTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
]);

const detailCommodityColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '80'},
  {minWidth: '120', title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品编码'}},
  {minWidth: '180', title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
  {minWidth: '120', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
  {minWidth: '80', title: '单位', field: 'units', align: 'center'},
  {minWidth: '80', title: '所属仓库', field: 'storageName', align: 'center'},
  {width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'},
  {width: '100', title: '盘点数量', fixed: 'right', field:'replayQuantity', align: 'center'},
  {width: '100', title: '差异数量', fixed: 'right', field: 'differenceQuantity', align: 'center'},
  // {width: '100', title: '库存成本', fixed: 'right', field: 'inventoryCost', align: 'center', isPermi: () => checkPermi(['inventory:checkOrder:cost'])},
]);

const detailMaterialColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '40'},
  {minWidth: '120', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  {minWidth: '120', title: '物料名称', field: 'materialName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  {minWidth: '100', title: '物料类别', field: 'categoryName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } },
  {minWidth: '60', title: '单位', field: 'units', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' } },
  {minWidth: '80', title: '材质牌号', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  {minWidth: '60', title: '铜厚', field: 'copperThickness',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  {minWidth: '60', title: '颜色', field: 'color', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入颜色' } },
  {minWidth: '60', title: '级别', field: 'level', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入级别' } },
  {minWidth: '50', title: '长', field: 'length', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入长' } },
  {minWidth: '50', title: '宽', field: 'width', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入宽' } },
  {minWidth: '80', title: '品牌', field: 'manufacturer', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  {width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'},
  {width: '100', title: '盘点数量', fixed: 'right', field:'replayQuantity', align: 'center'},
  {width: '100', title: '差异数量', fixed: 'right', field: 'differenceQuantity', align: 'center'},
  {width: '100', title: '库存成本', fixed: 'right', field: 'inventoryCost', align: 'center', isPermi: () => checkPermi(['inventory:checkOrder:cost'])},
]);

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  checkOrderRef.value?.resetFields();
  // 选择产品、物料清除
  selectMaterial.value = [];
  selectCommodity.value = [];
  isPlan.value = false;
  orderId.value = undefined;
}

/** 取消 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 取消 */
const cancelPlan = () => {
  if(orderId.value) {
    getDetail(orderId.value);
    orderId.value = undefined;
  }
  dialogPlan.visible = false;
}

/** 切换菜单栏 */
const radioTableHandle = async (params?: any) => {
  if (1 == editableTabsValue.value) {
    if (params) {
      queryParams.value = params
    }
    queryParams.value.planType = '1'
    await getList();
  } else {
    if (params) {
      rawQueryParams.value = params
    }
    rawQueryParams.value.planType = '2'
    await getRawList();
  }
}

/** 详情按钮操作 */
const handleDetail = async (id: number) => {
  dialog.title = '盘点单详情';
  dialog.visible = true;
  await getDetail(id);
}

/** 查询盘点单详情 */
const getDetail = async (id: number) => {
  dialogLoading.value = true;
  detailLoading.value = true;
  const res = await getCheckOrder(id).finally(() => {dialogLoading.value = false});
  form.value = res.data;
  if(form.value.planName && form.value.planName.length > 6) {
    form.value.planName = form.value.planName.substring(0, 5) + '...';
  }
  // 分页查询明细数据
  let query = {
    pageNum: 1,
    pageSize: 20,
    planType: res.data.planType,
    type: res.data.type,
    inventoryCheckPlanId: res.data.inventoryCheckPlanId,
  }
  await listCheckPlanDetail(query).then(detailRes => {
    if ('1' == res.data.planType) {
      selectCommodity.value = detailRes.rows;
      commodityTotal.value = detailRes.total;
    } else {
      selectMaterial.value = detailRes.rows;
      materialsTotal.value = detailRes.total;
    }
  }).finally(() => {detailLoading.value = false});
}

/** 盘点单计划详情 */
const handlePlanDetail = async (id: number, flag: boolean) => {
  if(flag) {
    orderId.value = form.value.id;
  }
  dialogPlan.title = '盘点单计划详情'
  dialogPlan.visible = true;
  isPlan.value = true;
  await getPlanDetail(id);
}

/** 查询盘点计划详情 */
const getPlanDetail = async (id: number) => {
  dialogLoading.value = true;
  detailLoading.value = true;
  const res = await getCheckPlan(id).finally(() => {dialogLoading.value = false});

  form.value = res.data;
  form.value.planType = res.data.type;
  // 分页查询明细数据
  let query = {
    pageNum: 1,
    pageSize: 20,
    planType: res.data.type,
    inventoryCheckPlanId: res.data.id,
  }
  await listCheckPlanDetail(query).then(detailRes => {
    if ('1' == res.data.type) {
      selectCommodity.value = detailRes.rows;
      commodityTotal.value = detailRes.total;
    } else {
      selectMaterial.value = detailRes.rows;
      materialsTotal.value = detailRes.total;
    }
  }).finally(() => {detailLoading.value = false});
}

/** 查询成品盘点单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCheckOrder(queryParams.value);
  checkPlanOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询物料盘点单列表 */
const getRawList = async () => {
  rawLoading.value = true;
  const res = await listCheckOrder(rawQueryParams.value);
  rawCheckPlanOrderList.value = res.rows;
  rawTotal.value = res.total;
  rawLoading.value = false;
}

/** 明细分页查询 */
const searchChangePlan = async (params: any) => {
  params.planType = form.value.planType;
  params.type = isPlan.value? undefined : form.value.type;
  params.inventoryCheckPlanId = isPlan.value? form.value.id : form.value.inventoryCheckPlanId;
  detailLoading.value = true;
  await listCheckPlanDetail(params).then(detailRes => {
    if ('1' == form.value.planType) {
      selectCommodity.value = detailRes.rows;
      commodityTotal.value = detailRes.total;
    } else {
      selectMaterial.value = detailRes.rows;
      materialsTotal.value = detailRes.total;
    }
  }).finally(() => {detailLoading.value = false});
}

onMounted(() => {
  getList();
});
</script>

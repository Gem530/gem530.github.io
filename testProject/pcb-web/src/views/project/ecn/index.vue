<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8"  style="display: flex;justify-content: flex-end;width: 100%;">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              >导出</el-button>
          </el-col> -->
        </el-row>
      </template>

      <XTable toolId="projectEcn" :pageShow="true" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
        :intervalCondition="['notifyTime']" :page-params="{ perfect: true, total: total }" :data="ecnList"
        :scroll-y="{ enabled: true }" :loading="loading" size="mini" :columnList="columnList" border :showRefresh="true"
        @searchChange="handleQuery" :column-config="{ resizable: true }">

        <template #default-notifyTime="scope">
          <span>{{ parseTime(scope.row.notifyTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-isFinish="scope">
          <div v-for="item in statusFilterData">
            <span>{{ item.value == scope.row.isFinish ? item.label : "" }}</span>
          </div>
        </template>
        <template #default-isSelfChange="scope">
          <el-icon v-if="scope.row.isSelfChange=='1'"><Check /></el-icon>
        </template>
        <template #default-isCustomerChange="scope">
          <el-icon v-if="scope.row.isCustomerChange=='1'"><Check /></el-icon>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)" >编辑</el-button>
          <el-button link type="primary" @click="accountUReportHandle(scope.row)">预览</el-button>
        </template>
      </XTable>

    </el-card>

    <el-drawer v-model="ecnTable.visible" :title="ecnTable.title" size="60%" draggable>
      <el-form border label-width="120px" :disabled="ecnTable.title?.includes('详情') || ecnTable.title?.includes('审核')"
        ref="ecnFormRef" :model="form" :rules="rules" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="通知单号:" prop="no">
              <el-input v-model="form.no" :rows="2" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="通知日期:" prop="notifyTime">
              <el-date-picker v-model="form.notifyTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                value-format="YYYY-MM-DD" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="制单人员:" prop="createByName">
              <el-input v-model="form.createByName" :rows="2" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item size="small" label="产品名称:" prop="commodityName" @click="relatedCommodity">
              <el-input v-model="form.commodityName" :rows="2" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="是否完结:" prop="isFinish">
              <el-switch v-model="form.isFinish" active-value="1" inactive-value="2"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="产品编号:" prop="commodityNo">
              <el-input v-model="form.commodityNo" :rows="2" :readonly="true" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="客户ID:" prop="customerCode">
              <el-input v-model="form.customerCode" :rows="2" :readonly="true" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="新产品编号:" prop="commodityNewNo">
              <el-input v-model="form.commodityNewNo" :rows="2" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="生产编号:" prop="productionId">
              <el-select v-model="form.productionId" clearable filterable placeholder="请选择生产编号">
                <el-option value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" prop="isSelfChange">
              <el-checkbox v-model="form.isSelfChange" true-label="1" false-label="2" label="内部更改" size="large"
                style="display: contents;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" prop="isCustomerChange">
              <el-checkbox v-model="form.isCustomerChange" true-label="1" false-label="2" label="客户更改" size="large"
                style="display: contents;" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" prop="changeReason" label="变更原因:">
              <el-input maxlength="1000" v-model="form.changeReason" :rows="2" type="textarea" placeholder="请输入修改原因" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item size="small" label="变更类别:">
              <el-col :span="24">
                <!-- <el-button @click="addChangeRow" type="primary">新增</el-button> -->
                <!-- <el-button @click="fullValidEvent" type="primary">test</el-button> -->
                <vxe-table border show-overflow keep-source ref="_tableRef" :data="form.changeItem" size="mini"
                  :edit-rules="validRules" :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
                  <vxe-column field="make" title="操作" width="60" align="center">
                    <template #header>
                      <el-icon @click="addChangeRow" style="color: rgb(64, 158, 255);font-size:19px">
                        <CirclePlusFilled />
                      </el-icon>
                    </template>
                    <template #edit="scope">
                      <el-icon @click="removeChange(scope.row)" color="red" size="19px">
                        <RemoveFilled />
                      </el-icon>
                    </template>
                    <template #default="scope">
                      <el-icon @click="removeChange(scope.row)" color="red" size="19px">
                        <RemoveFilled />
                      </el-icon>
                    </template>
                  </vxe-column>
                  <vxe-column type="seq" title="序号" width="60"></vxe-column>
                  <vxe-column field="project" title="项目" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.project" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                  <vxe-column field="content" title="变更内容" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.content" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                  <vxe-column field="craftName" title="工艺" :edit-render="{}">
                    <template #edit="scope">
                      <vxe-select v-model="scope.row.workflow" @change="changeCraft(scope.row)" placeholder="请选择工艺"
                         :options="craftMap" clearable filterable transfer popup-class-name="pop-select"></vxe-select>
                    </template>
                  </vxe-column>
                </vxe-table>

              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="生效时间:">
              <el-checkbox-group v-model="form.effectiveNode" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="effectItem in effectList" :key="effectItem" :label="effectItem">{{
                  effectItem
                }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item size="small" label="原有库存板处理意见:">
              <el-input maxlength="1000" v-model="form.originCommodityHanding" :rows="2" type="textarea" placeholder="请输入处理意见" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="变更/取消知会部门:">
              <el-checkbox-group v-model="form.notifyDep" @change="handleCheckedChangeDept">
                <el-checkbox v-for="item in materialType" :key="item.value" :label="item.label" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="治工具菲林:">
              <el-col :span="24">
                <!-- <el-button @click="addFLRow" type="primary">新增</el-button> -->
                <vxe-table border show-overflow keep-source ref="XTableRefFL" :data="form.toolFilin" size="mini"
                  align="center" :edit-rules="validRules"
                  :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
                  <vxe-column field="make" title="操作" width="60">

                    <template #header>
                      <el-icon @click="addFLRow" style="color: rgb(64, 158, 255);font-size:19px">
                        <CirclePlusFilled />
                      </el-icon>
                    </template>
                    <template #edit="scope">
                      <el-icon @click="removeToolFilin(scope.row)" color="red" size="19px">
                        <RemoveFilled />
                      </el-icon>
                    </template>
                    <template #default="scope">
                      <el-icon @click="removeToolFilin(scope.row)" color="red" size="19px">
                        <RemoveFilled />
                      </el-icon>
                    </template>
                  </vxe-column>
                  <vxe-column type="seq" title="序号" width="60"></vxe-column>
                  <vxe-column field="project" title="项目" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.project" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                  <vxe-column field="content" title="变更内容" :edit-render="{}">
                    <template #edit="params">
                      <vxe-input v-model="params.row.content" type="text" @change="changeCellEvent(params)"></vxe-input>
                    </template>
                  </vxe-column>
                </vxe-table>

              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item size="small" label="备注:">
              <el-input maxlength="1000" v-model="form.remark" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" type="primary" v-show="ecnTable.title?.includes('修改') || ecnTable.title?.includes('添加')"
              @click="submitForm" >
              保 存
            </el-button>
            <el-button :loading="buttonLoading" @click="cancelAdd">取 消</el-button>
          </span>
        </div>
      </template>
    </el-drawer>


    <el-dialog v-model="commodityDialog.visible" :title="commodityDialog.title" width="60%" draggable>
      <el-row>
        <el-col :span="24">
          <XTable :pageShow="true" :loading="commodityLoading" :columnList="commodityColumnList"
            v-model:page-size="commodityQueryParams.pageSize" v-model:current-page="commodityQueryParams.pageNum"
            :page-params="{ perfect: true, total: commodityTotal }" border ref="tableRef" height="400" size="mini"
            :row-config="{ isCurrent: true, isHover: true }" :data="commodityList" :column-config="{ resizable: true }"
            :radio-config="{ trigger: 'row' }" @searchChange="commoditySearchChange" @radio-change="selectChangeEvent">

            <template #default-unit="scope">
                <span>PCS</span>
            </template>


          </XTable>
        </el-col>
      </el-row>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitCommodityForm"
              >确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
      draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
  </div>
</template>

<script setup name="Ecn" lang="ts">
import { listCommodity } from '@/api/order/commodity';
import { listCraft } from '@/api/basedata/craft';
import { listEcn, getEcn, delEcn, addEcn, updateEcn } from '@/api/project/ecn';
import { EcnVO, EcnQuery, EcnForm, changeItemVO, FLItemVO } from '@/api/project/ecn/types';
import { CommodityVO, CommodityForm, CommodityQuery } from '@/api/order/commodity/types';
import { CraftVO,CraftQuery } from '@/api/basedata/craft/types';
import { VxeTableInstance, VxeTableEvents, VxeTablePropTypes } from 'vxe-table';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const ecnList = ref<EcnVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);

const commodityTotal = ref(0);
const commodityList = ref<CommodityVO[]>([]);
const commodityLoading = ref(true);
//选中的产品
const selectCommodityVO = ref<CommodityVO>();

//
const XTableRefFL = ref<VxeTableInstance<FLItemVO>>();
const XTableRefChange = ref<VxeTableInstance<changeItemVO>>();

//生效时间列表
const effectList = ['立即执行', '从下批订单开始执行', '在制品', '不允许下单']
//变更/取消知会部门列表 此处暂用字典


/**销售对账预览 */
import { getReportUrl } from '@/utils/report';
/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '预览'
});
const accountUReportHandle = async (row: any) => {
  reportDrawer.title = "变更通知单预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl() + `&_n=ecn变更通知单&_u=file:ecn.ureport.xml&url=project/ecn/getReportInfo/${row.id}&listUrl=project/ecn/getReportChangeItemList/${row.id}&listUrl1=project/ecn/getReportToolFilinList/${row.id}`;
  console.log("reportUrl", reportUrl.value);
}

/**销售对账预览 */

const materialType = [
  {value:'1',label:'电镀'},
  {value:'2',label:'丝印'},
  {value:'3',label:'外形'},
  {value:'4',label:'测试'},
  {value:'5',label:'钻孔'},
  {value:'6',label:'线路'},
  {value:'7',label:'干区'},
  {value:'8',label:'仓库'},
  {value:'9',label:'市场'},
  {value:'10',label:'外协'},
  {value:'11',label:'模具'},
  {value:'12',label:'包装'},
  {value:'13',label:'计划'},
  {value:'14',label:'尾数仓'},
  {value:'15',label:'FQC/QA'},
];

const ecnFormRef = ref<ElFormInstance>();
const ecnTable = reactive<DialogOption>({
  visible: false,
  title: ''
});

//工艺列表转kv
const craftMap = ref([])
const commodityDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const initFormData: EcnForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  no: undefined,
  commodityId: undefined,
  productionId: undefined,
  isFinish: '2',
  commodityNewNo: undefined,
  isSelfChange: '2',
  isCustomerChange: '2',
  changeReason: undefined,
  changeItem: [],
  effectiveNode: undefined,
  originCommodityHanding: undefined,
  notifyDep: [],
  toolFilin: undefined,
  remark: undefined,
  notifyTime: undefined
}

const carftData = reactive<PageData<CommodityForm, CraftQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 1000,
    craftId:"",
    params: {}
  },
  rules: {
  }
});
const commodityData = reactive<PageData<CommodityForm, CommodityQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    cusId: undefined,
    cusName: undefined,
    name: undefined,
    materialLayer: undefined,
    params: {}
  },
  rules: {
  }
});

const data = reactive<PageData<EcnForm, EcnQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    no: undefined,
    commodityId: undefined,
    productionId: undefined,
    isFinish: undefined,
    commodityNewNo: undefined,
    isSelfChange: undefined,
    isCustomerChange: undefined,
    changeReason: undefined,
    changeItem: undefined,
    effectiveNode: undefined,
    originCommodityHanding: undefined,
    notifyDep: undefined,
    toolFilin: undefined,
    notifyTime: undefined,
    commodityName: undefined,
    commodityNo: undefined,
    customerCode: undefined,
    params: {
    }
  },
  rules: {

    commodityName: [
      { required: true, message: "产品名称不能为空", trigger: "change" }
    ],
    notifyTime: [
      { required: true, message: "通知日期不能为空", trigger: "blur" }
    ]
  }
});

//状态: 是否完结 1完结 2未完结
const statusFilterData = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
])
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '通知日期', field: 'notifyTime', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择通知日期', valueFormat: 'YYYY-MM-DD' } },
  //{ title: '是否完结', field: 'isFinish', align: 'center', filterType: 'radio', filterData: () => statusFilterData.value },
  { title: '完结状态', field: 'isFinish', width: '90', align: 'center', filterType: undefined, filterParam: { placeholder: '请选择状态' }, filterData: () => statusFilterData.value },
  { title: '通知单号', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择通知单编号' } },
  { title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择产品名称' } },
  { title: '产品编号', field: 'commodityNo', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择产品编号' } },
  { title: '客户编号', field: 'customerCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择客户编号' } },
  { title: '内部更改', field: 'isSelfChange', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择是否内部更改' }, filterData: () => statusFilterData.value },
  { title: '客户更改', field: 'isCustomerChange', align: 'center', filterType: 'radio', filterParam: { placeholder: '请选择是否客户更改' }, filterData: () => statusFilterData.value },
  { title: '制单人员', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择创建者名称' } },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '新产品编码', field: 'commodityNewNo', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择产品新编码' } },
  { title: '操作', field: 'make', align: 'center', fixed: 'right', width: 160 },
]);

//产品列表
const commodityColumnList = ref([
  { type: 'radio', align: 'center', width: '60' },
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '产品编号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择产品编号' } },
  { title: '客户编号', field: 'customerCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择客户编号' } },
  { title: '产品名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请选择产品名称' } },
  { title: '板层', field: 'materialLayer', align: 'center' },
  { title: '板厚', field: 'materialCopperOutside' },
  { title: '长（SET）', field: 'unitedLength' },
  { title: '宽（SET）', field: 'unitedWidth' },
  { title: 'SET数', field: 'unitedNumber', align: 'center' },
  { title: '单位', field: 'unit', align: 'center' },
]);


//变更列表校验
const validRules = ref<VxeTablePropTypes.EditRules<changeItemVO>>({
  itemName: [
    { required: true, message: '变更项目必须填写' },
  ],
  content: [
    { required: true, message: '变更内容必须填写' },
  ],
  craftName: [
    { required: true, message: '工艺必须填写' },
  ]
})
const _tableRef = ref<VxeTableInstance<changeItemVO>>();

const addChangeRow = async () => {
  const $table = _tableRef.value
  if ($table) {
    const { row: newRow } = await $table.insert({})
    // 插入一条数据并触发校验
    const errMap = await $table.validate(newRow)
    if (errMap) {
      // 校验失败
    }
  }
}
//删除变更行
const removeChange = async (_row: number) => {
  const $table = _tableRef.value
  if ($table) {
    const { row: newRow } = await $table.remove(_row)
  }
}

const addFLRow = async () => {
  const $table = XTableRefFL.value;
  if ($table) {
    const { row: newRow } = await $table.insert({})
    // 插入一条数据并触发校验
    const errMap = await $table.validate(newRow)
    if (errMap) {
      // 校验失败
    }
  }
}

//删除治工具菲林行
const removeToolFilin = async (_row: number) => {
  const $table = XTableRefFL.value;
  if ($table) {
    const { row: newRow } = await $table.remove(_row)
  }
}

//完整校验
const fullValidEvent = async () => {
  const $table = _tableRef.value;
  const $table2 = XTableRefFL.value;
  let result = true;
  if ($table || $table2) {
    const errMap = await $table.fullValidate();
    const errMap2 = await $table2.fullValidate();
    if (errMap) {
      const msgList: string[] = []
      Object.values(errMap).forEach((errList) => {
        errList.forEach((params) => {
          const { rowIndex, column, rules } = params
          rules.forEach((rule) => {
            msgList.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
          })
        })
      })
      result = false;
    } else {
      console.log("变更项目校验成功");
      console.log($table.getTableData());
      if ($table.getTableData().tableData.length > 0) {
        form.value.changeItem = $table.getTableData().tableData;
      } else {
        form.value.changeItem = [];
      }
    }
    if (errMap2) {
      const msgList2: string[] = []
      Object.values(errMap2).forEach((errList) => {
        errList.forEach((params) => {
          const { rowIndex, column, rules } = params
          rules.forEach((rule) => {
            msgList2.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
          })
        })
      })
      result = false;
    } else {
      console.log("fl校验成功");
      console.log($table2.getTableData());
      if ($table2.getTableData().tableData.length > 0) {
        form.value.toolFilin = $table2.getTableData().tableData;
      } else {
        form.value.toolFilin = [];
      }
    }
  }
  console.log("fullValidEvent unvalid");
  return result;
}

const changeCellEvent = (params: any) => {
  const $table = _tableRef.value
  if ($table) {
    $table.updateStatus(params)
  }
}
const changeCraft = (params: any) => {
  const _name = craftMap.value.find(item => item.value == params.workflow)?.label;
  params.craftName = _name;

  console.log("craftMap", craftMap.value);
  console.log("changeCraft", params);
}

const { queryParams, form, rules } = toRefs(data);
const { queryParams: commodityQueryParams, form: commodityForm } = toRefs(commodityData);
const { queryParams: carftQueryParams } = toRefs(carftData);

/** 查询ECN通知列表 */
const getList = async () => {
  loading.value = true;
  const res = await listEcn(queryParams.value);
  ecnList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  commodityDialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  ecnFormRef.value?.resetFields();
  //删除变更列表
  form.value.changeItem = [];
  form.value.toolFilin = [];
}

/** 搜索按钮操作 */
const handleQuery = (params: any) => {
  queryParams.value = params;
  getList();
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  ecnTable.visible = true;
  ecnTable.title = "添加ECN通知";
  //设置默认日期
  setDafaultDate();
}

const cancelAdd = () => {
  reset();
  ecnTable.visible = false;
}

/**关联产品按钮 */
const relatedCommodity = async () => {
  commodityDialog.visible = true;
  commodityDialog.title = "选择产品";
  await getCommodityList();
}

/** 查询产品列表 */
const getCommodityList = async () => {
  commodityLoading.value = true;
  const res = await listCommodity(commodityQueryParams.value);
  commodityList.value = res.rows;
  commodityTotal.value = res.total;
  commodityLoading.value = false;
}
/**
 * 选择产品列表
 */
const commoditySearchChange = (params: any) => {
  commodityQueryParams.value = params
  getCommodityList();
}
/** 选择产品确认按钮操作 */
const submitCommodityForm = () => {
  commodityDialog.visible = false;
  form.value.commodityId = selectCommodityVO.value?.id;
  form.value.commodityName = selectCommodityVO.value?.name;
  form.value.commodityNo = selectCommodityVO.value?.code;
  form.value.customerCode = selectCommodityVO.value?.customerCode;
}

/**
 * 选择生效时间
 */
const handleCheckedCitiesChange = (value: string[]) => {
  console.log(value);
  form.value.effectiveNode = value;
}

/**
 * 选择变更/取消知会部门
 */
const handleCheckedChangeDept = (value: string[]) => {
  console.log(value);
  // form.value.notifyDep = value;
}

const dialogTableLoading = ref(false)
/** 修改按钮操作 */
const handleUpdate = async (row?: EcnVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  ecnTable.visible = true;
  ecnTable.title = "修改ECN通知";
  dialogTableLoading.value = true
  const res = await getEcn(_id);
  //json类型转换为对应数组
  //此处序列号两次是由于查询会将json字符串再转为字符串。所以解析需要两次
  //await setCraftList();
  Object.assign(form.value, res.data);
  if(form.value.changeItem){
    form.value.changeItem?.forEach((item:any) => {
      item.workflow=Number(item.workflow);
      item.craftName=craftMap.value.find((craft:any) => craft.value == item.workflow)?.label;
    })
  }
  console.log("craftMap", craftMap.value);
  console.log("form.value", form.value);
  dialogTableLoading.value = false
}



/** 提交按钮 */
const submitForm = () => {
  ecnFormRef.value?.validate(async (valid: boolean) => {
    const isValidChangeList = await fullValidEvent();
    if (valid && isValidChangeList) {
      //validXtable();
      // const tempForm = JSON.parse(JSON.stringify(form.value));
      buttonLoading.value = true;
      if (form.value.id) {
        await updateEcn(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addEcn(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      ecnTable.visible = false;
      await getList();
    }
  });
}

const validXtable = () => {
  XTableRefChange.value?.validate(async (valid: boolean) => {
    console.log("====>>validXtable before");
    if (valid) {
      console.log("====>>validXtable");
      const $table = XTableRefChange.value?.xTableRef;
      if ($table) {
        //form.value.changeItem = $table.getRecordset();
      }
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: EcnVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除ECN通知编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delEcn(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}
const selectChangeEvent: VxeTableEvents.RadioChange<CommodityVO> = ({ checked, row }) => {
  console.log(row);
  selectCommodityVO.value = row;
}
/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('project/ecn/export', {
    ...queryParams.value
  }, `ecn_${new Date().getTime()}.xlsx`)
}

/**
 * 获取工艺列表
 */
const setCraftList = async () => {
  carftQueryParams.value.isOpen='1'
  const res: any = await listCraft(carftQueryParams.value);
  craftMap.value = res.rows.map((item: CraftVO) => {
    return {
      label: item.craftName,
      value: item.id,
      key: item.id
    }
  })
}
const setDafaultDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  console.log("setDafaultDate", `${year}-${month}-${day}`);
  form.value.notifyTime = `${year}-${month}-${day}`;
}
onMounted(() => {
  getList();
  setCraftList();
})
</script>

<style lang="scss">
.pop-select {
  z-index: 9999 !important;
}
</style>

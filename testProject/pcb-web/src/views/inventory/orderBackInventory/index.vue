<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="退货单号" prop="originNo">
            <el-input v-model="queryParams.originNo" placeholder="请输入退货单号" clearable
                      @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品编码" prop="dataCode">
            <el-input v-model="queryParams.dataCode" placeholder="请输入产品编码" clearable
                      @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品名称" prop="dataName">
            <el-input v-model="queryParams.dataName" placeholder="请输入产品名称" clearable
                      @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="销售单号" prop="saleOrderNo">
            <el-input v-model="queryParams.saleOrderNo" placeholder="请输入销售单号" clearable
                      @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never" class="xtable-card">
      <el-tabs type="card" v-model="editableTabsValue" @tab-change="handlerClick">
        <el-tab-pane label="未完成" name="0"></el-tab-pane>
        <el-tab-pane label="已完成" name="1"></el-tab-pane>
      </el-tabs>
      <XTable height="100%" class="xtable-content" toolId="orderBackInventoryFinish"
              border
              v-loading="loading"
              :pageShow="true"
              v-model:page-size="queryParams.pageSize"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="orderBackInventoryList"
              @searchChange="searchChange"
              :columnList="mainColumnList">
        <template #default-make="{row}">
          <el-button size="small" link type="primary"  @click.stop="handleScrap(row)" v-if="editableTabsValue==0">报废</el-button>
          <el-button size="small" link type="primary"  @click.stop="handleRestart(row)" v-if="editableTabsValue==0">退货重发</el-button>
          <el-button size="small" link type="primary"  @click.stop="handleNormal(row)" v-if="editableTabsValue==0">重新入库</el-button>
          <el-button size="small" link type="primary"  @click.stop="handleRecord(row)">处理记录</el-button>
        </template>
        <!--          </template>-->
      </XTable>

    </el-card>

    <!-- 添加或修改退货产品处理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" destroy-on-close="true">
      <el-form ref="orderBackInventoryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="下单数量" prop="orderQuantity">
          <el-input v-model="form.orderQuantity" placeholder="请输入下单数量" />
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入入库数量" />
        </el-form-item>
        <el-form-item label="正常数量" prop="generalOutQuantity">
          <el-input v-model="form.generalOutQuantity" placeholder="请输入正常数量" />
        </el-form-item>
        <el-form-item label="报废数量" prop="scrapOutQuantity">
          <el-input v-model="form.scrapOutQuantity" placeholder="请输入报废数量" />
        </el-form-item>
        <el-form-item label="返工数量" prop="backRepairQuantity">
          <el-input v-model="form.backRepairQuantity" placeholder="请输入返工数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 退货产品报废对话框 -->
    <el-drawer :title="drawerScrap.title" v-model="drawerScrap.visible" width="500px" destroy-on-close="true">
      <el-form ref="orderBackInventoryRecordFormRef" :model="formScrap" :rules="rulesScrap" label-width="80px">
        <el-form-item label="报废工序" prop="process" >
          <el-select v-model="formScrap.process" clearable :collapse-tags="true" filterable style="width: 100%;"
                     placeholder="请选择工艺">
            <el-option
              v-for="item in craftOptions"
              :key="item.id"
              :label="item.craftName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="responsible">
          <el-select v-model="formScrap.responsible" clearable :collapse-tags="true" filterable style="width: 100%;"
                     placeholder="请选择负责人">
            <el-option
              v-for="item in SysUserOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报废数量" prop="scrapOutQuantity">
          <el-input v-model="formScrap.scrapOutQuantity" placeholder="请输入报废数量" type="number" />
        </el-form-item>
        <el-form-item label="报废备注" prop="remark">
          <el-input v-model="formScrap.remark" placeholder="请输入备注" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormScrap">确 定</el-button>
          <el-button @click="cancelScrap">取 消</el-button>
        </div>
      </template>
    </el-drawer>


    <!-- 退货不补对话框 -->
    <el-drawer :title="drawerReturnNo.title" v-model="drawerReturnNo.visible" width="500px" destroy-on-close="true">
      <el-form ref="orderBackInventoryRecordFormRef" :model="formReturnNo" :rules="rulesReturnNo" label-width="80px">
        <el-form-item label="退货数量" prop="returnQuantity">
          <el-input v-model="formReturnNo.orderQuantity" placeholder="退货数量" />
        </el-form-item>
        <el-form-item label="合计" prop="totalQuantity">
          <el-input v-model="formReturnNo.totalQuantity" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formReturnNo.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormReturnNo">确 定</el-button>
          <el-button @click="cancelReturnNo">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 正常品入库对话框 -->
    <el-drawer :title="drawerNormal.title" v-model="drawerNormal.visible" width="1000px" destroy-on-close="true">
      <el-form ref="fomrNormalRef" :model="formNormal" label-width="100px">
        <div v-for="(item, index) in formNormal.normalInfos" :key="index" style="display: flex">
          <el-row>
            <el-col :span="9">
              <el-form-item label="正常品数量" :prop="`normalInfos.${index}.generalOutQuantity`" :rules="{ required: true, message: '正常品数量不能为空', trigger: 'blur' }">
                <el-input v-model="item.generalOutQuantity" placeholder="正常品数量" style="width: 100%;" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="库位" :prop="`normalInfos.${index}.positionMes`" :rules="{ required: true, message: '库位不能为空', trigger: 'change' }">
                <el-select v-model="item.positionMes" clearable :collapse-tags="true" filterable style="width: 100%;"
                           placeholder="请选择地址">
                  <el-option
                    v-for="item in BaseStorage"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="3" v-if="index === formNormal.normalInfos.length - 1">
              <div class="mt-1 flex justify-center items-start text-sm">
                <el-icon @click="normalsAdd"><Plus /></el-icon>
              </div>
            </el-col>

            <el-col :span="3" v-if=" index !== 0">
              <div class="mt-1 flex justify-center items-start text-sm">
                <el-icon @click="normalsDelete(index)" @change="paramerDelFlag(item)"><Minus /></el-icon>
              </div>
            </el-col>
          </el-row>

     </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormNormal">确 定</el-button>
          <el-button @click="cancelNormal">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 重新发货对话框 -->
    <el-drawer :title="drawerRestart.title" v-model="drawerRestart.visible" width="600px" destroy-on-close="true">
      <el-form ref="orderBackInventoryRecordFormRef" :model="formRestart" :rules="rulesRestart" label-width="80px">
        <el-form-item label="订单号" prop="originNo">
          <el-input v-model="formRestart.originNo" disabled placeholder="订单号" />
        </el-form-item>
        <el-form-item label="产品编码" prop="dataCode">
          <el-input v-model="formRestart.dataCode" disabled placeholder="产品编码" />
        </el-form-item>
        <el-form-item label="产品名称" prop="dataName">
          <el-input v-model="formRestart.dataName" disabled placeholder="产品名称" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="formRestart.version" disabled placeholder="版本" />
        </el-form-item>
        <el-form-item label="板材" prop="board">
          <el-input v-model="formRestart.board" disabled placeholder="板材" />
        </el-form-item>
        <el-form-item label="地址" prop="address" :rules="{ required: true, message: '库位不能为空', trigger: 'change' }">
          <el-select v-model="formRestart.address" clearable :collapse-tags="true" filterable style="width: 100%;"
                     placeholder="请选择地址">
            <el-option
              v-for="item in BaseAddress"
              :key="item.id"
              :label="item.address"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发货数量" prop="deliverQuantity" :rules="{ required: true, message: '发货数量不能为空', trigger: 'change' }">
          <el-input v-model="formRestart.deliverQuantity" placeholder="发货数量" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormRestart">确 定</el-button>
          <el-button @click="cancelRestart">取 消</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 处理记录对话框-->
    <el-drawer :title="drawerRecord.title" v-model="drawerRecord.visible" width="600px" size="55%" destroy-on-close="true">
      <el-form ref="orderBackInventoryRecordFormRef" :model="formRecord" :rules="rulesRecord" label-width="180px">
        <el-divider content-position="left">报废出库</el-divider>
        <el-table v-loading="loading" :data="dataScrap1.commodityScrapVos">
          <el-table-column width="55" align="center" />
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="库存记录编码" align="center" prop="code" />
          <el-table-column label="报废数量" align="center" prop="quantity" />
          <el-table-column label="报废工序" align="center" prop="process" />
          <el-table-column label="责任人" align="center" prop="responsible" />
          <el-table-column label="操作人" align="center" prop="updateByName" />
          <el-table-column label="操作时间" align="center" prop="updateTime" />
        </el-table>

        <el-divider content-position="left">正常品出库</el-divider>
        <el-table v-loading="loading" :data="dataScrap1.commodityInOutRecordVos">
          <el-table-column width="55" align="center" />
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="入库编码" align="center" prop="code" />
          <el-table-column label="入库数量" align="center" prop="quantity" />
          <el-table-column label="操作人" align="center" prop="updateByName" />
          <el-table-column label="操作时间" align="center" prop="updateTime" />
          <el-table-column label="库位信息" align="center" prop="storageId" />
        </el-table>

        <el-divider content-position="left">重新发货</el-divider>
        <el-table v-loading="loading" :data="dataScrap1.deliveryRecordVos">
          <el-table-column width="55" align="center" />
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="库存记录编码" align="center" prop="code" />
          <el-table-column label="发货数量" align="center" prop="quantity" />
          <el-table-column label="操作人" align="center" prop="updateByName" />
          <el-table-column label="操作时间" align="center" prop="updateTime" />
        </el-table>
      </el-form>
    </el-drawer>


  </div>
</template>

<script setup name="OrderBackInventory" lang="ts">
import {
  listOrderBackInventory,
  getOrderBackInventory,
  delOrderBackInventory,
  addOrderBackInventory,
  updateOrderBackInventory
} from "@/api/inventory/orderBackInventory";
import {
  OrderBackInventoryVO,
  OrderBackInventoryQuery,
  OrderBackInventoryForm
} from "@/api/inventory/orderBackInventory/types";
import {
  OrderBackInventoryRecordVO,
  OrderBackInventoryRecordQuery,
  OrderBackInventoryRecordForm
} from "@/api/inventory/orderBackInventoryRecord/types";
import { ElTable } from "element-plus";
import {
  addOrderBackInventoryRecord,
  getOrderBackRecordByNo,
  listOrderBackInventoryRecord,
  listOrderBackInventoryRecord1,
  updateOrderBackInventoryRecord
} from "@/api/inventory/orderBackInventoryRecord";
import {VXETable, VxeTableInstance} from "vxe-table";
import {VxeTablePropTypes} from "vxe-table";
import { deepClone } from '@/utils'
import {UserVO} from "@/api/system/user/types";
import {listUserByRoleKey} from "@/api/system/user";
import {getBaseStorage, getSysUser} from "@/api/system/config";
import {getListAddress} from "@/api/basedata/address";
import {getCraftList} from "@/api/basedata/craft";
import {CraftVO} from "@/api/basedata/craft/types";

const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const orderBackInventoryRecordList = ref<OrderBackInventoryRecordVO[]>([]);
const orderBackInventoryList = ref<OrderBackInventoryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const editableTabsValue = ref(0);
const queryFormRef = ref<ElFormInstance>();
const orderBackInventoryFormRef = ref<ElFormInstance>();

const fomrNormalRef = ref()
const orderBackInventoryRecordFormRef = ref<ElFormInstance>();

let craftOptions=ref<CraftVO[]>([]);
let SysUserOptions=ref<CraftVO[]>([]);
let BaseAddress=ref<CraftVO[]>([]);
let BaseStorage=ref<CraftVO[]>([]);


const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  BaseStorage.value = res.data;
};

getListBaseStorage();

const getListCraft = async () => {
  const res = await getCraftList();
  craftOptions.value = res.data;
};

getListCraft();

const getListSysUser = async () => {
  const res = await getSysUser();
  SysUserOptions.value = res;
};

getListSysUser();

const getAddress = async () => {
  const res = await getListAddress();
  BaseAddress.value = res.data;
};

getAddress();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ""
});

const initColumnList = [
  {title: '序号', field: 'sort',type:'seq', align: 'center', width: 66, sortable: true},
  {title: '退货单号', field: 'code', align: 'center', width: 120,filterType: 'input',filterParam:{ placeholder: '请输入退货单号' }},
  {title: '产品编码', field: 'dataCode', align: 'center', width: 120,filterType: 'input',filterParam:{ placeholder: '请输入产品编码' }},
  {title: '产品名称', field: 'dataName', align: 'center', width: 110,filterType: 'input',filterParam:{ placeholder: '请输入产品名称' }},
  {title: '下单数量', field: 'quantity', align: 'center', width: 130 },
  {title: '待处理数量', field: 'pendingQuantity', align: 'center', width: 66 },
  {title: '已处理数量', field: 'processedQuantity', align: 'center'},
  {title: '报废数量', field: 'scrapOutQuantity', align: 'center', },
  {title: '重新入库数', field: 'generalOutQuantity', align: 'center'},
  {title: '退货重发数', field: 'backRepairQuantity', align: 'center'},
  {title: '销售单号', field: 'saleOrderNo', align: 'center'},
  {title: '操作', field: 'make', align: 'center', minWidth: 120, showOverflow: false}
]

const finishColumnList = [
  {title: '序号', field: 'sort',type:'seq', align: 'center', width: 66, sortable: true},
  {title: '退货单号', field: 'code', align: 'center',  width: 120},
  {title: '产品编码', field: 'dataCode', align: 'center'},
  {title: '产品名称', field: 'dataName', align: 'center',},
  {title: '报废数量', field: 'scrapOutQuantity', align: 'center', },
  {title: '重新入库数', field: 'generalOutQuantity', align: 'center'},
  {title: '退货重发数', field: 'backRepairQuantity', align: 'center'},
  {title: '销售单号', field: 'saleOrderNo', align: 'center', },
  {title: '操作', field: 'make', align: 'center', minWidth: 120, showOverflow: false}
]
const mainColumnList = ref(initColumnList)

const searchChange = (params: any) => {
  queryParams.value = params
  getList1();
}

const initFormData: OrderBackInventoryForm = {
  id: undefined,
  originNo: undefined,
  originId: undefined,
  inventoryNo: undefined,
  dataName: undefined,
  dataCode: undefined,
  dataId: undefined,
  orderQuantity: undefined,
  quantity: undefined,
  generalOutQuantity: undefined,
  scrapOutQuantity: undefined,
  backRepairQuantity: undefined,
  saleOrderNo: undefined,
  remark: undefined
};
const data = reactive<PageData<OrderBackInventoryForm, OrderBackInventoryQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    originNo: undefined,
    originId: undefined,
    inventoryNo: undefined,
    dataName: undefined,
    dataCode: undefined,
    dataId: undefined,
    orderQuantity: undefined,
    quantity: undefined,
    generalOutQuantity: undefined,
    scrapOutQuantity: undefined,
    backRepairQuantity: undefined,
    saleOrderNo: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    originNo: [
      { required: true, message: "退货单号不能为空", trigger: "blur" }
    ],
    inventoryNo: [
      { required: true, message: "入库编码不能为空", trigger: "blur" }
    ],
    saleOrderNo: [
      { required: true, message: "销售单号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);






/** 查询已完成按钮传值处理 */
const handlerClick = () => {
  console.log(editableTabsValue.value);
  queryParams.value.status = editableTabsValue.value;
  getList();
  if (editableTabsValue.value == 0) {
    mainColumnList.value = initColumnList
  } else {
    mainColumnList.value = finishColumnList
  }
};

/* 处理记录*/
const drawerRecord = reactive<DrawerOption>({
  visible: false,
  title: ""
});

const initFormDataRecord: OrderBackInventoryRecordForm = {
  id: undefined,
  inventoryNo: undefined,
  sourceType: undefined,
  handleQuantity: undefined,
  operatorId: undefined,
  saleOrderDetailId: undefined,
  positionMes: undefined,
  scrapNodeName: undefined,
  scrapUser: undefined,
  scrapOutQuantity: undefined,
  status: undefined,
  returnOrderId: undefined,
  remark: undefined
};
const dataRecord = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  formRecord: { ...initFormDataRecord },
  queryParamsRecord: {
    pageNum: 1,
    pageSize: 20,
    inventoryNo: undefined,
    sourceType: undefined,
    handleQuantity: undefined,
    operatorId: undefined,
    saleOrderDetailId: undefined,
    positionMes: undefined,
    scrapNodeName: undefined,
    scrapUser: undefined,
    scrapOutQuantity: undefined,
    status: undefined,
    returnOrderId: undefined,
    params: {}
  },
  rulesRecord: {
    inventoryNo: [
      { required: true, message: "出库编码不能为空", trigger: "blur" }
    ]

  }
});

const { queryParamsRecord, formRecord, rulesRecord } = toRefs(dataRecord);


/* 正常品入库定义*/
const drawerNormal = reactive<DrawerOption>({
  visible: false,
  title: ""
});

const initFormDataNormal: OrderBackInventoryRecordForm = {
  id: undefined,
  originNo: undefined,
  status: undefined,
  scrapNodeName: undefined,
  scrapUser: undefined,
  normalInfos: [
    {
      positionMes: "",
      generalOutQuantity: ""
    }
  ]

};
const dataNormal = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  formNormal: { ...initFormDataNormal },
  queryParamsNormal: {
    pageNum: 1,
    pageSize: 20,
    positionMes: undefined,
    scrapNodeName: undefined,
    scrapUser: undefined
  },
  rulesNormal: {
    scrapNodeName: [
      { required: true, message: "正常品数量不能为空", trigger: "blur" }
    ],
    scrapUser: [
      { required: true, message: "库位不能为空", trigger: "blur" }
    ]

  }
});

const { queryParamsNormal, formNormal, rulesNormal } = toRefs(dataNormal);


/* 重新发货定义*/
const drawerRestart = reactive<DrawerOption>({
  visible: false,
  title: ""
});

const initFormDataRestart: OrderBackInventoryRecordForm = {
  id: undefined,
  originNo: undefined,
  address: undefined,
  dataName: undefined,
  dataCode: undefined,
  version: undefined,
  board: undefined,
  deliverQuantity: undefined,
  remark: undefined
};
const dataRestart = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  formRestart: { ...initFormDataRestart },
  queryParamsRestart: {
    pageNum: 1,
    pageSize: 20,
    address: undefined,
    deliverQuantity: undefined
  },
  rulesRestart: {

  }
});

const { queryParamsRestart, formRestart, rulesRestart } = toRefs(dataRestart);



/* 退货补单定义*/
const drawerReturnReplenish = reactive<DrawerOption>({
  visible: false,
  title: ""
});

const initFormDataReturnReplenish: OrderBackInventoryRecordForm = {
  id: undefined,
  orderQuantity: undefined,
  originNo: undefined,
  status: undefined,
  remark: undefined
};
const dataReturnReplenish = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  formReturnReplenish: { ...initFormDataReturnReplenish },
  queryParamsReturnReplenish: {
    pageNum: 1,
    pageSize: 20,
  },
  rulesReturnReplenish: {

  }
});

const { formReturnReplenish, queryParamsReturnReplenish, rulesReturnReplenish } = toRefs(dataReturnReplenish);





/* 退货不补定义*/
const drawerReturnNo = reactive<DrawerOption>({
  visible: false,
  title: ""
});

const initFormDataReturnNo: OrderBackInventoryRecordForm = {
  id: undefined,
  orderQuantity: undefined,
  totalQuantity: undefined,
  remark: undefined
};
const dataReturnNo = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  formReturnNo: { ...initFormDataReturnNo },
  queryParamsReturnNo: {
    pageNum: 1,
    pageSize: 20,
    inventoryNo: undefined,
    sourceType: undefined,
    scrapNodeName: undefined,
    scrapUser: undefined,
    scrapOutQuantity: undefined
  },
  rulesReturnNo: {
    orderQuantity: [
      { required: true, message: "退货数量不能为空", trigger: "blur" }
    ],

  }
});

const { formReturnNo, queryParamsReturnNo, rulesReturnNo } = toRefs(dataReturnNo);



/* 报废定义*/
const drawerScrap = reactive<DrawerOption>({
  visible: false,
  title: ""
});

const initFormDataScrap: OrderBackInventoryRecordForm = {
  id: undefined,
  scrapNodeName: undefined,
  scrapUser: undefined,
  scrapOutQuantity: undefined,
  inventoryNo: undefined,
  sourceType: undefined,
  remark: undefined
};
const dataScrap = reactive<PageData<OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery>>({
  formScrap: { ...initFormDataScrap },
  queryParamsScrap: {
    pageNum: 1,
    pageSize: 20,
    inventoryNo: undefined,
    sourceType: undefined,
    scrapNodeName: undefined,
    scrapUser: undefined,
    scrapOutQuantity: undefined
  },
  rulesScrap: {
    process: [
      { required: true, message: "报废工序不能为空", trigger: "blur" }
    ],
    responsible: [
      { required: true, message: "责任人不能为空", trigger: "blur" }
    ],
    scrapOutQuantity: [
      { required: true, message: "报废数量不能为空", trigger: "blur" }
    ]
  }
});

const { queryParamsScrap, formScrap, rulesScrap } = toRefs(dataScrap);
let recordScrapList: OrderBackInventoryRecordVO[] = [];
let recordNormalList: OrderBackInventoryRecordVO[] = [];
let recordRestartList: OrderBackInventoryRecordVO[] = [];

/** 查询退货产品处理列表 */
const getList = async () => {
  loading.value = true;
  let res = undefined;
  if (queryParams.value.status == 0) {
    res = await listOrderBackInventoryRecord1(queryParams.value);
  } else {
    res = await listOrderBackInventory(queryParams.value);
  }
  // listOrderBackInventoryRecord1
  orderBackInventoryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const getList1 = async () => {
  loading.value = true;
  let res = undefined;
  res = await listOrderBackInventoryRecord1(queryParams.value);
  orderBackInventoryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};


/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  orderBackInventoryFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OrderBackInventoryVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加退货产品处理";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderBackInventoryVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getOrderBackInventory(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改退货产品处理";
};


/** 跳转退货补单 */
const handleReturnReplenish = (row?: OrderBackInventoryVO) => {
//  const userId = row.userId;
   const saleOrderNo = row?.saleOrderNo;
  formReturnReplenish.value.status = '3';
  formReturnReplenish.value.originNo = row?.originNo;
  console.log(formReturnReplenish.value)

  addOrderBackInventoryRecord(formReturnReplenish.value);
  router.push("/order/order/directOrder/index");

}

const dataScrap1 = reactive({

  commodityScrapVos: [],
  deliveryRecordVos:[],
  commodityInOutRecordVos:[]
  })

/** 处理记录操作 */
const handleRecord = async (row: OrderBackInventoryVO) => {
  reset();
  console.log(row.status);
    await getOrderBackRecordByNo(row.id, editableTabsValue.value).then((res: any) =>{

      dataScrap1.commodityScrapVos = res.data.commodityScrapVos
      dataScrap1.deliveryRecordVos = res.data.deliveryRecordVos
      dataScrap1.commodityInOutRecordVos = res.data.commodityInOutRecordVos
      console.log(res);
      drawerRecord.visible = true;
      drawerRecord.title = "（" + row?.code + "）" +"（" + row?.dataCode + "）"+ "处理记录";;
  });
};

const restart = ref();
/** 重新发货按钮操作 */
const handleRestart = async (row?: OrderBackInventoryVO) => {
  reset();
  restart.value = row
  console.log(row)
  const _id = row?.id || ids.value[0];
  formRestart.value.status = "0";
  formRestart.value.inventoryNo = row?.inventoryNo;
  formRestart.value.saleOrderNo = row?.saleOrderNo;
  formRestart.value.originNo = row?.originNo;
  formRestart.value.dataCode = row?.dataCode;
  formRestart.value.dataName = row?.dataName;
  formRestart.value.board = row?.board;
  formRestart.value.version = "0";
  formRestart.value.orderQuantity = row?.orderQuantity;
  formRestart.value.generalOutQuantity = row?.generalOutQuantity;
  formRestart.value.scrapUser = row?.scrapUser
  formRestart.value.backType = "2";
  formRestart.value.quantity = row?.quantity;
  formRestart.value.commodityId = row?.commodityId;
  formRestart.value.id = row?.id;
  formRestart.value.deliverQuantity = row?.deliverQuantity;
  formRestart.value.scrapoutQuantity = row?.scrapoutQuantity;
  formRestart.value.backRepairQuantity = row?.backRepairQuantity;
  drawerRestart.visible = true;
  drawerRestart.title = "（" + row?.code + "）" +"（" + row?.dataCode + "）"+  "退货重发" + "（ " + row?.orderQuantity + "）";
};
/** 重新发货按钮确认提交 */
const submitFormRestart = () => {
  const count =  Number(restart.value.scrapOutQuantity) + Number(restart.value.generalOutQuantity) + Number(restart.value.backRepairQuantity)
    if (formRestart.value.deliverQuantity == 0){
      ElMessage.error("重新发货数量不能为0");
      return;
    }
    if (Number(restart.value.quantity) < count + Number(formRestart.value.deliverQuantity) ){
    ElMessage.error("重新发货数量超过要处理的数量");
    return;
  }
    updateOrderBackInventoryRecord(formRestart.value).then(res =>{
    formRestart.value.status = '2';
    drawerRestart.visible = false;
    proxy?.$modal.msgSuccess("操作成功");
    getList();
  });
};
/** 重新发货按钮取消 */
const cancelRestart = () => {
  reset();
  drawerRestart.visible = false;
};


/**
 * 正常入库新增库位按钮
 */
const normalsAdd = () => {
  const obj = {
    positionMes: "",
    generalOutQuantity: ""
  };
  formNormal.value.normalInfos.push(obj);
};

/**
 * 正常入库删除库位按钮
 */
const normalsDelete = (index: number) => {
  formNormal.value.normalInfos.splice(index, 1);
};

/** 编辑库位删除的标记 */
const paramerDelFlag = (item: any) => {
  const obj = {
    positionMes: item.positionMes,
    generalOutQuantity: item.generalOutQuantity,
    id: item.id
  };
};
const restartStroge = ref();
/** 正常品入库按钮操作 */
const handleNormal = async (row?: OrderBackInventoryVO) => {
  // reset();
  restartStroge.value = row
  console.log(row)
  const _id = row?.id || ids.value[0];
  formNormal.value.status = "0";
  formNormal.value.inventoryNo = row?.inventoryNo;
  formNormal.value.saleOrderNo = row?.saleOrderNo;
  formNormal.value.inventoryNo = row?.inventoryNo;
  formNormal.value.saleOrderNo = row?.saleOrderNo;
  formNormal.value.originNo = row?.originNo;
  formNormal.value.dataCode = row?.dataCode;
  formNormal.value.dataName = row?.dataName;
  formNormal.value.saleOrderId = row?.saleOrderId;
  formNormal.value.board = row?.board;
  formNormal.value.version = "0";
  formNormal.value.orderQuantity = row?.orderQuantity;
  formNormal.value.generalOutQuantity = row?.generalOutQuantity;
  formNormal.value.scrapOutQuantity = row?.scrapOutQuantity;
  formNormal.value.backType = "3";
  formNormal.value.quantity = row?.quantity;
  formNormal.value.commodityId = row?.commodityId;
  formNormal.value.id = row?.id
  drawerNormal.visible = true;
  drawerNormal.title = "（" + row?.code + "）" +"（" + row?.dataCode + "）"+ "重新入库";
};
/** 正常品入库按钮确认提交 */
const submitFormNormal = () => {

  let count = 0;
  formNormal.value.normalInfos.map((v: any) => {
    count +=  Number(v.generalOutQuantity);
  })
  if (count == 0){
    ElMessage.error("重新入库的数量不能为0");
    return;
  }
  if (Number(restartStroge.value.pendingQuantity) < count){
    ElMessage.error("重新入库的数量超过要处理的数量");
    return;
  }
  fomrNormalRef.value?.validate(async (valid: boolean) => {
    const param = deepClone(formNormal.value)
    console.log('-----',param);
    param.status = '0';
    if (valid) {
      // formNormal.value.originNo ? await updateOrderBackInventoryRecord(formNormal.value) : await addOrderBackInventoryRecord(formNormal.value);
      await updateOrderBackInventoryRecord(param);
      proxy?.$modal.msgSuccess("操作成功");
      drawerNormal.visible = false;
      await getList();
    }
  });
};

/** 正常品入库按钮取消 */
const cancelNormal = () => {
  reset();
  drawerNormal.visible = false;
};



/** 退货不补按钮取消 */
const cancelReturnNo = () => {
  reset();
  drawerReturnNo.visible = false;
};


const baofei = ref();
/** 报废按钮操作 */
const handleScrap = (row?: OrderBackInventoryVO) => {
  reset();
  baofei.value = deepClone(row)
  drawerScrap.visible = true;
  drawerScrap.title = "（" + row?.code + "）"+"（" + row?.dataCode + "）"+  "报废出库" + "（ " + row?.orderQuantity + "）";
  formScrap.value = deepClone(row)
};
/** 报废按钮确认提交 */
const submitFormScrap = () => {
  orderBackInventoryRecordFormRef.value?.validate(async (valid: boolean) => {
    formScrap.scrapOutQuantity
    console.log(baofei)
    const test = Number(baofei.value.scrapOutQuantity) + Number(baofei.value.generalOutQuantity) + Number(baofei.value.backRepairQuantity);
    if (Number(formScrap.value.scrapOutQuantity) == 0){
      ElMessage.error("报废数量不能为0");
      return;
    }
    if (Number(baofei.value.quantity) < test + Number(formScrap.value.scrapOutQuantity)){
      ElMessage.error("下单数量超过要处理的数量");
      return;
    }
    if (valid) {
      console.log(formScrap.value);
      formScrap.value.status = '1';
      formScrap.value.originNo ? await updateOrderBackInventoryRecord(formScrap.value) : await addOrderBackInventoryRecord(formScrap.value);
      proxy?.$modal.msgSuccess("操作成功");
      drawerScrap.visible = false;
      await getList();
    }
  });
};
/** 报废按钮取消 */
const cancelScrap = () => {
  reset();
  drawerScrap.visible = false;
};


/** 提交按钮 */
const submitForm = () => {
  orderBackInventoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrderBackInventory(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addOrderBackInventory(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: OrderBackInventoryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm("是否确认删除退货产品处理编号为\"" + _ids + "\"的数据项？").finally(() => loading.value = false);
  await delOrderBackInventory(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("system/orderBackInventory/export", {
    ...queryParams.value
  }, `orderBackInventory_${new Date().getTime()}.xlsx`);
};

onMounted(() => {
  handlerClick();
  // getList();
});
</script>

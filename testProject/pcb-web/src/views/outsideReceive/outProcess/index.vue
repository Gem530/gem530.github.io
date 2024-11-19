<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-if="checkPermi(['outsideReceive:outProcess:list'])" v-model="editableTabsValue" @tab-change="getVoidedList()" type="border-card" class="xtable-tab">
<!--        <el-tab-pane label="待接单" :name="1">-->
<!--          <XTable toolId="waitOutSourceOrderTable" v-model:page-size="waitQueryParams.pageSize"-->
<!--                  v-model:current-page="waitQueryParams.pageNum" height="100%" class="xtable-content"-->
<!--                  :page-params="{ perfect: true, total: waitTotal }" :data="waitOrderList" :columnList="waitColumnList"-->
<!--                  ref="XTableRef" @toggle-row-expand="toggleExpandChangeEvent" border :showRefresh="true"-->
<!--                  :intervalCondition="['orderTime','quantity']"-->
<!--                  @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"-->
<!--                  :loading="waitLoading"-->
<!--          >-->
<!--            <template #default-status="scope">-->
<!--              {{ statusList.find(item => item.value == scope.row.status)?.label }}-->
<!--            </template>-->
<!--            <template #content-expand="{ row }">-->
<!--              <div class="expand-wrapper">-->
<!--                <XTable :pageShow="false" :showHead="false" max-height="500px" :data="row.detailList" :columnList="waitDetailColumnList">-->
<!--                  <template #default-unit="scope">-->
<!--                    {{ unitList.find(item => item.value == scope.row.unit)?.label }}-->
<!--                  </template>-->
<!--                </XTable>-->
<!--              </div>-->
<!--            </template>-->
<!--          </XTable>-->

<!--        </el-tab-pane>-->

        <el-tab-pane label="按加工单展示" :name="2">
          <div class="p-2 global-flex flex-end" style="text-align: right;width: 100%">
            <el-button v-if="checkPermi(['outsideReceive:outProcess:add'])" :loading="buttonLoading" type="primary" @click="handleAdd">新增外协加工单</el-button>
            <el-button v-if="checkPermi(['outsideReceive:outProcess:export'])" :loading="buttonLoading" type="primary" @click="handleExport">导出</el-button>
          </div>
          <XTable toolId="outSourceOrderTable" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
                  :page-params="{ perfect: true, total: total }" :data="dateList" :columnList="columnList"
                  ref="XTableRef" @toggle-row-expand="toggleExpandChangeEvent" border :showRefresh="true"
                  :intervalCondition="['orderTime','quantity']"
                  @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :loading="loading"
          >
            <template #default-status="scope">
              {{ statusList.find(item => item.value == scope.row.status)?.label }}
            </template>
            <template #content-expand="{ row }">
              <div class="expand-wrapper">
                <XTable :pageShow="false" :showHead="false" max-height="500px" :data="row.detailList" :columnList="detailColumnList">
                  <template #default-unit="scope">
                    {{ unitList.find(item => item.value == scope.row.unit)?.label }}
                  </template>
                </XTable>
              </div>
            </template>

            <template #default-make="scope">
              <el-button link type="primary" @click="handleFile(scope.row)">凭证</el-button>
              <el-button link v-if="checkPermi(['outsideReceive:outProcess:change']) && ['1', '2'].includes(scope.row.status)" type="primary" @click="handleTransfer(scope.row)">转单</el-button>
              <el-dropdown trigger="click" style="margin-left:12px;padding-top: 3px">
                <el-button link type="primary">更多
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="checkPermi(['outsideReceive:outProcess:update'])" link class="button_morn" type="primary" @click="handleEdit(scope.row)">
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item link class="button_morn" type="primary" v-if="checkPermi(['outsideReceive:outProcess:delete']) && scope.row.status == '1'" @click="handleDelete(scope.row)">
                      删除
                    </el-dropdown-item>
<!--                    <el-dropdown-item link class="button_morn" type="primary" @click="handleAdjustRecord(scope.row)">-->
<!--                      打印-->
<!--                    </el-dropdown-item>-->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>

          </XTable>
        </el-tab-pane>

        <el-tab-pane label="按产品展示" :name="3">
          <div class="p-2 global-flex flex-end" style="text-align: right;width: 100%;">
            <div class="totalTitle">接单数量合计：{{detailCount.quantityCount}}&nbsp;&nbsp;|&nbsp;&nbsp; 接单面积合计(㎡)：{{detailCount.areaCount}}&nbsp;&nbsp;
              |&nbsp;&nbsp; 发货数量合计：{{detailCount.deliverCount}}&nbsp;&nbsp;|&nbsp;&nbsp; 发货面积合计(㎡)：{{detailCount.deliverAreaCount}}</div>
            <el-button :loading="buttonLoading" type="primary" @click="handleDetailExport">导出</el-button>
          </div>
          <XTable toolId="outSourceOrderDetailTable" v-model:page-size="detailQueryParams.pageSize"
                  v-model:current-page="detailQueryParams.pageNum" height="100%" class="xtable-content"
                  :page-params="{ perfect: true, total: detailTotal }" :data="detailList" :columnList="detailTableColumnList"
                  ref="detailTableRef" border :showRefresh="true"
                  :intervalCondition="['createTime', 'length', 'width', 'quantity', 'waitProcessQuantity', 'processQuantity', 'waitDeliverQuantity', 'deliverQuantity', 'startTime', 'finishTime']"
                  @searchChange="detailSearchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :loading="loading"
          >
            <template #default-unit="scope">
              {{ unitList.find(item => item.value == scope.row.unit)?.label }}
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="70%">
      <el-form ref="sourceOrderFormRef" :model="form" :rules="rules" label-width="120px" label-position="right" v-loading="drawerLoading">

        <el-collapse v-model="activeNames" >
          <el-collapse-item title="基本信息" name="1">
            <el-row>
              <el-col :span="7">
                <el-form-item label="客户：" prop="customerId">
                  <el-select style="width: 100%" v-model="form.customerId" :disabled="dialog.title !== '新增外协加工单'"
                             filterable default-first-option>
                    <el-option v-for="customer in customerList" :key="customer.id" :label="customer.customerName" :value="customer.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="客户订单号：" prop="orderCode">
                  <el-input style="width: 100%" v-model="form.orderCode" maxlength="100" :disabled="dialog.title == '外协加工转单'"/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="创建人："  prop="orderByName">
                  <el-input style="width: 100%" v-model="form.orderByName" :disabled="true"/>
                </el-form-item>
              </el-col>

              <el-col :span="7">
                <el-form-item label="创建时间：" prop="orderTime">
                  <el-input v-model="form.orderTime" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>

          <el-collapse-item title="加工明细" name="2">
            <el-row  style="width:100%;display: flex;justify-content: end;">
              <el-button v-if="!dialog.title?.includes('转单')"  type="primary" @click="handleAddDetail">添加明细</el-button>
            </el-row>
            <XTable v-if="!dialog.title?.includes('转单')" :pageShow="false" max-height="200px" class="xtable-content" :data="editDetailList"
                    :show-footer="false" :columnList="editDetailColumnList" ref="addressTableRef" :row-config="{ keyField:'id' }" border
                    :column-config="{ resizable: true }"
            >

              <template #default-unit="scope">
                {{ unitList.find(item => item.value == scope.row.unit)?.label }}
              </template>
              <template #default-craftName="scope">
                {{ craftList.find(item => item.id == scope.row.outSourceCraftId)?.name }}
              </template>
              <template #default-processDeptName="scope">
                {{ deptList.find(item => item.deptId == scope.row.processDeptId)?.deptName }}
              </template>
              <template #default-make="scope">
                <el-button link type="primary" @click="handleEditDetail(scope.row)">编辑</el-button>
                <el-button v-if="!(scope.row.processQuantity && Number(scope.row.processQuantity) > 0)" link type="primary" @click="handleRemove(scope.row)">移除</el-button>
              </template>
            </XTable>

            <!-- 转单Table -->
            <div v-if="dialog.title?.includes('转单')" class="p-2" style="font-weight: 600; margin-bottom: -20px; margin-top: -10px">
              <span style="color: rgba(93, 125, 179, 1);">*仅展示未加工完成的产品型号</span>
            </div>
            <XTable v-if="dialog.title?.includes('转单')" :pageShow="false" max-height="200px" class="xtable-content" :data="editDetailList"
                    :show-footer="false" :columnList="transferColumnList" ref="addressTableRef" border
                    :column-config="{ resizable: true }">

              <template #default-unit="scope">
                {{ unitList.find(item => item.value == scope.row.unit)?.label }}
              </template>
              <template #default-processDeptName="scope">
                <el-select v-model="scope.row.processDeptId" placeholder="请选择" filterable>
                  <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName"
                             :value="item.deptId" />
                </el-select>
              </template>
            </XTable>

          </el-collapse-item>

          <el-collapse-item title="凭证信息" name="3" style="text-align: end;">
            <XUpload v-model:model-value="form.files"  model="download" style="text-align: end;"
                     :multiple="true" :show-file-list="false" @fileChange="fileChange"  v-loading="dialogTableLoading">
              <div class="global-flex">
                <span style="color: #b6b6b6;margin-right: 5px;">支持批量上传，格式不限</span><el-button type="primary">上传文件</el-button>
              </div>
            </XUpload>

            <XTable :pageShow="false" class="xtable-content" :loading="eqloading" :data="fileList"
                    :show-footer="false" :columnList="eqfileColumnList" ref="fileleteTableRef6" border
                    :column-config="{ resizable: true }"
            >

              <template #default-make="scope">
                <el-button v-if="imgType.includes(scope.row.type)" link type="primary" @click="preview(scope.row)">预览</el-button>
                <el-button link type="primary" :text="true" @click="delFile(scope.row)">删除</el-button>
                <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
              </template>
            </XTable>
          </el-collapse-item>

        </el-collapse>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="text-align: center" v-if="!drawerLoading">
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button v-if="dialog.title=='新增外协加工单'" :loading="buttonLoading" type="primary" @click="submitForm">确认新增</el-button>
          <el-button v-if="dialog.title=='编辑外协加工单'" :loading="buttonLoading" type="primary" @click="submitForm">保存修改</el-button>
          <el-button v-if="dialog.title=='外协加工转单'" :loading="buttonLoading" type="primary" @click="submitTransfer">确认转单</el-button>

        </div>
      </template>
    </el-drawer>

    <!-- 添加明细对话框 -->
    <el-dialog class="custom-dialog" :title="detailDialog.title" v-model="detailDialog.visible" width="38%" destroy-on-close>
      <el-form ref="orderDetailFormRef" :model="detailForm" :rules="detailRules" label-width="120px">
        <el-form-item prop="commodityCode" label="产品型号">
          <el-input style="width: 100%;" maxlength="100" v-model="detailForm.commodityCode" />
        </el-form-item>

        <el-form-item required label="长*宽(㎜)">

          <el-col :span="11">
          <el-form-item prop="length">
            <XInputNumber style="width: 100%;" :controls="false" type="number" :min="0" v-model="detailForm.length" :precision="2"></XInputNumber>
          </el-form-item>
          </el-col>
          <el-col :span="2">
            <span style="display: flex !important;justify-content: center;align-items: center; !important">
              X
            </span>
          </el-col>
          <el-col :span="11">
          <el-form-item prop="width">
            <XInputNumber style="width: 100%;" :controls="false" type="number" :min="0" v-model="detailForm.width" :precision="2"></XInputNumber>
          </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item required label="数量">
          <el-col :span="18">
            <el-form-item prop="quantity">
              <XInputNumber style="width: 100%;" :controls="false" type="number" :min="0" v-model="detailForm.quantity" :precision="0"></XInputNumber>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="unit">
              <el-select v-model="detailForm.unit" placeholder="请选择单位" filterable>
                <el-option v-for="item in unitList" :key="item.value" :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="outSourceCraftId" label="加工工序">
          <el-select style="width: 100%;" v-model="detailForm.outSourceCraftId" placeholder="请选择加工工序" @change="craftChange" filterable>
            <el-option v-for="item in craftList" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="calcRuleId" label="加工要求">
          <el-select style="width: 100%;" v-model="detailForm.calcRuleId" placeholder="请选择加工要求" filterable>
            <el-option v-for="item in reqList"  :label="item.ruleName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-row v-for="(item, index) in detailForm.requirement" :key="item.id">
          <el-col :span="24">
          <el-form-item class="custom-form-hide" :prop="'requirement.' + index + '.values'" required :label="item.name + ':'" :rules="[
            {
              required: true,
              message: item.name + '不能为空',
              trigger: ['blur','change'],
            },
          ]">
            <template #label>
              <span style="color: #f56c6c;margin-right:4px">*</span>
              <el-tooltip v-if="item.name && item.name.length > 6" placement="top" :content="item.name">
                <span class="custom-span">{{item.name}}</span>
              </el-tooltip>
              <span  v-else><span class="custom-span">{{item.name}}</span> </span>
            </template>
            <!-- 单选 -->
            <el-radio-group v-if="item.type == '5'" v-model="item.values">
              <el-radio v-for="(itemOption, index) in item.options" :key="index" :label="itemOption"
                        :value="itemOption">
                {{itemOption}}
              </el-radio>
            </el-radio-group>
            <!-- 多选 -->
            <el-checkbox-group v-if="item.type == '6'" v-model="item.values">
              <el-checkbox v-for="(itemOption, index) in item.options" :key="index" :label="itemOption"
                           :value="itemOption">
              </el-checkbox>
            </el-checkbox-group>
            <!-- 下拉选择 -->
            <el-select style="width: 100%;" v-if="item.type == '8'" v-model="item.values" :placeholder="'请选择' + item.name" clearable
                       filterable transfer popup-class-name="pop-select">
              <el-option v-for="itemOption in item.options" :key="itemOption" :label="itemOption"
                         :value="itemOption" />
            </el-select>
            <!-- 文本 -->
            <el-input style="width: 100%;" v-if="item.type == '4'" v-model="item.values" :placeholder="'请输入' + item.name" clearable />
            <!-- 多行文本 -->
            <el-input v-if="item.type == '2'" v-model="item.values" :placeholder="'请输入' + item.name" clearable
                      style="width: 100%;" type="textarea" />
            <!-- 开关 -->
            <el-switch v-if="item.type == '7'" size="small" v-model="item.values" active-value="true"
                       inactive-value="false" />
            <!-- 数字 -->
            <el-input v-if="item.type == '1'" class="number-left width-100" type="number" v-model="item.values" placeholder="请输入" precision="2"
                      :controls="false"  min="0.01" max="99999999.99">
              <template #append>{{item.unit}}</template>
            </el-input>
            <!-- 时间 -->
            <el-date-picker class="width-100" v-if="item.type == '3'" v-model="item.values"  type="datetime"
              placeholder="请选择时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="processDeptId" label="加工部门">
          <el-select style="width: 100%;" v-model="detailForm.processDeptId" placeholder="请选择加工部门" filterable>
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName"
                       :value="item.deptId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input style="width: 100%" maxlength="200" v-model="detailForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="closeDetail">取消</el-button>
          <el-button v-if="detailDialog.title.includes('编辑')" :loading="recordAddButtonLoading" type="primary" @click="saveEditDetail">保存修改</el-button>
          <el-button v-if="detailDialog.title.includes('添加')" :loading="recordAddButtonLoading" type="primary" @click="saveDetail">保存</el-button>
          <el-button v-if="detailDialog.title.includes('添加')" :loading="recordAddButtonLoading" type="primary" @click="saveAddDetail">保存并添加</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 凭证对话框 -->
    <el-dialog :title="fileDialog.title" v-model="fileDialog.visible" width="45%" destroy-on-close>
      <XUpload v-model:model-value="form.files" model="download" style="text-align: end;"
               :multiple="true" :show-file-list="false" @fileChange="fileChange"  v-loading="dialogTableLoading">
        <div class="global-flex">
          <span style="color: #b6b6b6;margin-right: 5px;">支持批量上传，格式不限</span><el-button type="primary">上传文件</el-button>
        </div>
      </XUpload>

      <XTable :pageShow="false" class="xtable-content" :loading="eqloading" :data="fileList"
              :show-footer="false" :columnList="eqfileColumnList" ref="fileListTableRef" border
              :column-config="{ resizable: true }"
      >

        <template #default-make="scope">
          <el-button v-if="imgType.includes(scope.row.type)" link type="primary" @click="preview(scope.row)">预览</el-button>
          <el-button link type="primary" :text="true" @click="delFile(scope.row)">删除</el-button>
          <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
        </template>
      </XTable>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="fileDialog.visible = false">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitFile">确认添加</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <FileView ref="fileViewRef"></FileView>
  </div>
</template>

<script setup name="OutProcess" lang="ts">
import {
  getSourceProcessOrder
} from '@/api/outsource/sourceProcessOrder';
import {
  SourceProcessOrderVO,
} from '@/api/outsource/sourceProcessOrder/types';
import {VxeTableEvents} from 'vxe-table'
import {ref} from "vue";
import useUserStore from "@/store/modules/user";
import {CraftQuery} from "@/api/basedata/craft/types";
import {CommodityForm} from "@/api/order/commodity/types";
import dayjs from "dayjs";
import {checkPermi} from "@/utils/permission";
import {deepClone} from "@/utils";
import {SourceOrderForm, SourceOrderQuery, SourceOrderVO} from "@/api/outsource/sourceOrder/types";
import {
  addSourceOrder,
  delSourceOrder,
  getSourceOrder,
  listSourceOrder, transferSourceOrder,
  updateSourceOrder, updateSourceOrderFiles
} from "@/api/outsource/sourceOrder";
import {getListCustomer} from "@/api/basedata/customer";
import {CustomerVO} from "@/api/basedata/customer/types";
import {
  SourceOrderDetailForm,
  SourceOrderDetailQuery,
  SourceOrderDetailVO
} from "@/api/outsource/sourceOrderDetail/types";
import {listOwnerDept} from "@/api/system/dept";
import {listOutSourceCountConfig} from "@/api/outsource/sourceHalfCountAttr";
import { downloadUrl, listContractFiles} from "@/api/upload";
import fileSaver from "file-saver";
import {countOrderDetail, listSourceOrderDetail, verifySourceOrderRule} from "@/api/outsource/sourceOrderDetail";
import {getCalcRuleDetail, listSourceHalfProcessCalcRule} from "@/api/outsource/outProcessRule";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const waitOrderList = ref<SourceOrderVO[]>([]);
const dateList = ref<SourceOrderVO[]>([]);
const detailList = ref<SourceOrderDetailVO[]>([]);
const editDetailList = ref<SourceOrderDetailVO[]>([]);
const detailCount = ref({
  quantityCount:0,
  areaCount:0,
  deliverCount:0,
  deliverAreaCount:0
});

const customerList = ref<CustomerVO[]>([]);
const deptList = ref<any[]>([])
const craftList = ref<any[]>([])
const reqList = ref<any[]>([])
const fileList = ref<any[]>([])
const delFileIds = ref<any[]>([])

const buttonLoading = ref(false);
const recordAddButtonLoading = ref(false);

const isEdit = ref(false);

const waitLoading = ref(false);
const loading = ref(false);
const drawerLoading = ref(false);
const eqloading = ref(false);

const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);

const waitTotal = ref(0);
const total = ref(0);
const detailTotal = ref(0);

const activeNames = ref(['1','2','3']);

const imgType = ref(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']);

const queryFormRef = ref<ElFormInstance>();
const sourceOrderFormRef = ref<ElFormInstance>();
const orderDetailFormRef = ref<ElFormInstance>();
const fileViewRef = ref<ElFormInstance>();

const tableRef = ref()

const editableTabsValue = ref(2);

/*弹窗属性*/
declare interface DialogOption {
  title?: string;
  visible: boolean;
}

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const detailDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const fileDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
/*新增编辑抽屉*/
const dialogTableLoading = ref(false)

const validatePass = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('长和宽不能为空'))
  } else if (Number(value) <= 0) {
    callback(new Error('请输入大于0的数字'))
  } else {
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('数量不能为空'))
  } else if (Number(value) <= 0) {
    callback(new Error('请输入大于0的数字'))
  } else {
    callback()
  }
}


const initFormData: SourceOrderForm = {
  id: undefined,
  ownerId: undefined,
  code: undefined,
  customerId: undefined,
  orderCode: undefined,
  status: undefined,
  remark: undefined,
  outSourceHalfBizId: undefined
}
const data = reactive<PageData<SourceOrderForm, SourceOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    customerName: undefined,
    quantity: undefined,
    createByName: undefined,
    createTime: undefined,
  },
  rules: {
    customerId: [
      {required: true, message: "客户不能为空", trigger: "blur"}
    ],
  }
});

const waitData = reactive<PageData<SourceOrderForm, SourceOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    customerName: undefined,
    quantity: undefined,
    createByName: undefined,
    createTime: undefined,
  },
  rules: {}
});


const initDetailFormData: SourceOrderDetailForm = {
  id: undefined,
  ownerId: undefined,
  outSourceOrderId: undefined,
  commodityCode: undefined,
  length: undefined,
  width: undefined,
  quantity: undefined,
  unit: '2',
  outSourceCraftId: undefined,
  processDeptId: undefined,
  requirement: undefined,
  remark: undefined
}

const detailData = reactive<PageData<SourceOrderDetailForm, SourceOrderDetailQuery>>({
  form: {...initDetailFormData},
  queryParams: {},
  rules: {
    commodityCode: [
      {required: true, message: "产品型号不能为空", trigger: "blur"}
    ],
    outSourceCraftId: [
      {required: true, message: "加工工序不能为空", trigger: "blur"}
    ],
    processDeptId: [
      {required: true, message: "加工部门不能为空", trigger: "blur"}
    ],
    customerId: [
      {required: true, message: "客户不能为空", trigger: "blur"}
    ],
    length: [
      {required: true, validator: validatePass, trigger: "blur"}
    ],
    width: [
      {required: true, validator: validatePass, trigger: "blur"}
    ],
    quantity: [
      {required: true, validator: validatePass2, trigger: "blur"}
    ],
    unit: [
      {required: true, message: "单位不能为空", trigger: "blur"}
    ],
    calcRuleId: [
      {required: true, message: "加工要求不能为空", trigger: "blur"}
    ],
  },
});

const carftData = reactive<PageData<CommodityForm, CraftQuery>>({
  form: {...initFormData},
  queryParams: {
    craftId: "",
  },
  rules: {}
});

const {queryParams: carftQueryParams} = toRefs(carftData);

const XTableRef = ref()

const detailTableRef = ref()

const statusList = ref([
  { label: '待加工', value: "1" },
  { label: '部分加工', value: "2" },
  { label: '待发货', value: "3" },
  { label: '部分发货', value: "4" },
  { label: '已发货', value: "5" },
  { label: '待接单', value: "6" },
]);

const unitList = ref([
  { label: 'PNL', value: "2" },
  { label: 'SET', value: "3" },
  { label: '大料', value: "1" },
]);


const waitColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', },
  { field: "expand", type: 'expand', width: '40', align: 'center' },
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' } },
  { title: '状态', field: 'status', align: 'center', minWidth: '80', filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => statusList.value },
  { title: '客户名称', minWidth: '120', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '接单数量', minWidth: '70', field: 'quantity', align: 'center', },
  { title: '创建人', field: 'orderByName',  minWidth: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '创建时间', field: 'orderTime',  minWidth: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '操作', field: 'make', align: 'center', width: '120', fixed: 'right', },
]);

const waitDetailColumnList = ref([
  { title: '产品型号', minWidth: '140', field: 'commodityCode', align: 'center', },
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100',  },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , },
  { title: '接单数量', minWidth: '100', field: 'quantity', align: 'center' , },
  { title: '接单总面积(㎡)', minWidth: '120', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center',  },
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', },
  { title: '加工要求', field: 'make', align: 'center', minWidth: '120', },
]);

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', },
  { field: "expand", type: 'expand', width: '40', align: 'center' },
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' } },
  { title: '客户订单号', minWidth: '120', field: 'orderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户订单号' } },
  { title: '客户名称', minWidth: '120', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '状态', field: 'status', align: 'center', minWidth: '80', filterType: 'radio', filterParam: { placeholder: '请输入状态' }, filterData: () => statusList.value },
  { title: '接单数量', minWidth: '70', field: 'quantity', align: 'center', },
  { title: '接单/创建人', field: 'orderByName', minWidth: '80',align: 'center', filterType: 'input', filterParam: { placeholder: '' },  },
  { title: '接单/创建时间', field: 'orderTime', minWidth: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right', },
]);

const detailColumnList = ref([
  { title: '产品型号', minWidth: '130', field: 'commodityCode', align: 'center', },
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '60',  },
  { title: '宽(㎜)', minWidth: '60', field: 'width', align: 'center' , },
  { title: '接单数量', minWidth: '60', field: 'quantity', align: 'center' , },
  { title: '接单总面积(㎡)', minWidth: '90', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '50',align: 'center',  },
  { title: '加工部门', field: 'processDeptName',  minWidth: '100',align: 'center', },
  { title: '待加工', field: 'waitProcessQuantity',  minWidth: '60',align: 'center', },
  { title: '已加工', field: 'processQuantity',  minWidth: '60',align: 'center', },
  { title: '待发货', field: 'waitDeliverQuantity',  minWidth: '60',align: 'center', },
  { title: '已发货', field: 'deliverQuantity',  minWidth: '60',align: 'center', },
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', },
  { title: '加工要求', field: 'requirementQuery', align: 'center', minWidth: '180', },
  { title: '备注', field: 'remark', align: 'center', minWidth: '120', },
  { title: '开始加工时间', field: 'startTime', align: 'center', minWidth: '130', },
  { title: '完成加工时间', field: 'finishTime', align: 'center', minWidth: '130', },
]);

const editDetailColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', fixed: 'left', },
  { title: '产品型号', minWidth: '140', field: 'commodityCode', align: 'center', },
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100',  },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , },
  { title: '接单数量', minWidth: '100', field: 'quantity', align: 'center' , },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center',  },
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', },
  { title: '加工要求', field: 'requirementQuery', align: 'center', minWidth: '120', },
  { title: '备注', field: 'remark', align: 'center', minWidth: '120', },
  { title: '加工部门', field: 'processDeptName',  minWidth: '110',align: 'center', fixed: 'right',},
  { title: '操作', field: 'make', align: 'center', width: '100', fixed: 'right', },
]);

const transferColumnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', fixed: 'left', },
  { title: '产品型号', minWidth: '140', field: 'commodityCode', align: 'center', },
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100',  },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , },
  { title: '接单数量', minWidth: '100', field: 'quantity', align: 'center' , },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center',  },
  { title: '加工工序', field: 'craftName',  minWidth: '120',align: 'center', },
  { title: '加工要求', field: 'requirementQuery', align: 'center', minWidth: '120', },
  { title: '备注', field: 'remark', align: 'center', minWidth: '120', },
  { title: '待加工', minWidth: '100', field: 'waitProcessQuantity', align: 'center' , fixed: 'right',},
  { title: '加工部门', field: 'processDeptName',  minWidth: '110',align: 'center', fixed: 'right',},
]);

const eqfileColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '附件名称', field: 'name', align: 'center'},
  {title: '上传人', width: '120', field: 'createByName', align: 'center'},
  {title: '上传时间', width: '160', field: 'createTime', align: 'center'},
  {title: '操作', width: '180', field: 'make', align: 'center'},
]);

const detailTableColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' }},
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品型号' }},
  { title: '客户名称', minWidth: '160', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '100', filterType: 'intervalNumber', },
  { title: '宽(㎜)', minWidth: '100', field: 'width', align: 'center' , filterType: 'intervalNumber',},
  { title: '接单数量', minWidth: '100', field: 'quantity', align: 'center' , filterType: 'intervalNumber',},
  { title: '接单总面积(㎡)', minWidth: '120', field: 'totalArea', align: 'center', },
  { title: '单位', field: 'unit',  minWidth: '80',align: 'center', filterType: 'radio', filterParam: { placeholder: '' }, filterData: () => unitList.value },
  { title: '加工部门', field: 'processDeptName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工部门' }},
  { title: '待加工', field: 'waitProcessQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '已加工', field: 'processQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '待发货', field: 'waitDeliverQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '已发货', field: 'deliverQuantity',  minWidth: '80',align: 'center', filterType: 'intervalNumber',},
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '加工要求', field: 'requirementQuery',  minWidth: '120',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工要求' }},
  { title: '备注', field: 'remark', align: 'center', minWidth: '120', filterType: 'input', filterParam: { placeholder: '请输入备注' }},
  { title: '开始加工时间', field: 'startTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '完成加工时间', field: 'finishTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '创建人', field: 'createByName', align: 'center', minWidth: '80', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '创建时间', field: 'createTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
]);

const checkedSourceProcessOrderList = ref<SourceProcessOrderVO[]>([]);

const {queryParams, form, rules} = toRefs(data);

const {queryParams: waitQueryParams} = toRefs(waitData);

const {queryParams: detailQueryParams, form: detailForm, rules: detailRules,} = toRefs(detailData);

const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceProcessOrderVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedSourceProcessOrderList.value = selectRecords.map(item => item);
  }
}

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}

// 获取 搜索条件
const detailSearchChange = (params: any) => {
  detailQueryParams.value = params
  getDetailList()
}

/** 查询外协待接单列表 */
const getWaitList = async () => {
  waitLoading.value = true;
  waitQueryParams.value.status = '6';
  const res = await listSourceOrder(waitQueryParams.value);
  waitOrderList.value = res.rows;
  waitTotal.value = res.total;
  waitLoading.value = false;
}

/** 查询外协待接单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceOrder(queryParams.value);
  dateList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询外协待接单列表 */
const getDetailList = async () => {
  loading.value = true;
  const res = await listSourceOrderDetail(detailQueryParams.value);
  detailList.value = res.rows;
  detailTotal.value = res.total;
  loading.value = false;
  // 查询统计信息
  countOrderDetail(detailQueryParams.value).then(res => {
    detailCount.value = res.data;
  });
}

/** 移除按钮操作 */
const handleRemove = (row: any) => {
  editDetailList.value = editDetailList.value.filter(item => item !== row);
}

/** 编辑按钮 */
const handleEdit = async (row: any) => {
  reset();
  dialog.title = "编辑外协加工单";
  dialog.visible = true;
  drawerLoading.value = true;
  // 查询加工单详情
  getSourceOrder(row.id).then(res => {
    form.value = res.data;
    editDetailList.value = res.data.detailList;
  }).finally( () => drawerLoading.value = false);
  // 查询凭证信息
  queryFile(row.id);
}

/** 转单按钮 */
const handleTransfer = async (row: any) => {
  reset();
  dialog.title = "外协加工转单";
  dialog.visible = true;
  drawerLoading.value = true;
  // 查询加工单详情
  getSourceOrder(row.id).then(res => {
    form.value = res.data;
    // 过滤出未加工完成的数据
    editDetailList.value = res.data.detailList.filter(item => item.quantity != item.processQuantity);
  }).finally( () => drawerLoading.value = false);
  // 查询凭证信息
  queryFile(row.id);
}

/** 凭证按钮 */
const handleFile = async (row: any) => {
  reset();
  fileDialog.title = "查看凭证";
  fileDialog.visible = true;
  // 查询凭证信息
  await queryFile(row.id);
  form.value.id = row.id;
}

/** 查询凭证信息 */
const queryFile = async (id: number) => {
  eqloading.value = true;
  const res = await listContractFiles(id).finally(() => eqloading.value = false);
  fileList.value = res;
}

const recordTable = ref('基本信息');

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  sourceOrderFormRef.value?.resetFields();
  editDetailList.value = [];
  fileList.value = [];
  delFileIds.value = [];
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增外协加工单";
  form.value.orderTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  form.value.orderByName = useUserStore().nickname;
  form.value.orderBy = useUserStore().userId;
}

/** 新增加工详情按钮 */
const handleAddDetail = () => {
  sourceOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // 清空明细数据
      detailForm.value = {...initDetailFormData};
      detailForm.value.length = null;
      detailForm.value.width = null;
      detailForm.value.quantity = null;
      detailDialog.visible = true;
      detailDialog.title = '添加明细';
      isEdit.value = false;
    }
  });
}

/** 修改加工详情按钮 */
const handleEditDetail = (row: any) => {
  detailForm.value = row;
  detailDialog.visible = true;
  detailDialog.title = '编辑明细';
  isEdit.value = true;
}

/** 保存并添加加工详情 */
const saveAddDetail = () => {
  orderDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let detail = deepClone(detailForm.value);
      // 校验计价规则
      await verifySourceOrderRule(detail)
      getRequirement(detail);
      if (form.value.id) {
        detail.outSourceOrderId = form.value.id;
      }
      editDetailList.value.push(detail);
      detailForm.value = {...initDetailFormData}
    }
  });
}

/** 保存修改加工详情 */
const saveEditDetail = () => {
  orderDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let detail = deepClone(detailForm.value);
      // 校验计价规则
      let id = detail.id;
      delete detail.id;
      await verifySourceOrderRule(detail);
      // 校验通过后重新赋值ID
      detail.id = id;
      getRequirement(detail);
      if (form.value.id) {
        detail.outSourceOrderId = form.value.id;
      }
      editDetailList.value = editDetailList.value.map(item => {
        if(item.id == detail.id) {
          item = detail;
        }
        return item
      })

      detailDialog.visible = false;
    }
  });
}

/** 保存加工详情 */
const saveDetail = () => {
  orderDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let detail = deepClone(detailForm.value);
      // 校验计价规则
      await verifySourceOrderRule(detail)
      // 处理加工要求
      getRequirement(detail);
      if (form.value.id) {
        detail.outSourceOrderId = form.value.id;
      }
      editDetailList.value.push(detail);
      detailDialog.visible = false;
    }
  });
}

/** 关闭添加详情 */
const closeDetail = () => {
  detailDialog.visible = false;
}

/** 编辑按钮操作 */
const handleUpdate = async (row?: SourceProcessOrderVO) => {
  reset();
  recordTable.value = "基本信息"
  const _id = row?.id || ids.value[0]
  const res = await getSourceProcessOrder(_id);
  form.value = res.data
  dialog.visible = true;
  dialog.title = "编辑外协接收单";
}

/** 数量校验 */
const checkQuantity = (row: any) => {
  if (row.quantity < row.processQuantity) {
    proxy?.$modal.msgError('接单数量不能大于已加工数量')
    return true;
  }
  return false;
};

/** 提交按钮 */
const submitForm = () => {
  sourceOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.detailBoList = editDetailList.value;
      form.value.fileList = fileList.value.filter(item => !item.id);
      if (form.value.id) {
        // 校验数量
        let flag = false;
        form.value.detailBoList.forEach(item => {
          if (checkQuantity(item)) {
            flag = true;
            return;
          }
          // 编辑处理明细id
          if(item.id && item.id.includes('row')) {
            item.id = undefined;
          }
        })
        if(flag) {
          buttonLoading.value = false;
          return;
        }
        form.value.delFileIds = delFileIds.value;
        await updateSourceOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        // 新增处理明细id
        form.value.detailBoList.map(item => {
          item.id = undefined;
        })
        form.value.status = '1';
        await addSourceOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("保存成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 确认转单 */
const submitTransfer = async () => {
  sourceOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.detailBoList = editDetailList.value;
      form.value.fileList = fileList.value.filter(item => !item.id);
      form.value.delFileIds = delFileIds.value;
      await transferSourceOrder(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('删除将不可恢复，是否确认删除？', {
    cancelButtonText: '取消',
    confirmButtonText: '确认删除',
    type: 'warning'
  }).finally(() => loading.value = false);
  await delSourceOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = async () => {
  const $table = XTableRef.value.xTableRef;
  let hasSearch = false
  if ($table) {
    // 判断是否有筛选条件
    hasSearch = getHasSearch(queryParams.value);
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照接单时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
    }
  }
  queryParams.value.hasSearch = hasSearch
  proxy?.download('outsource/sourceOrder/export', {
    ...queryParams.value, tableName: 'outSourceOrderTable'
  }, `外协接单加工单_${new Date().getTime()}.xlsx`)
}

/** 明细导出按钮操作 */
const handleDetailExport = async () => {
  const $table = detailTableRef.value.xTableRef;
  let hasSearch = false
  if ($table) {
    // 判断是否有筛选条件
    hasSearch = getHasSearch(detailQueryParams.value);
    if (!hasSearch) {
      // 无筛选条件，只导出1w，并提示
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照接单时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
    }
  }
  detailQueryParams.value.hasSearch = hasSearch
  proxy?.download('outsource/sourceOrderDetail/export', {
    ...detailQueryParams.value, tableName: 'outSourceOrderDetailTable'
  }, `外协产品加工单_${new Date().getTime()}.xlsx`)
}

/**
 * 点击箭头下拉
 * @param row
 * @param rowIndex
 */
const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<any> = ({ row, rowIndex }) => {
  console.log('行展开事件' + row)
}

/**
 * 查询tab页
 */
const getVoidedList = () => {
  if (1 == editableTabsValue.value) {
    getWaitList();
  } else if (2 == editableTabsValue.value) {
    getList();
  } else {
    getDetailList();
  }
}

/** 查询客户信息 */
const getCustomerList = async () => {
  const res = await getListCustomer({customerOutTypeStr: "2"});
  customerList.value = res.data;
}

/** 查询生产部门 */
const getDeptList = async () => {
  const res = await listOwnerDept({isProduction: '1'});
  deptList.value = res.data;
}

/** 查询工序信息 */
const getCraftList = async () => {
  const res = await listOutSourceCountConfig({isOpen: '1'});
  craftList.value = res.rows;
}

/** 查询工艺计价规则 */
const getRuleList = async (craftId: any) => {
  const res = await listSourceHalfProcessCalcRule({outSourceCraftId: craftId, customerId: form.value.customerId});
  reqList.value = res.rows;
}

/** 工序改变事件 */
const craftChange = async () => {
  detailForm.value.calcRuleId = undefined;
}

watch(() => detailForm.value.outSourceCraftId, val => {
  if(val) {
    getRuleList(val);
  }
});

watch(() => detailForm.value.calcRuleId, val => {
  if (val) {
    if (!isEdit.value) {
      // 查询计价规则下的参数信息
      getCraftInfo(val);
    } else {
      isEdit.value = false;
    }
  } else {
    isEdit.value = false;
    detailForm.value.requirement = [];
  }
});

/** 选择工序改变 */
const getCraftInfo = async (calcRuleId: any) => {
  const res = await getCalcRuleDetail(calcRuleId);
  if (res.code == 200) {
    detailForm.value.requirement = res.data.craftParameters;
    detailForm.value.requirement.map(item => {
      // 工序没有数据时使用默认值
      if(item.defaultValue && !item.values) {
        item.values = item.defaultValue;
      }
    })
  }
}

/** 预览文件 */
const preview = (row: any) => {
  fileViewRef.value?.preview(row)
}

/** 文件修改 */
const fileChange = async (_value: any) => {
  // 增加文件信息
  _value.map(item => {
    // 判断是否已存在
    if (fileList.value.filter(old => old.name === item.name && old.size === item.size).length > 0) {
      return;
    } else {
      item.bizId = form.value.id;
      item.moduleCode = '18';
      item.bizType = '43';
      // item.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      // item.createByName = useUserStore().nickname;
      // item.createBy = useUserStore().userId;
      fileList.value.push(item);
    }
  })
}

// 文件下载
const downLoadHandle = (key: string) => {
  let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
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

// 文件删除
const delFile = async(row: any) => {
  await proxy?.$modal.confirm('是否删除文件？').finally(() => loading.value = false);
  fileList.value = fileList.value.filter(item => item !== row)
  if(row.id) {
    delFileIds.value.push(row.id);
  }
}

/** 文件确认上传 */
const submitFile = async() => {
  buttonLoading.value = true;
  form.value.fileList = fileList.value.filter(item => !item.id);
  form.value.delFileIds = delFileIds.value;
  await updateSourceOrderFiles(form.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  fileDialog.visible = false;
}

/** 判断是否有筛选条件 */
const getHasSearch = (query: any): boolean => {
  let hasSearch = false
  let params = deepClone(query)
  delete params?.pageNum
  delete params?.pageSize
  delete params?.isQueryDelivery
  for (let key in params) {
    if (Array.isArray(params[key]) && params[key]?.length) {
      params[key].map((m) => {
        if (!!m) {
          // 判断是否有值，有值则说明有筛选条件，用于判断数组
          hasSearch = true
        }
      })
    } else if (!!params[key]) {
      // 判断是否有值，有值则说明有筛选条件
      hasSearch = true
    }
  }
  return hasSearch
}

/** 处理加工要求 */
const getRequirement = (row: any) => {

  let content = '';

  let temp = reqList.value.filter(item => item.id == row.calcRuleId);
  if(temp && temp.length > 0) {
    content = content + temp[0].ruleName + '+';
  }

  // 清空明细数据
  row.requirement?.map(item => {
    if(item && item.values) {
      // 开关值特殊处理
      if('7' == item.type) {
        let value = item.values == 'true'? '是' : '否';
        content = content + item.name + value + '+';
      } else {
        content = content + item.name + item.values + item.unit + '+';
      }
    }
  })
  if(content && content.length > 0) {
    content = content.substring(0, content.length-1)
  }
  row.requirementQuery = content;
}

onMounted(() => {
  getList();
  getCustomerList();
  getDeptList();
  getCraftList();
});
</script>
<style>
.p-2 {
  overflow: hidden;
}

.totalTitle {
  padding: 0px !important;
  margin: 0px;
  line-height: 24px !important;
  display: flex !important;
  justify-content: end !important;
  font-size: 14px !important;
  color: #0892c7 !important;
  font-weight: bold;
  margin-right: 10px;
}


.custom-dialog .el-dialog__body {
  overflow-y: scroll !important;
  max-height: 500px !important; /* 根据需要设置最大高度 */
}
.custom-form-hide .el-form-item__label{
  &::before{display: none}
}
.custom-span {
  width: 100px !important; /* 设置固定宽度 */
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-align: right !important;
}
</style>

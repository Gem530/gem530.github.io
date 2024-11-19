<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">

          <div class="p-2 global-flex flex-end" style="text-align: right;width: 100%">
            <el-button v-if="checkPermi(['outsideReceive:scrap:add'])" :loading="buttonLoading" type="primary" @click="handleAdd">新增</el-button>
            <el-button v-if="checkPermi(['outsideReceive:scrap:export'])" :loading="buttonLoading" type="primary" @click="handleExport">导出</el-button>
          </div>
          <XTable v-if="checkPermi(['outsideReceive:scrap:list'])" toolId="outSourceScrapTable" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
                  :page-params="{ perfect: true, total: total }" :data="dateList" :columnList="columnList"
                  ref="XTableRef" border :showRefresh="true"
                  :intervalCondition="intervalCondition"
                  @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :loading="loading"
          >
            <template #default-unit="scope">
              {{ unitList.find(item => item.value == scope.row.unit)?.label }}
            </template>

            <template #default-make="scope">
              <el-button v-if="checkPermi(['outsideReceive:scrap:edit'])" link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="checkPermi(['outsideReceive:scrap:del'])" link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button v-if="checkPermi(['outsideReceive:scrap:detail'])" link type="primary" @click="handleDetail(scope.row)">查看</el-button>
            </template>

          </XTable>
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="70%">
      <el-form ref="sourceOrderFormRef" :model="form" :rules="rules" label-width="120px" label-position="right" v-loading="drawerLoading">

        <el-collapse v-model="activeNames" >
          <el-collapse-item title="基本信息" name="1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="产品型号：" prop="commodityCode" >
                  <el-input :disabled="true" v-model="form.commodityCode"/>
                </el-form-item>
              </el-col>
              <el-col v-if="dialog.title.includes('编辑')" :span="8">
                <el-form-item label="客户单号：" prop="orderCode">
                  <el-input :disabled="true" v-model="form.orderCode"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="外协加工单号：" prop="code">
                  <el-input :disabled="true" v-model="form.code"/>
                </el-form-item>
              </el-col>

              <el-col v-if="dialog.title.includes('编辑')" :span="8">
                <el-form-item label="客户名称：" prop="customerName">
                  <el-input :disabled="true" v-model="form.customerName"/>
                </el-form-item>
              </el-col>
              <el-col v-if="dialog.title.includes('编辑')" :span="8">
                <el-form-item label="长：" prop="length">
                  <el-input type="number" :disabled="true" v-model="form.length">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="dialog.title.includes('编辑')" :span="8">
                <el-form-item label="宽：" prop="width">
                  <el-input type="number" :disabled="true" v-model="form.width">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col v-if="dialog.title.includes('编辑')" :span="8">
                <el-form-item label="单位：" prop="units">
                  <el-input :disabled="true" v-model="form.units"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报废工序：" prop="craftName">
                  <el-input :disabled="true" v-model="form.craftName"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报废数量：" prop="quantity">
                  <XInputNumber style="width: 100%;" :controls="false" type="number" :min="0" :max="form.maxQuantity" v-model="form.quantity" :precision="0"></XInputNumber>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="报废时间：" prop="scrapTime">
                  <el-date-picker class="width-100" :clearable="false" v-model="form.scrapTime"
                                  type='date' placeholder='请选择时间' valueFormat='YYYY-MM-DD'/>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="报废原因：" prop="reason">
                  <el-input maxlength="200" v-model="form.reason"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="" label-width="40px" prop="type">
                  <el-radio-group v-model="form.type" @change="typeChange">
                    <el-radio label="1">责任在本厂</el-radio>
                    <el-radio label="2">责任在客户</el-radio>
                    <el-radio label="3">责任在物料供应商</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item v-if="form.type == '1'" label="责任人：" prop="dutyUserName">
                  <el-select style="width: 100%" v-model="form.dutyUserName" multiple
                             filterable default-first-option>
                    <el-option v-for="user in userList" :key="user.userId" :label="user.nickName" :value="user.nickName"/>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="form.type == '3'" label="责任供应商：" prop="dutyUserName">
                  <el-input maxlength="100" v-model="form.dutyUserName"/>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>

          <el-collapse-item title="凭证信息" name="2" style="text-align: end;">
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
                <el-button link type="primary" :text="true" @click="delFile(scope.row)">删除</el-button>
                <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
                <el-button v-if="imgType.includes(scope.row.type)" link type="primary" @click="preview(scope.row)">在线预览</el-button>
              </template>
            </XTable>
          </el-collapse-item>

        </el-collapse>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" @click="cancel">取消</el-button>
          <el-button v-if="dialog.title=='新增报废'" :loading="buttonLoading" type="primary" @click="submitAdd">确定</el-button>
          <el-button v-if="dialog.title=='编辑报废'" :loading="buttonLoading" type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 详情对话框 -->
    <el-drawer :title="scrapDialog.title" v-model="scrapDialog.visible" size="70%">
        <el-collapse v-model="activeNames" >
          <el-form ref="orderDetailFormRef" :model="detailForm" :rules="detailRules" label-width="120px" label-position="right" v-loading="drawerLoading">
          <el-collapse-item title="基本信息" name="1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="产品型号：" prop="commodityCode" >
                  <span>{{detailInfo.commodityCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户单号：" prop="orderCode">
                  <span>{{detailInfo.orderCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="外协加工单号：" prop="code">
                  <span>{{detailInfo.code}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="客户名称：" prop="customerName">
                  <span>{{detailInfo.customerName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="长：" prop="length">
                  <span>{{detailInfo.length}}mm</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="宽：" prop="width">
                  <span>{{detailInfo.width}}mm</span>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="单位：" prop="units">
                  <span>{{detailInfo.units}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报废工序：" prop="craftName">
                  <span>{{detailInfo.craftName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报废数量：" prop="quantity">
                  <span>{{detailInfo.quantity}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="报废时间：" prop="scrapTime">
                  <span>{{detailInfo.scrapTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="报废原因：" prop="reason">
                  <span>{{detailInfo.reason}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="" label-width="40px" prop="type">
                  <el-radio disabled v-if="detailInfo.type == '1'" v-model="detailInfo.type" label="1">责任在本厂</el-radio>
                  <el-radio disabled v-if="detailInfo.type == '2'" v-model="detailInfo.type" label="2">责任在客户</el-radio>
                  <el-radio disabled v-if="detailInfo.type == '3'" v-model="detailInfo.type" label="3">责任在物料供应商</el-radio>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item v-if="detailInfo.type == '1'" label="责任人：" prop="dutyUserName">
                  <span>{{detailInfo.dutyUserName}}</span>
                </el-form-item>
                <el-form-item v-if="detailInfo.type == '3'" label="责任供应商：" prop="dutyUserName">
                  <span>{{detailInfo.dutyUserName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          </el-form>

          <el-collapse-item title="凭证信息" name="2" style="text-align: end;">
            <XTable :pageShow="false" class="xtable-content" :loading="eqloading" :data="fileList"
                    :show-footer="false" :columnList="eqfileColumnList" ref="fileleteTableRef6" border
                    :column-config="{ resizable: true }"
            >

              <template #default-make="scope">
                <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
                <el-button v-if="imgType.includes(scope.row.type)" link type="primary" @click="preview(scope.row)">在线预览</el-button>
              </template>
            </XTable>
          </el-collapse-item>

        </el-collapse>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" @click="scrapDialog.visible = false">取消</el-button>
        </div>
      </template>
    </el-drawer>


    <!-- 选择加工单对话框 -->
    <el-dialog :title="detailDialog.title" v-model="detailDialog.visible" width="70%" destroy-on-close>
      <XTable toolId="outSourceScrapSelectTable" v-model:page-size="detailQueryParams.pageSize"
              v-model:current-page="detailQueryParams.pageNum" height="400" class="xtable-content"
              :page-params="{ perfect: true, total: detailTotal }" :data="detailList" :columnList="detailTableColumnList"
              ref="etailTableRef" border :showRefresh="true"
              :intervalCondition="intervalCondition"
              @searchChange="detailSearchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
              :loading="detailLoading" :radio-config="{ trigger: 'row' }"  @radio-change="selectChangeEvent"
      >
        <template #default-unit="scope">
          {{ unitList.find(item => item.value == scope.row.unit)?.label }}
        </template>
      </XTable>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" @click="detailDialog.visible = false">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitSelect">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <FileView ref="fileViewRef"></FileView>
  </div>
</template>

<script setup name="OutProcessScrap" lang="ts">
import {VxeTableEvents} from 'vxe-table'
import {ref} from "vue";
import useUserStore from "@/store/modules/user";

import {deepClone} from "@/utils";
import {
  SourceOrderDetailForm,
  SourceOrderDetailQuery,
  SourceOrderDetailVO
} from "@/api/outsource/sourceOrderDetail/types";
import { downloadUrl, listContractFiles} from "@/api/upload";
import fileSaver from "file-saver";
import { listSourceOrderDetail} from "@/api/outsource/sourceOrderDetail";
import {SourceOrderScrapForm, SourceOrderScrapQuery, SourceOrderScrapVO} from "@/api/outsource/sourceOrderScrap/types";
import {
  addSourceOrderScrap, delSourceOrderScrap, getMaxScrapQuantity,
  getSourceOrderScrap,
  listSourceOrderScrap,
  updateSourceOrderScrap
} from "@/api/outsource/sourceOrderScrap";
import {ElLoading} from "element-plus";
import {getSysUserList} from "@/api/system/user";
import dayjs from "dayjs";
import {checkPermi} from "@/utils/permission";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const dateList = ref<SourceOrderScrapVO[]>([]);
const detailList = ref<SourceOrderDetailVO[]>([]);
const selectDetail = ref<SourceOrderDetailVO>();

const editDetailList = ref<SourceOrderDetailVO[]>([]);
const userList = ref<any[]>([]);
const fileList = ref<any[]>([])
const delFileIds = ref<any[]>([])

const buttonLoading = ref(false);
const loading = ref(false);
const detailLoading = ref(false);

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

const intervalCondition = ['createTime', 'length', 'width', 'quantity', 'scrapTime', 'orderTime'];

const queryFormRef = ref<ElFormInstance>();
const sourceOrderFormRef = ref<ElFormInstance>();
const orderDetailFormRef = ref<ElFormInstance>();
const fileViewRef = ref<ElFormInstance>();
const detailInfo = ref<any>();

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

const scrapDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const detailDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

/*新增编辑抽屉*/
const dialogTableLoading = ref(false)

const validatePass = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('报废数量不能为空'))
  } else if (!/^[1-9]\d*$/.test(value)) {
    callback(new Error('请输入大于0的整数'))
  } else {
    callback()
  }
}

const validateDutyPass = (rule: any, value: any, callback: any) => {
  console.log('validateDutyPass', value)
  if (!value || value.length <= 0) {
    if(form.value.type == '1') {
      callback(new Error('责任人不能为空'))
    } else {
      callback(new Error('责任供应商不能为空'))
    }
  } else {
    callback()
  }
}

const initFormData: SourceOrderScrapForm = {
  id: undefined,
  ownerId: undefined,
  outSourceOrderDetailId: undefined,
  quantity: undefined,
  reason: undefined,
  type: undefined,
  dutyUserId: undefined,
  dutyUserName: undefined,
  remark: undefined,
  code: undefined,
  commodityCode: undefined,
  customerName: undefined,
  length: undefined,
  width: undefined,
  unit: undefined,
  craftName: undefined,
}
const data = reactive<PageData<SourceOrderScrapForm, SourceOrderScrapQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ownerId: undefined,
    outSourceOrderDetailId: undefined,
    quantity: undefined,
    reason: undefined,
    type: undefined,
    dutyUserId: undefined,
    dutyUserName: undefined,
  },
  rules: {
    commodityCode: [
      { required: true, message: "产品型号不能为空", trigger: "blur" }
    ],
    craftName: [
      { required: true, message: "报废工序不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, validator: validatePass, trigger: "blur" }
    ],
    reason: [
      { required: true, message: "报废原因不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "责任类型(1本厂，2客户，3供应商)不能为空", trigger: "change" }
    ],
    dutyUserId: [
      { required: true, message: "单位责任人id不能为空", trigger: "blur" }
    ],
    dutyUserName: [
      { required: true, validator: validateDutyPass, trigger: ["blur", "change"] }
    ],
  }
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
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {},
});

const XTableRef = ref()

const unitList = ref([
  { label: 'PNL', value: "2" },
  { label: 'SET', value: "3" },
  { label: '大料', value: "1" },
]);

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60', },
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' } },
  { title: '客户单号', minWidth: '120', field: 'orderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户单号' } },
  { title: '客户名称', minWidth: '140', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入产品型号' }},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '70', filterType: 'intervalNumber', },
  { title: '宽(㎜)', minWidth: '70', field: 'width', align: 'center' , filterType: 'intervalNumber',},
  { title: '单位', field: 'unit',  minWidth: '70',align: 'center', filterType: 'radio', filterParam: { placeholder: '' }, filterData: () => unitList.value },
  { title: '报废工序', field: 'craftName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '报废原因', minWidth: '140', field: 'reason', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入报废原因' }},
  { title: '报废数量', minWidth: '80', field: 'quantity', align: 'center',  filterType: 'intervalNumber',},
  { title: '责任人', minWidth: '100', field: 'dutyUserName', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入责任人' }},
  { title: '报废时间', field: 'scrapTime', minWidth: '140',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD 00:00:00'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD 23:59:59'},
    }  },

  { title: '创建人', minWidth: '90', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入创建人' } },
  { title: '创建时间', field: 'createTime', minWidth: '160',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
  { title: '操作', field: 'make', align: 'center', width: '180', fixed: 'right', },
]);

const detailTableColumnList = ref([
  {type: 'radio', width: '40', align: "center"},
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '50'},
  { title: '外协加工单号', minWidth: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协加工单号' }},
  { title: '客户单号', minWidth: '120', field: 'orderCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户单号' }},
  { title: '产品型号', minWidth: '120', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品型号' }},
  { title: '客户名称', minWidth: '160', field: 'customerName', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入客户名称' }},
  { title: '加工工序', field: 'craftName',  minWidth: '100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入加工工序' }},
  { title: '长(㎜)', field: 'length', align: 'center', minWidth: '60', filterType: 'intervalNumber', },
  { title: '宽(㎜)', minWidth: '60', field: 'width', align: 'center' , filterType: 'intervalNumber',},
  { title: '加工数量', minWidth: '75', field: 'quantity', align: 'center' , filterType: 'intervalNumber',},
  { title: '加工单位', field: 'unit',  minWidth: '75',align: 'center', filterType: 'radio', filterParam: { placeholder: '' }, filterData: () => unitList.value },
  { title: '接单时间', field: 'orderTime', align: 'center', minWidth: '140',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }  },
]);

const eqfileColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '附件名称', field: 'name', align: 'center'},
  {title: '上传人', width: '120', field: 'createByName', align: 'center'},
  {title: '上传时间', width: '160', field: 'createTime', align: 'center'},
  {title: '操作', width: '180', field: 'make', align: 'center'},
]);

const {queryParams, form, rules} = toRefs(data);

const {queryParams: detailQueryParams, form: detailForm, rules: detailRules,} = toRefs(detailData);

/** 单选事件 */
const selectChangeEvent: VxeTableEvents.RadioChange<SourceOrderDetailVO> = ({ checked, row }) => {
  selectDetail.value = row;
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
const getList = async () => {
  loading.value = true;
  const res = await listSourceOrderScrap(queryParams.value);
  dateList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询外协接单列表 */
const getDetailList = async () => {
  detailLoading.value = true;
  const res = await listSourceOrderDetail(detailQueryParams.value);
  detailList.value = res.rows;
  detailTotal.value = res.total;
  detailLoading.value = false;
}

/** 移除按钮操作 */
const handleRemove = (row: any) => {
  editDetailList.value = editDetailList.value.filter(item => item !== row);
}

/** 编辑按钮 */
const handleEdit = async (row: any) => {
  reset();
  dialog.title = "编辑报废";
  dialog.visible = true;
  drawerLoading.value = true;
  // 查询加工单详情
  getSourceOrderScrap(row.id).then(res => {
    form.value = res.data;
    // 处理单位
    form.value.units = unitList.value.find(item => item.value == res.data.unit)?.label
    // 处理责任人
    if(form.value.type == '1') {
      form.value.dutyUserName = form.value.dutyUserName.split(",");
    }

  }).finally( () => drawerLoading.value = false);
  // 查询凭证信息
  queryFile(row.id);
}


/** 详情按钮 */
const handleDetail = async (row: any) => {
  reset();
  detailInfo.value = deepClone({...initFormData});
  scrapDialog.title = "查看报废";
  scrapDialog.visible = true;
  drawerLoading.value = true;
  // 查询加工单详情
  getSourceOrderScrap(row.id).then(res => {
    detailInfo.value = res.data;
    // 处理单位
    detailInfo.value.units = unitList.value.find(item => item.value == res.data.unit)?.label
  }).finally( () => drawerLoading.value = false);
  // 查询凭证信息
  queryFile(row.id);
}

const getDetail = async (id: any) => {

}

/** 查询凭证信息 */
const queryFile = async (id: number) => {
  eqloading.value = true;
  const res = await listContractFiles(id).finally(() => eqloading.value = false);
  fileList.value = res;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  sourceOrderFormRef.value?.resetFields();
  selectDetail.value = undefined;
  fileList.value = [];
  delFileIds.value = [];
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  detailQueryParams.value = {
    pageNum: 1,
    pageSize: 20,
  }
  detailDialog.visible = true;
  detailDialog.title = "新增报废";
  getDetailList();
}

/** 确认选择按钮操作 */
const submitSelect = async () => {
  detailDialog.visible = false;
  dialog.visible = true;
  dialog.title = "新增报废";
  // 查询最大可报废数量
  getMaxScrapQuantity(selectDetail.value?.id).then(res => {
    form.value.maxQuantity = res.data;
  });
  form.value.outSourceOrderDetailId = selectDetail.value?.id;
  form.value.commodityCode = selectDetail.value?.commodityCode;
  form.value.customerName = selectDetail.value?.customerName;
  form.value.orderCode = selectDetail.value?.orderCode;
  form.value.code = selectDetail.value?.code;
  form.value.length = selectDetail.value?.length;
  form.value.width = selectDetail.value?.width;
  form.value.units = unitList.value.find(item => item.value == selectDetail.value?.unit)?.label
  form.value.craftName = selectDetail.value?.craftName;
  form.value.scrapTime = dayjs(new Date()).format("YYYY-MM-DD")
  form.value.type = '1'
}

/** 类型修改后清空责任人 */
const typeChange = () => {
  form.value.dutyUserName = undefined;
}

/** 编辑提交按钮 */
const submitForm = () => {
  sourceOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.fileList = fileList.value.filter(item => !item.id);
      form.value.delFileIds = delFileIds.value;
      handleDuty();
      await updateSourceOrderScrap(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("保存成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 新增提交按钮 */
const submitAdd = () => {
  sourceOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      handleDuty();
      form.value.fileList = fileList.value.filter(item => !item.id);
      // 新增处理明细id
      await addSourceOrderScrap(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("保存成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 处理责任人 */
const handleDuty = () => {
  if(form.value.type == '1' && form.value.dutyUserName && form.value.dutyUserName.length > 0) {
    if(typeof form.value.dutyUserName == "string") {
      form.value.dutyUserName = form.value.dutyUserName;
    } else {
      form.value.dutyUserName = form.value.dutyUserName.join(',');
    }
  }
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceOrderScrapVO) => {
  const _ids = row?.id || ids.value;
  console.log("删除数据：",_ids)
  await proxy?.$modal.confirm('删除将不可恢复，是否确认删除？', {
    cancelButtonText: '取消',
    confirmButtonText: '确认删除',
    type: 'warning'
  }).finally(() => loading.value = false);
  await delSourceOrderScrap(_ids);
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
      await proxy?.$modal.confirm('未选择任何筛选条件，系统将默认按照创建时间导出近30天的数据', {
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        type: ''
      })
    }
  }
  queryParams.value.hasSearch = hasSearch
  proxy?.download('outsource/sourceOrderScrap/export', {
    ...queryParams.value, tableName: 'outSourceScrapTable'
  }, `外协加工报废单_${new Date().getTime()}.xlsx`)
}

/** 查询本厂用户 */
const getUserList = async () => {
  const res = await getSysUserList({deptId: useUserStore().deptId});
  userList.value = res;
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
      item.bizType = '44';
      fileList.value.push(item);
    }
  })
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

// 文件删除
const delFile = async(row: any) => {
  await proxy?.$modal.confirm('是否删除文件？').finally(() => loading.value = false);
  fileList.value = fileList.value.filter(item => item !== row)
  if(row.id) {
    delFileIds.value.push(row.id);
  }
}

/** 判断是否有筛选条件 */
const getHasSearch = (query: any): boolean => {
  let hasSearch = false
  let params = deepClone(query)
  delete params?.pageNum
  delete params?.pageSize
  delete params?.isQueryDelivery
  console.log(params)
  for (let key in params) {
    if (Array.isArray(params[key]) && params[key]?.length) {
      console.log("有值22~")
      params[key].map((m) => {
        if (!!m) {
          console.log("有值33~")
          // 判断是否有值，有值则说明有筛选条件，用于判断数组
          hasSearch = true
        }
      })
    } else if (!!params[key]) {
      // 判断是否有值，有值则说明有筛选条件
      console.log("有值1~",params[key])
      hasSearch = true
    }
  }
  return hasSearch
}


onMounted(() => {
  getList();
  getUserList();
});
</script>
<style>
.p-2 {
  overflow: hidden;
}
</style>

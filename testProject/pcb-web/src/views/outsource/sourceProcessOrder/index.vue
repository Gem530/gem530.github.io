<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <div class="p-2" style="text-align: right;width: 100%">
          <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
            <el-col :span="1.5">
              <el-button :loading="buttonLoading" v-if="checkPermi(['outsource:sourceProcessOrder:add'])" type="primary" @click="handleAdd">新增外协接收单</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button :loading="buttonLoading" v-if="checkPermi(['outsource:sourceProcessOrder:export'])" type="primary" @click="handleExport">导出</el-button>
            </el-col>
          </el-row>
        </div>
      </template>

      <XTable
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        :data="sourceProcessOrderList"
        :intervalCondition="['deliveryDate','orderDate','orderQuantity','processSum','scrapSum','shipSum']"
        toolId="sourceProcessOrder"
        :columnList="columnList"
        ref="XTableRef"
        height="100%"
        class="xtable-content"
        border
        @searchChange="searchChange"
        :column-config="{ resizable: true }"
        @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent"
        :checkbox-config="{reserve: true }"
        :row-config="{ keyField:'id' }"
        :showRefresh="true"
        :pageShow="true"
      >
        <template #default-deliveryDate="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-orderDate="scope">
          <span>{{ parseTime(scope.row.orderDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-costName="scope">
          {{craftMap.find((v: any) => v.value == scope.row.costId)?.label}}
        </template>
        <template #default-make="scope">
          <el-button link type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:info'])" @click="handleSelect(scope.row)">详情</el-button>
          <el-button link type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:process'])" @click="handleAddRecord(scope.row.id)">加工</el-button>
          <el-button link type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:sraft'])" @click="handleScrapRecord(scope.row.id)">报废</el-button>
          <el-button link type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:ship'])" @click="handleShipRecord(scope.row.id)">发货</el-button>
          <el-popover placement="bottom" :width="50" trigger="click" popper-style="min-width: 60px;">
            <template #reference>
              <el-button link type="primary" size="large">更多</el-button>
            </template>
            <div style="padding-left: 1px">
              <el-button style="display: block; align-content: center; margin: auto;" link type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:edit'])" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button style="display: block; align-content: center; margin: auto;" link type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:delete'])" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </el-popover>
        </template>
      </XTable>
    </el-card>
    <!--    新增编辑抽屉-->
    <el-drawer v-model="dialog.visible" :title="dialog.title" size="45%" draggable @closed="cancel">
      <template #header="{ close, titleId, titleClass }">
        <div :id="titleId" style="font-weight: bolder;font-size: 22px;color: #334563;padding-left: 13px">
          {{ dialog.title }}
        </div>
      </template>
      <div class="ptable-card">
        <el-divider style="margin-top: -15px" />
        <div style="display: flex;border:1px solid #eee;margin-bottom: 20px" v-if="dialog.title?.includes('详情') ">
          <div style="flex: 1;display:flex;">
            <div style="padding: 10px 20px;background-color:#f7f7fa">客户编号</div>
            <div style="flex: 1;padding:10px;">
              {{ form.customerName }}
            </div>
          </div>
          <div style="flex: 1;display:flex;">
            <div style="padding: 10px 20px;background-color:#f7f7fa">接单工序</div>
            <template v-for="item in craftMap">
              <div style="flex: 1;padding:10px;" :key="item.key" v-if="item.key === form.costId">
                {{ item.label }}
              </div>
            </template>
          </div>
        </div>
        <el-tabs v-model="recordTable" type="border-card" class="ptable-tab" @tab-click="handleClick" >
          <el-tab-pane
            label="基本信息"
            name="基本信息"
            v-if="dialog.title?.includes('新增') || dialog.title?.includes('编辑') || dialog.title?.includes('详情') "
            :disabled="dialog.title?.includes('新增') || dialog.title?.includes('编辑')"
          >
            <el-form
              ref="sourceProcessOrderFormRef"
              :model="form"
              :rules="rules"
              border
              label-width="120px"
              :disabled="dialog.title?.includes('详情')"
              v-loading="dialogTableLoading"
            >
              <el-row>
                <el-col :span="12" v-if="dialog.title?.includes('新增')">
                  <el-form-item label="客户编号" prop="customerName">
                    <el-input v-model="form.customerName" placeholder="请输入客户编号" :maxlength="50"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dialog.title?.includes('编辑')">
                  <el-form-item label="客户编号" prop="customerName">
                    <el-input :disabled="true" v-model="form.customerName" placeholder="请输入客户编号" :maxlength="50"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dialog.title?.includes('详情')">
                  <el-form-item label="外协接单编号" prop="code">
                    <el-input :disabled="true" v-model="form.code" placeholder="请输入外协接单编号" :maxlength="50" />
                  </el-form-item>
                </el-col>
<!--                <el-col :span="12" v-if="dialog.title?.includes('编辑')">-->
<!--                  <el-form-item label="选择客户" prop="customerName">-->
<!--                    <el-input :disabled="true" v-model="form.customerName" placeholder="请输入客户编号" :maxlength="50" />-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
                <el-col :span="12" v-if="dialog.title?.includes('新增') || dialog.title?.includes('编辑')">
                  <el-form-item label="接单工序" prop="costId">
                    <el-select
                      :disabled = "dialog.title?.includes('编辑')"
                      v-model="form.costId"
                      @change="changeCost(form.costId)"
                      placeholder="请选择接单工序"
                      clearable
                      filterable
                      style="width: 100%"
                      transfer
                      popup-class-name="pop-select"
                    >
                      <el-option v-for="item in craftMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接单数量" prop="orderQuantity" required>
                    <XInputNumber
                      class="number-left"
                      style="width: 100%; text-align: left"
                      v-model="form.orderQuantity"
                      :min="0"
                      placeholder="请输入接单数量"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dialog.title?.includes('详情')">
                  <el-form-item label="加工数量" prop="processSum">
                    <el-input :disabled="true" v-model="form.processSum" placeholder="0" :maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dialog.title?.includes('详情')">
                  <el-form-item label="已发数量" prop="shipSum">
                    <el-input :disabled="true" v-model="form.shipSum" placeholder="0" :maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dialog.title?.includes('详情')">
                  <el-form-item label="报废数量" prop="scrapSum">
                    <el-input :disabled="true" v-model="form.scrapSum" placeholder="0" :maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="!dialog.title?.includes('详情')">
                  <el-form-item label="交货日期" prop="deliveryDate">
                    <el-date-picker clearable v-model="form.deliveryDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择交货日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接单日期" prop="orderDate">
                    <el-date-picker clearable v-model="form.orderDate" :disabled="true" type="date" value-format="YYYY-MM-DD" placeholder="请选择接单日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接单人" prop="createBy">
                    <el-input v-model="form.createByName" :disabled="true" placeholder="请输入接单人" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" :rows="3" :maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="加工记录" name="加工记录" v-if="dialog.title?.includes('详情') ">
            <div class="p-2" style="text-align: right;width: 100%">
              <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
                <el-col :span="1.5">
                  <el-button :loading="addButtonLoading" v-if="checkPermi(['outsource:sourceProcessOrder:process'])" type="primary" @click="handleAddRecord(form.id)">加工录入</el-button>
                </el-col>
              </el-row>
            </div>
            <XTable
              :data="sourceProcessOrderRecordList"
              :columnList="recordProcessColumnList"
              height="100%"
              class="ptable-content"
              toolId="processOrder"
              :footer-method="footerMethod"
              :show-footer="true"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :showRefresh="false"
              :pageShow="false"
            >
              <template #default-make="scope">
                <el-button link type="primary" @click="handleRecordDelete(scope.row)">删除</el-button>
              </template>
            </XTable>
          </el-tab-pane>
          <el-tab-pane label="报废记录" name="报废记录" v-if="dialog.title?.includes('详情') ">
            <div class="p-2" style="text-align: right;width: 100%">
              <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
                <el-col :span="1.5">
                  <el-button :loading="scrapButtonLoading" type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:sraft'])" @click="handleScrapRecord(form.id)">报废录入</el-button>
                </el-col>
              </el-row>
            </div>
            <XTable
              :data="sourceProcessOrderRecordList"
              :columnList="recordScrapColumnList"
              height="100%"
              class="ptable-content"
              toolId="processOrder"
              :footer-method="footerMethod"
              :show-footer="true"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :showRefresh="false"
              :pageShow="false"
            >
              <template #default-make="scope">
                <el-button link type="primary" @click="handleRecordDelete(scope.row)">删除</el-button>
              </template>
            </XTable>
          </el-tab-pane>
          <el-tab-pane label="发货记录" name="发货记录" v-if="dialog.title?.includes('详情') ">
            <div class="p-2" style="text-align: right;width: 100%">
              <el-row :gutter="10" class="mb8" style="line-height: 32px;width:100%;margin:0;display:flex;justify-content: end;">
                <el-col :span="1.5">
                  <el-button :loading="shipButtonLoading" type="primary" v-if="checkPermi(['outsource:sourceProcessOrder:ship'])" @click="handleShipRecord(form.id)">发货录入</el-button>
                </el-col>
              </el-row>
            </div>
            <XTable
              :data="sourceProcessOrderRecordList"
              :columnList="recordShipColumnList"
              height="100%"
              class="ptable-content"
              toolId="processOrder"
              :footer-method="footerMethod"
              :show-footer="true"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :showRefresh="false"
              :pageShow="false"
            >
              <template #default-make="scope">
                <el-button link type="primary" @click="handleRecordDelete(scope.row)">删除</el-button>
              </template>
            </XTable>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" v-show="dialog.title?.includes('编辑') || dialog.title?.includes('新增')" @click="cancel"
              >取 消</el-button
            >
            <el-button
              :loading="buttonLoading"
              type="primary"
              v-show="dialog.title?.includes('编辑') || dialog.title?.includes('新增')"
              @click="submitForm"
            >
              确认保存
            </el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <el-dialog :title="recordDialog.title" v-model="recordDialog.visible" width="25%" destroy-on-close>
      <el-form ref="sourceProcessOrderRecordFormRef" :model="recordForm" :rules="recordRules" label-width="100px">
        <el-form-item prop="customerName">
          <template #label><span style="font-size: 15px;">当前供应商</span></template>
          <el-input style="width: 70%" v-model="form.customerName" disabled/>
        </el-form-item>
        <el-form-item prop="costName">
          <template #label><span style="font-size: 15px;">接单工序</span></template>
          <el-input style="width: 70%" v-model="recordForm.costName" disabled/>
        </el-form-item>
        <el-form-item prop="orderQuantity">
          <template #label><span style="font-size: 15px;">接单数量</span></template>
          <el-input style="width: 70%" v-model="form.orderQuantity" disabled/>
        </el-form-item>
        <el-form-item prop="shipSum">
          <template #label><span style="font-size: 15px;">发货总数</span></template>
          <el-input style="width: 70%" v-model="form.shipSum" disabled/>
        </el-form-item>
        <el-form-item prop="scrapSum">
          <template #label><span style="font-size: 15px;">报废总数</span></template>
          <el-input style="width: 70%" v-model="form.scrapSum" disabled/>
        </el-form-item>
        <el-form-item prop="number">
          <template #label><span style="font-size: 14px;">本次加工数量</span></template>
          <XInputNumber
              class="number-left"
              style="width: 70%; text-align: left"
              v-model="recordForm.number"
              :min="0"
              placeholder="请输入本次加工数量"
          />
<!--          <el-input style="width: 70%" v-model="recordForm.number"/>-->
          <div style="width: 100%;color: #0f3d7a;top:2px; clear:both;" >当前已加工:  {{form.processSum?form.processSum:'0'}}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="recordAddButtonLoading" type="primary" @click="submitRecordForm('1')">确 定</el-button>
          <el-button @click="recordCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="recordScrapDialog.title" v-model="recordScrapDialog.visible" width="25%" destroy-on-close>
      <el-form ref="sourceScrapOrderRecordFormRef" :model="recordForm" :rules="recordScrapRules" label-width="100px">
        <el-form-item prop="customerName">
          <template #label><span style="font-size: 15px;">当前供应商</span></template>
          <el-input style="width: 70%" v-model="form.customerName" disabled/>
        </el-form-item>
        <el-form-item prop="costName">
          <template #label><span style="font-size: 15px;">接单工序</span></template>
          <el-input style="width: 70%" v-model="recordForm.costName" disabled/>
        </el-form-item>
        <el-form-item prop="orderQuantity">
          <template #label><span style="font-size: 15px;">接单数量</span></template>
          <el-input style="width: 70%" v-model="form.orderQuantity" disabled/>
        </el-form-item>
        <el-form-item prop="processSum">
          <template #label><span style="font-size: 15px;">加工总数</span></template>
          <el-input style="width: 70%" v-model="form.processSum" disabled/>
        </el-form-item>
        <el-form-item prop="shipSum">
          <template #label><span style="font-size: 15px;">发货总数</span></template>
          <el-input style="width: 70%" v-model="form.shipSum" disabled/>
        </el-form-item>
        <el-form-item prop="number">
          <template #label><span style="font-size: 14px;">本次报废数量</span></template>
<!--          <el-input style="width: 70%" v-model="recordForm.number" />-->
          <XInputNumber
              class="number-left"
              style="width: 70%; text-align: left"
              v-model="recordForm.number"
              :min="0"
              placeholder="请输入本次加工数量"
          />
          <div style="width: 100%;color: #0f3d7a;top:2px; clear:both;" >当前已报废:  {{form.scrapSum?form.scrapSum:'0'}}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="recordScrapButtonLoading" type="primary" @click="submitScrapRecordForm('2')">确 定</el-button>
          <el-button @click="recordCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="recordShipDialog.title" v-model="recordShipDialog.visible" width="25%" destroy-on-close>
      <el-form ref="sourceShipOrderRecordFormRef" :model="recordForm" :rules="recordShipRules" label-width="100px">
        <el-form-item prop="customerName">
          <template #label><span style="font-size: 15px;">当前供应商</span></template>
          <el-input style="width: 70%" v-model="form.customerName" disabled/>
        </el-form-item>
        <el-form-item prop="costName">
          <template #label><span style="font-size: 15px;">接单工序</span></template>
          <el-input style="width: 70%" v-model="recordForm.costName" disabled/>
        </el-form-item>
        <el-form-item prop="orderQuantity">
          <template #label><span style="font-size: 15px;">接单数量</span></template>
          <el-input style="width: 70%" v-model="form.orderQuantity" disabled/>
        </el-form-item>
        <el-form-item prop="processSum">
          <template #label><span style="font-size: 15px;">加工总数</span></template>
          <el-input style="width: 70%" v-model="form.processSum" disabled/>
        </el-form-item>
        <el-form-item prop="scrapSum">
          <template #label><span style="font-size: 15px;">报废总数</span></template>
          <el-input style="width: 70%" v-model="form.scrapSum" disabled/>
        </el-form-item>
        <el-form-item prop="number">
          <template #label><span style="font-size: 14px;">本次发货数量</span></template>
<!--          <el-input style="width: 70%" v-model="recordForm.number" />-->
          <XInputNumber
              class="number-left"
              style="width: 70%; text-align: left"
              v-model="recordForm.number"
              :min="0"
              placeholder="请输入本次加工数量"
          />
          <div style="width: 100%;color: #0f3d7a;top:2px" >当前已发货:  {{form.shipSum?form.shipSum:'0'}}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="recordShipButtonLoading" type="primary" @click="submitShipRecordForm('3')">确 定</el-button>
          <el-button @click="recordCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SourceProcessOrder" lang="ts">
import {
  listSourceProcessOrder,
  getSourceProcessOrder,
  delSourceProcessOrder,
  addSourceProcessOrder,
  updateSourceProcessOrder
} from '@/api/outsource/sourceProcessOrder';
import {
  SourceProcessOrderVO,
  SourceProcessOrderQuery,
  SourceProcessOrderForm
} from '@/api/outsource/sourceProcessOrder/types';
import {VxeTableEvents, VxeTablePropTypes} from 'vxe-table'
import {ref} from "vue";
import useUserStore from "@/store/modules/user";
import {getCraftList} from "@/api/basedata/craft";
import {CraftQuery} from "@/api/basedata/craft/types";
import {CommodityForm} from "@/api/order/commodity/types";
import {QuotationVO} from "@/api/order/quotation/types";
import {
  SourceProcessOrderRecordForm,
  SourceProcessOrderRecordQuery, SourceProcessOrderRecordVO
} from "@/api/outsource/sourceProcessOrderRecord/types";
import {
  addSourceProcessOrderRecord, delSourceProcessOrderRecord,
  getSourceProcessOrderRecord,
  getSourceProcessOrderRecordList,
  listSourceProcessOrderRecord
} from "@/api/outsource/sourceProcessOrderRecord";
import {OrderVO} from "@/api/order/directOrder/types";
import dayjs from "dayjs";
import {ElMessageBox} from "element-plus";
import {checkPermi} from "@/utils/permission";
import {deepClone} from "@/utils";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const sourceProcessOrderList = ref<SourceProcessOrderVO[]>([]);
const sourceProcessOrderRecordList = ref<SourceProcessOrderRecordVO[]>([]);
const buttonLoading = ref(false);
const addButtonLoading = ref(false);
const scrapButtonLoading = ref(false);
const shipButtonLoading = ref(false);
const recordAddButtonLoading = ref(false);
const recordShipButtonLoading = ref(false);
const recordScrapButtonLoading = ref(false);
const loading = ref(true);
const recordLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const queryFormRef = ref<ElFormInstance>();
const sourceProcessOrderFormRef = ref<ElFormInstance>();
const sourceProcessOrderRecordFormRef = ref<ElFormInstance>();
const sourceShipOrderRecordFormRef = ref<ElFormInstance>();
const sourceScrapOrderRecordFormRef = ref<ElFormInstance>();
let tab_index = ref(0);
const tableRef = ref()

/*弹窗属性*/
declare interface DialogOption {
  title?: string;
  visible: boolean;
}

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const recordDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordScrapDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const recordShipDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
/*新增编辑抽屉*/
const dialogTableLoading = ref(false)
const dialogInfoTableLoading = ref(false)
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入>0的整数'))
  } else if (!/^\d*$/.test(value)) {
    console.log("正则：",value)
    callback(new Error('请输入>0的整数'))
  } else {
    callback()
  }
}
const validatePass1 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('加工数量必须为>0的整数'))
  } else if (!/^\d*$/.test(value)) {
    console.log("正则：",value)
    callback(new Error('加工数量必须为>0的整数'))
  } else {
    callback()
  }
}
const validatePass3 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('报废数量必须为>0的整数'))
  } else if (!/^\d*$/.test(value)) {
    console.log("正则：",value)
    callback(new Error('报废数量必须为>0的整数'))
  } else {
    callback()
  }
}
const validatePass4 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('发货数量必须为>0的整数'))
  } else if (!/^\d*$/.test(value)) {
    console.log("正则：",value)
    callback(new Error('发货数量必须为>0的整数'))
  } else {
    callback()
  }
}

const initFormData: SourceProcessOrderForm = {
  id: undefined,
  code: undefined,
  customerName: undefined,
  costId: undefined,
  deliveryDate: undefined,
  orderQuantity: undefined,
  ownerId: undefined,
  orderDate: undefined,
  remark: undefined
}
const data = reactive<PageData<SourceProcessOrderForm, SourceProcessOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: undefined,
    customerName: undefined,
    costId: undefined,
    deliveryDate: undefined,
    orderQuantity: undefined,
    ownerId: undefined,
    orderDate: undefined,
  },
  rules: {
    code: [
      {required: true, message: "编码不能为空", trigger: "blur"}
    ],
    customerName: [
      {required: true, message: "客户编号不能为空", trigger: "blur"}
    ],
    costId: [
      {required: true, message: "接单工序不能为空", trigger: "blur"}
    ],
    deliveryDate: [
      {required: true, message: "交货日期不能为空", trigger: "blur"}
    ],
    orderQuantity: [
      // {required: true, message: "接单数量不能为空", trigger: "blur"},
      // {pattern: /\d/, message: "只能输入整数", trigger: "blur" }
      { validator: validatePass2, trigger: ['blur','change']}
    ],
    ownerId: [
      {required: true, message: "所属单位ID不能为空", trigger: "blur"}
    ],
    orderDate: [
      {required: true, message: "接单日期不能为空", trigger: "blur"}
    ],
    orderDate: [
      {required: true, message: "接单日期不能为空", trigger: "blur"}
    ],
  }
});


const initRecordFormData: SourceProcessOrderRecordForm = {
  id: undefined,
  ownerId: undefined,
  number: undefined,
  recordType: undefined
}
const recordData = reactive<PageData<SourceProcessOrderRecordForm, SourceProcessOrderRecordQuery>>({
  recordForm: {...initRecordFormData},
  queryRecordParams: {
    ownerId: undefined,
    number: undefined,
    recordType: undefined,
    processId: undefined,
  },
  recordRules: {
    number: [
      // {required: true, message: () => `加工数量不能为空`, trigger: "blur"},
      { validator: validatePass1, trigger: ['blur','change']}
    ]
  },
  recordScrapRules: {
    number: [
      //{required: true, message: () => `报废数量不能为空`, trigger: "blur"},
      { validator: validatePass3, trigger: ['blur','change']}
    ]
  },
  recordShipRules: {
    number: [
      // {required: true, message: () => `${recordScrapDialog.visible ? '报废' : recordShipDialog.visible ? '发货' : '加工'}数量不能为空`, trigger: "blur"},
      { validator: validatePass4, trigger: ['blur','change']}
    ]
  }
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

const columnList = ref([

  {title: "序号", type: 'seq', align: 'center', width: '60'},
  // {type: 'checkbox', align: 'center', field: "checkbox", width: '40',},
  {
    title: '外协接单编号',
    field: 'code',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入外协接单编号'}
  },
  {
    title: '客户编号',
    field: 'customerName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入客户编号'}
  },
  {
    title: '接单工序',
    field: 'costName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入接单工序'}
  },
  {
    title: '交货日期',
    field: 'deliveryDate',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {placeholder: '请输入交货日期',startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD'  }
  },
  {
    title: '接单数量',
    field: 'orderQuantity',
    align: 'center',
    filterType: 'intervalNumber',
    filterParam: {placeholder: '请输入接单数量',startParams: { type: 'number' }, endParams: { type: 'number' }}
  },
  {
    title: '加工总数',
    field: 'processSum',
    align: 'center',
    filterType: 'intervalNumber',
    filterParam: {placeholder: '请输入接单数量',startParams: { type: 'number' }, endParams: { type: 'number' }}
  },
  {
    title: '报废总数',
    field: 'scrapSum',
    align: 'center',
    filterType: 'intervalNumber',
    filterParam: {placeholder: '请输入接单数量',startParams: { type: 'number' }, endParams: { type: 'number' }}
  },
  {
    title: '发货总数',
    field: 'shipSum',
    align: 'center',
    filterType: 'intervalNumber',
    filterParam: {placeholder: '请输入接单数量',startParams: { type: 'number' }, endParams: { type: 'number' }}
  },
  {
    title: '接单人',
    field: 'createByName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入接单人'}
  },
  {
    title: '接单日期',
    field: 'orderDate',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {placeholder: '接单日期' ,startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD' }
  },
  {
    title: '备注',
    field: 'remark',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入备注'}
  },
  {title: '操作', field: 'make', align: 'center', width: '250', fixed: 'right',},
]);

const recordProcessColumnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '本次加工数量', field: 'number', align: 'center'},
  {title: '操作人', field: 'createByName', align: 'center'},
  {title: '操作时间', field: 'createTime', align: 'center'},
  {title: '操作', field: 'make', align: 'center', fixed: 'right'},
]);

const recordScrapColumnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '本次报废数量', field: 'number', align: 'center'},
  {title: '操作人', field: 'createByName', align: 'center'},
  {title: '操作时间', field: 'createTime', align: 'center'},
  {title: '操作', field: 'make', align: 'center', fixed: 'right'},
]);

const recordShipColumnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '本次发货数量', field: 'number',  align: 'center'},
  {title: '操作人', field: 'createByName',  align: 'center'},
  {title: '操作时间', field: 'createTime',  align: 'center'},
  {title: '操作', field: 'make', align: 'center', width: '233', fixed: 'right'},
]);

const checkedSourceProcessOrderList = ref<SourceProcessOrderVO[]>([]);

const {queryParams, form, rules} = toRefs(data);
const {queryRecordParams, recordForm, recordRules,recordScrapRules,recordShipRules} = toRefs(recordData);

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

/** 查询外协加工接单管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSourceProcessOrder(queryParams.value);
  sourceProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询外协加工接单管理列表 */
const getRecordList = async (row?: SourceProcessOrderRecordVO) => {
  console.log("入参：",row)
  recordLoading.value = true;
  queryRecordParams.value = row
  console.log("加工列表入参：",queryRecordParams.value)
  const res = await getSourceProcessOrderRecordList(queryRecordParams.value);
  console.log("加工列表：",res.data)
  sourceProcessOrderRecordList.value = res.data;
  recordLoading.value = false;
}

/*获取外协加工单详情*/
const handleSelect = async (row?: SourceProcessOrderVO) => {
  reset();
  recordReset();
  recordTable.value = "基本信息"
  dialog.visible = true;
  dialog.title = "外接单详情";
  dialogInfoTableLoading.value = true
  const _id = row?.id || ids.value[0]
  const res = await getSourceProcessOrder(_id)
  form.value = res.data
  recordForm.value = res.data
  console.log("查询明细表单数据：", recordForm.value)
  //根据表单工序id获取工序名称
  dialogInfoTableLoading.value = false
}

const recordTable = ref('基本信息');

const handleClick = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  console.log("tab.", tab.index);
  tab_index = tab.index;
  console.log("tab_index：",tab_index)
  queryRecordParams.value.processId = form.value.id
  if (tab.index == 0) {
    const res = await getSourceProcessOrder(form.value.id )
    form.value = res.data
  } else if (tab.index == 1) {
    queryRecordParams.value.recordType = tab.index
    await getRecordList(queryRecordParams.value);
  } else if (tab.index == 2) {
    queryRecordParams.value.recordType = tab.index
    await getRecordList(queryRecordParams.value);
  } else if (tab.index == 3) {
    queryRecordParams.value.recordType = tab.index
    await getRecordList(queryRecordParams.value);
  }

}


const craftMap = ref([])
const changeCost = (params: any) => {
  const _name = craftMap.value.find(item => item.value == params.costId)?.label;
  params.craftName = _name;
  console.log("选择工艺", _name);
}

/**
 * 获取工艺列表
 */
const setCraftList = async () => {
  console.log("获取工艺列表~")
  carftQueryParams.value.isOpen = '1'
  carftQueryParams.value.isOutSourceOrder = '1'
  const res: any = await getCraftList(carftQueryParams.value);
  if (res.data?.length) {
    craftMap.value = res.data.map((item: any) => {
      return {
        label: item.craftName,
        value: item.id,
        key: item.id
      }
    })
  }
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 取消按钮 */
const recordCancel = () => {
  recordReset();
  recordDialog.visible = false;
  recordShipDialog.visible = false;
  recordScrapDialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  sourceProcessOrderFormRef.value?.resetFields();
}

/** 表单重置 */
const recordReset = () => {
  recordForm.value = {...initRecordFormData};
}

/** 新增按钮操作 */
const handleAdd = () => {
  setCraftList();
  reset();
  recordTable.value = "基本信息"
  dialog.visible = true;
  dialog.title = "新增外协接收单";
  form.value.orderDate = dayjs().format('YYYY-MM-DD')
  //给表单接单人复制
  form.value.createByName = useUserStore().nickname
  form.value.orderQuantity = '0'
}

/** 提交按钮 */
const submitRecordForm = async (index: string) => {
  let stats = false;
  sourceProcessOrderRecordFormRef.value?.validate(async (valid: boolean) => {
    console.log("进来处理详细记录表单",index)
    if (valid) {
      if (index == 1){
        recordAddButtonLoading.value = true;
        recordForm.value.recordType = index
        recordForm.value.processId = form.value.id
        await addSourceProcessOrderRecord(recordForm.value).finally(() => recordAddButtonLoading.value = false);
        proxy?.$modal.msgSuccess("新增成功！");
        recordDialog.visible = false;
      }
      if (index == 2){
        recordScrapButtonLoading.value = true;
        recordForm.value.recordType = index
        recordForm.value.processId = form.value.id
        console.log("进来了",Number(form.value.processSum))
        if( (Number(recordForm.value.number)+Number(form.value.scrapSum)) > Number(form.value.processSum)){
          await ElMessageBox.confirm('加工总数'+Number(form.value.processSum)+'当前已报废'+Number(form.value.scrapSum)+',本次报废数量'+Number(recordForm.value.number) +',是否确认报废？', '超量报废提醒', {
            confirmButtonText: '确认报废',
            cancelButtonText: '我再想想',
            type: 'warning'
          }).then(() => {
            recordScrapButtonLoading.value = false;
          }).catch(()=>{
            stats = true;
            recordScrapButtonLoading.value = false;
          });
          if (stats){
            return;
          }
          await addSourceProcessOrderRecord(recordForm.value)
          recordScrapButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordScrapDialog.visible = false;
        }else {
          await addSourceProcessOrderRecord(recordForm.value)
          recordScrapButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordScrapDialog.visible = false;
        }
      }
      if (index == 3){
        recordShipButtonLoading.value = true;
        recordForm.value.recordType = index
        recordForm.value.processId = form.value.id
        console.log()
        let stats = false;
        if( (Number(recordForm.value.number)+Number(form.value.shipSum)) > Number(form.value.orderQuantity)){
          await ElMessageBox.confirm('接单总数'+Number(form.value.orderQuantity)+',当前已发数量'+Number(form.value.shipSum)+',本次发货数量'+Number(recordForm.value.number) +',是否确认发货？', '超量发货提醒', {
            confirmButtonText: '确认发货',
            cancelButtonText: '我再想想',
            type: 'warning'
          }).then(() => {
            recordShipButtonLoading.value = false;
          }).catch(()=>{
            recordShipButtonLoading.value = false;
            stats = true;
          });
          if(stats){
            return;
          }
          await addSourceProcessOrderRecord(recordForm.value)
          recordShipButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordShipDialog.visible = false;
        }else {
          await addSourceProcessOrderRecord(recordForm.value)
          recordShipButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordShipDialog.visible = false;
        }
      }

      queryRecordParams.value.processId = form.value.id
      queryRecordParams.value.recordType = index
      await getRecordList(queryRecordParams.value);
      index = '';
      await getList();
    }
  });
}

/** 提交按钮 */
const submitScrapRecordForm = async (index: string) => {
  let stats = false;
  sourceScrapOrderRecordFormRef.value?.validate(async (valid: boolean) => {
    console.log("进来处理详细记录表单",index)
    if (valid) {
      if (index == 2){
        recordScrapButtonLoading.value = true;
        recordForm.value.recordType = index
        recordForm.value.processId = form.value.id
        console.log("进来了",Number(form.value.processSum))
        if( (Number(recordForm.value.number)+Number(form.value.scrapSum)) > Number(form.value.processSum)){
          await ElMessageBox.confirm('加工总数'+Number(form.value.processSum)+'当前已报废'+Number(form.value.scrapSum)+',本次报废数量'+Number(recordForm.value.number) +',是否确认报废？', '超量报废提醒', {
            confirmButtonText: '确认报废',
            cancelButtonText: '我再想想',
            type: 'warning'
          }).then(() => {
            recordScrapButtonLoading.value = false;
          }).catch(()=>{
            stats = true;
            recordScrapButtonLoading.value = false;
          });
          if (stats){
            return;
          }
          await addSourceProcessOrderRecord(recordForm.value)
          recordScrapButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordScrapDialog.visible = false;
        }else {
          await addSourceProcessOrderRecord(recordForm.value)
          recordScrapButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordScrapDialog.visible = false;
        }
      }

      queryRecordParams.value.processId = form.value.id
      queryRecordParams.value.recordType = index
      await getRecordList(queryRecordParams.value);
      index = '';
      await getList();
    }
  });
}

/** 提交按钮 */
const submitShipRecordForm = async (index: string) => {
  let stats = false;
  sourceShipOrderRecordFormRef.value?.validate(async (valid: boolean) => {
    console.log("进来处理详细记录表单",index)
    if (valid) {
      if (index == 3){
        recordShipButtonLoading.value = true;
        recordForm.value.recordType = index
        recordForm.value.processId = form.value.id
        console.log()
        let stats = false;
        if( (Number(recordForm.value.number)+Number(form.value.shipSum)) > Number(form.value.orderQuantity)){
          await ElMessageBox.confirm('接单总数'+Number(form.value.orderQuantity)+',当前已发数量'+Number(form.value.shipSum)+',本次发货数量'+Number(recordForm.value.number) +',是否确认发货？', '超量发货提醒', {
            confirmButtonText: '确认发货',
            cancelButtonText: '我再想想',
            type: 'warning'
          }).then(() => {
            recordShipButtonLoading.value = false;
          }).catch(()=>{
            recordShipButtonLoading.value = false;
            stats = true;
          });
          if(stats){
            return;
          }
          await addSourceProcessOrderRecord(recordForm.value)
          recordShipButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordShipDialog.visible = false;
        }else {
          await addSourceProcessOrderRecord(recordForm.value)
          recordShipButtonLoading.value = false;
          proxy?.$modal.msgSuccess("新增成功！");
          recordShipDialog.visible = false;
        }
      }

      queryRecordParams.value.processId = form.value.id
      queryRecordParams.value.recordType = index
      await getRecordList(queryRecordParams.value);
      index = '';
      await getList();
    }
  });
}

/** 加工录入 **/
const handleAddRecord = async (orderId: any) => {
  recordReset();
  recordDialog.visible = true;
  recordDialog.title = "加工数量录入";
  //给表单接单人复制
  recordForm.value.createByName = useUserStore().nickname
  console.log("入参：",orderId);
  const res = await getSourceProcessOrder(orderId);
  form.value = res.data
  recordForm.value.costName = craftMap.value.find(item => item.value == form.value.costId)?.label;
  if (!form.value.shipSum){
    form.value.shipSum = '0'
  }
  if (!form.value.scrapSum){
    form.value.scrapSum = '0'
  }
  if (!form.value.processSum){
    form.value.processSum = '0'
  }
  recordForm.value.costName = craftMap.value.find(item => item.value == form.value.costId)?.label;
}

/** 报废录入 **/
const handleScrapRecord = async (orderId: any) => {
  recordReset();
  recordScrapDialog.visible = true;
  recordScrapDialog.title = "报废数量录入";
  //给表单接单人复制
  recordForm.value.createByName = useUserStore().nickname
  console.log("入参：",orderId);
  const res = await getSourceProcessOrder(orderId);
  form.value = res.data
  if (!form.value.shipSum){
    form.value.shipSum = '0'
  }
  if (!form.value.scrapSum){
    form.value.scrapSum = '0'
  }
  if (!form.value.processSum){
    form.value.processSum = '0'
  }
  recordForm.value.costName = craftMap.value.find(item => item.value == form.value.costId)?.label;
}

/** 发货录入 **/
const handleShipRecord = async (orderId: any) => {
  recordReset();
  recordShipDialog.visible = true;
  recordShipDialog.title = "发货数量录入";
  //给表单接单人复制
  recordForm.value.createByName = useUserStore().nickname
  console.log("入参：",orderId);
  const res = await getSourceProcessOrder(orderId);
  form.value = res.data
  if (!form.value.shipSum){
    form.value.shipSum = '0'
  }
  if (!form.value.scrapSum){
    form.value.scrapSum = '0'
  }
  if (!form.value.processSum){
    form.value.processSum = '0'
  }
  recordForm.value.costName = craftMap.value.find(item => item.value == form.value.costId)?.label;
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

/** 提交按钮 */
const submitForm = () => {
  sourceProcessOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSourceProcessOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addSourceProcessOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("保存成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceProcessOrderVO) => {
  const _ids = row?.id || ids.value;
  console.log("删除数据：",_ids)
  await proxy?.$modal.confirm('删除后数据不可恢复，是否确认删除？', {
    confirmButtonText: '确认删除',
    cancelButtonText: '我再想想',
    type: 'warning'
  }).finally(() => loading.value = false);
  await delSourceProcessOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 删除按钮操作 */
const handleRecordDelete = async (row?: SourceProcessOrderRecordVO) => {
  const _ids = row?.id || ids.value;
  console.log("删除数据：",_ids)
  console.log("row：",row)
  console.log("删除数据下表：",tab_index)
  await proxy?.$modal.confirm('是否确认删除此条数据？').finally(() => loading.value = false);
  await delSourceProcessOrderRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  queryRecordParams.value.processId = row.processId
  queryRecordParams.value.recordType = tab_index
  await getRecordList(queryRecordParams.value);
  await getList();
}

/** 导出按钮操作 */
const handleExport = async () => {
  const $table = XTableRef.value.xTableRef;
  let hasSearch = false
  if ($table) {
    // 判断是否有筛选条件
    let params = deepClone(queryParams.value)
    delete params?.pageNum
    delete params?.pageSize
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
  proxy?.download('outsource/sourceProcessOrder/export', {
    ...queryParams.value,tableName: 'sourceProcessOrder'
  }, `外协加工接单_${new Date().getTime()}.xlsx`)
}

/**
 * 合计列
 * @param columns
 * @param data
 */
const footerMethod: VxeTablePropTypes.FooterMethod<QuotationVO> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "number") {
        return `${sumNum(data, "number").toFixed(0)} `;
      }
      return "";
    })
  ];
};

const sumNum = (list: OrderVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    // console.log(field + ': --' + item[field])
    count += Number(item[field] || 0);
  });
  return Number(count.toFixed(4));
};


onMounted(() => {
  getList();
  setCraftList();
});
</script>
<style>
.p-2 {
  overflow: hidden;
}
</style>

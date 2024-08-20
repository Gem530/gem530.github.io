<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
            <div style="float:right;">
              <el-button type="primary" @click="handleAdd"> 新增</el-button>
              <el-button v-if="radioTable == 2 && editableTabsValue == 2" plain @click="auditData"> 审核</el-button>
              <el-button plain @click="handleExport">导出 </el-button>
            </div>
      </template>
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" type="border-card" class="xtable-tab">
        <el-tab-pane label="按领料单展示" :name="1">
          <el-radio-group v-model="radioTable" size="small">
            <el-radio-button v-if="checkPermi(['purchase:materialRequisition:audit'])" :label="2" @change="listRadio('2')">待审核列表</el-radio-button>
            <el-radio-button :label="0" @change="listRadio('')">领料列表</el-radio-button>
          </el-radio-group>
          <XTable height="100%" class="xtable-content" toolId="materialRequisition"
                  ref="pickingXTableRef"
                  v-loading="loading"
                  :pageShow="true"
                  v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="materialApplyList"
                  :columnList="columnList"
                  :intervalCondition="['createTime']"
                  :sort-orders="sortCondition"
                  border :showRefresh="true"
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
                <template #default-status="scope">
                  <!-- statusList -->
                  <dict-tag :options="statusList" :value="scope.row.status"/>
                </template>
                <template #default-make="scope">
                  <el-button link type="primary"
                             @click="getHistoryList(scope.row)">审核记录
                  </el-button>
                    <el-button  v-if="scope.row.status =='3' && scope.row.returnableQuantity>0"  link type="primary"
                             @click="requisitionReturn(scope.row)">还料
                  </el-button>
                    <el-button  v-if="scope.row.status =='3' && scope.row.returnableQuantity<scope.row.quantity"  link type="primary"
                             @click="requisitionReturnRecord(scope.row)">还料记录
                  </el-button>
                </template>
              </XTable>
            </template>

            <template #default-make="scope">
              <el-button v-if="scope.row.status =='1'" link type="primary"
                         @click="handleUpdate(scope.row)">修改
              </el-button>
              <el-button v-if="scope.row.status =='1'" link type="primary"
                         @click="submitData(scope.row)">提交
              </el-button>
              <el-button v-if="scope.row.status =='1'" link type="primary"
                         @click="deleteData(scope.row)">删除
              </el-button>
              <el-button v-if="(scope.row.status =='2' || scope.row.status =='4') && radioTable =='2' && checkPermi(['purchase:materialRequisition:audit'])" link type="primary" @click="auditData(scope.row)">审核</el-button>
              <el-button link type="primary" @click="handleSelect(scope.row)">详情</el-button>
              <el-button v-if="radioTable != '2'" link type="primary" @click="doPrint(scope.row)">预览 </el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="按物料展示" :name="2">
          <el-radio-group v-model="radioTable" size="small">
            <el-radio-button v-if="checkPermi(['purchase:materialRequisition:audit'])" :label="2" @change="listRadio('2')">待审核列表</el-radio-button>
            <el-radio-button :label="0" @change="listRadio('')">领料列表</el-radio-button>
          </el-radio-group>
          <XTable height="100%" class="xtable-content" toolId="purchaseMaterialRequisition"
                  v-loading="loadingByMaterial"
                  ref="requisitionByMaterialRef"
                  :pageShow="true"
                  v-model:page-size="byMaterialParams.pageSize"
                  v-model:current-page="byMaterialParams.pageNum"
                  @checkbox-all="handleSelectionChange"
                  @checkbox-change="handleSelectionChange"
                  :checkbox-config="{ reserve: true }"
                  :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: byMaterialTotal }"
                  :data="listByMaterial"
                  :columnList="listByMaterialColumnList"
                  :intervalCondition="['createTime']"
                  border :showRefresh="true"
                  @searchChange="searchChangeByMaterial"

          >

            <template #default-status="scope">
              <!-- statusList -->
              <dict-tag :options="statusList" :value="scope.row.status"/>
            </template>
            <template #default-make="scope">
              <el-button v-if="scope.row.status =='1'" link type="primary"
                         @click="handleUpdate(scope.row)">修改
              </el-button>
              <el-button v-if="scope.row.status =='1'" link type="primary"
                         @click="submitData(scope.row)">提交
              </el-button>
              <el-button v-if="scope.row.status =='1'" link type="primary"
                         @click="deleteData(scope.row)">删除
              </el-button>
              <el-button link type="primary"
                         @click="getHistoryList(scope.row)">审核记录
              </el-button>
              <el-button  v-if="scope.row.status =='3' && scope.row.returnableQuantity>0"  link type="primary"
                          @click="requisitionReturn(scope.row)">还料
              </el-button>
              <el-button  v-if="scope.row.status =='3' && scope.row.returnableQuantity<scope.row.quantity"  link type="primary"
                          @click="requisitionReturnRecord(scope.row)">还料记录
              </el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="80%" destroy-on-close>
      <el-form :model="form" label-width="80px" ref="materialApplyFormRef" :rules="rules"
               :disabled="dialog.title === '物料申请详情'" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料人">
              <el-input :disabled="true" style="width: 50%;" v-model="form.createByName"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料部门">
              <el-input :disabled="true" style="width: 50%;" v-model="form.createDeptName"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料时间">
              <el-date-picker
                :disabled="true"
                v-model="form.createTime"
                type="date"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                clearable

              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10" class="mb8">
<!--        <el-col :span="1.5">-->
<!--          <el-button v-show="dialog.title != '物料申请详情'" type="primary" plain @click="selectMaterial">选择物料</el-button>-->
<!--        </el-col>-->
        <!--<el-col :span="1.5">
          <el-button v-show="dialog.title != '物料申请详情'" plain @click="handlempty()">清空</el-button>
        </el-col>-->
      </el-row>
      <el-divider content-position="left">已选物料</el-divider>
      <XTable :pageShow="false" ref="confirmTable" :data="confirmSelectInventoryList" border
              height="400"
              :columnList="confirmSelectInventoryColumnList">
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
          <el-input-number :disabled="dialog.title === '物料申请详情'" style="width: 99%;" :step="0" :controls="false" :max="Number(scope.row.actualStock)"
                           :precision="0" v-model="scope.row.quantity"/>
        </template>
        <template #default-remark="scope">
          <el-input v-model="scope.row.remark" type="textarea" :rows="1" maxlength="100"></el-input>
        </template>
        <template #default-make="scope">
          <el-button
            v-if="dialog.title != '物料申请详情'"
            link
            type="primary"
            @click="handleSelectDelete(scope.row)"

          >删除
          </el-button
          >
        </template>
      </XTable>
      <div v-if="dialog.title != '物料申请详情'">
        <el-divider content-position="left">待选物料</el-divider>
        <XTable
          toolId="selectMaterial"
          v-loading="materialLoading"
          :pageShow="true"
          v-model:page-size="selectQueryParams.pageSize"
          v-model:current-page="selectQueryParams.pageNum"
          :page-params="{ perfect: true, total: selectTotal }"
          :data="materialInventoryList"
          :columnList="selectedMaterialColumnList"
          ref="inventoryTableRef"
          @searchChange="pageChange"
          :checkbox-config="{ reserve: true,trigger: 'row'}"
          :row-config="{ keyField: 'rawMaterialInventoryId' }"
          @checkbox-change="selectChangeEvent"
          @checkbox-all="selectAllChangeEvent"
          height="400"
        >
          <template #default-categoryId="scope">
            <div>{{ scope.row.categoryName }}</div>
          </template>
          <template #default-onWayStock="scope">
            <div>{{ scope.row.onWayStock?scope.row.onWayStock : 0 }}</div>
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
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="dialog.visible = false">取消</el-button>
            <el-button
              v-if="dialog.title != '物料申请详情'"
              :loading="buttonLoading"
              type="primary"
              @click="submitForm('1')">保 存</el-button>
            <el-button
              v-if="dialog.title != '物料申请详情'"
              :loading="buttonLoading"
              type="primary"
              @click="submitForm('2')">保存并提交</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

<!--    <el-dialog v-model="dialogMaterial.visible" title="选择物料" width="80%" draggable destroy-on-close>-->
<!--      <el-row>-->
<!--        <el-col :span="5">-->
<!--          <el-table size="small" :data="selectInventoryList" height="440" :border="true">-->
<!--            <el-table-column property="rawMaterialCode" fixed/>-->
<!--            <el-table-column v-show="false" property="name" label="已选物资"/>-->
<!--            <el-table-column align="center">-->
<!--              <template #default="scope">-->
<!--                <el-tooltip content="删除" placement="top">-->
<!--                  <el-button-->
<!--                    link-->
<!--                    type="primary"-->
<!--                    icon="CloseBold"-->
<!--                    @click="handleInventoryListDelete(scope.row)"-->

<!--                  ></el-button>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-col>-->
<!--        <el-col :span="19">-->
<!--          <XTable-->
<!--            v-loading="materialLoading"-->
<!--            :pageShow="true"-->
<!--            v-model:page-size="selectQueryParams.pageSize"-->
<!--            v-model:current-page="selectQueryParams.pageNum"-->
<!--            :page-params="{ perfect: true, total: selectTotal }"-->
<!--            :data="materialInventoryList"-->
<!--            :columnList="selectedMaterialColumnList"-->
<!--            ref="inventoryTableRef"-->
<!--            @searchChange="pageChange"-->
<!--            :checkbox-config="{ reserve: true }"-->
<!--            :row-config="{ keyField: 'rawMaterialInventoryId' }"-->
<!--            @checkbox-change="selectChangeEvent"-->
<!--            @checkbox-all="selectAllChangeEvent"-->
<!--            height="440"-->
<!--          >-->
<!--            <template #default-categoryId="scope">-->
<!--              <div>{{ scope.row.categoryName }}</div>-->
<!--            </template>-->
<!--            <template #default-onWayStock="scope">-->
<!--              <div>{{ scope.row.onWayStock?scope.row.onWayStock : 0 }}</div>-->
<!--            </template>-->
<!--            &lt;!&ndash; <template #default-units="scope">-->
<!--              <dict-tag :options="unitsTypeList" :value="scope.row.units" />-->
<!--            </template>-->
<!--            <template #default-level="scope">-->
<!--              <dict-tag :options="orderMaterialLevelList" :value="scope.row.level" />-->
<!--            </template>-->
<!--            <template #default-manufacturer="scope">-->
<!--              <dict-tag :options="orderPlateBrandList" :value="scope.row.manufacturer" />-->
<!--            </template> &ndash;&gt;-->
<!--          </XTable>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <template #footer>-->
<!--        <div style="display: flex; justify-content: center;">-->
<!--          <span class="dialog-footer">-->
<!--            <el-button @click="clearInventoryForm">取消</el-button>-->
<!--            <el-button :loading="buttonLoading" type="primary" @click="submitInventoryForm"-->
<!--            >确 定</el-button-->
<!--            >-->
<!--          </span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->

    <el-dialog
      title="审批备注"
      v-model="dialogSubmit.visible"
      width="30%"
      destroy-on-close
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="审批备注">
          <el-input v-model="form.checkRemark" type="textarea" :rows="4" show-word-limit maxlength="500"
                    placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button :loading="buttonLoading" @click="handleReject" type="danger">驳回</el-button>
        <el-button :loading="buttonLoading" @click="handlePass" type="primary">通过</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="exportVisible"
      title="导出提示"
      width="20%"
      align-center
      destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!--查看审核记录弹窗-->
    <el-dialog :title="dialogFlow.title" v-model="dialogFlow.visible" width="40%" append-to-body destroy-on-close
               :close-on-click-modal="false"
               v-loading="isLoading">
        <XTable toolId="chooseScrapProduction" :page-show="false"
                :data="flowList"
                :columnList="flowColumnList"
                height="500px"
                :isAutoHeight="true"
        >
          <template #default-comment.type="scope">
            {{scope.row.comment?.type == '3' ? '审核驳回' : (scope.row.taskName == '提交人')? '提交' : '审核通过'}}
          </template>
          <template #default-comment.comment="scope">
            {{scope.row.comment?.comment}}
          </template>
        </XTable>
      <template #footer>
          <el-button @click="dialogFlow.visible = false">取消</el-button>
      </template>
    </el-dialog>
    <!--物料归还弹窗-->

    <RequisitionReturnDialog v-if="dialogReturn.visible" @refresh="getVoidedList"  v-model:show="dialogReturn.visible" :title="dialogReturn.title" :formShow="formShow" :formData="returnForm"></RequisitionReturnDialog>

    <div v-if="currentPrintInfo">
      <div style="display: none; width: 600pt !important;padding-right:5pt;" ref="cardRef">
        <div style="width:100%;text-align:center;font-size:10pt;">
          <div style="width: 100%;display: flex;justify-content: center;">
            <div style="width: 20%;"></div>
            <div style="width: 60%;">
              <div style="font-size:18pt;font-weight:bold;">{{ currentPrintInfo.enterpriseName }}</div>
              <div style="font-size:14pt;padding-top:5pt">{{ currentPrintInfo.enterpriseEName }}</div>
            </div>
            <div style="width: 20%;justify-content: start;">
              <img style="width: 50pt;" :src="currentPrintInfo.qcCodeImage" />
            </div>
          </div>
          <div style="">工厂地址：{{ currentPrintInfo.enterpriseAddress }}&nbsp;&nbsp;电话：{{ currentPrintInfo.enterprisePhoneNumber }}
          </div>
          <div style="font-size:16pt;font-weight:600;">领&nbsp;料&nbsp;单</div>
          <div style="padding-top: 10px"> <span style="float: left">领料单号：{{ currentPrintInfo.code }}</span><span style="float: right">领料部门：{{ currentPrintInfo.createDeptName }}</span>
          </div>
        </div>
        <div style="min-height:200pt">
          <!--默认打印模板-->
          <table style="border-collapse: collapse; border: none;width:100%;">
            <thead>
            <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 20pt;">序号</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 90pt;">物料编码</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 80pt;">物料名称</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 70pt;">规格参数</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 40pt;">单位</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 40pt;">领料数量</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 40pt;">存货仓</th>
              <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 70pt;">备注</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in currentPrintInfo.rawMaterialRequisitionVos">
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ index + 1 }}</td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.rawMaterialCode }}
              </td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.name }}
              </td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.specification }}
              </td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.units }}
              </td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.quantity }}
              </td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.storageName }}
              </td>
              <td
                style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                {{ item.remark }}
              </td>
            </tr>
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
        <div style="width:100%;font-size:10pt;">
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>领料人：{{ currentPrintInfo.createByName }}</div>
            <div>核对：</div>
            <div style="width: 200pt; text-align: left;">签收人：</div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>领料日期：{{dayjs(applyTime).format("YYYY-MM-DD")}}</div>
            <div style="width: 200pt;text-align:left;">(请使用正楷签名）</div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>第一联存根(白) 第二联客户(红) 第三联回单(黄) 第四销售(绿)</div>
            <div style="width: 200pt; text-align: left;">日&nbsp;&nbsp;&nbsp;&nbsp;期：</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="MaterialRequisition" lang="ts">
  import {
    addRequisition,
    getMaterialRequisitionsByCode,
    submitMaterialRequisition,
    passMaterialRequisition,
    rejectMaterialRequisition,
    updateRequisition,
    delMaterialRequisition, getMaterialRequisitionsByCodeSelf, getFlowHistory,
    getReturnRecordListById,
    getMaterialRequisitionsPrintByCode
  } from '@/api/purchase/materialRequisition'
  import {
    MaterialApplyVO,
    MaterialApplyQuery,
    MaterialApplyForm,
    RawMaterialVO,
    RawMaterialQuery
  } from '@/api/purchase/materialApply/types';
  import {VxeTableEvents} from 'vxe-table'
  import {checkPermi} from "@/utils/permission";
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  import {listRawMaterialCategoryNoPage} from '@/api/basedata/rawMaterialCategory';
  import {CustomerAddressVO} from '@/api/basedata/customerAddress/types';
  import RequisitionReturnDialog from "@/views/purchase/materialRequisition/requisitionReturnDialog.vue";

  const dialogMaterial = reactive<DialogOption>({
    visible: false,
    title: ''
  });
  const statusList = ref([
    {label: '待提交', value: "1"},
    {label: '待审核', value: "2"},
    {label: '审核通过', value: "3"},
    {label: '驳回', value: "4"},

  ]);
  const radioTable = ref('0');

  // 新增属性
  const editableTabsValue = ref(1);
  const materialApplyList = ref();
  /**
   * 按物料展示的申请明细集合
   */
  const listByMaterial = ref<any[]>([]);

  //物料池展示的物料
  const materialInventoryList = ref([]);
  //选中的物料
  const selectInventoryList = ref([]);
  //确认选中的物料
  const confirmSelectInventoryList = ref<any[]>([]);
  //确认选中的物料-备份
  const confirmSelectInventoryCopyList = ref<any[]>([]);

  const buttonLoading = ref(false);
  const loading = ref(true);
  const isLoading = ref(true);
  const loadingByMaterial = ref(true);

  const materialLoading = ref(false);

  const ids = ref<Array<string | number>>([]);

  const single = ref(true);
  const multiple = ref(true);
  const formShow = ref(true);
  const total = ref(0);
  const byMaterialTotal = ref(0);
  const selectTotal = ref(0);

  const materialApplyFormRef = ref<ElFormInstance>();
  const inventoryTableRef = ref()
  const requisitionByMaterialRef = ref()
  const pickingXTableRef = ref()
  const confirmTable = ref()

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const dialogSubmit = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  let dialogFlow = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  let dialogReturn = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const initFormData: any = {
    id: undefined,
    createTime: undefined,
    createDeptName: undefined,
    createByName: undefined,
    addList: []
  }
  const SelectData = reactive<PageData<MaterialApplyForm, RawMaterialQuery>>({
    form: {...initFormData},
    queryParams: {
      id: undefined,
      pageNum: 1,
      pageSize: 20,
      isAsc: "desc",
      orderByColumn: "create_time",
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
      actualStock: undefined,
      availableStock: undefined,
      onWayStock: undefined,
      applyNum: undefined
    },
    rules: {
      addressId: [
        {required: true, message: "收货地址不能为空", trigger: "blur"}
      ],


    }
  });
  const {form: selectForm, queryParams: selectQueryParams, rules: selectRules} = toRefs(SelectData);

  const data = reactive<PageData<MaterialApplyForm, MaterialApplyQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      auditStatus: '2',
      isAsc: "desc",
      orderByColumn: "create_time",
      applyCode: undefined,
      applyType: undefined,
      deliverTime: undefined,
      addressId: undefined,
      applyUserId: undefined,
      applyTime: undefined,
      remark: undefined,
      params: {}
    },
    rules: {

      addressId: [
        {required: true, message: "收货地址不能为空", trigger: "blur"}
      ],
      ApplyDetailsList: [
        {required: true, message: "物料不能为空", trigger: "blur"}
      ],
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  const byMaterialParams = ref<MaterialApplyQuery>({
    pageNum: 1,
    pageSize: 20,
    auditStatus: '2',

  });


  const customerAddressList = ref<CustomerAddressVO[]>([]);

  const status = ref('');

  const listRadio = async (value: string) => {
    status.value = value;
    if (1 == editableTabsValue.value) {
      queryParams.value.pageNum = 1;
      await getList();
    } else {
      byMaterialParams.value.pageNum = 1;
      await getListByMaterial();
    }
  }

  /**
   * 查询tab页
   */
  const getVoidedList = async () => {
    console.log(radioTable.value)
    console.log(editableTabsValue.value)
    if (1 == editableTabsValue.value) {
      getList();
    } else {
      getListByMaterial();
    }
  }

  /** 时间禁选*/
  const disabledDate = (date: any) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;

  }

  /**
   * 物料类别下拉列表
   */
  const rawMaterialCategory = ref([]);

  const getListRawMaterialCategorys = async () => {
    const res: any = await listRawMaterialCategoryNoPage();

    rawMaterialCategory.value = res;
  }

  import useUserStore from "@/store/modules/user";

  const columnList = ref([
    {title: '序号', align: 'center', type: 'seq', width: '50'},
    {field: 'expand', align: 'center', type: "expand", width: '30'},
    {
      title: '领料单号',
      width: '140',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入领料单号'}
    },
    {
      title: '领料部门',
      field: 'createDeptName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入领料部门'}
    },
    {title: '领料人', field: 'createByName', align: 'center', width: '350',
      filterType: 'input',
      filterParam: {placeholder: '请输入领料人'}},
    {
      title: '申请时间', field: 'createTime', align: 'center', sortable: true, filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '操作', field: 'make', width: '250', align: 'center', showOverflow: false},
  ]);
  //物料列
  const materialColumnList = ref([
    {title: '序号', type: 'seq', width: '55', align: 'center'},
    {title: '单据状态', width: '100', field: 'status', align: 'center'},
    {title: '物料编码', field: 'rawMaterialCode', align: 'center', width: '80',},
    {title: '物料名称', field: 'name', align: 'center', width: '80',},
    {title: '物料类别', field: 'categoryName', align: 'center', width: '80',},
    {title: '单位名称', field: 'units', width: '80', align: 'center',},
    {title: '材质牌号', field: 'materialQuality', align: 'center', width: '80',},
    {title: '品牌', field: 'manufacturer', align: 'center', width: '80',},
    {title: '厚度', field: 'thickness', width: '80', align: 'center',},
    {title: '规格型号', field: 'specification', width: '80', align: 'center',},
    {title: '铜厚', field: 'copperThickness', width: '50', align: 'center',},
    {title: '板厚', field: 'boardThickness', width: '80', align: 'center',},
    {title: '直径', field: 'diameter', width: '80', align: 'center',},
    {title: '长', field: 'length', width: '80', align: 'center',},
    {title: '宽', field: 'width', width: '80', align: 'center',},
    {title: '颜色', field: 'color', width: '80', align: 'center',},
    {title: '级别', field: 'level', width: '80', align: 'center',},
    {title: '存货仓', field: 'storageName', width: '80', align: 'center',},
    {title: '实际库存', field: 'actualStock', width: '80', align: 'center',},
    {title: '可用库存', field: 'availableStock', width: '80', align: 'center',},
    {title: '在途数', field: 'onWayStock', width: '80', align: 'center',},
    {title: '领用数量', field: 'quantity', align: 'center', width: '80',},
    {title: '备注', field: 'remark', align: 'center', width: '80',},
    {title: '审核意见', field: 'checkRemark', align: 'center', width: '80',},
    {title: '操作', field: 'make', width: '180', align: 'center', fixed: 'right', showOverflow: false},
  ]);
  //物料列
  const listByMaterialColumnList = ref([
    {type: 'checkbox', align: 'center', field: "checkbox",visible:true, width: '40', fixed: 'left',},
    {title: "序号", fixed: 'left', field: 'index', type: 'seq', align: 'center', width: '55'},
    {
      title: '领料单号',
      width: '100',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入领料单号'}
    },
    {
      title: '单据状态',
      width: '100',
      field: 'status',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择状态'},
      filterData: () => statusList.value
    },
    {
      title: '领料部门',
      width: '80',
      field: 'createDeptName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '领料部门'}
    },
    {
      title: '领料人',
      width: '80',
      field: 'createByName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入领料人'}
    },
    {
      title: '领料日期', width: '160', field: 'createTime', sortable:true, align: 'center', filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      title: '物料编码',
      field: 'rawMaterialCode',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入物料编码'}
    },
    {
      title: '物料类别',
      field: 'categoryName',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入物料类别'}
    },
    {
      title: '物料名称',
      field: 'name',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入物料名称'}
    },
    {
      title: '材质牌号',
      field: 'materialQuality',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入材质牌号'}
    },
    {
      title: '品牌',
      field: 'manufacturer',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入品牌'}
    },

    {
      title: '厚度',
      field: 'thickness',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入厚度'}
    },
    {
      title: '规格型号',
      field: 'specification',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入规格型号'}
    },
    {
      title: '铜厚',
      field: 'copperThickness',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入铜厚'}
    },
    {
      title: '板厚',
      field: 'boardThickness',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板厚'}
    },
    {
      title: '直径',
      field: 'diameter',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入直径'}
    },
    {title: '长', field: 'length', width: '80', align: 'center', filterType: 'input', filterParam: {placeholder: ''}},
    {title: '宽', field: 'width', width: '80', align: 'center', filterType: 'input', filterParam: {placeholder: ''}},
    {title: '颜色', field: 'color', width: '80', align: 'center', filterType: 'input', filterParam: {placeholder: ''}},
    {title: '级别', field: 'level', width: '80', align: 'center', filterType: 'input', filterParam: {placeholder: ''}},
    {
      title: '单位',
      field: 'units',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入单位名称'},
    },
    {title: '库存数', field: 'actualStock', widtgetByMaterialListh: '80', align: 'center',},
    {title: '在途数', field: 'onWayStock', width: '80', align: 'center',},
    {title: '存货仓', field: 'storageName', width: '80', align: 'center',},
    {title: '领用数量', field: 'quantity', align: 'center', width: '80',},
    {title: '领用单价', field: 'price', width: '80', align: 'center',},
    {title: '领用金额', field: 'totalPrice', width: '80', align: 'center',},
    {title: '备注', field: 'remark', width: '80', align: 'center',},
    {title: '审核意见', field: 'checkRemark', width: '80', align: 'center',},
    {title: '操作', field: 'make', width: '200', align: 'center', fixed: 'right', showOverflow: false},
  ]);


  watch(() => [radioTable.value, listByMaterialColumnList.value], () => {
    if (listByMaterialColumnList.value?.length) {
      if (radioTable.value == '2') {
        listByMaterialColumnList.value[0].visible = true
        const field = listByMaterialColumnList.value.find((vo: any) => vo.field == 'status');
        field.filterType = undefined;
      } else {
        listByMaterialColumnList.value[0].visible = false
        const field = listByMaterialColumnList.value.find((vo: any) => vo.field == 'status');
        field.filterType = 'radioButton';
      }
    }
  }, {immediate: true})

  const selectedMaterialColumnList = ref([

    {type: 'checkbox', align: 'center', field: "checkbox", width: '40', fixed: 'left',},
    {
      title: '物料分类', field: 'categoryName', align: 'center', width: '90',
      filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '物料编码', field: 'rawMaterialCode', align: 'center', width: '90',
      filterType: 'input',
      filterParam: {placeholder: '请输入物料编码'},
    },
    {
      title: '物料名称', field: 'name', align: 'center', width: '100',
      filterType: 'input',
      filterParam: {placeholder: '请输入物料名称'},
    },
    {
      title: '板厚', field: 'boardThickness', align: 'center', width: '60', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '铜厚', field: 'copperThickness', align: 'center', width: '60', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '级别', field: 'level', align: 'center', width: '70', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '颜色', field: 'color', align: 'center', width: '60', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '长(mm)',
      field: 'length',
      align: 'center',
      width: '70',
      filterType: 'input',
      filterParam: {placeholder: '',type:'number'},
    },
    {
      title: '宽(mm)',
      field: 'width',
      align: 'center',
      width: '70',
      filterType: 'input',
      filterParam: {placeholder: '',type:'number'},
    },
    {
      title: '厚度',
      field: 'thickness',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入厚度'}
    },
    {
      title: '规格型号',
      field: 'specification',
      width: '120',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入规格型号'}
    },
    {
      title: '直径',
      field: 'diameter',
      width: '80',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入直径'}
    },
    {
      title: '品牌', field: 'manufacturer', align: 'center', width: '70', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '材质牌号', field: 'materialQuality', align: 'center', width: '70', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {
      title: '单位', field: 'units', align: 'center', width: '60', filterType: 'input',
      filterParam: {placeholder: ''},
    },
    {title: '存货仓', field: 'storageName', width: '80', align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    /*{title: '生产日期', field: 'productionDate', align: 'center',width: '80',},
    {title: '保质期(天)', field: 'expirationDays', align: 'center',width: '90',},
    {title: '过期日期', field: 'expirationDate', align: 'center',width: '80',},*/
    {title: '实际库存', field: 'actualStock', align: 'center', width: '70',},
    {title: '可用库存', field: 'availableStock', align: 'center', width: '70',},
    {title: '在途数', field: 'onWayStock', align: 'center', width: '70',},

  ]);

  //确认选中的物料表
  const confirmSelectInventoryColumnList = ref([
    {title: '序号', align: 'center', width: '50', type: 'seq'},
    {title: '物料类别', field: 'categoryName', width: '80', align: 'center',},
    {title: '物料编码', field: 'rawMaterialCode', width: '80', align: 'center',},
    {title: '物料名称', field: 'name', width: '80', align: 'center',},
    {title: '材质牌号', field: 'materialQuality', width: '60', align: 'center',},
    {title: '厚度', field: 'thickness', width: '80', align: 'center',},
    {title: '规格型号', field: 'specification', width: '80', align: 'center',},
    {title: '铜厚', field: 'copperThickness', width: '50', align: 'center',},
    {title: '板厚', field: 'boardThickness', width: '60', align: 'center',},
    {title: '颜色', field: 'color', width: '60', align: 'center',},
    {title: '级别', field: 'level', width: '60', align: 'center',},
    {title: '长(mm)', field: 'length', width: '70', align: 'center',},
    {title: '宽(mm)', field: 'width', width: '70', align: 'center',},
    {title: '品牌', field: 'manufacturer', width: '60', align: 'center',},
    {title: '库存单位', field: 'units', align: 'center', width: '60',},
    {title: '存货仓', field: 'storageName', width: '80', align: 'center',},
    {title: '实际库存', field: 'actualStock', width: '70', align: 'center',},
    {title: '可用库存', field: 'availableStock', width: '60', align: 'center',},
    {title: '在途数量', field: 'onWayStock', align: 'center', width: '80',},
    {title: '领用数量', field: 'quantity', fixed: 'right', width: '100', align: 'center',},
    {title: '备注', field: 'remark', fixed: 'right', width: '100', align: 'center',},
    {title: '操作', field: 'make', fixed: 'right', width: '60', align: 'center', showOverflow: false},
  ]);

  const sortCondition = ['createTime'];

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = params;
    if (params.sorts && params.sorts.length > 0) {
      params.sorts.forEach((item: any) => {
        queryParams.value.orderByColumn = item.prop;
        queryParams.value.isAsc = item.order;
      })
    }
    if(radioTable.value == '2'){
      if(params.status){
        status.value = params.status
      }
    }
    getList();

  }

  // 获取 搜索条件-按物料查询
  const searchChangeByMaterial = (params: any) => {
    byMaterialParams.value = params;
    if (params.sorts && params.sorts.length > 0) {
      params.sorts.forEach((item: any) => {
        byMaterialParams.value.orderByColumn = item.prop;
        byMaterialParams.value.isAsc = item.order;
      })
    }
    if(radioTable.value == '2'){
      if(params.status){
        status.value = params.status
      }
    }
    console.log(params);
    getListByMaterial();

  }

  const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<MaterialApplyVO> = ({row, rowIndex}) => {
    row.loading = false;
    if (radioTable.value == '2') {
      getMaterialRequisitionsByCodeSelf(row.code).then((res) => {
        row.inventoryList = res.data;
        row.loading = true;
        nextTick(() => {
          pickingXTableRef.value.xTableRef.refreshColumn()
        })

      });
    } else {
      getMaterialRequisitionsByCode(row.code).then((res) => {
        row.inventoryList = res.data;
        row.loading = true;
        nextTick(() => {
          pickingXTableRef.value.xTableRef.refreshColumn()
        })

      });
    }
  }

  import {deepClone} from '@/utils'
  import {getRequisitionPageList, getByMaterialList} from "@/api/purchase/materialRequisition";
  import dayjs from "dayjs";
  import {materialInventorySelectList} from "@/api/purchase/materialInventory";
  import {ref} from "vue";
  import {delSourceFullProcessOrderBack} from "@/api/outsource/sourceFullProcessOrderBack";
  import {SourceHalfProcessOrderVO} from "@/api/outsource/sourceHalfProcessOrder/types";
  import {getPrintSourceHalfProcessOrder} from "@/api/outsource/sourceHalfProcessOrder";
  import * as QRCode from "qrcode";

  /**选择物料按钮 */
  const selectMaterial = async () => {
    dialogMaterial.visible = true;
    dialogMaterial.title = "选择物料";
    selectInventoryList.value = [...confirmSelectInventoryList.value];

    console.log(confirmSelectInventoryList.value);
    console.log(111111111111)

    confirmSelectInventoryCopyList.value = deepClone(confirmSelectInventoryList.value);
    // console.log(11111111)
    // console.log(confirmSelectInventoryList.value)
    // console.log(confirmSelectInventoryCopyList.value)
    // selectInventoryList.value.forEach(item => {
    //   item.id = item.rawMaterialId;
    // });
    materialLoading.value = true;
    // selectQueryParams.value重置
    selectQueryParams.value = {
      pageNum: 1,
      pageSize: 20,
      nqName: '板材'
    }
    await pageChange(null);

    // 为不属于当前页的数据设置选中缓存
    nextTick(() => {

      const $table = inventoryTableRef.value.xTableRef
      if ($table) {
        let st = materialInventoryList.value.filter(item => {
          return selectInventoryList.value.some(item2 => item.id == item2.rawMaterialInventoryId);
        });
        console.log(st)
        console.log(222222222222222222222)
        //得到selectInventoryList.value 中 rawMaterialInventoryId 在st中不存在的数据

        let temp = selectInventoryList.value.filter(item => {
          return !st.some(item2 => item.rawMaterialInventoryId == item2.id);
        });
        console.log(temp)
        console.log(3333333333333)
        $table.setCheckboxRow(temp, true);
      }
    });
  }
  const pageChange = async (params: any) => {
    if (params) {
      selectQueryParams.value = params
      if (Array.isArray(selectQueryParams.value.categoryId)) {

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
    queryParams.value.auditStatus = status.value;
    if(radioTable.value == '2'){
      queryParams.value.status = status.value
    }
    const res = await getRequisitionPageList(queryParams.value);
    materialApplyList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }
  /** 查询物料申请列表 */
  const getListByMaterial = async () => {
    loadingByMaterial.value = true;
    byMaterialParams.value.auditStatus = status.value;
    if(radioTable.value == '2'){
      queryParams.value.status = status.value
    }
    const res = await getByMaterialList(byMaterialParams.value);
    listByMaterial.value = res.rows;
    byMaterialTotal.value = res.total;
    loadingByMaterial.value = false;
  }


  /** 查询物料库存列表 */
  const getMaterialInventory = async () => {
    selectQueryParams.value.nqName = '板材'
    const res = await materialInventorySelectList(selectQueryParams.value);
    materialInventoryList.value = res.rows;
    materialInventoryList.value.forEach(item => {
      item.rawMaterialCode = item.materialCode;
      item.onWayStock = item.inTransitNumber;
      item.units = item.unit
      item.actualStock = item.quantity
      item.availableStock = item.quantity
      item.rawMaterialInventoryId = item.id
    })
    selectTotal.value = res.total;
  }

  /**设置表格列表选中 */
  const setTableSelect = () => {

    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      //过滤materialInventoryList中id在selectInventoryList中的数据，
      let st = materialInventoryList.value.filter(item => {
        return selectInventoryList.value.some(item2 => item.rawMaterialInventoryId == item2.rawMaterialInventoryId);
      });
      //先为materialInventoryList中所有数据取消选中
      $table.setCheckboxRow(materialInventoryList, false);
      $table.setCheckboxRow(st, true);
    }
  }


  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    materialApplyFormRef.value?.resetFields();
    currentCode.value = "";
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
      selectInventoryList.value = deepClone($table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()));
    }
    submitInventoryForm();
  }

  //选择物料 单选
  const selectChangeEvent: VxeTableEvents.CheckboxChange<MaterialApplyVO> = ({checked, row}) => {
    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      selectInventoryList.value = deepClone($table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()));
      // let temp = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
      //temp 根据rawMaterialId去重 相同的rawMaterialId只保留一个
      // selectInventoryList.value = Array.from(new Set(temp.map(item => item.rawMaterialId))).map(item => temp.find(item2 => item2.rawMaterialId == item));
    }
    submitInventoryForm();
  }

  const selectRequisitionByMaterial = ref();

  /** 多选框选中数据 */
  const handleSelectionChange = (selection: MaterialApplyVO[]) => {
    const $table = requisitionByMaterialRef.value.xTableRef
    if ($table) {
      selectRequisitionByMaterial.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
    }

  }


  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    form.value.createByName = useUserStore().nickname;
    form.value.createDeptName = useUserStore().deptName;
    form.value.createTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
    dialog.visible = true;
    dialog.title = "物料申请";
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

    const tempList = deepClone(confirmSelectInventoryList.value);

    confirmSelectInventoryList.value = selectInventoryList.value;

    confirmSelectInventoryList.value.map((item2) => {
      let material = confirmSelectInventoryCopyList.value.find(item => item.rawMaterialInventoryId == item2.rawMaterialInventoryId);
      if (material) {
        item2.quantity = material.quantity;
        item2.remark = material.remark;
      //   item2.actualStock = material.quantity;
      //   item2.availableStock = material.quantity;
      } else {
      //   item2.actualStock = item2.quantity;
      //   item2.availableStock = item2.quantity;
        item2.quantity = 0;
        // item2.rawMaterialInventoryId = item2.id;
      }

      let oldData = tempList.find(item => item.isUpdate && item.rawMaterialInventoryId == item2.rawMaterialInventoryId);
      console.log(oldData)
      if(oldData){
        item2.id = oldData.id;
        item2.isUpdate = oldData.isUpdate;
        item2.flowId = oldData.flowId;
      }
    });
  }

  const currentCode = ref();

  const dialogTableLoading = ref(false)
  /** 修改按钮操作 */
    const handleUpdate = async (row?: any) => {
    reset();
    dialog.visible = true;
    dialog.title = "修改物料申请";
    dialogTableLoading.value = true
    const code = 1 == editableTabsValue.value ? row.code : row.id
    const res = await getMaterialRequisitionsByCode(code);
    Object.assign(form.value, res.data);
    form.value.createByName = res.data[0]?.createByName;
    form.value.createDeptName = res.data[0].createDeptName;
    form.value.createTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    currentCode.value = res.data[0]?.code;

    //为确认选择的confirmSelectInventoryList列表赋值
    confirmSelectInventoryList.value = res.data;
    confirmSelectInventoryList.value.forEach(item => {
      item.isUpdate = true;
    })
    //为已选物料列表赋值
    selectInventoryList.value = res.data;
    dialogTableLoading.value = false
    selectQueryParams.value = {
      pageNum: 1,
      pageSize: 20,
      nqName: '板材'
    }
    pageChange(null);
    nextTick(() => {
      const $table = inventoryTableRef.value.xTableRef
      if ($table) {
        let st = materialInventoryList.value.filter(item => {
          return confirmSelectInventoryList.value.some(item2 => item.id == item2.rawMaterialInventoryId);
        });
        $table.setCheckboxRow(st, true);
      }
    });
  }

  const currentPrintInfo = ref();

  const cardRef = ref();

  const applyTime = ref();

  //预览
  const doPrint = async (row?: any) => {
    proxy?.$modal.loading('加载中...');
    const code = row.code;
    applyTime.value = row.createTime;
    let dev = await getMaterialRequisitionsPrintByCode(code).finally(() => proxy?.$modal.closeLoading());
    currentPrintInfo.value = dev.data;
    await setQrCode(code);
    setTimeout(() => {
      printHtmlV2(null);
    }, 100)
  }

  const setQrCode = async (code:String)=>{
    //二维码
    QRCode.toDataURL(code, {errorCorrectionLevel: 'H'}, (err: any, url: string) => {
      if (err) {
        console.log('Error: ' + err);
      } else {
        currentPrintInfo.value.qcCodeImage = url;
      }
    });
  }

  const printHtmlV2 = (Id: any) => {
    let printNode = cardRef.value;
    console.log(printNode);
    const newDoc = document.implementation.createHTMLDocument('Print Document');
    const pageStyle = newDoc.createElement("style");
    pageStyle.innerHTML = "@page { margin: 0.5cm; }"; // 0.5厘米边距
    newDoc.head.appendChild(pageStyle);
    newDoc.body.style.margin = "0px";
    let newContent = printNode.cloneNode(true);
    newContent.style.display = 'block';
    newDoc.body.appendChild(newContent);
    newDoc.documentElement.innerHTML;
    // 创建一个新的 Blob 对象
    const blob = new Blob([newDoc.documentElement.innerHTML], { type: 'text/html' });
    // 创建一个 Blob URL
    const blobUrl = URL.createObjectURL(blob);
    // 创建一个 iframe 用于打印
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    // 将 iframe 添加到页面并触发打印
    document.body.appendChild(iframe);
    iframe?.contentWindow.print();
    // 清理 Blob URL 和 iframe
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(iframe);
    }, 3000); // 等待 1 秒后清理
  }


  /** 详情按钮操作 */
  const handleSelect = async (row?: MaterialApplyVO) => {
    reset();
    dialog.visible = true;
    dialog.title = "物料申请详情";
    dialogTableLoading.value = true
    const code = 1 == editableTabsValue.value ? row.code : row.id
    const res = await getMaterialRequisitionsByCode(code);
    Object.assign(form.value, res.data);
    form.value.createByName = res.data[0]?.createByName;
    form.value.createDeptName = res.data[0].createDeptName;
    form.value.createTime = res.data[0]?.createTime;
    //为确认选择的confirmSelectInventoryList列表赋值
    confirmSelectInventoryList.value = res.data;
    //为已选物料列表赋值
    selectInventoryList.value = res.data;
    dialogTableLoading.value = false
  }

  /*
  * 提交
  * */
  const submitData = (row: any) => {
    ElMessageBox.confirm(
      '是否确定提交' + row.code + '领料单据?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      const data = {code: undefined, id: undefined}
      if (1 == editableTabsValue.value) {
        data.code = row.code
      } else {
        data.id = row.id
      }
      proxy?.$modal.loading('加载中...');
      submitMaterialRequisition(data).finally(() => {
        proxy?.$modal.closeLoading()
        getVoidedList();
      });
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    })
  }

  /*
  * 删除
  */
  const deleteData = async(row: any) =>{
    let _ids = [];
    if(1 == editableTabsValue.value){
      const res = await getMaterialRequisitionsByCode(row.code)
      row.inventoryList = res.data;
      _ids = row.inventoryList.map((vo:any) => {return vo.id});
    } else {
      _ids.push(row.id)
    }
    await proxy?.$modal.confirm('是否确认删除当前数据项？').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...');
    await delMaterialRequisition(_ids).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("删除成功");
    if (1 == editableTabsValue.value) {
      await getList();
    } else {
      await getListByMaterial();
    }
  }

  const currentInfo = ref();

  /*审核*/
  const auditData = (row: any) => {
    const ids = selectRequisitionByMaterial.value?.map((vo:any) => {return vo.id});
    if ((!ids || ids.length==0) && !row.code){
      proxy?.$modal.msgError("请先勾选您要审核的领料明细");
      return;
    }
    currentInfo.value = row;
    form.value.checkRemark = "";
    dialogSubmit.visible = true;
  }

  /*驳回*/
  const handleReject = () => {
    if (!form.value.checkRemark) {
      ElMessage.error('驳回必须填写审批备注');
      return;
    }
    let data = {};
    const ids = selectRequisitionByMaterial.value?.map((vo:any) => {return vo.id});

    if(ids && ids.length > 0){
      data = {
        ids: ids,
        checkRemark: form.value.checkRemark
      }
    } else {
      data = {
        code: currentInfo.value.code,
        checkRemark: form.value.checkRemark
      }
    }
    if (!data.ids && !data.code){
      proxy?.$modal.msgError("请先勾选您要审核的领料明细");
      return;
    }
    buttonLoading.value = true;
    rejectMaterialRequisition(data).finally(() => {
      buttonLoading.value = false;
      getVoidedList();
      requisitionByMaterialRef.value.xTableRef.clearCheckboxReserve();
      requisitionByMaterialRef.value.xTableRef.clearCheckboxRow();
      selectRequisitionByMaterial.value = [];
      dialogSubmit.visible = false;
    })
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
  }

  /*通过*/
  const handlePass = async () => {
    let data = {};
    const ids = selectRequisitionByMaterial.value?.map((vo:any) => {return vo.id});

    if(ids && ids.length > 0){
      data = {
        ids: ids,
        checkRemark: form.value.checkRemark
      }
    } else {
      data = {
        code: currentInfo.value.code,
        checkRemark: form.value.checkRemark
      }
    }
    if (!data.ids && !data.code){
      proxy?.$modal.msgError("请先勾选您要审核的领料明细");
      return;
    }
    buttonLoading.value = true;
    const res = await passMaterialRequisition(data).finally(() => {
      buttonLoading.value = false;
      getVoidedList();
      requisitionByMaterialRef.value.xTableRef.clearCheckboxReserve();
      requisitionByMaterialRef.value.xTableRef.clearCheckboxRow();
      selectRequisitionByMaterial.value = [];
      dialogSubmit.visible = false;
    })
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
  }

  /** 提交按钮 */
  const submitForm = (status: string) => {
    materialApplyFormRef.value?.validate(async (valid: boolean) => {
      if (confirmSelectInventoryList.value.length == 0) {
        proxy?.$modal.msgError("请选择物料");
        return;
      }
      let check = false;
      let msg = "";
      confirmSelectInventoryList.value.forEach((item) => {
        //判断item.applyNum>0
        if (item.quantity <= 0) {
          check = true;
          msg = "领用数量必须大于0"
          return;
        }
      });
      if (check) {
        proxy?.$modal.msgError(msg);
        return;
      }
      form.value.addList = confirmSelectInventoryList.value;
      form.value.addList.forEach(item => {
        item.status = status
      })
      if (valid) {
        buttonLoading.value = true;
        if (dialog.title.includes('修改')) {
          form.value.addList.forEach(item => {
            if (!item.isUpdate) {
              item.id = null;
            }
          })
          const data = {
            addList: form.value.addList,
            createByName: form.value.createByName,
            createTime: form.value.createTime,
            createDeptName: form.value.createDeptName,
            code: undefined,
            id: undefined,
            status: status,
          }
          if(1 == editableTabsValue.value){
            data.code = currentCode.value
          } else if(2 == editableTabsValue.value){
            data.id = form.value.addList[0]?.id
          }
          await updateRequisition(data).finally(() => buttonLoading.value = false);
          proxy?.$modal.msgSuccess("修改成功");
        } else {
          await addRequisition(form.value).finally(() => buttonLoading.value = false);
          proxy?.$modal.msgSuccess("新增成功");
        }
        dialog.visible = false;
        if (1 == editableTabsValue.value) {
          await getList();
        } else {
          await getListByMaterial();
        }
        confirmReset();
      }
    });
  }

  //确认选中的物料表
  const flowColumnList = ref([
    {title: '序号', align: 'center', width: '50', type: 'seq'},
    {title: '操作人', field: 'assigneeName', width: '100', align: 'center',},
    {title: '操作时间', field: 'finishTime', width: '120', align: 'center',},
    {title: '操作类型', field: 'comment.type', width: '100', align: 'center',},
    {title: '审核意见', field: 'comment.comment', align: 'center',},
  ]);

  const flowList = ref([]);

  const getHistoryList = async (row : any)=>{
    const req = {
      procInsId: row.flowId,
      deployId: null
    }
    const res = await getFlowHistory(req);
    flowList.value = res.data.flowList||[];
    if(flowList.value.length > 0 && !(flowList.value[0].taskName == '二级审核人' && flowList.value[0].comment != null)){
      flowList.value.shift();
    }
    dialogFlow.title = row.code + "-" + row.rawMaterialCode + "审核记录";
    dialogFlow.visible = true;
  }

  //-------------------------------物料归还--------------------------------------

const returnForm = ref({} as any)

    /**
   * 物料归还
   * @param row
   */
  const requisitionReturn = async (row : any)=>{
    formShow.value=true;
    dialogReturn.title = row.rawMaterialCode + " 物料归还";
    dialogReturn.visible = true;

    returnForm.value = row;
    returnForm.value.returnQuantity=undefined;
    returnForm.value.remark=undefined;

  }
  /**
   * 物料归还记录
   */
  const requisitionReturnRecord = async (row : any)=>{
    formShow.value=false;
    dialogReturn.title = row.rawMaterialCode + " 物料归还记录";
    returnForm.value = row;
    dialogReturn.visible = true;
  }

  /** 提交按钮操作 */
  const handleApply = async (row?: MaterialApplyVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认【提交】申请编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
    await submitMaterialRequisition(_ids as number, "2");
    proxy?.$modal.msgSuccess("提交成功");
    await getList();
  }

  /** 已选物料 删除按钮操作 */
  const handleInventoryListDelete = async (row?: RawMaterialVO) => {
    const id = row?.rawMaterialInventoryId;
    console.log(id)
    console.log(selectInventoryList.value)
    // 删除已选物料
    selectInventoryList.value = selectInventoryList.value.filter(item => item.rawMaterialInventoryId != id);

    const $table = inventoryTableRef.value.xTableRef;
    if ($table) {
      $table.setCheckboxRow(row, false);
    }
  }


  /** 确认已选物料删除按钮操作 */
  const handleSelectDelete = async (row?: any) => {
    const _ids = row?.rawMaterialInventoryId || ids.value;
    console.log(_ids)
    console.log("`````````````````````````````")
    //删除已选物料
    selectInventoryList.value = selectInventoryList.value.filter(item => item.rawMaterialInventoryId != _ids);
    //删除确认已选物料
    confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.rawMaterialInventoryId != _ids);

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

  const exportVisible = ref(false);

  /** 导出按钮操作 */
  const handleExport = () => {
    if (!byMaterialParams.value.createTimeStart || !byMaterialParams.value.createTimeEnd) {
      exportVisible.value = true;
    }else {
      exportExcel();
    }
  }

  const exportExcel = ()=>{
    if(!byMaterialParams.value.createTimeStart && !byMaterialParams.value.createTimeEnd){
      byMaterialParams.value.createTimeStart = dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00");
      byMaterialParams.value.createTimeEnd = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
    }
    exportVisible.value = false;
    proxy?.download('/purchase/materialRequisition/exportMaterialRequisition', {
      ...byMaterialParams.value, tableName: 'purchaseMaterialRequisition'
    }, `领料管理列表_${new Date().getTime()}.xlsx`);
  }

  onMounted(() => {
    getList();
    //选择物料列表
    getMaterialInventory();
    getListRawMaterialCategorys();

  });
</script>

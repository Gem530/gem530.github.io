<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card">
      <template #header> -->
        <el-form class="width-100">
          <el-form-item>
            <div class="global-flex flex-end width-100">
              <el-button v-if="checkPermi(['inventory:checkPlan:del'])" type="primary" @click="handleAdd">新增盘点计划</el-button>
            </div>
          </el-form-item>
        </el-form>
      <!-- </template> -->

      <el-tabs v-model="editableTabsValue" class="xtable-tab" @tab-change="radioTableHandle()">
        <el-tab-pane label="成品盘点" :name="1">
          <XTable toolId="inventoryCheckPlan"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="checkPlanList"
            :columnList="columnList" :loading="loading"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="radioTableHandle"
            :intervalCondition="intervalCondition"
          >
            <template #default-status="scope">
              {{ statusList.find(item => item.value == scope.row.status)?.label }}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleDetail(scope.row.id)">
                详情
              </el-button>
              <el-button link type="primary" v-if="['1', '2', '3'].includes(scope.row.status) && checkPermi(['inventory:checkPlan:del'])" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button link type="primary" v-if="scope.row.status == '4' && checkPermi(['inventory:checkPlan:audit'])"  @click="handleAuditList(scope.row)">
                审核
              </el-button>
              <el-button link type="primary" v-if="['2', '3', '4'].includes(scope.row.status) && checkPermi(['inventory:checkPlan:cancel'])" @click="handleCancel(scope.row.id)">
                作废
              </el-button>
              <el-button link type="primary" v-if="scope.row.status == '1' && checkPermi(['inventory:checkPlan:del'])" @click="handleDelete(scope.row.id)">
                删除
              </el-button>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="物料盘点" :name="2">
          <XTable toolId="inventoryCheckPlanRaw"
            height="100%"
            class="xtable-content"
            v-model:page-size="rawQueryParams.pageSize"
            v-model:current-page="rawQueryParams.pageNum"
            :page-params="{ perfect: true, total: rawTotal }"
            :data="rawCheckPlanList" :intervalCondition="intervalCondition"
            :columnList="columnList" :loading="rawLoading"
            ref="XTableRef"
            border :showRefresh="true"
            @searchChange="radioTableHandle"

          >
            <template #default-status="scope">
              {{ statusList.find(item => item.value == scope.row.status)?.label }}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleDetail(scope.row.id)">
                详情
              </el-button>
              <el-button link type="primary" v-if="checkPermi(['inventory:checkPlan:del']) && ['1', '2', '3'].includes(scope.row.status)" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button link type="primary" v-if="scope.row.status == '4' && checkPermi(['inventory:checkPlan:audit'])"  @click="handleAuditList(scope.row)">
                审核
              </el-button>
              <el-button link type="primary" v-if="(scope.row.status == '2' || scope.row.status == '3' || scope.row.status == '4')  && checkPermi(['inventory:checkPlan:cancel'])" @click="handleCancel(scope.row.id)">
                作废
              </el-button>
              <el-button link type="primary" v-if="scope.row.status == '1' && checkPermi(['inventory:checkPlan:del'])" @click="handleDelete(scope.row.id)">
                删除
              </el-button>
            </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>
    <!-- </el-card> -->

    <!-- 盘点详情对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="80%" :before-close="handleCancelAdd">
      <el-alert v-if="form.rejectReason && form.status == '2'" :title="buildReason(1)" type="error" show-icon :closable="false" />
      <el-alert v-else-if="form.status == '6' && form.cancelReason" :title="buildReason(2)" type="warning" show-icon :closable="false" />

      <el-collapse v-model="activeNames" v-loading="dialogLoading">
        <el-collapse-item title="基本信息" name="1">
          <el-form :model="form"  ref="checkPlanDetailRef" :rules="rules" v-loading="dialogLoading" :disabled="dialog.title?.includes('详情')">
            <el-row>
              <el-col :span="5">
                <el-form-item label="盘点类型：" label-width="92px" prop="type">
                  <el-select v-model="form.type" :disabled="dialog.title != '新增盘点计划'" class="width-100">
                    <el-option :key="dict.value" :label="dict.label" :value="dict.value" v-for="dict in typeList" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="盘点计划名称：" label-width="150px" prop="planName">
                  <el-input :disabled="!isCanEdit()" v-model="form.planName" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点时间：" label-width="120px" prop="planTime">
                  <el-date-picker
                    :disabled="!isCanEdit()"
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
                  <el-select
                    v-model="form.headUserId"
                    :disabled="!isCanEdit()"
                    placeholder="请选择负责人"
                    clearable
                    filterable
                    transfer
                    style="width: 100%"
                    @change="handleUser"
                    popup-class-name="pop-select">
                    <el-option :key="item.userId" :value="item.userId" :label="item.nickName" v-for="item in userList" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.auditTime" :span="5">
                <el-form-item label="审核时间：" label-width="92px" prop="auditTime">
                  <el-input disabled="true" v-model="form.auditTime" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col v-if="form.auditTime" :span="7">
                <el-form-item label="审核人：" label-width="150px" prop="auditUserName">
                  <el-input disabled="true" v-model="form.auditUserName" maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="盘点明细" name="2">

          <div class="head-btn-flex between">
            <div class="global-flex flex-start">
              <el-checkbox v-model="query" v-if="form.status == '2' || form.cancelStatus == '2'" false-label="" true-label="0" @change="customizedQuery(query)">仅查看未填写</el-checkbox>
              <el-checkbox v-model="query" v-if="form.status == '3' || form.cancelStatus == '3'" false-label="" true-label="2" @change="customizedQuery(query)">仅查看未填写</el-checkbox>
              <el-checkbox v-model="query" v-if="((form.status == '2' || form.cancelStatus == '2') && form.auditUserId) || form.status == '3' || form.cancelStatus == '3'" false-label="" true-label="1" @change="customizedQuery(query)">仅查看复盘有差异的</el-checkbox>
              <el-radio-group v-if="['4','5'].includes(form.status) || ['4','5'].includes(form.cancelStatus)" v-model="query" size="small" @change="customizedQuery(query)">
                <el-radio-button :label='undefined'>全部</el-radio-button>
                <el-radio-button label='3'>盘盈</el-radio-button>
                <el-radio-button label='4'>盘亏</el-radio-button>
                <el-radio-button label='5'>盘平</el-radio-button>
              </el-radio-group>
            </div>
  
            <div>
              <el-button v-if="!isDetail && (form.type == '1' && (dialog.title === '新增盘点计划' || form.status == '1'))" type="primary" @click="selectCommodity" size="default">
                添加盘点成品
              </el-button>
              <el-button v-if="!isDetail && (form.type == '2' && (dialog.title === '新增盘点计划' || form.status == '1'))" type="primary" @click="selectMaterial" size="default">
                添加盘点物料
              </el-button>
              <el-button v-if="!isDetail && (form.status == '2' || form.status == '3')" type="primary" @click="exportExcel" size="default">
                导出盘点表
              </el-button>
              <el-button v-if="!isDetail && form.status == '2'" type="primary" @click="handleImportData" size="default">
                导入盘点数量
              </el-button>
              <el-button v-if="!isDetail && form.status == '3'" type="primary" @click="handleImportData" size="default">
                导入复盘数量
              </el-button>
              <el-button v-if="!isDetail && form.status == '4'" type="primary" @click="exportExcel" size="default">
                导出盘点数据
              </el-button>
              <el-button v-if="form.status == '5'" type="primary" @click="exportExcel" size="default">
                导出
              </el-button>
            </div>
          </div>

          <!-- 产品Table -->
          <XTable v-if="form.type == '1'" :toolId="commodityToolId"
                  :pageShow="!editArray.includes(dialog.title)" v-model:page-size="queryParamsCommodity2.pageSize"
                  v-model:current-page="queryParamsCommodity2.pageNum"
                  :page-params="{ perfect: true, total: commodityTotal2 }"
                  :data="alreadySelectCommodity"
                  :height="form.auditTime ? tableHeight2 : tableHeight"
                  :loading="detailLoading"
                  :columnList="editArray.includes(dialog.title) ? editCommodityColumnList : detailCommodityColumnList"
                  ref="xTableRef" border
                  :scroll-y="{enabled: true}"
                  @searchChange="searchChangePlan"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{ reserve: true }">
            <template #default-commodityName="scope">
              <div>{{ scope.row.name ? scope.row.name:scope.row.commodityName }}</div>
            </template>
            <template #default-commodityCode="scope">
              <div>{{ scope.row.commodityCode ?  scope.row.commodityCode:scope.row.code}}</div>
            </template>
            <template #default-units="scope">
              <div>PCS</div>
            </template>
            <template v-if="editArray.includes(dialog.title)" #default-make="scope">
              <el-button link type="primary" @click="handleSelectDelete(scope.row)">移除</el-button>
            </template>
            <template #default-differenceQuantity="scope">
              <span v-if="Number(scope.row.differenceQuantity) > 0" style="color: darkseagreen">+{{scope.row.differenceQuantity}}</span>
              <span v-else-if="Number(scope.row.differenceQuantity) < 0" style="color: red">{{scope.row.differenceQuantity}}</span>
              <span v-else>{{scope.row.differenceQuantity}}</span>
            </template>
            <template #default-checkQuantity="scope">
              <x-input-number
                v-if="scope.row.status == '2'"
                :disabled="isDetail"
                maxLength="11"
                :min="0"
                :max="99999999"
                :precision="2"
                style="width: 99%;"
                :controls="false"
                @blur="savePlanDetail(scope.row)"
                v-model="scope.row.checkQuantity"
              />
              <div v-else>{{ scope.row.checkQuantity }}</div>
            </template>
            <template #default-replayQuantity="scope">
              <x-input-number
                v-if="scope.row.status == '3'"
                :disabled="isDetail"
                maxLength="11"
                :min="0"
                :max="99999999"
                :precision="2"
                style="width: 99%;"
                :controls="false"
                @blur="savePlanDetail(scope.row)"
                v-model="scope.row.replayQuantity"
              />
              <div v-else>{{ scope.row.replayQuantity }}</div>
            </template>

          </XTable>

          <!-- 物料Table -->
          <XTable v-if="form.type == '2'" :toolId="materialToolId"
                  :pageShow="!editArray.includes(dialog.title)" v-model:page-size="queryParamsMaterial2.pageSize"
                  v-model:current-page="queryParamsMaterial2.pageNum"
                  :page-params="{ perfect: true, total: materialsTotal2 }"
                  :height="form.auditTime ? tableHeight2 : tableHeight"
                  :loading="detailLoading"
                  :data="alreadySelectMaterial"
                  :columnList="editArray.includes(dialog.title) ? editMaterialColumnList : detailMaterialColumnList"
                  ref="xTableRef"
                  :scroll-y="{enabled: true}"
                  @searchChange="searchChangePlan"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{ reserve: true }"
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
            <template v-if="editArray.includes(dialog.title)" #default-make="scope">
              <el-button link type="primary" @click="handleSelectDelete(scope.row)">移除</el-button>
            </template>
            <template #default-differenceQuantity="scope">
              <span v-if="Number(scope.row.differenceQuantity) > 0" style="color: darkseagreen"> +{{scope.row.differenceQuantity}} </span>
              <span v-else-if="Number(scope.row.differenceQuantity) < 0" style="color: red"> {{scope.row.differenceQuantity}} </span>
              <span v-else> {{scope.row.differenceQuantity}} </span>
            </template>
            <template #default-checkQuantity="scope">
              <x-input-number
                v-if="scope.row.status == '2'"
                :disabled="isDetail"
                maxLength="11"
                :min="0"
                :max="99999999"
                :precision="2"
                style="width: 99%;"
                :controls="false"
                @blur="savePlanDetail(scope.row)"
                v-model="scope.row.checkQuantity"
              />
              <div v-else>{{ scope.row.checkQuantity }}</div>
            </template>
            <template #default-replayQuantity="scope">
              <x-input-number
                v-if="scope.row.status == '3'"
                :disabled="isDetail"
                maxLength="11"
                :min="0"
                :max="99999999"
                :precision="2"
                style="width: 99%;"
                :controls="false"
                @blur="savePlanDetail(scope.row)"
                v-model="scope.row.replayQuantity"
              />
              <div v-else>{{ scope.row.replayQuantity }}</div>
            </template>
          </XTable>

        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <!-- <div style="display: flex; justify-content: center;">
          <span class="dialog-footer"> -->
            <el-button type="danger" plain v-if="!isDetail && ['2', '3', '4'].includes(form.status) && checkPermi(['inventory:checkPlan:cancel'])" :loading="buttonLoading" @click="handleDetailCancel(form.id)">
              作废
            </el-button>
            <el-button type="danger" plain v-if="form.status == '1'  && !isDetail && checkPermi(['inventory:checkPlan:del'])" :loading="buttonLoading" @click="handleDelete(form.id)">
              删除
            </el-button>
            <el-button type="primary" v-if="!isDetail && (dialog.title === '新增盘点计划' || form.status == '1')" :loading="buttonLoading"  @click="saveDraftForm">
              保存草稿
            </el-button>
            <el-button type="primary" plain v-if="!isDetail && (dialog.title != '新增盘点计划' && !['1', '4'].includes(form.status))" :loading="buttonLoading"  @click="saveTemporary">
              暂存
            </el-button>
            <el-button type="primary" v-if="!isDetail && checkPermi(['inventory:checkPlan:start']) && (dialog.title === '新增盘点计划' || form.status == '1')" :loading="buttonLoading"  @click="handleStart('3')">
              开始盘点
            </el-button>
            <el-button type="danger" v-if="!isDetail && checkPermi(['inventory:checkPlan:del']) && form.status == '3'" :loading="buttonLoading"  @click="handleRejectCheck">
              驳回盘点
            </el-button>
            <el-button type="primary" v-if="!isDetail && checkPermi(['inventory:checkPlan:del']) && ['2', '3'].includes(form.status)" :loading="buttonLoading"  @click="submitAudit()">
              提交审核
            </el-button>
            <el-button type="danger" v-if="!isDetail && checkPermi(['inventory:checkPlan:audit']) && form.status == '4'" :loading="buttonLoading"  @click="handleRejectAudit">
              审核驳回
            </el-button>
            <el-button type="primary" v-if="!isDetail && checkPermi(['inventory:checkPlan:audit']) && form.status == '4'" :loading="buttonLoading"  @click="handleAudit">
              审核通过
            </el-button>
            <el-button v-if="isDetail" :loading="buttonLoading" @click="dialog.visible = false">
              关闭
            </el-button>
            <el-button v-if="dialog.title === '新增盘点计划'" :loading="buttonLoading" @click="handleCancelAdd">
              取消
            </el-button>
          <!-- </span>
        </div> -->
      </template>
      <template #title>
        <div style="width: 100%;">
          {{ dialog.title }}
          <span v-for="item in statusList">
            <el-tag size="large" :type="item.type" v-if="item.value == form.status">{{item.label}}</el-tag>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 盘点提示信息对话框 -->
    <el-dialog v-model="hintDialog.visible" :title="hintDialog.title" :width=" hintDialog.type == '5' || hintDialog.type == '6' ? '60%' : '30%'" align-center destroy-on-close>
      <el-form ref="dialogFormRef" :model="form" :rules="hintRules" label-width="80px">
        <el-row v-if="hintDialog.type === 1">
          <div class="p-2">
            当前盘点单正在进行中，作废后，盘点数据将不生效，所选产品将<span style="color: blue">解锁出入库</span>，是否确认作废？
          </div>
          <el-col :span="24">
            <el-form-item prop="cancelReason" label-width="0px">
              <el-input type="textarea" :rows="4" maxlength="200" v-model="form.cancelReason" placeholder="*请输入作废理由"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="hintDialog.type === 2">
          <div class="p-2">
            审核驳回后，该盘点计划将回退到<span style="color: blue">“盘点中”</span>中，请及时通知相关盘点人员重新核对盘点数据
          </div>
          <el-col :span="24">
            <el-form-item prop="rejectReason" label-width="0px">
              <el-input type="textarea" :rows="4" maxlength="200" v-model="form.rejectReason" placeholder="*请输入驳回理由"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="hintDialog.type === 3">
          <div v-if="form.status && form.status != '1'" class="p-2">
            检测到已经填写数据，是否暂存？
          </div>
          <div v-else class="p-2">
            检测到已经填写数据，是否保存草稿？
          </div>
        </el-row>
        <el-row v-if="hintDialog.type === 4">
          <div class="p-2">
            开始盘点后，所选产品/物料将<span style="color: blue">锁定出入库</span>，请及时通知各部门做好准备
          </div>
        </el-row>
        <el-row v-if="hintDialog.type === 5">
          <div style="margin-top: -10px; margin-bottom: -10px">
            以下产品已失效(被删除/禁用/修改/重复盘点)，请移除失效产品后重新提交：
          </div>
          <el-col span="24" style="width: 100%">
            <!-- 产品Table -->
            <XTable
              :pageShow="false" v-model:page-size="queryParamsCommodity2.pageSize"
              v-model:current-page="queryParamsCommodity2.pageNum"
              :page-params="{ perfect: true, total: commodityTotal2 }"
              :data="invalidCommodity"
              height="400"
              :loading="invalidlLoading"
              :columnList="editCommodityColumnList"
              ref="xTableRef" border
              @searchChange="searchChangeCommodity"
              :column-config="{ resizable: true }"
              :row-config="{ keyField: 'id' }">
              <template #default-units="scope">
                <div>PCS</div>
              </template>
              <template #default-make="scope">
                <el-button link type="primary" @click="handleInvalidDelete(scope.row.id)">移除</el-button>
              </template>
            </XTable>
          </el-col>
        </el-row>
        <el-row v-if="hintDialog.type === 6">
          <el-col span="24" style="width: 100%">
            <div style="margin-top: -10px; margin-bottom: -10px">
              以下物料已失效(被删除/禁用/修改/重复盘点)，请移除失效产品后重新提交：
            </div>
            <!-- 物料Table -->
            <XTable
              :pageShow="false" v-model:page-size="queryParamsCommodity2.pageSize"
              v-model:current-page="queryParamsCommodity2.pageNum"
              :page-params="{ perfect: true, total: commodityTotal2 }"
              :data="invalidMaterial"
              height="400"
              :loading="invalidlLoading"
              :columnList="editMaterialColumnList"
              ref="xTableRef" border
              @searchChange="searchChangeCommodity"
              :column-config="{ resizable: true }"
              :row-config="{ keyField: 'id' }">

              <template #default-make="scope">
                <el-button link type="primary" @click="handleInvalidDelete(scope.row.id)">移除</el-button>
              </template>
            </XTable>
          </el-col>
        </el-row>
        <el-row v-if="hintDialog.type === 7">
          <div class="p-2">
            驳回后，系统将填写的复盘数量发送并回退到<span style="color: blue">“待盘点”</span>中，请及时通知相关人员重新核对盘点数量！
          </div>
        </el-row>
        <el-row v-if="hintDialog.type === 8">
          <div class="p-2">
            盘点数据审核通过后，系统将自动更新库存，且盘点成品/物料将<span style="color: blue">将解锁出入库</span>，是否继续？
          </div>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="hintDialog.type != 3" @click="hintDialog.visible = false">我再想想</el-button>
          <el-button v-if="hintDialog.type === 1" type="primary" @click="cancelPlan(form.id)">确认作废</el-button>
          <el-button v-if="hintDialog.type === 2 && checkPermi(['inventory:checkPlan:audit'])" type="primary" @click="auditReject('2')">确认驳回</el-button>
          <el-button v-if="hintDialog.type === 3" @click="cancel">直接退出</el-button>
          <el-button v-if="hintDialog.type === 3 && (form.status == '1' || !form.status)" type="primary" @click="saveDraftForm">保存草稿</el-button>
          <el-button v-if="hintDialog.type === 3 && form.status && form.status != '1'" type="primary" @click="saveTemporary">暂存</el-button>
          <el-button v-if="hintDialog.type === 4 && checkPermi(['inventory:checkPlan:start'])" type="primary" @click="startPlan(form.id)">开始盘点</el-button>
          <el-button v-if="hintDialog.type === 5 || hintDialog.type === 6" type="primary" @click="invalidBatchDelete">一键移除</el-button>
          <el-button v-if="hintDialog.type === 7" type="primary" @click="rejectCheck">确认驳回</el-button>
          <el-button v-if="hintDialog.type === 8 && checkPermi(['inventory:checkPlan:audit'])" type="primary" @click="auditCheck('5')">确认通过</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加物料盘点对话框 -->
    <el-dialog v-model="materialDialog.visible" :title="materialDialog.title" width="60%" draggable destroy-on-close :before-close="clearSelect">
      <!-- 产品Table -->
      <div class="p-2" v-if="form.type == '1'">
        已选择{{tempSelectCommodity.length}}条
      </div>
      <XTable v-if="form.type == '1'"
              :showHead="false" :pageShow="true" v-model:page-size="queryParamsCommodity.pageSize"
              v-model:current-page="queryParamsCommodity.pageNum"
              :page-params="{ perfect: true, total: commodityTotal }"
              :data="commodityList"
              height="440" :loading="selectLoading"
              :columnList="commodityColumnList"
              ref="commodityVxeTableRef" border
              @searchChange="searchChangeCommodity"
              :column-config="{ resizable: true }"
              :checkbox-config="{ reserve: true }"
              :row-config="{ keyField: 'commodityId' }"
              @checkbox-all="commoditySelectionChange"
              @checkbox-change="commoditySelectionChange">
        <template #default-units="scope">
          <div>PCS</div>
        </template>
        <template #default-commodityCode="scope">
          <div>{{ scope.row.code }}</div>
        </template>
        <template #default-commodityName="scope">
          <div>{{ scope.row.name }}</div>
        </template>

      </XTable>

      <!-- 物料Table -->
      <div class="p-2" v-if="form.type == '2'">
        已选择{{tempSelectMaterial.length}}条
      </div>
      <XTable v-if="form.type == '2'"
              :pageShow="true" v-model:page-size="queryParamsMaterial.pageSize"
              v-model:current-page="queryParamsMaterial.pageNum"
              :page-params="{ perfect: true, total: materialsTotal }"
              :loading="selectLoading"
              :data="materialList"
              :columnList="materialColumnList"
              ref="materialVxeTableRef"
              @searchChange="searchChangeMaterial"
              :checkbox-config="{ reserve: true }"
              :row-config="{ keyField: 'rawMaterialId' }"
              @checkbox-change="materialSelectionChange"
              @checkbox-all="materialSelectionChange"
              height="440"
      >
        <template #default-categoryId="scope">
          <div>{{ scope.row.categoryName }}</div>
        </template>
        <template #default-materialCode="scope">
          <div>{{ scope.row.code }}</div>
        </template>
        <template #default-materialName="scope">
          <div>{{ scope.row.name }}</div>
        </template>
      </XTable>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="clearSelect">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitSelect">确定添加</el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="importDialog.title" v-model="importDialog.visible" width="20%">
      <el-form ref="importForm" :model="form" label-width="100px">
        <el-radio v-model="form.isCoverData" label='1'>覆盖已填写数据导入</el-radio>
          <div class="div-hint">
            选择后，重复的录入的数据会以本次导入数据为准
          </div>
        <el-radio v-model="form.isCoverData" label='0'>保留已填写数据导入</el-radio>
          <div class="div-hint">
            选择后，重复的录入的数据会保留原来的数据
          </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleImport">下一步</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 盘点导入对话框 -->
    <GExportInvoice
      width="550px"
      :title="upload.title"
      :loading="buttonLoading"
      v-model:open="upload.open"
      :close-on-click-modal="false"
      @confirm="startProcess"
      @close="customizedQuery">
      <template #export-tip>
        <div style="width: 100%">注意事项:</div>
        <div style="width: 100%">1、<span style="color: rgba(247, 34, 45, 1);">物料/产品编码：必填</span>，不能为空，需是当前盘点计划中的编码</div>
        <div v-if="form.status == '2'">2、<span style="color: rgba(247, 34, 45, 1);">盘点数据：必填</span>，不能为空，请填写<span style="color: rgba(247, 34, 45, 1);">>0</span>>的数字(最多两位小数)</div>
        <div v-else>2、<span style="color: rgba(247, 34, 45, 1);">复盘数据：必填</span>，不能为空，请填写<span style="color: rgba(247, 34, 45, 1);">>0</span>>的数字(最多两位小数)</div>
      </template>
    </GExportInvoice>

  </div>
</template>

<script setup name="CheckPlan" lang="ts">
import {
  addCheckPlan, auditCheckPlan,
  cancelCheckPlan,
  delCheckPlan, getCheckDetail,
  getCheckPlan, importDataCheckPlan,
  listCheckPlan, rejectCheckPlan, startCheckPlan, submitAuditCheckPlan,
  updateCheckPlan
} from '@/api/inventory/checkPlan';
import {ref} from "vue";
import { globalHeaders } from "@/utils/request";
import {CheckPlanForm, CheckPlanQuery, CheckPlanVO} from "@/api/inventory/checkPlan/types";
import {checkPermi} from "@/utils/permission";
import { getUserList } from '@/api/financial/AccountOrderDeduction';
import {listMaterialInventoryInfo} from "@/api/purchase/materialApply";
import {getBaseStorage} from "@/api/system/config";
import {delCheckPlanDetail, listCheckPlanDetail, temporaryPlanDetail} from "@/api/inventory/checkPlanDetail";
import {listCommodityInventory} from "@/api/order/commodity";
import dayjs from "dayjs";
import {deepClone} from "@/utils";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const editableTabsValue = ref(1);

const commodityToolId = ref('checkPlanCommodityToolId');
const materialToolId = ref('checkPlanMaterialToolId');

const checkPlanList = ref<CheckPlanVO[]>([]);
const rawCheckPlanList = ref<CheckPlanVO[]>([]);
const commodityList = ref<any[]>([]);
const alreadySelectCommodity = ref<any[]>([]);
const invalidCommodity = ref<any[]>([]);
const materialList = ref<any[]>([]);
const alreadySelectMaterial = ref<any[]>([]);
const invalidMaterial = ref<any[]>([]);
const baseStorage = ref<any[]>([]);

// 选择的数据
const tempSelectCommodity = ref<any[]>([]);
const tempSelectMaterial = ref<any[]>([]);

const query = ref();
// 责任人列表
const userList = ref<any[]>([])

const showStatus = ref();

const loading = ref(true);
const rawLoading = ref(true);
const dialogLoading = ref(false);
const buttonLoading = ref(false);
const detailLoading = ref(false);
const selectLoading = ref(false);
const invalidlLoading = ref(false);

const total = ref(0);
const rawTotal = ref(0);
const commodityTotal = ref(0);
const commodityTotal2 = ref(0);
const materialsTotal = ref(0);
const materialsTotal2 = ref(0);

const isDetail = ref(false);
const changeData = ref(false);

const editArray = ref(['新增盘点计划', '编辑盘点计划']);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const importDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const hintDialog = reactive<any>({
  visible: false,
  title: '',
  // 提示类型，1作废提示，2审核驳回提示，3新增取消提示，4开始盘点提示，5产品失效提示，6物料失效提示，7驳回盘点提示，8审核通过提升
  type: 0
});

const materialDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const checkPlanDetailRef = ref<ElFormInstance>();
const dialogFormRef = ref();

const activeNames = ref(['1','2'])

const initFormData: CheckPlanForm = {
  id: undefined,
  ownerId: undefined,
  type: undefined,
  status: undefined,
  isCancel: undefined,
  planName: undefined,
  planTime: undefined,
  headUserId: undefined,
  headUserName: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  auditTime: undefined,
  rejectReason: undefined,
  cancelReason: undefined,
  remark: undefined
}
const data = reactive<PageData<CheckPlanForm, CheckPlanQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    type: '1',
    status: undefined,
    isCancel: undefined,
    planName: undefined,
    planTime: undefined,
    headUserId: undefined,
    headUserName: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    rejectReason: undefined,
    cancelReason: undefined,
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

const rawData = reactive<PageData<CheckPlanForm, CheckPlanQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    type: '2',
    status: undefined,
    isCancel: undefined,
    planName: undefined,
    planTime: undefined,
    headUserId: undefined,
    headUserName: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    rejectReason: undefined,
    cancelReason: undefined,
    params: {
    }
  },
  rules: {}
});
const { queryParams: rawQueryParams} = toRefs(rawData);

/** 作废理由校验 */
const cancelReasonCheck = (rule: any, value: string, callback: any) => {
  console.log('cancelReasonCheck', hintDialog.type === 1 && !form.value.cancelReason)
  if (hintDialog.type === 1 && !form.value.cancelReason) {
    callback(new Error("作废理由不能为空"));
  } else {
    callback();
  }
};

/** 驳回理由校验 */
const rejectReasonCheck = (rule: any, value: string, callback: any) => {
  console.log('rejectReasonCheck', hintDialog.type === 2 && !form.value.rejectReason)
  if (hintDialog.type === 2 && !form.value.rejectReason) {
    callback(new Error("驳回理由不能为空"));
  } else {
    callback();
  }
};

const hintRules = reactive<ElFormRules>({
  cancelReason: [
    { required: true, validator: cancelReasonCheck, trigger: "blur" }
  ],
  rejectReason: [
    { required: true, validator: rejectReasonCheck, trigger: "blur" }
  ],
});

const queryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});
const queryParamsCommodity2 = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

const queryParamsMaterial = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});
const queryParamsMaterial2 = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

const tableHeight = document.body.clientHeight - (document.body.clientHeight)*0.5;
const tableHeight2 = document.body.clientHeight - (document.body.clientHeight)*0.65;

const XTableRef = ref()
const commodityVxeTableRef = ref();
const materialVxeTableRef = ref();

const intervalCondition = ['planTime', 'createTime', 'auditTime'];

const statusList = ref([
  {label: '待盘点', value: '1', type: 'info' },
  {label: '盘点中', value: '2', type: 'primary' },
  {label: '复盘中', value: '3', type: 'primary' },
  {label: '审核中', value: '4', type: 'warning' },
  {label: '已完成', value: '5', type: 'success' },
  {label: '已作废', value: '6', type: 'info' },
]);

const typeList = ref([
  {label: '成品盘点', value: '1' },
  {label: '物料盘点', value: '2' },
]);


const columnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '80'},
  {title: '盘点计划名称', minWidth:'180', field: 'planName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入计划名称' } },
  {title: '状态', minWidth:'70', field: 'status', align: 'center', filterType: 'checkboxButton', filterData: () => statusList.value},
  {title: '盘点时间', minWidth:'100', field: 'planTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'date', valueFormat: 'YYYY-MM-DD' },
    }},
  {title: '负责人', minWidth:'80', field: 'headUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入名称' }},
  {title: '创建人', minWidth:'80', field: 'createByName', align: 'center', filterType: "input", filterParam: { placeholder: '请输入名称' }},
  {title: '创建时间', minWidth:'140', field: 'createTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
  {title: '审核人', minWidth:'80', field: 'auditUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入名称' }},
  {title: '审核时间', minWidth:'140', field: 'auditTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
  { title: '操作', minWidth: '160', field: 'make', align: 'center', fixed: 'right',},
]);

const commodityColumnList = ref([
  {type: 'checkbox', width: '60', align: "center"},
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {width: '180', title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品编码'}},
  {width: '300', title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
  {width: '140', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
  {width: '100', title: '单位', field: 'units', align: 'center'},
  {width: '140', title: '所属仓库', field: 'storageName', align: 'center', filterType: 'input',filterParam: {placeholder: '请输入仓库名称'}},
]);

const editCommodityColumnList = ref([
  {minWidth: '40', title: "序号", type: 'seq', field: 'index', align: 'center', width: '80'},
  {minWidth: '120', title: '产品编码', field: 'commodityCode', align: 'center'},
  {minWidth: '180',title: '产品名称', field: 'commodityName', align: 'center'},
  {minWidth: '120', title: '客户编码', field: 'customerCode', align: 'center'},
  {minWidth: '80', title: '单位', field: 'units', align: 'center'},
  {minWidth: '80', title: '所属仓库', field: 'storageName', align: 'center'},
  {minWidth: '80', title: '操作', field: 'make', align: 'center', fixed: 'right',},
]);

const detailCommodityColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '80'},
  {title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品编码'}},
  {title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
  {minWidth: '160', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
  {minWidth: '120', title: '单位', field: 'units', align: 'center'},
  {minWidth: '160', title: '所属仓库', field: 'storageName', align: 'center'},
]);

const materialColumnList = ref([
  {type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left', },
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
  {title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  {title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  {title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } },
  {title: '单位', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' } },
  {title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  {title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  {title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入颜色' } },
  {title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入级别' } },
  {title: '长', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入长' } },
  {title: '宽', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入宽' } },
  {title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
]);

const editMaterialColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '40'},
  {minWidth: '120', title: '物料编码', field: 'materialCode', align: 'center'},
  {minWidth: '120', title: '物料名称', field: 'materialName', align: 'center'},
  {minWidth: '100', title: '物料类别', field: 'categoryName', width: '100', align: 'center'},
  {minWidth: '60', title: '单位', field: 'units', width: '70', align: 'center'},
  {minWidth: '80', title: '材质牌号', field: 'materialQuality', width: '100', align: 'center'},
  {minWidth: '60', title: '铜厚', field: 'copperThickness', width: '80', align: 'center'},
  {minWidth: '60', title: '颜色', field: 'color', width: '80', align: 'center'},
  {minWidth: '60', title: '级别', field: 'level', width: '80', align: 'center'},
  {minWidth: '60', title: '长', field: 'length', width: '70', align: 'center'},
  {minWidth: '60', title: '宽', field: 'width', width: '70', align: 'center'},
  {minWidth: '80', title: '品牌', field: 'manufacturer', width: '80', align: 'center'},
  {minWidth: '80', title: '操作', field: 'make', align: 'center', fixed: 'right',},
]);

const detailMaterialColumnList = ref([
  {title: "序号", type: 'seq', field: 'index', align: 'center', width: '40'},
  {title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  {title: '物料名称', field: 'materialName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  {title: '物料类别', field: 'categoryName', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } },
  {title: '单位', field: 'units', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' } },
  {title: '材质牌号', field: 'materialQuality', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  {title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  {title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入颜色' } },
  {title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入级别' } },
  {title: '长', field: 'length', minWidth: '70', align: 'center',  filterType: 'input', filterParam: { placeholder: '请输入长' } },
  {title: '宽', field: 'width', minWidth: '70', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入宽' } },
  {title: '品牌', field: 'manufacturer', minWidth: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
]);

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  checkPlanDetailRef.value?.resetFields();
  // 选择产品、物料清除
  alreadySelectMaterial.value = [];
  alreadySelectCommodity.value = [];
  // 失效产品物料清除
  invalidCommodity.value = [];
  invalidMaterial.value = [];
  isDetail.value = false;
  changeData.value = false;
  // 默认查询全部
  query.value = '';
}

/** 取消 */
const cancel = () => {
  reset();
  dialog.visible = false;
  hintDialog.visible = false;
}

/** 处理用户 */
const handleUser = async (value: any) => {
  const user = userList.value.find(item => item.userId == value);
  form.value.headUserName = user.nickName;
}

/** 切换菜单栏 */
const radioTableHandle = async (params?: any) => {
  if (params) {
    params.statusList = params.status;
    params.status = undefined;
  }

  if (1 == editableTabsValue.value) {
    if (params) {
      queryParams.value = params
    }
    queryParams.value.type = '1'
    await getList();
  } else {
    if (params) {
      rawQueryParams.value = params
    }
    rawQueryParams.value.type = '2'
    await getRawList();
  }
}

/** 是否可以编辑 */
const isCanEdit = (): boolean => {
  if(dialog.title === '新增盘点计划' || form.value.status == '1') {
    return true;
  } else {
    return false;
  }
}

/** 详情按钮操作 */
const handleDetail = async (id: number) => {
  dialog.title = '盘点计划详情'
  dialog.visible = true;
  isDetail.value = true;
  await getDetail(id);
}

/** 编辑按钮操作 */
const handleEdit = async (row: any) => {
  dialog.visible = true;
  isDetail.value = false;
  if(row.status == '1') {
    dialog.title = '编辑盘点计划'
    getDetailNotPage(row.id)
  } else {
    dialog.title = '盘点计划详情'
    await getDetail(row.id);
  }
}

/** 审核按钮操作 */
const handleAuditList = async (row: any) => {
  dialog.visible = true;
  isDetail.value = false;
  dialog.title = '盘点计划详情'
  await getDetail(row.id);
}

/** 查询盘点计划详情 */
const getDetail = async (id: number) => {
  dialogLoading.value = true;
  detailLoading.value = true;
  const res = await getCheckPlan(id).finally(() => {dialogLoading.value = false});
  form.value = res.data;

  // 初始化列表
  initColumnList();
  // 处理表格
  buildColumnList(res.data);

  // 分页查询明细数据
  let query = {
    pageNum: 1,
    pageSize: 20,
    planType: res.data.type,
    inventoryCheckPlanId: res.data.id,
    status: res.data.status,
  }
  await listCheckPlanDetail(query).then(detailRes => {
    if ('1' == res.data.type) {
      alreadySelectCommodity.value = detailRes.rows;
      commodityTotal2.value = detailRes.total;
    } else {
      alreadySelectMaterial.value = detailRes.rows;
      materialsTotal2.value = detailRes.total;
    }
  }).finally(() => {detailLoading.value = false});;
  changeData.value = false;
}

/** 构建表格数据 */
const buildColumnList = (info : any) => {
  showStatus.value = info.status == '6' ? info.cancelStatus : info.status;
  // 根据状态展示不同字段
  commodityToolId.value = 'checkPlanCommodityToolId' + info.status;
  materialToolId.value = 'checkPlanMaterialToolId' + info.status;
  if (showStatus.value == '2') {
    // 盘点中展示库存数量和盘点数量
    detailCommodityColumnList.value.push({width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'})
    detailMaterialColumnList.value.push({width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'})
    // 若驳回则展示复盘数量
    if (info.auditUserId) {
      commodityToolId.value = 'checkPlanCommodityToolId2-' + info.status;
      materialToolId.value = 'checkPlanMaterialToolId2-' + info.status;
      detailCommodityColumnList.value.push({width: '100', title: '复盘数量', fixed: 'right', field: 'replayQuantity', align: 'center'})
      detailMaterialColumnList.value.push({width: '100', title: '复盘数量', fixed: 'right', field: 'replayQuantity', align: 'center'})
    }
    detailCommodityColumnList.value.push({width: '100', title: '盘点数量', fixed: 'right', field: 'checkQuantity', align: 'center'})
    detailMaterialColumnList.value.push({width: '100', title: '盘点数量', fixed: 'right', field: 'checkQuantity', align: 'center'})

  } else if(showStatus.value == '3') {
    // 复盘中展示库存数量、盘点数量和复盘数量
    detailCommodityColumnList.value.push({width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'})
    detailCommodityColumnList.value.push({width: '100', title: '盘点数量', fixed: 'right', field: 'checkQuantity', align: 'center'})
    detailCommodityColumnList.value.push({width: '100', title: '复盘数量', fixed: 'right', field: 'replayQuantity', align: 'center'})
    // 物料表格添加
    detailMaterialColumnList.value.push({width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'})
    detailMaterialColumnList.value.push({width: '100', title: '盘点数量', fixed: 'right', field: 'checkQuantity', align: 'center'})
    detailMaterialColumnList.value.push({width: '100', title: '复盘数量', fixed: 'right', field: 'replayQuantity', align: 'center'})
  } else if(showStatus.value == '4' || showStatus.value == '5') {

    // 审核中和已完成展示库存数量、盘点数量、差异数量、库存成本
    detailCommodityColumnList.value.push({width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'})
    detailCommodityColumnList.value.push({width: '100', title: '盘点数量', fixed: 'right', field:'replayQuantity', align: 'center'})
    detailCommodityColumnList.value.push({width: '100', title: '差异数量', fixed: 'right', field: 'differenceQuantity', align: 'center'})

    // 物料表格添加
    detailMaterialColumnList.value.push({width: '100', title: '库存数量', fixed: 'right', field: 'inventoryQuantity', align: 'center'})
    detailMaterialColumnList.value.push({width: '100', title: '盘点数量', fixed: 'right', field:'replayQuantity', align: 'center'})
    detailMaterialColumnList.value.push({width: '100', title: '差异数量', fixed: 'right', field: 'differenceQuantity', align: 'center'})

    // 有成本权限才能看成本字段
    if (checkPermi(['inventory:checkPlan:cost'])) {
      commodityToolId.value = 'checkPlanCommodityToolId4-' + info.status;
      materialToolId.value = 'checkPlanMaterialToolId4-' + info.status;
      // detailCommodityColumnList.value.push({width: '100', title: '库存成本', fixed: 'right', field: 'inventoryCost', align: 'center'})
      detailMaterialColumnList.value.push({width: '100', title: '库存成本', fixed: 'right', field: 'inventoryCost', align: 'center'})
    }
  }
}

/** 查询盘点计划详情不分页 */
const getDetailNotPage = async (id: number) => {
  dialogLoading.value = true;
  detailLoading.value = true;
  let query = {
    id: id,
    isQueryDetail: true,
  }
  await getCheckDetail(query).then(res => {
    form.value = res.data;
    if ('1' == res.data.type) {
      alreadySelectCommodity.value = res.data.detailVoList;
    } else {
      alreadySelectMaterial.value = res.data.detailVoList;
    }
  }).finally(() => {
    dialogLoading.value = false;
    detailLoading.value = false;
  });
  changeData.value = false;
}

/** 查询成品盘点计划列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCheckPlan(queryParams.value);
  checkPlanList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询物料盘点计划列表 */
const getRawList = async () => {
  rawLoading.value = true;
  const res = await listCheckPlan(rawQueryParams.value);
  rawCheckPlanList.value = res.rows;
  rawTotal.value = res.total;
  rawLoading.value = false;
}

/** 关闭新增页面 */
const handleCancelAdd = async () => {
  // 新增数据或者有修改过的数据提示关闭信息
  if ((dialog.title === '新增盘点计划' && (alreadySelectCommodity.value.length > 0 || alreadySelectMaterial.value.length > 0)) ||
    changeData.value) {
    hintDialog.title = "提示";
    hintDialog.visible = true;
    hintDialog.type = 3;
  } else {
    reset();
    dialog.visible = false;
  }
}

/** 删除盘点计划 */
const handleDelete = async (id: number) => {
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading("加载中...");
  await delCheckPlan(id).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  dialog.visible = false;
  await radioTableHandle();
}

/** 新增盘点计划 */
const handleAdd = async () => {
  reset();
  dialog.title = "新增盘点计划";
  dialog.visible = true;
  form.value.type = '1'
}

/** 开始盘点计划按钮操作 */
const handleStart = async () => {
  checkPlanDetailRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // 选择产品
      if (form.value.type == '1') {
        if (alreadySelectCommodity.value.length == 0) {
          proxy?.$modal.msgError("请选择盘点产品");
          return;
        }
        form.value.detailBoList = alreadySelectCommodity.value;
      } else {
        // 选择物料
        if (alreadySelectMaterial.value.length == 0) {
          proxy?.$modal.msgError("请选择盘点物料");
          return;
        }
        form.value.detailBoList = alreadySelectMaterial.value;
      }
      hintDialog.title = "提示";
      hintDialog.visible = true;
      hintDialog.type = 4;
    }
  });
}


/** 开始盘点计划 */
const startPlan = async (id: number) => {
  // 若id为空则表示新增后开始盘点
  if (!id) {
    checkPlanDetailRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        // 选择产品
        if (form.value.type == '1') {
          if (alreadySelectCommodity.value.length == 0) {
            proxy?.$modal.msgError("请选择盘点产品");
            return;
          }
          form.value.detailBoList = alreadySelectCommodity.value;
        } else {
          // 选择物料
          if (alreadySelectMaterial.value.length == 0) {
            proxy?.$modal.msgError("请选择盘点物料");
            return;
          }
          form.value.detailBoList = alreadySelectMaterial.value;
        }
        // 待提交状态
        proxy?.$modal.loading("加载中...");
        form.value.status = '1';
        const res = await addCheckPlan(form.value);
        form.value.id = res.data;
        startCheckPlanFrom(form.value.id);
      }
    });
  } else {
    proxy?.$modal.loading("加载中...");
    // 先暂存在开始盘点
    //await temporaryPlanDetail(form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value);
    startCheckPlanFrom(id);
  }
  changeData.value = false;
}

/** 开始盘点 */
const startCheckPlanFrom = async (id: number) => {
  const res = await startCheckPlan({id: id}).finally(() => proxy?.$modal.closeLoading());
  // 如果存在失效数据则弹框提示
  if (res.data.length > 0) {
    // 产品类型
    if (form.value.type == '1') {
      hintDialog.title = "产品失效提示";
      hintDialog.visible = true;
      hintDialog.type = 5;
      invalidCommodity.value = res.data;
    } else {
      hintDialog.title = "物料失效提示";
      hintDialog.visible = true;
      hintDialog.type = 6;
      invalidMaterial.value = res.data;
    }
  } else {
    hintDialog.visible = false;
    proxy?.$modal.msgSuccess("操作成功");
    dialog.title = '盘点计划详情';
    // 重新查询详情
    await getDetail(id);
    await radioTableHandle();
  }
}

/** 点击作废按钮操作 */
const handleCancel = async (id: number) => {
  isDetail.value = false;
  dialog.title = "盘点计划详情";
  dialog.visible = true;
  await getDetail(id);
}

/** 详情点击作废按钮操作 */
const handleDetailCancel = async (id: number) => {
  form.value.cancelReason = undefined;
  hintDialog.title = "作废提示";
  hintDialog.visible = true;
  hintDialog.type = 1;
}

/** 盘点计划单作废 */
const cancelPlan = async (id: number) => {
  dialogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      proxy?.$modal.loading("加载中...");
      await cancelCheckPlan(form.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("操作成功");
      hintDialog.visible = false;
      dialog.visible = false;
      await radioTableHandle();
    }
  });
}

/** 选择产品盘点 */
const selectCommodity = async () => {
  materialDialog.title = "添加盘点成品";
  materialDialog.visible = true;
  // queryParamsCommodity.value重置
  queryParamsCommodity.value = {
    pageNum: 1,
    pageSize: 20
  }
  // 缓存选中的数据
  tempSelectCommodity.value=[...alreadySelectCommodity.value];
  getCommodityList();
}

/** 产品搜索条件 */
const searchChangeCommodity = async (params: any) => {
  params.status = '0';
  selectLoading.value = true;
  const res = await listCommodityInventory(params);
  commodityList.value = res.rows;
  if (commodityList.value && commodityList.value.length > 0) {
    setStorage(commodityList.value)
  }
  commodityTotal.value = res.total;
  setCommodityTableSelect()
  selectLoading.value = false;
}

/** 查询产品列表 */
const getCommodityList = async () => {
  queryParamsCommodity.value.status = '0';
  selectLoading.value = true;
  const res = await listCommodityInventory(queryParamsCommodity.value);
  commodityList.value = res.rows;
  if (commodityList.value && commodityList.value.length > 0) {
    setStorage(commodityList.value)
  }
  commodityTotal.value = res.total;
  setCommodityTableSelect()
  selectLoading.value = false;
  // 为不属于当前页的数据设置选中缓存
  nextTick(() => {

    const $table = commodityVxeTableRef.value.xTableRef
    if ($table) {
      let st = commodityList.value.filter(item => {
        return tempSelectCommodity.value.some(item2 => item.commodityId == item2.commodityId);
      });
      //得到selectInventoryList.value 中 rawMaterialId 在st中不存在的数据

      let temp = tempSelectCommodity.value.filter(item => {
        return !st.some(item2 => item.commodityId == item2.commodityId);
      });
      $table.setCheckboxRow(temp, true);
    }
  });
}

/** 设置仓库名称 */
const setStorage = (_list: any[]) => {
  if (_list && _list.length > 0) {
    _list.filter((item: any) => {
      baseStorage.value.forEach((item2) => {
        if (item.storageId == item2.id) {
          item.storageName = item2.name;
        }
      });
    });
  }
}

/** 设置产品表格列表选中 */
const setCommodityTableSelect = () => {
  const $table = commodityVxeTableRef.value.xTableRef
  if ($table) {
    //过滤commodityList中id在alreadySelectCommodity中的数据，
    let st = commodityList.value.filter(item => {
      return tempSelectCommodity.value.some(item2 => item.commodityId == item2.commodityId);
    });
    //先为commodityList中所有数据取消选中
    $table.setCheckboxRow(materialList, false);
    $table.setCheckboxRow(st, true);
  }
}

/** 选择产品 */
const commoditySelectionChange = () => {
  const $table = commodityVxeTableRef.value.xTableRef
  if ($table) {
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    tempSelectCommodity.value = selectRecords.map(item => item);
  }
}

/** 选择物料盘点 */
const selectMaterial = async () => {
  materialDialog.title = "添加盘点物料";
  materialDialog.visible = true;
  // queryParamsMaterial.value重置
  queryParamsMaterial.value = {
    pageNum: 1,
    pageSize: 20
  }
  // 缓存选中的数据
  tempSelectMaterial.value=[...alreadySelectMaterial.value];
  getMaterialInventory();
}

/** 物料搜索条件 */
const searchChangeMaterial = async (params: any) => {
  if (params) {
    queryParamsMaterial.value = params
    if (Array.isArray(queryParamsMaterial.value.categoryId)) {
      queryParamsMaterial.value.categoryIds = queryParamsMaterial.value.categoryId.join(",");
      queryParamsMaterial.value.categoryId = undefined;
    }
    //品牌 拼接
    if (queryParamsMaterial.value.manufacturer) {
      if (Array.isArray(queryParamsMaterial.value.manufacturer)) {
        queryParamsMaterial.value.manufacturer = queryParamsMaterial.value.manufacturer.join(",");
      }
    }
    //级别 拼接
    if (queryParamsMaterial.value.level) {
      if (Array.isArray(queryParamsMaterial.value.level)) {
        queryParamsMaterial.value.level = queryParamsMaterial.value.level.join(",");
      }
    }
  }
  await getMaterialInventory();
}

/** 查询物料库存列表 */
const getMaterialInventory = async () => {
  selectLoading.value = true;
  queryParamsMaterial.value.status = '0';
  queryParamsMaterial.value.isCheck = '0';
  const res = await listMaterialInventoryInfo(queryParamsMaterial.value);
  materialList.value = res.rows;
  materialList.value.forEach((item) => {
    item.materialCode = item.code;
    item.materialName = item.name;
    item.rawMaterialId = item.id;
  })
  materialsTotal.value = res.total;
  setMaterialTableSelect();
  selectLoading.value = false;
  // 为不属于当前页的数据设置选中缓存
  nextTick(() => {

    const $table = materialVxeTableRef.value.xTableRef
    if ($table) {
      let st = materialList.value.filter(item => {
        return tempSelectMaterial.value.some(item2 => item.rawMaterialId == item2.rawMaterialId);
      });
      //得到selectInventoryList.value 中 rawMaterialId 在st中不存在的数据

      let temp = tempSelectMaterial.value.filter(item => {
        return !st.some(item2 => item.rawMaterialId == item2.rawMaterialId);
      });
      $table.setCheckboxRow(temp, true);
    }
  });
}

/** 设置物料表格列表选中 */
const setMaterialTableSelect = () => {
  const $table = materialVxeTableRef.value.xTableRef
  if ($table) {
    //过滤materialList中id在alreadySelectMaterial中的数据，
    let st = materialList.value.filter(item => {
      return tempSelectMaterial.value.some(item2 => item.rawMaterialId == item2.rawMaterialId);
    });
    //先为materialList中所有数据取消选中
    $table.setCheckboxRow(materialList, false);
    $table.setCheckboxRow(st, true);
  }
}

/** 选择物料 */
const materialSelectionChange = () => {
  const $table = materialVxeTableRef.value.xTableRef
  if ($table) {
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    tempSelectMaterial.value = selectRecords.map(item => item);
  }
}

/** 确认选择产品和物料 */
const submitSelect = () => {
  // 产品
  if (form.value.type == '1') {
    //将已选中的赋值给alreadySelectCommodity
    alreadySelectCommodity.value = tempSelectCommodity.value;
    alreadySelectCommodity.value.map(item => {
      item.bizId = item.commodityId;
      item.inventoryCheckPlanId = form.value.id;
    });
  } else {
    // 物料
    // 将已选中的赋值给alreadySelectCommodity
    alreadySelectMaterial.value = tempSelectMaterial.value;
    alreadySelectMaterial.value.map(item => {
      item.bizId = item.rawMaterialId;
      item.inventoryCheckPlanId = form.value.id;
    });
  }
  materialDialog.visible = false;
}

/** 已选产品和物料取消按钮操作 */
const clearSelect = () => {
  materialDialog.visible = false;
  commodityList.value = [];
  materialList.value = [];
  tempSelectMaterial.value = [];
  tempSelectCommodity.value = [];
  const $table = materialVxeTableRef.value.xTableRef
  if ($table) {
    $table.clearCheckboxReserve();
    $table.clearCheckboxRow();
  }
  const $table2 = commodityVxeTableRef.value.xTableRef
  if ($table2) {
    $table2.clearCheckboxReserve();
    $table2.clearCheckboxRow();
  }
}

/** 确认已选物料删除按钮操作 */
const handleSelectDelete = async (row?: any) => {
  // 产品
  if(form.value.type == '1') {
    // 删除已选产品
    alreadySelectCommodity.value = alreadySelectCommodity.value.filter(item => item.commodityId != row.commodityId);
    const $table = commodityVxeTableRef.value.xTableRef;
    if ($table) {
      //将materialVxeTableRef使用toggleRowSelection 取消选中
      $table.setCheckboxRow(row, false);
    }
  } else {
    // 删除已选物料
    alreadySelectMaterial.value = alreadySelectMaterial.value.filter(item => item.rawMaterialId != row.rawMaterialId);
    const $table = materialVxeTableRef.value.xTableRef;
    if ($table) {
      //将materialVxeTableRef使用toggleRowSelection 取消选中
      $table.setCheckboxRow(row, false);
    }
  }
}

/** 失效产品移除 */
const handleInvalidDelete = async (id?: number) => {
  invalidlLoading.value = true;
  await delCheckPlanDetail(id).finally(() => invalidlLoading.value = false);
  // 删除invalidCommodity中的数据
  invalidCommodity.value = invalidCommodity.value.filter(item => item.id != id);
  // 若没有失效数据后关闭页面并刷新详情
  if (invalidCommodity.value.length == 0) {
    hintDialog.visible = false;
    await getDetail(form.value.id);
  }
  proxy?.$modal.msgSuccess("删除成功");
}

/** 失效明细一键移除 */
const invalidBatchDelete = async () => {
  let ids;
  if (form.value.type == '1') {
    ids = invalidCommodity.value.map(item => item.id);
  } else {
    ids = invalidMaterial.value.map(item => item.id);
  }
  // 批量删除
  await delCheckPlanDetail(ids).finally(() => invalidlLoading.value = false);
  hintDialog.visible = false;
  await getDetail(form.value.id);
  proxy?.$modal.msgSuccess("删除成功");
}

/** 保存草稿按钮 */
const saveDraftForm = () => {
  checkPlanDetailRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // 选择产品
      if (form.value.type == '1') {
        if (alreadySelectCommodity.value.length == 0) {
          proxy?.$modal.msgError("请选择盘点产品");
          return;
        }
        form.value.detailBoList = alreadySelectCommodity.value;

      } else {
        // 选择物料
        if (alreadySelectMaterial.value.length == 0) {
          proxy?.$modal.msgError("请选择盘点物料");
          return;
        }
        form.value.detailBoList = alreadySelectMaterial.value;
      }

      buttonLoading.value = true;
      if (form.value.id) {
        await updateCheckPlan(form.value).finally(() => buttonLoading.value = false);
        proxy?.$modal.msgSuccess("修改成功");
      } else {
        // 待提交状态
        form.value.status = '1';
        await addCheckPlan(form.value).finally(() => buttonLoading.value = false);
        proxy?.$modal.msgSuccess("操作成功");
      }
      dialog.visible = false;
      hintDialog.visible = false;
      await radioTableHandle();
    } else {
      hintDialog.visible = false;
    }
  });
}

/** 暂存盘点明细 */
const saveTemporary = async () => {
  detailLoading.value = true;
  await temporaryPlanDetail(form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value)
    .finally(() => detailLoading.value=false);
  proxy?.$modal.msgSuccess("操作成功");
  hintDialog.visible = false;
  dialog.visible = false;
  changeData.value = false;
}

/** 保存盘点明细 */
const savePlanDetail = async (data: any) => {
  let detailList = [];
  detailList.push(data);
  await temporaryPlanDetail(detailList);
}

/** 明细分页查询 */
const searchChangePlan = async (params: any) => {
  params.planType = form.value.type;
  params.inventoryCheckPlanId = form.value.id;
  params.status = form.value.status;
  detailLoading.value = true;
  // 查询前先暂存数据
  //await temporaryPlanDetail(form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value);
  await listCheckPlanDetail(params).then(detailRes => {
    if ('1' == form.value.type) {
      alreadySelectCommodity.value = detailRes.rows;
      commodityTotal2.value = detailRes.total;
    } else {
      alreadySelectMaterial.value = detailRes.rows;
      materialsTotal2.value = detailRes.total;
    }
  }).finally(() => {detailLoading.value = false});
  changeData.value = false;
}

/** 获取责任人列表 */
const getUserListList = () => {
  getUserList().then((res) => {
    if (res.code == 200) {
      userList.value = res.data || []
    }
  })
}

/** 获取仓库信息 */
const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  baseStorage.value = res.data;
};

/** 初始化列表 */
const initColumnList = () => {

  detailCommodityColumnList.value = [
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '80'},
    {minWidth: '120', title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品编码'}},
    {minWidth: '180', title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
    {minWidth: '120', title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
    {minWidth: '80', title: '单位', field: 'units', align: 'center'},
    {minWidth: '80', title: '所属仓库', field: 'storageName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入仓库名称'}},
  ];

  detailMaterialColumnList.value = [
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
  ];
}

/** 驳回作废原因 */
const buildReason = (type: number): string => {
  if (1 == type) {
    return '驳回原因：' + form.value.rejectReason;
  } else {
    return '作废原因：' + form.value.cancelReason;
  }
}

/** 单选自定义查询 */
const customizedQuery = async (query: any) => {
  detailLoading.value = true;
  // 查询明细
  queryParamsCommodity2.value.queryType = query;
  queryParamsMaterial2.value.queryType = query;
  searchChangePlan(form.value.type == '1' ? queryParamsCommodity2.value : queryParamsMaterial2.value)
}

/** 提交审核 */
const submitAudit = async () => {
  // 校验明细的盘点数量是否都填写
  if(form.value.type == '1') {
    // 盘点中校验盘点数量
    if(form.value.status == '2' && alreadySelectCommodity.value.filter(item =>!item.checkQuantity && item.checkQuantity != 0).length > 0) {
      proxy?.$modal.msgError("部分明细未填写，请填写数量后再提交");
      return;
    }
    // 复盘中校验复盘数量
    if(form.value.status == '3' && alreadySelectCommodity.value.filter(item =>!item.replayQuantity && item.replayQuantity != 0).length > 0) {
      proxy?.$modal.msgError("部分明细未填写，请填写数量后再提交");
      return;
    }
    form.value.detailBoList = alreadySelectCommodity.value;
  } else {
    // 盘点中校验盘点数量
    if(form.value.status == '2' && alreadySelectMaterial.value.filter(item =>!item.checkQuantity && item.checkQuantity != 0).length > 0) {
      proxy?.$modal.msgError("部分明细未填写，请填写数量后再提交");
      return;
    }
    // 复盘中校验复盘数量
    if(form.value.status == '3' && alreadySelectMaterial.value.filter(item =>!item.replayQuantity && item.replayQuantity != 0).length > 0) {
      proxy?.$modal.msgError("部分明细未填写，请填写数量后再提交");
      return;
    }
    form.value.detailBoList = alreadySelectMaterial.value;
  }

  // 提交审核
  proxy?.$modal.loading("加载中...");
  // 先保存填写数据
  //await temporaryPlanDetail(form.value.detailBoList);
  await submitAuditCheckPlan({id: form.value.id, status: form.value.status}).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  dialog.visible = false;
  hintDialog.visible = false;
  await radioTableHandle();
}

/** 驳回盘点计划按钮 */
const handleRejectCheck = async () => {
  hintDialog.title = "提示";
  hintDialog.visible = true;
  hintDialog.type = 7;
}

/** 确认驳回盘点计划 */
const rejectCheck = async () => {
  // 驳回盘点
  proxy?.$modal.loading("加载中...");
  form.value.detailBoList = form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value;
  await rejectCheckPlan(form.value).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  dialog.visible = false;
  hintDialog.visible = false;
  await radioTableHandle();
}

/** 审核驳回按钮 */
const handleRejectAudit = async () => {
  form.value.rejectReason = undefined;
  hintDialog.title = "审核提示";
  hintDialog.visible = true;
  hintDialog.type = 2;
}

/** 审核盘点操作 */
const auditCheck = async (status: any) => {
  if (status == '2' && !form.value.rejectReason) {
    proxy?.$modal.msgError("请填写驳回理由");
    return;
  }
  // 修改审核状态
  form.value.status = status;
  // form.value.detailBoList = form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value;
  proxy?.$modal.loading("加载中...");
  await auditCheckPlan(form.value).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("操作成功");
  dialog.visible = false;
  hintDialog.visible = false;
  await radioTableHandle();
}

/** 审核驳回操作 */
const auditReject = async (status: any) => {
  dialogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // 修改审核状态
      form.value.status = status;
      // form.value.detailBoList = form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value;
      proxy?.$modal.loading("加载中...");
      await auditCheckPlan(form.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      hintDialog.visible = false;
      await radioTableHandle();
    }
  });
}

/** 审核通过按钮 */
const handleAudit = async () => {
  hintDialog.title = "审核提示";
  hintDialog.visible = true;
  hintDialog.type = 8;
}

/** 导出操作 */
const exportExcel = async () => {
  if(form.value.type == '1') {
    queryParamsCommodity2.value.planType = form.value.type;
    queryParamsCommodity2.value.inventoryCheckPlanId = form.value.id;
    queryParamsCommodity2.value.status = form.value.status;
    proxy?.download('inventory/checkPlanDetail/export', {
      ...queryParamsCommodity2.value, tableName: commodityToolId.value
    }, form.value.planName + `盘点表导出_${dayjs(new Date()).format("YYYYMMDD")}.xlsx`);
  } else {
    queryParamsMaterial2.value.planType = form.value.type;
    queryParamsMaterial2.value.inventoryCheckPlanId = form.value.id;
    queryParamsMaterial2.value.status = form.value.status;
    proxy?.download('inventory/checkPlanDetail/export', {
      ...queryParamsMaterial2.value, tableName: materialToolId.value
    }, form.value.planName + `盘点表导出_${dayjs(new Date()).format("YYYYMMDD")}.xlsx`);
  }
}

/** 盘点导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层（盘点导入）
  open: false,
  // 弹出层标题（盘点导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/inventory/checkPlan/importData"
});

/** 导入 */
const startProcess = async (fileList: any, fn: Function) => {
  form.value.key = fileList[0].key;
  form.value.fileName = fileList[0].name;
  form.value.fileSize = fileList[0].size;
  form.value.fileType = fileList[0].type;
  form.value.detailBoList = form.value.type == '1' ? alreadySelectCommodity.value : alreadySelectMaterial.value;
  buttonLoading.value = true
  const res = await importDataCheckPlan(form.value).finally(()=>{
    buttonLoading.value = false
  });
  fn && fn({
    resMsg: res.msg,
    fileKey: res.data,
    isSuccess: !res.data,
  })
  changeData.value = false;
}

/** 导入下一步按钮操作 */
const handleImport = () => {
  if(!form.value.isCoverData) {
    proxy?.$modal.msgError("请选择导入方式");
    return;
  }
  importDialog.visible = false
  upload.title = form.value.status == '2' ? "导入盘点数据" : "导入复盘数据";
  upload.open = true;
}

/** 导入按钮操作 */
const handleImportData = () => {
  importDialog.visible = true;
  importDialog.title = '选择导入方式';
}

/** 监听数据变化 */
watch(() => alreadySelectCommodity.value, (newVal: any, oldVal: any) => {
  if (newVal.length > 0 && JSON.stringify(newVal) != JSON.stringify(oldVal)) {
    console.log("alreadySelectCommodity 数据变化了");
    changeData.value = true;
  }
}, {deep: true, immediate: true})

watch(() => alreadySelectMaterial.value, (newVal: any, oldVal: any) => {
  if (newVal.length > 0 && JSON.stringify(newVal) != JSON.stringify(oldVal)) {
    console.log("alreadySelectMaterial 数据变化了");
    changeData.value = true;
  }
}, {deep: true, immediate: true})

onMounted(() => {
  getList();
  getUserListList();
  getListBaseStorage();
});
</script>

<style>
 .div-hint {
   color: gray;
   font-size: small;
   padding-left: 20px;
   padding-bottom: 10px;
 }
 :deep(.el-collapse-item__content) {
   padding-bottom: 1px !important;
 }
</style>

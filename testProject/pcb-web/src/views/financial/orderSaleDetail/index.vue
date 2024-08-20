<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-click="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="对账单列表" name="对账单列表">
          <div class="global-flex flex-end flex-wrap" style="width: 100%;">
            <!-- <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
              <el-col :span="20"> -->
                <p class="totalTitle">应收金额汇总：{{payablePriceTotal}}
                  &nbsp;&nbsp;|&nbsp;&nbsp;退货金额汇总：{{backPriceTotal}}
                  &nbsp;&nbsp;|&nbsp;&nbsp;其他金额汇总：{{otherPriceTotal}}
                  &nbsp;&nbsp;|&nbsp;&nbsp;对账金额汇总：{{accountPriceTotal}}
                  &nbsp;&nbsp;|&nbsp;&nbsp;回款金额汇总：{{writeOffPriceTotal}}
                  &nbsp;&nbsp;|&nbsp;&nbsp;剩余金额汇总：{{remainPayablePriceTotal}}</p>
              <!-- </el-col>
              <el-col :span="1.5"> -->
              <div style="margin-left: 12px;">
                <el-button plain @click="handleExport">导出</el-button>
                <el-button type="primary" plain @click="handleAdd">对账登记</el-button>
                <el-button v-if="radioTable == '对账单列表'" type="primary" plain @click="handleSubmitBatch">批量提交</el-button>
              </div>
                <!-- <el-button v-if="radioTable == '对账单列表'" type="primary" plain @click="handleSubmitAduit">提交审核</el-button> -->
              <!-- </el-col>
            </el-row> -->
          </div>
          <XTable toolId="saleAccountToolId1" v-model:page-size="accQueryParams.pageSize" v-model:current-page="accQueryParams.pageNum" height="100%"
            class="xtable-content" :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
            :data="orderFilinOutList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange" :showRefresh="true"
            :sort-orders="sortCondition"
            :checkbox-config="{ checkMethod: submitSelectableFun,   reserve: true }"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }" :loading="loading">
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="accountUReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
            <template #default-status="scope">
              <span v-if="scope.row.status!='4'||scope.row.remainPayablePrice != 0">
                {{ statusStrings[scope.row.status as keyof typeof StatusEnum] }}
              </span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-endTime="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-createTime="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>

            <template #default-isTax="scope">
              <span v-if="scope.row.isTax == 0">否</span>
              <span v-if="scope.row.isTax == 1">是</span>
            </template>
            <template #default-tax="scope">
              <span>{{ taxRate }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '4'
                && scope.row.remainPayablePrice == scope.row.payablePrice && scope.row.remainPayablePrice != 0"
                @click="doApprovedReject(scope.row)">驳回</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="checkPass(scope.row)">提交</el-button>
              <el-button link type="primary" v-show="scope.row.status == '2'"
                @click="handleToExamine(scope.row)">审核</el-button>
              <el-button link type="primary" v-show="scope.row.status == '4'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待审核列表" name="待审核列表">

          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
            <el-col :span="1.5">
              <el-button type="primary" plain @click="batchReject">审核驳回</el-button>
              <el-button type="primary" plain @click="doBatchAudit">审核通过</el-button>
            </el-col>
          </el-row>

          <XTable toolId="saleAccountToolId2" v-model:page-size="accQueryParams2.pageSize" v-model:current-page="accQueryParams2.pageNum" height="100%"
            class="xtable-content" :intervalCondition="intervalCondition" :showRefresh="true" :sort-orders="sortCondition"
            :page-params="{ perfect: true, total: waitTotal }" :data="orderFilinOutWaitList" :columnList="columnList"
            ref="custTableRef" border @searchChange="searchChangeWait" :column-config="{ resizable: true }" :loading="loadingWait"
            :row-config="{ keyField: 'id' }">
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="accountUReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
            <template #default-status="scope">
              <span v-if="scope.row.status!='4'||scope.row.remainPayablePrice != 0">{{ statusStrings[scope.row.status as keyof typeof StatusEnum] }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-endTime="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-isTax="scope">
              <span v-if="scope.row.isTax == 0">否</span>
              <span v-if="scope.row.isTax == 1">是</span>
            </template>
            <template #default-tax="scope">
              <span>{{ taxRate }}</span>
            </template>
            <template #default-createTime="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="checkPass(scope.row)">提交</el-button>
              <el-button link type="primary" v-show="scope.row.status == '2'"
                @click="handleToExamine(scope.row)">审核</el-button>
              <el-button link type="primary" v-show="scope.row.status == '4'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已审核列表" name="已审核列表">
          <el-row :gutter="10" class="mb8" style="width:100%;margin:0;display:flex;justify-content: end;">
            <div style="display:flex;;line-height: 24px;font-size: 14px;text-align: center;">
              <div style="width: 90px;background-color: #F5FFFA">已冲销完成</div>
              <div style="width: 90px;background-color: #FAECD8">待冲销记录</div>
            </div>
<!--            <el-col :span="1.5" v-show="radioTable.includes('已审核')">-->
<!--              <el-button :disabled="writeOffList.length == 0" type="primary" plain icon="Plus"-->
<!--                @click="handleWriteOff">账单冲销</el-button>-->
<!--            </el-col>-->
          </el-row>

          <XTable toolId="saleAccountToolId3" v-model:page-size="accQueryParams3.pageSize" v-model:current-page="accQueryParams3.pageNum" height="100%"
            class="xtable-content" :intervalCondition="intervalCondition" :showRefresh="true" :sort-orders="sortCondition"
            :page-params="{ perfect: true, total: aduitTotal }" :data="orderFilinOutAduitList" :columnList="columnListAudited"
            ref="aduitTableRef" border @searchChange="searchChangeAduit" :column-config="{ resizable: true }" :loading="loadingFinsih"
            @checkbox-all="handleSelectionChange" @checkbox-change="handleSelectionChange"
            :checkbox-config="{ trigger: 'row', checkMethod: selectableFun }" :row-style="tableRowClassName"
            :row-config="{ keyField: 'id' }">
            <template #default-code="scope">
              <span>{{ scope.row.code }}</span>
              <el-button link @click="accountUReportHandle(scope.row)">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
            <template #default-status="scope">
              <span v-if="scope.row.remainPayablePrice != 0">{{ statusStrings[scope.row.status as keyof typeof StatusEnum] }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-accountMonth="scope">
              <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
            </template>
            <template #default-isTax="scope">
              <span v-if="scope.row.isTax == 0">否</span>
              <span v-if="scope.row.isTax == 1">是</span>
            </template>
            <template #default-endTime="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-accountTime="scope">
              <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-tax="scope">
              <span>{{ taxRate }}</span>
            </template>
            <template #default-createTime="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-isInvoice="scope">
              <span>{{ scope.row.isInvoice == '1' ? '是' : '否' }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.status == '4'
                && scope.row.remainPayablePrice == scope.row.payablePrice && scope.row.remainPayablePrice != 0"
                @click="doApprovedReject(scope.row)">驳回</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="checkPass(scope.row)">提交</el-button>
              <el-button link type="primary" v-show="scope.row.status == '2'"
                @click="handleToExamine(scope.row)">审核</el-button>
              <el-button link type="primary" v-show="scope.row.status == '4'"
                @click="handleWriteOffRecord(scope.row)">冲销记录</el-button>
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" v-show="scope.row.status == '1' || scope.row.status == '3'"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable @close="cancelOrderSelect" destroy-on-close modal-class="padding-drawer">
      <el-card shadow="never" class="ptable-card">
        <el-form border label-width="85px"
          :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')" ref="addTabFormRef"
          :model="inOrOutQuery" :rules="tabRules">
          <el-row>
            <el-col :span="7">
              <el-form-item size="small" label="客户：" prop="customerId">
                <el-select :disabled="drawerBorrow.title?.includes('修改')" placeholder="请选择客户" style="width: 100%;"
                  :default-first-option="true" v-model="inOrOutQuery.customerId" @change="setSupplierInfo" filterable>
                  <el-option v-for="item in customerList" :key="item.id"
                    :label="item.customerCode + '-' + item.customerName + '-' + item.reconciliationTime + '号'"
                    :value="item.id">
                    <div style="display:flex;justify-content:space-between;">
                      <span>{{ item.customerCode }}</span>
                      <span style="margin-left:20px;">{{ item.customerName }}</span>
                      <span style="margin-left:20px;">{{ item.reconciliationTime + "号" }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item size="small" label="币种："><div class="small-form-item f-12">{{ inOrOutQuery.currency }}</div></el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item size="small" label="对账日期：" prop="accountTime">
                <el-date-picker v-model="inOrOutQuery.accountTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                  value-format="YYYY-MM-DD 23:59:59" :clearable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label-width="100px" label="回款截止日期：" prop="endTime">
                <el-date-picker v-model="inOrOutQuery.endTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                  value-format="YYYY-MM-DD 23:59:59"   />
              </el-form-item>
            </el-col>
            <el-col :span="4" style="display: flex; justify-content: flex-end; align-items: flex-start;"
              v-show="drawerBorrow.title?.includes('添加') || drawerBorrow.title?.includes('修改')">
              <el-form-item label-width="10px">
                <el-button type="primary" icon="Search" @click="handleInOrOutQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item size="small" label="是否含税： " prop="isTax">
                <el-radio-group v-model="inOrOutQuery.isTax" size="small" :disabled="drawerBorrow.title?.includes('修改')">
                  <el-radio-button :label="undefined">全部</el-radio-button>
                  <el-radio-button label="1">含税</el-radio-button>
                  <el-radio-button label="0">不含税</el-radio-button>
                </el-radio-group>
                <!--                <el-switch v-model="inOrOutQuery.isTax" active-value="1" inactive-value="0" />-->
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item size="small" label="对账月份： " prop="accountMonth">
                <el-date-picker v-model="inOrOutQuery.accountMonth" style="width: 100%;" type="month" placeholder="选择月份"
                  value-format="YYYY-MM-01 23:59:59" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item size="small" label="备注：">
                <el-input v-model="inOrOutQuery.remark" maxLength="1000" :rows="1" type="textarea" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tabs v-model="tabRadioTable" @tab-click="tabRadioTableHandle" type="border-card" class="ptable-tab">
          <el-tab-pane :label="'送货单(' + deliveryTotal + ')'" name="送货单">
            <XTable :pageShow="true" v-model:page-size="rQueryParams.pageSize" tool-id="accountOrderDeliveryTable"
              v-model:current-page="rQueryParams.pageNum" :intervalCondition="intervalCondition"
              :page-params="{ perfect: true, total: deliveryTotal }" size="mini" :data="receiveList"
              :columnList="tabColumnList" ref="deliverTableRef" @checkbox-all="selectTabAllChangeEvent" height="100%" class="ptable-content"
              @checkbox-change="selectTabChangeEvent" border @searchChange="deliverSearchChange" :loading="inOrOutLoading"
              :checkbox-config="{ checkMethod: tabCheckMethod, reserve: true }"
              :disabled="inOrOutQuery.queryType == '1'"
              :row-class-name="rowClassName"
              :column-config="{ resizable: true }" @finishSort="setSelectRow(inOrOutQuery.queryType)">
              <template #default-type="scope">
                <div v-for="item in orderTypeList">
                  <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
                </div>
              </template>
              <template #default-unit="{ row }">
                <span>PCS</span>
              </template>
              <template #default-totalPrice="{ row }">
                <span>{{ row.totalPrice ? Number(row.totalPrice).toFixed(2) : 0.00 }}</span>
              </template>
              <template #default-isTax="{ row }">
                <span>{{ row.isTax == '1' ? '是' : '否' }}</span>
              </template>
              <template #default-checkQuantity="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  maxLength="11" :min="0" :max="row.quantity" :precision="0" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.checkQuantity" />
              </template>

              <template #default-discountPrice="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  :min="0" maxLength="11" :precision="2" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.discountPrice" />
              </template>
              <template #default-checkRemark="{ row }">
                <el-input :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  maxLength="1000" style="width: 99%;" v-model="row.checkRemark" @change="changeOrderListHandle(row)"/>
              </template>
            </XTable>
          </el-tab-pane>
          <el-tab-pane :label="'退货单(' + backTotal + ')'" name="退货单">
            <XTable :pageShow="true" v-model:page-size="backQueryParams.pageSize" tool-id="accountOrderBackTable"
              v-model:current-page="backQueryParams.pageNum" :intervalCondition="intervalCondition"
              :page-params="{ perfect: true, total: backTotal }" size="mini" :data="backList" height="100%" class="ptable-content"
              :columnList="backColumnList" ref="backTableRef" @checkbox-all="selectTabAllChangeEvent"
              @checkbox-change="selectTabChangeEvent" border @searchChange="backSearchChange" :loading="inOrOutLoading"
              :checkbox-config="{ checkMethod: tabCheckMethod, reserve: true }"
              :disabled="inOrOutQuery.queryType == '1'" :row-class-name="rowClassName"
              :column-config="{ resizable: true }" @finishSort="setSelectRow(inOrOutQuery.queryType)">
              <template #default-type="scope">
                <div v-for="item in orderTypeList">
                  <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
                </div>
              </template>
              <template #default-totalPrice="{ row }">
                <span>{{ row.totalPrice ? Number(row.totalPrice).toFixed(2) : 0.00 }}</span>
              </template>
              <template #default-rawOrderBackVoList[0].isTax="{ row }">
                <span>{{ row.rawOrderBackVoList[0].isTax == '1' ? '是' : '否' }}</span>
              </template>
              <template #default-unit="{ row }">
                <span>PCS</span>
              </template>
              <template #default-checkQuantity="{ row }">
                <el-input-number :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  maxLength="11" :min="0" :max="row.quantity" :precision="0" style="width: 99%;" @change="calculatePrice(row)" :controls="false"
                  v-model="row.checkQuantity" />
              </template>
              <template #default-checkRemark="{ row }">
                <el-input :disabled="drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')"
                  maxLength="1000" style="width: 99%;" v-model="row.checkRemark" @change="changeOrderListHandle(row)"/>
              </template>
            </XTable>
          </el-tab-pane>
          <el-tab-pane label="其他金额" name="其他金额">
            <el-button v-if="otherAmountBtn" type="primary" @click="otherMoneyHandle"> 新增金额 </el-button>
            <XTable :pageShow="true" v-model:page-size="backQueryParams.pageSize" :intervalCondition="intervalCondition"
              size="mini" :data="accountOrderOtherList" :row-config="{ keyField: 'id' }" :checkbox-config="{ checkMethod: tabCheckMethod }"
              :columnList="otherColumnList" ref="otherPriceTableRef" @checkbox-all="selectOtherAllChangeEvent" height="100%" class="ptable-content"
              @checkbox-change="selectOtherChangeEvent" border :disabled="inOrOutQuery.queryType == '1' ">
              <template #default-createTime="scope">
                <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
              </template>
              <template #default-recordTime="scope">
                <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
              </template>
              <template #default-type="scope">
                <span>{{ scope.row.type == 1 ? '入金' : '出金' }}</span>
              </template>
              <template #default-price="scope">
                <span>{{ scope.row.price ? Number(scope.row.price).toFixed(2) : 0.00 }}</span>
              </template>
              <template #default-operate="scope">
                <el-button link type="primary" @click="handleUpdateOther(scope.row)">修改</el-button>
                <el-button link type="primary" @click="handleDeleteOther(scope.row)">删除</el-button>
              </template>
            </XTable>
            <vxe-table align="center" border ref="otherTableRef" height="400" size="small"
              :row-config="{ isHover: true }" :data="accountOrderOtherList" @checkbox-all="selectOtherAllChangeEvent"
              @checkbox-change="selectOtherChangeEvent" v-if="false">
              <vxe-column width="40" type="checkbox"
                v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')">
              </vxe-column>
              <vxe-column type="seq" width="50" title="序号" field="code"> </vxe-column>
              <vxe-column width="180" title="创建时间" field="createTime">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
              </vxe-column>
              <vxe-column field="createByName" title="创建人" width="120"></vxe-column>
              <vxe-column field="recordTime" width="140" title="对账日期">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
                </template>
              </vxe-column>
              <vxe-column field="type" width="80" title="金额类型">
                <template #default="scope">
                  <span>{{ scope.row.type == 1 ? '入金' : '出金' }}</span>
                </template>
              </vxe-column>
              <vxe-column field="price" width="80" title="金额">
                <template #default="scope">
                  <span>{{ scope.row.price ? scope.row.price.toFixed(2) : 0.00 }}</span>
                </template>
              </vxe-column>
              <vxe-column field="remark" fixed="right" title="备注"> </vxe-column>
              <vxe-column fixed="right" width="120" title="操作"
                v-if="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')">
                <template #default="scope">
                  <el-button link type="primary" @click="handleUpdateOther(scope.row)">修改</el-button>
                  <el-button link type="primary" @click="handleDeleteOther(scope.row)">删除</el-button>
                </template>
              </vxe-column>
            </vxe-table>
          </el-tab-pane>
        </el-tabs>

        <el-form border label-width="120px" :model="outForm" class="drawer-order-form">
          <el-row>
            <el-col :span="4">
              <el-form-item size="small" label="对账总金额：" prop="borrowTotalPrice">{{ borrowTotalPrice }}</el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item size="small" label="退货总金额：" prop="backTotalPrice">{{ -backTotalPrice }}</el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item size="small" label="其他金额：" prop="backTotalPrice">{{ BigNumber(otherRecoverTotalPrice).minus(BigNumber(otherOutTotalPrice)) }}</el-form-item>
            </el-col> -->
            <el-col :span="4">
              <el-form-item size="small" label="入金总金额：" prop="backDiscountTotalPrice">{{ otherRecoverTotalPrice
              }}</el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item size="small" label="出金总金额：" prop="backDiscountTotalPrice">{{ -otherOutTotalPrice
              }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="应收总金额：" prop="accountPrice">{{
                BigNumber(borrowTotalPrice).minus(BigNumber(backTotalPrice)).minus(BigNumber(otherOutTotalPrice)).plus(BigNumber(otherRecoverTotalPrice)).toNumber()
              }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="addCancel">取消</el-button>
            <el-button :loading="buttonLoading" type="danger" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSave">
              保存
            </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="handleSubmit">
              提交
            </el-button>
            <el-button :loading="buttonLoading" type="danger" v-show="drawerBorrow.title?.includes('审核')" @click="reject(inOrOutQuery.id)"> 驳回
            </el-button>
            <el-button :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('审核')" @click="examinePass(inOrOutQuery.id)">
              通过 </el-button>
          </span>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="otherMoneyDialog.visible" :title="otherMoneyDialog.title" width="30%" draggable style="min-width: 450px;">
      <el-form ref="accountOrderOtherFormRef" :model="otherForm" :rules="otherRules" label-width="100px"
        label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="金额类型:" prop="type">
              <el-radio-group v-model="otherForm.type">
                <el-radio label="1">入金</el-radio>
                <el-radio label="2">出金</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="对账日期:" prop="recordTime" style="width: 100%">
              <el-date-picker v-model="otherForm.recordTime" style="width: 100%" type="date"
                value-format="YYYY-MM-DD 23:59:59" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="金额:" prop="price">
              <el-input-number style="width: 100%; text-align: left;" :precision="2" :controls="false"
                v-model="otherForm.price" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="otherForm.remark" maxLength="1000" :rows="2" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="otherCancel">取消</el-button>
            <el-button type="primary" v-show="drawerBorrow.title?.includes('修改') || drawerBorrow.title?.includes('添加')"
              @click="otherSubmitForm">
              保存
            </el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <writeOffDialog v-model:open="writerOffDialogOpen" :writeOffList="writeOffList" :type="writeOffType"
      @getList="getAduitList" @close="cancelOrderSelect"></writeOffDialog>
    <writeOffsRecordDialog v-model:open="writerOffRecordDialogOpen" :accountOrderWriteOff="accountOrderWriteOff"
      :type="writeOffType" @getList="getAduitList" @close="cancelOrderSelect"></writeOffsRecordDialog>

    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
      draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
  </div>
</template>

<script setup name="OrderSaleDetail" lang="ts">
import writeOffDialog from '../components/writeOffDialog.vue';
import writeOffsRecordDialog from '../components/writeOffRecordDialog.vue';
import { OrderFilinOutDetailVO, OrderFilinOutDetailQuery, OrderFilinOutDetailForm } from '@/api/financial/orderFilinOutDetail/types';
import { VxeTableEvents } from 'vxe-table';
import { AccountOrderOtherVO, AccountOrderOtherForm, AccountOrderOtherQuery } from '@/api/financial/accountOrderOther/types';
import { SourceHalfProcessCalcRuleVO, SourceHalfProcessCalcRuleTypeEnum } from "@/api/outsource/sourceHalfProcessCalcRule/types";
import { listSourceHalfProcessCalcRule } from "@/api/outsource/sourceHalfProcessCalcRule";

import { listOrderBack } from '@/api/order/orderBack/index';
import { accountList } from '@/api/order/deliveryRecord';
import { InOutRecordVO, InOutRecordQuery, InOutRecordForm, InOutRecordTypeEnum } from '@/api/inventory/inOutRecord/types';

import { listOrderSaleDetail, getOrderSaleDetail, delOrderSaleDetail, addOrderSaleDetail, updateOrderSaleDetail } from '@/api/financial/orderSaleDetail';
import { OrderSaleDetailVO, OrderSaleDetailQuery, OrderSaleDetailForm, SALETYPEENUM } from '@/api/financial/orderSaleDetail/types';

import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  postListAccountOrder,
  listAccountOrderCount,
  getAccountOrder,
  delAccountOrderNew,
  addAccountOrder,
  updateAccountOrder,
  updateAccountOrderStatus,
  submitAuditOrderSale,
  batchSubmit,
  batchAudit,
  batchAuditReject,
  approvedReject
} from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, TypeEnum, StatusEnum,statusStrings } from '@/api/financial/accountOrder/types';
import { listCustomer,getListCustomer } from '@/api/basedata/customer';
import useUserStore from '@/store/modules/user';
import { BigNumber } from 'bignumber.js';
import { parseTime } from "@/utils/ruoyi";
import dayjs from "dayjs";
import { deepClone } from '@/utils';
/**销售对账预览 */
import { getReportUrl } from '@/utils/report';
import { Decimal } from 'decimal.js';

/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

const accountUReportHandle = async (row: any) => {
  console.log("accountUReportHandle",row)
  const _name=row.customerName;
  const formattedMonth =  dayjs(row.accountMonth).format('MM');
  const nowTime = dayjs(new Date()).format("YYYY_MM_DD_HH_mm_ss")

  const reportName=_name+formattedMonth+'月销售对账单_'+nowTime
  console.log("reportName",reportName)
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl() + `&_n=${reportName}&_u=file:saleAccount.ureport.xml&url=financial/accountOrder/review/${row.id}&listUrl=financial/orderSaleDetail/report/${row.id}&listUrl1=financial/accountOrder/reviewRecord/${row.id}`;
  reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
}
const changeOrderList = ref([]) // 用于保存送货单数据.修改了数据之后,切换页码时,需要保留已经修改的值

/**========汇总数据 ========= */
const accountPriceTotal = ref(0);
const backPriceTotal = ref(0);
const payablePriceTotal = ref(0);
const remainPayablePriceTotal = ref(0);
const writeOffPriceTotal = ref(0);
const otherPriceTotal = ref(0);
/**销售对账预览 */

//初始化编辑金额
const firstInitEditPrice = ref(true);

const buttonLoading = ref(false);
const { nickname } = useUserStore();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const taxRate = ref(0);
const orderFilinOutList = ref<AccountOrderVO[]>([]);
const orderFilinOutWaitList = ref<AccountOrderVO[]>([]);
const orderFilinOutAduitList = ref<AccountOrderVO[]>([]);
//首次查询，或者重置查询条件
const firstSearch = ref(true);
//编辑前对账日期
const updateAccDate = ref();
const updateAccMonth = ref();
const updateAccRemark = ref();
//已选择记录
const saleDetailList = ref<OrderSaleDetailVO[]>([]);
const backList = ref<InOutRecordVO[]>([]);
const receiveList = ref<InOutRecordVO[]>([]);
const checkedOrderBackOutDetailList = ref<OrderSaleDetailVO[]>([]);
const checkedOrderBackOutDetailListTab = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverList = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverListTab = ref<OrderSaleDetailVO[]>([]);
const checkedDeliverListBgHeight = ref<OrderSaleDetailVO[]>([]);
//其他金额
const accountOrderOtherList = ref<AccountOrderOtherVO[]>([]);
//选中的其他金额
const selectedOrderOtherList = ref<AccountOrderOtherVO[]>([]);
const loading = ref(true);
const loadingWait = ref(true);
const loadingFinsih = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const waitTotal = ref(0);
const aduitTotal = ref(0);
const backTotal = ref(0);
const deliveryTotal = ref(0);
const inOrOutLoading = ref(true);
const backTableRef = ref();
const deliverTableRef = ref();
const otherTableRef = ref();
const otherPriceTableRef = ref();
const addTabFormRef = ref<ElFormInstance>();
const orderFilinOutDetailFormRef = ref<ElFormInstance>();
const supplierFilnPriceList = ref<SourceHalfProcessCalcRuleVO[]>([]);
//其他金额form
const accountOrderOtherFormRef = ref<ElFormInstance>();
const otherMoneyDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//冲销defin start
const aduitTableRef = ref();
const writerOffDialogOpen = ref(false);
const writerOffRecordDialogOpen = ref(false);
const writeOffList = ref<AccountOrderVO[]>([]);
const accountOrderWriteOff = ref<AccountOrderVO>();
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);
/**
* 冲销类型
* 1:付款
* 2:收款
*/
const writeOffType = "2"
//其他金额form
//冲销defin end
const initFormData: OrderFilinOutDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  feilinOrderId: undefined,
  ownerId: undefined
}
const data = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    status: undefined,
    isTax: undefined,
    accountUserId: undefined,
    accountUserName: undefined,
    currency: undefined,
    quantity: undefined,
    price: undefined,
    discountPrice: undefined,
    totalPrice: undefined,
    accountOrderId: undefined,
    feilinOrderId: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "change" }
    ],
    accountUserId: [
      { required: true, message: "对账人id不能为空", trigger: "blur" }
    ],
    accountUserName: [
      { required: true, message: "对账人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    accountOrderId: [
      { required: true, message: "对账单id不能为空", trigger: "blur" }
    ],
    feilinOrderId: [
      { required: true, message: "退货单、收货记录ID不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ]
  }
});
const data2 = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    params: {
    }
  },
  rules: {
  }
});
const data3 = reactive<PageData<OrderFilinOutDetailForm, OrderFilinOutDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    params: {
    }
  },
  rules: {
  }
});
const XTableRef = ref();
const custTableRef = ref();
const delPageChangeCheckList = ref([]) // 解决切换分页时，重置取消的勾选

const customerCodeList = ref();
const customerNameList = ref();
const columnListAudited = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号', field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户代码', width: '140', field: 'customerCodeIdList',align: 'center',filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value },
  { title: '客户名称', width: '140', field: 'customerNameIdList',align: 'center',filterType: 'checkboxSearch' , filterData:()=>customerNameList.value },
  { title: '含税', width: '80', field: 'isTax', align: 'center' },
  { title: '税率', width: '80', field: 'tax', align: 'center' },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
  { title: '汇率', width: '90', field: 'cusExchangeRate', align: 'center' },
  { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center' , filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  //{ title: '制单日期', width: '140', field: 'createTime', align: 'center' , filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' }},
  { title: '对账日期', sortable: true,width: '140', field: 'accountTime', align: 'center' , filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' }},
  { title: '对账金额', sortable: true,width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true,width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true,width: '140', field: 'backPrice', align: 'center', },
  { title: '应收金额', sortable: true,width: '140', field: 'repayPayablePrice', align: 'center', },//receivablePrice
  { title: '回款金额', sortable: true,width: '140', field: 'repayWriteOffPrice', align: 'center', },
  { title: '剩余应收金额', sortable: true,width: '140', field: 'repayRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center',filterType: 'input' },
  { title: '是否开票', width: '80', field: 'isInvoice', align: 'center', },
  { title: '开票日期', width: '80', field: 'invoiceTime', align: 'center', },
  { title: '开票金额', width: '80', field: 'invoicePrice', align: 'center', },
  { title: '发票号码', width: '80', field: 'invoiceCode', align: 'center', },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const columnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: '序号', field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '单据状态', width: '80', field: 'status', align: 'center', },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入对账单号' } },
  { title: '客户代码', width: '140', field: 'customerCodeIdList',align: 'center',filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value },
  { title: '客户名称', width: '140', field: 'customerNameIdList',align: 'center',filterType: 'checkboxSearch' , filterData:()=>customerNameList.value },
  { title: '含税', width: '80', field: 'isTax', align: 'center' },
  { title: '税率', width: '80', field: 'tax', align: 'center' },
  { title: '月结方式', width: '90', field: 'monthlyMethod', align: 'center' },
  { title: '汇率', width: '90', field: 'cusExchangeRate', align: 'center' },
  { title: '币种', width: '90', field: 'currency', align: 'center' },
  { title: '回款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center' , filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  //{ title: '制单日期', width: '140', field: 'createTime', align: 'center' , filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' }},
  { title: '对账日期', sortable: true,width: '140', field: 'accountTime', align: 'center' , filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' }},
  { title: '对账金额', sortable: true,width: '140', field: 'accountPrice', align: 'center', },
  { title: '其他金额', sortable: true,width: '140', field: 'otherPrice', align: 'center', },
  { title: '退货金额', sortable: true,width: '140', field: 'backPrice', align: 'center', },
  { title: '应收金额', sortable: true,width: '140', field: 'repayPayablePrice', align: 'center', },//receivablePrice
  { title: '回款金额', sortable: true,width: '140', field: 'repayWriteOffPrice', align: 'center', },
  { title: '剩余应收金额', sortable: true,width: '140', field: 'repayRemainPrice', align: 'center', },
  { title: '对账人', width: '140', field: 'accountUserName', align: 'center',filterType: 'input' },
  { title: '备注', width: '240', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const isCompressionList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
]);
const orderTypeList = ref([
  { label: '菲林', value: "1" },
  { label: '网板', value: "2" },
]);
const tabColumnList = ref([
  { type: 'checkbox', align: 'center', fixed: 'left', field: "checkbox", width: '50' },
  { title: "序号", type: 'seq', fixed: 'left', align: 'center', width: '60' },
  { title: '送货单号', width: '120', fixed: 'left', field: 'code', align: 'center', filterType: 'input' },
  { title: '送货日期',sortable: true, width: '120', field: 'deliveryTime', align: 'center' },
  { title: '客户PO', width: '120', field: 'customerPo', align: 'center', filterType: 'input' },
  { title: '客户物料编码', width: '120', field: 'customerMaterialCode', align: 'center' },
  { title: '是否含税', width: '120', field: 'isTax', align: 'center' },
  { title: '发货人', width: '120', field: 'deliveryUserName', align: 'center', filterType: 'input' },
  { title: '客户名称', width: '120', field: 'customerName', align: 'center',  },
  { title: '客户编码', width: '120', field: 'customerCode', align: 'center',  },
  { title: '销售单号', width: '120', field: 'orderCode', align: 'center', filterType: 'input' },
  { title: '下单时间', width: '120', field: 'placeOrderTime', align: 'center',  },
  { title: '月结方式', width: '120', field: 'cusMonthlyStatementWay', align: 'center', filterType: 'input' },
  { title: '产品编码', width: '120', field: 'commodityCode', align: 'center', filterType: 'input' },
  { title: '产品名称', width: '120', field: 'commodityName', align: 'center', filterType: 'input' },
  { title: '订单总数', width: '120', field: 'orderQuantity', align: 'center' },
  { title: '单位', width: '120', field: 'unit', align: 'center' },
  { title: '模具费用', width: '120', field: 'mouldCost', align: 'center' },
  { title: '测试架费用', width: '120', field: 'testFrameCost', align: 'center' },
  { title: '工程费', width: '120', field: 'engineeringCost', align: 'center' },
  { title: '飞针费', width: '120', field: 'flyProbeCost', align: 'center' },
  { title: '样板费', width: '120', field: 'sampleCost', align: 'center' },
  { title: '加急费', width: '120', field: 'expeditedCost', align: 'center' },
  { title: '其他费用', width: '120', field: 'otherCost', align: 'center' },
  { title: '备品数量', width: '70', field: 'reserveQuantity', align: 'center' },
  { title: '送货数量', width: '80', fixed: 'right', field: 'deliveryQuantity', align: 'center' },
  { title: '核对数量', width: '70', fixed: 'right', field: 'checkQuantity', align: 'center' },
  { title: '单价', width: '80', fixed: 'right', field: 'orderPrice', align: 'center' },
  { title: '扣款金额', width: '80', fixed: 'right', field: 'discountPrice', align: 'center' },
  { title: '总金额', width: '90', fixed: 'right', field: 'totalPrice', align: 'center' },
  { title: '备注', width: '120', fixed: 'right', field: 'checkRemark', align: 'center' },
]);
const backColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60' },
  { title: '退货单号', fixed: 'left', width: '120', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货单号' } },
  { title: '退货日期',sortable: true, width: '120', field: 'backTime', align: 'center' },
  { title: '客户PO', width: '120', field: 'rawOrderBackVoList[0].customerPo', align: 'center' },
  { title: '是否含税', width: '120', field: 'rawOrderBackVoList[0].isTax', align: 'center' },
  { title: '下单人', width: '120', field: 'createByName', align: 'center' },
  { title: '客户编码', width: '120', field: 'rawOrderBackVoList[0].customerCode', align: 'center' },
  { title: '客户名称', width: '120', field: 'cusName', align: 'center' },
  { title: '月结方式', width: '120', field: 'rawOrderBackVoList[0].cusMonthlyStatementWay', align: 'center' },
  { title: '产品编码', width: '120', field: 'rawOrderBackVoList[0].commodityCode', align: 'center' },
  { title: '产品名称', width: '120', field: 'rawOrderBackVoList[0].commodityName', align: 'center' },
  { title: '单位', width: '120', field: 'unit', align: 'center' },
  { title: '订单总数',width: '120', field: 'rawOrderBackVoList[0].orderQuantity', align: 'center' },
  { title: '单价', width: '120', field: 'orderPrice', align: 'center' },
  { title: '备品数量', width: '120', field: 'rawOrderBackVoList[0].spareQuantity', align: 'center' },
  { title: '退货数', sortable: true,width: '120', field: 'quantity', align: 'center' },
  { title: '核对数量', width: '120', fixed: 'right', field: 'checkQuantity', align: 'center' },
  { title: '总金额', width: '120', fixed: 'right', field: 'totalPrice', align: 'center' },
  { title: '备注', width: '120', fixed: 'right', field: 'checkRemark', align: 'center' },
]);
const otherColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60' },
  { title: '创建时间', width: '180', field: 'createTime', align: 'center' },
  { title: '创建人', width: '180', field: 'createByName', align: 'center' },
  { title: '对账日期', width: '180', field: 'recordTime', align: 'center' },
  { title: '金额类型', width: '180', field: 'type', align: 'center' },
  { title: '金额', width: '180', field: 'price', align: 'center' },
  { title: '备注', width: '180', fixed: 'right', field: 'remark', align: 'center' },
  { title: '操作', width: '180', fixed: 'right', field: 'operate', align: 'center' },
]);
const { queryParams:accQueryParams, form, rules } = toRefs(data);
const { queryParams:accQueryParams2 } = toRefs(data2);
const { queryParams:accQueryParams3 } = toRefs(data3);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});
//头部按钮组
const radioTable = ref('对账单列表');
const tabRadioTable = ref('退货单');
const otherAmountBtn = ref(false);
//tab明细结构
const initOutFormData: OrderSaleDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: "0",
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  accountOrderId: undefined,
  commodityInOutRecordId: undefined,
  ownerId: undefined,
  saleOrderBackId: undefined
}
const initOutFormDataB = {
  id: undefined,
  quantity: undefined,
  reason: undefined,
}
const backData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});
const rData = reactive<PageData<InOutRecordForm, InOutRecordQuery>>({
  form: { ...initOutFormDataB },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  },
  rules: {
  }
});
const insertFormData = reactive<PageData<AccountOrderForm, AccountOrderQuery>>({
  form: { ...initOutFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    endTime: undefined,
    accountTime: undefined,
    supplierId: undefined,
    accountMonth: undefined,
    currency: undefined,
    code: undefined,
    remark: undefined,
    status: undefined,
    id: undefined,
    isTax: undefined,
  },
  rules: {
    customerId: [
      { required: true, message: "客户不能为空", trigger: "change" }
    ],
    accountTime: [
      { required: true, message: "对账日期不能为空", trigger: "change" }
    ],
    accountMonth: [
      { required: true, message: "对账月份不能为空", trigger: "change" }
    ],
    price: [
      { required: true, message: "菲林单价不能为空", trigger: "blur" }
    ],
    isTax: [
      { required: true, message: "请选择对账单含税类型", trigger: "change" }
    ],
    checkQuantity: [
      { required: true, message: "核对数量不能为空", trigger: "blur" }
    ],
    checkPrice: [
      { required: true, message: "核对单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],

  }
});
//其他金额
const initOtherFormData: AccountOrderOtherForm = {
  index: undefined,
  id: undefined,
  type: "1",
  createByName: undefined,
  price: undefined,
  remark: undefined,
  accountOrderId: undefined,
  recordTime: undefined
}
const otherData = reactive<PageData<AccountOrderOtherForm, AccountOrderOtherQuery>>({
  form: { ...initOtherFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: undefined,
    price: undefined,
    accountOrderId: undefined,
    recordTime: undefined,
    params: {
    }
  },
  rules: {
    type: [
      { required: true, message: "金额类型不能为空", trigger: "change" }
    ],
    recordTime: [
      { required: true, message: "对账时间不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ]
  }
});
const intervalCondition = ['accountMonth', 'endTime','accountTime','createTime'];
const sortCondition = ['endTime'];

const { queryParams: inOrOutQuery, form: outForm, rules: tabRules } = toRefs(insertFormData);
const { queryParams: otherQueryParams, form: otherForm, rules: otherRules } = toRefs(otherData);
const { queryParams: backQueryParams } = toRefs(backData);
const { queryParams: rQueryParams } = toRefs(rData);

// 取消已审核列表勾选
const cancelOrderSelect = () => {
  changeOrderList.value.length = 0
  const $table = aduitTableRef.value.xTableRef;
  if ($table) {
    $table.clearCheckboxRow()
    writeOffList.value = []
  }
}

//供应商列表
const customerList = ref([]);
// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;
  //columnList.value[0].visible = false
  if (radioTable.value == "对账单列表") {
    accQueryParams.value.status = undefined;
    //columnList.value[0].visible = true
    await getList();
  } else if (radioTable.value == "已审核列表") {
    accQueryParams3.value.status = StatusEnum.AUDITED;
    //columnList.value[0].visible = true;
    await getAduitList();
  } else if (radioTable.value == "待审核列表") {
    accQueryParams2.value.status = StatusEnum.BE_AUDITED;
    await getWaitList();
  }
}
const tabRadioTableHandle = (tab: any, event: any) => {
  console.log("tab.props.name", tab.props.label);
  tabRadioTable.value = tab.props.name;
  otherAmountBtn.value = tabRadioTable.value == '其他金额' && !(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核'));
  if (tabRadioTable.value != '其他金额') {
    //getAddListRecord();
  }
}

// 切换菜单栏 *********** end
const tabCheckMethod = (row: any) => {
  return !(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核'));
}
// 编辑送货单高亮
const rowClassName = ({row, rowIndex, $rowIndex}: any) => {
  const num = checkedDeliverListBgHeight.value.findIndex((item: any) => item.id == row.id)
  if (num != -1) {
    return 'table-height-rows'
  }
}
// 搜索 **************start
const deliverSearchChange = (params: any) => {
  rQueryParams.value= params;
  if(params.sorts&&params.sorts.length>0){
    params.sorts.forEach((item:any)=>{
      rQueryParams.value.orderByColumn=item.prop;
      rQueryParams.value.isAsc=item.order;
    })
  }
  console.log("rQueryParams.value", rQueryParams.value);
  getAddListRecord();
}
const backSearchChange = (params: any) => {
  backQueryParams.value= params;
  if(params.sorts&&params.sorts.length>0){
    params.sorts.forEach((item:any)=>{
      backQueryParams.value.orderByColumn=item.prop;
      backQueryParams.value.isAsc=item.order;
    })
  }
  getAddListRecord();
}
const searchChange = async (params: any) => {
  accQueryParams.value =JSON.parse(JSON.stringify(params));
  if(params.sorts&&params.sorts.length>0){
    params.sorts.forEach((item:any)=>{
      accQueryParams.value.orderByColumn=item.prop;
      accQueryParams.value.isAsc=item.order;
    })
  }
  console.log("accQueryParams", accQueryParams.value);
  //accQueryParams.value = params
  await getList();
}
const searchChangeWait = async (params: any) => {
  accQueryParams2.value = JSON.parse(JSON.stringify(params));
  if(params.sorts&&params.sorts.length>0){
    params.sorts.forEach((item:any)=>{
      accQueryParams2.value.orderByColumn=item.prop;
      accQueryParams2.value.isAsc=item.order;
    })
  }
  await getWaitList();
}

const searchChangeAduit = async (params: any) => {
  accQueryParams3.value = JSON.parse(JSON.stringify(params));
  if(params.sorts&&params.sorts.length>0){
    params.sorts.forEach((item:any)=>{
      accQueryParams3.value.orderByColumn=item.prop;
      accQueryParams3.value.isAsc=item.order;
    })
  }
  await getAduitList();
}
const getAllList = async () => {
  await getList();
  await getWaitList();
  await getAduitList();
}
const getListCount = async (queryAny:any) => {
  const countRes = await listAccountOrderCount(queryAny);
  accountPriceTotal.value = countRes.accountPriceTotal?countRes.accountPriceTotal:0;
  backPriceTotal.value = countRes.backPriceTotal?countRes.backPriceTotal:0;
  payablePriceTotal.value = countRes.payablePriceTotal?countRes.payablePriceTotal:0;
  remainPayablePriceTotal.value = countRes.remainPayablePriceTotal?countRes.remainPayablePriceTotal:0;
  writeOffPriceTotal.value = countRes.writeOffPriceTotal?countRes.writeOffPriceTotal:0;
  otherPriceTotal.value = countRes.otherPriceTotal?countRes.otherPriceTotal:0;

  accountPriceTotal.value = toFixTwoPrice(accountPriceTotal.value);
  backPriceTotal.value = toFixTwoPrice(backPriceTotal.value);
  payablePriceTotal.value = toFixTwoPrice(payablePriceTotal.value);
  remainPayablePriceTotal.value = toFixTwoPrice(remainPayablePriceTotal.value);
  writeOffPriceTotal.value = toFixTwoPrice(writeOffPriceTotal.value);
  otherPriceTotal.value = toFixTwoPrice(otherPriceTotal.value);
}

const toFixTwoPrice = (queryAny:any) => {
  console.log(Number(queryAny));
  return queryAny?Number(queryAny).toFixed(2):0;
}

const getWaitList = async () => {
  loadingWait.value = true
  accQueryParams2.value.status = StatusEnum.BE_AUDITED;
  accQueryParams2.value.type = TypeEnum.SALE;
  const res = await postListAccountOrder(accQueryParams2.value);
  orderFilinOutWaitList.value = res.rows;
  waitTotal.value = res.total;
  loadingWait.value = false

  //await getListCount(accQueryParams2.value);
}
const getAduitList = async () => {
  loadingFinsih.value = true
  accQueryParams3.value.status = StatusEnum.AUDITED;
  accQueryParams3.value.type = TypeEnum.SALE;
  const res = await postListAccountOrder(accQueryParams3.value);
  orderFilinOutAduitList.value = res.rows;
  aduitTotal.value = res.total;
  loadingFinsih.value = false

  //await getListCount(accQueryParams3.value);
}
/** 查询退货单/收货对账单明细列表 */
const getList = async () => {
  loading.value = true;
  accQueryParams.value.status = undefined;
  accQueryParams.value.type = TypeEnum.SALE;
  const res = await postListAccountOrder(accQueryParams.value);
  orderFilinOutList.value = res.rows;
  total.value = res.total;
  loading.value = false;

  await getListCount(accQueryParams.value);
}
// 搜索 **************end
/** 表单重置 */
const resetQuery = async () => {
  firstSearch.value = true;
  if(drawerBorrow.title?.includes('修改')){
    inOrOutQuery.value.accountTime =updateAccDate.value;
    inOrOutQuery.value.accountMonth =updateAccMonth.value;
    inOrOutQuery.value.remark =updateAccRemark.value;
    inOrOutQuery.value.endTime = undefined;
    inOrOutQuery.value.accountMonth = undefined;
    inOrOutQuery.value.remark = undefined;
  }else{
    inOrOutQuery.value.customerId = undefined;
    inOrOutQuery.value.currency = undefined;
    inOrOutQuery.value.accountTime = parseTime(new Date(), '{y}-{m}-{d} 23:59:59');
    inOrOutQuery.value.endTime = undefined;
    inOrOutQuery.value.isTax = undefined;
    inOrOutQuery.value.accountMonth = undefined;
    inOrOutQuery.value.remark = undefined;
    resetTab();
  }
  rQueryParams.value=new Object();
  rQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  backQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  await getAddListRecord();

}
const reset = () => {
  form.value = { ...initFormData };
  orderFilinOutDetailFormRef.value?.resetFields();
}

const addCancel = () => {
  reset();
  drawerBorrow.visible = false;
  currentAccountOrderId.value = undefined;
}

const resetTab = async () => {
  firstInitEditPrice.value = true;

  outForm.value = { ...initOutFormData };
  backList.value = [];
  receiveList.value = [];
  checkedOrderBackOutDetailList.value = [];
  checkedDeliverList.value = [];
  accountOrderOtherList.value = [];
  selectedOrderOtherList.value = [];
  changeOrderList.value = [];
  delPageChangeCheckList.value = [];
  checkedDeliverListBgHeight.value = [];

  inOrOutQuery.value = new Object();
  inOrOutQuery.value.isTax = undefined;
  inOrOutQuery.value.accountTime = parseTime(new Date(), '{y}-{m}-{d} 23:59:59');
  addTabFormRef.value?.resetFields();
  tabRadioTable.value = "送货单";
  inOrOutLoading.value = false;

  let _backTabCache=backTableRef.value;
  let _deTabCache=deliverTableRef.value;
  if(_backTabCache){
    _backTabCache.xTableRef.clearCheckboxReserve();
    _backTabCache.xTableRef.clearCheckboxRow();
  }
  if(_deTabCache){
    _deTabCache.xTableRef.clearCheckboxReserve();
    _deTabCache.xTableRef.clearCheckboxRow();
  }

  backQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  rQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  otherQueryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
}
//添加对账单表单 全选
const selectTabAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({ checked }) => {
  //refreshListCheck();
  console.log("selectTabAllChangeEvent",checked)
  drawTabDataSet();
}
//单选
const selectTabChangeEvent: VxeTableEvents.CheckboxAll<OrderFilinOutDetailVO> = (item:any) => {
  console.log("selectTabChangeEvent",item)
  //refreshListCheck();
  drawTabDataSet();
}

const drawTabDataSet=()=>{
  console.log("drawTabDataSet...");
  const _backTableRef=backTableRef.value.xTableRef;
  const _deliverTableRef=deliverTableRef.value.xTableRef;

  //获取当前页选中的数据
  const  deliverCurCheck= _deliverTableRef.getData().filter((item:any)=>_deliverTableRef.isCheckedByCheckboxRow(item));
  const  r_deliverCurCheck= _deliverTableRef.getData().filter((item:any)=>!_deliverTableRef.isCheckedByCheckboxRow(item));
  const  backCurCheck= _backTableRef.getData().filter((item:any)=>_backTableRef.isCheckedByCheckboxRow(item));
  const  r_backCurCheck= _backTableRef.getData().filter((item:any)=>!_backTableRef.isCheckedByCheckboxRow(item));

  addTabStore(backCurCheck,checkedOrderBackOutDetailList.value,"id");
  removeTabStore(r_backCurCheck,checkedOrderBackOutDetailList.value,"id");
  addTabStore(deliverCurCheck,checkedDeliverList.value,"deliveryId");
  removeTabStore(r_deliverCurCheck,checkedDeliverList.value,"deliveryId");
  console.log("checkedDeliverList.value", checkedDeliverList.value );
}
const addTabStore = (sourceList:any,storeList:any,key:any) => {
    sourceList.forEach((item:any)=>{

        let itemAlready2 =storeList.some((item2: any) => item2[key] == item[key]);
        console.log("itemAlready2",itemAlready2)
        let itemAlready = storeList.find((itemAlready:any)=>{

        console.log("itemAlready[key]",itemAlready[key])
        console.log("itemAlready[key]",itemAlready)
        console.log("item[key]",item[key])
          return itemAlready[key]==item[key]
        });
        console.log("addTabStore",item)
        console.log("key",key)
        console.log("item[key]",item[key])
        console.log("itemAlready",itemAlready)
        console.log("storeList",storeList)
        if (itemAlready) {
            // 更新已存在的元素
            itemAlready = item;
        } else {
            // 添加新元素
            storeList.push(item);
        }
    })
}
const removeTabStore = (sourceList:any,storeList:any,key:any) => {
    sourceList.forEach((item:any)=>{
        let itemAlready = storeList.find((itemAlready:any)=>itemAlready[key]==item[key]);
        if (itemAlready) {
            delPageChangeCheckList.value.push(itemAlready)
            // 删除元素
            const _inx=storeList.indexOf(itemAlready);
            storeList.splice(_inx, 1);
        }
    })
}

//重新设置使得响应式生效
const refreshListCheck = () => {

  const checkInfo3 = otherPriceTableRef.value.xTableRef.getCheckboxReserveRecords().concat(otherPriceTableRef.value.xTableRef.getCheckboxRecords());
  selectedOrderOtherList.value = checkInfo3;
  console.log(" refreshListCheck selectedOrderOtherList" ,selectedOrderOtherList);
}
/** 新增按钮操作 */
const handleAdd = async () => {
  tabRadioTable.value = "送货单";
  drawerBorrow.title = "添加对账单";
  drawerBorrow.visible = true;
  await resetTab();
  currentAccountOrderId.value=undefined;
  await getAddListRecord();
}

const handleUpdate = async (row?: AccountOrderVO) => {
  await resetTab();
  drawerBorrow.visible = true;
  const _id = row?.id || ids.value[0]
  drawerBorrow.title = "修改对账单";
  tabRadioTable.value = "送货单";
  currentAccountOrderId.value = _id;
  const res = await getAccountOrder(_id);
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  updateAccDate.value = res.data.accountTime;
  updateAccMonth.value = res.data.accountMonth;
  updateAccRemark.value = res.data.remark;
  inOrOutQuery.value.queryType = "1";
  await getAddListRecord();
  checkedDeliverListBgHeight.value = deepClone(checkedDeliverList.value)
  if(checkedDeliverListBgHeight.value&&checkedDeliverListBgHeight.value.length>0){
    checkedDeliverListBgHeight.value = checkedDeliverListBgHeight.value.concat(deepClone(checkedOrderBackOutDetailList.value))
  }else{
    checkedDeliverListBgHeight.value = deepClone(checkedOrderBackOutDetailList.value)
  }
  // console.log("---------------handleUpdate-checkedDeliverList.value",checkedDeliverList.value)

}
/**详情按钮操作 */
const handleDetail = async (row?: AccountOrderVO) => {
  await resetTab();
  tabRadioTable.value = "送货单";
  drawerBorrow.title = "对账单详情";
  drawerBorrow.visible = true;
  const _id = row?.id || ids.value[0]
  currentAccountOrderId.value = _id;
  const res = await getAccountOrder(_id);
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";
  rQueryParams.value.onlyAccountOrder = "1";
  backQueryParams.value.onlyAccountOrder = "1";
  await getAddListRecord();
  checkedDeliverListBgHeight.value = deepClone(checkedDeliverList.value)
  if(checkedDeliverListBgHeight.value&&checkedDeliverListBgHeight.value.length>0){
    checkedDeliverListBgHeight.value = checkedDeliverListBgHeight.value.concat(deepClone(checkedOrderBackOutDetailList.value))
  }else{
    checkedDeliverListBgHeight.value = deepClone(checkedOrderBackOutDetailList.value)
  }
}
const setQueryParams = (_id: any) => {
  inOrOutQuery.value.accountTime = outForm.value.accountTime;
  inOrOutQuery.value.endTime = outForm.value.endTime;
  inOrOutQuery.value.accountMonth = outForm.value.accountMonth;
  inOrOutQuery.value.customerId = outForm.value.customerId;
  inOrOutQuery.value.remark = outForm.value.remark;
  inOrOutQuery.value.currency = outForm.value.currency;
  inOrOutQuery.value.isTax = outForm.value.isTax;
  inOrOutQuery.value.id = _id;
}
/** 查询tab记录 */
const getAddListRecord = async () => {
  inOrOutLoading.value = true;
  console.log("inOrOutQuery.value", inOrOutQuery.value);
  console.log("rQueryParams.value", rQueryParams.value);
  console.log("backQueryParams.value", backQueryParams.value);
  backQueryParams.value = { ...inOrOutQuery.value,...backQueryParams.value }
  rQueryParams.value = {  ...inOrOutQuery.value,...rQueryParams.value }
  rQueryParams.value.customerId = inOrOutQuery.value.customerId;
  backQueryParams.value.customerId = inOrOutQuery.value.customerId;
  //查询类型为view
  if (inOrOutQuery.value.queryType == "1") {
    //清空queryParams,查询记录
    let detailQuery:OrderSaleDetailQuery={};
    //防止覆盖accountOrderId
    accQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    rQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    backQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    currentAccountOrderId.value = inOrOutQuery.value.id;
    detailQuery = {
      // pageNum: 1,
      // pageSize: 10,
      accountOrderId: inOrOutQuery.value.id,
    };
    const saleDetail=await listOrderSaleDetail(detailQuery);

    saleDetailList.value = saleDetail.rows;
    console.log(" saleDetailList.value....", saleDetailList.value)
    setSaleDetailCheckedList();
    if (delPageChangeCheckList.value?.length) {
      checkedDeliverList.value = checkedDeliverList.value.filter((item: any) => delPageChangeCheckList.value.findIndex((fi: any) => fi.id == item.id) == -1)
    }
    console.log(" setSaleDetailCheckedList.value....", checkedDeliverList.value)
    otherQueryParams.value.accountOrderId = inOrOutQuery.value.id;
    listAccountOrderOther(otherQueryParams.value).then(res => {

      //编辑翻页，暂存其他金额
      if(!accountOrderOtherList.value||accountOrderOtherList.value.length==0){
        accountOrderOtherList.value = res.data;
      }
      if(!selectedOrderOtherList.value||selectedOrderOtherList.value.length==0){
        selectedOrderOtherList.value = JSON.parse(JSON.stringify(res.data));
      }
    });
    //审核不需要未对账数据
    if(drawerBorrow.title?.includes('详情') || drawerBorrow.title?.includes('审核')){
      backQueryParams.value.hasAccountOrder = "1";
      rQueryParams.value.hasAccountOrder = "1";
      rQueryParams.value.onlyAccountOrder = "1";
      backQueryParams.value.onlyAccountOrder = "1";
    }
  } else {
    backQueryParams.value.hasAccountOrder = "0";
    rQueryParams.value.hasAccountOrder = "0";
  }
  rQueryParams.value.deliveryTime = inOrOutQuery.value.accountTime ? inOrOutQuery.value.accountTime : undefined;
  backQueryParams.value.backTime = inOrOutQuery.value.accountTime ? inOrOutQuery.value.accountTime : undefined;
  console.log("do inOrOutQuery.value.isTax",inOrOutQuery.value.isTax);
  rQueryParams.value.isTax = inOrOutQuery.value.isTax ? inOrOutQuery.value.isTax : undefined;
  backQueryParams.value.isTax = inOrOutQuery.value.isTax ? inOrOutQuery.value.isTax : undefined;
  console.log("do select rQueryParams.value",rQueryParams.value);
  backQueryParams.value.remark=undefined;
  rQueryParams.value.remark=undefined;
  await Promise.all([
    //退货
    listOrderBack({ ...backQueryParams.value, accountOrderId: currentAccountOrderId.value })
      .then(res => {
        backList.value = res.rows;
        backTotal.value = res.total;
      }),
    //送货单
    accountList({ ...rQueryParams.value, accountOrderId: currentAccountOrderId.value })
      .then(res2 => {
        receiveList.value = res2.rows;
        deliveryTotal.value = res2.total;
      })
  ])

  setSelectRow(inOrOutQuery.value.queryType);
  //编辑状态下，判断不是首次初始化金额
  if(inOrOutQuery.value.queryType=="1"){
    firstInitEditPrice.value = false;
  }
  inOrOutLoading.value = false
}

const setSelectRow = (queryType?: string) => {
  backList.value.forEach(item => {
    item.customerId = item.cusId;
    item.saleOrderBackId = item.rawOrderBackVoList[0].saleOrderBackId;
  })
  receiveList.value.map(item => {
    item.code = item.deliveryCode;
    item.saleOrderId = item.bizId;
    item.deliveryId = item.id;
  })
  console.log("checked", checkedOrderBackOutDetailList.value, checkedDeliverList.value)
  console.log("checked2", backList, receiveList)
  setPriceInfo();
  nextTick(() => {
    if (queryType == "1") {
      setCheckedListInfo();
    }
      setTimeout(() => {
        let f_checkedList = backList.value.filter(item => {
          return checkedOrderBackOutDetailList.value.some((item2: any) => item.saleOrderBackId == item2.saleOrderBackId);
        });
        backTableRef.value.xTableRef.setCheckboxRow(f_checkedList, true);
        let w_checkedList = receiveList.value.filter(item => {
          return checkedDeliverList.value.some((item2: any) => item.deliveryId == item2.deliveryId);
        });
        deliverTableRef.value.xTableRef.setCheckboxRow(w_checkedList, true);

        otherPriceTableRef.value.xTableRef.setCheckboxRow(selectedOrderOtherList.value, true);
        //refreshTabDataSet();
      }, 500);

  })
}
const setPriceInfo = () => {
      console.log("changeOrderList",changeOrderList.value)
  if (backList) {
      backList.value= backList.value.map((item) => {
        item.orderPrice = item.price ? item.price : 0;
        item.checkQuantity = item.quantity ? item.quantity : 0;
        const crtM = changeOrderList.value.find((f: any) => f.id == item.id);
        if (crtM) {
          item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
          item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
          item.checkRemark = crtM?.checkRemark;
          item.unInitEditPrice = crtM?.unInitEditPrice;
        }
        const itemPrice: any = (item.orderPrice * 10000).toFixed(2);
        const itemQuantity: any = (item.checkQuantity * 10000).toFixed(2);
        let sum1 = (itemPrice * itemQuantity)/10000;
        item.totalPrice = Number(sum1) / 10000;
        return item
      });
  }
  if (receiveList) {
    receiveList.value.forEach((item, inx) => {
      item.checkPrice = item.orderPrice ? item.orderPrice : 0;
      item.checkQuantity = item.quantity ? item.quantity : 0;
      item.discountPrice = item?.discountPrice ? item.discountPrice : 0;
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
      const discountPrice2 =  (item.discountPrice * 10000).toFixed(2);
      const itemPrice = (item.checkPrice * 10000).toFixed(2);
      const itemQuantity = (item.checkQuantity * 10000).toFixed(2);
      let _otherCost:number =Number(item.mouldCost)+Number(item.testFrameCost)+Number(item.engineeringCost)
          +Number(item.flyProbeCost)+Number(item.sampleCost)+Number(item.expeditedCost)+Number(item.otherCost);
      _otherCost = (_otherCost*10000).toFixed(2);
      let amount:number = (itemPrice * itemQuantity) / 10000;
      amount=Number(amount)-Number(discountPrice2);
      if(_otherCost){
        amount=Number(amount)+Number(_otherCost);
      }
      item.totalPrice = amount/10000;
    });
  }
}
const setSaleDetailCheckedList = () => {
  if (saleDetailList.value&&saleDetailList.value.length>0) {
    let _backCheckList=saleDetailList.value.filter(item => item.type == SALETYPEENUM.SALE_BACK);
    _backCheckList=_backCheckList.map(cd=>{
        cd.saleDetailId=cd.id;
        cd.id=cd.saleOrderBackId;
        cd.checkPrice = cd.orderPrice;
        cd.checkQuantity = cd.quantity;
        return cd;
    })
    if(!checkedOrderBackOutDetailList.value||checkedOrderBackOutDetailList.value.length==0){
      checkedOrderBackOutDetailList.value =JSON.parse(JSON.stringify(_backCheckList));
    }
    //编辑状态下的缓存数据的price重新赋值，兼容新增单价逻辑
    let  _checkedDeliverList= saleDetailList.value.filter(item => item.type == SALETYPEENUM.SALE_DELIVER);
    _checkedDeliverList=_checkedDeliverList.map(cd=>{
        cd.saleDetailId=cd.id;
        cd.id=cd.deliveryId;
        cd.checkPrice = cd.orderPrice;
        cd.checkQuantity = cd.quantity;
        return cd;
    })
    if(!checkedDeliverList.value||checkedDeliverList.value.length==0){
      checkedDeliverList.value =JSON.parse(JSON.stringify(_checkedDeliverList));
    }
  }
}

const setCheckedListInfo = () => {
    backList.value.map((item, inx) => {
      const detail: any = checkedOrderBackOutDetailList.value.find(itemA => itemA.saleOrderBackId == item.saleOrderBackId);
      if (detail) {
        backList.value[inx] = setListPriceInfo(item, detail);
      }
    });
    receiveList.value.map((item, inx) => {
      const detail: any = checkedDeliverList.value.find(itemA => itemA.deliveryId == item.deliveryId);
      if (detail) {
        receiveList.value[inx] = setListPriceInfo(item, detail);
      }
    });
  console.log("receiveList ....",receiveList.value)
  console.log("backList ....",backList.value);
  console.log("changeList ....",changeOrderList.value);
  //记住修改数值后重新计算一次总金额
  if(checkedDeliverList.value&&checkedDeliverList.value.length>0){
    checkedDeliverList.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.discountPrice = crtM?.discountPrice ? crtM.discountPrice : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
    });
  }
  console.log("checkedDeliverList======== ....",checkedDeliverList.value);
  if(checkedOrderBackOutDetailList.value&&checkedOrderBackOutDetailList.value.length>0){
    checkedOrderBackOutDetailList.value.forEach((item, inx) => {
      const crtM = changeOrderList.value.find((f: any) => f.id == item.id)
      if (crtM) {
        item.checkQuantity = crtM?.checkQuantity ? crtM.checkQuantity : 0;
        item.totalPrice = crtM?.totalPrice ? crtM.totalPrice : 0;
        item.checkRemark = crtM?.checkRemark;
        item.unInitEditPrice = crtM?.unInitEditPrice;
      }
    });
  }

}
const setListPriceInfo = (item: any, obj: any) => {
  if (!obj) {
    return;
  }
  console.log("setListPriceInfo", obj?.price);
  console.log("setListPriceInfo orderPrice", item.orderPrice);
 //编辑状态下的缓存数据的price重新赋值，兼容新增单价逻辑

  //item.orderPrice = item.orderPrice?item.orderPrice:obj?.price;
  item.orderPrice = obj?.price?obj?.price:item.orderPrice;
  //非编辑、或者第一次加载需要赋值
  if (inOrOutQuery.value.queryType  != "1" || !item?.unInitEditPrice ) {
    item.checkQuantity = obj?.quantity;
    item.discountPrice = obj?.discountPrice;
    item.checkRemark = obj?.remark;
    item.totalPrice = obj?.totalPrice?obj?.totalPrice:0;
  }
  return item;
}
const handleInOrOutQuery = async () => {
  resetChecked();
  inOrOutQuery.value.pageNum = 1;
  firstSearch.value = false;
  //removeUnCust();
  await getAddListRecord();
}
const resetChecked = () => {

  backList.value = [];
  receiveList.value = [];
  checkedOrderBackOutDetailList.value = [];
  checkedDeliverList.value = [];
  changeOrderList.value = [];
  //accountOrderOtherList.value = [];
  //selectedOrderOtherList.value = [];
}
//设置表单信息
const setSupplierInfo = async (value: string) => {

  if (!value) {
    inOrOutQuery.value.currency = undefined;
    return;
  }
  let customer = customerList.value.find(item => item.id === value);
  if (customer) {
    inOrOutQuery.value.currency = customer.currency;
    if(customer.dayNumberLimit&&inOrOutQuery.value.accountTime){
      inOrOutQuery.value.endTime = dayjs(inOrOutQuery.value.accountTime).add(customer.dayNumberLimit, 'day').format('YYYY-MM-DD');
    }
  }
  console.log("setSupplierInfo", customer);
};

const handlePriceBlur = (row: any) => {
  console.log("handlePriceBlur row.checkQuantity", row);
};
// 存储修改的数据
const changeOrderListHandle = (row: any) => {
  const index = changeOrderList.value.findIndex((item: any) => item.id == row.id)
  if (index == -1) {
    changeOrderList.value.push(row)
  } else {
    changeOrderList.value.splice(index, 1, row)
  }
  // console.log('changeOrderList.value', changeOrderList.value)
}
/**
 * 计算价格
 * @param data
 */
const calculatePrice = async (row: any) => {
  let price = row.orderPrice?row.orderPrice:0;
  let quantity = row.checkQuantity?row.checkQuantity:0;
  let discountPrice = row.discountPrice?row.discountPrice:0;
  console.log("000000calculatePrice00000000000",row);
  if(!quantity){
    row.checkQuantity=0;
  }
  if (!price || !quantity) {
    row.totalPrice =0;
    return;
  }
  //非首次加载，触发一次计算后，不在设置默认值
  console.log("firstInitEditPrice.value",firstInitEditPrice.value);
  if(!firstInitEditPrice.value){
    row.unInitEditPrice = true;
  }

  let _otherCost:number =Number(row.mouldCost)+Number(row.testFrameCost)+Number(row.engineeringCost)
     +Number(row.flyProbeCost)+Number(row.sampleCost)+Number(row.expeditedCost)+Number(row.otherCost);
  // price = (price * 10000).toFixed(2);
  // quantity = (quantity * 10000).toFixed(2);
  // let amount = price * quantity/ 100000000 ;
  let amount = Decimal.mul(Number(price),Number(quantity)).toDecimalPlaces(2).toNumber();
  if(_otherCost){
    console.log("_otherCost",_otherCost);
    let _price = Decimal.sub(Number(amount),Number(discountPrice)).toDecimalPlaces(2).toNumber();
    row.totalPrice =  Decimal.add(_price, Number(_otherCost)).toDecimalPlaces(2).toNumber();
  }else{
    //row.totalPrice = Number(amount) - Number(discountPrice) ;
    row.totalPrice = Decimal.sub(Number(amount),Number(discountPrice)).toDecimalPlaces(2).toNumber();
  }
  //重新设置当前页选中数据使得响应式生效
  doCurRefreshCheck();

  console.log('checkedOrderBackOutDetailList', checkedOrderBackOutDetailList.value,row)
  // console.log('tempChoose', tempChoose)
  // 在修改了数据后,保留修改的数据,以便在切换页码后,用修改的数据去替换
  changeOrderListHandle(row)
};
const doCurRefreshCheck = () => {
  if(checkedOrderBackOutDetailList.value){
    const tempList1 = backTableRef.value.xTableRef.getCheckboxRecords();
    checkedOrderBackOutDetailList.value=checkedOrderBackOutDetailList.value.map(item=>{
      tempList1.find((item2: any) => {
        if(item2.id==item.id){
          item=item2;
        }
      })
      return item;
    })
  }
  if(checkedDeliverList.value){
    const tempList2 = deliverTableRef.value.xTableRef.getCheckboxRecords();
    checkedDeliverList.value=checkedDeliverList.value.map(item=>{
      tempList2.find((item2: any) => {
        if(item2.id==item.id){
          item=item2;
        }
      })
      return item;
    })
  }
};


const calculateTotalPriceByType = (list: any, _type: any, fieldName: string) => {
  console.log('111111-----------------', list)
  if (!list) {
    return 0;
  }
  const resNum = list
    .filter((item: any) => {
      let validType = true;
      if (_type) {
        validType = item.type == _type
      }
      return item[fieldName] && validType
    })
    .reduce((total: any, item: any) => {
      let totalTmp = Number(total.toFixed(2)) * 100000000;
      let itemTotal=Number(item[fieldName]);
      let _tmp = Number(itemTotal.toFixed(2)) * 100000000;
      return (totalTmp + _tmp) / 100000000
    }, 0);
  return resNum;
};

//外付 总金额
const borrowTotalPrice = computed(() => {
  console.log('2222--------', checkedDeliverList.value)
  return calculateTotalPriceByType(checkedDeliverList.value, undefined, "totalPrice").toFixed(2);
});
//外付 总退货金额
const backTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedOrderBackOutDetailList.value, undefined, "totalPrice").toFixed(2);
});

//外付 总折扣金额
const borrowDiscountTotalPrice = computed(() => {
  return calculateTotalPriceByType(checkedDeliverList.value, undefined, "discountPrice").toFixed(2);
});

//入金总金额
const otherRecoverTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList.value, "1", "price").toFixed(2);
});
//出金总金额
const otherOutTotalPrice = computed(() => {
  return calculateTotalPriceByType(selectedOrderOtherList.value, "2", "price").toFixed(2);
});

const handleSubmit = () => {
  outForm.value.status = StatusEnum.BE_AUDITED;
  doSave();
}

const handleSave = () => {
  if (!outForm.value.status || outForm.value.status != StatusEnum.REJECTED) {
    outForm.value.status = StatusEnum.BE_SUBMITTED;
  }
  doSave();
}

const doSave = async () => {
  setListInfoBefore();
  const vad = await validateForm();
  if (!vad) {
    return;
  }
  //得到供应商id
  console.log(" doSave inOutForm.value======", outForm.value);
  console.log(" doSave inOrOutQuery.value======", inOrOutQuery.value);
  Object.assign(outForm.value, inOrOutQuery.value);
  //类型
  outForm.value.type = TypeEnum.SALE;
  outForm.value.accountPrice = borrowTotalPrice.value ;
  outForm.value.accountDiscountPrice = borrowDiscountTotalPrice.value;
  outForm.value.accountMonth = inOrOutQuery.value.accountMonth;
  outForm.value.otherPrice = BigNumber(otherRecoverTotalPrice.value).minus(BigNumber(otherOutTotalPrice.value));
  let payableAmount=BigNumber(borrowTotalPrice.value).minus(BigNumber(backTotalPrice.value)).minus(BigNumber(otherOutTotalPrice.value)).plus(BigNumber(otherRecoverTotalPrice.value)).toNumber();
  outForm.value.payablePrice = payableAmount;
  outForm.value.backPrice =backTotalPrice.value;
  setListInfo();
  console.log(" doSave inOutForm.value", outForm.value);

  if (outForm.value.id == undefined) {
    buttonLoading.value = true;
    addAccountOrder(outForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      getAllList();
    }).catch(err => {
      //由于id是前端生成，传到后端会导致新增id不对，所以保存前会清空，此处报错需要重新赋值回来
      outForm.value.otherOrderBoList=outForm.value.otherOrderBoList.map(item=>{
        item.id=item.oldId;
        return item;
      })
    }).finally(() => { buttonLoading.value = false; });
  } else {
    buttonLoading.value = true;
    updateAccountOrder(outForm.value).then(res => {
      proxy?.$modal.msgSuccess("修改成功");
      drawerBorrow.visible = false;
      currentAccountOrderId.value = undefined;
      getAllList();
    }).catch(err => {
      //由于id是前端生成，传到后端会导致新增id不对，所以保存前会清空，此处报错需要重新赋值回来
      outForm.value.otherOrderBoList=outForm.value.otherOrderBoList.map(item=>{
        item.id=item.oldId;
        return item;
      })
    }).finally(() => { buttonLoading.value = false; });
  }
}

const setListInfoBefore = () => {
  if (checkedDeliverList.value) {
    checkedDeliverList.value = checkedDeliverList.value.map(item1 => {
      let item2 = receiveList.value.find(item2 => item2.id === item1.deliveryId);
      if (item2) {
        // 通过 id 赋值
          item1.orderPrice = item2?.orderPrice;
          item1.checkQuantity = item2?.checkQuantity;
          item1.checkRemark = item2?.checkRemark;
          item1.discountPrice = item2?.discountPrice;
          item1.totalPrice = item2?.totalPrice;
          item1.saleOrderId = item2?.bizId;
      }
      return item1
    });
    console.log("deliverDetail",checkedDeliverList.value)
  }
  if(checkedOrderBackOutDetailList.value){
    checkedOrderBackOutDetailList.value = checkedOrderBackOutDetailList.value.map(item1=>{
      let item2 = backList.value.find(item2 => item2.id === item1.saleOrderBackId);
      if (item2) {
          // 通过 id 赋值
          item1.checkQuantity = item2?.checkQuantity;
          item1.checkRemark = item2?.checkRemark;
          item1.discountPrice = item2?.discountPrice;
          item1.totalPrice = item2?.totalPrice;
          //item1.saleOrderId = item2?.bizId;
      }
      return item1
    })
  }
}

const setListInfo = () => {
  console.log("setListInfo1", receiveList);
  console.log("setListInfo22", checkedDeliverList.value);
  console.log("checkedOrderBackOutDetailList", checkedOrderBackOutDetailList.value);
  //退货单参数set
  if (checkedOrderBackOutDetailList.value) {
    const _backList: any = [];
    Object.assign(_backList, checkedOrderBackOutDetailList.value);
    buildBackList(_backList);
    outForm.value.orderSaleDetailBoList = _backList;

  }
  //收货单参数set
  if (checkedDeliverList) {
    const _receiveList: any = [];
    const deliverDetail =receiveList.value.filter((item: any) => {
      return checkedDeliverList.value.some((item2: any) => item.id == item2.deliveryId);
    });
    console.log("deliverDetail",deliverDetail)
    Object.assign(_receiveList, checkedDeliverList.value);
    buildReceiveList(_receiveList);
    outForm.value.orderSaleDetailBoList = outForm.value.orderSaleDetailBoList?.concat(_receiveList);
    console.log("=======setListInfo========_receiveList",_receiveList)
  }
  //设置其他金额
  console.log("accountOrderOtherList.value",selectedOrderOtherList.value);
  if (selectedOrderOtherList.value) {
    accountOrderOtherList.value = selectedOrderOtherList.value;
    outForm.value.otherOrderBoList = deepClone(accountOrderOtherList.value);
    if(outForm.value.id == undefined){
      outForm.value.otherOrderBoList=outForm.value.otherOrderBoList.map(item=>{
        item.oldId=item.id;
        item.id=undefined;
        return item;
      })
    }else{
      outForm.value.otherOrderBoList=outForm.value.otherOrderBoList.map(item=>{
        if(item.id.indexOf("row")>-1){
          item.oldId=item.id;
          item.id=undefined;
        }
        return item;
      })
    }
  }
}

const buildReceiveList = (_receiveList: any) => {
  console.log("buildReceiveList", _receiveList);
  _receiveList.forEach((item: any) => {
    item.currency = outForm.value.currency ? outForm.value.currency : '';
    item.type = SALETYPEENUM.SALE_DELIVER;
    item.isTax = item.isTax ? item.isTax : outForm.value.isTax;

    item.commodityInOutRecordId = item.commodityInOutRecordId ? item.commodityInOutRecordId : item.id;
    if (outForm.value.id == undefined) {
      item.deliveryId = item.commodityInOutRecordId;
      item.saleOrderId = item.saleOrderId?item.saleOrderId:item.bizId;
      item.id = undefined;
    }else{
      item.deliveryId = item.id;
      item.id = undefined;
    }
    item.status = outForm.value.status;
    item.price = item.orderPrice;
    item.remark = item.checkRemark;
    item.quantity = item.checkQuantity;
    item.discountPrice = item.discountPrice ? item.discountPrice : 0;
  });
}
const buildBackList = (backList: any) => {
  backList.forEach((item: any) => {
    item.currency = outForm.value.currency ? outForm.value.currency : '';
    item.type = SALETYPEENUM.SALE_BACK;
    item.isTax = item.isTax ? item.isTax : outForm.value.isTax;

    if (outForm.value.id == undefined) {
      item.saleOrderBackId = item.saleOrderBackId ? item.saleOrderBackId : item.id;
      item.id = undefined;
    }
    item.price = item.price;
    item.remark = item.checkRemark;
    item.quantity = item.checkQuantity;
    item.discountPrice = 0;
    item.status = outForm.value.status;
  });
}
/*********** 新增验证 ******start*/
const validateForm = async () => {
  let res: any = false;
  await addTabFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      res = true;
    }
  });
  if (!res) {
    return res;
  }
  if (checkedOrderBackOutDetailList.value.length == 0
    && checkedDeliverList.value.length == 0
    && accountOrderOtherList.value.length == 0) {
    proxy?.$modal.msgError("请选择退货单/收货单、或填写其他金额");
    return false;
  }
  const listTab = await validateList();
  res = res && listTab;
  return res;
}
const validateList = async () => {
  let finLinValid = true;
  let wangbanValid = true;
  let supplierValid = true;
  let supplierValid2 = true;
  let taxValid = true;
  let res = true;
  let errMsg = "请填写核对数量、扣款金额到勾选的退货单";
  let wbErrMsg = "请填写核对数量、扣款金额到勾选的送货单";
  let noList = "";
  let wbnoList = "";
  let feiLinSupplier: any;
  let wangbanSupplier: any;
  const formSupplierId = inOrOutQuery.value.customerId;
  const formIsTax = inOrOutQuery.value.isTax;
  if (checkedOrderBackOutDetailList.value.length > 0) {
    console.log("formIsTax", formIsTax)
    console.log("checkedOrderBackOutDetailList", checkedOrderBackOutDetailList.value)
    taxValid = checkedOrderBackOutDetailList.value.some((item: any) => {
      let itemTax = item.isTax ? item.isTax : item.rawOrderBackVoList[0].isTax;
      return itemTax !== formIsTax;
    });
    console.log("taxValid", taxValid)
    if (taxValid) {
      proxy?.$modal.msgError("主单含税类型与所选单据含税类型不一致");
      return false;
    }

    feiLinSupplier = checkedOrderBackOutDetailList.value[0]?.customerId;
    supplierValid = !checkedOrderBackOutDetailList.value.some((item: any) => {
      return item.customerId !== feiLinSupplier;
    });
    checkedOrderBackOutDetailList.value.forEach((item: any) => {
      if (!item.checkQuantity||item.checkQuantity==0) {
        if (finLinValid) {
          finLinValid = false;
        }
        noList += item.code + "、";
      }
    });
  }
  if (checkedDeliverList.value.length > 0) {
    console.log("formIsTax2", formIsTax)
    taxValid = checkedDeliverList.value.some((item: any) => {
      return item.isTax !== formIsTax;
    });
    console.log("taxValid2", taxValid)
    if (taxValid) {
      proxy?.$modal.msgError("主单含税类型与所选单据含税类型不一致");
      return false;
    }


    wangbanSupplier = checkedDeliverList.value[0]?.customerId;
    supplierValid2 = !checkedDeliverList.value.some((item: any) => {
      return item.customerId !== wangbanSupplier;
    });
    checkedDeliverList.value.forEach((item: any) => {
      if (!item.checkQuantity||(item.discountPrice!=0&&(item.discountPrice==undefined||item.discountPrice==''||item.discountPrice==null))) {
        if (wangbanValid) {
          wangbanValid = false;
        }
        wbnoList += item.code + "、";
      }
    });
  }
  console.log("formSupplierId", formSupplierId, "feiLinSupplier", feiLinSupplier, "wangbanSupplier", wangbanSupplier)
  console.log("feiLinSupplier", checkedOrderBackOutDetailList.value, "wangbanSupplier", checkedDeliverList.value)
  console.log("supplierValid", supplierValid,supplierValid2)
  if (feiLinSupplier && wangbanSupplier && (feiLinSupplier != wangbanSupplier)) {
    supplierValid = false;
  }


  if (supplierValid) {
    let listSup = feiLinSupplier ? feiLinSupplier : wangbanSupplier;
    if (formSupplierId != listSup) {
      supplierValid = false;
    }
  }
  if (!supplierValid||!supplierValid2) {
    proxy?.$modal.msgError("客户不一致，请重新选择");
    return false;
  }
  if (!finLinValid) {
    errMsg += noList;
    proxy?.$modal.msgError(errMsg);
    res = false;
  }
  if (!wangbanValid) {
    wbErrMsg += wbnoList;
    proxy?.$modal.msgError(wbErrMsg);
    res = false;
  }
  return res;
}
/*********** 新增验证 ******end*/


/************aduit 审核操作 start ***********/
/**审核弹窗 */
const handleToExamine = async (row?: AccountOrderVO) => {
  await resetTab();
  const _id = row?.id || ids.value[0]
  const res = await getAccountOrder(_id);
  currentAccountOrderId.value = undefined;
  drawerBorrow.title = "对账单审核";
  Object.assign(outForm.value, res.data);
  setQueryParams(res.data.id);
  inOrOutQuery.value.queryType = "1";

  rQueryParams.value.onlyAccountOrder = "1";
  backQueryParams.value.onlyAccountOrder = "1";
  tabRadioTable.value = "送货单";
  drawerBorrow.visible = true;
  await getAddListRecord();
  checkedDeliverListBgHeight.value = deepClone(checkedDeliverList.value)
  if(checkedDeliverListBgHeight.value&&checkedDeliverListBgHeight.value.length>0){
    checkedDeliverListBgHeight.value = checkedDeliverListBgHeight.value.concat(deepClone(checkedOrderBackOutDetailList.value))
  }else{
    checkedDeliverListBgHeight.value = deepClone(checkedOrderBackOutDetailList.value)
  }

}
/** 审核驳回 */
const reject = async (id: string | number | undefined) => {
  updateStatus(id, StatusEnum.REJECTED);
}
/** 审核通过 */
const examinePass = async (id: string | number | undefined) => {
  updateStatus(id, StatusEnum.AUDITED);
}
/** 提交*/
const checkPass = async (row: AccountOrderVO) => {
  await proxy?.$modal.confirm('是否确认提交对账单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  updateStatus(row.id, StatusEnum.BE_AUDITED, true);
}
const updateStatus = (id: any, status: string, flag: boolean = false) => {
  buttonLoading.value = true;
  if (flag == true) {
    // falg true 列表提交按钮，需要开启全局加载
    proxy?.$modal.loading('加载中...');
  }
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;
  }).finally(() => {
    buttonLoading.value = false;
    if (flag == true) { proxy?.$modal.closeLoading() }
  });
}
/************aduit 审核操作 end ***********/

/************ 冲销操作 start ***********/
const handleWriteOff = async () => {
  //判断writeOffList是不是同一个供应商
  if (writeOffList.value.some(item => item.customerId != writeOffList.value[0].customerId)) {
    proxy?.$modal.msgError("不同客户不能一起进行账单冲销");
    return;
  }
  if (writeOffList.value.some(item => item.payablePrice === "0.0000")) {
    proxy?.$modal.msgError("已核销的账单不能进行冲销");
    return;
  }
  writerOffDialogOpen.value = true;
}
const handleSelectionChange = () => {
  const $table = aduitTableRef.value.xTableRef
  if ($table) {
    const records = $table.getCheckboxRecords();
    console.log("records", records)
    const sortRecords = records.sort((a: any, b: any) =>  new Date(a.accountTime).getTime()-new Date(b.accountTime).getTime());
    console.log("sortRecords", sortRecords)
    writeOffList.value = sortRecords;
  }
}
const selectableFun = (scope: any) => {
  if (scope.row.remainPayablePrice === "0.0000") {
    return false;
  }
  return true;
}
const handleWriteOffRecord = async (row: AccountOrderVO) => {
  accountOrderWriteOff.value = row;
  writerOffRecordDialogOpen.value = true;

}
const tableRowClassName = (row: any) => {
  if (radioTable.value.includes("已审核") && row.row.repayRemainPrice === "0.0000") {
    return {
      backgroundColor: '#F5FFFA'
    }
  } else if (radioTable.value.includes("已审核") && row.row.repayRemainPrice != "0.0000") {
    return {
      //backgroundColor: '#FFB6C1'
      backgroundColor: 'rgb(250, 236, 216)'
    }
  }
  return ''
}
/****** 冲销操作 end******/

/**
 * 获取供应商列表
 */
const getCustomerList = async () => {
  const SupplierResponse: any = await listCustomer();
  customerList.value = SupplierResponse.rows;
  console.log(customerList.value);
}

/** 其他金额 *************start**********/
const handleUpdateOther = async (row: AccountOrderOtherVO) => {
  otherMoneyDialog.title = "修改其他金额";
  otherMoneyDialog.visible = true;
  Object.assign(otherForm.value, row);
}
/** 删除其他金额按钮操作 */
const handleDeleteOther = async (row: AccountOrderOtherVO) => {
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  if (row.id != undefined) {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.id != row.id);
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.id != row.id);
  } else {
    accountOrderOtherList.value = accountOrderOtherList.value.filter(item => item.index != row.index);
    selectedOrderOtherList.value = selectedOrderOtherList.value.filter(item => item.index != row.index);
  }
  proxy?.$modal.msgSuccess("删除成功");
}

const otherCancel = async () => {
  otherMoneyDialog.visible = false;
}
const otherMoneyHandle = async () => {
  otherForm.value = { ...initOtherFormData };
  otherForm.value.recordTime = inOrOutQuery.value.accountTime;
  otherMoneyDialog.title = "其他金额";
  otherMoneyDialog.visible = true;
  //tab切换回其他金额
  tabRadioTable.value = "其他金额";
}
//其他金额表单 全选
const selectOtherAllChangeEvent: VxeTableEvents.CheckboxAll<AccountOrderOtherVO> = ({ checked }) => {
  refreshListCheck();
}
//其他金额表单 单选
const selectOtherChangeEvent: VxeTableEvents.CheckboxChange<AccountOrderOtherVO> = ({ checked, row }) => {
  console.log(checked, row);
  refreshListCheck();
}
/** 其他金额确认按钮 */
const otherSubmitForm = () => {
  accountOrderOtherFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let accountOrderOtherVO: AccountOrderOtherVO = {
        id: otherForm.value.id,
        type: otherForm.value.type,
        createByName: nickname,
        price: otherForm.value.price,
        remark: otherForm.value.remark,
        accountOrderId: otherForm.value.accountOrderId,
        recordTime: otherForm.value.recordTime,
        index: otherForm.value.index,
        createTime : dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      }
      //修改
      if (otherForm.value.id) {
        accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
          if (item.id == otherForm.value.id) {
            return accountOrderOtherVO;
          }
          return item;
        });
      } else {
        if (otherForm.value.index) {
          console.log('111111111');
          accountOrderOtherList.value = accountOrderOtherList.value.map(item => {
            if (item.index == otherForm.value.index) {
              item.price = otherForm.value.price;
              item.remark = otherForm.value.remark;
              item.type = otherForm.value.type;
              item.recordTime = otherForm.value.recordTime;
              return item;
            }
            return item;
          });
        } else {
          console.log('2222222222');
          accountOrderOtherVO.createTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
          accountOrderOtherVO.index = Math.random();
          accountOrderOtherList.value.push(accountOrderOtherVO);
        }
      }
      if(selectedOrderOtherList.value&&selectedOrderOtherList.value.length>0){
        selectedOrderOtherList.value.map(item => {
            accountOrderOtherList.value.find(item2 => {
                if (item2.id == item.id) {
                  item= item2;
                }
            })
            return item;
        });

      }
      let otherTabProxy = otherPriceTableRef.value.xTableRef.getCheckboxRecords();
        otherTabProxy.map(tabItem => {
            accountOrderOtherList.value.find(item2 => {
                if (item2.id == tabItem.id) {
                  tabItem.price = item2.price;
                  tabItem.remark = item2.remark;
                  tabItem.type = item2.type;
                  tabItem.recordTime = item2.recordTime;
                }
            })
            return tabItem;
      });

      console.log(" addd  selectedOrderOtherList.....",selectedOrderOtherList.value)
      otherMoneyDialog.visible = false;
    }
  });
}
/** 其他金额 ********END**********/

/** 删除按钮操作 */
const handleDelete = async (row?: OrderFilinOutDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除对账单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delAccountOrderNew(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getAllList();
}

/** 导出按钮操作 */
const handleExport = () => {
  let tool_tableName = 'saleAccountToolId1';
  let queryInfo = {};
    tool_tableName = 'saleAccountToolId1';
    queryInfo = { ...accQueryParams.value, tableName: tool_tableName
  }
  proxy?.download('financial/accountOrder/export', queryInfo, `销售对账单_${new Date().getTime()}.xlsx`)
}
const getSupplierPriceList = async () => {
  const SupplierResponse: any = await listSourceHalfProcessCalcRule();
  supplierFilnPriceList.value = SupplierResponse.rows;
}
const getTaxRate = async () => {
  const res = await proxy?.getConfigKey("taxRate");
  if (res != undefined) {
    taxRate.value = Number(res.data);
    console.log(taxRate.value)
  }
}

const handleSubmitAduit = async() => {
    const _tableRef=XTableRef.value.xTableRef;
    const checkList=_tableRef.getCheckboxReserveRecords().concat(_tableRef.getCheckboxRecords());
    console.log("checkList",checkList);
    if(checkList.length == 0){
      await proxy?.$modal.msgError("请选择需要提交审核的数据");
      return;
    }
    //如果存在状态不是未提交和已审核则不能提交
    let _statusList=checkList.map((item: any) => item.status);
    if(_statusList.includes('4')||_statusList.includes('2')){
      await proxy?.$modal.msgError("存在已审核或待审核的数据，不能提交");
      return;
    }
    await proxy?.$modal.confirm('是否确认提交审核所选对账单');
    let _idList=checkList.map((item: any) => item.id);
    let detailQuery = {
      accountOrderIds: _idList,
    };

    await proxy?.$modal.loading("提交审核...");
    submitAuditOrderSale(detailQuery).then(res => {
      proxy?.$modal.msgSuccess("提交审核成功");
      getList();
    }).finally(() => { proxy?.$modal.closeLoading(); });
    _tableRef.clearCheckboxRow();
    _tableRef.clearCheckboxReserve();
}
//批量提交
const handleSubmitBatch= async() => {
    const _tableRef=XTableRef.value.xTableRef;
    const checkList=_tableRef.getCheckboxReserveRecords().concat(_tableRef.getCheckboxRecords());
    console.log("checkList",checkList);
    if(checkList.length == 0){
      await proxy?.$modal.msgError("请选择需要提交审核的数据");
      return;
    }
    //如果存在状态不是未提交和已审核则不能提交
    let _statusList=checkList.map((item: any) => item.status);
    if(_statusList.includes('4')||_statusList.includes('2')){
      await proxy?.$modal.msgError("存在已审核或待审核的数据，不能提交");
      return;
    }
    await proxy?.$modal.confirm('是否确认提交审核所选对账单');
    let _idList=checkList.map((item: any) => item.id);
    let detailQuery = {
      accountOrderIds: _idList,
    };

    await proxy?.$modal.loading("提交审核...");
    batchSubmit(detailQuery).then(res => {
      proxy?.$modal.msgSuccess("提交审核成功");
      getList();
    }).finally(() => { proxy?.$modal.closeLoading(); });
    _tableRef.clearCheckboxRow();
    _tableRef.clearCheckboxReserve();
}

//批量驳回
const batchReject= async() => {
    const _tableRef=custTableRef.value.xTableRef;
    const checkList=_tableRef.getCheckboxReserveRecords().concat(_tableRef.getCheckboxRecords());
    console.log("checkList",checkList);
    if(checkList.length == 0){
      await proxy?.$modal.msgError("请选择审核的数据");
      return;
    }
    //如果存在状态不是未提交和已审核则不能提交
    let _statusList=checkList.map((item: any) => item.status);
    if(_statusList.includes('4')||_statusList.includes('1')||_statusList.includes('3')){
      await proxy?.$modal.msgError("存在非待审核的数据，不能提交");
      return;
    }
    await proxy?.$modal.confirm('是否确认驳回所选对账单');
    let _idList=checkList.map((item: any) => item.id);
    let detailQuery = {
      accountOrderIds: _idList,
    };

    await proxy?.$modal.loading("提交审核...");
    batchAuditReject(detailQuery).then(res => {
      proxy?.$modal.msgSuccess("驳回成功");
      getWaitList();
    }).finally(() => { proxy?.$modal.closeLoading(); });
    _tableRef.clearCheckboxRow();
    _tableRef.clearCheckboxReserve();
}


//批量通过
const doBatchAudit= async() => {
    const _tableRef=custTableRef.value.xTableRef;
    const checkList=_tableRef.getCheckboxReserveRecords().concat(_tableRef.getCheckboxRecords());
    console.log("checkList",checkList);
    if(checkList.length == 0){
      await proxy?.$modal.msgError("请选择审核的数据");
      return;
    }
    //如果存在状态不是未提交和已审核则不能提交
    let _statusList=checkList.map((item: any) => item.status);
    if(_statusList.includes('4')||_statusList.includes('1')||_statusList.includes('3')){
      await proxy?.$modal.msgError("存在非待审核的数据，不能提交");
      return;
    }
    await proxy?.$modal.confirm('是否通过所选对账单');
    let _idList=checkList.map((item: any) => item.id);
    let detailQuery = {
      accountOrderIds: _idList,
    };

    await proxy?.$modal.loading("提交审核...");
    batchAudit(detailQuery).then(res => {
      proxy?.$modal.msgSuccess("审核成功");
      getWaitList();
    }).finally(() => { proxy?.$modal.closeLoading(); });
    _tableRef.clearCheckboxRow();
    _tableRef.clearCheckboxReserve();
}


const doApprovedReject= async(row:any) => {

    await proxy?.$modal.confirm('是否确认驳回已审核对账单');
    let detailQuery = {
      id: row.id,
    };

    await proxy?.$modal.loading("驳回...");
    approvedReject(detailQuery).then(res => {
      proxy?.$modal.msgSuccess("驳回成功");
      getAduitList();
      getList();
    }).finally(() => { proxy?.$modal.closeLoading(); });
}

const submitSelectableFun = (scope: any) => {
  //当前选择状态为已审核或者待，禁选
  if (scope.row.status == '4'||scope.row.status == '2') {
    return false;
  }
  return true;
}
const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerCode
        }
      });
      customerNameList.value = resCust.map(item=>{
        return {
          value:item.id,
          label:item.customerName
        }
      });
    }

  }

onMounted(() => {
  getList();
  getListCust();
  getCustomerList();
  getSupplierPriceList();
  getTaxRate();
});
</script>
<!-- <style scoped>
.el-drawer__header {
  margin-bottom: 0px !important;
}
.totalTitle{
    padding: 0px;
    margin: 0px;
    display: flex;
    justify-content: end;
    font-size: 14px;
}
</style> -->
<style lang="scss" scoped>
.el-drawer__header {
  margin-bottom: 0px !important;
}
.totalTitle{

    padding: 0px !important;
    margin: 0px !important;
    line-height: 24px !important;
    display: flex !important;
    justify-content: end !important;
    font-size: 14px !important;
    color: #0892c7 !important;
    font-weight: bold;
    margin-right: 10px;
}
:deep(.padding-drawer) {
  .el-drawer__header {
    margin-bottom: 5px;
  }
  .el-drawer__body {
    padding-top: 10px;
    padding-bottom: 10px;
    .drawer-order-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .el-card {
      .el-card__body {
        padding: 5px !important;
      }
    }
  }
  .el-drawer__footer {
    padding-bottom: 10px;
  }
}
:deep(.table-height-rows) {
  background: rgb(217, 236, 255);
}
</style>

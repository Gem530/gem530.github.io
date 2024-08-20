<template>
  <div class="p-2 xtable-page">
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
          <el-button type="primary" @click="handleExport">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" class="xtable-tab" v-model="editableTabsValue" @tab-change="radioTableHandle()">
        <el-tab-pane label="加工单列表" :name="1">
          <el-row style="width: 100%">
            <el-col :span="24" align="right">
              <!-- <div style="">已发数量：{{(tableData[0] || {}).outTotal || 0}}</div> -->
              <p class="totalTitle">已发数量：{{ tableTotal }}</p>
              <el-button type="primary" @click="handleAddOrder">新增 </el-button>
              <el-button plain @click="handleExportBefore">导出 </el-button>
            </el-col>
          </el-row>
          <XTable toolId="outsourceSourceHalfProcessOrder" height="100%" class="xtable-content"
            v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum"
            :page-params="{ perfect: true, total: total }" :data="sourceHalfProcessOrderList"
            :intervalCondition="intervalCondition" :columnList="columnList" ref="XTableRef" border :showRefresh="true"
            @searchChange="searchChange" :column-config="{ resizable: true }" @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent" :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id' }"
            :loading="loading">
            <template #default-mICode="scope">
              <span>{{ scope.row.mICode }}</span>
              <el-button link @click="doMIPrint(scope.row.planId,'noOutsideImages')">
                <el-icon>
                  <Document />
                </el-icon>
              </el-button>
            </template>
        <template #default-businessType="{ row }">
          <!-- <div>{{ typeOptions.find(v => v.value == row.businessType)?.label }}</div> -->
          <el-tag  :type="row.businessType=='1'?'danger':'success'">{{ typeOptions.find(v => v.value == row.businessType)?.label }}</el-tag>
        </template>
        <template #default-unit="{ row }">
          <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
        </template>
        <template #default-prodQuantity="{ row }">
          <div>{{ row.prodQuantity?Number(row.prodQuantity).toFixed(0):0 }}</div>
        </template>
        <template #default-sendQuantity="{ row }">
          <div>{{ row.sendQuantity?Number(row.sendQuantity).toFixed(0):0 }}</div>
        </template>
        <template #default-waitQuantity="{ row }">
          <div>{{ row.waitQuantity?Number(row.waitQuantity).toFixed(0):0 }}</div>
        </template>
        <template #default-quantity="{ row }">
          <div>{{ row.quantity?Number(row.quantity).toFixed(2):0 }}</div>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" v-show="wxhSwitch && scope.row.quantity-scope.row.sendQuantity > 0
                  && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">结单</el-button>
          <el-button link type="primary" @click="doPrint(scope.row)">打印 </el-button>
          <el-button link type="primary" v-show="scope.row.isReceive != '1' && scope.row.isConfirmed == '0'" @click="handleUpdate(scope.row)" >编辑
          </el-button>
          <el-button link type="primary" v-show="scope.row.isReceive != '1' && scope.row.isConfirmed == '0'" @click="handleDelete(scope.row)"  v-if="checkPermi(['outsource:halfProcess:del'])">删除
          </el-button>
          <el-button link type="primary" v-show="scope.row.isReceive != '1'&&scope.row.businessType=='0'&&Number(scope.row.waitReworkQuantity)>0" @click="handleRework(scope.row)" >
            返工
          </el-button>
              <!-- <el-button link type="primary" @click="handleSelect(scope.row)"
                         >详情
              </el-button> -->
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="加工单待确认列表" :name="2" v-if="wxhSwitch">
          <el-row style="width: 100%">
            <el-col :span="24" align="right">
              <el-button plain @click="handleExportBefore">导出 </el-button>
            </el-col>
          </el-row>
          <XTable toolId="outsourceSourceHalfProcessOrder2" height="100%" class="xtable-content"
                  v-model:page-size="waitQueryParams.pageSize" v-model:current-page="waitQueryParams.pageNum"
                  :page-params="{ perfect: true, total: total }" :data="sourceHalfProcessOrderList"
                  :intervalCondition="intervalCondition" :columnList="columnList2" ref="XTableRef" border :showRefresh="true"
                  @searchChange="searchChange" :column-config="{ resizable: true }" @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent" :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id' }"
                  :loading="loading">
            <template #default-unit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
            </template>
            <template #default-prodQuantity="{ row }">
              <div>{{ row.prodQuantity?Number(row.prodQuantity).toFixed(0):0 }}</div>
            </template>
            <template #default-sendQuantity="{ row }">
              <div>{{ row.sendQuantity?Number(row.sendQuantity).toFixed(0):0 }}</div>
            </template>
            <template #default-waitQuantity="{ row }">
              <div>{{ row.waitQuantity?Number(row.waitQuantity).toFixed(0):0 }}</div>
            </template>
            <template #default-quantity="{ row }">
              <div>{{ row.quantity?Number(row.quantity).toFixed(2):0 }}</div>
            </template>
            <template #default-confirmStatus="scope">
              <div v-for="item in confirmStatusOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.quantity-scope.row.sendQuantity > 0 && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">
                结单</el-button>
              <el-button link type="primary" v-show="scope.row.confirmStatus == '1'" @click="handleConfirm(scope.row)">确认</el-button>
              <el-button link type="primary" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row.id)">确认记录</el-button>
              <el-button link type="primary" @click="doPrint(scope.row)">打印 </el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="加工单已确认列表" :name="3" v-if="wxhSwitch">
          <el-row style="width: 100%">
            <el-col :span="24" align="right">
              <el-button plain @click="handleExportBefore">导出 </el-button>
            </el-col>
          </el-row>
          <XTable toolId="outsourceSourceHalfProcessOrder3" height="100%" class="xtable-content"
                  v-model:page-size="confirmQueryParams.pageSize" v-model:current-page="confirmQueryParams.pageNum"
                  :page-params="{ perfect: true, total: total }" :data="sourceHalfProcessOrderList"
                  :intervalCondition="intervalCondition" :columnList="columnList3" ref="XTableRef" border :showRefresh="true"
                  @searchChange="searchChange" :column-config="{ resizable: true }" @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent" :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id' }"
                  :loading="loading">
            <template #default-unit="{ row }">
              <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
            </template>
            <template #default-prodQuantity="{ row }">
              <div>{{ row.prodQuantity?Number(row.prodQuantity).toFixed(0):0 }}</div>
            </template>
            <template #default-sendQuantity="{ row }">
              <div>{{ row.sendQuantity?Number(row.sendQuantity).toFixed(0):0 }}</div>
            </template>
            <template #default-waitQuantity="{ row }">
              <div>{{ row.waitQuantity?Number(row.waitQuantity).toFixed(0):0 }}</div>
            </template>
            <template #default-quantity="{ row }">
              <div>{{ row.quantity?Number(row.quantity).toFixed(2):0 }}</div>
            </template>
            <template #default-confirmStatus="scope">
              <div v-for="item in confirmStatusOptions">
                <el-tag :type="item.type" size="small" v-if="item.value === scope.row.confirmStatus">{{item.label}}</el-tag>
              </div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" v-show="scope.row.confirmStatus == '3'" @click="handleCancel(scope.row)">取消</el-button>
              <el-button link type="primary" v-show="scope.row.quantity-scope.row.sendQuantity > 0 && scope.row.detailStatus === '1'" @click="handleStatement(scope.row)">
                结单</el-button>
              <el-button link type="primary" @click="handleUpload(scope.row)">上传附件</el-button>
              <el-button link type="primary" @click="handleRecord(scope.row.id)">确认记录</el-button>
              <el-button link type="primary" @click="doPrint(scope.row)">打印 </el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加或修改外协加工订单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px">
      <el-form ref="sourceHalfProcessOrderFormRef" :disabled="dialog.title?.includes('详情')" :model="form" :rules="rules"
        label-width="80px" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编号" prop="planId">
              <el-select v-if="dialog.title?.includes('添加')" v-model="form.commodityId" placeholder="请选择产品编码" filterable
                @change="commodityChange">
                <el-option v-for="item in commodityVoList" :key="item.commodityId" :label="item.commodityCode"
                  :value="item.commodityId" />
              </el-select>
              <el-input v-if="!dialog.title?.includes('添加')" v-model="form.commodityCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排产单号" prop="productionId">
              <el-select v-if="dialog.title?.includes('添加')" v-model="form.productionId" placeholder="请选择排产单号" filterable
                @change="productionChange">
                <el-option v-for="item in productionList" :key="item.id" :label="item.productionCode"
                  :value="item.productionId" />
              </el-select>
              <el-input v-if="!dialog.title?.includes('添加')" v-model="form.productionCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工工序" prop="craftId">
              <el-select v-if="dialog.title?.includes('添加')" v-model="form.craftId" placeholder="请选择加工工序"
                @change="craftChange">
                <el-option v-for="item in nodeList" :key="item.id" :label="item.craftName" :value="item.craftId" />
              </el-select>
              <el-input v-if="!dialog.title?.includes('添加')" v-model="form.craftName" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item v-show="unitSchemeShow" label="外发单位" prop="unit">
              <el-radio-group :disabled="unitCheck" v-model="form.unit" @change="unitChange">
                <el-radio v-for="unit in unitList" :key="unit.unit" :label="unit.unit" :disabled="unit.disabled">{{
                  unit.unitName }}{{ unit.disabled }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24"></el-col>
          <el-col :span="24">
            <el-form-item v-show="typeShow" label="外发类型" prop="type" @change="typeChange">
              <el-radio-group v-model="form.type" :disabled="!dialog.title?.includes('添加')&&!dialog.title?.includes('返工')">
                <el-radio v-for="type in typeList" :key="type.id" :label="type.id">{{ type.typeName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="加工数量" prop="quantity">
              <el-input type="number" :max="form.maxQuantity" v-model="form.quantity" placeholder="请输入加工数量">
                <template #append>{{ form.maxQuantity }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="长" prop="length">
              <el-input-number :controls="false" type="number" v-model="form.length" :precision="2"> </el-input-number>
              <el-button>mm</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宽" prop="width">
              <el-input-number :controls="false" type="number" v-model="form.width" :precision="2"> </el-input-number>
              <el-button>mm</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加工要求">
              <el-input v-model="form.requirement"  type="textarea" :rows="5"
                placeholder="加工要求" maxlength="200" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="3"  maxlength="2000" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button v-show="dialog.title?.includes('添加')" :loading="buttonLoading" type="primary" @click="submitForm">确 定
          </el-button>
          <el-button v-show="dialog.title?.includes('返工')" :loading="buttonLoading" type="primary" @click="submitReworkForm">确 定 </el-button>
          <el-button v-show="dialog.title?.includes('修改')" :loading="buttonLoading" type="primary"
            @click="submitEditForm">确 定 </el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer :title="drawer.title" v-model="drawer.visible" size="80%">
      <el-card class="mb8">
        <XTable :pageShow="false" ref="confirmTable" :data="halfOrderList" border :columnList="orderColumnList" class="mb8">
          <template #default-make="scope">
            <el-button v-if="!drawer.title?.includes('详情') || drawer.title?.includes('审核')" link type="primary"
              @click="handleDeleteForm(scope.row)">删除
            </el-button>
          </template>
          <template #default-unit="{ row }">
            <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
          </template>
        </XTable>
        <el-row>
          <el-button type="primary" plain v-show="!(drawer.title?.includes('详情') || drawer.title?.includes('审核'))"
            @click="handleAdd">新增记录
          </el-button>
        </el-row>
      </el-card>

      <el-card>
        <el-form :model="form" ref="orderFormRef" :rules="rules"
          :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="供应商名称：" :label-width="formLabelWidth" prop="supplierId">
                <el-select v-model="form.supplierId" placeholder="请选择供应商"  style="width: 100%" @change="supplierChange" filterable>
                  <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="下单时间:" :label-width="formLabelWidth">
                <span v-if="!(drawer.title?.includes('审核') || drawer.title?.includes('详情'))">{{ currentTime }}</span>
                <span v-else>{{ form.placeOrderTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="收货地址:" :label-width="formLabelWidth" prop="addressId">
                <el-select v-model="form.addressId" :collapse-tags="true"  style="width: 100%" filterable placeholder="请选择地址">
                  <el-option v-for="item in addressList"
                  :key="item.id"
                  :disabled="item.status==0"
                  :label="`${item.status==0?'(已禁用)-':''}${item.address}`"
                  :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="drawerCancel">取消</el-button>
            <el-button v-if="!(drawer.title?.includes('详情') || drawer.title?.includes('审核'))" :loading="buttonLoading"
              type="primary" @click="submitAddForm">确 定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 工序外协订单确认 -->
    <el-drawer :title="confirmDrawer.title" v-model="confirmDrawer.visible" size="70%" destroy-on-close>
      <el-card shadow="never" class="ptable-card">
        <el-form :model="form" ref="backFormRef" :rules="rules">
          <el-row>
            <el-col :span="7">
              <el-form-item label="供应商名称："  prop="supplierName">
                <el-input v-model="form.supplierName" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="下单时间:" label-width="100px">
                <el-input v-model="form.createTime" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="收货地址:" label-width="100px">
                <el-select v-model="form.addressId" :collapse-tags="true" :disabled="true" style="width: 100%" filterable placeholder="请选择地址">
                  <el-option v-for="item in addressList"
                             :key="item.id"
                             :disabled="item.status==0"
                             :label="`${item.status==0?'(已禁用)-':''}${item.address}`"
                             :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="24">
                <el-form-item label="确认备注：">
                  <el-input v-model="form.confirmRemark" type="textarea" :rows="2"  maxlength="2000"
                            placeholder="请输入备注"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
        </el-form>

        <XTable :pageShow="false" ref="confirmOrderTable" :edit-rules="validRules" :data="halfOrderList" border :columnList="orderColumnList2" :loading="tableLoading">
          <template #default-unit="{ row }">
            <div>{{ unitOptions.find(v => v.value == row.unit)?.label }}</div>
          </template>
          <template #default-quantity="scope">
            <el-input-number style="width: 100%; text-align: left;" :controls="false" :precision="scope.row.unit == '1' ? 2 : 0" :min="0" :max="scope.row.maxQuantity" v-model="scope.row.quantity"   maxLength="11"
            />
          </template>
          <template #default-length="scope">
            <el-input-number :controls="false" type="number" :min="0" v-model="scope.row.length" :precision="2" style="width: 99%;" />
          </template>
          <template #default-width="scope">
            <el-input-number :controls="false" type="number" :min="0" v-model="scope.row.width" :precision="2" style="width: 99%;" />
          </template>
        </XTable>

      </el-card>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="confirmDrawer.visible=false">取 消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitConfrim">确 定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 结单对话框 -->
    <el-dialog v-model="statement.visible" :title="statement.title" width="30%" align-center destroy-on-close>
      <el-row>
        <el-col :span="24">
          <el-form ref="detailOrderFormRef" :model="detailForm" :rules="detailRules" label-width="80px">
            <el-form-item :label="statement.describe" prop="confirmRemark">
              <el-input v-model="detailForm.confirmRemark" maxLength="2000" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="id" prop="id" v-show="false">
              <el-input v-model="detailForm.id"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statementVisible = false">取消</el-button>
          <el-button v-if="statement.title === '申请结单'" type="primary" @click="statementAccount">确认</el-button>
          <el-button v-if="statement.title === '申请取消'" type="primary" @click="cancelAccount">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文件上传 -->
    <ContractFileDialog v-if="uploadVisible" v-model:show="uploadVisible" :moduleCode="moduleCode"
                        :bizType="bizType" :id="fileId" :biz-code="bizCode"/>
    <!-- 操作记录 -->
    <ConfirmRecordDialog v-if="recordVisible" v-model:show="recordVisible" :id="recordId" />

    <!-- MI -->
    <MIPrint ref="MIPrintRef"></MIPrint>

    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <div v-if="outSourceInfo">
      <div style="display: none; width: 600pt !important;padding-right:5pt;" ref="cardRef">
        <div style="width:100%;text-align:center;font-size:10pt;">
          <div style="font-size:18pt; font-weight:bold;">{{ outSourceInfo.enterpriseName }}</div>
          <div style="font-size:14pt;padding-top:5pt">{{ outSourceInfo.enterpriseEName }}</div>
          <div style="">工厂地址：{{ outSourceInfo.enterpriseAddress }}&nbsp;&nbsp;电话：{{ outSourceInfo.enterprisePhoneNumber }}
          </div>
          <div style="font-size:16pt;font-weight:600;">委&nbsp;外&nbsp;加&nbsp;工&nbsp;单</div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div style="">供应商名称：{{ outSourceInfo.supplierName }}</div>
            <div style="width:170pt;text-align:left;">出货单号：{{ outSourceInfo.code }}</div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div style="text-align:left;width:400pt;">供应商地址：{{ outSourceInfo.supplierAddress }}</div>
            <div style="width:170pt;text-align:left;">出货日期：{{ parseTime(outSourceInfo.createTime, '{y}-{m}-{d}') }}</div>
          </div>
        </div>
        <div style="min-height:200pt">
          <!--默认打印模板-->
          <table style="border-collapse: collapse; border: none;width:100%;">
            <thead>
              <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 20pt;">序号</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 90pt;">本厂编号</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 80pt;">排产单号</th>
                <!-- <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 80pt;">MI单号</th> -->
                <th colspan="2" style="border: solid #000 1px;font-weight: normal;width: 40pt;">规格</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 60pt;">加工工序</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 35pt;">数量</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 25pt;  ">单位</th>
                <th rowspan="2" style="border: solid #000 1px; font-weight: normal;">加工要求</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 70pt;">备注</th>
              </tr>
              <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
                <th style="border: solid #000 1px;font-weight: normal;width: 30pt;">长</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 30pt;">宽</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in outSourceInfo.outSourceOrderTableData">
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ index + 1 }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.commodityCode }}
                </td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.productionCode }}
                </td>
                <!-- <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.productionPlanCode }}
                </td> -->
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 7pt; padding: 0px; text-align: center">
                  {{ item.length }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 7pt; padding: 0px; text-align: center">
                  {{ item.width }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.craftName }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 7pt; padding: 0px; text-align: center">
                  {{ item.quantity?Number(item.quantity).toFixed(0):0}}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.unitDesc }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.requirement }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.remark }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="9"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style="width:100%;font-size:10pt;">
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>发货人：{{ outSourceInfo.printUserName }}</div>
            <div>核对：</div>
            <div style="width: 200pt; text-align: left;">&nbsp;&nbsp;客&nbsp;&nbsp;户&nbsp;&nbsp;签&nbsp;&nbsp;收：</div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>日&nbsp;&nbsp;&nbsp;&nbsp;期：{{ parseTime(outSourceInfo.createTime, '{y}-{m}-{d}') }}</div>
            <div style="width: 200pt;text-align:left;">（请使用正楷签名）</div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>第一联存根(白) 第二联客户(红) 第三联回单(黄) 第四销售(绿)</div>
            <div style="width: 200pt; text-align: left;">&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;期：</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="SourceHalfProcessOrder" lang="ts">
import {
  listSourceHalfProcessOrder,
  getSourceHalfProcessOrderIssuedQuantity,
  getProductionInfo,
  getUnitList,
  getReworkAllUnitList,
  listSourceHalfCommodityList,
  listSourceHalfNodeList,
  listSourceHalfReduceNodeList,
  getProductionCuttingMaterialInfo,
  getSourceHalfProcessOrder,
  getPrintSourceHalfProcessOrder,
  delSourceHalfProcessOrder,
  addSourceHalfProcessOrder,
  updateSourceHalfProcessOrder,
  confirmSourceHalfProcessOrder,
  supplierOrderDetail,
  compareList,
  sourceHalfStatementDetail, sourceHalfCancelOrder
} from '@/api/outsource/sourceHalfProcessOrder';
import {
  SourceHalfProcessOrderVO,
  SourceHalfProcessOrderQuery,
  SourceHalfProcessOrderForm,
  ReduceCraftNameENUM,
  ReduceReqNameENUM,
  ReduceCodeENUM
} from '@/api/outsource/sourceHalfProcessOrder/types';
  import {checkPermi} from "@/utils/permission";
import { VxeTableEvents, VxeTablePropTypes, v } from 'vxe-table';

const wxhSwitch = ref(import.meta.env.VITE_WXH_SWITCH === 'true');

const exportVisible = ref(false);
const outSourceInfo = ref<any>();
const cardRef = ref();
const tableTotal = ref(0);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dialogTableLoading = ref(false)
const editableTabsValue = ref(1);
const confirmStatusOptions = ref([
  { type:"warning", label: '待确认', value: "1" },
  { type:"primary", label: '待对方确认', value: "2" },
  { type:"success", label: '已确认', value: "3" }
]);
const confirmStatusOptions2 = ref([
  { label: '待对方确认', value: "2" },
  { label: '已确认', value: "3" }
]);

// 查询操作记录
const recordId = ref();
const recordVisible = ref(false);
const uploadVisible = ref(false);
// 文件上传类型
const moduleCode = ref('3');
const bizType = ref('15');
const fileId = ref<string | number>();
const bizCode = ref<string>();

const sourceHalfProcessOrderList = ref<SourceHalfProcessOrderVO[]>([]);
const productionList = ref<SourceHalfProcessOrderVO[]>([]);
const nodeList = ref<any[]>([]);
const planSchemeList = ref<any[]>([]);
const planPnlList = ref<any[]>([]);
const planCommodityList = ref<any[]>([]);
const halfOrderList = ref<SourceHalfProcessOrderForm[]>([]);

const buttonLoading = ref(false);
const productionCardShowFlag = ref(false);

const typeSetShow = ref(false);
const typePnlShow = ref(false);
const typeShow = ref(false);
const unitSchemeShow = ref(false);
const unitCheck = ref(true);
const loading = ref(true);
const tableLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const orderFormRef = ref<ElFormInstance>();
const formLabelWidth = '140px'
const queryFormRef = ref<ElFormInstance>();
const sourceHalfProcessOrderFormRef = ref<ElFormInstance>();
const typeList = ref<any>([]);
const reduceList = ref<any>(
  {
    pnlList: [],
    setList: [],
    remarkList: []
  }
);
const confirmOrderTable = ref();
const reduceVal = ref(0);
const reduceRemark = ref("");
const nodeRequirement = ref<any>([]);
const pro_boardThickness = ref();

const unitOptions = ref([
  { value: "1", label: "大料" },
  { value: "2", label: "PNL" },
  { value: "3", label: "SET" },
])

const productionCardOptions = ref([
  { value: "100", label: "流转卡1" },
  { value: "200", label: "流转卡2" },
  { value: "300", label: "流转卡3" },
  { value: "400", label: "流转卡4" },
  { value: "500", label: "流转卡5" },
  { value: "600", label: "流转卡6" },
  { value: "700", label: "流转卡7" },
  { value: "800", label: "流转卡8" },
  { value: "900", label: "流转卡9" },
])
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const drawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const confirmDrawer = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: SourceHalfProcessOrderForm = {
  id: undefined,
  supplierId: undefined,
  price: undefined,
  totalPrice: undefined,
  addressId: undefined,
  remark: undefined,
  code: undefined,
  receiveQuantity: undefined,
  quantity: undefined,
  length: undefined,
  width: undefined,
  placeOrderTime: undefined,
  completeTime: undefined,
  ownerId: undefined,
  unit: undefined,
  planId: undefined,
  productionCardId: undefined,
  productionId: undefined,
  productionCode: undefined,
  craftId: undefined,
  commodityId: undefined,
  type: undefined,
  requirement: undefined,
  quantity: undefined,
  length: undefined,
  width: undefined,
  confirmRemark: undefined,
}
const checkQuantity = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入加工数量'))
  }
  if (value <= 0) {
    return callback(new Error('请输入大于0的数字'))
  }
  if (['2','3'].includes(form.value.unit) && !/^[0-9]\d*$/.test(Number(value))) {
    return callback(new Error('请输入整数'))
  }
  if (!/^(0|[1-9]\d{0,5})(\.\d{0,2})?$/.test(value)) {
    return callback(new Error('请输入合理的数据'))
  }

  if (form.value.maxQuantity) {
    if (Number(value) > Number(form.value.maxQuantity)) {
      return callback(new Error('请输入不大于' + form.value.maxQuantity + '的数字'))
    } else {
      return callback()
    }
  }

}
const data = reactive<PageData<SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    price: undefined,
    totalPrice: undefined,
    addressId: undefined,
    code: undefined,
    receiveQuantity: undefined,
    placeOrderTime: undefined,
    completeTime: undefined,
    ownerId: undefined,
    unit: undefined,
    productionCardId: undefined,
    productionId: undefined,
    craftId: undefined,
    commodityId: undefined,
    type: undefined,
    requirement: undefined,
    quantity: undefined,
    length: undefined,
    width: undefined,

    params: {}
  },
  rules: {

    supplierId: [
      { required: true, message: "请选择供应商", trigger: "blur" }
    ],

    addressId: [
      { required: true, message: "请选择收货地址", trigger: "blur" }
    ],

    unit: [
      { required: true, message: "请选择外发单位", trigger: "blur" }
    ],
    productionId: [
      { required: true, message: "请选择排产单号", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "请选择加工工序", trigger: "blur" }
    ],

    type: [
      { required: true, message: "外发类型不能为空", trigger: "change" }
    ],
    quantity: [
      { validator: checkQuantity, trigger: "blur" }
    ],
    length: [
      { required: true, message: "长度不能为空", trigger: "blur" }
    ],
    width: [
      { required: true, message: "宽度不能为空", trigger: "blur" }
    ]
  }
});

const waitData = reactive<PageData<SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    price: undefined,
    totalPrice: undefined,
    addressId: undefined,
    code: undefined,
    receiveQuantity: undefined,
    placeOrderTime: undefined,
    completeTime: undefined,
    ownerId: undefined,
    unit: undefined,
    productionCardId: undefined,
    productionId: undefined,
    craftId: undefined,
    commodityId: undefined,
    type: undefined,
    requirement: undefined,
    quantity: undefined,
    length: undefined,
    width: undefined,
    confirmStatus: '1',
    params: {}
  },
  rules: {}
});

const confirmData = reactive<PageData<SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    supplierId: undefined,
    price: undefined,
    totalPrice: undefined,
    addressId: undefined,
    code: undefined,
    receiveQuantity: undefined,
    placeOrderTime: undefined,
    completeTime: undefined,
    ownerId: undefined,
    unit: undefined,
    productionCardId: undefined,
    productionId: undefined,
    craftId: undefined,
    commodityId: undefined,
    type: undefined,
    requirement: undefined,
    quantity: undefined,
    length: undefined,
    width: undefined,
    confirmStatusList: ['2','3'],
    params: {}
  },
  rules: {}
});

const detailData = reactive<PageData<SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery>>({
  form: { ...initFormData },
  queryParams: {},
  rules: {
    confirmRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});
const {form : detailForm, rules: detailRules } = toRefs(detailData);

const XTableRef = ref()

const intervalCondition = ['placeOrderTime'];


const typeOptions = ref([
  { value: "0", label: "正常" },
  { value: "1", label: "返工" },
])
const columnList = ref([

  { title: "序号",field: 'seq', type: 'seq', align: 'center', fixed: 'left', width: '60' },
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入外协单号' }
  },
  {
    title: '排产单号',
    width: '140',
    field: 'productionCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入排产单号' }
  },
  {
    title: 'MI单号',
    width: '100',
    field: 'mICode',
    align: 'center',
    fixed: 'left',
    filterType: 'input'
  },
  {
    title: '产品编码',
    width: '120',
    field: 'commodityCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入产品编码' }
  },
  {
    title: '下单时间', width: '140', fixed: 'left', field: 'placeOrderTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    title: '供应商',
    width: '180',
    field: 'supplierName',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入供应商名称' }
  },
  {
    title: '加工工序', width: '100', field: 'craftName', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入加工工序' }
  },
  { title: '排产数量', width: '100', field: 'prodQuantity', align: 'center', },
  { title: '已发数量', width: '100', field: 'sendQuantity', align: 'center', },
  { title: '待发数量', width: '100', field: 'waitQuantity', align: 'center', },
  { title: '本单数量', width: '100', field: 'quantity', align: 'center', },
  { title: '返工数量', width: '100', field: 'reworkQuantity', align: 'center', },
  { title: '加工类型', width: '60', field: 'businessType', align: 'center', },
  { title: '长', width: '100', field: 'length', align: 'center', },
  { title: '宽', width: '100', field: 'width', align: 'center', },
  { title: '外发单位', width: '100', field: 'unit', align: 'center', },
  { title: '外发类型', width: '100', field: 'typeName', align: 'center', },
  { title: '加工要求', width: '100', field: 'requirement', align: 'center', },
  { title: '备注', width: '100', field: 'remark', align: 'center', },
  { title: '表面处理类型', width: '100', field: 'surfaceTreatment', align: 'center', },
  {
    title: '下单人', width: '100', field: 'createByName', align: 'center', fixed: 'right', filterType: 'input',
    filterParam: { placeholder: '请输入下单人' }
  },

  { title: '操作', field: 'make', align: 'center', width: '200', fixed: 'right', },

]);

const columnList2 = ref([
  { title: "序号",field: 'seq', type: 'seq', align: 'center', fixed: 'left', width: '60' },
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入外协单号' }
  },
  {
    title: '排产单号',
    width: '140',
    field: 'productionCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入排产单号' }
  },
  {
    title: '产品编码',
    width: '120',
    field: 'commodityCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入产品编码' }
  },
  {
    title: '下单时间', width: '140', fixed: 'left', field: 'placeOrderTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    title: '供应商',
    width: '180',
    field: 'supplierName',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入供应商名称' }
  },
  {
    title: '加工工序', width: '100', field: 'craftName', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入加工工序' }
  },
  { title: '排产数量', width: '100', field: 'prodQuantity', align: 'center', },
  { title: '已发数量', width: '100', field: 'sendQuantity', align: 'center', },
  { title: '待发数量', width: '100', field: 'waitQuantity', align: 'center', },
  { title: '本单数量', width: '100', field: 'quantity', align: 'center', },
  { title: '长', width: '100', field: 'length', align: 'center', },
  { title: '宽', width: '100', field: 'width', align: 'center', },
  { title: '外发单位', width: '100', field: 'unit', align: 'center', },
  { title: '外发类型', width: '100', field: 'typeName', align: 'center', },
  { title: '加工要求', width: '100', field: 'requirement', align: 'center', },
  { title: '备注', width: '100', field: 'remark', align: 'center', },
  {
    title: '下单人', width: '100', field: 'createByName', align: 'center', fixed: 'right', filterType: 'input',
    filterParam: { placeholder: '请输入下单人' }
  },
  { title: '状态', width: '80', field: 'confirmStatus', align: 'center', fixed: 'right',},
  { title: '操作', field: 'make', align: 'center', width: '190', fixed: 'right', },
]);

const columnList3 = ref([

  { title: "序号",field: 'seq', type: 'seq', align: 'center', fixed: 'left', width: '60' },
  {
    title: '外协单号',
    width: '140',
    field: 'code',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入外协单号' }
  },
  {
    title: '排产单号',
    width: '140',
    field: 'productionCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入排产单号' }
  },
  {
    title: '产品编码',
    width: '120',
    field: 'commodityCode',
    align: 'center',
    fixed: 'left',
    filterType: 'input',
    filterParam: { placeholder: '请输入产品编码' }
  },
  {
    title: '下单时间', width: '140', fixed: 'left', field: 'placeOrderTime', align: 'center', filterType: 'intervalDate', filterParam: {
      startParams: { placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  {
    title: '供应商',
    width: '180',
    field: 'supplierName',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入供应商名称' }
  },
  {
    title: '加工工序', width: '100', field: 'craftName', align: 'center', filterType: 'input',
    filterParam: { placeholder: '请输入加工工序' }
  },
  { title: '排产数量', width: '100', field: 'prodQuantity', align: 'center', },
  { title: '已发数量', width: '100', field: 'sendQuantity', align: 'center', },
  { title: '待发数量', width: '100', field: 'waitQuantity', align: 'center', },
  { title: '本单数量', width: '100', field: 'quantity', align: 'center', },
  { title: '长', width: '100', field: 'length', align: 'center', },
  { title: '宽', width: '100', field: 'width', align: 'center', },
  { title: '外发单位', width: '100', field: 'unit', align: 'center', },
  { title: '外发类型', width: '100', field: 'typeName', align: 'center', },
  { title: '加工要求', width: '100', field: 'requirement', align: 'center', },
  { title: '备注', width: '100', field: 'remark', align: 'center', },
  {
    title: '下单人', width: '100', field: 'createByName', align: 'center', fixed: 'right', filterType: 'input',
    filterParam: { placeholder: '请输入下单人' }
  },
  { title: '状态', width: '80', field: 'confirmStatus', align: 'center', fixed: 'right',filterType: 'radioButton',
    filterData: () => confirmStatusOptions2.value, filterCustom: {label: 'label', value: 'value'}},
  { title: '接单人', width: '80', field: 'takeOrderUserName', align: 'center', fixed: 'right',},
  { title: '接单时间', width: '80', field: 'takeOrderTime', align: 'center', fixed: 'right',},
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);
const orderColumnList = ref([

  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '排产单号', width: '100', field: 'productionCode', align: 'center' },
  { title: '产品编码', width: '100', field: 'commodityCode', align: 'center', },
  { title: '加工工序', width: '100', field: 'craftName', align: 'center', },
  { title: '加工数量', width: '100', field: 'quantity', align: 'center', },
  { title: '长', width: '100', field: 'length', align: 'center', },
  { title: '宽', width: '100', field: 'width', align: 'center', },
  { title: '外协单位', width: '100', field: 'unit', align: 'center', },
  { title: '加工类型', width: '100', field: 'typeName', align: 'center', },
  { title: '加工要求', field: 'requirement', align: 'center', },
  { title: '备注', width: '100', field: 'remark', align: 'center', },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);
const orderColumnList2 = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '排产单号', width: '100', field: 'productionCode', align: 'center' },
  { title: '产品编码', width: '100', field: 'commodityCode', align: 'center', },
  { title: '加工工序', width: '100', field: 'craftName', align: 'center', },
  { title: '加工数量', width: '90', field: 'quantity', align: 'center', },
  { title: '最大可修改数量', width: '100', field: 'maxQuantity', align: 'center', },
  { title: '长', width: '90', field: 'length', align: 'center', },
  { title: '宽', width: '90', field: 'width', align: 'center', },
  { title: '外协单位', width: '80', field: 'unit', align: 'center', },
  { title: '加工类型', width: '80', field: 'typeName', align: 'center', },
  { title: '加工要求', field: 'requirement', align: 'center', },
  { title: '备注', width: '80', field: 'remark', align: 'center', },
]);

const checkedSourceHalfProcessOrderList = ref<SourceHalfProcessOrderVO[]>([]);

const { queryParams, form, rules } = toRefs(data);
const {queryParams: waitQueryParams} = toRefs(waitData);
const {queryParams: confirmQueryParams} = toRefs(confirmData);

const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceHalfProcessOrderVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedSourceHalfProcessOrderList.value = selectRecords.map(item => item);
  }
}

// 切换菜单栏
const radioTableHandle = async () => {

  if (editableTabsValue.value == 1) {
    await getList();
  }else if(editableTabsValue.value == 2){
    await getWaitList();
  }else{
    await getConfirmList();
  }
}

// 获取 搜索条件
const commodityChange = (commodityId: any) => {
  unitSchemeShow.value = false;
  cancelAll();
  //将
  // const commodity = commodityVoList.value.find(item => item.planId == form.value.planId);
  // if (!commodity) {
  //   return;
  // }
  // form.value.commodityCode = commodity.commodityCode;
  // productionList.value = commodity.planProductionList
  // form.value.productionId = undefined;
  const commodity = commodityVoList.value.find(item => item.commodityId == commodityId);
  if (!commodity) {
    return;
  }
  form.value.commodityCode = commodity.commodityCode;
  const proItem = proList.value.filter(item => commodity.planList.includes(item.planId));
  let detailList = proItem.reduce((acc, item) => acc.concat(item.planProductionList), []);
  let uniqueDetailList = Array.from(new Set(detailList));
  productionList.value = uniqueDetailList;
  form.value.productionId = undefined;

}
const unitList = ref<any>([])


// 获取 搜索条件
const productionChange = () => {
  unitSchemeShow.value = false;
  cancelCraft();
  cancelType();
  if (!form.value.productionId) {
    return;
  }

  productionList.value.forEach(item => {
    if (item.productionId == form.value.productionId) {
      form.value.productionCode = item.productionCode;
    }
  });
  listSourceHalfNodeList(form.value.productionId).then(res => {
    nodeList.value = res.data
  });
  //外协加工扣减规则
  listSourceHalfReduceNodeList(form.value.productionId).then(res => {
    setReduce(res.data);
  });
  getProductionCuttingMaterialInfo({id:form.value.productionId}).then((res:any) => {
    pro_boardThickness.value = res.data;
  });
}
const setReduce = (_list: any[]) => {
  reduceList.value.pnlList = _list.filter(item => item.code.includes("PNL")).map(info => {
    return geTenantVal(info);
  });
  reduceList.value.setList = _list.filter(item => item.code.includes("SET")).map(info => {
    return geTenantVal(info);
  });
  reduceList.value.remarkList = _list.filter(item => item.code == "GX_OUT_BM_PX").map(info => {
    return geTenantVal(info);
  });
};
const geTenantVal = (info: any) => {
  if (info.type == '1' || info.type == '3' || info.type == '4' || info.type == '5') {
    info.values = info.values ? info.values[0] : "";
    info.defaultValue = info.defaultValue ? info.defaultValue[0] : "";
  }
  if (info.type == '8') {
    info.values = Number(info.values ? info.values[0] : 0);
    info.defaultValue = Number(info.defaultValue ? info.defaultValue[0] : 0);
  }
  info.value = info.values ? info.values : info.defaultValue;
  return info;
};

const footerMethod: VxeTablePropTypes.FooterMethod<SourceHalfProcessOrderVO> = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "quantity") {
        return `${sumNum(data, "quantity").toFixed(4)} `;
      }
      return "";
    })
  ];
};

const sumNum = (list: QuotationVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    count += Number(item[field]);
  });
  return count;
};
// 获取 搜索条件
const craftChange = async () => {
  console.log("craftChange...")
  cancelType();
  if (!form.value.craftId) {
    return;
  }
  unitCheck.value = false;

  let node = nodeList.value.find(item => item.craftId == form.value.craftId);
  if (!node) {
    return;
  }
  await getUnitList({ productionId: form.value.productionId, craftId: form.value.craftId }).then(res => {
    unitList.value = res.data.unitList;
    unitSchemeShow.value = true;
  });

  //判断halfOrderList是否有数据
  if (halfOrderList.value.length > 0) {
    //判断form的productionId相同与craftId相同的数据是否存在
    let halfOrder = halfOrderList.value.find(item => item.productionId == form.value.productionId && item.craftId == form.value.craftId);
    if (halfOrder) {
      //遍历halfOrderList

      //将unitList中与item.unit不相同的数据disabled设置为true
      unitList.value.forEach(unit => {
        if (unit.unit != halfOrder.unit) {
          unit.disabled = true;
        }
      });

    }
  }

  form.value.craftName = node.craftName;
  form.value.requirementJson = node.requirement;
  // console.log("node.requirement", form.value.requirementJson)
  let nodeInfoList = node.requirement
  nodeRequirement.value = nodeInfoList;


  let requirement = "";
  // if(nodeInfoList){
  // let index =1;
  // nodeInfoList.forEach((item:any)=>{
  //    requirement +=index+"."+ item.name +":"+item.defaultValue+" ";
  //     index++;
  //   });
  // }

  if (node.requirement) {
    console.log("node.requirement", node.requirement)
    var index = 0;
    if (nodeInfoList && nodeInfoList.length > 0) {

      nodeInfoList.forEach((item) => {
        index += 1;
        if ("1" == item.isDifferentiatePnl) {

          requirement = requirement + index + '. '
            + item.name + ':';
          if (item.differPNL && item.differPNL.length > 0) {
            item.differPNL.forEach(differ => {
              requirement += (differ.pnlName == null ? ' ' : differ.pnlName) + ':' + (differ.parameterValue == null ? differ.defaultValue : differ.parameterValue);
              + (differ.unit == null ? '' : differ.unit) + '\n';
            })
          }
          requirement = requirement + (item.unit == null ? '' : item.unit) + '\n';

        } else {
          requirement = requirement + index + '. '
            + item.name + ':'
            + (item.defaultValue == null ? ' ' : item.defaultValue)
            + (item.unit == null ? '' : item.unit) + '\n';
        }
      })
    }
    else {
      requirement = '';
    }
  }

  if (node.remark) {
    if (requirement) {
      requirement += "\n 备注：";
    }
    let remark = node.remark;
    if (remark.public) {
      requirement += remark.public + "\n";
    }
    if (remark.differPNL) {
      let index = 1;
      remark.differPNL.forEach((item: any) => {
        requirement += index + "." + item.pnlName + ":" + item.remark + " ";
        index++;
      });
    }

  }
  console.log("备注：", node.remark);


  // if(remark.differPNL){
  //   requirement = requirement+"备注： ";
  //   let index =1;
  //   remark.differPNL.forEach((item:any)=>{
  //      requirement +=index+"."+ item.remark+" ";
  //       index++;
  //     });
  // }
  form.value.requirement = requirement;
  // form.value.remark = remark;
  //切换工序置空
  form.value.remark = '';
  setConfigRemark();
}

// 获取 搜索条件
const unitChange = () => {
  if (!form.value.unit) {
    typeShow.value = false;
    unitSchemeShow.value = false;
    return;
  }
  typeShow.value = true;
  let unit = unitList.value.filter(item => item.unit == form.value.unit);
  typeList.value = unit[0].typeList;
  cancelLengthWidth();
}


//清除加工工序
const cancelAll = () => {
  cancelProduct();
  cancelCraft();
  cancelType();
}

//清除加工工序
const cancelCraft = () => {
  form.value.craftId = undefined;
  nodeList.value = [];

}
//清除排产单
const cancelProduct = () => {
  form.value.productionId = undefined;
  productionList.value = [];


}
const cancelLengthWidth = () => {
  form.value.type = undefined;
  form.value.quantity = undefined;
  form.value.length = undefined;
  form.value.width = undefined;
  form.value.maxQuantity = undefined;
  // form.value.requirement = undefined;
}
const cancelType = () => {
  typeShow.value = false;

  form.value.unit = undefined;
  form.value.type = undefined;

  form.value.quantity = undefined;
  form.value.length = undefined;
  form.value.width = undefined;
  form.value.maxQuantity = undefined;
  form.value.requirement = undefined;
}
// 获取 搜索条件
const typeChange = () => {
  if (!form.value.type) {
    return;
  }
  let type = typeList.value.filter((item: any) => item.id == form.value.type);

  setReduceWL(type);
  console.log("type[0]", type[0]);
  if (type[0]) {
    const rVal = reduceVal.value ? reduceVal.value : 0;
    const length = type[0].length ? type[0].length : 0;
    const width = type[0].width ? type[0].width : 0;
    console.log("扣减前length,w",length,width)
    console.log("扣减 length,w",rVal)
    console.log("扣减后length,w",form.value.length,form.value.width)
    form.value.length = length - rVal;
    form.value.width = width - rVal;
    form.value.quantity = type[0].quantity;
    form.value.maxQuantity = type[0].quantity;
    form.value.typeName = type[0].typeName;
  }

}
// 设置外协加工备注
const setConfigRemark = () => {
  //重置扣减
  reduceVal.value = 0;
  //非此两项无需扣减
  if (!form.value.craftName) {
    return;
  }
  console.log("setConfigRemark form.value.craftName", form.value.craftName);
  const typeBM = form.value.craftName?.includes(ReduceCraftNameENUM.BM);
  //外层钻孔
  const typeWCZK = form.value.craftName?.includes(ReduceCraftNameENUM.WCZK);
  if(typeWCZK){
    if(pro_boardThickness.value){
      pro_boardThickness.value.requirement.forEach((item:any)=>{
        if(item.code == "BoardThickness"){
          if(item.defaultValue){
            form.value.remark = "板厚："+item.defaultValue+item.unit;
          }
        }
      })
    }
  }
  let nodeReq: any;
  if (typeBM) {
    nodeReq = nodeRequirement.value.filter((req: any) => req.code == ReduceReqNameENUM.TYPE_BM);
  }
  let _requirement = "";
  if (nodeReq && nodeReq.length > 0) {
    console.log("nodeReq", nodeReq);
    _requirement = nodeReq[0].defaultValue;
  }
  console.log("setConfigRemark requirement", _requirement);
  const reqPX = _requirement?.includes("喷锡");
  //表面且喷锡
  if (typeBM && reqPX) {
    console.log(reduceList.value.remarkList)
    reduceRemark.value = reduceList.value.remarkList[0].value;
    form.value.remark = reduceRemark.value;
  }
}

// 设置外协加工扣减
const setReduceWL = (_type: any) => {
  //重置扣减
  reduceVal.value = 0;
  //非此两项无需扣减
  if (!form.value.craftName) {
    return;
  }
  console.log("nodeRequirement.value", nodeRequirement.value);

  console.log("form.value.craftName", form.value.craftName);
  const typeBM = form.value.craftName?.includes(ReduceCraftNameENUM.BM);
  const typeBMH = form.value.craftName?.includes(ReduceCraftNameENUM.BMH);
  let nodeReq: any;
  if (typeBM) {
    nodeReq = nodeRequirement.value.filter((req: any) => req.code == ReduceReqNameENUM.TYPE_BM);
  } else if (typeBMH) {
    nodeReq = nodeRequirement.value.filter((req: any) => req.code == ReduceReqNameENUM.TYPE_BMH);
  }
  let _requirement = "";
  if (nodeReq && nodeReq.length > 0) {
    console.log("nodeReq", nodeReq);
    _requirement = nodeReq[0].defaultValue;
  }
  console.log("requirement", _requirement);
  const typeTXDD = form.value.craftName?.includes(ReduceCraftNameENUM.TXDD);
  const typeQBDD = form.value.craftName?.includes(ReduceCraftNameENUM.QBDD);
  const typeCJ = form.value.craftName?.includes(ReduceCraftNameENUM.CJ);

  const reqCJ = _requirement?.includes(ReduceReqNameENUM.CJ);
  const reqYQPX = _requirement?.includes(ReduceReqNameENUM.YQPX);
  const reqWXPX = _requirement?.includes(ReduceReqNameENUM.WQPX);
  const reqOSP = _requirement?.includes(ReduceReqNameENUM.OSP);
  const reqPX = _requirement?.includes("喷锡");

  console.log("reqCJ", reqCJ,reqYQPX,reqWXPX,reqOSP,reqPX);
  let matchKey: any;
  let WLObj: any;
  //PNL
  console.log("form.value.unit",form.value.unit)
  if (form.value.unit == "2") {
    console.log("扣减设置PNL");
    //bm-cj
    if ((typeBM || typeBMH) && reqCJ) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_BM_CJ;
    } else if ((typeBM || typeBMH) && reqYQPX) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_BM_YQPX;
    } else if ((typeBM || typeBMH) && reqWXPX) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_BM_WQPX;
    } else if ((typeBM || typeBMH) && reqOSP) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_BM_OSP;
    } else if (typeTXDD) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_TXDD;
    } else if (typeQBDD) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_QBDD;
    } else if (typeCJ) {
      matchKey = ReduceCodeENUM.GX_OUT_PNL_CJ;
    }
    console.log("matchKey",matchKey);
    const pnl = reduceList.value.pnlList.filter((rd: any) => rd.code == matchKey);
    WLObj = pnl[0] ? pnl[0] : 0;
  }
  //SET
  else if (form.value.unit == "3") {
    console.log("扣减设置SET");
    if (typeBMH && reqCJ) {
      matchKey = ReduceCodeENUM.GX_OUT_SET_BM_CJ;
    } else if (typeBMH && reqYQPX) {
      matchKey = ReduceCodeENUM.GX_OUT_SET_BM_YQPX;
    } else if (typeBMH && reqWXPX) {
      matchKey = ReduceCodeENUM.GX_OUT_SET_BM_WQPX;
    } else if (typeBMH && reqOSP) {
      matchKey = ReduceCodeENUM.GX_OUT_SET_BM_OSP;
    }
    console.log("matchKey",matchKey);
    const sel = reduceList.value.setList.filter((rd: any) => rd.code == matchKey);
    WLObj = sel[0] ? sel[0] : 0;
  } else {
    return;
  }
  reduceVal.value = WLObj.value;
}
// 获取 搜索条件
const supplierChange = () => {
  if (!form.value.supplierId) {
    return;
  }
}

// 获取 搜索条件
const searchChange = (params: any) => {
  if (editableTabsValue.value == 1) {
    queryParams.value = params
    getList()
  }else if(editableTabsValue.value == 2){
    waitQueryParams.value = params;
    waitQueryParams.value.confirmStatus = '1';
    getWaitList();
  }else{
    confirmQueryParams.value = params;
    confirmQueryParams.value.confirmStatusList = ['2','3'];
    getConfirmList();
  }
}

/** 查询外协加工订单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.isConfirmed = '0';
  const res = await listSourceHalfProcessOrder(queryParams.value);
  sourceHalfProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  getIssuedQuantity();
}

/** 查询工序外协待确认列表 */
const getWaitList = async () => {
  loading.value = true;
  const res = await listSourceHalfProcessOrder(waitQueryParams.value);
  sourceHalfProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询工序外协已确认列表 */
const getConfirmList = async () => {
  loading.value = true;
  const res = await listSourceHalfProcessOrder(confirmQueryParams.value);
  sourceHalfProcessOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询外协加工订单已发数量 */
const getIssuedQuantity = async () => {

  const res = await getSourceHalfProcessOrderIssuedQuantity(queryParams.value);
  tableTotal.value = res.data;

}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}
/** 取消按钮 */
const drawerCancel = () => {
  reset();
  drawer.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  sourceHalfProcessOrderFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: SourceHalfProcessOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  unitCheck.value = true;
  productionList.value = [];
  nodeList.value = [];
  typeList.value = [];

  unitChange();
  dialog.visible = true;


  dialog.title = "添加外协加工订单";
}





/** 新增按钮操作 */
const handleAddOrder = () => {
  getAddressList();
  halfOrderList.value = [];
  reset();
  drawer.visible = true;
  drawer.title = "外协加工单";
}

/** 详情按钮操作 */
const handleSelect = async (row?: SourceHalfProcessOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  row?.productionId
  const product = ref<any>();
  dialog.visible = true;
  dialog.title = "制程外协订单详情";
  dialogTableLoading.value = true
  // const res = await getSourceHalfProcessOrder(_id);
  await getProductionInfo([row?.productionId]).then(res => {

    product.value = res.data[0];
    if (product.value.productionPlanSchemeVoList) {
      planSchemeList.value = product.value.productionPlanSchemeVoList;
    }
    if (planSchemeList.value[0].planPnlVoList) {
      planPnlList.value = planSchemeList.value[0].planPnlVoList;
    }
    if (planPnlList.value[0].pnlSetBoList) {
      planCommodityList.value = planPnlList.value[0].pnlSetBoList;
    }

    dialogTableLoading.value = false
  });
  Object.assign(form.value, row);

  typeChange();

  unitCheck.value = true;
}
/** 修改按钮操作 */
const handleUpdate = async (row?: SourceHalfProcessOrderVO) => {
  reset();
  const product = ref<any>();
  //先查排产单
  dialog.visible = true;
  dialog.title = "修改外协加工订单";
  dialogTableLoading.value = true
  let res;
  if(row?.businessType=='1'){
    res = await getReworkAllUnitList({ id: row?.businessId }).finally(() => { dialogTableLoading.value = false });
  }else{
    res = await getUnitList({ id: row?.id }).finally(() => { dialogTableLoading.value = false });
  }
  Object.assign(form.value, row);
  //把form.value中的tyep 转成number
  // form.value.type = Number(form.value.type);
  form.value.type = String(form.value.type);
  if (res.data.unitList) {
    form.value.maxQuantity = res.data.unitList[0].typeList[0].quantity;
    //返工编辑要加订单数量
    if(form.value.businessType=='1'){
      form.value.maxQuantity =Number(form.value.maxQuantity)+Number(form.value.quantity);
    }
    typeList.value = res.data.unitList[0].typeList;
    unitList.value = res.data.unitList;
    typeShow.value = true;
    unitSchemeShow.value = true;
  }
  console.log(typeList.value);
  typeList.value.forEach(item => {
    item.id = String(item.id);
  });

  if(form.value.unit=='2'||form.value.unit=='3'){
    if(form.value.quantity){
      form.value.quantity=Number(form.value.quantity).toFixed(0);
    }
  }
  unitCheck.value = true;
}

const handleRework = async (row?: AnalyserOptions) => {
  reset();
  const product = ref<any>();
  //先查排产单
  dialog.visible = true;
  dialog.title = "外协加工订单返工";
  dialogTableLoading.value = true;

  const res = await getReworkAllUnitList({  id: row?.id }).finally(() => { dialogTableLoading.value = false });
  Object.assign(form.value, row);
  //把form.value中的tyep 转成number
  form.value.type = String(form.value.type);
  if (res.data.unitList) {
    form.value.maxQuantity = res.data.unitList[0].typeList[0].quantity;
    typeList.value = res.data.unitList[0].typeList;
    unitList.value = res.data.unitList;
    typeShow.value = true;
    unitSchemeShow.value = true;
    form.value.quantity = form.value.maxQuantity;
  }
  console.log(typeList.value);
  console.log(unitList.value);
  typeList.value.forEach(item => {
    item.id = String(item.id);
  });
  //如果返工单位不匹配，选中第一个单位与第一个类型
  const allNotMatchedUnit =  unitList.value.every(unitObj => {
    return unitObj.unit !== form.value.unit;
  });
  const allNotMatched =  typeList.value.every(typeObj => {
    return typeObj.id !== form.value.type;
  });
  if(allNotMatchedUnit){
    form.value.unit = unitList.value[0].unit;
  }
  if(allNotMatched){
    form.value.type = typeList.value[0].id;
  }

  if(form.value.unit=='2'||form.value.unit=='3'){
    if(form.value.quantity){
      form.value.quantity=Number(form.value.quantity).toFixed(0);
    }
  }
  unitCheck.value = false;
}

const validRules = ref<VxeTablePropTypes.EditRules<SourceHalfProcessOrderVO>>({
  quantity: [
    { required: true, message: "请输入加工数量" }
  ],
  length: [
    { required: true, message: "请输入长" }
  ],
  width: [
    { required: true, message: "请输入宽" }
  ],
});

/** 确认按钮操作 */
const handleConfirm = async (row?: SourceHalfProcessOrderVO) => {
  reset();
  getAddressList();
  //先查排产单
  confirmDrawer.visible = true;
  confirmDrawer.title = "外协加工订单";
  tableLoading.value = true;
  Object.assign(form.value, row);
  // 根据code查询待确认的订单
  const orderRes = await supplierOrderDetail({ code: row?.code, confirmStatus: '1' });
  halfOrderList.value = orderRes.data;
  tableLoading.value = false;
}

/** 提交按钮 */
const submitConfrim = async () => {

  // halfOrderList.value是否为空
  if (halfOrderList.value.length == 0) {
    proxy?.$modal.msgError("请选择外协订单！");
    return;
  }

  const $table = confirmOrderTable.value.xTableRef
  if ($table) {
    const errMap = await $table.validate(true)
    if (errMap) {
      return ;
    }
  }
  halfOrderList.value.map(item => item.confirmRemark = form.value.confirmRemark);

  const res = await compareList(halfOrderList.value);
  if (res.data) {
    await proxy?.$modal.confirm('您已修改单据信息，需要对方再次确认，是否确认修改？').finally(() => loading.value = false);
  } else {
    await proxy?.$modal.confirm('是否确认提交该数据项？').finally(() => loading.value = false);
  }
  buttonLoading.value = true;
  await confirmSourceHalfProcessOrder(halfOrderList.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  confirmDrawer.visible = false;
  await getWaitList();
}

const checkHandle = (): any => {
  return new Promise((resolve, reject) => {
    proxy?.$modal.confirm('订单中有流转卡已暂停，请确是否继续！').then(()=>{
      resolve(true)
    }).catch(()=>{
      resolve(false)
    })
  })
}

/** 提交按钮 */
const submitAddForm = () => {
  orderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (halfOrderList.value.length == 0) {
        proxy?.$modal.msgError("请添加外协加工单");
        return;
      }
      buttonLoading.value = true;
      let productionIds = [];
      //遍历halfOrderList 设置supplier_id
      halfOrderList.value.forEach(item => {
        item.supplierId = form.value.supplierId;
        item.addressId = form.value.addressId;
        productionIds.push(item.productionId);
      });

      let resFlag = true
    //验证
    // await getSourceFullProcessOrder(form.value.id).then(async (res) => {
    //     let outOrder = res.data;
    //     if(outOrder){
    //         resFlag = await checkHandle();
    //     }
    // })
    if (!resFlag) {
      buttonLoading.value = false;
      return;
    }


      await addSourceHalfProcessOrder(halfOrderList.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("添加成功");
      getList();
      drawer.visible = false;
      buttonLoading.value = false;
      halfOrderList.value = [];


    }
  });
}

/** 提交按钮 */
const submitReworkForm = () => {
  halfOrderList.value=[];
  sourceHalfProcessOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      buttonLoading.value = true;
      let temp = deepClone(form.value);

      //设置随机id
      temp.index = Math.floor(Math.random() * 1000000000000000000);
      temp.businessType='1';
      temp.businessId = temp.id;
      temp.reworkQuantity = 0;
      temp.id = undefined;
      temp.createByName= undefined;
      halfOrderList.value.push(temp);
      //遍历halfOrderList 设置supplier_id
      halfOrderList.value.forEach(item => {
        item.supplierId = form.value.supplierId;
        item.addressId = form.value.addressId;
      });
      await addSourceHalfProcessOrder(halfOrderList.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("返工成功");
      // form.
      getList();
      dialog.visible = false;
      buttonLoading.value = false;
    }
  });


}
/** 提交按钮 */
const submitForm = () => {
  sourceHalfProcessOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      //判断halfOrderList是否有数据
      if (halfOrderList.value.length > 0) {
        //判断form的productionId相同与craftId相同的数据是否存在
        let halfOrder = halfOrderList.value.find(item => item.productionId == form.value.productionId && item.craftId == form.value.craftId && item.unit == form.value.unit && item.type == form.value.type);
        if (halfOrder) {
          //提示
          proxy?.$modal.msgError("该加工单已存在");
          return;
        }
      }
      buttonLoading.value = true;
      let temp = deepClone(form.value);

      //设置随机id
      temp.index = Math.floor(Math.random() * 1000000000000000000);
      halfOrderList.value.push(temp);
      // form.
      dialog.visible = false;
      buttonLoading.value = false;
      await queryOutSourceSupplierList()
    }
  });
}
/** 提交按钮 */
const submitEditForm = () => {
  sourceHalfProcessOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {

      buttonLoading.value = true;
      if(dialog.title?.includes('返工')){
        form.value.businessType = '1'
      };
      //放工
      await updateSourceHalfProcessOrder(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("修改成功");
      radioTableHandle();
      dialog.visible = false;
      buttonLoading.value = false;
    }
  });
}

/** 删除未提交的请求 */
const handleDeleteForm = async (row?: SourceHalfProcessOrderForm) => {
  //从halfOrderList中删除，
  halfOrderList.value = halfOrderList.value.filter(item => item.index != row?.index);
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceHalfProcessOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除外协加工订单编号为"' + row?.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceHalfProcessOrder(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  exportVisible.value = false;
  if (1 == editableTabsValue.value) {
    proxy?.download('outsource/sourceHalfProcessOrder/export', {
      ...queryParams.value, tableName: 'outsourceSourceHalfProcessOrder'
    }, `外协加工订单_${new Date().getTime()}.xlsx`);
  } else if (2 == editableTabsValue.value) {
    proxy?.download('outsource/sourceHalfProcessOrder/export', {
      ...waitQueryParams.value, tableName: 'outsourceSourceHalfProcessOrder2'
    }, `加工单待确认列表_${new Date().getTime()}.xlsx`);
  } else {
    proxy?.download('outsource/sourceHalfProcessOrder/export', {
      ...confirmQueryParams.value, tableName: 'outsourceSourceHalfProcessOrder3'
    }, `加工单已确认列表_${new Date().getTime()}.xlsx`);
  }
}

/** 导出前操作 */
const handleExportBefore = async () => {
  if (!queryParams.value.placeOrderTimeStart) {
    exportVisible.value = true;
  } else {
    if (1 == editableTabsValue.value) {
      proxy?.download('outsource/sourceHalfProcessOrder/export', {
        ...queryParams.value, tableName: 'outsourceSourceHalfProcessOrder'
      }, `外协加工订单_${new Date().getTime()}.xlsx`);

    } else if (2 == editableTabsValue.value) {
      proxy?.download('outsource/sourceHalfProcessOrder/export', {
        ...waitQueryParams.value, tableName: 'outsourceSourceHalfProcessOrder2'
      }, `加工单待确认_${new Date().getTime()}.xlsx`);
    } else {
      proxy?.download('outsource/sourceHalfProcessOrder/export', {
        ...confirmQueryParams.value, tableName: 'outsourceSourceHalfProcessOrder3'
      }, `加工单已确认_${new Date().getTime()}.xlsx`);
    }
  }
}

// 使用 ref 创建 currentTime 变量
const currentTime = ref(getCurrentTime());

// 获取当前时间的方法
function getCurrentTime() {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return new Intl.DateTimeFormat('zh-CN', options).format(now);
}

// 更新当前时间
function updateCurrentTime() {
  const update = () => {
    currentTime.value = getCurrentTime();
    requestAnimationFrame(update); // 递归调用，实现动画效果
  };
  update(); // 启动更新
}

import {listOutSourceSupplierListV2} from "@/api/outsource/sourceFullProcessOrder";
import { deepClone } from '@/utils';

const supplierList: any = ref([]);

const commodityVoList = ref<SourceHalfProcessOrderVO[]>([]);
const proList = ref<any[]>([]);
/** 查询外协供应商列表 */
const commodityList = async () => {
  const res = await listSourceHalfCommodityList();
  // commodityVoList.value = res.data
console.log("commodityList",res.data);

  let comList: any = [];
  proList.value = res.data;
  res.data.forEach(fe => {
    comList = comList.concat(fe.planCommodityList);
  });

  let commoditySetList = <any>[];
  comList.forEach((item: any) => {
    let hasCom = commoditySetList.find((item1: any) => item1.commodityId === item.commodityId);
    if (!hasCom) {
      item.planList = [item.planId];
      commoditySetList.push(item);
    } else {
      hasCom.planList.push(item.planId);
    }
  })
  console.log("commoditySetList", commoditySetList);

  commodityVoList.value = commoditySetList;

}
/** 查询外协供应商列表 */
const queryOutSourceSupplierList = async () => {
  const res = await listOutSourceSupplierListV2(form.value.craftId || -1);
  supplierList.value = res.data
}
const addressList: any = ref([]);

import { listOutSourceAddressList } from "@/api/outsource/sourceFullProcessOrder";
import { fromType } from 'vue-types';
import {SourceFullProcessOrderVO, StatusEnum} from "@/api/outsource/sourceFullProcessOrder/types";
import { QuotationVO } from "@/api/order/quotation/types";
import { formEmits } from 'element-plus';
import { NumberFormat } from 'vue-i18n';
import { it } from 'node:test';
import { log } from 'console';
import {ref} from "vue";
import {getSignPdf} from "@/api/financial/accountOrder";
import {getReportUrl} from "@/utils/report";
import {MaterialOrderForm, MaterialOrderQuery} from "@/api/purchase/materialOrder/types";

const getAddressList = async () => {

  const ourAddressRes = await listOutSourceAddressList();
  addressList.value = ourAddressRes.data
}


/*const doPrint = async (row?: SourceHalfProcessOrderVO) => {
  const _ids = row?.id || ids.value;
  proxy?.$modal.loading('加载中...');
  let dev = await getPrintSourceHalfProcessOrder(_ids as string).finally(() => proxy?.$modal.closeLoading());
  outSourceInfo.value = dev.data;
  console.log(outSourceInfo.value.type);
  setTimeout(() => {
    printHtmlV2(null);
  }, 100)
}*/

let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '工序外协合同'
});
const doPrint = async (row: any) => {
  const reportName='_工序外协合同';
  reportDrawer.title = "工序外协合同预览";
  reportDrawer.visible = true;
  if(row.confirmStatus=="3"){
    getSignPdf({bizCode:row.code}).then(res=>{
      let vo = res.data;
      if (vo.url) {
        let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
        reportUrl.value = url;
        return;
      }
    });
  }
  reportUrl.value = getReportUrl() + `&_n=${reportName}&_u=file:outSourceHalfCopy.ureport.xml&url=outsource/sourceHalfProcessOrder/review/${row.id}&listUrl=outsource/sourceHalfProcessOrder/listReview/${row.id}`;
  reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
  console.log(reportUrl.value)
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

/** 查询操作记录 */
const handleRecord = async (id: any) => {
  recordVisible.value = true;
  recordId.value = id;
}

/** 附件上传 */
const handleUpload = async (row: any) => {
  uploadVisible.value = true;
  fileId.value = row.id;
  bizCode.value = row.code;
}

const statementVisible = ref(false);
const statement = reactive<any>({
  visible: false,
  title: '',
  describe: '',
});
const detailOrderFormRef = ref<ElFormInstance>();

/** 结单按钮 */
const handleStatement = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.commodityCode = row?.commodityCode;
  statement.visible = true;
}

/** 结单 */
const statementAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      var commodityCode = detailForm.value.commodityCode;
      detailForm.value.detailStatus = '3';
      detailForm.value.idList = [detailForm.value.id];
      await proxy?.$modal.confirm('是否确认产品编号为"' + commodityCode + '"的数据项结单？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await sourceHalfStatementDetail(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await radioTableHandle();
    }
  });
}

/** 取消按钮 */
const handleCancel = async (row?: any) => {
  detailForm.value = { ...initFormData };
  detailForm.value.id = row?.id;
  detailForm.value.code = row?.code;
  statement.title = '申请取消';
  statement.describe = '取消备注';
  statement.visible = true;
}

/** 取消单据 */
const cancelAccount = async () => {
  detailOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      var code = detailForm.value.code;
      detailForm.value.status = '2';
      detailForm.value.confirmStatus = '2';
      await proxy?.$modal.confirm('是否确认取消单号为"' + code + '"的数据项？').finally(() => loading.value = false);
      proxy?.$modal.loading("加载中...");
      await sourceHalfCancelOrder(detailForm.value).finally(() => proxy?.$modal.closeLoading());
      proxy?.$modal.msgSuccess("修改成功");
      statement.visible = false;
      await getConfirmList();
    }
  });
}

const MIPrintRef = ref();
const doMIPrint = async (dataId: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(dataId, type);
}
onMounted(() => {
  getList();
  updateCurrentTime();
  commodityList();

});
</script>
<style>
.totalTitle {
  display: inline-block;
  margin-right: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #0892c7
}</style>

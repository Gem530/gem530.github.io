<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs class="xtable-tab" @tab-click="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="待发货列表" name="待发货列表">
          <div class="head-btn-flex">
              <el-button :loading="buttonLoading" type="primary" plain @click="handleAdd">生成送货单</el-button>
          </div>
          <XTable toolId="financialOrderFilinOutDetailList" v-model:page-size="queryParams.pageSize" :loading="loading"
            v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
            :showRefresh="true" :span-method="mergeCells"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
            :data="deliveryRecordList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange"
            @checkbox-all="selectChangeEvent" @checkbox-change="selectChangeEvent"
            :checkbox-config="{ checkMethod: selectableFun, showHeader: false, reserve: true }" :column-config="{ resizable: true }"
            :row-config="{ keyField: 'saleId' }">
            <template #default-status="scope">
              <span v-if="scope.row.payablePrice != 0">{{ scope.row.status }}</span>
              <span v-else>冲销完成</span>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="待回签列表" name="待回签列表">
          <XTable toolId="financialOrderFilinOutDetailWait" v-model:page-size="waitSignQueryParams.pageSize" :loading=loading
            v-model:current-page="waitSignQueryParams.pageNum" height="100%" class="xtable-content"
            :showRefresh="true" :span-method="mergeCells"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: waitTotal }"
            :data="orderFilinOutWaitList" :columnList="columnList2" ref="custTableRef" border @searchChange="unSignSearchChange"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="headleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="handleUpdateLogNo(scope.row)">修改物流信息</el-button>
<!--              <el-button link type="primary" @click="doPrint(scope.row.id)">打印送货单</el-button>-->
              <el-button link type="primary" @click="doPrintPDF(scope.row)">打印送货单</el-button>
              <el-button link type="primary" @click="handleSign(scope.row)"
                v-show="scope.row.isCallback == '0'">回签</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已回签列表" name="已回签列表">
          <XTable toolId="financialOrderFilinOutDetailProcess" v-model:page-size="signQueryParams.pageSize" :loading=loading
            v-model:current-page="signQueryParams.pageNum" height="100%" class="xtable-content"
            :showRefresh="true" :span-method="mergeCells"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: aduitTotal }"
            :data="orderFilinOutAduitList" :columnList="columnList2" ref="aduitTableRef" border
            @searchChange="signSearchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-unit="{ row }">
              <span>PCS</span>
            </template>
            <template #default-deliveryTime="scope">
              <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="headleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
              <el-button link type="primary" @click="handleUpdateLogNo(scope.row)">修改物流信息</el-button>
<!--              <el-button link type="primary" @click="doPrint(scope.row.id)">打印送货单</el-button>-->
              <el-button link type="primary" @click="doPrintPDF(scope.row)">打印送货单</el-button>

              <el-button link type="primary" @click="handleUnSign(scope.row)"
                v-show="scope.row.isCallback == '1'">取消回签</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->

    <el-drawer :title="drawer.title" v-model="drawer.visible" size="80%" @close="drawerCancel" destroy-on-close>
      <div class="ptable-card">
        <el-form style="width: 100%;" :model="tabForm" ref="orderFormRef" :rules="rules" label-width="100px" label-position="right"
          :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')">
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户编码:">
                <el-input v-model="tabForm.customerCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称:">
                <el-input v-model="tabForm.customerName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="送货时间:" prop="deliveryTime">
                <el-date-picker class="width-100" v-model="tabForm.deliveryTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货地址:" prop="cusAddress">
<!--                <el-input v-model="tabForm.cusAddress"/>-->
                <el-select v-model="tabForm.addressId"
                           @change="selectAddress"
                           style="width: calc(100% - 63px)"
                           clearable
                           filterable
                           placeholder="请选择收货地址">
                  <el-option
                    v-for="item in customerAddressList"
                    :key="item.id"
                    :label="item.address"
                    :value="item.id"
                    :disabled="item.status==0"
                  />
                </el-select>
                <el-button style="width: 60px;margin-left: 3px" text="plain" @click="handleAddAddress">
                  <el-icon>
                    <Plus/>
                  </el-icon>
                  添加地址
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="送货车辆:" prop="deliveryVehicle">
                <el-input v-model="tabForm.deliveryVehicle" maxLength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装运人员:" prop="deliveryPersonnel">
                <el-input v-model="tabForm.deliveryPersonnel" maxLength="100" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">物流信息</el-divider>
          <div class="m-2">
            <el-button :loading="buttonLoading" type="primary" @click="openLogistics">物流下单</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="relLogistics">关联已有物流单</el-button>
            <el-button v-if="tabForm.logisticsOrderId" :loading="buttonLoading" type="primary" @click="printLogisitics">打印面单</el-button>
            <el-button v-if="tabForm.logisticsOrderId" :loading="buttonLoading" type="danger" @click="cancelRelation">取消关联</el-button>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="物流公司:" prop="logisticsCompany">
                <el-select v-model="tabForm.logisticsCompany"
                           :disabled="logisticsDisabled || tabForm.logisticsOrderId"
                           style="width: calc(100%)"
                           placeholder="请选择物流公司"
                           @change="getCompany"
                           filterable
                           default-first-option
                >
                  <el-option
                    v-for="item in logisticsCompanyList"
                    :key="item.id"
                    :label="item.fullName"
                    :value="item.fullName"
                  >
                  </el-option>
                </el-select>
<!--                <el-input v-model="tabForm.logisticsCompany" maxLength="100" />-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流单号:" prop="logisticsNo">
                <div class="global-flex width-100">
                  <el-input style="flex: 1" :disabled="logisticsDisabled || tabForm.logisticsOrderId" v-model="tabForm.logisticsNo" maxLength="100" />
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    raw-content
                    v-if="logisticsDisabled || tabForm.logisticsOrderId"
                    content="通过物流下单或者通过关联已有物流单的，不允许修改，只能取消关联"
                  >
                    <el-icon style="margin-left: 10px;color: #f3d8c4;"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收货手机号" >
                <el-input :disabled="logisticsDisabled || tabForm.logisticsOrderId" v-model="tabForm.phoneNumber" maxlength="40"
                placeholder="顺丰物流请填写收货手机号" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="23" >
              <el-form-item label="物流凭证:" prop="fileList">
                <div class="global-flex flex-start">
                  <XUpload
                    :isWaterMark="true"
                    v-model:model-value="tabForm.fileList"
                    :fileType="fileType"
                    @fileChange="handleFileChange"
                    @delFile="handleFileChange"
                    :readOnly="drawer.title?.includes('详情')"
                    model="preview"
                    :multiple="false"
                    :fileSize="5"
                    accept="image/png, image/bmp, image/jpeg, image/jpg, image/gif"
                  ></XUpload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <XTable :pageShow="false" ref="tabTable" :data="tabOrderList" border :columnList="orderColumnList" keep-source :showHead="false"
        height="100%" class="ptable-content" :loading="dialogTableLoading" :column-config="{ resizable: true }"
          :edit-rules="validRules" size="mini" :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
          <template #default-unit="{ row }">
            <span>PCS</span>
          </template>
          <template #default-deliveryTime="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
          </template>
          <template #default-make="scope">
            <el-button v-if="tabOrderList.length > 1" link type="primary"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              @click="handleTabDelete(scope.row)">删除</el-button>
          </template>
          <template #edit-shipQuantity="scope">
            <el-input-number style="width: 100%" maxLength="11" :precision="0" :controls="false"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')" v-model="scope.row.shipQuantity" />
          </template>
          <template #edit-reserveQuantity="scope">
            <el-input-number style="width: 100%" maxLength="11" :precision="0" :controls="false" :max="scope.row.orderQuantity"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              v-model="scope.row.reserveQuantity" />
          </template>
          <template #edit-caseNum="scope">
            <el-input-number style="width: 100%" maxLength="11" :precision="0" :controls="false"
              :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')" v-model="scope.row.caseNum" />
          </template>
          <template #edit-remark="scope">
            <el-input type="text" maxLength="254" :disabled="drawer.title?.includes('详情') || drawer.title?.includes('审核')"
              v-model="scope.row.remark" />
          </template>
        </XTable>
      </div>

      <template #footer>
        <!-- <div style="display: flex; justify-content: center;">
          <span class="dialog-footer"> -->
            <el-button v-if="!(drawer.title?.includes('详情') || drawer.title?.includes('审核'))" :loading="buttonLoading"
            type="primary" @click="submitAddForm">确 定</el-button>
            <el-button :loading="buttonLoading" @click="drawerCancel">取消</el-button>
          <!-- </span>
        </div> -->
      </template>
    </el-drawer>

    <el-drawer :title="updateLogNoDrawer.title" v-model="updateLogNoDrawer.visible" size="80%" @close="updateLogNoDrawer.visible = false;" destroy-on-close>
      <div class="ptable-card">
        <el-form style="width: 100%;" :model="tabForm" ref="orderFormRef2" :rules="logNoRules" label-width="100px" label-position="right">
          <el-row>
            <el-col :span="8"> <el-form-item label="客户编码:">
                <el-input v-model="tabForm.customerCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称:">
                <el-input v-model="tabForm.customerName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="送货时间:" prop="deliveryTime">
                <el-date-picker class="width-100" v-model="tabForm.deliveryTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" clearable disabled></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货地址:">
<!--                <el-input v-model="tabForm.cusAddress" disabled />-->
                <el-select v-model="tabForm.addressId"
                           @change="selectAddress"
                           style="width: 100%"
                           clearable
                           filterable
                           disabled
                           placeholder="请选择收货地址">
                  <el-option
                    v-for="item in customerAddressList"
                    :key="item.id"
                    :label="item.address"
                    :value="item.id"
                    :disabled="item.status==0"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="送货车辆:" prop="deliveryVehicle">
                <el-input v-model="tabForm.deliveryVehicle" maxLength="100" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装运人员:" prop="deliveryPersonnel">
                <el-input v-model="tabForm.deliveryPersonnel" maxLength="100" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">物流信息</el-divider>
          <div class="m-2">
            <el-button :loading="buttonLoading" type="primary" @click="openLogistics">物流下单</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="relLogistics">关联已有物流单</el-button>
            <el-button v-if="tabForm.logisticsOrderId" :loading="buttonLoading" type="danger" @click="printLogisitics">打印面单</el-button>
            <el-button v-if="tabForm.logisticsOrderId" :loading="buttonLoading" type="danger" @click="cancelRelation">取消关联</el-button>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="物流公司:" prop="logisticsCompany">
                <el-select v-model="tabForm.logisticsCompany"
                           :disabled="logisticsDisabled || tabForm.logisticsOrderId"
                           style="width: calc(100%)" placeholder="请选择物流公司"
                           @change="getCompany" filterable default-first-option >
                  <el-option v-for="item in logisticsCompanyList"
                    :key="item.id" :label="item.fullName" :value="item.fullName" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流单号:" prop="logisticsNo">
                <div class="global-flex width-100">
                  <el-input style="flex: 1" :disabled="logisticsDisabled || tabForm.logisticsOrderId" v-model="tabForm.logisticsNo" maxLength="100" />
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    raw-content
                    v-if="logisticsDisabled || tabForm.logisticsOrderId"
                    content="通过物流下单或者通过关联已有物流单的，不允许修改，只能取消关联"
                  >
                    <el-icon style="margin-left: 10px;color: #f3d8c4;"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>


          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收货手机号" >
                <el-input :disabled="logisticsDisabled || tabForm.logisticsOrderId" v-model="tabForm.phoneNumber" maxlength="40"
                placeholder="顺丰物流请填写收货手机号" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="23" >
              <el-form-item label="物流凭证:" prop="fileList">
                <div class="global-flex flex-start">
                  <XUpload
                    :isWaterMark="true"
                    v-model:model-value="tabForm.fileList"
                    :fileType="fileType"
                    @fileChange="handleFileChange"
                    @delFile="handleFileChange"
                    model="preview"
                    :multiple="false"
                    :fileSize="5"
                    accept="image/png, image/bmp, image/jpeg, image/jpg, image/gif"
                  ></XUpload>
                </div>
              </el-form-item>
              <!-- 提示 -->
              <el-form-item label="">
                <span style="color: #AAA">注：图片格式必须为：png,bmp,jpeg,jpg,gif, 不可大于5M</span>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <XTable :pageShow="false" ref="tabTable" :data="tabOrderList" border :columnList="orderColumnList" keep-source :showHead="false"
          height="100%" class="ptable-content" :loading="dialogTableLoading" :column-config="{ resizable: true }"
          :edit-rules="validRules" size="mini" :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
          <template #default-unit="{ row }">
            <span>PCS</span>
          </template>
          <template #default-deliveryTime="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
          </template>
          <template #edit-shipQuantity="scope">
            <el-input-number style="width: 100%" maxLength="11" :precision="0" :controls="false" disabled v-model="scope.row.shipQuantity" />
          </template>
          <template #edit-reserveQuantity="scope">
            <el-input-number style="width: 100%" maxLength="11" :precision="0" :controls="false" :max="scope.row.orderQuantity" disabled
              v-model="scope.row.reserveQuantity" />
          </template>
          <template #edit-remark="scope">
            <el-input type="text" maxLength="254" disabled v-model="scope.row.remark" />
          </template>
        </XTable>
      </div>
      <template #footer>
        <!-- <div style="display: flex; justify-content: center;">
          <span class="dialog-footer"> -->
            <el-button :loading="buttonLoading" type="primary" @click="submitUpdateLogNoForm">确 定</el-button>
            <el-button :loading="buttonLoading" @click="updateLogNoDrawer.visible = false;">取消</el-button>
          <!-- </span>
        </div> -->
      </template>
    </el-drawer>

    <DeliveryPrint ref="deliverCardRef" />

    <el-drawer v-model="ppppdrawer.visible" size="80%"  ></el-drawer>
<!--    <DeliveryPrint ref="deliverCardRef" />-->
    <!-- 打印对话框 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false"
               draggable>
      <div style="height: 100%;" v-loading="orderLoading">
        <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
      </div>
      <PrintPurchase />
    </el-drawer>

    <!-- 库存锁定提示框 -->
    <InventoryLock title="产品盘点提示" inventoryType="1" v-model:show="inventoryCheck" :data="inventoryRes" @close="inventoryCheck = false"/>

    <el-dialog
      v-model="logisticsDrawer.visible"
      :title="tabForm.logisticsCompany + '下单'"
      width="50%"
      align-center
      destroy-on-close
    >
      <el-form v-loading="orderLoading" element-loading-text="下单中" style="width: 100%;" :model="logisticsForm" ref="logisticsFormRef" :rules="logisticsRules" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="寄件人姓名:" prop="senderName">
              <div class="global-flex width-100">
                <el-input :disabled="logisticsForm.id" v-model="logisticsForm.senderName" />
                <el-button @click="openAddress">选择地址</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人姓名:" prop="receiverName">
              <el-input :disabled="logisticsForm.id" v-model="logisticsForm.receiverName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寄件人电话:" prop="senderPhone">
            <el-input :disabled="logisticsForm.id" v-model="logisticsForm.senderPhone" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人电话:" prop="receiverPhone">
              <el-input :disabled="logisticsForm.id" v-model="logisticsForm.receiverPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寄件人地址:" prop="senderAddress">
            <el-input :disabled="logisticsForm.id" v-model="logisticsForm.senderAddress" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人地址:" prop="receiverAddress">
              <el-input :disabled="logisticsForm.id" v-model="logisticsForm.receiverAddress" />
            </el-form-item>
          </el-col>
<!--          非公共参数-->
          <template v-if="tabForm.logisticsCompany.includes('联昊通')">
            <el-col :span="12">
              <el-form-item label="件数:" prop="count">
                <el-input-number style="width: 100%;" :controls="false" step-strictly :disabled="logisticsForm.id" v-model="logisticsForm.count" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量(kg):" prop="weight">
                <el-input-number style="width: 100%;" :controls="false" precision="3" :disabled="logisticsForm.id" v-model="logisticsForm.weight" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物名称:" prop="goodsName">
                <el-select v-model="logisticsForm.goodsName"
                           style="width: 100%"
                           placeholder="请选择"
                           @change="getGoods"
                           filterable
                           :disabled="logisticsForm.id"
                           default-first-option
                >
                  <el-option
                    v-for="item in goodsOptions"
                    :key="item.id"
                    :label="item.subName"
                    :value="item.subName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签回单"  prop="receipt">
                <el-switch :disabled="logisticsForm.id" v-model="logisticsForm.receipt" active-value="1" inactive-value="0" active-text="签回单" inactive-text="不签回单"/>
              </el-form-item>
            </el-col>
          </template>

          <template v-if="tabForm.logisticsCompany.includes('顺丰')">
            <el-col :span="12">
              <el-form-item label="货物数量:">
                <el-input-number style="width: 100%;" :controls="false" step-strictly :disabled="logisticsForm.id" v-model="logisticsForm.count" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物重量(kg):">
                <el-input-number style="width: 100%;" :controls="false" precision="3" :disabled="logisticsForm.id" v-model="logisticsForm.weight" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物名称:">
                <el-input :disabled="logisticsForm.id" v-model="logisticsForm.goodsName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签回单"  prop="receipt">
                <el-switch :disabled="logisticsForm.id" v-model="logisticsForm.receipt" active-value="1" inactive-value="0" active-text="签回单" inactive-text="不签回单"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="logisticsForm.receipt == 1">
              <el-form-item label="回单类型:" prop="receiptParams">
                <el-select v-model="logisticsForm.receiptParams"
                           style="width: 100%"
                           placeholder="请选择"
                           multiple
                           filterable
                           :disabled="logisticsForm.id"
                >
                  <el-option
                    v-for="item in sfReceiptOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>

          <template v-if="tabForm.logisticsCompany.includes('跨越')">
            <el-col :span="12">
              <el-form-item label="货物数量:">
                <el-input-number style="width: 100%;" maxLength="11" :controls="false" step-strictly :disabled="logisticsForm.id" v-model="logisticsForm.count" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物重量(kg):">
                <el-input-number style="width: 100%;" maxLength="11" :controls="false" precision="3" :disabled="logisticsForm.id" v-model="logisticsForm.weight" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物名称:" prop="goodsName">
                <el-input :disabled="logisticsForm.id" v-model="logisticsForm.goodsName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务方式:" prop="serviceMode">
                <el-select v-model="logisticsForm.serviceMode"
                           style="width: 100%"
                           placeholder="请选择"
                           filterable
                           :disabled="logisticsForm.id"
                           default-first-option
                >
                  <el-option
                    v-for="item in serviceOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否预约取货:" prop="dismantling">
                <el-switch :disabled="logisticsForm.id" v-model="logisticsForm.dismantling" :active-value="10" :inactive-value="20" active-text="上门揽收"
                           inactive-text="自主联系"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="logisticsForm.dismantling == 10">
              <el-form-item label="上门取货时间:" prop="goodsTime">
                <el-date-picker class="width-100" v-model="logisticsForm.goodsTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回单类型:" prop="receiptFlag">
                <el-select v-model="logisticsForm.receiptFlag"
                           style="width: 100%"
                           placeholder="请选择"
                           filterable
                           :disabled="logisticsForm.id"
                           default-first-option
                >
                  <el-option
                    v-for="item in receiptOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </template>

          <el-col :span="24">
            <el-form-item label="运单备注:">
              <el-input :disabled="logisticsForm.id" v-model="logisticsForm.remark" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
          <!-- 提示 -->
          <el-col :span="24">
            <el-form-item label="">
              <span style="color: #AAA">注：请填写包含省市区的详细地址，以便物流识别</span>
            </el-form-item>
          </el-col>


          <el-form-item label="失败原因：" v-if="logisticsForm.errorMsg">
            <div>
              <span style="color:#F56C6C;">{{logisticsForm.errorMsg}}。</span>
              如果仍要取消关联，请点击
              <span style="color: #457AF7;">【取消关联物流单】</span>后，再到
              <a style="color: #457AF7;" :href="itemCompany.website" target="_blank">【{{tabForm.logisticsCompany}}】</a>
              平台或致电【{{itemCompany.phone}}】手动取消物流单。
            </div>
          </el-form-item>
        </el-row>

      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading"  @click="logisticsDrawer.visible = false">取消</el-button>
          <el-button :loading="buttonLoading" v-if="!logisticsForm.id" type="primary" @click="submitOrder">确认</el-button>
          <el-button :loading="buttonLoading" v-if="logisticsForm.id" type="danger" @click="delLogistics">删除物流单</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="logisticsOrderDrawer.visible"
      title="关联物流单"
      width="50%"
      align-center
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-radio-group v-model="orderTable" @change="orderTableHandle">
        <el-radio v-for="item in logisticsCompanyList.filter(v=> v.isOpenConfig == '1')" :label="item.code">{{item.fullName}}</el-radio>
        <el-radio v-for="item in signTypeRadio" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
      <XTable v-model:page-size="logisticsQueryParams.pageSize" :loading=loading
              v-model:current-page="logisticsQueryParams.pageNum" height="500px" class="xtable-content"
              :page-params="{ perfect: true, total: orderTotal }"
              :data="logOrderList" :columnList="logOrderColumnList" ref="aduitTableRef" border
              :row-config="{ isCurrent: true, isHover: true }" :column-config="{ resizable: true }"
              :radio-config="{ trigger: 'row' }" @searchChange="orderSearchChange" @radio-change="radioChangeEvent">
      </XTable>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" @click="logisticsOrderDrawer.visible = false">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="confirmRelation">确认关联</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="addressDrawer.visible"
      title="选择地址"
      width="60%"
      align-center
      :close-on-click-modal="false"
      destroy-on-close
    >
      <XTable  :loading="custLoading" v-model:page-size="custQueryParams.pageSize" v-model:current-page="custQueryParams.pageNum" height="600" class="xtable-content" :pageShow="false"
              :page-params="{ perfect: true, total: cusTotal }" :data="selfAddressList" :columnList="customerColumnList" :showRefresh="true"
              border @searchChange="searchCustChange" :column-config="{ resizable: true }" :radio-config="{ trigger: 'row' }"
              :row-config="{ isCurrent: true, isHover: true }" @radio-change="addressChangeEvent">
      </XTable>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" @click="addressDrawer.visible = false">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="confirmAddress">确认选择</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增地址弹窗-->
    <el-dialog v-model="addressDialog.visible" :title="addressDialog.title" destroy-on-close
               :close-on-click-modal="false" width="350px">
      <el-form label-width="80px" ref="customerAddressFormRef" :model="formAddress" :rules="rulesAddress">
        <el-form-item size="small" label="联系人" prop="name">
          <el-input v-model="formAddress.name" autocomplete="off" :maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系电话" prop="phone">
          <el-input v-model="formAddress.phone" autocomplete="off" :maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系地址" prop="address">
          <el-input v-model="formAddress.address" autocomplete="off" :maxlength="150" show-word-limit></el-input>
        </el-form-item>
        <el-form-item size="small" label="物流周期" prop="logisticsCycle">
          <el-input-number style="width: 100%" :precision="0" max="999" :controls="false" v-model="formAddress.logisticsCycle" autocomplete="off"></el-input-number>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button :loading="buttonLoading" type="primary" @click="submitAddress">确 定</el-button>
        <el-button @click="cancelAddress">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="DeliveryRecord" lang="ts">
  import {
    listDeliveryRecord,
    postListSignDeliveryRecord,
    getPrintDeliveryRecord,
    getDeliveryRecord,
    delDeliveryRecord,
    getRefreshDeliveryInfoList,
    addDeliveryRecord,
    signDeliveryRecord,
    unSignDeliveryRecord,
    getDeliveryRecordByCode,
    updateDeliveryRecordLogNo,
    createOrder
  } from '@/api/order/deliveryRecord';
import { DeliveryRecordVO, DeliveryRecordQuery, DeliveryRecordForm, DeliveryRecordTypeEnum } from '@/api/order/deliveryRecord/types';
import { VxeTableEvents, VxeTablePropTypes } from 'vxe-table';
import dayjs from "dayjs";
import { deepClone } from '@/utils';
import {getCustomer, getListCustomer} from "@/api/basedata/customer";
import { listLogisticsCompany } from '@/api/basedata/logisticsCompany';
import {ref} from "vue";
import {getSignPdf} from "@/api/financial/accountOrder";
import {getReportUrl} from "@/utils/report";
import {listCommodityInventory} from "@/api/order/commodity";
  import {deleteOrder, getPrint, listLogisticsOrderRecord, queryByWaybillNo} from '@/api/basedata/logisticsOrderRecord';
  import {CommodityVO} from "@/api/order/commodity/types";
  import {ElMessageBox} from "element-plus";
  import {AddressVO} from "@/api/basedata/address/types";
  import {postlistAddress} from "@/api/basedata/address";
  import {addCustomerAddress, listCustomerAddressByCusId, updateCustomerAddress} from '@/api/basedata/customerAddress';
  import {CustomerAddressForm, CustomerAddressQuery} from "@/api/basedata/customerAddress/types";

const deliverCardRef = ref();

const deliverInfo = ref<any>();
const cardRef = ref();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { delivery_record_type } = toRefs<any>(proxy?.useDict('delivery_record_type'));

const deliveryRecordList = ref<DeliveryRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const orderLoading = ref(false);
const ids = ref<Array<string | number>>([]);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deliveryRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeliveryRecordForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  //订单发货类型
  type: '0',
  quantity: undefined,
  code: undefined,
  customerCode: undefined,
  customerName: undefined,
  cusAddress: undefined,
  tableOrderList: [],
  deliveryRecordBoList: [],
  fileList: [],
}

const initLogisticsData: any = {
  senderName:undefined,
  senderPhone:undefined,
  senderAddress:undefined,
  receiverName:undefined,
  receiverPhone:undefined,
  receiverAddress:undefined,
  goodsName:undefined,
  serviceMode:20,
  dismantling: 10,
  goodsTime: dayjs(new Date()).add(1, 'hour').format("YYYY-MM-DD HH:mm"),
  receipt: '1',
  receiptFlag: 10,
  receiptParams:[1,2,7]
}

const data = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    //订单发货类型
    type: '0',
    quantity: undefined,
    bizid: undefined,
    code: undefined,
    isCallback: undefined,
    params: {
    }
  },
  rules: {
    deliveryTime: [
      { required: true, message: "送货时间不能为空", trigger: "change" }
    ],
    cusAddress: [
      {required: true, message: "送货地址不能为空", trigger: "change"}
    ]
  }
});

const signData = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: '0',
    isCallback: undefined,
    params: {
    }
  },
  rules: {
  }
});
const waitSignData = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: '0',
    isCallback: undefined,
    params: {
    }
  },
  rules: {
  }
});

const changeLogNoData = reactive<PageData<DeliveryRecordForm, DeliveryRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    type: '0',
    isCallback: undefined,
    params: {
    }
  },
  rules: {
    logisticsNo: [
      { required: true, message: "物流单号不能为空", trigger: "change" }
    ],
    logisticsCompany: [
      { required: true, message: "物流公司不能为空", trigger: "change" }
    ],
    fileList: [
      { required: true, message: "物流凭证不能为空", trigger: "change" }
    ]
  }
});

const logisticsData = reactive<PageData<any, any>>({
  form: { ...initLogisticsData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    companyCode: "SFEXPRESS",
    params: {
    }
  },
  rules: {
    senderName: [
      { required: true, message: "寄件人姓名不能为空", trigger: "change" }
    ],
    senderPhone: [
      { required: true, message: "寄件人电话不能为空", trigger: "change" }
    ],
    senderAddress: [
      { required: true, message: "寄件人地址不能为空", trigger: "change" }
    ],
    receiverName: [
      { required: true, message: "收件人姓名不能为空", trigger: "change" }
    ],
    receiverPhone: [
      { required: true, message: "收件人电话不能为空", trigger: "change" }
    ],
    receiverAddress: [
      { required: true, message: "收件人地址不能为空", trigger: "change" }
    ],
    goodsName: [
      { required: true, message: "货物名称不能为空", trigger: "change" }
    ],
    serviceMode: [
      { required: true, message: "服务方式不能为空", trigger: "change" }
    ],
    count: [
      { required: true, message: "数量不能为空", trigger: "change" }
    ],
    weight: [
      { required: true, message: "重量不能为空", trigger: "change" }
    ],
    dismantling:[
      { required: true, message: "是否预约取货不能为空", trigger: "change" }
    ],
    goodsTime:[
      // { required: true, message: "是否预约取货不能为空", trigger: "change" }
      {
        required:true,
        validator: (rule, value, callback) => {
          if (new Date(value).getTime() < new Date().getTime()) {
            callback(new Error( '取货时间必须输入大于当前时间'));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
    ],
    receiptFlag:[
      { required: true, message: "回单类型不能为空", trigger: "change" }
    ],
    receiptParams:[
      { required: true, message: "回单类型不能为空", trigger: "change" }
    ],
    receipt:[
      { required: true, message: "回单类型不能为空", trigger: "change" }
    ]
  }
});

const {rules: logisticsRules, form: logisticsForm,queryParams: logisticsQueryParams} = toRefs(logisticsData);

  const initAddressFormData: CustomerAddressForm = {
    name: undefined,
    phone: undefined,
    address: undefined,
    logisticsCycle: undefined,
  };
  const addressData = reactive<PageDataAddress<CustomerAddressForm, CustomerAddressQuery>>({
    formAddress: {...initAddressFormData},
    queryParamsAddress: {
      pageNum: 1,
      pageSize: 20,
      customerId: undefined,
      name: undefined,
      phone: undefined,
      address: undefined,
      params: {}
    },
    rulesAddress: {
      name: [
        {required: true, message: "联系人不能为空", trigger: "blur"}
      ],
      phone: [
        {required: true, message: "电话不能为空", trigger: "blur"}
      ],
      address: [
        {required: true, message: "联系地址不能为空", trigger: "blur"}
      ],
      logisticsCycle: [
        {required: true, message: "物流周期不能为空", trigger: "blur"}
      ]
    }
  });

  const {queryParamsAddress, formAddress, rulesAddress} = toRefs(addressData);

//=列表校验
const validRules = ref<VxeTablePropTypes.EditRules<DeliveryRecordVO>>({
  shipQuantity: [
    { required: true, message: "发货数量不能为空", trigger: "blur" }
  ],
  // reserveQuantity: [
  //   { required: true, message: "备品数量不能为空", trigger: "blur" }
  // ]
})
const { queryParams, form: tabForm, rules } = toRefs(data);
const { queryParams:waitSignQueryParams } = toRefs(waitSignData);
const { queryParams:signQueryParams } = toRefs(signData);
const { rules:logNoRules } = toRefs(changeLogNoData);

const radioTable = ref('待发货列表');
const orderTable = ref('SFEXPRESS');
const intervalCondition = ['accountMonth', 'endTime', 'deliveryTime'];
const orderFilinOutList = ref<DeliveryRecordVO[]>([]);
const orderFilinOutWaitList = ref<DeliveryRecordVO[]>([]);
const orderFilinOutAduitList = ref<DeliveryRecordVO[]>([]);
const tabOrderList = ref<DeliveryRecordVO[]>([]);
const logOrderList = ref<any[]>([]);
const selfAddressList = ref<AddressVO[]>([]);
const customerAddressList = ref<AddressVO[]>([]);
const checkedOrderList = ref<DeliveryRecordVO[]>([]);
const logisticsCompanyList = ref();
const waitTotal = ref(0);
const aduitTotal = ref(0);
const orderTotal = ref(0);
const cusTotal = ref(0);
const drawer = reactive<DialogOption>({ visible: false, title: '' });
const ppppdrawer = reactive<DialogOption>({ visible: false, title: '' });
const XTableRef = ref<ElFormInstance>();
const checkCustomer = ref("");
const orderFormRef = ref<ElFormInstance>();
const orderFormRef2 = ref<ElFormInstance>();
const tabTable = ref<ElFormInstance>();
const dialogTableLoading = ref(false);
const updateLogNoDrawer = reactive<DialogOption>({ visible: false, title: '' });
const logisticsDrawer = reactive<DialogOption>({ visible: false, title: '' });
const logisticsOrderDrawer = reactive<DialogOption>({ visible: false, title: '' });
const addressDrawer = reactive<DialogOption>({ visible: false, title: '' });
const logisticsFormRef = ref<ElFormInstance>();

const customerCodeList=ref();

const columnList = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '50', fixed: 'left', },
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '客户编码', field: 'customerCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '销售单号', field: 'saleOrderNo', width: '110', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '客户PO', field: 'customerPo', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '产品名称', field: 'commodityName', width: '150', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板材', width: '110', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '单位', width: '60', field: 'unit', align: 'center' },
  { title: '订货数量', width: '80', field: 'orderQuantity', align: 'center', },
  { title: '库存数量', width: '80', field: 'inventoryQuantity', align: 'center', },
  // { title: '退货数量', width: '100', field: 'returnQuantity', align: 'center', },
  //{ title: '已发数量', width: '80', field: 'deliveryQuantity', align: 'center' },
  { title: '关联物流数量', width: '80', field: 'relateDeliveryQuantity', align: 'center' },
  { title: '未关联物流数量', width: '80', field: 'unRelateDeliveryQuantity', align: 'center' },
  { title: '待发数量', width: '80', field: 'waitDeliveryQuantity', align: 'center' },
  { title: '要求交期', width: '130', field: 'deliveryTime', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD 00:00:00'  }   },
  { title: '送货地址',  field: 'cusAddress', align: 'center', filterType: 'input', filterParam: { placeholder: '' }   },
]);
const columnList2 = ref([
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '操作', field: 'make', align: 'center', width: '360', fixed: 'right', showOverflow: false },
  { title: '送货单号', field: 'code', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '开单人', field: 'createByName', width: '60', align: 'center', },
  { title: '客户编码', field: 'customerCode', width: '60', align: 'center', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
  { title: '销售单号', field: 'saleOrderNo', width: '100', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '客户PO', field: 'customerPo', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
  { title: '产品名称', field: 'commodityName', width: '180', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板材', width: '80', field: 'materialQuality', align: 'center' ,filterType: 'input'},
  { title: '单位', width: '60', field: 'unit', align: 'center' },
  { title: '订货数量', width: '100', field: 'orderQuantity', align: 'center', },
  { title: '送货数量', width: '100', field: 'deliveryQuantity', align: 'center' },
  { title: '备品数量', width: '100', field: 'reserveQuantity', align: 'center' },
  // { title: '退货数量', width: '100', field: 'returnQuantity', align: 'center', },
  { title: '待发数量', width: '100', field: 'waitDeliveryQuantity', align: 'center' },
  { title: '库存数量', width: '100', field: 'inventoryQuantity', align: 'center', },
  { title: '物流公司', width: '100', field: 'logisticsCompany', align: 'center' },
  { title: '物流单号', width: '100', field: 'logisticsNo', align: 'center' },
  { title: '要求交期', width: '100', field: 'deliveryTime', align: 'center',filterType: 'intervalDate', filterParam: { placeholder: '', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD 00:00:00'  }   },
  { title: '送货地址',  width: '240', field: 'cusAddress', align: 'center', filterType: 'input', filterParam: { placeholder: '' }  },
  { title: '开单时间', width: '130', field: 'createTime', align: 'center' },
  { title: '备注', width: '180', field: 'remark', align: 'center' },
]);

const orderColumnList = ref([
  { title: '序号', width: '50', type: 'seq', visible: true, align: 'center', fixed: 'left' },
  { title: '操作', field: 'make', align: 'center', width: '80', fixed: 'right', showOverflow: false },
  { title: '销售单号', field: 'saleOrderNo', width: '100', align: 'center' },
  { title: '产品编码', field: 'commodityCode', width: '120', align: 'center' },
  { title: '客户PO', field: 'customerPo', width: '100', align: 'center' },
  { title: '产品名称', field: 'commodityName', width: '100', align: 'center' },
  { title: '板材', width: '80', field: 'materialQuality', align: 'center' },
  { title: '单位', width: '80', field: 'unit', align: 'center' },
  { title: '订单数量', width: '80', field: 'orderQuantity', align: 'center', },
  //{ title: '已发数量', width: '80', field: 'deliveryQuantity', align: 'center' },
  { title: '关联物流数量', width: '80', field: 'relateDeliveryQuantity', align: 'center' },
  { title: '未关联物流数量', width: '80', field: 'unRelateDeliveryQuantity', align: 'center' },
  // { title: '退货数量', width: '80', field: 'returnQuantity', align: 'center', },
  { title: '库存数量', width: '80', field: 'inventoryQuantity', align: 'center', },
  { title: '尾数库存', width: '80', field: 'mantissaQuantity', align: 'center', },
  { title: '发货数量', width: '140', field: 'shipQuantity', align: 'center', editRender: {} },
  { title: '备品数量', width: '140', field: 'reserveQuantity', align: 'center', editRender: {} },
  { title: '差欠数量', width: '80', field: 'waitDeliveryQuantity', align: 'center', },
  { title: '箱数', width: '140', field: 'caseNum', align: 'center', editRender: {} },
  { title: '要求交期', width: '140', field: 'deliveryTime', align: 'center' },
  { title: '备注', width: '180', field: 'remark', align: 'center', editRender: {} },
]);

  const customerColumnList = ref([
    { type: 'radio', align: 'center', width: '60' },
    { title: '联系人', field: 'name', width: '100', align: 'center'},
    { title: '联系电话', field: 'phone', width: '120', align: 'center'},
    { title: '联系地址', field: 'address', align: 'center'},
  ]);

  const goodsOptions = ref([
      {
        "id": 362,
        "subCode": "084001",
        "subName": "文件"
      },
      {
        "id": 363,
        "subCode": "084002",
        "subName": "数码产品"
      },
      {
        "id": 364,
        "subCode": "084003",
        "subName": "五金"
      },
      {
        "id": 365,
        "subCode": "084004",
        "subName": "服饰"
      },
      {
        "id": 366,
        "subCode": "084005",
        "subName": "食品"
      },
      {
        "id": 367,
        "subCode": "084006",
        "subName": "日用品"
      },
      {
        "id": 368,
        "subCode": "084007",
        "subName": "医药类产品"
      },
      {
        "id": 369,
        "subCode": "084008",
        "subName": "皮革"
      },
      {
        "id": 370,
        "subCode": "084009",
        "subName": "布料"
      },
      {
        "id": 371,
        "subCode": "084010",
        "subName": "其它"
      }
    ]
  )

  const getGoods = async ()=>{
    const goods:any = goodsOptions.value.find(v=> v.subName == logisticsForm.value.goodsName);
    logisticsForm.value.goodsCode = goods.subCode;
  }


  const serviceOptions = ref([
    { id: 10, value: 10, label: '当天达' },
    { id: 20, value: 20, label: '次日达' },
    { id: 30, value: 30, label: '隔日达' },
    { id: 40, value: 40, label: '陆运件' },
    { id: 50, value: 50, label: '同城次日' },
    { id: 70, value: 70, label: '同城即日' },
    { id: 160, value: 160, label: '省内次日' },
    { id: 170, value: 170, label: '省内即日' },
    { id: 210, value: 210, label: '空运' },
    { id: 220, value: 220, label: '专运' }
  ])

  const receiptOptions = ref([
    { id: 10, value: 10, label: '回单原件（含回单照片）' },
    { id: 20, value: 20, label: '无需回单' },
    { id: 30, value: 30, label: '回单照片' },
    { id: 40, value: 40, label: '电子回单' },
  ])

  const sfReceiptOptions = ref([
    { id: 1, value: 1, label: '签名' },
    { id: 2, value: 2, label: '盖章' },
    { id: 3, value: 3, label: '登记身份证号' },
    { id: 4, value: 4, label: '收取身份证复印件' },
    { id: 5, value: 5, label: '【收取派件存根】(香港专用） 【其他文件】(香港专用）' },
    { id: 7, value: 7, label: '【签收日期】' },
    { id: 8, value: 8, label: '【电话号码】' },
  ])

  let itemCompany = ref();

  const custLoading = ref(true);
  const addressParams:any = ref({});

  const openAddress = async () => {
    await getSelfList();
    addressDrawer.visible = true;
  }

  const confirmAddress = async () => {
    if(!selectAddressVo.value){
      proxy?.$modal.msgWarning("请选择地址");
      return;
    }
    logisticsForm.value.senderAddress = selectAddressVo.value.address
    logisticsForm.value.senderPhone =  selectAddressVo.value.phone
    logisticsForm.value.senderName =  selectAddressVo.value.name
    selectAddressVo.value = undefined;
    addressDrawer.visible = false;
  }

  const custQueryParams = ref({
    pageSize:20,
    pageNum:1,
  })

  /** 查询本厂地址列表 */
  const getSelfList = async () => {
    custLoading.value = true;
    addressParams.value.type = '2';
    addressParams.value.customerName=undefined;
    addressParams.value.customerCode=undefined;
    const res = await postlistAddress(addressParams.value);
    selfAddressList.value = res.rows?.filter(v=>v.status==1);
    cusTotal.value = res.total;
    custLoading.value = false;
  }

  /*查询客户地址*/
  const getCusList = async (customerId:any)=>{
    const res = await listCustomerAddressByCusId(customerId);
    customerAddressList.value = res;
  }

  const selectAddress = async (value:any)=>{

    const selectedOption = customerAddressList.value.find(option => option.id === value);
    console.log( selectedOption);
    tabForm.value.cusAddress = selectedOption.address;
    tabForm.value.cusName = selectedOption.name;
    tabForm.value.cusPhone = selectedOption.phone;
  }

  const addressDialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  const customerAddressFormRef = ref<ElFormInstance>();

  //新增地址按钮操作
  const handleAddAddress = () => {
    addressDialog.title = "添加地址";
    addressDialog.visible = true;
  };

  const resetAddress = () => {
    formAddress.value = {...initAddressFormData};
    customerAddressFormRef.value?.resetFields();
  };

  const cancelAddress = () => {
    resetAddress();
    addressDialog.visible = false;
  };

  //地址提交
  const submitAddress = () => {
    customerAddressFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        formAddress.value.type = '1';
        formAddress.value.customerId = tabForm.value.customerId;
        if (customerAddressList.value.length == 0) {
          formAddress.value.isDefault = 1;
        } else {
          formAddress.value.isDefault = 0;
        }
        await addCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
        proxy?.$modal.msgSuccess("操作成功");
        addressDialog.visible = false;
        resetAddress();
        getCusList(tabForm.value.customerId);
      }
    });
  };

  const openLogistics = async () => {
    logisticsForm.value = {...initLogisticsData}
    logisticsForm.value.receiverAddress = tabForm.value.cusAddress
    logisticsForm.value.receiverPhone =  tabForm.value.cusPhone
    logisticsForm.value.receiverName =  tabForm.value.cusName

    if(selfAddressList.value && selfAddressList.value.length>0){
      logisticsForm.value.senderAddress = selfAddressList.value[0].address
      logisticsForm.value.senderPhone =  selfAddressList.value[0].phone
      logisticsForm.value.senderName =  selfAddressList.value[0].name
    }
    if (!tabForm.value.logisticsCompany) {
      proxy?.$modal.msgWarning("请先选择物流公司");
      return;
    }
    const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.fullName == tabForm.value.logisticsCompany);
    if (!currentCompany) {
      proxy?.$modal.msgWarning("此物流公司暂时无法直接下单");
      return;
    }
    if(!currentCompany.name.includes("联昊通")){
      logisticsForm.value.goodsName = 'pcb';
    } else {
      logisticsForm.value.goodsCode = '084002';
      logisticsForm.value.goodsName = '数码产品';
    }
    itemCompany.value = currentCompany;
    if(tabForm.value.logisticsNo){
      const res = await queryByWaybillNo(tabForm.value.logisticsNo);
      logisticsForm.value = deepClone(res.data);
    }
    logisticsDrawer.visible = true;
  }

  let logisticsDisabled = ref(false);

  const submitOrder = async () => {
    logisticsFormRef.value?.validate(async (valid: boolean) => {
      console.log(valid)
      if(!valid){
        return;
      }
      orderLoading.value = true;
      buttonLoading.value = true;
      const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.fullName == tabForm.value.logisticsCompany);
      const contactInfoList = [
        {
          contactType: 1,
          contact: logisticsForm.value.senderName,
          tel: logisticsForm.value.senderPhone,
          country: "CN",
          address: logisticsForm.value.senderAddress,
        }, {
          contactType: 2,
          contact: logisticsForm.value.receiverName,
          tel: logisticsForm.value.receiverPhone,
          country: "CN",
          address: logisticsForm.value.receiverAddress,
        }
      ]
      const cargoDetails = [{
        name: logisticsForm.value.goodsName,
        goodsCode: logisticsForm.value.goodsCode,
        count: logisticsForm.value.count || 0,
        weight: logisticsForm.value.weight || 0,
      }]
      const info = {
        type: currentCompany.code,
        contactInfoList: contactInfoList,
        cargoDetails: cargoDetails,
        serviceMode: logisticsForm.value.serviceMode,
        dismantling: logisticsForm.value.dismantling,
        goodsTime: logisticsForm.value.goodsTime,
        receipt: logisticsForm.value.receipt,
        receiptFlag: logisticsForm.value.receiptFlag,
        receiptParams:logisticsForm.value.receiptParams,
        remark: logisticsForm.value.remark,
      }
      console.log(info);
      const res = await createOrder(info).finally(()=>{
        buttonLoading.value = false;
        orderLoading.value = false;
      });
      if (res.code == 200) {
        tabForm.value.logisticsNo = res.msg;
        tabForm.value.phoneNumber = logisticsForm.value.receiverPhone;
        const res2 = await queryByWaybillNo(tabForm.value.logisticsNo);
        logisticsForm.value = deepClone(res2.data);
        tabForm.value.logisticsOrderId = logisticsForm.value?.id;
        logisticsDisabled.value = true;
        logisticsDrawer.visible = false;
      }
    });
  }

  const delLogistics = async () => {
    buttonLoading.value = true;
    const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.fullName == tabForm.value.logisticsCompany);
    const hVnode = h('p', null, [
      h('span', null, '确定要取消在【'),
      h('span', {style: 'color: red;font-weight: 700;'}, currentCompany.fullName),
      h('span', null, '】下的物流单【 '),
      h('span', {style: 'color: red;font-weight: 700;'}, tabForm.value.logisticsNo),
      h('span', null, '】吗？'),
    ])
    await proxy?.$modal.confirm(hVnode,{customStyle:{'min-width':"500px"}}).finally(()=>{buttonLoading.value = false});
    const res = await deleteOrder({id:logisticsForm.value.id,expressType:currentCompany.code}).finally(()=>{buttonLoading.value = false});
    const result = JSON.parse(res.msg)
    let reason = "";
    console.log(result)
    if(currentCompany.code == "SFEXPRESS"){
      if (!result.success) {
        reason = result.errorMsg;
      }
    } else if(currentCompany.code == "KYEXPRESS"){
      if(!result.success){
        reason = result.msg;
      }
    } else if(currentCompany.code == "LTS"){
      if(result.code != 200){
        reason = result.msg;
      }
    }
    logisticsForm.value.errorMsg = reason;
  }

  const logOrderColumnList = ref([
    { type: 'radio', align: 'center', width: '60' },
    { title: '快递单号', field: 'waybillNo', width: '150', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
    { title: '快递下单时间', field: 'createTime', width: '150', align: 'center' },
    { title: '送货单号', field: 'deliveryCode', align: 'center',filterType: 'input', filterParam: { placeholder: '' } },
    { title: '送货单创建时间', field: 'deliveryTime', align: 'center' },
  ]);

  const relLogistics = async () => {
    logisticsQueryParams.value.waybillNo = undefined;
    await getLogList();
    selectLogVo.value = undefined;
    logisticsOrderDrawer.visible = true;
  }

  const selectLogVo = ref();

  const radioChangeEvent: VxeTableEvents.RadioChange<CommodityVO> = ({ checked, row }) => {
    selectLogVo.value = row;
  }

  const selectAddressVo = ref();

  const addressChangeEvent: VxeTableEvents.RadioChange<CommodityVO> = ({ checked, row }) => {
    selectAddressVo.value = row;
  }

  // 切换菜单栏 ***********
  const orderTableHandle = async (tab: any, event: any) => {
    orderTable.value = tab
    logisticsQueryParams.value.companyCode = orderTable.value;
    await getLogList();
  }

  const getLogList = async () => {
    const res = await listLogisticsOrderRecord(logisticsQueryParams.value)
    logOrderList.value = res.rows;
    logOrderList.value.forEach((item) => {
      const code = item.deliveryList?.map((vo) => {
        return vo.code
      }).join('/');
      item.deliveryCode = code;
      const time = item.deliveryList?.map((vo) => {
        return vo.createTime
      }).join('/');
      item.deliveryTime = time;
    })
  }

  const confirmRelation = async () => {
    buttonLoading.value = true;
    if(!selectLogVo.value){
      proxy?.$modal.msgWarning("请选择快递单");
      buttonLoading.value = false;
      return;
    }
    if(selectLogVo.value.deliveryCode){
      await proxy?.$modal.confirm('此物流单号【' + selectLogVo.value.waybillNo + '】已关联送货单【' + selectLogVo.value.deliveryCode + '】，是否仍要关联？').finally(() => buttonLoading.value = false);
    }
    logisticsForm.value = selectLogVo.value;
    tabForm.value.logisticsNo =logisticsForm.value?.waybillNo;
    tabForm.value.phoneNumber = logisticsForm.value?.receiverPhone;
    tabForm.value.logisticsOrderId = logisticsForm.value?.id;
    const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.code == orderTable.value);
    tabForm.value.logisticsCompany = currentCompany.fullName;
    logisticsDisabled.value = true;
    logisticsOrderDrawer.visible = false;
    buttonLoading.value = false;
  }

  const cancelRelation = async () => {
    buttonLoading.value = true;
    const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.fullName == tabForm.value.logisticsCompany);

    logisticsQueryParams.value.waybillNo = tabForm.value.logisticsNo;
    logisticsQueryParams.value.companyCode = currentCompany.code;
    await getLogList();
    console.log(logOrderList.value)
    if(logOrderList.value.length > 0 && !logOrderList.value[0].deliveryCode?.includes("/")){
      ElMessageBox.confirm(
        '取消关联时，【'+ currentCompany.fullName +'】公司的物流订单是否同步取消？',
        '提示',
        {
          confirmButtonText: '同步取消物流订单',
          cancelButtonText: '只取消关联',
          distinguishCancelAndClose: true,
          type: 'warning',
        }
      ).then(()=>{
        deleteOrder({id:tabForm.value.logisticsOrderId,expressType:currentCompany.code}).then((res)=>{
          const result = JSON.parse(res.msg)
          let reason = "";
          console.log(result)
          if(currentCompany.code == "SFEXPRESS"){
            if (!result.success) {
              reason = result.errorMsg;
            }
          } else if(currentCompany.code == "KYEXPRESS"){
            if(!result.success){
              reason = result.msg;
            }
          } else if(currentCompany.code == "LTS"){
            if(result.code != 200){
              reason = result.msg;
            }
          }
          if (reason == "") {
            proxy?.$modal.msgSuccess("取消关联成功成功");
            return;
          }
          ElMessage({
            dangerouslyUseHTMLString: true,
            type: 'info',
            duration: 3000,
            offset: 24,
            showClose: true,
            message: '物流单取消失败【<span style="color:#F56C6C;">' + reason + '</span>】，请至' + '<a style="color: #457AF7;" href="' + currentCompany.website + '" target="_blank">【' + currentCompany.fullName + '】</a>平台或致电【 '+currentCompany.phone + '】手动取消物流单。',
          })
        }).finally(() => {
          buttonLoading.value = false;
          tabForm.value.logisticsNo =undefined;
          tabForm.value.phoneNumber = undefined;
          tabForm.value.logisticsOrderId = undefined;
          tabForm.value.logisticsCompany = undefined;
          logisticsDisabled.value = false;
          if(updateLogNoDrawer.visible){
            submitUpdateLogNoForm(true);
          }
        });
      }).catch((action: any) =>{
        console.log(action);
        if(action === 'cancel'){
          tabForm.value.logisticsNo =undefined;
          tabForm.value.phoneNumber = undefined;
          tabForm.value.logisticsOrderId = undefined;
          tabForm.value.logisticsCompany = undefined;
          logisticsDisabled.value = false;
          if(updateLogNoDrawer.visible){
            submitUpdateLogNoForm(true);
          }
          proxy?.$modal.msgSuccess("取消关联成功成功");
        }
      }).finally(() => buttonLoading.value = false);
    } else {
      ElMessageBox.confirm(
        '是否确认取消关联物流单？',
        '提示',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          distinguishCancelAndClose: true,
          type: 'warning',
        }
      ).then(()=>{
        tabForm.value.logisticsNo =undefined;
        tabForm.value.phoneNumber = undefined;
        tabForm.value.logisticsOrderId = undefined;
        tabForm.value.logisticsCompany = undefined;
        logisticsDisabled.value = false;
        if(updateLogNoDrawer.visible){
          submitUpdateLogNoForm(true);
        }
        proxy?.$modal.msgSuccess("取消关联成功成功");
      }).finally(() => buttonLoading.value = false);
    }
  }

  const printLogisitics = async ()=>{
    buttonLoading.value = true;
    reportDrawer.title = "快递面单预览";
    reportDrawer.visible = true;
    orderLoading.value = true;
    const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.fullName == tabForm.value.logisticsCompany);
    const res = await getPrint({"waybillNo": tabForm.value.logisticsNo, "expressType": currentCompany.code}).finally(buttonLoading.value = false);
    // let url = 'https://api-uat.kyeapi.com/router/download/ic_print_file/KY5000299185821_1730773157194/uj5c7a08238a6b49998c2b73040633b889?params=de3c41f0deb7b24e467b98e65803f253';
    let url:any;
    if(currentCompany.name.includes("跨越")){
      url = res.msg + "&inline=true";
    } else if(currentCompany.name.includes("顺丰")){
     url = "data:application/pdf;base64," + res.msg;
    }
    reportUrl.value = url;
    orderLoading.value = false;
  }


/** 是否禁选 */
const selectableFun = (scope: any) => {
  //当前选择客户与已选择客户不一致时，禁选
  if (checkCustomer.value && scope.row.customerCode != checkCustomer.value) {
    return false;
  }
  return true;
}
const selectChangeEvent: VxeTableEvents.CheckboxAll<DeliveryRecordVO> = async () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxRecords();
    const reserveSelect = tableRef.getCheckboxReserveRecords();
    checkedOrderList.value = selectRecords.map((item: any) => item);
    // console.log(selectRecords, reserveSelect)
    if (reserveSelect?.length) {
      checkedOrderList.value = checkedOrderList.value.concat(reserveSelect)
    }
  }
  console.log("checkedOrderList.value", checkedOrderList.value);
  let isDiff = true;
  if (checkedOrderList.value && checkedOrderList.value.length > 0) {
    const custCode = checkedOrderList.value[0].customerCode;
    if (checkCustomer.value == custCode) {
      isDiff = false
    }
    checkCustomer.value = checkedOrderList.value[0].customerCode;
    // queryParams.value.customerCode = checkCustomer.value;
    let searchTempList = [{field: 'customerCode', defaultValue: checkCustomer.value}]
    let tempAddress = checkedOrderList.value[0].cusAddress && checkedOrderList.value[0].cusAddress.trim()
    if (tempAddress) {
      searchTempList.push({field: 'cusAddress', defaultValue: checkedOrderList.value[0].cusAddress})
    }
    if (!queryParams.value?.customerCode) {
      queryParams.value.pageNum = 1
    }
    XTableRef.value.filterFieldEvent(searchTempList)
  } else {
    if (checkCustomer.value == "") {
      isDiff = false
    }
    checkCustomer.value = "";
    // queryParams.value.customerCode = undefined;
    queryParams.value.pageNum = 1
    XTableRef.value.delFilterField(['customerCode','cusAddress'])
    checkedOrderList.value=[];
  }
  //切换客户时，刷新列表
  if (isDiff) {
    //tableRef.setFilter("customerCode", [queryParams.value.customerCode]);
    // tableRef.updateData();
    // console.log("tableRef.setFilter",tableRef.getCheckedFilters());
    //await getList();
    //tableRef.setCheckboxRow(checkedOrderList.value, true);
  }
}
const drawerCancel = () => {
  console.log("drawerCancel")
  // checkedOrderList.value = [];
  drawer.visible = false;
}

const handleUpdateLogNo = async (row?: DeliveryRecordVO) => {
  reset();
  let checkCust = row;
  console.log("checkCust ", checkCust);
  Object.assign(tabForm.value, row);
  getCusList(row.customerId);
  updateLogNoDrawer.visible = true;
  updateLogNoDrawer.title = "修改送货单物流信息";
  dialogTableLoading.value = true
  let mainDeliverInfo=await getDeliveryRecordByCode(row.code);
  console.log("mainDeliver ", mainDeliverInfo);
  let mainDeliver = mainDeliverInfo.data
  mainDeliver.detailList.forEach((item: any) => {
    const qry = item.quantity;
    item.quantity = item.orderQuantity;
    item.remainQuantity = item.waitDeliveryQuantity;
    item.shipQuantity = qry;
  });

  tabForm.value = mainDeliver;
  tabForm.value.cusName = row.cusName;
  tabForm.value.cusPhone = row.cusPhone;
  tabOrderList.value = mainDeliver.detailList;
  dialogTableLoading.value = false
}

const headleDetail = async (row?: DeliveryRecordVO) => {
  reset();
  let checkCust = row;
  console.log("checkCust ", checkCust);
  Object.assign(tabForm.value, row);
  getCusList(row.customerId);
  drawer.visible = true;
  drawer.title = "送货单详情";
  dialogTableLoading.value = true
  let mainDeliverInfo=await getDeliveryRecordByCode(row.code);
  console.log("mainDeliver ", mainDeliverInfo);
  let mainDeliver = mainDeliverInfo.data
  mainDeliver.detailList.forEach((item: any) => {
    const qry = item.quantity;
    item.quantity = item.orderQuantity;
    item.remainQuantity = item.waitDeliveryQuantity;
    item.shipQuantity = qry;
  });

  tabForm.value = mainDeliver;
  tabOrderList.value = mainDeliver.detailList;
  dialogTableLoading.value = false
}

const handleAdd = async() => {
  if (!checkedOrderList.value || checkedOrderList.value.length == 0) {
    proxy?.$modal.msgWarning("请选择单据");
    return;
  }
  checkedOrderList.value;
  reset();
  //如果列表中客户id和地址不一样则报错
  let chcc=true;
  checkedOrderList.value.forEach((item: any) => {
    if (item.customerCode != checkedOrderList.value[0].customerCode||item.cusAddress != checkedOrderList.value[0].cusAddress) {
      chcc=false;
      return;
    }
  });
  if(!chcc){
    proxy?.$modal.msgError("请选择同一客户、地址的单据");
    return;
  }
  tabOrderList.value = []
  tabOrderList.value = deepClone(checkedOrderList.value);
  let checkCust = tabOrderList.value[0];
  //checkedOrderList.value
  console.log("checkCust ", checkCust);
  tabForm.value.customerCode = checkCust.customerCode;
  tabForm.value.customerName = checkCust.customerName;
  tabForm.value.cusAddress = checkCust.cusAddress;
  tabForm.value.cusName = checkCust.cusName;
  tabForm.value.cusPhone = checkCust.cusPhone;
  tabForm.value.addressId = checkCust.addressId;
  tabForm.value.customerId = checkCust.customerId;
  tabForm.value.deliveryTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let refreshList:any=[];
  buttonLoading.value = true;
  refreshList = await getRefreshDeliveryInfoList({saleIds: checkedOrderList.value.map((item: any) => item.saleId)}).finally(() => { buttonLoading.value = false; });
  tabOrderList.value.forEach((item: any) => {
    item.type = DeliveryRecordTypeEnum.ORDER;
    item.remark = "";
    item.id=undefined;
    if(refreshList&&refreshList.length>0){
      refreshList.forEach((refreshObj:any)=>{
        if(item.saleId==refreshObj.id){
          item.deliveryQuantity=refreshObj.deliveryQuantity;
          item.waitDeliveryQuantity=refreshObj.waitDeliveryQuantity;
          item.inventoryQuantity=refreshObj.inventoryQuantity;
          item.mantissaQuantity = refreshObj.mantissaQuantity;
        }
      });
    }
  });
  console.log("tabOrderList",tabOrderList.value);
  getCusList(tabForm.value.customerId);
  drawer.visible = true;
  drawer.title = "生成送货单";
}

/** 删除按钮操作 */
const handleTabDelete = async (row?: DeliveryRecordVO) => {
  const _ids = row?.saleId || ids.value;
  await proxy?.$modal.confirm('是否确认删除销售单号为"' + row.saleOrderNo + '"的数据项？').finally(() => loading.value = false);
  tabOrderList.value = tabOrderList.value.filter((item: any) => item.saleId != _ids);
  proxy?.$modal.msgSuccess("删除成功");
}

// 切换菜单栏 ***********
const radioTableHandle = async (tab: any, event: any) => {
  console.log("tab.", tab.props.label);
  radioTable.value = tab.props.label;
  queryParams.value.customerCode = undefined;
  queryParams.value.pageNum=1;
  queryParams.value.pageSize=20;

  if (radioTable.value == "待发货列表") {
    queryParams.value.isCallback = undefined;
    await getList();
  } else if (radioTable.value == "已回签列表") {
    queryParams.value.isCallback = "1";
    await getSignList();
  } else if (radioTable.value == "待回签列表") {
    queryParams.value.isCallback = "0";
    await getWaitList();
  }

}
const searchChange = async(params: any) => {
  // const tempOldParams = deepClone(params)
  // const tempOldQuery = deepClone(queryParams.value)
  // console.log("searchChange", params, tempOldQuery);
  // if ((!tempOldParams?.customerCode && tempOldQuery?.customerCode) && (!tempOldParams?.cusAddress && tempOldQuery?.cusAddress)) {
  //   XTableRef.value.xTableRef.clearCheckboxRow()
  //   XTableRef.value.xTableRef.clearCheckboxReserve()
  //   // return
  // }
  queryParams.value = {...params, type: '0'}
  if (!queryParams.value?.customerCode && !queryParams.value?.cusAddress) {
    if (XTableRef.value) {
      checkCustomer.value = undefined
      checkedOrderList.value = []
      XTableRef.value.xTableRef.clearCheckboxRow()
      XTableRef.value.xTableRef.clearCheckboxReserve()
    }
  }

  if (radioTable.value == "待发货列表") {
    await getList();
  } else if (radioTable.value == "已回签列表") {
    await getSignList();
  } else if (radioTable.value == "待回签列表") {
    await getWaitList();
  }

}

const unSignSearchChange = async(params: any) => {
    waitSignQueryParams.value = {...params, type: '0'}
    await getWaitList();
}

const signSearchChange = async(params: any) => {
    signQueryParams.value = {...params, type: '0'}
    await getSignList();
}

  const orderSearchChange = async(params: any) => {
    logisticsQueryParams.value.companyCode = orderTable.value
    logisticsQueryParams.value = {...params}
    await getLogList();
  }
/** 查询发货记录列表 */
const getWaitList = async () => {
  loading.value = true;
  waitSignQueryParams.value.isCallback = "0";
  waitSignQueryParams.value.customerCodeIdList = waitSignQueryParams.value.customerCode;
  waitSignQueryParams.value.customerCode=undefined;
  const res = await postListSignDeliveryRecord(waitSignQueryParams.value);
  orderFilinOutWaitList.value = res.rows;
  waitTotal.value = res.total;
  loading.value = false;
}
/** 查询发货记录列表 */
const getSignList = async () => {
  loading.value = true;
  signQueryParams.value.isCallback = "1";
  signQueryParams.value.customerCodeIdList = signQueryParams.value.customerCode;
  signQueryParams.value.customerCode=undefined;
  const res = await postListSignDeliveryRecord(signQueryParams.value);
  orderFilinOutAduitList.value = res.rows;
  aduitTotal.value = res.total;
  loading.value = false;
}
/** 查询发货记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.isCallback = undefined;
  const res = await listDeliveryRecord(queryParams.value);
  deliveryRecordList.value = res.rows;
  total.value = res.total;
  if (XTableRef.value) {
    // await XTableRef.value.xTableRef.reloadData(deliveryRecordList.value)
    await XTableRef.value.xTableRef.updateData()
  }
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  tabForm.value = { ...initFormData };
  logisticsDisabled.value = false;
  deliveryRecordFormRef.value?.resetFields();

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

/** 修改按钮操作 */
const handleUpdate = async (row?: DeliveryRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeliveryRecord(_id);
  Object.assign(tabForm.value, res.data);
  dialog.visible = true;
  dialog.title = "修改发货记录";
}

const validateShipOver = (tabData:any) => {
  let flag = true;
  tabData.forEach((item: any) => {
    if (item.shipQuantity > item.waitDeliveryQuantity) {
      flag = false;
      return;
    }
  });
  return flag;
}

const inventoryCheck = ref(false);
const inventoryRes = ref<any[]>([]);
/** 提交按钮 */
const submitAddForm = async () => {
  // 查询是否存在盘点中产品
  let ids = tabOrderList.value.map(item => item.commodityId);
  let query = {
    pageNum: 1,
    pageSize: 20,
    IdList: ids,
    status: '1'
  }
  const res = await listCommodityInventory(query);
  if (res.rows && res.rows.length > 0) {
    inventoryRes.value = res.rows;
    inventoryCheck.value = true;
    return;
  }

  const $table = tabTable.value.xTableRef;
  orderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if ($table) {
        let errMap = await $table.validate(true);
        if (errMap) {
          console.log("errMap", errMap);
          return;
        }
      }
      if (!validateShipOver(tabOrderList.value)) {
        await proxy?.$modal.confirm("发货数量大于订单数量，是否仍然发货？")
      }
      buttonLoading.value = true;
      tabOrderList.value.forEach(to=>{
        to.customerCodeIdList = undefined;
      })

      tabForm.value.deliveryRecordBoList = tabOrderList.value;
      console.log("tabForm.value", tabForm.value);
      let tempParams = JSON.parse(JSON.stringify(tabForm.value))
      tempParams.fileList.map((m) => {
        m.url = undefined
      })
      let res = await addDeliveryRecord(tempParams).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("操作成功");
      const $table1 = XTableRef.value.xTableRef;
      if ($table1) {
        $table1.clearCheckboxRow()
        $table1.clearCheckboxReserve()
      }

      await proxy?.$modal.confirm("是否立即打印送货单？").finally(() => {
        drawer.visible = false;
        checkedOrderList.value = [];
        checkCustomer.value = "";
        queryParams.value.customerCode = undefined;
        //getList();
        XTableRef.value.delFilterField(['customerCode','cusAddress'])
      });
      deliverCardRef.value.doPrint(res.data.deliveryRecordList[0].id);

      drawer.visible = false;

      checkedOrderList.value = [];
      checkCustomer.value = "";
      queryParams.value.customerCode = undefined;
      //await getList();
      //成功清空
    }
  });
}

//修改关联物流信息
const submitUpdateLogNoForm = async (noCheck?:boolean) => {
  if(!noCheck){
    orderFormRef2.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        let tempParams = JSON.parse(JSON.stringify(tabForm.value))
        tempParams.fileList.map((m) => {
          m.url = undefined
        })
        await updateDeliveryRecordLogNo(tempParams).finally(() => buttonLoading.value = false);
        proxy?.$modal.msgSuccess("操作成功");

        updateLogNoDrawer.visible = false;
        checkedOrderList.value = [];
        checkCustomer.value = "";
        queryParams.value.customerCode = undefined;
        await getSignList();
        await getWaitList();
      }
    });
  } else {
    buttonLoading.value = true;
    let tempParams = JSON.parse(JSON.stringify(tabForm.value))
    tempParams.fileList?.map((m) => {
      m.url = undefined
    })
    await updateDeliveryRecordLogNo(tempParams).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("操作成功");
    await getSignList();
    await getWaitList();
  }
}

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除发货记录编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.fullName == row.logisticsCompany);
  logisticsQueryParams.value.waybillNo = row.logisticsNo;
  logisticsQueryParams.value.companyCode = currentCompany?.code || "undefined";
  await getLogList();
  if(logOrderList.value.length > 0 && !logOrderList.value[0].deliveryCode?.includes("/")){
    ElMessageBox.confirm(
      '取消关联时，【'+ currentCompany.fullName +'】公司的物流订单是否同步取消？',
      '提示',
      {
        confirmButtonText: '同步取消物流订单',
        cancelButtonText: '只删除送货单',
        distinguishCancelAndClose: true,
        type: 'warning',
      }
    ).then(async ()=>{
      await delDeliveryRecord(_ids).finally(() => proxy?.$modal.closeLoading());
      deleteOrder({id:row.logisticsOrderId,expressType:currentCompany.code}).then((res)=>{
        const result = JSON.parse(res.msg)
        let reason = "";
        console.log(result)
        if(currentCompany.code == "SFEXPRESS"){
          if (!result.success) {
            reason = result.errorMsg;
          }
        } else if(currentCompany.code == "KYEXPRESS"){
          if(!result.success){
            reason = result.msg;
          }
        } else if(currentCompany.code == "LTS"){
          if(result.code != 200){
            reason = result.msg;
          }
        }
        if (reason == "") {
          proxy?.$modal.msgSuccess("取消物流单成功");
          return;
        }
        ElMessage({
          dangerouslyUseHTMLString: true,
          type: 'info',
          duration: 3000,
          offset: 24,
          showClose: true,
          message: '物流单取消失败【<span style="color:#F56C6C;">' + reason + '</span>】，请至' + '<a style="color: #457AF7;" href="' + currentCompany.website + '" target="_blank">【' + currentCompany.fullName + '】</a>平台或致电【 '+currentCompany.phone + '】手动取消物流单。',
        })
      }).finally(async () => {
        proxy?.$modal.closeLoading()
      });
    }).catch(async (action: any) =>{
      if(action === 'cancel'){
        await delDeliveryRecord(_ids).finally(() => proxy?.$modal.closeLoading());
        proxy?.$modal.msgSuccess("删除成功");
      }
    }).finally(async() => {
      proxy?.$modal.closeLoading();
      buttonLoading.value = false;
      getSignList();
      getWaitList();
    });
  } else {
    await delDeliveryRecord(_ids).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.closeLoading();
    buttonLoading.value = false;
    getSignList();
    getWaitList();
  }
}

const handleSign = async (row?: DeliveryRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认回签编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await signDeliveryRecord(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("回签成功");
  await getSignList();
  await getWaitList();
}
const handleUnSign = async (row?: DeliveryRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认取消回签编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await unSignDeliveryRecord(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("取消回签成功");
  await getSignList();
  await getWaitList();
}

const doPrintPDF = async (row?: any) => {
  // 有签名文件使用ureport
  const res = await getSignPdf({bizCode: row.code});
  if (res.data?.url) {
    reportDrawer.title = "送货单报表预览";
    reportDrawer.visible = true;
    let url = '/web/viewer.html?file=' + encodeURIComponent(res.data.url + '#' + res.data.name);
    reportUrl.value = url;
    reportUrl.value = reportUrl.value.replace("1,4,6", "2,4,6");
    return;
  }

  // 没有使用原来的打印格式
  proxy?.$modal.loading("加载中");
  deliverCardRef.value.doPrint(row.id).finally(() => proxy?.$modal.closeLoading());
}

const getContent = (detail: any, deliverTemplate: any) => {
  let content = deliverTemplate.content;
  let reg = /\$\{[^\}]+\}/g;
  let arr = content.match(reg);
  if (arr) {
    arr.forEach((item: any) => {
      let key = item.substring(2, item.length - 1);
      let value = detail[key];
      content = content.replace(item, value);
    });
  }
  return content;
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

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('order/deliveryRecord/export', {
    ...queryParams.value
  }, `deliveryRecord_${new Date().getTime()}.xlsx`)
}
const mergeCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data }: any) => {
  if (column.property === "code") {
    const referenceField = "code";
    if (rowIndex > 0) {
      if (row[referenceField] === items[rowIndex - 1][referenceField]) {
        row.seq = items[rowIndex - 1].seq;
      } else {
        row.seq = items[rowIndex - 1].seq + 1;
      }
    } else if (rowIndex === 0) {
      row.seq = seq;
    }
    let prevRow = data[$rowIndex - 1];
    let nextRow = data[$rowIndex + 1];
    if (prevRow && prevRow[referenceField] === row[referenceField]) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[referenceField] === row[referenceField]) {
        nextRow = data[++countRowspan + $rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
}

const getLogisticsCompanyList = async ()=>{
  const res = await listLogisticsCompany({pageNum:1,pageSize:500})
  logisticsCompanyList.value = res.rows
}

const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerCode } });
    }
}
/**运行文件上传的类型 */
const fileType: string[] = ["png", "bmp", "jpeg", "jpg", "gif"];

/**
 * handleFileChange 清空form.fileList 校验
 */
const handleFileChange = (fileList: any) => {
  if (fileList.length > 0) {
    tabForm.value.fileList = fileList;
  } else {
    tabForm.value.fileList = [];
  }
}

let reportUrl = ref("");

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '送货单'
});


onMounted(async () => {
  getListCust();
  getLogisticsCompanyList();
  await getList();
  getSelfList();
});
</script>

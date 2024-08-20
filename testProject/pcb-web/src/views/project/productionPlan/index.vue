<template>
  <div class="p-2 xtable-page">
    <div class="p-2 text-right">
      <el-button type="primary" @click="openSelfMICreate">制作工艺单</el-button>
      <!--      <el-button >制作外协工艺单</el-button>-->
    </div>

    <!-- <div> -->

    <el-tabs type="border-card" @tab-click="handleClick" class="xtable-tab">
      <el-tab-pane label="正常订单">
        <XTable v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%"
                class="xtable-content" :page-params="{ perfect: true, total: total }" :data="productionPlanList"
                :columnList="columnList" ref="xTable" :showRefresh="true" :loading="loading" toolId="productionPlan"
                :intervalCondition="recordCondition" border @searchChange="searchChange"
                :column-config="{ resizable: true }"
                :row-config="{ keyField: 'id' }">
          <template #default-make="scope">
            <el-button v-if="showButton(scope.row)" size="small" type="primary" link @click="editMi(scope.row)">修改
            </el-button>
            <el-button v-if="scope.row.status == '2' && showButton(scope.row)" size="small" type="primary" link
                       @click="rollbackMi(scope.row)">撤回
            </el-button>
            <el-button v-if="(scope.row.status == '1' || scope.row.status == '7') && showButton(scope.row)" size="small"
                       type="primary" link
                       @click="handleDelete(scope.row)">删除
            </el-button>
            <el-button size="small" type="primary" link @click="openFile(scope.row)">文件</el-button>
            <el-button size="small" type="primary" link
                       @click="doMIPrint(scope.row, 'noOutsideImages')">预览
            </el-button>
            <el-button size="small" type="primary" link
                       @click="queryMIAlterLog(scope.row)">变更日志
            </el-button>
          </template>
          <template #default-percentageOrder="scope">
            <el-progress :percentage="scope.row.percentageOrder"></el-progress>
          </template>
          <template #default-status="scope">
            <div v-for="item in resDictData.mi_status">
          <span :style="{ color: scope.row.status == 7 ? 'red' : '' }" v-if="item.dictValue == scope.row.status">{{
            item.dictLabel }}</span>
            </div>
          </template>

          <template #default-saleOrderVoList.commodityCode="scope">
        <span v-for="(item, index) in scope.row.saleOrderVoList">
          <span>{{ item.commodityCode }}</span>
          <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
        </span>
          </template>

          <template #default-saleOrderVoList.orderType="scope">
        <span v-for="(item, index) in scope.row.saleOrderVoList">
          <span v-for="info in resDictData.order_type">
            <span v-if="info.dictValue == item.orderType">{{ info.dictLabel }}</span>
          </span>
          <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
        </span>
          </template>

          <template #default-planType="scope">
            <div v-for="item in resDictData.mi_type">
              <span v-if="item.dictValue == scope.row.planType">{{ item.dictLabel }}</span>
            </div>
          </template>

          <template #default-miUserName="scope">
            <span>{{ scope.row.miAssignTaskVoList[0]?.miUserName }}</span>
          </template>

          <template #default-camUserName="scope">
        <span v-for="(item, index) in scope.row.miAssignTaskVoList">
          <span>{{ item.camUserName }}</span>
          <span v-if="index != scope.row.miAssignTaskVoList.length - 1">-</span>
        </span>
          </template>

          <template #content-expand="{ row }">
            <div class="expand-wrapper">
              <vxe-table size="mini" border show-overflow align="center" :data="row.saleOrderVoList">
                <vxe-column field="code" title="销售单号"></vxe-column>
                <vxe-column field="orderType" title="新/返">
                  <template #default="{ row }">
                    <div v-for="item in resDictData.order_type">
                      <span v-if="item.dictValue == row.orderType">{{ item.dictLabel }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="model" title="批/样">
                  <template #default="{ row }">
                    <div v-for="item in resDictData.order_model">
                      <span v-if="item.dictValue == row.model">{{ item.dictLabel }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="urgent" title="加急">
                  <template #default="{ row }">
                    <div v-for="item in resDictData.order_urgent">
                      <span v-if="item.dictValue == row.urgent">{{ item.dictLabel }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="customerCode" title="客户编码"></vxe-column>
                <vxe-column field="commodityCode" title="产品编码"></vxe-column>
                <vxe-column field="commodityName" title="产品名称"></vxe-column>
                <vxe-column field="commodityType" title="产品类型">
                </vxe-column>
                <vxe-column field="version" title="版本号"></vxe-column>
                <vxe-column field="placeOrderTime" title="下单时间"></vxe-column>
                <vxe-column field="quantity" title="下单数量"></vxe-column>
                <vxe-column field="selfQuantity" title="本厂数量"></vxe-column>
                <vxe-column field="customerDemand" title="客户要求"></vxe-column>
              </vxe-table>
            </div>
          </template>
        </XTable>
      </el-tab-pane>

      <el-tab-pane label="其他订单">
        <XTable v-model:page-size="queryParamsOther.pageSize" v-model:current-page="queryParamsOther.pageNum" height="100%"
                class="xtable-content" :page-params="{ perfect: true, total: otherTotal }" :data="productionPlanOtherList"
                :columnList="columnOtherList" ref="xTable" :showRefresh="true" :loading="loading" toolId="productionPlanOther"
                :intervalCondition="recordCondition" border @searchChange="searchChangeOther"
                :column-config="{ resizable: true }"
                :row-config="{ keyField: 'id' }">
          <template #default-orderStatus="scope">
            <el-tag style="margin-right: 2px" :type="item.isInventoryShipped =='1' ? 'success' : (item.flowStatus == '7' || item.flowStatus == '8') ? 'warning' : item.status == '3' ? 'danger' : 'primary'" v-for="item in scope.row.saleOrderVoList">{{ item.isInventoryShipped =='1' ? '库存发货' : (item.flowStatus == '7' || item.flowStatus == '8') ? '外协' : item.status == '3' ? '撤回' : '正常'  }}</el-tag>
          </template>
          <template #default-make="scope">
            <el-button v-if="showButton(scope.row)" size="small" type="primary" link @click="editMi(scope.row)">修改
            </el-button>
            <el-button v-if="scope.row.status == '2' && showButton(scope.row)" size="small" type="primary" link
                       @click="rollbackMi(scope.row)">撤回
            </el-button>
            <el-button v-if="(scope.row.status == '1' || scope.row.status == '7') && showButton(scope.row)" size="small"
                       type="primary" link
                       @click="handleDelete(scope.row)">删除
            </el-button>
            <el-button size="small" type="primary" link @click="openFile(scope.row)">文件</el-button>
            <el-button size="small" type="primary" link
                       @click="doMIPrint(scope.row, 'noOutsideImages')">预览
            </el-button>
            <el-button size="small" type="primary" link
                       @click="queryMIAlterLog(scope.row)">变更日志
            </el-button>
          </template>
          <template #default-percentageOrder="scope">
            <el-progress :percentage="scope.row.percentageOrder"></el-progress>
          </template>
          <template #default-status="scope">
            <div v-for="item in resDictData.mi_status">
          <span :style="{ color: scope.row.status == 7 ? 'red' : '' }" v-if="item.dictValue == scope.row.status">{{
            item.dictLabel }}</span>
            </div>
          </template>

          <template #default-saleOrderVoList.commodityCode="scope">
        <span v-for="(item, index) in scope.row.saleOrderVoList">
          <span>{{ item.commodityCode }}</span>
          <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
        </span>
          </template>

          <template #default-saleOrderVoList.orderType="scope">
        <span v-for="(item, index) in scope.row.saleOrderVoList">
          <span v-for="info in resDictData.order_type">
            <span v-if="info.dictValue == item.orderType">{{ info.dictLabel }}</span>
          </span>
          <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
        </span>
          </template>

          <template #default-planType="scope">
            <div v-for="item in resDictData.mi_type">
              <span v-if="item.dictValue == scope.row.planType">{{ item.dictLabel }}</span>
            </div>
          </template>

          <template #default-miUserName="scope">
            <span>{{ scope.row.miAssignTaskVoList[0]?.miUserName }}</span>
          </template>

          <template #default-camUserName="scope">
        <span v-for="(item, index) in scope.row.miAssignTaskVoList">
          <span>{{ item.camUserName }}</span>
          <span v-if="index != scope.row.miAssignTaskVoList.length - 1">-</span>
        </span>
          </template>

          <template #content-expand="{ row }">
            <div class="expand-wrapper">
              <vxe-table size="mini" border show-overflow align="center" :data="row.saleOrderVoList">
                <vxe-column field="code" title="销售单号"></vxe-column>
                <vxe-column field="orderType" title="新/返">
                  <template #default="{ row }">
                    <div v-for="item in resDictData.order_type">
                      <span v-if="item.dictValue == row.orderType">{{ item.dictLabel }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="model" title="批/样">
                  <template #default="{ row }">
                    <div v-for="item in resDictData.order_model">
                      <span v-if="item.dictValue == row.model">{{ item.dictLabel }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="urgent" title="加急">
                  <template #default="{ row }">
                    <div v-for="item in resDictData.order_urgent">
                      <span v-if="item.dictValue == row.urgent">{{ item.dictLabel }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="customerCode" title="客户编码"></vxe-column>
                <vxe-column field="commodityCode" title="产品编码"></vxe-column>
                <vxe-column field="commodityName" title="产品名称"></vxe-column>
                <vxe-column field="commodityType" title="产品类型">
                </vxe-column>
                <vxe-column field="version" title="版本号"></vxe-column>
                <vxe-column field="placeOrderTime" title="下单时间"></vxe-column>
                <vxe-column field="quantity" title="下单数量"></vxe-column>
                <vxe-column field="selfQuantity" title="本厂数量"></vxe-column>
                <vxe-column field="customerDemand" title="客户要求"></vxe-column>
              </vxe-table>
            </div>
          </template>
        </XTable>
      </el-tab-pane>
    </el-tabs>

    <!--      变更日志对话框-->
    <el-dialog
      v-model="miLogVisible"
      :title= "miLogTitle"
      direction="rtl"
      size="40%"
      destroy-on-close
      @close="resetMiLogForm()"
    >
      <el-form
        :model="miLogFromData"
        ref="miLogFormRef"
        :rules="miLogFormRule"
        label-width="auto"
        >
        <el-row>
          <p><strong><span style="font-size:larger !important;">变更内容</span></strong></p>
          <el-col :span="24" >
            <el-form-item prop="remark">
              <el-input :autosize="{ minRows: 5, maxRows: 5 }" type="textarea" maxlength="500" rows="5" show-word-limit autosize  v-model="miLogFromData.remark" placeholder="请输入备注"  />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <p><strong><span style="font-size:larger !important;">变更记录</span></strong></p>
      <XTable :pageShow="false"
              ref="confirmTable"
              :data="miLogDataList"
              border
              :columnList="miLogColumnList"
              max-height="398px"
              :loading="logLoading"
      >
      </XTable>

      <template #footer >
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="logSubmitLoading" @click="resetMiLogForm">取消</el-button>
            <el-button type="primary" :loading="logSubmitLoading" @click="submitMiLogForm">保存</el-button>
          </span>
        </div>
      </template>

    </el-dialog>

    <!-- </div> -->

    <!--制作本厂工艺单弹窗-->
    <el-drawer v-model="drawer.visible" :title="drawer.title" size="90%" :close-on-click-modal="false"
               :direction="drawer.direction" :destroy-on-close="true" @close="closedDrawer">
      <div class="ptable-card">
        <XTable border keep-source v-model:page-size="queryParamsDrawer.pageSize"
                v-model:current-page="queryParamsDrawer.pageNum" height="100%" class="ptable-content"
                :page-params="{ perfect: true, total: totalDrawer }" @searchChange="searchChangeDrawer"
                show-overflow ref="xTable" :column-config="{ resizable: true }" :loading="loading"
                :intervalCondition="recordSaleCondition"
                @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent"
                :checkbox-config="{ reserve: true }"
                :columnList="columnListSelect"
                :data="waitProductionPlanList">
          <template #default-saleOrderVo.orderType="scope">
            <div v-for="item in resDictData.order_type">
              <span v-if="item.dictValue == scope.row.saleOrderVo.orderType">{{ item.dictLabel }}</span>
            </div>
          </template>
          <template #default-saleOrderVo.model="scope">
            <div v-for="item in resDictData.order_model">
              <span v-if="item.dictValue == scope.row.saleOrderVo.model">{{ item.dictLabel }}</span>
            </div>
          </template>
          <template #default-saleOrderVo.urgent="scope">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="item.dictValue == scope.row.saleOrderVo.urgent">{{ item.dictLabel }}</span>
            </div>
          </template>
          <template #default-isEqConfirm="scope">
              <el-switch
                v-model="scope.row.isEqConfirm"
                style="--el-switch-on-color: #13ce66;"
                active-value="1"
                inactive-value="0"
                @change="handleChange($event,scope.row)"
              />
          </template>
          <vxe-column align="center" fixed="right" title="操作" width="150">
            <template #default="{ row }">
              <el-button size="small" type="primary" :text="true" @click="openOrderDetail(row)">订单详情</el-button>
              <el-button link type="primary" @click="openUpload(row)">EQ文件</el-button>
            </template>
          </vxe-column>
        </XTable>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="nextStep">下一步</el-button>
        </div>
      </template>
    </el-drawer>




    <!-- 生成工艺单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="90%" :close-on-click-modal="false"
               destroy-on-close>

      <vxe-table border keep-source align="center" :row-config="{ height: 40, isCurrent: true }" max-height="100%"
                 show-header-overflow
                 show-overflow :column-config="{ resizable: true }" :data="checkedInfos">
        <vxe-column fixed="left" type="seq" title="序号" width="60"></vxe-column>
        <vxe-column fixed="left" width="130" title="销售单号" field="saleOrderVo.code">
        </vxe-column>
        <vxe-column width="90" title="外协本厂">
          <template #default="{ row }">
            <div>本厂</div>
          </template>
        </vxe-column>
        <vxe-column width="60" title="新/返" field="saleOrderVo.orderType">
          <template #default="{ row }">
            <div v-for="item in resDictData.order_type">
              <span v-if="item.dictValue == row.saleOrderVo.orderType">{{ item.dictLabel }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column width="90" title="批量/样品" field="saleOrderVo.model">
          <template #default="{ row }">
            <div v-for="item in resDictData.order_model">
              <span v-if="item.dictValue == row.saleOrderVo.model">{{ item.dictLabel }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column width="50" title="加急" field="saleOrderVo.urgent">
          <template #default="{ row }">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="item.dictValue == row.saleOrderVo.urgent">{{ item.dictLabel }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column width="70" title="客户编码" field="saleOrderVo.customerCode">
        </vxe-column>
        <vxe-column width="140" title="产品编码" field="saleOrderVo.commodityCode">
        </vxe-column>
        <vxe-column title="产品名称" field="saleOrderVo.commodityName">
        </vxe-column>
        <vxe-column width="50" title="版本号" field="saleOrderVo.version">
        </vxe-column>
        <vxe-column width="70" title="产品类型" field="saleOrderVo.commodityType">
        </vxe-column>
        <vxe-column width="70" title="订单数量" field="saleOrderVo.quantity">
        </vxe-column>
        <vxe-column width="70" title="订单面积" field="saleOrderVo.area">
        </vxe-column>
        <vxe-column width="70" title="PCS/SET" field="saleOrderVo.unitedNumber">
        </vxe-column>
        <vxe-column width="150" title="下单日期" field="saleOrderVo.placeOrderTime">
        </vxe-column>
        <!--        <vxe-column width="150" title="客户交期" field="saleOrderVo.deliveryTime">-->
        <!--        </vxe-column>-->
        <vxe-column width="150" title="出货日期" field="saleOrderVo.dispatchTime">
        </vxe-column>
      </vxe-table>

      <div v-if="similarMIList != null && similarMIList.length>0">
        <el-divider content-position="left">可返单</el-divider>
        <el-table :data="similarMIList"
                  ref="singleTableRef"
                  width="100%"
                  border
                  height="300"
                  highlight-current-row
                  @current-change="handleCurrentChange">
          <el-table-column prop="code"
                           fixed
                           label="MI单号"
                           min-width="160px"
                           align="center">
          </el-table-column>
          <el-table-column prop="commodityCode"
                           fixed
                           label="产品编码"
                           min-width="160px"
                           align="center">
            <template #default="scope">
              <span v-for="(item, index) in scope.row.saleOrderVoList">
                <span>{{ item.commodityCode }}</span>
                <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="MI工艺名称"
                           align="center"
                           min-width="160px"
                           :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="planType"
                           label="MI类型"
                           align="center">
            <template #default="scope">
              <div v-if="scope.row.planType==1">单品</div>
              <div v-if="scope.row.planType==2">拼版</div>
            </template>
          </el-table-column>
          <el-table-column prop="miUserName"
                           label="制单人员"
                           align="center">
            <template #default="scope">
              <span>{{ scope.row.miAssignTaskVoList[0]?.miUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"
                           label="创建时间"
                           min-width="160px"
                           align="center">
            <template #default="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           min-width="50px">
            <template #default="scope">
              <el-button type="text" @click="doMIPrint(scope.row, 'noOutsideImages')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="display: flex;padding-top: 5px">
        <el-checkbox v-model="checked" @change="checkChange">从已有MI复制</el-checkbox>
        <div v-if="checked">
          <el-input style="width: 400px" v-model="checkedCode" disabled></el-input>
          <el-button @click="getMiHistoryList">
            <el-icon>
              <Search/>
            </el-icon>
          </el-button>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" style="text-align: center;">
          <el-button :loading="buttonLoading" @click="cancelDialog">取消</el-button>
          <el-button v-if="checked" :loading="buttonLoading" type="primary" @click="addMi(true)">复制</el-button>
          <el-button v-if="currentRow" :loading="buttonLoading" type="primary" @click="addMi(true)">返单复制</el-button>
          <el-button v-if="!checked" :loading="buttonLoading" type="primary" @click="addMi(false)">新建</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选择工艺单对话框 -->
    <el-dialog :title="miHistoryDialog.title" v-model="miHistoryDialog.visible" width="1300"
               :close-on-click-modal="false"
               @close="closeMiHistoryDialog()"
               destroy-on-close>
      <div class="orderLi" style="overflow:hidden;">
        <XTable :row-config="{isCurrent: true }"
                v-model:page-size="historyListQueryParam.pageSize" v-model:current-page="historyListQueryParam.pageNum"
                :page-params="{ perfect: true, total: historyTotal }"
                :column-config="{ resizable: true }" @cell-dblclick="cellDBLClickEvent" :loading="loading"
                :columnList="columnHistoryList"
                height="600px"
                :isAutoHeight="true"
                @searchChange="searchChangeHistory"
                :intervalCondition="recordPlanCondition"
                :data="historyList">
          <template #default-commodityCode="scope">
          <span v-for="(item, index) in scope.row.saleOrderVoList" v-if="scope.row.saleOrderVoList">
                <span>{{ item.commodityCode }}</span>
                <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
          </span>
          </template>
          <template #default-planType="scope">
            <div v-for="item in resDictData.mi_type">
              <span v-if="item.dictValue == scope.row.planType">{{ item.dictLabel }}</span>
            </div>
          </template>
          <template #default-miUserName="scope">
            <span>{{ scope.row.miAssignTaskVoList[0]?.miUserName }}</span>
          </template>
        </XTable>
      </div>
    </el-dialog>

    <!-- 修改弹框 -->
    <ProductionPlanDrawer v-model:open="miEditDrawer" :crtMiInfo="crtMiInfo"
                          @saveFinish="refreshList"></ProductionPlanDrawer>

    <!--详情预览-->
    <el-drawer v-model="orderDrawer.visible" :title="orderDrawer.title" size="850px" :direction="orderDrawer.direction"
               :destroy-on-close="true" modal-class="detail-prod-drawder">
      <SaleDescriptions v-if="currentVo" :currentInfo="currentVo" :customerList="customerList" :isShow="false"
                        :resDictData="resDictData">
      </SaleDescriptions>
    </el-drawer>

    <!--文件-->
    <el-drawer :title="fileDialog.title" v-model="fileDialog.visible" size="60%" visible.sync="false" draggable
               :destroy-on-close="true">
      <el-tabs type="border-card" v-model="fileTab" class="xtable-tab" @tab-click="radioFileTableHandle">
        <el-tab-pane label="MI文件" name="MI文件">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.miFileList"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef1" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="开料方案" name="开料方案">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.schemeFileVos"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef2" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="工序文件" name="工序文件">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.craftFileVos"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef3" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="工模治具" name="工模治具">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.modelFileVos"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef4" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="层压结构" name="层压结构">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.laminatedFileVos"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef5" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="外形图" name="外形图">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.outSideFileList"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef6" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="产品文件" name="产品文件">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.saleOrderFileVos"
                  :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef7" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="cacelFile">取 消</el-button>
          <!-- <el-button type="primary" >下载全部</el-button> -->
        </div>
      </template>
    </el-drawer>

    <MIPrint ref="MIPrintRef"></MIPrint>

    <!--eq文件-->
    <el-dialog :title="uploadDialog.title" v-model="uploadDialog.visible" width="1000px">
      <XUpload v-model:model-value="fileList" :readOnly="currentVo.isEqConfirm == '0'" model="download"
               @fileChange="fileChange" @delFile="delEqFile"></XUpload>
    </el-dialog>
  </div>
</template>

<script setup name="ProductionPlan" lang="ts">
import {
  addProductionPlan,
  delProductionPlan,
  getWaitProductionPlanList,
  checkSaleOrderByBo,
  listProductionPlan, saveMi, savePrediction, getMiInfoAlterLog, addProductionPlanAlterLog
} from '@/api/project/productionPlan';
  import {ProductionPlanVO} from '@/api/project/productionPlan/types';
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {ref} from "vue";
  import {VxeTableEvents, VxeTableInstance} from "vxe-table";
  import {RawMaterialVO} from "@/api/basedata/rawMaterial/types";
  import ProductionPlanDrawer from '@/components/ProductionPlanDrawer/index.vue'
  import {InProgressOrderVO} from "@/api/report/inProgressOrder/types";
  import {getProjectFile} from "@/api/report/inProgressOrder";
  import {deepClone} from "@/utils";

  // mi单变更对话框可视性
  const miLogVisible =ref(false);
  // mi单变更日志标题
  const miLogTitle = ref("变更日志");
  const miLogFormRef = ref();
  /**
   * 初始化领用钻咀表单数据
   */
  let miLogFromData = ref({
    planId: 0,
    remark: ''
  })
  // 重置mi单变更对话框内容
  const resetMiLogForm = () => {
    miLogVisible.value = false;
    // 初始化提交数据
    miLogFromData = ref({
      planId: 0,
      remark: ''
    });
    // 初始化变更记录列表
    miLogDataList.value = [];
  };

/**
 * 保存Mi单的变更日志
 */
const submitMiLogForm = () => {


  miLogFormRef.value.validate((valid: any, fields: any) => {

  if (!valid) {
    console.log('error submit!', fields)
  }else{
    logSubmitLoading.value = true;
    addProductionPlanAlterLog(
      miLogFromData.value
    )
      .then(() => {
        ElMessage({
          type: 'success',
          message: "保存成功",
        });
        miLogFromData.value.remark ='';
        setTimeout(()=>{
          miLogFormRef.value.clearValidate();
        },10)
      }).finally(() => {
        getMiInfoAlterLog(miLogFromData.value.planId)
          .then((res) => {
            miLogDataList.value = res.data;
            logSubmitLoading.value = false;
          }).finally(() => {
        });
    });
  }
  })

}

/**
 * 查询Mi单的变更日志
 */
const queryMIAlterLog = (row : any) => {
  miLogVisible.value = true;
  miLogFromData.value.planId = row.id;
  logLoading.value = true;
  const commodityCodes = row.saleOrderVoList.map((i:any) => i.commodityCode).join('-');
  miLogTitle.value = commodityCodes +' 变更日志';
  getMiInfoAlterLog(row.id)
    .then((res) => {
      miLogDataList.value = res.data;
      logLoading.value = false;
    });
}

  /**
   * 变更内容表单填写规则
   */
  const miLogFormRule = ref({
    remark: [
      { required: true, message: '变更内容不能为空', trigger: 'change' }
    ]
  })

  const miLogDataList = ref([]);

  //历史变更记录列表
  const miLogColumnList = ref([
    {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
    {
      width: "130",
      title: '变更时间',
      fixed: 'left',
      field: 'createTime',
      align: 'center'
    },
    {
      width: "80",
      title: '操作人',
      field: 'createByName',
      align: 'center',
    },
    {
      title: '变更内容',
      field: 'remark',
      align: 'center'
    }
  ]);



  // import EditorLabel from '@/components/EditorLabel.vue';
  //mi打印
  const MIPrintRef = ref();

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;


  const productionPlanList = ref<ProductionPlanVO[]>([]);

  const productionPlanOtherList = ref<ProductionPlanVO[]>([]);

  const waitProductionPlanList = ref<ProductionPlanVO[]>([]);
  const historyList = ref<ProductionPlanVO[]>([]);
  const rawMaterialList = ref<RawMaterialVO[]>([]);
  const xTable = ref<VxeTableInstance<ProductionPlanVO>>();
  const buttonLoading = ref(false);
  const loading = ref(true);
  const logLoading = ref(false);
  const logSubmitLoading = ref(false);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const otherTotal = ref(0);
  const totalDrawer = ref(0);
  const historyTotal = ref(0);
  const materialTotal = ref(0);
  const checked = ref(false);
  const checkedCode = ref("");
  const currentSchemeIndex = ref(0);
  const fileTab = ref('MI文件');
  const singleTableRef = ref()
  let currentType = ref(0);
  /*eq文件*/
  const fileList = ref<any[]>([]);


  const queryFormRef = ref<ElFormInstance>();

  let initQueryParams = {
    pageNum: 1,
    pageSize: 20,
  }

  let initQueryParamsHistory = {
    pageNum: 1,
    pageSize: 20,
  }

  const checkedInfos = ref<Array<any>>([]);
  const queryParams = ref({
    ...initQueryParams,
    isNormal: '1'
  })

  const queryParamsOther = ref({
    ...initQueryParams,
    isNormal: '0'
  })

  const queryParamsDrawer = ref({
    pageNum: 1,
    pageSize: 20,
  })

  const fileDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const filesDataObj = ref<any>([]);

  /** 文件 */
  const openFile = async (row: any) => {
    fileDialog.title = "工程文件";
    fileDialog.visible = true;
    let query = {
      planId: row.id
    }
    filesDataObj.value = await getProjectFile(query);
    if (filesDataObj.value.miFileList) {
      filesDataObj.value.miFileList.forEach((item: any) => {
        item.sysFileVo = [item];
      })
    }
    if (filesDataObj.value.outSideFileList) {
      filesDataObj.value.outSideFileList.forEach((item: any) => {
        item.sysFileVo = [item];
      })
    }
  }

  const closeMiHistoryDialog = () => {
    searchChangeHistory(initQueryParamsHistory);

  }

  const cacelFile = () => {
    filesDataObj.value = [];
    fileDialog.visible = false;
  }

  const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({checked}) => {
    const $table = xTable.value.xTableRef
    if ($table) {
      const records = $table.getCheckboxRecords()
      if (checked) {
        records.forEach(info => {
          checkedInfos.value.push(info)
        })
      } else {
        checkedInfos.value = [];
      }
    }
  }

  const selectChangeEvent: VxeTableEvents.CheckboxChange<any> = ({row, checked}) => {
    if (checked) {
      checkedInfos.value.push(row)
    } else {
      checkedInfos.value = checkedInfos.value.filter(info => {
        return info.id != row.id
      });
    }
  }

  const closedDrawer = () => {
    checkedInfos.value = [];
    queryParamsDrawer.value = {
      pageNum: 1,
      pageSize: 20,
    }
  }

  import useUserStore from "@/store/modules/user";
  import {updateOrder} from "@/api/order/directOrder";
  import {ElMessage} from "element-plus";
  import {updateEq} from "@/api/project/assignTask";
  import {addFile, deleteFile, getFileList} from "@/api/upload";


  const showButton = (row: any) => {
    let permissions = useUserStore().permissions;
    let roles = useUserStore().roles;
    if (roles.includes("admin") || roles.includes("superadmin") || permissions.includes("production:productionPlan:update") || useUserStore().nickname == row.createByName) {
      return true;
    } else {
      return false;
    }
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const miHistoryDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const crtMiInfo = ref()
  const miEditDrawer = ref(false)

  const historyListQueryParam = ref({
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    name: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    code: undefined,
    planType: undefined,
    status: undefined,
    submitTime: undefined,
    preFeedTime: undefined,
    preFeedUserId: undefined,
    preFeedUserName: undefined,
    preFeedAuditUserId: undefined,
    preFeedAuditUserName: undefined,
    params: {}
  })

  const recordSaleCondition = ['saleOrderVo.placeOrderTime', 'saleOrderVo.deliveryTime', 'saleOrderVo.dispatchTime'];

  const recordPlanCondition = ['createTime'];
  const columnListSelect = ref([
    {width: '60', type: 'checkbox', align: 'center', filterType: 'input'},
    {width: '60', title: '序号', align: 'center', type: 'seq'},
    {
      width: '90',
      title: '销售单号',
      field: 'saleOrderVo.code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入销售单号'},
    },
    {
      width: '40',
      title: 'EQ',
      field: 'isEqConfirm',
      align: 'center',
    },
    {
      width: '60', title: '新/返', field: 'saleOrderVo.orderType', align: 'center', filterParam: {placeholder: '请输入新/返'},
      filterType: 'radioButton',
      filterData: () => resDictData.value.order_type,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90', title: '批量/样品', field: 'saleOrderVo.model', align: 'center', filterParam: {placeholder: '请输入批量/样品'},
      filterType: 'radioButton',
      filterData: () => resDictData.value.order_model,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '50', title: '加急', field: 'saleOrderVo.urgent', align: 'center', filterParam: {placeholder: '请输入加急'},
      filterType: 'radioButton',
      filterData: () => resDictData.value.order_urgent,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '80',
      title: '客户编码',
      field: 'saleOrderVo.customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {
      width: '80',
      title: '产品编码',
      field: 'saleOrderVo.commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: '80',
      title: '产品名称',
      field: 'saleOrderVo.commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: '70',
      title: '版本号',
      field: 'saleOrderVo.version',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入版本号'}
    },
    {
      width: '120',
      title: '产品类型',
      field: 'saleOrderVo.commodityType',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品类型'}
    },
    {width: '90', title: '订单数量', field: 'saleOrderVo.quantity', align: 'center'},
    {width: '90', title: '本厂数量', field: 'saleOrderVo.selfQuantity', align: 'center'},
    {width: '90', title: '订单面积', field: 'saleOrderVo.area', align: 'center'},
    {width: '90', title: 'PCS/SET', field: 'saleOrderVo.unitedNumber', align: 'center'},
    {
      width: '150',
      title: '下单日期',
      field: 'saleOrderVo.placeOrderTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    // {
    //   width: '150',
    //   title: '客户交期',
    //   field: 'saleOrderVo.deliveryTime',
    //   align: 'center',
    //   filterType: 'intervalDate',
    //   filterParam: {
    //     startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    //     endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    //   }
    // },
    {
      width: '150', title: '出货日期', field: 'saleOrderVo.dispatchTime', align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },

  ]);

  const fileColumnList = ref([
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
    {title: '工序名称', width: '120', field: 'craftName', align: 'center', visible: false},
    {title: '开料方案', width: '120', field: 'schemeName', align: 'center', visible: false},
    {title: '物料编码', width: '120', field: 'materialNumber', align: 'center', visible: false},
    {title: '物料名称', width: '120', field: 'materialName', align: 'center', visible: false},
    {title: '产品名称', width: '120', field: 'commodityCode', align: 'center', visible: false},
    {title: '文件名称', field: 'fileName', align: 'center'},
    {title: '文件大小', width: '80', field: 'size', align: 'center'},
    {title: '上传人', width: '120', field: 'createByName', align: 'center'},
    {title: '上传时间', width: '120', field: 'createTime', align: 'center'},
  ]);

  const columnHistoryList = ref([
    {width: '60', title: '序号', type: 'seq', align: 'center',},
    {
      width: '250',
      title: 'MI单号',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI单号'}
    },
    {
      width: '300',
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: '200',
      title: 'MI工艺名称',
      field: 'name',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI工艺名称'}
    },
    {
      width: '100',
      title: 'MI类型',
      field: 'planType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入MI类型'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.mi_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '100',
      title: '制单人员',
      field: 'miUserName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入制单人员'}
    },
    {
      title: '创建时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
  ]);

  const orderDrawer = reactive<DrawerOption>({
    title: '订单详情',
    visible: false,
    direction: "rtl"
  });

  const currentVo = ref();

  const openOrderDetail = (row: any) => {
    currentVo.value = row.saleOrderVo;
    orderDrawer.visible = true;
    orderDrawer.title = row.saleOrderVo.code;
  }

  let resDictData = ref({
    //工艺单状态
    mi_status: [],
    //订单类型
    order_type: [],
    //MI类型
    mi_type: [],
    //批量/样品
    order_model: [],
    //加急
    order_urgent: [],
    //产品类型
    sys_commodity_type: [],
    //表面处理
    order_surface_treatment: [],
    //板材
    order_material_quality: [],
    //品牌
    order_plate_brand: [],
    //级别
    order_material_level: [],
    //板厚
    finish_plate_thickness: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //阻焊颜色
    order_commodity_solder: [],
    //字符
    order_character: [],
    //过孔要求
    order_hole_requirement: [],

  })

  const uploadDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const recordCondition = ['createTime'];

  const columnList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false},
    {field: "expand", type: 'expand', width: '40', align: 'center'},
    {
      title: '状态', field: 'status', align: 'center',
      filterType: 'select',
      filterParam: {
        placeholder: '请选择状态',
      },
      filterData: () => resDictData.value.mi_status,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: 'MI单号', field: 'code', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入MI单号'}},
    {
      title: '产品编码',
      field: 'saleOrderVoList.commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {title: 'MI工艺名称', field: 'name', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入MI工艺名称'}},
    {
      title: '新/返', field: 'saleOrderVoList.orderType', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: 'MI类型', field: 'planType', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入MI类型'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.mi_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'},
    },
    {title: '制单人员', field: 'miUserName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入制单人员'}},
    {title: '合拼人员', field: 'camUserName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入合拼人员'}},
    {
      title: '创建时间', field: 'createTime', align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '提交时间', field: 'submitTime', align: 'center'},
    {title: '审核时间', field: 'auditTime', align: 'center'},
    {title: '审核人', field: 'auditUserName', align: 'center'},
    {title: '操作', field: 'make', align: 'center', width: '250', fixed: 'right', showOverflow: false},
  ]);

  const columnOtherList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60', showOverflow: false},
    {field: "expand", type: 'expand', width: '40', align: 'center'},
    {
      title: '状态', field: 'status', align: 'center',
      filterType: 'select',
      filterParam: {
        placeholder: '请选择状态',
      },
      filterData: () => resDictData.value.mi_status,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: 'MI单号', field: 'code', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入MI单号'}},
    {title: '订单状态', field: 'orderStatus', align: 'center',width: '80'},
    {
      title: '产品编码',
      field: 'saleOrderVoList.commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {title: 'MI工艺名称', field: 'name', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入MI工艺名称'}},
    {
      title: '新/返', field: 'saleOrderVoList.orderType', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: 'MI类型', field: 'planType', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入MI类型'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.mi_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'},
    },
    {title: '制单人员', field: 'miUserName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入制单人员'}},
    {title: '合拼人员', field: 'camUserName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入合拼人员'}},
    {
      title: '创建时间', field: 'createTime', align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '提交时间', field: 'submitTime', align: 'center'},
    {title: '审核时间', field: 'auditTime', align: 'center'},
    {title: '审核人', field: 'auditUserName', align: 'center'},
    {title: '操作', field: 'make', align: 'center', width: '250', fixed: 'right', showOverflow: false},
  ]);


  const searchChange = (params: any) => {
    queryParams.value = deepClone(initQueryParams);
    Object.keys(params).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".") + 1);
        queryParams.value[queryParamsKey] = params[key];
      } else {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.value[key] = params[key];
        }
      }


    });
    getList();
  }

  const searchChangeOther = (params: any) => {
    queryParamsOther.value = deepClone(initQueryParams);
    Object.keys(params).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".") + 1);
        queryParamsOther.value[queryParamsKey] = params[key];
      } else {
        if (params[key] !== null && params[key] !== undefined) {
          queryParamsOther.value[key] = params[key];
        }
      }


    });
    getOtherList();
  }

  const searchChangeHistory = (params: any) => {
    historyListQueryParam.value = deepClone(initQueryParamsHistory);
    Object.keys(params).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".") + 1);
        historyListQueryParam.value[queryParamsKey] = params[key];
      } else {
        if (params[key] !== null && params[key] !== undefined) {
          historyListQueryParam.value[key] = params[key];
        }
      }


    });
    getHistoryList()
  }


  const searchChangeDrawer = (params: any) => {
    queryParamsDrawer.value = params
    Object.keys(queryParamsDrawer.value).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".") + 1);
        queryParamsDrawer.value[queryParamsKey] = queryParamsDrawer.value[key];
        queryParamsDrawer.value[key] = undefined;
      }
    });
    getWaitList();
  }

  /*switch change事件*/
  const handleChange = async ($event: any, row: any) => {
    console.log(row);
    const submitInfo = {
      id: row.id,
      isEqConfirm: row.isEqConfirm,
    }
    await updateEq(submitInfo).finally(() => buttonLoading.value = false);
    currentVo.value = row;
    proxy?.$modal.msgSuccess("修改成功");
  };

  const openUpload = async (info: any) => {
    currentVo.value = info;
    // currentVo.value.isEqConfirm = props.type == 'work' ? props.crtMiInfo.miAssignTaskVoList.find(vo=> info.id == vo.saleOrderId)?.isEqConfirm : orderList.value.find(vo=>vo.id == info.id)?.isEqConfirm;
    getEqFileList();
    uploadDialog.visible = true;
    uploadDialog.title = "EQ文件";
  }

  const getEqFileList = async () => {
    const param = {
      bizId: currentVo.value.saleOrderVo.id,
      bizType: "12",
      moduleCode: "2",
    }
    const res = await getFileList(param);
    fileList.value = res.data;
  }

  const fileChange = (value: any) => {
    let lastFile = value.find(vo => vo.key == value[value.length - 1].key);
    var data = {
      bizId: currentVo.value.saleOrderVo.id,
      moduleCode: "2",
      bizType: "12",
      type: lastFile.type,
      size: lastFile.size,
      name: lastFile.name,
      key: lastFile.key,
    }
    addFile(data).then(() => {
      getEqFileList()
    })
  }

  const delEqFile = (value: any) => {
    const _ids = value?.id;
    deleteFile(_ids);
    proxy?.$modal.msgSuccess("删除成功");
  }

  /*获取字典数据*/
  const getDictData = async () => {
    const rules = [['dictSort', 'asc']];
    let string = "mi_status,order_type,mi_type,order_model,order_urgent,sys_commodity_type,order_surface_treatment,order_plate_brand,order_plate_brand";
    getDicts(string)
      .then(res => {
        const dictData = res.data;
        string.split(",").forEach(item => {
          Object.keys(resDictData.value).forEach(dictItem => {
            if (item == dictItem) {
              resDictData.value[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });
  }

  const cellDBLClickEvent: VxeTableEvents.CellDblclick<ProductionPlanVO> = async ({row}) => {
    console.log(row.commodityCode)
    const isConfirm = checkedInfos.value.some(info => {
      return row.saleOrderVoList.some(order => order.commodityCode === info.saleOrderVo.commodityCode);
    });
    if (!isConfirm) {
      ElMessageBox.confirm(
        '已选择的产品编码与复制的产品编码不一致，是否确认继续',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        dealHistoryDialog(row);
      })
    } else {
      dealHistoryDialog(row);
    }
  }

  const dealHistoryDialog = (row: any) => {
    let string = row.code;
    row.saleOrderVoList.forEach(item => {
      string += "-" + item.commodityCode;
    })
    crtMiInfo.value = row;
    checkedCode.value = string;
    miHistoryDialog.visible = false;
  }

  const handleClick = (pane: any, ev: any) => {
    if (pane.index == 0) {
      currentType.value = 0;
      getList();
    } else {
      currentType.value = 1;
      getOtherList();
    }
  }

  const refreshList = ()=>{
    if(currentType.value == 0){
      getList();
    } else {
      getOtherList();
    }
  }

  /** 查询工程-mi制作单列表 */
  const getList = async () => {
    loading.value = true;
    queryParams.value.isNormal = '1';
    const res = await listProductionPlan(queryParams.value);
    productionPlanList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }

  /** 查询工程-其他mi制作单列表 */
  const getOtherList = async () => {
    loading.value = true;
    queryParamsOther.value.isNormal = '0';
    const res = await listProductionPlan(queryParamsOther.value);
    productionPlanOtherList.value = res.rows;
    otherTotal.value = res.total;
    loading.value = false;
  }

  const currentRow = ref();

  const handleCurrentChange = (val: any) => {
    currentRow.value = val;
    checked.value = false;
    checkedCode.value = "";
    // checked.value = true;
  }

  const similarMIList = ref([]);

  /*下一步*/
  const nextStep = async () => {
    similarMIList.value = [];
    currentRow.value = null;
    checked.value = false;
    checkedCode.value = "";
    if (checkedInfos.value.length == 0) {
      ElMessage.warning("请选择制作MI工艺的产品!");
      return;
    }
    if (checkedInfos.value.length == 1) {
      historyListQueryParam.value.commodityCode = checkedInfos.value[0].saleOrderVo.commodityCode;
      // historyListQueryParam.value.planType = 1;
      historyListQueryParam.value.pageSize = 100;
      buttonLoading.value = true;
      const res = await listProductionPlan(historyListQueryParam.value).finally(() => {buttonLoading.value = false;})
      similarMIList.value = res.rows;
      historyListQueryParam.value.pageSize = 20;
      historyListQueryParam.value.commodityCode = undefined;
    }
    console.log(similarMIList.value)
    dialog.visible = true;
    dialog.title = "生成工艺单";
  }

  /*获取已制MI单*/
  const getMiHistoryList = () => {
    loading.value = true;
    // historyListQueryParam.value.planType = 1;
    listProductionPlan(historyListQueryParam.value).then(res => {
      historyList.value = res.rows;
      historyTotal.value = res.total;
      loading.value = false;
      miHistoryDialog.visible = true;
      miHistoryDialog.title = "选择MI单";
    });
  }

  const checkChange = () => {
    if (!checked.value) {
      checkedCode.value = "";
      checked.value = false;
    } else {
      if (currentRow.value) {
        singleTableRef.value.setCurrentRow();
        currentRow.value = null;
        checked.value = true;
      }
    }
  }


  /**
   *
   * @param id 验证是否有外协订单
   */
  const addCheck = async (bo: any) => {
    return new Promise(async (resolve, reject) => {
      await checkSaleOrderByBo(bo).then(async (res) => {
        let outOrder = res.data;
        if (outOrder) {
          proxy?.$modal.confirm('已有订单发外协, 请确认！').then(() => {
            resolve(true)
          }).catch(() => {
            resolve(false)
          })
        }
      }).catch(() => {
        resolve(false)
      })
    })
  }

  /**
   *
   * @param b 是否复制
   */
  const addMi = async (b: boolean) => {
    console.log(currentRow.value)
    if (b) {
      if (checkedCode.value == "" && null == currentRow.value) {
        ElMessage.error("请选择用于复制的MI单!");
        return;
      }
    }
    const info = {
      copyMiId: crtMiInfo.value && crtMiInfo.value.id && b ? crtMiInfo.value.id : 0,
      saleOrderIdList: [],
      name: "",
      assignTaskIdList: []
    };
    if (similarMIList.value && similarMIList.value.length > 0 && b && checkedCode.value == "") {
      if (currentRow.value) {
        info.copyMiId = currentRow.value.id;
      } else {
        ElMessage.error("请选择用于复制的返单!");
        return;
      }
    }

    checkedInfos.value.forEach(item => {
      info.assignTaskIdList.push(item.id);
      info.saleOrderIdList.push(item.saleOrderVo.id);
    })
    const materialLayer = checkedInfos.value[0].saleOrderVo.materialLayer;
    let surfaceTreatment = checkedInfos.value[0].saleOrderVo.surfaceTreatment;
    // const dictInfo: any = resDictData.value.order_surface_treatment.find(item =>
    //   item.dictValue == checkedInfos.value[0].saleOrderVo.surfaceTreatment
    // )
    // surfaceTreatment = dictInfo != null ? dictInfo.dictLabel : "";
    info.name = materialLayer + "层 " + surfaceTreatment;


    let check = false;
    // if (b) {
    //   check = await checkSaleOrderByBo({planId: info.copyMiId});
    // } else {
    buttonLoading.value = true;
      check = await checkSaleOrderByBo({ids: info.saleOrderIdList}).catch(() => { buttonLoading.value = false; });
    // }
    if (!check) {
      buttonLoading.value = false;
      return;
    }
    // console.log('checkedInfos.value', checkedInfos.value);
    //   return;
    addProductionPlan(info).then(async (res) => {
      queryParams.value.pageNum = 1
      // await getList();
      const result = await listProductionPlan({pageNum: 1, pageSize: queryParams.value.pageSize});
      editMi(result.rows[0])
      closeAll();
    }).finally(() => { buttonLoading.value = false; });
  }

  const closeAll = () => {
    checked.value = false;
    checkedCode.value = "";
    drawer.visible = false;
    dialog.visible = false;
  }

  /*获取选择mi列表*/
  const getHistoryList = async () => {
    loading.value = true;
    const res = await listProductionPlan(historyListQueryParam.value);
    historyList.value = res.rows;
    historyTotal.value = res.total;
    loading.value = false;
  }

  /*制作本厂工艺单*/
  const openSelfMICreate = async () => {
    getWaitList();
    drawer.visible = true;
    drawer.title = "制作工艺单";
  }

  const getWaitList = async () => {
    loading.value = true;
    const res: any = await getWaitProductionPlanList(queryParamsDrawer.value);
    waitProductionPlanList.value = res.rows;
    totalDrawer.value = res.total;
    if (checkedInfos.value?.length && xTable.value.xTableRef) {
      nextTick(() => {
        waitProductionPlanList.value.map((item: any) => {
          const num = checkedInfos.value.findIndex((el: any) => el.id == item.id)
          if (num != -1) {
            xTable.value.xTableRef.setCheckboxRow(item, true)
            // console.log(1111, item, xTable.value.xTableRef)
          }
        })
      })
    }
    loading.value = false;
  }

  /** 取消按钮 */
  const cancel = () => {
    drawer.visible = false;
  }

  const cancelDialog = () => {
    dialog.visible = false;
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
  const handleSelectionChange = (selection: ProductionPlanVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    dialog.visible = true;
    dialog.title = "添加工程-mi制作单";
  }

  /** 删除按钮操作 */
  const handleDelete = async (row?: any) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认删除工程-mi制作单编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...')
    await delProductionPlan(_ids).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("删除成功");
    await refreshList();
  }

  /** 修改按钮操作 */
  const editMi = async (row?: any) => {
    miEditDrawer.value = true
    crtMiInfo.value = row
  }

  const rollbackMi = async (row: any) => {
    const submitInfo = {
      id: row.id,
      status: '1',
      finished: false,
    }
    await proxy?.$modal.confirm('您确定要撤回MI单吗？').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...')
    await savePrediction(submitInfo).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("操作成功");
    await refreshList();
  }

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('project/productionPlan/export', {
      ...queryParams.value
    }, `productionPlan_${new Date().getTime()}.xlsx`)
  }
  const doMIPrint = async (data: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(data.id, type);
  }
  onMounted(() => {
    getDictData();
    getList();
  });
</script>

<style>
  .el-pagination {
    justify-content: center !important;
    float: none !important;
    margin-top: -20px !important;
  }

  .el-input__wrapper {
    width: 100% !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }

  /deep/ .scheme_divider {
    margin: 0 20px 20px 20px;
    text-align: center;
  }

  .expand-wrapper {
    padding-left: 59px;
  }
</style>

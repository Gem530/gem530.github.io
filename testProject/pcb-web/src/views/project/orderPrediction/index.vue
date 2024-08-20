<template>
  <div class="p-2 xtable-page">
    <div class="search" v-show="showSearch">
      <el-form :model="queryParams" ref="queryFormRef" size="small" label-width="100px"
               class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="开始日期" prop="cusId">
              <el-date-picker class="data100" size="small"
                              v-model="queryParams.startTime"
                              type="datetime"
                              placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>

            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="结束日期" prop="cusId">
              <el-date-picker class="data100" size="small"
                              v-model="queryParams.endTime"
                              type="datetime"
                              placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品编码" prop="commodityCode">
              <el-input v-model="queryParams.commodityCode" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品名称" prop="commodityName">
              <el-input v-model="queryParams.commodityName" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户编码" prop="customerCode">
              <!-- <el-input v-model="queryParams.customerCode" clearable/> -->
              <el-select v-model="queryParams.customerCodeIdList" multiple style="width: 100%" filterable clearable collapse-tags>
             <el-option v-for="item in customerCodeList" :key="item.value" :label="item.label" :value="item.value" />
           </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="销售单号" prop="orderCode">
              <el-input v-model="queryParams.orderCode" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="MI单号" prop="miCode">
              <el-input v-model="queryParams.miCode" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="加急" prop="urgent">
              <el-select v-model="queryParams.urgent" style="width: 100%" clearable>
                <el-option v-for="dict in resDictData.order_urgent" :key="dict.dictValue" :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-radio-group size="small"
                              v-model="queryParams.status"
                              type="vertical"
                              style="text-align:right;float:right">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button label="3">未投料</el-radio-button>
                <el-radio-button label="4">已投料</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="global-flex flex-end">
          <div style="float: right">
            <div style="display:flex;;line-height: 24px;font-size: 14px">
              <div style="width: 110px;background-color: #ECB0B1;text-align: center;">订单已撤回</div>
              <div style="width: 110px;background-color: #FAECD8;text-align: center">存在外协单</div>
              <div style="width: 110px;background-color: #E1E5FD;text-align: center">库存发货</div>
            </div>
          </div>
          </el-col>
          <el-col :span="6" class="global-flex flex-end">
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            <el-button icon="Download" @click="exportData">导出</el-button>
            <el-button type="danger" :loading="buttonLoading" @click="updateStatus(0)">审核驳回</el-button>
            <el-button type="success" :loading="buttonLoading" @click="updateStatus(1)">审核通过</el-button>
          </el-col>
        </el-row>
        <!--        <div style="padding-left: 30px">-->
        <!--          <vxe-radio-group v-model="queryParams.isNeedPreFeed" @change="onChangeNeedMICharge">-->
        <!--            <el-badge :value="needMIChargeCount">-->
        <!--              <vxe-radio-button label="1" content="正常投料" style="padding-right: 15px"></vxe-radio-button>-->
        <!--            </el-badge>-->
        <!--            <el-badge :value="unNeedMIChargeCount">-->
        <!--              <vxe-radio-button label="0" content="无需投料" style="padding-right: 15px"></vxe-radio-button>-->
        <!--            </el-badge>-->
        <!--          </vxe-radio-group>-->
        <!--        </div>-->
      </el-form>
    </div>
    <!--    <div class="p-2 text-right">-->
    <!--      <el-button type="primary" @click="updateStatus">审核通过</el-button>-->
    <!--    </div>-->
    <el-tabs class="xtable-tab" type="border-card" @tab-click="radioTableHandle" v-model="radioTable">
      <el-tab-pane label="本厂订单" name="本厂订单">
        <XTable toolId="projectOrderPrediction" height="100%" class="xtable-content"
                :page-show="false" :data="orderPredictionList" :columnList="columnList"
                ref="xTable" :loading="loading" @checkbox-all="selectAllChangeEvent" @checkbox-change="selectAllChangeEvent"
                :footer-method="footerMethod"
                :merge-cells="mergeCellsMethod"
                show-footer :showRefresh="true"
                border @searchChange="handleQuery" :column-config="{ resizable: true }"
                :row-style="setRowStyle"
                :row-config="{isCurrent:true}"
                :scroll-y="{enabled: true,gt: 50}"
                @finishSort="finishSort1Flag = !finishSort1Flag"
        >
          <template #default-status="scope">
            <span>{{scope.row.status=='3'?"未投料":"已投料"}}</span>
          </template>
          <template #default-saleOrderVo.placeOrderTime="{ row }">
            <div>{{dateFormat(row.saleOrderVo.placeOrderTime)}}</div>
          </template>
          <template #default-orderType="scope">
            <div v-for="item in resDictData.order_type">
              <span v-if="scope.row.saleOrderVo&&item.dictValue==scope.row.saleOrderVo.orderType">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-saleOrderVo.commodityCode="scope">
            <span>{{scope.row.saleOrderVo&&scope.row.saleOrderVo.commodityCode}}</span>
          </template>
          <template #default-saleOrderVo.unitedLength="scope">
            {{Number(scope.row.saleOrderVo&&scope.row.saleOrderVo.unitedLength).toFixed(2)}}
          </template>
          <template #default-saleOrderVo.unitedWidth="scope">
            {{Number(scope.row.saleOrderVo&&scope.row.saleOrderVo.unitedWidth).toFixed(2)}}
          </template>
        <!--      <template #default-preFeedRate="{row}">-->
        <!--        {{(getCommodityPcsQuantity(row.id) / row.quantity * 100).toFixed(2)}}-->
        <!--      </template>-->
          <template #default-saleOrderVo.model="scope">
            <div v-for="item in resDictData.order_model">
              <span v-if="scope.row.saleOrderVo&&item.dictValue==scope.row.saleOrderVo.model">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-saleOrderVo.urgent="scope">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="scope.row.saleOrderVo&&item.dictValue==scope.row.saleOrderVo.urgent">{{item.dictLabel}}</span>
            </div>
          </template>
          <!-- <template #default-differArea="scope">
            {{formatAreaData(scope.row.productionArea-scope.row.saleOrderVo.area>0?(scope.row.productionArea-scope.row.saleOrderVo.area):0)}}
          </template> -->
          <template #default-commodityTestWay="scope">
            <div v-for="item in resDictData.order_commodity_testway">
              <span v-if="scope.row.saleOrderVo&&item.dictValue==scope.row.commodityTestWay">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-saleOrderVo.totalPrice="scope">
            {{Number(scope.row.saleOrderVo&&scope.row.saleOrderVo.totalPrice).toFixed(2)}}
          </template>
          <template #default-saleOrderVo.surfaceTreatment="scope">
        <!--        <div v-for="item in resDictData.order_surface_treatment">-->
        <!--          <span v-if="item.dictValue==scope.row.saleOrderVo.surfaceTreatment">{{item.dictLabel}}</span>-->
        <!--        </div>-->
            {{scope.row.saleOrderVo&&scope.row.saleOrderVo.surfaceTreatment}}
          </template>
<!--          <template #default-saleOrderVo.materialQuality="scope">
            <div v-for="item in resDictData.order_material_quality">
              <span v-if="scope.row.saleOrderVo&&item.dictValue==scope.row.saleOrderVo.materialQuality">{{item.dictLabel}}</span>
            </div>
          </template>-->
          <template #default-make="scope">
            <el-button size="small" type="primary" :text="true" @click="doMIPrint(scope.row,'noOutsideImages')">MI详情</el-button>
            <el-button size="small" type="primary" :text="true"
                      v-if="scope.row.isNeedPreFeed=='1' && scope.row.status =='3'" @click="openEdit(scope.row)">预投
            </el-button>
            <!--<el-button size="small" type="primary" :text="true"
                      v-if="scope.row.isNeedPreFeed=='1'&& scope.row.status =='3'" @click="updateNeedFeed(scope.row,0)">
              无需投料
            </el-button>-->
            <el-button size="small" type="primary" :text="true"
                      v-if="scope.row.isNeedPreFeed=='0'" @click="updateNeedFeed(scope.row,1)">需要投料
            </el-button>
            <el-button v-if="scope.row.status =='4'" size="small" type="primary" :text="true" @click="revocation(scope.row)">撤回</el-button>
          </template>
        </XTable>
      </el-tab-pane>
      <el-tab-pane label="外协订单" name="外协订单">

        <XTable toolId="projectOrderPrediction" height="100%" class="xtable-content"
                :page-show="false" :data="outOrderPredictionList" :columnList="columnList"
                ref="xTableOut" :loading="loading" @checkbox-all="selectAllChangeOutEvent" @checkbox-change="selectAllChangeOutEvent"
                :merge-cells="mergeCellsMethod"
                :footer-method="footerMethod"
                show-footer :showRefresh="true"
                border @searchChange="handleQuery" :column-config="{ resizable: true }"
                :row-style="setRowStyle"
                :row-config="{isCurrent:true}"
                :scroll-y="{enabled: true,gt: 50}"
                @finishSort="finishSort2Flag = !finishSort2Flag"
        >
          <template #default-status="scope">
            <span>{{scope.row.status=='3'?"未投料":"已投料"}}</span>
          </template>
          <template #default-saleOrderVo.placeOrderTime="{ row }">
            <div>{{dateFormat(row.saleOrderVo.placeOrderTime)}}</div>
          </template>
          <template #default-orderType="scope">
            <div v-for="item in resDictData.order_type">
              <span v-if="item.dictValue==scope.row.saleOrderVo.orderType">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-saleOrderVo.commodityCode="scope">
            <span>{{scope.row.saleOrderVo.commodityCode}}</span>
          </template>
          <template #default-saleOrderVo.unitedLength="scope">
            {{Number(scope.row.saleOrderVo.unitedLength).toFixed(2)}}
          </template>
          <template #default-saleOrderVo.unitedWidth="scope">
            {{Number(scope.row.saleOrderVo.unitedWidth).toFixed(2)}}
          </template>
        <!--      <template #default-preFeedRate="{row}">-->
        <!--        {{(getCommodityPcsQuantity(row.id) / row.quantity * 100).toFixed(2)}}-->
        <!--      </template>-->
          <template #default-saleOrderVo.model="scope">
            <div v-for="item in resDictData.order_model">
              <span v-if="item.dictValue==scope.row.saleOrderVo.model">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-saleOrderVo.urgent="scope">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="item.dictValue==scope.row.saleOrderVo.urgent">{{item.dictLabel}}</span>
            </div>
          </template>
          <!-- <template #default-differArea="scope">
            {{formatAreaData(scope.row.productionArea-scope.row.saleOrderVo.area>0?(scope.row.productionArea-scope.row.saleOrderVo.area):0)}}
          </template> -->
          <template #default-commodityTestWay="scope">
            <div v-for="item in resDictData.order_commodity_testway">
              <span v-if="item.dictValue==scope.row.commodityTestWay">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-saleOrderVo.totalPrice="scope">
            {{Number(scope.row.saleOrderVo.totalPrice).toFixed(2)}}
          </template>
          <template #default-saleOrderVo.surfaceTreatment="scope">
        <!--        <div v-for="item in resDictData.order_surface_treatment">-->
        <!--          <span v-if="item.dictValue==scope.row.saleOrderVo.surfaceTreatment">{{item.dictLabel}}</span>-->
        <!--        </div>-->
            {{scope.row.saleOrderVo.surfaceTreatment}}
          </template>
<!--          <template #default-saleOrderVo.materialQuality="scope">
            <div v-for="item in resDictData.order_material_quality">
              <span v-if="item.dictValue==scope.row.saleOrderVo.materialQuality">{{item.dictLabel}}</span>
            </div>
          </template>-->
          <template #default-make="scope">
            <el-button size="small" type="primary" :text="true" @click="doMIPrint(scope.row,'noOutsideImages')">MI详情</el-button>
            <el-button size="small" type="primary" :text="true"
                      v-if="scope.row.isNeedPreFeed=='1' && scope.row.status =='3'" @click="openEdit(scope.row)">预投
            </el-button>
            <!--<el-button size="small" type="primary" :text="true"
                      v-if="scope.row.isNeedPreFeed=='1'&& scope.row.status =='3'" @click="updateNeedFeed(scope.row,0)">
              无需投料
            </el-button>-->
            <el-button size="small" type="primary" :text="true"
                      v-if="scope.row.isNeedPreFeed=='0'" @click="updateNeedFeed(scope.row,1)">需要投料
            </el-button>
          </template>
        </XTable>

      </el-tab-pane>
    </el-tabs>

    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      size="90%"
      :close-on-click-modal="false"
      :direction="drawer.direction"
      :destroy-on-close="true"
      @close="cancel"
    >
      <template #header="{ close, titleId, titleClass }">
        <span style="text-align: center">{{form.code}}-预投</span>
        <div style="float:right;margin-right:10px;">预投面积：<span style="color:red;">{{chargeArea}}</span>m²</div>
      </template>
      <div v-loading="dialogTableLoading">
        <vxe-table
          border
          keep-source
          align="center"
          :row-config="{height: 40,isCurrent:true}"
          show-overflow
          :column-config="{resizable: true}"
          :data="form.saleOrderVoList">
          <vxe-column fixed="left" type="seq" title="序号" width="60"></vxe-column>
          <vxe-column title="新/返" field="orderType">
            <template #default="{row}">
              <div v-for="item in resDictData.order_type">
                <span v-if="item.dictValue==row.orderType">{{item.dictLabel}}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="批/样" field="model">
            <template #default="{ row }">
              <div v-for="item in resDictData.order_model">
                <span v-if="item.dictValue==row.model">{{item.dictLabel}}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="加急" field="urgent">
            <template #default="{ row }">
              <div v-for="item in resDictData.order_urgent">
                <span v-if="item.dictValue==row.urgent">{{item.dictLabel}}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="产品编码" field="commodityCode">
          </vxe-column>
          <vxe-column width="430" title="产品名称" field="commodityName">
          </vxe-column>
          <vxe-column title="产品类型" field="commodityType">
          </vxe-column>
          <vxe-column title="pcs/set" field="unitedNumber">
          </vxe-column>
          <vxe-column title="订单面积(m²)" field="area">
          </vxe-column>
          <vxe-column title="订货数量(pcs)" field="quantity">
          </vxe-column>
          <vxe-column title="预投数量(pcs)">
            <template #default="{row}">
              <span style="color: red">
                {{getCommodityPcsQuantity(row.id)}}
              </span>
            </template>
          </vxe-column>
          <vxe-column title="投料率(%)">
            <template #default="{row}">
              {{(getCommodityPcsQuantity(row.id) / row.quantity * 100).toFixed(2)}}
            </template>
          </vxe-column>
        </vxe-table>
        <el-form ref="orderPredictionFormRef" :model="form" :rules="rules" label-width="110px" label-position="right">
          <!--按开料方案循环-->
          <el-card v-for="(scheme,index) in schemeList"
                  :key="index"
                  class="box-card"
                  style="width:100%;margin:10px auto;">

            <!--开料方案信息-->
            <div slot="header">
              <el-form label-width="90px"
                      label-position="right">
                <el-row>
                  <el-col :span="3" class="cardhead">
                    {{scheme.name}}
                  </el-col>
                  <el-col :span="4" class="cardhead">
                    <el-form-item label="利用率">{{scheme.cuttingRate}}%</el-form-item>
                  </el-col>
                  <el-col :span="4" class="cardhead">
                    <!--                  <el-form-item label="计划投料数">{{scheme.materialNumber}}张</el-form-item>-->
                  </el-col>
                  <el-col :span="4" class="cardhead">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="9" class="cardhead">
                    <el-form-item label="预投大料数">
                      <div style="display:flex;">
                        <el-input-number v-model="scheme.preFeedQuantity"
                                        :min="0"
                                        @change="onSchemePreFeedQuantityChange(scheme)"
                                        style="flex:1">
                          <template slot="append">
                            张
                          </template>
                        </el-input-number>
                        <el-button type="primary"
                                  style="margin-left:10px;"
                                  @click="onSetRateClick(index)">设置投料率
                        </el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" class="cardhead">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="4" class="cardhead">
                    <el-form-item label="物料编码">{{scheme.rawMaterial?.code}}</el-form-item>
                  </el-col>
                  <el-col :span="4" class="cardhead">
                    <el-form-item label="物料名称">{{scheme.rawMaterial?.name}}</el-form-item>
                  </el-col>
                  <el-col :span="3" class="cardhead">
                    <el-form-item label="品牌" label-width="50px">
                      <!--                    <span v-for="item in resDictData.order_plate_brand">-->
                      <!--                      <span v-if="item.dictValue==scheme.rawMaterial?.manufacturer">{{item.dictLabel}}</span>-->
                      <!--                    </span>-->
                      {{scheme.rawMaterial?.manufacturer}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" class="cardhead">
                    <el-form-item label="长" label-width="50px">{{scheme.rawMaterial?.length}}mm</el-form-item>
                  </el-col>
                  <el-col :span="3" class="cardhead">
                    <el-form-item label="宽" label-width="50px">{{scheme.rawMaterial?.width}}mm</el-form-item>
                  </el-col>
                  <el-col :span="2" class="cardhead">
                    <el-form-item label="MI开料板厚" label-width="100px">{{scheme.boardThickness}}mm
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" class="cardhead">
                    <el-form-item label="MI开料铜厚" label-width="100px">{{scheme.copperThickness}}OZ
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!--Pnl信息-->
            <el-table :data="scheme.pnlList"
                      style="width: 100%;">
              <el-table-column prop="pnl.name"
                              align="center"
                              label="PNL名称"
                              width="150px">
              </el-table-column>
              <el-table-column prop="pnl.pnlLength"
                              align="center"
                              label="长(mm)"
                              width="100px">
              </el-table-column>
              <el-table-column prop="pnl.pnlWidth"
                              align="center"
                              label="宽(mm)"
                              width="100px">
              </el-table-column>
              <el-table-column prop="count"
                              align="center"
                              label="pnl/大料"
                              width="100px">
              </el-table-column>
              <el-table-column align="center"
                              label="产品编码"
                              width="160px">
                <template #default="scope">
                  <div v-for="item in scope.row.pnl.pnlSetBoList">{{item.saleOrderBo.commodityCode}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center"
                              label="set/pnl"
                              width="100px">
                <template #default="scope">
                  <div v-for="item in scope.row.pnl.pnlSetBoList">
                    {{item.quantity}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center"
                              label="pcs/大料"
                              width="100px">
                <template #default="scope">
                  <div v-for="item in scope.row.pnl.pnlSetBoList">
                    {{scope.row.count * item.quantity * item.saleOrderBo.unitedNumber}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center"
                              label="pcs/pnl"
                              width="100px">
                <template #default="scope">
                  <div v-for="item in scope.row.pnl.pnlSetBoList">
                    {{item.quantity * item.saleOrderBo.unitedNumber}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center"
                              label="预投pcs数"
                              width="100px">
                <template #default="scope">
                  <div v-for="item in scope.row.pnl.pnlSetBoList" style="color:red">
                    {{(scope.row.preFeedQuantity * item.quantity * item.saleOrderBo.unitedNumber).toFixed(0)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center"
                              label="预投pnl数">
                <template #default="scope">
                  <el-input-number v-model="scope.row.preFeedQuantity"
                                  :min="0"
                                  :precision="0"
                                  style="width:100%"
                                  @change="onPnlPreFeedQuantityChange(scheme,scope.row)"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>

            <!--开料图-->
            <el-collapse style="width:100%;" value="schemeImg">
              <el-collapse-item title="开料图" name="schemeImg">
                <XUpload v-model:model-value="scheme.schemeFileList" :isHideDelete="true" :readOnly="true"></XUpload>
              </el-collapse-item>
            </el-collapse>

          </el-card>
        </el-form>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancel">取消</el-button>
          <el-button :loading="buttonLoading" type="success" @click="submitForm(false,false)">保存</el-button>
          <el-button style="float:right;" :loading="buttonLoading" type="primary" @click="submitButton(true)">审核通过</el-button>
          <el-button style="float:right;" :loading="buttonLoading" type="danger" @click="submitReject()">审核驳回</el-button>
        </div>
      </template>
    </el-drawer>

    <!--设置投料率-->
    <el-dialog :title="dialog.title"
               v-model="dialog.visible"
               :close-on-click-modal="false"
               width="400px">
      <el-form label-width="60px">
        <el-form-item label="投料率">
          <el-input type="number"
                    v-model="schemeChargeRate[currentSchemeIndex]">
            <template #append>%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary"
                   @click="onSetSchemeChargeRateClick">确定
        </el-button>
      </div>
    </el-dialog>
    <MIPrint ref="MIPrintRef" ></MIPrint>
  </div>
</template>

<script setup name="OrderPrediction" lang="ts">
  import {OrderVO, OrderQuery, OrderForm} from '@/api/order/directOrder/types';
  import {computed, ref} from "vue";
  import {VxeTableEvents, VxeTableInstance, VxeTablePropTypes} from "vxe-table";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {getMiInfo, postListOrderPrediction, savePrediction,checkSaleOrderByBo,revocationProductionPlan} from "@/api/project/productionPlan";
  import dayjs from "dayjs";
  import * as xlsx from 'xlsx';
  // import * as xlsxs from 'xlsx-style-vite'
  // import xlsxs from "xlsx-style";// vue3不支持
  import fileSaver from "file-saver";
  import {deepClone} from "@/utils";
  import { getListCustomer } from "@/api/basedata/customer";

  //mi打印
  const MIPrintRef = ref();
  const finishSort1Flag = ref(false)
  const finishSort2Flag = ref(false)

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const xTable = ref();
  const xTableOut = ref();
  const orderPredictionList = ref<any[]>([]);
  const outOrderPredictionList = ref<any[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const queryFormRef = ref<ElFormInstance>();
  const orderPredictionFormRef = ref<ElFormInstance>();
  let currentMiInfo = ref<any>({});
  const dialogTableLoading = ref(false)
  const radioTable = ref('本厂订单');

  let resDictData = ref({
    //订单类型
    order_type: [],
    //批量/样品
    order_model: [],
    //加急
    order_urgent: [],
    //成品板厚
    finish_plate_thickness: [],
    //表面处理
    order_surface_treatment: [],
    //测试方式
    order_commodity_testway: [],
    //铜厚
    order_material_copperoutside: [],
    //板材
    order_material_quality: [],
    //板材品牌
    order_plate_brand: [],
    //产品类型
    sys_commodity_type: [],
  })

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  //MI对应的Scheme
  let schemeList = ref<any>([]);
  //MI对应的Pnl
  let pnlList = ref<any>([]);
  //不同开料方案的投料率
  let schemeChargeRate = ref<Array<Number>>([]);
  //投料率(多投)
  const chargeRate = ref<number>(1);
  //投料面积,
  const chargeArea = ref<number>(0);

  //当前选中的开料方案
  const currentSchemeIndex = ref<number>(0);

  const checkedInfos = ref<Array<any>>([]);

  const orderUrgentTypeList = ref([]);
  const statusList = ref([
    {label: '未投料', value: 3},
    {label: '已投料', value: 4},
  ]);

  const dateFormat = (cellValue : any) => {
    return dayjs(cellValue).format("YYYY-MM-DD")
  }

  const customerCodeList = ref();

  const columnList = ref([
    {type: 'checkbox', width: '60',  align: 'center', showOverflow: false},
    {title: "序号", width: '60',  field: 'index', type: 'seq', align: 'center', showOverflow: false},
    {
      title: '状态', width: '60',  field: 'status', align: 'center',
      // filterType: 'radio', filterParam: {placeholder: '请选择'},
      // filterData: () => statusList.value
    },
    {
      title: '下单日期', width: '80',  field: 'saleOrderVo.placeOrderTime', align: 'center',

    },
    {
      title: '投料日期', width: '120',  field: 'preFeedTime', align: 'center',

    },
    {title: '订单类型', width: '60',  field: 'orderType', align: 'center'},
    {
      title: '产品编码',
      width: '120',

      field: 'saleOrderVo.commodityCode',
      align: 'center',
      // filterType: 'input',
      // filterParam: {placeholder: '请输入产品编号'}
    },
    {title: '大料PNL数', width: '80',  field: 'pnlQuantity', align: 'center'},
    {title: '批量/样品', width: '80', field: 'saleOrderVo.model', align: 'center'},
    {
      title: '加急', width: '80', field: 'saleOrderVo.urgent', align: 'center',

    },
    {title: '订单数量', width: '80', field: 'saleOrderVo.quantity', align: 'center'},
    {title: '投料数量', width: '80', field: 'preFeedQuantity', align: 'center'},
    {title: '投料率', width: '80', field: 'preFeedRate', align: 'center'},
    {title: '订单面积', width: '80', field: 'saleOrderVo.area', align: 'center'},
    {title: '投料面积', width: '80', field: 'productionArea', align: 'center'},
    {title: '多投面积', width: '80', field: 'differArea', align: 'center'},
    {title: '投pnl数', width: '100', field: 'productionPnl', align: 'center'},
    {title: '投大料数(张)', width: '100', field: 'productionScheme', align: 'center'},
    {title: '大料面积(m²)', width: '100', field: 'schemeArea', align: 'center'},
    {title: '大料利用率(%)', width: '100', field: 'schemeUtilization', align: 'center'},
    {title: '测试方式', width: '80', field: 'saleOrderVo.commodityTestWay', align: 'center'},
    {title: '平米价(元/㎡)', width: '90', field: 'saleOrderVo.areaPrice', align: 'center'},
    {title: '合计金额', width: '80', field: 'saleOrderVo.totalPrice', align: 'center'},
    {title: '开料板厚铜厚(mm OZ)', width: '140', field: 'thickness', align: 'center'},
    {title: '层数', width: '80', field: 'saleOrderVo.materialLayer', align: 'center'},
    {title: '大料规格', width: '80', field: 'schemeSpecification', align: 'center'},
    {title: 'PCS/大料', width: '100', field: 'pcsPerScheme', align: 'center'},
    {title: '表面处理', width: '80', field: 'saleOrderVo.surfaceTreatment', align: 'center'},
    {title: '板材', width: '80', field: 'saleOrderVo.materialQuality', align: 'center'},
    {title: '客户', width: '160', field: 'saleOrderVo.cusName', align: 'center'},
    {title: '单位面积', width: '80', field: 'singleArea', align: 'center'},
    {title: 'SET长', width: '80', field: 'saleOrderVo.unitedLength', align: 'center'},
    {title: 'SET宽', width: '80', field: 'saleOrderVo.unitedWidth', align: 'center'},
    {title: 'PCS/SET', width: '80', field: 'saleOrderVo.unitedNumber', align: 'center'},
    {title: '大料长(mm)', width: '100', field: 'schemeLength', align: 'center'},
    {title: '大料宽(mm)', width: '100', field: 'schemeWidth', align: 'center'},
    {title: '大料使用面积(m²)', width: '120', field: 'productionSchemeArea', align: 'center'},
    {
      title: 'MI单号',
      width: '100',
      field: 'code',
      align: 'center',

    },
    {
      title: '产品名称',
      width: '160',
      field: 'saleOrderVo.commodityName',
      align: 'center',

    },
    {
      title: '客户编码',
      width: '120',
      field: 'saleOrderVo.customerCode',
      align: 'center',

    },
    {
      title: '销售单号',
      width: '120',
      field: 'saleOrderVo.code',
      align: 'center',

    },
    {title: '制单时间', width: '120', field: 'createTime', align: 'center'},
    {title: '审核时间', width: '120', field: 'auditTime', align: 'center'},
    {title: '投料人', width: '80', field: 'preFeedUserName', align: 'center'},
    {title: '制单人', width: '80', field: 'createByName', align: 'center'},
    {title: '审核人', width: '80', field: 'preFeedAuditUserName', align: 'center'},
    {title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false},
  ]);

  const setRowStyle = ({row, rowIndex, $rowIndex}: any) => {
    if(!row.saleOrderVo){
      return;
    }
    if (row.saleOrderVo.status == '3') {
      return {
        backgroundColor: '#ECB0B1',
      }
    }
    if (row.saleOrderVo.flowStatus == '8' || row.saleOrderVo.flowStatus == '7') {
      return {
        backgroundColor: '#FAECD8',
      }
    }
    if (row.saleOrderVo.isInventoryShipped == '1') {
      return {
        backgroundColor: '#e1e5fd',
      }
    }
  }


  const rowSpanMethod = ({row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data}: any) => {
    if (column.property === "status" || column.property === "schemeLength" || column.property === "schemeWidth") {
      // 合并参考字段,根据此字段进行合并行
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
        return {rowspan: 0, colspan: 0};
      } else {
        let countRowspan = 1;
        while (nextRow && nextRow[referenceField] === row[referenceField]) {
          nextRow = data[++countRowspan + $rowIndex];
        }
        if (countRowspan > 1) {
          return {rowspan: countRowspan, colspan: 1};
        }
      }
    }
  }

  //计算合并 开启虚拟滚动时使用该方法  :merge-cells="mergeCellsMethod"
  const mergeCellsMethod = computed({
    get() {
      const mergeCells: any = [];
      const referenceFields = ["status", "schemeLength", "schemeWidth"];
      for (let rowIndex = 0; rowIndex < orderPredictionList.value.length; rowIndex++) {
        const row = orderPredictionList.value[rowIndex];
        const prevRow = orderPredictionList.value[rowIndex - 1];
        let nextRow = orderPredictionList.value[rowIndex + 1];
        if (rowIndex > 0 && referenceFields.every(field => row['code'] === prevRow['code'])) {
          // 当前行与前一行相同，不显示当前行
          continue;
        }
        let countRowspan = 1;

        while (nextRow && referenceFields.every(field => nextRow['code'] === row['code'])) {
          nextRow = orderPredictionList.value[++countRowspan + rowIndex];
        }
        if (countRowspan > 1 ) {
          // 需要合并的情况
          referenceFields.forEach((field, colIndex) => {
            const col = getColumnIndex(field); // 获取列索引
            mergeCells.push({row: rowIndex, col, rowspan: countRowspan, colspan: 1});
          });
        }
      }
      console.log(finishSort1Flag.value)
      return (finishSort1Flag.value || finishSort2Flag.value || true) && mergeCells;
    },
    set(val: any) {
      return val
    }
  })

  const getColumnIndex = (field: any) => {
    // return new Promise((resolve, reject) => {
    //   nextTick(() => {
      const $table = radioTable.value == "本厂订单" ? xTable.value.xTableRef : xTableOut.value.xTableRef;
      if ($table) {
        const columns = radioTable.value == "本厂订单" ? xTable.value.xTableRef.getColumns() : xTableOut.value.xTableRef.getColumns();
        const columnIndex = columns.findIndex(col => col.field === field);
        return columnIndex;
      }
    //   })
    // })
  };

  const footerMethod: VxeTablePropTypes.FooterMethod<any> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == "saleOrderVo.area") {
          return `${sumNum(data, "saleOrderVo.area").toFixed(4)} `;
        }
        if (column.field == "productionArea") {
          return `${sumNum(data, "productionArea").toFixed(4)} `;
        }
        if (column.field == "differArea") {
          return `${sumNum(data, "differArea").toFixed(4)} `;
        }
        return "";
      })
    ];
  };

  const sumNum = (list: any[], field: string) => {
    let count = 0;
    list.forEach(item => {
      if (field.includes('.')) {
        const tempArr = field.split('.')
        let tempRes = 'item'
        tempArr.forEach((v: any) => {
          tempRes += `['${v}']`
        })
        // console.log(field + "值.为：" + eval(tempRes))
        const _saleVo=eval('item'+'.'+tempArr[0]);
        if(_saleVo){
          count += Number(eval(tempRes));
        }
      } else {
        // console.log(field + "值为：" + item[field])
        if(item[field]){
          count += Number(item[field]);
        }
      }
    });
    return Number(count.toFixed(4));
  };

  const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({checked}) => {
      const $table = xTable.value.xTableRef;
    if ($table) {
      const records = $table.getCheckboxRecords();
      console.log(records)
      checkedInfos.value = records.map((item: any) => item);
      single.value = records.length != 1;
      multiple.value = !records.length;
    }
  }

  const selectChangeEvent: VxeTableEvents.CheckboxChange<any> = ({row, checked}) => {
    if (checked) {
      checkedInfos.value.push(row)
    } else {
      checkedInfos.value = checkedInfos.value.filter(info => {
        return info.saleOrderVo.id != row.saleOrderVo.id
      });
    }
  }

  const selectAllChangeOutEvent: VxeTableEvents.CheckboxAll<any> = ({checked}) => {
    const $table = xTableOut.value.xTableRef;
    if ($table) {
      const records = $table.getCheckboxRecords();
      console.log(records)
      checkedInfos.value = records.map((item: any) => item);
      single.value = records.length != 1;
      multiple.value = !records.length;
    }
  }

   const getMonday=() =>{
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      return formatDateTime(new Date(now.setDate(diff)).setHours(0, 0, 0, 0));
    }
    // 获取本周的星期日
    const  getSunday=()=> {

      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? 0 : 7); // adjust when day is Sunday
      return formatDateTime(new Date(now.setDate(diff)).setHours(23, 59, 59, 999));
    }

    const formatDateTime=(date)=> {
  const formattedDate = new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  //  const formattedDate = new Date(date).toLocaleString('en-US', {timeZone: 'Asia/Shanghai'}).replace(/T/, ' ').replace(/\..+/, '');
  // const formattedDate = new Intl.DateTimeFormat('en-US', {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   timeZone: 'Asia/Shanghai'
  // }).format(new Date(date));

  return formattedDate;
}
  const initFormData: any = {
    placeOrderTime: undefined,
    miUserId: undefined,
    camUserId: undefined,
  }

  const data = reactive<PageData<any, any>>({
    form: {...initFormData},
    queryParams: {
      startTime: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD 00:00:00"),  // 设置默认开始日期为本周的星期一
      endTime: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
      commodityCode: undefined,
      commodityName: undefined,
      customerCode: undefined,
      orderCode: undefined,
      miCode: undefined,
      urgent: undefined,
      status: '3',
      isNeedPreFeed: '1',
    },
    rules: {
      miUserId: [
        {required: true, message: "MI工程师不能为空", trigger: "blur"}
      ]
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  /**
   * 获取字典数据
   */
    const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_type,order_model,order_urgent,finish_plate_thickness,order_surface_treatment,order_commodity_testway," +
      "order_plate_brand,order_material_copperoutside,order_material_quality,sys_commodity_type";
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
  };

  const updateStatus = async (status: number) => {
    buttonLoading.value = true;
    if (!checkedInfos.value.length > 0) {
      buttonLoading.value = false;
      return;
    }
    const _planIds=checkedInfos.value.map(obj => obj.id);
    let check =false;
        check = await checkSaleOrderByBo({planIds:_planIds}).catch(() => {buttonLoading.value = false});
    if (!check) {
        buttonLoading.value = false;
        return;
    }

    let orderList: any[] = [];
    let pnlBoList: any[] = [];
    let schemeBoList: any[] = [];
    let pnlCountList: any[] = [];

    checkedInfos.value.forEach(info => {
      info.saleOrderVoList && info.saleOrderVoList.forEach(orderVo => {
        orderList.push(orderVo)
      })
      pnlBoList.push(...info.pnlBoList)
      schemeBoList.push(...info.schemeBoList)
      info.schemeBoList && info.schemeBoList.forEach(scheme=>{
        pnlCountList.push(...scheme.pnlCountList)
      })
    })
    const data = {
      finished: status == 1 ? true : undefined,
      isReject: status == 0 ? true : undefined,
      isPreReject: status == 0 ? true : undefined,
      idList: checkedInfos.value.map(obj => obj.id),
      pnlBoList: pnlBoList,
      schemeBoList: schemeBoList,
      pnlCountList: pnlCountList,
      orderList: orderList
    }
    savePrediction(data).then(res => {
      ElMessage.success("操作成功");
      loading.value = false;
      buttonLoading.value = false;
      if (radioTable.value == "本厂订单") {
        getList();
      }else{
        getOutList();
      }
    }).catch((e)=>{
      buttonLoading.value = false;
    });
  }

  /*预投*/
  const openEdit = async (row?: any) => {
    form.value = row;
    dialogTableLoading.value = true
    drawer.visible = true;
    const res = await getMiInfo(row.id);
    const data = res.data;
    currentMiInfo.value = row;
    schemeList.value = data.schemeBoList;
    pnlList.value = data.pnlBoList;
    dealNodeInfoList(data.nodeInfoList);
    schemeChargeRate.value = [];
    schemeList.value.forEach((scheme: any, index: number) => {
      //分scheme设置投料利用率的默认值
      schemeChargeRate.value.push(100 + chargeRate.value);
      //处理Pnl
      const pnlArray: any[] = [];
      scheme.pnlCountList.forEach(pnlCount => {
        const pnl = pnlList.value.find(o => {
          return o.id == pnlCount.pnlId;
        });
        if (pnl) {
          pnlArray.push({
            pnl: pnl,
            id: pnlCount.id,
            count: pnlCount.pnlQuantity,
            preFeedQuantity: pnlCount.preFeedQuantity !=null ? pnlCount.preFeedQuantity : scheme.preFeedQuantity * pnlCount.pnlQuantity
          });
        }
      });
      scheme.pnlList = pnlArray;
    });
    onChargeChanged();
    dialogTableLoading.value = false
  }

  //计算大料对应的pnl数
  const countPnlCharge = (scheme: any) => {
    let maxSchemeChage = 0;
    scheme.pnlList.forEach(pnl => {
      //计算pnl的数量，遇到小数时，向上取整
      const pnlCount = Math.ceil(scheme.preFeedQuantity * pnl.count);
      pnl.preFeedQuantity = pnlCount;
      //根据pnl数，计算需要的大料数
      if (pnl.count) {
        const needScheme = (pnl.preFeedQuantity / pnl.count).toFixed(2);
        if (needScheme > maxSchemeChage) {
          maxSchemeChage = needScheme;
        }
      }
    })
    scheme.preFeedQuantity = maxSchemeChage;
    onChargeChanged();
  }


  //投料信息发生改变
  const onChargeChanged = () => {
    let totalChargeArea = 0;
    schemeList.value.forEach(scheme => {
      scheme.pnlList.forEach(pnl => {
        //按Pnl算
        //var pnlArea = pnl.pnl.width * pnl.pnl.length / 1000000;
        //totalChargeArea += pnl.preFeedQuantity * pnlArea;

        //按set算
        pnl.pnl.pnlSetBoList.forEach((set) => {
          const setArea = set.saleOrderBo.unitedLength * set.saleOrderBo.unitedWidth / 1000000;
          totalChargeArea += pnl.preFeedQuantity * set.quantity * setArea;
        })

      });
    });
    chargeArea.value = Number(totalChargeArea.toFixed(6));
  }

  //投料数量改变时发生
  const onSchemePreFeedQuantityChange = (scheme: any) => {
    countPnlCharge(scheme);
    onChargeChanged();
  }

  //预投pnl数量改变时发生
  // const onPnlPreFeedQuantityChange = (scheme: any, pnl: any) => {
  //   console.log(pnl)
  //   console.log(scheme);
  //   // const sumCount = scheme.pnlCountList.reduce((accumulator, currentValue) => accumulator + Number(currentValue.pnlQuantity), 0).toFixed(2);
  //   let sumArea = 0;
  //   scheme.pnlList.forEach(schemePnl=>{
  //     sumArea += Number(schemePnl.count * schemePnl.pnl.pnlLength * schemePnl.pnl.pnlWidth);
  //   })
  //   const oldPnlCount = scheme.pnlCountList.find(vo => vo.id == pnl.id)
  //   // const needSchemeCount = (pnl.preFeedQuantity / pnl.count).toFixed(2);
  //   const oldScheme = deepClone(scheme);
  //   if (pnl.count) {
  //     // scheme.preFeedQuantity = needSchemeCount;
  //     console.log(pnl)
  //     console.log(sumArea)
  //     const itemArea = Number(pnl.count *pnl.pnl.pnlLength * pnl.pnl.pnlWidth);
  //     const rate = itemArea /sumArea;
  //     console.log("此pnl占大料的比值：" + rate)
  //     console.log("原预投数量:" + oldPnlCount.preFeedQuantity)
  //     console.log("一个pnl占大料的比值：" + rate / pnl.count);
  //     console.log("现在预投数量:"+pnl.preFeedQuantity)
  //     console.log( (rate / pnl.count) * (oldPnlCount.preFeedQuantity - pnl.preFeedQuantity));
  //     const diffQuantity = oldPnlCount.preFeedQuantity - pnl.preFeedQuantity
  //     console.log("数量差值"+diffQuantity);
  //     const needSchemeCount = oldScheme.preFeedQuantity -  (rate / pnl.count ) * diffQuantity;
  //     oldPnlCount.preFeedQuantity = pnl.preFeedQuantity
  //
  //     console.log(needSchemeCount)
  //     scheme.preFeedQuantity = Number(needSchemeCount.toFixed(2));
  //     console.log( scheme.preFeedQuantity);
  //     // onChargeChanged();
  //   }
  // }

  //预投pnl数量改变时发生
  const onPnlPreFeedQuantityChange = (scheme: any, pnl: any) => {
    if (pnl.count) {
      const needSchemeCount = (pnl.preFeedQuantity / pnl.count).toFixed(2);
      let maxSchemeChage = needSchemeCount;
      console.log(pnl)
      console.log(scheme.pnlList)
      scheme.pnlList.filter(vo => vo.id != pnl.id).forEach(pnl => {
          const needScheme = (pnl.preFeedQuantity / pnl.count).toFixed(2);
          if (needScheme > maxSchemeChage) {
            maxSchemeChage = needScheme;
          }
      })
      scheme.preFeedQuantity = maxSchemeChage;
    }
  }

  //-------------设置开料利用率--------------
  //设置按钮点击事件
  const onSetRateClick = (schemeIndex: number) => {
    currentSchemeIndex.value = schemeIndex;
    dialog.visible = true;
    dialog.title = "设置投料率"
  }

  const cancelDialog = () => {
    dialog.visible = false;
    loading.value = false;
  }

  //设置预投率确定按钮点击事件
  const onSetSchemeChargeRateClick = () => {
    countMaterialNum(currentSchemeIndex.value);
    dialog.visible = false;
  }

  //计算大料数（可为小数）
  const countMaterialNum = (schemeIndex: number) => {
    //当前开料方案
    var scheme = schemeList.value[schemeIndex];
    var schemeRate = Number(schemeChargeRate.value[schemeIndex]);
    //先根据订单数量计算需要的大料数量
    var materialNum = 0;
    form.value.saleOrderVoList.forEach(saleOrderDetail => {
      var orderQuantity: number = saleOrderDetail.quantity;
      //根据投料率计算出需要满足的pcs数量
      var needQuantity = Math.ceil(orderQuantity * schemeRate / 100);
      //当前Scheme中的 pcs 数
      var pcsPerScheme = getSchemeCommidtyPcs(scheme, saleOrderDetail.id, saleOrderDetail.unitedNumber);
      if (pcsPerScheme) {
        var num = needQuantity / pcsPerScheme;
        num = Number(num.toFixed(2));
        if (num > materialNum) {
          materialNum = num;
        }
      }
    });
    scheme.preFeedQuantity = materialNum;
    //计算大料对应的Pnl
    countPnlCharge(scheme);
  }

  //计算指定开料方案下，某个产品的总数量，pcs/大料
  const getSchemeCommidtyPcs = (scheme: any, id: any, unitedNumber: any) => {
    var total = 0;
    //循环开料方案下的pnlCount
    scheme.pnlCountList.forEach((item, index) => {
      //在对应的pnlList中找到指定商品的Set
      var setPnls = pnlList.value[index].pnlSetBoList.filter((set) => {
        if (set.quantity && set.saleOrderBo.id == id) {
          return set;
        }
      });
      //如果pnl下的set数量大于0，则计算
      if (item.pnlQuantity) {
        setPnls.forEach((set) => {
          total += item.pnlQuantity * set.quantity * unitedNumber;
        });
      }
    });
    return total;
  }

  const boardThickness = ref();

  const copperThickness = ref();

  /*节点数据处理*/
  const dealNodeInfoList = (nodeInfoList: []) => {
    schemeList.value.forEach(scheme => {
      scheme.boardThickness = scheme.rawMaterial?.boardThickness
      scheme.copperThickness = scheme.rawMaterial?.copperThickness
    })
    nodeInfoList.length > 0 && nodeInfoList.forEach(nodeInfo => {
      if ("CuttingMaterial_System" == nodeInfo.code) {
        nodeInfo.requirement.length > 0 && nodeInfo.requirement.forEach(item => {
          if ("BoardThickness" == item.code || "板厚" == item.code) {
            if ("1" == item.isDifferentiatePnl) {
              item.differPNL.forEach(differ => {
                schemeList.value.forEach(scheme => {
                  if (differ.pnlName = scheme.name) {
                    scheme.boardThickness = differ.parameterValue ? differ.parameterValue : differ.defaultValue
                  }
                })
              })
            } else {
              boardThickness.value = item.defaultValue;
              schemeList.value.forEach(scheme => {
                scheme.boardThickness = boardThickness.value;
              })
            }
          }
          if ("CopperThickness" == item.code || "铜厚" == item.code) {
            if ("1" == item.isDifferentiatePnl) {
              item.differPNL.forEach(differ => {
                schemeList.value.forEach(scheme => {
                  if (differ.pnlName = scheme.name) {
                    scheme.copperThickness = differ.parameterValue ? differ.parameterValue : differ.defaultValue
                  }
                })
              })
            } else {
              copperThickness.value = item.defaultValue;
              schemeList.value.forEach(scheme => {
                scheme.copperThickness = copperThickness.value;
              })
            }
          }

        })
      }
    })
  }
  const getOutList = async () => {
    loading.value = true;
    // queryParams.value.isOutsource = '1';
    const res = await postListOrderPrediction(queryParams.value);
    outOrderPredictionList.value = res.data.filter(mi=>{
      return mi.saleOrderVoList.filter(order=> order.flowStatus == '7'||order.flowStatus == '8').length > 0
    })
    // outOrderPredictionList.value = res.data;
    computePredictionList(outOrderPredictionList.value);
    loading.value = false;
  }

  /** 查询订单预投列表 */
  const getList = async () => {
    loading.value = true;
    // queryParams.value.isOutsource = '0';
    const res = await postListOrderPrediction(queryParams.value);
    orderPredictionList.value = res.data.filter(mi=>{
      return mi.saleOrderVoList.filter(order=> order.flowStatus != '7' && order.flowStatus != '8').length > 0
    })
    // orderPredictionList.value = res.data;
    computePredictionList(orderPredictionList.value);
    loading.value = false;
  }

  //原list数据处理
  const computePredictionList = (preList:any) => {
    console.log("computePredictionList",preList);
    console.log("computePredictionList",preList.filter(item=>!item.saleOrderVo||item.saleOrderVo.length==0));

    preList.forEach(item => {
      const _saleVo = item.saleOrderVo;
      if(!_saleVo){
        return
      }
      //单位面积
      item.singleArea = formatAreaData(_saleVo.unitedLength * _saleVo.unitedWidth / _saleVo.unitedNumber / 1000000);
      //投pnl数
      item.productionPnl = item.pnlBoList.length > 1 ? item.pnlBoList.map(x => {
        return x.preFeedQuantity
      }).join("/") : item.pnlBoList[0].preFeedQuantity;
      //大料长
      item.schemeLength = item.schemeBoList.length > 1 ? item.schemeBoList.map(x => {
        return x.name.replace("开料方案","") + ":" + x.boardLength
      }).join("/") : item.schemeBoList[0].boardLength;
      //大料宽
      item.schemeWidth = item.schemeBoList.length > 1 ? item.schemeBoList.map(x => {
        return x.name.replace("开料方案","") + ":" + x.boardWidth
      }).join("/") : item.schemeBoList[0].boardWidth;
      //投大料数(张)
      item.productionScheme = item.schemeBoList.length != 1 ? item.schemeBoList.map(x => {
        return x.name + ":" + x.preFeedQuantity
      }).join("/") : item.schemeBoList[0].preFeedQuantity;
      //投料数量
      var total = 0;
      item.pnlBoList.forEach(pnl => {
        pnl.pnlSetBoList.forEach(set => {
          if (_saleVo.id == set.saleorderId) {
            total += Number(pnl.preFeedQuantity * set.quantity * _saleVo.unitedNumber);

          }
        })
      });
      item.preFeedQuantity = total;
      //大料pnl数
      var pnlQuantity = 0;
      item.schemeBoList.forEach(scheme => {
        scheme.pnlCountList.forEach(schemePnl => {
          pnlQuantity += Number(schemePnl.pnlQuantity);
        })
      })
      item.pnlQuantity = pnlQuantity;
      //大料使用面积(m²)
      item.productionSchemeArea = item.schemeBoList.map(x => {
        //（SET面积*SET/大料数）  SET/大料数=SET/PNL数*PNL/大料数
        var userArea = 0;
        x.pnlCountList.forEach(schemePnl => {
          item.pnlBoList.forEach(pnl => {
            pnl.pnlSetBoList.forEach(pnlSet => {
              if (pnlSet.pnlId == schemePnl.pnlId && x.id == schemePnl.schemeId && _saleVo.id == pnlSet.saleorderId) {
                userArea += Number(_saleVo.unitedLength * _saleVo.unitedWidth * pnlSet.quantity * schemePnl.pnlQuantity / 1000000);
              }
            })
          })
        })
        return item.schemeBoList.length != 1 ? x.name + ":" + formatAreaData(userArea) : formatAreaData(userArea);
      }).join("/")
      //投料面积
      var productionArea = 0;
      item.productionArea = item.pnlBoList.forEach(pnl => {
        pnl.pnlSetBoList.forEach(pnlSet => {
          if (_saleVo.id == pnlSet.saleorderId) {
            productionArea += _saleVo.unitedLength * _saleVo.unitedWidth * pnl.preFeedQuantity * pnlSet.quantity / 1000000
          }
        })
        return productionArea;
      })
      item.productionArea = formatAreaData(productionArea);
      //大料规格
      item.schemeSpecification = item.schemeBoList.map(x => {
        return item.schemeBoList.length != 1 ? x.name + ":"  + (x.rawMaterial?.length||"0") + "*" + (x.rawMaterial?.width||"0")
          :  + (x.rawMaterial?.length||"0") + "*" + (x.rawMaterial?.width||"0")
      }).join("/")
      //PCS/大料
      const pcsMap = new Map();
      item.schemeBoList.forEach(scheme => {
        scheme.pnlCountList.forEach(pnlCount => {
          pnlCount.pnlBoList = item.pnlBoList;
        })
        let schemePcs = pcsMap.get(scheme.name);
        let pcsQuantity = 0;
        scheme.pnlCountList.forEach(pnlCount => {
          pnlCount.pnlBoList.forEach(pnl => {
            const pnlSet = pnl.pnlSetBoList.find(v => v.saleorderId == _saleVo.id);
            if (scheme.id == pnlCount.schemeId && pnlCount.pnlId == pnl.id && pnl.id == pnlSet.pnlId) {
              pcsQuantity += Number(pnlCount.pnlQuantity * pnlSet.quantity * _saleVo.unitedNumber);
            }
          })
        })
        pcsMap.set(scheme.name, Number((schemePcs ? schemePcs : 0) + pcsQuantity))
      })
      let pcsPerScheme = "";
      pcsMap.forEach((value, key) => {
        pcsPerScheme += key + ":" + value + "/";
      })
      pcsPerScheme = pcsPerScheme.replace("开料方案","").slice(0,-1);
      item.pcsPerScheme = item.schemeBoList.length > 1?  pcsPerScheme : Array.from(pcsMap.values()).join(",");
      //item.pcsPerScheme
      //大料利用率(%)
      item.schemeUtilization = item.schemeBoList.length != 1 ? item.schemeBoList.map(x => {
        return x.name + ":" + x.cuttingRate && Number(x.cuttingRate).toFixed(2) + "%"
      }).join("/") : (item.schemeBoList[0].cuttingRate && (Number(item.schemeBoList[0].cuttingRate).toFixed(2) + "%"));

      //大料面积
      item.schemeArea = item.schemeBoList.length != 1 ? item.schemeBoList.map(x => {
        return x.name + ":" + formatAreaData(x.boardLength * x.boardWidth / 1000000)
      }).join("/") : formatAreaData(item.schemeBoList[0].boardLength * item.schemeBoList[0].boardWidth / 1000000);

      item.differArea = formatAreaData((item.productionArea - _saleVo.area > 0) ? (item.productionArea - _saleVo.area) : 0)

      item.preFeedRate = Number(total / _saleVo.quantity).toFixed(2);
      var index = item.thickness.indexOf(":",1);
      item.thickness = item.schemeBoList.length > 1 ? item.thickness : (item.thickness.substring(index+1,item.thickness.length));
    })

  }
  //是否需要投料
  const onChangeNeedMICharge = async () => {
    await getList();
  }

  //格式化面积显示
  const formatAreaData = (value: number) => {
    var length = 4;
    var tmp = Math.pow(10, length);
    var result = Math.round(value * tmp) / tmp;
    return result.toFixed(length);
  }

  /**审核驳回按钮  */
  const submitReject = () => {
    buttonLoading.value = true;
    const _planId=currentMiInfo.value.id;
    let check =false;
        check = checkSaleOrderByBo({planId:_planId}).catch(() => {buttonLoading.value = false});
    if (!check) {
        buttonLoading.value = false;
        return;
    }
    ElMessageBox.confirm(
      '确定将MI单' + currentMiInfo.value.code + '驳回到MI？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      return submitForm(false,true);
    }).catch(() => {
      buttonLoading.value = false;
    })
  }

  /**审核通过按钮  */
  const submitButton = () => {
    buttonLoading.value = true;
    const _planId=currentMiInfo.value.id;
    let check =false;
        check = checkSaleOrderByBo({planId:_planId}).catch(() => {buttonLoading.value = false});
    if (!check) {
        buttonLoading.value = false;
        return;
    }
      ElMessageBox.confirm(
      '确定将MI单' + currentMiInfo.value.code + '下发到工厂生产？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      return submitForm(true,false);
    }).catch(() => {
      buttonLoading.value = false;
    })
  }

  /** 提交按钮 */
  const submitForm = async (finished: boolean, reject: boolean) => {
    if (!finished && !reject) {
      // finished/reject 都为false时，为保存按钮，需要开启loading
      buttonLoading.value = true;
    }
    const _planId=currentMiInfo.value.id;
    let check =false;
        check = checkSaleOrderByBo({planId:_planId}).catch(() => {buttonLoading.value = false});
    if (!check) {
        buttonLoading.value = false;
        return;
    }

    if(finished){
      const checkResult = await checkData();
      if (checkResult) {
        buttonLoading.value = false;
        return;
      }
    }
    let pnlBoList = [];
    let schemeBoList: any = [];
    let pnlCountList: any = []
    let map = new Map();
    let orderList: any[] = [];
    currentMiInfo.value.saleOrderVoList && currentMiInfo.value.saleOrderVoList.forEach(orderVo => {
      orderList.push(orderVo)
    })
    schemeList.value.forEach(scheme => {
      scheme.pnlList.forEach(schemePnl => {
        const value = map.get(schemePnl.pnl.id);
        const oldNumber = Number.isNaN(value) || value === undefined ? 0 : value;
        const newNumber = oldNumber + Number(schemePnl.preFeedQuantity);
        map.set(schemePnl.pnl.id, newNumber);
        let schemePnlInfo = {
          id: schemePnl.id,
          pnlId: schemePnl.pnl.id,
          preFeedQuantity: Number(schemePnl.preFeedQuantity)
        }
        pnlCountList.push(schemePnlInfo);
      })
      let schemeInfo = {
        id: scheme.id,
        preFeedQuantity: Number(scheme.preFeedQuantity)
      }
      schemeBoList.push(schemeInfo);
    })
    for (let [key, value] of map) {
      pnlBoList.push({
        id: key,
        preFeedQuantity: value
      })
    }
    const data = {
      id: currentMiInfo.value.id,
      finished: finished,
      isReject: reject,
      pnlBoList: pnlBoList,
      schemeBoList: schemeBoList,
      pnlCountList: pnlCountList,
      orderList: orderList,
    }
    loading.value = true;
    savePrediction(data).then(res => {
      buttonLoading.value = false;
      ElMessage.success("操作成功");
      loading.value = false;
      if (radioTable.value == "本厂订单") {
        getList();
      }else{
        getOutList();
      }
      cancel();
    }).catch(() => {
      buttonLoading.value = false;
    });
  }

  const checkData = async () => {
    //验证数据
    var isOverRate = false;
    //判断投料数量是否满足
    for (var detail of form.value.saleOrderVoList) {
      var chargeQuantity = getCommodityPcsQuantity(detail.id);
      // if (chargeQuantity < detail.quantity) {
      //   const message = detail.commodityCode + "投料数量不足";
      //   ElMessage.error(message);
      //   return true;
      // }
      if (chargeQuantity <= 0) {
        const message = "预投数量需要大于0";
        ElMessage.error(message);
        return true;
      }
      var rate = (chargeQuantity - detail.quantity) / detail.quantity * 100;
      if (rate > chargeRate.value) {
        isOverRate = true;
      }
    }
    //判断投料率是否超出
    if (isOverRate) {
      const confirmed = await ElMessageBox.confirm(
        '投产率大于' + chargeRate.value + '%,您确定继续吗？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        })
      if (!confirmed) {
        return false;
      }
    }
  }

  //获取产品总的PCS数量
  const getCommodityPcsQuantity = (orderId) => {
    var total = 0;
    schemeList.value.forEach(scheme => {
      scheme.pnlList.forEach(pnl => {
        pnl.pnl.pnlSetBoList.forEach(set => {
          if (set.saleOrderBo.id == orderId) {
            total += Number(pnl.preFeedQuantity * set.quantity * set.saleOrderBo.unitedNumber);
          }
        });
      });
    });
    return total;
  }

  //修改状态
  const updateNeedFeed = async (row: any, num: number) => {
    const data = {
      id: row.id,
      finished: false,
      isNeedPreFeed: num
    }
    await savePrediction(data);
    await getList();
  }

  /** 取消按钮 */
  const cancel = () => {
    reset();
    drawer.visible = false;
  }

  /** 表单重置 */
  const reset = () => {
    checkedInfos.value = [];
    form.value = {...initFormData};
    orderPredictionFormRef.value?.resetFields();
  }

  /** 搜索按钮操作 */
  const handleQuery = (params: any) => {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
          queryParams.value[key] = params[key];
        }
    });

    if(queryParams.value.status==""){
        queryParams.value.status=undefined;
    }
    if (radioTable.value == "本厂订单") {
        getList();
    }else{
        getOutList();
    }
  }

  // 导出
  const exportData = () => {
    var num = orderPredictionList.value.length;
    // columnList.value
    let _exData = orderPredictionList.value;
    if (radioTable.value != "本厂订单") {
      _exData = outOrderPredictionList.value;
    }

    if (!_exData?.length) {
      return;
    }
    const temColumnList = xTable.value?.toolList && xTable.value.toolList.filter((item: any) => item.field && item.title && item.visible).sort((a:any, b:any) => a.sortIndex - b.sortIndex) || columnList.value
    var result = _exData.map((item, index) => {
      let param = {}
      temColumnList.forEach((v: any) => {
        if (v.field && v.field != 'make') {
          if (v.field == 'index') {
            param['index'] = index + 1
          } else if (v.field == 'status') {
            param['status'] = item['status']=='3'?"未投料":"已投料"
          } else if (v.field == 'orderType') {
            param['orderType'] = resDictData.value.order_type.find((el: any) => item['saleOrderVo']&&el.dictValue == item['saleOrderVo']['orderType'])?.dictLabel
          } else if (v.field == 'saleOrderVo.commodityCode') {
            param['commodityCode'] = item['saleOrderVo']?item['saleOrderVo']['commodityCode']:''
          } else if (v.field == 'saleOrderVo.model') {
            param['model'] = resDictData.value.order_model.find((el: any) => item['saleOrderVo']&&el.dictValue == item['saleOrderVo']['model'])?.dictLabel
          } else if (v.field == 'saleOrderVo.urgent') {
            param['urgent'] = resDictData.value.order_urgent.find((el: any) => item['saleOrderVo']&&el.dictValue == item['saleOrderVo']['urgent'])?.dictLabel
          } else if (v.field == 'commodityTestWay') {
            param['commodityTestWay'] = resDictData.value.order_commodity_testway.find((el: any) => el.dictValue == item['commodityTestWay'])?.dictLabel
          } else if (v.field == 'saleOrderVo.surfaceTreatment') {
            // param['surfaceTreatment'] = resDictData.value.order_surface_treatment.find((el: any) => el.dictValue == item['saleOrderVo']['surfaceTreatment'])?.dictLabel
            param['surfaceTreatment'] = item['saleOrderVo']?item['saleOrderVo']['surfaceTreatment']:''
          } else if (v.field == 'saleOrderVo.materialQuality') {
            param['materialQuality'] = item['saleOrderVo']?item['saleOrderVo']['materialQuality']:''
          }  else if (v.field == 'saleOrderVo.placeOrderTime') {
            const date = dateFormat(item['saleOrderVo']?item['saleOrderVo']['placeOrderTime'] : '');
            param['placeOrderTime'] = date
          } else if (v.field == 'code') {
            param['miCode'] = item['code']
          } else if (v.field.includes('.')) {
            const tempArr = v.field.split('.')
            let tempRes = 'item'
            tempArr.forEach((v: any) => {
              tempRes += `['${v}']`
            })
            //兼容异常数据
            const _saleVo=eval('item'+'.'+tempArr[0]);
            if(_saleVo){
              param[tempArr[tempArr.length - 1]] = eval(tempRes)
            }
            //param[tempArr[tempArr.length - 1]] = eval(tempRes)
          } else {
            // if(item[v.field]){
              param[v.field] = item[v.field]
            // }
          }
        }
      })
      return param
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const currentDate = `${year}-${month}-${day}`;

    //数据导入
    var ws = xlsx.utils.json_to_sheet(result, { origin: "A1" });

    // ws['!merges'] = [
    //   { s: { r: 0, c: 0 }, e: { r: 0, c: 23 } }
    // ];

    //表名
    // ws["A1"] = { v: `${currentDate} 订单预投` };

    //列名
    const titleList = temColumnList.filter((item:any) => (item.field && item.field != 'make') && item.title).map((item: any) => item.title)
    xlsx.utils.sheet_add_aoa(ws, [titleList],
      { origin: "A1" });

    const wchList = titleList.map((item: any) => {
      return {
        wch: 8
      }
    })
    ws["!cols"] = wchList;

    const cellStyle = {
      font: {
        name: '宋体',
        sz: 9,
        //color: { rgb: "ffffff" },
        //bold: true,
        //italic: false,
        //underline: false,
        height: 50
      },
      alignment: { horizontal: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };

    var range = xlsx.utils.decode_range(ws["!ref"]);

    for (let i = range.s.r; i <= range.e.r; i++) {
      for (let j = range.s.c; j <= range.e.c; j++) {
        var cellName = xlsx.utils.encode_cell({ r: i, c: j });
        ws[cellName] = Object.assign({}, ws[cellName], { s: cellStyle });
      }
    }

    var workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, ws, 'sheet1');
    var file = xlsx.write(workbook, { type: 'buffer' });
    try {
      fileSaver.saveAs(
        new Blob([file], { type: "application/octet-stream" }),
        `${currentDate}-订单预投.xlsx`
      );
    } catch (e) {
      // this.$message.error(e);
    }

    // // console.log('sumData')
    // // this.isLoading = true;
    // //var tmp = this.tableData;
    // var num = orderPredictionList.value.length;
    // // columnList.value

    // if (!orderPredictionList.value?.length) {
    //   // ElMessage.info("请选择需要导出的数据");
    //   return;
    // }
    // var result = orderPredictionList.value.map((item, index) => {
    //   let param = {}
    //   columnList.value.forEach((v: any) => {
    //     if (v.field && v.field != 'make') {
    //       if (v.field == 'index') {
    //         param['index'] = index + 1
    //       } else if (v.field == 'status') {
    //         param['status'] = item['status']==4?"已投料":"未投料"
    //       } else if (v.field == 'orderType') {
    //         param['orderType'] = resDictData.value.order_type.find((el: any) => el.dictValue == item['saleOrderVo']['orderType'])?.dictLabel
    //       } else if (v.field == 'saleOrderVo.commodityCode') {
    //         param['commodityCode'] = item['saleOrderVo']['commodityCode']
    //       } else if (v.field == 'saleOrderVo.model') {
    //         param['model'] = resDictData.value.order_model.find((el: any) => el.dictValue == item['saleOrderVo']['model'])?.dictLabel
    //       } else if (v.field == 'saleOrderVo.urgent') {
    //         param['urgent'] = resDictData.value.order_urgent.find((el: any) => el.dictValue == item['saleOrderVo']['urgent'])?.dictLabel
    //       } else if (v.field == 'commodityTestWay') {
    //         param['commodityTestWay'] = resDictData.value.order_commodity_testway.find((el: any) => el.dictValue == item['commodityTestWay'])?.dictLabel
    //       } else if (v.field == 'saleOrderVo.surfaceTreatment') {
    //         param['surfaceTreatment'] = resDictData.value.order_surface_treatment.find((el: any) => el.dictValue == item['saleOrderVo']['surfaceTreatment'])?.dictLabel
    //       } else if (v.field == 'saleOrderVo.materialQuality') {
    //         param['materialQuality'] = resDictData.value.order_material_quality.find((el: any) => el.dictValue == item['saleOrderVo']['materialQuality'])?.dictLabel
    //       } else if (v.field.includes('.')) {
    //         const tempArr = v.field.split('.')
    //         let tempRes = 'item'
    //         tempArr.forEach((v: any) => {
    //           tempRes += `['${v}']`
    //         })
    //         param[tempArr[tempArr.length - 1]] = eval(tempRes)
    //       } else {
    //         param[v.field] = item[v.field]
    //       }
    //     }
    //   })
    //   return param
    // });

    // const today = new Date();
    // const year = today.getFullYear();
    // const month = today.getMonth() + 1;
    // const day = today.getDate();
    // const currentDate = `${year}-${month}-${day}`;

    // //数据导入
    // var ws = xlsx.utils.json_to_sheet(result, { origin: "A2" });

    // ws['!merges'] = [
    //   { s: { r: 0, c: 0 }, e: { r: 0, c: 23 } }
    // ];

    // //表名
    // ws["A1"] = { v: `${currentDate} 订单预投表` };

    // //列名
    // const titleList = columnList.value.filter((item:any) => (item.field && item.field != 'make') && item.title).map((item: any) => item.title)
    // xlsx.utils.sheet_add_aoa(ws, [titleList],
    //   { origin: "A2" });

    // const wchList = titleList.map((item: any) => {
    //   return {
    //     wch: 8
    //   }
    // })
    // ws["!cols"] = wchList;

    // const cellStyle = {
    //   font: {
    //     name: '宋体',
    //     sz: 9,
    //     //color: { rgb: "ffffff" },
    //     //bold: true,
    //     //italic: false,
    //     //underline: false,
    //     height: 50
    //   },
    //   alignment: { horizontal: "center" },
    //   border: {
    //     top: { style: "thin" },
    //     bottom: { style: "thin" },
    //     left: { style: "thin" },
    //     right: { style: "thin" }
    //   }
    // };

    // var range = xlsx.utils.decode_range(ws["!ref"]);

    // for (let i = range.s.r; i <= range.e.r; i++) {
    //   for (let j = range.s.c; j <= range.e.c; j++) {
    //     var cellName = xlsx.utils.encode_cell({ r: i, c: j });
    //     ws[cellName] = Object.assign({}, ws[cellName], { s: cellStyle });
    //   }
    // }

    // var workbook = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(workbook, ws, 'sheet1');
    // var file = xlsx.write(workbook, { type: 'buffer' });
    // try {
    //   fileSaver.saveAs(
    //     new Blob([file], { type: "application/octet-stream" }),
    //     `${currentDate}-订单预投.xlsx`
    //   );
    // } catch (e) {
    //   // this.$message.error(e);
    // }
  }


  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    queryParams.value.status = '3';
    queryParams.value.customerCodeIdList = undefined;
    console.log('queryParams.value', queryParams.value);
    queryParams.value.startTime=dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD 00:00:00");
    queryParams.value.endTime= dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
    radioTable.value="本厂订单";
    getList();
  }
  const doMIPrint = async (data: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(data.id, type);
  }

  const radioTableHandle = async (tab: any, event: any) => {
    console.log("tab.", tab.props.label);
    radioTable.value = tab.props.label;
    queryParams.value.pageNum=1;
    queryParams.value.pageSize=20;

    if (radioTable.value == "本厂订单") {
      await getList();
    } else {
      await getOutList();
    }

  }

  const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerCode } });
    }
  }
  const revocation = async (row: any) => {
    await ElMessageBox.confirm("确定撤回预投订单？", '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      type: 'warning'
    });
    await revocationProductionPlan(row.id);
    if (radioTable.value == "本厂订单") {
      await getList();
    } else {
      await getOutList();
    }
  }
  onMounted(() => {
    getListCust();
    getDictOptions();
    getList();
  });
</script>

<style lang="scss" scoped>
  :deep(.data100){
     width: 100% !important;
    .el-input__wrapper {
      width: 100% !important;
    }
  }
</style>

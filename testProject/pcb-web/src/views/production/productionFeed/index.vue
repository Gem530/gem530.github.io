<template>
  <div class="p-2 xtable-page">
    <div class="p-2 global-flex flex-end">
      <div style="display:flex;margin-right: 20px;line-height: 20px;">
        <div style="width: 160px;background-color: #ecb0b1; text-align: center; padding: 5px">排产后驳回的投料</div>
        <div style="width: 160px;background-color: #FAECD8; text-align: center; padding: 5px">未排产驳回的投料</div>
      </div>
      <!--      <el-button icon="Download">导出</el-button>-->
    </div>

    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" @tab-click="handleClick" class="xtable-tab">
        <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;" v-if="type == 0">
          <el-button plain @click="handleExport">导出 </el-button>
        </div>
        <el-tab-pane label="投料列表">
          <XTable toolId="productionProductionFeedSend" v-model:page-size="queryParams.pageSize" height="100%"
                  class="xtable-content"
                  :loading="feedLoading"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="productionList"
                  :columnList="columnList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  :isAutoHeight="true"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :row-style="setRowStyle"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :sort-config="{remote: true}"
                  :intervalCondition="recordFeedCondition"
          >
            <template #default-productionNum="scope">
              <el-button link type='primary' @click="openProductionNumDetail(scope.row)">
                {{scope.row.productionNum}}
              </el-button>
            </template>
            <template #default-alreadyNum="scope">
              <el-button link type='primary' @click="openAlreadyNumDetail(scope.row)">
                {{scope.row.alreadyNum}}
              </el-button>
            </template>
            <template #default-scrapRate="scope">
              <el-popover :persistent="false" placement="right" :width="400" trigger="click">
                <template #reference>
                  <el-button link type='primary'>{{scope.row.scrapRate}}</el-button>
                </template>
                <el-table :data="scope.row.scrapRateList">
                  <el-table-column width="120" :show-overflow-tooltip="true" property="commodityCode" label="产品编码"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="commodityName" label="产品名称"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="productionNum" label="排产数量"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="scrapNum" label="报废数量"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="rate" label="报废率(%)"/>
                </el-table>
              </el-popover>
            </template>
            <template #default-preRate="scope">
              <el-popover :persistent="false" placement="right" :width="200" trigger="click">
                <template #reference>
                  <el-button link type='primary'>
                    <div v-for="(item,index) in scope.row.quantityList">
                      {{item.preRate}} {{(index!=scope.row.quantityList.length-1 && (scope.row.quantityList.length > 1))
                      ? "/" : ""}}
                    </div>
                  </el-button>
                </template>
                <span v-for="(item,index) in scope.row.quantityList">
                  {{item.commodityCode}}:{{item.preRate}}{{(index!=scope.row.quantityList.length-1 && (scope.row.quantityList.length > 1)) ? " / " : ""}}
                </span>
              </el-popover>
            </template>

            <template #default-feedRate="scope">
              <el-popover :persistent="false" placement="right" :width="200" trigger="click">
                <template #reference>
                  <el-button link type='primary'>
                    <div v-for="(item,index) in scope.row.quantityList">
                      {{item.feedRate}} {{(index!=scope.row.quantityList.length-1 && (scope.row.quantityList.length >
                      1)) ? "/" : ""}}
                    </div>
                  </el-button>
                </template>
                <span v-for="(item,index) in scope.row.quantityList">
                  {{item.commodityCode}}:{{item.feedRate}}{{(index!=scope.row.quantityList.length-1 && (scope.row.quantityList.length > 1)) ? " / " : ""}}
                </span>
              </el-popover>
            </template>

            <template #default-commodityName="scope">
              <el-popover :persistent="false" placement="right" :width="700" trigger="click">
                <template #reference>
                  <el-button link type='primary'>{{scope.row.commodityName}}</el-button>
                </template>
                <el-table :data="scope.row.saleOrderVoList">
                  <el-table-column width="120" :show-overflow-tooltip="true" property="commodityCode" label="产品编码"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="commodityName" label="产品名称"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="customerCode" label="客户编码"/>
                  <el-table-column width="100" :show-overflow-tooltip="true" property="version" label="版本号"/>
                  <el-table-column width="100" :show-overflow-tooltip="true" property="materialQuality" label="板材"/>
                  <el-table-column width="100" :show-overflow-tooltip="true" property="unit" label="单位">
                    <template #default="scope">
                      pcs
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
            <template #default-saleOrderId="scope">
              <el-popover :persistent="false" placement="right" :width="500" trigger="click">
                <template #reference>
                  <el-button link type='primary'>查看</el-button>
                </template>
                <el-table :data="scope.row.saleOrderVoList">
                  <el-table-column width="120" property="code" label="订单编号"/>
                  <el-table-column width="100" property="customerCode" label="客户编码"/>
                  <el-table-column width="130" property="deliveryTime" label="客户交期"/>
                  <el-table-column width="130" property="dispatchTime" label="最迟发货"/>
                </el-table>
              </el-popover>
            </template>
            <template #default-pnlFeedId="scope">
              <el-popover :persistent="false" placement="right" :width="450" trigger="click">
                <template #reference>
                  <el-button link type='primary'>查看</el-button>
                </template>
                <el-table :data="scope.row.pnlBoList">
                  <el-table-column width="100" property="name" label="Pnl"/>
                  <el-table-column width="100" property="preFeedQuantity" label="计划投料"/>
                  <el-table-column width="100" property="feedQuantity" label="已投数量"/>
                  <el-table-column width="100" property="feedArea" label="已投面积">
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
            <template #default-status="scope">
              {{scope.row.productionIdList.length>0 ? '已投料':'未投料'}}
            </template>
            <template #default-make="scope">
              <div style="padding-left: 10px">
                <el-button link type="primary" @click="rejectToMi(scope.row)"
                           v-if="checkPermi(['production:productionFeed:reject']) && scope.row.status == '4'">驳回至mi
                </el-button>
                <el-button link type="primary" @click="rejectToPre(scope.row)"
                  v-if="hasProFeedRejectBtn && checkPermi(['production:productionFeed:reject']) && scope.row.status == '4'">驳回至预投</el-button>
                <el-button v-if="showFeedButton(scope.row) && (['production:productionFeed:Feeding'])" link type="primary" @click="openEdit(scope.row)">投料
                </el-button>
                <el-button link type="primary" @click="doMIPrint(scope.row,'noOutsideImages')">MI详情</el-button>
                <el-button v-if="scope.row.productionIdList.length>0" link type="primary"
                           @click="openSchemeDetail(scope.row)">投料详情
                </el-button>
              </div>
            </template>

          </XTable>
        </el-tab-pane>
        <el-tab-pane label="审核列表" v-if="checkPermi(['production:productionFeed:examine'])">
          <XTable toolId="productionProductionFeedProcess" v-model:page-size="auditQueryParams.pageSize"
                  v-model:current-page="auditQueryParams.pageNum"
                  v-loading="loading"
                  :page-params="{ perfect: true, total: auditTotal }"
                  :data="productionAuditList"
                  :columnList="columnAuditList"
                  ref="XTableAuditRef"
                  border :showRefresh="true"
                  height="100%"
                  class="xtable-content"
                  :isAutoHeight="true"
                  @searchChange="searchAuditChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :intervalCondition="recordCondition"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
          >
            <template #default-isCalculate="scope">
              <el-tag v-if="scope.row.isCalculate=='1'"
                      type="success"
                      size="small">已审核
              </el-tag>
              <el-tag v-if="scope.row.isCalculate=='0'"
                      type="info"
                      size="small">待审核
              </el-tag>
            </template>
            <template #default-miProductionPlanVo.planType="scope">
              <div v-if="scope.row.miProductionPlanVo.planType==1">单品</div>
              <div v-if="scope.row.miProductionPlanVo.planType==2">拼版</div>
            </template>
            <template #default-area="scope">
              {{(scope.row.area*1).toFixed(4)}}
            </template>
            <template #default-pnlList="scope">
              <el-popover :persistent="false" placement="right" :width="500" trigger="click">
                <template #reference>
                  <el-button link type='primary' @click="getPnlDetails(scope.row)">查看</el-button>
                </template>
                <el-table :data="scope.row.pnlVoList">
                  <el-table-column width="100" property="name" label="PNL名称"/>
                  <el-table-column width="100" property="feedQuantity" label="PNL数量"/>
                  <el-table-column width="100" property="pnlLength" label="PNL长"/>
                  <el-table-column width="130" property="pnlWidth" label="PNL宽"/>
                </el-table>
              </el-popover>
            </template>
            <template #default-commodityName="scope">
              <el-popover :persistent="false" placement="right" :width="700" trigger="click">
                <template #reference>
                  <el-button link type='primary'>{{scope.row.commodityName}}</el-button>
                </template>
                <el-table :data="scope.row.saleOrderVoList">
                  <el-table-column width="120" :show-overflow-tooltip="true" property="commodityCode" label="产品编码"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="commodityName" label="产品名称"/>
                  <el-table-column width="120" :show-overflow-tooltip="true" property="customerCode" label="客户编码"/>
                  <el-table-column width="100" :show-overflow-tooltip="true" property="version" label="版本号"/>
                  <el-table-column width="100" :show-overflow-tooltip="true" property="materialQuality" label="板材"/>
                  <el-table-column width="100" :show-overflow-tooltip="true" property="unit" label="单位">
                    <template #default="scope">
                      pcs
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
            <template #default-make="scope">
              <div style="display:flex;padding-left: 10px">
                <el-button v-if="true" link type="primary" @click="openEdit(scope.row)">审核</el-button>
                <el-button link type="primary" @click="doMIPrintAduit(scope.row,'noOutsideImages')">MI详情</el-button>
              </div>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      size="100%"
      :close-on-click-modal="false"
      :direction="drawer.direction"
      :destroy-on-close="true"
      @close="cancel"
    >
      <template #header="{ close, titleId, titleClass }">

        <div style="display:flex;justify-content:space-between;">
          <div>
            <span>{{form.code}}-投料
          <span v-if="form.isRemediation=='1'" style="color: red">
            (补投)
          </span>
        </span>
          </div>
          <div style="color:green;">
            <span>已投</span>
            <span v-for="pnl in alreadyFeedPnlList" style="padding:0px 10px;">
              {{pnl.name}}:{{pnl.quantity}}
            </span>
          </div>
          <div style="color:red;">
            <span>实投</span>
            <span v-for="pnl in currentPnlList" style="padding:0px 10px;">
              {{pnl.name}}:{{pnl.quantity}}
            </span>
          </div>
          <div>
            <span style="margin-right:10px;">生产面积<span style="color:red;">{{productionArea}}</span>m²</span>
            <el-button style="margin-right:10px" @click="showProcess()">工序详情</el-button>
          </div>
        </div>

      </template>
      <vxe-table
        border
        keep-source
        align="center"
        size="mini"
        :row-config="{height: 40,isCurrent:true}"
        show-overflow :loading="dialogTableLoading"
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
        <vxe-column title="产品类型" field="commodityType">
        </vxe-column>
        <vxe-column title="pcs/set" field="unitedNumber">
        </vxe-column>
        <vxe-column title="订单面积(m²)" field="area">
        </vxe-column>
        <vxe-column title="订货数量(pcs)" field="quantity">
        </vxe-column>
        <vxe-column title="预投pcs数量">
          <template #default="{row}">
            <span style="color: red">
              {{getCommodityPcsQuantity(row.id)}}
            </span>
          </template>
        </vxe-column>
        <vxe-column title="已投pcs数量">
          <template #default="{row}">
            <span style="color: red">
              {{getCommodityAlreadPcsQuantity(row.id)}}
            </span>
          </template>
        </vxe-column>
        <vxe-column title="报废pcs数量">
          <template #default="{row}">
            <span style="color: red">
              {{row.scrapNum}}
            </span>
          </template>
        </vxe-column>
        <vxe-column title="实投pcs数量">
          <template #default="{row}">
            <span style="color: red">
              {{getCommodityRealPcsQuantity(row.id)}}
            </span>
          </template>
        </vxe-column>
        <vxe-column title="投料率(%)">
          <template #default="{row}">
            {{(getCommodityRealPcsQuantity(row.id) / row.quantity * 100).toFixed(2)}}
          </template>
        </vxe-column>
        <vxe-column title="可用库存数(pcs)" field="existingQuantity">
        </vxe-column>
        <vxe-column title="历史使用库存数(pcs)" field="alreadyUsedQuantity">
        </vxe-column>
        <vxe-column title="本次使用库存数(pcs)" field="useQuantity">
          <template #default="{row}">
            <el-input :disabled="form.isCalculate == '1' ? true:false" v-model.number="row.useQuantity"
                      type="number"></el-input>
          </template>
        </vxe-column>
      </vxe-table>
      <el-form ref="orderPredictionFormRef" :model="form" :rules="rules" label-width="110px" label-position="right"
               v-loading="dialogTableLoading">
        <!--按开料方案循环-->
        <el-card v-for="(scheme,index) in schemeList"
                 :key="index"
                 class="box-card"
                 style="width:100%;margin:10px auto;">

          <!--开料方案信息-->
          <div slot="header">
            <el-form label-width="90px"
                     label-position="right" @submit.native.prevent>
              <el-row>
                <el-col :span="3" class="cardhead">
                  {{scheme.name}}
                </el-col>
                <el-col :span="4" class="cardhead">
                  <el-form-item label="利用率">{{scheme.cuttingRate}}%</el-form-item>
                </el-col>
                <el-col :span="4" class="cardhead">
                  <el-form-item label="预投大料数">
                    <span style="color: red">{{scheme.preFeedQuantity}}张</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="cardhead">
                  <el-form-item label="已投大料数">
                    <span style="color: red">{{scheme.alreadyFeedQuantity}}张</span>
                  </el-form-item>
                </el-col>
                <el-col :span="9" class="cardhead">
                  <el-form-item label="实投大料数">
                    <el-input-number v-model="scheme.feedQuantity"
                                     :disabled="form.isCalculate == '1' ? true:false"
                                     :min="0"
                                     style="width: 100%"
                                     @change="onSchemeRealChargeCountChange(scheme)">
                      <template slot="append">
                        张
                      </template>
                    </el-input-number>
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
                <div v-for="item in scope.row.pnl.pnlSetBoList">
                  {{Math.ceil(scope.row.preFeedQuantity * item.quantity * item.saleOrderBo.unitedNumber)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="预投pnl数">
              <template #default="scope">
                <span style="color: red">{{Math.ceil(scope.row.preFeedQuantity)}}</span>

              </template>
            </el-table-column>
            <!--            <el-table-column align="center"
                                         label="待审核pnl数">
                          <template #default="scope">
                            <span style="color: red">{{scope.row.waitAuditQuantity}}</span>

                          </template>
                        </el-table-column>-->
            <el-table-column align="center"
                             label="总pnl数">
              <template #default="scope">
                <span style="color: red">{{form.isCalculate == 1 ? scope.row.alreadyFeedQuantity: (scope.row.alreadyFeedQuantity + scope.row.feedQuantity)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="实投pnl数">
              <template #default="scope">
                <el-input-number v-model="scope.row.feedQuantity"
                                 :min="0"
                                 style="width:100%"
                                 :precision="0"
                                 :disabled="form.isCalculate == '1' ? true:false"
                                 @change="onPnlRealChargeCount(scheme,scope.row)"
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
        <el-row style="width: 98%; margin: 0px auto; text-align:left;">
          <el-col :span="7">
            <el-form-item label="开始时间">
              <el-date-picker v-model="form.planStartTime"
                              :disabled="form.isCalculate == '1' ? true:false"
                              :disabled-date="disabledDateStart"
                              type="datetime"
                              format="YYYY-MM-DD HH:mm"
                              :clearable="false"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="结束时间">
              <el-date-picker v-model="form.planCompleteTime"
                              :disabled="form.isCalculate == '1' ? true:false"
                              :disabled-date="disabledDate"
                              type="datetime"
                              format="YYYY-MM-DD HH:mm"
                              :clearable="false"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-checkbox :disabled="form.isCalculate == '1' ? true:false" v-model="form.isStart" true-label="1"
                           false-label="0">立即开始生产
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-checkbox :disabled="form.isCalculate == '1' ? true:false" v-model="form.isMerge" true-label="1"
                           false-label="0">尾扎合并
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancel">取消</el-button>
          <el-button v-if="form.isCalculate == '1' ? false:true" :loading="buttonLoading" type="primary"
                     @click="submitForm( form.isCalculate == '1' ? '-1':'0')">确定
          </el-button>
          <el-button v-if="type==1 && !isReload" :loading="buttonLoading" type="danger"
                     @click="submitForm(form.isCalculate == '0' ? '2':'3')">审核驳回
          </el-button>
          <el-button v-if="type==1 && !isReload && form.isCalculate=='0'" :loading="buttonLoading" type="success"
                     @click="submitForm('1')">审核通过
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 投料详情 -->
    <el-dialog @close="closedDialog" :title="dialog.title" v-model="dialog.visible" width="50%" append-to-body>
      <XTable :pageShow="false"
              :data="historyFeedList"
              :columnList="columnHistoryList"
              border :loading="dialogTableLoading"
              :isAutoHeight="true"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
              :row-style="setRejectRowStyle"
      >

        <template #default-feedRate="scope">
          {{(scope.row.feedArea / currentInfo.area * 100).toFixed(4)}}
        </template>
        <template #default-alreadyFeedArea="scope">
          {{currentInfo.feedArea}}
        </template>
        <template #default-make="scope">
          <div style="display:flex;padding-left: 10px">
            <el-button v-if="scope.row.productionStatus=='11'" link type="primary" @click="reloadFeed(scope.row)">重投
            </el-button>
          </div>
        </template>
      </XTable>
    </el-dialog>

    <!-- 排产记录 -->
    <el-dialog :title="dialogProduction.title" v-model="dialogProduction.visible" width="1000px" append-to-body>
      <XTable :pageShow="false"
              :data="allProductionList"
              :columnList="columnProductionList"
              border
              :isAutoHeight="true"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
      >
      </XTable>
    </el-dialog>

    <!-- 入库记录 -->
    <el-dialog :title="dialogAlready.title" v-model="dialogAlready.visible" width="950px" append-to-body>
      <XTable :pageShow="false"
              :data="alreadyProductionList"
              :columnList="columnInInventoryList"
              border
              :isAutoHeight="true"
              :column-config="{ resizable: true }"
              :row-config="{ keyField:'id' }"
      >
        <template #default-type="scope">
          {{ inventoryTypeStrings[scope.row.type as keyof typeof InventoryTypeEnum] }}
        </template>
      </XTable>
    </el-dialog>

    <el-drawer
      v-model="drawerProcess.visible"
      title="工序详情"
      size="80%"
      :close-on-click-modal="false"
      :direction="drawerProcess.direction"
      :destroy-on-close="true"
      @close="cancelDetail"
    >
      <XTable
        border
        min-height="0px"
        :pageShow="false"
        :data="nodeInfoList"
        :columnList="mainColumnList"
        :row-config="{isHover:true,isCurrent:true}"
        :sort-config="{showIcon:false,remote:false}"
        ref="mainWorkmanshipListRef">
        <template #default-isCount="{row}">
          <el-checkbox v-model="row.isCount" true-label="1" false-label="0"></el-checkbox>
        </template>
        <template #default-requirement="{row}">
          <el-tooltip raw-content placement="top">
            <template #content>
              <CraftQuirementText :detailsJson="row.requirement" v-if="row && row.requirement"></CraftQuirementText>
            </template>
            <template #default>
              <div style="white-space: nowrap;overflow: hidden;">
                <CraftQuirementText :detailsJson="row.requirement" v-if="row && row.requirement"></CraftQuirementText>
              </div>
            </template>
          </el-tooltip>
        </template>
        <template #default-remark="{row}">
          <el-tooltip raw-content placement="top">
            <template #content>
              <RemarkText :remarkJson="row.remark" v-if="row && row.remark"></RemarkText>
            </template>
            <template #default>
              <div style="white-space: nowrap;overflow: hidden;">
                <RemarkText :remarkJson="row.remark" v-if="row && row.remark"></RemarkText>
              </div>
            </template>
          </el-tooltip>
        </template>
      </XTable>
    </el-drawer>

    <el-dialog
      v-model="processDialod.open"
      title="提示"
      width="550px"
      destroy-on-close
      @close="closeProcess"
    >
      <div>
        <div class="global-flex flex-start" v-for="item in processDialod.list" :key="item.id">
          <span style="margin-right: 15px;">{{ item.name }}:</span>
          <el-radio-group v-model="item.value" v-if="item.feedQuantity >= item.uncheckedQuantity">
            <el-radio label="1">合并新增投料数至尾扎</el-radio>
            <el-radio label="2">生成新的流转卡</el-radio>
          </el-radio-group>
          <el-radio-group v-model="item.value" v-else>
            <el-radio label="3">小于原卡扣减</el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeProcess">取消</el-button>
          <el-button type="primary" @click="confirmProcess">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <MIPrint
      ref="MIPrintRef"
      :allData="allData"
      :scrapped="scrapped"
      :printType="printType"
      :drillInfos="drillInfos"
      :qcCodeImage="qcCodeImage"
      :drillTitles="drillTitles"
      :laminateInfo="laminateInfo"
      :n_drillInfos="n_drillInfos"
      :drillHeaders="drillHeaders"
      :n_drillTitles="n_drillTitles"
      :n_drillHeaders="n_drillHeaders"
      :currentPdfList="currentPdfList"
      :commodityInfos="commodityInfos"
      :productionDetails="productionDetails"
      :publicCommodityInfo="publicCommodityInfo"
    ></MIPrint>

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
  </div>
</template>

<script setup name="ProductionFeed" lang="ts">
  import {
    listProduction,
    getProduction,
    delProduction,
    saveProduction,
    getDetails,
    getProductionDetail,
    listAuditProduction,
    checkFeed,
    getProductionListByPlanId,
    getInInventoryListByPlanId,
    getPnlDetail,
    getPlanPrintInfo,
    deleteProductionFeed,
    checkCommodityRelation,
    checkOrderFinish
  } from '@/api/production/production';
  import {ProductionVO, ProductionQuery, ProductionForm} from '@/api/production/production/types';
  import {VxeTableEvents} from 'vxe-table'
  import {getMiInfo, savePrediction, checkSaleOrderByBo,revocationProductionPlan} from "@/api/project/productionPlan";
  import {computed, ref} from "vue";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import dayjs from "dayjs";
  import {InventoryTypeEnum, inventoryTypeStrings} from '@/api/inventory/inventory/types';
  import {ElRadioGroup, ElRadio} from 'element-plus'
  import {checkPermi} from "@/utils/permission";
  //***********打印相关
  import * as QRCode from "qrcode";
  import {loadFile} from '@/utils/pdfToImg';
  import { listTenantConfig } from "@/api/system/tenantConfig";

  const hasProFeedRejectBtn = ref(false);
  const startPrint = ref(false)
  const currentPdfList = ref<string[]>([])
  const printType = ref("noOutsideImages");
  const code = ref("");
  const productionDetails = ref<any>([]);
  const allData = ref<any>();
  const commodityInfos = ref<any>([]);
  const publicCommodityInfo = ref<any>([]);
  const drillHeaders = ref<any>([]);
  const drillInfos = ref<any>([]);
  const drillTitles = ref<any>([]);
  const n_drillInfos = ref<any>([]);
  const n_drillHeaders = ref<any>([]);
  const n_drillTitles = ref<any>([]);
  const qcCodeImage = ref<any>([]);
  const schemeImages = ref<any>([]);
  const laminateImages = ref<any>([]);
  //存压合工艺参数
  const laminateInfo = ref<any>();
  const outsideImages = ref<any>([]);
  const scrapped = [1, 2, 3, 4, 5, 6, 7];
  const cardRef = ref();
  const MIPrintRef = ref();
  const dialogTableLoading = ref(false)
  //**************打印相关end

  const processDialod = ref({
    open: false,
    data: undefined,
    list: []
  })


  const disabledDateStart = (time) => {
    if (form.value.planCompleteTime) {
      return new Date(time).getTime() > new Date(form.value.planCompleteTime).getTime()
    }
  }

  const disabledDate = (time) => {
    return new Date(time).getTime() < new Date(form.value.planStartTime).getTime()
  }

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const historyFeedList = ref();
  const productionList = ref<ProductionVO[]>([]);
  const productionAuditList = ref<ProductionVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const feedLoading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const auditTotal = ref(0);
  const quantityReload = ref("1")

  const queryFormRef = ref<ElFormInstance>();
  const productionFormRef = ref<ElFormInstance>();
  let currentMiInfo = ref<any>({});
  //MI对应的Scheme
  let schemeList = ref<any>([]);
  //MI对应的Pnl
  let pnlList = ref<any>([]);
  //不同开料方案的投料率
  let schemeChargeRate = ref<Array<Number>>([]);
  //投料率(多投)
  const chargeRate = ref<number>(1);

  const currentPnlList = ref([]);

  const productionArea = computed({
    get() {
      let area = 0;
      if (schemeList.value.length > 0) {
        let currentList: any = [];
        schemeList.value.forEach(scheme => {
          scheme.pnlList?.length && scheme.pnlList.forEach(pnl => {
            console.log(pnl)
            area += Number(pnl.pnl.pnlWidth * pnl.pnl.pnlLength / 1000000 * Math.abs(pnl.feedQuantity !=null ? pnl.feedQuantity : 0));

            const currentInfo = currentList.find(vo => vo.name == pnl.pnl.name);
            if (currentInfo) {
              currentInfo.quantity += pnl.feedQuantity
            } else {
              const info = {
                id: pnl.id,
                name: pnl.pnl.name,
                quantity: pnl.feedQuantity,
              }
              currentList.push(info);
            }

          })
        })
        currentPnlList.value = currentList;
        console.log(currentPnlList.value)
      }
      return area.toFixed(6);
    },
    set(val: any) {
      return val
    }
  })

  const showFeedButton = (row: any) => {
    if (row.orderQuantity) {
      if (row.orderQuantity.toString().includes("/")) {
        const selfArray = row.orderQuantity.split("/");
        const productionArray = row.productionNum.split("/");
        let matchNum = 0;
        for (let i = 0; i < selfArray.length; i++) {
          if (Number(selfArray[i]) <= Number(productionArray[i])) {
            matchNum += 1;
          }
        }
        if (matchNum == selfArray.length) {
          return false;
        } else {
          return true;
        }
      } else {
        return Number(row.orderQuantity) > Number(row.productionNum);
      }
    } else {
      return false;
    }

  }

  const drawerProcess = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const showProcess = async () => {
    drawerProcess.visible = true;
  }

  //结束日期不能大于开始日期校验规则
  const startRules = [
    {required: true, message: "请选择开始日期", trigger: "change"},
  ];

  /* 工序工艺数据 */
  const nodeInfoList = ref<any[]>([])

  const mainColumnList = ref([
    {title: '序号', field: 'sort', align: 'center', width: 66, sortable: true},
    {title: '工序名称', field: 'craftName', align: 'center', width: 66},
    {title: '加工要求', field: 'requirement', align: 'left', minWidth: 144, showOverflow: false},
    {title: '备注', field: 'remark', align: 'left', minWidth: 144, showOverflow: false},
  ])

  const endRules = [
    {required: true, message: "请选择结束日期", trigger: "change"},
    {
      validator: (rule, value, callback) => {
        const startDate = new Date(form.value.planStartTime);
        const endDate = new Date(form.value.planCompleteTime);
        if (startDate.getTime() > endDate.getTime()) {
          callback(new Error("结束日期不能小于开始日期"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ];

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const initFormData: ProductionForm = {
    id: undefined,
    ownerId: undefined,
    planStartTime: undefined,
    planCompleteTime: undefined,
    startTime: undefined,
    completeTime: undefined,
    completeQuantity: undefined,
    confirmUserId: undefined,
    confirmUserName: undefined,
    productionStatus: undefined,
    planId: undefined,
    isPause: undefined,
    code: undefined,
    isComplete: undefined,
    area: undefined,
    isRemediation: undefined,
    remediationProductionId: undefined,
    isMerge: undefined
  }
  const data = reactive<PageData<ProductionForm, ProductionQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      isAsc: "desc",
      orderByColumn: "pre_feed_time",
      ownerId: undefined,
      planStartTime: undefined,
      planCompleteTime: undefined,
      startTime: undefined,
      completeTime: undefined,
      completeQuantity: undefined,
      confirmUserId: undefined,
      confirmUserName: undefined,
      productionStatus: undefined,
      planId: undefined,
      isPause: undefined,
      code: undefined,
      isComplete: undefined,
      area: undefined,
      isRemediation: undefined,
      remediationProductionId: undefined,
      isMerge: undefined,
      params: {}
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      ownerId: [
        {required: true, message: "单位ID不能为空", trigger: "blur"}
      ],
      planStartTime: [
        {required: true, message: "计划开始时间不能为空", trigger: "blur"}
      ],
      planCompleteTime: [
        {required: true, message: "计划完成时间不能为空", trigger: "blur"}
      ],
      startTime: [
        {required: true, message: "开始时间不能为空", trigger: "blur"}
      ],
      completeTime: [
        {required: true, message: "完成时间不能为空", trigger: "blur"}
      ],
      completeQuantity: [
        {required: true, message: "完成数量不能为空", trigger: "blur"}
      ],
      confirmUserId: [
        {required: true, message: "确认人ID不能为空", trigger: "blur"}
      ],
      confirmUserName: [
        {required: true, message: "确认人名字不能为空", trigger: "blur"}
      ],
      productionStatus: [
        {required: true, message: "排产状态(10=待开始，20=进行中，30=完成，40=暂停)不能为空", trigger: "change"}
      ],
      planId: [
        {required: true, message: "MI工艺单ID不能为空", trigger: "blur"}
      ],
      isPause: [
        {required: true, message: "是否暂停(默认为否)不能为空", trigger: "blur"}
      ],
      code: [
        {required: true, message: "排产单编码不能为空", trigger: "blur"}
      ],
      isComplete: [
        {required: true, message: "是否已完成不能为空", trigger: "blur"}
      ],
      area: [
        {required: true, message: "排产净面积不能为空", trigger: "blur"}
      ],
      isRemediation: [
        {required: true, message: "是否补料不能为空", trigger: "blur"}
      ],
      remediationProductionId: [
        {required: true, message: "补料关联的排产单ID不能为空", trigger: "blur"}
      ],
      isMerge: [
        {required: true, message: "是否尾扎合并不能为空", trigger: "blur"}
      ]
    }
  });

  const auditQueryParams = ref({
    pageNum: 1,
    pageSize: 20,
    ownerId: undefined,
    planStartTime: undefined,
    planCompleteTime: undefined,
    startTime: undefined,
    completeTime: undefined,
    completeQuantity: undefined,
    confirmUserId: undefined,
    confirmUserName: undefined,
    productionStatus: undefined,
    planId: undefined,
    isPause: undefined,
    code: undefined,
    isComplete: undefined,
    area: undefined,
    isRemediation: undefined,
    remediationProductionId: undefined,
    isMerge: undefined,
    params: {}
  })

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

  const XTableRef = ref()
  const planTypeOptions = ref([
    {value: "1", label: "单品"},
    {value: "2", label: "拼板"},
  ])
  const isFilmList = ref([
    {label: '导电膜', value: "true"},
    {label: '沉铜', value: "false"},
  ]);
  const statusList = ref([
    {label: '已投料', value: "1"},
    {label: '未投料', value: "0"},
  ]);

  const recordFeedCondition = ['preFeedTime', 'auditTime', 'dispatchTime'];
  const columnList = ref([
    {title: "序号", fixed: 'left', field: 'index', type: 'seq', align: 'center', width: '60'},
    {
      width: "120",
      title: 'MI单号',
      fixed: 'left',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI单号'}
    },
    {
      width: "120",
      title: '产品编码',
      fixed: 'left',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: "120",
      title: '导电膜/沉铜',
      fixed: 'left',
      field: 'filmOrCopper',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择',
      },
      filterData: () => isFilmList.value,
      filterCustom: {label: 'label', value: 'value'}

    },
    {
      width: "120",
      title: '销售预投时间',
      field: 'preFeedTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '生产截止时间',
      field: 'dispatchTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '投料状态',
      field: 'status',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择',
      },
      filterData: () => statusList.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {width: "120", title: '下单数量', field: 'orderQuantity', align: 'center'},
    {width: "120", title: '本厂数量', field: 'selfQuantity', align: 'center'},
    {width: "120", title: '排产数量', field: 'productionNum', align: 'center'},
    {width: "120", title: '完成数量', field: 'alreadyNum', align: 'center'},
    {width: "120", title: '报废率(%)', field: 'scrapRate', align: 'center'},
    {
      width: "120",
      title: 'MI类型',
      field: 'planType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择MI类型',
      },
      filterData: () => planTypeOptions.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {width: "120", title: '订单面积(㎡)', field: 'area', align: 'center'},
    {width: "120", title: '预投面积(㎡)', field: 'preFeedArea', align: 'center'},
    {width: "120", title: '实投数', field: 'feedQuantity', align: 'center'},
    {width: "120", title: '投料面积(㎡)', field: 'feedArea', align: 'center'},
    {width: "120", title: '预投率(%)', field: 'preRate', align: 'center'},
    {width: "120", title: '实投率(%)', field: 'feedRate', align: 'center'},
    {
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {width: "120", title: 'MI制单人', field: 'createByName', align: 'center'},
    {width: "120", title: 'MI审核人', field: 'auditUserName', align: 'center'},
    {
      width: "120",
      title: 'MI审核时间',
      field: 'auditTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: "120", title: '销售订单', field: 'saleOrderId', align: 'center'},
    {width: "120", title: '投料详情', field: 'pnlFeedId', align: 'center'},
    {
      width: "120",
      title: '备注',
      field: 'remark',
      align: 'center',
    },
    {width: "315", title: '操作', showOverflow: 'false', field: 'make', align: 'center', fixed: 'right',},
  ]);

  const XTableAuditRef = ref()
  const recordCondition = ['planStartTime', 'planCompleteTime', 'createTime'];
  const remediationStatusOption = ref([

    {label: "已审核", value: "1"},
    {label: "未审核", value: "0"},
  ])
  const columnAuditList = ref([
    {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
    {
      width: "120",
      title: '状态',
      fixed: 'left',
      field: 'isCalculate',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择状态',
      },
      filterData: () => remediationStatusOption.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      width: "120",
      title: 'MI单号',
      fixed: 'left',
      field: 'miProductionPlanVo.code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI单号'}
    },
    {
      width: "120",
      title: '产品编码',
      fixed: 'left',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: "120",
      title: '投料日期',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: "120", title: '投料面积(㎡)', field: 'feedArea', align: 'center'},
    {width: "120", title: '订单面积(㎡)', field: 'area', align: 'center'},
    {width: "120", title: '订单数量', field: 'orderQuantity', align: 'center'},
    {width: "120", title: '本厂数量', field: 'selfQuantity', align: 'center'},
    {width: "120", title: '排产数量', field: 'productionNum', align: 'center'},
    {width: "120", title: 'PNL详情', field: 'pnlList', align: 'center'},
    {
      width: "120",
      title: 'MI类型',
      field: 'miProductionPlanVo.planType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择MI类型',
      },
      filterData: () => planTypeOptions.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: "120",
      title: '客户编码',
      field: 'customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {
      width: "120",
      title: '预计开始时间',
      field: 'planStartTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '预计完成时间',
      field: 'planCompleteTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {width: "120", title: '操作', showOverflow: 'false', field: 'make', align: 'center', fixed: 'right',},
  ]);

  const columnProductionList = ref([
    {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
    {
      width: "120",
      title: '排产单号',
      field: 'code',
      align: 'center',
    },
    {
      width: "120",
      title: '排产时间',
      field: 'createTime',
      align: 'center',
    },
    {
      width: "120",
      title: '预计开始时间',
      field: 'planStartTime',
      align: 'center',
    },
    {
      width: "120",
      title: '预计完成时间',
      field: 'planCompleteTime',
      align: 'center',
    },
    {
      width: "120",
      title: '实际开始时间',
      field: 'startTime',
      align: 'center',
    },
    {
      width: "120",
      title: '实际完成时间',
      field: 'completeTime',
      align: 'center',
    },
    {
      width: "95",
      title: '排产量',
      field: 'productionNum',
      align: 'center',
    },
    {
      width: "95",
      title: '已完成',
      field: 'alreadyNum',
      align: 'center',
    },
  ]);

  const columnInInventoryList = ref([
    {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
    {
      width: "125",
      title: '入库单号',
      field: 'code',
      align: 'center',
    },
    {
      width: "120",
      title: '类型',
      field: 'type',
      align: 'center',
    },
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
    },
    {
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
    },
    {
      width: "120",
      title: '数量',
      field: 'quantity',
      align: 'center',
    },
    {
      width: "120",
      title: '操作人',
      field: 'createByName',
      align: 'center',
    },
    {
      width: "135",
      title: '入库时间',
      field: 'intOutTime',
      align: 'center',
    },
  ]);

  const checkedProductionList = ref<ProductionVO[]>([]);

  const {queryParams, form, rules} = toRefs(data);

  const selectChangeEvent: VxeTableEvents.CheckboxAll<ProductionVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
      const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
      checkedProductionList.value = selectRecords.map(item => item);
    }
  }

  const setRowStyle = ({row, rowIndex, $rowIndex}: any) => {
    if (row.productionStatusList.includes('11')) {
      if(row.cardIds && row.cardIds.length > 0){
        return {
          backgroundColor: '#ecb0b1',
        }
      }else{
        return {
          backgroundColor: 'rgb(250, 236, 216)',
        }
      }
      
    }
  }

  const setRejectRowStyle = ({row, rowIndex, $rowIndex}: any) => {
    if (row.productionStatus == '11' && row.productionCardVoList != null) {
      return {
        backgroundColor: '#ecb0b1',
      }
    }
  }

  const type = ref(0);

  const showType = ref(0);

  const handleClick = (pane: any, ev: any) => {
    type.value = pane.index;
    showType.value = pane.index;
    if (pane.index == 0) {
      getList();
    } else {
      getAuditList();
    }
  }

  const dialogProduction = reactive<DialogOption>({
    visible: false,
    title: '排产记录'
  });

  const allProductionList = ref();

  /*排产数量弹窗*/
  const openProductionNumDetail = async (row: any) => {
    const res = await getProductionListByPlanId({planId: row.id, isCalculate: "1"})
    allProductionList.value = res.data;
    dialogProduction.visible = true;
  }

  const getPnlDetails = async (row: any) => {
    if (row.isCalculate == '0') {
      const res = await getPnlDetail({productionId: row.id})
      row.pnlVoList = res.data;
    }
  }

  const dialogAlready = reactive<DialogOption>({
    visible: false,
    title: '入库记录'
  });

  const alreadyProductionList = ref();

  /*完成数量弹窗*/
  const openAlreadyNumDetail = async (row: any) => {
    const res = await getInInventoryListByPlanId({planId: row.id})
    alreadyProductionList.value = res.data;
    dialogAlready.visible = true;
  }

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    let string = "order_type,order_model,order_urgent,finish_plate_thickness,order_surface_treatment,order_commodity_testway," +
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

  const getBoardThickness = (param: any, defaultValue: any) => {
    // if (boardThickness) {
    //   let v = this.boardThickness.find(item => param === item.pnlName);
    //   if (v) {
    //     return v.parameterValue;
    //   } else {
    //     return defaultValue;
    //   }
    // } else {
    //   return defaultValue;
    // }
  }

  const getCopperThickness = (param: any, defaultValue: any) => {
    // if (this.copperThickness) {
    //   let v = this.copperThickness.find(item => param === item.pnlName);
    //   if (v) {
    //     return v.parameterValue;
    //   } else {
    //     return defaultValue;
    //   }
    // } else {
    //   return defaultValue;
    // }
  }

  // 获取 搜索条件
  const searchChange = (params: any) => {
    console.log(params)
    queryParams.value = params
    queryParams.value.isAsc = "desc";
    queryParams.value.orderByColumn = "pre_feed_time";
    Object.keys(queryParams.value).forEach(key => {
      if (key == 'status') {
        //排产单号
        queryParams.value['feedStatus'] = queryParams.value[key];
        queryParams.value[key] = undefined;
      } else if(key == 'filmOrCopper'){
        queryParams.value['isFilm'] = queryParams.value[key];
        queryParams.value[key] = undefined;
      }else {
        if (key.includes(".")) {
          const queryParamsKey = key.substring(key.indexOf(".") + 1);
          queryParams.value[queryParamsKey] = queryParams.value[key];
          queryParams.value[key] = undefined;

        }
        // else {
        //   if (queryParams.value[key] !== null && queryParams.value[key] !== undefined) {
        //     queryParams.value[key] = queryParams.value[key];
        //   }
        // }
      }
    });
    getList()
  }

  // 获取 搜索条件
  const searchAuditChange = (params: any) => {
    auditQueryParams.value = params
    Object.keys(auditQueryParams.value).forEach(key => {
      if (key == 'productionVo.code') {
        //排产单号
        auditQueryParams.value['productionCode'] = auditQueryParams.value[key];
      } else if (key == 'miProductionPlanVo.code') {
        //产品编码
        auditQueryParams.value['micode'] = auditQueryParams.value[key];
      } else {
        if (key.includes(".")) {
          const queryParamsKey = key.substring(key.indexOf(".") + 1);
          auditQueryParams.value[queryParamsKey] = auditQueryParams.value[key];
        } else {
          if (auditQueryParams.value[key] !== null && auditQueryParams.value[key] !== undefined) {
            auditQueryParams.value[key] = auditQueryParams.value[key];
          }
        }
      }
    });
    getAuditList()
  }

  /** 查询生产-排产单列表 */
  const getList = async () => {
    feedLoading.value = true;
    const res = await listProduction(queryParams.value);
    productionList.value = res.rows;
    total.value = res.total;
    feedLoading.value = false;
  }

  /** 查询生产-待审核列表 */
  const getAuditList = async () => {
    loading.value = true;
    const res = await listAuditProduction(auditQueryParams.value);
    console.log(res.rows)
    productionAuditList.value = res.rows;
    productionAuditList.value.forEach(item => {
      //产品编码
      item.commodityCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.commodityCode
      }).join("-") : item.saleOrderVoList[0].commodityCode;
      //产品名称
      item.commodityName = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.commodityName
      }).join("+") : item.saleOrderVoList[0].commodityName;
      //客户编码
      item.customerCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.customerCode
      }).join("+") : item.saleOrderVoList[0].customerCode;
      //下单面积
      item.area = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.area);
      }, 0) : item.saleOrderVoList[0].area;
      //下单数量
      item.orderQuantity = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.quantity
      }).join("/") : item.saleOrderVoList[0].quantity;
      //本厂数量
      item.selfQuantity = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        return x.selfQuantity
      }).join("/") : item.saleOrderVoList[0].selfQuantity;
      // 实投数、实投面积、预投面积   set面积
      let feedArea = 0;
      if (item.pnlVoList != null) {
        item.pnlVoList.forEach(pnl => {
          let pnlFeedArea = 0;
          pnl.pnlSetBoList && pnl.pnlSetBoList.forEach(pnlSet => {
            const area = (pnl.feedQuantity * pnlSet.quantity * pnlSet.saleOrderBo?.unitedLength * pnlSet.saleOrderBo?.unitedWidth / 1000000).toFixed(4);
            pnlFeedArea += Number(area);
            feedArea += Number(area);
          })
          pnl.feedArea = pnlFeedArea.toFixed(4);
        })
        item.feedArea = feedArea.toFixed(4);
      } else {
        item.feedArea = 0;
      }

    })
    auditTotal.value = res.total;
    loading.value = false;
  }

  /** 取消按钮 */
  const cancel = () => {
    isReload.value = false;
    drawer.visible = false;
    buttonLoading.value = false;
  }

  // 关闭详情
  const cancelDetail = () => {
    isReload.value = false;
    drawerProcess.visible = false;
  }

  const cancelDialog = () => {
    reset();
    dialog.visible = false;
  }

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    productionFormRef.value?.resetFields();
  }

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  /*是否重投*/
  const isReload = ref(false);

  /*重投*/
  const reloadFeed = async (row?: any) => {
    type.value = 1;
    isReload.value = true;
    openEdit(row);
    // if (close) {
    //   proxy?.$modal.closeLoading()
    // }
  }

  const closedDialog = () => {
    type.value = 0;
    isReload.value = false;
  }

  const alreadyFeedPnlList = ref([])

  // // 页面上 重投
  // const againFeed = (row: any) => {
  //   // proxy?.$modal.loading('加载中...')
  //   getProductionDetail({planId: row.id}).then(res => {
  //     const currentFeed = res.data.find((v: any) => v.productionStatus == '11')
  //     if (currentFeed) {
  //       // console.log('currentFeed', currentFeed)
  //       reloadFeed(currentFeed, 1)
  //     } else {
  //       // proxy?.$modal.closeLoading()
  //     }
  //   }).catch(() => {
  //     // proxy?.$modal.closeLoading()
  //   })
  // }

  const rejectToMi = async (row: any) => {
    const res = await getProductionDetail({planId: row.id})
    const itemProductionList = res.data
    const check = itemProductionList.some((v:any)=> v.productionStatus.includes("20") || (v.productionCardVoList && v.productionCardVoList.length>0));
    if (itemProductionList && itemProductionList.length > 0 && check) {
      ElMessage.error("已有审核通过投料记录，不能驳回至MI!")
      return;
    }
    if(itemProductionList && itemProductionList.length > 0){
      ElMessageBox.confirm(
        '已有未审核通过投料记录，驳回至MI将清除相关投料记录，确定将MI单' + row.code + '驳回到MI？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        const data = {
          id: row.id,
          isReject: true,
          orderList: row.saleOrderVoList,
        }
        loading.value = true;
        proxy?.$modal.loading('加载中...')
        savePrediction(data).then(res => {
          const data2 = {
            planId : row.id
          }
          deleteProductionFeed(data2).then(res2 =>{
            ElMessage.success("操作成功");
            loading.value = false;
            getList();
            cancel();
          }).finally(() => proxy?.$modal.closeLoading());
        }).catch(() => proxy?.$modal.closeLoading());
      })
    } else {
      ElMessageBox.confirm(
        '确定将MI单' + row.code + '驳回到MI？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        const data = {
          id: row.id,
          isReject: true,
          orderList: row.saleOrderVoList,
        }
        loading.value = true;
        proxy?.$modal.loading('加载中...')
        savePrediction(data).then(res => {
          ElMessage.success("操作成功");
          loading.value = false;
          getList();
          cancel();
        }).finally(() => proxy?.$modal.closeLoading());
      })
    }
  }

  const rejectToPre = async (row: any) => {
    const res = await getProductionDetail({planId: row.id})
    const itemProductionList = res.data
    const check = itemProductionList.some((v:any)=> v.productionStatus.includes("20") || (v.productionCardVoList && v.productionCardVoList.length>0));
    if (itemProductionList && itemProductionList.length > 0 && check) {
      ElMessage.error("已有审核通过投料记录，不能驳回至预投!")
      return;
    }
    if(itemProductionList && itemProductionList.length > 0){
      ElMessageBox.confirm(
        '已有未审核通过投料记录，驳回至MI将清除相关投料记录，确定将MI单' + row.code + '驳回到预投？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        const data = {
          id: row.id,
          isReject: true,
          orderList: row.saleOrderVoList,
        }
        loading.value = true;
        proxy?.$modal.loading('加载中...')
        revocationProductionPlan(row.id).then(res=>{
          ElMessage.success("操作成功");
            loading.value = false;
            getList();
            cancel();
        }).finally(() => proxy?.$modal.closeLoading());
      })
    } else {
      ElMessageBox.confirm(
        '确定将MI单' + row.code + '驳回到预投？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        loading.value = true;
        proxy?.$modal.loading('加载中...')
        revocationProductionPlan(row.id).then(res=>{
          ElMessage.success("操作成功");
            loading.value = false;
            getList();
            cancel();
        }).finally(() => proxy?.$modal.closeLoading());
      })
    }
  }
  /*投料*/
  const openEdit = async (row?: any) => {
    alreadyFeedPnlList.value = [];
    if (type.value == 0 && !isReload.value) {
      const checkRes = await checkFeed(row.id);
      if (checkRes.code != 200) {
        return;
      }
    }
    form.value = row;
    drawer.visible = true;
    dialogTableLoading.value = true
    const res = await getMiInfo(type.value == 0 ? row.id : row.planId);
    const data = res.data;
    if (data.nodeInfoList && data.nodeInfoList.length) {
      nodeInfoList.value = data.nodeInfoList.map((v) => {
        // 两层json，所以需要转换一下
        v.localUid = v.craftName + v.id + Math.random()
        v.remark = v?.remark
        v.requirement = v?.requirement
        v.extension = v?.extension
        return v
      })
    }
    if (type.value == 0) {
      currentMiInfo.value = row;
      form.value.isStart = '0';
      form.value.isMerge = '0';
      form.value.planStartTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
      form.value.planCompleteTime = row.saleOrderVoList[0].dispatchTime;
    } else {
      currentMiInfo.value = row.miProductionPlanVo;
      form.value.isStart = row.isStart;
      form.value.isMerge = row.isMerge;
      form.value.planStartTime = row.planStartTime;
      form.value.planCompleteTime = row.planCompleteTime;
    }

    schemeList.value = data.schemeBoList;
    dealNodeInfoList(data.nodeInfoList);
    pnlList.value = data.pnlBoList;
    schemeChargeRate.value = [];
    const schemeIdList: [] = schemeList.value.map(scheme => scheme.id);
    const commodityIdList: [] = form.value.saleOrderVoList?.map(order => order.commodityId);
    const saleOrderIdList: [] = form.value.saleOrderVoList?.map(order => order.id);
    const pnlIdList: [] = pnlList.value.map(pnl => pnl.id);
    const query = {
      planId: type.value == 0 ? row.id : row.planId,
      id: type.value == 1 ? row.id : undefined,
      schemeIdList: schemeIdList,
      saleOrderIdList: saleOrderIdList,
      commodityIdList: commodityIdList,
      pnlIdList: pnlIdList
    }
    const productionSchemeRes = await getDetails(query);
    const commodityInventoryList = productionSchemeRes.data.commodityInventoryList ?? [];
    const productionCommodityRelationVoList = productionSchemeRes.data.productionCommodityRelationVoList ?? [];
    const productionPnlFeedVoList = productionSchemeRes.data.productionPnlFeedVoList ?? [];
    const feedPnlMaps = productionSchemeRes.data.feedPnlMaps;
    if (feedPnlMaps) {
      Object.keys(feedPnlMaps).forEach(key => {
        const info = {
          id: key,
          name: pnlList.value.find(vo => key == vo.id)?.name,
          quantity: feedPnlMaps[key]
        }
        alreadyFeedPnlList.value.push(info)
      })
    }

    const productionSchemeVoList = productionSchemeRes.data.productionSchemeVoList ?? [];
    const alreadyPnlFeedVoList = productionSchemeRes.data.alreadyPnlFeedVoList ?? [];
    const waitAuditSchemeList = productionSchemeRes.data.waitAuditSchemeList ?? [];
    const waitAuditPnlList = productionSchemeRes.data.waitAuditPnlList ?? [];
    const waitAuditCommodityList = productionSchemeRes.data.waitAuditCommodityList ?? [];
    const scrapMaps = productionSchemeRes.data.scrapMaps ?? {};
    form.value.saleOrderVoList = data.saleOrderVoList;
    form.value.saleOrderVoList.forEach(order => {
      order.scrapNum = scrapMaps[order.id];
      const resultCommodityItem = waitAuditCommodityList.find(item => item.saleOrderId == order.id && item.commodityId == order.commodityId);
      if (resultCommodityItem) {
        order.commodityRelationId = resultCommodityItem.id;
        order.useQuantity = type.value == 0 ? 0 : resultCommodityItem.quantity;
      }
      if (new Date(order.dispatchTime) < new Date(form.value.planCompleteTime) && type.value == 0) {
        form.value.planCompleteTime = order.dispatchTime
      }
      if (commodityInventoryList.length > 0) {
        commodityInventoryList.forEach(commodityInventory => {
          if (order.commodityId == commodityInventory.commodityId) {
            order.existingQuantity = commodityInventory.quantity;
          }
        })
      } else {
        order.existingQuantity = 0;
      }
      let alreadyUsedQuantity = 0
      productionCommodityRelationVoList.forEach(productionCommodity => {
        if (order.commodityId == productionCommodity.commodityId) {
          alreadyUsedQuantity += productionCommodity.quantity;
        }
      })
      order.alreadyUsedQuantity = alreadyUsedQuantity;

    })
    schemeList.value.forEach((scheme: any, index: number) => {
      let alreadyFeedSum = 0;
      productionSchemeVoList.forEach(productionScheme => {
        if (scheme.id == productionScheme.schemeId) {
          alreadyFeedSum += Number(productionScheme.feedQuantity);
        }
      })
      scheme.alreadyFeedQuantity = (alreadyFeedSum).toFixed(2); // 解决精度问题
      //设置实投数量
      const realChargeCount = (scheme.preFeedQuantity - Number(scheme.alreadyFeedQuantity)).toFixed(2);
      //本次待审核scheme数据
      const resultSchemeItem = waitAuditSchemeList.find(item => item.schemeId == scheme.id);
      console.log(showType.value)
      if (showType.value == 1) {
        scheme.feedQuantity = type.value == 0 ? realChargeCount : resultSchemeItem.feedQuantity >= 0 ? resultSchemeItem.feedQuantity : resultSchemeItem.uncheckedQuantity;
      } else {
        scheme.feedQuantity = type.value == 0 ? realChargeCount : resultSchemeItem.feedQuantity > 0 ? resultSchemeItem.feedQuantity : resultSchemeItem.uncheckedQuantity;
      }
      scheme.uncheckedQuantity = type.value == 1 ? Number(resultSchemeItem.uncheckedQuantity) : 0;
      scheme.feedSchemeid = type.value == 1 ? resultSchemeItem.id : undefined;
      //分scheme设置投料利用率的默认值
      schemeChargeRate.value.push(100 + chargeRate.value);
      //处理Pnl
      const pnlArray: any[] = [];
      scheme.pnlCountList.forEach(pnlCount => {
        const pnl = pnlList.value.find(o => {
          return o.id == pnlCount.pnlId;
        });
        if (pnl) {
          // let waitAuditQuantity = 0;
          // productionPnlFeedVoList.forEach(pnlFeed => {
          //   if (scheme.id == pnlFeed.schemeId && pnl.id == pnlFeed.pnlId) {
          //     waitAuditQuantity += pnlFeed.feedQuantity;
          //   }
          // })
          let alreadyFeedQuantity = 0;
          alreadyPnlFeedVoList.forEach(pnlFeed => {
            if (scheme.id == pnlFeed.schemeId && pnl.id == pnlFeed.pnlId) {
              alreadyFeedQuantity += pnlFeed.feedQuantity;
            }
          })
          //本次待审核pnl数据
          const resultPnlItem = waitAuditPnlList.find(item => item.schemeId == scheme.id && item.pnlId == pnl.id);
          pnlArray.push({
            pnl: pnl,
            id: type.value == 0 ? pnlCount.id : resultPnlItem?.pnlId,
            pnlFeedId: type.value == 1 ? resultPnlItem?.id : undefined,
            count: pnlCount.pnlQuantity,
            feedQuantity: showType.value == 1 ? (type.value == 1 ? resultPnlItem?.feedQuantity >= 0 ? resultPnlItem?.feedQuantity : resultPnlItem?.uncheckedQuantity : 0) : (type.value == 1 ? resultPnlItem?.feedQuantity > 0 ? resultPnlItem?.feedQuantity : resultPnlItem?.uncheckedQuantity : 0),
            uncheckedQuantity: type.value == 1 ? Number(resultPnlItem?.uncheckedQuantity) : 0,
            preFeedQuantity: scheme.preFeedQuantity * pnlCount.pnlQuantity,
            // waitAuditQuantity: waitAuditQuantity,
            alreadyFeedQuantity: alreadyFeedQuantity,
          });
        }

      });
      scheme.pnlList = pnlArray;
      if (type.value == 0) {
        onSchemeRealChargeCountChange(scheme);
      }
    });
    dialogTableLoading.value = false
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

  let currentInfo = ref();

  //投料详情
  const openSchemeDetail = (row?: any) => {
    dialog.visible = true;
    dialogTableLoading.value = true
    dialog.title = row.code + "-投料详情";
    currentInfo.value = row;
    getProductionDetail({planId: row.id}).then(res => {
      dialogTableLoading.value = false
      historyFeedList.value = res.data
      historyFeedList.value.forEach(item => {
        //产品编码
        item.commodityCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.commodityCode
        }).join("-") : item.saleOrderVoList[0].commodityCode;
        //本次投料数量
        let pnlFeedQuantity: any = [];
        Object.keys(item.pnlFeedMap).forEach(key => {
          const pnl = currentInfo.value.pnlBoList.find(vo => vo.id == key)
          pnlFeedQuantity.push(pnl.name + ":" + item.pnlFeedMap[key]);
        })
        item.feedQuantity = pnlFeedQuantity.join("/")
        //已投料数量
        let allFeedQuantity: any = [];
        Object.keys(item.allPnlFeedMap).forEach(key => {
          const pnl = currentInfo.value.pnlBoList.find(vo => vo.id == key)
          allFeedQuantity.push(pnl.name + ":" + item.allPnlFeedMap[key]);
        })
        item.allFeedQuantity = allFeedQuantity.join("/")

        //  本次投料面积
        let feedArea = 0;
        let alreadyFeedArea = 0;
        if (item.pnlVoList != null) {
          item.pnlVoList.forEach(pnl => {
            let pnlFeedArea = 0;
            pnl.pnlSetBoList.forEach(pnlSet => {
              const area = (pnl.feedQuantity * pnlSet.quantity * pnlSet.saleOrderBo?.unitedLength * pnlSet.saleOrderBo?.unitedWidth / 1000000).toFixed(4);
              pnlFeedArea += Number(area);
              feedArea += Number(area);
            })
            pnl.feedArea = pnlFeedArea.toFixed(4);
          })
          item.feedArea = feedArea.toFixed(4);
        } else {
          item.feedArea = 0;
        }
      })
    })
  }

  const columnHistoryList = ref([
    {
      width: "150",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center'
    },
    {
      width: "120",
      title: '投料时间',
      field: 'createTime',
      align: 'center'
    },
    // {
    //   width: "120",
    //   title: '审核通过时间',
    //   field: 'commodityCode',
    //   align: 'center'
    // },
    {
      width: "150",
      title: '本次投料数量',
      field: 'feedQuantity',
      align: 'center'
    },
    {
      width: "150",
      title: '本次投料面积(㎡)',
      field: 'feedArea',
      align: 'center'
    },
    {
      width: "150",
      title: '本次投料率(%)',
      field: 'feedRate',
      align: 'center'
    },
    {
      width: "150",
      title: '已投料数',
      field: 'allFeedQuantity',
      align: 'center'
    },
    {
      width: "150",
      title: '已投面积(㎡)',
      field: 'alreadyFeedArea',
      align: 'center'
    },
    {width: "50", title: '操作', showOverflow: 'false', field: 'make', align: 'center'},
  ]);

  //获取产品总的PCS数量
  const getCommodityPcsQuantity = (orderId) => {
    var total = 0;
    schemeList.value?.length && schemeList.value.forEach(scheme => {
      scheme.pnlList?.length && scheme.pnlList.forEach(pnl => {
        pnl.pnl.pnlSetBoList.forEach(set => {
          if (set.saleOrderBo.id == orderId) {
            total += Number(Math.ceil(pnl.preFeedQuantity) * set.quantity * set.saleOrderBo.unitedNumber);
          }
        });
      });
    });
    return total;
  }

  //获取产品实投的PCS数量
  const getCommodityRealPcsQuantity = (saleOrderId) => {
    var total = 0;
    schemeList.value?.length && schemeList.value.forEach(scheme => {
      scheme.pnlList?.length && scheme.pnlList.forEach(pnl => {
        pnl.pnl.pnlSetBoList.forEach(set => {
          if (set.saleOrderBo.id == saleOrderId) {
            total += (pnl.feedQuantity!=null ? pnl.feedQuantity : 0) * set.quantity * set.saleOrderBo.unitedNumber;
          }
        });
      });
    });
    return total;
  };

  //获取产品已投的PCS数量
  const getCommodityAlreadPcsQuantity = (saleOrderId) => {
    var total = 0;
    schemeList.value?.length && schemeList.value.forEach(scheme => {
      scheme.pnlList?.length && scheme.pnlList.forEach(pnl => {
        pnl.pnl.pnlSetBoList.forEach(set => {
          if (set.saleOrderBo.id == saleOrderId) {
            total += (pnl.alreadyFeedQuantity * set.quantity * set.saleOrderBo.unitedNumber);
          }
        })
      })
    });
    return total;
  }

  //实投大料数改变
  const onSchemeRealChargeCountChange = (scheme: any) => {
    //先根据Scheme的投料数量（小数）计算PNL的数量 （小数）
    //将PNL取整
    //再反算PNL所占用的Scheme的数量（小数）
    //同时要取多个Pnl中大的那个
    let maxSchemeChargeCount = 0;
    //设置对应的Pnl数量
    scheme.pnlList.forEach(item => {
      //pnl必须投整数
      var chargeCount = Math.abs(Math.ceil(scheme.feedQuantity * item.count));
      item.feedQuantity = chargeCount;

      //因为pnl有取整，需要重新按pnl数来算大料的实际面积
      var tmp = 0;
      if (item.count && item.count > 0) {
        tmp = (chargeCount / item.count);
      }
      if (tmp > maxSchemeChargeCount) {
        maxSchemeChargeCount = tmp;
      }
      console.log('maxSchemeChargeCount', maxSchemeChargeCount)
    });
    setSchemeRealChargeCount(scheme, maxSchemeChargeCount);
  }

  //实投Pnl数改变
  const onPnlRealChargeCount = (scheme: any, pnl: any) => {
    //根据pnl数量计算最大的投料面积
    var maxSchemeChargeCount = 0;
    scheme.pnlList.forEach(item => {
      var tmp = 0;
      if (item.count && item.count > 0) {
        tmp = (item.feedQuantity / item.count);
      }
      if (tmp > maxSchemeChargeCount) {
        maxSchemeChargeCount = tmp;
      }
    });
    setSchemeRealChargeCount(scheme, maxSchemeChargeCount);
  }
  const setSchemeRealChargeCount = (scheme: any, realChargeCount: any) => {
    //设置SchemeList
    scheme.feedQuantity = realChargeCount.toFixed(2);
    //设置SchemeData
    var item = schemeList.value.find(o => {
      return o.id == scheme.id;
    });
    if (item) {
      item.feedQuantity = Number(scheme.feedQuantity);
    }
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
  const handleSelectionChange = (selection: ProductionVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    dialog.visible = true;
    dialog.title = "添加生产-排产单";
  }

  /** 修改按钮操作 */
  const handleUpdate = async (row?: ProductionVO) => {
    reset();
    const _id = row?.id || ids.value[0]
    dialog.visible = true;
    dialog.title = "修改生产-排产单";
    dialogTableLoading.value = true
    const res = await getProduction(_id);
    Object.assign(form.value, res.data);
    dialogTableLoading.value = false
  }

  /*数据校验*/
  const checkData = (schemeList: any[]) => {
    let boolean: boolean = false;
    console.log(schemeList)

    if (!form.value.planStartTime) {
      boolean = true;
      ElMessage.error("请输入开始时间!")
    }
    if (!form.value.planCompleteTime) {
      boolean = true;
      ElMessage.error("请输入结束时间!")
    }
    if (new Date(form.value.planCompleteTime) < new Date(form.value.planStartTime)) {
      boolean = true;
      ElMessage.error("结束时间不能小于开始时间!")
    }
    // schemeList.forEach(scheme => {
    //   if (scheme.feedQuantity < scheme.uncheckedQuantity) {
    //     boolean = true;
    //     ElMessage.warning(scheme.name + "的当前投料数量(" + scheme.feedQuantity + ")小于上次投料数量(" + scheme.uncheckedQuantity + ")，请检查");
    //     return;
    //   }
    //   scheme.pnlList.forEach(pnl => {
    //     if (pnl.feedQuantity < pnl.uncheckedQuantity) {
    //       boolean = true;
    //       ElMessage.warning(scheme.name + "的" + pnl.pnl.name + "当前投料数量(" + pnl.feedQuantity + ")小于上次投料数量(" + pnl.uncheckedQuantity + ")，请检查");
    //     }
    //   })
    // })
    return boolean;
  }

  // const checkQuantityReload = () => {
  //   return new Promise((resolve, reject) => {
  //     let tempArr = []
  //     schemeList.value.forEach(scheme => {
  //       scheme.pnlList.forEach(pnl => {
  //         // console.log('pnl----', pnl)
  //         let temp = {
  //           id: pnl.id,
  //           name: pnl.pnl.name,
  //           value: undefined,
  //           feedQuantity: pnl.feedQuantity,
  //           uncheckedQuantity: pnl.uncheckedQuantity
  //         }
  //         const crtTemp = tempArr.find((f: any) => f.id == temp.id)
  //         if (crtTemp) {
  //           crtTemp.feedQuantity += (temp.feedQuantity || 0)
  //           crtTemp.uncheckedQuantity += (temp.uncheckedQuantity || 0)
  //         } else {
  //           tempArr.push(temp)
  //         }
  //       })
  //     })
  //     ElMessageBox({
  //       title: '提示',
  //       message: () => h(ElRadioGroup, {
  //             modelValue: quantityReload.value,
  //             'onUpdate:modelValue': (val: boolean | string | number) => {
  //               quantityReload.value = val
  //             },
  //           },
  //           () => [h(ElRadio, { label: "1" }, () => "合并新增投料数至尾扎"), h(ElRadio, { label: "2" }, () => "生成新的流转卡")]
  //         ),
  //     }).then(() => {
  //       resolve(true)
  //     }).catch(() => {
  //       resolve(false)
  //     })
  //   })
  // }

  const saveHandle = async (data: any) => {
    // console.log(data)
    await saveProduction(data).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("保存成功");
    drawer.visible = false;
    dialog.visible = false;
    getList();
    getAuditList();
  }
  /** 提交按钮 */
  const submitForm = async (auditStatus: string) => {
    buttonLoading.value = true;
    try {
    const boolean: boolean = checkData(schemeList.value);
    if (boolean) {
      buttonLoading.value = false;
      return
    }
    const _planId = currentMiInfo.value.id;
    let check = false;
    check = await checkSaleOrderByBo({planId: _planId}).catch(() => {buttonLoading.value = false});
    if (!check) {
      buttonLoading.value = false;
      return;
    }
    //使用库存数据
    const productionCommodityRelationList = form.value.saleOrderVoList.map(obj => (
      {
        id: obj.commodityRelationId || undefined,
        planId: currentMiInfo.value.id,
        saleOrderId: obj.id,
        commodityId: obj.commodityId,
        quantity: obj.useQuantity || 0
      })
    ).filter(obj => {
      if (!obj.id) {
        console.log(obj)
        return obj.quantity > 0
      } else {
        return true;
      }
    })

    //开料数据
    const productionSchemeList = schemeList.value.map(obj => (
      {
        schemeId: obj.id,
        id: type.value == 1 ? obj.feedSchemeid : undefined,
        feedQuantity: obj.feedQuantity,
        uncheckedQuantity: obj.uncheckedQuantity,
      })
    )
    //pnl数据
    const productionPnlFeedList: any = [];
    schemeList.value.forEach(scheme => {
      scheme.pnlList.forEach(pnl => {
        productionPnlFeedList.push({
          schemeId: scheme.id,
          pnlId: pnl.pnl.id,
          id: type.value == 1 ? pnl.pnlFeedId : undefined,
          feedQuantity: pnl.feedQuantity != null ? pnl.feedQuantity : 0
        })
      })
    })
    const data = {
      id: type.value == 1 ? form.value.id : undefined,
      code: type.value == 1 ? form.value.code : undefined,
      area: productionArea.value,
      planStartTime: form.value.planStartTime,
      planCompleteTime: form.value.planCompleteTime,
      planId: currentMiInfo.value.id,
      isMerge: form.value.isMerge,
      isStart: form.value.isStart,
      productionCommodityRelationList: productionCommodityRelationList,
      productionSchemeList: productionSchemeList,
      productionPnlFeedList: productionPnlFeedList,
      auditStatus: auditStatus
    }
    //校验是否存在历史库存未使用
    if (auditStatus == '0') {
      let checkInventory = await checkCommodityRelation({
        planId: _planId,
        productionCommodityRelationList: productionCommodityRelationList,
        ids: form.value.saleOrderVoList.map(vo => vo.id)
      }).catch(() => {
        buttonLoading.value = false
      });
      if (!checkInventory) {
        buttonLoading.value = false;
        return;
      }
    }
    //校验是否订单已完成
    if(auditStatus == '1' || auditStatus == '0'){
      let checkFinish = await checkOrderFinish({
        ids: form.value.saleOrderVoList.map(vo => vo.id)
      }).catch(() => {
        buttonLoading.value = false
      });
      if(!checkFinish){
        buttonLoading.value = false;
        return;
      }
    }
    let hasUncheckedQuantity = productionSchemeList.some(item => item.uncheckedQuantity > 0);
    // console.log(form.value.productionStatus == '10' && hasUncheckedQuantity && auditStatus == '1', form.value.productionStatus == '10', hasUncheckedQuantity)
    if (form.value.productionStatus == '10' && hasUncheckedQuantity && auditStatus == '1') {
      // && auditStatus == '1'
      data.auditStatus = '4';

      // 暂时注释---start
      let tempArr = []
      schemeList.value.forEach(scheme => {
        scheme.pnlList.forEach(pnl => {
          let temp = {
            id: pnl.id,
            name: pnl.pnl.name,
            value: undefined,
            feedQuantity: pnl.feedQuantity,
            uncheckedQuantity: pnl.uncheckedQuantity
          }
          const crtTemp = tempArr.find((f: any) => f.id == temp.id)
          if (crtTemp) {
            crtTemp.feedQuantity += (temp.feedQuantity || 0)
            crtTemp.uncheckedQuantity += (temp.uncheckedQuantity || 0)
          } else {
            tempArr.push(temp)
          }
        })
      })
      let htmlValue = []
      tempArr.forEach((v, i) => {
        if (v.feedQuantity >= v.uncheckedQuantity) {
          v.value = '1'
        } else {
          v.value = '3'
        }
      })
      processDialod.value.data = data
      processDialod.value.open = true
      processDialod.value.list = tempArr
      return;
      // 暂时注释---end
      // data.mergeType = "2"
    }
    // console.log('data---', data)
    saveHandle(data)
    } catch (err) {
      buttonLoading.value = false;
    }
  }
  // 审核通过二次确定，并选弹框弹框
  const confirmProcess = () => {
    processDialod.value.open = false
    console.log("confirmProcess", processDialod.value)
    processDialod.value.data.mergeTypeList = processDialod.value.list.map((item: any) => {
      return {
        pnlId: item.id,
        mergeType: item.value
      }
    })
    saveHandle(processDialod.value.data)
  }
  // 关闭弹框
  const closeProcess = () => {
    buttonLoading.value = false;
    processDialod.value.list = []
    processDialod.value.open = false
    processDialod.value.data = undefined
  }

  /** 删除按钮操作 */
  const handleDelete = async (row?: ProductionVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认删除生产-排产单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
    await delProduction(_ids);
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
  }

  const exportVisible = ref(false);

  /** 导出按钮操作 */
  const handleExport = () => {
    if (!queryParams.value.auditTimeStart || !queryParams.value.auditTimeEnd) {
      exportVisible.value = true;
    }else {
      exportExcel();
    }
  }

  const exportExcel = ()=>{
    if(!queryParams.value.auditTimeStart && !queryParams.value.auditTimeStart){
      queryParams.value.auditTimeStart = dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00");
      queryParams.value.auditTimeEnd = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
    }
    exportVisible.value = false;
    proxy?.download('production/production/exportProductionFeed', {
      ...queryParams.value, tableName: 'productionProductionFeedSend'
    }, `投料列表_${new Date().getTime()}.xlsx`);
  }


  const buildProductionInfos = async (result: any) => {
    let inx = 0;
    let productionDetailsObj = result.miNodeInfoVoList.map((item: any) => {
      if (item.craftName == "压合") {
        laminateInfo.value = item;
        laminateInfo.value.remark = laminateInfo.value.remark ? laminateInfo.value.remark.public : '';
        if (item.requirement && item.requirement.length > 0) {
          item.requirement.forEach((element: any) => {

            let unit = element.unit ? element.unit : '';
            //压合板厚
            if (element.code == "Pressed_Thickness" && element.defaultValue) {
              laminateInfo.value.pressedThickness = element.defaultValue + unit;
            }
            //公差
            if (element.code == "Pressed_Tolerance" && element.defaultValue) {
              laminateInfo.value.pressedTolerance = element.defaultValue + unit;
            }
            //层叠状态
          });
        }
        laminateInfo.value.pressedLayeredStatus = item.extension ? item.extension.cascadingState : '';
      }
      inx++;
      let isOver = item.isCount == 1 ? "*" : "";
      let detail = {
        index: isOver + inx,
        productionCraft: item.craftName,
        params: [] as { name: string; para: string; }[],
      };
      item.requirement.forEach((req: any) => {
        let unit = req.unit ? req.unit : '';
        let _name = req.name ? req.name : '';
        if (req.differPNL && req.differPNL.length > 0) {

          req.differPNL.forEach((diff: any) => {
            let val = diff.parameterValue ? diff.parameterValue : diff.defaultValue;
            detail.params.push({
              name: _name,
              para: val + unit,
            })
          });

        } else {
          detail.params.push({
            name: _name,
            para: req.defaultValue + unit,
          })
        }
      });
      let remark = item.remark ? item.remark.public : '';
      // remark.differPNL.forEach((r: any) => {
      //   remark+=diff.parameterValue?diff.parameterValue:diff.defaultValue;
      // });
      detail.params.push({
        name: '备注',
        para: remark,
      })
      return detail;
    })
    console.log('productionDetails', productionDetailsObj);
    console.log('laminateInfo', laminateInfo.value);
    productionDetails.value = productionDetailsObj;
  }

  const buildDrillData = async (result: any) => {
    //非金属的钻孔数据
    if (result.ndrillInfos && result.ndrillInfos.length > 0) {
      n_drillInfos.value = [];
      n_drillHeaders.value = [];
      n_drillTitles.value = [];

      let rebuildDrillInfo = [];
      let sumRow = ['', '合计', '', ''];
      let _drillInfo: any = [];
      let totalQuantity: any = 0;
      result.drillInfos?.length && result.drillInfos.forEach((item: any) => {
        let _quantity = item.quantity ? item.quantity : 0;
        totalQuantity += _quantity;
        let detail = [item.code, item.diameter, item.tolerance, item.productDiameter, item.quantity, 'Y', item.remark];
        _drillInfo.push(detail);
      });
      sumRow.push(totalQuantity);
      sumRow.push('');
      sumRow.push('');
      _drillInfo.push(sumRow);
      rebuildDrillInfo.push(_drillInfo);
      n_drillInfos.value = rebuildDrillInfo;
      let n_drillHeaders2 = result.drillInfos?.length && result.drillInfos.map((o: any) => {
        let drillHeaderBefore = ['序号', '孔径', '公差', '成品孔径'];
        let drillHeaderAfter = ['Y/N', '备注'];
        let drillHeaderMiddle: any = [];
        drillHeaderMiddle.push(result.pnlInfos[0].name + '板孔数')//
        return drillHeaderBefore.concat(drillHeaderMiddle).concat(drillHeaderAfter);
      })
      n_drillHeaders.value = n_drillHeaders2;
      n_drillTitles.value.push(result.drill);
      console.log("n_drillInfos", n_drillInfos.value)
    }
    if (result.drillInfos && result.drillInfos.length > 0) {

      drillInfos.value = [];
      drillHeaders.value = [];
      drillTitles.value = [];

      let rebuildDrillInfo = [];
      let sumRow = ['', '合计', '', ''];
      let _drillInfo: any = [];
      let totalQuantity: any = 0;
      result.drillInfos.forEach((item: any) => {
        let _quantity = item.quantity ? item.quantity : 0;
        totalQuantity += _quantity;
        let detail = [item.code, item.diameter, item.tolerance, item.productDiameter, item.quantity, 'Y', item.remark];
        _drillInfo.push(detail);
      });
      sumRow.push(totalQuantity);
      sumRow.push('');
      sumRow.push('');
      _drillInfo.push(sumRow);
      rebuildDrillInfo.push(_drillInfo);
      drillInfos.value = rebuildDrillInfo;
      let n_drillHeaders2 = result.drillInfos.map((o: any) => {
        let drillHeaderBefore = ['序号', '孔径', '公差', '成品孔径'];
        let drillHeaderAfter = ['Y/N', '备注'];
        let drillHeaderMiddle: any = [];
        drillHeaderMiddle.push(result.pnlInfos[0].name + '板孔数')//
        return drillHeaderBefore.concat(drillHeaderMiddle).concat(drillHeaderAfter);
      })
      drillHeaders.value = n_drillHeaders2;
      drillTitles.value.push(result.drill);
      console.log("drillInfos", drillInfos.value)
    }
  }

  const buildPublicCommodityInfo = async (result: any) => {
    if (Array.isArray(result.commodityInfos) && result.commodityInfos.length != 0) {
      //成品铜厚
      let _materialCopperInside = result.commodityInfos[0].materialCopperInside ? result.commodityInfos[0].materialCopperInside : '';
      let _materialCopperOutside = result.commodityInfos[0].materialCopperOutside ? result.commodityInfos[0].materialCopperOutside : '';
      let _copperThickness = _materialCopperInside + _materialCopperOutside;
      publicCommodityInfo.value = {
        commodityCode: result.commodityInfos[0].commodityCode,
        customerPO: result.commodityInfos[0].customerPO,
        commodityName: result.commodityInfos[0].commodityName,
        orderQuantity: result.commodityInfos[0].orderQuantity,
        materialCode: result.commodityInfos[0].materialCode,
        deliveryTime: result.commodityInfos[0].deliveryTime,
        pcS_Size: result.commodityInfos[0].singleLength + '*' + result.commodityInfos[0].singleWidth,
        seT_Size: result.commodityInfos[0].unitedLength + '*' + result.commodityInfos[0].unitedWidth,
        commodityForm: result.commodityInfos[0].commodityForm,
        characterColor: result.commodityInfos[0].characterColor,
        commoditySolder: result.commodityInfos[0].commoditySolder,
        commodityThickness: result.commodityInfos[0].commodityThickness,
        copperThickness: _copperThickness,
        productionQuantity: result.commodityInfos[0].productionQuantity,
        unitedWay: result.commodityInfos[0].unitedWayLength + '*' + result.commodityInfos[0].unitedWayWidth,
        commodityTestWay: result.commodityInfos[0].commodityTestWay,
        cardArea: result.commodityInfos[0].cardArea,
        cardQuantity: result.commodityInfos[0].cardQuantity,
        productionArea: result.commodityInfos[0].productionArea,
        area: result.commodityInfos[0].area,
        placeOrderTime: result.commodityInfos[0].placeOrderTime,
      };
    }
  }


  const doMIPrintAduit = async (data: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(data.planId, type);
  }

  const doMIPrint = async (data: any, type: string) => {
    console.log('MIPrintRef.value', MIPrintRef.value)
    await MIPrintRef.value.doPrint(data.id, type);
  }

  const doMIPrint2 = async (data: any, type: string) => {
    console.log("doMIPrint", data);
    currentPdfList.value = []
    startPrint.value = false
    printType.value = type
    qcCodeImage.value = [];
    let buildFileSrc = {};
    proxy?.$modal.loading('加载中...')
    let res = await getPlanPrintInfo(data.id);
    let result = res;
    console.log('allData', result);
    allData.value = result;
    commodityInfos.value = result.commodityInfos;
    //构建钻孔数据
    await buildDrillData(result);
    //构建公共部分数据
    await buildPublicCommodityInfo(result);
    //构建工艺数据
    await buildProductionInfos(result);

    if (printType.value == "outsideImages") {
      let _outsideImages = result.outsideImages;

      if (_outsideImages && _outsideImages.length > 0) {
        let pdfUrls = [];
        for (let obj of _outsideImages) {
          // pdfUrls.push(obj.url);
          // let _pdflocalFile = encodeURIComponent(obj.url);
          // obj.pdfUrl = _pdflocalFile;
          if (obj.url.includes('.pdf')) {
            const resIm: any = await loadFile(obj.url)
            resIm.forEach((url: any) => {
              currentPdfList.value.push(url)
            })
          } else {
            currentPdfList.value.push(obj.url)
          }
        }
      }

      if (type == 'outsideImages' && !currentPdfList.value.length) {
        ElMessage.warning('该订单没有外形图！')
        proxy?.$modal.closeLoading()
        return
      }
      outsideImages.value = _outsideImages;
      // console.log('currentPdfList', currentPdfList.value)
    }

    let returnQty = allData.value.returnQty;
    if (returnQty) {
      allData.value.commodityCode = allData.value.commodityCode + '-' + returnQty
    }
    //开料率
    if (allData.value.schemeInfos && allData.value.schemeInfos.length > 0) {
      allData.value.schemeInfos.forEach((element: any) => {
        let s_cuttingRate = element.cuttingRate;
        if (s_cuttingRate) {
          element.cuttingRate = Number(s_cuttingRate).toFixed(2) + "%";
        }
      });
    }
    //二维码
    // let  _productionCardId:string = allData.value.productionCardId.toString();
    // QRCode.toDataURL(_productionCardId,{errorCorrectionLevel:'H'}, (err: any, url: string) => {
    //   if (err) {
    //     console.log('Error: ' + err);
    //   } else {
    //     qcCodeImage.value = url;
    //   }
    // });

    startPrint.value = true


    setTimeout(() => {
      printHtmlV2(null);
    }, 1500)
    proxy?.$modal.closeLoading()
  }

  const printHtmlV2 = (Id: any) => {
    let printNode = cardRef.value.cardRef;
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
    const blob = new Blob([newDoc.documentElement.innerHTML], {type: 'text/html'});
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

/**
 * 获取驳回到预投配置
 */
 const getProFeedReject = async () => {
  let params = {
    code: "FEED_REJECT_PRE"
  }
  const res = await listTenantConfig(params);
  if (res && res.length > 0) {
    if(res[0].values){
      if(res[0].values[0] === "true"){
        hasProFeedRejectBtn.value=true
      }else{
        hasProFeedRejectBtn.value=false
      }
    }
  }
}
  onMounted(() => {
    getList();
    // getAuditList();
    getDictOptions();
    getProFeedReject();
  });
</script>

<style>
  .el-dropdown-menu__item {
    font-size: 14px; /* 适当调整字体大小 */
  }
</style>

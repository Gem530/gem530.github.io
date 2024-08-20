<template>
  <div class="p-2 xtable-page">
    <div class="p-2 global-flex flex-end" style="padding-right: 30px">
      <div style="display:flex;margin-right: 20px;font-size: 12px;">
        <!-- <div style="width: 160px;background-color: #e37d7d; text-align: center; padding: 5px">排产后驳回的投料</div> -->
        <div style="width: 140px;background-color: #FAECD8; text-align: center; padding: 4px 0px;">补投驳回的投料</div>
      </div>
      <el-button @click="exportQualityDaily()">品质日报导出</el-button>
      <el-button type="primary" @click="openScrap()">报废</el-button>
    </div>
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" @tab-click="handleClick" class="xtable-tab">
        <el-tab-pane label="报废列表">
          <XTable toolId="productionScrap" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="scrapList"
                  :columnList="columnList"
                  border :showRefresh="true"
                  :sort-orders="sortCondition"
                  height="100%"
                  class="xtable-content"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="loading"
                  :intervalCondition="recordCondition"
          >
            <template #default-saleOrderVo.commodityName="scope">
              <el-button link type="primary" @click="openOrderDetail(scope.row)">
                {{scope.row.saleOrderVo.commodityName}}
              </el-button>
            </template>
            <template #default-productionVo.productionStatus="scope">
              {{statusOption.find(v => v.value == scope.row.productionVo.productionStatus)?.label}}
            </template>
            <template #default-scrapArea="scope">
              {{(scope.row.pcsQuantity / scope.row.saleOrderVo.unitedNumber * scope.row.saleOrderVo.unitedLength *
              scope.row.saleOrderVo.unitedWidth / 1000000).toFixed(6)}}
            </template>
            <template #default-scrapRate="scope">
              {{(scope.row.productionPcsQuantity > 0 ?scope.row.pcsQuantity / scope.row.productionPcsQuantity * 100 :
              0).toFixed(2)}}%
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="addFeed(scope.row)">补投</el-button>
              <el-button link type="primary" @click="getDetailss(scope.row)">详情</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="补投列表">
          <XTable toolId="productionFeedScrap" v-model:page-size="queryFeedParams.pageSize"
                  v-model:current-page="queryFeedParams.pageNum"
                  :page-params="{ perfect: true, total: feedTotal }"
                  :data="scrapFeedList"
                  :columnList="columnFeedList"
                  border :showRefresh="true"
                  height="100%"
                  class="xtable-content"
                  @searchChange="searchFeedChange"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :row-style="setRowStyle"
                  :intervalCondition="['createTime']"
          >
            <template #default-isCalculate="scope">
              {{scope.row.productionStatus=='11'?'驳回': scope.row.isCalculate == '1'?'已审核':'未审核'}}
            </template>
            <template #default-commodityName="scope">
              <el-popover placement="right" :width="500" trigger="click">
                <template #reference>
                  <el-button link type='primary'>{{scope.row.commodityName}}</el-button>
                </template>
                <el-table :data="scope.row.saleOrderVoList">
                  <el-table-column :show-overflow-tooltip="true" width="120" property="commodityCode" label="产品编码"/>
                  <el-table-column :show-overflow-tooltip="true" width="120" property="commodityName" label="产品名称"/>
                  <el-table-column :show-overflow-tooltip="true" width="120" property="customerCode" label="客户编码"/>
                  <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
                    <template #default="scope">
                      <el-button link type="primary" @click="openFeedOrderDetail(scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
            <template #default-make="scope">
              <el-button v-if="scope.row.productionStatus=='11'" link type="primary" @click="reloadFeed(scope.row)">重投
              </el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--选择排产单弹窗-->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="60%"  destroy-on-close
               :close-on-click-modal="false"
               v-loading="isLoading">
      <div class="orderLi" style="overflow:hidden;">
        <XTable toolId="chooseScrapProduction" v-model:page-size="auditQueryParams.pageSize"
                v-model:current-page="auditQueryParams.pageNum"
                :page-params="{ perfect: true, total: auditTotal }"
                :data="productionAuditList"
                :columnList="columnAuditList"
                border
                :loading="dialogTableLoading"
                height="500px"
                :isAutoHeight="true"
                @searchChange="searchAuditChange"
                :column-config="{ resizable: true }"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }"
        >
          <template #default-orderArea="scope">
            {{(scope.row.orderArea*1).toFixed(4)}}
          </template>
          <template #default-productionStatus="scope">
            {{scope.row.productionStatus == '30' ? '已完成' : '生产中'}}
          </template>
          <template #default-make="scope">
            <el-button link type="primary" @click="scrapProduction(scope.row)">报废</el-button>
          </template>
        </XTable>
      </div>
    </el-dialog>

    <!--报废抽屉-->
    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      size="90%"
      :close-on-click-modal="false"
      :direction="drawer.direction"
      :destroy-on-close="true"
      @close="closeDrawer"
    >
      <div class="drawer-flex-column">
        <el-card class="drawer-vxe-column">
          <vxe-table
            border
            keep-source
            size="mini"
            height="300px"
            align="center"
            show-overflow
            :column-config="{resizable: true,height :20}"
            :data="cardScrapList">
            <vxe-column type="seq" title="序号" width="48"></vxe-column>
            <vxe-column field="commodityId" title="产品编码">
              <template #default="scope">
                {{ currentProduction.saleOrderVoList?.find(v => v.id == scope.row.saleOrderId)?.commodityCode
                }}
              </template>
            </vxe-column>
            <vxe-column field="orderQuantity" title="订单数量" width="70">
              <template #default="scope">
                {{scope.row.orderQuantity}}
              </template>
            </vxe-column>
            <vxe-column field="productionCardId" title="流转卡号" width="130">
              <template #default="scope">
                {{ productionCardList?.find(v => v.id == scope.row.productionCardId)?.code }}
              </template>
            </vxe-column>
            <vxe-column field="orderQuantity" title="排产数量" width="70">
              <template #default="scope">
                {{scope.row.productionPcsQuantity}}
              </template>
            </vxe-column>
            <vxe-column field="craftId" title="报废工序" width="100">
              <template #default="scope">
                {{nodeList.find(v => v.id == scope.row.craftId)?.craftName}}
              </template>
            </vxe-column>
            <vxe-column field="reasonId" title="报废原因" width="100">
              <template #default="scope">
                {{allScrapReasonLIst.find(v => v.id == scope.row.reasonId)?.discardReason}}
              </template>
            </vxe-column>
            <!--            <vxe-column field="orderQuantity" title="排产单总报废数" width="110">-->
            <!--              <template #default="scope">-->
            <!--                {{getProductionSum()}}-->
            <!--              </template>-->
            <!--            </vxe-column>-->
            <vxe-column field="orderQuantity" title="报废总数量" width="80">
              <template #default="scope">
                {{getResultSum(scope.row.saleOrderId)}}
                <!--                {{scope.row.allScrapNum}}-->
              </template>
            </vxe-column>
            <vxe-column field="quantity" title="报废数量" width="70"></vxe-column>
            <vxe-column field="unit" title="报废单位" width="70">
              <template #default="scope">
                {{unitOption.find(v => v.value == scope.row.unit)?.label}}
              </template>
            </vxe-column>
            <vxe-column field="pcsQuantity" title="换算报废数量(pcs)" width="120"></vxe-column>
            <vxe-column field="responsibleUserName" title="责任人" width="60">
              <template #default="scope">
                <span v-if="scope.row.type == '1'">{{scope.row.responsibleUserName}}</span>
                <span v-if="scope.row.type == '2'">{{scope.row.supplierName}}</span>
              </template>
            </vxe-column>
            <vxe-column field="createTime" title="处理时间" width="140"></vxe-column>
            <vxe-column width="65" title="操作">
              <template #default="scope">
                <el-button link type="primary" @click="handleDeleteScrap(scope.row)">删除</el-button>
              </template>
            </vxe-column>
          </vxe-table>
        </el-card>
        <el-row class="drawer-flex-content">
          <el-col :span="4">
            <el-card>
              <el-timeline style="padding-left:3px;padding-right:3px;padding-top: 20px">
                <el-timeline-item v-for="(node,nodeIndex) in nodeList"
                                  :key="node.productionCardNodeId"
                                  size="large"
                                  placement="top"
                                  :color="node.productionCardNodeId == currentNode.productionCardNodeId?'#0bbd87':''"
                                  style="position:relative">
                  <div style="position:absolute;left:20px;top:-4px;">
                    <el-button v-if="node.productionCardNodeId == currentNode.productionCardNodeId"
                               type="text"
                               @click="onNodeClick(node)"
                               style="color:red;">{{node.craftName}}
                    </el-button>
                    <el-button v-else
                               type="text"
                               @click.stop="onNodeClick(node)">{{node.craftName}}
                    </el-button>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
          <el-col :span="20">
            <el-card>
              <el-form :model="form" ref="formRef" :rules="rules" label-width="68px" style="padding-top: 20px"
                       v-if="currentNode.id">
                <el-divider content-position="left">报废产品</el-divider>
                <el-form-item prop="saleOrderId" label-width="10">
                  <el-radio-group v-model="form.saleOrderId">
                    <el-radio v-for="item in currentProduction.saleOrderVoList" :label="item.id" size="small" border>
                      {{item.commodityCode}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-divider content-position="left">流转卡号</el-divider>
                <el-form-item prop="productionCardId" label-width="10">
                  <el-radio-group v-model="form.productionCardId">
                    <el-radio style="margin: 3px;" v-for="item in productionCardList" :label="item.id"
                              size="small" border>
                      {{item.code}}_{{item.pnlName}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-divider content-position="left">报废单位</el-divider>
                <el-form-item prop="unit" label-width="10">
                  <el-radio-group v-model="form.unit">
                    <el-radio label="1">PCS</el-radio>
                    <el-radio label="2">SET</el-radio>
                    <el-radio label="3">PNL</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-divider content-position="left">报废原因及数量</el-divider>
                <el-form-item label-width="10">
                  <el-row style="width: 100%">
                    <el-col v-for="(item,index) in scrapReasonList"
                            :key="item.id"
                            :span="6">
                      <el-form-item label="" :rules="[]">
                        <div style="display:flex;width:100%;padding: 2px;">
                          <span style="width: 80px">{{item.discardReason}}</span>
                          <el-input-number :precision="0" :min="1" v-model="item.quantity" :controls="false"
                                           class="scrap-flex-input-number"></el-input-number>
                          <!-- <el-input v-model="item.quantity" type="number"></el-input> -->
                          <el-button link circle icon="Close" type="primary"
                                     @click="onDeleteScrapReasonBtnClick(item,index)"></el-button>
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button icon="Plus"
                                   circle
                                   @click="openAddReason"></el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-divider content-position="left">责任方</el-divider>
                <el-form-item prop="type" label-width="10">
                  <el-radio-group v-model="form.type" @change="clearTypeValue">
                    <el-radio label="1">责任在本厂</el-radio>
                    <el-radio label="2">责任在外协厂商</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-divider content-position="left">{{form.type == '1'?'责任人':form.type=='2'?'责任供应商':''}}
                </el-divider>
                <el-form-item prop="typeValue" label-width="10" v-if="['1','2'].includes(form.type)">
                  <el-select v-model="form.typeValue" filterable v-if="form.type =='1'">
                    <el-option
                      v-for="item in dutyUserList"
                      :key="item.userId"
                      :label="item.nickName"
                      :value="item.userId"
                    />
                  </el-select>
                  <el-select v-model="form.typeValue" filterable v-if="form.type =='2'">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.id"
                      :label="item.companyName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-drawer>

    <!--新增报废原因-->
    <el-dialog title="新增报废原因"
               width="400px"
               v-model="dialogReason.visible"
               :close-on-click-modal="false"
               v-loading="isLoading">
      <el-form>
        <el-form-item label="报废原因">
          <el-input v-model="discardReason" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button @click="cancelReason">取消</el-button>
        <el-button type="primary"
                   @click="onAddScrapReasonConfirmBtnClick">确定
        </el-button>
      </div>
    </el-dialog>

    <!--补投-->
    <el-drawer
      v-model="feedDrawer.visible"
      :title="feedDrawer.title"
      size="100%"
      :close-on-click-modal="false"
      :direction="feedDrawer.direction"
      :destroy-on-close="true"
      @close="cancelFeed"
    >
      <template #header="{ close, titleId, titleClass }">
        <span>{{form.productionVo?.code}}-投料<span style="color: red">(补投)</span></span>
        <div style="float:right;margin-right:10px;">生产面积<span style="color:red;">{{productionArea}}</span>m²</div>
      </template>
      <vxe-table
        border
        keep-source
        align="center"
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
          <template #default="{ row }">
            <div v-for="item in resDictData.sys_commodity_type">
              <span v-if="item.dictValue==row.commodityType">{{item.dictLabel}}</span>
            </div>
          </template>
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
        <vxe-column title="现有库存数(pcs)" field="existingQuantity">
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
                     label-position="right">
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
                  <el-form-item label="物料名称">{{scheme.rawMaterial?.categoryName}}</el-form-item>
                </el-col>
                <el-col :span="3" class="cardhead">
                  <el-form-item label="品牌" label-width="50px">
                    <span v-for="item in resDictData.order_plate_brand">
                      <span v-if="item.dictValue==scheme.rawMaterial?.manufacturer">{{item.dictLabel}}</span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="cardhead">
                  <el-form-item label="长" label-width="50px">{{scheme.rawMaterial?.length}}mm</el-form-item>
                </el-col>
                <el-col :span="3" class="cardhead">
                  <el-form-item label="宽" label-width="50px">{{scheme.rawMaterial?.width}}mm</el-form-item>
                </el-col>
                <el-col :span="2" class="cardhead">
                  <el-form-item label="MI开料板厚" label-width="100px">{{getBoardThickness(scheme.name,
                    scheme.rawMaterial?.boardThickness)}}mm
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="cardhead">
                  <el-form-item label="MI开料铜厚" label-width="100px">{{getCopperThickness(scheme.name,
                    scheme.rawMaterial?.copperThickness)}}OZ
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
                                 :disabled="scheme.feedQuantity == 0 || form.isCalculate == '1' ? true:false"
                                 @change="onPnlRealChargeCount(scheme,scope.row)"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>

          <!--开料图
                      <el-collapse style="width:100%;" value="schemeImg">
                        <el-collapse-item title="开料图" name="schemeImg">
                          <div style="display:flex;flex-wrap:wrap">
                            <div v-for="(img,j) in scheme.files"
                                 :key="img.id">
                              <div style="display: flex; flex-direction: column ;margin:0 10px 5px 10px">
                                <el-image style="width:100px; height: 100px;"
                                          :src="img.url"
                                          fit="contain"
                                          :preview-src-list="scheme.imgList">
                                  <div slot="placeholder" class="image-slot">
                                    加载中<span class="dot">...</span>
                                  </div>
                                  <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                  </div>
                                </el-image>
                                <div style="text-align:center;margin-top:5px">{{img.name}}</div>
                              </div>
                            </div>
                          </div>
                          <div v-if=" scheme.files.length==0" style="text-align:center;margin:2px 0">暂无数据</div>
                        </el-collapse-item>
                      </el-collapse>-->

        </el-card>
        <el-row style="width: 98%; margin: 0px auto; text-align:left;">
          <el-col :span="7">
            <el-form-item label="开始时间">
              <el-date-picker v-model="form.planStartTime"
                              :disabled="form.isCalculate == '1' ? true:false"
                              type="datetime"
                              format="YYYY-MM-DD HH:mm"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="结束时间">
              <el-date-picker v-model="form.planCompleteTime"
                              :disabled="form.isCalculate == '1' ? true:false"
                              type="datetime"
                              format="YYYY-MM-DD HH:mm"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-checkbox v-model="form.isStart" true-label="1"
                           false-label="0">立即开始生产
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-checkbox v-model="form.isMerge" true-label="1"
                           false-label="0">尾扎合并
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancelFeed">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitFeed('0')">确定
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!--详情-->
    <el-dialog title="报废记录"
               width="80%"
               v-model="dialogScrap.visible"
               :close-on-click-modal="false"
               @close="cancelDetail"
               v-loading="isLoading">
      <vxe-table
        border
        keep-source
        size="mini"
        height="800px"
        align="center"
        show-overflow
        :column-config="{resizable: true,height :20}"
        :data="cardScrapList">
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="commodityId" title="产品编码">
          <template #default="scope">
            {{scrapInfo.saleOrderVo.commodityCode}}
          </template>
        </vxe-column>
        <vxe-column field="orderQuantity" title="订单数量" width="70">
          <template #default="scope">
            {{scope.row.orderQuantity}}
          </template>
        </vxe-column>
        <vxe-column field="productionCardId" title="流转卡号" width="130">
          <template #default="scope">
            {{scrapInfo.productionCardVo.code}}
          </template>
        </vxe-column>
        <vxe-column field="orderQuantity" title="排产数量" width="70">
          <template #default="scope">
            {{scope.row.productionPcsQuantity}}
          </template>
        </vxe-column>
        <vxe-column field="craftId" title="报废工序" width="100">
          <template #default="scope">
            {{nodeList.find(v => v.id == scope.row.craftId)?.craftName}}
          </template>
        </vxe-column>
        <vxe-column field="reasonId" title="报废原因" width="100">
          <template #default="scope">
            {{allScrapReasonLIst.find(v => v.id == scope.row.reasonId)?.discardReason}}
          </template>
        </vxe-column>
        <!--        <vxe-column field="orderQuantity" title="排产单总报废数" width="110">-->
        <!--          <template #default="scope">-->
        <!--            {{getProductionSum()}}-->
        <!--          </template>-->
        <!--        </vxe-column>-->
        <vxe-column field="orderQuantity" title="报废总数量" width="80">
          <template #default="scope">
            {{getResultSum(scope.row.saleOrderId)}}
            <!--            {{scope.row.allScrapNum}}-->
          </template>
        </vxe-column>
        <vxe-column field="quantity" title="报废数量" width="70"></vxe-column>
        <vxe-column field="unit" title="报废单位" width="70">
          <template #default="scope">
            {{unitOption.find(v => v.value == scope.row.unit)?.label}}
          </template>
        </vxe-column>
        <vxe-column field="pcsQuantity" title="换算报废数量(pcs)" width="120"></vxe-column>
        <vxe-column field="responsibleUserName" title="责任人" width="70">
          <template #default="scope">
            <span v-if="scope.row.type == '1'">{{scope.row.responsibleUserName}}</span>
            <span v-if="scope.row.type == '2'">{{scope.row.supplierName}}</span>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="处理时间" width="140"></vxe-column>
        <vxe-column width="60" title="操作">
          <template #default="scope">
            <el-button link type="primary" @click="handleDeleteScrap(scope.row)">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>

    <!--详情预览-->
    <el-drawer
      v-model="orderDrawer.visible"
      :title="orderDrawer.title"
      size="850px"
      :direction="orderDrawer.direction"
      :destroy-on-close="true"
      modal-class="detail-prod-drawder"
    >
      <SaleDescriptions v-if="currentVo" :currentInfo="currentVo" :customerList="customerList" :isShow="false"
                        :resDictData="resDictData"></SaleDescriptions>
    </el-drawer>
  </div>
</template>

<script setup name="ProductionScrap" lang="ts">
  import {
    getInInventoryDetails,
    saveCommodityInOutRecord,
    getInRecordList,
    delInRecords,
    getInOutList,
    getScrapList,
    getNodesByProductionId, getCardList
  } from '@/api/production/card';
  import {CardVO, CardQuery, CardForm} from '@/api/production/card/types';
  import {deepClone} from "@/utils";
  import {
    checkFeed, checkOrderFinish,
    getDetails,
    getProductionRemediationList,
    listAuditProduction,
    saveProduction,
  } from "@/api/production/production";
  import {computed, ref} from "vue";
  import {ProductionVO} from "@/api/production/production/types";
  import {addDiscardReason, delDiscardReason, getListDiscardReason} from "@/api/basedata/discardReason";
  import {getUserByCraftId} from "@/api/basedata/craft";
  import {getSupplierByOrderIds} from "@/api/outsource/sourceFullProcessOrder";
  import {getMiInfo} from "@/api/project/productionPlan";
  import {ElMessage} from "element-plus";
  import {getSupplierByProductionId} from "@/api/outsource/sourceHalfProcessOrder";
  import {
    checkReasonDelete,
    checkScrap,
    checkScrapRemediation,
    delProductionScrap,
    delScrap,
    getScrapListByCard,
    saveScrap
  } from '@/api/production/scrap';
  import {CraftTemplateCraftVO} from "@/api/basedata/craftTemplateCraft/types";
  import {delCraftTemplateCraft} from "@/api/basedata/craftTemplateCraft";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import dayjs from "dayjs";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const scrapList = ref<any[]>([]);
  const scrapFeedList = ref<any[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const feedTotal = ref(0);
  const auditTotal = ref(0);

  const formRef = ref<ElFormInstance>();

  const cardScrapList = ref([]);
  const dialogTableLoading = ref(false)

  const productionAuditList = ref<ProductionVO[]>([]);

  const unitOption = ref([
    {label: "pcs", value: "1"},
    {label: "set", value: "2"},
    {label: "pnl", value: "3"},
  ])

  const statusOption = ref([
    {label: "待开始", value: "10"},
    {label: "进行中", value: "20"},
    {label: "完成", value: "30"},
    {label: "暂停", value: "40"},
  ])


  const clearTypeValue = () => {
    form.value.typeValue = ""
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const dialogHistory = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const dialogReason = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const dialogScrap = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: '',
    direction: "rtl"
  });

  const feedDrawer = reactive<DrawerOption>({
    visible: false,
    title: '',
    direction: "rtl"
  });

  const initFormData: CardForm = {
    id: undefined,
    productionId: undefined,
    ownerId: undefined,
    bundleCode: undefined,
    bundleCount: undefined,
    parentId: undefined,
    code: undefined,
    bundlePnlQuantity: undefined,
    quantityPerCard: undefined,
    pnlId: undefined
  }

  const initAuditQueryParams = {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "create_time",
    productionStatusList: ['20','30'],
    isCalculate: "1",
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
  }
  const auditQueryParams = ref({
    ...initAuditQueryParams
  })

  const queryFeedParams = ref({
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "create_time",
    productionId: undefined,
    ownerId: undefined,
    bundleCode: undefined,
    bundleCount: undefined,
    parentId: undefined,
    code: undefined,
    bundlePnlQuantity: undefined,
    quantityPerCard: undefined,
    pnlId: undefined,
    params: {}
  })

  const productionArea = computed({
    get() {
      let area = 0;
      if (schemeList.value.length > 0) {
        let currentList: any = [];
        schemeList.value.forEach(scheme => {
          scheme.pnlList?.length && scheme.pnlList.forEach(pnl => {
            console.log(pnl)
            area += Number(pnl.pnl.pnlWidth * pnl.pnl.pnlLength / 1000000 * Math.abs(pnl.feedQuantity));

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
        // currentPnlList.value = currentList;
        // console.log(currentPnlList.value)
      }
      return area.toFixed(6);
    },
    set(val: any) {
      return val
    }
  })

  const getResultSum = (orderId: any) => {

    const sum = cardScrapList.value.reduce((total, current) => {
      if (orderId == current.saleOrderId) {
        total = total + current.pcsQuantity
      }
      return total
    }, 0);
    return sum;
  }

  // const getProductionSum = ()=>{
  //   const sum = cardScrapList.value.reduce((total, current) => {
  //       total = total + current.pcsQuantity
  //     return total
  //   }, 0);
  //   return sum;
  // }

  const formType = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(`${data.form.type == '1' ? '责任人' : '责任供应商'}不能为空`))
    } else {
      callback()
    }
  }
  const data = reactive<PageData<any, any>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      isAsc: "desc",
      orderByColumn: "create_time",
      productionId: undefined,
      ownerId: undefined,
      bundleCode: undefined,
      bundleCount: undefined,
      parentId: undefined,
      code: undefined,
      bundlePnlQuantity: undefined,
      quantityPerCard: undefined,
      pnlId: undefined,
      params: {}
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      productionId: [
        {required: true, message: "排产单ID不能为空", trigger: "blur"}
      ],
      saleOrderId: [
        {required: true, message: "报废产品不能为空", trigger: "change"}
      ],
      productionCardId: [
        {required: true, message: "流转卡号不能为空", trigger: "change"}
      ],
      unit: [
        {required: true, message: "报废单位不能为空", trigger: "change"}
      ],
      type: [
        {required: true, message: "责任方不能为空", trigger: "change"}
      ],
      typeValue: [
        {required: true, validator: formType, trigger: "blur"}
      ],
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  const recordCondition = ['productionVo.startTime', 'createTime'];

  const sortCondition = ['createTime'];

  const columnList = ref([

    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '生产状态',
      field: 'productionVo.productionStatus',
      width: '120',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择状态',
      },
      filterData: () => statusOption.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      title: '排产单号',
      field: 'productionVo.code',
      width: '120',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      title: '流转卡号',
      field: 'productionCardVo.code',
      width: '120',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入流转卡号'}
    },
    {
      width: "120",
      title: '排产时间',
      field: 'productionVo.startTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '产品编码',
      field: 'saleOrderVo.commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: "150",
      title: '产品名称',
      field: 'saleOrderVo.commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: "120",
      title: '订单数量',
      field: 'saleOrderVo.selfQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '订单面积(㎡)',
      field: 'saleOrderVo.area',
      align: 'center'
    },
    {
      width: "120",
      title: '排产数量(pcs)',
      field: 'productionPcsQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '生产面积(㎡)',
      field: 'productionPnlArea',
      align: 'center'
    },
    {
      width: "120",
      title: '入库数量(pcs)',
      field: 'inInventoryQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '报废数量(pcs)',
      field: 'pcsQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '报废面积(㎡)',
      field: 'scrapArea',
      align: 'center'
    },
    {
      width: "120",
      title: '报废率',
      field: 'scrapRate',
      align: 'center'
    },
    {
      width: "120",
      title: '报废时间',
      field: 'createTime',
      align: 'center',
      sortable: true,
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '操作', field: 'make', showOverflow: false, align: 'center', width: '100', fixed: 'right',},
  ]);
  const remediationStatusOption = ref([
    {label: "驳回", value: "11"},
    {label: "已审核", value: "1"},
    {label: "未审核", value: "0"},
  ])

  const columnFeedList = ref([
    {title: "序号", type: 'seq', fixed: "left", align: 'center', width: '60'},
    {
      title: '审核状态',
      field: 'isCalculate',
      width: '120',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择MI类型',
      },
      filterData: () => remediationStatusOption.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      width: "120",
      title: '补投时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      title: '排产单号',
      field: 'code',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: "120",
      title: '订单数量',
      field: 'selfQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '订单面积(㎡)',
      field: 'orderArea',
      align: 'center'
    },
    {
      width: "120",
      title: '排产数量',
      field: 'remediationQuantity',
      align: 'center'
    },
    {
      width: "120",
      title: '生产面积(㎡)',
      field: 'remediationArea',
      align: 'center'
    },
    {
      width: "120",
      title: '补投数量',
      field: 'productionNum',
      align: 'center'
    },
    {
      width: "120",
      title: '补投面积',
      field: 'area',
      align: 'center'
    },
    {title: '操作', field: 'make', showOverflow: false, align: 'center', width: '100', fixed: 'right',},
  ]);

  const columnAuditList = ref([
    {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
    {
      width: "120",
      title: '排产单号',
      fixed: 'left',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },
    {
      width: "120",
      title: '生产状态',
      fixed: 'left',
      align: 'center',
      field: 'productionStatus',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入MI类型'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, {dictLabel: "生产中", dictValue: "-1",}, {
        dictLabel: "已完成",
        dictValue: "30",
      }],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: "120",
      title: '排产时间',
      fixed: 'left',
      field: 'createTime',
      align: 'center',
    },
    {
      width: "120",
      title: '产品编码',
      fixed: 'left',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    {
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    {width: "80", title: '订单数量', field: 'orderQuantity', align: 'center'},
    {width: "90", title: '订单面积(㎡)', field: 'orderArea', align: 'center'},
    {width: "80", title: '排产数量', field: 'productionNum', align: 'center'},
    {width: "80", title: '生产面积', field: 'feedArea', align: 'center'},
    {width: "80", title: '报废数量', field: 'scrapQuantity', align: 'center'},
    {width: "80", title: '入库数量', field: 'inventoryQuantity', align: 'center'},
    {title: '操作', field: 'make', showOverflow: false, align: 'center', minWidth: '100', fixed: 'right',},
  ]);

  const setRowStyle = ({row, rowIndex, $rowIndex}: any) => {
    if (row.productionStatus == '11' && row.productionCardVoList != null) {
      return {
        backgroundColor: '#FAECD8',
      }
    }
    if (row.productionStatus == '11') {
      return {
        backgroundColor: 'rgb(250, 236, 216)',
      }
    }
  }

  /*重投*/
  const reloadFeed = async (row?: any) => {
    feedDrawer.visible = true;
    dialogTableLoading.value = true
    const res = await getMiInfo(row.planId);
    const data = res.data;
    currentMiInfo.value = data;
    form.value = row;
    schemeList.value = data.schemeBoList;
    pnlList.value = data.pnlBoList;
    schemeChargeRate.value = [];
    const schemeIdList: [] = schemeList.value.map(scheme => scheme.id);
    const commodityIdList: [] = form.value.saleOrderVoList?.map(order => order.commodityId);
    const saleOrderIdList: [] = form.value.saleOrderVoList?.map(order => order.id);
    const pnlIdList: [] = pnlList.value.map(pnl => pnl.id);
    const query = {
      planId: row.planId,
      id: row.id,
      schemeIdList: schemeIdList,
      saleOrderIdList: saleOrderIdList,
      commodityIdList: commodityIdList,
      pnlIdList: pnlIdList
    }
    const productionSchemeRes = await getDetails(query);
    const commodityInventoryList = productionSchemeRes.data.commodityInventoryList ?? [];
    const productionCommodityRelationVoList = productionSchemeRes.data.productionCommodityRelationVoList ?? [];
    const productionSchemeVoList = productionSchemeRes.data.productionSchemeVoList ?? [];
    const alreadyPnlFeedVoList = productionSchemeRes.data.alreadyPnlFeedVoList ?? [];
    const waitAuditCommodityList = productionSchemeRes.data.waitAuditCommodityList ?? [];
    const waitAuditSchemeList = productionSchemeRes.data.waitAuditSchemeList ?? [];
    const waitAuditPnlList = productionSchemeRes.data.waitAuditPnlList ?? [];
    const scrapMaps = productionSchemeRes.data.scrapMaps ?? {};
    form.value.saleOrderVoList = data.saleOrderVoList;
    form.value.saleOrderVoList.forEach(order => {
      order.scrapNum = scrapMaps[order.id];
      const resultCommodityItem = waitAuditCommodityList.find(item => item.saleOrderId == order.id && item.commodityId == order.commodityId);
      if (resultCommodityItem) {
        order.commodityRelationId = resultCommodityItem.id;
        order.useQuantity = resultCommodityItem.quantity;
      }
      if (new Date(order.dispatchTime) < new Date(form.value.planCompleteTime)) {
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
      scheme.alreadyFeedQuantity = alreadyFeedSum;
      //设置实投数量
      const realChargeCount = (scheme.preFeedQuantity - scheme.alreadyFeedQuantity).toFixed(2);
      //本次待审核scheme数据
      const resultSchemeItem = waitAuditSchemeList.find(item => item.schemeId == scheme.id);
      scheme.feedQuantity = resultSchemeItem.feedQuantity > 0 ? resultSchemeItem.feedQuantity : resultSchemeItem.uncheckedQuantity;
      scheme.uncheckedQuantity = Number(resultSchemeItem.uncheckedQuantity);
      scheme.feedSchemeid = resultSchemeItem.id;
      //分scheme设置投料利用率的默认值
      schemeChargeRate.value.push(100 + chargeRate.value);
      //处理Pnl
      const pnlArray: any[] = [];
      scheme.pnlCountList.forEach(pnlCount => {
        const pnl = pnlList.value.find(o => {
          return o.id == pnlCount.pnlId;
        });
        if (pnl) {
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
            id: resultPnlItem.pnlId,
            pnlFeedId: resultPnlItem.id,
            count: pnlCount.pnlQuantity,
            feedQuantity: resultPnlItem.feedQuantity > 0 ? resultPnlItem.feedQuantity : resultPnlItem.uncheckedQuantity,
            uncheckedQuantity: Number(resultPnlItem.uncheckedQuantity),
            preFeedQuantity: scheme.preFeedQuantity * pnlCount.pnlQuantity,
            alreadyFeedQuantity: alreadyFeedQuantity,
          });
        }

      });
      scheme.pnlList = pnlArray;
    });
    dialogTableLoading.value = false
  }

  //报废明细
  const scrapInfo = ref();

  //订单明细
  const currentVo = ref<any>({});

  const orderDrawer = reactive<DrawerOption>({
    title: '订单详情',
    visible: false,
    direction: "rtl"
  });

  const openOrderDetail = (row: any) => {
    currentVo.value = row.saleOrderVo;
    orderDrawer.visible = true;
    orderDrawer.title = row.saleOrderVo.code;
  }

  const openFeedOrderDetail = (row: any) => {
    currentVo.value = row;
    orderDrawer.visible = true;
    orderDrawer.title = row.code;
  }

  const getDetailss = async (row: any) => {
    scrapInfo.value = row;
    //获取节点
    const resNode = await getNodesByProductionId(row.productionId);
    nodeList.value = resNode.data
    dialogScrap.visible = true;
    dialogTableLoading.value = true
    const res = await getScrapListByCard({productionCardId: row.productionCardVo.id});
    cardScrapList.value = res.data;
    dialogTableLoading.value = false
  }

  const cancelDetail = () => {
    dialogScrap.visible = false;
    cardScrapList.value = [];
  }

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

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = deepClone(params);
    Object.keys(queryParams.value).forEach(key => {
      if (key == 'sorts' && params.sorts && params.sorts.length > 0) {
        params.sorts.forEach((item: any) => {
          queryParams.value.orderByColumn = item.prop;
          queryParams.value.isAsc = item.order;
        })
      } else {
        queryParams.value.isAsc = "desc"
        queryParams.value.orderByColumn = "create_time"
      }
      if (key == 'productionVo.code') {
        //排产单号
        queryParams.value['productionCode'] = queryParams.value[key];
      } else {
        if (key.includes(".")) {
          const queryParamsKey = key.substring(key.indexOf(".") + 1);
          queryParams.value[queryParamsKey] = queryParams.value[key];
        } else {
          if (queryParams.value[key] !== null && queryParams.value[key] !== undefined) {
            queryParams.value[key] = queryParams.value[key];
          }
        }
      }

    });
    console.log("params:", queryParams.value)
    getList()
  }

  // 获取 搜索条件
  const searchFeedChange = (params: any) => {
    queryFeedParams.value = params;
    // Object.keys(queryFeedParams.value).forEach(key => {
    //   if (queryFeedParams.value[key] !== null && queryFeedParams.value[key] !== undefined) {
    //     queryFeedParams.value[key] = queryFeedParams.value[key];
    //   }
    // });
    getFeedList()
  }

  // 获取 搜索条件
  const searchAuditChange = (params: any) => {
    auditQueryParams.value = params;
    Object.keys(params).forEach(key => {
      if (key == 'productionStatus' && params[key] == '-1') {
        auditQueryParams.value.productionStatusList = ["20"];
        auditQueryParams.value.productionStatus = undefined
      }
    });
    auditQueryParams.value.isAsc = "desc"
    auditQueryParams.value.orderByColumn = "create_time"
    auditQueryParams.value.isCalculate = "1"
    // Object.keys(params).forEach(key => {
    //   if (params[key] !== null && params[key] !== undefined) {
    //     auditQueryParams.value[key] = params[key];
    //   }
    // });
    if(auditQueryParams.value.productionStatus == null && auditQueryParams.value.productionStatusList==null){
      auditQueryParams.value.productionStatusList= ['20','30'];
    }
    getAuditList()
  }

  const handleClick = (pane: any, ev: any) => {
    if (pane.index == 0) {
      queryParams.value.isComplete = '0';
      getList();
    } else {
      getFeedList()
    }
  }

  const getScrapByProduction = async () => {
    const res = await getScrapListByCard({productionId: currentProduction.value.id})
    cardScrapList.value = res.data;
  }

  /*报废弹窗*/
  const openScrap = async () => {
    dialog.visible = true;
    dialog.title = "请选择需要报废的排产单"
    auditQueryParams.value = initAuditQueryParams
    getAuditList();
  }

  const exportQualityDaily = () => {
    const date = dayjs(new Date()).subtract(1, 'day').format("YYYY-MM-DD")
    proxy?.download('production/scrap/exportQualityDaily', {
      ...queryParams.value
    }, `品质日报_${date}.xlsx`)
  }

  /*选择报废排产单*/
  const getAuditList = async () => {
    dialogTableLoading.value = true;
    const res = await listAuditProduction(auditQueryParams.value);
    productionAuditList.value = res.rows;
    dealData(productionAuditList.value);
    auditTotal.value = res.total;
    dialogTableLoading.value = false;
  }

  const nodeList = ref([]);

  const currentProduction = ref({});

  let supplierList = ref([]);

  /*报废按钮*/
  const scrapProduction = async (row: any) => {
    supplierList.value = [];
    cardScrapList.value = [];
    currentProduction.value = row;
    const orderIdList = row.saleOrderVoList.map(item => {
        return item.id
      }
    );
    //获取节点
    proxy?.$modal.loading('加载中...');
    const res = await getNodesByProductionId(row.id).catch(() => proxy?.$modal.closeLoading());
    nodeList.value = res.data
    //流转卡
    const res2 = await getCardList({productionId: currentProduction.value.id}).catch(() => proxy?.$modal.closeLoading());
    productionCardList.value = res2.data;
    //全制成外协
    const res3 = await getSupplierByOrderIds({saleOrderIdList: orderIdList}).catch(() => proxy?.$modal.closeLoading());
    if (res3 && res3.data.length > 0) {
      supplierList.value = supplierList.value.concat(res3.data)
    }
    //半制成外协
    const res4 = await getSupplierByProductionId({productionId: currentProduction.value.id}).catch(() => proxy?.$modal.closeLoading());
    if (res4 && res4.data.length > 0) {
      supplierList.value = supplierList.value.concat(res4.data)
    }
    //报废
    const res5 = await getScrapListByCard({productionId: currentProduction.value.id}).finally(() => proxy?.$modal.closeLoading());
    cardScrapList.value = res5.data;
    drawer.visible = true;
  }

  const currentNode = ref({});
  let scrapReasonList = ref([]);

  let allScrapReasonLIst = ref([]);

  let productionCardList = ref([]);
  const tempReason = ref()

  const closeDrawer = () => {
    currentNode.value = {};
    getAuditList()
  }

  let dutyUserList = ref([]);

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    formRef.value?.resetFields();
    // cardScrapList.value = [];
  }

  /** 删除按钮操作 */
  const handleDeleteScrap = async (row: any) => {
    await proxy?.$modal.confirm('您确定要删除该报废记录吗?').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...');
    await delProductionScrap(row).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("删除成功");
    if(dialogScrap.visible == true){
      getDetailss(scrapInfo.value)
    } else{
      await getScrapByProduction();
    }
    await getList();
  }

  //节点点击事件
  const onNodeClick = async (node: any) => {
    reset()
    currentNode.value = node;
    scrapReasonList.value = [];
    const req = {
      craftId: node.id
    }
    const res = await getListDiscardReason(req);
    scrapReasonList.value = res.data;
    const res2 = await getUserByCraftId({id: node.id});
    dutyUserList.value = res2.data;
  };

  // 获取报废原因及数量
  const getNewListDiscardReason = async () => {
    const req = {
      craftId: currentNode.value.id
    }
    const res = await getListDiscardReason(req);
    scrapReasonList.value = res.data;
    // 保留之前填写的值
    scrapReasonList.value.map((item: any) => {
      const crtTemp = tempReason.value?.length && tempReason.value.find((v: any) => v.id == item.id)
      if (crtTemp && crtTemp?.quantity) {
        item.quantity = crtTemp?.quantity || undefined
      }
    })
  }

  //报废原因
  const getScrapReason = async () => {
    const res = await getListDiscardReason({});
    allScrapReasonLIst.value = res.data;
    allScrapReasonLIst.value.push({id:'0',discardReason:'订单完成自动报废'});
  }
  //删除报废原因按钮点击事件
  const onDeleteScrapReasonBtnClick = async (item: any, index: number) => {
    const _ids = item.id;
    if (!_ids) {
      // proxy?.$modal.msgError('该报废原因ID不存在，已更新数据，请再次操作')
      tempReason.value = deepClone(scrapReasonList.value)
      await getNewListDiscardReason()
      return
    }
    await proxy?.$modal.confirm('您确定要删除该报废原因吗?').finally(() => loading.value = false);
    const req = {
      reasonId: item.id
    }
    await checkReasonDelete(req)
    await delDiscardReason(_ids);
    // onNodeClick(currentNode.value);
    tempReason.value = deepClone(scrapReasonList.value)
    // console.log(tempReason.value)
    getNewListDiscardReason()
    getScrapReason()
    proxy?.$modal.msgSuccess("删除成功");
  }

  /*添加报废原因弹窗*/
  const openAddReason = async () => {
    dialogReason.visible = true;
  }

  const discardReason = ref("");

  /*取消添加报废原因*/
  const cancelReason = async () => {
    dialogReason.visible = false;
    discardReason.value = "";
  }

  /*添加报废原因*/
  const onAddScrapReasonConfirmBtnClick = async () => {
    const req = {
      craftId: currentNode.value.id,
      discardReason: discardReason.value
    }
    await addDiscardReason(req).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("添加成功");
    tempReason.value = deepClone(scrapReasonList.value)
    getNewListDiscardReason()
    getScrapReason()
    cancelReason();
    // onNodeClick(currentNode.value);
  }

  /** 查询报废列表 */
  const getList = async () => {
    loading.value = true;
    const res = await getScrapList(queryParams.value);
    scrapList.value = res.rows;
    scrapList.value.forEach(item => {

    })
    total.value = res.total;
    loading.value = false;
  }

  /** 查询补投列表 */
  const getFeedList = async () => {
    loading.value = true;
    const res = await getProductionRemediationList(queryFeedParams.value);
    scrapFeedList.value = res.rows;
    dealData(scrapFeedList.value)
    feedTotal.value = res.total;
    loading.value = false;
  }

  const dealData = async (rows: any[]) => {
    rows.forEach(item => {
      if (item.saleOrderVoList && item.saleOrderVoList.length > 0) {
        item.commodityCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.commodityCode
        }).join("/") : item.saleOrderVoList[0].commodityCode;
        item.commodityName = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.commodityName
        }).join("/") : item.saleOrderVoList[0].commodityName;
        item.customerCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.customerCode
        }).join("/") : item.saleOrderVoList[0].customerCode;
        item.selfQuantity = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.selfQuantity
        }).join("/") : item.saleOrderVoList[0].selfQuantity;
        let orderQuantity = 0;
        item.saleOrderVoList.forEach(x => {
          orderQuantity += x.selfQuantity;
        })
        item.orderQuantity = orderQuantity
        let orderArea = 0;
        item.saleOrderVoList.forEach(x => {
          orderArea += Number(x.area);
        })
        item.orderArea = orderArea;
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
      }
    })
  }

  /** 提交按钮 */
  const submitForm = async () => {
    if (!currentNode.value?.id) {
      ElMessage.error("请选择工序");
      return
    }
    const scrapList: any = scrapReasonList.value?.length && deepClone(scrapReasonList.value).filter(item => {
      return Number(item.quantity) > 0
    })
    if (scrapList.length == 0) {
      ElMessage.error("报废数量必须大于0");
      return;
    }
    scrapList.map(item => {

      if (form.value.type == 1) {
        const info: any = dutyUserList.value.find(info => info.userId == form.value.typeValue)
        item.responsibleUserId = info?.userId;
        item.responsibleUserName = info?.nickName;
      }
      if (form.value.type == 2) {
        const info: any = supplierList.value.find(info => info.id == form.value.typeValue)
        item.supplierId = info?.id;
        item.supplierName = info?.companyName;
      }
      item.type = form.value.type;
      item.unit = form.value.unit;
      item.productionCardId = form.value.productionCardId;
      item.productionId = currentProduction.value.id;
      item.planId = currentProduction.value.planId;
      item.saleOrderId = form.value.saleOrderId;
      const order = currentProduction.value.saleOrderVoList.find(info => info.id == item.saleOrderId);
      item.commodityId = order?.commodityId;
      if (item.id != null && item.id != undefined) {
        item.reasonId = item.id;
      }
      delete (item.id);
      item.productionCardNodeId = currentNode.value.productionCardNodeId;
      item.isCardNode = currentNode.value.isCardNode;
    })
    form.value.scrapList = scrapList;
    formRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        const res = await checkScrap(form.value).catch(() => {
          buttonLoading.value = false;
          return;
        });
        const boolean: boolean = res.data
        if (boolean) {
          const hVnode = h('p', null, [
            h('span', null, '提交本次报废后，排产单将设置为完成， '),
            // h('span', {style: 'color: red;font-weight: 600;'}, '且不可逆！'),
            h('span', null, '您确定要这样操作吗 '),
          ])
          await proxy?.$modal.confirm(hVnode).finally(() => {
            loading.value = false
            buttonLoading.value = false;
          });
        }
        const res2 = await checkScrapRemediation(form.value).catch(() => {
          buttonLoading.value = false;
          return;
        });
        const boolean2: boolean = res2.data
        if(boolean2){
          await proxy?.$modal.confirm("累计报废数>投料数，您需要补料（订单累计报废数量 > 订单实际投料数量 - 订单数量）").finally(() => {
            loading.value = false
            buttonLoading.value = false;
          });
        }

        await saveScrap(form.value).finally(() => buttonLoading.value = false);
        proxy?.$modal.msgSuccess("操作成功");
        // dialog.visible = false;
        // drawer.visible = false;
        await getList();
        await getScrapByProduction();
        scrapReasonList.value?.length && scrapReasonList.value.map((item: any) => {
          item.quantity = undefined
        })
      }
    });

  }

  /** 取消按钮 */
  const cancel = () => {
    currentNode.value = {};
    drawer.visible = false;
    getAuditList();
  }

  /** 取消按钮 */
  const cancelFeed = () => {
    feedDrawer.visible = false;
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  }

  const inRecordList = ref();

  let currentMiInfo = ref<any>({});
  //MI对应的Scheme
  let schemeList = ref<any>([]);
  //MI对应的Pnl
  let pnlList = ref<any>([]);
  //不同开料方案的投料率
  let schemeChargeRate = ref<Array<Number>>([]);
  //投料率(多投)
  const chargeRate = ref<number>(1);

  /*补投*/
  const addFeed = async (row: any) => {
    const checkRes = await checkFeed(row.productionVo.planId);
    if (checkRes.code != 200) {
      return;
    }
    feedDrawer.visible = true;
    dialogTableLoading.value = true
    const res = await getMiInfo(row.productionVo.planId);
    const data = res.data;
    currentMiInfo.value = data;
    form.value = row;
    form.value.saleOrderVoList = data.saleOrderVoList;
    form.value.isStart = '0';
    form.value.isMerge = '0';
    form.value.planStartTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    form.value.planCompleteTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

    schemeList.value = data.schemeBoList;
    pnlList.value = data.pnlBoList;
    schemeChargeRate.value = [];
    const schemeIdList: [] = schemeList.value.map(scheme => scheme.id);
    const commodityIdList: [] = form.value.saleOrderVoList?.map(order => order.commodityId);
    const saleOrderIdList: [] = form.value.saleOrderVoList?.map(order => order.id);
    const pnlIdList: [] = pnlList.value.map(pnl => pnl.id);
    const query = {
      planId: row.productionVo.planId,
      id: row.productionVo.id,
      schemeIdList: schemeIdList,
      saleOrderIdList: saleOrderIdList,
      commodityIdList: commodityIdList,
      pnlIdList: pnlIdList
    }
    const productionSchemeRes = await getDetails(query);
    const commodityInventoryList = productionSchemeRes.data.commodityInventoryList ?? [];
    const productionCommodityRelationVoList = productionSchemeRes.data.productionCommodityRelationVoList ?? [];
    const productionSchemeVoList = productionSchemeRes.data.productionSchemeVoList ?? [];
    const alreadyPnlFeedVoList = productionSchemeRes.data.alreadyPnlFeedVoList ?? [];
    const waitAuditCommodityList = productionSchemeRes.data.waitAuditCommodityList ?? [];
    const scrapMaps = productionSchemeRes.data.scrapMaps ?? {};
    form.value.saleOrderVoList = data.saleOrderVoList;
    form.value.saleOrderVoList.forEach(order => {
      order.scrapNum = scrapMaps[order.id];
      const resultCommodityItem = waitAuditCommodityList.find(item => item.saleOrderId == order.id && item.commodityId == order.commodityId);
      if (resultCommodityItem) {
        order.commodityRelationId = resultCommodityItem.id;
        order.useQuantity = resultCommodityItem.quantity;
      }
      if (new Date(order.dispatchTime) < new Date(form.value.planCompleteTime)) {
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
      scheme.alreadyFeedQuantity = alreadyFeedSum;
      //设置实投数量
      const realChargeCount = (scheme.preFeedQuantity - scheme.alreadyFeedQuantity).toFixed(2);
      //本次待审核scheme数据
      scheme.feedQuantity = 0;
      //分scheme设置投料利用率的默认值
      schemeChargeRate.value.push(100 + chargeRate.value);
      //处理Pnl
      const pnlArray: any[] = [];
      scheme.pnlCountList.forEach(pnlCount => {
        const pnl = pnlList.value.find(o => {
          return o.id == pnlCount.pnlId;
        });
        if (pnl) {
          let alreadyFeedQuantity = 0;
          alreadyPnlFeedVoList.forEach(pnlFeed => {
            if (scheme.id == pnlFeed.schemeId && pnl.id == pnlFeed.pnlId) {
              alreadyFeedQuantity += pnlFeed.feedQuantity;
            }
          })
          //本次待审核pnl数据
          pnlArray.push({
            pnl: pnl,
            count: pnlCount.pnlQuantity,
            feedQuantity: 0,
            preFeedQuantity: scheme.preFeedQuantity * pnlCount.pnlQuantity,
            alreadyFeedQuantity: alreadyFeedQuantity,
          });
        }

      });
      scheme.pnlList = pnlArray;
    });
    dialogTableLoading.value = false
  }

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
            total += (pnl.feedQuantity * set.quantity * set.saleOrderBo.unitedNumber);
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
      var chargeCount = Math.ceil(scheme.feedQuantity * item.count);
      item.feedQuantity = chargeCount;

      //因为pnl有取整，需要重新按pnl数来算大料的实际面积
      var tmp = 0;
      if (item.count && item.count > 0) {
        tmp = (chargeCount / item.count);
      }
      if (tmp > maxSchemeChargeCount) {
        maxSchemeChargeCount = tmp;
      }
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

  /*数据校验*/
  const checkData = (schemeList: any[]) => {
    let boolean: boolean = false;
    schemeList.forEach(scheme => {
      if (scheme.feedQuantity < scheme.uncheckedQuantity) {
        boolean = true;
        ElMessage.warning(scheme.name + "的当前投料数量(" + scheme.feedQuantity + ")小于上次投料数量(" + scheme.uncheckedQuantity + ")，请检查");
        return;
      }
      scheme.pnlList.forEach(pnl => {
        if (pnl.feedQuantity < pnl.uncheckedQuantity) {
          boolean = true;
          ElMessage.warning(scheme.name + "的" + pnl.pnl.name + "当前投料数量(" + pnl.feedQuantity + ")小于上次投料数量(" + pnl.uncheckedQuantity + ")，请检查");
        }
      })
    })
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
    return boolean;
  }

  /** 提交按钮 */
  const submitFeed = async (auditStatus: string) => {
    const boolean: boolean = checkData(schemeList.value);
    if (boolean) {
      return
    }
    //使用库存数据
    const productionCommodityRelationList = form.value.saleOrderVoList.filter(obj => obj.useQuantity > 0).map(obj => (
      {
        planId: currentMiInfo.value.id,
        id: form.value.isRemediation == 1 ? obj.commodityRelationId : undefined,
        saleOrderId: obj.id,
        commodityId: obj.commodityId,
        quantity: obj.useQuantity
      })
    )
    //开料数据
    const productionSchemeList = schemeList.value.map(obj => (
      {
        schemeId: obj.id,
        id: form.value.isRemediation == 1 ? obj.feedSchemeid : undefined,
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
          id: form.value.isRemediation == 1 ? pnl.pnlFeedId : undefined,
          feedQuantity: pnl.feedQuantity != null ? pnl.feedQuantity : 0
        })
      })
    })

    let checkFinish = await checkOrderFinish({
      ids: form.value.saleOrderVoList.map(vo => vo.id)
    }).catch(() => {
      buttonLoading.value = false
    });
    if(!checkFinish){
      buttonLoading.value = false;
      return;
    }

    const data = {
      id: form.value.isRemediation == 1 ? form.value.id : undefined,
      code: form.value.isRemediation == 1 ? form.value.code : undefined,
      area: productionArea.value,
      planStartTime: form.value.planStartTime,
      planCompleteTime: form.value.planCompleteTime,
      planId: currentMiInfo.value.id,
      isMerge: form.value.isMerge,
      isStart: form.value.isStart,
      isRemediation: '1',
      remediationProductionId: form.value.productionVo?.id ? form.value.productionVo?.id : undefined,
      productionCommodityRelationList: productionCommodityRelationList,
      productionSchemeList: productionSchemeList,
      productionPnlFeedList: productionPnlFeedList,
      auditStatus: auditStatus
    }
    buttonLoading.value = true;
    await saveProduction(data).finally(() => buttonLoading.value = false);
    buttonLoading.value = false;
    proxy?.$modal.msgSuccess("保存成功");
    feedDrawer.visible = false;
    await getList();
    await getFeedList();
  }

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

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('production/card/export', {
      ...queryParams.value
    }, `card_${new Date().getTime()}.xlsx`)
  }

  onMounted(() => {
    getList();
    getDictOptions();
    getScrapReason();
  });
</script>

<style lang="scss">
  .flex_column_display {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .drawer-flex-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .drawer-vxe-column {
      width: 100%;
      /*min-height: 200px;*/
    }

    .drawer-flex-content {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex: 1;
      overflow: hidden;

      .el-col {
        height: 100%;
      }

      .el-card {
        height: 100%;

        .el-card__body {
          height: 100%;
          overflow-y: auto;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  :deep(.scrap-flex-input-number) {
    flex: 1;
    text-align: left;

    .el-input__wrapper {
      padding-left: 7px;
      padding-right: 7px;

      .el-input__inner {
        text-align: left;
      }
    }
  }
</style>

<template>
  <div class="p-2 xtable-page">

    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" @tab-click="handleClick" class="xtable-tab" v-model="editableTabsValue">
        <el-tab-pane label="进行中" name="0">
          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <div class="totalTitle">流转卡数：{{sumDataLeft.cardNum}} &nbsp;&nbsp;|&nbsp;&nbsp;排产数量：{{sumDataLeft.productionNum}} &nbsp;&nbsp;|&nbsp;&nbsp;净面积：{{sumDataLeft.sumSetArea}}㎡</div>
            <el-button plain @click="handleExport">导出 </el-button>
          </div>
          <XTable toolId="productionProductionCardDoing" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  v-loading="loading"
                  :data="cardList"
                  :columnList="columnList"
                  border :showRefresh="true"
                  height="100%" class="xtable-content"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id', isCurrent:true }"
                  :intervalCondition="recordCondition"
          >
            <template #default-productionStatus="scope">
              <el-tag v-if="scope.row.isSuspend=='1'" type="danger">暂停</el-tag>
              <span type="primary" v-else>
                <el-tag v-if="scope.row.productionVo?.productionStatus=='10'">未开始</el-tag>
                <el-tag v-if="scope.row.productionVo?.productionStatus!='10'">进行中</el-tag>
              </span>
            </template>
            <!--            <template #default-bundleCode="scope">-->
            <!--              {{scope.row.bundleCount}}-{{scope.row.bundleCode}}-->
            <!--            </template>-->

            <!-- <template #default-currentNode="scope">
              {{scope.row.currentNode? scope.row.currentNode.craftName :
              scope.row.productionCardNodeVoList?.find(vo=>"1"==vo.sort)?.craftName}}
            </template> -->
            <!--            <template #default-pnlArea="scope">-->
            <!--              {{(scope.row.bundlePnlQuantity * scope.row.miProductionPlanPnlVo?.pnlWidth *-->
            <!--              scope.row.miProductionPlanPnlVo?.pnlLength / 1000000).toFixed(4)}}-->
            <!--            </template>-->
            <!-- <template #default-isOutDrill="scope">
              <div v-for="item in orderTypeList">
                <span>{{ item.value == scope.row.isOutDrill ? item.label : "" }}</span>
              </div>
            </template> -->
            <template #default-isRemediation="scope">
              <el-tag v-if="scope.row.isRemediation == '是'" type="danger">{{scope.row.isRemediation}}</el-tag>
              <el-tag v-else type="success">{{ scope.row.isRemediation}}</el-tag>
            </template>

            <template #default-productionVo.planType="scope">
              {{scope.row.productionVo.planType == '2'?'拼板':'单品'}}
            </template>
            <template #default-currentCraftName="scope">
              <span style="color: #5D7DB3;">{{scope.row.currentNode?.craftName||""}}</span>
            </template>
            <template #default-scrapRate="scope">
              {{(scope.row.scrapPcsQuantity / scope.row.bundlePcsQuantity *100).toFixed(2)}}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdate(scope.row)"
                         v-if="scope.row.productionVo?.productionStatus=='10'">调整
              </el-button>
              <el-button
                v-if="!scope.row.showStatus && checkPermi(['production:productionCard:Start'])" link
                type="primary"
                @click="startCard(scope.row)">开始
              </el-button>
              <el-popover v-if="scope.row.showStatus" @show="getNodeList(scope.row.id)" placement="left"
                          :show-after="300"
                          :popper-style="{maxHeight: '95%',overflowY:'auto',overflowX:'hidden',width: '300px'}">
                <div style="width:100%;" v-loading="detailLoading">
                  <el-timeline>
                    <el-timeline-item v-for="(node, index) in cardNodeList"
                                      :key="index"
                                      :color="node.color"
                                      type="primary"
                                      size="normal">
                      <div class="timeline-name"
                           style="display:flex;justify-content:space-between;align-items:center;width: 100%">
                        <div style="font-weight:bolder;">{{ node.craftName }}</div>
                        <div v-if="node.beginTime!=null">{{ node.stayTime}}</div>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <template #reference>
                  <el-button link
                             type="primary" @click="openDetails(scope.row)">生产详情
                  </el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="doCardPrint(scope.row, 'noOutsideImages')">打印</el-button>
              <el-button link type="primary" @click="doCardPrint(scope.row, 'outsideImages')">打印工艺图</el-button>
<!--              <el-button link type="primary" v-if="scope.row.productionVo && scope.row.productionVo.productionStatus!='30' && scope.row.isComplete != '1' && checkPermi(['production:productionCard:CompleteAllNode'])" @click="finishedAllNode(scope.row,true)">完成过数</el-button>-->
<!--              <el-button link type="primary" @click="finishedProduction(scope.row,true)" v-if="checkPermi(['production:productionCard:Completeproduction'])">完成排产</el-button>-->
<!--              <el-button link type="primary" v-if="scope.row.isSuspend == '1' && checkPermi(['production:productionCard:InvalidProduction'])" @click="invalidProduction(scope.row)">作废排产</el-button>-->
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="全部" name="1">
          <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
            <div class="totalTitle">流转卡数：{{sumDataRight.cardNum}}&nbsp;&nbsp;|&nbsp;&nbsp; 排产数量：{{sumDataRight.productionNum}}&nbsp;&nbsp;|&nbsp;&nbsp; 净面积：{{sumDataRight.sumSetArea}}㎡</div>
            <el-button plain @click="handleExport">导出 </el-button>
          </div>
          <XTable toolId="productionProductionCardFinish" v-model:page-size="queryFinishedParams.pageSize"
                  v-model:current-page="queryFinishedParams.pageNum"
                  v-loading="loading"
                  :page-params="{ perfect: true, total: finishedTotal }"
                  :data="cardFinishedList"
                  :columnList="columnFinfishedList"
                  border :showRefresh="true"
                  height="100%" class="xtable-content"
                  @searchChange="searchFinishedChange"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
                  :intervalCondition="recordCondition"
          >

            <!--            <template #default-pnlArea="scope">-->
            <!--              {{(scope.row.bundlePnlQuantity * scope.row.miProductionPlanPnlVo?.pnlWidth *-->
            <!--              scope.row.miProductionPlanPnlVo?.pnlLength / 1000000).toFixed(4)}}-->
            <!--            </template>-->
            <template #default-isRemediation="scope">
              <el-tag v-if="scope.row.isRemediation == '是'" type="danger">{{scope.row.isRemediation}}</el-tag>
              <el-tag v-else type="success">{{ scope.row.isRemediation}}</el-tag>
            </template>
            <!--            <template #default-isComplete="scope">-->
            <!--              <el-tag v-if="scope.row.isComplete=='0'">进行中</el-tag>-->
            <!--              <el-tag v-if="scope.row.isComplete=='1'" type="success">已完成</el-tag>-->
            <!--            </template>-->
            <template #default-scrapRate="scope">
              {{(scope.row.scrapPcsQuantity / scope.row.bundlePcsQuantity *100).toFixed(2)}}
            </template>
            <!--            <template #default-bundleCode="scope">-->
            <!--              {{scope.row.bundleCount}}-{{scope.row.bundleCode}}-->
            <!--            </template>-->
            <template #default-productionVo.planType="scope">
              {{scope.row.productionVo.planType == '2'?'拼板':'单品'}}
            </template>
            <template #default-make="scope">
              <!-- <el-button
                v-if="scope.row.showStatus" link
                type="primary" @click="openDetails(scope.row)">生产详情
              </el-button> -->
              <el-button link type="primary" @click="handleUpdate(scope.row)"
                         v-if="scope.row.productionVo?.productionStatus=='10'">调整
              </el-button>
              <el-button
                v-if="!scope.row.showStatus && checkPermi(['production:productionCard:Start'])" link
                type="primary"
                @click="startCard(scope.row)">开始
              </el-button>
              <el-popover v-if="scope.row.showStatus" @show="getNodeList(scope.row.id)" placement="left"
                          :show-after="300"
                          :popper-style="{maxHeight: '95%',overflowY:'auto',overflowX:'hidden',width: '300px'}">
                <div style="width:100%;" v-loading="detailLoading">
                  <el-timeline>
                    <el-timeline-item v-for="(node, index) in cardNodeList"
                                      :key="index"
                                      :color="node.color"
                                      type="primary"
                                      size="normal">
                      <div class="timeline-name"
                           style="display:flex;justify-content:space-between;align-items:center;width: 100%">
                        <div style="font-weight:bolder;">{{ node.craftName }}</div>
                        <div v-if="node.beginTime!=null">{{ node.stayTime }}</div>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <template #reference>

                  <el-button link
                             type="primary" @click="openDetails(scope.row)">生产详情
                  </el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="doCardPrint(scope.row, 'noOutsideImages')">打印</el-button>
              <el-button link type="primary" @click="doCardPrint(scope.row, 'outsideImages')">打印工艺图</el-button>
<!--              <el-button link type="primary" v-if="scope.row.productionVo && scope.row.productionVo.productionStatus!='30' && scope.row.isComplete != '1' && checkPermi(['production:productionCard:Completeproduction'])" @click="finishedProduction(scope.row,true)">完成排产</el-button>-->
<!--              <el-button link type="primary" v-if="scope.row.isSuspend == '1' && checkPermi(['production:productionCard:InvalidProduction'])" @click="invalidProduction(scope.row)">作废排产</el-button>-->
<!--              <el-button v-if="scope.row.isHandFinish == '1' && checkPermi(['production:productionCard:Completeproduction'])" link type="primary" @click="finishedProduction(scope.row,false)">取消手动完成排产</el-button>-->

            </template>
            <template #default-productionVo.isOutDrill="scope">
              <div v-for="item in orderTypeList">
                <span>{{ item.value == scope.row.productionVo.isOutDrill ? item.label : "" }}</span>
              </div>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 调整时间对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="cardFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="排产单号：">
          <div>{{form.code}}</div>
        </el-form-item>
        <el-form-item label="开始时间：" prop="planStartTime">
          <el-date-picker v-model="form.planStartTime" style="width: 100%;" :disabled-date="disabledDateStart"
                          type="datetime" placeholder="选择日期时间"
                          value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"/>
        </el-form-item>
        <el-form-item label="结束时间：" prop="planCompleteTime">
          <el-date-picker v-model="form.planCompleteTime" style="width: 100%;" :disabled-date="disabledDate"
                          type="datetime" placeholder="选择日期时间"
                          value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!--生产详情-->
    <el-drawer :size="drawerWidth" v-model="drawer.visible" :show-close="true" :lock-scroll="false"
               :close-on-click-modal="false" :destroy-on-close="true" @close="closeDrawer">
      <template #header="{ close, titleId, titleClass }">
        <!-- <div v-if="checkPermi(['production:productionCard:count'])">
          <el-dropdown trigger="click" style="float:left" @command="handleCommand" v-if="currentInfo?.isComplete=='0'">
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon> -->
<!--            <template #dropdown>-->
<!--              <el-dropdown-menu>-->
<!--                <el-dropdown-item v-if="currentInfo?.isSuspend=='0'" command="1" >生产暂停</el-dropdown-item>-->
<!--                <el-dropdown-item v-if="currentInfo?.isSuspend=='1'" command="0">生产恢复</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </template>-->
          <!-- </el-dropdown>
        </div> -->
        <div class="text-center">{{currentInfo?.code+'-生产详情'}}</div>
      </template>
      <el-row style="height: 100%;">
        <el-col :span="showDetail?12:24" style="height: 100%">
          <el-form label-width="auto"
                   style="text-align: left;" class="flex_column_display">
            <el-form-item label="产品名称"
                          show-overflow-tooltip>
              <div class="change-row">{{currentInfo.commodityName}}</div>
            </el-form-item>
            <el-form-item label="产品编码">
              {{currentInfo.commodityCode}}
            </el-form-item>
            <el-form-item label="开始时间">
              <span v-if="currentInfo.productionVo.startTime!=null">{{currentInfo.productionVo.startTime}}</span>
              <span v-else>暂未开始</span>
            </el-form-item>
            <el-form-item label="预计完成时间">
              {{currentInfo.productionVo.planCompleteTime}}
            </el-form-item>

            <div >
              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo.productionStatus==='进行中'&&currentInfo.productionVo && currentInfo.productionVo.productionStatus!='30' && currentInfo.isComplete != '1' && checkPermi(['production:productionCard:CompleteAllNode'])" @click="finishedAllNode(currentInfo,true)">完成过数</el-button>
              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo?.productionVo?.isComplete=='0' && currentInfo.productionStatus==='进行中'&& checkPermi(['production:productionCard:Completeproduction'])" @click="finishedProduction(currentInfo,true)" >完成排产</el-button>
              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo.isHandFinish == '1' && checkPermi(['production:productionCard:Completeproduction'])" @click="finishedProduction(currentInfo,false)">取消手动完成排产</el-button>
              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="(currentInfo.isSuspend == '1'&&currentInfo?.productionVo?.isComplete!='1') && checkPermi(['production:productionCard:InvalidProduction'])" @click="invalidProduction(currentInfo)">作废排产</el-button>
              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo?.productionVo?.isComplete!='1' && currentInfo?.isSuspend=='0' && checkPermi(['production:productionCard:stop'])" @click="handleCommand('1')" >生产暂停</el-button>
              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo?.productionVo?.isComplete!='1' && currentInfo?.isSuspend=='1'&& checkPermi(['production:productionCard:stop'])" @click="handleCommand('0')">生产恢复</el-button>
<!--              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo?.parentId == null && checkPermi(['production:productionCard:split'])" @click="handleSplitCard()" >拆卡</el-button>-->
<!--              <el-button link type="primary" style="margin: 0 20px 10px 0;"  v-if="currentInfo?.parentId != null && checkPermi(['production:productionCard:merge'])" @click="handleMergeCard()" >合卡</el-button>-->
            </div>

            <el-form-item>
              <template #label>
                <span v-if="currentInfo.isSuspend=='0'" style="color:rgb(11, 189, 135)">进行中</span>
                <span v-if="currentInfo.isSuspend=='1'" style="color: #f56c6c">暂停</span>
              </template>
              <div style="display:flex;width: 100%">
                <span style="min-width:65px">完工情况</span>
                <el-progress style="width: 100%"
                             :height="10"
                             :percentage="rate"
                             status="success"
                             :stroke-width="15"
                             :text-inside="true">
                </el-progress>
              </div>
            </el-form-item>
            <div style="height: 100%;overflow-y: auto;">
              <el-timeline>
                <el-timeline-item v-for="(node, index) in cardNodeList"
                                  :key="index"
                                  :color="node.color"
                                  type="primary"
                                  size="normal"
                                  @click.native="getCraftDetails(node)">
                  <el-card class="card-padding">
                    <div class="timeline-name"
                         style="display:flex;justify-content:space-between;align-content:center;width: 100%">
                      <div style="height:28px;line-height:28px;font-weight:bolder;">{{ node?.craftName }}</div>
                      <div v-if="node?.isCount=='1'" class="global-flex flex-center">
                        <div v-if="checkPermi(['production:productionCard:countBack'])">
                          <el-button v-if="node?.finishTime!=null &&node?.isCount=='1' && currentInfo.isComplete =='0' && node?.countUnit == '3'" type="primary" link
                                     @click.stop="onCountBackBtnClick(node)">过数回退
                          </el-button>
                        </div>
                        <div v-if="checkPermi(['production:productionCard:count'])">
                          <el-button v-if="index == 0 && node?.beginTime == null && node?.finishTime ==null && currentInfo.isComplete =='0'"
                                     type="primary" link
                                     @click.stop="firstCountClick(node)">首节点接单
                          </el-button>
                        </div>
                        <div v-if="checkPermi(['production:productionCard:count'])">
                          <el-button v-if="showCount(node,index)" type="primary"
                                     link
                                     @click.stop="onCountToBtnClick(node)">过数
                          </el-button>
                        </div>
                      </div>
                      <div v-else>自动过数</div>
                    </div>
                    <p class="timeline-time" v-if="node?.beginTime!=null">开始时间：{{ node?.beginTime}}</p>
                    <p class="timeline-time" v-else>开始时间：暂未开始</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-form>
        </el-col>
        <el-col :span="12" v-if="showDetail" style="padding-left: 5px;">
          <div class="ml-5">
            <div class="divBorder">{{currentNode?.craftName}} 工序详情</div>
          </div>
          <el-row style="text-align:left;" :gutter="5" class="words">
            <el-divider content-position="left">操作详情</el-divider>
            <el-table :data="optionList" style="width: 100%">
              <el-table-column prop="name" label="操作人" width="80"/>
              <el-table-column prop="type" label="操作类型" width="80"/>
              <el-table-column prop="quantity" label="操作数量" width="100"/>
              <el-table-column prop="time" :show-overflow-tooltip="true"  label="操作时间"/>
            </el-table>
            <el-divider content-position="left">报废记录</el-divider>
            <el-table :data="scrapList" style="width: 100%">
              <el-table-column prop="responsible" label="责任人" width="120">
                <template #default="scope">
                  <span v-if="scope.row.type=='1'">{{scope.row.responsibleUserName}}</span>
                  <span v-if="scope.row.type=='2'">{{scope.row.supplierName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="报废对象" width="120">
                <template #default="scope">
                  {{currentInfo.saleOrderVoList.find(v=>v.id == scope.row.saleOrderId)?.commodityCode}}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="报废时间" width="150"/>
              <el-table-column prop="reasonId" label="报废原因" width="100">
                <template #default="scope">
                  {{scrapReasonList.find(v=>v.id ==scope.row.reasonId)?.discardReason}}
                </template>

              </el-table-column>
              <el-table-column prop="quantity" label="报废数量" width="100"/>
              <el-table-column prop="unit" label="报废单位" width="100">
                <template #default="scope">
                  {{unitOption.find(v => v.value == scope.row.unit)?.label}}
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-col>
      </el-row>
    </el-drawer>

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


    <cardPrint ref="cardPrintRef" v-if="printFlag"></cardPrint>

    <el-dialog
      v-model="countVisible"
      :title="'请选择 ' + currentInfo?.code +' 需要过数的产品和数量'"
      width="50%"
      align-center
      destroy-on-close
      @close="handleDialogClose"
    >
      <el-form ref="countFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品：" prop="saleOrderId">
          <el-radio-group v-model="form.saleOrderId">
            <el-radio v-for="item in currentInfo.saleOrderVoList" :label="item.id" size="small" border>
              {{item.commodityCode}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量：" prop="countQuantity">
          <el-input type="number" v-model.number="form.countQuantity" style="width: 200px" >
            <template #append>{{currentUnit == '2' ? 'set' : currentUnit == '1' ? 'pcs' : 'pnl'}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="countVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCount">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="splitVisible"
      :title="'产品 ' + currentInfo?.commodityCode +' 拆单'"
      width="30%"
      align-center
      destroy-on-close
      @close="handleDialogClose"
    >
      <el-form ref="splitFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="拆卡数量：" prop="quantity">
          <el-input-number :controls="false"  v-model="form.quantity" step-strictly />
           <span class="pl-2">PNL</span>
        </el-form-item>
        <el-form-item label="拆卡备注：">
          <el-input type="textarea" rows="3" v-model="form.remark"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="splitVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSplit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup name="ProductionCard" lang="ts">
  import {
    listCard,
    getCard,
    delCard,
    addCard,
    updateCard,
    getPrintOrder,
    getCardSum,
    stopProduction,
    restartProduction,
    deleteProduction,
    splitCard,
    mergeCard
  } from '@/api/production/card';
  import {CardVO, CardQuery, CardForm} from '@/api/production/card/types';
  import {VxeTableEvents} from 'vxe-table'
  import {
    listCardNode,
    saveCardNode,
    returnCardNode,
    startCardNode,
    updateProduction, updateAllNode, getPercentateValue
  } from "@/api/production/production";
  import {checkPermi} from "@/utils/permission";
  import {deepClone} from "@/utils";
  import {updateOrder} from "@/api/order/directOrder";
  import {getScrapListByCard} from "@/api/production/scrap";
  import {ref} from "vue";
  import {getListDiscardReason} from "@/api/basedata/discardReason";
  import dayjs from 'dayjs';
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {savePrediction} from "@/api/project/productionPlan";
  import { log } from 'console';
  import {getSumSet} from "@/api/project/assignTask";
  import {getCraftsInProduction} from "@/api/production/cardNode";
  import { Decimal } from 'decimal.js'

  const exportVisible = ref(false);
  const countVisible = ref(false);
  const splitVisible = ref(false);
  const printFlag = ref(false);


  const sumDataLeft =ref({
    cardNum:0,
    productionNum:0,
    sumSetArea:0
  })

  const sumDataRight =ref({
    cardNum:0,
    productionNum:0,
    sumSetArea:0
  })
  const cardPrintRef = ref();


  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const cardList = ref<CardVO[]>([]);
  const cardFinishedList = ref<CardVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const finishedTotal = ref(0);

  const queryFormRef = ref<ElFormInstance>();
  const cardFormRef = ref<ElFormInstance>();
  const countFormRef = ref<ElFormInstance>();
  const splitFormRef = ref<ElFormInstance>();

  const unitOption = ref([
    {label: "pcs", value: "1"},
    {label: "set", value: "2"},
    {label: "pnl", value: "3"},
  ])

  const startPrint = ref(false)
  const currentPdfList = ref<string[]>([])

  const disabledDateStart = (time) => {
    if (form.value.planCompleteTime) {
      return new Date(time).getTime() > new Date(form.value.planCompleteTime).getTime()
    }
  }

  const disabledDate = (time) => {
    return new Date(time).getTime() < new Date(form.value.planStartTime).getTime()
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const drawer = reactive<DrawerOption>({
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
  let initQueryParams = {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "code",
    isComplete: '0',
  }

  let initHistoryQueryParams = {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "code",
  }

  const data = reactive<PageData<CardForm, CardQuery>>({
    form: {...initFormData},
    queryParams: {
      ...initQueryParams
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      productionId: [
        {required: true, message: "排产单ID不能为空", trigger: "blur"}
      ],
      ownerId: [
        {required: true, message: "单位ID不能为空", trigger: "blur"}
      ],
      bundleCode: [
        {required: true, message: "扎号不能为空", trigger: "blur"}
      ],
      bundleCount: [
        {required: true, message: "排产总扎数不能为空", trigger: "blur"}
      ],
      parentId: [
        {required: true, message: "父卡ID不能为空", trigger: "blur"}
      ],
      code: [
        {required: true, message: "流转卡卡号不能为空", trigger: "blur"}
      ],
      bundlePnlQuantity: [
        {required: true, message: "本卡PNL数量不能为空", trigger: "blur"}
      ],
      quantityPerCard: [
        {required: true, message: "每张卡配置的PNL数量不能为空", trigger: "blur"}
      ],
      pnlId: [
        {required: true, message: "工艺pnlId不能为空", trigger: "blur"}
      ],
      saleOrderId: [
        {required: true, message: "产品不能为空", trigger: "blur"}
      ],
      countQuantity: [
        // {required: true, message: "过数数量不能为空", trigger: "blur"},
        {
          required:true,
          validator: (rule, value, callback) => {
            const reg = /^[1-9]\d*$/;
            if (!reg.test(Number(value))) {
              callback(new Error('请输入大于0的整数'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      quantity: [
        {required: true, message: "拆卡数量不能为空", trigger: "blur"}
      ]
    }
  });


  /**
   * 获取字典数据
   */

  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_urgent,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_plate_brand,order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type";
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


  let resDictData = ref({
    //加急
    order_urgent: [],
    //订单类型
    order_type: [],
    //批量/样品
    order_model: [],
    //板材
    order_material_quality: [],
    //成品板厚
    finish_plate_thickness: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //表面处理
    order_surface_treatment: [],
    //阻焊颜色
    order_commodity_solder: [],
    //字符颜色
    order_character: [],
    //币种
    currency_type: [],
    //包装要求
    order_packaging_requirements: [],
    //付款方式
    payment_method: [],
    //运输方式
    shipping_type: [],
    //板材品牌
    order_plate_brand: [],
    //板材级别
    order_material_level: [],
    //阻焊面数
    order_commodity_solder_count: [],
    //阻焊光泽
    order_commodity_solder_gloss: [],
    //字符面数
    order_character_count: [],
    //成型方式
    order_commodity_form: [],
    //测试方式
    order_commodity_testway: [],
    //过孔要求
    order_hole_requirement: [],
    //检验标准
    order_inspection_standard: [],
    //产品类型
    sys_commodity_type: [],
    //流程状态
    order_flow_status: [],
    //测试架
    order_test_frame: [],
  })

  const queryFinishedParams = ref({
    ...initHistoryQueryParams
  });
  const orderTypeList = ref([
    {label: '本厂钻孔', value: "0"},
    {label: '外厂钻孔', value: "1"},
  ]);

  const remediation = ref([
    {label: '否', value: "0"},
    {label: '是', value: "1"},
  ]);

  const statusOptions = ref([
    { value: "40", label: "暂停" },
    { value: "10", label: "未开始" },
    { value: "20", label: "进行中" },
  ])

  const completeOptions = ref([
    { value: "0", label: "进行中" },
    { value: "1", label: "已完成" },
  ])

  const planTypeOptions = ref([
    { value: "1", label: "单品" },
    { value: "2", label: "拼板" },
  ])

  const craftOptions = ref([
    {value:"5868",label:"开料"},
    {value:"5870",label:"压合"},
    {value:"5869",label:"外层钻孔"},
    {value:"5887",label:"导电膜"},
    {value:"6053",label:"沉铜"},
    {value:"6042",label:"除胶渣沉铜"},
    {value:"5888",label:"外层线路"},
    {value:"5889",label:"图形电镀"},
    {value:"7090",label:"蚀刻前一锣"},
    {value:"5891",label:"退膜/蚀刻"},
    {value:"6052",label:"蚀检QC"},
    {value:"5893",label:"阻焊"},
    {value:"6026",label:"阻焊QC"},
    {value:"5894",label:"丝印字符"},
    {value:"5896",label:"表面处理"},
    {value:"5897",label:"成形"},
    {value:"6030",label:"测试"},
    {value:"5900",label:"FQC"},
    {value:"3559",label:"包装"},
  ])

  const getCrafts = async ()=>{
    const res = await getCraftsInProduction();
    const craftList = res.data.map(item => {
      return {value: item.id,label:item.craftName}
    })
    craftOptions.value = craftList;
  }

  const recordCondition = ['startTime', 'planStartTime', 'planCompleteTime','createTime'];
  const columnList = ref([
    {title: "序号", type: 'seq',field:'index', fixed: "left", align: 'center', width: '60'},
    {
      width: "120",
      title: '产品编码',
      fixed: "left",
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    {
      title: '状态',
      field: 'productionStatus',
      width: '80',
      fixed: "left",
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择状态',
      },
      filterData: () => statusOptions.value,
      filterCustom: {label: 'label', value: 'value'}

    },
    {
      title: '钻孔类型',
      field: 'isOutDrill',
      width: '80',
      fixed: "left",
      align: 'center',
      filterType: 'radioButton',
      filterData: () => orderTypeList.value
    },
    {
      title: '是否补料',
      field: 'isRemediation',
      width: '80',
      fixed: "left",
      align: 'center',
      filterType: 'radioButton',
      filterData: () => remediation.value
    },
    {
      title: '排产单号',
      field: 'productionCode',
      width: '100',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单'}
    },
    {
      title: '流转卡号',
      field: 'code',
      width: '120',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入流转卡号'}
    },
    {
      title: '板厚',
      field: 'boardThickness',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板厚'}
    },
    {
      title: '表面处理',
      field: 'surfaceTreatment',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入表面处理'}
    },
    {
      title: '阻焊颜色',
      field: 'solderCs',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊颜色'}
    },
    {
      title: '测试方式',
      field: 'testWay',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试方式'}
    },
    {
      title: '扎号',
      field: 'bundleCode',
      width: '100',
      align: 'center',
      filterType: 'input',
    },
    {
      title: '总扎数',
      field: 'bundleCount',
      width: '100',
      align: 'center',
    },
    {
      title: '当前节点',
      field: 'currentCraftName',
      width: '100',
      align: 'center',
      filterType: 'selectMultiple',
      filterParam: {
        placeholder: '请选择当前节点',
        filterable:true,
        filterable:true,
        collapseTags: true,
        collapseTagsTooltip: true,
      },
      filterData: () => craftOptions.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入'}
    },
    // {
    //   width: "120",
    //   title: '排产时间',
    //   field: 'productionVo.startTime',
    //   align: 'center',
    //   filterType: 'intervalDate', filterParam: {
    //     startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    //     endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    //   }
    // },
    // {
    //   title: '当前工序',
    //   field: 'currentNode',
    //   width: '100',
    //   align: 'center',
    // },
    {
      title: '生产面积',
      field: 'setArea',
      width: '100',
      align: 'center',
    },
    {
      title: '排产总数',
      field: 'bundlePcsQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: '完成数量',
      field: 'inInventoryQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: '报废率(%)',
      field: 'scrapRate',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL名称',
      field: 'miProductionPlanPnlName',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL数量',
      field: 'bundlePnlQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: 'SET数量',
      field: 'bundleSetQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: 'PCS数量',
      field: 'pcsQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL长',
      // field: 'miProductionPlanPnlVo.pnlLength',
      field: 'pnlLength',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL宽',
      // field: 'miProductionPlanPnlVo.pnlWidth',
      field: 'pnlWidth',
      width: '100',
      align: 'center',
    },
    {
      title: 'MI单号',
      field: 'micode',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI单号'}
    },
    {
      title: 'MI类型',
      field: 'planType',
      width: '100',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择MI类型',
      },
      filterData: () => planTypeOptions.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      title: '客户编码',
      field: 'customerCode',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {
      title: '板材',
      field: 'materialQuality',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材'},

    },
    {
      width: "120",
      title: '预计开始时间',
      // field: 'productionVo.planStartTime',
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
      // field: 'productionVo.planCompleteTime',
      field: 'planCompleteTime',
      align: 'center',
      filterType: 'intervalDate', filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '实际开始时间',
      // field: 'productionVo.startTime',
      field: 'startTime',
      align: 'center',
    },
    {
      width: "120",
      title: '实际完成时间',
      // field: 'productionVo.completeTime',
      field: 'completeTime',
      align: 'center',
    },
    {
      width: "120",
      title: '创建时间',
      field: 'createTime',
      align: 'center',
    },
    {title: '操作', field: 'make', showOverflow: false, align: 'center', width: '320', fixed: 'right',},
  ]);
  const columnFinfishedList = ref([
    {title: "序号", type: 'seq', fixed: "left",field:'index', align: 'center', width: '60'},
    {
      width: "120",
      title: '产品编码',
      field: 'commodityCode',
      fixed: 'left',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    // {
    //   title: '状态',
    //   field: 'isComplete',
    //   width: '80',
    //   fixed: "left",
    //   align: 'center',
    //   filterType: 'radioButton',
    //   filterParam: {
    //     placeholder: '请选择状态',
    //   },
    //   filterData: () => completeOptions.value,
    //   filterCustom: {label: 'label', value: 'value'}
    //
    // },
    {
      title: '是否补料',
      field: 'isRemediation',
      width: '80',
      fixed: "left",
      align: 'center',
      filterType: 'radioButton',
      filterData: () => remediation.value
    },
    {
      title: '排产单号',
      // field: 'productionVo.code',
      field: 'productionCode',
      width: '100',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入排产单号'}
    },

    {
      title: '流转卡号',
      field: 'code',
      width: '120',
      fixed: "left",
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入流转卡号'}
    },
    {
      title: '板厚',
      field: 'boardThickness',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板厚'}
    },
    {
      title: '表面处理',
      field: 'surfaceTreatment',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入表面处理'}

    },
    {
      title: '阻焊颜色',
      field: 'solderCs',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊颜色'}
    },
    {
      title: '测试方式',
      field: 'testWay',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试方式'}
    },
    {
      title: '扎号',
      field: 'bundleCode',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入扎号'}
    },
    {
      title: '总扎数',
      field: 'bundleCount',
      width: '100',
      align: 'center',
    },
    {
      width: "120",
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    // {
    //   width: "120",
    //   title: '排产时间',
    //   field: 'productionVo.startTime',
    //   align: 'center',
    //   filterType: 'intervalDate',  filterParam: {
    //   startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    //   endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    // }
    // },
    // {
    //   title: '当前工序',
    //   field: 'currentNode',
    //   width: '100',
    //   align: 'center',
    // },
    {
      title: '生产面积',
      field: 'setArea',
      width: '100',
      align: 'center',
    },
    {
      title: '排产总数',
      field: 'bundlePcsQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: '完成数量',
      field: 'inInventoryQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: '报废率(%)',
      field: 'scrapRate',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL名称',
      // field: 'miProductionPlanPnlVo.name',
      field: 'miProductionPlanPnlName',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL数量',
      field: 'bundlePnlQuantity',
      width: '100',
      align: 'center',
    },
     {
      title: 'SET数量',
      field: 'bundleSetQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: 'PCS数量',
      field: 'pcsQuantity',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL长',
      // field: 'miProductionPlanPnlVo.pnlLength',
      field: 'pnlLength',
      width: '100',
      align: 'center',
    },
    {
      title: 'PNL宽',
      // field: 'miProductionPlanPnlVo.pnlWidth',
      field: 'pnlWidth',
      width: '100',
      align: 'center',
    },
    {
      title: 'MI单号',
      // field: 'productionVo.micode',
      field: 'micode',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入MI单号'}
    },
    {
      title: 'MI类型',
      // field: 'productionVo.planType',
      field: 'planType',
      width: '100',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择MI类型',
      },
      filterData: () => planTypeOptions.value,
      filterCustom: {label: 'label', value: 'value'}
    },
    {
      title: '客户编码',
      field: 'customerCode',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {
      title: '板材',
      field: 'materialQuality',
      width: '100',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材'},

    },
    {
      width: "120",
      title: '预计开始时间',
      // field: 'productionVo.planStartTime',
      field: 'planStartTime',
      align: 'center',
      filterType: 'intervalDate',  filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '预计完成时间',
      // field: 'productionVo.planCompleteTime',
      field: 'planCompleteTime',
      align: 'center',
      filterType: 'intervalDate',  filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {
      width: "120",
      title: '实际开始时间',
      // field: 'productionVo.startTime',
      field: 'startTime',
      align: 'center',
    },
    {
      width: "120",
      title: '实际完成时间',
      // field: 'productionVo.completeTime',
      field: 'completeTime',
      align: 'center',
    },
    {
      width: "120",
      title: '创建时间',
      field: 'createTime',
      align: 'center',
      filterType: 'intervalDate',  filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '操作', field: 'make', showOverflow: false, align: 'center', width: '340', fixed: 'right',},
  ]);

  const {queryParams, form, rules} = toRefs(data);

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = deepClone(initQueryParams);
    Object.keys(params).forEach(key => {
      if (key == 'productionVo.code') {
        //排产单号
        queryParams.value['productionCode'] = params[key];
      } else  if (key == 'currentCraftName'){
        queryParams.value['craftIdList'] = params[key];
      } else {
        if (key.includes(".")) {
          const queryParamsKey = key.substring(key.indexOf(".") + 1);
          queryParams.value[queryParamsKey] = params[key];
        } else {
          if (params[key] !== null && params[key] !== undefined) {
            queryParams.value[key] = params[key];
          }
        }
      }
    });

    // Object.keys(params).forEach(key => {
    //   if (params[key] !== null && params[key] !== undefined) {
    //     queryParams.value[key] = params[key];
    //     if (key == "productionVo.isOutDrill") {
    //       queryParams.value.isOutDrill = params[key];
    //     }
    //   }
    // });
    getList()
  }

  const searchFinishedChange = (params: any) => {
    queryFinishedParams.value = deepClone(initHistoryQueryParams);
    console.log("123",params)
    Object.keys(params).forEach(key => {
      if (key.includes(".")) {
        const queryParamsKey = key.substring(key.indexOf(".") + 1);
        queryFinishedParams.value[queryParamsKey] = params[key];
      } else {
        if (params[key] !== null && params[key] !== undefined) {
          queryFinishedParams.value[key] = params[key];
        }
      }
    });
    // Object.keys(params).forEach(key => {
    //   if (params[key] !== null && params[key] !== undefined) {
    //     queryFinishedParams.value[key] = params[key];
    //   }
    // });
    getFinishedList()
  }

  let type = ref(0);

  const handleClick = (pane: any, ev: any) => {
    console.log(pane.index)
    type.value = pane.index
    if (pane.index == 0) {
      queryParams.value.isComplete = '0';
      getList();
    } else {
      // queryFinishedParams.value.isComplete = '1';
      getFinishedList();
    }
  }

  /** 查询进行中流转卡列表 */
  const getList = async () => {
    loading.value = true;
    const res = await listCard(queryParams.value);
    cardList.value = res.rows;
    dealData(cardList.value);
    total.value = res.total;
    loading.value = false;

    const resSum = await  getCardSum(queryParams.value);
    sumDataLeft.value = resSum.data;
  }

  /** 查询已完成流转卡列表 */
  const getFinishedList = async () => {
    loading.value = true;
    const res = await listCard(queryFinishedParams.value);
    cardFinishedList.value = res.rows;
    dealData(cardFinishedList.value);
    finishedTotal.value = res.total;
    loading.value = false;
    const resSum = await  getCardSum(queryFinishedParams.value);
    sumDataRight.value = resSum.data;
  }

  const dealData = async (rows: any[]) => {
    rows.forEach(item => {
      if (item.saleOrderVoList && item.saleOrderVoList.length > 0) {
        item.commodityCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.commodityCode
        }).join("-") : item.saleOrderVoList[0].commodityCode;
        item.commodityName = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.commodityName
        }).join("/") : item.saleOrderVoList[0].commodityName;
        // item.commodityThickness = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        //   return x.commodityThickness
        // }).join("/") : item.saleOrderVoList[0].commodityThickness;
        // item.surfaceTreatment = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        //   return x.surfaceTreatment
        // }).join("/") : item.saleOrderVoList[0].surfaceTreatment;
        // item.commoditySolder = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
        //   return x.commoditySolder,
        // }).join("/") : item.saleOrderVoList[0].commoditySolder;

        item.customerCode = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.customerCode
        }).join("/") : item.saleOrderVoList[0].customerCode;

        item.materialQuality = item.saleOrderVoList.length > 1 ? item.saleOrderVoList.map(x => {
          return x.materialQuality
        }).join("/") : item.saleOrderVoList[0].materialQuality;

        item.showStatus = (item?.productionVo?.startTime != null ||  item?.productionVo?.isComplete != '0')? true : false
      }
    })
  }

  /** 取消按钮 */
  const cancel = () => {
    reset();
    dialog.visible = false;
  }

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    cardFormRef.value?.resetFields();
    countFormRef.value?.resetFields();
    splitFormRef.value?.resetFields();
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
  const handleSelectionChange = (selection: CardVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    dialog.visible = true;
    dialog.title = "添加流转卡";
  }

  /** 修改按钮操作 */
  const handleUpdate = async (row?: any) => {
    reset();
    // const _id = row?.id || ids.value[0]
    // const res = await getCard(_id);
    // Object.assign(form.value, res.data);
    Object.assign(form.value, row.productionVo);
    dialog.visible = true;
    dialog.title = "调整流转卡";
  }

  let currentInfo = ref();

  let oldInfo = ref();

  const cardNodeList = ref([]);

  const rate = ref(0);

  const detailLoading = ref(false)
  /*生产详情*/
  const openDetails = async (row?: any) => {
    oldInfo = deepClone(row);
    currentInfo.value = row;
    getNodeList(row.id);
    const res = await getPercentateValue(currentInfo.value.id)
    rate.value =Number(new Decimal(res.data.percentate.toFixed(4)).mul(new Decimal(100)).toFixed(4));
    console.log(rate.value)
    console.log(currentInfo.value)
    drawer.visible = true;
  }

  const invalidProduction = async (row:any) => {
    const hVnode = h('p', null, [
      h('span', null, '您确定要报废排产单号:' + row.productionCode + '吗 '),
      h('span', {style: 'color: red;font-weight: 600;'}, '该行为不可逆！请谨慎操作'),
    ])
    await proxy?.$modal.confirm(hVnode).finally(() => {

    });
    console.log(1111111)
    const res = await deleteProduction({id:row.productionId})
    if(res.code == 200){
      proxy?.$modal.msgSuccess("操作成功");
      drawer.visible = false;
      type.value == 0 ? getList() : getFinishedList();
    }
  }

  /*完成排产*/
  const finishedProduction = async (row: any,isFinish: Boolean) => {
    ElMessageBox.confirm(
      '确定将排产单 ' + row.productionVo.code + (isFinish ? ' 标记为已完成？请谨慎操作' : '标记为进行中?'),
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      const data = deepClone(row.productionVo);
      data.isFinish = isFinish;
      loading.value = true;
      updateProduction(data).then(res => {
        ElMessage.success("操作成功");
        loading.value = false;
        type.value == 0 ? getList() : getFinishedList();
        cancel();
        drawer.visible = false;
      });

    }).finally(() => {
      loading.value = false;
    })
  }

  /*完成过数*/
  const finishedAllNode = async (row: any,isFinish: Boolean) => {
    ElMessageBox.confirm(
      '确定将流转卡 ' + row.code + (isFinish ? ' 所有工序全部接单？' : '标记为进行中?'),
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      loading.value = true;
      updateAllNode(row.id).then(res => {
        ElMessage.success("操作成功");
        type.value == 0 ? getList() : getFinishedList();
        cancel();
        drawer.visible = false;
      });

    }).finally(() => {
      loading.value = false;
    })
  }

  const getNodeList = async (id: number) => {
    detailLoading.value = true
    const res = await listCardNode(id);
    detailLoading.value = false
    cardNodeList.value = res.data;
    cardNodeList.value.forEach((info: any) => {
      if (info.finishTime != null) {
        info.color = '#67C23A';
      } else if (info.beginTime == null) {
        info.color = '#909399'
      } else {
        info.color = '#409EFF';
      }
      // if (info.requirement) {
      //   info.requirement = identifyJsonRequirements(info, info.isCutting == 1 ? true : false);
      // }
    })
  }

  /*开始*/
  const startCard = async (row: any) => {
    ElMessageBox.confirm(
      '确定将排产单 ' + row.productionVo.code + '即将开始生产，是否继续',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(async () => {
      Object.assign(form.value, row.productionVo);
      form.value.startTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
      form.value.productionStatus = '20';
      await updateProduction(form.value)
      proxy?.$modal.msgSuccess("操作成功");
      type.value == 0 ? getList() : getFinishedList();
    })
  }

  //处理加工要求
  /*  const identifyJsonRequirements = (info: any, boolean: boolean) => {
      var data = info.requirement;
      var publicText: any = [];
      var differPNLText: any = [];
      var obj = JSON.parse(JSON.parse(data));
      obj.forEach((item: any) => {
        if (info.isCutting == '1') {
          if (item.isDifferentiatePnl == '1') {
            var paramData = "";
            var differ = item.differPNL;
            differ.forEach((e: any) => {
              var value = e.defaultValue == null ? "" : e.pnlName + ":" + e.defaultValue;
              var unit = item.unit == null ? "" : item.unit;
              paramData += value + unit + ";";
            })
            differPNLText.push(item.name + ":" + paramData);
          }
        } else {
          var pnlData = "";
          if (item.isDifferentiatePnl == '1') {
            var differ = item.differPNL;
            differ.forEach((e: any) => {
              if (currentInfo.value.miProductionPlanPnlVo.name == e.pnlName) {
                var value = e.defaultValue == null ? "" : e.pnlName + ":" + e.defaultValue;
                var unit = item.unit == null ? "" : item.unit;
                pnlData += value + unit + ";";
                console.log(e.defaultValue)
              }
            })
            differPNLText.push(item.name + ":" + pnlData)
          }
        }

        var value = item.defaultValue == null ? "" : ":" + item.defaultValue;
        var unit = item.unit == null ? "" : item.unit;
        var data = item.name + value + unit;
        publicText.push(data);
      })
      var result = [publicText, differPNLText].flat().join("<br/>")
      return result;
    };*/

  let showDetail = ref(false);

  let drawerWidth = ref('20%');

  let currentNode = ref();

  const firstCountClick = async (node: any) => {
    ElMessageBox.confirm(
      '是否确定过数到首节点： ' + node.craftName + '？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      const data = {
        cardId: node.cardId
      }
      saveCardNode(data).then(async (res) => {
        await getNodeList(node.cardId);
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        type.value == 0 ? getList() : getFinishedList();
      })
    })
  }

  const showCount = (node:any,index:number)=>{
    if(node?.beginTime!=null && node?.finishTime ==null && currentInfo.value.isComplete =='0' && index != cardNodeList.value.length-1){
      return true;
    }
    if(index  != cardNodeList.value.length -1){
      const nextNode:any = cardNodeList.value[index + 1];
      if(nextNode && nextNode.countUnit == 1 && nextNode.finishTime == null && node.beginTime!=null){
        return true;
      }
    }
    return false;
  }

  let currentUnit = ref();

  /*一键过数*/
  const onCountToBtnClick = async (node: any) => {
    currentNode.value  = node;
    const data = {
      cardId: node.cardId,
      id: node.id,
      countQuantity: undefined,
    }
    const itemIndex = cardNodeList.value.indexOf(node);
    let unit = '3';
    if(node.countUnit != '3'){
      unit = node.countUnit;
    }
    if(itemIndex  != cardNodeList.value.length -1){
      const nextNode:any = cardNodeList.value[itemIndex + 1];
      unit = nextNode.countUnit;
      console.log(unit)
    }

    if(unit != '3'){
      // const title = "请输入" + node.craftName + "过数数量" + (unit == '2' ? "(SET)" : unit == '1' ? "(PCS)" : "");
      // ElMessageBox.prompt( title, {
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   inputType: 'number',
      //   inputPattern: /^[1-9]\d*$/,
      // }).then(({value}) => {
      //   data.countQuantity = value
      //   saveCardNode(data).then(async (res) => {
      //     await getNodeList(node.cardId);
      //     ElMessage({
      //       type: 'success',
      //       message: '操作成功',
      //     })
      //     type.value == 0 ? getList() : getFinishedList();
      //   })
      // })
      currentUnit.value = unit;
      countVisible.value = true;
      form.value.saleOrderId = currentInfo.value.saleOrderVoList[0].id;
    } else {
      ElMessageBox.confirm(
        '是否确定将 ' + node.craftName + ' 工序过数到下一节点吗?',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(() => {
        saveCardNode(data).then(async (res) => {
          await getNodeList(node.cardId);
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
          type.value == 0 ? getList() : getFinishedList();
        })
      })
    }
  }

  const confirmCount = () => {
    countFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        form.value.cardId = currentNode.value.cardId
        form.value.id = currentNode.value.id;
        saveCardNode(form.value).then(async (res) => {
          if(res.code == 200){
            countVisible.value = false;
            await getNodeList(currentNode.value.cardId);
            ElMessage({
              type: 'success',
              message: '操作成功',
            })
            type.value == 0 ? getList() : getFinishedList();
          }
        })
      }
    })
  }

  const handleDialogClose = ()=>{
    reset()
  }

  /*过数回退*/
  const onCountBackBtnClick = (node: any) => {
    const data = {
      cardId: node.cardId,
      id: node.id,
    }
    ElMessageBox.confirm(
      '是否确定将此卡回退到 ' + node.craftName + ' 工序节点吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      returnCardNode(data).then(async (res) => {
        await getNodeList(node.cardId);
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        type.value == 0 ? getList() : getFinishedList();
      })
    })

  }

  const optionList = ref<any[]>([]);

  const scrapList = ref([]);

  let scrapReasonList = ref([]);

  const getCraftDetails = async (node: any) => {
    const reasonReq = {
      craftId: node.craftId
    }
    const reasonRes = await getListDiscardReason(reasonReq);
    scrapReasonList.value = reasonRes.data;

    optionList.value = [];
    const req = {
      productionId: node.productionId,
      productionCardId: node.cardId,
      craftId: node.craftId
    }
    const res = await getScrapListByCard(req);
    scrapList.value = res.data;

    if (node.beginTime != null && node.countUnit == '3') {
      const info = {
        name: node.operatorUserName,
        type: "接单",
        time: node.beginTime,
        quantity: node.pnlQuantity + "pnl"
      }
      optionList.value.push(info)
    }
    if (node.finishTime != null && node.cardNodeDetails?.length == 0) {
      const info = {
        name: node.operatorUserName,
        type: "出单",
        time: node.finishTime,
        quantity: node.pnlQuantity + "pnl"
      }
      optionList.value.push(info)
    }
    if(node.cardNodeDetails != null && node.cardNodeDetails.length > 0){
      node.cardNodeDetails.forEach((item:any)=>{
        console.log(item.quantity)
        optionList.value.push({
          name: item.operatorUserName,
          type: item.type == '1' ? '接单' : '出单',
          time: item.operationTime,
          quantity: item.quantity + (item.countUnit == '1' ? 'pcs' : item.countUnit == '2' ? 'set' : 'pnl')
        })
      })
    }

    currentNode.value = node;
    drawerWidth.value = '40%';
    showDetail.value = true;
  }

  const handleCommand = async (isSuspend: string) => {
    const data ={
      productionId : currentInfo.value.productionId,
    }
    const str = isSuspend == '1' ? ("确定暂停排产" + currentInfo.value.productionCode + "及所属所有流转卡吗") : ("确定恢复排产" + currentInfo.value.productionCode + "及所属所有流转卡吗")
    ElMessageBox.confirm(
      str,
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      if(isSuspend =='1'){
        stopProduction(data).then(res => {
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
          drawer.visible = false;
          currentInfo.value.isSuspend = isSuspend;
          oldInfo.isSuspend = isSuspend
          type.value == 0 ?  getList() :  getFinishedList();
        })
      } else {
        restartProduction(data).then(res => {
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
          drawer.visible = false;
          currentInfo.value.isSuspend = isSuspend;
          oldInfo.isSuspend = isSuspend
          type.value == 0 ?  getList() :  getFinishedList();
        })
      }

    })

  }

  const handleSplitCard = async () => {
    splitVisible.value = true;

  }

  const confirmSplit = () => {
    splitFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const info = {
          id: currentInfo.value.id,
          bundlePnlQuantity: form.value.quantity,
          remark: form.value.remark
        }
        splitCard(info).then(async (res) => {
          if (res.code == 200) {
            splitVisible.value = false;
            drawer.visible = false;
            ElMessage({
              type: 'success',
              message: '操作成功',
            })
            type.value == 0 ? getList() : getFinishedList();
          }
        })
      }
    })
  }

  const handleMergeCard = async () => {
    const str = ("确定将流转卡" + currentInfo.value.code + "合并吗？")
    ElMessageBox.confirm(
      str,
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      splitVisible.value = false;
      drawer.visible = false;
      mergeCard(data).then(res => {
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        type.value == 0 ? getList() : getFinishedList();
      })
    })
  }

  /** 提交按钮 */
  const submitForm = async () => {
    buttonLoading.value = true;
    await updateProduction(form.value).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("修改成功");
    dialog.visible = false;
    type.value == 0 ? await getList() : await getFinishedList();

  }

  const closeDrawer = () => {
    drawerWidth.value = '20%';
    showDetail.value = false;
    // cardList.value = cardList.value.map(item => (item.id === oldInfo.id ? oldInfo : item));
    // dealData(cardList.value);
  }

  // /** 导出操作 */
  // const handleExport = async () => {

  //   proxy?.download('production/production/exportCard', {
  //     ...queryParams.value, tableName: 'productionProductionCardDoing'
  //   }, `排产进度管理_${new Date().getTime()}.xlsx`);

  // }
  const editableTabsValue = ref('0');
  /** 导出前操作 */
  const handleExport = async () => {

    if (editableTabsValue.value == '0') {
      proxy?.download('production/production/exportCard', {
        ...queryParams.value, tableName: 'productionProductionCardDoing'
      }, `排产进度管理-进行中_${new Date().getTime()}.xlsx`);
    } else if (editableTabsValue.value == '1') {
      if (!queryFinishedParams.value.planStartTimeStart) {
        exportVisible.value = true;
      }else {
        exportExcel();
      }
      // getFinishedList();
      // proxy?.download('production/production/exportCard', {
      //   ...queryFinishedParams.value, tableName: 'productionProductionCardFinish'
      // }, `排产进度管理-已完成_${new Date().getTime()}.xlsx`);
    }

  }

  const exportExcel = ()=>{
    if(!queryFinishedParams.value.planStartTimeStart && !queryFinishedParams.value.planStartTimeStart){
      queryFinishedParams.value.planStartTimeStart = dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00");
      queryFinishedParams.value.planStartTimeEnd = dayjs(new Date()).format("YYYY-MM-DD 23:59:59");
    }
    exportVisible.value = false;
    proxy?.download('production/production/exportCard', {
      ...queryFinishedParams.value, tableName: 'productionProductionCardFinish'
    }, `排产进度管理-已完成_${new Date().getTime()}.xlsx`);
  }


  const doCardPrint = (data: any, type: string) => {
    printFlag.value = true;
    nextTick(async () => {
      await cardPrintRef.value.doPrint(data, type, () => {
        printFlag.value = false;
      });
    });
  }

  onMounted(() => {
    getCrafts()
    getList();
    getDictOptions();
  });
</script>

<style>
  .flex_column_display {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .totalTitle{
    padding: 0px !important;
    margin: 0px;
    line-height: 24px !important;
    display: flex !important;
    justify-content: end !important;
    font-size: 14px !important;
    color: #0892c7 !important;
    font-weight: bold;
    margin-right: 10px;
  }
</style>
<style lang="scss" scoped>
  :deep(.el-timeline) {
    padding: 5px;
    .el-timeline-item {
      padding: 5px 0;
    }
    .el-timeline-item__timestamp.is-bottom {
      margin-top: 0;
    }
    .card-padding {
      .el-card__body {
        padding: 5px 10px !important;

        .timeline-time {
          margin: 0 0 5px 0;
        }
      }
    }
  }
</style>

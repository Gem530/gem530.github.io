<template>
  <div class="p-2 xtable-page">

      <el-tabs class="xtable-tab"  @tab-change="changeTab">

        <el-tab-pane label="钻咀可用库存" name="0">

          <div class="head-btn-flex" v-if="checkPermi(['inventory:driller:exportInv'])">
            <el-button  plain icon="Download" v-if="checkPermi(['inventory:driller:exportInv'])" @click="drillerInventoryExport">导出</el-button>
          </div>

          <XTable toolId="drillerInventory" height="100%" class="xtable-content"
                  v-model:page-size="drillerInventoryQueryParams.pageSize"
                  v-model:current-page="drillerInventoryQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: drillerInventoryTableTotal }"
                  :data="drillerInventoryTableData"
                  :sort-orders="sortCondition"
                  :columnList="drillerInventoryColumnList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  @searchChange="drillerInventorySearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="drillerInventoryTableLoading"
          >

            <template #default-orderStatus="scope">
              <span v-if="scope.row.orderStatus === '0'">待提交</span>
              <span v-else>X</span>
            </template>

            <template #default-make="scope">
              <el-button v-if="scope.row.quantity > 0 && checkPermi(['inventory:driller:rec'])" link type="primary"  @click="clickReceiveDriller(scope.row)" >领用</el-button>
              <el-button v-if="scope.row.useNumber === 0 &&scope.row.quantity > 0 && checkPermi(['inventory:driller:returnZC'])" link  type="primary" @click="clickReturnZCDriller(scope.row)">归还总仓</el-button>
              <el-tag type="info" v-if=" scope.row.quantity=== 0">无库存</el-tag>
            </template>

          </XTable>

        </el-tab-pane>

        <el-tab-pane label="钻咀领用列表" name="1" >

          <div class="head-btn-flex" v-if="checkPermi(['inventory:driller:exportRec'])">
            <el-button  plain icon="Download" v-if="checkPermi(['inventory:driller:exportRec'])" @click="drillerReceiveExport">导出</el-button>
          </div>

          <XTable toolId="drillerReceive" height="100%" class="xtable-content"
                  v-model:page-size="drillerReceiveQueryParams.pageSize"
                  v-model:current-page="drillerReceiveQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: drillerReceiveTableTotal }"
                  :data="drillerReceiveTableData"
                  :columnList="drillerReceiveColumnList"
                  ref="XTableRef"
                  border
                  :showRefresh="true"
                  @searchChange="drillerReceiveSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="drillerReceiveTableLoading"
                  :enterFresh = "true"
                  :scroll-x="{enabled: true}"
                  :scroll-y="{enabled: true}" size="small"
          >

            <template #default-orderStatus="scope">
              <span v-if="scope.row.orderStatus === '1'">待回复</span>
              <span v-else>X</span>
            </template>

            <template #default-relevancy="scope">
              <el-button v-if="scope.row.productionIdList" link type="primary" @click="viewRelevancyMsg(scope.row)" >查看</el-button>
            </template>

            <template #default-make="scope">
              <el-button v-if="scope.row.canReturnQuantity > 0 && scope.row.abrasiveNumber > 0 && checkPermi(['inventory:driller:returnFC'])" link type="primary" @click="drillerReceiveReturn(scope.row)" >归还</el-button>
              <el-button v-if="scope.row.canReturnQuantity > 0 && scope.row.abrasiveNumber > 0 && checkPermi(['inventory:driller:recAbrade'])" link type="primary" @click="drillerAbrade(scope.row)">研磨</el-button>
              <el-button v-if="scope.row.canReturnQuantity > 0 && scope.row.abrasiveNumber > 0 && checkPermi(['inventory:driller:recScrap'])" link type="primary" @click="drillerScrap(scope.row)">报废</el-button>
              <el-tag type="success" v-if=" scope.row.canReturnQuantity<= 0">已完成</el-tag>
              <el-tag type="info" v-if=" scope.row.abrasiveNumber=== 0">已自动报废</el-tag>
            </template>

          </XTable>

        </el-tab-pane>

        <el-tab-pane label="钻咀研磨列表" name="2">

          <div class="head-btn-flex" v-if="checkPermi(['inventory:driller:exportAbr'])">
            <el-button  plain icon="Download" v-if="checkPermi(['inventory:driller:exportAbr'])" @click="drillerAbradeExport">导出</el-button>
          </div>

          <XTable toolId="drillerAbrade" height="100%" class="xtable-content"
                  v-model:page-size="drillerAbradeQueryParams.pageSize"
                  v-model:current-page="drillerAbradeQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: drillerAbradeTableTotal }"
                  :data="drillerAbradeTableData"
                  :columnList="drillerAbradeColumnList"
                  ref="XTableRef"
                  border
                  :showRefresh="true"
                  @searchChange="drillerAbradeSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="drillerAbradeTableLoading"
          >
            <template #default-orderStatus="scope">
              <span v-if="scope.row.orderStatus === '2'">已回复</span>
              <span v-else>X</span>
            </template>

            <template #default-make="scope">
              <el-button v-if="(scope.row.abradeQuantity -scope.row.abradeReturnedQuantity -scope.row.abradeScrapQuantity) > 0 && checkPermi(['inventory:driller:abrReturn'])"  link type="primary" @click="drillerAbradeReturn(scope.row)">归还</el-button>
              <el-button v-if="(scope.row.abradeQuantity -scope.row.abradeReturnedQuantity -scope.row.abradeScrapQuantity) > 0 && checkPermi(['inventory:driller:abrScrap'])" link type="primary" @click="drillerAbradeScrap(scope.row)">报废</el-button>
              <el-tag type="success" v-if="(scope.row.abradeQuantity -scope.row.abradeReturnedQuantity -scope.row.abradeScrapQuantity) <= 0">已完成</el-tag>
            </template>

          </XTable>

        </el-tab-pane>

        <el-tab-pane label="操作记录" name="3">

          <div class="head-btn-flex" v-if="checkPermi(['inventory:driller:exportRecord'])">
            <el-button  plain icon="Download"  v-if="checkPermi(['inventory:driller:exportRecord'])" @click="drillerRecordExport">导出</el-button>
          </div>

          <XTable toolId="drillerOperationRecord" height="100%" class="xtable-content"
                  v-model:page-size="drillerOperationRecordQueryParams.pageSize"
                  v-model:current-page="drillerOperationRecordQueryParams.pageNum"
                  :intervalCondition="intervalCondition"
                  :page-params="{ perfect: true, total: drillerOperationRecordTableTotal }"
                  :data="drillerOperationRecordTableData"
                  :columnList="drillerOperationRecordColumnList"
                  ref="XTableRef"
                  border
                  :showRefresh="true"
                  @searchChange="drillerOperationRecordSearchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
                  :loading="drillerOperationRecordTableLoading"
                  :scroll-x="{enabled: true}"
                  :scroll-y="{enabled: true}" size="small"
          >
            <template #default-operationType="{row}">
              <div v-for="item in operationTypeData">
                <el-tag :type="item.type" :effect="item.effect"  size="small" v-if="item.value === row.operationType">{{item.label}}</el-tag>
              </div>
            </template>

            <template #default-scrapType="{row}">
              <div v-for="item in scrapTypeData">
              <el-tag :type="row.scrapType==='0'?'danger':'warning'" size="small" v-if="item.value === row.scrapType">{{item.label}}</el-tag>
              </div>
            </template>



          </XTable>

        </el-tab-pane>

      </el-tabs>

<!--      库存领用抽屉-->
      <el-drawer
        v-model="drillerReceiveVisible"
        :title= "drillerReceiveTitle"
        direction="rtl"
        size="69%"
        destroy-on-close
        @close="resetReceiveForm()"
      >
        <el-form
          :model="receiveFromData"
          ref="receiveFormRef"
          :rules="receiveFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="8">
              <el-form-item label="可研磨次数" prop="abrasiveNumber">
                <el-input v-model="receiveFromData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可使用次数" prop="canUseNumber">
                <el-input v-model="receiveFromData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库存数量" prop="quantity">
<!--                {{receiveFromData.quantity}}-->
                <el-input v-model="receiveFromData.quantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用人" prop="receiveUserId">
                <el-select v-model="receiveFromData.receiveUserId" clearable filterable style="width: 100%"
                           placeholder="请选择领用人">
                  <el-option
                    v-for="item in receiverOptions"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用数量" prop="receivedQuantity" >
                <XInputNumber class="number-left" :controls="false" style="width: 100%" ref="recInventoryRef" precision="0" v-model="receiveFromData.receivedQuantity" min="1" :max="receiveFromData.quantity" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-row :gutter="10" class="no-bottom-margin">
                <el-col :span="1.5">
                  <el-button v-show="dialog.title !== '排产单详情'" type="primary" plain @click="selectMaterial">选择关联排产单</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button v-show="dialog.title !== '排产单详情'" plain @click="handleEmpty()">清空</el-button>
                </el-col>
              </el-row>

              <XTable :pageShow="false"
                      ref="confirmTable"
                      :data="confirmSelectInventoryList"
                      border
                      :columnList="confirmSelectInventoryColumnList"
                      max-height="430px"
                      height="430px"
              >

                <template #default-productionStatus="scope">
                  {{scope.row.productionStatus === '30' ? '已完成' : '生产中'}}
                </template>

                <template #default-make="scope">
                  <el-button
                    v-if="dialog.title !== '排产单详情'"
                    link
                    type="primary"
                    @click="handleSelectDelete(scope.row)"

                  >删除
                  </el-button
                  >
                </template>
              </XTable>

            </el-col>

            <el-col :span="24" style="margin-top: 20px">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200"  autosize  v-model="receiveFromData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="receiveDriller">确定</el-button>
          <el-button @click="resetReceiveForm">取消</el-button>
        </template>

      </el-drawer>

<!--      关联排产对话框-->
      <el-dialog v-model="dialogMaterial.visible" title="选择排产单" width="83%" draggable destroy-on-close>
        <el-row>
          <el-col :span="5">
            <XTable :pageShow="false" :showHead="false" :columnList="columnListProductOrder" height="440" :data="selectInventoryList" style="width: 100%">
              <template #default-make="scope">
                <el-tooltip content="删除" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="CloseBold"
                    @click="handleInventoryListDelete(scope.row)"

                  ></el-button>
                </el-tooltip>
              </template>
            </XTable>
          </el-col>
          <el-col :span="19">
            <XTable
              v-loading="materialLoading"
              :pageShow="true"
              v-model:page-size="auditQueryParams.pageSize"
              v-model:current-page="auditQueryParams.pageNum"
              :page-params="{ perfect: true, total: auditTotal }"
              :data="productionAuditList"
              :columnList="columnAuditList"
              :intervalCondition="intervalCondition"
              ref="inventoryTableRef"
              @searchChange="searchAuditChange"
              :checkbox-config="{ reserve: true }"
              :row-config="{ keyField: 'id' }"
              @checkbox-change="selectChangeEvent"
              @checkbox-all="selectAllChangeEvent"
              height="440"
            >
              <template #default-productionStatus="scope">
                {{scope.row.productionStatus === '30' ? '已完成' : '生产中'}}
              </template>

            </XTable>
          </el-col>
        </el-row>
        <template #footer >
          <el-button :loading="buttonLoading" type="primary" @click="submitInventoryForm"
          >确 定</el-button
          >
          <el-button @click="clearInventoryForm" >取消</el-button>
        </template>
      </el-dialog>

<!--      归还总仓抽屉-->
      <el-drawer
        v-model="drillerReturnZCVisible"
        :title= "drillerReturnZCTitle"
        direction="rtl"
        size="40%"
        destroy-on-close
        @close="resetReturnZCForm()"
      >
        <el-form
          :model="returnZCFromData"
          ref="returnZCFormRef"
          :rules="returnZCFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="12">
              <el-form-item label="可研磨次数" prop="abrasiveNumber">
                <el-input v-model="returnZCFromData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="可使用次数" prop="canUseNumber">
                <el-input v-model="returnZCFromData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存数量" prop="quantity">
<!--                {{returnZCFromData.quantity}}-->
                <el-input v-model="returnZCFromData.quantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归还数量" prop="returnQuantity">
                <XInputNumber class="number-left" :controls="false" style="width: 100%"   ref="recReturnZCRef" precision="0" v-model="returnZCFromData.returnQuantity" min="1" :max="returnZCFromData.quantity" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="入库仓" prop="storageId">
                <el-select v-model="returnZCFromData.storageId" clearable filterable style="width: 100%"
                           placeholder="请选择仓库">
                  <el-option
                    v-for="item in storageOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200"  autosize  v-model="returnZCFromData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="returnZCDriller">确定</el-button>
          <el-button @click="resetReturnZCForm">取消</el-button>
        </template>

      </el-drawer>

<!--      领用关联信息抽屉-->
      <el-drawer
        v-model="viewRelevancyMsgVisible"
        :title= "drillerRelevancyTitle"
        direction="rtl"
        size="58.5%"
        destroy-on-close
        @close="resetRelevancyForm()"
      >
         <XTable :pageShow="false"
                 :data="viewProductionRelevancyList"
                 border
                 :columnList="viewRelevancyMsgColumnList"
                 max-height="722px"
                 ref="nowAuditRef"
                 :loading="viewRelevancyLoading"
                 @searchChange="searchNowAuditChange"
                 :intervalCondition="intervalCondition"
                 :row-config="{ keyField: 'id' }"
         >

           <template #default-productionStatus="scope">
             {{scope.row.productionStatus === '30' ? '已完成' : '生产中'}}
           </template>

         </XTable>


        <template #footer >
            <el-button @click="resetRelevancyForm">关闭</el-button>
        </template>

      </el-drawer>

<!--      领用归还抽屉-->
      <el-drawer
        v-model="drillerReceiveReturnVisible"
        :title= "drillerReceiveReturnTitle"
        direction="rtl"
        size="40%"
        destroy-on-close
        @close="resetReceiveReturnForm()"
      >
        <el-form
          :model="receiveReturnFormData"
          ref="receiveReturnFormRef"
          :rules="receiveReturnFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="8">
              <el-form-item label="可研磨次数" prop="abrasiveNumber">
                <el-input v-model="receiveReturnFormData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可使用次数" prop="canUseNumber">
                <el-input v-model="receiveReturnFormData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用数量" prop="receivedQuantity">
                <el-input v-model="receiveReturnFormData.receivedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已归还数量" prop="receiveReturnedQuantity">
                <el-input v-model="receiveReturnFormData.receiveReturnedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已报废数量" prop="receiveScrapQuantity">
                <el-input v-model="receiveReturnFormData.receiveScrapQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可归还数量">
                <el-input v-model="receiveReturnFormData.canReturnQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="归还数量" prop="returnQuantity">
                <XInputNumber class="number-left" :controls="false" style="width: 100%"   ref="recReturnRef" precision="0" v-model="receiveReturnFormData.returnQuantity" min="1" :max="receiveReturnFormData.canReturnQuantity" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200" autosize  v-model="receiveReturnFormData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="receiveReturnDriller">确定</el-button>
          <el-button @click="resetReceiveReturnForm">取消</el-button>
        </template>


      </el-drawer>

<!--      领用研磨抽屉-->
      <el-drawer
        v-model="drillerReceiveAbradeVisible"
        :title= "drillerReceiveAbradeTitle"
        direction="rtl"
        size="40%"
        destroy-on-close
        @close="resetReceiveAbradeForm()"
      >
        <el-form
          :model="receiveAbradeFormData"
          ref="receiveAbradeFormRef"
          :rules="receiveAbradeFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="8">
              <el-form-item label="可研磨次数" >
                <el-input v-model="receiveAbradeFormData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可使用次数" >
                <el-input v-model="receiveAbradeFormData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用次数" >
                <el-input v-model="receiveAbradeFormData.useNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用数量" >
                <el-input v-model="receiveAbradeFormData.receivedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已归还数量" >
                <el-input v-model="receiveAbradeFormData.receiveReturnedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已报废数量" >
                <el-input v-model="receiveAbradeFormData.receiveScrapQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研磨数量" prop="abradeQuantity">
                <XInputNumber class="number-left" :controls="false" ref="recAbradeRef" precision="0" v-model="receiveAbradeFormData.abradeQuantity" min="1" :max="receiveAbradeFormData.canReturnQuantity" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可研磨数量" >
                <el-input v-model="receiveAbradeFormData.canReturnQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已研磨数量" >
                <el-input v-model="receiveAbradeFormData.receiveAbradeQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研磨单价" prop="abradePrice">
                <el-input type="number" min="0.01" precision="2"  max="99999.99" v-model="receiveAbradeFormData.abradePrice" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研磨价格">
                <el-input  :placeholder="''+(receiveAbradeFormData.abradeQuantity===undefined||receiveAbradeFormData.abradePrice===undefined?''
                :(receiveAbradeFormData.abradeQuantity * receiveAbradeFormData.abradePrice).toFixed(2))" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="研磨供应商" prop="supplierId">
                <el-select v-model="receiveAbradeFormData.supplierId" clearable filterable style="width: 100%"
                           placeholder="请选择研磨供应商">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.supplierCode +' : ' + item.supplierName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200"  autosize  v-model="receiveAbradeFormData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="receiveAbradeDriller">确定</el-button>
          <el-button @click="resetReceiveAbradeForm">取消</el-button>
        </template>

      </el-drawer>

<!--      领用报废抽屉-->
      <el-drawer
        v-model="drillerReceiveScrapVisible"
        :title= "drillerReceiveScrapTitle"
        direction="rtl"
        size="40%"
        destroy-on-close
        @close="resetReceiveScrapForm()"
      >
        <el-form
          :model="receiveScrapFormData"
          ref="receiveScrapFormRef"
          :rules="receiveScrapFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="8">
              <el-form-item label="可研磨次数" >
                <el-input v-model="receiveScrapFormData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可使用次数" >
                <el-input v-model="receiveScrapFormData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用次数" >
                <el-input v-model="receiveScrapFormData.useNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用数量" >
                <el-input v-model="receiveScrapFormData.receivedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已归还数量" >
                <el-input v-model="receiveScrapFormData.receiveReturnedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已报废数量" >
                <el-input v-model="receiveScrapFormData.receiveScrapQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报废数量" prop="scrapQuantity">
                <XInputNumber class="number-left" :controls="false" ref="recScrapRef" precision="0" v-model="receiveScrapFormData.scrapQuantity" min="1" :max="receiveScrapFormData.canReturnQuantity" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可报废数量" prop="canReturnQuantity">
                <XInputNumber class="number-left" :controls="false" v-model="receiveScrapFormData.canReturnQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报废类型" prop="scrapType">
                  <el-radio-group v-model="receiveScrapFormData.scrapType">
                    <el-radio-button size="small" label="0" >责任在本厂</el-radio-button>
<!--                    <el-radio-button size="small" label="1" >责任在供应商</el-radio-button>-->
                  </el-radio-group>
              </el-form-item>
            </el-col>


            <el-col :span="24" v-if="receiveScrapFormData.scrapType === '0'">
              <el-form-item  label="报废责任人" prop="scrapCoordinatorId" >
                <el-select  v-model="receiveScrapFormData.scrapCoordinatorId" clearable filterable style="width: 100%"
                           placeholder="请选择报废责任人">
                  <el-option
                    v-for="item in receiverOptions"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>


            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200"  autosize  v-model="receiveScrapFormData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="receiveScrapDriller">确定</el-button>
          <el-button @click="resetReceiveScrapForm">取消</el-button>
        </template>

      </el-drawer>

<!--      研磨归还抽屉-->
      <el-drawer
        v-model="drillerAbradeReturnVisible"
        :title= "drillerAbradeReturnTitle"
        direction="rtl"
        size="40%"
        destroy-on-close
        @close="resetAbradeReturnForm()"
      >
        <el-form
          :model="abradeReturnFormData"
          ref="abradeReturnFormRef"
          :rules="abradeReturnFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="8">
              <el-form-item label="可研磨次数" prop="abrasiveNumber">
                <el-input v-model="abradeReturnFormData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可使用次数" prop="canUseNumber">
                <el-input v-model="abradeReturnFormData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用次数" >
                <el-input v-model="abradeReturnFormData.useNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研磨数量" prop="abradeQuantity">
                <el-input v-model="abradeReturnFormData.abradeQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已归还数量" prop="abradeReturnedQuantity">
                <el-input v-model="abradeReturnFormData.abradeReturnedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已报废数量" prop="abradeScrapQuantity">
                <el-input v-model="abradeReturnFormData.abradeScrapQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="归还数量" prop="returnQuantity">
                <XInputNumber class="number-left" :controls="false" ref="abrReturnRef" precision="0" v-model="abradeReturnFormData.returnQuantity" min="1" :max="abradeReturnFormData.canReturnQuantity" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可归还数量" prop="canReturnQuantity">
                <el-input v-model="abradeReturnFormData.canReturnQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea"  maxlength="200"  autosize  v-model="abradeReturnFormData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="abradeReturnDriller">确定</el-button>
          <el-button @click="resetAbradeReturnForm">取消</el-button>
        </template>

      </el-drawer>

<!--      研磨报废抽屉-->
      <el-drawer
        v-model="drillerAbradeScrapVisible"
        :title= "drillerAbradeScrapTitle"
        direction="rtl"
        size="40%"
        destroy-on-close
        @close="resetAbradeScrapForm()"
      >
        <el-form
          :model="abradeScrapFormData"
          ref="abradeScrapFormRef"
          :rules="abradeScrapFormRule"
          label-width="auto">

          <el-row >
            <el-col :span="8">
              <el-form-item label="可研磨次数" >
                <el-input v-model="abradeScrapFormData.abrasiveNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可使用次数" >
                <el-input v-model="abradeScrapFormData.canUseNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用次数" >
                <el-input v-model="abradeScrapFormData.useNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研磨数量" >
                <el-input v-model="abradeScrapFormData.abradeQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已归还数量" >
                <el-input v-model="abradeScrapFormData.abradeReturnedQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已报废数量" >
                <el-input v-model="abradeScrapFormData.abradeScrapQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报废数量" prop="scrapQuantity">
                <XInputNumber class="number-left" :controls="false" ref="abrScrapRef" precision="0" v-model="abradeScrapFormData.scrapQuantity" min="1" :max="abradeScrapFormData.canReturnQuantity" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可报废数量" prop="canReturnQuantity">
                <el-input v-model="abradeScrapFormData.canReturnQuantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报废类型" prop="scrapType">
                <el-radio-group v-model="abradeScrapFormData.scrapType">
<!--                  <el-radio-button size="small" label="0" >责任在本厂</el-radio-button>-->
<!--                  <el-radio-button size="small" label="1" >责任在供应商</el-radio-button>-->
                  <el-radio size="small" label="0" border>责任在本厂</el-radio>
                  <el-radio size="small" label="1" border>责任在供应商</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>


            <el-col :span="24" v-if="abradeScrapFormData.scrapType === '0'">
              <el-form-item label="报废责任人" prop="scrapCoordinatorId" >
                <el-select  v-model="abradeScrapFormData.scrapCoordinatorId" clearable filterable style="width: 100%"
                            placeholder="请选择报废责任人">
                  <el-option
                    v-for="item in receiverOptions"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="abradeScrapFormData.scrapType === '1'">
              <el-form-item label="责任供应商" prop="scrapSupplierId">
                <el-select v-model="abradeScrapFormData.scrapSupplierId" clearable filterable style="width: 100%"
                           placeholder="请选择研磨供应商">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.supplierCode +' : ' + item.supplierName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input show-word-limit :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" maxlength="200"  autosize  v-model="abradeScrapFormData.remark" placeholder="请输入备注"  />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <template #footer >
          <el-button type="primary" @click="abradeScrapDriller">确定</el-button>
          <el-button @click="resetAbradeScrapForm">取消</el-button>
        </template>

      </el-drawer>

  </div>
</template>

<script setup name="Driller">

import {ref} from "vue";
import {
  abradeReturn,
  abradeScrap,
  commitReceiveDriller,
  listDrillerAbrade,
  listDrillerInventory,
  listDrillerReceive,
  listDrillerRecord,
  receiveAbrade,
  receiveReturn,
  receiveScrap,
  returnMainStorage
} from "@/api/inventory/driller";
import {listAllUser, listUserByDeptId, listUserByOwnerId} from "@/api/system/user";
import {listSupplier} from "@/api/basedata/supplier";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
import {deepClone} from "@/utils";
import {listAuditProduction} from "@/api/production/production";
import useUserStore from "@/store/modules/user";
import {checkPermi} from "@/utils/permission";
const { ownerId } = useUserStore();


// 初始化排产关联查询参数
const auditQueryParams  = ref({
  pageNum: 1,
  pageSize: 20,
  isAsc: "desc",
  orderByColumn: "create_time",
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
});

// 初始化排产关联查询参数
const nowAuditQueryParams  = ref({
  pageNum: 1,
  pageSize: 1000,
  code: undefined,
  productionStatus: undefined,
  startTimeStart: undefined,
  commodityCode: undefined,
  commodityName: undefined,
  startTimeEnd: undefined,
});

// 初始化排产关联查询参数
const viewQueryParams  = ref({
  isAsc: "desc",
  orderByColumn: "create_time",
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
  params: {},
  idList: []
});

// 排产单选择列表总记录数
const auditTotal = ref(0);
// 排产单信息列表总记录数
const viewTotal = ref(0);
const inventoryTableRef = ref()
const nowAuditRef = ref()
// 排产关联池展示的排产单
const productionAuditList = ref([]);
// 排产关联信息展示的排产单
const viewProductionRelevancyList = ref([]);
// 排产关联信息展示的排产单---全量复制
const viewProductionRelevancyCopyList = ref([]);
// 选中的排产单
const selectInventoryList = ref([]);
// 确认选中的排产单
const confirmSelectInventoryList = ref([]);
// 确认选中的排产单-备份
const confirmSelectInventoryCopyList = ref([]);
// 排产单加载
const materialLoading = ref(false);
// 排产单信息加载
const viewRelevancyLoading = ref(false);
// 按钮加载
const buttonLoading = ref(false);
// 排产关联弹窗
const {dialogMaterial} = toRefs(reactive({
  dialogMaterial: {
    visible: false,
    title: ''
  }
}));
const dialog = reactive({
  visible: false,
  title: ''
});
// 回显排产单的id数组
const ids = ref([]);
const confirmTable = ref()

const columnListProductOrder = ref([
  { title: '已选排产单', align: 'center', children: [
    { width: '118',title: '排产单号',field: 'code',align: 'center',  },
    { width: '120',title: '产品编码',field: 'commodityCode',align: 'center',  },
    { width: '44',title: '操作',field: 'make',align: 'center',  },
  ] }
]);

// 确认已选排产单删除按钮操作
const handleSelectDelete = async (row) => {
  const _ids = row?.id || ids.value;
  //删除已选排产单
  selectInventoryList.value = selectInventoryList.value.filter(item => item.id !== _ids);
  //删除确认已选排产单
  confirmSelectInventoryList.value = confirmSelectInventoryList.value.filter(item => item.id !== _ids);

  const $table = inventoryTableRef.value.xTableRef;
  //将InventoryTableRef使用toggleRowSelection 取消选中
  // inventoryTableRef.value?.toggleRowSelection(row, false);
  if ($table) {
    //将InventoryTableRef使用toggleRowSelection 取消选中
    $table.setCheckboxRow(row, false);
  }
}

// 清空确认已选排产单按钮操作
const handleEmpty = async () => {
  const $table = confirmTable.value.xTableRef;
  selectInventoryList.value.forEach((item) => {
    $table.setCheckboxRow(item, false);
  });
  //清空确认已选排产单
  confirmSelectInventoryList.value = [];

}

// 已选排产单 删除按钮操作
const handleInventoryListDelete = async (row) => {
  const id = row?.id;
  //删除已选排产单
  selectInventoryList.value = selectInventoryList.value.filter(item => item.id !== id);

  const $table = inventoryTableRef.value.xTableRef;
  if ($table) {
    $table.setCheckboxRow(row, false);
  }
}

// 选择排产单按钮
const selectMaterial = async () => {
  console.log('dialogMaterial', dialogMaterial)
  dialogMaterial.value = {
    visible: true,
    title: "选择排产单"
  }

  selectInventoryList.value = [...confirmSelectInventoryList.value];
  confirmSelectInventoryCopyList.value = deepClone(confirmSelectInventoryList.value);
  materialLoading.value = true;
  // auditQueryParams.value重置
  auditQueryParams.value = {
      pageNum: 1,
      pageSize: 20,
      isAsc: "desc",
      orderByColumn: "create_time",
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
  await searchAuditChange(auditQueryParams.value);

  // 为不属于当前页的数据设置选中缓存
  nextTick(() => {

    const $table = inventoryTableRef.value.xTableRef
    if ($table) {
      let st = productionAuditList.value.filter(item => {
        return selectInventoryList.value.some(item2 => item.id === item2.id);
      });
      //得到selectInventoryList.value 中 id 在st中不存在的数据
      let temp = selectInventoryList.value.filter(item => {
        return !st.some(item2 => item.id === item2.id);
      });

      $table.setCheckboxRow(temp, true);
    }
  });
}

// 搜索条件发生改变时
const searchAuditChange = async (params) => {
  auditQueryParams.value = params;

  materialLoading.value = true;
  // 查询排产列表
  await getAuditList();
  // 设置表格默认选中
  setTableSelect();
  materialLoading.value = false;
}

// 搜索条件发生改变时
const searchNowAuditChange = async (params) => {
  nowAuditQueryParams.value = params;

  console.log('查询参数',nowAuditQueryParams.value)

  viewRelevancyLoading.value = true;

  // 检查viewProductionRelevancyCopyList.value是否是数组
  console.log('过滤前:', viewProductionRelevancyCopyList.value);
  if (!Array.isArray(viewProductionRelevancyCopyList.value)) {
    console.error('viewProductionRelevancyCopyList.value 不是数组');
    return;
  }


  viewProductionRelevancyList.value = deepClone(viewProductionRelevancyCopyList.value);

  // 对viewProductionRelevancyCopyList.value进行模糊匹配直接过滤
  // 如果params.value.code不为空,则过滤出code模糊匹配的数据
  if (nowAuditQueryParams.value.code) {
    viewProductionRelevancyList.value = viewProductionRelevancyList.value.filter(item => {
      return item.code.indexOf(nowAuditQueryParams.value.code) > -1
    })
  }
  // 如果params.value.startTimeStart不为空,则过滤出startTime在params.value.startTimeStart 之后的数据
  if (nowAuditQueryParams.value.startTimeStart) {
    viewProductionRelevancyList.value = viewProductionRelevancyList.value.filter(item => {
      return item.startTime >= nowAuditQueryParams.value.startTimeStart
    })
  }
  // 如果params.value.startTimeEnd不为空,则过滤出startTime在params.value.startTimeEnd 之前的数据
  if (nowAuditQueryParams.value.startTimeEnd) {
    viewProductionRelevancyList.value = viewProductionRelevancyList.value.filter(item => {
      return item.startTime <= nowAuditQueryParams.value.startTimeEnd
    })
  }
  // 如果params.value.productionStatus不为空,则进行精准匹配过滤
  if (nowAuditQueryParams.value.productionStatus) {
    viewProductionRelevancyList.value = viewProductionRelevancyList.value.filter(item => {
      console.log('循环中-生产状态',item.productionStatus)
      return item.productionStatus === nowAuditQueryParams.value.productionStatus
    })
  }
  // 如果params.value.commodityCode不为空,则过滤出commodityCode模糊匹配的数据
  if (nowAuditQueryParams.value.commodityCode) {
    viewProductionRelevancyList.value = viewProductionRelevancyList.value.filter(item => {
      return item.commodityCode.indexOf(nowAuditQueryParams.value.commodityCode) > -1
    })
  }
  // 如果params.value.commodityName不为空,则过滤出commodityName模糊匹配的数据
  if (nowAuditQueryParams.value.commodityName) {
    viewProductionRelevancyList.value = viewProductionRelevancyList.value.filter(item => {
      return item.commodityName.indexOf(nowAuditQueryParams.value.commodityName) > -1
    })
  }


  console.log('过滤后:', viewProductionRelevancyList.value);

  viewRelevancyLoading.value = false;
}

// 查询排产单列表
const getAuditList = async () => {
  auditQueryParams.value.isCalculate = '1'
  auditQueryParams.value.isPause = '0'
  if (!auditQueryParams.value.productionStatus) {
    auditQueryParams.value.productionStatusList = ['20', '30']
  }
  const res = await listAuditProduction(auditQueryParams.value);
  productionAuditList.value = res.rows;
  dealData(productionAuditList.value);
  auditTotal.value = res.total;
}

// 显示前处理排产单数据
const dealData = async (rows) => {
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
      item.orderArea = orderArea
    }
  })
}

// 设置表格列表选中
const setTableSelect = () => {

  const $table = inventoryTableRef.value.xTableRef;
  if ($table) {
    //过滤materialInventoryList中id在selectInventoryList中的数据，
    let st = productionAuditList.value.filter(item => {
      return selectInventoryList.value.some(item2 => item.id === item2.id);
    });
    //先为materialInventoryList中所有数据取消选中
    $table.setCheckboxRow(productionAuditList, false);
    $table.setCheckboxRow(st, true);
  }
}

//选择排产单全选
const selectAllChangeEvent = () => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    selectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}

//选择排产单 单选
const selectChangeEvent = ({checked, row}) => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    selectInventoryList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}

// 已选排产单取消按钮操作
const clearInventoryForm = () => {

  dialogMaterial.value.visible = false;
  selectInventoryList.value = [];
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
    $table.clearCheckboxReserve();
    $table.clearCheckboxRow();
  }

}

// 已选排产单确认按钮操作
const submitInventoryForm = () => {
  dialogMaterial.value.visible = false;
  //将已选中的赋值给confirmSelectInventoryList
  confirmSelectInventoryList.value = selectInventoryList.value;

  confirmSelectInventoryList.value.map((item2) => {
    let material = confirmSelectInventoryCopyList.value.find(item => item.id === item2.id);
    console.log(material)
    if (material) {
      item2.quantity = material.quantity;
    } else {
      item2.quantity = 0;
    }
  })
  ;
}

// 选择排产单列表字段属性
const columnAuditList = ref([
  {type: 'checkbox', align: 'center', field: "checkbox", width: '40', fixed: 'left',},
  {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '50'},
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
    width: "80",
    title: '生产状态',
    fixed: 'left',
    align: 'center',
    field: 'productionStatus',
    filterType: 'radioButton',
    filterParam: {placeholder: '请输入MI类型'},
    filterData: () => [{dictLabel: "全部", dictValue: "",}, {dictLabel: "生产中", dictValue: "20",}, {
      dictLabel: "已完成",
      dictValue: "30",
    }],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: "120",
    title: '排产时间',
    fixed: 'left',
    field: 'startTime',
    align: "center", filterType: 'intervalDate',
  filterParam: {
  startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
  endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
}},
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
    width: "140",
    title: '产品名称',
    field: 'commodityName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入'}
  },
  {width: "110", title: '订单数量(PCS)', field: 'orderQuantity', align: 'center'},
  {width: "90", title: '订单面积(㎡)', field: 'orderArea', align: 'center'},
  {width: "110", title: '排产数量(PNL)', field: 'productionPnlQuantity', align: 'center'},
  {width: "110", title: '生产面积(㎡)', field: 'productionArea', align: 'center'},
]);

//确认选中的排产单表
const confirmSelectInventoryColumnList = ref([
  {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60'},
  {
    width: "120",
    title: '排产单号',
    fixed: 'left',
    field: 'code',
    align: 'center'
  },
  {
    width: "60",
    title: '生产状态',
    align: 'center',
    field: 'productionStatus'
  },
  {
    width: "148",
    title: '排产时间',
    field: 'startTime',
    align: 'center',
  },
  {
    width: "120",
    title: '产品编码',
    field: 'commodityCode',
    align: 'center'
  },
  {
    width: "120",
    title: '产品名称',
    field: 'commodityName',
    align: 'center'
  },
  {width: "110", title: '订单数量(PCS)', field: 'orderQuantity', align: 'center'},
  {width: "90", title: '订单面积(㎡)', field: 'orderArea', align: 'center'},
  {width: "110", title: '排产数量(PNL)', field: 'productionPnlQuantity', align: 'center'},
  {width: "110", title: '生产面积(㎡)', field: 'productionArea', align: 'center'},
  {title: '操作', field: 'make', fixed: 'right', width: '60', align: 'center', showOverflow: false},
]);


//关联的排产单表
const viewRelevancyMsgColumnList = ref([
  {title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '40'},
  {
    width: "110",
    title: '排产单号',
    fixed: 'left',
    field: 'code',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入排产单号'}
  },
  {
    width: "60",
    title: '生产状态',
    align: 'center',
    field: 'productionStatus',
    filterType: 'radioButton',
    filterParam: {placeholder: '请输入MI类型'},
    filterData: () => [{dictLabel: "全部", dictValue: "",}, {dictLabel: "生产中", dictValue: "20",}, {
      dictLabel: "已完成",
      dictValue: "30",
    }],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: "126",
    title: '排产时间',
    field: 'startTime',
    align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  {
    width: "110",
    title: '产品编码',
    field: 'commodityCode',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入'}
  },
  {
    width: "110",
    title: '产品名称',
    field: 'commodityName',
    align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入'}
  },
  {width: "96", title: '订单数量(PCS)', field: 'orderQuantity', align: 'center'},
  {width: "90", title: '订单面积(㎡)', field: 'orderArea', align: 'center'},
  {width: "100", title: '排产数量(PNL)', field: 'productionPnlQuantity', align: 'center'},
  {width: "100", title: '生产面积(㎡)', field: 'productionArea', align: 'center'},
]);



// 用户列表
let receiverOptions = ref([]);
//供应商列表
const supplierList = ref([]);
// 仓库列表
let storageOptions = ref([]);
// 钻咀领用抽屉可视性
const drillerReceiveVisible =ref(false);
// 钻咀排产信息抽屉可视性
const viewRelevancyMsgVisible =ref(false);
// 钻咀归还总仓抽屉可视性
const drillerReturnZCVisible =ref(false);
// 钻咀领用归还抽屉可视性
const drillerReceiveReturnVisible =ref(false);
// 钻咀领用研磨抽屉可视性
const drillerReceiveAbradeVisible =ref(false);
// 钻咀领用报废抽屉可视性
const drillerReceiveScrapVisible =ref(false);
// 钻咀领用报废抽屉可视性
const drillerAbradeScrapVisible =ref(false);
// 钻咀研磨归还抽屉可视性
const drillerAbradeReturnVisible =ref(false);
// 初始标题
const drillerReceiveTitle = ref("钻咀分仓领用");
const drillerRelevancyTitle = ref("钻咀关联排产信息");
const drillerReturnZCTitle = ref("钻咀归还");
const drillerReceiveReturnTitle = ref("钻咀领用归还");
const drillerReceiveAbradeTitle = ref("钻咀领用研磨");
const drillerReceiveScrapTitle = ref("钻咀领用报废");
const drillerAbradeScrapTitle = ref("钻咀研磨报废");
const drillerAbradeReturnTitle = ref("钻咀研磨归还");


/**
 * 钻咀分仓库存列表点击领用
 */
const clickReceiveDriller = async (row) => {
  receiveFromData.value.drillerInventoryId = row.id;
  drillerReceiveVisible.value = true;
  receiveFromData.value.abrasiveNumber = row.abrasiveNumber;
  receiveFromData.value.canUseNumber = row.canUseNumber;
  receiveFromData.value.quantity = row.quantity;
  drillerReceiveTitle.value = row.materialCode + ': 钻咀分仓领用';
  // setTimeout(() =>{
  //   recInventoryRef.value.focus();
  // },200)
}
/**
 * 钻咀领用列表查看关联排产信息
 */
const viewRelevancyMsg = async (row) => {

  if (row.productionIdList){
    viewRelevancyMsgVisible.value = true;
    viewRelevancyLoading.value = true;
    viewQueryParams.value.idList = row.productionIdList;
    const res = await listAuditProduction(viewQueryParams.value);

    viewProductionRelevancyList.value = res.rows;
    dealData(viewProductionRelevancyList.value);
    viewTotal.value = res.total;
    viewProductionRelevancyCopyList.value = deepClone(viewProductionRelevancyList.value)

    viewRelevancyLoading.value = false;
    drillerRelevancyTitle.value = row.materialCode + ': 钻咀关联排产信息';
  }

}
/**
 * 钻咀分仓库存列表点击操作-->归还总仓
 */
const clickReturnZCDriller = async (row) => {
  returnZCFromData.value.id = row.id;
  drillerReturnZCVisible.value = true;
  returnZCFromData.value.abrasiveNumber = row.abrasiveNumber;
  returnZCFromData.value.canUseNumber = row.canUseNumber;
  returnZCFromData.value.quantity = row.quantity;
  returnZCFromData.value.storageId = row.storageId;
  drillerReturnZCTitle.value = row.materialCode + ': 钻咀归还总仓';
  // setTimeout(() =>{
  //   recReturnZCRef.value.focus();
  // },200)
}

/**
 * 钻咀领用页面点击操作-->归还
 */
const drillerReceiveReturn = (row) => {
  drillerReceiveReturnVisible.value = true;
  receiveReturnFormData.value.id = row.id;
  receiveReturnFormData.value.drillerInventoryId = row.drillerInventoryId;
  receiveReturnFormData.value.abrasiveNumber = row.abrasiveNumber;
  receiveReturnFormData.value.canUseNumber = row.canUseNumber;
  receiveReturnFormData.value.receivedQuantity = row.receivedQuantity;
  receiveReturnFormData.value.receiveReturnedQuantity = row.receiveReturnedQuantity;
  receiveReturnFormData.value.canReturnQuantity = row.canReturnQuantity;
  receiveReturnFormData.value.receiveScrapQuantity = row.receiveScrapQuantity;
  drillerReceiveReturnTitle.value = row.materialCode + ': 钻咀归还分仓';
  // setTimeout(() =>{
  //   recReturnRef.value.focus();
  // },100)
}

/**
 * 钻咀研磨页面点击操作-->归还
 */
const drillerAbradeReturn = (row) => {
  drillerAbradeReturnVisible.value = true;
  abradeReturnFormData.value.id = row.id;
  abradeReturnFormData.value.drillerInventoryId = row.drillerInventoryId;
  abradeReturnFormData.value.abrasiveNumber = row.abrasiveNumber -1;
  abradeReturnFormData.value.useNumber = row.useNumber + 1;
  abradeReturnFormData.value.canUseNumber = row.canUseNumber -1;
  abradeReturnFormData.value.abradeQuantity = row.abradeQuantity;
  abradeReturnFormData.value.abradeReturnedQuantity = row.abradeReturnedQuantity;
  abradeReturnFormData.value.canReturnQuantity = row.abradeQuantity -row.abradeReturnedQuantity -row.abradeScrapQuantity;
  abradeReturnFormData.value.abradeScrapQuantity = row.abradeScrapQuantity;
  drillerAbradeReturnTitle.value = row.materialCode + ': 钻咀归还分仓';
  // setTimeout(() =>{
  //   abrReturnRef.value.focus();
  // },200)
}

/**
 * 钻咀领用页面点击操作-->研磨
 */
const drillerAbrade = (row) => {
  drillerReceiveAbradeVisible.value = true;
  receiveAbradeFormData.value.receiveId = row.id;
  receiveAbradeFormData.value.drillerInventoryId = row.drillerInventoryId;
  receiveAbradeFormData.value.rawMaterialId = row.rawMaterialId;
  receiveAbradeFormData.value.abrasiveNumber = row.abrasiveNumber;
  receiveAbradeFormData.value.canUseNumber = row.canUseNumber;
  receiveAbradeFormData.value.useNumber = row.useNumber;
  receiveAbradeFormData.value.receivedQuantity = row.receivedQuantity;
  receiveAbradeFormData.value.receiveReturnedQuantity = row.receiveReturnedQuantity;
  receiveAbradeFormData.value.canReturnQuantity = row.canReturnQuantity;
  receiveAbradeFormData.value.receiveScrapQuantity = row.receiveScrapQuantity;
  receiveAbradeFormData.value.receiveAbradeQuantity = row.receiveAbradeQuantity;
  drillerReceiveAbradeTitle.value = row.materialCode + ': 钻咀领用研磨';
  // setTimeout(() =>{
  //   recAbradeRef.value.focus();
  // },200)
}

/**
 * 钻咀领用页面点击操作-->报废
 */
const drillerScrap = (row) => {
  drillerReceiveScrapVisible.value = true;
  receiveScrapFormData.value.receiveId = row.id;
  receiveScrapFormData.value.drillerInventoryId = row.drillerInventoryId;
  receiveScrapFormData.value.rawMaterialId = row.rawMaterialId;
  receiveScrapFormData.value.abrasiveNumber = row.abrasiveNumber;
  receiveScrapFormData.value.canUseNumber = row.canUseNumber;
  receiveScrapFormData.value.useNumber = row.useNumber;
  receiveScrapFormData.value.receivedQuantity = row.receivedQuantity;
  receiveScrapFormData.value.receiveReturnedQuantity = row.receiveReturnedQuantity;
  receiveScrapFormData.value.canReturnQuantity = row.canReturnQuantity;
  receiveScrapFormData.value.receiveScrapQuantity = row.receiveScrapQuantity;
  receiveScrapFormData.value.receiveAbradeQuantity = row.receiveAbradeQuantity;
  // receiveScrapFormData.value.scrapCoordinatorId = row.receiveUserId;
  drillerReceiveScrapTitle.value = row.materialCode + ': 钻咀领用报废';
  // setTimeout(() =>{
  //   recScrapRef.value.focus();
  // },200)
}

/**
 * 钻咀研磨页面点击操作-->报废
 */
const drillerAbradeScrap = (row) => {
  drillerAbradeScrapVisible.value = true;
  abradeScrapFormData.value.id = row.id;
  abradeScrapFormData.value.drillerInventoryId = row.drillerInventoryId;
  abradeScrapFormData.value.rawMaterialId = row.rawMaterialId;
  abradeScrapFormData.value.abrasiveNumber = row.abrasiveNumber -1;
  abradeScrapFormData.value.canUseNumber = row.canUseNumber -1;
  abradeScrapFormData.value.useNumber = row.useNumber +1;
  abradeScrapFormData.value.abradeQuantity = row.abradeQuantity;
  abradeScrapFormData.value.abradeReturnedQuantity = row.abradeReturnedQuantity;
  abradeScrapFormData.value.canReturnQuantity = row.abradeQuantity -row.abradeReturnedQuantity -row.abradeScrapQuantity;
  abradeScrapFormData.value.abradeScrapQuantity = row.abradeScrapQuantity;
  abradeScrapFormData.value.abradeQuantity = row.abradeQuantity;
  abradeScrapFormData.value.scrapSupplierId = row.supplierId;
  drillerAbradeScrapTitle.value = row.materialCode + ': 钻咀研磨报废';
  // setTimeout(() =>{
  //   abrScrapRef.value.focus();
  // },200)
}

/**
 * 初始化领用钻咀表单数据
 */
let receiveFromData = ref({
  abrasiveNumber: undefined,
  drillerInventoryId: undefined,
  canUseNumber: undefined,
  quantity: undefined,
  NickName: undefined,
  receiveUserId: undefined,
  receivedQuantity: undefined,
  relevancyPc: [],
  remark: ''
})

/**
 * 初始化钻咀归还总仓表单数据
 */
let returnZCFromData = ref({
  abrasiveNumber: undefined,
  id: undefined,
  canUseNumber: undefined,
  quantity: undefined,
  returnQuantity: undefined,
  storageId: undefined,
  remark: ''
})

/**
 * 初始化钻咀领用归还表单数据
 */
let receiveReturnFormData = ref({
  abrasiveNumber: undefined,
  id: undefined,
  drillerInventoryId: undefined,
  canUseNumber: undefined,
  quantity: undefined,
  receivedQuantity: undefined,
  receiveReturnedQuantity: undefined,
  receiveScrapQuantity: undefined,
  returnQuantity: undefined,
  remark: ''
})
/**
 * 初始化钻咀研磨归还表单数据
 */
let abradeReturnFormData = ref({
  abrasiveNumber: undefined,
  id: undefined,
  drillerInventoryId: undefined,
  canUseNumber: undefined,
  quantity: undefined,
  abradedQuantity: undefined,
  abradeReturnedQuantity: undefined,
  abradeScrapQuantity: undefined,
  returnQuantity: undefined,
  remark: ''
})

/**
 * 初始化钻咀领用研磨表单数据
 */
let receiveAbradeFormData = ref({
  id: undefined,
  rawMaterialId: undefined,
  drillerInventoryId: undefined,
  abrasiveNumber: undefined,
  canUseNumber: undefined,
  useNumber: undefined,
  quantity: undefined,
  receivedQuantity: undefined,
  receiveReturnedQuantity: undefined,
  receiveScrapQuantity: undefined,
  receiveAbradeQuantity: undefined,
  abradeQuantity: undefined,
  supplierId: undefined,
  abradePrice: undefined,
  sumPrice: undefined,
  remark: ''
})
/**
 * 初始化钻咀领用报废表单数据
 */
let receiveScrapFormData = ref({
  id: undefined,
  rawMaterialId: undefined,
  drillerInventoryId: undefined,
  abrasiveNumber: undefined,
  canUseNumber: undefined,
  useNumber: undefined,
  quantity: undefined,
  receivedQuantity: undefined,
  receiveReturnedQuantity: undefined,
  receiveScrapQuantity: undefined,
  receiveAbradeQuantity: undefined,
  scrapQuantity: undefined,
  scrapSupplierId: undefined,
  abradePrice: undefined,
  sumPrice: undefined,
  scrapType: '0',
  scrapCoordinatorId: undefined,
  remark: ''
})
/**
 * 初始化钻咀研磨报废表单数据
 */
let abradeScrapFormData = ref({
  id: undefined,
  rawMaterialId: undefined,
  drillerInventoryId: undefined,
  abrasiveNumber: undefined,
  canUseNumber: undefined,
  useNumber: undefined,
  quantity: undefined,
  abradeQuantity: undefined,
  abradeReturnedQuantity: undefined,
  abradeScrapQuantity: undefined,
  scrapQuantity: undefined,
  scrapSupplierId: undefined,
  abradePrice: undefined,
  sumPrice: undefined,
  scrapType: '1',
  scrapCoordinatorId: undefined,
  remark: ''
})
// 初始化各抽屉表单ref
const receiveFormRef = ref();
const returnZCFormRef = ref();
const receiveReturnFormRef = ref();
const abradeReturnFormRef = ref();
const receiveAbradeFormRef = ref();
const receiveScrapFormRef = ref();
const abradeScrapFormRef = ref();
// 初始化各抽屉聚焦属性ref
const recInventoryRef = ref();
const recReturnRef = ref();
const recReturnZCRef = ref();
const recAbradeRef = ref();
const recScrapRef = ref();
const abrReturnRef = ref();
const abrScrapRef = ref();
/**
 * 领用表单填写规则
 */
const receiveFormRule = ref({
  receiveUserId: [
    { required: true, message: '领用人不能为空', trigger: 'change' }
  ],
  receivedQuantity: [
    { required: true, message: '领用数量不能为空', trigger: 'change' }
  ]
})
/**
 * 归还总仓表单填写规则
 */
const returnZCFormRule = ref({
  returnQuantity: [
    { required: true, message: '归还数量不能为空', trigger: 'change' }
  ],
  storageId: [
    { required: true, message: '入库仓不能为空', trigger: 'change' }
  ]
})

/**
 * 领用归还表单填写规则
 */
const receiveReturnFormRule = ref({
  returnQuantity: [
    { required: true, message: '归还数量不能为空', trigger: 'change' }
  ]
})
/**
 * 研磨归还表单填写规则
 */
const abradeReturnFormRule = ref({
  returnQuantity: [
    { required: true, message: '归还数量不能为空', trigger: 'change' }
  ]
})

/**
 * 领用研磨表单填写规则
 */
const receiveAbradeFormRule = ref({
  abradeQuantity: [
    { required: true, message: '研磨数量不能为空', trigger: 'change' }
  ],
  supplierId: [
    { required: true, message: '研磨供应商不能为空', trigger: 'change' }
  ],
  abradePrice: [
    { required: true, message: "研磨单价不能为空", trigger: "blur" },
    //大于0
    { validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error("单价必须大于0"));
        }else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(Number(value).toString())) {
          callback(new Error("最多两位小数"));
        } else {
          callback();
        }
      }, trigger: "blur" },
    // 最多10个字符
    {
      max: 10,
      message: "长度不能超过8",
      trigger: "blur"
    }
  ],
})

/**
 * 领用报废表单填写规则
 */
const receiveScrapFormRule = ref({
  scrapQuantity: [
    { required: true, message: '报废数量不能为空', trigger: 'change' }
  ],
  scrapType: [
    { required: true, message: '报废类型不能为空', trigger: 'change' }
  ],
  scrapCoordinatorId: [
    { required: true, message: '报废责任人不能为空', trigger: 'change' }
  ],
})

/**
 * 研磨报废表单填写规则
 */
const abradeScrapFormRule = ref({
  scrapQuantity: [
    { required: true, message: '报废数量不能为空', trigger: 'change' }
  ],
  scrapType: [
    { required: true, message: '报废类型不能为空', trigger: 'change' }
  ],
  scrapCoordinatorId: [
    { required: true, message: '报废责任人不能为空', trigger: 'change' }
  ],
  scrapSupplierId: [
    { required: true, message: '责任供应商不能为空', trigger: 'change' }
  ]
})


/**
 * 初始化领用表数据
 */
const resetReceiveForm = () => {
  drillerReceiveVisible.value = false;
  // 初始化提交数据
  receiveFromData = ref({
    abrasiveNumber: undefined,
    drillerInventoryId: undefined,
    canUseNumber: undefined,
    quantity: undefined,
    NickName: undefined,
    receiveUserId: undefined,
    receivedQuantity: undefined,
    relevancyPc: [],
    remark: ''
  });
  confirmSelectInventoryList.value = []
};


/**
 * 初始化关联排产信息抽屉数据
 */
const resetRelevancyForm = () => {
  viewRelevancyMsgVisible.value = false;
  viewQueryParams.value =  {
    isAsc: "desc",
    orderByColumn: "create_time",
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
    params: {},
    idList: []
  };
  viewProductionRelevancyList.value = []
};

/**
 * 初始化归还总仓表单数据
 */
const resetReturnZCForm = () => {
  drillerReturnZCVisible.value = false;
  // 初始化提交数据
  returnZCFromData = ref({
    abrasiveNumber: undefined,
    id: undefined,
    canUseNumber: undefined,
    quantity: undefined,
    returnQuantity: undefined,
    storageId: undefined,
    remark: ''
  })
};

/**
 * 初始化领用归还表单数据
 */
const resetReceiveReturnForm = () => {
  drillerReceiveReturnVisible.value = false;
  // 初始化提交数据
  receiveReturnFormData = ref({
    abrasiveNumber: undefined,
    id: undefined,
    canUseNumber: undefined,
    quantity: undefined,
    returnQuantity: undefined,
    remark: ''
  })
};
/**
 * 初始化研磨归还表单数据
 */
const resetAbradeReturnForm = () => {
  drillerAbradeReturnVisible.value = false;
  // 初始化提交数据
  abradeReturnFormData = ref({
    abrasiveNumber: undefined,
    id: undefined,
    canUseNumber: undefined,
    quantity: undefined,
    returnQuantity: undefined,
    remark: ''
  })
};
/**
 * 初始化领用研磨表单数据
 */
const resetReceiveAbradeForm = () => {
  drillerReceiveAbradeVisible.value = false;
  // 初始化提交数据
  receiveAbradeFormData = ref({
    id: undefined,
    rawMaterialId: undefined,
    drillerInventoryId: undefined,
    abrasiveNumber: undefined,
    canUseNumber: undefined,
    useNumber: undefined,
    quantity: undefined,
    receivedQuantity: undefined,
    receiveReturnedQuantity: undefined,
    receiveScrapQuantity: undefined,
    receiveAbradeQuantity: undefined,
    canReturnQuantity: undefined,
    abradeQuantity: undefined,
    supplierId: undefined,
    abradePrice: undefined,
    sumPrice: undefined,
    remark: ''
  })
};

/**
 * 初始化领用报废表单数据
 */
const resetReceiveScrapForm = () => {
  drillerReceiveScrapVisible.value = false;
  // 初始化提交数据
  receiveScrapFormData = ref({
    id: undefined,
    rawMaterialId: undefined,
    drillerInventoryId: undefined,
    abrasiveNumber: undefined,
    canUseNumber: undefined,
    useNumber: undefined,
    quantity: undefined,
    receivedQuantity: undefined,
    receiveReturnedQuantity: undefined,
    receiveScrapQuantity: undefined,
    receiveAbradeQuantity: undefined,
    scrapQuantity: undefined,
    scrapSupplierId: undefined,
    abradePrice: undefined,
    sumPrice: undefined,
    scrapType: '0',
    scrapCoordinatorId: undefined,
    remark: ''
  })
};

/**
 * 初始化研磨报废表单数据
 */
const resetAbradeScrapForm = () => {
  drillerAbradeScrapVisible.value = false;
  // 初始化提交数据
  abradeScrapFormData = ref({
    id: undefined,
    rawMaterialId: undefined,
    drillerInventoryId: undefined,
    abrasiveNumber: undefined,
    canUseNumber: undefined,
    useNumber: undefined,
    quantity: undefined,
    abradeQuantity: undefined,
    abradeReturnedQuantity: undefined,
    abradeScrapQuantity: undefined,
    scrapQuantity: undefined,
    scrapSupplierId: undefined,
    abradePrice: undefined,
    sumPrice: undefined,
    scrapType: '1',
    scrapCoordinatorId: undefined,
    remark: ''
  })
};

/**
 * 领用钻咀
 */
const receiveDriller = () => {

  confirmSelectInventoryList.value.forEach(item => receiveFromData.value.relevancyPc.push(item.id));

  receiveFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      commitReceiveDriller({
        data: receiveFromData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetReceiveForm();
        refreshTableData();
      });
    }

  })
}

/**
 * 归还总仓
 */
const returnZCDriller = () => {

  returnZCFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      returnMainStorage({
        data: returnZCFromData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetReturnZCForm();
        refreshTableData();
      });
    }

  })
}

/**
 * 领用归还
 */
const receiveReturnDriller = () => {

  receiveReturnFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      receiveReturn({
        data: receiveReturnFormData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetReceiveReturnForm();
        refreshDrillerReceiveTableData();
      });
    }

  })
}
/**
 * 研磨归还
 */
const abradeReturnDriller = () => {

  abradeReturnFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      abradeReturn({
        data: abradeReturnFormData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetAbradeReturnForm();
        refreshDrillerAbradeTableData();
      });
    }

  })
}

/**
 * 领用研磨
 */
const receiveAbradeDriller = () => {

  receiveAbradeFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      receiveAbrade({
        data: receiveAbradeFormData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetReceiveAbradeForm();
        refreshDrillerReceiveTableData();
      });
    }

  })
}

/**
 * 领用报废
 */
const receiveScrapDriller = () => {

  receiveScrapFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      receiveScrap({
        data: receiveScrapFormData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetReceiveScrapForm();
        refreshDrillerReceiveTableData();
      });
    }

  })
}

/**
 * 研磨报废
 */
const abradeScrapDriller = () => {

  abradeScrapFormRef.value.validate((valid, fields) => {

    if (!valid) {
      console.log('error submit!', fields)
    }else{
      abradeScrap({
        data: abradeScrapFormData.value
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "提交成功",
          });
        }).finally(() => {
        resetAbradeScrapForm();
        refreshDrillerAbradeTableData();
      });
    }

  })
}

/**
 * 标签页变更时触发刷新接口
 */
const changeTab = (name) => {
  if (name === '0'){
    refreshTableData();
  }else  if (name === '1'){
    refreshDrillerReceiveTableData();
  }else  if (name === '2'){
    refreshAbradeTableData();
  }else  if (name === '3'){
    refreshOperationRecordTableData();
  }
}

// 声名需要处理的时间查询条件字段
const intervalCondition = ['updateTime','createTime','startTime',];
// 初始化钻咀可用库存页面查询参数
const { drillerInventoryQueryParams } = toRefs(reactive({
  drillerInventoryQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    updateTimeStart: undefined,
    updateTimeEnd: undefined
  }
}));
const drillerInventoryTableTotal = ref(0);
const drillerInventoryTableData = ref([]);
const drillerInventoryTableLoading = ref(false);
const sortCondition = [
  'quantity',
  'updateTime',
  'useNumber',
  'createTime',
  'startTime',
  'receivedQuantity',
  'receiveReturnedQuantity',
  'receiveAbradeQuantity',
  'receiveScrapQuantity',
  'abradeQuantity',
  'abradeReturnedQuantity',
  'abradePrice',
  'sumPrice'
];
const drillerInventoryColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: '库存编码', field: 'code', width: '125', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料分类', field: 'categoryName', width: '70', align: 'center', filterParam: { placeholder: '请输入物料分类' } },
  { title: '物料编码', field: 'materialCode', width: '90', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '90', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '规格型号', field: 'specification', width: '100', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '材质牌号', field: 'materialQuality', width: '90', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '库存单位', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入库存单位名称' }, },
  { title: '存货仓', field: 'storageName', width: '120', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '可研磨次数', field: 'abrasiveNumber', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '可使用次数', field: 'canUseNumber', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '使用次数', sortable: true, field: 'useNumber', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: "最新领用时间"  , sortable: true,  width: "140", field: "updateTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '库存数' , sortable: true , field: 'quantity', width: '85', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '操作' ,  align: "center", field: "make",width: '160',fixed: 'right' }
]);



// 初始化钻咀领用查询参数
const { drillerReceiveQueryParams } = toRefs(reactive({
  drillerReceiveQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined
  }
}));
const drillerReceiveTableTotal = ref(0);
const drillerReceiveTableData = ref([]);
const drillerReceiveTableLoading = ref(false);
const drillerReceiveColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: '领用编码', field: 'code', width: '116', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料分类', field: 'categoryName', width: '70', align: 'center', filterParam: { placeholder: '请输入物料分类' } },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '直径', field: 'diameter', width: '54', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '品牌', field: 'manufacturer', width: '54', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '库存单位', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '可研磨次数', field: 'abrasiveNumber', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '可使用次数', field: 'canUseNumber', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '使用次数', field: 'useNumber', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '领用数量', sortable: true, field: 'receivedQuantity', width: '100', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '可操作数量', field: 'canReturnQuantity', width: '100', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '领用归还数量', sortable: true, field: 'receiveReturnedQuantity', width: '120', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '领用研磨数量', sortable: true, field: 'receiveAbradeQuantity', width: '120', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '领用报废数量', sortable: true, field: 'receiveScrapQuantity', width: '120', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '领用人', field: 'receiveUserName', width: '70', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: "领用时间", sortable: true, width: "130", field: "createTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '关联信息',  align: "center", width: '70', field: "relevancy" },
  { title: '操作',  align: "center", field: "make" ,fixed: 'right' , width: '150', showOverflow: false  }
]);


// 初始化钻咀研磨查询参数
const { drillerAbradeQueryParams } = toRefs(reactive({
  drillerAbradeQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined,
    saleOrderCode:undefined,
    customerCode:undefined,
    commodityCode:undefined,
    commodityName:undefined,
    createByName:undefined,
    handleBy:undefined,
    handleTime:undefined,
    handleTimeStart: undefined,
    handleTimeEnd: undefined
  }
}));
const drillerAbradeTableTotal = ref(0);
const drillerAbradeTableData = ref([]);
const drillerAbradeTableLoading = ref(false);
const drillerAbradeColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: '领用编码', field: 'receiveCode', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '研磨编码', field: 'code', width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料分类', field: 'categoryName', width: '70', align: 'center'},
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '直径', field: 'diameter', width: '54', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '品牌', field: 'manufacturer', width: '54', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '库存单位', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  // { title: '可研磨次数', field: 'abrasiveNumber', width: '70', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入可研磨次数' } },
  { title: '研磨数量', sortable: true, field: 'abradeQuantity', width: '100', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '研磨还回数量', sortable: true, field: 'abradeReturnedQuantity', width: '120', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '研磨报废数量', sortable: true, field: 'abradeScrapQuantity', width: '120', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '研磨供应商', field: 'supplierName', width: '116', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '研磨单价', sortable: true, field: 'abradePrice', width: '100', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '研磨价格', sortable: true, field: 'sumPrice', width: '100', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: "研磨时间", sortable: true, width: "130", field: "createTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '操作'  , width: "100",  align: "center", field: "make" ,fixed: 'right' }
]);


// 钻咀操作类型枚举
const operationTypeData = ref([
  { label: '领料入库',value: "0", type: 'primary',effect:'light' },
  { label: '归还总仓', value: "1", type: 'primary',effect:'light' },
  { label: '领用', value: "2", type: 'primary',effect:'light' },
  { label: '领用归还', value: "3", type: 'success',effect:'light' },
  { label: '领用报废', value: "4", type: 'danger',effect:'light' },
  { label: '研磨', value: "5", type: 'primary',effect:'light' },
  { label: '研磨归还', value: "6", type: 'success',effect:'light' },
  { label: '研磨报废', value: "7", type: 'danger',effect:'light' },
  { label: '自动报废', value: "8", type: 'warning',effect:'light' },
])
// 钻咀报废类型枚举
const scrapTypeData = ref([
  { label: '责任在本厂',value: "0" },
  { label: '责任在供应商', value: "1" }
])

// 初始化钻咀操作记录查询参数
const { drillerOperationRecordQueryParams } = toRefs(reactive({
  drillerOperationRecordQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined,
    saleOrderCode:undefined,
    customerCode:undefined,
    commodityCode:undefined,
    commodityName:undefined,
    createByName:undefined,
    handleBy:undefined,
    handleTime:undefined,
    handleTimeStart: undefined,
    handleTimeEnd: undefined
  }
}));
// 初始化供应商查询参数
const { supplierQueryParams } = toRefs(reactive({
  // 此处供应商表的数据库备注和代码备注均有问题,实际上status:1才是启用,0是禁用
  supplierQueryParams: {
    status: '1'
  }
}));
const drillerOperationRecordTableTotal = ref(0);
const drillerOperationRecordTableData = ref([]);
const drillerOperationRecordTableLoading = ref(false);
const drillerOperationRecordColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  {
    title: '操作类型',
    field: 'operationType',
    width: '100',
    align: 'center',
    filterType: 'radioButton',
    filterParam: {placeholder: '请输入物料分类'},
    filterData: () => operationTypeData.value,
    filterCustom: {label: 'label', value: 'value'}
  },
  { title: '操作人', field: 'createByName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料分类' } },
  { title: "操作日期", sortable: true, width: "130", field: "createTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '操作数量', field: 'operationQuantity', width: '70', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '编码', field: 'code', width: '130', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { title: '物料名称', field: 'materialName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '材质牌号', field: 'materialQuality', width: '60', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '直径', field: 'diameter', width: '60', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '品牌', field: 'manufacturer', width: '60', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '库存单位', field: 'units', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位名称' }, },
  { title: '可研磨次数', field: 'abrasiveNumber', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '可使用次数', field: 'canUseNumber', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '使用次数', field: 'useNumber', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '存货仓', field: 'inventoryStorageName', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '归还仓', field: 'storageName', width: '80', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '报废类型', field: 'scrapType', width: '80', align: 'center' ,
    filterType: 'radioButton',
    filterParam: {placeholder: '请输入报废类型'},
    filterData: () => scrapTypeData.value,
    filterCustom: {label: 'label', value: 'value'}},
  { title: '报废责任人', field: 'scrapCoordinatorName', width: '90', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '报废供应商', field: 'supplierName', width: '160', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
  { title: '备注', field: 'remark', width: '160', align: 'center' ,filterType: 'input', filterParam: { placeholder: '' }},
]);

/**
 * 分仓库存列表搜索条件更新
 */
const drillerInventorySearchChange = (param) => {
  drillerInventoryQueryParams.value = {...param}
  drillerInventoryQueryParams.value.orderStatus='0';//状态值0:待提交
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      drillerInventoryQueryParams.value.orderByColumn = item.prop;
      drillerInventoryQueryParams.value.isAsc = item.order;
    })
  }
  refreshTableData();
}


/**
 * 发送查询请求,刷新库存列表页面数据
 */
const refreshTableData = () => {
  drillerInventoryTableLoading.value = true;
  listDrillerInventory(drillerInventoryQueryParams.value)
    .then((res) => {
      drillerInventoryTableData.value = res.rows;
      drillerInventoryTableTotal.value = res.total;
    })
    .finally(() => {
      drillerInventoryTableLoading.value = false;
    })
}

/**
 * 研磨列表搜索条件更新
 */
const drillerAbradeSearchChange = (param) => {
  drillerAbradeQueryParams.value = {...param}
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      drillerAbradeQueryParams.value.orderByColumn = item.prop;
      drillerAbradeQueryParams.value.isAsc = item.order;
    })
  }
  refreshAbradeTableData();
}

/**
 * 操作记录列表搜索条件更新
 */
const drillerOperationRecordSearchChange = (param) => {
  drillerOperationRecordQueryParams.value = {...param}
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      drillerOperationRecordQueryParams.value.orderByColumn = item.prop;
      drillerOperationRecordQueryParams.value.isAsc = item.order;
    })
  }
  refreshOperationRecordTableData();
}


/**
 * 刷新研磨页面数据
 */
const refreshAbradeTableData = () => {
  drillerAbradeTableLoading.value = true;
  drillerAbradeQueryParams.value.orderStatus = '2';//状态值2:已回复
  listDrillerAbrade(drillerAbradeQueryParams.value)
    .then((res) => {
      drillerAbradeTableData.value = res.rows;
      drillerAbradeTableTotal.value = res.total;
    })
    .finally(() => {
      drillerAbradeTableLoading.value = false;
    })
}

/**
 * 刷新操作记录页面数据
 */
const refreshOperationRecordTableData = () => {
  drillerOperationRecordTableLoading.value = true;
  listDrillerRecord(drillerOperationRecordQueryParams.value)
    .then((res) => {
      drillerOperationRecordTableData.value = res.rows;
      drillerOperationRecordTableTotal.value = res.total;
    })
    .finally(() => {
      drillerOperationRecordTableLoading.value = false;
    })
}




/**
 * 领用列表条件更新
 */
const drillerReceiveSearchChange = (param) => {
  drillerReceiveQueryParams.value = {...param}
  if (param.sorts && param.sorts.length > 0) {
    param.sorts.forEach((item) => {
      drillerReceiveQueryParams.value.orderByColumn = item.prop;
      drillerReceiveQueryParams.value.isAsc = item.order;
    })
  }
  refreshDrillerReceiveTableData();
}

/**
 * 刷新钻咀领用列表页面数据
 */
const refreshDrillerReceiveTableData = () => {
  drillerReceiveTableLoading.value = true;
  listDrillerReceive(drillerReceiveQueryParams.value)
    .then((res) => {
      drillerReceiveTableData.value = res.rows;
      drillerReceiveTableTotal.value = res.total;
    })
    .finally(() => {
      drillerReceiveTableLoading.value = false;
    })
}
/**
 * 刷新钻咀研磨列表页面数据
 */
const refreshDrillerAbradeTableData = () => {
  drillerAbradeTableLoading.value = true;
  listDrillerAbrade(drillerAbradeQueryParams.value)
    .then((res) => {
      drillerAbradeTableData.value = res.rows;
      drillerAbradeTableTotal.value = res.total;
    })
    .finally(() => {
      drillerAbradeTableLoading.value = false;
    })
}



/** 定义代理对象 */
const {proxy} = getCurrentInstance();
/** 库存页导出按钮操作 */
const drillerInventoryExport = () => {

  if (drillerInventoryTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("purchase/materialDrillerInventory/export", {
          ...drillerInventoryQueryParams.value
        }, `钻咀分仓库存列表模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    drillerInventoryQueryParams.value.updateTimeStart === undefined &&
    drillerInventoryQueryParams.value.updateTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置时间筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportInventoryList
    )
  }else{
    exportInventoryList();
  }
};

const exportInventoryList = () => {
  proxy?.download("purchase/materialDrillerInventory/export", {
    ...drillerInventoryQueryParams.value
  }, `钻咀分仓库存列表_${new Date().getTime()}.xlsx`);
}

/** 领用页导出按钮操作 */
const drillerReceiveExport = () => {

  if (drillerReceiveTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("purchase/materialDrillerReceive/export", {
          ...drillerReceiveQueryParams.value
        }, `钻咀领用列表模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    drillerReceiveQueryParams.value.createTimeStart === undefined &&
    drillerReceiveQueryParams.value.createTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置时间筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportReceiveList
    )
  }else{
    exportReceiveList();
  }
};

const exportReceiveList = () => {
  proxy?.download("purchase/materialDrillerReceive/export", {
    ...drillerReceiveQueryParams.value
  }, `钻咀领用列表_${new Date().getTime()}.xlsx`);
}

/** 研磨页导出按钮操作 */
const drillerAbradeExport = () => {

  if (drillerAbradeTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("purchase/materialDrillerAbrade/export", {
          ...drillerAbradeQueryParams.value
        }, `钻咀研磨列表模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    drillerAbradeQueryParams.value.createTimeStart === undefined &&
    drillerAbradeQueryParams.value.createTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置时间筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportAbradeList
    )
  }else{
    exportAbradeList();
  }
};

const exportAbradeList = () => {
  proxy?.download("purchase/materialDrillerAbrade/export", {
    ...drillerAbradeQueryParams.value
  }, `钻咀研磨列表_${new Date().getTime()}.xlsx`);
}

/** 库存页导出按钮操作 */
const drillerRecordExport = () => {

  if (drillerOperationRecordTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("purchase/materialDrillerRecord/export", {
          ...drillerOperationRecordQueryParams.value
        }, `钻咀操作记录列表模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    drillerOperationRecordQueryParams.value.createTimeStart === undefined &&
    drillerOperationRecordQueryParams.value.createTimeEnd   === undefined
  ){
    ElMessageBox.confirm(
      '没有设置时间筛选条件，将默认导出30天内的数据',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(
      exportRecordList
    )
  }else{
    exportRecordList();
  }
};

const exportRecordList = () => {
  proxy?.download("purchase/materialDrillerRecord/export", {
    ...drillerOperationRecordQueryParams.value
  }, `钻咀操作记录列表_${new Date().getTime()}.xlsx`);
}

/** 渲染完页面后刷新页面数据 */
onMounted(async () => {
  drillerInventoryQueryParams.value.orderStatus = '0';
  refreshTableData();
  let userData;
  userData = await listUserByOwnerId(ownerId);
  receiverOptions.value = userData.data;
  let supplierResponse = await listSupplier(supplierQueryParams.value);
  supplierList.value = supplierResponse.rows;
  let storageData;
  storageData = await listMaterialStorage();
  storageOptions.value = storageData.rows;
});

</script>


<style scoped lang="scss">

:deep(.number-left) {
  .el-input__wrapper {
    padding-left: 11px;
    padding-right: 7px;
  }
  .el-input__inner {
    text-align: left;
  }
}

</style>



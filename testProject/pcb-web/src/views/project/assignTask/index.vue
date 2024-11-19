<template>
  <div class="p-2 xtable-page">
    <div class="search" v-show="showSearch">
      <el-row>
        <el-col :span="16">
          <div style="display: inline-flex" v-if="currentType == 0">
            <span style="width: 100px;">下单日期：</span>
            <el-date-picker v-model="queryParams.placeOrderTimeStart" style="width: 30%;"
                            type="date" placeholder="选择日期时间"
                            clearable
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD 00:00:00" :clearable="false"/>
            -
            <el-date-picker v-model="queryParams.placeOrderTimeEnd" style="width: 30%;"
                            type="date" placeholder="选择日期时间"
                            clearable
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD 23:59:59" :clearable="false"/>
            <el-button @click="changeList()"   type="primary"
                       style="margin-left: 3px">查询
            </el-button>
          </div>

          <div style="display: inline-flex" v-if="currentType == 2">
            <span style="width: 100px;">下单日期：</span>
            <el-date-picker v-model="queryPageParamsHistory.placeOrderTimeStart" style="width: 30%;"
                            type="datetime" placeholder="选择日期时间"
                            clearable
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD 00:00:00" :clearable="false"/>
            -
            <el-date-picker v-model="queryPageParamsHistory.placeOrderTimeEnd" style="width: 30%;"
                            type="datetime" placeholder="选择日期时间"
                            clearable
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD 23:59:59" :clearable="false"/>
            <el-button @click="changeList()"   type="primary"
                       style="margin-left: 3px">查询
            </el-button>
          </div>

          <div style="display: inline-flex" v-if="currentType == 1">
            <span style="width: 100px;">下单日期：</span>
            <el-date-picker v-model="queryParamsOther.placeOrderTimeStart" style="width: 30%;"
                            type="datetime" placeholder="选择日期时间"
                            clearable
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD 00:00:00" :clearable="false"/>
            -
            <el-date-picker v-model="queryParamsOther.placeOrderTimeEnd" style="width: 30%;"
                            type="datetime" placeholder="选择日期时间"
                            clearable
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD 23:59:59" :clearable="false"/>
            <el-button @click="changeList()"   type="primary"
                       style="margin-left: 3px">查询
            </el-button>
          </div>

        </el-col>
        <el-col :span="8" class="global-flex flex-end">
          <div class="totalTitle" v-if="currentType == 0 || currentType == 1">结存数量:{{sumData.quantity}}&nbsp;&nbsp;|&nbsp;&nbsp; 结存面积：{{sumData.area}}㎡</div>
          <el-button v-if="(currentType == 0 || currentType == 1) &&  checkPermi(['mi:assign:allocation'])" type="primary" @click="allotUser">分配人员</el-button>
          <el-button v-if="currentType==2" type="primary " v-has-roles="['admin','superadmin']" @click="allotUser">分配人员</el-button>
          <el-button  type="primary" @click="visible = true">查看产出</el-button>
          <el-button v-if="currentType == 0 || currentType == 1" @click="exportDataBefore">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <el-tabs type="border-card" @tab-click="handleClick" class="xtable-tab">
      <el-tab-pane label="正常订单">

        <XTable :toolId="toolId" v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
                :page-params="{ perfect: true, total: total }" :data="orderList" :columnList="columnList" ref="xTable"
                @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent"
                :loading="loading" :showRefresh="true"
                :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','area','eqStartTime','eqEndTime']"
                border @searchChange="searchChange" :column-config="{ resizable: true }"
                :sort-orders="sortCondition"
                :edit-config="{trigger: 'click', enabled: true, mode: 'cell'}"
                :row-config="{ keyField: 'id' }">

          <template #header-eqHours="scope">
            EQ时长(H)
            <el-tooltip
              class="box-item"
              effect="dark"
              raw-content
              :content="`累计的EQ时长`"
            >
              <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <template #edit-miUserName="{row}">
            <vxe-select v-model="row.miUserId" :collapse-tags="true" filterable @change="userChanged(row)"
                       :disabled="!checkPermi(['mi:assign:allocation'])"
                       placeholder="请选择制作人员">
              <vxe-option
                :visible = "!item.userName.includes('FDZD')"
                v-for="item in engineerOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </vxe-select>
          </template>
          <template #edit-camUserName="{row}">
            <vxe-select v-model="row.camUserId" :collapse-tags="true" filterable @change="userChanged(row)"
             :disabled="!checkPermi(['mi:assign:allocation'])"
                        placeholder="请选择CAM工程师">
              <vxe-option
                :visible = "!item.userName.includes('FDZD')"
                v-for="item in engineerOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </vxe-select>
          </template>
          <template #default-isEqConfirm="scope">
            <el-switch
              v-if="scope.row.isEqConfirm"
              v-model="scope.row.isEqConfirm"
              :disabled="scope.row.miUserName == null"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
              @change="handleEQChange($event,scope.row)"

            />
          </template>
          <template #default-isCamConfirm="scope">
            <el-switch
              v-if="scope.row.isCamConfirm"
              v-model="scope.row.isCamConfirm"
              :disabled="scope.row.camUserName == null"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
              @change="handleCAMChange($event,scope.row)"

            />
          </template>

          <template #default-flowStatus="scope">
            <el-tag v-if="scope.row.assignTaskId==null"
                    type="info"
                    size="small">待分配
            </el-tag>
            <el-tag v-if="scope.row.assignTaskId != null && scope.row.planId ==null"
                    type="warning"
                    size="small">待制作
            </el-tag>
            <el-tag v-if="scope.row.planId !=null"
                    type="success"
                    size="small">制作中
            </el-tag>
          </template>
          <template #default-orderType="scope">
            <div v-for="item in resDictData.order_type">
              <span v-if="item.dictValue==scope.row.orderType">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-urgent="scope">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="item.dictValue==scope.row.urgent">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-model="scope">
            <div v-for="item in resDictData.order_model">
              <span v-if="item.dictValue==scope.row.model">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-make="scope">
            <el-button class="marginAndPadding" v-if="scope.row.miUserId != null && scope.row.planId == null && checkPermi(['mi:assign:allocation'])" size="small" type="primary"
                       :text="true" @click="handleDelete(scope.row)">取消分配
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="openCustomerRequire(scope.row)">客户要求
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="assignTaskUReportHandle(scope.row)">
              制作单
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="EQRecord(scope.row)">EQ记录</el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="openFile(scope.row)">文件</el-button>
          </template>
        </XTable>

      </el-tab-pane>
      <el-tab-pane label="其他订单">

        <XTable :toolId="toolIdOther" v-model:page-size="queryParamsOther.pageSize"
                v-model:current-page="queryParamsOther.pageNum" height="100%" class="xtable-content"
                :page-params="{ perfect: true, total: otherTotal }" :data="otherOrderList" :columnList="columnList3" ref="xTableOther"
                @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent"
                :loading="loading" :showRefresh="true"
                :intervalCondition="['placeOrderTime','dispatchTime','deliveryTime','area','eqStartTime','eqEndTime']"
                border @searchChange="searchChange3" :column-config="{ resizable: true }"
                :sort-orders="sortCondition"
                :edit-config="{trigger: 'click', enabled: true, mode: 'cell'}"
                :row-config="{ keyField: 'id' }">

                <template #header-eqHours="scope">
                  EQ时长(H)
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    raw-content
                    :content="`累计的EQ时长`"
                  >
                    <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>

          <template #default-orderStatus="scope">
            <el-tag style="margin-right: 2px" :type="scope.row.isInventoryShipped =='1' ? 'success' : (scope.row.flowStatus == '7' || scope.row.flowStatus == '8') ? 'warning' : scope.row.status == '3' ? 'danger' : 'primary'" >{{ scope.row.flowStatus =='10' ? '库存发货完成' : scope.row.flowStatus =='9' ? '库存发货' : scope.row.flowStatus == '7' ? '外协完成' : scope.row.flowStatus == '8' ? '外协' : scope.row.status == '3' ? '撤回' : '正常'  }}</el-tag>
          </template>
          <template #edit-miUserName="{row}">
            <vxe-select v-model="row.miUserId" :collapse-tags="true" filterable @change="userChanged(row)"
             :disabled="!checkPermi(['mi:assign:allocation'])"
                        placeholder="请选择制作人员">
              <vxe-option
                :visible = "!item.userName.includes('FDZD')"
                v-for="item in engineerOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </vxe-select>
          </template>
          <template #edit-camUserName="{row}">
            <vxe-select v-model="row.camUserId" :collapse-tags="true" filterable @change="userChanged(row)"
             :disabled="!checkPermi(['mi:assign:allocation'])"
                        placeholder="请选择CAM工程师">
              <vxe-option
                :visible = "!item.userName.includes('FDZD')"
                v-for="item in engineerOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </vxe-select>
          </template>
          <template #default-isEqConfirm="scope">
            <el-switch
             v-if="scope.row.isEqConfirm"
              v-model="scope.row.isEqConfirm"
              :disabled="scope.row.miUserName == null"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
              @change="handleEQChange($event,scope.row)"

            />
          </template>
            <template #default-isCamConfirm="scope">
            <el-switch
             v-if="scope.row.isCamConfirm"
              v-model="scope.row.isCamConfirm"
              :disabled="scope.row.camUserName == null"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
              @change="handleCAMChange($event,scope.row)"

            />
          </template>


          <template #default-flowStatus="scope">
            <el-tag v-if="scope.row.assignTaskId==null"
                    type="info"
                    size="small">待分配
            </el-tag>
            <el-tag v-if="scope.row.assignTaskId != null && scope.row.planId ==null"
                    type="warning"
                    size="small">待制作
            </el-tag>
            <el-tag v-if="scope.row.planId !=null"
                    type="success"
                    size="small">制作中
            </el-tag>
          </template>
          <template #default-orderType="scope">
            <div v-for="item in resDictData.order_type">
              <span v-if="item.dictValue==scope.row.orderType">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-urgent="scope">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="item.dictValue==scope.row.urgent">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-model="scope">
            <div v-for="item in resDictData.order_model">
              <span v-if="item.dictValue==scope.row.model">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-make="scope">
            <el-button class="marginAndPadding" v-if="scope.row.miUserId != null && scope.row.planId == null && checkPermi(['mi:assign:allocation'])" size="small" type="primary"
                       :text="true" @click="handleDelete(scope.row)">取消分配
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="openCustomerRequire(scope.row)">客户要求
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="assignTaskUReportHandle(scope.row)">
              制作单
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="EQRecord(scope.row)">EQ记录</el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="openFile(scope.row)">文件</el-button>
          </template>
        </XTable>

      </el-tab-pane>
      <el-tab-pane label="历史分配" v-if="checkPermi(['production:productionPlan:assignAgain'])">

        <XTable toolId="projectAssignTaskHistory" v-model:page-size="queryPageParamsHistory.pageSize"
                v-model:current-page="queryPageParamsHistory.pageNum" height="100%" class="xtable-content"
                :page-params="{ perfect: true, total: historyTotal }" :data="historyList" :columnList="columnList2"
                ref="xTableHistory" @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent"
                :loading="loading" :showRefresh="true"
                :intervalCondition="['saleOrderVo.placeOrderTime','saleOrderVo.dispatchTime','saleOrderVo.deliveryTime','eqStartTime','eqEndTime']"
                border @searchChange="searchChange2" :column-config="{ resizable: true }"
                :row-config="{ keyField: 'id' }">

                <template #header-eqHours="scope">
                  EQ时长(H)
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    raw-content
                    :content="`累计的EQ时长`"
                  >
                    <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>

          <template #default-isEqConfirm="scope">
            <el-switch
            v-if="scope.row.isEqConfirm"
              v-model="scope.row.isEqConfirm"
              :disabled="scope.row.miUserName == null"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
              @change="handleEQChange($event,scope.row)"
            />
          </template>
            <template #default-isCamConfirm="scope">
            <el-switch
            v-if="scope.row.isCamConfirm"
              v-model="scope.row.isCamConfirm"
              :disabled="scope.row.camUserName == null"
              style="--el-switch-on-color: #13ce66;"
              active-value="1"
              inactive-value="0"
              @change="handleCAMChange($event,scope.row)"

            />
          </template>


          <template #default-saleOrderVo.flowStatus="scope">
            <el-tag v-if="scope.row.saleOrderVo?.flowStatus=='3'"
                    type="warning"
                    size="small">订单预投
            </el-tag>
            <el-tag v-if="scope.row.saleOrderVo?.flowStatus=='4'"
                    type="warning"
                    size="small">生产投料
            </el-tag>
            <el-tag v-if="scope.row.saleOrderVo?.flowStatus=='5'"
                    type="warning"
                    size="small">生产中
            </el-tag>
            <el-tag v-if="scope.row.saleOrderVo?.flowStatus=='6'"
                    type="success"
                    size="small">已完成
            </el-tag>
          </template>
          <template #default-saleOrderVo.orderType="scope">
            <div v-for="item in resDictData.order_type">
              <span v-if="item.dictValue==scope.row.saleOrderVo.orderType">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-saleOrderVo.urgent="scope">
            <div v-for="item in resDictData.order_urgent">
              <span v-if="item.dictValue==scope.row.saleOrderVo.urgent">{{item.dictLabel}}</span>
            </div>
          </template>

          <template #default-saleOrderVo.model="scope">
            <div v-for="item in resDictData.order_model">
              <span v-if="item.dictValue==scope.row.saleOrderVo.model">{{item.dictLabel}}</span>
            </div>
          </template>
          <template #default-make="scope">
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="openCustomerRequire(scope.row)">客户要求
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true"
                       @click="assignTaskHistoryUReportHandle(scope.row)">制作单
            </el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="EQRecord(scope.row)">EQ记录</el-button>
            <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="openFile(scope.row)">文件</el-button>
          </template>
        </XTable>

      </el-tab-pane>

    </el-tabs>
    <!-- 添加或修改订单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" destroy-on-close width="500px" @close="closeDialog">
      <el-form ref="assignTaskFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择制作人员" prop="miUserId">
          <el-select v-model="form.miUserId" :collapse-tags="true" @change="selectCamUserId" filterable
                     placeholder="请选择制作人员">
            <el-option
              :disabled = "item.userName.includes('FDZD')"
              v-for="item in engineerOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择CAM工程师" prop="camUserId">
          <el-select v-model="form.camUserId" :collapse-tags="true" filterable placeholder="请选择CAM工程师">
            <el-option
              :disabled = "item.userName.includes('FDZD')"
              v-for="item in engineerOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--客户要求-->
    <el-dialog :title="customerDialog.title" v-model="customerDialog.visible" width="1000px">
      <el-input type="textarea" rows="25" v-model="currentVo.customerDemand" :readonly="true">
      </el-input>
    </el-dialog>

    <!--PCB制作单预览 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="60%"
               visible.sync="false" draggable>
      <div v-loading="dialogTableLoading" style="width: 100%;height: 100%;">
        <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
      </div>
    </el-drawer>

    <!--eq文件-->
    <el-dialog :title="uploadDialog.title" v-model="uploadDialog.visible" width="1000px">
      <XUpload v-model:model-value="fileList" :readOnly="currentVo.isEqConfirm == '0'" model="download"
               @fileChange="fileChange" @delFile="delFile" v-loading="dialogTableLoading"></XUpload>
    </el-dialog>


    <!--文件-->
    <el-drawer :title="fileDialog.title" v-model="fileDialog.visible" size="60%" visible.sync="false" draggable
               :destroy-on-close="true">
      <el-tabs type="border-card" v-model="fileTab" class="xtable-tab" >

        <el-tab-pane label="产品文件" name="产品文件">
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.saleOrderFileVos"
                  :show-footer="false" :columnList="eqfileColumnList" ref="fileleteTableRef7" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              {{ scope.row.name }}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
            </template>
            <template #default-src="scope">
              <ImagePreview
                :width="100"
                :height="100"
                :src="scope.row.url"
                :type="scope.row.type"
                :preview-src-list="[scope.row.url]"
              />
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="EQ文件" name="EQ文件">
          <XUpload v-model:model-value="fileList"  model="download"
          :show-file-list="false"
               @fileChange="fileChange"  v-loading="dialogTableLoading"></XUpload>
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.eqfileVos"
                  :show-footer="false" :columnList="eqfileColumnList" ref="fileleteTableRef6" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  >
            <template #default-fileName="scope">
              {{ scope.row.name }}
            </template>
            <template #default-src="scope">
              <ImagePreview
                :width="100"
                :height="100"
                :src="scope.row.url"
                :type="scope.row.type"
                :preview-src-list="[scope.row.url]"
              />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
              <el-button class="marginAndPadding" size="small" type="primary" :text="true" @click="delAssignFile(scope.row.id)">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="CAM文件" name="CAM文件">
          <span style="font-size: 12px;color: #00000085;margin-bottom: 5px;">【CAM完成】开启后可上传CAM文件</span>
          <XUpload v-model:model-value="camFileList" :readOnly="currentVo.isCamConfirm != '1'" model="download"
          :show-file-list="false"
               @fileChange="CAMFileChange"  v-loading="dialogTableLoading"></XUpload>
          <XTable :pageShow="false" class="xtable-content" :loading="loading" :data="filesDataObj.camfileVos"
                  :show-footer="false" :columnList="eqfileColumnList" ref="fileleteTableRef6" border
                  :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
                  >
            <template #default-fileName="scope">
              {{ scope.row.name }}
            </template>
            <template #default-src="scope">
              <ImagePreview
                :width="100"
                :height="100"
                :src="scope.row.url"
                :type="scope.row.type"
                :preview-src-list="[scope.row.url]"
              />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
              <el-button v-if="currentVo.isCamConfirm == '1'" class="marginAndPadding" size="small" type="primary" :text="true" @click="delAssignFile(scope.row.id)">删除</el-button>
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


    <el-dialog
      v-model="exportVisible"
      title="导出提示"
      width="20%"
      align-center
      destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出下单日期30天内的数据
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

    <!--产出报表-->
    <el-dialog v-model="visible" title="工程产出统计" width="80%"  draggable destroy-on-close>
      <OutputReport/>
    </el-dialog>

       <!-- EQ记录 -->
    <el-dialog :title="eqdialog.title" v-model="eqdialog.visible" destroy-on-close width="60%" @close="eqdialog.visible=false">

        <XTable toolId="eqAssignToolId" v-model:page-size="eqQueryParams.pageSize"
              v-model:current-page="eqQueryParams.pageNum" height="500" class="xtable-content"
              :page-params="{ perfect: true, total: eqtotal }" :data="eqList" :columnList="eqColumnList"
              :loading="eqloading" :showRefresh="true"
              :intervalCondition="['eqStartTime','eqEndTime']"
              border @searchChange="eqSearchChange" :column-config="{ resizable: true }"
              :sort-orders="sortCondition"
              :edit-config="{trigger: 'click', enabled: true, mode: 'cell'}"
              :row-config="{ keyField: 'id' }">

              <template #default-isAutoClose="scope">
                {{ scope.row.eqEndTime?(scope.row.isAutoClose=='0'?'否':'是'):'' }}
              </template>
              <template #header-isAutoClose="scope">
                是否自动关闭
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  raw-content
                  :content="`MI审核通过时会触发自动关闭EQ，同时EQ结束人为MI审核人`"
                >
                  <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
                </el-tooltip>
                </template>


        </XTable>

    </el-dialog>

  </div>
</template>

<script setup name="AssignTask" lang="ts">
  import {OrderVO, OrderQuery, OrderForm} from '@/api/order/directOrder/types';
  import dayjs from "dayjs";
  import {
    addAssignTask,
    listAssignTask,
    updateAssignTask,
    listHistoryAssignTask,
    addAssignTaskHistory, getSumSet, delAssignTask,getAssignTaskProjectFile,
    updateEq,listEQList
  } from "@/api/project/assignTask";
  import {listUserByRoleKey} from "@/api/system/user";
  import {ref} from "vue";
  import {UserVO} from "@/api/system/user/types";
  import {VxeTableEvents, VxeTableInstance} from "vxe-table";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {getReportUrl} from "@/utils/report";
  import {AssignTaskVO} from "@/api/project/assignTask/types";
  import {ElMessageBox} from 'element-plus';
  import {addFile, deleteFile, getFileList} from '@/api/upload';
  import {checkSaleOrderByBo} from '@/api/project/productionPlan';
  import { parseTime } from '@/utils/ruoyi';
  import OutputReport from "./outputReport.vue";
  import {checkPermi} from "@/utils/permission";
  import fileSaver from "file-saver";
  import {downloadUrl} from '@/api/upload/index';


  const visible = ref(false);
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const {order_flow_status} = toRefs<any>(proxy?.useDict("order_flow_status"));
  const xTable = ref();
  const xTableOther = ref();
  const xTableHistory = ref();
  const orderList = ref<OrderVO[]>([]);
  const historyList = ref([]);
  const otherOrderList = ref<OrderVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const historyTotal = ref(0);
  const otherTotal = ref(0)
  const fileList = ref<any[]>([]);
  const camFileList = ref<any[]>([]);
  const dialogTableLoading = ref(false)
  const exportVisible = ref(false);
  const toolId = ref('projectAssignTaskOrder');

  const toolIdOther = ref('projectAssignTaskOrderOther');

  let currentType = ref(0);

  const queryFormRef = ref<ElFormInstance>();
  const assignTaskFormRef = ref<ElFormInstance>();

  let resDictData = {
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
    //阻焊颜色
    order_commodity_solder: [],
    //字符颜色
    order_character: [],
    //产品类型
    sys_commodity_type: [],
    order_flow_status: []
  }

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const customerDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const uploadDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const checkedInfos = ref<Array<any>>([]);
  const statusFilterData = ref([
    {label: '待分配', value: "1"},
    {label: '待制作', value: "2"},
    {label: '制作中', value: "3"},
  ])
    const booleanType = ref([
    {label: '是', value: "1"},
    {label: '否', value: "0"},
  ])

  const sortCondition = ['dispatchTime','placeOrderTime','area'];

  const columnList = ref([
    {type: 'checkbox', fixed: 'left', width: '60', align: 'center', showOverflow: false},
    {title: "序号", fixed: 'left', width: '60', field: 'index', type: 'seq', align: 'center', showOverflow: false},
    {
      title: '制作人员',
      fixed: 'left',
      width: '90',
      field: 'miUserName',
      align: 'center',
      filterType: 'input',
      editRender: {},

    },
    {
      title: 'CAM工程师',
      fixed: 'left',
      width: '120',
      field: 'camUserName',
      align: 'center',
      filterType: 'input',
      editRender: {} ,

    },
    {title: 'EQ', fixed: 'left', width: '80', field: 'isEqConfirm', align: 'center'},
    {title: 'CAM完成', fixed: 'left', width: '80', field: 'isCamConfirm', align: 'center',
    filterType: 'radioButton',
    filterData: () => booleanType.value
     },
    {
      title: '状态', fixed: 'left', width: '80', field: 'flowStatus', align: 'center'
      //,filterType: 'radioButton', filterData: () => statusFilterData.value
      // filterType: 'radioButton',
      // filterData: () => [...resDictData.order_flow_status],
      // filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: '销售单号', fixed: 'left', width: '120', field: 'code', align: 'center', filterType: 'input'},
    {
      title: '新/返', width: '60', field: 'orderType', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '批量/样品', width: '60', field: 'model', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '加急', width: '60', field: 'urgent', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: '产品编码', width: '60', field: 'commodityCode', align: 'center', filterType: 'input'},
    {title: '产品名称', width: '60', field: 'commodityName', align: 'center', filterType: 'input'},
    {title: '版本号', width: '80', field: 'version', align: 'center', filterType: 'input'},
    {title: '板层', width: '80', field: 'materialLayer', align: 'center', filterType: 'input'},
    {title: '板厚', width: '120', field: 'commodityThickness', align: 'center', filterType: 'input'},
    {title: '成品铜厚', width: '120', field: 'materialCopperOutside', align: 'center', filterType: 'input'},
    {title: '表面处理', width: '120', field: 'surfaceTreatment', align: 'center', filterType: 'input'},
    {title: '阻焊颜色', width: '80', field: 'commoditySolder', align: 'center', filterType: 'input'},
    {title: '字符颜色', width: '120', field: 'characterColor', align: 'center', filterType: 'input'},
    {title: '产品类型', width: '80', field: 'commodityType', align: 'center', filterType: 'input'},
    {title: '客户编码', width: '80', field: 'customerCode', align: 'center', filterType: 'input'},
    {title: '订单数量', width: '80', field: 'quantity', align: 'center'},
    {title: '订单面积', width: '120', field: 'area', align: 'center',filterType: 'intervalNumber',sortable: true,},
    {title: 'PCS/SET', width: '120', field: 'unitedNumber', align: 'center'},
    {title: '业务员', width: '200', field: 'cusSaleUserName', align: 'center'},
    {title: '合同审核', width: '200', field: 'auditUserName', align: 'center'},
    {
      title: '下单日期', width: '200', field: 'placeOrderTime', align: 'center',
      // filterType: 'intervalDate',
      sortable: true,
      // filterParam: {
      //   startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      //   endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      // }
    },
    {
      title: '工厂交期', width: '200', field: 'dispatchTime', align: 'center',
      filterType: 'intervalDate',
      sortable: true,
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: 'EQ时长(H)', width: '90', field: 'eqHours',showHeaderOverflow: false, align: 'center'},
    { title: 'EQ开始时间', width: '150', field: 'eqStartTime', align: 'center', showHeaderOverflow: false,
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    { title: 'EQ结束时间', width: '150', field: 'eqEndTime', align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '操作', field: 'make', align: 'center', width: '250', fixed: 'right', showOverflow: false},
  ]);

  const columnList2 = ref([
    {type: 'checkbox', fixed: 'left', width: '60', align: 'center', showOverflow: false},
    {title: "序号", fixed: 'left', width: '60', type: 'seq', align: 'center', showOverflow: false},
    {title: '制作人员', fixed: 'left', width: '80', field: 'miUserName', align: 'center', filterType: 'input'},
    {title: 'CAM工程师', fixed: 'left', width: '140', field: 'camUserName', align: 'center', filterType: 'input'},
    {title: 'EQ', fixed: 'left', width: '80', field: 'isEqConfirm', align: 'center'},
    {title: 'CAM完成', fixed: 'left', width: '80', field: 'isCamConfirm', align: 'center',
      filterType: 'radioButton',
      filterData: () => booleanType.value },
    {title: '状态', fixed: 'left', width: '80', field: 'saleOrderVo.flowStatus', align: 'center'},
    {title: '销售单号', fixed: 'left', width: '120', field: 'saleOrderVo.code', align: 'center', filterType: 'input'},
    {
      title: '新/返', width: '60', field: 'saleOrderVo.orderType', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '批量/样品', width: '60', field: 'saleOrderVo.model', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '加急', width: '60', field: 'saleOrderVo.urgent', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: '产品编码', width: '60', field: 'saleOrderVo.commodityCode', align: 'center', filterType: 'input'},
    {title: '产品名称', width: '60', field: 'saleOrderVo.commodityName', align: 'center', filterType: 'input'},
    {title: '版本号', width: '80', field: 'saleOrderVo.version', align: 'center', filterType: 'input'},
    {title: '板层', width: '80', field: 'saleOrderVo.materialLayer', align: 'center', filterType: 'input'},
    {title: '板厚', width: '120', field: 'saleOrderVo.commodityThickness', align: 'center', filterType: 'input'},
    {title: '成品铜厚', width: '120', field: 'materialCopperOutside', align: 'center', filterType: 'input'},
    {title: '表面处理', width: '120', field: 'saleOrderVo.surfaceTreatment', align: 'center', filterType: 'input'},
    {title: '阻焊颜色', width: '80', field: 'saleOrderVo.commoditySolder', align: 'center', filterType: 'input'},
    {title: '字符颜色', width: '120', field: 'saleOrderVo.characterColor', align: 'center', filterType: 'input'},
    {title: '产品类型', width: '80', field: 'saleOrderVo.commodityType', align: 'center', filterType: 'input'},
    {title: '客户编码', width: '80', field: 'saleOrderVo.customerCode', align: 'center', filterType: 'input'},
    {title: '订单数量', width: '80', field: 'saleOrderVo.quantity', align: 'center'},
    {title: '订单面积', width: '120', field: 'saleOrderVo.area', align: 'center'},
    {title: 'PCS/SET', width: '120', field: 'saleOrderVo.unitedNumber', align: 'center'},
    {title: '业务员', width: '200', field: 'saleOrderVo.cusSaleUserName', align: 'center'},
    {title: '合同审核', width: '200', field: 'saleOrderVo.auditUserName', align: 'center'},
    {
      title: '下单日期', width: '200', field: 'saleOrderVo.placeOrderTime', align: 'center',
      // filterType: 'intervalDate',
      // filterParam: {
      //   startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      //   endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      // }
    },
    {
      title: '工厂交期', width: '200', field: 'saleOrderVo.dispatchTime', align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },

    { title: 'EQ时长(H)', width: '90', field: 'eqHours',showHeaderOverflow: false, align: 'center'},
    { title: 'EQ开始时间', width: '150', field: 'eqStartTime', align: 'center',
      filterType: 'intervalDate',showHeaderOverflow: false,
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    { title: 'EQ结束时间', width: '150', field: 'eqEndTime', align: 'center',
      filterType: 'intervalDate',showHeaderOverflow: false,
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '操作', field: 'make', align: 'center', width: '250', fixed: 'right', showOverflow: false},
  ]);

  const columnList3 = ref([
    {type: 'checkbox', fixed: 'left', width: '60', align: 'center', showOverflow: false},
    {title: "序号", fixed: 'left', width: '60', field: 'index', type: 'seq', align: 'center', showOverflow: false},
    {
      title: '制作人员',
      fixed: 'left',
      width: '90',
      field: 'miUserName',
      align: 'center',
      filterType: 'input',
      editRender: {}
    },
    {
      title: 'CAM工程师',
      fixed: 'left',
      width: '120',
      field: 'camUserName',
      align: 'center',
      filterType: 'input',
      editRender: {}
    },
    {title: 'EQ', fixed: 'left', width: '80', field: 'isEqConfirm', align: 'center'},
    {title: 'CAM完成', fixed: 'left', width: '80', field: 'isCamConfirm', align: 'center',
      filterType: 'radioButton',
      filterData: () => booleanType.value },
    {title: '订单状态', fixed: 'left', width: '80', field: 'orderStatus', align: 'center'},
    {
      title: '状态', fixed: 'left', width: '80', field: 'flowStatus', align: 'center'
      //,filterType: 'radioButton', filterData: () => statusFilterData.value
      // filterType: 'radioButton',
      // filterData: () => [...resDictData.order_flow_status],
      // filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: '销售单号', fixed: 'left', width: '120', field: 'code', align: 'center', filterType: 'input'},
    {
      title: '新/返', width: '60', field: 'orderType', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [...resDictData.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '批量/样品', width: '60', field: 'model', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '加急', width: '60', field: 'urgent', align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {title: '产品编码', width: '60', field: 'commodityCode', align: 'center', filterType: 'input'},
    {title: '产品名称', width: '60', field: 'commodityName', align: 'center', filterType: 'input'},
    {title: '版本号', width: '80', field: 'version', align: 'center', filterType: 'input'},
    {title: '板层', width: '80', field: 'materialLayer', align: 'center', filterType: 'input'},
    {title: '板厚', width: '120', field: 'commodityThickness', align: 'center', filterType: 'input'},
    {title: '成品铜厚', width: '120', field: 'materialCopperOutside', align: 'center', filterType: 'input'},
    {title: '表面处理', width: '120', field: 'surfaceTreatment', align: 'center', filterType: 'input'},
    {title: '阻焊颜色', width: '80', field: 'commoditySolder', align: 'center', filterType: 'input'},
    {title: '字符颜色', width: '120', field: 'characterColor', align: 'center', filterType: 'input'},
    {title: '产品类型', width: '80', field: 'commodityType', align: 'center', filterType: 'input'},
    {title: '客户编码', width: '80', field: 'customerCode', align: 'center', filterType: 'input'},
    {title: '订单数量', width: '80', field: 'quantity', align: 'center'},
    {title: '订单面积', width: '120', field: 'area', align: 'center',filterType: 'intervalNumber',sortable: true,},
    {title: 'PCS/SET', width: '120', field: 'unitedNumber', align: 'center'},
    {title: '业务员', width: '200', field: 'cusSaleUserName', align: 'center'},
    {title: '合同审核', width: '200', field: 'auditUserName', align: 'center'},
    {
      title: '下单日期', width: '200', field: 'placeOrderTime', align: 'center',
      // filterType: 'intervalDate',
      sortable: true,
      // filterParam: {
      //   startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      //   endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      // }
    },
    {
      title: '工厂交期', width: '200', field: 'dispatchTime', align: 'center',
      filterType: 'intervalDate',
      sortable: true,
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    { title: 'EQ时长(H)', width: '90', field: 'eqHours',showHeaderOverflow: false, align: 'center'},
    { title: 'EQ开始时间', width: '150', field: 'eqStartTime', align: 'center',
      filterType: 'intervalDate',showHeaderOverflow: false,
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    { title: 'EQ结束时间', width: '150', field: 'eqEndTime', align: 'center',
      filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
        endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      }
    },
    {title: '操作', field: 'make', align: 'center', width: '250', fixed: 'right', showOverflow: false},
  ]);

  // 初始化表格组件的搜索条件
  const initTableSearch = () => {
    const tempParam = Object.keys(initQueryParams)
    Object.keys(queryParams.value).forEach(key => {
      if (!tempParam.includes(key)) {
        queryParams.value[key] = undefined
      }
    })
  }

  // 获取 搜索条件
  const searchChange = (params: any) => {
    initTableSearch();
    Object.keys(params).forEach(key => {
      if (key == 'sorts' && params.sorts && params.sorts.length > 0) {
        console.log(params.sorts)
        params.sorts.forEach((item: any) => {
          queryParams.value.orderByColumn = item.prop;
          queryParams.value.isAsc = item.order;
        })
      } else {
        queryParams.value.isAsc = "desc"
        queryParams.value.orderByColumn = "audit_time"
      }
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.value[key] = params[key];
      }
    })
    changeList();
  }

  // 初始化表格组件的搜索条件
  const initTableSearch2 = () => {
    const tempParam = Object.keys(initQueryPageParamsHistory)
    Object.keys(queryPageParamsHistory.value).forEach(key => {
      if (!tempParam.includes(key)) {
        queryPageParamsHistory.value[key] = undefined
      }
    })
  }

  // 初始化表格组件的搜索条件
  const initTableSearch3 = () => {
    const tempParam = Object.keys(initQueryPageParamsHistory)
    Object.keys(queryParamsOther.value).forEach(key => {
      if (!tempParam.includes(key)) {
        queryParamsOther.value[key] = undefined
      }
    })
  }

  // 获取 客户地址搜索条件
  const searchChange2 = (params: any) => {
    initTableSearch2()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryPageParamsHistory.value[key] = params[key];
      }
    });
    getHistoryList()
  }

  // 获取 客户地址搜索条件
  const searchChange3 = (params: any) => {
    initTableSearch3()
    Object.keys(params).forEach(key => {
      if (key == 'sorts' && params.sorts && params.sorts.length > 0) {
        console.log(params.sorts)
        params.sorts.forEach((item: any) => {
          queryParamsOther.value.orderByColumn = item.prop;
          queryParamsOther.value.isAsc = item.order;
        })
      } else {
        queryParamsOther.value.isAsc = "desc"
        queryParamsOther.value.orderByColumn = "audit_time"
      }
      if (params[key] !== null && params[key] !== undefined) {
        queryParamsOther.value[key] = params[key];
      }
    })
    getOtherList();
  }

  const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = ({checked}) => {
    const $table = xTable.value.xTableRef;
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
  const reportDrawer = reactive<DrawerOption>({
    direction: 'left',
    visible: false,
    title: '预审单'
  });

  let reportUrl = ref("");
  const assignTaskUReportHandle = async (row: OrderVO) => {
    reportDrawer.title = "PCB制作单";
    reportDrawer.visible = true;
    dialogTableLoading.value = true
    reportUrl.value = await getReportUrl() + `&_n=PCB制作单&_u=file:saleOrder.ureport.xml&url=order/saleOrder/reportMi/${row.id}`;
    console.log(reportUrl.value);
    dialogTableLoading.value = false
  }

  const assignTaskHistoryUReportHandle = async (row: AssignTaskVO) => {
    reportDrawer.title = "PCB制作单";
    reportDrawer.visible = true;
    dialogTableLoading.value = true
    reportUrl.value = await getReportUrl() + `&_n=PCB制作单&_u=file:saleOrder.ureport.xml&url=order/saleOrder/reportMi/${row.saleOrderId}`;
    console.log(reportUrl.value);
    dialogTableLoading.value = false
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

  const initFormData: OrderForm = {
    placeOrderTime: undefined,
    miUserId: undefined,
    camUserId: undefined,
  }

  const initQueryParams = {
    pageNum: 1,
    pageSize: 20,
    orderByColumn: "audit_time",
    isAsc: "desc",
    isInventoryShipped: 0,
    flowStatus: undefined,
    placeOrderTimeStart: dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00"),
    placeOrderTimeEnd: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
    params: {}
  }

  const data = reactive<PageData<OrderForm, OrderQuery>>({
    form: {...initFormData},
    queryParams: {
      ...initQueryParams
    },
    rules: {
      miUserId: [
        {required: true, message: "制作人员不能为空", trigger: "change"}
      ]
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  const initQueryPageParamsHistory = {
    pageNum: 1,
    pageSize: 20,
    orderByColumn: "create_time",
    isAsc: "desc",
    flowStatus: undefined,
    placeOrderTimeStart: dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00"),
    placeOrderTimeEnd: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
    params: {}
  }

  const queryPageParamsHistory = ref({
    ...initQueryPageParamsHistory
  })

  const queryParamsOther = ref({
    ...initQueryParams,
    isNormal : '1'
  })

  const selectCamUserId = (value: any) => {
    if (form.value.camUserId == undefined) {
      form.value.camUserId = value;
    }
  }

  const currentVo = ref<any>({});

  const openUpload = async (info: any) => {
    currentVo.value = info;
    const param = {
      bizId: (currentType.value == 0 || currentType.value == 1) ? info.id : info.saleOrderVo.id,
      bizType: "12",
      moduleCode: "2",
    }
    uploadDialog.visible = true;
    uploadDialog.title = "EQ文件";
    dialogTableLoading.value = true
    const res = await getFileList(param);
    fileList.value = res.data;
    dialogTableLoading.value = false
  }

  /*客户要求*/
  const openCustomerRequire = (info: any) => {
    currentVo.value = info;
    customerDialog.visible = true;
    customerDialog.title = "客户要求";
  }

  //工程师
  const engineerOptions = ref<UserVO[]>([]);

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    let string = "order_flow_status,order_type,order_model,order_urgent,finish_plate_thickness,order_surface_treatment,order_commodity_solder,order_character,sys_commodity_type";
    getDicts(string)
      .then(res => {
        const dictData = res.data;
        string.split(",").forEach(item => {
          Object.keys(resDictData).forEach(dictItem => {
            if (item == dictItem) {
              resDictData[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });
    const salerResponse: any = await listUserByRoleKey("engineer");
    engineerOptions.value = salerResponse.data;

  };

  /*分配人员*/
  const allotUser = () => {
    if (checkedInfos.value.length == 0) {
      ElMessage.warning("请先选择需要分配人员的订单!");
      return;
    }
    dialog.visible = true;
    dialog.title = "MI制作分配";
  }


  /*导出分配数据*/
  const exportExcel = () => {
    //先看看有没有给起始时间，没有要给出提示
    exportVisible.value = false;
    if(currentType.value == 0){
      proxy?.download('project/assignTask/export', {
        ...queryParams.value, tableName: toolId.value
      }, `正常订单分配_${parseTime(new Date())}.xlsx`);
    }else if (currentType.value ==1){
      proxy?.download('project/assignTask/export', {
        ...queryParamsOther.value, tableName: toolIdOther.value
      }, `其他订单分配_${parseTime(new Date())}.xlsx`);
    }
  }

  /*导出分配数据*/
  const exportDataBefore = () => {
    //先看看有没有给起始时间，没有要给出提示
    //2024年3月1日需求  没有查询条件才需要默认导出30天  有按查询条件导
    if(currentType.value == 0){
      if (!queryParams.value.placeOrderTimeStart && !queryParams.value.placeOrderTimeEnd) {
        exportVisible.value = true;
      } else {
        proxy?.download('project/assignTask/export', {
          ...queryParams.value, tableName: toolId.value
        }, `正常订单分配_${parseTime(new Date())}.xlsx`);
      }
    } else if (currentType.value ==1){
      if (!queryParamsOther.value.placeOrderTimeStart && !queryParamsOther.value.placeOrderTimeEnd) {
        exportVisible.value = true;
      } else {
        proxy?.download('project/assignTask/export', {
          ...queryParamsOther.value, tableName: toolIdOther.value
        }, `其他订单分配_${parseTime(new Date())}.xlsx`);
      }
    }

  }

  /*switch change事件*/
  const handleChange = async ($event: any, row: any) => {
    const data = {
      id: (currentType.value == 0 || currentType.value == 1) ? row.assignTaskId : row.id,
      miUserId: row.miUserId,
      miUserName: row.miUserName,
      camUserId: row.camUserId,
      camUserName: row.camUserName,
      isEqConfirm: row.isEqConfirm,
      // planId: row.planId,
    }
    await updateAssignTask(data).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("修改成功");
    await changeList();
  };

  /*switch change事件*/
  const handleEQChange = async ($event: any, row: any) => {
    const data = {
      id: (currentType.value == 0 || currentType.value == 1) ? row.assignTaskId : row.id,
      miUserId: row.miUserId,
      miUserName: row.miUserName,
      camUserId: row.camUserId,
      camUserName: row.camUserName,
      isEqConfirm: row.isEqConfirm,
      // planId: row.planId,
    }
    await updateEq(data).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("修改成功");
    await changeList();
  };

    /*CAM 的 switch change事件*/
  const handleCAMChange = async ($event: any, row: any) => {
    const data = {
      id: (currentType.value == 0 || currentType.value == 1) ? row.assignTaskId : row.id,
      miUserId: row.miUserId,
      miUserName: row.miUserName,
      camUserId: row.camUserId,
      camUserName: row.camUserName,
      isEqConfirm: row.isEqConfirm,
      isCamConfirm: row.isCamConfirm,
      // planId: row.planId,
    }
    await updateAssignTask(data).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("修改成功");
    await changeList();
  };

  const fileChange = async (value: any) => {
    let lastFile = value.find(vo => vo.key == value[value.length - 1].key);
    var data = {
      bizId: (currentType.value == 0 || currentType.value == 1) ? currentVo.value.id : currentVo.value.saleOrderVo.id,
      moduleCode: "2",
      bizType: "12",
      type: lastFile.type,
      size: lastFile.size,
      name: lastFile.name,
      key: lastFile.key,
    }
    console.log(data);
    await addFile(data);
    let query = {
        saleOrderId:(currentType.value == 0 || currentType.value == 1) ? currentVo.value.id : currentVo.value.saleOrderVo.id,
    }
    filesDataObj.value = await getAssignTaskProjectFile(query);
  }

  const CAMFileChange = async (value: any) => {
    let lastFile = value.find(vo => vo.key == value[value.length - 1].key);
    var data = {
      bizId: (currentType.value == 0 || currentType.value == 1) ? currentVo.value.id : currentVo.value.saleOrderVo.id,
      moduleCode: "2",
      bizType: "35",
      type: lastFile.type,
      size: lastFile.size,
      name: lastFile.name,
      key: lastFile.key,
    }
    console.log(data);
    await addFile(data);
    let query = {
        saleOrderId:(currentType.value == 0 || currentType.value == 1) ? currentVo.value.id : currentVo.value.saleOrderVo.id,
    }
    filesDataObj.value = await getAssignTaskProjectFile(query);
  }

  const delFile = (value: any) => {
    const _ids = value?.id || ids.value;
    deleteFile(_ids);
    proxy?.$modal.msgSuccess("取消分配成功");
  }

  const handleClick = (pane: any, ev: any) => {
    if (pane.index == 0) {
      currentType.value = 0;
    } else if(pane.index == 2){
      currentType.value = 2;
    } else if(pane.index == 1){
      currentType.value = 1;
    }
    changeList();
  }

  const changeList = () => {
    if (currentType.value == 0) {
      getList();
    } else if(currentType.value == 2){
      getHistoryList();
    } else if(currentType.value == 1){
      getOtherList();
    }
  }

  const sumData = ref({
    quantity: 0,
    area: 0
  })

  /** 查询订单列表 */
  const getList = async () => {
    loading.value = true;
    queryParams.value.isNormal = '1';
    const res = await listAssignTask(queryParams.value);
    orderList.value = res.rows;
    if (orderList.value.length > 0) {
      // orderList.value.forEach(info => {
      //   if (info.isEqConfirm == null || info.isEqConfirm == undefined) {
      //     info.isEqConfirm = "0";
      //   }
      //   if (info.isCamConfirm == null || info.isCamConfirm == undefined) {
      //     info.isCamConfirm = "0";
      //   }
      // })
    }
    const resSum = await getSumSet(queryParams.value);
    sumData.value = resSum.data;

    total.value = res.total;
    loading.value = false;
  }

  /*历史分配*/
  const getHistoryList = async () => {
    loading.value = true;
    for(let key in queryPageParamsHistory.value){
      if(key.includes(".")){
        const newKey=key.split('.').pop();
        queryPageParamsHistory.value[newKey]=queryPageParamsHistory.value[key];
      }
    }
    console.log(" queryPageParamsHistory.value", queryPageParamsHistory.value)
    const res = await listHistoryAssignTask(queryPageParamsHistory.value);
    historyList.value = res.rows;
    if (historyList.value && historyList.value.length > 0) {
      // historyList.value.forEach(info => {
      //   if (info.isEqConfirm == null || info.isEqConfirm == undefined) {
      //     info.isEqConfirm = "0";
      //   }
      //   if (info.isCamConfirm == null || info.isCamConfirm == undefined) {
      //     info.isCamConfirm = "0";
      //   }
      // })
    }
    historyTotal.value = res.total;
    loading.value = false;
  }

  /** 其他订单 */
  const getOtherList = async () => {
    loading.value = true;
    queryParamsOther.value.isNormal = '0';
    queryParamsOther.value.isInventoryShipped = undefined;
    const res = await listAssignTask(queryParamsOther.value);
    otherOrderList.value = res.rows;
    if (otherOrderList.value.length > 0) {
      // otherOrderList.value.forEach(info => {
      //   if (info.isEqConfirm == null || info.isEqConfirm == undefined) {
      //     info.isEqConfirm = "0";
      //   }
      //   if (info.isCamConfirm == null || info.isCamConfirm == undefined) {
      //     info.isCamConfirm = "0";
      //   }
      // })
    }
    const resSum = await getSumSet(queryParamsOther.value);
    sumData.value = resSum.data;

    otherTotal.value = res.total;
    loading.value = false;
  }

  const userChanged = async (row:any)=>{
    const saleOrderIdList:any[] = [];
    const alreadyAssignList:any[] = [];
    row.assignTaskId && alreadyAssignList.push(row.assignTaskId);
    saleOrderIdList.push(row.id);
    const info = {
      saleOrderIdList: saleOrderIdList,
      alreadyAssignList: alreadyAssignList,
      miUserId: row.miUserId,
      camUserId: row.camUserId,
      miUserName: engineerOptions.value.find(vo => vo.userId == row.miUserId)?.nickName,
      camUserName: engineerOptions.value.find(vo => vo.userId == row.camUserId)?.nickName,
    }
    if(row.camUserId == null){
      info.camUserId = row.miUserId
      info.camUserName = info.miUserName
    }
    if(row.miUserId == null){
      ElMessage.warning("请先选择制作人员");
      return;
    }
    let check =false;
    buttonLoading.value = true;
    check = await checkSaleOrderByBo({ids:saleOrderIdList}).catch(() => {buttonLoading.value = false});
    console.log('check', check);
    if (!check) {
      buttonLoading.value = false;
      return;
    }
    if(row.assignTaskId != null){
      ElMessageBox.confirm(
        '产品编号' + row.commodityCode + '已分配人员，是否确认更改?',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确认',
          type: 'warning',
        }
      )
        .then(() => {
          submitDate(info,row);
        }).catch(() => {
          buttonLoading.value = false;
        })
    } else {
      submitDate(info,row);
    }
  }

  /** 提交按钮 */
  const submitForm = () => {

    assignTaskFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        //订单分配
        const saleOrderIdList = [];
        if (currentType.value == 0 || currentType.value== 1) {
          const alreadyUserArray = [];
          const alreadyAssignList = [];
          checkedInfos.value.forEach(info => {
            if (info.miUserId != null) {
              alreadyUserArray.push(info.commodityCode);
              info.assignTaskId && alreadyAssignList.push(info.assignTaskId);
              saleOrderIdList.push(info.id);
            } else {
              saleOrderIdList.push(info.id);
            }
          });

          let check =false;
          buttonLoading.value = true;
          check = await checkSaleOrderByBo({ids:saleOrderIdList}).catch(() => {buttonLoading.value = false});
          console.log('check', check);
          if (!check) {
            buttonLoading.value = false;
            return;
          }

          const alreadyUserString = alreadyUserArray.join("/");
          const info = {
            saleOrderIdList: saleOrderIdList,
            alreadyAssignList: alreadyAssignList,
            miUserId: form.value.miUserId,
            camUserId: form.value.camUserId,
            miUserName: engineerOptions.value.find(vo => vo.userId == form.value.miUserId)?.nickName,
            camUserName: engineerOptions.value.find(vo => vo.userId == form.value.camUserId)?.nickName,
          };
          if (alreadyUserString != "" && alreadyUserString != null) {
            ElMessageBox.confirm(
              '产品编号' + alreadyUserString + '已分配人员，是否确认更改?',
              '提示',
              {
                cancelButtonText: '取消',
                confirmButtonText: '确认',
                type: 'warning',
              }
            )
              .then(() => {
                submitDate(info);
                // ElMessage({
                //   type: 'success',
                //   message: '设置成功',
                // })
              }).catch(() => {
                buttonLoading.value = false;
              })
          } else {
            submitDate(info)
          }
        } else {
          //历史分配
          checkedInfos.value.forEach(info => {
            saleOrderIdList.push(info.saleOrderId);
          })
          const info = {
            saleOrderIdList: saleOrderIdList,
            miUserId: form.value.miUserId,
            camUserId: form.value.camUserId,
            miUserName: engineerOptions.value.find(vo => vo.userId == form.value.miUserId)?.nickName,
            camUserName: engineerOptions.value.find(vo => vo.userId == form.value.camUserId)?.nickName,
          };
          ElMessageBox.confirm(
            '是否确定再次分配历史订单',
            '提示',
            {
              cancelButtonText: '取消',
              confirmButtonText: '确认',
              type: 'warning'
            }
          ).then(() => {
            submitDate(info);
            // ElMessage({
            //   type: 'success',
            //   message: '设置成功',
            // })
          }).catch(() => {
            buttonLoading.value = false;
          })
        }
      }
    });
  }

  /*订单分配提交*/
  const submitDate = async (info: any, row?: any) => {
    console.log('submitDate', info);
    if (currentType.value == 0) {
      await addAssignTask(info).finally(() => resetRow(row));
      xTable.value.xTableRef.clearCheckboxRow()
    } else if (currentType.value == 1){
      await addAssignTask(info).finally(() => resetRow(row));
      xTableOther.value.xTableRef.clearCheckboxRow()
    } else {
      await addAssignTaskHistory(info).finally(() => resetRow(row));
      xTableHistory.value.xTableRef.clearCheckboxRow()
    }
    // proxy?.$modal.msgSuccess("修改成功");
    reset();
    dialog.visible = false;
    await changeList();
    checkedInfos.value = [];
  }

  const resetRow = (row?:any) => {
    buttonLoading.value = false;
    if(row){
      row.camUserName = undefined;
      row.miUserName = undefined;
      row.miUserId = undefined;
      row.camUserId = undefined;
    }
  }

  // 关闭弹框框
  const closeDialog = () => {
    cancel()
    checkedInfos.value = [];
    if (xTable.value?.xTableRef) {
      xTable.value.xTableRef.clearCheckboxRow()
    }
    if (xTableOther.value?.xTableRef) {
      xTableOther.value.xTableRef.clearCheckboxRow()
    }
    if (xTableHistory.value?.xTableRef) {
      xTableHistory.value.xTableRef.clearCheckboxRow()
    }
  }

  /** 删除按钮操作 */
  const handleDelete = async (row?: any) => {
    const _ids = row?.assignTaskId || ids.value;
    await proxy?.$modal.confirm('是否取消分配产品编号为"' + row.commodityCode + '"的数据项？').finally(() => loading.value = false);
    proxy?.$modal.loading('加载中...');
    await delAssignTask(_ids).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("删除成功");


    await changeList();
  }

  /** 取消按钮 */
  const cancel = () => {
    reset();
    dialog.visible = false;
  }

  const closed = () => {
    customerDialog.visible = false;
  }

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    assignTaskFormRef.value?.resetFields();
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    changeList();
  }

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    queryParams.value.flowStatus = '2';
    handleQuery();
  }

  /** 多选框选中数据 */
  const handleSelectionChange = (selection: OrderVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }


  const fileDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const filesDataObj = ref<any>([]);
  const fileTab = ref('产品文件');

  const eqfileColumnList = ref([
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
    {title: '文件名称', field: 'name', align: 'center'},
    {title: '缩略图', field: 'src', align: 'center', showOverflow: false},
    {title: '文件大小', width: '80', field: 'size', align: 'center'},
    {title: '上传人', width: '80', field: 'createByName', align: 'center'},
    {title: '上传时间', width: '140', field: 'createTime', align: 'center'},
    {title: '操作', width: '100', field: 'make', align: 'center'},
  ]);
  /** 文件 */
  const openFile = async (row: any) => {
    currentVo.value = row;
    fileDialog.title = "工程文件";
    fileTab.value = '产品文件';
    filesDataObj.value = [];
    fileDialog.visible = true;
    let query = {
      //id: (currentType.value == 0 || currentType.value == 1) ? row.id : row.saleOrderVo.id,
      saleOrderId:(currentType.value == 0 || currentType.value == 1) ? row.id : row.saleOrderVo.id,
    }
    filesDataObj.value = await getAssignTaskProjectFile(query);
  }

  const delAssignFile = async(_ids: any) => {
    await proxy?.$modal.confirm('是否删除文件？').finally(() => loading.value = false);
    deleteFile(_ids);
    filesDataObj.value = [];
    let query = {
        saleOrderId:(currentType.value == 0 || currentType.value == 1) ? currentVo.value.id : currentVo.value.saleOrderVo.id,
    }
    filesDataObj.value = await getAssignTaskProjectFile(query);
  }

  const cacelFile = () => {
    filesDataObj.value = [];
    fileDialog.visible = false;
  }

    // 文件下载
  const downLoadHandle = (key: string) => {
    let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
    console.log(key)
    downloadUrl(key).then(res => {
      loadingBox.close()
      if (res.code == 200) {
        const { data } = res
        // window.open(data[key])
        fileSaver.saveAs(data[key])
      }
    }).catch((err) => {
      loadingBox.close()
    })
  }


  const eqSaleId = ref();
  const eqList = ref<any>([]);
  const eqtotal = ref(0);
  const eqloading = ref(false);
  const eqdialog = reactive<DialogOption>({
    visible: false,
    title: 'EQ记录'
  });
  const initEQQueryParams = {
    pageNum: 1,
    pageSize: 20,
    params: {}
  }
  const eqdata = reactive<PageData<OrderForm, OrderQuery>>({
    form: {...initFormData},
    queryParams: {
      ...initEQQueryParams
    },
    rules: {
    }
  });
  const eqColumnList = ref([
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
    {title: '产品编码', field: 'commodityCode', align: 'center'},
    {title: 'EQ开始时间',width: '130', field: 'eqStartTime', align: 'center'},
    {title: 'EQ开启人', width: '90',field: 'eqStartUserName', align: 'center', showOverflow: false},
    {title: 'EQ结束时间',width: '130',field:'eqEndTime',align: 'center'},
    {title: 'EQ结束人', width: '90', field: 'eqEndUserName', align: 'center'},
    {title: 'EQ时长(H)', width: '70', field: 'eqHours', align: 'center'},
    {title: '是否自动关闭', width: '150', field: 'isAutoClose', align: 'center'},
  ]);

  const {queryParams:eqQueryParams} = toRefs(eqdata);
  const EQRecord = async (row: any) => {
    eqSaleId.value = (currentType.value == 0 || currentType.value == 1) ? row.id : row.saleOrderVo.id;
    await getEQList();
    eqdialog.visible=true;
  };
   // 获取 搜索条件
  const eqSearchChange = async(params: any) => {
    eqloading.value = true;
    eqQueryParams.value = params;

    await getEQList();
    eqloading.value = false;
  }

  const getEQList = async ()=>{
    eqQueryParams.value.saleOrderId = eqSaleId.value;
    const res = await listEQList(eqQueryParams.value);
    eqList.value = res.rows;
    eqtotal.value = res.total;
  }


  onMounted(() => {
    getDictOptions();
    getList();
  });
</script>

<style lang="scss" scoped>
  .totalTitle {

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

  .marginAndPadding {
    margin-left: 3px;
    margin-right: 3px;
    padding-left: 3px;
    padding-right: 3px
  }

</style>

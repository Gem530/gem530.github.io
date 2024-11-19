<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs v-if="checkPermi(['inventory:material:list'])" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="实时库存" width="100%" :name="2">
          <TotalTitle :list="[
            { title: `当前库存总数：${outTotal2?outTotal2:0}` },
            { title: `在途库存总数：${inTransitTotal?inTransitTotal:0}` },
            { title: `可用库存总数：${inTotal2?inTotal2:0}` },
          ]"></TotalTitle>
          <div class="head-btn-flex" v-if="checkPermi(['inventory:material:list']) || checkPermi(['inventory:material:export'])">
            <!-- <div style="float: right">
              <div style="display:flex;line-height: 24px;font-size: 14px">
                <div style="width: 110px;background-color: #ECB0B1;text-align: center; margin-right: 8px;">库存告警</div>
              </div>
            </div>
            <p class="totalTitle">当前库存总数：{{outTotal2?outTotal2:0}}&nbsp;&nbsp;&nbsp;&nbsp; 在途库存总数：{{inTransitTotal?inTransitTotal:0}}&nbsp;&nbsp;&nbsp;&nbsp; 可用库存总数：{{inTotal2?inTotal2:0}}  </p> -->
            <el-button v-if="checkPermi(['inventory:material:list'])" style="margin-left: 20px" type="primary" @click="handlePrint">批量打印标签</el-button>
            <el-button v-if="checkPermi(['inventory:material:export'])" :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
<!--          <div class="p-2" style="text-align: right;width: 100%">
            <el-checkbox v-model="queryParamsLive.checked" @change="getList2">只显示在库物料</el-checkbox>
          </div>-->
          <XTable toolId="purchaseMaterialReceiveShow" v-model:page-size="queryParamsLive.pageSize" v-model:current-page="queryParamsLive.pageNum" height="100%" class="xtable-content"
                  :page-params="{ perfect: true, total: total }" :data="materialInventoryList" :columnList="columnList2" ref="materialTableRef"
                  @toggle-row-expand="toggleExpandChangeEvent" size="mini" :intervalCondition="intervalCondition"
                  :scroll-x="true" :showRefresh="true" :loading="loading" :checkbox-config="{  reserve: true }"
                  border @searchChange="searchMaterialChange" :column-config="{ resizable: true }" @checkbox-all="selectionChange"
                  @checkbox-change="selectionChange" :row-style="setRowStyle" :row-config="{ keyField: 'id' }">
            <template #header-tool>
              <ColorRule :list="[{ title: '库存告警', color: '#ECB0B1' }]"></ColorRule>
            </template>
            <template #default-inOutRecordType="scope">
              <!-- <dict-tag :options="material_in_out_record_type" :value="scope.row.inOutRecordType"/> -->
              {{ typeStrings[scope.row.inOutRecordType as keyof typeof InOutTypeEnum] }}
            </template>
            <!--            <template #default-make="scope">-->
            <!-- 收货列表点击详情可以看到物料收货单详情 -->
            <!--              <el-button link type="primary" v-if="scope.row.quantity != 0" @click="updatePeriodical(scope.row)">修改保质期</el-button>-->
            <!--              <el-button link type="primary" v-if="scope.row.quantity != 0 && checkPermi(['inOut:inventory:out'])"  @click="updateOutBound(scope.row)">出库</el-button>-->
            <!--              <el-button link type="primary" @click="updateGoodsRejected(scope.row)">退货</el-button>-->
            <!--              <el-button link type="primary" v-if="scope.row.quantity != 0" @click="updateRoll(scope.row)">转仓</el-button>-->
            <!--            </template>-->
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="出入库记录" :name="1">
          <TotalTitle :list="[
            { title: `出库总数量：${outTotal?outTotal:0}` },
            { title: `入库总数量：${inTotal?inTotal:0}` },
          ]"></TotalTitle>
          <div class="head-btn-flex" v-if="checkPermi(['inventory:material:inout:export'])">
            <!-- <p class="totalTitle">出库总数量：{{outTotal?outTotal:0}}&nbsp;&nbsp;&nbsp;&nbsp; 入库总数量：{{inTotal?inTotal:0}}  </p> -->
            <el-button v-if="checkPermi(['inventory:material:inout:export'])" style="margin-left: 20px" :loading="buttonLoading" type="primary" @click="exportExcelReceiveRecord">导出</el-button>
          </div>
          <XTable toolId="purchaseMaterialReceiveRecord" v-model:page-size="queryParams.pageSize" v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: total }" :data="materialOrderList" :columnList="columnList" ref="tableRef"
            @toggle-row-expand="toggleExpandChangeEvent"
                  :intervalCondition="['createTime']"
                  size="mini" :showRefresh="true" :loading="loading"
            border @searchChange="searchChange" :column-config="{ resizable: true }">
            <template #default-inOutRecordType="scope">
              {{ typeStrings[scope.row.inOutRecordType as keyof typeof InOutTypeEnum] }}
            </template>


          </XTable>

        </el-tab-pane>
        <el-tab-pane v-if="checkPermi(['inventory:material:month'])" label="库存结存" width="100%" :name="3">
          <el-form class="width-100" :model="monthQueryParams" ref="queryFormRef" :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="结存年月:" prop="yearMonth">
                  <el-date-picker
                    v-model="monthQueryParams.yearMonth" type="month"
                    value-format="YYYY-MM"
                    @change="handleMonthQuery"
                    placeholder="请选择年月"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16" class="global-flex flex-end align-start">
                <el-button v-if="checkPermi(['inventory:material:month:export'])" style="margin-left: 20px" type="primary" @click="exportMonthExcelBefore">导出</el-button>
              </el-col>
            </el-row>
          </el-form>
          <!--          <div class="p-2" style="text-align: right;width: 100%">
                      <el-checkbox v-model="queryParamsLive.checked" @change="getList2">只显示在库物料</el-checkbox>
                    </div>-->
          <XTable :toolId="rawMaterialMonthToolId" v-model:page-size="monthQueryParams.pageSize" v-model:current-page="monthQueryParams.pageNum" height="100%" class="xtable-content"
                  :page-params="{ perfect: true, total: totalMonth }" :data="materialMonthInventoryList" :columnList="columnList4" ref="materialMonthTableRef"
                  @toggle-row-expand="toggleExpandChangeEvent" size="mini" :intervalCondition="intervalCondition"
                  :scroll-x="true" :showRefresh="true" :loading="loading" :checkbox-config="{  reserve: true }"
                  border @searchChange="monthSearchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }">
            <template #default-inOutRecordType="scope">
              <!-- <dict-tag :options="material_in_out_record_type" :value="scope.row.inOutRecordType"/> -->
              {{ typeStrings[scope.row.inOutRecordType as keyof typeof InOutTypeEnum] }}
            </template>
            <!--            <template #default-make="scope">-->
            <!-- 收货列表点击详情可以看到物料收货单详情 -->
            <!--              <el-button link type="primary" v-if="scope.row.quantity != 0" @click="updatePeriodical(scope.row)">修改保质期</el-button>-->
            <!--              <el-button link type="primary" v-if="scope.row.quantity != 0 && checkPermi(['inOut:inventory:out'])"  @click="updateOutBound(scope.row)">出库</el-button>-->
            <!--              <el-button link type="primary" @click="updateGoodsRejected(scope.row)">退货</el-button>-->
            <!--              <el-button link type="primary" v-if="scope.row.quantity != 0" @click="updateRoll(scope.row)">转仓</el-button>-->
            <!--            </template>-->
          </XTable>
        </el-tab-pane>


      </el-tabs>
    <!-- </el-card> -->
    <!--保质期 -->
    <el-dialog v-model="dialogPeriodical.visible"  title="保质期修改" center width="30%" draggable>
      <!-- 主体 -->
      <el-form :label-position="labelPosition" ref="periodicalFormRef" border label-width="100px" :model="formInline" :rules="formInlineRules">
        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="物料编码：" prop="code">
              <el-input v-model="formInline.code" placeholder="物料编码" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="保质期：" prop="expirationDays">
              <el-input v-model="formInline.expirationDays" placeholder="保质期（天）" type="number" :min="0">
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogPeriodical.visible = false">关闭</el-button>
            <el-button type="primary" @click="saveInventory">保存</el-button>
          </span>
        </div>
      </template>
    </el-dialog>


    <!--出库 -->
<!--    <el-dialog v-model="dialogOutbound.visible" title="物料出库" center width="90%" draggable destroy-on-close>-->
<!--      &lt;!&ndash; 主体 &ndash;&gt;-->
<!--      <el-form :label-position="labelPosition" border label-width="100px" :model="formInlineOutBound">-->
<!--        <el-row>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item  label="领用人">-->
<!--              <el-select v-model="formInlineOutBound.checkUser" clearable :collapse-tags="true"  filterable-->
<!--                         placeholder="请选择领用人">-->
<!--                <el-option v-for="item in wllyjsOptions"-->
<!--                           :key="item.userId"-->
<!--                           :label="item.nickName"-->
<!--                           :value="item.userId"/>-->
<!--              </el-select>-->
<!--            </el-form-item >-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item size="small" label="领用时间：">-->
<!--              <el-input v-model="formInlineOutBound.outBoundTime" placeholder="领用时间" disabled/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-form>-->

<!--      <el-row style="justify-content: end;">-->
<!--        <el-button type="primary" @click="deleteRowOutBoundEventList">删除</el-button>-->
<!--      </el-row>-->
<!--      <XTable   :pageShow="false" :data="otherOutBoundList" :columnList="outColumnList"-->
<!--                ref="outBoundTable" border keep-source :column-config="{ resizable: true }"-->
<!--                :checkbox-config="{ reserve: true }" :edit-rules="validRules"-->
<!--                :edit-config="{ trigger: 'click', mode: 'row', autoClear: true, showStatus: true }" height="350px"-->
<!--                :scroll-y="{ enabled: true, gt: 10 }" :row-config="{ keyField: 'id' }" >-->
<!--      <template #edit-appliedQuantity="{ row }">-->
<!--        <el-input-number-->
<!--                  maxLength="11" :min="0" :max="row.quantity" :precision="2" style="width: 99%;"  :controls="false"-->
<!--                  v-model="row.appliedQuantity" />-->
<!--      </template>-->
<!--      <template #default-appliedQuantity="{ row }">-->
<!--        {{row.appliedQuantity}}-->
<!--      </template>-->
<!--      <template #edit-remark="{ row }">-->
<!--        <el-input  maxLength="1000"    style="width: 99%;"-->
<!--                  v-model="row.remark" />-->
<!--      </template>-->
<!--      <template #default-remark="{ row }">-->
<!--        {{row.remark}}-->
<!--      </template>-->

<!--      <template #default-make="{row,rowIndex}">-->
<!--        <el-button v-if="otherOutBoundList.length>1" size="small" text="plain" @click="deleteRowOutBoundEvent(row,rowIndex)">删除</el-button>-->
<!--      </template>-->
<!--    </XTable>-->


<!--      <template #footer>-->
<!--        <div style="display: flex; justify-content: center;">-->
<!--          <span class="dialog-footer">-->
<!--            <el-button :loading="buttonLoading" @click="dialogOutbound.visible = false">关闭</el-button>-->
<!--            <el-button :loading="buttonLoading" type="primary" @click="updateReceive">保存</el-button>-->
<!--          </span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->

    <el-drawer title="物料出库" v-model="dialogOutbound.visible" size="80%" destroy-on-close>
      <el-form :label-position="labelPosition" border label-width="100px" :model="formInlineOutBound">
        <el-row>
          <el-col :span="12">
            <el-form-item label="领用人">
              <el-select v-model="formInlineOutBound.checkUser" clearable :collapse-tags="true" filterable
                         placeholder="请选择领用人">
                <el-option v-for="item in wllyjsOptions"
                           :key="item.userId"
                           :label="item.nickName"
                           :value="item.userId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="领用时间：">
              <el-input v-model="formInlineOutBound.outBoundTime" placeholder="领用时间" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

<!--      <el-row style="justify-content: end;">-->
<!--        <el-button type="primary" @click="deleteRowOutBoundEventList">删除</el-button>-->
<!--      </el-row>-->
      <el-divider content-position="left">已选物料</el-divider>
      <XTable :pageShow="false" :data="otherOutBoundList" :columnList="outColumnList"
              ref="outBoundTable" border keep-source :column-config="{ resizable: true }"
              :checkbox-config="{ reserve: true }" :edit-rules="validRules"
              :edit-config="{ trigger: 'click', mode: 'row', autoClear: true, showStatus: true }" height="350px"
              :scroll-y="{ enabled: true, gt: 10 }" :row-config="{ keyField: 'id' }">
        <template #edit-appliedQuantity="{ row }">
          <el-input-number
            maxLength="11" :min="0" :max="row.quantity" :precision="2" style="width: 99%;" :controls="false"
            v-model="row.appliedQuantity"/>
        </template>
        <template #default-appliedQuantity="{ row }">
          {{row.appliedQuantity}}
        </template>
        <template #edit-remark="{ row }">
          <el-input maxLength="1000" style="width: 99%;"
                    v-model="row.remark"/>
        </template>
        <template #default-remark="{ row }">
          {{row.remark}}
        </template>

      </XTable>

      <el-divider content-position="left">待选物料</el-divider>
      <div style="text-align: right;width: 100%">
        <el-checkbox v-model="queryParamsWait.checked" @change="getList3">只显示在库物料</el-checkbox>
      </div>
      <XTable toolId="purchaseMaterialReceiveShowDrawer" v-model:page-size="queryParamsWait.pageSize"
              v-model:current-page="queryParamsWait.pageNum" height="400" class="xtable-content"
              :page-params="{ perfect: true, total: totalWait }" :data="materialInventoryWaitList" :columnList="columnList3"
              ref="xTableWait" size="mini"
              :scroll-x="true" :showRefresh="true" :loading="loading" :checkbox-config="{  reserve: true }"
              border @searchChange="searchMaterialChangeWait" :column-config="{ resizable: true }"
              @checkbox-change="selectChangeEvent"
              @checkbox-all="selectAllChangeEventWait"
              :row-config="{ keyField: 'id' }">
        <template #default-inOutRecordType="scope">
          {{ typeStrings[scope.row.inOutRecordType as keyof typeof InOutTypeEnum] }}
        </template>
      </XTable>

      <template #footer>
        <div style="display: flex; justify-content: center;">
              <span class="dialog-footer">
                <el-button :loading="buttonLoading" @click="dialogOutbound.visible = false">关闭</el-button>
                <el-button :loading="buttonLoading" type="primary" @click="updateReceive">保存</el-button>
              </span>
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
        没有设置查询条件，将默认导出30天内的数据
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

    <!--转仓 -->
    <el-dialog v-model="dialogRoll.visible" title="转仓" center width="30%" draggable>
      <!-- 主体 -->
      <el-form :label-position="labelPosition" border label-width="100px" :model="formInlineRoll">
        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="库存数量：">
              <el-input v-model="formInlineRoll.quantity" placeholder="库存数量" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="原库位：" prop="expirationDays">
              <el-input v-model="formInlineRoll.storageName" placeholder="原库位" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="转入仓：">
              <el-select v-model="formInlineRoll.rollStorage" clearable :collapse-tags="true"
                         placeholder="请选择转入仓">
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
            <el-form-item size="small" label="转入数量：" prop="expirationDays">
              <el-input v-model="formInlineRoll.rollQuantity" placeholder="转入数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="备注：" prop="expirationDays">
              <el-input v-model="formInlineRoll.remark" placeholder="备注">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogRoll.visible = false">关闭</el-button>
            <el-button type="primary" @click="updateChangStorag">保存</el-button>
          </span>
        </div>
      </template>
    </el-dialog>


    <!-- 退货 -->
    <el-dialog v-model="dialogExamine.visible" title="退货" center width="70%" draggable>
      <!-- 主体 -->
      <el-form :label-position="labelPosition" border label-width="100px" :model="formReturnOfGoods">
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="供应商：">
              <el-input v-model="formReturnOfGoods.supplierName" placeholder="code" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="退货时间：">
              <el-input v-model="formReturnOfGoods.returnOfGoodsTime" placeholder="updateTime" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <XTable
          border
          keep-source
          size="mini"
          align="center"
          height="545px"
          :row-config="{height: 50}"
          show-footer="true"
          :edit-rules="validRules"
          show-overflow
          :loading="loading"
          ref="xTable2223"
          :column-config="{resizable: true}"
          :data="otherReceiptList"
          :edit-config="{trigger: 'click', mode: 'row', autoClear: true, showStatus: true}"
          :pageShow="false"
          :columnList="columnListReturnGoods"
      >
        <!-- <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column field="materialCode" title="物料编码">
          <template #edit="{ row }">
            <el-input v-model="row.materialCode"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="name" title="物料名称">
          <template #edit="{ row }">
            <el-input v-model="row.name"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="materialQuality" title="材质牌号">
          <template #edit="{ row }">
            <el-input v-model="row.materialQuality"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="productionDate" title="生产日期">
          <template #edit="{ row }">
            <el-input v-model="row.productionDate"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="expirationDays" title="保质期（天）">
          <template #edit="{ row }">
            <el-input v-model="row.expirationDays"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="expirationDate" title="过期日期">
          <template #edit="{ row }">
            <el-input v-model="row.expirationDate"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="quantity" title="库存数">
          <template #edit="{ row }">
            <el-input v-model="row.quantity"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="returnOfGoodsQuantity" title="退货数" :edit-render="{placeholder: '请点击输入'}"> -->
          <template #edit-returnOfGoodsQuantity="{ row }">
            <el-input v-model="row.returnOfGoodsQuantity"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="remark" title="备注" sort-type="string" :edit-render="{placeholder: '请点击输入'}"> -->
          <template #edit-remark="{ row }">
            <el-input v-model="row.remark"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column title="操作" width="200"> -->
          <template #default-make="{ row,rowIndex}">
            <el-button size="small" text="plain" @click="deleteRowEvent(row,rowIndex)">删除</el-button>
          </template>
        <!-- </vxe-column> -->
      </XTable>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="dialogExamine.visible = false">关闭</el-button>
            <el-button type="primary" @click="saveReturnofGoods(1)">保存</el-button>
            <el-button type="primary" @click="saveReturnofGoods(2)">提交</el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <materialPrint ref="materialPrintRef"/>
  </div>
</template>

<script setup name="MaterialReceive" lang="ts">
import {
  addMaterialOrder,
  delMaterialOrder,
  getMaterialOrder,
  getMaterialOrderDetilList,
  updateDetailStatusClose,
  updateDetailStatusOpen,
  updateMaterialOrder
} from '@/api/purchase/materialOrder';
import {MaterialOrderForm, MaterialOrderQuery, MaterialOrderVO} from '@/api/purchase/materialOrder/types';
import {ref} from 'vue'
import {VxeColumnPropTypes, VXETable, VxeTableEvents, VxeTableInstance} from 'vxe-table'
import {MaterialOrderDetailVO} from "@/api/purchase/materialOrderDetail/types";
import dayjs from "dayjs";
import useUserStore from "@/store/modules/user";
import {OrderVO} from "@/api/order/directOrder/types";
import {deepClone} from "@/utils";
import {listMaterialInOutRecord,listCountMaterialInOutRecord} from "@/api/purchase/materialInOutRecord";
import {MaterialInOutRecordVO} from "@/api/purchase/materialInOutRecord/types";
import {
  listMaterialInventory,
  listMaterialInventoryList,
  updateMaterialBackInventoryInOutRecord,
  updateMaterialInventory,
  updateMaterialInventoryInOutRecord,
  updateMaterialRollInventoryInOutRecord,
  listCountMaterialInventory, listCountV2, printMaterialList
} from "@/api/purchase/materialInventory";
import {MaterialInventoryVO} from "@/api/purchase/materialInventory/types";
import {UserVO} from "@/api/system/user/types";
import {listUserByRoleKey} from "@/api/system/user";
import {MaterialStorageVO} from "@/api/purchase/materialStorage/types";
import {listMaterialStorage} from "@/api/purchase/materialStorage";
import {DirectMaterialReceipt, DirectMaterialReceive} from "@/api/purchase/materialReceive/types";
import { getBaseStorage } from "@/api/system/config";
import {typeStrings, InOutTypeEnum, typeList} from "@/api/basedata/rawMaterial/types";
import {checkPermi} from "@/utils/permission";
import {MaterialApplyVO} from "@/api/purchase/materialApply/types";
import {
  MaterialMonthInventoryForm,
  MaterialMonthInventoryQuery,
  MaterialMonthInventoryVO
} from "@/api/purchase/materialMonthInventory/types";
import {listMaterialMonthInventory} from "@/api/purchase/materialMonthInventory";

const outTotal = ref(0);
const inTotal = ref(0);
const outTotal2 = ref(0);
const inTotal2 = ref(0);
const inTransitTotal = ref(0);

const baseStorage = ref<any[]>([]);

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const materialOrderList = ref<MaterialInOutRecordVO[]>([]);
const otherReceiptList = ref<MaterialOrderDetailVO[]>([]);
const otherOutBoundList = ref<MaterialOrderDetailVO[]>([]);

const otherList = ref<MaterialOrderVO[]>([]);
const xTable = ref<VxeTableInstance<MaterialOrderDetailVO>>();
const xTableWait = ref();
const outBoundTable = ref<VxeTableInstance<MaterialOrderDetailVO>>();


const materialInventoryList = ref<MaterialInventoryVO[]>([]);

const materialMonthInventoryList = ref<MaterialMonthInventoryVO[]>([]);

const selectMaterialList = ref<MaterialInventoryVO[]>([]);

const materialInventoryWaitList = ref<MaterialInventoryVO[]>([]);

const periodicalFormRef = ref<ElFormInstance>();
//板材级别
const {order_material_level} = toRefs<any>(proxy?.useDict("order_material_level"));
//板厚
const {finish_plate_thickness} = toRefs<any>(proxy?.useDict("finish_plate_thickness"));
//颜色
const {order_commodity_solder} = toRefs<any>(proxy?.useDict("order_commodity_solder"));
//单位
const {units_type} = toRefs<any>(proxy?.useDict("units_type"));



const {material_in_out_record_type} = toRefs<any>(proxy?.useDict("material_in_out_record_type"));
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const totalMonth = ref(0);
const totalWait = ref(0);

const queryFormRef = ref<ElFormInstance>();
const materialOrderFormRef = ref<ElFormInstance>();

//领用人
let salerOptions: UserVO[] = [];

//仓库
let storageOptions: MaterialStorageVO[] = [];

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogExamine = reactive<DialogOption>({
  visible: false,
  title: '退货'
});

const dialogPeriodical = reactive<DialogOption>({
  visible: false,
  title: '保质期修改'
});


const dialogOutbound = reactive<DialogOption>({
  visible: false,
  title: '出库'
});


const dialogRoll = reactive<DialogOption>({
  visible: false,
  title: '转仓'
});


const dialogMaterial = reactive<DialogOption>({
  visible: false,
  title: '审核'
});

const seqFixed = ref<VxeColumnPropTypes.Fixed>()
const expandFixed = ref<VxeColumnPropTypes.Fixed>()
const ageFixed = ref<VxeColumnPropTypes.Fixed>()
const toggleExpandFixed = () => {
  expandFixed.value = expandFixed.value ? null : 'left'
}

const initFormData: MaterialOrderForm = {
  id: undefined,
  code: undefined,
  supplierId: undefined,
  addressId: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  submitUserId: undefined,
  submitUserName: undefined,
  remark: undefined,
  status: undefined,
  createTime:undefined
}

const data = reactive<PageData<MaterialOrderForm, MaterialOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    createTimeStart:undefined,
    createTimeEnd:undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    status: undefined,
    params: {}
  },
  queryParamsLive: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    checked:false,
    status: undefined,
    params: {}
  },
  queryParamsWait: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    supplierId: undefined,
    addressId: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    checked:false,
    status: undefined,
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "$comment不能为空", trigger: "blur"}
    ],
    code: [
      {required: true, message: "采购单号不能为空", trigger: "blur"}
    ],
    supplierId: [
      {required: true, message: "供应商ID不能为空", trigger: "blur"}
    ],
    addressId: [
      {required: true, message: "收货地址ID不能为空", trigger: "blur"}
    ],
    auditUserId: [
      {required: true, message: "审核人ID不能为空", trigger: "blur"}
    ],
    auditUserName: [
      {required: true, message: "审核人名称不能为空", trigger: "blur"}
    ],
    submitUserId: [
      {required: true, message: "提交人ID不能为空", trigger: "blur"}
    ],
    submitUserName: [
      {required: true, message: "提交人名称不能为空", trigger: "blur"}
    ],
    remark: [
      {required: true, message: "备注不能为空", trigger: "blur"}
    ],
    status: [
      {required: true, message: "状态不能为空", trigger: "change"}
    ]
  }
});

const {queryParams, queryParamsLive, queryParamsWait, form, rules} = toRefs(data);

const monthData = reactive<PageData<MaterialMonthInventoryForm, MaterialMonthInventoryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    version:undefined,
    rawMaterialId: undefined,
    quantity: undefined,
    price: undefined,
    yearMonth: undefined,
    outQuantity: undefined,
    inQuantity: undefined,
    outTotal: undefined,
    inTotalPrice: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    yearMonth: [
      { required: true, message: "年月不能为空", trigger: "blur" }
    ],
    outQuantity: [
      { required: true, message: "出库数量不能为空", trigger: "blur" }
    ],
    inQuantity: [
      { required: true, message: "入库数量不能为空", trigger: "blur" }
    ],
    outTotal: [
      { required: true, message: "出库金额不能为空", trigger: "blur" }
    ],
    inTotalPrice: [
      { required: true, message: "入库金额不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所属单位ID不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams: monthQueryParams, form: monthForm } = toRefs(monthData);


const inOutOptions = ref([
  {value: "1", label: "出库"},
  {value: "2", label: "入库"},
])

const typeMainInfo = typeList;

const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', field: 'index', width: '60' },
  { title: '来源', field: 'inOutRecordType', align: 'center', width: '90'
    ,filterType: 'checkboxButton'
    , filterParam: { placeholder: '请选择操作类型' },
    filterData:()=>typeMainInfo},
  { title: '类型', field: 'inOutType', align: 'center', width: '90',filterType: 'radio',
    filterParam: { placeholder: '' }, filterData: () => inOutOptions.value },
    //{{ typeStrings[scope.row.inOutRecordType as keyof typeof InOutTypeEnum] }}
  { title: '供应商编码', field: 'supplierCode', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '供应商名称', field: 'supplierName', align: 'center', width: '100', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料类别', field: 'categoryName', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料编码', field: 'materialCode', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称', field: 'name', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板厚', field: 'boardThickness', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚', field: 'copperThickness', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '级别', field: 'level', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长（mm）', field: 'length', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽（mm）', field: 'width', align: 'center', width: '80', showOverflow: false , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center', filterType: 'input', },
  { title: '直径', field: 'diameter',width: '80', align: 'center', filterType: 'input', },
  { title: '品牌', field: 'manufacturer', align: 'center' , width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  /*{ title: '生产日期', field: 'productionDate', align: 'center', width: '80', showOverflow: false },
  { title: '保质期（天）', field: 'expirationDays', align: 'center', width: '80', showOverflow: false },
  { title: '过期日期', field: 'expirationDate', align: 'center', width: '80', showOverflow: false},*/
  { title: '所属仓库',width:'120', field: 'storageName', align: 'center', filterType: 'radioButton',
          filterData: () => baseStorage.value,
          filterCustom: {label: 'name', value: 'id'}  },
  { title: '库存单位', field: 'unit', align: 'center', width: '80', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '操作前库存', field: 'beforeQuantity',width:'100', align: 'center', showOverflow: false },
  { title: '出/入库数量', field: 'opQuantity',width:'100', align: 'center', showOverflow: false },
  { title: '单价(元)',width:'80', field: 'price', align: 'center', showOverflow: false, isPermi: () => checkPermi(['inventory:material:cost'])  },
  { title: '出/入库金额',width:'120', field: 'totalAmount', align: 'center', showOverflow: false, isPermi: () => checkPermi(['inventory:material:cost'])  },
  { title: '备注',width:'80', field: 'remark', align: 'center',  filterType: 'input',},
  { title: '操作人',width:'120', field: 'createByName', align: 'center',filterType: 'input' },
  { title: '操作时间',width:'120', field: 'createTime',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  // { title: '领用人',width:'120', field: 'receiveUserName', align: 'center', filterType: 'input', },
  // { title: '操作数量', field: 'quantity',width:'100', align: 'center', showOverflow: false },

]);

const intervalCondition = ['quantity', 'price', 'inQuantity', 'inTotalPrice', 'outQuantity', 'outTotal', 'inventoryWarningQuantity'];

const columnList2 = ref([
  // { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left' , isPermi: () => checkPermi(['inOut:inventory:out'])},
  {type: 'checkbox', width: '40', align: "center",fixed: 'left',},
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60',fixed: 'left' },
  { title: '物料类别',width:'80', field: 'categoryName',fixed: 'left', align: 'center',showOverflow: false, filterType: 'input', filterParam: { placeholder: '' }},
  /*{ title: '供应商编码', width:'100', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '供应商名称', width:'120', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},*/
  { title: '物料编码', width:'80',field: 'materialCode', fixed: 'left',align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称', width:'160', field: 'name', align: 'center',fixed: 'left', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '单位', field: 'unit', align: 'center',width: '60' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '材质牌号',width:'100', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板厚',width:'70', field: 'boardThickness', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚',width:'70', field: 'copperThickness', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '级别', width:'70',field: 'level', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '颜色',width:'70', field: 'color', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长（mm）',width:'70', field: 'length', align: 'center', showOverflow: false , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '宽（mm）', width:'70',field: 'width', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false , filterType: 'input'},
  { title: '规格型号', field: 'specification',width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter',width: '80', align: 'center',filterType: 'input', },
  { title: '品牌', width:'120',field: 'manufacturer', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
 /* { title: '生产日期', width:'120', field: 'productionDate', align: 'center', showOverflow: false },
  { title: '保质期（天）',width:'80', field: 'expirationDays', align: 'center', showOverflow: false },
  { title: '过期日期',width:'120', field: 'expirationDate', align: 'center', showOverflow: false},*/
  { title: '所属仓库',width:'120', field: 'storageName', align: 'center',filterType: 'radioButton',
          filterData: () => baseStorage.value,
          filterCustom: {label: 'name', value: 'id'} },
  { title: '库存预警值', field: 'inventoryWarningQuantity', width: '90', align: 'center' , filterType: 'intervalNumber', },
  // { title: '结存数量',width:'120', field: 'monthQuantity', align: 'center', filterType: "intervalNumber", showOverflow: false },
  // { title: '结存成本价(元)',width:'120', field: 'monthPrice', align: 'center', filterType: "intervalNumber", showOverflow: false, isPermi: () => checkPermi(['inventory:material:cost']) },
  // { title: '结存总金额(元)',width:'120', field: 'monthTotalPrice', align: 'center', showOverflow: false, isPermi: () => checkPermi(['inventory:material:cost']) },
  // { title: '结存入库数',width:'120', field: 'inQuantity', align: 'center', filterType: "intervalNumber", showOverflow: false },
  // { title: '结存入库金额(元)',width:'120', field: 'inTotalPrice', align: 'center', filterType: "intervalNumber", showOverflow: false },
  // { title: '结存出库数',width:'120', field: 'outQuantity', align: 'center', filterType: "intervalNumber", showOverflow: false },
  // { title: '结存出库金额',width:'120', field: 'outTotal', align: 'center', filterType: "intervalNumber", showOverflow: false },
  { title: '在途库存',width:'120', field: 'inTransitNumber', align: 'center', fixed: 'right', showOverflow: false },
  { title: '当前库存',width:'120', field: 'quantity', align: 'center', filterType: "intervalNumber", fixed: 'right', showOverflow: false},
  { title: '当前成本价(元)',width:'140', field: 'price', align: 'center', fixed: 'right', showOverflow: false, isPermi: () => checkPermi(['inventory:material:cost'])},
  // { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false, isPermi: () => checkPermi(['inOut:inventory:out']) },
]);

const columnList3 = ref([
  { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left' , isPermi: () => checkPermi(['inOut:inventory:out'])},
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60',fixed: 'left' },
  { title: '物料类别',width:'80', field: 'categoryName',fixed: 'left', align: 'center',showOverflow: false, filterType: 'input', filterParam: { placeholder: '' }},
  /*{ title: '供应商编码', width:'100', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '供应商名称', width:'120', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},*/
  { title: '物料编码', width:'80',field: 'materialCode', fixed: 'left',align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称', width:'120', field: 'name', align: 'center',fixed: 'left', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '材质牌号',width:'100', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板厚',width:'70', field: 'boardThickness', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚',width:'70', field: 'copperThickness', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '级别', width:'70',field: 'level', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '颜色',width:'70', field: 'color', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长（mm）',width:'70', field: 'length', align: 'center', showOverflow: false , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '宽（mm）', width:'70',field: 'width', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false , filterType: 'input'},
  { title: '规格型号', field: 'specification',width: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter',width: '80', align: 'center',filterType: 'input', },
  { title: '品牌', width:'120',field: 'manufacturer', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  /* { title: '生产日期', width:'120', field: 'productionDate', align: 'center', showOverflow: false },
   { title: '保质期（天）',width:'80', field: 'expirationDays', align: 'center', showOverflow: false },
   { title: '过期日期',width:'120', field: 'expirationDate', align: 'center', showOverflow: false},*/
  { title: '仓库位',width:'120', field: 'storageName', align: 'center',filterType: 'radioButton',
    filterData: () => baseStorage.value,
    filterCustom: {label: 'name', value: 'id'} },
  { title: '库存单位', field: 'unit', align: 'center',width: '60' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '库存数',width:'80', field: 'quantity', align: 'center' , showOverflow: false ,fixed: 'right'},
  { title: '可用库存数',width:'80', field: 'quantity', align: 'center', showOverflow: false ,fixed: 'right'},
  { title: '在途数',width:'80', field: 'inTransitNumber', align: 'center', showOverflow: false ,fixed: 'right'},
  // { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false, isPermi: () => checkPermi(['inOut:inventory:out']) },
]);

const outColumnList = ref([
  // { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left' },
  { title: "序号", type: 'seq', align: 'center', field: 'index', width: '60' },
  { title: '物料编码', field: 'materialCode', align: 'center', width: '80', },
  { title: '物料名称', field: 'name', align: 'center', width: '80', },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', },
  { title: '板厚', field: 'boardThickness', align: 'center', width: '80',   },
  { title: '铜厚', field: 'copperThickness', align: 'center', width: '80',  },
  { title: '颜色', field: 'color', align: 'center', width: '80', },
  { title: '级别', field: 'level', align: 'center', width: '80',   },
  { title: '长（mm）', field: 'length', align: 'center', width: '80',  },
  { title: '宽（mm）', field: 'width', align: 'center', width: '80', showOverflow: false , },
  { title: '品牌', field: 'manufacturer', align: 'center' , width: '80', },
  { title: '规格型号', field: 'specification',width: '120', align: 'center',   },
  { title: '库位',width:'120', field: 'storageName', align: 'center'  },
 // { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
 // { title: '直径', field: 'diameter',width: '80', align: 'center', filterType: 'input', },
  { title: '库存单位', field: 'unit', align: 'center', width: '80', },
  { title: '库存数',width:'80', field: 'quantity', align: 'center', showOverflow: false },
  { title: '可用库存数',fixed:'right',width:'80', field: 'quantity', align: 'center', showOverflow: false },
  { title: '领用数量',fixed:'right',width:'80', field: 'appliedQuantity', align: 'center', showOverflow: false,editRender:{} },
  { title: '备注',fixed:'right',width:'120', field: 'remark', align: 'center',  editRender:{} },
  // { title: '操作',fixed:'right', field: 'make',width:'100', align: 'center', showOverflow: false },
]);
// 退货弹框
const columnListReturnGoods = ref([
{ type: 'seq',title: '序号',align: 'center',  },
{ title: '物料编码',field: 'materialCode',align: 'center',  },
{ title: '物料名称',field: 'name',align: 'center',  },
{ title: '材质牌号',field: 'materialQuality',align: 'center',  },
{ title: '生产日期',field: 'productionDate',align: 'center',  },
{ title: '保质期（天）',field: 'expirationDays',align: 'center',  },
{ title: '过期日期',field: 'expirationDate',align: 'center',  },
{ title: '库存数',field: 'quantity',align: 'center',  },
{ title: '退货数',field: 'returnOfGoodsQuantity',editRender: {},align: 'center',  },
{ type: 'string',title: '备注',field: 'remark',editRender: {},align: 'center',  },
{ width: '200',title: '操作',align: 'center',  },
]);

const columnList4 = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60',fixed: 'left' },
  { title: '物料类别',minWidth:'80', field: 'categoryName',fixed: 'left', align: 'center',showOverflow: false, filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料编码', minWidth:'80',field: 'materialCode', fixed: 'left',align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称', minWidth:'140', field: 'materialName', align: 'center',fixed: 'left', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '材质牌号',width:'100', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '长（mm）',width:'80', field: 'length', align: 'center', showOverflow: false , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '宽（mm）', width:'80',field: 'width', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification',minWidth: '120', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  // { title: '所属仓库',width:'120', field: 'storageName', align: 'center',filterType: 'radioButton',
  //   filterData: () => baseStorage.value,
  //   filterCustom: {label: 'name', value: 'id'} },
  { title: '结存数量',width:'120', field: 'quantity', align: 'center', filterType: "intervalNumber", showOverflow: false },
  { title: '结存成本价(元)',width:'120', field: 'price', align: 'center', filterType: "intervalNumber", showOverflow: false, },
  { title: '结存总金额(元)',width:'120', field: 'totalAmount', align: 'center', showOverflow: false,},
  { title: '结存入库数',width:'120', field: 'inQuantity', align: 'center', filterType: "intervalNumber", showOverflow: false },
  { title: '结存入库金额(元)',width:'120', field: 'inTotalPrice', align: 'center', filterType: "intervalNumber", showOverflow: false },
  { title: '结存出库数',width:'120', field: 'outQuantity', align: 'center', filterType: "intervalNumber", showOverflow: false },
  { title: '结存出库金额(元)',width:'120', field: 'outTotal', align: 'center', filterType: "intervalNumber", showOverflow: false },
   // { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false, isPermi: () => checkPermi(['inOut:inventory:out']) },
]);

// 新增属性
const editableTabsValue = ref(2);

// 获取 搜索条件
const searchMaterialChange = (params: any) => {
  const tempCheck = queryParamsLive.value.checked
  queryParamsLive.value = params
  queryParamsLive.value.status = editableTabsValue.value
  queryParamsLive.value.checked = tempCheck
  getList2()
  setSelect
}
const searchChange = (params: any) => {
  queryParams.value = params
  queryParams.value.status = editableTabsValue.value
  Object.keys(params).forEach(key => {
    if (key == 'inOutRecordType') {
      queryParams.value['inOutTypeList'] = params[key];
    } else if (params[key] !== null && params[key] !== undefined) {
      queryParams.value[key] = params[key];
    }
  });
  queryParams.value['inOutRecordType'] = undefined
  getList()
}

// 获取 搜索条件
const searchMaterialChangeWait = (params: any) => {
  const tempCheck = queryParamsWait.value.checked;
  queryParamsWait.value = params
  queryParamsWait.value.status = editableTabsValue.value
  queryParamsWait.value.checked = tempCheck
  console.log(queryParamsWait.value)
  getList3()
}

/**
 * 查询收货列表
 * */
const getVoidedList = async () => {
  queryParams.value.status = editableTabsValue.value
  if (1 == editableTabsValue.value) {
    getList();
  } else if (2 == editableTabsValue.value) {

    getList2();
  } else {
    getMonthList();
  }

}

/**
 * 修改保质期
 * @param row
 */
const saveInventory = () => {
  periodicalFormRef.value.validate(async (value: boolean) => {
    console.log('---', value)
    if (value) {
      console.log(formInline);
      buttonLoading.value = true;
      await updateMaterialInventory(formInline).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("修改成功");
      dialogPeriodical.visible = false;
      await getList2();
    }
  })
}

const userStore = useUserStore().nickname;

//领用人员
const wllyjsOptions = ref<UserVO[]>([]);
/**
 * 批量收货按钮
 */
const handleOutbound = async () => {
  //收货人
 // formInlineOutBound.userName = userStore;
  otherOutBoundList.value = [];
  formInlineOutBound.checkUser="";
  //formInlineOutBound.userName = userStore;
  const $table = xTable.value.xTableRef;
  let checkList ;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords().concat($table.getCheckboxReserveRecords());
    checkList = selectRecords;
  }
  // if (checkList.length <= 0) {
  //   ElMessage.error("请选择需要出货列表");
  //   return;
  // }
  getList3();
  const ids = checkList.map(item=>item.id);
  let data =await getListMaterialInventoryList(ids);

  otherOutBoundList.value =data;
  dialogOutbound.visible = true;
  dialogExamine.title = "物料出库";
  loading.value = true
  let salerResponse: any = await listUserByRoleKey("wllyjs");
  wllyjsOptions.value = salerResponse.data;
  formInlineOutBound.wllyjsList=salerResponse.data;
  formInlineOutBound.outBoundTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  loading.value = false
}


const getListMaterialInventoryList = async (ids:any) => {
  //名称转id查询
  let queryList = {
    idList:ids
  }
  const res = await listMaterialInventoryList(queryList);

  return res;
}
/**
 * 物料出库
 * @param row
 */
const updateReceive = async () => {
  if (formInlineOutBound.checkUser == undefined || formInlineOutBound.checkUser == ""){
    proxy?.$modal.msgError("领用人不能为空");
    return;
  }
  const directMaterialReceive: DirectMaterialReceive = {
    otherOutBoundList: [],
    checkUser:"",
    supplierId: "",
  };
  if(otherOutBoundList.value.length==0){
    proxy?.$modal.msgError("请选择物料");
    return;
  }
  const flag1 = otherOutBoundList.value.some(v => !v.appliedQuantity);
  if (flag1) {
    proxy?.$modal.msgError("领用数量不能为空");
    return;
  }
  const flag2 = otherOutBoundList.value.some(v => Number(v.appliedQuantity) > 0);
  if (!flag2) {
    proxy?.$modal.msgError("领用数量必须大于0");
    return;
  }

  const flag = otherOutBoundList.value.some(v => Number(v.quantity) < Number(v.appliedQuantity));
  if (flag) {
    proxy?.$modal.msgError("领用数不能大于库存数");
    return;
  }
  directMaterialReceive.checkUser=formInlineOutBound.checkUser;
  directMaterialReceive.otherOutBoundList = otherOutBoundList.value;
  buttonLoading.value = true;
  await updateMaterialInventoryInOutRecord(directMaterialReceive).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("出库成功");
  dialogOutbound.visible = false;
  xTable.value.xTableRef.clearCheckboxRow();
  xTable.value.xTableRef.clearCheckboxReserve();
  await getList2();
}

/**
 * 转仓保存
 */
const updateChangStorag = async () => {
//转入数量不能大于库存数
  if (Number(formInlineRoll.quantity) < Number(formInlineRoll.rollQuantity)) {
    proxy?.$modal.msgSuccess("转入数不能大于库存数");
    return;
  }
  if (formInlineRoll.rollStorage == null) {
    proxy?.$modal.msgSuccess("转入仓不能为空");
    return;
  }
  if (formInlineRoll.rollQuantity < 0 || formInlineRoll.rollQuantity==null) {
    proxy?.$modal.msgSuccess("转入数量必须大于0");
    return;
  }
  buttonLoading.value = true;
  await updateMaterialRollInventoryInOutRecord(formInlineRoll).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("转仓成功");
  dialogRoll.visible = false;
  await getList2();
}

/**
 * 物料退货
 * @param row
 */
const saveReturnofGoods = async (type: string) => {
  const directMaterialReceipt: DirectMaterialReceipt = {
    otherReceiptList: [],
    type:"",
  };
  const flag = otherReceiptList.value.some(v => Number(v.quantity) < Number(v.returnOfGoodsQuantity));
  if (flag) {
    proxy?.$modal.msgError("退货数不能大于库存数");
    return;
  }
  directMaterialReceipt.otherReceiptList = otherReceiptList.value;
  directMaterialReceipt.type=type;
  await updateMaterialBackInventoryInOutRecord(directMaterialReceipt).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("退货成功");
  const $table = xTable.value.xTableRef;
  if ($table) {
    $table.clearCheckboxRow();
  }
  dialogExamine.visible = false;
  await getList2();
}


const dispatchTimeChange = (row: OrderVO) => {
  if (row.preDeliveryHour != 0) {
    const dayjs1 = dayjs(row.deliveryTime);
    const dayjs2 = dayjs1.subtract(row.preDeliveryHour, 'hour');
    row.dispatchTime = dayjs2.format("YYYY-MM-DD HH:mm:ss");
  }
}

/**
 * 查询出入库记录表
 * */
const getList = async () => {
  loading.value = true;
  //名称转id查询
  if(queryParams.value.storageName){
    queryParams.value.storageId = queryParams.value.storageName;
  }
  const res = await listMaterialInOutRecord(queryParams.value);
  materialOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  await getListCount();
}

const getListCount = async () => {
  //名称转id查询
  if(queryParams.value.storageName){
    queryParams.value.storageId = queryParams.value.storageName;
  }
  const res = await listCountMaterialInOutRecord(queryParams.value);
  outTotal.value= res.data.outQuantity;
  inTotal.value= res.data.inQuantity;
}

/**
 * 查询实时库存展示
 * */
const getList2 = async () => {
  // debugger
  loading.value = true;
  //名称转id查询
  if(queryParamsLive.value.storageName){
    queryParamsLive.value.storageId = queryParamsLive.value.storageName;
  }
  //queryParamsLive.value.checked
  const res = await listMaterialInventory(queryParamsLive.value);
  materialInventoryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  getListCount2();
}

/**
 * 查询实时库存待选
 * */
const getList3 = async () => {
  // debugger
  loading.value = true;
  //名称转id查询
  if(queryParamsWait.value.storageName){
    queryParamsWait.value.storageId = queryParamsWait.value.storageName;
  }
  console.log('AAA',queryParamsWait.value.checked);
  //queryParamsLive.value.checked
  const res = await listMaterialInventory(queryParamsWait.value);
  materialInventoryWaitList.value = res.rows;
  totalWait.value = res.total;
  loading.value = false;
}

//选择物料 单选
const selectChangeEvent: VxeTableEvents.CheckboxChange<MaterialApplyVO> = ({checked, row}) => {
  const $table = xTableWait.value.xTableRef
  if ($table) {
    otherOutBoundList.value = deepClone($table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()));
  }
  // submitInventoryForm();
}

const selectRequisitionByMaterial = ref();

/** 多选框选中数据 */
const selectAllChangeEventWait = (selection: MaterialApplyVO[]) => {
  const $table = xTableWait.value.xTableRef
  if ($table) {
    otherOutBoundList.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }

}

const getListCount2 = async () => {
  if(queryParamsLive.value.storageName){
    queryParamsLive.value.storageId = queryParamsLive.value.storageName;
  }
  //queryParamsLive.value.checked
  const res = await listCountV2(queryParamsLive.value);
  outTotal2.value= res.data.availableInvQuantity;
  inTotal2.value= res.data.inventoryQuantity;
  inTransitTotal.value = res.data.inTransitQuantity;
}

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  num: string
  num2: string
  address: string
}

/**
 * 点击箭头下拉
 * @param row
 * @param rowIndex
 */
const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand<RowVO> = ({row, rowIndex}) => {
  otherList.value = [{
    categoryId: undefined,
    materialCode: undefined,
    name: undefined,
    specification: undefined,
    materialQuality: undefined,
    boardThickness: undefined,
    copperThickness: undefined,
    color: undefined,
    level: undefined,
    length: undefined,
    width: undefined,
    manufacturer: undefined,
    units: undefined,
    deliverTime: undefined,
    quantity: undefined,
    inventoryQuantity: undefined,
    returnsQuantityIqc: undefined
  }];
  const _id = row.id;
  getMaterialOrderDetilList(_id).then(res => {
    otherList.value = res.data.orderDetailVoList;
  })
  loading.value = false;
  console.log('行展开事件' + row)
}

const zeroAndPositiveIntValidHandle = (rule: any, value: any, callback: any) => {
  if (!/^[0-9]\d*$/.test(value) || Number(value) <= 0) {
    callback(new Error('请输入>0的正整数'))
  } else {
    callback()
  }
}

let formInline = reactive({
  id: undefined,
  code: undefined,
  productionDate: undefined,
  expirationDays: undefined,
});
const formInlineRules = ref({
  expirationDays: [
    {required: true, message: '请输入保质期', trigger: 'blur'},
    {validator: zeroAndPositiveIntValidHandle, trigger: 'blur' }
  ]
})

let formInlineOutBound = reactive({
  id: undefined,
  code: undefined,
  userName: undefined,
  outBoundTime: undefined,
  recipient: undefined,
  recipientQuantity: undefined,
  remark: undefined,
  salerList: [],
  otherOutBoundList: [],
  checkUser:undefined,
  wllyjsList: [],

});



let formInlineRoll = reactive({
  id: undefined,
  quantity: undefined,
  storageName: undefined,
  storageId: undefined,
  rollStorageName: undefined,
  remark: undefined,
  rollQuantity: undefined,
  rollStorage: undefined,
});

/**
 * 退货
 */
let formReturnOfGoods = reactive({
  id: undefined,
  returnOfGoodsTime: undefined,
  supplierName: undefined,
  otherReceiptList: [],
  quantity: undefined,
  returnOfGoodsQuantity: undefined,
  remark: undefined,
});


/**
 * 保质期修改
 * @param row
 */
const updatePeriodical = async (row?: MaterialInventoryVO) => {
  formInline.expirationDays = undefined;
  //物料编码
  formInline.code = row?.materialCode;
  formInline.id = row?.id;
  formInline.productionDate = row?.productionDate;
  dialogPeriodical.visible = true;
  dialogExamine.title = "保质期修改";
}


// 设置库存预警行样式背景
const setRowStyle = (scope: any) => {
  if (scope.row.warningQuantity) {
    return {
      background: 'rgb(236,176,177)',
    }
  }
}
/**
 * 物料出库
 * @param row
 */
const updateOutBound = async (row?: MaterialInventoryVO) => {
  reset();
  otherOutBoundList.value = [];
  formInlineOutBound.checkUser="";
  //formInlineOutBound.userName = userStore;
  dialogOutbound.visible = true;
  dialogOutbound.title = "物料出库";
  loading.value = true
  let salerResponse: any = await listUserByRoleKey("wllyjs");
  wllyjsOptions.value = salerResponse.data;
  formInlineOutBound.wllyjsList=salerResponse.data;
  formInlineOutBound.outBoundTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  // const info: MaterialInventoryVO = {
  //   materialCode: row?.materialCode,
  //   name: row?.name,
  //   supplierName: row?.supplierName,
  //   supplierCode: row?.supplierCode,
  //   boardThickness: row?.boardThickness,
  //   copperThickness: row?.copperThickness,
  //   length: row?.length,
  //   width: row?.width,
  //   color: row?.color,
  //   level: row?.level,
  //   unit: row?.unit,
  //   manufacturer: row?.manufacturer,
  //   storageName: row?.storageName,
  //   materialQuality: row?.materialQuality,
  //   productionDate: row?.productionDate,
  //   expirationDays: row?.expirationDays,
  //   expirationDate: row?.expirationDate,
  //   quantity: row?.quantity,
  //   rawMaterialId: row?.rawMaterialId,
  //   supplierId: row?.supplierId,
  //   id: row?.id,
  //   storageId: row?.storageId,
  //   remark: "",
  //   returnOfGoodsQuantity: "",
  //   specification: row?.specification,
  // }
  //otherOutBoundList.value.push(info);

  let outId = [];
  outId.push(row.id);

  let data =await getListMaterialInventoryList(outId);
  otherOutBoundList.value =data;

  formInlineOutBound.otherOutBoundList = otherOutBoundList.value;
  loading.value = false
}




/**
 * 物料退货
 * @param row
 */
const updateGoodsRejected = async (row?: MaterialInventoryVO) => {
  otherReceiptList.value = [];
  formReturnOfGoods.id = row?.id;
  formReturnOfGoods.supplierName = row?.supplierName;
  formReturnOfGoods.returnOfGoodsTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const info: MaterialInventoryVO = {
    materialCode: row?.materialCode,
    name: row?.name,
    supplierName: row?.supplierName,
    supplierCode: row?.supplierCode,
    boardThickness: row?.boardThickness,
    copperThickness: row?.copperThickness,
    length: row?.length,
    width: row?.width,
    color: row?.color,
    level: row?.level,
    unit: row?.unit,
    manufacturer: row?.manufacturer,
    storageName: row?.storageName,
    materialQuality: row?.materialQuality,
    productionDate: row?.productionDate,
    expirationDays: row?.expirationDays,
    expirationDate: row?.expirationDate,
    quantity: row?.quantity,
    rawMaterialId: row?.rawMaterialId,
    supplierId: row?.supplierId,
    id: row?.id,
    storageId: row?.storageId,
    remark: "",
    returnOfGoodsQuantity: ""
  }
  otherReceiptList.value.push(info);
  formReturnOfGoods.otherReceiptList = otherReceiptList.value;
  dialogExamine.visible = true;
  dialogExamine.title = "物料退货";
}

/**
 * 多选退货
 */
const handleGoodsRejected = async () => {
  //收货人
  formReturnOfGoods.supplierName = userStore;
  formReturnOfGoods.returnOfGoodsTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const $table = xTable.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    otherReceiptList.value = selectRecords;
  }
  if (otherReceiptList.value.length <= 0) {
    ElMessage.error("请选需要退货的数据");
    return;
  }
  dialogExamine.visible = true;
  dialogExamine.title = "物料退货";
}


/**
 * 物料转仓
 * @param row
 */
const updateRoll = async (row?: MaterialInventoryVO) => {
  for(let key in formInlineRoll) {
    formInlineRoll[key] = undefined
  }
  formInlineRoll.id = row?.id;
  formInlineRoll.quantity = row?.quantity;
  formInlineRoll.storageName = row?.storageName;
  formInlineRoll.storageId = row?.storageId;
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
  dialogRoll.visible = true;
  dialogRoll.title = "转仓";
}


const isActiveStatus = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value;
  if ($table) {
    return $table.isEditByRow(row);
  }
};

/**
 * 出货判断
 * @param row
 */
const isActiveOutBoundStatus = (row: MaterialOrderDetailVO) => {
  const $table = outBoundTable.value;
  if ($table) {
    return $table.isEditByRow(row);
  }
};

const saveRowEvent = (row: MaterialOrderDetailVO) => {
  // row.unitedNumber = row.unitedWayLength * row.unitedWayWidth;
  console.log(row)
  const $table = xTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        VXETable.modal.message({content: `保存成功！name=${row.name}`, status: "success"});
      }, 300);
    });
  }
};

/**
 * 出货保存
 * @param row
 */
const saveRowOutBoundEvent = (row: MaterialOrderDetailVO) => {
  console.log(row)
  if (Number(row.quantity) < Number(row.appliedQuantity)) {
    ElMessage.error("领用数量不能大于可用库存数量");
    return;
  }
  const $table = outBoundTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        VXETable.modal.message({content: `保存成功！name=${row.name}`, status: "success"});
      }, 300);
    });
  }
};


const cancelRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      // 还原行数据
      $table.revertData(row);
    });
  }
};

/**
 * 出货还原行数据
 * @param row
 */
const cancelRowOutBoundEvent = (row: MaterialOrderDetailVO) => {
  const $table = outBoundTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      // 还原行数据
      $table.revertData(row);
    });
  }
};

/**
 * 复制
 * @param row
 */
const copyRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = deepClone(row);
  if ($table) {
    $table._X_ROW_KEY = otherReceiptList.value.length + 1;
    $table.id = null;
    otherReceiptList.value.push($table);
    console.log(xTable.value)
  }
  console.log(otherReceiptList.value)
};

/**
 * 编辑
 * @param row
 */
const editRowEvent = (row: MaterialOrderDetailVO) => {
  const $table = xTable.value;
  if ($table) {
    $table.setEditRow(row);
  }
};

/**
 * 出货编辑
 * @param row
 */
const editRowOutBoundEvent = (row: MaterialOrderDetailVO) => {
  const $table = outBoundTable.value;
  if ($table) {
    $table.setEditRow(row);
  }
};

/**
 * 出货删除
 * @param row
 * @param index
 */
const deleteRowOutBoundEvent = (row: MaterialOrderDetailVO, index: number) => {
  ElMessageBox.confirm(
      "您确定要删除该记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  )
      .then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        otherOutBoundList.value.splice(index, 1);//删除该行记录
        const $table = xTableWait.value.xTableRef
        $table.setCheckboxRow(row, false);
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};


const deleteRowOutBoundEventList = () => {
  let checkList=outBoundTable.value.xTableRef.getCheckboxRecords();
  if(checkList.length==0){
    ElMessage.error("请选择需要删除的数据");
    return;
  }
  if(checkList.length==otherOutBoundList.value.length){
    ElMessage.error("请至少保留一条数据");
    return;
  }
  ElMessageBox.confirm(
      "您确定要删除?","提示",
      { confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        checkList.forEach((item: MaterialOrderDetailVO) => {
          const index = otherOutBoundList.value.findIndex((v: MaterialOrderDetailVO) => v.id === item.id);
          otherOutBoundList.value.splice(index, 1);
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};

/**
 * 删除
 * @param row
 * @param index
 */
const deleteRowEvent = (row: MaterialOrderDetailVO, index: number) => {
  ElMessageBox.confirm(
      "您确定要删除该记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  )
      .then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        otherReceiptList.value.splice(index, 1);//删除该行记录
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  materialOrderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MaterialOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加采购订单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改采购订单";
}

/**
 *结单按钮
 * @param row
 */
const statementOfAccount = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  await proxy?.$modal.confirm('是否确认采购订单编号为"' + _id + '"的数据项结单？').finally(() => loading.value = false);
  const res = await updateDetailStatusOpen(_id);
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("结单成功");
  await getList();
}

const exportVisible = ref(false);
const mainTableToolId = ref('purchaseMaterialReceiveShow');
const mainTableReceiveToolId = ref('purchaseMaterialReceiveRecord');
const rawMaterialMonthToolId = ref('rawMaterialMonthToolId');
/** 导出前操作 */
const exportExcelBefore = async () => {
  // 先看看有没有查询条件，没有要给出提示
  // let count = 0;
  // for(let key in queryParamsLive.value) {
  //   if (key!='pageNum'&&key!='pageSize'&&key!='sorts'&&key!='status'&&key!='checked'&&key!='params'&&key!='isExistQuery'
  //     && queryParamsLive.value[key] !== null && queryParamsLive.value[key] !== undefined) {
  //     count++;
  //   }
  // }
  //
  // if (count <= 0) {
  //   exportVisible.value = true;
  //   queryParamsLive.value.isExistQuery = '0';
  // } else {
  //   queryParamsLive.value.isExistQuery = '1';
    proxy?.download('system/materialInventory/export', {
      ...queryParamsLive.value, tableName: mainTableToolId.value
    }, `实时库存_${new Date().getTime()}.xlsx`);
 // }
}

/**
 * 出入库记录导出
 */
const exportExcelReceiveRecord = async () => {
  //先看看有没有给起始时间，没有要给出提示
/*  if (!queryParams.value.createTimeStart) {
    exportVisible.value = true;
  } else {*/
    proxy?.download('purchase/materialInOutRecord/export', {
      ...queryParams.value, tableName: mainTableReceiveToolId.value
    }, `出入库记录_${new Date().getTime()}.xlsx`);
 // }
}

/** 导出操作 */
const exportExcel = async () => {
  exportVisible.value = false;
  if(1 == editableTabsValue.value){
    proxy?.download('purchase/materialInOutRecord/export', {
      ...queryParams.value, tableName: mainTableReceiveToolId.value
    }, `出入库记录_${new Date().getTime()}.xlsx`);
  } else if(2 == editableTabsValue.value){
    proxy?.download('system/materialInventory/export', {
      ...queryParamsLive.value, tableName: mainTableToolId.value
    }, `实时库存_${new Date().getTime()}.xlsx`);
  } else {
    proxy?.download('system/materialMonthInventory/export', {
      ...queryParams.value, tableName: rawMaterialMonthToolId.value
    }, `物料结存_${new Date().getTime()}.xlsx`);
  }
}

/**
 *取消结单按钮
 * @param row
 */
const closeStatementOfAccount = async (row?: MaterialOrderDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  await proxy?.$modal.confirm('是否确认取消采购订单编号为"' + _id + '"的结单数据项？').finally(() => loading.value = false);
  const res = await updateDetailStatusClose(_id);
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("取消结单成功");
  await getList();
}

//正整数校验
const positiveIntValid = (cellValue: any) => {
  if (!/^[1-9]\d*$/.test(cellValue)) {
    return new Error('请输入正整数')
  }
}
VXETable.validators.add('positiveIntValid', {
  cellValidatorMethod({cellValue}) {
    positiveIntValid(cellValue)
  }
})


/** 提交按钮 */
const submitForm = () => {
  materialOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMaterialOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物料编码为"' + row.materialCode + '"的数据项？').finally(() => loading.value = false);
  await delMaterialOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialOrder/export', {
    ...queryParams.value
  }, `materialOrder_${new Date().getTime()}.xlsx`)
}

const getListBaseStorage = async () => {
  const res = await getBaseStorage();
  baseStorage.value = res.data;
};

const materialPrintRef = ref();

const materialTableRef = ref()

/** 打印标签按钮操作 */
const handlePrint = async () => {
  // 没有勾选查询所有数据
  if (!selectMaterialList.value || selectMaterialList.value.length == 0) {
    proxy?.$modal.msgError("请选择需要打印标签的的数据项");
    return;
  }
  proxy?.$modal.loading("加载中...");
  materialPrintRef.value.doPrint(selectMaterialList.value);
  proxy?.$modal.closeLoading()
}

/** 选择产品 */
const selectionChange = () => {
  const $table = materialTableRef.value.xTableRef
  if ($table) {
    // 获取翻页保留的列表数据和选择的行数据列表
    const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
    selectMaterialList.value = selectRecords.map(item => item);
  }
}

/** 设置表格列表选中 */
const setSelect = () => {
  const $table = materialTableRef.value.xTableRef
  if ($table) {
    //过滤materialList中id在alreadySelectMaterial中的数据，
    let st = inventoryList.value.filter(item => {
      return selectMaterialList.value.some(item2 => item.id == item2.id);
    });

    //先为materialList中所有数据取消选中
    $table.setCheckboxRow(inventoryList, false);
    $table.setCheckboxRow(st, true);
  }
}

/** 结存查询操作 */
const handleMonthQuery = () => {
  monthQueryParams.value.pageNum = 1;
  getMonthList();
}

/** 查询物料月度结存列表 */
const getMonthList = async () => {
  loading.value = true;
  const res = await listMaterialMonthInventory(monthQueryParams.value);
  materialMonthInventoryList.value = res.rows;
  totalMonth.value = res.total;
  loading.value = false;
}

// 获取 搜索条件
const monthSearchChange = (params: any) => {
  params.yearMonth = monthQueryParams.value.yearMonth;
  monthQueryParams.value = params;
  getMonthList()
}

/** 导出前操作 */
const exportMonthExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!monthQueryParams.value.yearMonth) {
    exportVisible.value = true;
  } else {
    proxy?.download('system/materialMonthInventory/export', {
      ...monthQueryParams.value, tableName: rawMaterialMonthToolId.value
    }, `物料结存_${new Date().getTime()}.xlsx`);
  }
}

onMounted(() => {
  monthQueryParams.value.yearMonth = dayjs(new Date()).subtract(1, 'month').format("YYYY-MM");
  getList2();
  getListBaseStorage();
});
</script>

<style lang="scss" scoped>
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
</style>

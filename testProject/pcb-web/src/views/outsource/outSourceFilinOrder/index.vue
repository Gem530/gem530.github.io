<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-row class="mb8" style="width: 100%; text-align: right">
        <el-col>
          <el-button type="primary" plain @click="handleAdd('菲林')">新增菲林
          </el-button>
          <el-button type="primary" plain @click="handleAdd('网板')">新增网板
          </el-button>
          <el-button plain @click="handleExport">导出</el-button>
        </el-col>
      </el-row>

      <el-tabs type="border-card" @tab-click="radioTableHandle" v-model="radioTable" class="xtable-tab">
        <el-tab-pane label="进行中订单" name="进行中订单">
          <XTable toolId="outsourceOutSourceFilinOrderDoing" v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content" :loading="loading"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: total }"
            :data="outSourceFilinOrderList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange"
            :column-config="{ resizable: true }" size="mini" :span-method="mergeCells" @checkbox-all="selectChangeEvent"
            @checkbox-change="selectChangeEvent" :show-footer="true" :footer-method="footerMethod" :showRefresh="true"
            :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id' }">
            <template #default-isCompression="scope">
              <div v-for="item in isCompressionList">
                <span>{{ item.value == scope.row.isCompression ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-type="scope">
              <div v-for="item in orderTypeList">
                <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-wangBanType="scope">
              <div v-for="item in wangBanTypeOptions">
                <span>{{ item.value == scope.row.wangBanType ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-make="scope">
              <el-button link v-show="scope.row.status == 0" type="primary" @click="doPrint(scope.row)">
                打印
              </el-button>
              <el-button link v-show="scope.row.status == 0" type="primary" @click="handleUpdate(scope.row)" v-if="checkPermi(['outSource:FilinOrder:edit'])">修改
              </el-button>
              <el-button link v-show="scope.row.status == 0" type="danger" @click="handleDelete(scope.row)" v-if="checkPermi(['outSource:FilinOrder:del'])">删除
              </el-button>
              <el-button link v-show="scope.row.status == 0" type="primary" @click="handleComplete(scope.row)">确认完成
              </el-button>
              <el-button link type="primary" @click="downloadFile(scope.row)">下载文件</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已完成订单" name="已完成订单">
          <XTable toolId="outsourceOutSourceFilinOrderFinish" v-model:page-size="completeQueryparam.pageSize"
            v-model:current-page="completeQueryparam.pageNum" height="100%" class="xtable-content" :loading="loading"
            :intervalCondition="intervalCondition" :page-params="{ perfect: true, total: comTotal }" :showRefresh="true"
            :data="outSourceFilinCompleteList" :columnList="completeColumnList" :show-footer="true" :footer-method="footerMethod"
            ref="completeTableRef" border @searchChange="searchCompleteChange" :column-config="{ resizable: true }"
            :span-method="mergeCells" size="mini" @checkbox-all="selectChangeEvent" @checkbox-change="selectChangeEvent"
            :checkbox-config="{ reserve: true }" :row-config="{ keyField: 'id' }">
            <template #default-isCompression="scope">
              <div v-for="item in isCompressionList">
                <span>{{ item.value == scope.row.isCompression ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-type="scope">
              <div v-for="item in orderTypeList">
                <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
              </div>
            </template>
             <template #default-wangBanType="scope">
              <div v-for="item in wangBanTypeOptions">
                <span>{{ item.value == scope.row.wangBanType ? item.label : "" }}</span>
              </div>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="doPrint(scope.row)">
                打印
              </el-button>
              <el-button link type="primary" @click="downloadFile(scope.row)">下载文件</el-button>
              <!--              <el-button link type="primary" @click="downloadFile(scope.row)"-->
              <!--                >下载文件-->
              <!--              </el-button>-->
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>

    </el-card>


    <el-drawer v-model="outsourceFilinTable.visible" :title="outsourceFilinTable.title" size="80%">
      <el-card class="mb8">
        <vxe-table border show-overflow keep-source ref="_tableRef" :data="addList" size="mini" class="mb8">
          <vxe-column type="seq" title="序号" width="60" align="center"></vxe-column>
          <vxe-column field="type" title="外协类型">
            <template #default="scope">
              <div v-for="item in orderTypeList">
                <span>{{ item.value == scope.row.type ? item.label : "" }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="productionNo" title="排产单号" />
          <vxe-column field="commodityNo" title="产品编码" />
          <vxe-column field="quantity" title="加工数量" />
          <vxe-column :visible="isFilin" field="isCompression" title="是否压膜">
            <template #default="scope">
              <div v-for="item in isCompressionList">
                <span>{{ item.value == scope.row.isCompression ? item.label : "" }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column :visible="isFilin" field="reason" title="菲林原因" />
          <vxe-column :visible="isFilin" field="otherRequirement" title="其他要求" />
          <vxe-column field="remark" title="备注" />
          <vxe-column field="make" title="操作" width="170" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="editAddOrder(scope.row)">修改</el-button>
              <el-button link type="danger" @click="removeChange(scope.row)">删除</el-button>
              <!--              <el-button link type="primary" @click="downloadFile(scope.row)">下载文件</el-button>-->
            </template>
          </vxe-column>
        </vxe-table>
        <el-row>
          <el-button type="primary" plain @click="preAdd">新增记录</el-button>
        </el-row>
      </el-card>
      <el-card>
        <el-form :disabled="outsourceFilinTable.title?.includes('详情') || outsourceFilinTable.title?.includes('审核')"
          ref="outsourceFormRef" :model="form" :rules="rules" :inline="true">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item size="small" label="供应商:" prop="supplierId" style="width: 100%">
                <el-select v-model="form.supplierId" @change="changeSupplier" placeholder="请选择供应商" clearable filterable
                  style="width: 100%" transfer popup-class-name="pop-select">
                  <el-option v-for="item in supplierMap" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item size="small" label="收货地址:" prop="addressId" style="width: 100%">
                <el-select v-model="form.addressId" @change="changeAddress" placeholder="请选择收货地址" clearable filterable
                  style="width: 100%" transfer popup-class-name="pop-select">
                  <el-option v-for="item in addressList"
                    :key="item.id"
                     :label="`${item.status==0?'(已禁用)-':''}${item.address}`"

                      :disabled="item.status==0"
                    :value="item.id"
                    ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item size="small" label="下单日期:" prop="outSourceTime" style="width: 100%">
                <el-date-picker v-model="form.outSourceTime" style="width: 100%" type="datetime" placeholder="选择日期时间"
                  value-format="YYYY-MM-DD HH:mm:ss" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button type="primary"  :loading="buttonLoading"
              v-show="outsourceFilinTable.title?.includes('修改') || outsourceFilinTable.title?.includes('添加')"
              @click="submitForm">
              保 存
            </el-button>
            <el-button  :loading="buttonLoading" @click="cancelAdd">取 消</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 添加或修改菲林网板外协单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="50%" destroy-on-close>
      <el-form ref="outSourceFilinOrderFormRef" :model="form" :rules="rules" label-width="80px" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="commodityId">

              <el-select v-if="viewCommodityList.length>0&&dialog.title?.includes('修改')" style="width: 100%;"
                disabled filterable clearable v-model="form.commodityId">
                <el-option v-for="item in viewCommodityList" :key="item.commodityId" :label="item.commodityCode"
                  :value="item.commodityId" />
              </el-select>

              <el-select v-else :disabled="dialog.title?.includes('修改')" @change="setPreCommodity" style="width: 100%;"
                filterable clearable v-model="form.commodityId">
                <el-option v-for="item in commodityList" :key="item.commodityId" :label="item.commodityCode"
                  :value="item.commodityId" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排产单号" prop="productionId">

              <el-select v-if="viewProductionList.length>0&&dialog.title?.includes('修改')" v-model="form.productionId"
                disabled filterable style="width: 100%;">
                <el-option v-for="item in viewProductionList" :key="item.id" :label="item.productionCode"
                  :value="item.id" />
              </el-select>

              <el-select v-else @change="setProduction" :disabled="dialog.title?.includes('修改')" v-model="form.productionId"
                filterable style="width: 100%;">
                <el-option v-for="item in productionList" :key="item.id" :label="item.productionCode"
                  :value="item.productionId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工艺 " prop="craftId">

              <el-select v-if="viewCraftList.length>0&&dialog.title?.includes('修改')" style="width: 100%;"
                v-model="form.craftId" disabled filterable placeholder="请选择">
                <el-option v-for="item in viewCraftList" :key="item.id" :label="item.craftName" :value="item.id" />
              </el-select>

              <el-select v-else style="width: 100%;" v-model="form.craftId" filterable placeholder="请选择">
                <el-option v-for="item in craftOptions" :key="item.id" :label="item.craftName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工数量" prop="quantity">
              <!-- @input="handleQty" :maxlength="11" -->
              <el-input-number v-model="form.quantity" :min="0" :controls="false" :precision="0"/>
            </el-form-item>
          </el-col>
           <el-col :span="8" prop="confirmQuantity" v-if="!isFilin">
            <el-form-item label="网板类型" prop="wangBanType">
           <el-select v-model="form.wangBanType" :collapse-tags="true" filterable placeholder="请选择类型">
            <el-option v-for="item in wangBanTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="isFilin">
            <el-form-item label="是否压膜" prop="isCompression">
              <el-radio-group v-model="form.isCompression">
                <el-radio v-for="dict in isCompressionList" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isFilin">
            <el-form-item label="菲林原因" prop="reason">
              <el-input maxLength="1000" v-model="form.reason" :rows="2" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isFilin">
            <el-form-item label="其他要求" prop="otherRequirement">
              <el-input maxLength="1000" v-model="form.otherRequirement" :rows="2" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input maxLength="1000" v-model="form.remark" :rows="2" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button type="primary" :loading="buttonLoading" @click="submitPreAddForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cacelPreAdd">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 确认完成对话框 -->
    <el-dialog :title="completeDialog.title" v-model="completeDialog.visible" width="50%" destroy-on-close>
      <el-form ref="completeFilinOrderFormRef" :model="form" :rules="commpleteRules" label-width="80px" v-loading="dialogTableLoading">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品编码" prop="commodityId">
              <el-input v-model="form.commodityNo"   disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排产单号" prop="productionId">
              <el-input v-model="form.productionNo"   disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工艺" prop="craftId">
              <el-input v-model="form.craftName"   disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工数量" prop="quantity">
              <el-input v-model="form.quantity" type="number" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.type=='1'">
            <el-form-item label="是否压膜" prop="isCompression">
              <el-radio-group v-model="form.isCompression" disabled>
                <el-radio v-for="dict in isCompressionList" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.type=='1'">
            <el-form-item label="菲林原因" prop="reason">
              <el-input maxLength="1000" v-model="form.reason" :rows="2" type="textarea" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.type=='1'">
            <el-form-item label="其他要求" prop="otherRequirement">
              <el-input maxLength="1000" v-model="form.otherRequirement" :rows="2" type="textarea" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input maxLength="1000" v-model="form.remark" :rows="2" type="textarea" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"  v-if="form.type=='1'" >
            <el-form-item  label="长" prop="length">
              <el-input-number v-model="form.length" :precision="2" style="width: 85%;"
                :controls="false" :max="999999" />
                <span style="width: 15%;">cm</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.type=='1'">
            <el-form-item label="宽" prop="width">
              <el-input-number v-model="form.width" :precision="2" style="width: 85%;"
                :controls="false" :max="999999" />
                <span style="width: 15%;">cm</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认数量" prop="confirmQuantity">
              <el-input-number v-model="form.confirmQuantity" :precision="0" style="width: 99%;"
                :controls="false" :min="0" :max="form.quantity" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="doComplete" :loading="buttonLoading">确 定</el-button>
          <el-button @click="completeDialog.visible=false" :loading="buttonLoading">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 工序文件 -->
    <el-dialog v-model="fileDialog.visible" width="60%">
      <el-tabs type="border-card" v-model="fileTab">
        <el-tab-pane label="工序文件" name="工序文件">
          <XTable :pageShow="false" :loading="loading" :data="filesData"
            :show-footer="false" :columnList="fileColumnList" ref="fileleteTableRef" border
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
            :page-params="{ perfect: true, total: fileTotal }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <div v-if="outSourceInfo">
      <div style="display: none; width: 600pt !important;padding-right:5pt;" ref="cardRef">
        <div style="width:100%;text-align:center;font-size:10pt;">
          <div style="font-size:18pt; font-weight:bold;">{{ outSourceInfo.enterpriseName }}</div>
          <div style="font-size:14pt;padding-top:5pt">{{ outSourceInfo.enterpriseEName }}</div>
          <div style="">
            工厂地址：{{ outSourceInfo.enterpriseAddress }}&nbsp;&nbsp;电话：{{ outSourceInfo.enterprisePhoneNumber }}
          </div>
          <div style="font-size:16pt;font-weight:600;">{{ outSourceInfo.title }}</div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div style="">供应商名称：{{ outSourceInfo.supplierName }}</div>
            <div style="width:170pt;text-align:left;">出货单号：{{ outSourceInfo.no }}</div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div style="text-align:left;width:400pt;">供应商地址：{{ outSourceInfo.supplierAddress }}</div>
            <div style="width:170pt;text-align:left;">出货日期：{{ parseTime(outSourceInfo.outSourceTime, '{y}-{m}-{d}') }}
            </div>
          </div>
        </div>
        <div style="min-height:200pt">
          <!--默认打印模板-->
          <table style="border-collapse: collapse; border: none;width:100%;">
            <thead>
              <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 30pt;">序号</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 100pt;">本厂编号</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 25pt;  ">单位</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 40pt;">数量</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;width: 60pt;">其他要求</th>
                <th rowspan="2" style="border: solid #000 1px;font-weight: normal;">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in outSourceInfo.filinOrderPrintItemDtos">
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ index + 1 }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.commodityNo }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ '张' }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.quantity }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.otherRequirement }}</td>
                <td
                  style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px; text-align: center">
                  {{ item.remark }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="9">
                </td>
              </tr>
            </tfoot>
          </table>

        </div>
        <div style="width:100%;font-size:10pt;">
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>
              发货人：{{ outSourceInfo.createByName }}
            </div>
            <div>
              核对：
            </div>
            <div style="width: 200pt; text-align: left;">
              &nbsp;&nbsp;客&nbsp;&nbsp;户&nbsp;&nbsp;签&nbsp;&nbsp;收：
            </div>

          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>日&nbsp;&nbsp;&nbsp;&nbsp;期：{{ parseTime(outSourceInfo.createTime, '{y}-{m}-{d}') }}</div>
            <div style="width: 200pt;text-align:left;">
              （请使用正楷签名）
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>
              第一联存根(白) 第二联客户(红) 第三联回单(黄) 第四销售(绿)
            </div>
            <div style="width: 200pt; text-align: left;">
              &nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;期：
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="OutSourceFilinOrder" lang="ts">
import { listSourceHalfCommodityList,listSourceHalfNodeList } from '@/api/outsource/sourceHalfProcessOrder';
import {
  listOutSourceSupplierListV3
} from "@/api/outsource/sourceFullProcessOrder";
import { listAddress } from '@/api/basedata/address';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { listFiles } from '@/api/upload';
import { FileItemForm, FileQuery } from '@/api/upload/types';
import { CommodityVO, CommodityForm, CommodityQuery } from '@/api/order/commodity/types';
import { AddressVO, AddressForm, AddressQuery } from '@/api/basedata/address/types';
import {
  listOutSourceFilinOrder,
  getOutSourceFilinOrder,
  getPrintOutSourceFilinOrder,
  delOutSourceFilinOrder,
  addOutSourceFilinOrder,
  updateOutSourceFilinOrder,
  listProCarftFilesInfo,
  doCompleteFilinOrder
} from '@/api/outsource/outSourceFilinOrder';
import {
  OutSourceFilinOrderVO,
  OutSourceFilinOrderQuery,
  OutSourceFilinOrderForm
} from '@/api/outsource/outSourceFilinOrder/types';
import {checkPermi} from "@/utils/permission";
import { VxeTableEvents, VxeTablePropTypes } from 'vxe-table';
import { SourceHalfProcessOrderVO, } from '@/api/outsource/sourceHalfProcessOrder/types';
import { QuotationVO } from "@/api/order/quotation/types";
import { getCraftList } from "@/api/basedata/craft";
import { CraftVO } from "@/api/basedata/craft/types";
import { listProduction } from '@/api/production/production';
import dayjs from "dayjs";
const fileTab = ref('工序文件');
const fileTotal = ref(0);
const outSourceInfo = ref<any>();
const cardRef = ref();
const intervalCondition = ['deliveryTime', 'outSourceTime'];
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const productionList = ref<SourceHalfProcessOrderVO[]>([]);
const outSourceFilinOrderList = ref<OutSourceFilinOrderVO[]>([]);
const outSourceFilinCompleteList = ref<OutSourceFilinOrderVO[]>([]);

const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
const comTotal = ref(0);
const dialogTableLoading = ref(false)

//用于判断订单类型
const isFilin = ref(true);
//头部按钮组
const radioTable = ref('进行中订单');
//新增列表
const addId = ref(0);
const addList = ref<OutSourceFilinOrderVO[]>([]);
const supplierMap = ref([]);
const addressMap = ref([]);
const addressList = ref([]);
const commodityList = ref<any[]>([]);
const proList = ref<any[]>([]);
const filesData = ref<any>([]);
const defaultDate = ref(new Date());
const viewCommodityList = ref<any[]>([]);
const viewProductionList = ref<any[]>([]);
const viewCraftList = ref<any[]>([]);

const completeDialog = reactive<DialogOption>({ visible: false, title: '确认完成'});
const completeFilinOrderFormRef = ref<ElFormInstance>();
const commpleteRules = ref({
  length:[{ required: true, message: "长不能为空",  trigger: "blur" }],
  width:[{ required: true, message: "宽不能为空",  trigger: "blur" }],
  confirmQuantity:[{ required: true,message: "确认数量不能为空",   trigger: "blur" }],

});

const wangBanTypeOptions = ref([
  {value: "1", label: "普通"},
  {value: "2", label: "碳油"}
])
const isCompressionList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "2" },
]);
const orderTypeList = ref([
  { label: '菲林', value: "1" },
  { label: '网板', value: "2" },
]);

const outSourceFilinOrderFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
//文件弹窗
const _fileList = ref([]);

const fileDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


const outsourceFormRef = ref<ElFormInstance>();
const outsourceFilinTable = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: OutSourceFilinOrderForm = {
  id: undefined,
  outSourceTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  no: undefined,
  commodityId: undefined,
  productionId: undefined,
  remark: undefined,
  supplierId: undefined,
  addressId: undefined,
  quantity: undefined,
  reason: undefined,
  otherRequirement: undefined,
  type: undefined,
  isCompression: undefined,
  completeTime: undefined,
  status: undefined,
  craftId: undefined
}

const data = reactive<PageData<OutSourceFilinOrderForm, OutSourceFilinOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    outSourceTime: undefined,
    no: undefined,
    commodityId: undefined,
    productionId: undefined,
    supplierId: undefined,
    addressId: undefined,
    quantity: undefined,
    reason: undefined,
    otherRequirement: undefined,
    type: undefined,
    isCompression: undefined,
    completeTime: undefined,
    status: undefined,
    deliveryTime: undefined,
    params: {}
  },
  rules: {
    outSourceTime: [
      { required: true, message: "下单时间不能为空", trigger: "blur" }
    ],
    commodityId: [
      { required: true, message: "产品名称不能为空", trigger: "blur" }
    ],
    planId: [
      { required: true, message: "产品名称不能为空", trigger: "blur" }
    ],
    productionId: [
      { required: true, message: "排产单号不能为空", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "工艺不能为空", trigger: "blur" }
    ],
    supplierId: [
      { required: true, message: "供应商不能为空", trigger: "blur" }
    ],
    addressId: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    isCompression: [
      { required: true, message: "是否压膜不能为空", trigger: "blur" }
    ],
    reason: [
      { required: true, message: "菲林原因不能为空", trigger: "blur" }
    ],
    otherRequirement: [
      { required: true, message: "其他要求不能为空", trigger: "blur" }
    ],
     wangBanType: [
      { required: true, message: "网板类型不能为空", trigger: "blur" }
    ],

  }
});
//产品
const commodityData = reactive<PageData<CommodityForm, CommodityQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    cusId: undefined,
    cusName: undefined,
    name: undefined,
    materialLayer: undefined,
    params: {}
  },
  rules: {}
});

const addressData = reactive<PageData<AddressForm, AddressQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    name: undefined,
    phone: undefined,
    address: undefined,
    logisticsCycle: undefined,
    isDefault: undefined,
    customerId: undefined,
    type: undefined,
    ownerId: undefined,
    params: {}
  },
  rules: {}
});

const fileData = reactive<PageData<FileItemForm, FileQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    name: undefined,
    url: undefined,
    key: undefined,
    size: undefined
  },
  rules: {}
});

const { queryParams: fileQueryParams } = toRefs(fileData);
const { queryParams: addressQueryParams } = toRefs(addressData);

const XTableRef = ref();
const completeTableRef = ref();
const _tableRef = ref();
const columnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60' },
  { title: '外协单号', width: '120', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  {
    title: '外协类型',
    field: 'type',
    width: '80',
    align: 'center',
    filterType: 'radio',
    filterParam: { placeholder: '请输入类型' },
    filterData: () => orderTypeList.value
  },
  {
    width: '120',
    title: '排产单号',
    field: 'productionNo',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入排产单编号' }
  },
  {
    width: '120',
    title: '产品编码',
    field: 'commodityNo',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入产品编码' }
  },
  // {
  //   width: '120',
  //   title: '要求交期',
  //   field: 'deliveryTime',
  //   align: 'center',
  //   filterType: 'intervalDate',
  //   filterParam: { placeholder: '请输入要求交期', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD' }
  // },
  {
    width: '120',
    title: '供应商编码',
    field: 'supplierCode',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入供应商编码' }
  },
  {
    width: '120',
    title: '供应商名称',
    field: 'supplierName',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入供应商名称' }
  },
  { title: '加工数量', width: '80', field: 'quantity', align: 'center' },
  { title: '是否压膜', width: '80', field: 'isCompression', align: 'center' },
  { title: '菲林原因', width: '120', field: 'reason', align: 'center' },
  { title: '其他要求', width: '120', field: 'otherRequirement', align: 'center' },
  { title: '网板类型', width: '120', field: 'wangBanType', align: 'center' },
  { title: '备注', width: '120', field: 'remark', align: 'center' },
  {
    width: '90',
    title: '下单人',
    field: 'createByName',
    align: 'center',
    filterType: 'input',
    filterParam: { placeholder: '请输入下单人' }
  },
  {
    width: '120',
    title: '下单时间',
    field: 'outSourceTime',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: { placeholder: '请输入下单时间', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD' }
  },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);
const completeColumnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60' },
  { title: '外协单号', width: '120', field: 'no', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入外协单号' } },
  { title: '外协类型',field: 'type', width: '80',    align: 'center',    filterType: 'radio',    filterParam: { placeholder: '请输入类型' },
    filterData: () => orderTypeList.value },
  { width: '120',title: '排产单号',field: 'productionNo',align: 'center',filterType: 'input',filterParam: { placeholder: '请输入排产单编号' }},
  { width: '120', title: '产品编码', field: 'commodityNo', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入产品编码' }},
  { width: '120', title: '供应商编码', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码' }},
  { width: '120', title: '供应商名称', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称' }},
  { title: '加工数量', width: '80', field: 'quantity', align: 'center' },
  { title: '确认数量', width: '80', field: 'confirmQuantity', align: 'center' },
  { title: '长（cm）', width: '80', field: 'length', align: 'center' },
  { title: '宽（cm）', width: '80', field: 'width', align: 'center' },
  { title: '是否压膜', width: '80', field: 'isCompression', align: 'center' },
  { title: '菲林原因', width: '120', field: 'reason', align: 'center' },
  { title: '其他要求', width: '120', field: 'otherRequirement', align: 'center' },
  { title: '网板类型', width: '120', field: 'wangBanType', align: 'center' },
  { title: '备注', width: '120', field: 'remark', align: 'center' },
  { width: '90', title: '下单人', field: 'createByName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入下单人' }},
  { width: '120', title: '下单时间', field: 'outSourceTime', align: 'center', filterType: 'intervalDate',
    filterParam: { placeholder: '请输入下单时间', startParams: { type: 'day' }, endParams: { type: 'day' }, valueFormat: 'YYYY-MM-DD' }
  },
  { width: '120', title: '完成时间', field: 'completeTime', align: 'center' },
  { width: '120', title: '确认完成时间', field: 'confirmCompleteTime', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);

const fileColumnList = ref([
  { title: "序号", type: 'seq', field: 'index', align: 'center', width: '60' },
  { title: '工序名称', width: '120', field: 'craftName', align: 'center' },
  { title: '文件大小', width: '80', field: 'size', align: 'center' },
  { title: '文件名称', field: 'fileName', align: 'center' },
  { title: '上传人', width: '120', field: 'createByName', align: 'center' },
  { title: '上传时间', width: '120', field: 'createTime', align: 'center' },
]);

const checkedOutSourceFilinOrderList = ref<OutSourceFilinOrderVO[]>([]);
const comleteData = reactive<PageData<OutSourceFilinOrderForm, OutSourceFilinOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    params: {}
  },
  rules: {
  }
});
const { queryParams, form, rules } = toRefs(data);
const { queryParams: completeQueryparam } = toRefs(comleteData);
const { queryParams: commodityQueryParams, form: commodityForm } = toRefs(commodityData);
const craftOptions = ref<CraftVO[]>([]);
let craftOptionsBase: CraftVO[] = [];

/** 初始化产品列表 */
const getFilesList = async (item: any) => {

  //查询类型为MI工序文件
  let queryInfo = {
    productionId: item.productionId,
    id: item.id
  }
  const res = await listProCarftFilesInfo(queryInfo);
  filesData.value = res.rows;
  fileTotal.value = res.total;
  console.log("fileList", filesData.value);
}

const setProduction = async (params: any) => {
  console.log("setProduction params", params);
  console.log("productionList.value", productionList.value)
  console.log("base", craftOptionsBase)
  craftOptions.value = [];

  if (dialog.title?.includes('添加')) {
    form.value.craftId = undefined;
  }

  let selectPro = productionList.value.filter(pro => pro.productionId == params);
  console.log("selectPro", selectPro);
  //const craftIdList: any = selectPro[0].craftIdList;
  const productionCode: any = selectPro[0].productionCode;
  const craftIdRes: any = await listSourceHalfNodeList(params);
  let craftIdList: any = craftIdRes.data.map((item: any) => item.craftId);

  form.value.productionNo = productionCode;
  console.log("select", craftIdList);
  const craftLLL = craftOptionsBase.filter(item => craftIdList.includes(item.id));
  craftOptions.value = craftLLL;
  console.log("craftOptions", craftOptions);
};
const getWangBanListCraft = async () => {
  const res = await getCraftList();
  const resList = res.data.filter(r => {
    return r.craftName == '丝印字符'
  });
  setSupList(resList);
  craftOptionsBase = resList;
};
const getFinLinListCraft = async () => {
  const res = await getCraftList();
  const resList = res.data.filter(r => {
    return r.craftName == '外层线路' || r.craftName == '阻焊'
  });
  setSupList(resList);
  craftOptionsBase = resList;
};
const getListCraft = async () => {
  const res = await getCraftList();

  const resList = res.data.filter(r => {
    return r.craftName == '外层线路' || r.craftName == '丝印字符' || r.craftName == '阻焊'
  });
  craftOptionsBase = resList;
};
const selectChangeEvent: VxeTableEvents.CheckboxAll<OutSourceFilinOrderVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedOutSourceFilinOrderList.value = selectRecords.map(item => item);
  }
}


const footerMethod: VxeTablePropTypes.FooterMethod<OutSourceFilinOrderVO> = ({ columns, data }) => {
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
const mergeCells = ({ row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data }: any) => {
  if (column.property === "no") {
    const referenceField = "no";
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

// 切换菜单栏不刷新
const radioTableHandle = (tab: any, event: any) => {
  console.log("tab", tab.props.label);
  radioTable.value = tab.props.label;
  if (radioTable.value == "进行中订单") {
    getList();
  } else {
    getCompleteList();
  }
}

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}

/** 查询菲林网板外协单列表 */
const getList = async () => {
  queryParams.value.status = "0";
  loading.value = true;
  const res = await listOutSourceFilinOrder(queryParams.value);
  outSourceFilinOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
// 获取 搜索条件
const searchCompleteChange = (params: any) => {
  console.log("params", params)
  completeQueryparam.value = params
  getCompleteList()
}
/** 查询菲林网板外协单列表 */
const getCompleteList = async () => {
  completeQueryparam.value.status = "1";
  loading.value = true;
  const res = await listOutSourceFilinOrder(completeQueryparam.value);
  outSourceFilinCompleteList.value = res.rows;
  comTotal.value = res.total;
  loading.value = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  viewCommodityList.value=[];
  viewProductionList.value=[];
  viewCraftList.value=[];
  //addList.value = [];
  //outSourceFilinOrderFormRef.value?.resetFields();
}
const resetAdd = () => {
  outSourceFilinOrderFormRef.value?.resetFields();
}

/** 新增按钮操作 */
const handleAdd = async (params: any) => {
  reset();
  addList.value = [];
  const title = params == "菲林" ? "添加菲林外协加工单" : "添加网板外协加工单";
  if (params == "菲林") {
    isFilin.value = true;
    await getFinLinListCraft();
  } else {
    isFilin.value = false;
    await getWangBanListCraft();
  }
  outsourceFilinTable.visible = true;
  outsourceFilinTable.title = title;
}

//预新增列表,清空表单
const preAdd = () => {
  outSourceFilinOrderFormRef.value?.resetFields();
  productionList.value = [];
  craftOptions.value = [];
  const oldFormVal = JSON.parse(JSON.stringify(form.value));
  form.value = { ...initFormData };
  form.value.outSourceTime = oldFormVal.outSourceTime;
  form.value.supplierId = oldFormVal.supplierId;
  form.value.addressId = oldFormVal.addressId;
  //默认压膜,跳过校验
  form.value.isCompression = "1";
  dialog.visible = true;
  dialog.title = "添加外协单";
}
//选择供应商
const changeSupplier = (params: any) => {
  const _name = supplierMap.value.find(item => item.value == params.value)?.label;
  form.value.supplierName = _name;
  console.log("changeSupplier", form.value);
}
//选择地址
const changeAddress = (params: any) => {
  // const _name = addressMap.value.find(item => item.value == params.value)?.label;
  const _name = addressList.value.find(item => item.id == params)?.address;
  form.value.address = _name;
}
//数量正整数校验
const handleQty = (params: any) => {
  if (!Number.isInteger(+params) || +params < 1) {
    form.value.quantity = Math.max(1, Math.floor(+params));
  }
}
//产品数据到新增列表
const setPreCommodity = (params: any) => {
  console.log("setPreCommodity", params)
  console.log("setPreCommodity commodityLis", commodityList.value)
  const commodity = commodityList.value.find(item => item.commodityId == params);
  console.log("setPreCommodity commodity", commodity)
  if (!commodity) {
    return;
  }
  form.value.commodityNo = commodity.commodityCode;
  form.value.deliveryTime = commodity.deliveryTime;
  console.log("setPreCommodity commodity", commodity);
  const proItem = proList.value.filter(item => commodity.planList.includes(item.planId));

  let detailList = proItem.reduce((acc, item) => acc.concat(item.planProductionList), []);
  let uniqueDetailList = Array.from(new Set(detailList));

  productionList.value = uniqueDetailList;

  console.log("productionList.value", productionList.value);
  if (dialog.title?.includes('添加')) {
    form.value.productionId = undefined;
    form.value.craftId = undefined;
  }
}
//设置默认值
const setDefaultVal = (params: any) => {
  //菲林标志位
  params.type = isFilin.value ? "1" : "2";
  //未完成字段
  params.status = "0";
  addId.value = addId.value == 0 ? addList.value.length + 1 : addId.value + 1;
  params.addId = params.addId ? params.addId : addId.value;
};
/** 预新增按钮 */
const submitPreAddForm = () => {

  console.log("form", form.value);
  outSourceFilinOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if(form.value.quantity<=0){
        proxy?.$modal.msgError("请输入正确的加工数量");
        return;
      }
      const _id = form.value.id;
      const addItem = JSON.parse(JSON.stringify(form.value));

      if (_id) {
        buttonLoading.value = true;
        await updateOutSourceFilinOrder(addItem).finally(() => buttonLoading.value = false);
        await getList();
      } else {
        setDefaultVal(addItem);
        let num = addList.value.findIndex(item => item.addId == addItem.addId);
        if (num !== -1) {
          addList.value[num] = addItem;
        } else {
          addList.value.push(addItem);
        }
        console.log("addList", addList.value);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
    }
  });
}

const cacelPreAdd = () => {
  dialog.visible = false;
}

const cancelAdd = () => {
  resetAdd();
  outsourceFilinTable.visible = false;
}

/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
}

const removeChange = async (_row: number) => {
  const $table = _tableRef.value;
  if ($table) {
    console.log("removeChange", _row);
    addList.value.splice(addList.value.findIndex(item => item.addId == _row.addId), 1);
    const { row: newRow } = await $table.remove(_row)
  }
}

const editAddOrder = async (_row: number) => {
  //const $table = _tableRef.value;
  form.value = _row;
  dialog.visible = true;
  dialog.title = "编辑外协单";
}

const downloadFile = async (_row: number) => {
  const $table = _tableRef.value;
  console.log("downloadFile", _row);
  //setFileList(_row);
  getFilesList(_row);
  fileDialog.visible = true;
  fileDialog.title = "下载文件";
}


/** 修改按钮操作 */
const handleUpdate = async (row?: OutSourceFilinOrderVO) => {
  reset();
  resetAdd();
  console.log("form", form.value);
  if (!commodityList.value || commodityList.value.length == 0) {
    // proxy?.$modal.loading("数据加载中");
    // setTimeout(() => {
    //   proxy?.$modal.closeLoading();
    // }, 3900);
  }
  const _id = row?.id || ids.value[0]
  dialog.visible = true;
  dialog.title = "修改菲林网板外协单";
  dialogTableLoading.value = true
  const res = await getOutSourceFilinOrder(_id);
  Object.assign(form.value, res.data);
  let orderType1 = orderTypeList.value.filter(_item => _item.value == res.data.type);
  if (orderType1[0].label == "菲林") {
    isFilin.value = true;
    await getFinLinListCraft();
  } else {
    isFilin.value = false;
    await getWangBanListCraft();
  }

  const commodity = commodityList.value.find(item => item.commodityId == form.value.commodityId);
  const _production = productionList.value.find(item => item.productionId == form.value.productionId);
  if (!commodity||!_production) {
    viewCommodityList.value = [{commodityId:form.value.commodityId,commodityCode:form.value.commodityNo}]
    viewCraftList.value = [{id:form.value.craftId,craftName:form.value.craftName}]
    viewProductionList.value=[{id:form.value.productionId,productionCode:form.value.productionNo}]
    console.log("viewCraftList",viewCraftList);
    console.log("viewProductionList",viewProductionList);
    dialogTableLoading.value = false
    return;
  }

  setPreCommodity(form.value.commodityId);
  setProduction(form.value.productionId);
  dialogTableLoading.value = false
}

/** 提交按钮 */
const submitForm = () => {
  console.log("addList.value",addList.value);
  outsourceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (addList.value.length == 0) {
        proxy?.$modal.msgError("请添加外协单");
        return;
      }
      form.value.type = isFilin.value ? "1" : "2";
      form.value.status = "0";
      //新增列表取通用字段
      addList.value.forEach(item => {
        item.supplierId = form.value.supplierId;
        item.addressId = form.value.addressId;
        item.outSourceTime = form.value.outSourceTime;
        if(form.value.type=="2"){
          item.isCompression=undefined;
        }
      })
      form.value.addList = JSON.parse(JSON.stringify(addList.value));
      //form.value.addList = addList.value;
      await addOutSourceFilinOrder(form.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("修改成功");
      outsourceFilinTable.visible = false;
      await getList();
    }
  });

}

/** 删除按钮操作 */
const handleDelete = async (row?: OutSourceFilinOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除菲林网板外协单编号为"' + row?.no + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delOutSourceFilinOrder(_ids).finally(() => proxy?.$modal.closeLoading());

  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

const handleComplete = async (row?: OutSourceFilinOrderVO) => {
  const _ids = row?.id || ids.value;
  proxy?.$modal.loading('加载中...')
  const res = await getOutSourceFilinOrder(_ids).finally(() => proxy?.$modal.closeLoading());
  Object.assign(form.value, res.data);
  completeDialog.visible=true;
}

const doComplete = async (row?: OutSourceFilinOrderVO) => {

   completeFilinOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      console.log("form.value.confirmQuantity",form.value.confirmQuantity);
      if(form.value.confirmQuantity<=0){
        proxy?.$modal.msgError("请输入正确的确认数量");
        return;
      }
      await proxy?.$modal.confirm('是否确认完成菲林网板外协单编号为"' + form?.value.no + '"的数据项？');
      buttonLoading.value = true;
      await doCompleteFilinOrder(form.value).finally(() => {
        buttonLoading.value = false;
        completeDialog.visible = false
      });
      proxy?.$modal.msgSuccess("确认完成成功");
      await getList();
    }
  });

}

//
/** 导出按钮操作 */
const handleExport = () => {

  let tool_tableName = 'outsourceOutSourceFilinOrderFinish';
  let queryInfo = {};
  if (radioTable.value == "进行中订单") {
    tool_tableName = 'outsourceOutSourceFilinOrderDoing';
    queryInfo = { ...queryParams.value, tableName: tool_tableName }
  } else {
    queryInfo = { ...completeQueryparam.value, tableName: tool_tableName }
    tool_tableName = 'outsourceOutSourceFilinOrderFinish';
  }


  proxy?.download('outsource/outSourceFilinOrder/export', queryInfo, `菲林网板_${new Date().getTime()}.xlsx`)

}
const setSupList = async (resList:any[]) => {
  const craftStr = resList.map(r => r.id).join(',');
  console.log(craftStr)
  const res:any = await listOutSourceSupplierListV3(craftStr);
  // const res: any = await listOutSourceSupplierList();
  supplierMap.value = res.data.map((item: SupplierVO) => {
    return {
      label: item.supplierName,
      value: item.id
    }
  })
}
const setAddressList = async () => {
  addressQueryParams.value.type = '2';
  const res: any = await listAddress(addressQueryParams.value);
  addressList.value = res.rows;
  // addressMap.value = res.rows.map((item: AddressVO) => {
  //   return {
  //     label: item.address,
  //     value: item.id
  //   }
  // })
}
/** 初始化产品列表 */
const getCommodityList = async () => {
  const queryInfo: any = { isFilm: '1' }
  const res = await listSourceHalfCommodityList(queryInfo);
  let comList: any = [];
  proList.value = res.data;
  res.data.forEach(fe => {
    comList = comList.concat(fe.planCommodityList);
  });
  console.log("comList", comList);

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

  commodityList.value = commoditySetList;
  console.log("commodityList.value", commodityList.value);
}

const doPrint = async (row?: OutSourceFilinOrderVO) => {
  const _ids = row?.id || ids.value;

  proxy?.$modal.loading('加载中...')
  let dev = await getPrintOutSourceFilinOrder(_ids as string).finally(() => proxy?.$modal.closeLoading());
  outSourceInfo.value = dev.data;
  console.log(outSourceInfo.value.type);
  if (outSourceInfo.value.filinOrderPrintItemDtos[0].type == '1') {
    outSourceInfo.value.title = '菲林加工单';
  } else {
    outSourceInfo.value.title = '网板加工单';
  }
  setTimeout(() => {
    printHtmlV2(null);
  }, 800)
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



onMounted(() => {
  getCompleteList();
  getList();
  //初始化供应商列表
  // setSupList();
  //初始化
  setAddressList();
  //
  // proxy?.$modal.loading("数据加载中...");
  getCommodityList().then(() => {
    // proxy?.$modal.closeLoading();
  });
  //工艺列表
  //getListCraft();
});
</script>
<style lang="scss">
.pop-select {
  z-index: 9999 !important;
}

.addListBtn {
  color: #409EFF;
  font-size: 19px;
  margin-right: 10px;
}

.addRemoveBtn {
  color: red !important;
}</style>

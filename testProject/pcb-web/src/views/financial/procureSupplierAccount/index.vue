<template>
  <div class="p-2 xtable-page">
    <supplierAccountTable2 v-if="checkPermi(['financial:procureSupplierAccount:listView'])" 
      ref="accountTableRef"
      :writeOffType="writeOffType"
      :tableColumnList="columnList"
      :tableColumnList1="columnList"
      :tableColumnList2="columnList"
      toolId1="purAccountToolId1"
      toolId2="purAccountToolId12"
      toolId3="purAccountToolId13"
      exportName="采购对账单"
      :type="accountOrderType"
      @handle="handle"
      :writeOffIsSupplier="true"
      :titleLabel="titleLabel"
      @accountUReportHandle="accountUReportHandle"
      :moduleCode="'8'"
      :bizType="'16'"
      :isSupplier="true"
    />

    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="90%" draggable destroy-on-close modal-class="padding-drawer">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">
          {{drawerBorrow.title}}
          <el-tag type="primary" style="margin-left:5px" v-if="purAccountForm&&purAccountForm.supplierSwitch=='1'">协同</el-tag>
          <el-tag type="primary" style="margin-left:5px" v-if="purAccountForm&&purAccountForm.supplierSwitch=='0'">普通</el-tag>
          <el-tag type="danger" style="margin-left:5px" v-if="purAccountForm&&purAccountForm.accountStatus=='1'">未对账</el-tag>
          <el-tag type="success" style="margin-left:5px" v-if="purAccountForm&&purAccountForm.accountStatus=='2'">对账完成</el-tag>
          <el-tag type="warning" style="margin-left:5px" v-if="purAccountForm&&purAccountForm.accountStatus=='9'">调整中</el-tag>
        </h4>
      </template>

      <div  >
      <el-form v-if="drawerBorrow.title?.includes('采购对账确认')||drawerBorrow.title?.includes('申请修改')" label-width="110px" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="对账单号:" >
              <span>{{purAccountForm.code}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="供应商名称:" >
              <span>{{supplierForm&&supplierForm.supplierName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="对账月份:" >
              <span>{{purAccountForm.accountMonth}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="账单周期:" >
              <span>{{purAccountForm.accountPeriod}}</span>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="付款截止日:" >
              <span>{{purAccountForm.endTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="是否含税:" >
              <span>{{purAccountForm.isTax=='1'?'是':'否'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="备注:" >
              <span>{{purAccountForm.remark}}</span>
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>

      
      <el-form v-if="drawerBorrow.title?.includes('详情')" label-width="150px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="供应商名称" >
              <span>{{supplierForm&&supplierForm.supplierName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="结算方式" >
              <span>{{purAccountForm.monthlyMethod}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="对账月份" >
              <span>{{purAccountForm.accountMonth}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="账单周期" >
              <span>{{purAccountForm.accountPeriod}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-collapse v-if="drawerBorrow.title?.includes('申请修改')" v-model="activeNames">
        <el-collapse-item title="账单明细" name="账单明细">
          <template #title>
            <span style="color: #5b7ebe;font-size: 16px;font-weight: bold;">账单明细</span>
          </template>
          <RawAccountTabSupplierV2
            tabToolId1="supProcureToolId1"
            tabToolId2="supProcureToolId2"
            ref="rawAccountTabRef"
            :allData="allData"
            :tabColumnList="changeTabColumnList"
            :editOtherList="tabOtherList"
            :tabQuantity1="2"
            :tabName1="'采购送货'"
            :tabName2="'采购退货'"
            :tabName4="'申请记录'"
            :drawerBorrow="drawerBorrow"
            :tabColumnList2="changeBackTabColumnList"
            :tabColumnList4="adjustColumnList2"
            @getCheckFunction="false"
            @refreshFunction1="deliverSearchChange1"
            @refreshFunction2="deliverSearchChange2"
            @refreshFunction3="deliverSearchChange3"
            @refreshFunction4="deliverSearchChange44"
            :footLabel="footLabel"
            :tabFormRef="accountFormRef"
            :isEdit="isEdit"
            :deduction="true"
            :otherAmountBtn="true"
            :supplierQuery="supplierQuery"
            @doSaveBack="doSave"
            :row="formInfo"
          />
        </el-collapse-item>
      </el-collapse>


      <el-collapse v-if="drawerBorrow.title?.includes('采购对账确认')" v-model="activeNames">
        <el-collapse-item title="账单明细" name="账单明细">
          <template #title>
            <span style="color: #5b7ebe;font-size: 16px;font-weight: bold;">账单明细</span>
          </template>
          <RawAccountTabSupplierV2
            tabToolId1="supProcureToolId1"
            tabToolId2="supProcureToolId2"
            ref="rawAccountTabRef"
            :allData="allData"
            :tabColumnList="tabColumnList"
            :editOtherList="tabOtherList"
            :tabQuantity1="2"
            :tabName1="'采购送货'"
            :tabName2="'采购退货'"
            :tabName3="'扣款单'"
            :tabName4="'调整记录'"
            :drawerBorrow="drawerBorrow"
            :tabColumnList2="backTabColumnList"
            :tabColumnList3="otherColumnList"
            @getCheckFunction="false"
            @refreshFunction1="deliverSearchChange1"
            @refreshFunction2="deliverSearchChange2"
            @refreshFunction3="deliverSearchChange3"
            @refreshFunction4="deliverSearchChange4"
            :footLabel="footLabel"
            :tabFormRef="accountFormRef"
            :isEdit="isEdit"
            :deduction="false"
            :otherAmountBtn="true"
            :supplierQuery="supplierQuery"
            @doSaveBack="doSave"
            :row="formInfo"
            :disabled="true"
          />
        </el-collapse-item>
        <el-collapse-item title="凭证信息" name="凭证信息">
          <el-row>
            <XUpload   model="download" :show-file-list="false"
               @fileChange="fileChange"></XUpload>
          </el-row>
          <XTable  :pageShow="false"
                  class="xtable-content" :loading="fileLoading" :data="purAccountForm.fileList" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef1" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,  }">
              <template #default-fileName="scope">
                <XUpload v-model:model-value="scope.row" model="download" :limit="1" readOnly></XUpload>
              </template>
              <template #default-src="scope">
                <ImagePreview
                  v-if="scope.row"
                  :width="100"
                  :height="100"
                  :src="scope.row.url"
                  :type="scope.row.type"
                  :preview-src-list="[scope.row.url]"
                />
              </template>
              <template #default-make="scope">
                <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
                <el-button link type="primary" v-if="scope.row.createByName.includes('供方')" @click="delFile(scope.row.id)">删除</el-button>
              </template>
          </XTable>
        </el-collapse-item>
      </el-collapse>


        <el-tabs v-if="drawerBorrow.title?.includes('详情')" class="xtable-tab" type="border-card" @tab-change="void(0)" v-model="radioTable">
          <el-tab-pane label="基本信息" name="基本信息">
            <el-row style="width: 100%;height: 100%;overflow-y: auto;" >
              <el-col :span="15">
                <el-card style="height: 100%;">
                  <el-form  label-width="150px" label-position="right">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="对账单号" >
                          <span>{{purAccountForm.code}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item size="small" label="出账日" >
                          <span>{{purAccountForm.accountDay}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="对账完成日">
                            <span>{{ parseTime(purAccountForm.accountCompleteTime, '{y}-{m}-{d}')}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item size="small" label="付款截止日">
                          <span>{{ parseTime(purAccountForm.endTime, '{y}-{m}-{d}')}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="是否含税">
                          <span>{{purAccountForm.isTax=='1'?'是':'否'}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item size="small" label="币种" >
                          <span>{{supplierForm.currency}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="账单金额(元)" prop="accountDay">
                          <span>{{purAccountForm.payPayablePrice}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item size="small" label="采购收货金额(元)" prop="accountPeriod">
                          <span>{{purAccountForm.accountPrice}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="采购退货金额(元)" prop="accountDay">
                          <span>{{purAccountForm.backPrice}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item size="small" label="扣款金额(元)" prop="accountPeriod">
                          <span>{{purAccountForm.otherPrice}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="应付金额(元)" prop="accountDay">
                          <span>{{purAccountForm.payPayablePrice}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item size="small" label="已付金额(元)" prop="accountPeriod">
                          <span>{{purAccountForm.payWriteOffPrice}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="small" label="未付金额(元)" prop="accountDay">
                          <span>{{purAccountForm.payRemainPrice}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>

                  </el-form>
                </el-card>
              </el-col>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="对账明细" name="对账明细">
            <RawAccountTabSupplierV2
              tabToolId1="supProcureToolId1"
              tabToolId2="supProcureToolId2"
              ref="rawAccountTabRef"
              :allData="allData"
              :tabColumnList="tabColumnList"
              :editOtherList="tabOtherList"
              :tabQuantity1="2"
              :tabName1="'采购收货'"
              :tabName2="'采购退货'"
              :tabName3="'扣款单'"
              :tabName4="'调整记录'"
              :drawerBorrow="drawerBorrow"
              :tabColumnList2="backTabColumnList"
              :tabColumnList3="otherColumnList"
              @getCheckFunction="false"
              @refreshFunction1="deliverSearchChange1"
              @refreshFunction2="deliverSearchChange2"
              @refreshFunction3="deliverSearchChange3"
              @refreshFunction4="deliverSearchChange4"
              :footLabel="footLabel"
              :tabFormRef="accountFormRef"
              :isEdit="isEdit"
              :deduction="true"
              :otherAmountBtn="true"
              :supplierQuery="supplierQuery"
              @doSaveBack="doSave"
              :row="formInfo"
              :isSupplier="true"
            />
          </el-tab-pane>
          <el-tab-pane label="附件" name="附件">
            <XTable  :pageShow="false"
                    class="xtable-content" :loading="fileLoading" :data="purAccountForm.fileList" :show-footer="false"
                   :columnList="fileColumnList" ref="fileleteTableRef1" border :column-config="{ resizable: true }"
                   :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,  }">
                <template #default-fileName="scope">
                  <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
                </template>
                <template #default-src="scope">
                  <ImagePreview
                    v-if="scope.row.sysFileVo?.length"
                    :width="100"
                    :height="100"
                    :src="scope.row.url"
                    :type="scope.row.type"
                    :preview-src-list="[scope.row.url]"
                  />
                </template>
                <template #default-make="scope">
                  <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
                </template>
            </XTable>
          </el-tab-pane>
        </el-tabs>
      </div>
       
      <!-- </div> -->
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button v-if="checkPermi(['financial:procureSupplierAccount:share'])" command="link"  v-show="!drawerBorrow.title?.includes('申请修改') && !drawerBorrow.title?.includes('详情')" @click="generateUrlLink(purAccountForm)">分享账单</el-button>
            <el-button v-if="checkPermi(['financial:procureSupplierAccount:acount'])&&purAccountForm?.supplierSwitch=='1'" :loading="buttonLoading" type="primary" v-show="drawerBorrow.title?.includes('确认')" @click="handleConfirm"> 确认对账 </el-button>
            
            <el-button :loading="buttonLoading" type="primary"  v-show="drawerBorrow.title?.includes('申请修改')" @click="handleSaveUpdate" >提交申请</el-button>
            <el-button @click="drawerBorrow.visible=false"  v-if="drawerBorrow.title?.includes('申请修改')">取消</el-button>
            <el-button @click="drawerBorrow.visible=false"  v-else>关闭</el-button>
          </span>
        </div>
      </template>
    </el-drawer>
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="70%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 签名列表 -->
    <signDialog v-if="signVisible" v-model:show="signVisible" @submit="submitSign" @cancel="cancelSign" />
  </div>
</template>

<script setup name="ProcureSupplierAccount" lang="ts">
import supplierAccountTable2 from '../components/supplierAccountTableV2.vue';
import { listAccountOrderOther } from '@/api/financial/accountOrderOther';
import {
  getAccountOrder,
  updateAutoSupplierAccount,
  updateAccountOrderStatus,
  listSupplierDeliveryRecord,
  listSupplierBackRecord,
  getSignPdf,
  getAdjustList,
  updateApplyAutoSupplierAccount,
  listApplyList,
  autoAccountSignSupplier
} from '@/api/financial/accountOrder';
import { AccountOrderVO, AccountOrderQuery, AccountOrderForm, TypeEnum, StatusEnum, statusStrings, HandleEnum } from '@/api/financial/accountOrder/types';
import { deepClone } from '@/utils';
import { InOutTypeEnum, typeStrings } from '@/api/basedata/rawMaterial/types';
import { parseTime } from "@/utils/ruoyi";
/**对账预览 */
import { getReportUrl } from '@/utils/report';
import fileSaver from "file-saver";
import {downloadUrl} from '@/api/upload/index';
import { getSupplier } from '@/api/basedata/supplier';
import {addFile, deleteFile, getFileListAndOssUrl} from '@/api/upload';
import useUserStore from '@/store/modules/user';
import {ref} from "vue";
import clipboard3 from "vue-clipboard3";
import { getUrlLink } from "@/api/purchase/materialOrder";
import {checkPermi} from "@/utils/permission";
import { getCraftList } from '@/api/basedata/craft';
import { listRawMaterialCategory } from '@/api/basedata/rawMaterialCategory';
import {queryUseModule} from "@/api/basedata/sign";
const { nickname } = useUserStore();


/** 对账单按钮操作 */
let reportUrl = ref("");
const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '对账单'
});

const accountUReportHandle = async (row: any) => {
  reportDrawer.title = "对账单报表预览";
  reportDrawer.visible = true;
  if(row.confirmStatus=="3"&&row.accountStatus=="2"){
    getSignPdf({bizId:row.id,bizCode:row.code}).then(res=>{
      let vo = res.data;
      if (vo.url) {
        let url = '/web/viewer.html?file=' + encodeURIComponent(vo.url + '#' + vo.name);
        reportUrl.value = url;
        return;
      }
    });
  }
  reportUrl.value = getReportUrl() + `&_n=采购对账单&_u=file:purchaseAccount.ureport.xml&url=financial/accountOrder/supReview/${row.id}&listUrl=financial/accountOrder/reportDetail/${row.id}&listUrl1=financial/accountOrder/supReviewRecord/${row.id}`;

}

const accountOrderType = TypeEnum.PURCHASE;
const accountTableRef = ref();
const accountFormRef = ref();
const isEdit = ref(false);
const formType = ref(HandleEnum.ADD);
const formInfo = ref();
const tabOtherList = ref([]) // 编辑的其他金额列表
const headerForm = ref({}) // 用于保存搜索条件
//初始化编辑金额
const firstInitEditPrice = ref(true);
const showCategorySelect = ref(true);
const rawAccountTabRef = ref();
const buttonLoading = ref(false);
const purAccountForm =ref();
const supplierForm = ref();
const radioTable = ref('基本信息');
const fileLoading = ref(false);
const activeNames = ref(['账单明细','凭证信息']);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

//含税
const { monthly_method, currency_type: currencyTypeList} = toRefs<any>(proxy?.useDict( 'monthly_method','currency_type'));
const taxRate = ref(0);
//首次查询，或者重置查询条件
const firstSearch = ref(true);
//已选择记录
const inOrOutLoading = ref(true);
const allData = ref({});
/**
* 冲销类型
* 1:付款
* 2:收款
*/
const writeOffType = ref("1");
/**
* 是否供应商查询
*/
const supplierQuery = ref(false);

const types = ref([
  { value: "1", label: "物料供应商" },
  { value: "2", label: "外协加工供应商" },
  { value: "3", label: "订单外协供应商" },
  { value: "4", label: "综合供应商" },
]);

const modules = ref([
  { value: "1", label: "采购合同确认" },
  { value: "2", label: "物料送货" },
  { value: "3", label: "物料退货确认" },
  { value: "4", label: "采购对账" },
]);
const categorys = ref([]);

/** 工艺列表 */
let craftListVos = ref([]);
const footLabel = {

  label5:"应收总金额",
}
const titleLabel={
  label1:"应收金额汇总",
  label2:"退货金额汇总",
  label6:"收款金额汇总",
  labelHide3:true,
}
//冲销defin start
//编辑和查看详情选择的对账单
const currentAccountOrderId = ref(undefined);
const isTaxOptions = ref([
  {value: "1", label: "是"},
  {value: "0", label: "否"}
])
const accountStatusOptions = ref([
  {value: "1", label: "未对账"},
  {value: "2", label: "对账完成"},
  {value: "9", label: "调整中"}
])
const supplierSwitchOptions = ref([
  {value: "1", label: "协同对账"},
  {value: "0", label: "普通对账"}
])

const columnList = ref([
  { title: '序号',field: "index", width: '50', type: 'seq', visible: true, align: 'center' },
  { title: '对账单号', width: '140', field: 'code', align: 'center', filterType: 'input' },
  { title: '供应商名称', width: '160', field: 'supplierName', align: 'center', filterType: 'input' },
  { title: '客户名称', width: '160', field: 'customerName', align: 'center', filterType: 'input' },
  { title: '账单状态', width: '80', field: 'accountStatus', align: 'center', filterType: 'radio', filterData: () => accountStatusOptions.value  },
  { title: '对账方式', width: '80', field: 'supplierSwitch', align: 'center',  filterType: 'radio', filterData: () => supplierSwitchOptions.value },
  { title: '对账月份', width: '100', field: 'accountMonth', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择对账月份', startParams: { type: 'month' }, endParams: { type: 'month' }, valueFormat: 'YYYY-MM' } },
  { title: '出账日', width: '80', field: 'accountDay', align: 'center', filterType: 'intervalDate', filterParam: { placeholder: '请选择出账日', startParams: { type: 'date' }, endParams: { type: 'date' }, valueFormat: 'YYYY-MM-DD' } },
  { title: '账单周期', width: '80', field: 'accountPeriod', align: 'center' },
  { title: '结算方式', width: '90', field: 'monthlyMethod', align: 'center', filterType: 'input' },
  { title: '是否含税', width: '80', field: 'isTax', align: 'center', filterType: 'radio', filterData: () => isTaxOptions.value },
  { title: '付款截止日期', sortable: true, width: '140', field: 'endTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
  { title: '账单金额(元)', sortable: true, width: '140', field: 'payPayablePrice', align: 'center' },
  { title: '收货金额(元)', sortable: true, width: '140', field: 'accountPrice', align: 'center', filterType: "intervalNumber"},
  { title: '退货金额(元)', sortable: true, width: '140', field: 'backPrice', align: 'center',filterType: "intervalNumber" },
  { title: '扣款金额(元)', sortable: true, width: '140', field: 'otherPrice', align: 'center', filterType: "intervalNumber"},
  { title: '应收金额(元)', sortable: true, width: '140', field: 'payPayablePrice', align: 'center',filterType: "intervalNumber" },
  { title: '已收金额(元)', sortable: true, width: '140', field: 'repayWriteOffPrice', align: 'center', filterType: "intervalNumber"},
  { title: '未收金额(元)', sortable: true, width: '140', field: 'repayRemainPrice', align: 'center', filterType: "intervalNumber"},
  { title: '备注', width: '160', field: 'remark', align: 'center', },
  { title: '对账人', width: '80', field: 'accountUserName', align: 'center', filterType: 'input' },
  { title: '对账完成日', width: '80', field: 'accountCompleteTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' }  },
  { title: '是否回票', width: '80', field: 'isInvoice', align: 'center'  },
  { title: '回票金额', width: '80', field: 'invoicePrice', align: 'center' },
  { title: '回票时间', width: '80', field: 'invoiceTime', align: 'center'  },
  { title: '发票号码', width: '80', field: 'invoiceCode', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '300', fixed: 'right', showOverflow: false },
]);
const tabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '送货单号', field: 'code', align: 'center', filterType: 'input' },
  { width: '120', title: '关联采购单', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
   { title: '入库日期', sortable: true, width: '140', field: 'deliveryTime', align: 'center', filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
   { width: '100', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
   { width: '120', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
   { width: '160', title: '规格参数', field: 'specificationAll', align: 'center',filterType:'input' },
   { width: '160', title: '送货备注', field: 'accountDeliveryRemark', align: 'center' },
   { width: '80', title: '采购总数', field: 'detailQuantity', align: 'center',filterType: "intervalNumber" },
   { width: '80', title: '本次送货', field: 'inOutQuantity', align: 'center',filterType: "intervalNumber" },
   { width: '80', title: '采购单价', field: 'inOutPrice', align: 'center', },
   { width: '100', title: '折扣金额', field: 'discountPrice', align: 'center', fixed: 'right', editRender: {} },
   { width: '120', title: '总金额', field: 'totalPrice', align: 'center', fixed: 'right', },
  { width: '220',title: '备注', field: 'remark', align: 'center', fixed: 'right', editRender: {} },
]);

const changeTabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '送货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { width: '120', title: '关联采购单', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
   { title: '入库日期', sortable: true, width: '140', field: 'createTime', align: 'center' },
   { width: '100', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
   { width: '120', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
   { width: '160', title: '规格参数', field: 'specificationAll', align: 'center',filterType:'input' },
   { width: '80', title: '采购总数', field: 'detailQuantity', align: 'center', filterType: "intervalNumber" },
  //  { width: '80', title: '本次送货', field: 'inOutQuantity', align: 'center', },
  //  { width: '80', title: '采购单价', field: 'inOutPrice', align: 'center', },
   { width: '100', title: '折扣金额', field: 'discountPrice', align: 'center', fixed: 'right', editRender: {} },
   { width: '120', title: '总金额', field: 'totalPrice', align: 'center', fixed: 'right', },
  { width: '80', title: '本次送货', field: 'quantity', align: 'center', fixed: 'right', editRender: {} },
  { width: '100', title: '采购单价', field: 'price', align: 'center', fixed: 'right', editRender: {} },
  { width: '220',title: '备注', field: 'remark', align: 'center', fixed: 'right', editRender: {} },
]);

const backTabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '退货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货单号' } },
  { width: '120', title: '关联采购单号', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '退货日期', sortable: true, width: '140', field: 'backTime', align: 'center',filterType: 'intervalDate', filterParam: { valueFormat: 'YYYY-MM-DD HH:mm:ss' }  },
  { width: '100', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { width: '120', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { width: '260', title: '规格参数', field: 'specificationAll', align: 'center', filterType: 'input'},
  { width: '160', title: '退货备注', field: 'accountDeliveryRemark', align: 'center' },
  { width: '80', title: '本次退货', field: 'inOutQuantity', align: 'center',filterType: "intervalNumber" },
  { width: '80', title: '退货单价', field: 'inOutPrice', align: 'center', },
  //{ width: '100', title: '核对数量', field: 'quantity', align: 'center', fixed: 'right', editRender: {} },
  //{ width: '100', title: '核对单价', field: 'price', align: 'center', fixed: 'right', editRender: {} },
  { width: '120', title: '总金额', field: 'totalPrice', align: 'center', fixed: 'right', },
  { width: '320', title: '备注', field: 'remark', align: 'center', fixed: 'right', editRender: {} },
]);
const changeBackTabColumnList = ref([
  { width: '40', type: 'checkbox', align: 'center', field: "checkbox", visible: true, },
  { width: '40', title: '序号', type: 'seq', align: 'center' },
  { width: '120', title: '退货单号', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入退货单号' } },
  { width: '120', title: '关联采购单号', field: 'purchaseCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入采购单号' } },
  { title: '退货日期', sortable: true, width: '140', field: 'createTime', align: 'center' },
  { width: '100', title: '物料编码', field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码' } },
  { width: '120', title: '物料名称', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称' } },
  { width: '260', title: '规格参数', field: 'specificationAll', align: 'center', },
  // { width: '80', title: '退货数量', field: 'inOutQuantity', align: 'center', },
  // { width: '80', title: '退货单价', field: 'inOutPrice', align: 'center', },
  { width: '100', title: '本次退货', field: 'quantity', align: 'center', fixed: 'right', editRender: {} },
  { width: '100', title: '退货单价', field: 'price', align: 'center', fixed: 'right', editRender: {} },
  { width: '120', title: '总金额', field: 'totalPrice', align: 'center', fixed: 'right', },
  { width: '320', title: '备注', field: 'remark', align: 'center', fixed: 'right', editRender: {} },
]);
const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '订单审核'
});
const rQueryParams = ref({
  pageNum: 1,
  pageSize: 20
});
const backQueryParams = ref({
  pageNum: 1,
  pageSize: 20
});
const handle = async (handleType: HandleEnum, row?: AccountOrderVO) => {
  useUserStore().setSupplier({supplierId:row.supplierId});
  if (handleType == HandleEnum.ADD) {
    showCategorySelect.value=true;
    formType.value = HandleEnum.ADD;
    isEdit.value = false;
    formInfo.value = {};
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    currentAccountOrderId.value = undefined;
    handleAdd()
  } else if (handleType == HandleEnum.EDIT) {

    formType.value = HandleEnum.EDIT;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "采购对账确认";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    
    purAccountForm.value = res.data;
    const fileData=await getFileListAndOssUrl({ bizId: purAccountForm.value.id});
    purAccountForm.value.fileList = fileData.data;
    
    const supRes = await getSupplier(formInfo.value.supplierId);
    supplierForm.value = supRes.data;

    currentAccountOrderId.value = _id;
    handleUpdate(row);
  } else if (handleType == HandleEnum.EXAMINE) {
    formType.value = HandleEnum.EXAMINE;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "申请修改";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    
    purAccountForm.value = res.data;
    const fileData=await getFileListAndOssUrl({ bizId: purAccountForm.value.id});
    purAccountForm.value.fileList = fileData.data;
    
    const supRes = await getSupplier(formInfo.value.supplierId);
    supplierForm.value = supRes.data;

    currentAccountOrderId.value = _id;
    handleUpdate(row);
  } else if (handleType == HandleEnum.INFO) {
    showCategorySelect.value=false;
    formType.value = HandleEnum.INFO;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "对账单详情";
    radioTable.value = '基本信息';
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    purAccountForm.value = res.data;
    
    const fileData=await getFileListAndOssUrl({ bizId: purAccountForm.value.id});
    purAccountForm.value.fileList = fileData.data;

    const supRes = await getSupplier(formInfo.value.supplierId);
    supplierForm.value = supRes.data;

    currentAccountOrderId.value = _id;
    handleUpdate(row);
  }else if (handleType == HandleEnum.CONFIRM) {
    formType.value = HandleEnum.EDIT;
    rQueryParams.value = { pageNum: 1, pageSize: 20 };
    backQueryParams.value = { pageNum: 1, pageSize: 20 };
    isEdit.value = true;
    const _id = row?.id;
    drawerBorrow.title = "确认对账单";
    const res = await getAccountOrder(_id);
    formInfo.value = res.data;
    currentAccountOrderId.value = _id;
    handleUpdate(row);
  }
}


const handleAdd = async () => {
  drawerBorrow.title = "添加对账单";
  drawerBorrow.visible = true;
  allData.value.inOrOutLoading = true;
  await handleInOrOutQuery({accountTime:parseTime(new Date(), '{y}-{m}-{d} 23:59:59')})
  allData.value.inOrOutLoading = false;
}

const handleUpdate = async () => {
  drawerBorrow.visible = true;
  allData.value.inOrOutLoading = true;

  await handleInOrOutQuery({accountTime:formInfo.value.accountTime,monthlyMethod:formInfo.value.monthlyMethod,isTax:formInfo.value.isTax});
  allData.value.inOrOutLoading = false;
}

// tab页签内合并搜索 **************start
const deliverSearchChange = async() => {

  allData.value.inOrOutLoading = true;
  console.log("deliverSearchChange======", rawAccountTabRef.value.tabQueryParams)
  rQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams));
  rQueryParams.value = { ...rQueryParams.value, ...headerForm.value }

  backQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams2));
  backQueryParams.value = { ...backQueryParams.value, ...headerForm.value }
  await getAddListRecord();

  allData.value.inOrOutLoading = false;
}

const deliverSearchChange1 = async() => {

  allData.value.inOrOutLoading = true;
  rQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams));
  rQueryParams.value = { ...rQueryParams.value, ...headerForm.value }
  await getAddListRecord1();
  allData.value.inOrOutLoading = false;
}

const deliverSearchChange2 = async() => {
  allData.value.inOrOutLoading = true;
  backQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams2));
  backQueryParams.value = { ...backQueryParams.value, ...headerForm.value }
  await getAddListRecord2();
  allData.value.inOrOutLoading = false;
}


const deliverSearchChange3 = async() => {
  allData.value.inOrOutLoading = true;
  let otherQueryParams = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams3));
  otherQueryParams.accountOrderId = currentAccountOrderId.value;
  otherQueryParams.onlyDeduction = '1'
  listAccountOrderOther(otherQueryParams).then(res => {
    tabOtherList.value = res.data;
  });
  allData.value.inOrOutLoading = false;
}

//成本调整记录
const deliverSearchChange4 = async() => {
  allData.value.inOrOutLoading = true;
  //成本调整单
  console.log("allData.value.checkedTabList1",allData.value.checkedTabList1);
  console.log("allData.value.checkedTabList2",allData.value.checkedTabList2);
  const res22 = allData.value.checkedTabList1&&deepClone(allData.value.checkedTabList1);
  const res33 = allData.value.checkedTabList2&&deepClone(allData.value.checkedTabList2);
  const changeOrder1 = res22&&res22.map(item=>item.id);
  const changeOrder2 = res33&&res33.map(item=>item.id);
  const changeOrder11 = res22&&res22.map(item=>item.accountDetailId);
  const changeOrder22 = res33&&res33.map(item=>item.accountDetailId);

  let allList=<any>[];
  let allDetailList=<any>[];
  if(changeOrder2&&changeOrder2.length>0){
    allList=allList.concat(changeOrder2);
  }
  if(changeOrder1&&changeOrder1.length>0){
    allList=allList.concat(changeOrder1);
  }
  if(changeOrder11&&changeOrder11.length>0){
    allDetailList = allDetailList.concat(changeOrder11);
  }
  if(changeOrder22&&changeOrder22.length>0){
    allDetailList =allDetailList.concat(changeOrder22);
  }

  let queryParams4 = rawAccountTabRef.value.tabQueryParams4&&deepClone(rawAccountTabRef.value.tabQueryParams4);
  queryParams4 = { ...queryParams4, ...headerForm.value }

  let obj = {accountOrderId : currentAccountOrderId.value,
    accountDetailIds: allDetailList,
    bizIds:allList };
  obj = { ...queryParams4, ...obj }
    //由于太慢，异步获取
  getAdjustList(obj).then(tabList4=>{
      if(tabList4.data){
        allData.value.tabList4 = tabList4.data;
        allData.value.tabTotal4 = tabList4.data.length;
      }
  });
  allData.value.inOrOutLoading = false;
}

//申请记录
const deliverSearchChange44 = async() => {
  allData.value.inOrOutLoading = true;

  let queryParams4 = rawAccountTabRef.value.tabQueryParams4&&deepClone(rawAccountTabRef.value.tabQueryParams4);
  let obj = {accountOrderId : currentAccountOrderId.value };
  obj = { ...queryParams4, ...obj }
    //由于太慢，异步获取
  listApplyList(obj).then(tabList4=>{
      if(tabList4.code=='200'){
        allData.value.tabList4 = tabList4.rows;
        allData.value.tabTotal4 = tabList4.total;

        console.log("========================allData.value.tabList4",allData.value.tabList4)
      }
  });
  allData.value.inOrOutLoading = false;
}

/** 查询tab记录 */
const getAddListRecord1 = async () => {
  //查询类型为view
  allData.value.accountOrderId = currentAccountOrderId.value;
  rQueryParams.value.hasAccountOrder = "1";
  rQueryParams.value.supplierId = formInfo.value.supplierId;
  //审核不需要未对账数据
  rQueryParams.value.onlyAccountOrder = "1";
  //采购入库、 库存退货
   if(currentAccountOrderId.value){
    let rQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:rQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    rQueryParams2.type=InOutTypeEnum.PURCHASE_IN;
    rQueryParams2.supplierQuery='0';
    const res22 = await listSupplierDeliveryRecord(rQueryParams2);
    allData.value.checkedTabList1 = res22.rows;
  }
  rQueryParams.value.type = InOutTypeEnum.PURCHASE_IN;
  rQueryParams.value.supplierQuery='0';
  console.log("getAddListRecord getAddListRecord======", rQueryParams.value)
  const res2 = await listSupplierDeliveryRecord({ ...rQueryParams.value, accountOrderId: currentAccountOrderId.value });
  allData.value.tabList1 = res2.rows;
  allData.value.tabTotal1 = res2.total;
  inOrOutLoading.value = false
}

/** 查询tab记录 */
const getAddListRecord2 = async () => {
  //查询类型为view
  allData.value.accountOrderId = currentAccountOrderId.value;
  backQueryParams.value.supplierId = formInfo.value.supplierId;
  backQueryParams.value.hasAccountOrder = "1";
  backQueryParams.value.onlyAccountOrder = "1";
  //采购入库、 库存退货
   if(currentAccountOrderId.value){
    let backQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:backQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    backQueryParams2.type = InOutTypeEnum.STOCK_RETURN;
    backQueryParams2.supplierQuery='0';

    const res33 = await listSupplierBackRecord(backQueryParams2);
    allData.value.checkedTabList2 = res33.rows;
  }

  backQueryParams.value.supplierQuery='0';
  backQueryParams.value.type = InOutTypeEnum.STOCK_RETURN;
  console.log("getAddListRecord getAddListRecord======", rQueryParams.value)
  const res3 = await listSupplierBackRecord({ ...backQueryParams.value, accountOrderId: currentAccountOrderId.value });
  allData.value.tabList2 = res3.rows;
  allData.value.tabTotal2 = res3.total;
  inOrOutLoading.value = false
}


/** 查询tab记录 */
const getAddListRecord = async () => {
  //查询类型为view
  allData.value.accountOrderId = currentAccountOrderId.value;
  let otherQueryParams = { accountOrderId: currentAccountOrderId.value, onlyDeduction : '1' };
  listAccountOrderOther(otherQueryParams).then(res => {
    tabOtherList.value = res.data;
  });
  backQueryParams.value.supplierId = formInfo.value.supplierId;
  backQueryParams.value.hasAccountOrder = "1";
  rQueryParams.value.hasAccountOrder = "1";
  rQueryParams.value.supplierId = formInfo.value.supplierId;
  //审核不需要未对账数据
  rQueryParams.value.onlyAccountOrder = "1";
  backQueryParams.value.onlyAccountOrder = "1";

  //采购入库、 库存退货
   if(currentAccountOrderId.value){
    let rQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:rQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    rQueryParams2.type=InOutTypeEnum.PURCHASE_IN;
    rQueryParams2.supplierQuery='0';

    let backQueryParams2 = { pageNum: 1, pageSize: 9999,accountTime:backQueryParams.value.accountTime,accountOrderId:currentAccountOrderId.value,onlyAccountOrder : "1",hasAccountOrder:"1" };
    backQueryParams2.type = InOutTypeEnum.STOCK_RETURN;
    backQueryParams2.supplierQuery='0';
    const res22 = await listSupplierDeliveryRecord(rQueryParams2);
    const res33 = await listSupplierBackRecord(backQueryParams2);
    allData.value.checkedTabList1 = res22.rows;
    allData.value.checkedTabList2 = res33.rows;

    //成本调整单
    if(drawerBorrow.title?.includes('申请修改')){
      deliverSearchChange44();
    }else{
      deliverSearchChange4();
    }
  }

  rQueryParams.value.type = InOutTypeEnum.PURCHASE_IN;
  rQueryParams.value.supplierQuery='0';
  backQueryParams.value.supplierQuery='0';
  backQueryParams.value.type = InOutTypeEnum.STOCK_RETURN;
  console.log("getAddListRecord getAddListRecord======", rQueryParams.value)
  const res2 = await listSupplierDeliveryRecord({ ...rQueryParams.value, accountOrderId: currentAccountOrderId.value });
  const res3 = await listSupplierBackRecord({ ...backQueryParams.value, accountOrderId: currentAccountOrderId.value });
  allData.value.tabList1 = res2.rows;
  allData.value.tabTotal1 = res2.total;
  allData.value.tabList2 = res3.rows;
  allData.value.tabTotal2 = res3.total;

  //编辑状态下，判断不是首次初始化金额
  if (isEdit.value) {
    firstInitEditPrice.value = false;
  }
  inOrOutLoading.value = false
}

const handleInOrOutQuery = async (_headerForm: any) => {
  firstSearch.value = false;
  if (rawAccountTabRef.value) {
    rawAccountTabRef.value.resetInfo();
    rQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams));
    backQueryParams.value = JSON.parse(JSON.stringify(rawAccountTabRef.value.tabQueryParams2));
  }

  headerForm.value = _headerForm || {};
  rQueryParams.value = { ...rQueryParams.value, ..._headerForm }
  backQueryParams.value = { ...backQueryParams.value, ..._headerForm }
  console.log("==============rQueryParams.value", rQueryParams.value, backQueryParams.value);
  await getAddListRecord();
}

const handleSubmit = () => {
  let tempForm = accountFormRef.value.form;
  tempForm.status = StatusEnum.BE_AUDITED;
  rawAccountTabRef.value.doSave(tempForm);
}

const handleSave = () => {
  let tempForm = purAccountForm.value;
  if (!tempForm.status || tempForm.status != StatusEnum.REJECTED) {
    tempForm.status = StatusEnum.BE_SUBMITTED;
  }
  rawAccountTabRef.value.doSave(tempForm);
}

const handleSaveClose =async ()=>{
  let tempForm = purAccountForm.value;
  if (!tempForm.status || tempForm.status != StatusEnum.REJECTED) {
    tempForm.status = StatusEnum.BE_SUBMITTED;
  }
  await rawAccountTabRef.value.doSave(tempForm);

  drawerBorrow.visible = false;
  currentAccountOrderId.value = undefined;
}

const handleSaveUpdate =async ()=>{
  let tempForm = purAccountForm.value;
  if (!tempForm.status || tempForm.status != StatusEnum.REJECTED) {
    tempForm.status = StatusEnum.BE_SUBMITTED;
  }
  await rawAccountTabRef.value.doSave(tempForm);

  drawerBorrow.visible = false;
  currentAccountOrderId.value = undefined;
}

const handleConfirm = async() => {
  await proxy?.$modal.confirm('是否确认完成对账？');

  let tempForm = purAccountForm.value;
  tempForm.isConfirm='1';

  // 查询是否存在默认签章
   const res = await queryUseModule({useModule: '4'});
  // 存在则自动签名
  if(res.data) {
    submitSign(res.data.key, res.data.signType);
  } else {
    signVisible.value = true;
  }

  // await rawAccountTabRef.value.doSave(tempForm);

  // drawerBorrow.visible = false;
  // currentAccountOrderId.value = undefined;
}

const doSave = async (resForm: any) => {
  // todo 保存前的验证
  //得到供应商id
  let addForm = deepClone(resForm);
  //类型
  addForm.type = accountOrderType;
  //addForm.isTax = '1';
  addForm.purchaseDetailBoList = addForm.detailList;
  addForm.purchaseDetailBoList.forEach((it: any) => {
    it.purchaseMaterialOrderDetailId = it.bizId;
    it.rawMaterialInOutRecordId = it.id;
    it.id = it.accountDetailId;
  })

  if (addForm.id == undefined) {
    // addForm.status = StatusEnum.BE_SUBMITTED;
    // if (addForm.otherOrderBoList && addForm.otherOrderBoList.length > 0) {
    //   addForm.otherOrderBoList = addForm.otherOrderBoList.map((item: any) => {
    //     item.oldId = item.id;
    //     item.id = undefined;
    //     return item;
    //   })
    // }

    // console.log(" doSave inOutForm.add", addForm);
    // buttonLoading.value = true;
    // addSupplierAccountOrder(addForm).then(res => {
    //  proxy?.$modal.msgSuccess("操作成功");
    //   drawerBorrow.visible = false;
    //   currentAccountOrderId.value = undefined;
    //   //table组件刷新
    //   getAllList();
    // }).catch(err => {
    //   addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
    //     if (item.id.indexOf("row") > -1) {
    //       item.id = item.oldId;
    //       item.oldId = undefined;
    //     }
    //     return item;
    //   })
    // }).finally(() => { buttonLoading.value = false; });
  } else {
    if (addForm.otherOrderBoList && addForm.otherOrderBoList.length > 0) {
      addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
        if (item.id.indexOf("row") > -1) {
          item.oldId = item.id;
          item.id = undefined;
        }
        return item;
      })
    }
    console.log(" doSave inOutForm.update", addForm);
    // addForm.status = StatusEnum.BE_AUDITED;
    buttonLoading.value = true;
    if(drawerBorrow.title?.includes('申请修改')){
      addForm.status=undefined;
      updateApplyAutoSupplierAccount(addForm).then(res => {
        proxy?.$modal.msgSuccess("申请成功");
        getAllList();
      }).catch(err => {
        addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
          if (item.id.indexOf("row") > -1) {
            item.id = item.oldId;
            item.oldId = undefined;
          }
          return item;
        })
      }).finally(() => { buttonLoading.value = false; 
        deliverSearchChange3(); });

    }else{
      updateAutoSupplierAccount(addForm).then(res => {
        proxy?.$modal.msgSuccess("修改成功");
        // drawerBorrow.visible = false;
        // currentAccountOrderId.value = undefined;
        getAllList();
      }).catch(err => {
        addForm.otherOrderBoList = addForm.otherOrderBoList.map(item => {
          if (item.id.indexOf("row") > -1) {
            item.id = item.oldId;
            item.oldId = undefined;
          }
          return item;
        })
      }).finally(() => { buttonLoading.value = false; 
        deliverSearchChange3(); });
    }
  }
}

/************aduit 审核操作 start ***********/
/** 审核驳回 */
const reject = async () => {
  updateStatus(currentAccountOrderId.value, StatusEnum.REJECTED);
}
/** 审核通过 */
const examinePass = async () => {
  updateStatus(currentAccountOrderId.value, StatusEnum.AUDITED);
}
const updateStatus = (id: any, status: string) => {
  buttonLoading.value = true;
  updateAccountOrderStatus({ id, status }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;


  }).finally(() => { buttonLoading.value = false; });
}

const getAllList = async() => {
  await accountTableRef.value?.radioTableHandle();
}

/************aduit 审核操作 end ***********/
const getTaxRate = async () => {
  const res = await proxy?.getConfigKey("taxRate");
  if (res != undefined) {
    taxRate.value = Number(res.data);
    console.log(taxRate.value)
  }
}

const fileColumnList = ref([
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
    {title: '附件名称', field: 'name', align: 'center'},
    {title: '缩略图', field: 'src', align: 'center', showOverflow: false},
    {title: '文件大小', width: '80', field: 'size', align: 'center'},
    {title: '上传人', width: '80', field: 'createByName', align: 'center'},
    {title: '上传时间', width: '140', field: 'createTime', align: 'center'},
    {title: '操作', width: '100', field: 'make', align: 'center'},
  ]);
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

  const fileChange = async (value: any) => {
    let lastFile = value.find(vo => vo.key == value[value.length - 1].key);
    var data = {
      bizId: purAccountForm.value.id,
      moduleCode: "8",
      bizType: "42",
      type: lastFile.type,
      size: lastFile.size,
      name: lastFile.name,
      key: lastFile.key,
      createByName: nickname
    }
    data.createByName= data.createByName+'（供方）'
    console.log(data);
    await addFile(data);
    
    const fileData=await getFileListAndOssUrl({ bizId: purAccountForm.value.id});
    purAccountForm.value.fileList = fileData.data;
  }

  /** 生成分享账单并复制 */
  //解构出复制方法
const { toClipboard } = clipboard3();
const { userId } = useUserStore();
const generateUrlLink = async (row: any) => {
  let path = 'pages/reviewPdf/index';
  let query = 'companyId=' + row.companyId + '&shareUserId=' + userId + '&id=' + row.id + '&type=4&isReview=2&code=' + '';
  const res = await getUrlLink({ path: path, query: query });
  console.log(res)
  try {
    await toClipboard(res.data);
    proxy?.$modal.msgSuccess("复制成功!");
  } catch (error) {
    alert("复制失败!请重试!")
  }
  return res.data || '';
}

//明细成本调整
const changeAdjust = async (row: any) => {
  accountTableRef.value.changeAdjust(row);
}

const adjustTypeOption = ref([
    {label: "送货", value: "1"},
    {label: "退货", value: "2"},
  ])
const adjustPriceTypeOption = ref([
  {label: "单价", value: "1"},
  {label: "数量", value: "2"},
  {label: "折扣金额", value: "3"},
])
const adjustColumnList2 = ref([
  { title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60' },
  { title: '单据类型', width: '80', field: 'orderType', align: 'center',filterType:'radioButton',  filterData:()=>adjustTypeOption.value },
  { title: '单据编码', width: '140', field: 'code', align: 'center',filterType:'input' },
  { title: '关联采购单', width: '140', field: 'purchaseCode', align: 'center',filterType:'input' },
  { title: '收货/退货日期', width: '120', field: 'operateTime', align: 'center', filterType: 'intervalDate', filterParam: {   valueFormat: 'YYYY-MM-DD HH:mm:ss' }},
  { title: '物料编码', width: '120', field: 'materialCode', align: 'center',filterType:'input' },
  { title: '物料名称', width: '160', field: 'materialName', align: 'center',filterType:'input' },
  { title: '规格参数', width: '300', field: 'specification', align: 'center',filterType:'input' },
  { title: '申请备注', width: '180', field: 'remark', align: 'center' },
  { title: '调整项目',fixed: 'right', width: '80', field: 'type', align: 'center',filterType:'radioButton',  filterData:()=>adjustPriceTypeOption.value},
  { title: '调整前', fixed: 'right',width: '80', field: 'oldValue', align: 'center' },
  { title: '申请调整', fixed: 'right',width: '80', field: 'modifyValue', align: 'center' },
  { title: '申请时间', fixed: 'right',width: '80', field: 'createTime', align: 'center' },
]);

const getCraftLists = async () => {
  let queryParams:CraftQuery = {
    isOpen: "1"
  }
  await getCraftList(queryParams)
    .then(res => {
      craftListVos.value = res.data;
    });
}

const getCategoryList = async () => {
  await listRawMaterialCategory()
    .then(res => {
      categorys.value = res.rows.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
    });
}
const signVisible = ref(false);

const submitSign = async (key : any, signType : any) => {
  proxy?.$modal.loading("加载中...");
  autoAccountSignSupplier({ id:currentAccountOrderId.value, status:StatusEnum.AUDITED, imageKey: key, signType: signType }).then(res => {
    proxy?.$modal.msgSuccess("操作成功");
    getAllList();
    drawerBorrow.visible = false;
    currentAccountOrderId.value = undefined;
  }).finally(() => {proxy?.$modal.closeLoading()});
}

const cancelSign = async () => {
  signVisible.value = false;
}
const otherColumnList = ref([
  { type: 'checkbox', fixed: 'left', align: 'center', field: "checkbox", width: '50' },
  { title: "序号", fixed: 'left', type: 'seq', align: 'center', width: '60' },
  { title: '扣款单号', width: '180', field: 'code', align: 'center' },
  { title: '结案金额', width: '180', field: 'price', align: 'center' },
  { title: '扣款时间', width: '180', field: 'createTime', align: 'center' },
  { title: '备注',  fixed: 'right', field: 'remark', align: 'center' },
]);
onMounted(() => {
  getTaxRate();
  getCraftLists();
  getCategoryList();
});
</script>
<style lang="scss" scoped>
.el-drawer__header {
  margin-bottom: 0px !important;
}

.totalTitle {
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


:deep(.padding-drawer) {
  .el-drawer__header {
    margin-bottom: 5px;
  }

  .el-drawer__body {
    padding-top: 10px;
    padding-bottom: 10px;

    .drawer-order-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .el-card {
      .el-card__body {
        padding: 5px !important;
      }
    }
  }

  .el-drawer__footer {
    padding-bottom: 10px;
  }
}

:deep(.table-height-rows) {
  background: rgb(217, 236, 255);
}
</style>

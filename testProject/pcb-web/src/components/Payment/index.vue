<template>
  <el-alert v-if="form.status=='3'" :title="'驳回原因: ' + form.rejectRemark" type="error" show-icon :closable="false"/>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="基本信息" name="1">
      <el-form
        border
        label-width="120px"
        :disabled="props.readOnly || (props.isUpdate && props.form.status!='1' && props.form.status!='3')"
        :model="form"
        ref="repaymentRecordFormRef"
        :rules="props.readOnly ? {} : addRules"
        v-loading="dialogTableLoading"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item v-if="props.type=='1'" size="small" label="选择供应商" prop="supplierId">
              <el-select :disabled="props.isUpdate" style="width: 100%;"
                         v-model="form.supplierId"  @change="changeSup"  filterable>
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
              </el-select>
              <div v-if="form.remodifyType == '1'">*该{{typeName}}款单已发起重新修改流程</div>
            </el-form-item>
            <el-form-item v-if="props.type=='2'" size="small" label="选择客户" prop="customerId">
              <el-select :disabled="props.isUpdate" style="width: 100%;"
                         :default-first-option="true" v-model="form.customerId" @change="changeCust"  filterable>
                <el-option v-for="item in customerList" :key="item.id"
                           :label="item.customerCode + '-' + item.customerName + '-' + item.reconciliationTime + '号'"
                           :value="item.id">
                  <div style="display:flex;justify-content:space-between;">
                    <span>{{ item.customerCode }}</span>
                    <span style="margin-left:20px;">{{ item.customerName }}</span>
                    <span style="margin-left:20px;">{{ item.reconciliationTime + "号" }}</span>
                  </div>
                </el-option>
              </el-select>
              <div v-if="form.remodifyType == '1'">*该{{typeName}}款单已发起重新修改流程</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="typeName + '款日期'" prop="payDate">
              <el-date-picker
                v-model="form.payDate"
                style="width: 100%;"
                type="date"
                placeholder="选择日期时间"

                value-format="YYYY-MM-DD 23:59:59"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="typeName + '款人'" prop="paymentUserId">
              <el-select style="width: 100%;" :disabled="true"
                         v-model="form.paymentUserId"  @change="changeUser"  filterable>
                <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item size="small" :label="typeName + '款方式'" prop="payWay">
              <el-select v-model="form.payWay" clearable filterable style="width: 100%;" @change="changePayWay">
                <el-option v-for="item in payWayList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="typeName + '款金额'" prop="totalPrice">
              <el-input-number
                               :precision="2" style="width: 100%;" :controls="false" v-model="form.totalPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="!['3','5','1','2'].includes(form.payWay)">
            <el-form-item size="small" label="票据号码:" prop="payCode">
              <el-input v-model="form.payCode" maxlength="100" show-word-limit :rows="2" />
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="!['3','5','1','2'].includes(form.payWay)">
            <el-form-item size="small" label="票据到期日:" prop="payExpireDate">
              <el-date-picker
                v-model="form.payExpireDate"
                style="width: 100%;"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD 23:59:59"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="!['1','2'].includes(form.payWay)">
            <el-form-item size="small" :label="typeName + '款账户'" prop="payAccount">
              <el-select v-model="form.payAccount" clearable filterable style="width: 100%;" @change="changeAccount">
                <el-option v-for="item in payAccountList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item>
       </el-col>
          <el-col :span="8">
            <el-form-item v-if="['1','2'].includes(form.payWay)" size="small" :label="typeName + '款账号'" prop="accountNumber">
              <el-input disabled v-model="form.accountNumber" maxlength="100" :rows="2"/>
            </el-form-item>
            <el-form-item v-else size="small" label="银行账号" prop="accountNumber">
              <el-input disabled v-model="form.accountNumber" maxlength="100" :rows="2"/>
            </el-form-item>
          </el-col>

          <el-col :span="8"  v-if="(form.businessType == '0' && form.status=='4' && Number(form.transferredAmount) > 0) || (form.businessType != '0' && form.businessType!='1' && form.status=='4')">
          <el-form
            label-width="120px"
            :model="form"
            :rules="addRules"
          >

              <el-form-item v-if="form.businessType == '0' && form.status=='4' && Number(form.transferredAmount) > 0 "  size="small" label="剩余转存金额" prop="transferredAmount">
                <div class="global-flex">
                  <el-input v-model="form.transferredAmount" :disabled="props.readOnly || (props.isUpdate && props.form.status!='1' && props.form.status!='3')">
                  </el-input>
                  <el-button :disabled="props.isOpen" type="primary" style="width: 50%;display: block" link @click="getDetail">{{form.businessCode}}</el-button>
                </div>

              </el-form-item>



              <el-form-item v-if="form.businessType != '0' && form.businessType!='1' && form.status=='4'" size="small" label="来源单据" prop="transferredAmount">
  <!--              <el-input v-model="form.businessCode" maxlength="100" :rows="2"/>-->
                <el-button :disabled="props.isOpen || form.businessType=='3'" type="primary" link @click="getDetail">{{form.businessCode}}</el-button>
              </el-form-item>

          </el-form>
          </el-col>

          <el-col :span="16">
            <el-form-item size="small" label="备注:">
              <el-input v-model="form.remark" maxlength="1000" show-word-limit :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>

    <el-collapse-item title="账单信息" name="2" v-if="!props.isPre">
      <div v-if="props.type=='1'">
        <el-select
                   :disabled="props.readOnly || form.status == '2'"
                   v-model="accountType"
                   style="width: 90px"
                   @change="changeSup"
        >
          <el-option
            v-for="item in accountTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left: 5px;color: #4363B3">*请选择其中一种账单类型进行付款</span>
        <span v-if="form.status != '4'" style="color: #003A8C;float:right;">已选择{{checkedAccountOrderIdList.length}}条,未{{typeName}}金额共计{{totalAmount}}</span>
      </div>
      <span style="color: #003A8C" v-if="props.type=='2' && form.status!='4'">已选择{{checkedAccountOrderIdList.length}}条,未{{typeName}}金额共计{{totalAmount}}</span>
      <XTable v-if="props.type=='2'" :pageShow="false" :loading="dialogTableLoading" :columnList="paymentColumnList"
              ref="XTableRef"
              :showRefresh="true"
              @searchChange="searchChange"
              :checkbox-config="{highlight: !props.readOnly && props.form.status!='2'}"
              @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectAllChangeEvent" border height="300" :row-config="{ isHover: true }"
              :data="recordList">

        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-isTax="scope">
          <span v-if="scope.row.isTax == 0">否</span>
          <span v-if="scope.row.isTax == 1">是</span>
        </template>
        <template #default-endTime="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-accountTime="scope">
          <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-tax="scope">
          <span>{{ taxRate }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </XTable>
      <XTable v-else :pageShow="false" :loading="dialogTableLoading" :columnList="paymentColumnList2"
              ref="XTableRef"
              :showRefresh="true"
              @searchChange="searchChange"
              :checkbox-config="{highlight: !props.readOnly && props.form.status!='2'}"
              @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectAllChangeEvent" border height="300" :row-config="{ isHover: true }"
              :data="recordList">

        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-isTax="scope">
          <span v-if="scope.row.isTax == 0">否</span>
          <span v-if="scope.row.isTax == 1">是</span>
        </template>
        <template #default-endTime="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-accountTime="scope">
          <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-tax="scope">
          <span>{{ taxRate }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </XTable>
    </el-collapse-item>

    <el-collapse-item title="使用记录" name="2" v-if="props.isPre && form.status=='4'">
      <div v-if="props.type=='1' && !props.readOnly">
        <el-select
          :disabled="true"
          v-model="accountType"
          style="width: 90px"
          @change="changeSup"
        >
          <el-option
            v-for="item in accountTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left: 5px;color: #4363B3">*请选择其中一种账单类型进行付款</span>
      </div>
      <XTable v-if="props.type=='2'" :pageShow="false" :loading="dialogTableLoading" :columnList="paymentColumnList"
              ref="XTableRef"
              @checkbox-all="selectAllChangeEvent"
              :checkbox-config="{highlight: !props.readOnly && props.form.status!='2'}"
              @checkbox-change="selectAllChangeEvent" border height="300" :row-config="{ isHover: true }"
              :data="recordList">

        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-isTax="scope">
          <span v-if="scope.row.isTax == 0">否</span>
          <span v-if="scope.row.isTax == 1">是</span>
        </template>
        <template #default-endTime="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-accountTime="scope">
          <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-tax="scope">
          <span>{{ taxRate }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </XTable>
      <XTable v-else :pageShow="false" :loading="dialogTableLoading" :columnList="paymentColumnList2"
              ref="XTableRef"
              :checkbox-config="{highlight: !props.readOnly && props.form.status!='2'}"
              @checkbox-all="selectAllChangeEvent"
              @checkbox-change="selectAllChangeEvent" border height="300" :row-config="{ isHover: true }"
              :data="recordList">

        <template #default-accountMonth="scope">
          <span>{{ parseTime(scope.row.accountMonth, '{y}-{m}') }}</span>
        </template>
        <template #default-isTax="scope">
          <span v-if="scope.row.isTax == 0">否</span>
          <span v-if="scope.row.isTax == 1">是</span>
        </template>
        <template #default-endTime="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-accountTime="scope">
          <span>{{ parseTime(scope.row.accountTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-tax="scope">
          <span>{{ taxRate }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </XTable>
    </el-collapse-item>

    <el-collapse-item title="凭证信息" name="3">
      <div class="global-flex">
<!--        <XUpload v-if="form?.status != '4' && form?.status !='2' && !props.readOnly" :disabled = 'form?.fileList?.length + form?.addFileList?.length >= 9'-->
<!--                 :limit="9 - form?.fileList?.length - form?.addFileList?.length - form?.addFileList?.length" :fileSize="10"-->
<!--                 v-model:model-value="form.preFileList" model="download">-->
        <XUpload :fileSize="10" v-if="form?.status != '4' && form?.status !='2' && !props.readOnly" multiple
                 v-model:model-value="form.preFileList" model="download">
          <el-button type="primary">上传附件</el-button>
          <span style="color: #909399;margin-left:2px">支持批量上传，格式不限，每个文件大小在10mb以内</span>
        </XUpload>
      </div>
      <FileTable :data="form?.fileList" makeWidth="160">
        <template #makeBtn="{row}">
          <el-button v-if="!props.readOnly && form.status!= '2'" link type="primary" @click="delFile(row)">删除</el-button>
        </template>
           
      </FileTable>
    </el-collapse-item>

    <el-collapse-item title="追加凭证" name="4" v-if="form.status=='4' || form.status == '2'">
      <div class="global-flex">
<!--        <XUpload :disabled = 'form?.fileList?.length + form?.addFileList?.length >= 9' :limit="9-form?.fileList?.length-form?.addFileList?.length-form?.preAddFileList?.length" :fileSize="10" v-model:model-value="form.preAddFileList" @fileChange="addFile" model="download">-->
        <XUpload :fileSize="10" v-model:model-value="form.preAddFileList" multiple @fileChange="addFile" model="download">
          <el-button type="primary">上传附件</el-button>
          <span style="color: #909399;margin-left:2px">支持批量上传，格式不限，每个文件大小在10mb以内</span>
        </XUpload>
      </div>
      <FileTable :data="form?.addFileList" makeWidth="160">
        <template #makeBtn="{row}">
          <el-button link type="primary" @click="delAddFile(row)">删除</el-button>
        </template>
      </FileTable>
    </el-collapse-item>
  </el-collapse>

  <div class="payment-bottom-btn mask" v-if="!props.readOnly">
    <el-button>通过</el-button>
  </div>
  <div class="payment-bottom-btn position" v-if="!props.readOnly">
    <el-button :loading="productLoading" v-if="form.status == '1' || form.status == '3'"  type="danger" @click="submitDelete">删除</el-button>
    <el-button :loading="productLoading" v-if="form.status == '1' || form.status == '3' || !form.status" type="primary" @click="saveDraft">保存草稿</el-button>
    <el-button :loading="productLoading" v-if="form.status != '2' && form.status != '4'" type="primary" @click="submit">提交审核</el-button>
    <el-button :loading="productLoading" v-if="form.status == '2'" type="danger" @click="submitReject">驳回</el-button>
    <el-button :loading="productLoading" v-if="form.status == '2'" type="primary" @click="submitPass">通过</el-button>
  </div>
</template>

<script setup name="Payment" lang="ts">
  import fileSaver from "file-saver";
  import { downloadUrl} from '@/api/upload/index'
  import {ref} from "vue";
  import { queryInventoryByCommodity } from '@/api/inventory/inventory/index'
  import {listCompany} from "@/api/basedata/customer";
  import {listOwnerSupplier} from "@/api/basedata/supplier";
  import { listUserByDeptId } from '@/api/system/user';
  import useUserStore from "@/store/modules/user";
  import {OrderWriteOffRecordVO} from "@/api/financial/orderWriteOffRecord/types";
  import {
    addPaymentAccountFile,
    addPaymentWriteOff,
    addPrePaymentWriteOff, getPaymentAccountList, getRepaymentRecord,
    queryPayRecordListByCustSup,
    submitPaymentAccount,
    updatePaymentWriteOff,
    updatePrePaymentWriteOff,
    validatePaymentAccount
  } from "@/api/financial/repaymentRecord";
  import {AccountOrderVO, StatusEnum, TypeEnum} from "@/api/financial/accountOrder/types";
  import {listAccountConfirmList, postListAccountOrder} from "@/api/financial/accountOrder";
  import {as, bv} from "../../../dist/assets/index-db5f35d5";
  import {VxeTableEvents} from "vxe-table";
  import {SourceFullProcessOrderVO} from "@/api/outsource/sourceFullProcessOrder/types";
  import {deepClone} from "@/utils";
  import {submitFinishedOrder} from "@/api/order/directOrder";
  import {savePrediction} from "@/api/project/productionPlan";
  import { listDeptBank } from "@/api/system/dept"

  const repaymentRecordFormRef = ref<ElFormInstance>();
  const productLoading = ref(false)
  const XTableRef = ref();
  //客户列表
  let customerList = ref([]);

  //供应商列表
  let supplierList = ref([]);

  let typeName = ref("");

  let form:any = ref({});

  //用户列表
  let userList = ref([{}]);

  //对账单列表
  let recordList = ref<any[]>([]);

  //对账单类型
  let accountType = ref('2');

  const accountTypeList = ref([{label:'普通采购',value:'2'}
  // ,{label:'订单外协',value:'1'},{label:'工序外协',value:'5'},{label:'菲林/网板',value:'7'},
  ])

  const addRules = ref<ElFormRules>(
    {
      supplierId: [
        { required: true, message: "请选择供应商", trigger: "change" }
      ],
      customerId: [
        { required: true, message: "请选择客户", trigger: "change" }
      ],
      paymentUserId: [
        // { required: true, message: "人不能为空", trigger: "blur" },
        {
          required: true,
          validator: (rule, value, callback) => {
            if (null == value) {
              callback(new Error(typeName.value + '款人不能为空'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      payDate: [
        // { required: true, message: "日期不能为空", trigger: "blur" },
        {
          required:true,
          validator: (rule, value, callback) => {
            if (null == value) {
              callback(new Error(typeName.value + '款日期不能为空'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      payCode: [
        { required: true, message: "票据号码不能为空", trigger: "blur" },
        // {
        //   validator: (rule, value, callback) => {
        //     const reg = /^[a-zA-Z0-9]*$/;
        //     if (!reg.test(value)) {
        //       callback(new Error('只能输入数字或字母'));
        //     } else {
        //       callback();
        //     }
        //   },
        //   trigger: 'change'
        // }
      ],
      payExpireDate: [
        { required: true, message: "票据到期日不能为空", trigger: "blur" }
      ],
      totalPrice: [
        // { required: true, message: typeName.value + "款金额必须输入大于0的数字", trigger: "blur" },
        {
          required:true,
          validator: (rule, value, callback) => {
            const reg = /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/;
            if (!reg.test(Number(value))) {
              callback(new Error(typeName.value + '款金额必须输入大于0的数字'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      payWay: [
        // { required: true, message: "方式不能为空", trigger: "blur" },
        {
          required:true,
          validator: (rule, value, callback) => {
            if (null == value) {
              callback(new Error(typeName.value + '款方式不能为空'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      payAccount: [
        // { required: true, message: "账户不能为空", trigger: "blur" },
        {
          required:true,
          validator: (rule, value, callback) => {
            if (null == value) {
              callback(new Error(typeName.value + '款账户不能为空'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      accountNumber: [
        // { required: true, message: "账号不能为空", trigger: "blur" },
        {
          required:true,
          validator: (rule, value, callback) => {
            if (null == value) {
              if(['1','2'].includes(form.value.payWay)){
                callback(new Error(typeName.value + '款账号不能为空'));
              } else {
                callback(new Error( '银行账号不能为空'));
              }
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      remark: [
        { required: true, message: "备注不能为空", trigger: "blur" }
      ]
    });

  const payWayList = ref([
    {label: '现金', value: '3', elTagType: 'default', elTagClass: ''},
// {label: '赊账', value: '4', elTagType: 'default', elTagClass: ''}
    {label: '转账', value: '5', elTagType: 'default', elTagClass: ''},
    {label: '企业微信', value: '2', elTagType: 'default', elTagClass: '', bankNo:'1647640640'},
    {label: '企业支付宝', value: '1', elTagType: 'default', elTagClass: '',bankNo:'jx13316990051@sina.com'},
    {label: '电子银承', value: '6', elTagType: 'default', elTagClass: ''},
    {label: '电子商承', value: '7', elTagType: 'default', elTagClass: ''},
    {label: '纸质银承', value: '8', elTagType: 'default', elTagClass: ''},
    {label: '支票', value: '9', elTagType: 'default', elTagClass: ''},
    {label: '委托书', value: '10', elTagType: 'default', elTagClass: ''},
  ]);

  // const payAccountList = ref([
  //   {label: '中国工商银行信丰县支行', value: '1',bankNo:'1510201009000106395',account:'，行号：102428410247',type:'基本户，'},
  //   {label: '江西信丰农村商业银行', value: '2',bankNo:'134649700000002476',account:'，行号：402428499993',type:'一般户，'},
  //   {label: '赣州银行信丰支行', value: '3',bankNo:'2863000103000000896',account:'，行号：313428428636',type:'一般户，'},
  //   {label: 'The Hongkong and Shanghai Banking Corporation Limited', value: '4',bankNo:'053-484846-838',account:'，编号：004,代码：HSBCHKHHHKH',type:'香港公司美金账户，'},
  // ]);

  const changeAccount = async(bval:any)=>{
    payAccountList.value.filter(pf=>pf.id==bval).forEach(va=>{
      form.value.accountNumber = va.bankNo;
    })
  }

  const searchChange = async () => {
    if(props.type == '2'){
      await changeCust();
    } else {
      await getAccounOrderList(form.value.supplierId)
    }
    nextTick(() => {
      setRowCheck();
    });
  }

  const changePayWay = async (bval:any) => {
    console.log(bval);
    if(['3','5','1','2'].includes(bval)){
      form.value.payCode = undefined;
      form.value.payExpireDate = undefined;
    }
    if(['1','2'].includes(bval)){
      form.value.payAccount = undefined;
    }else {
      if(!form.value.payAccount){
        form.value.accountNumber = undefined;
      }
    }
    console.log("================...",form.value.payAccount);
    if (!['1', '2'].includes(form.value.payAccount)) {
      form.value.accountNumber = undefined;
      payWayList.value.filter(pf => pf.value == bval).forEach(va => {
        console.log("================",va);
        console.log("================",va.label);
        console.log("================",accountBankList.value);
        console.log("================",accountBankList.value);
        //配置4、5为微信支付宝
        if(va.label.includes("支付宝")){
          accountBankList.value.filter((pf:any)=> pf.type=='5').forEach((vaa:any)=>{
            form.value.accountNumber = vaa.bankNo;
          })
        }
        if(va.label.includes("微信")){
          accountBankList.value.filter((pf:any)=> pf.type=='4').forEach((vaa:any)=>{
            form.value.accountNumber = vaa.bankNo;
          })
        }
      })
    } else {
      changeAccount(form.value.payAccount);
    }
  }

  const isImageType = (type: any) => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
    return imageTypes.includes(type);
  }

  const activeNames = ref(['1','2','3','4'])
  const handleChange = (val: string[]) => {
    console.log(val)
  }

  const changeSup = async () => {
    console.log(form.value.supplierId)
    getAccounOrderList(form.value.supplierId);
    checkedAccountOrderIdList.value = [];
    totalAmount.value = 0;
  }
  const changeCust = async () => {
    let data ={
      customerId:form.value.customerId,
      type: props.isSup ? '2' : '8',
      repayAllWriteOff : '0',
      isSup: props.isSup ? '1' : undefined,
    }
    if(form.value.id){
      data.paymentId = form.value.id
    }
    if(props.readOnly || form.value.status == '2'){
      data = {
        paymentId: form.value.id,
        onlyPayment: '1'
      }
    }
    const _recordList = await getPaymentAccountList(data)
    recordList.value = _recordList.rows;
    checkedAccountOrderIdList.value = [];
    totalAmount.value = 0;
    // getAduitList(form.value.customerId)
  }

  const changeUser = async () => {
    const userInfo:any = userList.value.find((vo:any) => vo.userId == form.value.paymentUserId);
    form.value.paymentUser = userInfo?.nickName;
  }
  const props = withDefaults(defineProps<{
    id: string | number,
    isUpdate: boolean,
    type: string | number, // 1.收款 2.付款
    loading: boolean,
    readOnly: boolean,
    isPre: boolean,
    isOpen: boolean,
    isSup:boolean,
    form: any,

  }>(), {
    id: "",
    isUpdate: false,
    type: "1",
    loading:false,
    readOnly: false,
    isPre: false,
    isOpen: false,
    isSup: false,
    form: ()=>{},
  })

  const paymentColumnList = ref([
    { width: "50", type: "checkbox", align: "center", visible:true},
    { width: '50', title: '序号', type:'seq', align: 'center', },
    { width: '120', title: '对账单号', field: 'code', align: 'center', },
    { width: '100', title: '对账月份', field: 'accountMonth', align: 'center', },
    { width: '100', title: '是否含税', field: 'isTax', align: 'center', },
    { width: '100', title: '结算方式', field: 'monthlyMethod', align: 'center', },
    { width: '100', title: '币种', field: 'currency', align: 'center', },
    { width: '100', title: '收款截止日期', field: 'endTime', align: 'center', },
    { width: '100', title: '送货金额', field: 'accountPrice', align: 'center', },
    { width: '100', title: '退货金额', field: 'backPrice', align: 'center', },
    { width: '100', title: '其他金额', field: 'otherPrice', align: 'center', },
    {               title: '备注', field: 'remark', align: 'center', },
    { width: '100', title: '对账人', field: 'accountUserName', align: 'center', },
    { width: '100', title: '创建时间', field: 'createTime', align: 'center', },
    { width: '100', title: '对账完成时间', field: 'accountCompleteTime', align: 'center', },
    { width: '100', title: '应收金额', field: 'repayPayablePrice', align: 'center', fixed:'right'},
    { width: '100', title: '已收金额', field: 'repayWriteOffPrice', align: 'center', fixed:'right', visible: true },
    { width: '100', title: '剩余未收', field: 'repayRemainPrice', align: 'center', fixed:'right', visible: true},
    { width: '100', title: '本次核销金额', field: 'orderPayWriteOffPrice', align: 'center', fixed:'right',visible: false},
  ]);

  const paymentColumnList2 = ref([
    { width: "50", type: "checkbox", align: "center", visible:true},
    { width: '50', title: '序号', type:'seq', align: 'center', },
    { width: '120', title: '对账单号', field: 'code', align: 'center', },
    { width: '100', title: '对账月份', field: 'accountMonth', align: 'center', },
    { width: '100', title: '是否含税', field: 'isTax', align: 'center', },
    { width: '100', title: '结算方式', field: 'monthlyMethod', align: 'center', },
    { width: '100', title: '币种', field: 'currency', align: 'center', },
    { width: '100', title: '付款截止日期', field: 'endTime', align: 'center', },
    { width: '100', title: '收货金额', field: 'accountPrice', align: 'center', },
    { width: '100', title: '退货金额', field: 'backPrice', align: 'center', },
    { width: '100', title: '其他金额', field: 'otherPrice', align: 'center', },
    {               title: '备注', field: 'remark', align: 'center', },
    { width: '100', title: '对账人', field: 'accountUserName', align: 'center', },
    { width: '100', title: '创建时间', field: 'createTime', align: 'center', },
    { width: '100', title: '对账完成时间', field: 'accountCompleteTime', align: 'center', },
    { width: '100', title: '应付金额', field: 'payPayablePrice', align: 'center', fixed:'right'},
    { width: '100', title: '已付金额', field: 'payWriteOffPrice', align: 'center', fixed:'right',visible: true},
    { width: '100', title: '剩余未付', field: 'payRemainPrice', align: 'center', fixed:'right',visible: true},
    { width: '100', title: '本次核销金额', field: 'orderPayWriteOffPrice', align: 'center', fixed:'right',visible: false},
  ]);

  const checkedAccountOrderIdList = ref([]);

  const totalAmount = ref(0);

  const selectAllChangeEvent: VxeTableEvents.CheckboxAll<SourceFullProcessOrderVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
      const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
      checkedAccountOrderIdList.value = selectRecords.map(item => item.id);
      if(props.type == '1'){
        totalAmount.value = selectRecords.reduce((total, item) => total + Number(item.payRemainPrice), 0);
      } else if(props.type == '2'){
        totalAmount.value = selectRecords.reduce((total, item) => total + Number(item.repayRemainPrice), 0);
      }
    }
  }

  const queryInventoryByCommodityHandle = (value: any, row: any) => {
    productLoading.value = true
    queryInventoryByCommodity({code: value}).then((res) => {
      // console.log(res)
      row.productInventory = res?.data || 0
      productLoading.value = false
    }).catch(() => {
      productLoading.value = false
    })
  }

  const getAccounOrderList = async (supplierId?:any) =>{
    let res: any = {};
    let params: any = {};
    params.supplierId = supplierId;
    params.payAllWriteOff = '0';
    console.log(params.supplierId)
    if(props.readOnly || form.value.status == '2'){
        params = {
          paymentId: form.value.id,
          onlyPayment: '1'
        }
        res = await getPaymentAccountList(params)
    } else {
      if(accountType.value == form.value.writeOffType){
        params = {
          payAllWriteOff: '0',
          paymentId: form.value.id,
          supplierId: supplierId
        }
        res = await getPaymentAccountList(params)
      } else {
        if (accountType.value == '2') {
          params.pageNum = 1;
          params.pageSize = 5000;
          params.confirmStatus = '3';
          params.type = '2';
          res = await getPaymentAccountList(params)
        } else if (accountType.value == '1') {
          params.pageNum = 1;
          params.pageSize = 5000;
          params.status = '4';
          params.type = '1';
          res = await getPaymentAccountList(params)
        } else if (accountType.value == '5') {
          params.pageNum = 1;
          params.pageSize = 5000;
          params.status = '4';
          params.type = '5';
          res = await getPaymentAccountList(params)
        } else if (accountType.value == '7') {
          params.pageNum = 1;
          params.pageSize = 5000;
          params.status = '4';
          params.type = '7';
          res = await getPaymentAccountList(params)
        }
      }
    }
    recordList.value = res.rows
  }
  /*保存草稿*/
  const saveDraft = async () => {
    repaymentRecordFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const validateAccountList = recordList.value.filter(vo => checkedAccountOrderIdList.value.includes(vo.id)).map(item => {
          return {id: item.id, repayRemainPrice: item.repayRemainPrice, payRemainPrice: item.payRemainPrice}
        });
        form.value.validateAccountList = validateAccountList;
        const res = await validatePaymentAccount(form.value)
        if (res.msg) {
          ElMessageBox.confirm(
            res.msg,
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning',
            }
          ).then(() => {
            searchChange()
          })
        } else {
          let rollback = await submitDraft();
          if (!rollback && form.value.status != '4') {
            await emits("saveDraft");
          }
        }
      }
    });

  }

  const submitDraft = async () => {
    let data = deepClone(form.value);
    productLoading.value = true;
    data.accountOrderIdList = checkedAccountOrderIdList.value
    data.type = props.type;
    data.writeOffType = accountType.value;
    data.newFileList = deepClone((data.fileList || []).concat(data.preFileList || []));
    let rollback = false;
    data.fileList = Array.from(new Set(data.newFileList.map((item: any) => item.key)))
      .map(key => data.newFileList.find((item: any) => item.key === key));
    if (!props.isPre) {
      if (!data.id) {
        await addPaymentWriteOff(data).catch(() => {
          data.fileList = currentFileList.value;
          rollback = true;
        }).finally(() => {
          data.newFileList = [];
          productLoading.value = false;
        })
      } else {
        await updatePaymentWriteOff(data).catch(() => {
          data.fileList = currentFileList.value;
          rollback = true;
        }).finally(() => {
          data.newFileList = [];
          productLoading.value = false;
        })
      }
    } else {
      if (!data.id) {
        await addPrePaymentWriteOff(data).catch(() => {
          data.fileList = currentFileList.value;
          rollback = true;
        }).finally(() => {
          data.newFileList = [];
          productLoading.value = false;
        })
      } else {
        await updatePrePaymentWriteOff(data).catch(() => {
          data.fileList = currentFileList.value;
          rollback = true;
        }).finally(() => {
          data.newFileList = [];
          productLoading.value = false;
        })
      }
    }
    return rollback;
  }

  let timeout;

  // 防抖函数的定义
  function debounce(fn, delay) {
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn();
      }, delay);
    };
  }

  const addFile = async (files:any) => {
    const debouncedFunction = debounce(async ()=>{
      const newAddFileList = deepClone((form.value.addFileList || []).concat(files || []));
      console.log(newAddFileList);
      const addFileList = Array.from(new Set(newAddFileList.map((item: any) => item.key)))
        .map(key => newAddFileList.find((item: any) => item.key === key));
      const data = {
        id: form.value.id,
        addFileList: addFileList
      }
      const res = await addPaymentAccountFile(data)
      if (res.code == 200) {
        const resDetail = await getRepaymentRecord(form.value.id);
        Object.assign(form.value, resDetail.data);
        form.value.preAddFileList = [];
      }
    },200)
    debouncedFunction();
  }

  const delFile = async (row:any)=>{

    ElMessageBox.confirm(
      '是否确认删除文件名为' + row.name + '的文件？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(async() => {
      const fileList = form.value.fileList.filter(vo => vo.id!=row.id);
      form.value.fileList = fileList;
    })
  }

  const delAddFile = async (row: any) => {
    ElMessageBox.confirm(
      '是否确认删除文件名为' + row.name + '的文件？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(async () => {
      const fileList = form.value.addFileList.filter(vo => vo.id != row.id);
      const data = {
        id: form.value.id,
        addFileList: fileList
      }
      const res = await addPaymentAccountFile(data)
      if (res.code == 200) {
        const resDetail = await getRepaymentRecord(form.value.id);
        Object.assign(form.value, resDetail.data);
        form.value.preAddFileList = [];
      }
    })
  }

  const quotionFileList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60'},
    {title: '附件名称', field: 'name', align: 'center',minWidth: '200'},
    {title: '上传人', field: 'createByName', align: 'center',width: '200'},
    // {title: '文件大小(kb)', field: 'size', align: 'center',width: '80'},
    {title: '上传时间', field: 'createTime', align: 'center',width: '150'},
    // {title: '操作', field: 'make', align: 'center',width: '120'},
  ])

  // 文件下载
  const downLoadHandle = (key: string) => {
    let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
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

  /**
   * 获取供应商列表
   */
  const getSupplierList = async () => {
    const SupplierResponse: any = await listOwnerSupplier();
    supplierList.value = SupplierResponse.data.filter((v:any) => (!form.status && !props.isUpdate) ? v.status != '0' : v.status != null);

  }

  //获取本厂作为客户
  const getCustomerList = async () => {
    const SupplierResponse: any = await listCompany();
    customerList.value = SupplierResponse.data;

  }

  const accQueryParams = ref({
    pageNum: 1,
    pageSize: 5000,
    status: StatusEnum.AUDITED,
    type: TypeEnum.SALE,
  })

  // const getAduitList = async (id: any) => {
  //   const customerNameIdList = [id];
  //   accQueryParams.value.customerNameIdList = customerNameIdList;
  //   const res = await postListAccountOrder(accQueryParams.value);
  //   recordList.value = res.rows;
  // }

  /**
   * 获取当前部门用户
   */
  const getUser = async ()=>{
    const deptId = useUserStore().deptId;
    const users = await listUserByDeptId(deptId);
    userList.value = users.data;
  }

  const emits = defineEmits(['row-click','submitReject', 'submitPass','updateStatus','submit','submitDelete','saveDraft','getDetail']);

  // const emits = defineEmits([]);

  const getDetail = ()=>{
    emits('getDetail',form.value.businessId);
  }

  const onRowClick = (row: any) => {
    emits('row-click', row);
  };

  watch(() => props.loading, (newVal) => {
    productLoading.value = newVal;
  });

  const submit = async() =>{
    let data = deepClone(form.value)
    data.accountOrderIdList = checkedAccountOrderIdList.value
    data.status = undefined;
    data.writeOffType = accountType.value;
    repaymentRecordFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const validateAccountList = recordList.value.filter(vo => checkedAccountOrderIdList.value.includes(vo.id)).map(item => {
          return {id: item.id, repayRemainPrice: item.repayRemainPrice, payRemainPrice: item.payRemainPrice}
        });
        form.value.validateAccountList = validateAccountList;
        const res = await validatePaymentAccount(form.value)
        if (res.msg) {
          ElMessageBox.confirm(
            res.msg,
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning',
            }
          ).then(() => {
            searchChange()
          })
        } else {
          data.writeOffType = accountType.value;
          data.newFileList = deepClone((data.fileList || []).concat(data.preFileList || []));
          data.fileList = Array.from(new Set(data.newFileList.map((item: any) => item.key)))
            .map(key => data.newFileList.find((item: any) => item.key === key));
          data.isSup = props.isSup
          emits('submit', data);
        }
      }
    });
  }

  const submitPass = () => {
    productLoading.value = true;
    repaymentRecordFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const validateAccountList = recordList.value.filter(vo => checkedAccountOrderIdList.value.includes(vo.id)).map(item => {
          return {id: item.id, repayRemainPrice: item.repayRemainPrice, payRemainPrice: item.payRemainPrice}
        });
        form.value.validateAccountList = validateAccountList;
        const res = await validatePaymentAccount(form.value)
        if (res.msg) {
          ElMessageBox.confirm(
            res.msg,
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning',
            }
          ).then(() => {
            searchChange()
          })
        } else {
          emits('submitPass',form.value.id, props.isSup);
        }
      }
    });
    productLoading.value = false;
  }

  const submitReject = () => {
    ElMessageBox.prompt('请填写驳回原因：', '确认驳回', {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputValidator: function (value) {
        if (value == null || !value.trim()) {
          return '驳回原因不能为空';
        } else if (value.length > 200) {
          return '驳回原因长度不能超过200个字符';
        }
        return true; // 验证通过
      }
    }).then(({ value }) => {
      const data = {
        id: form.value.id,
        rejectRemark: value,
        isSup: props.isSup
      }
      emits('submitReject',data);
    })

  }

  const submitDelete = () => {
    emits('submitDelete',form.value);
  }

  /*设置选中*/
  const setRowCheck = ()=>{
    if(XTableRef.value){
      const $table = XTableRef.value.xTableRef;
      if($table){
        console.log(recordList.value)
        let temp = recordList.value.filter( item => item.selected =='1');
        console.log(temp)
        checkedAccountOrderIdList.value = temp.map(item =>  item.id);
        if(props.type == '1'){
          totalAmount.value = temp.reduce((total, item) => total + Number(item.payRemainPrice), 0);
        } else if(props.type == '2'){
          totalAmount.value = temp.reduce((total, item) => total + Number(item.repayRemainPrice), 0);
        }
        form.value.accountOrderIdList = checkedAccountOrderIdList.value
        $table.setCheckboxRow(temp,true);
      }
    }
  }

  let currentFileList = ref([]);

  const initData = async ()=>{
    typeName.value = props.type == '2' ? '收':'付';
    if(props.isSup){
      accountType.value = props.type == '2' ? '2' : 'undefined';
    }else {
      accountType.value = props.type == '2' ? '8':'2'
    }
    if(!props.isUpdate){
      nextTick(() => {
        form.value.paymentUserId = useUserStore().userId;
        form.value.paymentUser = useUserStore().nickname;
      })
    }
    if(props.isUpdate){
      console.log(props.form)
      form.value = props.form;
      recordList.value = props.form.confirmSelectList;
      accountType.value = props.form.writeOffType;
      console.log(recordList.value)
      nextTick(() => {
        setRowCheck();
      });
      console.log(form.value)
    }
    if(props.readOnly||props.form.status=='2'){
      let item:any = paymentColumnList.value.find(v => v.type == 'checkbox');
      item.visible = false;
      let item2:any = paymentColumnList2.value.find(v => v.type == 'checkbox');
      item2.visible = false;

      let item3:any = paymentColumnList.value.find(v => v.field == 'repayWriteOffPrice');
      // item3.fixed = undefined;
      item3.visible = false;
      console.log(item3)
      let item4:any = paymentColumnList.value.find(v => v.field == 'repayRemainPrice');
      // item4.fixed = undefined;
      item4.visible = false;

      let item5:any = paymentColumnList2.value.find(v => v.field == 'payWriteOffPrice');
      // item5.fixed = undefined;
      item5.visible = false;
      let item6:any = paymentColumnList2.value.find(v => v.field == 'payRemainPrice');
      // item6.fixed = undefined;
      item6.visible = false;
    }
    if(props.readOnly){
      if(props.form.status =='4'){
        let item:any = paymentColumnList.value.find(v => v.field == 'orderPayWriteOffPrice');
        item.visible = true;
        let item2:any = paymentColumnList2.value.find(v => v.field == 'orderPayWriteOffPrice');
        item2.visible = true;
      }
    }
    currentFileList.value = props.form.fileList;
  }
  
  const accountBankList = ref();
  const payAccountList = ref();
  const getAccountTableData = async () => {
    const bank = await listDeptBank();
    accountBankList.value = bank.data;
    if(accountBankList.value){
      payAccountList.value= accountBankList.value.filter((ab:any) => ["1","2","3"].includes(ab.type));
    }
  }
  onMounted(() => {
    initData();
    getSupplierList();
    getCustomerList();
    getUser();
    getAccountTableData();
  });
</script>

<style lang="scss" scoped>
.payment-bottom-btn {
  display: flex;
  justify-content:center;
  width: 100%;
  margin-top: 20px;
  &.position {
    position: absolute;
    bottom: var(--el-drawer-padding-primary);
    left: 0;
    z-index: 10;
  }
  &.mask {
    opacity: 0;
  }
}
body.small {
  .payment-bottom-btn {
    &.position {
      bottom: 5px;
    }
  }
}
</style>

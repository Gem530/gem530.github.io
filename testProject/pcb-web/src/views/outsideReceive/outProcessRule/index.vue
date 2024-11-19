<template>
  <div class="p-2  xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs class="xtable-tab" type="border-card" @tab-change="radioTableHandle" v-model="radioTable">
        <el-tab-pane label="加工工序管理" name="加工工序管理">
            <div class="p-2" style="text-align: right;width: 100%">
              <el-button type="primary" size="small"  v-if="checkPermi(['outsideReceive:outProcessRule:add'])" @click="handleAdd">新增</el-button>
              <el-button style="margin-left: 5px;" plain  size="small" @click="handleExport">导出</el-button>
            </div>
          <XTable
            class="xtable-content"
              v-model:page-size="queryParams.pageSize"
              v-model:current-page="queryParams.pageNum"
              toolId="outProcessRoleCraft"
              :intervalCondition="['updateTime','createTime']"
              :page-params="{ perfect: true, total: total }"
              :data="sourceHalfCountAttrList"
              :columnList="columnList"
              ref="XTableRef"
              height="100%"
              border
              @searchChange="searchChange"
              :column-config="{ resizable: true }"
              @checkbox-all="selectChangeEvent"
              @checkbox-change="selectChangeEvent"
              :checkbox-config="{reserve: true }"
              :showRefresh="true"
              :row-config="{ keyField:'id' }"
              v-loading="loading"
            >
              <template #default-isOpen="scope">
                <el-switch @change="changeFlag(scope.row)" v-if="scope.row" v-model="scope.row.isOpen" active-value="1" inactive-value="0" />
              </template>
              <template #default-valueType="scope">
                {{ valueTypeOptions.find(item => item.value == scope.row.valueType)?.label}}
              </template>
              <template #default-parameterConfigStr="scope">
                <div style="text-align:left;">
                  <el-tag v-for="(item,index) in scope.row.parameterConfig" :key="index"
                          style="margin-left:2px;margin-bottom:2px;">
                    {{ item.name }}
                  </el-tag>
                </div>
              </template>

              <template #default-make="scope">
                <el-button link  v-if="checkPermi(['outsideReceive:outProcessRule:update'])" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              </template>
            </XTable>
        </el-tab-pane>
        <el-tab-pane label="外协计价规则" name="外协计价规则" v-if="checkPermi(['outsideReceive:outProcessRule:ruleList'])">
          <div class="p-2" style="text-align: right;width: 100%">
              <el-button type="primary" @click="handleAddCalc" v-if="checkPermi(['outsideReceive:outProcessRule:ruleAdd'])">新增</el-button>
          </div>
          <XTable
            toolId="outProcessCalcRuleHalf"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParamsCalc.pageSize"
            v-model:current-page="queryParamsCalc.pageNum"
            :page-params="{ perfect: true, total: totalCalc }"
            :data="sourceHalfProcessCalcRuleList"
            :columnList="columnListCalc"
            ref="XTableRef"
            border
            :showRefresh="true"
            @searchChange="searchChangeCalc"
            :column-config="{ resizable: true }"
            v-loading="loading"
          >
<!--            <template #default-type="scope"> <sapn>1</sapn> </template>-->
            <template #default-make="scope">
              <el-button link type="primary" @click="handleFile(scope.row)" v-if="checkPermi(['outsideReceive:outProcessRule:ruleFile'])">附件下载</el-button>
              <el-button link type="primary" @click="handleUpdateCalc(scope.row)" v-if="checkPermi(['outsideReceive:outProcessRule:ruleEdit'])" >修改</el-button>
              <el-button link type="primary" @click="handleDeleteCalc(scope.row)" v-if="checkPermi(['outsideReceive:outProcessRule:ruleDelete'])">删除</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="铜价配置" name="铜价配置" v-if="checkPermi(['outsideReceive:outProcessRule:copperList'])">
<!--        <el-tab-pane label="铜价配置" name="铜价配置">-->
          <div class="p-2" style="text-align: right;width: 100%">
              <el-button type="primary" @click="handleAddCopper" v-if="checkPermi(['outsideReceive:outProcessRule:copperAdd'])">铜价录入</el-button>
<!--              <el-button type="primary" @click="handleAddCopper" >新增</el-button>-->
          </div>
          <XTable
            toolId="outProcessCopper"
            height="100%"
            class="xtable-content"
            v-model:page-size="queryParamsCopper.pageSize"
            v-model:current-page="queryParamsCopper.pageNum"
            :page-params="{ perfect: true, total: totalCopper }"
            :data="sourceHalfProcessCopperList"
            :columnList="columnListCopper"
            :intervalCondition="intervalCondition"
            ref="XTableRef"
            border
            :showRefresh="true"
            @searchChange="searchChangeCopper"
            :column-config="{ resizable: true }"
            v-loading="loading"
          >
<!--            <template #default-type="scope"> <sapn>1</sapn> </template>-->
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdateCopper(scope.row)" v-if="checkPermi(['outsideReceive:outProcessRule:copperEdit'])" >修改</el-button>
              <el-button link type="primary" @click="handleDeleteCopper(scope.row)" v-if="checkPermi(['outsideReceive:outProcessRule:copperDelete'])">删除</el-button>
<!--            -->
<!--              <el-button link type="primary" @click="handleUpdateCopper(scope.row)" >修改</el-button>-->
<!--              <el-button link type="primary" @click="handleDeleteCopper(scope.row)" >删除</el-button>-->
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--    新增或修改铜价配置数据  -->
    <el-dialog v-if="waterNumberDialogVisible"
               v-model="waterNumberDialogVisible"
               :title="waterNumberDialogTitle"
               width="30%"
               :before-close="handleClose"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :loading="dialogLoading"
               draggable
    >
      <el-form
        :model="receiveFromData"
        ref="receiveFormRef"
        :rules="receiveFormRule"
        label-width="auto"
      >

        <el-row  style="margin-left: 12px" >

          <el-form-item  label="对账月份" style="width: 100%"  prop="accountMonth" >
            <el-col :span="13">
              <el-date-picker :disabled="isCopperEdit" class="width-100" :clearable="false"  v-model="receiveFromData.accountMonth" type='month' placeholder='请选择月份' valueFormat='YYYY-MM' />
            </el-col>
          </el-form-item>
          <el-form-item  label="当月均价(元)" prop="price"  style="width: 100%">
            <el-col :span="13">
              <!--                <el-input-number v-model="receiveFromData.waterNumber" :precision="2" :min="0" :max="99999999" :step="1" :controls="false" />-->
              <XInputNumber class="number-left" :controls="false" style="width: 100%" v-model="receiveFromData.price" placeholder="请输入均价" precision="2" min="0" max="99999999.99" />
            </el-col>
          </el-form-item>
          <el-form-item  label="备注" style="width: 100%;" >
            <el-col :span="20" style="">
              <el-input type="textarea" v-model="receiveFromData.remark" maxlength="200"/>
            </el-col>
          </el-form-item>
        </el-row>
        <!--      </el-row>-->

      </el-form>
      <template #footer>
        <!--        <span class="dialog-footer">-->
        <div class="text-center">
          <el-button @click="waterNumberDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="waterNumberDialogConfirm">确 定</el-button>
        </div>
        <!--        </span>-->
      </template>
    </el-dialog>

    <!-- 文件上传 -->
    <CommonFileDialog
      v-if="uploadVisible"
      v-model:show="uploadVisible"
      :moduleCode="props.moduleCode"
      :bizType="props.bizType"
      :id="id"
      :findType="2"
    />

    <!-- 添加或修改外协加工计价规则对话框 -->
    <el-drawer :title="dialogCalc.title" v-model="dialogCalc.visible" size="80%">
      <el-collapse v-model="activeNamesCalc" v-loading="dialogLoading">
        <el-form ref="sourceHalfCountAttrFormRef" :model="form" :rules="rules" label-width="120px" :disabled="dialogCalc.title?.includes('详情')" v-loading="dialogLoading">
          <el-collapse-item title="基本信息" name="1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="工序名称" prop="outSourceCraftId">
                  <el-select v-model="form.outSourceCraftId" placeholder="请选择工序" style="width: 100%;" @change="getCraftRule" filterable fit-input-width>
                    <el-option v-for="item in craftList"
                               :key="item.id"
                               :label="item.name"
                               :disabled="item.isOpen == '0'"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="选择客户" prop="customerId">
                  <el-select v-model="form.customerId" style="width: 100%;" :collapse-tags="true" filterable placeholder="请选择客户">
                    <el-option v-for="item in customerList" :key="item.id" :disabled="item.disable" :label="item.customerName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--                <el-col :span="8">-->
              <!--                </el-col>-->
              <el-col :span="8">
                <el-form-item label="规则名称" prop="ruleName">
                  <el-input v-model="form.ruleName" maxLength="50" show-word-limit placeholder="请输入规则名称" />
                </el-form-item>
              </el-col>
              <!--                <el-col :span="8">-->
              <!--              <el-form-item label="特殊变更类型">-->
              <!--                <el-select v-model="form.specialType" style="width: 100%;" :collapse-tags="true" filterable placeholder="请选择特殊变更类型">-->
              <!--                  <el-option v-for="item in specialTypeList" :key="item.key" :label="item.label" :value="item.key" />-->
              <!--                </el-select>-->
              <!--              </el-form-item>-->
              <!--                </el-col>-->
              <!--                <el-col :span="8">-->
              <!--                </el-col>-->

              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" maxLength="1000" show-word-limit :rows="2" type="textarea" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
            <!--            </el-form>-->
          </el-collapse-item>
          <el-collapse-item title="计价公式设置" name="2">
            <!--            <el-form ref="sourceHalfCountAttrFormRef" :model="form" :rules="rules" label-width="120px" :disabled="dialogCalc.title?.includes('详情')" v-loading="dialogLoading">-->
            <el-row>
              <el-col :span="16">
                <el-form-item label="计价公式设置" prop="formula">
                  <el-input ref="calcInputRef" @blur="blurInput" v-model="form.formula" maxLength="2000" :rows="30" type="textarea" placeholder="请输入计价公式" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item v-for="attr in craftAttrList" :label="attr.name">
                  <el-tag v-for="vo in  attr.parameterConfig" type="primary" style="margin-right:10px ;margin-bottom:5px ;" @click="changeCraftAttr(vo.name)"
                  >{{vo.name}}
                  </el-tag>
                </el-form-item>
              </el-col>
            </el-row>


          </el-collapse-item>

        </el-form>
        <el-collapse-item title="凭证信息" name="3">

          <el-col :span="24">
            <div class="global-flex">
              <XUpload multiple v-model:model-value="form.preFileList" model="download" v-if="!dialogCalc.title?.includes('详情')">
                <el-button type="primary">上传附件</el-button>
                <span style="color: #909399;margin-left:10px">支持批量上传，格式不限，每个文件大小在10mb以内</span>
              </XUpload>
            </div>
            <FileTable :data="form.sysFileList" makeWidth="160">
              <template #makeBtn="{row}">
                <el-button link type="primary" @click="delFile(row)">删除</el-button>
              </template>
            </FileTable>

          </el-col>
        </el-collapse-item>
      </el-collapse>




      <template #footer>
        <div style="display: flex; justify-content: center;">
          <!-- <div class="dialog-footer"> -->
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" v-if="dialogCalc.title?.includes('新增')" type="primary" @click="submitFormCalc">确认新增</el-button>
          <el-button :loading="buttonLoading" v-if="dialogCalc.title?.includes('修改')" type="primary" @click="submitFormCalc">确认修改</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 添加或修改半制程外协计价配置对话框 -->
    <el-drawer v-model="drawerBorrow.visible" :title="drawerBorrow.title" size="60%" draggable destroy-on-close modal-class="padding-drawer">
      <el-form ref="sourceHalfCountAttrFormRef" :model="form" :disabled="drawerBorrow.title.includes('详情')" :rules="rules" label-width="100px"  label-position="right">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="基本信息" >
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="工序名称" prop="name">
                  <el-input v-model="form.name" maxlength="50" />
                  <!-- <el-select
                    v-model="form.craftId" placeholder="请选择工序"
                    style="width: 100%;" clearable
                    @change="getCraftAllPermeter" filterable fit-input-width >
                    <el-option v-for="item in craftList" :key="item.id" :label="item.craftName" :value="item.id"></el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="工序编码"  prop="code">
                  <el-input v-model="form.code" maxlength="20" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="参数配置" name="参数配置">
            <div v-for="(item, index) in form.parameterConfig" :key="index" >
              <el-row >
                <el-col :span="2">参数{{index+1}}：</el-col>
                <el-col :span="17"></el-col>
                <el-col :span="5" style="display: flex;justify-content: end;">
                  <el-button type="primary" link size="small" :disabled="form.parameterConfig.length <= 1 || index <= 0" @click="configsUp(index)"><el-icon><Top /></el-icon>上移</el-button>
                  <el-button type="primary" link size="small" :disabled="form.parameterConfig.length <= 1 || index == (form.parameterConfig.length-1)" @click="configsDown(index)"><el-icon><Bottom /></el-icon>下移</el-button>
                  <el-button v-if=" form.parameterConfig.length > 1"  type="danger" link size="small" @click="configsDelete(index)"><el-icon><DeleteFilled /></el-icon>删除</el-button>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="8">
                  <el-form-item size="small" label="参数名称"  :prop="'parameterConfig.' + index + '.name'" :rules="rules.parameterConfigName">
                    <el-input v-model="item.name" maxlength="100" placeholder="参数名称"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item size="small" label="数据类型" :prop="'parameterConfig.' + index + '.type'" :rules="rules.parameterConfigType">
                    <el-select v-model="item.type" placeholder="数据类型" clearable style="width: 440px">
                      <el-option v-for="dict in craft_parameter_type" :key="dict.value" :label="dict.label"
                                 :value="dict.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item size="small" label="参数单位">
                    <el-input v-model="item.unit" maxlength="50"  placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
              <el-col :span="8">
                  <el-form-item size="small" label="参数编码"  :prop="'parameterConfig.' + index + '.code'" :rules="rules.parameterConfigCode" >
                  <el-input
                    v-model="item.code"
                    :rows="1"
                    type="textarea"
                    maxlength="100"
                    placeholder="工艺参数编码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item size="small" label="默认值" prop="defaultValue" >
                  <el-input
                    v-model="item.defaultValue"
                    :rows="1"
                    type="textarea"
                    maxlength="2000"
                    placeholder="默认值"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" style="flex: 1;" label="是否必填"  prop="isTax">
                  <el-switch v-model="item.isRequired" active-value="1" inactive-value="0"/>
                </el-form-item>
              </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-if="item.type === '5'  || item.type === '6' || item.type === '8'" size="large">
                  <el-tag
                    style="margin-left: 5px;margin-top: 5px"
                    v-for="(item2, index2) in  item.options "
                    closable
                    :disable-transitions="false"
                    @close="selectConfigsDelete(index, index2)">
                    {{item2}}
                  </el-tag>
                  <el-input
                    class="input-new-tag ml5"
                    style="width: 150px"
                    v-show="item.inputHidden"
                    v-model="item.inputHiddenValue"
                    ref="saveTagInput"
                    size="small"
                    @blur="e => inputBlur(e, index)">
                  </el-input>
                  <el-button class="button-new-tag   ml5" :inline="true" size="small" @click="selectConfigsAdd(index)">+ 备选项
                  </el-button>
                </el-col>
              </el-row>
              <el-divider />
            </div>
            <!--  添加-->
            <el-col :span="1" >
              <el-button type="primary" size="small" @click="configsAdd">添加参数</el-button>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <template #footer>

        <div class="payment-bottom-btn position" >
            <el-button :loading="buttonLoading" plain @click="cancelDrawerBorrow">取 消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-show="!dialog.title?.includes('详情')">确 定</el-button>
        </div>

      </template>
    </el-drawer>
  </div>
</template>

<script setup name="SourceHalfCountAttr" lang="ts">
import {checkPermi} from "@/utils/permission";
import {
  addOutSourceCountConfig,
  delSourceHalfCountAttr,
  getOutSourceCountCraftConfig,
  listOutSourceCountConfig,
  modifyConfigStatus,
  updateAddOutSourceCountConfig
} from '@/api/outsource/sourceHalfCountAttr';
import {SourceHalfCountAttrVO} from '@/api/outsource/sourceHalfCountAttr/types';
import {VXETable, VxeTableEvents} from 'vxe-table'
import {craftParameterList} from "@/api/basedata/craftParameterConfig";
import {parseTime} from '@/utils/ruoyi';

import {SourceHalfProcessCalcRuleTypeEnum,} from "@/api/outsource/sourceHalfProcessCalcRule/types";
import {
  addSourceHalfProcessCalcRule,
  delSourceHalfProcessCalcRule,
  getRuleByCraftId,
  getSourceHalfProcessCalcRule,
  listSourceHalfProcessCalcRule,
  updateSourceHalfProcessCalcRule
} from "@/api/outsource/outProcessRule";
import {
  addSourceOrderCopper,
  delSourceOrderCopper,
  getSourceOrderCopper,
  listSourceOrderCopper
} from "@/api/outsource/sourceOrderCopper";
import {getListCustomer} from "@/api/basedata/customer";
import {deepClone} from "@/utils";
import {ref} from "vue";
import CommonFileDialog from "@/components/commonFileTab/commonFileDialog.vue";
import {listSourceCountProcessAttr} from "@/api/outsource/sourceCountProcessAttr";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {craft_parameter_type} = toRefs<any>(proxy?.useDict("craft_parameter_type"));

const activeNamesCalc = ref(['1','2','3'])
const sourceHalfProcessCalcRuleList = ref<any[]>([]);
const queryParamsCalc = ref({
  pageNum: 1,
  pageSize: 20,
  ownerId: undefined,
  customerId: undefined,
  craftId: undefined,
  type: undefined,
  formula: undefined,
  params: {
  }
});
const totalCalc = ref(0);
const columnListCalc = ref([

  { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '客户名称', field: 'customerName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户名称' } , width: '160'},
  { title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入客户编码' } , width: '130'},
  { title: '工序名称', field: 'craftName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入工艺名称' }, width: '100' },
  { title: '计价公式', field: 'formula', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入计价公式' }, },
  { title: '规则名称', field: 'ruleName', align: 'center', width: '200' , filterType: 'input', filterParam: { placeholder: '请输规则名称' },},
  { title: '备注', field: 'remark', align: 'center', width: '100' , filterType: 'input', filterParam: { placeholder: '请输备注' },},
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

// 铜价对话框
const waterNumberDialogVisible = ref(false);
const waterNumberDialogTitle = ref('铜价录入');
const handleClose = () => {
  waterNumberDialogVisible.value = false;
}
/**
 * 初始化更新读数表单数据
 */
let receiveFromData = ref({
  accountMonth: undefined,
  price: undefined,
  remark: undefined,
  id: undefined,
})

/**
 * 表单填写规则
 */
const receiveFormRule = ref({
  accountMonth: [
    { required: true, message: '对账月份不能为空', trigger: ["blur","change"] }
  ],
  price: [
    { type: 'number' , required: true, validator: (rule : any, value : any, callback : any) => {
        if (!value || value == 0) {
          callback(new Error('请输入大于0的数字'));
        } else {
          callback();
        }
      }, }
  ]
})


const receiveFormRef = ref();
const calcInputRef = ref();


const waterNumberDialogConfirm = () => {
  console.log(1)

  receiveFormRef.value.validate((valid: any) => {
    if (valid) {
      console.log(2)
      // if(receiveFromData.value.id !== undefined){
      //   updateSourceOrderCopper(receiveFromData.value).then(() => {
      //     handleClose();
      //     getListCopper();
      //   })
      // }else{
      if(isCopperEdit.value == true){
        receiveFromData.value.isConfirm = '1';
      }
        addSourceOrderCopper(receiveFromData.value).then((res :any) => {
          // 如果res.data == false ,则弹窗提示已有数据,是否确认覆盖
          if(res.data == false){
            ElMessageBox.confirm(
              '已有数据，是否确认覆盖？',
              '提示',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning',
              }
            ).then(() => {
              receiveFromData.value.isConfirm = '1';
              addSourceOrderCopper(receiveFromData.value).then(() => {
                handleClose();
                getListCopper();
              })
            }).catch(() => {
              // 取消
            })
          }else{
            handleClose();
            getListCopper();
          }
        })
      // }
    }
  })
}
// 获取 搜索条件
const searchChangeCopper = (params: any) => {
  queryParamsCopper.value = params
  getListCopper()
}

/** 查询外协加工计价规则列表 */
const getListCopper = async () => {
  loading.value = true;
  const res = await listSourceOrderCopper(queryParamsCopper.value);
  sourceHalfProcessCopperList.value = res.rows;
  totalCopper.value = res.total;
  loading.value = false;
}


/** 新增按钮操作 */
const handleAddCopper = () => {
  resetCopper();
  waterNumberDialogVisible.value = true;
  waterNumberDialogTitle.value= "铜价录入";
  dialogLoading.value = false;
}

const isCopperEdit = ref(false);
/** 修改按钮操作 */
const handleUpdateCopper = async (row?: any) => {
  resetCopper();
  isCopperEdit.value = true;
  waterNumberDialogVisible.value = true;
  dialogLoading.value = true;
  dialogCalc.title = "修改计价规则";
  const _id = row?.id || ids.value[0]
  getSourceOrderCopper(_id).then(
    (res : any) => {   Object.assign(receiveFromData.value, res.data); dialogLoading.value = false; }
  ).finally(() => {dialogLoading.value = false; });
}

/** 删除按钮操作 */
const handleDeleteCopper = async (row?: any) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceOrderCopper(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getListCopper();
}



/** 表单重置 */
const resetCopper = () => {
  receiveFromData.value = {...initFormData};
  receiveFormRef.value?.resetFields();
  isCopperEdit.value = false;
}




// 铜价
const sourceHalfProcessCopperList = ref<any[]>([]);
const queryParamsCopper = ref({
  pageNum: 1,
  pageSize: 20,
  ownerId: undefined,
  customerId: undefined,
  craftId: undefined,
  type: undefined,
  formula: undefined,
  params: {
  }
});
const totalCopper = ref(0);
/**
 * 声名需要处理的时间条件字段
 */
const intervalCondition = [
  'accountMonth',
  'price',
];
const columnListCopper = ref([

  { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
  { title: '对账月份', width: '160', field: 'accountMonth', align: 'center', filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'month', valueFormat: 'YYYY-MM'},
      endParams: {placeholder: '请输入结束时间', type: 'month', valueFormat: 'YYYY-MM'},
    }
  },
  { title: '当月均价(元)', field: 'price', align: 'center' , filterType: "intervalNumber" , width: '130'},
  { title: '备注', field: 'remark', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输备注' },},
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);
const id = ref();
const props = ref({
  dataList: [],
  columnList: [],
  intervalCondition: [],
  toolId1: '',
  toolId2: '',
  toolId3: '',
  loading: false,
  total: 0,
  moduleCode: '',
  bizType: ''
})
const bizCode = ref();
const uploadVisible = ref(false);
/**
 * 上传文件
 */
const handleFile = async (row : any) => {
  id.value = row.id;
  // SysFileModuleCode-->WX_ORDER("18", "外协接单管理"),
  props.value.moduleCode = '18';
  // SysFileBizType--> OUTSOURCE_ORDER("43", "外协接单管理附件"),
  props.value.bizType = '43';
  uploadVisible.value=true;
}
// 获取 搜索条件
const searchChangeCalc = (params: any) => {
  queryParamsCalc.value = params
  getListCalc()
}

/** 查询外协加工计价规则列表 */
const getListCalc = async () => {
  loading.value = true;
  const res = await listSourceHalfProcessCalcRule(queryParamsCalc.value);
  sourceHalfProcessCalcRuleList.value = res.rows;
  totalCalc.value = res.total;
  loading.value = false;
}


/** 新增按钮操作 */
const handleAddCalc = async () => {
  reset();
  dialogCalc.visible = true;
  craftAttrList.value = [{
    name: '公用',
    parameterConfig: commonCalcList.value
  }]
  await getAttrList();
  await getCraftListNoPage();
  await getCustomerList();
  dialogCalc.title = "新增计价规则";
  dialogLoading.value = false;
}
//工序参数列表
const craftAttrList: any = ref([{
  name: '工序参数',
  list: [
    { name: '工序名称' },
    { name: '计价系数' },
    { name: '计价公式' },
  ]
}]);
//工序参数列表---所有
const allCraftAttrList: any = ref([{
  name: '工序参数',
  list: [
    { name: '工序名称' },
    { name: '计价系数' },
    { name: '计价公式' },
  ]
}]);


const dialogCalc = reactive<DialogOption>({
  visible: false,
  title: ''
});
//客户列表
const customerList: any = ref([]);
const specialTypeList: any = ref([
  { key: '1', label: '月底变更' },
  { key: '2', label: '数量区间变价' }
]);
const customerCopyList: any = ref([]);
const allCustomerList: any = ref([]);
const commonCalcList: any = ref([]);
/**
 * 查询所有参数
 * @param data
 */
const getAttrList = async () => {
  listSourceCountProcessAttr().then((res) =>{
    commonCalcList.value = res.rows;
  })
  listOutSourceCountConfig({isOpen : '1'}).then((res) => {
    allCraftAttrList.value = res.rows;
    craftChange();
  });
};

const craftChange = () => {
  craftAttrList.value = allCraftAttrList.value.filter((item: any) => item.id === form.value.outSourceCraftId);
  craftAttrList.value.push({
    name: '公用',
    parameterConfig: commonCalcList.value
  })
  // 倒序
  craftAttrList.value.reverse();
}
const getCustomerList = async () => {
  const res = await getListCustomer();
  allCustomerList.value = res.data;
  const res1 = await getListCustomer({customerOutTypeStr: "2"});
  customerList.value = res1.data;
  customerCopyList.value = deepClone(customerList.value);
}


/** 修改按钮操作 */
const handleUpdateCalc = async (row?: any) => {
  reset();
  dialogCalc.visible = true;
  dialogLoading.value = true;
  await getCraftListNoPage();
  await getCustomerList();
  dialogCalc.title = "修改计价规则";
  const _id = row?.id || ids.value[0]
  craftList.value = deepClone(craftCopyList.value);
  const res = await getSourceHalfProcessCalcRule(_id).finally(() => {getAttrList(); dialogLoading.value = false; });

  // 判断craftList中是否包含row.outSourceCraftId,并用变量接收
  const isExist = craftList.value.some((item: any) => item.id === row.outSourceCraftId);
  // 如果不存,在allCraftList中找到这条数据
  if (!isExist) {
    const item = allCraftList.value.find((item: any) => item.id === row.outSourceCraftId);
    craftList.value.push(item);
  }

  customerList.value = deepClone(customerCopyList.value);
  // 判断customerList中是否包含row.customerId,并用变量接收
  const isCusExist = customerList.value.some((item: any) => item.id === row.customerId);
  // 如果不存,在allCustomerList中找到这条数据
  if (!isCusExist) {
    const item = allCustomerList.value.find((item: any) => item.id === row.customerId);
    item.disable = true;
    customerList.value.push(item);
  }
  Object.assign(form.value, res.data);
}

/** 删除按钮操作 */
const handleDeleteCalc = async (row?: any) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delSourceHalfProcessCalcRule(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getListCalc();
}


/** 提交按钮 */
const submitFormCalc = () => {
  sourceHalfCountAttrFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.type = SourceHalfProcessCalcRuleTypeEnum.GONG_YI;
      buttonLoading.value = true;
      let params = deepClone(form.value)
      if (params?.preFileList?.length) {
        params.sysFileList = [...params.sysFileList, ...params.preFileList]
        delete params.preFileList
      }

      if (form.value.id) {
        await updateSourceHalfProcessCalcRule(params).finally(() =>  buttonLoading.value = false);
      } else {
        await addSourceHalfProcessCalcRule(params).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialogCalc.visible = false;
      await getListCalc();
    }
  });
}


/**
 *根据工序查询计价公式
 */
const getCraftRule = async () => {
  craftChange();
  console.log(form.value.craftId);
  console.log(form.value.formula);

  if(!form.value.craftId || form.value.formula) {
    return;
  }
  const res =  await getRuleByCraftId(form.value.craftId);
  if(!form.value.formula){
    form.value.formula = res.data.formula;
  }
};
const cursorPosition = ref(0);
// 失焦时记录位置
const blurInput = (e : any) => {
  cursorPosition.value = e.srcElement.selectionStart;
};

// 点击参数时
const changeCraftAttr = async (name: any) => {
  if (name && calcInputRef.value) {
    const inputElement = calcInputRef.value;

    form.value.formula = form.value.formula || '';
    const formula = form.value.formula;

    // 更新
    form.value.formula = formula.slice(0, cursorPosition.value) + `[${name}]` + formula.slice(cursorPosition.value);

    // 更新光标位置
    const newCursorPosition = cursorPosition.value + name.length + 2; // 计算新的光标位置
    console.log(calcInputRef.value.$el.querySelector('textarea'), newCursorPosition)
    // 确保在 DOM 更新后设置光标位置
    await nextTick(() => {
      const textarea = calcInputRef.value.$el.querySelector('textarea');
      if (textarea) {
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        // 使输入框聚焦
        inputElement.focus();
      }
    });

  }
};
// 删除文件
const delFile = (row: any) => {
  // console.log(row)
  form.value.sysFileList = form.value.sysFileList.filter((f: any) => f.key != row.key)
}

const sourceHalfCountAttrList = ref<SourceHalfCountAttrVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const dialogLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const sourceHalfCountAttrFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: any = {
  id: undefined,
  craftId: undefined,
  ownerId: undefined,
  paramId: undefined,
  customerId: undefined,
  ruleName: undefined,
  specialType: undefined,
  type: undefined,
  status: '1',
  name: undefined,
  sysFileList: [],
  preFileList: [],
}
const data = reactive({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    craftId: undefined,
    ownerId: undefined,
    paramId: undefined,
    type: undefined,
    status: undefined,
    name: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "change" }
    ],
    'parameterConfig.name' : [
      { required: true, message: "参数名称不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "工艺名称不能为空", trigger: "change" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "change" }
    ],
    paramId: [
      { required: true, message: "工艺配置ID不能为空", trigger: "change" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    parameterConfigType: [
      { required: true, message: "数据类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "change" }
    ],
    parameterConfigCode: [
      { required: true, message: "参数编码不能为空", trigger: "change" }
    ],
    parameterConfigName: [
      { required: true, message: "参数名称不能为空", trigger: "change" }
    ],
    outSourceCraftId: [
      { required: true, message: "请选择工艺", trigger: "change" }
    ],
    customerId: [
      { required: true, message: "请选择客户", trigger: "change" }
    ],
    formula: [
      { required: true, message: "计价公式不能为空", trigger: "change" }
    ],
    ruleName: [
      { required: true, message: "规则名称不能为空", trigger: "change" }
    ],
  }
});

const XTableRef = ref()

const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { title: '工艺名称',  width: '100',field: 'name',align: 'center', filterType: 'input' },
    { title: '工序编码', width: '100',field: 'code',align: 'center', filterType: 'input' },
    { title: '工序参数',  field: 'parameterConfigStr', align: 'center', filterType:'input' },
    { title: '状态', width: '100',field: 'isOpen', align: 'center', filterType:'radioButton',  filterData:()=>statusOptions.value },
    { title: '创建人', width: '100',field: 'createByName',align: 'center', filterType: 'input' },
    { title: '创建时间', width: '150',field: 'createTime',align: 'center',filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
    { title: '上次修改人', width: '100',field: 'updateByName', align: 'center', filterType: 'input' },
    { title: '上次修改时间',width: '150',field: 'updateTime', align: 'center' ,filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
    { title: '操作', field: 'make', align: 'center', width: '100', fixed: 'right', },
]);

const checkedSourceHalfCountAttrList = ref<SourceHalfCountAttrVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const statusOptions = ref([
  {value: "1", label: "启用"},
  {value: "0", label: "停用"}
])
// 1工艺参数 2字段 3公共 4pp
const typeOptions = ref([
  {value: "1", label: "工艺参数"},
  {value: "2", label: "工艺数据字段"},
  {value: "3", label: "公共参数"},
  {value: "4", label: "pp参数"},

])
const valueTypeOptions = ref([
  {value: "1", label: "数字"},
  {value: "2", label: "文本"}
])


const selectChangeEvent: VxeTableEvents.CheckboxAll<SourceHalfCountAttrVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedSourceHalfCountAttrList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询半制程外协计价配置列表 */
const getList = async () => {
  loading.value = true;

  if (queryParams.sorts && queryParams.sorts.length > 0) {
    queryParams.sorts.forEach((item: any) => {
      queryParams.value.orderByColumn = item.prop;
      queryParams.value.isAsc = item.order;
    })
  }

  const res = await listOutSourceCountConfig(queryParams.value).finally(()=>loading.value = false);
  sourceHalfCountAttrList.value = res.rows;
  total.value = res.total;
  //loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  dialogCalc.visible = false;
  sourceHalfCountAttrFormRef.value?.resetFields();
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  sourceHalfCountAttrFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SourceHalfCountAttrVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();

  drawerBorrow.visible = true;
  drawerBorrow.title = "新增加工工序";

  // dialog.visible = true;
  // dialog.title = "添加半制程外协计价配置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SourceHalfCountAttrVO) => {
  drawerBorrow.visible = true;
  drawerBorrow.title = "修改加工工序";
  reset();
  if(row.id){
    const res =await getOutSourceCountCraftConfig(row.id);
    Object.assign(form.value, res.data);
  }

}

/** 提交按钮 */
const submitForm = () => {
  console.log("====form.value===",form.value);
  sourceHalfCountAttrFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAddOutSourceCountConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addOutSourceCountConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      drawerBorrow.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SourceHalfCountAttrVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项？').finally(() => loading.value = false);
  await delSourceHalfCountAttr(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}


  const craftParameterConfigList = ref<any[]>([]);

  let queryFormRef2: any = reactive({craftId: ""});

  /** 查询当前工艺所有配置参数 */
  async function getCraftAllPermeter(craftId: any) {

    queryFormRef2.craftId = craftId;
    const res = await craftParameterList(queryFormRef2);

    craftParameterConfigList.value = res.data;
    craftParameterConfigList.value.forEach((item: any) => {
      item.id = item.id.toString();
    });

    const craft=craftList.value.filter(item => item.id==craftId);
    form.value.name = craft[0].craftName;
    console.log("=========craft.value",craft);
    console.log("=========form.value",form.value);
  }

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('outsource/sourceOrderCraft/export', {
        ...queryParams.value, tableName: 'outProcessRoleCraft'
      }, `外协接单加工工序_${parseTime(new Date())}.xlsx`);

}
  const craftList = ref<any[]>([]);
  const craftCopyList = ref<any[]>([]);
  const allCraftList = ref<any[]>([]);
  /** 查询工艺列表 */
  const getCraftListNoPage = async () => {
    const res = await listOutSourceCountConfig();
    allCraftList.value = res.rows;
    craftList.value = res.rows.filter((item: any) => item.isOpen == '1');
    craftCopyList.value = deepClone(craftList.value);
  };

//头部按钮组
const radioTable = ref('加工工序管理');
const activeNames = ref(['基本信息','参数配置']);
// 切换菜单栏 ***********
const radioTableHandle = async () => {
  if (radioTable.value == "加工工序管理") {
    await getList();
  } else if (radioTable.value == "外协计价规则")  {
    await getListCalc();
    listSourceCountProcessAttr().then((res) =>{
      commonCalcList.value = res.rows;
    })
  }else{
    await getListCopper();
  }
}


const drawerBorrow = reactive<DialogOption>({
  visible: false,
  title: '新增加工工序'
});
const validatePass = (rule: any, value: any, callback: any, index: any,param:string, lable: any ) => {
    const val = form.value.parameterConfig[index][param]
    if (form.value.parameterConfig[index].name) {
      // craftFormRef.value
      if (val == '' || val == undefined || val == null) {
        callback(new Error(lable+ '不能为空'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

const configsAdd = () => {
    if(!form.value.parameterConfig || form.value.parameterConfig.length==0){
      form.value.parameterConfig=[]
    }
    const obj = {
      name: "",
      type: "",
      unit: "",
      isBold: "",
    };
    form.value.parameterConfig.push(obj);
  };
  const configsDelete = (index: number) => {
    form.value.parameterConfig.splice(index, 1);
  };

  const configsUp = (index: number) => {
    if (index <= 0 ) {
        // 无法移动，因为已经在顶部
        return;
    }
    // 保存要移动的元素
    const element = form.value.parameterConfig[index];
    // 删除该元素
    form.value.parameterConfig.splice(index, 1);

    // 在当前位置前面插入该元素
    form.value.parameterConfig.splice(index - 1, 0, element);

  };

  const configsDown = (index: number) => {
    if (index >= form.value.parameterConfig.length - 1) {
        return;
    }
    // 保存要移动的元素
    const element = form.value.parameterConfig[index];
    // 删除该元素
    form.value.parameterConfig.splice(index, 1);
    // 在当前位置后面插入该元素
    form.value.parameterConfig.splice(index + 1, 0, element);
  };
  const selectConfigsAdd = (index) => {
    form.value.parameterConfig[index].inputHidden = true;
    form.value.parameterConfig[index].inputHiddenValue = null;
  };

  const selectConfigsDelete = (index, index2: number) => {
    console.log(form.value.parameterConfig);
    form.value.parameterConfig[index].options.splice(index2, 1);
  };

  const inputBlur = (val, index) => {
    console.log('inputBlur', val.target.value, index);
    form.value.parameterConfig[index].inputHidden = false;
    console.log(form.value.parameterConfig[index]);
    if (form.value.parameterConfig[index].options == null) {
      form.value.parameterConfig[index].options = [];
      console.log(form.value.parameterConfig[index].options);
      form.value.parameterConfig[index].options.push(val.target.value);
    } else {
      console.log(val.target.value);
      if (val.target.value == undefined || val.target.value == null || val.target.value == '') {
        return;
      }
      form.value.parameterConfig[index].options.push(val.target.value);
    }
  };

  const changeFlag = async (row:any) =>{
    await modifyConfigStatus({id:row.id,isOpen:row.isOpen}).then(res => {
      getList();
    }).finally(ress=> loading.value = false)
  }

  /** 取消按钮 */
  const cancelDrawerBorrow = () => {
    reset();
    sourceHalfCountAttrFormRef.value?.resetFields();
    drawerBorrow.visible = false;
  }

onMounted(() => {
  getList();
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

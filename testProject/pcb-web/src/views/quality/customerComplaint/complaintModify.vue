<template>

    <div v-loading="viewTableLoading">
      <div style="width: 100%;margin-bottom: 20px;text-align:left;padding-left: 33px;">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="客诉率 = 客诉单总数 / 客户订单总数"
          placement="right"
        >
        <el-badge v-show="complaintRate" :value="complaintCount+' / '+orderCount"  class="item" type="primary">

        <el-button v-show="complaintRate" type="primary" size="large"  icon="Box" :disabled="true"  >客诉率:{{ complaintRate }}</el-button>
        </el-badge>
        </el-tooltip>
      </div>
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      :rules="formRule"
      :disabled="viewStatus"
    >
      <el-row >
        <el-col :span="12">
          <el-form-item label="客户代码" prop="customerCode" >
            <el-input v-model="formData.customerCode" @click="openVisibleFun" placeholder="请选择客户订单产品信息" :disabled="replyStatus"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="销售合同号" >
            <el-input v-model="formData.saleOrderCode" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品编码">
            <el-input v-model="formData.commodityCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称" >
            <el-input v-model="formData.commodityName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="客诉原因" prop="complaintReason">
            <el-input :disabled="replyStatus" type="textarea"  :autosize="{ minRows: 4, maxRows: 25 }"  size="large" maxlength="2000"  v-model="formData.complaintReason"  placeholder="请输入客诉原因"></el-input>
          </el-form-item>
        </el-col>


        <el-col :span="24">
          <el-divider content-position="left" >客诉文件</el-divider>
          <div style="text-align:left;padding-left: 33px" >
            <XUpload v-model:model-value="ksFileList" model="download" :readOnly="replyStatus||viewStatus"  ></XUpload>
          </div>
        </el-col>


        <el-divider></el-divider>


        <el-col :span="24" v-show="replyStatus&&!viewStatus||formData.handleMessage" props="handleMessage">
          <el-form-item label="品质回复" prop="handleMessage" >
            <el-input type="textarea" ref="re"  :autosize="{ minRows: 4, maxRows: 25 }"  size="large" maxlength="2000"  v-model="formData.handleMessage"  placeholder="请输入品质回复消息"></el-input>
          </el-form-item>
        </el-col>


      </el-row >


    </el-form>

    </div>

    <Teleport to=".customer-complaint">
      <el-dialog v-model="visible" title="选择单据产品" width="80%" draggable destroy-on-close @close="clearInventoryForm">
        <el-row>
          <el-col :span="24">
            <XTable
                    max-height="550px"
                    height="550px"
                    class="xtable-content"
                    v-model:page-size="tabQueryParams.pageSize"
                    v-model:current-page="tabQueryParams.pageNum"
                    :page-params="{ perfect: true, total: tabTotal }"
                    :data="orderList"
                    :intervalCondition="intervalCondition"
                    :radio-config="radioConfig"
                    :row-config="{ keyField: 'id' }"
                    :columnList="orderColumnList"
                    ref="tabXTableRef" border
                    :showRefresh="true"
                    @radio-all="orderSelect"
                    @radio-change="orderSelect"
                    @searchChange="tabSearchChange"
                    :loading="repliedTableLoading"
            >
              <template #default-orderType="{row}">
                <el-tag :type="row.orderType==='1'?'':
                       row.orderType==='2'?'success':row.orderType==='3'?'warning':'info'">{{ resDictData?.order_type.find(v => v.dictValue === row.orderType)?.dictLabel }}</el-tag>
              </template>
              <template #default-model="{ row }">
                <el-tag :type="row.model==='1'?'':'success'">{{ resDictData?.order_model.find(v => v.dictValue === row.model)?.dictLabel }}</el-tag>
              </template>
            </XTable>
          </el-col>
        </el-row>
        <template #footer>
          <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button @click="clearInventoryForm">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitInventoryForm">确 定</el-button>
          </span>
          </div>
        </template>
      </el-dialog>

    </Teleport>


    <div class="text-center" style="margin-top: 10px">
      <el-button v-if="!viewStatus" @click="cancel" :loading="submitLoading">取 消</el-button>
      <el-button v-if="!viewStatus" type="primary" @click="submitForm" :loading="submitLoading">保 存</el-button>
      <el-button v-if="!replyStatus&&!viewStatus" type="primary" @click="updateAndSubmitForm" :loading="submitLoading">保存并提交</el-button>
    </div>

</template>

<script setup name="complaintModify">

import {addCustomerComplaint, getCustomerComplaint, updateCustomerComplaint} from "@/api/quality/customerComplaint";
import {listOrderByComplaint} from "@/api/order/directOrder";
import {ref} from "vue";
import {getDicts} from "@/api/system/dict/data";
import {sortBy} from "@/utils/dict";


let resDictData = ref({
  //订单类型
  order_type: [],
  //批量/样品
  order_model: []
})


/**
 * 声名需要处理的条件字段
 */
const intervalCondition = ['placeOrderTime'];
const ksFileList = ref([]);
const repliedTableLoading = ref(false);
const viewTableLoading = ref(false);
const buttonLoading = ref(false);
const orderList = ref([]);
const tabTotal = ref(0);
const visible = ref(false);
const orderColumnList = ref([
  {type: 'radio', align: 'center', width: '60'},
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input'},
  {title: '产品编码', field: 'commodityCode', align: 'center', filterType: 'input'},
  {title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input'},
  {
    title: '下单日期',
    field: 'placeOrderTime',
    align: 'center',filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },{
    width: '90',
    title: '新/返',
    field: 'orderType',
    align: 'center',
    filterType: 'radioButton',
    filterParam: {placeholder: '请选择单据类型'},
    filterData: () => [...resDictData.value.order_type],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: '90',
    title: '批量/样品',
    field: 'model',
    align: 'center',
    filterType: 'radioButton',
    filterParam: {placeholder: '请选择批量/样品'},
    filterData: () => [...resDictData.value.order_model],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {
    width: '90',
    title: '客户PO',
    filterType: 'input',
    field: 'customerPo',
    align: 'center',
  },
  {title: '销售合同', field: 'code', align: 'center', filterType: 'input'},
]);

/**
 * 获取字典数据
 */
const getDictOptions = async () => {
  const rules = [['dictSort', 'asc']];
  const string = "order_type,order_model";
  getDicts(string)
    .then(res => {
      const dictData = res.data;
      string.split(",").forEach(item => {
        Object.keys(resDictData.value).forEach(dictItem => {
          if (item === dictItem) {
            resDictData.value[dictItem] = sortBy(dictData.filter(info => {
              return item === info.dictType
            }), rules);
          }
        })
      })
    });

};



/**
 * 产品查询参数
 */
const { tabQueryParams } = toRefs(reactive({
  tabQueryParams: {
    pageNum: 1,
    pageSize: 20,

  }
}));
/**
 * 查询订单列表
 * @returns {Promise<void>}
 */
const getOrderList =  () => {
  repliedTableLoading.value = true;

  listOrderByComplaint(tabQueryParams.value)
    .then((res) => {
      orderList.value = res.rows;
      tabTotal.value = res.total;
    })
    .finally(() => {
      repliedTableLoading.value = false;
    })

  visible.value = true;

}

/**
 * 获取订单查询条件
 */
const tabSearchChange = (params) => {
  tabQueryParams.value = params
  getOrderList()
}
const radioValue = ref()
/**
 * 选择产品
 */
const orderSelect = (val) => {
  radioValue.value = val.row
}
/** 已选产品取消按钮操作 */
const clearInventoryForm = () => {
  visible.value = false;
  orderList.value = [];
  tabQueryParams.value = {
    pageNum: 1,
    pageSize: 20,
  }
}
/** 已选产品确认按钮操作 */
const submitInventoryForm = () => {
  visible.value = false;
  formData.value.commodityName = radioValue.value.commodityName;
  formData.value.commodityCode = radioValue.value.commodityCode;
  formData.value.commodityId = radioValue.value.commodityId;
  formData.value.cusId = radioValue.value.cusId;
  formData.value.customerCode = radioValue.value.customerCode;
  formData.value.saleOrderCode = radioValue.value.code;
  radioConfig.value.checkRowKey = radioValue.value.id;
  formData.value.saleOrderId = radioValue.value.id;
  orderList.value =[];
  tabQueryParams.value = {
    pageNum: 1,
    pageSize: 20,
  }
}


/**
 * 当前页面表单参数
 * @type {*}
 */
const formData = ref({
  orderStatus:undefined,
  commodityName:'',
  commodityCode:'',
  commodityId:0,
  cusId: 0,
  customerCode: '',
  saleOrderCode: '',
  complaintReason: '',
  handleMessage: '',
  saleOrderId: 0,
  ksFileList:[]
})

/**
 * 产品回显默认单选
 */
const radioConfig = ref({
  checkRowKey: formData.value.commodityId
})


/**
 * 展示产品表则查询产品信息
 */
const openVisibleFun=()=>{
  console.log(visible)
  getOrderList();
  getDictOptions();
}


/**
 * 表单填写规则
 */
const  formRule = ref({
  customerCode: [
    { required: true, message: '客户代码不能为空', trigger: 'change' }
  ],
  complaintReason: [
    { required: true, message: '客诉原因不能为空', trigger: 'change' }
  ],
  handleMessage: [
    { required: props.replyStatus, message: '品质回复不能为空', trigger: 'change' }
  ],
})

/**
 * 父组件触发事件
 */
const emit = defineEmits(['close', 'submit']);
/**
 * 父组件传递的值,用于判断新增/编辑/详情
 */
const props = defineProps({
  id:Number,
  orderCount:Number,
  complaintCount:Number,
  viewStatus:Boolean,
  replyStatus:Boolean,
  complaintRate:String
})


const submitLoading = ref(false);
const formRef = ref();


const updateAndSubmitForm =()=>{
  formData.value.orderStatus='1';
  submitForm();
}

/**
 * 新增页面保存提交
 * @param formEl
 */
const submitForm = async () => {

  if (props.viewStatus){
    cancel();
    return;
  }


  formRef.value.validate( (valid, fields) => {

    if (valid) {
      if (formData.value.customerCode == null) {
        ElMessage({
          type: 'error',
          message: '请点击客户代码选择需要客诉的订单产品',
        });
        return;
      } else {
        //赋值文件列表值
        console.log(ksFileList.value);
        formData.value.ksFileList=ksFileList.value;

        if (!props.id) {
          submitLoading.value = true;
          addCustomerComplaint({
            data: formData.value
          }).then(() => {
            emit('submit');
            ElMessage({
              type: 'success',
              message: "新增成功",
            });
          }).finally(() => {
            submitLoading.value = false;
          })
        } else {

          submitLoading.value = true;

          if (props.replyStatus){
            formData.value.orderStatus='2';
          }

          updateCustomerComplaint({
            data: formData.value
          }).then(() => {
            emit('submit');
            ElMessage({
              type: 'success',
              message: "操作成功",
            });
          }).finally(() => {
            submitLoading.value = false;
          })

        }
      }

    } else {
      console.log('error submit!', fields)
    }
  })

}

const re =ref();
/**
 * 编辑时的查询回显处理
 */
const editQueryDetails =()=>{
  if (!props.id){
    return;
  }


  getCustomerComplaint({
    id: props.id
  })
    .then((res) =>{
      formData.value =res.data;
      ksFileList.value =res.data.ksFileList
    })
    .finally(() => {
    viewTableLoading.value = false;
    nextTick(()=>{
      re.value.focus();
    })

  })
}


/**
 * 关闭新增页面
 */
const cancel = () => {
  emit('close');
  props.id =undefined;
}


/**
 * 渲染前页面后刷新页面数据
 */
onMounted(() => {
  if (!props.id){
    return;
  }
  viewTableLoading.value = true;
  editQueryDetails();
});

</script>


<style scoped>

/deep/ .el-input__wrapper {
  width: 100%;
}

</style>

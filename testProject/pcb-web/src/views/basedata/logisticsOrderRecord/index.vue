<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs class="xtable-tab" @tab-click="orderTableHandle" v-model="orderTable">
        <el-tab-pane v-for="item in logisticsCompanyList" :label="item.fullName" :name="item.code">
          <XTable v-model:page-size="queryParams.pageSize"
                  :showRefresh="true"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="logisticsOrderRecordList"
                  height="100%" class="xtable-content"
                  :columnList="columnList"
                  :ref="XTableRef"
                  border
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  :row-config="{ keyField:'id' }"
          >
            <template #default-expressType="scope">
              {{logisticsCompanyList.find(v=>v.code == scope.row.expressType)?.fullName}}
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="cancelOrder(scope.row)">取消订单</el-button>
              <el-button link type="primary" @click="handleLogistics(scope.row)">物流轨迹</el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>

    <!-- </el-card> -->
    <!-- 添加或修改物流下单记录对话框 -->
    <el-drawer title="物流轨迹" v-model="dialog.visible" size="50%">
      <el-row class="demo-avatar demo-basic" style="width:100%">
        <el-col :span="2" style="display: flex;justify-content: center;">
          <div class="demo-basic--circle" style="display: flex; align-items: center;">
            <div class="block">
              <el-icon style="font-size: 55px; background-color: #cce8ff; border-radius: 40px; padding: 10px;"><UserFilled /></el-icon>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-top:10px;">
            <el-col :span="1"></el-col>
            <el-col :span="8">
              <span style="font-size: 15px;"> {{ logisticsInfo.logisticsCompany }}</span>
            </el-col>
            <el-col :span="14" style="align-items: center;display: flex;">
              <el-icon style="font-size: 20px;color:var(--el-color-primary);"><PhoneFilled /></el-icon>
              <span style="font-size: 20px;white-space: nowrap;">{{ logisticsInfo.phone }}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="1"></el-col>
            <el-col :span="23">
              <span style="font-size: 18px;white-space: nowrap;">{{logisticsInfo.logisticNum}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="14" style="max-height: 100px;overflow-y: auto;">
          <ImagePreview v-for="(activity, index) in logisticsInfo.fileList"
                        style="margin-left:10px"
                        :width="75"
                        :height="75"
                        :src="activity.url"
                        :type="activity.type"
                        :preview-src-list="[activity.url]"
          />
        </el-col>
      </el-row>

      <el-timeline style="max-width: 600px;padding-left: 18px;margin-top:8px">
        <el-timeline-item
          v-for="(activity, index) in logisticsInfo.logisticItemList"
          :key="index"
          :icon="activity.icon"
          :type="index==0?'primary':activity.type"
          :color="activity.color"
          :size="activity.size"
          :hollow="activity.hollow"
          :timestamp="activity.content"
        >
          {{ activity.time }}
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script setup name="LogisticsOrderRecord" lang="ts">
  import {
    listLogisticsOrderRecord,
    getLogisticsOrderRecord,
    delLogisticsOrderRecord,
    addLogisticsOrderRecord,
    updateLogisticsOrderRecord,
    deleteOrder,
    getLogistics
  } from '@/api/basedata/logisticsOrderRecord';
import { LogisticsOrderRecordVO, LogisticsOrderRecordQuery, LogisticsOrderRecordForm } from '@/api/basedata/logisticsOrderRecord/types';
import { VxeTableEvents } from 'vxe-table'
import {listLogisticsCompany} from "@/api/basedata/logisticsCompany";
import {ref} from "vue";
  import {ElMessageBox} from "element-plus";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const logisticsOrderRecordList = ref<LogisticsOrderRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const logisticsCompanyList = ref();
const logisticsInfo = ref();

const orderTable = ref('SFEXPRESS');

const queryFormRef = ref<ElFormInstance>();
const logisticsOrderRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<any>({
  visible: false,
  title: ''
});

const initFormData: LogisticsOrderRecordForm = {
  id: undefined,
  ownerId: undefined,
  waybillNo: undefined,
  orderId: undefined,
  payMethod: undefined,
  senderName: undefined,
  senderPhone: undefined,
  senderAddress: undefined,
  receiverName: undefined,
  receiverPhone: undefined,
  receiverAddress: undefined,
  expressType: undefined,
  deliveryCode: undefined
}
const data = reactive<PageData<LogisticsOrderRecordForm, any>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companyCode:"SFEXPRESS",
    ownerId: undefined,
    waybillNo: undefined,
    orderId: undefined,
    payMethod: undefined,
    senderName: undefined,
    senderPhone: undefined,
    senderAddress: undefined,
    receiverName: undefined,
    receiverPhone: undefined,
    receiverAddress: undefined,
    expressType: undefined,
    deliveryCode: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    waybillNo: [
      { required: true, message: "快递单号不能为空", trigger: "blur" }
    ],
    orderId: [
      { required: true, message: "订单ID不能为空", trigger: "blur" }
    ],
    payMethod: [
      { required: true, message: "支付方式不能为空", trigger: "blur" }
    ],
    senderName: [
      { required: true, message: "寄件人姓名不能为空", trigger: "blur" }
    ],
    senderPhone: [
      { required: true, message: "寄件人电话不能为空", trigger: "blur" }
    ],
    senderAddress: [
      { required: true, message: "寄件人地址不能为空", trigger: "blur" }
    ],
    receiverName: [
      { required: true, message: "收件人姓名不能为空", trigger: "blur" }
    ],
    receiverPhone: [
      { required: true, message: "收件人电话不能为空", trigger: "blur" }
    ],
    receiverAddress: [
      { required: true, message: "收件人地址不能为空", trigger: "blur" }
    ],
    expressType: [
      { required: true, message: "物流类型不能为空", trigger: "change" }
    ],
    deliveryCode: [
      { required: true, message: "发货单号不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([
    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { title: '快递单号', field: 'waybillNo', width:'150',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入快递单号' } },
    { title: '订单ID', field: 'orderId', width:'250',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入订单ID' } },
    // { title: '支付方式', field: 'payMethod', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入支付方式' } },
    { title: '寄件人姓名', field: 'senderName', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入寄件人姓名' } },
    { title: '寄件人电话', field: 'senderPhone', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入寄件人电话' } },
    { title: '寄件人地址', field: 'senderAddress', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入寄件人地址' } },
    { title: '收件人姓名', field: 'receiverName', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收件人姓名' } },
    { title: '收件人电话', field: 'receiverPhone', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收件人电话' } },
    { title: '收件人地址', field: 'receiverAddress', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入收件人地址' } },
    { title: '物流类型', field: 'expressType', width:'100',align: 'center'},
    { title: '发货单号', field: 'deliveryCode', align: 'center'},
    { title: '创建时间', field: 'createTime', align: 'center'},
    { title: '操作', field: 'make', align: 'center', width: '200', fixed: 'right', },
]);

const checkedLogisticsOrderRecordList = ref<LogisticsOrderRecordVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<LogisticsOrderRecordVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedLogisticsOrderRecordList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    queryParams.value.companyCode = orderTable.value;
    getList()
}

/** 查询物流下单记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLogisticsOrderRecord(queryParams.value);
  logisticsOrderRecordList.value = res.rows;
  logisticsOrderRecordList.value.forEach((item: any) => {
    const code = item.deliveryList?.map((vo) => {
      return vo.code
    }).join('/');
    item.deliveryCode = code;
  })
  total.value = res.total;
  loading.value = false;
}

  const orderTableHandle = async (tab: any, event: any) => {
    orderTable.value = tab.props.name
    queryParams.value.companyCode = orderTable.value;
    await getList();
  }

const cancelOrder = async (row:any) => {
  buttonLoading.value = true;
  const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.code == row.companyCode);
  const hVnode = h('p', null, [
    h('span', null, '确定要取消在【'),
    h('span', {style: 'color: red;font-weight: 700;'}, currentCompany.fullName),
    h('span', null, '】下的物流单【 '),
    h('span', {style: 'color: red;font-weight: 700;'}, row.waybillNo),
    h('span', null, '】吗？'),
  ])
  ElMessageBox.confirm(
    hVnode,
    '提示:',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      distinguishCancelAndClose: true,
      customStyle:{'min-width':"500px"},
      type: 'warning',
    }
  ).then(()=>{
    deleteOrder({id: row.id, expressType: currentCompany.code}).then(async (res) => {
      const result = JSON.parse(res.msg)
      let reason = "";
      console.log(result)
      if(currentCompany.code == "SFEXPRESS"){
        if (!result.success) {
          reason = result.errorMsg;
        }
      } else if(currentCompany.code == "KYEXPRESS"){
        if(!result.success){
          reason = result.msg;
        }
      } else if(currentCompany.code == "LTS"){
        if(result.code != 200){
          reason = result.msg;
        }
      }
      await getList();
      if (reason == "") {
        proxy?.$modal.msgSuccess("取消物流单成功");
        return;
      }
      ElMessage({
        dangerouslyUseHTMLString: true,
        type: 'info',
        duration: 3000,
        offset: 24,
        showClose: true,
        message: '物流单取消失败【<span style="color:#F56C6C;">' + reason + '</span>】，请至' + '<a style="color: #457AF7;" href="' + currentCompany.website + '" target="_blank">【' + currentCompany.fullName + '】</a>平台或致电【 '+currentCompany.phone + '】手动取消物流单。',
      })
    }).finally(() => {
      buttonLoading.value = false;
    });
  }).catch((action: any) =>{
    // console.log(action);
    // if(action === 'cancel'){
    //   tabForm.value.logisticsNo =undefined;
    //   tabForm.value.phoneNumber = undefined;
    //   tabForm.value.logisticsOrderId = undefined;
    //   tabForm.value.logisticsCompany = undefined;
    // }
  }).finally(() => buttonLoading.value = false);
}

  const handleLogistics = async (row: any) => {
    const currentCompany = logisticsCompanyList.value.find((v: any) => v.isOpenConfig == '1' && v.code == row.companyCode);
    const res = await getLogistics({expressType: row.companyCode, waybillNo: row.waybillNo, receiverPhone: row.receiverPhone});
    logisticsInfo.value = res.data;
    logisticsInfo.value.logisticsCompany = currentCompany.fullName;
    logisticsInfo.value.phone = currentCompany.phone;
    console.log(res)
    dialog.visible = true;
  }

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  logisticsOrderRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LogisticsOrderRecordVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加物流下单记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LogisticsOrderRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getLogisticsOrderRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改物流下单记录";
}

/** 提交按钮 */
const submitForm = () => {
  logisticsOrderRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateLogisticsOrderRecord(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLogisticsOrderRecord(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: LogisticsOrderRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物流下单记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delLogisticsOrderRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/logisticsOrderRecord/export', {
    ...queryParams.value
  }, `logisticsOrderRecord_${new Date().getTime()}.xlsx`)
}

const getLogisticsCompanyList = async ()=>{
  const res = await listLogisticsCompany({pageNum:1,pageSize:500,isOpenConfig:'1'})
  logisticsCompanyList.value = res.rows;
  const code = logisticsCompanyList.value && logisticsCompanyList.value[0]?.code;
  if(code){
    orderTable.value = code;
    queryParams.value.companyCode = code
  }
}

onMounted(async () => {
  await getLogisticsCompanyList();
  getList();
});
</script>

<template>
      <div class="p-2 xtable-page customer-complaint">
        <el-card shadow="never" class="xtable-card">

          <el-tabs type="border-card"  class="xtable-tab" @tab-click="handleClick" >

            <el-tab-pane label="待提交" name="0">
              <div style="width: 100%; text-align: right; padding-bottom: 10px">
                <el-button type="primary" @click="complaintModifyVisible = true" v-if="checkPermi(['quality:customerComplaint:commit'])">新增</el-button>
              </div>
              <XTable toolId="qualityCustomerComplaint" height="100%" class="xtable-content"
                      v-model:page-size="toBeSubmittedQueryParams.pageSize"
                      v-model:current-page="toBeSubmittedQueryParams.pageNum"
                      :intervalCondition="intervalCondition"
                      :page-params="{ perfect: true, total: toBeSubmittedTableTotal }"
                      :data="toBeSubmittedTableData"
                      :columnList="toBeSubmittedColumnList"
                      show-footer="true"
                      ref="XTableRef"
                      border :showRefresh="true"
                      @searchChange="toBeSubmittedSearchChange"
                      :column-config="{ resizable: true }"
                      :row-config="{ keyField:'id' }"
                      :loading="toBeSubmittedTableLoading"
                      scroll-y="{enabled: false}"
              >

                <template #default-orderStatus="scope">
                  <span v-if="scope.row.orderStatus === '0'">待提交</span>
                  <span v-else>X</span>
                </template>

                <template #default-make="scope">
                  <el-button link type="primary" @click="updateComplaint(scope.row.id)" v-if="checkPermi(['quality:customerComplaint:commit'])">修改</el-button>
                  <el-button link type="primary" @click="deleteComplaint(scope.row.id,scope.rowIndex,scope.row.commodityCode)" v-if="checkPermi(['quality:customerComplaint:commit'])">删除</el-button>
                  <el-button link type="primary" @click="commitComplaint(scope.row.id,scope.rowIndex,scope.row.commodityCode)" v-if="checkPermi(['quality:customerComplaint:commit'])">提交</el-button>
                  <el-button link type="primary" @click="viewCustomerComplaint(scope.row.id)">详情</el-button>
                </template>

              </XTable>

            </el-tab-pane>

            <el-tab-pane label="待回复" name="1" >

              <XTable toolId="qualityCustomerComplaint" height="100%" class="xtable-content"
                      v-model:page-size="toBeReplyQueryParams.pageSize"
                      v-model:current-page="toBeReplyQueryParams.pageNum"
                      :intervalCondition="intervalCondition"
                      :page-params="{ perfect: true, total: toBeReplyTableTotal }"
                      :data="toBeReplyTableData"
                      :columnList="toBeReplyColumnList"
                      show-footer="true"
                      ref="XTableRef"
                      border
                      :showRefresh="true"
                      @searchChange="toBeReplySearchChange"
                      :column-config="{ resizable: true }"
                      :row-config="{ keyField:'id' }"
                      :loading="toBeReplyTableLoading"
                      :enterFresh = "true"
              >

                <template #default-orderStatus="scope">
                  <span v-if="scope.row.orderStatus === '1'">待回复</span>
                  <span v-else>X</span>
                </template>

                <template #default-make="scope">
                  <el-button link type="primary" @click="replyComplaint(scope.row.id)" v-if="checkPermi(['quality:customerComplaint:reply'])">回复</el-button>
                  <el-button link type="primary" @click="viewReplyCustomerComplaint(scope.row.id,null,null,null)">详情</el-button>
                </template>

              </XTable>

            </el-tab-pane>

            <el-tab-pane label="客诉列表" name="2">

              <div class="global-flex flex-end" style="width: 100%;margin-bottom: 10px;">
                <el-button  plain icon="Download" @click="handleExport">导出</el-button>
              </div>

              <XTable toolId="qualityCustomerComplaint" height="100%" class="xtable-content"
                      v-model:page-size="repliedQueryParams.pageSize"
                      v-model:current-page="repliedQueryParams.pageNum"
                      :intervalCondition="intervalCondition"
                      :page-params="{ perfect: true, total: repliedTableTotal }"
                      :data="repliedTableData"
                      :columnList="repliedColumnList"
                      show-footer="true"
                      ref="XTableRef"
                      border
                      :showRefresh="true"
                      @searchChange="repliedSearchChange"
                      :column-config="{ resizable: true }"
                      :row-config="{ keyField:'id' }"
                      :loading="repliedTableLoading"
              >
                <template #default-orderStatus="scope">
                  <span v-if="scope.row.orderStatus === '2'">已回复</span>
                  <span v-else>X</span>
                </template>

                <template #default-make="scope">
                  <el-button link type="primary" @click="viewReplyCustomerComplaint(scope.row.id,scope.row.complaintRate,scope.row.orderCount,scope.row.complaintCount)">详情</el-button>
                </template>

              </XTable>

            </el-tab-pane>

          </el-tabs>


        </el-card>


        <el-drawer
          v-model="complaintModifyVisible"
          :title= "title"
          direction="rtl"
          size="40%"
          destroy-on-close
          @close="closeComplaint"
        >
          <complaintModify @close="closeComplaint" @submit="submitComplaint" :id="editId" :viewStatus="viewStatus" :replyStatus="replyStatus" :complaintRate="complaintRate"
                           :orderCount="orderCount" :complaintCount="complaintCount"/>
        </el-drawer>



  </div>
</template>

<script setup name="CustomerComplaint">
import {ref} from "vue";
import complaintModify from "./complaintModify.vue";
import {
  commitCustomerComplaint,
  delCustomerComplaint,
  listCustomerComplaint
} from "@/api/quality/customerComplaint";
import {checkPermi} from "@/utils/permission";




const complaintModifyVisible =ref(false);

/**
 * 删除单行客诉单
 */
const deleteComplaint = (id,index,commodityCode) => {

  ElMessageBox.confirm(
    '是否确认删除产品编码为'+commodityCode+'的客诉单',
    '删除提示:',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
      proxy?.$modal.loading('加载中...');
      delCustomerComplaint({
        id: id
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: "删除成功",
          });
        }).finally(() => {
        proxy?.$modal.closeLoading();
        refreshTableData();
        refreshReplyTableData();
        refreshRepliedTableData();
      })
    })
}

/**
 * 编辑时把标题更新,并传递单行id值
 */
const updateComplaint = (id) => {
  editId.value=id;
  title.value = "编辑客诉单";
  complaintModifyVisible.value = true;
}

/**
 * 回复时把标题更新,并传递单行id值
 */
const replyComplaint = (id) => {
  editId.value=id;
  title.value = "回复客诉单";
  replyStatus.value = true;
  complaintModifyVisible.value = true;
}

/**
 * 提交客诉单
 */
const commitComplaint = (id,index,commodityCode) => {

  ElMessageBox.confirm(
    '是否确认提交产品编码为'+commodityCode+'的客诉单',
    '提交提示:',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    proxy?.$modal.loading('加载中...');
    commitCustomerComplaint({
      id: id
    })
      .then(() => {
        ElMessage({
          type: 'success',
          message: "提交成功",
        });
      }).finally(() => {
      proxy?.$modal.closeLoading();
      refreshTableData();
      refreshReplyTableData();
      refreshRepliedTableData();
    })
  })
}

/**
 * 预览时把标题更新,并传递单行id值,设置表单disabled=true
 */
const viewCustomerComplaint = (id) => {
  editId.value=id;
  viewStatus.value=true;
  title.value = "预览客诉单";
  complaintModifyVisible.value = true;
}

/**
 * 预览时把标题更新,并传递单行id值,设置表单disabled=true
 */
const viewReplyCustomerComplaint = (id,rowComplaintRate,rowOrderCount,rowComplaintCount) => {
  editId.value = id;
  viewStatus.value = true;
  replyStatus.value = true;
  complaintRate.value = rowComplaintRate;
  orderCount.value = rowOrderCount;
  complaintCount.value = rowComplaintCount;
  title.value = "预览客诉单";

  complaintModifyVisible.value = true;
}


/**
 * 初始化新增或编辑的标题
 */
const title = ref("新增客诉信息");

/**
 * 初始化所选单行Id
 * @type {Ref<UnwrapRef<undefined>>}
 */
const editId = ref(undefined)
const viewStatus = ref()
const replyStatus = ref()
const complaintRate = ref()
const orderCount = ref()
const complaintCount = ref()
/**
 * 关闭新增编辑页面,清空当前行Id
 */
const closeComplaint = () => {
  editId.value=undefined;
  complaintRate.value=undefined;
  viewStatus.value=false;
  replyStatus.value=false;
  complaintModifyVisible.value = false;
}

/**
 * 新增编辑页面
 */
const submitComplaint = () => {
  complaintModifyVisible.value = false;
  refreshTableData();
  refreshReplyTableData();
  refreshRepliedTableData();
}

/**
 * tabs被点击时触发
 */
const handleClick = () => {
  console.log('1')
  if (toBeReplyQueryParams.value.orderStatus === undefined){
    toBeReplyQueryParams.value.orderStatus='1';
    refreshReplyTableData();
  }

  if (repliedQueryParams.value.orderStatus === undefined){
    repliedQueryParams.value.orderStatus='2';
    refreshRepliedTableData();
  }

}

/**
 * 声名需要处理的条件字段
 */
const intervalCondition = ['createTime','handleTime'];
/**
 * 初始化待提交页面查询参数
 */
const { toBeSubmittedQueryParams } = toRefs(reactive({
  toBeSubmittedQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined
  }
}));
const toBeSubmittedTableTotal = ref(0);
const toBeSubmittedTableData = ref([]);
const toBeSubmittedTableLoading = ref(false);
const toBeSubmittedColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "单据状态", width: "60", field: "orderStatus", align: "center" },
  { title: "客户代码", width: "70", field: "customerCode", align: "center" , filterType: "input" },
  { title: "销售合同号", width: "130", field: "saleOrderCode", align: "center", filterType: "input" },
  { title: "产品编码", width: "100", field: "commodityCode", align: "center" , filterType: "input" },
  { title: "产品名称", width: "100", field: "commodityName", align: "center" , filterType: "input" },
  { title: "客诉原因", field: "complaintReason", align: "center"},
  { title: "开单人", width: "80", field: "createByName", align: "center", filterType: "input" },
  { title: "开单时间", width: "120", field: "createTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '操作' , width: "170",  align: "center", field: "make",fixed: 'right' }
]);


/**
 * 初始化待回复页面查询参数
 */
const { toBeReplyQueryParams } = toRefs(reactive({
  toBeReplyQueryParams: {
    pageNum: 1,
    pageSize: 20,
    orderStatus: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined
  }
}));
const toBeReplyTableTotal = ref(0);
const toBeReplyTableData = ref([]);
const toBeReplyTableLoading = ref(false);
const toBeReplyColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "单据状态", width: "60", field: "orderStatus", align: "center" },
  { title: "客户代码", width: "70", field: "customerCode", align: "center" , filterType: "input" },
  { title: "销售合同号", width: "130", field: "saleOrderCode", align: "center", filterType: "input" },
  { title: "产品编码", width: "100", field: "commodityCode", align: "center" , filterType: "input"  },
  { title: "产品名称", width: "100", field: "commodityName", align: "center" , filterType: "input" },
  { title: "客诉原因", field: "complaintReason", align: "center"},
  { title: "开单人" , width: "80", field: "createByName", align: "center", filterType: "input" },
  { title: "开单时间", width: "100", field: "createTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: '操作', width: "100" ,  align: "center", field: "make",fixed: 'right'  }
]);


/**
 * 初始化已回复页面查询参数
 */
const { repliedQueryParams } = toRefs(reactive({
  repliedQueryParams: {
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
const repliedTableTotal = ref(0);
const repliedTableData = ref([]);
const repliedTableLoading = ref(false);
const repliedColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" },
  { title: "单据状态", width: "60", field: "orderStatus", align: "center" },
  { title: "客户代码", width: "70", field: "customerCode", align: "center" , filterType: "input" },
  { title: "销售合同号", width: "130", field: "saleOrderCode", align: "center", filterType: "input" },
  { title: "产品编码", width: "100", field: "commodityCode", align: "center" , filterType: "input"  },
  { title: "产品名称", width: "100", field: "commodityName", align: "center" , filterType: "input" },
  { title: "客诉原因", field: "complaintReason", align: "center"},
  { title: "品质回复内容", field: "handleMessage", align: "center"},
  { title: "回复人", width: "85", field: "handleBy", align: "center", filterType: "input" },
  { title: "回复时间", width: "130", field: "handleTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: "开单人" , width: "80", field: "createByName", align: "center", filterType: "input" },
  { title: "开单时间", width: "130", field: "createTime", align: "center", filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  { title: "客诉率" , width: "60", field: "complaintRate", align: "center" },
  { title: '操作'  , width: "60",  align: "center", field: "make" ,fixed: 'right' }
]);


/**
 * 待提交搜索条件更新
 */
const toBeSubmittedSearchChange = (param) => {
  toBeSubmittedQueryParams.value = {...param}
  toBeSubmittedQueryParams.value.orderStatus='0';//状态值0:待提交
  refreshTableData();
}


/**
 * 发送查询请求,刷新待提交页面数据
 */
const refreshTableData = () => {
  toBeSubmittedTableLoading.value = true;
  listCustomerComplaint(toBeSubmittedQueryParams.value)
    .then((res) => {
      toBeSubmittedTableData.value = res.rows;
      toBeSubmittedTableTotal.value = res.total;
    })
    .finally(() => {
      toBeSubmittedTableLoading.value = false;
    })
}

/**
 * 已回复搜索条件更新
 */
const repliedSearchChange = (param) => {
  repliedQueryParams.value = {...param}
  repliedQueryParams.value.orderStatus='2';//状态值2:已回复
  refreshRepliedTableData();
}


/**
 * 发送查询请求,刷新已回复页面数据
 */
const refreshRepliedTableData = () => {
  repliedTableLoading.value = true;
  repliedQueryParams.value.orderStatus = '2';//状态值2:已回复
  listCustomerComplaint(repliedQueryParams.value)
    .then((res) => {
      repliedTableData.value = res.rows;
      repliedTableTotal.value = res.total;
    })
    .finally(() => {
      repliedTableLoading.value = false;
    })
}




/**
 * 待回复搜索条件更新
 */
const toBeReplySearchChange = (param) => {
  toBeReplyQueryParams.value = {...param}
  toBeReplyQueryParams.value.orderStatus = '1';//状态值1:待回复
  refreshReplyTableData();
}
/**
 * 发送查询请求,刷新待回复页面数据
 */
const refreshReplyTableData = () => {
  toBeReplyTableLoading.value = true;
  listCustomerComplaint(toBeReplyQueryParams.value)
    .then((res) => {
      toBeReplyTableData.value = res.rows;
      toBeReplyTableTotal.value = res.total;
    })
    .finally(() => {
      toBeReplyTableLoading.value = false;
    })
}



/**
 * 定义代理对象
 */
const {proxy} = getCurrentInstance();
/** 导出按钮操作 */
const handleExport = () => {

  if (repliedTableData.value === null){
    ElMessageBox.confirm(
      '所设筛选条件没有数据,请确认是否导出空文件/模版',
      '导出提示:',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        proxy?.download("quality/customerComplaint/export", {
          ...repliedQueryParams.value
        }, `客诉列表模板_${new Date().getTime()}.xlsx`);
      }
    )
  }else if (
    repliedQueryParams.value.handleTimeStart === undefined &&
    repliedQueryParams.value.handleTimeEnd   === undefined &&
    repliedQueryParams.value.createTimeStart === undefined &&
    repliedQueryParams.value.createTimeEnd   === undefined
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
      exportComplaintList
    )
  }else{
    exportComplaintList();
  }
};

const exportComplaintList = () => {
  proxy?.download("quality/customerComplaint/export", {
    ...repliedQueryParams.value
  }, `客诉列表_${new Date().getTime()}.xlsx`);
}



/**
 * 渲染完页面后刷新页面数据
 */
onMounted(() => {
  toBeSubmittedQueryParams.value.orderStatus='0';
  refreshTableData();
});

</script>




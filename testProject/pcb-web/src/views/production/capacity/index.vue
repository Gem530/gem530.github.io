<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="单位ID" prop="ownerId">
            <el-input v-model="queryParams.ownerId" placeholder="请输入单位ID" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="排产单ID" prop="productionId">
            <el-input v-model="queryParams.productionId" placeholder="请输入排产单ID" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="流转卡ID" prop="cardId">
            <el-input v-model="queryParams.cardId" placeholder="请输入流转卡ID" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="工艺ID" prop="craftId">
            <el-input v-model="queryParams.craftId" placeholder="请输入工艺ID" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="流转卡节点id" prop="productionCardNodeId">
            <el-input v-model="queryParams.productionCardNodeId" placeholder="请输入流转卡节点id" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="上报数量" prop="reportedQuantity">
            <el-input v-model="queryParams.reportedQuantity" placeholder="请输入上报数量" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="审核数量" prop="auditQuantity">
            <el-input v-model="queryParams.auditQuantity" placeholder="请输入审核数量" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数量单位" prop="unit">
            <el-input v-model="queryParams.unit" placeholder="请输入数量单位" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="修改原因" prop="flowId">
            <el-input v-model="queryParams.flowId" placeholder="请输入修改原因" clearable style="width: 240px"  @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-if="checkPermi(['production:capacity:add'])">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-if="checkPermi(['production:capacity:edit'])">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-if="checkPermi(['production:capacity:remove'])">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-if="checkPermi(['production:capacity:export'])">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

        <XTable v-model:page-size="queryParams.pageSize"
                v-model:current-page="queryParams.pageNum"
                :page-params="{ perfect: true, total: total }"
                :data="capacityList"
                :columnList="columnList"
                ref="XTableRef"
                border
                @searchChange="searchChange"
                :column-config="{ resizable: true }"
                @checkbox-all="selectChangeEvent"
                @checkbox-change="selectChangeEvent"
                :checkbox-config="{reserve: true }"
                :row-config="{ keyField:'id' }"
        >
            <template #default-make="scope">

                <el-tooltip content="修改" placement="top">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-if="checkPermi(['production:capacity:edit'])"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-if="checkPermi(['production:capacity:remove'])"></el-button>
                </el-tooltip>
                <el-tooltip content="详情" placement="top">
                    <el-button link type="primary" icon="Message" @click="handleSelect(scope.row)" v-if="checkPermi(['production:capacity:get'])"></el-button>
                </el-tooltip>
            </template>
        </XTable>
    </el-card>
    <!-- 添加或修改个人产能上报记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="capacityFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单位ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入单位ID" />
        </el-form-item>
        <el-form-item label="排产单ID" prop="productionId">
          <el-input v-model="form.productionId" placeholder="请输入排产单ID" />
        </el-form-item>
        <el-form-item label="流转卡ID" prop="cardId">
          <el-input v-model="form.cardId" placeholder="请输入流转卡ID" />
        </el-form-item>
        <el-form-item label="工艺ID" prop="craftId">
          <el-input v-model="form.craftId" placeholder="请输入工艺ID" />
        </el-form-item>
        <el-form-item label="流转卡节点id" prop="productionCardNodeId">
          <el-input v-model="form.productionCardNodeId" placeholder="请输入流转卡节点id" />
        </el-form-item>
        <el-form-item label="上报数量" prop="reportedQuantity">
          <el-input v-model="form.reportedQuantity" placeholder="请输入上报数量" />
        </el-form-item>
        <el-form-item label="审核数量" prop="auditQuantity">
          <el-input v-model="form.auditQuantity" placeholder="请输入审核数量" />
        </el-form-item>
        <el-form-item label="数量单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入数量单位" />
        </el-form-item>
        <el-form-item label="修改原因" prop="flowId">
          <el-input v-model="form.flowId" placeholder="请输入修改原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Capacity" lang="ts">
import {checkPermi} from "@/utils/permission";
import { listCapacity, getCapacity, delCapacity, addCapacity, updateCapacity } from '@/api/production/capacity';
import { CapacityVO, CapacityQuery, CapacityForm } from '@/api/production/capacity/types';
import { VxeTableEvents } from 'vxe-table'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const capacityList = ref<CapacityVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const capacityFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CapacityForm = {
  id: undefined,
  ownerId: undefined,
  status: undefined,
  productionId: undefined,
  cardId: undefined,
  craftId: undefined,
  productionCardNodeId: undefined,
  reportedQuantity: undefined,
  auditQuantity: undefined,
  reason: undefined,
  unit: undefined,
  flowId: undefined
}
const data = reactive<PageData<CapacityForm, CapacityQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ownerId: undefined,
    status: undefined,
    productionId: undefined,
    cardId: undefined,
    craftId: undefined,
    productionCardNodeId: undefined,
    reportedQuantity: undefined,
    auditQuantity: undefined,
    reason: undefined,
    unit: undefined,
    flowId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "单位ID不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    productionId: [
      { required: true, message: "排产单ID不能为空", trigger: "blur" }
    ],
    cardId: [
      { required: true, message: "流转卡ID不能为空", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "工艺ID不能为空", trigger: "blur" }
    ],
    productionCardNodeId: [
      { required: true, message: "流转卡节点id不能为空", trigger: "blur" }
    ],
    reportedQuantity: [
      { required: true, message: "上报数量不能为空", trigger: "blur" }
    ],
    auditQuantity: [
      { required: true, message: "审核数量不能为空", trigger: "blur" }
    ],
    reason: [
      { required: true, message: "修改原因不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "数量单位不能为空", trigger: "blur" }
    ],
    flowId: [
      { required: true, message: "修改原因不能为空", trigger: "blur" }
    ]
  }
});

const XTableRef = ref()

const columnList = ref([

    { title:"序号" ,type: 'seq',  align: 'center', width: '60' },
    { type: 'checkbox', align: 'center', field: "checkbox",  width: '40', },
        { title: '${comment}', field: 'id', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入${comment}' } },
        { title: '单位ID', field: 'ownerId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入单位ID' } },
        { title: '状态', field: 'status', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入状态' } },
        { title: '排产单ID', field: 'productionId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入排产单ID' } },
        { title: '流转卡ID', field: 'cardId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入流转卡ID' } },
        { title: '工艺ID', field: 'craftId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入工艺ID' } },
        { title: '流转卡节点id', field: 'productionCardNodeId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入流转卡节点id' } },
        { title: '上报数量', field: 'reportedQuantity', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入上报数量' } },
        { title: '审核数量', field: 'auditQuantity', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入审核数量' } },
        { title: '修改原因', field: 'reason', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入修改原因' } },
        { title: '数量单位', field: 'unit', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入数量单位' } },
        { title: '修改原因', field: 'flowId', width:'100',align: 'center', filterType: 'input', filterParam: { placeholder: '请输入修改原因' } },
    { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedCapacityList = ref<CapacityVO[]>([]);

const { queryParams, form, rules } = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<CapacityVO> = () => {
    const tableRef = XTableRef.value.xTableRef
    if (tableRef) {
        const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
        checkedCapacityList.value = selectRecords.map(item => item);
    }
}

// 获取 搜索条件
const searchChange = (params: any) => {
    queryParams.value = params
    getList()
}

/** 查询个人产能上报记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.type='0'
  const res = await listCapacity(queryParams.value);
  capacityList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  capacityFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CapacityVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加个人产能上报记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CapacityVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCapacity(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改个人产能上报记录";
}

/** 提交按钮 */
const submitForm = () => {
  capacityFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCapacity(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCapacity(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CapacityVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除个人产能上报记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCapacity(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('production/capacity/export', {
    ...queryParams.value
  }, `capacity_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

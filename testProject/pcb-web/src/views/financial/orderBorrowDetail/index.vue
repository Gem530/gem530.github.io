<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="对账人id" prop="accountUserId">
            <el-input v-model="queryParams.accountUserId" placeholder="请输入对账人id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="借料记录ID" prop="rawMaterialBorrowId">
            <el-input v-model="queryParams.rawMaterialBorrowId" placeholder="请输入借料记录ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="queryParams.quantity" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model="queryParams.price" placeholder="请输入单价" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="折扣金额" prop="discountPrice">
            <el-input v-model="queryParams.discountPrice" placeholder="请输入折扣金额" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="总金额" prop="totalPrice">
            <el-input v-model="queryParams.totalPrice" placeholder="请输入总金额" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="物料ID" prop="rawMaterialId">
            <el-input v-model="queryParams.rawMaterialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="对账单id" prop="accountOrderId">
            <el-input v-model="queryParams.accountOrderId" placeholder="请输入对账单id" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="出入库记录ID" prop="rawMaterialInOutRecordId">
            <el-input v-model="queryParams.rawMaterialInOutRecordId" placeholder="请输入出入库记录ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"

              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" size="small" :data="orderBorrowDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单据状态" align="center" prop="code" />
        <el-table-column label="类型" align="center" prop="type" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="是否含税" align="center" prop="isTax" />
        <el-table-column label="对账人id" align="center" prop="accountUserId" />
        <el-table-column label="对账人名称" align="center" prop="accountUserName" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="借料记录ID" align="center" prop="rawMaterialBorrowId" />
        <el-table-column label="币种" align="center" prop="currency" />
        <el-table-column label="数量" align="center" prop="quantity" />
        <el-table-column label="单价" align="center" prop="price" />
        <el-table-column label="折扣金额" align="center" prop="discountPrice" />
        <el-table-column label="总金额" align="center" prop="totalPrice" />
        <el-table-column label="物料ID" align="center" prop="rawMaterialId" />
        <el-table-column label="对账单id" align="center" prop="accountOrderId" />
        <el-table-column label="出入库记录ID" align="center" prop="rawMaterialInOutRecordId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"

              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"

              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改借料对账单明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="orderBorrowDetailFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="对账人id" prop="accountUserId">
          <el-input v-model="form.accountUserId" placeholder="请输入对账人id" />
        </el-form-item>
        <el-form-item label="借料记录ID" prop="rawMaterialBorrowId">
          <el-input v-model="form.rawMaterialBorrowId" placeholder="请输入借料记录ID" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="折扣金额" prop="discountPrice">
          <el-input v-model="form.discountPrice" placeholder="请输入折扣金额" />
        </el-form-item>
        <el-form-item label="总金额" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入总金额" />
        </el-form-item>
        <el-form-item label="物料ID" prop="rawMaterialId">
          <el-input v-model="form.rawMaterialId" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="对账单id" prop="accountOrderId">
          <el-input v-model="form.accountOrderId" placeholder="请输入对账单id" />
        </el-form-item>
        <el-form-item label="出入库记录ID" prop="rawMaterialInOutRecordId">
          <el-input v-model="form.rawMaterialInOutRecordId" placeholder="请输入出入库记录ID" />
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

<script setup name="OrderBorrowDetail" lang="ts">
import { listOrderBorrowDetail, getOrderBorrowDetail, delOrderBorrowDetail, addOrderBorrowDetail, updateOrderBorrowDetail } from '@/api/financial/orderBorrowDetail';
import { OrderBorrowDetailVO, OrderBorrowDetailQuery, OrderBorrowDetailForm } from '@/api/financial/orderBorrowDetail/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const orderBorrowDetailList = ref<OrderBorrowDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const orderBorrowDetailFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: OrderBorrowDetailForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  status: undefined,
  isTax: undefined,
  accountUserId: undefined,
  accountUserName: undefined,
  remark: undefined,
  rawMaterialBorrowId: undefined,
  currency: undefined,
  quantity: undefined,
  price: undefined,
  discountPrice: undefined,
  totalPrice: undefined,
  rawMaterialId: undefined,
  accountOrderId: undefined,
  rawMaterialInOutRecordId: undefined
}
const data = reactive<PageData<OrderBorrowDetailForm, OrderBorrowDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    status: undefined,
    isTax: undefined,
    accountUserId: undefined,
    accountUserName: undefined,
    rawMaterialBorrowId: undefined,
    currency: undefined,
    quantity: undefined,
    price: undefined,
    discountPrice: undefined,
    totalPrice: undefined,
    rawMaterialId: undefined,
    accountOrderId: undefined,
    rawMaterialInOutRecordId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    isTax: [
      { required: true, message: "是否含税不能为空", trigger: "blur" }
    ],
    accountUserId: [
      { required: true, message: "对账人id不能为空", trigger: "blur" }
    ],
    accountUserName: [
      { required: true, message: "对账人名称不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    rawMaterialBorrowId: [
      { required: true, message: "借料记录ID不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    discountPrice: [
      { required: true, message: "折扣金额不能为空", trigger: "blur" }
    ],
    totalPrice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    rawMaterialId: [
      { required: true, message: "物料ID不能为空", trigger: "blur" }
    ],
    accountOrderId: [
      { required: true, message: "对账单id不能为空", trigger: "blur" }
    ],
    rawMaterialInOutRecordId: [
      { required: true, message: "出入库记录ID不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询借料对账单明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrderBorrowDetail(queryParams.value);
  orderBorrowDetailList.value = res.rows;
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
  orderBorrowDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OrderBorrowDetailVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加借料对账单明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderBorrowDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getOrderBorrowDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改借料对账单明细";
}

/** 提交按钮 */
const submitForm = () => {
  orderBorrowDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrderBorrowDetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addOrderBorrowDetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: OrderBorrowDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除借料对账单明细编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delOrderBorrowDetail(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financial/orderBorrowDetail/export', {
    ...queryParams.value
  }, `orderBorrowDetail_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

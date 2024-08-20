<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8" style=" margin-right: 0px;justify-content: end;">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>
      </template>

      <XTable toolId="craftAutoConfigList" v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum" :showRefresh="true" :page-params="{ perfect: true, total: total }"
        :data="deliveryConfigList" :columnList="columnList" ref="XTableRef" border @searchChange="searchChange"
        :column-config="{ resizable: true }" :checkbox-config="{ reserve: true }" class="xtable-content"
        :row-config="{ keyField: 'id' }">
        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </XTable>
    </el-card>

    <!-- 添加或修改外协加工订单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px">
      <el-form ref="craftConfigOrderFormRef" :disabled="dialog.title?.includes('详情')" :model="form" :rules="rules"
        label-width="120px" v-loading="loading">
        <el-row>
          <el-col :span="20">
            <el-form-item label="工序名称" prop="craftId">
              <el-select :disabled="!dialog.title?.includes('添加')&&!dialog.title?.includes('修改')" v-model="form.craftId" filterable style="width: 100%"
                @change="changeCraft">
                <el-option v-for="item in craftConfigList" :key="item.id" :label="item.craftName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="默认供应商" prop="supplierId">
              <el-select :disabled="!dialog.title?.includes('添加')&&!dialog.title?.includes('修改')" v-model="form.supplierId" filterable style="width: 100%">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="默认收货地址" prop="addressId">
              <el-select :disabled="!dialog.title?.includes('添加')&&!dialog.title?.includes('修改')" v-model="form.addressId" :collapse-tags="true"
                style="width: 100%" filterable>
                <el-option v-for="item in addressList" :key="item.id" :disabled="item.status == 0"
                  :label="`${item.status == 0 ? '(已禁用)-' : ''}${item.address}`" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="20">
            <el-form-item label="默认外发单位" prop="unit">
              <el-select :disabled="!dialog.title?.includes('添加')&&!dialog.title?.includes('修改')" v-model="form.unit" style="width: 100%">
                <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注" prop="remark">
              <el-input :disabled="!dialog.title?.includes('添加')&&!dialog.title?.includes('修改')" type="textarea" v-model="form.remark" maxlength="500" ></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定 </el-button>
          <el-button :loading="buttonLoading" @click="dialog.visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="craftAutoConfig" lang="ts">
import { DeliveryConfigVO, DeliveryConfigQuery, DeliveryConfigForm, ConfigTypeEnum, configTypeStrings } from '@/api/basedata/deliveryConfig/types';
import { VXETable, VxeTableInstance, VxeTablePropTypes } from "vxe-table";
import { listCustomerAddressByCusId } from "@/api/basedata/customerAddress";
import { listTenantConfig } from "@/api/system/tenantConfig";
import { getCraftList } from '@/api/basedata/craft';
import { listSupplierNoPage } from '@/api/basedata/supplier';
import { listOutSourceAddressList,listOutSourceSupplierListV2 } from "@/api/outsource/sourceFullProcessOrder";
import { getCraftSupplierAutoOut,listCraftSupplierAutoOut, addCraftSupplierAutoOut, updateCraftSupplierAutoOut,delCraftSupplierAutoOut } from "@/api/basedata/craftSupplierAutoOut";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const craftConfigOrderFormRef = ref();
const deliveryConfigList = ref<DeliveryConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);

const deliveryConfigFormRef = ref<ElFormInstance>();

const unitOptions = ref([
  { value: "1", label: "大料" },
  { value: "2", label: "PNL" },
  { value: "3", label: "SET" },
])
let craftConfigList: any[] = [];
const supplierList = ref();
let addressList: any[] = [];

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeliveryConfigForm = {
  id: undefined,
  remark: undefined,
  customerId: undefined,
  deliveryConfig: undefined,
  seq: undefined,
  type: undefined,
  ownerId: undefined,
  showType: '11',
  waitCheck: []
}
const data = reactive<PageData<DeliveryConfigForm, DeliveryConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerId: undefined,
    deliveryConfig: undefined,
    seq: undefined,
    type: undefined,
    ownerId: undefined,
    params: {
    }
  },
  rules: {
    supplierId: [
      { required: true, message: "供应商不能为空", trigger: "blur" }
    ],
    craftId: [
      { required: true, message: "工艺不能为空", trigger: "blur" }
    ],
    addressId: [
      { required: true, message: "地址不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
  }
});

const XTableRef = ref()
const columnList = ref([
  { title: "序号", type: 'seq', align: 'center', width: '60' },
  { title: '工序名称', field: 'craftName', width: '100', align: 'center' },
  { title: '供应商编码', field: 'supplierCode', align: 'center', width: '120', filterType: 'input' },
  { title: '供应商名称', field: 'supplierName', align: 'center', width: '120', filterType: 'input' },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '160', fixed: 'right', },
]);

const checkedDeliveryConfigList = ref<DeliveryConfigVO[]>([]);
const { queryParams, form, rules } = toRefs(data);


// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  getList()
}

/** 查询deliveryConfig列表 */
const getList = async () => {
  loading.value = true;

  queryParams.value.customerIdList = queryParams.value.customerCode;
  queryParams.value.customerNameIdList = queryParams.value.customerName;
  queryParams.value.customerCode = undefined;
  queryParams.value.customerName = undefined;

  const res = await listCraftSupplierAutoOut(queryParams.value);
  deliveryConfigList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  supplierList.value=[];
  deliveryConfigFormRef.value?.resetFields();
  checkedDeliveryConfigList.value = [];
}


/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加外协工序供应商配置";
}

const handleDetail = async (row?: DeliveryConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCraftSupplierAutoOut(_id);
  await changeCraftSupplierList(res.data.craftId);
  Object.assign(form.value, res.data);

  //构建已选List
  dialog.visible = true;
  dialog.title = "外协工序供应商配置详情";
  
  console.log("=========handleDetail", form.value);
}

const changeCraft = async (cid?: any) => {
  craftConfigList.forEach(cc => {
    if (cc.id == cid) {
      form.value.craftName = cc.craftName
    }
  })
  console.log("=========changeCraft", form.value);
  await changeCraftSupplierList(cid);
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DeliveryConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCraftSupplierAutoOut(_id);
  await changeCraftSupplierList(res.data.craftId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改外协工序供应商配置";
  console.log("=========", form.value);
}

/** 提交按钮 */
const submitForm = async () => {
  buttonLoading.value = true;
  console.log(form.value);
  craftConfigOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (form.value.id) {
        await updateCraftSupplierAutoOut(form.value).finally(() => buttonLoading.value = false);
      } else {
        //form.value.type = ConfigTypeEnum.CUSTOMER;
        await addCraftSupplierAutoOut(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }else{
      buttonLoading.value = false
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeliveryConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delCraftSupplierAutoOut(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/**
 * 客户
 */

const getCraftConfigList = async () => {
  let params = {
    code: "AUTO_OUT_CONFIG_01"
  }
  const res = await listTenantConfig(params);
  if (res && res.length > 0) {
    let c_params = {
      idList: res[0].values
    }
    let craftRes = await getCraftList(c_params);
    if (craftRes && craftRes.data.length > 0) {
      craftConfigList = craftRes.data.map(ccd => {
        return {
          id: ccd.id,
          craftName: ccd.craftName
        }
      });
      console.log("craftConfigList", craftConfigList)
    }
  }
}
const getSupplierList = async () => {
  const res = await listSupplierNoPage();
  supplierList.value = res;
}
const getAddressList = async () => {
  const ourAddressRes = await listOutSourceAddressList();
  addressList = ourAddressRes.data
}
const changeCraftSupplierList = async (value: string) => {
  console.log("changeCraftSupplierList Craft id ",value)
  const res = await listOutSourceSupplierListV2(value || -1);
  supplierList.value = res.data
}

onMounted(() => {
  getList();
  //getSupplierList();
  getAddressList();
  getCraftConfigList();
});
</script>

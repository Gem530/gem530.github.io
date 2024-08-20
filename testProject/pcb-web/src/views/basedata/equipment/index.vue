<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >
              新增设备
            </el-button>
          </el-col>
        </el-row>
      </template>

      <XTable :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="equipmentList"
              :columnList="columnList"
              ref="newVxeTableRef" border
              @searchChange="searchChange"
              :column-config="{ resizable: true }" @checkbox-all="checkboxChangeEvent"
              @checkbox-change="checkboxChangeEvent">
        <template #default-craftInfoList="scope">
          <div style="text-align:left;">
            <el-tag v-for="(item,index) in scope.row.craftInfoList"
                    :key="index"
                    style="margin-left:2px;margin-bottom:2px;">
              {{ item.craftName }}
            </el-tag>
          </div>
        </template>
        <template #default-sysUserList="scope">
          <div style="text-align:left;">
            <el-tag v-for="(item,index) in scope.row.sysUserList"
                    :key="index"
                    style="margin-left:2px;margin-bottom:2px;">
              {{ item.userName }}
            </el-tag>
          </div>
        </template>
        <template #default-delFlag="scope">
          <el-switch @change="changeFlag(scope.row)" v-model="scope.row.delFlag" active-value="0"
                     inactive-value="1"/>
        </template>
        <template #default-make="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       >修改
            </el-button>
          </el-tooltip>
        </template>
      </XTable>
    </el-card>
    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="dialog.title" :close-on-click-modal="false" :close-on-press-escape="false"
               v-model="dialog.visible" width="500px">
      <el-form ref="equipmentFormRef" :model="form" :rules="rules" label-width="80px">
        <div style="display: flex;">
          <el-form-item label="设备编码" prop="equipmentCode" clearable>
            <el-input v-model="form.equipmentCode" autocomplete="off" placeholder="请输入设备编码" clearable></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="equipmentName" clearable>
            <el-input v-model="form.equipmentName" autocomplete="off" placeholder="请输入设备名称" clearable></el-input>
          </el-form-item>
        </div>
        <el-form-item label="负责人">
          <el-select v-model="form.equipmentList" clearable :collapse-tags="true" filterable multiple
                     placeholder="请选择负责人">
            <el-option
              v-for="item in equipmentUserOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工艺">
          <el-select v-model="form.craftList" clearable :collapse-tags="true" filterable multiple
                     placeholder="请选择工艺">
            <el-option
              v-for="item in craftOptions"
              :key="item.id"
              :label="item.craftName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" rows="3" autocomplete="off" placeholder="请输入备注"
                    clearable></el-input>
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

<script setup name="Equipment" lang="ts">
  import {listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment} from "@/api/basedata/equipment";
  import {EquipmentVO, EquipmentQuery, EquipmentForm} from "@/api/basedata/equipment/types";
  import {UserVO} from "@/api/system/user/types";
  import {listUserByRoleKey} from "@/api/system/user";
  import {getCraftList} from "@/api/basedata/craft";
  import {CraftVO} from "@/api/basedata/craft/types";
  import {ref} from "vue";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const equipmentList = ref<EquipmentVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);

  const queryFormRef = ref<ElFormInstance>();
  const equipmentFormRef = ref<ElFormInstance>();
  const newVxeTableRef = ref();

  //负责人
  let equipmentUserOptions: UserVO[] = [];

  let craftOptions: CraftVO[] = [];

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  const initFormData: EquipmentForm = {
    id: undefined,
    equipmentCode: undefined,
    equipmentName: undefined,
    remark: undefined,
    delFlag: undefined
  };
  const data = reactive<PageData<EquipmentForm, EquipmentQuery>>({
    form: {...initFormData},
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      equipmentCode: undefined,
      equipmentName: undefined,
      params: {}
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      equipmentCode: [
        {required: true, message: "设备编码不能为空", trigger: "blur"}
      ],
      equipmentName: [
        {required: true, message: "设备名称不能为空", trigger: "blur"}
      ],
      equipmentManager: [
        {required: true, message: "设备负责人不能为空", trigger: "blur"}
      ]
    }
  });

  const {queryParams, form, rules} = toRefs(data);

  const columnList = ref([
    // {type: 'checkbox', width: '60', align: "center"},
    {
      width: '200',
      title: '设备编码',
      field: 'equipmentCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入设备编码'}
    },
    {
      width: '200',
      title: '设备名称',
      field: 'equipmentName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入设备名称'}
    },
    {
      width: '300',
      title: '工艺',
      field: 'craftInfoList',
      align: 'center',
    },
    {
      width: '200',
      title: '负责人',
      field: 'sysUserList',
      align: 'center',
    },
    {
      width: '200',
      title: '备注',
      field: 'remark',
      align: 'center',
    },
    {
      width: '200',
      title: '状态',
      field: 'delFlag',
      align: 'center',
    },
    {title: '操作', field: "make", align: 'center'},
  ]);

  // 获取 搜索条件
  const searchChange = (params: any) => {
    queryParams.value = params;
    getList();
  }

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const userResponse: any = await listUserByRoleKey("equipment");
    equipmentUserOptions = userResponse.data;
    getListCraft();
  };

  /**
   * 查询工艺列表
   */
  const getListCraft = async () => {
    const res = await getCraftList();
    craftOptions = res.data;
  };

  /** 查询设备列表 */
  const getList = async () => {
    loading.value = true;
    const res = await listEquipment(queryParams.value);
    equipmentList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  };

  /** 取消按钮 */
  const cancel = () => {
    reset();
    dialog.visible = false;
  };

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    equipmentFormRef.value?.resetFields();
  };

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  };

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    handleQuery();
  };

  /** 多选框选中数据 */
  const checkboxChangeEvent = () => {
    const $table = newVxeTableRef.value.xTableRef
    if ($table) {
      const selectRecords = $table.getCheckboxRecords() // 获取选择的行数据列表
      ids.value = selectRecords.map(item => item.id);
      single.value = selectRecords.length != 1;
      multiple.value = !selectRecords.length;
    }
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    dialog.visible = true;
    dialog.title = "添加设备";
  };

  /** 修改按钮操作 */
  const handleUpdate = async (row?: EquipmentVO) => {
    reset();
    const _id = row?.id || ids.value[0];
    const res = await getEquipment(_id);
    Object.assign(form.value, res.data);
    dialog.visible = true;
    dialog.title = "修改设备";
  };

  /** 提交按钮 */
  const submitForm = () => {
    equipmentFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        if (form.value.id) {
          await updateEquipment(form.value).finally(() => buttonLoading.value = false);
        } else {
          await addEquipment(form.value).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("修改成功");
        dialog.visible = false;
        await getList();
      }
    });
  };

  //状态switch
  const changeFlag = async (row?: EquipmentVO) => {
    const data: EquipmentForm = {};
    Object.assign(data, row);
    await updateEquipment(data).then(res => {
      buttonLoading.value = false;
      getList();
    });

  };

  /** 删除按钮操作 */
  const handleDelete = async (row?: EquipmentVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm("是否确认删除数据？").finally(() => loading.value = false);
    await delEquipment(_ids);
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
  };

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download("basedata/equipment/export", {
      ...queryParams.value
    }, `equipment_${new Date().getTime()}.xlsx`);
  };

  onMounted(() => {
    getDictOptions().then(res => {
      getList();
    });
  });
</script>

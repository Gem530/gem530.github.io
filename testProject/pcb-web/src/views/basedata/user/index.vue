<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="薪水" prop="salary">
            <el-input v-model="queryParams.salary" placeholder="请输入薪水" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="合同期限" prop="contractTimeLimit">
            <el-input v-model="queryParams.contractTimeLimit" placeholder="请输入合同期限" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="部门id" prop="deptId">
            <el-input v-model="queryParams.deptId" placeholder="请输入部门id" clearable @keyup.enter="handleQuery" />
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
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" v-if="true" />
        <el-table-column label="登录名" align="center" prop="loginName" />
        <el-table-column label="用户密码" align="center" prop="userPassword" />
        <el-table-column label="用户姓名" align="center" prop="userName" />
        <el-table-column label="性别 1男 2女" align="center" prop="sex" />
        <el-table-column label="入职时间" align="center" prop="entryTime" />
        <el-table-column label="婚姻状态(1未婚 2已婚)" align="center" prop="matrimony" />
        <el-table-column label="合同开始时间" align="center" prop="contractStartTime" />
        <el-table-column label="合同结束时间" align="center" prop="contractEndTime" />
        <el-table-column label="薪水" align="center" prop="salary" />
        <el-table-column label="合同期限" align="center" prop="contractTimeLimit" />
        <el-table-column label="身份证" align="center" prop="identityCard" />
        <el-table-column label="学历" align="center" prop="education" />
        <el-table-column label="家庭住址" align="center" prop="familyAddress" />
        <el-table-column label="联系电话" align="center" prop="phone" />
        <el-table-column label="紧急联系人" align="center" prop="emergencyContact" />
        <el-table-column label="紧急联系电话" align="center" prop="emergencyContacPhone" />
        <el-table-column label="开户银行" align="center" prop="depositBank" />
        <el-table-column label="银行账户" align="center" prop="bankAccount" />
        <el-table-column label="帐号状态" align="center" prop="status" />
        <el-table-column label="部门id" align="center" prop="deptId" />
        <el-table-column label="最后登陆IP" align="center" prop="loginIp" />
        <el-table-column label="最后登录时间" align="center" prop="loginDate" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="薪水" prop="salary">
          <el-input v-model="form.salary" placeholder="请输入薪水" />
        </el-form-item>
        <el-form-item label="合同期限" prop="contractTimeLimit">
          <el-input v-model="form.contractTimeLimit" placeholder="请输入合同期限" />
        </el-form-item>
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
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

<script setup name="User" lang="ts">
import { listUser, getUser, delUser, addUser, updateUser } from '@/api/basedata/user';
import { UserVO, UserQuery, UserForm } from '@/api/basedata/user/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userList = ref<UserVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserForm = {
  id: undefined,
  loginName: undefined,
  userPassword: undefined,
  userName: undefined,
  sex: undefined,
  entryTime: undefined,
  matrimony: undefined,
  contractStartTime: undefined,
  contractEndTime: undefined,
  salary: undefined,
  contractTimeLimit: undefined,
  identityCard: undefined,
  education: undefined,
  familyAddress: undefined,
  phone: undefined,
  emergencyContact: undefined,
  emergencyContacPhone: undefined,
  depositBank: undefined,
  bankAccount: undefined,
  status: undefined,
  deptId: undefined,
  loginIp: undefined,
  loginDate: undefined,
}
const data = reactive<PageData<UserForm, UserQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    loginName: undefined,
    userPassword: undefined,
    userName: undefined,
    sex: undefined,
    entryTime: undefined,
    matrimony: undefined,
    contractStartTime: undefined,
    contractEndTime: undefined,
    salary: undefined,
    contractTimeLimit: undefined,
    identityCard: undefined,
    education: undefined,
    familyAddress: undefined,
    phone: undefined,
    emergencyContact: undefined,
    emergencyContacPhone: undefined,
    depositBank: undefined,
    bankAccount: undefined,
    status: undefined,
    deptId: undefined,
    loginIp: undefined,
    loginDate: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    loginName: [
      { required: true, message: "登录名不能为空", trigger: "blur" }
    ],
    userPassword: [
      { required: true, message: "用户密码不能为空", trigger: "blur" }
    ],
    userName: [
      { required: true, message: "用户姓名不能为空", trigger: "blur" }
    ],
    sex: [
      { required: true, message: "性别 1男 2女不能为空", trigger: "change" }
    ],
    entryTime: [
      { required: true, message: "入职时间不能为空", trigger: "blur" }
    ],
    matrimony: [
      { required: true, message: "婚姻状态(1未婚 2已婚)不能为空", trigger: "blur" }
    ],
    contractStartTime: [
      { required: true, message: "合同开始时间不能为空", trigger: "blur" }
    ],
    contractEndTime: [
      { required: true, message: "合同结束时间不能为空", trigger: "blur" }
    ],
    salary: [
      { required: true, message: "薪水不能为空", trigger: "blur" }
    ],
    contractTimeLimit: [
      { required: true, message: "合同期限不能为空", trigger: "blur" }
    ],
    identityCard: [
      { required: true, message: "身份证不能为空", trigger: "blur" }
    ],
    education: [
      { required: true, message: "学历不能为空", trigger: "blur" }
    ],
    familyAddress: [
      { required: true, message: "家庭住址不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
    emergencyContact: [
      { required: true, message: "紧急联系人不能为空", trigger: "blur" }
    ],
    emergencyContacPhone: [
      { required: true, message: "紧急联系电话不能为空", trigger: "blur" }
    ],
    depositBank: [
      { required: true, message: "开户银行不能为空", trigger: "blur" }
    ],
    bankAccount: [
      { required: true, message: "银行账户不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "帐号状态不能为空", trigger: "change" }
    ],
    deptId: [
      { required: true, message: "部门id不能为空", trigger: "blur" }
    ],
    loginIp: [
      { required: true, message: "最后登陆IP不能为空", trigger: "blur" }
    ],
    loginDate: [
      { required: true, message: "最后登录时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUser(queryParams.value);
  userList.value = res.rows;
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
  userFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getUser(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户";
}

/** 提交按钮 */
const submitForm = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateUser(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUser(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delUser(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('basedata/user/export', {
    ...queryParams.value
  }, `user_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

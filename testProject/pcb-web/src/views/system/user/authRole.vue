<template>
  <div class="p-2">
    <div class="panel">
      <h4 class="panel-title">基本信息</h4>
      <el-form :model="form" label-width="60px" :inline="true">
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="姓名" prop="nickName">
              <el-input v-model="form.nickName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="登录账号" prop="userName">
              <el-input v-model="form.userName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="角色名称" prop="userName">
              <el-input v-model="form.roleName" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="权限字符" prop="userName">
              <el-input v-model="form.roleKey" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="Search" @click="searchHandle">搜索</el-button>
            <el-button icon="Refresh" @click="resetHandle">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="panel">
      <h4 class="panel-title">角色信息</h4>
      <div>
        <el-table
          v-loading="loading"
          :row-key="getRowKey"
          @row-click="clickRow"
          ref="tableRef"
          @selection-change="handleSelectionChange"
          :data="rolesShowList"
        >
          <el-table-column label="序号" width="55" type="index" align="center">
            <template #default="scope">
              <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
          <el-table-column label="角色编号" align="center" prop="roleId" />
          <el-table-column label="角色名称" align="center" prop="roleName" />
          <el-table-column label="权限字符" align="center" prop="roleKey" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />
        <div style="text-align: center;margin-left:-120px;margin-top:30px;">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm()">提交</el-button>
          <el-button :loading="buttonLoading" @click="close()">返回</el-button>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup name="AuthRole" lang="ts">
import { RoleVO } from "@/api/system/role/types";
import { getAuthRole, updateAuthRole } from "@/api/system/user";
import { UserForm } from "@/api/system/user/types";

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const buttonLoading = ref(false);
interface searchForm extends UserForm {
  roleName?: string;
  roleKey?: string;
}

const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const roleIds = ref<Array<string | number>>([]);
const roles = ref<RoleVO[]>([]);
const form = ref<Partial<searchForm>>({
  nickName: undefined,
  userName: "",
  userId: undefined,
  roleName: '',
  roleKey: '',
});
const searchForm = ref<any>({
  roleName: '',
  roleKey: '',
})

const tableRef = ref<ElTableInstance>();

const rolesShowList = computed(() => {
  let rolesList = roles.value
  let roleKey = searchForm.value.roleKey
  let roleName = searchForm.value.roleName
  rolesList = rolesList.filter((f) => {
    return (roleName ? f.roleName.toLocaleLowerCase().includes(roleName.toLocaleLowerCase()) : true)
  }).filter((f) => {
    return (roleKey ? f.roleKey.toLocaleLowerCase().includes(roleKey.toLocaleLowerCase()) : true)
  })
  total.value = rolesList.length
  console.log('roles.value', rolesList, total.value)
  return rolesList.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
})

// 搜索
const searchHandle = () => {
  searchForm.value.roleKey = form.value.roleKey
  searchForm.value.roleName = form.value.roleName
  console.log('searchForm', searchForm.value)
}
// 重置搜索
const resetHandle = () => {
  form.value.roleName = ''
  form.value.roleKey = ''
  searchHandle()
}

/** 单击选中行数据 */
const clickRow = (row: RoleVO) => {
  // ele的方法有问题，selected应该为可选参数
  tableRef.value?.toggleRowSelection(row, false);
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: RoleVO[]) => {
  roleIds.value = selection.map(item => item.roleId);
};
/** 保存选中的数据编号 */
const getRowKey = (row: RoleVO): string => {
  return String(row.roleId);
};
/** 关闭按钮 */
const close = () => {
  const obj = { path: "/system/user" };
  proxy?.$tab.closeOpenPage(obj);
};
/** 提交按钮 */
const submitForm = async () => {
  const userId = form.value.userId;
  const rIds = roleIds.value.join(",");
  // console.log('提交', rIds, userId)
  buttonLoading.value = true;
  await updateAuthRole({ userId: userId as string, roleIds: rIds }).finally(() => { buttonLoading.value = false; });
  proxy?.$modal.msgSuccess("授权成功");
  close();
};

const getList = async () => {
  const userId = route.params && route.params.userId;
  if (userId) {
    loading.value = true;
    const res = await getAuthRole(userId as string);
    Object.assign(form.value, res.data.user);
    Object.assign(roles.value, res.data.roles);
    total.value = roles.value.length;
    await nextTick(() => {
      roles.value.forEach(row => {
        if (row?.flag) {
          tableRef.value?.toggleRowSelection(row, true);
        }
      });
    });
    loading.value = false;
  }
};
onMounted(() => {
  getList();
});
</script>

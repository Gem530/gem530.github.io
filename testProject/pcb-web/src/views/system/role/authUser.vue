<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="queryParams.nickName" placeholder="请输入姓名" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <el-card shadow="never" class="xtable-card">
      <template #header>
        <div class="global-flex flex-between width-100">
          <div>{{route?.query?.name ? `当前选择角色：${route?.query?.name}` : ''}}</div>
          <el-row :gutter="10" class="global-flex flex-end">
            <el-col :span="1.5">
              <el-button type="primary" @click="openSelectUser" >添加用户</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button :disabled="multiple" @click="cancelAuthUserAll" >
                批量取消授权
              </el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
            </el-col> -->
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :search="true" :showRefresh="false"></right-toolbar>
          </el-row>
        </div>
      </template>
      <XTable
        border
        height="100%"
        :data="userList"
        :loading="loading"
        :showRefresh="true"
        ref="authRoleTableRef"
        class="xtable-content"
        :columnList="columnList"
        toolId="authUserTableSystem"
        :sort-config="{showIcon: true}"
        :row-config="{ keyField: 'userId' }"
        :checkbox-config="{ reserve: true }"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        @searchChange="getList"
        @checkbox-all="handleSelectionChange"
        @checkbox-change="handleSelectionChange">
          <template #default-isCompany="scope">
            <el-tag v-if="scope.row.isCompany == 1">单位节点</el-tag>
            <span v-else></span>
          </template>
          <template #default-deptName="{row}">
            <span>{{row.dept.deptName}}</span>
          </template>
          <template #default-status="scope">
            <!-- <el-switch v-model="scope.row.status" inactive-value="1" active-value="0" @change="() => changeStatus(scope.row)"></el-switch> -->
            {{sys_normal_disable.find((f) => f.value == scope.row.status)?.label}}
          </template>
          <!-- <template #default-createTime="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template> -->
          <template #default-make="scope">
              <el-button link type="primary" @click="cancelAuthUser(scope.row)" >取消授权</el-button>
          </template>
      </XTable>
      <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
    </el-card>
    <div style="text-align: center;margin: 10px 0;">
      <el-button style="width: 300px;" @click="handleClose">返回</el-button>
    </div>
  </div>
</template>

<script setup name="AuthUser" lang="ts">
import { allocatedUserList, authUserCancel, authUserCancelAll } from "@/api/system/role";
import { UserQuery } from "@/api/system/user/types";
import { UserVO } from "@/api/system/user/types";
import SelectUser from "./selectUser.vue";


const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict("sys_normal_disable"));

const userList = ref<UserVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const userIds = ref<Array<string | number>>([]);

const authRoleTableRef = ref()
const queryFormRef = ref<ElFormInstance>();
const selectRef = ref<InstanceType<typeof SelectUser>>();

const queryParams = reactive<UserQuery>({
  pageNum: 1,
  pageSize: 20,
  roleId: route.params.roleId as string,
  nickName: undefined,
  phonenumber: undefined,
});
const columnList = ref([
  { type: 'checkbox', fixed: "left", align: 'center', width: '50' },
  { title: "序号", type: 'seq', fixed: "left", field: 'index', align: 'center', width: '60' },
  { title: '手机号/用户名', field: 'phonenumber', width: '120', align: 'center' },
  { title: '姓名', field: 'nickName', width: '120', align: 'center' },
  { title: '部门', field: 'deptName', minWidth: '260', align: 'center' },
  { title: '状态', field: 'status', width: '120', align: 'center' },
  { title: '添加时间', field: 'createTime', width: '130', align: 'center', sortable: true },
  { title: '操作', field: 'make', minWidth: '220', align: 'center', fixed: 'right' },
])

/** 查询授权用户列表 */
const getList = async (params?: any) => {
  console.log(params)
  if (params && params?.pageNum) {
    if (params?.sorts?.length) {
      // params?.sorts.map(m => {
      //   queryParams[m.prop] = m.order
      // })
      queryParams.orderByColumn = params?.sorts[0].prop
      queryParams.isAsc = params?.sorts[0].order
    } else {
      queryParams.orderByColumn = undefined
      queryParams.isAsc = undefined
    }
  }
  loading.value = true;
  const res = await allocatedUserList(queryParams);
  userList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
// 返回按钮
const handleClose = () => {
  const obj = { path: "/system/role" };
  proxy?.$tab.closeOpenPage(obj);
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}
// 多选框选中数据
const handleSelectionChange = () => {
  // userIds.value = selection.map(item => item.userId);
  // multiple.value = !selection.length;
  const $table = authRoleTableRef.value.xTableRef
  if ($table) {
    const selection =$table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()) // 获取选择的行数据列表
    userIds.value = selection.map(item => item.userId);
    multiple.value = !selection.length;
  }
}
/** 打开授权用户表弹窗 */
const openSelectUser = () => {
  selectRef.value?.show();
}
/** 取消授权按钮操作 */
const cancelAuthUser = async (row: UserVO) => {
  await proxy?.$modal.confirm('是否取消授权？', {
    confirmButtonText: '确认取消',
    cancelButtonText: '我再想想'
  });
  proxy?.$modal.loading('加载中...');
  await authUserCancel({ userId: row.userId, roleId: queryParams.roleId }).finally(() => proxy?.$modal.closeLoading());
  await getList();
  proxy?.$modal.msgSuccess("取消授权成功");
}
/** 批量取消授权按钮操作 */
const cancelAuthUserAll = async () => {
  const roleId = queryParams.roleId;
  const uIds = userIds.value.join(",");
  await proxy?.$modal.confirm(`已选择 ${userIds.value?.length} 条，是否全部取消授权`, {
      confirmButtonText: '确认取消',
      cancelButtonText: '我再想想'
  });
  proxy?.$modal.loading('加载中...');
  await authUserCancelAll({ roleId: roleId, userIds: uIds }).finally(() => proxy?.$modal.closeLoading());
  await getList();
  proxy?.$modal.msgSuccess("取消授权成功");
}

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped></style>

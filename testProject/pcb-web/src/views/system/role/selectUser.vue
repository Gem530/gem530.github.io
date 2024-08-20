<template>
    <el-dialog title="选择用户" v-model="visible" width="1200px" top="5vh" destroy-on-close @close="close">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="queryParams.userName" placeholder=" " @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="queryParams.nickName" placeholder=" " @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="queryParams.phonenumber" placeholder=" " @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-row> -->
      <span class="primary-color">已选择{{userIds.length}}条</span>
      <XTable
        border
        height="260px"
        ref="tableRef"
        :data="userList"
        :showHead="false"
        :loading="loading"
        :showRefresh="true"
        :columnList="columnList"
        toolId="selectUserTableSystem"
        :row-config="{ keyField: 'userId' }"
        :checkbox-config="{ reserve: true }"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        @searchChange="getList"
        @checkbox-all="handleSelectionChange"
        @checkbox-change="handleSelectionChange">
        <template #default-status="scope">
          {{sys_normal_disable.find((f) => f.value == scope.row.status)?.label}}
        </template>
      </XTable>
        <!-- <el-table @row-click="clickRow" ref="tableRef" :data="userList" @selection-change="handleSelectionChange" height="260px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column label="姓名" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
          <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" /> -->
      <!-- </el-row> -->
      <template #footer>
        <div class="dialog-footer global-flex flex-center">
          <el-button style="width: 250px;" @click="close">取消</el-button>
          <el-button style="width: 250px;" type="primary" @click="handleSelectUser">确定添加</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup name="SelectUser" lang="ts">
import { authUserSelectAll, unallocatedUserList } from "@/api/system/role";
import { UserVO } from '@/api/system/user/types';
import { UserQuery } from '@/api/system/user/types';


const props = defineProps({
  roleId: {
    type: [Number, String]
  }
})

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const userList = ref<UserVO[]>([]);
const visible = ref(false);
const total = ref(0);
const userIds = ref<Array<string | number>>([]);

const queryParams = reactive<UserQuery>({
  pageNum: 1,
  pageSize: 20,
  roleId: undefined,
  userName: undefined,
  phonenumber: undefined
})

const tableRef = ref<ElTableInstance>();
const queryFormRef = ref<ElFormInstance>();

const columnList = ref([
  { type: 'checkbox', fixed: "left", align: 'center', width: '50' },
  { title: "序号", type: 'seq', fixed: "left", field: 'index', align: 'center', width: '60' },
  { title: '手机号', field: 'phonenumber', width: '120', align: 'center' },
  { title: '姓名', field: 'nickName', width: '120', align: 'center' },
  { title: '部门', field: 'deptName', minWidth: '260', align: 'center' },
  { title: '状态', field: 'status', width: '120', align: 'center' },
  { title: '创建时间', field: 'createTime', width: '130', align: 'center' },
])

const show = () => {
  queryParams.roleId = props.roleId;
  getList();
  visible.value = true;
}

const close = () => {
  visible.value = false;
  userIds.value = []
}

/**
 * 选择行
 */
const clickRow = (row: any) => {
  // ele的bug
  tableRef.value?.toggleRowSelection(row, false);
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: UserVO[]) => {
  // userIds.value = selection.map((item: UserVO) => item.userId);
  const $table = tableRef.value.xTableRef
  if ($table) {
    const selection =$table.getCheckboxReserveRecords().concat($table.getCheckboxRecords()) // 获取选择的行数据列表
    userIds.value = selection.map(item => item.userId);
    // multiple.value = !selection.length;
  }
}

/** 查询数据 */
const getList = async () => {
  const res = await unallocatedUserList(queryParams);
  userList.value = res.rows;
  total.value = res.total;
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  getList();
}

const emit = defineEmits(["ok"]);
/**选择授权用户操作 */
const handleSelectUser = async () => {
  const roleId = queryParams.roleId;
  const ids = userIds.value.join(',');
  if (ids == "") {
    proxy?.$modal.msgError('至少选择1条数据');
    return;
  }
  await authUserSelectAll({ roleId, userIds: ids });
  userIds.value = []
  proxy?.$modal.msgSuccess('分配成功');
  emit('ok');
  visible.value = false;
}
// 暴露
defineExpose({
  show,
});
</script>

<style scoped></style>

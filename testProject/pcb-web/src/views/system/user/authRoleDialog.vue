<template>
    <el-dialog ref="formDialogRef" :title="dialog.title" v-model="dialog.visible" width="800px"  @close="closeDialog">
        <div v-loading="buttonLoading">
        <el-form label-width="70px" :inline="true" :model="userInfo">
            <el-form-item label="姓名">
                <el-input v-if="userInfo.nickName" v-model="userInfo.nickName" disabled></el-input>
            </el-form-item>
            <el-form-item label="归属部门">
                <el-input v-model="userInfo.dept.deptName" disabled></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="8">
                <el-card class="card-height">
                    <el-input
                        v-model="nameStr"
                        prefix-icon="Search"
                        placeholder="搜索角色名称"
                        @input="searchHandle"
                    />
                    <div class="role-list">
                        <el-checkbox-group style="height: 100%;" v-model="chooseRoleList">
                        <el-auto-resizer>
                        <template #default="{ width, height }">
                            <el-table-v2
                            ref="tableRef"
                            :width="width"
                            :height="height"
                            :row-height="45"
                            :header-height="0"
                            :data="showRoleList"
                            v-if="roleList?.length"
                            :columns="[{title: 'Id', key: 'id', dataKey: 'id', width: width}]">
                            <template #cell="{ rowData: item }">
                                <!-- <template v-for="(item, index) in roleList" :key="item.roleId">
                                    <div v-if="((item?.roleName || '').toLocaleLowerCase()).includes(nameStr.toLocaleLowerCase())"> -->
                                    <el-checkbox :label="item">{{item.roleName}}</el-checkbox>
                                    <!-- </div>
                                </template> -->
                            </template>
                            </el-table-v2>
                        </template>
                        </el-auto-resizer>
                        </el-checkbox-group>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
                <el-card class="card-height card-body-auto" header="已选择角色">
                    <div class="body-height">
                        <el-tag v-for="tag in chooseRoleList" :key="tag.roleId" closable @close="delRole(tag)">
                            {{ tag.roleName }}
                        </el-tag>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="buttonLoading" @click="cancel()">取消</el-button>
                <el-button :loading="buttonLoading" type="primary" @click="submitForm">确认修改</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="AuthRoleDialog" lang="ts">
import { RoleVO } from "@/api/system/role/types";
import { getAuthRole, updateAuthRole } from "@/api/system/user";
import { UserForm } from "@/api/system/user/types";

const emits = defineEmits(['getList'])
const formDialogRef = ref()
const router = useRouter();
const { proxy } = getCurrentInstance()
const { sys_normal_disable, sys_user_sex } = toRefs<any>(proxy?.useDict('sys_normal_disable', 'sys_user_sex'));
const dialog = reactive({
    visible: false,
    title: '分配角色'
});

const userId = ref('')
const nameStr = ref('')
const userInfo = ref({
    nickName: '',
    dept: {
        deptName: ''
    }
})
const roleList = ref([])
const showRoleList = ref([])
const chooseRoleList = ref([])
const buttonLoading = ref(false)
// watch(() => roleList.value, (val) => {
//     showRoleList.value = JSON.parse(JSON.stringify(val || []))
// }, { deep: true, immediate: true })

const searchHandle = () => {
    showRoleList.value = roleList.value.filter((f) => ((f?.roleName || '').toLocaleLowerCase()).includes(nameStr.value.toLocaleLowerCase()))
}

/** 重置操作表单 */
const reset = () => {
    nameStr.value = ''
    roleList.value = []
    chooseRoleList.value = []
}
/** 取消按钮 */
const cancel = () => {
    dialog.visible = false;
    reset();
}
/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
    dialog.visible = false;
    reset();
}

// 打开弹框
const open = (row?: any) => {
    dialog.visible = true;
    userId.value = row?.userId || ''
    getList()
}

const getList = async () => {
  if (userId.value) {
    buttonLoading.value = true;
    getAuthRole(userId.value as string).then((res) => {
        console.log(res)
        if (res.code == 200) {
            userInfo.value = res.data?.user
            roleList.value = res.data?.roles || []
            chooseRoleList.value = roleList.value.filter((f) => f.flag)
            showRoleList.value = JSON.parse(JSON.stringify(roleList.value))
        }
    }).finally(() => {
        buttonLoading.value = false;
    })
    // Object.assign(form.value, res.data.user);
    // Object.assign(roles.value, res.data.roles);
    // total.value = roles.value.length;
    // await nextTick(() => {
    //   roles.value.forEach(row => {
    //     if (row?.flag) {
    //       tableRef.value?.toggleRowSelection(row, true);
    //     }
    //   });
    // });
  }
};

// 删除角色
const delRole = (tag) => {
    // delRole
    chooseRoleList.value = chooseRoleList.value.filter((f) => f.roleId != tag.roleId)
}

/** 提交按钮 */
const submitForm = async () => {
    const roleIds = chooseRoleList.value.map((m) => m.roleId)
    const rIds = roleIds?.length ? roleIds.join(",") : '';
    // console.log('提交', rIds, userId.value)
    buttonLoading.value = true;
    await updateAuthRole({ userId: userId.value as string, roleIds: rIds }).finally(() => { buttonLoading.value = false; });
    proxy?.$modal.msgSuccess("授权成功");
    closeDialog();
};

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.card-height) {
    height: 450px;
    &.card-body-auto {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .el-card__header {
            width: 100%;
        }
        .el-card__body {
            flex: 1;
            width: 100%;
            overflow: hidden;
            box-sizing: border-box;

            .body-height {
                height: 100%;
                overflow-y: auto;
            }
        }
    }
    .el-card__body {
        height: 100%;

        .el-tag {
            margin: 0 5px 5px 0;
        }
    }
}
.role-list {
    margin-top: 10px;
    height: calc(100% - 35px);
    overflow-y: auto;
}
</style>

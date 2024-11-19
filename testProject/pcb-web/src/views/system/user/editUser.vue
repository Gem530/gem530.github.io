<template>
    <!-- 添加或编辑用户信息配置对话框 -->
    <el-dialog ref="formDialogRef" :title="dialog.title" v-model="dialog.visible" width="600px" destroy-on-close @close="closeDialog">
      <el-form :model="form" :rules="rules" ref="userFormRef" label-width="80px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="手机号" :prop="dialog.title == '编辑用户信息' ? '' : 'phonenumber'" >
              <el-input v-model="form.phonenumber" :disabled="!!form.userId" placeholder="请输入手机号" maxlength="11" @blur="handleUserInfo"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="tip-color">&nbsp;&nbsp;登录系统/小程序的账号</el-col>
          <template v-if="form.userId == undefined">
            <el-col :span="16" >
                <el-form-item label="登录密码" prop="password">
                <el-input v-model="form.password"  placeholder="请输入登录密码" type="password" maxlength="50" show-password :disabled = "passwordDialog"/>
                </el-form-item>
            </el-col>
            <el-col :span="8" class="tip-color">&nbsp;&nbsp;登录系统/小程序的密码</el-col>
          </template>
          <el-col :span="16">
            <el-form-item label="姓名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入姓名" maxlength="50" />
            </el-form-item>
          </el-col>
          <!-- 管理员时，不显示 -->
          <el-col :span="16" v-if="!(dialog.title == '编辑用户信息' && form.userName == 'admin')">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select
                class="width-100"
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                @change="getDeptBydeptId(form.deptId)"
                placeholder="请选择归属部门"
                check-strictly
                :disabled="!!currentRow?.deptId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="16">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col> -->
          <el-col :span="16">
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio v-for="dict in sys_user_sex" :key="dict.value" :label="dict.value">{{
                  dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="16">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
                  dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == '1'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" v-if="!(dialog.title == '编辑用户信息' && form.userName.includes('admin'))">
            <el-form-item label="角色" prop="roleIds">
              <el-select class="width-100" v-model="form.roleIds" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == '1'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancel()">取消</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="submitForm">确认{{ dialog.title == '编辑用户信息' ? '修改' : '新增' }}</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup name="EditUser" lang="ts">
import api, {getAccount} from "@/api/system/user"
import {FlowTaskVo, UserForm, UserQuery, UserVO} from '@/api/system/user/types';
import { getDept } from '@/api/system/dept';
import { async } from 'fast-glob';
import { getRoleLists } from '@/api/system/role';
import { RoleForm, RoleQuery, RoleVO } from '@/api/system/role/types';
import { PostVO } from '@/api/system/post/types';
import { DeptVO } from '@/api/system/dept/types';
// import { treeselect } from "@/api/system/dept";
// import { DeptVO } from "@/api/system/dept/types";
// import { RoleVO } from "@/api/system/role/types";
// import { PostVO } from "@/api/system/post/types";
// import { to } from "await-to-js";
// import { globalHeaders } from "@/utils/request";
// import {VxeTableEvents} from "vxe-table";
// import {CommodityVO} from "@/api/order/commodity/types";
// import {updateMaterialOrder} from "@/api/purchase/materialHandle";

const emits = defineEmits(['getList'])
const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { sys_normal_disable, sys_user_sex } = toRefs<any>(proxy?.useDict('sys_normal_disable', 'sys_user_sex'));
// const props = withDefaults(defineProps<{
//     // title: ''
// }>(), {
// })

const currentRow = ref();
const deptTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();
const userFormRef = ref<ElFormInstance>();
const uploadRef = ref<ElUploadInstance>();
const formDialogRef = ref<ElDialogInstance>();

const initPassword = ref<String>('');
const deptOptions = ref<DeptVO[]>([]);
const roleOptions = ref<RoleVO[]>([]);
const postOptions = ref<PostVO[]>([]);
const buttonLoading = ref(false);
const passwordDialog = ref(false);
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: UserForm = {
  userId: undefined,
  deptId: undefined,
  userName: '',
  nickName: undefined,
  password: '',
  phonenumber: undefined,
  email: undefined,
  sex: undefined,
  status: "0",
  remark: '',
  postIds: [],
  roleIds: []
}
const data = reactive<any>({
  form: { ...initFormData },
  rules: {
    userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    deptId: [{ required: true, message: "归属部门不能为空", trigger: "change" }],
    nickName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    password: [{ required: true, message: "登录密码不能为空", trigger: "blur" }, { min: 6, max: 50, message: "登录密码长度必须介于 6 和 50 之间", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{ required: true, message: "手机号不能为空", trigger: "blur" }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
    roleIds: [{ required: true, message: "角色不能为空", trigger: "change" }],
  }
})

const initForm: RoleForm = {
  ownerId: '',
}

const roleData = reactive<PageData<RoleForm, RoleQuery>>({
  form: { ...initForm },
  queryParams: {
    // pageNum: 1,
    // pageSize: 200000,
    ownerId: '',
    roleName: '',
    roleKey: '',
    status: '',
  }
})
const { queryParams } = toRefs(roleData)

const { form, rules } = toRefs<PageData<UserForm, UserQuery>>(data)

/** 查询部门下拉树结构 */
const getTreeSelect = async () => {
  const res = await api.deptTreeSelect();
  deptOptions.value = res.data;
};

/** 初始化部门数据 */
const initTreeData = async () => {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    const { data } = await treeselect();
    deptOptions.value = data;
  }
}

/** 重置操作表单 */
const reset = () => {
  form.value = { ...initFormData };
  nextTick(() => {
    userFormRef.value?.resetFields();
  })
}
/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
  passwordDialog.value = false;
  reset();
}

//查询用户信息回填表单
const handleUserInfo = async () => {
  console.log("接收手机号码：", form.value.phonenumber);
  //根据手机号码查询账号信息
  if (form.value.phonenumber){
    const res = await getAccount(form.value.phonenumber)
    console.log("返回参数：", res);
    if (res && res.data){
      passwordDialog.value = true
      form.value.password = res.data.password
      form.value.nickName = res.data.accName
      form.value.email = res.data.email
      form.value.sex = res.data.sex
      form.value.accountId = res.data.accountId
    }
  }
}


const getDeptBydeptId = async (row) => {
  console.log("获取部门信息",row)
  const deptData = await getDept(row)
  if (deptData && deptData.data.isCompany == '1'){
    queryParams.value.ownerId = deptData.data.deptId
  }else {
    queryParams.value.ownerId = deptData.data.ownerId
  }
  const roleData = await getRoleLists(queryParams.value);
  console.log("获取部门信息",roleData)
  roleOptions.value = roleData.data
}

/** 新增按钮操作 */
const handleAdd = async (row) => {
  reset();
  if (row?.deptId) {
    form.value.deptId = row.deptId
    currentRow.value = row
  }
  const { data } = await api.getUser();
  dialog.visible = true;
  dialog.title = "新增用户信息";
  await initTreeData();
  postOptions.value = data.posts;
  // roleOptions.value = data.roles;
  form.value.password = initPassword.value.toString();
  await getTreeSelect()
  nextTick(() => {
    userFormRef.value?.clearValidate();
  })
}
/** 修改按钮操作 */
const handleUpdate = async (row?: UserForm) => {
  reset();
  const userId = row?.userId || ids.value[0]
  const { data } = await api.getUser(userId)
  dialog.visible = true;
  dialog.title = "编辑用户信息";
  await initTreeData();
  Object.assign(form.value, data.user);
  postOptions.value = data.posts;
  roleOptions.value = data.roles;
  form.value.postIds = data.postIds;
  form.value.roleIds = data.roleIds;
  form.value.userName = data.user.userName;
  if (data.user.phonenumber == "" || !data.user.phonenumber) {
    form.value.phonenumber = data.user.userName;
  }
  form.value.password = "";
  await getTreeSelect()
  nextTick(() => {
    userFormRef.value?.clearValidate();
  })
}

/** 提交按钮 */
const submitForm = () => {
  console.log(form.value);
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (passwordDialog.value == true){
        form.value.password = ''
      }
      let params = JSON.parse(JSON.stringify(form.value))
      params.userName = params.phonenumber
      params.userId ? await api.updateUser(params).finally(() => { buttonLoading.value = false; }) : await api.addUser(params).finally(() => { buttonLoading.value = false;form.value.password = '123456' });
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      passwordDialog.value = false;
    //   await getList();
    emits('getList')
    }
  })
}
/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
  dialog.visible = false;
  passwordDialog.value = false;
  resetForm();
}
/**
 * 重置表单
 */
const resetForm = () => {
  userFormRef.value?.resetFields();
  userFormRef.value?.clearValidate();

  form.value.id = undefined;
  form.value.status = '1';
}

onMounted(() => {
    proxy?.getConfigKey("sys.user.initPassword").then(response => {
        initPassword.value = response.data;
    });
})

defineExpose({ handleAdd, handleUpdate })
</script>

<style lang="scss" scoped>
.width-100 {
    width: 100%;
}
.tip-color {
    font-size: 12px;
    color: var(--el-color-primary);
    line-height: 22px;
}
</style>

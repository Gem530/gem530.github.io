<template>
  <div class="p-2 xtable-page">

    <el-row style="height: 100%;">
      <el-col :span="6" style="height: 100%;">
        <el-card shadow="hover" class="role-card no-padding">
          <template #header>
              <div class="global-flex flex-start">
                <el-input
                  v-model="queryParams.roleName"
                  prefix-icon="Search"
                  placeholder="搜索角色名称"
                  @change="getList(true)"
                  @keyup.enter="getList(true)"
                />
                <el-button style="margin-left: 10px;" type="primary" @click="handleAdd()">新增角色</el-button>
              </div>
          </template>

          <div class="role-list" v-loading="loading">
            <!-- <template v-for="(item, index) in roleList" :key="item.roleId">
              <div class="role-item global-flex flex-start pointer" :class="{'active': currentRole.roleId == item.roleId}" @click="choiceMenu(item)">
                <div class="role-item-name">
                  <div class="role-name-overflow">{{item.roleName}}</div>
                </div>
                <div class="role-item-sort">{{item.roleSort}}</div>
                <div class="role-item-make">
                  <el-tooltip :show-after="200" content="修改" placement="top">
                    <el-button link type="primary" icon="EditPen" @click.stop="handleUpdate(item)"></el-button>
                  </el-tooltip>
                  <el-tooltip :show-after="200" content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click.stop="handleDelete(item)"></el-button>
                  </el-tooltip>
                  <el-tooltip :show-after="200" content="数据权限" placement="top">
                  <el-button link type="primary" icon="CircleCheck" @click.stop="handleDataScope(item)"></el-button>
                  </el-tooltip>
                  <el-tooltip :show-after="200" content="分配用户" placement="top">
                  <el-button link type="primary" icon="User" @click.stop="handleAuthUser(item)"></el-button>
                  </el-tooltip>
                </div>
              </div>
            </template> -->
            <el-auto-resizer>
              <template #default="{ width, height }">
                <el-table-v2
                  ref="tableRef"
                  :width="width"
                  :height="height"
                  :data="roleList"
                  :row-height="45"
                  :header-height="0"
                  v-if="roleList?.length"
                  :columns="[{title: 'Id', key: 'id', dataKey: 'id', width: width}]">
                  <template #cell="{ rowData: item }">
                    <!-- {{ rowData }} -->
                    <div class="role-item global-flex flex-start pointer" :class="{'active': currentRole.roleId == item.roleId}" @click="choiceMenu(item)">
                      <div class="role-item-name">
                        <div class="role-name-overflow">{{item.roleName}}</div>
                      </div>
                      <div class="role-item-sort">{{item.roleSort}}</div>
                      <div class="role-item-make">
                        <el-tooltip :show-after="200" content="修改" placement="top">
                          <el-button link type="primary" icon="EditPen" @click.stop="handleUpdate(item)"></el-button>
                        </el-tooltip>
                        <el-tooltip :show-after="200" content="删除" placement="top">
                        <el-button link type="primary" icon="Delete" @click.stop="handleDelete(item)"></el-button>
                        </el-tooltip>
                        <el-tooltip :show-after="200" content="数据权限" placement="top">
                        <el-button link type="primary" icon="CircleCheck" @click.stop="handleDataScope(item)"></el-button>
                        </el-tooltip>
                        <el-tooltip :show-after="200" content="分配用户" placement="top">
                        <el-button link type="primary" icon="User" @click.stop="handleAuthUser(item)"></el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </el-table-v2>
              </template>
            </el-auto-resizer>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" style="height: 100%;padding-left: 10px;">
        <el-card class="role-card" v-loading="menuLoading">
          <el-tabs v-model="activeName" type="border-card" class="role-tabs">
            <el-tab-pane label="ERP菜单" :name="0">
              <MenuChoice ref="menuErpRef" v-model="currentRole.menuCheckStrictly" :list="menuOptions" :checks="checkRoleList" :menuIdList="menuIdList" @getChoiceList="(list) => getChoiceList(list, 'erp')"></MenuChoice>
            </el-tab-pane>
            <el-tab-pane label="小程序菜单" :name="1">
              <MenuChoice ref="menuXcxRef" v-model="currentRole.menuCheckStrictlyXcx" :list="menuOptionsXcx" :checks="checkRoleList" :menuIdList="menuIdList" @getChoiceList="(list) => getChoiceList(list, 'xcx')"></MenuChoice>
            </el-tab-pane>
          </el-tabs>
          <div class="global-flex flex-center width-100" style="margin-top: 10px;">
            <el-button type="primary" style="width: 300px;" @click="saveMenu">保存</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="40%" >
      <el-form ref="roleFormRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="排序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :precision="0" :min="0" style="width: 100%;"/>
        </el-form-item>
        <el-form-item prop="roleKey" v-if="['101','100'].includes(userStore.ownerId+'')">
          <template #label>
            <span>
              <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
         <!-- <el-row>
          <el-col :span="12">
         
        <el-form-item label="PC端菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="小程序端菜单权限">
          <el-checkbox v-model="menuExpandXcx" @change="handleCheckedTreeExpandXcx($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAllXcx" @change="handleCheckedTreeNodeAllXcx($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictlyXcx" @change="handleCheckedTreeConnectXcx($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptionsXcx"
            show-checkbox
            ref="menuRefXcx"
            node-key="id"
            :check-strictly="!form.menuCheckStrictlyXcx"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        </el-col>
          </el-row> -->
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"  maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" @click="cancel">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确认{{dialog.title == '编辑角色信息' ? '修改' : '新增'}}</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="dialog.title" v-model="openDataScope" width="500px" >
      <el-form :model="form" label-width="80px" ref="dataScopeRef">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符" v-if="['101','100'].includes(userStore.ownerId+'')">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange" class="width-100">
            <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope === '2'">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="deptRef"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitDataScope">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Role" lang="ts">
import { addRole, changeRoleStatus, dataScope, delRole, getRole, listRole, updateRole, deptTreeSelect } from "@/api/system/role";
import { roleMenuTreeselect, treeselect as menuTreeselect ,treeselectXcx as xcxMenuTreeselect} from '@/api/system/menu/index';
import { RoleVO, RoleForm, RoleQuery, DeptTreeOption } from '@/api/system/role/types';
import { MenuTreeOption, RoleMenuTree } from '@/api/system/menu/types';
import { useUserStore } from '@/store/modules/user';
import MenuChoice from './menuChoice'

const router = useRouter();
const userStore = useUserStore();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const buttonLoading = ref(false);
const roleList = ref<any>();
const loading = ref(true)
const showSearch = ref(true)
const ids = ref<Array<string | number>>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const dateRange = ref<[DateModelType, DateModelType]>(['', ''])
const menuOptions = ref<MenuTreeOption[]>([])
const menuOptionsXcx = ref<MenuTreeOption[]>([])
const menuExpand = ref(false)
const menuExpandXcx = ref(false)
const menuNodeAll = ref(false)
const menuNodeAllXcx = ref(false)
const deptExpand = ref(true)
const deptNodeAll = ref(false)
const deptOptions = ref<DeptTreeOption[]>([])
const openDataScope = ref(false)

const menuErpRef = ref()
const menuXcxRef = ref()

const activeName = ref(0)
const currentRole = ref({
  menuCheckStrictly: true,
  menuCheckStrictlyXcx: true,
})
const menuIdList = ref([])
const menuLoading = ref(true)
const checkRoleList = ref([])

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
])

const queryFormRef = ref<ElFormInstance>();
const roleFormRef = ref<ElFormInstance>();
const dataScopeRef = ref<ElFormInstance>();
const deptRef = ref<ElTreeInstance>();
const menuRef = ref<ElTreeInstance>();
const menuRefXcx = ref<ElTreeInstance>();

const initForm: RoleForm = {
  roleId: undefined,
  roleSort: 1,
  status: '0',
  roleName: '',
  roleKey: '',
  menuCheckStrictly: true,
  menuCheckStrictlyXcx: true,
  menuChecks: [],
  menuChecksXcx: [],
  deptCheckStrictly: true,
  remark: '',
  dataScope: '4',
  menuIds: [],
  deptIds: [],
}

const data = reactive<PageData<RoleForm, RoleQuery>>({
  form: { ...initForm },
  queryParams: {
    // pageNum: 1,
    // pageSize: 200000,
    roleName: '',
    roleKey: '',
    status: '',
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "排序不能为空", trigger: "blur" }]
  }
})
const { form, queryParams, rules } = toRefs(data)

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

/**
 * 查询角色列表
 */
const getList = (flag = false) => {
  loading.value = true
  listRole(proxy?.addDateRange(queryParams.value, dateRange.value)).then(res => {
    roleList.value = res.rows || []
    total.value = res.total
    loading.value = false
    if (flag && res.rows?.length) {
      choiceMenu(res.rows[0])
    }
  })
}

/**
 * 搜索按钮操作
 */
const handleQuery = () => {
  // queryParams.value.pageNum = 1;
  getList(true);
}

/** 重置 */
const resetQuery = () => {
  dateRange.value = ['', '']
  queryFormRef.value?.resetFields();
  handleQuery();
}
/**删除按钮操作 */
const handleDelete = async (row?: RoleVO) => {
  const roleids = ((row?.roleId || '')+'') || ids.value;
  let names=roleList.value?.filter((item) => roleids.includes(item.roleId)).map((item) => item.roleName).join(",");
  
  await proxy?.$modal.confirm('是否确认删除 "' + names + '" 角色？');
  proxy?.$modal.loading('加载中...');
  await delRole(roleids).finally(() => proxy?.$modal.closeLoading());
  getList(true);
  proxy?.$modal.msgSuccess('删除成功');
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("system/role/export", {
    ...queryParams.value,
  }, `role_${new Date().getTime()}.xlsx`)
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: RoleVO[]) => {
  ids.value = selection.map((item: RoleVO) => item.roleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 角色状态修改 */
const handleStatusChange = async (row: RoleVO) => {
  let text = row.status === "0" ? "启用" : "停用";
  try {
    await proxy?.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?');
    await changeRoleStatus(row.roleId, row.status);
    proxy?.$modal.msgSuccess(text + "成功");
  } catch {
    row.status = row.status === "0" ? "1" : "0";
  }
}

/** 分配用户 */
const handleAuthUser = (row: RoleVO) => {
  console.log(row);
  router.push(`/system/role-auth/user/${row.roleId}?name=${row.roleName}`);
}

/** 查询菜单树结构 */
const getMenuTreeselect = async () => {
  xcxMenuTreeselect().then((res) => {
    menuOptionsXcx.value = res.data;
  })
  const res = await menuTreeselect();
  menuOptions.value = res.data;
}
/** 所有部门节点数据 */
const getDeptAllCheckedKeys = (): any => {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value?.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value?.getHalfCheckedKeys();
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  }
  return checkedKeys
}
/** 重置新增的表单以及其他数据  */
const reset = () => {
  menuRef.value?.setCheckedKeys([]);
  menuRefXcx.value?.setCheckedKeys([]);
  menuExpand.value = false
  menuNodeAll.value = false
  menuExpandXcx.value = false
  menuNodeAllXcx.value = false
  deptExpand.value = true
  deptNodeAll.value = false
  form.value = { ...initForm };
  roleFormRef.value?.resetFields();

}

/** 新增角色信息 */
const handleAdd = () => {
  reset();
  getMenuTreeselect();
  dialog.visible = true;
  dialog.title = "新增角色信息";
}
/** 编辑角色信息 */
const handleUpdate = async (row?: RoleVO) => {
  reset();
  const roleId = row?.roleId || ids.value[0]
  const { data } = await getRole(roleId);
  Object.assign(form.value, data);
  // form.value.menuCheckStrictlyXcx = false;
  form.value.roleSort = Number(form.value.roleSort);
  const res = await getRoleMenuTreeselect(roleId);
  form.value.menuIds = res?.checkedKeys || []
  // console.log(res, form.value)
  dialog.title = "编辑角色信息";
  dialog.visible = true;
  // res.checkedKeys.forEach((v) => {
  //   nextTick(() => {
  //     menuRef.value?.setChecked(v, true, false);
  //     menuRefXcx.value?.setChecked(v, true, false);
  //   })
  // })
}
// 选择菜单
const choiceMenu = (item: any) => {
  currentRole.value = JSON.parse(JSON.stringify(item))
  showMenuByRole(currentRole.value.roleId)
}
// 展示菜单
const showMenuByRole = async (roleId: string|number) => {
  const res = await getRoleMenuTreeselect(roleId, 'detail');
  // res.checkedKeys.forEach((v) => {
  //   nextTick(() => {
  //     menuRef.value?.setChecked(v, true, false);
  //     menuRefXcx.value?.setChecked(v, true, false);
  //   })
  // })
}
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = (roleId: string | number, type: string = 'edit') => {
  type == 'detail' && (menuLoading.value = true)
  return roleMenuTreeselect(roleId).then((res): RoleMenuTree => {
    if (type == 'detail') {
      menuOptions.value = res.data.menus;
      menuOptionsXcx.value = res.data.menusXcx;
      menuIdList.value = res.data.menuIdList;
      checkRoleList.value = res.data.checkedKeys;
    }
    return res.data;
  }).finally(() => {
    type == 'detail' && (menuLoading.value = false)
  })
}
/** 根据角色ID查询部门树结构 */
const getRoleDeptTreeSelect = async (roleId: string | number) => {
  const res = await deptTreeSelect(roleId);
  deptOptions.value = res.data.depts;
  return res.data;
}
/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value: boolean, type: string) => {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (menuRef.value) {
        menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (deptRef.value) {
        deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  }
}
/** 树权限（展开/折叠）-小程序*/
const handleCheckedTreeExpandXcx = (value: boolean, type: string) => {
  if (type == "menu") {
    let treeList = menuOptionsXcx.value;
    for (let i = 0; i < treeList.length; i++) {
      if (menuRefXcx.value) {
        menuRefXcx.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (menuRefXcx.value) {
        menuRefXcx.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  }
}
/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: any, type: string) => {
  if (type == "menu") {
    menuRef.value?.setCheckedNodes(value ? menuOptions.value as any : []);
  } else if (type == "dept") {
    deptRef.value?.setCheckedNodes(value ? deptOptions.value as any : []);
  }
}
/** 树权限（全选/全不选）-小程序 */
const handleCheckedTreeNodeAllXcx = (value: any, type: string) => {
  if (type == "menu") {
    menuRefXcx.value?.setCheckedNodes(value ? menuOptionsXcx.value as any : []);
  } else if (type == "dept") {
    deptRef.value?.setCheckedNodes(value ? deptOptions.value as any : []);
  }
}
/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: any, type: string) => {
  if (type == "menu") {
    form.value.menuCheckStrictly = value;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value;
  }
}
/** 树权限（父子联动）小程序 */
const handleCheckedTreeConnectXcx = (value: any, type: string) => {
  if (type == "menu") {
    form.value.menuCheckStrictlyXcx = value;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value;
  }
}
/** 所有菜单节点数据 */
const getMenuAllCheckedKeys = (): any => {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value?.getCheckedKeys();
  let checkedKeysXcx = menuRefXcx.value?.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value?.getHalfCheckedKeys();
  let halfCheckedKeysXcx = menuRefXcx.value?.getHalfCheckedKeys();
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  }
  if (halfCheckedKeysXcx) {
    checkedKeysXcx?.unshift.apply(checkedKeysXcx, halfCheckedKeysXcx);
  }
  checkedKeys?.push.apply(checkedKeys, checkedKeysXcx);
  return checkedKeys;
}
/** 提交按钮 */
const submitForm = () => {
  roleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // form.value.menuIds = getMenuAllCheckedKeys()
      let params = JSON.parse(JSON.stringify(form.value))
      if (!params?.status) {
        params.status = '0' // 角色管理 状态页面上无法编辑，字段必填，所以默认写死
      }
      // console.log(params)
      // delete params.menuIds
      buttonLoading.value = true;
      const res = params.roleId ? await updateRole(params).finally(() => { buttonLoading.value = false; }) : await addRole(params).finally(() => { buttonLoading.value = false; });
      proxy?.$modal.msgSuccess("操作成功")
      dialog.visible = false
      getList()
      // console.log(res)
      if (dialog.title == '新增角色信息' && res.code == 200 && res.data) {
        let paramForm = JSON.parse(JSON.stringify(form.value))
        // paramForm
        paramForm.roleId = res.data
        console.log(paramForm)
        choiceMenu(paramForm)
      } else if (dialog.title == '编辑角色信息') {
        choiceMenu(form.value)
      }
    }
  })
}
/** 取消按钮 */
const cancel = () => {
  reset()
  dialog.visible = false;
}
/** 选择角色权限范围触发 */
const dataScopeSelectChange = (value: string) => {
  if (value !== "2") {
    deptRef.value?.setCheckedKeys([])
  }
}
/** 分配数据权限操作 */
const handleDataScope = async (row: RoleVO) => {
  const response = await getRole(row.roleId);
  Object.assign(form.value, response.data);
  const res = await getRoleDeptTreeSelect(row.roleId);
  openDataScope.value = true;
  dialog.title = "分配数据权限";
  await nextTick(() => {
    deptRef.value?.setCheckedKeys(res.checkedKeys);
  })
}
/** 提交按钮（数据权限） */
const submitDataScope = async () => {
  if (form.value.roleId) {
    form.value.deptIds = getDeptAllCheckedKeys();
    buttonLoading.value = true;
    await dataScope(form.value).finally(() => { buttonLoading.value = false; });
    proxy?.$modal.msgSuccess("修改成功");
    openDataScope.value = false;
    getList();
  }
}
/** 取消按钮（数据权限）*/
const cancelDataScope = () => {
  dataScopeRef.value?.resetFields();
  form.value = { ...initForm };
  openDataScope.value = false;
}

// 获取选中的最子级菜单id
const getChoiceList = (val: any[], type: string) => {
  if (type == 'erp') {
    // console.log(val, type)
    currentRole.value.menuChecks = val
  }
  if (type == 'xcx') {
    // console.log(val, type)
    currentRole.value.menuCheckXcx = val
  }
  // console.log('-----', form.value, val, type)
}

// 保存菜单
const saveMenu = async () => {
  // console.log(form.value, currentRole.value)
  let params = JSON.parse(JSON.stringify(currentRole.value))
  params.menuIds = Array.from(new Set([...(currentRole.value.menuChecks || []), ...(currentRole.value.menuCheckXcx || [])]))
  buttonLoading.value = true;
  await updateRole(params).finally(() => { buttonLoading.value = false; })
  proxy?.$modal.msgSuccess("操作成功")
  dialog.visible = false
  // getList()
  choiceMenu(currentRole.value)
}

onMounted(() => {
  getList(true);
});
</script>

<style lang="scss" scoped>
:deep(.role-card) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  // flex: 1;
  height: 100%;
  overflow: hidden;
  &.no-padding {
    .el-card__body {
      padding: 0px !important;
    }
  }

  &>div {
    width: 100%;
  }

  .el-card__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    // height: 100%;
    flex: 1;
    width: 100%;
    overflow: hidden;

    .role-list {
      // flex: 1;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 10px;

      .role-item {
        width: 100%;
        height: 100%;
        // padding: 5px;
        // margin-bottom: 5px;
        &:hover {
          background: rgba(242, 246, 252, 1);
        }
        &.active {
          background: rgba(242, 246, 252, 1);
        }
        
        .role-item-name {
          flex: 1;
          overflow: hidden;
          .role-name-overflow {
            width: 100%;
            // display: -webkit-box;
            // -webkit-line-clamp: 2;
            // -webkit-box-orient: vertical;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .role-item-sort {
          flex: none;
          min-width: 30px;
          text-align: center;
        }
        .role-item-make {
          flex: none;
          width: 100px;
          .el-button {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
:deep(.el-table-v2) {
  .el-table-v2__row {
    padding: 0;
    border-bottom: none;
    .el-table-v2__row-cell {
      padding: 0;
    }
  }
}
:deep(.role-tabs) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  // height: 100%;
  flex: 1;
  overflow: hidden;
  &>div {
    width: 100%;
  }

  .el-tab-pane,
  .el-tabs__content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    // height: 100%;
    flex: 1;
    width: 100%;
    overflow: hidden;
    // overflow-y: auto !important;
  }
}
</style>
